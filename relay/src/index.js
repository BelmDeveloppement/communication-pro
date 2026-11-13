// © 2026 SAS BELM DEVELOPPEMENT. Relais des JEUX : une « salle » par code de partie.
// L'enseignant (role=host) et les joueurs (role=client&sid=...) s'y connectent par WebSocket.
// Le relais ne stocke rien : il transmet les messages (joueur -> enseignant, enseignant -> joueur).
import { DurableObject } from "cloudflare:workers";

const ORIGINES = ["https://belmdeveloppement.github.io", "http://localhost:8765", "http://127.0.0.1:8765", "http://localhost:8787"];
const MAX = 65536;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname !== "/ws") return new Response("Relais des JEUX : en service.", { status: 200 });
    const origin = req.headers.get("Origin");
    if (origin && !ORIGINES.includes(origin)) return new Response("Origine refusée", { status: 403 });
    if (req.headers.get("Upgrade") !== "websocket") return new Response("WebSocket attendu", { status: 426 });
    const room = (url.searchParams.get("room") || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
    const role = url.searchParams.get("role") === "host" ? "host" : "client";
    const sid = (url.searchParams.get("sid") || "").replace(/[^\w-]/g, "").slice(0, 40);
    if (!room || (role === "client" && !sid)) return new Response("Paramètres manquants", { status: 400 });
    const stub = env.ROOM.get(env.ROOM.idFromName(room));
    return stub.fetch(new Request("https://room/ws?role=" + role + "&sid=" + sid, req));
  },
};

export class Room extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("ping", "pong"));
  }
  hosts() { return this.ctx.getWebSockets("h"); }
  tell(list, up) { const m = JSON.stringify({ __ctl: "host", up }); list.forEach((w) => { try { w.send(m); } catch (e) {} }); }
  async fetch(req) {
    const url = new URL(req.url);
    const role = url.searchParams.get("role"), sid = url.searchParams.get("sid");
    const pair = new WebSocketPair();
    const [cli, srv] = Object.values(pair);
    if (role === "host") {
      this.hosts().forEach((w) => { try { w.close(4001, "remplacé"); } catch (e) {} });
      this.ctx.acceptWebSocket(srv, ["h"]);
      srv.serializeAttachment({ role });
      this.tell(this.ctx.getWebSockets().filter((w) => w.deserializeAttachment()?.role === "client"), true);
    } else {
      this.ctx.getWebSockets("c:" + sid).forEach((w) => { try { w.close(4001, "remplacé"); } catch (e) {} });
      this.ctx.acceptWebSocket(srv, ["c:" + sid]);
      srv.serializeAttachment({ role, sid });
      this.tell([srv], this.hosts().length > 0);
    }
    return new Response(null, { status: 101, webSocket: cli });
  }
  webSocketMessage(ws, msg) {
    if (typeof msg !== "string" || msg.length > MAX) return;
    const a = ws.deserializeAttachment() || {};
    if (a.role === "client") { this.hosts().forEach((h) => { try { h.send(msg); } catch (e) {} }); return; }
    let o; try { o = JSON.parse(msg); } catch (e) { return; }
    if (!o || typeof o.to !== "string") return;
    const m = JSON.stringify(o.m);
    this.ctx.getWebSockets("c:" + o.to).forEach((c) => { try { c.send(m); } catch (e) {} });
  }
  webSocketClose(ws) {
    try { ws.close(); } catch (e) {}
    const a = ws.deserializeAttachment() || {};
    if (a.role === "host" && this.hosts().filter((w) => w !== ws).length === 0) this.tell(this.ctx.getWebSockets().filter((w) => w.deserializeAttachment()?.role === "client"), false);
  }
  webSocketError(ws) { this.webSocketClose(ws); }
}
