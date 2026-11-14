// © 2026 SAS BELM DEVELOPPEMENT. Bus publication / abonnement d'une séance (application LAN Live).
// Messages client -> serveur : {a:"sub", t, since} · {a:"pub", t, m, u}.  Serveur -> client : {a:"msg", t, id, m} · {a:"ack", u, n}.
// Le serveur garde un court historique par sujet pour les abonnés tardifs (rechargement de la tour, joueur qui arrive en retard).
// Sujet « …h » (état de la partie) : seul l'état le plus récent est conservé. Autres sujets : 1500 messages au plus. Tout est effacé 24 h après la dernière activité.
import { DurableObject } from "cloudflare:workers";
const MAX = 65536, KEEP = 1500, TOTAL = 900000, TTL = 24 * 3600 * 1000;
export class Hub extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("ping", "pong"));
  }
  async fetch(req) {
    if (req.headers.get("Upgrade") !== "websocket") return new Response("WebSocket attendu", { status: 426 });
    const pair = new WebSocketPair();
    const [cli, srv] = Object.values(pair);
    this.ctx.acceptWebSocket(srv);
    srv.serializeAttachment({ subs: [] });
    await this.ctx.storage.setAlarm(Date.now() + TTL);
    return new Response(null, { status: 101, webSocket: cli });
  }
  async load(t) { return (await this.ctx.storage.get("t:" + t)) || { seq: 0, list: [] }; }
  async webSocketMessage(ws, raw) {
    if (typeof raw !== "string" || raw.length > MAX) return;
    let o; try { o = JSON.parse(raw); } catch (e) { return; }
    if (!o || typeof o.t !== "string" || !/^[\w-]{1,60}$/.test(o.t)) return;
    const a = ws.deserializeAttachment() || { subs: [] };
    if (o.a === "sub") {
      if (!a.subs.includes(o.t)) { a.subs.push(o.t); ws.serializeAttachment(a); }
      const st = await this.load(o.t), since = Number.isFinite(+o.since) ? +o.since : 0;
      for (const x of st.list) if (x.id > since) { try { ws.send(JSON.stringify({ a: "msg", t: o.t, id: x.id, m: x.m })); } catch (e) {} }
      return;
    }
    if (o.a !== "pub" || typeof o.m !== "string") return;
    const st = await this.load(o.t);
    st.seq++;
    const item = { id: st.seq, m: o.m };
    if (o.t.endsWith("h")) {                       // état de la partie : on ne garde que la dernière version
      let p = null; try { p = JSON.parse(o.m); } catch (e) {}
      if (p && p.v != null) {
        st.list = st.list.filter((x) => { try { const q = JSON.parse(x.m); return q.v >= p.v && !(q.v === p.v && q.i === p.i); } catch (e) { return false; } });
      }
    }
    st.list.push(item);
    while (st.list.length > KEEP || st.list.reduce((s, x) => s + x.m.length, 0) > TOTAL) st.list.shift();
    await this.ctx.storage.put("t:" + o.t, st);
    await this.ctx.storage.setAlarm(Date.now() + TTL);
    let n = 0;
    for (const w of this.ctx.getWebSockets()) {
      const s = w.deserializeAttachment() || { subs: [] };
      if (s.subs.includes(o.t)) { n++; try { w.send(JSON.stringify({ a: "msg", t: o.t, id: item.id, m: item.m })); } catch (e) {} }
    }
    if (o.u) { try { ws.send(JSON.stringify({ a: "ack", u: o.u, n: n - (a.subs.includes(o.t) ? 1 : 0) })); } catch (e) {} }
  }
  webSocketClose(ws) { try { ws.close(); } catch (e) {} }
  webSocketError(ws) { this.webSocketClose(ws); }
  async alarm() { await this.ctx.storage.deleteAll(); }
}
