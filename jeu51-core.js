/* © 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. Créé avec l'aide de Claude (Anthropic), relu par l'auteur.
   Logique « tables et joueurs » du plateau « 5 · La route de l'état de l'art » (jeu 5.1 d'abord). Pur, sans DOM, testable sous Node.
   Le navigateur de l'enseignant fait autorité : les joueurs envoient leurs actions, il note et renvoie l'état. */
(function (root) {
  "use strict";
  var PE = root.PEngine || (typeof require !== "undefined" ? require("./plateau-engine.js") : null);
  var D = root.PLATEAU_DATA || null;
  function setData(d) { D = d; }
  var COLORS = ["#3B6FD8", "#2E9E6B", "#D6479B", "#E4572E", "#E9A400"];
  var COLNAMES = ["bleu", "vert", "rose", "rouge", "orange"];
  var MAXP = 5, MAXT = 5, OFFLINE_MS = 25000, CARD_MAX_MS = 6 * 60000, STUCK_MS = 3 * 60000;

  function newGame(cfg) {
    cfg = cfg || {};
    return { v: 1, extra: false, code: (cfg.code || "ROUTE").toUpperCase(), jeux: cfg.jeux || ["5.1"], min: cfg.min || 30, status: "lobby", start: 0, end: 0, tables: {}, players: {}, log: [] };
  }
  function tid(n) { var k = parseInt(String(n).replace(/\D/g, ""), 10); return k >= 1 && k <= MAXT ? "T" + k : null; }
  function tableOf(G, t) { return G.tables[t] || (G.tables[t] = { id: t, players: [], round: 0, seen: {}, cur: null, last: null }); }
  function online(p, now) { return p.sim || (now - p.last) < OFFLINE_MS; }

  function join(G, o, now) {
    var t = tid(o.table); if (!t) return { ok: false, err: "Table inconnue : choisissez une table de 1 à " + MAXT + "." };
    var nom = String(o.nom || "").trim().slice(0, 18); if (!nom) return { ok: false, err: "Saisissez votre prénom." };
    var T = tableOf(G, t), p = G.players[o.sid];
    if (p && p.table === t) { p.last = now; return { ok: true, player: p }; }
    var same = T.players.map(function (s) { return G.players[s]; }).filter(function (q) { return q.nom.toLowerCase() === nom.toLowerCase(); })[0];
    if (same) { same.last = now; return { ok: true, player: same, rebound: true }; }
    if (T.players.length >= MAXP) return { ok: false, err: "La table " + t + " est complète (" + MAXP + " joueurs)." };
    var used = T.players.map(function (s) { return G.players[s].ci; }), ci = 0; while (used.indexOf(ci) >= 0) ci++;
    p = { sid: o.sid, nom: nom, table: t, ci: ci, col: COLORS[ci], pos: 0, score: 0, done: false, last: now, joined: now, res: [], sim: !!o.sim };
    G.players[p.sid] = p; T.players.push(p.sid); return { ok: true, player: p };
  }
  function start(G, now) { if (G.status === "play") return; G.status = "play"; G.start = now; G.end = now + G.min * 60000; }
  function stop(G, now) { G.end = now; if (G.status === "play") G.status = "ended"; }
  function running(G, now) { return G.status === "play" && now < G.end; }
  function tireur(G, T, now) {
    var ps = T.players.map(function (s) { return G.players[s]; }).filter(function (p) { return !p.done; }); if (!ps.length) return null;
    return ps[T.round % ps.length];
  }
  function canDraw(G, sid, now) {
    var p = G.players[sid]; if (!p || p.done) return false; var T = G.tables[p.table];
    if (!running(G, now) || T.cur) return false;
    var tr = tireur(G, T, now); return !!tr && (tr.sid === sid || !online(tr, now));
  }
  function nextGameCase(pos) {
    for (var n = pos + 1; n < D.cases.length; n++) if (D.cases[n].type === "jeu") return D.cases[n];
    for (var m = Math.min(pos, 30); m > 0; m--) if (D.cases[m].type === "jeu") return D.cases[m];
    return null;
  }
  function roundJeu(G, T) {
    if (G.jeux.length === 1) return G.jeux[0];
    var ps = T.players.map(function (s) { return G.players[s]; }), mn = Math.min.apply(null, ps.map(function (p) { return p.pos; })), c = nextGameCase(mn);
    return c && G.jeux.indexOf(c.jeu) >= 0 ? c.jeu : G.jeux[0];
  }
  /* Cartes jouables d'un jeu : les cartes « supplémentaires » ne sont tirées que si l'enseignant les a débloquées. */
  function pool(G, jeu) { var j = D.jeux[jeu]; return { cartes: j.cartes.filter(function (c) { return !c.extra || G.extra; }) }; }
  function counts(G, jeu) { var cs = D.jeux[jeu].cartes; return { base: cs.filter(function (c) { return !c.extra; }).length, extra: cs.filter(function (c) { return c.extra; }).length }; }
  function setExtra(G, on) { G.extra = !!on; }
  /* Jeu suivant (dir = 1) ou précédent (dir = -1) : les positions et les points sont conservés ; la question ouverte se termine normalement. */
  function setJeu(G, k) { if (D.jeux[k]) G.jeux = [k]; return G.jeux[0]; }
  function nextJeu(G, dir) { var ks = Object.keys(D.jeux), i = ks.indexOf(G.jeux[0]), n = Math.max(0, Math.min(ks.length - 1, (i < 0 ? 0 : i) + (dir || 1))); G.jeux = [ks[n]]; return ks[n]; }
  function draw(G, sid, now) {
    if (!canDraw(G, sid, now)) return false;
    var T = G.tables[G.players[sid].table], jeu = roundJeu(G, T), j = pool(G, jeu);
    var r = PE.pickCard(j, T.seen[jeu] || [], G.code + T.id + T.round);
    if (r.reset) T.seen[jeu] = [];
    T.cur = { jeu: jeu, id: r.card.id, at: now, ans: {}, by: sid };
    return true;
  }
  function cardOf(jeu, id) { return D.jeux[jeu].cartes.filter(function (c) { return c.id === id; })[0]; }
  function expected(G, T, now) { return T.players.map(function (s) { return G.players[s]; }).filter(function (p) { return !p.done && (online(p, now) || T.cur.ans[p.sid]); }); }
  function answer(G, sid, ans, now) {
    var p = G.players[sid]; if (!p || p.done) return false; var T = G.tables[p.table];
    if (!T.cur || T.cur.ans[sid]) return false;
    T.cur.ans[sid] = { ans: ans, at: now }; p.last = now;
    var ex = expected(G, T, now); if (ex.every(function (q) { return T.cur.ans[q.sid]; })) closeRound(G, T.id, now);
    return true;
  }
  function closeRound(G, t, now) {
    var T = G.tables[t]; if (!T || !T.cur) return false;
    var cur = T.cur, card = cardOf(cur.jeu, cur.id), res = {}, rd = T.round;
    T.players.forEach(function (s) {
      var p = G.players[s]; if (p.done) return;
      var a = cur.ans[s], r = a ? PE.score(card, a.ans) : { pts: 0, detail: card.t === "texte" ? card.checks.map(function (c) { return { ok: false, lab: c.lab }; }) : [] };
      var from = p.pos, np = PE.advance(from, r.pts, 3, D.caps), ev = PE.landing(D.cases, D.events, np, 3, D.caps), fin = np, evo = null;
      if (ev) { fin = ev.rejoue ? Math.min(31, np + 1) : ev.pos; evo = { titre: ev.ev.titre, txt: ev.rejoue ? "Joker : avancez d'une case." : ev.ev.txt }; }
      p.pos = fin; p.score += r.pts; if (fin >= 31) p.done = true;
      var ms = a ? a.at - cur.at : null;
      res[s] = { pts: r.pts, detail: r.detail, from: from, to: np, final: fin, ev: evo, answered: !!a, ms: ms };
      p.res.push({ n: rd, jeu: cur.jeu, id: cur.id, pts: r.pts, ms: ms, answered: !!a, detail: r.detail.map(function (d) { return { ok: !!d.ok, lab: d.lab }; }) });
    });
    (T.seen[cur.jeu] = T.seen[cur.jeu] || []).push(cur.id);
    T.last = { round: rd, jeu: cur.jeu, id: cur.id, res: res, at: now }; T.cur = null; T.round++;
    return true;
  }
  function tick(G, now) {
    if (G.status === "play" && now >= G.end) G.status = "ended";
    Object.keys(G.tables).forEach(function (t) { var T = G.tables[t]; if (T.cur && now - T.cur.at > CARD_MAX_MS) closeRound(G, t, now); });
  }
  /* État de pastille d'un joueur : attend / encours / validee / juste / partielle / ratee / fini */
  function pastille(G, p, now) {
    var T = G.tables[p.table]; if (p.done) return "fini";
    if (T.cur) return T.cur.ans[p.sid] ? "validee" : "encours";
    if (T.last && T.last.res[p.sid]) { var q = T.last.res[p.sid].pts; return q >= 3 ? "juste" : q >= 1 ? "partielle" : "ratee"; }
    return "attend";
  }
  function crit(lab) {
    var l = String(lab).toLowerCase();
    if (l.indexOf("site") >= 0 || l.indexOf("limité à") === 0) return "site:";
    if (l.indexOf("filetype") >= 0) return "filetype:";
    if (l.indexOf("guillemets") >= 0) return "guillemets";
    if (l.indexOf(" or ") >= 0 || l.indexOf("avec or") >= 0) return "OR";
    if (l.indexOf("after:") >= 0) return "after:";
    if (l.indexOf("tiret") >= 0) return "- (exclusion)";
    return "contenu";
  }
  function stats(G, now) {
    var S = { tables: [], players: [], crit: {}, cards: {}, dist: [0, 0, 0, 0], err: {}, alerts: [], resp: [], answered: 0, expected: 0 };
    Object.keys(G.tables).sort().forEach(function (t) {
      var T = G.tables[t], ps = T.players.map(function (s) { return G.players[s]; }), sum = ps.reduce(function (a, p) { return a + p.pos; }, 0), pts = ps.reduce(function (a, p) { return a + p.score; }, 0);
      var last = T.cur ? T.cur.at : (T.last ? T.last.at : G.start), stuck = false;
      if (G.status === "play" && T.cur && now - T.cur.at > STUCK_MS) { stuck = true; S.alerts.push({ k: "stuck", t: t, txt: "Table " + t + " : question ouverte depuis plus de " + Math.round((now - T.cur.at) / 60000) + " min." }); }
      if (G.status === "play" && !T.cur && T.last && now - T.last.at > STUCK_MS && ps.some(function (p) { return !p.done; })) S.alerts.push({ k: "idle", t: t, txt: "Table " + t + " : aucune carte tirée depuis " + Math.round((now - T.last.at) / 60000) + " min." });
      S.tables.push({ id: t, n: ps.length, sum: sum, pts: pts, avg: ps.length ? sum / ps.length : 0, stuck: stuck, round: T.round, cur: !!T.cur, answered: T.cur ? Object.keys(T.cur.ans).length : 0 });
    });
    Object.keys(G.players).forEach(function (s) {
      var p = G.players[s], rs = p.res, n = rs.length, ok = rs.filter(function (r) { return r.pts >= 3; }).length, ms = rs.filter(function (r) { return r.ms != null; }).map(function (r) { return r.ms; });
      var on = online(p, now);
      if (!on && G.status === "play" && !p.done) S.alerts.push({ k: "off", t: p.table, txt: p.nom + " (" + p.table + ") est hors ligne." });
      S.players.push({ sid: s, nom: p.nom, table: p.table, col: p.col, pos: p.pos, score: p.score, n: n, ok: ok, rate: n ? p.score / (3 * n) : 0, ms: ms.length ? ms.reduce(function (a, b) { return a + b; }, 0) / ms.length : null, online: on, st: pastille(G, p, now), done: p.done });
      rs.forEach(function (r) {
        S.dist[r.pts]++; S.expected++; if (r.answered) S.answered++; if (r.ms != null) S.resp.push(r.ms);
        var k = r.jeu + "·" + r.id, c = S.cards[k] = S.cards[k] || { jeu: r.jeu, id: r.id, n: 0, pts: 0, ms: 0, nms: 0 }; c.n++; c.pts += r.pts; if (r.ms != null) { c.ms += r.ms; c.nms++; }
        r.detail.forEach(function (d) { var ck = crit(d.lab), x = S.crit[ck] = S.crit[ck] || { n: 0, ok: 0 }; x.n++; if (d.ok) x.ok++; else S.err[d.lab] = (S.err[d.lab] || 0) + 1; });
      });
    });
    return S;
  }
  /* Instantané envoyé à un joueur */
  function snapshot(G, sid, now) {
    var p = G.players[sid]; if (!p) return null; var T = G.tables[p.table], tr = tireur(G, T, now);
    return { t: "snap", now: now, code: G.code, status: G.status, end: G.end, min: G.min, jeux: G.jeux,
      me: { sid: sid, nom: p.nom, table: p.table, col: p.col, ci: p.ci, pos: p.pos, score: p.score, done: p.done },
      canDraw: canDraw(G, sid, now), tireur: tr ? tr.nom : null,
      table: { id: T.id, round: T.round,
        players: T.players.map(function (s) { var q = G.players[s]; return { sid: s, nom: q.nom, col: q.col, pos: q.pos, score: q.score, st: pastille(G, q, now), on: online(q, now) }; }),
        cur: T.cur ? { jeu: T.cur.jeu, id: T.cur.id, at: T.cur.at, answered: Object.keys(T.cur.ans), mine: !!T.cur.ans[sid] } : null,
        last: T.last ? { round: T.last.round, jeu: T.last.jeu, id: T.last.id, res: T.last.res } : null } };
  }
  var api = { setData: setData, COLORS: COLORS, COLNAMES: COLNAMES, MAXP: MAXP, MAXT: MAXT, newGame: newGame, tid: tid, join: join, start: start, stop: stop, running: running, canDraw: canDraw, draw: draw, pool: pool, counts: counts, setExtra: setExtra, nextJeu: nextJeu, setJeu: setJeu, answer: answer, closeRound: closeRound, tick: tick, pastille: pastille, stats: stats, snapshot: snapshot, crit: crit, cardOf: cardOf, online: online, tireur: tireur };
  if (typeof module !== "undefined") module.exports = api; else root.J51Core = api;
})(typeof window !== "undefined" ? window : this);
