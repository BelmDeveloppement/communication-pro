/* © 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. Créé avec l'aide de Claude (Anthropic), relu par l'auteur.
   Logique « tables et joueurs » du plateau « 5 · La route de l'état de l'art » (16 jeux, 62 cases, niveaux 1 et 2).
   Pur, sans DOM, testable sous Node. Le navigateur de l'enseignant fait autorité : les joueurs envoient leurs actions, il note et renvoie l'état.
   Règles : 0 point = recul d'une case ; 1 à 3 points = avance d'autant ; pari (+1 / −1) ; cases Aléa, Outil, Piège, Duel, Relecture ;
   case 31 = fin du niveau 1 (barrière tant que l'enseignant n'a pas ouvert le niveau 2) ; case 62 = Examen (arrivée). */
(function (root) {
  "use strict";
  var PE = root.PEngine || (typeof require !== "undefined" ? require("./plateau-engine.js") : null);
  var D = root.PLATEAU_DATA || null;
  function setData(d) { D = d; }
  var COLORS = ["#3B6FD8", "#2E9E6B", "#D6479B", "#E4572E", "#E9A400"];
  var COLNAMES = ["bleu", "vert", "rose", "rouge", "orange"];
  var MAXP = 5, MAXT = 5, OFFLINE_MS = 25000, CARD_MAX_MS = 6 * 60000, STUCK_MS = 3 * 60000, PEND_MS = 150000, DUEL_WAIT_MS = 45000, DUEL_PLAY_MS = 90000;

  function newGame(cfg) {
    cfg = cfg || {};
    return { v: 3, gid: Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36), extra: false, n2: false, help: {}, broken: {}, off: {}, nudge: {}, code: (cfg.code || "ROUTE").toUpperCase(), jeux: cfg.jeux || ["5.1"], min: cfg.min || 30, status: "lobby", start: 0, end: 0, tables: {}, players: {}, log: [] };
  }
  function tid(n) { var k = parseInt(String(n).replace(/\D/g, ""), 10); return k >= 1 && k <= MAXT ? "T" + k : null; }
  function tableOf(G, t) { return G.tables[t] || (G.tables[t] = { id: t, players: [], round: 0, seen: {}, cur: null, last: null }); }
  function online(p, now) { return p.sim || (now - p.last) < OFFLINE_MS; }
  function lim(G) { return G.n2 ? D.caps.max : D.caps.gate; }
  function say(G, p, txt, now) {
    p.notes = p.notes || []; p.notes.unshift({ txt: txt, at: now }); p.notes = p.notes.slice(0, 5);
    G.log.unshift({ t: p.table, n: p.nom, txt: txt, at: now }); G.log = G.log.slice(0, 40);
  }

  function join(G, o, now) {
    var t = tid(o.table); if (!t) return { ok: false, err: "Table inconnue : choisissez une table de 1 à " + MAXT + "." };
    var nom = String(o.nom || "").trim().slice(0, 18); if (!nom) return { ok: false, err: "Saisissez votre prénom." };
    var T = tableOf(G, t), p = G.players[o.sid];
    if (p && p.table === t) { p.last = now; return { ok: true, player: p }; }
    var same = T.players.map(function (s) { return G.players[s]; }).filter(function (q) { return q.nom.toLowerCase() === nom.toLowerCase(); })[0];
    if (same) { same.last = now; return { ok: true, player: same, rebound: true }; }
    if (T.players.length >= MAXP) return { ok: false, err: "La table " + t + " est complète (" + MAXP + " joueurs)." };
    var used = T.players.map(function (s) { return G.players[s].ci; }), ci = 0; while (used.indexOf(ci) >= 0) ci++;
    p = { sid: o.sid, nom: nom, table: t, ci: ci, col: COLORS[ci], pos: 0, score: 0, done: false, last: now, joined: now, res: [], sim: !!o.sim, tools: {}, bets: 0, betsWon: 0, duelW: 0, duelL: 0, revN: 0, revOk: 0, trapN: 0, trapOk: 0, pend: null, notes: [], read: { common: false, jeux: {} } };
    G.players[p.sid] = p; T.players.push(p.sid); return { ok: true, player: p };
  }
  function start(G, now) { if (G.status === "play") return; G.status = "play"; G.start = now; G.end = now + G.min * 60000; }
  function stop(G, now) { G.end = now; if (G.status === "play") G.status = "ended"; }
  function running(G, now) { return G.status === "play" && now < G.end; }
  function tireur(G, T, now) {
    var ps = T.players.map(function (s) { return G.players[s]; }).filter(function (p) { return !p.done; }); if (!ps.length) return null;
    return ps[T.round % ps.length];
  }
  /* Lecture obligatoire : document commun (une fois) + fiche du jeu courant (quand on y arrive) */
  function hasRead(G, p) { if (p.sim) return true; return !!(p.read && p.read.common) && !!(p.read.jeux && p.read.jeux[G.jeux[0]]); }
  function readState(G, p) { if (p.sim) return "ok"; if (!p.read || !p.read.common) return "common"; if (!p.read.jeux[G.jeux[0]]) return "fiche"; return "ok"; }
  function readyTable(G, T, now) {
    return T.players.every(function (s) { var p = G.players[s]; return p.done || !online(p, now) || hasRead(G, p); });
  }
  function actRead(G, sid, doc, now) {
    var p = G.players[sid]; if (!p) return false; p.read = p.read || { common: false, jeux: {} };
    if (doc === "common") p.read.common = true; else if (doc === "jeu") p.read.jeux[G.jeux[0]] = true; else return false;
    p.last = now; return true;
  }
  function resetRead(G, jeu) { Object.keys(G.players).forEach(function (s) { var p = G.players[s]; if (p.read && p.read.jeux) delete p.read.jeux[jeu]; }); }
  function actHelp(G, sid, tool, lvl, now) {
    var p = G.players[sid]; if (!p || !D.outils.some(function (o) { return o.id === tool; })) return false;
    var h = G.help[tool] = G.help[tool] || { n: 0, lv: [0, 0, 0], by: {} }; h.n++; h.lv[Math.max(0, Math.min(2, lvl | 0))]++; h.by[sid] = 1; return true;
  }
  function setTool(G, tool, off) { if (off) G.off[tool] = true; else { delete G.off[tool]; delete G.broken[tool]; } }
  function toolOff(G, id) { return !!G.off[id]; }
  function canDraw(G, sid, now) {
    var p = G.players[sid]; if (!p || p.done) return false; var T = G.tables[p.table];
    if (!running(G, now) || T.cur) return false;
    var tr = tireur(G, T, now); if (!tr) return false;
    if (!readyTable(G, T, now)) return false;
    return tr.sid === sid ? !p.pend : (!online(tr, now) || !!tr.pend) && !p.pend;
  }
  function pool(G, jeu) { var j = D.jeux[jeu]; return { cartes: j.cartes.filter(function (c) { return !c.extra || G.extra; }) }; }
  function counts(G, jeu) { var cs = D.jeux[jeu].cartes; return { base: cs.filter(function (c) { return !c.extra; }).length, extra: cs.filter(function (c) { return c.extra; }).length }; }
  function setExtra(G, on) { G.extra = !!on; }
  function setN2(G, on) { G.n2 = !!on; }
  function setJeu(G, k) { if (D.jeux[k]) { G.jeux = [k]; resetRead(G, k); } return G.jeux[0]; }
  function nextJeu(G, dir) { var ks = Object.keys(D.jeux), i = ks.indexOf(G.jeux[0]), n = Math.max(0, Math.min(ks.length - 1, (i < 0 ? 0 : i) + (dir || 1))); G.jeux = [ks[n]]; resetRead(G, ks[n]); return ks[n]; }
  function cardOf(jeu, id) { var src = jeu === "P" ? D.pieges : D.jeux[jeu]; return src.cartes.filter(function (c) { return c.id === id; })[0]; }
  function draw(G, sid, now) {
    if (!canDraw(G, sid, now)) return false;
    var T = G.tables[G.players[sid].table], jeu = G.jeux[0], j = pool(G, jeu);
    var r = PE.pickCard(j, T.seen[jeu] || [], G.code + T.id + T.round);
    if (r.reset) T.seen[jeu] = [];
    T.cur = { jeu: jeu, id: r.card.id, at: now, ans: {}, by: sid };
    return true;
  }
  function expected(G, T, now) { return T.players.map(function (s) { return G.players[s]; }).filter(function (p) { return !p.done && (online(p, now) || T.cur.ans[p.sid]); }); }
  function answer(G, sid, ans, now, bet) {
    var p = G.players[sid]; if (!p || p.done) return false; var T = G.tables[p.table];
    if (!T.cur || T.cur.ans[sid]) return false;
    T.cur.ans[sid] = { ans: ans, at: now, bet: !!bet }; p.last = now;
    var ex = expected(G, T, now); if (ex.every(function (q) { return T.cur.ans[q.sid]; })) closeRound(G, T.id, now);
    return true;
  }

  /* ---------- texte lisible d'une réponse (pour la relecture par les pairs) ---------- */
  function ansText(card, ans) {
    if (card.t === "choix") return ans >= 0 && card.opts[ans] != null ? card.opts[ans] : "(pas de réponse)";
    if (card.t === "multi") { var a = (ans || []).map(function (i) { return card.opts[i]; }).filter(Boolean); return a.length ? a.join(" ; ") : "(rien coché)"; }
    if (card.t === "assoc") return card.items.map(function (it, i) { return it.txt + " → " + (ans && ans[i] >= 0 ? card.labels[ans[i]] : "?"); }).join(" ; ");
    if (card.t === "trous") return card.slots.map(function (s, i) { return s.lab + " : " + (ans && ans[i] >= 0 ? s.opts[ans[i]] : "?"); }).join(" ; ");
    if (card.t === "oral") return (ans || []).map(function (v, i) { return (v ? "✓ " : "✗ ") + card.grille[i]; }).join(" ; ");
    return String(ans || "(pas de réponse)");
  }
  function critOf(card, i, d) {
    if (card.t === "texte") return crit(d.lab);
    if (card.t === "assoc") return card.labels[card.items[i].ok];
    if (card.t === "trous") return card.slots[i].lab;
    if (card.t === "oral") return String(d.lab).slice(0, 30);
    if (card.t === "multi") return d.lab.indexOf("À cocher") === 0 ? "cases à cocher" : "cases à laisser vides";
    return "réponse unique";
  }
  /* ---------- cartes individuelles (Piège, Duel) ---------- */
  function soloCard(G, jeu, seed) {
    var pl = D.jeux[jeu].cartes.filter(function (c) { return !c.extra && ["choix", "multi", "trous", "assoc"].indexOf(c.t) >= 0; });
    if (!pl.length) { var ps = D.pieges.cartes; return { jeu: "P", id: PE.shuffle(ps.map(function (c) { return c.id; }), seed)[0] }; }
    return { jeu: jeu, id: PE.shuffle(pl.map(function (c) { return c.id; }), seed)[0] };
  }
  function toolFor(jeu) { return D.outils.filter(function (o) { return o.jeu === jeu; })[0] || D.outils[0]; }
  function move(G, p, delta) { var from = p.pos; p.pos = PE.advance(p.pos, delta, lim(G)); if (p.pos >= D.caps.max) p.done = true; return p.pos - from; }

  function closeRound(G, t, now) {
    var T = G.tables[t]; if (!T || !T.cur) return false;
    var cur = T.cur, card = cardOf(cur.jeu, cur.id), res = {}, rd = T.round;
    T.players.forEach(function (s) {
      var p = G.players[s]; if (p.done) return;
      var a = cur.ans[s], r = PE.score(card, a ? a.ans : null), mv = PE.move(r.pts), bet = a && a.bet ? PE.betDelta(r.pts) : 0;
      var from = p.pos, np = PE.advance(from, mv + bet, lim(G)), fin = np, eff = null, cs = D.cases[np];
      if (a && a.bet) { p.bets++; if (bet > 0) p.betsWon++; }
      if (np !== from && cs) {
        if ((cs.type === "outil" || cs.type === "piege" || cs.type === "duel") && p.pend) { eff = { k: "busy", of: cs.type }; }
        else if (cs.type === "aleas") {
          var ev = D.events[PE.shuffle(D.events.map(function (e, i) { return i; }), G.code + p.sid + rd)[0]];
          fin = PE.advance(np, ev.move, lim(G)); eff = { k: "aleas", titre: ev.titre, txt: ev.txt, move: ev.move }; say(G, p, "Aléa « " + ev.titre + " » (" + (ev.move > 0 ? "+" : "") + ev.move + ")", now);
        } else if (cs.type === "outil") {
          var to = toolFor(cur.jeu);
          if (G.off[to.id]) { fin = PE.advance(np, 1, lim(G)); eff = { k: "outil", tool: to.id, off: true }; say(G, p, "Outil « " + to.nom + " » désactivé : +1 case sans tâche", now); }
          else { p.pend = { k: "outil", at: now, tool: to.id }; eff = { k: "outil", tool: to.id }; }
        } else if (cs.type === "piege") {
          var pc = D.pieges.cartes; p.pend = { k: "piege", at: now, card: { jeu: "P", id: PE.shuffle(pc.map(function (c) { return c.id; }), G.code + p.sid + rd + "p")[0] } }; eff = { k: "piege" };
        } else if (cs.type === "duel") {
          p.pend = { k: "duel", at: now, st: "wait", opp: null, card: null, ans: null }; eff = { k: "duel" }; matchDuels(G, p, cur.jeu, now);
        } else if (cs.type === "pairs") {
          var rv = T.players.map(function (x) { return G.players[x]; }).filter(function (q) { return q.sid !== p.sid && !q.done && !q.pend && online(q, now); });
          if (rv.length) { var q = rv[(rd + p.ci) % rv.length]; q.pend = { k: "rel", at: now, au: p.nom, aus: p.sid, jeu: cur.jeu, id: cur.id, ans: ansText(card, a ? a.ans : null), pts: r.pts }; eff = { k: "pairs", par: q.nom }; }
          else eff = { k: "pairs", par: null };
        } else if (cs.type === "gate") eff = { k: "gate", open: !!G.n2 };
      }
      p.pos = fin; p.score += r.pts; if (fin >= D.caps.max) p.done = true;
      var ms = a ? a.at - cur.at : null;
      var det = r.detail.map(function (d, i) { return { ok: !!d.ok, lab: d.lab, c: critOf(card, i, d) }; });
      res[s] = { pts: r.pts, mv: mv, bet: { on: !!(a && a.bet), d: bet }, detail: r.detail, from: from, to: np, final: fin, ev: eff, answered: !!a, ms: ms };
      p.res.push({ n: rd, jeu: cur.jeu, id: cur.id, pts: r.pts, ms: ms, answered: !!a, detail: det });
    });
    (T.seen[cur.jeu] = T.seen[cur.jeu] || []).push(cur.id);
    T.last = { round: rd, jeu: cur.jeu, id: cur.id, res: res, at: now }; T.cur = null; T.round++;
    return true;
  }

  /* ---------- duels (entre tables) ---------- */
  function matchDuels(G, p, jeu, now) {
    var w = Object.keys(G.players).map(function (s) { return G.players[s]; }).filter(function (q) { return q.sid !== p.sid && q.pend && q.pend.k === "duel" && q.pend.st === "wait" && q.table !== p.table; })[0];
    if (!w) return false;
    var c = soloCard(G, jeu, G.code + p.sid + w.sid + now);
    p.pend.st = "play"; p.pend.opp = w.sid; p.pend.card = c; p.pend.at = now; w.pend.st = "play"; w.pend.opp = p.sid; w.pend.card = c; w.pend.at = now;
    return true;
  }
  function pendAns(p) { return p.pend && p.pend.ans ? p.pend.ans : null; }
  function resolveDuel(G, p, now) {
    if (!p.pend || p.pend.k !== "duel") return;
    var q = p.pend.opp ? G.players[p.pend.opp] : null, card = cardOf(p.pend.card.jeu, p.pend.card.id), sp = pendAns(p), sq = q && q.pend && q.pend.k === "duel" ? pendAns(q) : null;
    var pp = sp ? PE.score(card, sp.ans).pts : -1, pq = sq ? PE.score(card, sq.ans).pts : -1;
    if (p.pend.st === "solo") {
      if (pp >= 2) { move(G, p, 1); say(G, p, "Duel contre la tour gagné : +1 case", now); p.duelW++; } else say(G, p, "Duel contre la tour : pas de gain", now);
      p.pend = null; return;
    }
    var win = null;
    if (pp > pq) win = p; else if (pq > pp) win = q; else if (pp >= 0 && sp && sq) win = sp.at <= sq.at ? p : q;
    if (win && (win === p ? pp : pq) <= 0) win = null;
    if (!win) { say(G, p, "Duel : égalité, rien ne bouge", now); if (q) say(G, q, "Duel : égalité, rien ne bouge", now); }
    else {
      var lo = win === p ? q : p; move(G, win, 1); move(G, lo, -1); win.duelW++; lo.duelL++;
      say(G, win, "Duel gagné contre " + lo.nom + " (" + lo.table + ") : +1 case", now); say(G, lo, "Duel perdu contre " + win.nom + " (" + win.table + ") : −1 case", now);
    }
    p.pend = null; if (q && q.pend && q.pend.k === "duel") q.pend = null;
  }

  /* ---------- actions individuelles du joueur ---------- */
  function actOutil(G, sid, ok, now) {
    var p = G.players[sid]; if (!p || !p.pend || p.pend.k !== "outil") return false;
    var to = D.outils.filter(function (o) { return o.id === p.pend.tool; })[0];
    if (ok) { p.tools[to.id] = now; var d = move(G, p, 1); say(G, p, "Outil « " + to.nom + " » utilisé : +1 case, jeton posé sur l'atelier", now); }
    else say(G, p, "Outil « " + to.nom + " » : tour passé", now);
    p.pend = null; return true;
  }
  function actBroken(G, sid, now) {
    var p = G.players[sid]; if (!p || !p.pend || p.pend.k !== "outil") return false;
    var id = p.pend.tool, to = D.outils.filter(function (o) { return o.id === id; })[0], b = G.broken[id] = G.broken[id] || {}; b[sid] = now;
    say(G, p, "Outil « " + to.nom + " » inaccessible : tour passé sans pénalité", now); p.pend = null; return true;
  }
  function actPiege(G, sid, ans, now) {
    var p = G.players[sid]; if (!p || !p.pend || p.pend.k !== "piege") return false;
    var c = cardOf("P", p.pend.card.id), r = PE.score(c, ans); p.trapN++;
    if (r.pts >= 2) { p.trapOk++; say(G, p, "Piège évité", now); } else { move(G, p, -1); say(G, p, "Piège : −1 case", now); }
    p.pend = null; return { pts: r.pts };
  }
  function actDuel(G, sid, ans, now) {
    var p = G.players[sid]; if (!p || !p.pend || p.pend.k !== "duel" || p.pend.st === "wait" || p.pend.ans) return false;
    p.pend.ans = { ans: ans, at: now };
    var q = p.pend.opp ? G.players[p.pend.opp] : null;
    if (p.pend.st === "solo" || (q && q.pend && q.pend.k === "duel" && q.pend.ans)) resolveDuel(G, p, now);
    return true;
  }
  function actRel(G, sid, verdict, now) {
    var p = G.players[sid]; if (!p || !p.pend || p.pend.k !== "rel") return false;
    var pend = p.pend, errFound = verdict === "err" && pend.pts < 3, right = (verdict === "err") === (pend.pts < 3); p.revN++;
    if (right) { p.score += 1; p.revOk++; }
    if (errFound) { move(G, p, 1); say(G, p, "Relecture : erreur de " + pend.au + " trouvée, +1 case", now); }
    else say(G, p, right ? "Relecture de " + pend.au + " : bien lu (+1 point)" : "Relecture de " + pend.au + " : verdict inexact", now);
    p.pend = null; return { right: right, pts: pend.pts };
  }
  function act(G, sid, m, now) {
    if (m.t === "draw") return draw(G, sid, now);
    if (m.t === "ans") return answer(G, sid, m.ans, now, m.bet);
    if (m.t === "outil") return actOutil(G, sid, !!m.ok, now);
    if (m.t === "read") return actRead(G, sid, m.doc, now);
    if (m.t === "help") return actHelp(G, sid, m.tool, m.lvl, now);
    if (m.t === "broke") return actBroken(G, sid, now);
    if (m.t === "pans") return !!actPiege(G, sid, m.ans, now);
    if (m.t === "dans") return actDuel(G, sid, m.ans, now);
    if (m.t === "rev") return !!actRel(G, sid, m.verdict, now);
    return false;
  }
  function tick(G, now) {
    if (G.status === "play" && now >= G.end) G.status = "ended";
    Object.keys(G.tables).forEach(function (t) { var T = G.tables[t]; if (T.cur && now - T.cur.at > CARD_MAX_MS) closeRound(G, t, now); });
    Object.keys(G.players).forEach(function (s) {
      var p = G.players[s], pd = p.pend; if (!pd) return;
      if (pd.k === "duel") {
        if (pd.st === "wait" && now - pd.at > DUEL_WAIT_MS) { pd.st = "solo"; pd.card = soloCard(G, G.jeux[0], G.code + p.sid + now); pd.at = now; }
        else if (pd.st === "wait") matchDuels(G, p, G.jeux[0], now);
        else if (pd.st !== "wait" && now - pd.at > DUEL_PLAY_MS) resolveDuel(G, p, now);
      } else if (now - pd.at > PEND_MS) { say(G, p, "Délai dépassé : l'effet de la case est annulé", now); p.pend = null; }
    });
  }
  /* État de pastille d'un joueur : attend / encours / validee / juste / partielle / ratee / effet / fini */
  function pastille(G, p, now) {
    var T = G.tables[p.table]; if (p.done) return "fini"; if (p.pend) return "effet";
    if (T.cur) return T.cur.ans[p.sid] ? "validee" : "encours";
    if (T.last && T.last.res[p.sid]) { var q = T.last.res[p.sid].pts; return q >= 3 ? "juste" : q >= 1 ? "partielle" : "ratee"; }
    return "attend";
  }
  function crit(lab) {
    var l = String(lab).toLowerCase();
    if (l.indexOf("site") >= 0 || l.indexOf("limité à") === 0) return "site:";
    if (l.indexOf("filetype") >= 0) return "filetype:";
    if (l.indexOf("intitle") >= 0 || l.indexOf("inurl") >= 0) return "intitle: / inurl:";
    if (l.indexOf("guillemets") >= 0 || l.indexOf("joker") >= 0) return "guillemets";
    if (l.indexOf(" or ") >= 0 || l.indexOf("avec or") >= 0) return "OR";
    if (l.indexOf("after:") >= 0 || l.indexOf("before:") >= 0 || l.indexOf("borne") >= 0) return "after: / before:";
    if (l.indexOf("tiret") >= 0 || l.indexOf("exclu") >= 0) return "- (exclusion)";
    return "contenu";
  }
  function stats(G, now) {
    var S = { tables: [], players: [], crit: {}, cards: {}, dist: [0, 0, 0, 0], err: {}, alerts: [], resp: [], answered: 0, expected: 0, tools: {}, toolHelp: {}, toolBroken: {}, toolOff: {}, bets: 0, betsWon: 0, duels: 0, revs: 0, revOk: 0, traps: 0, trapOk: 0 };
    D.outils.forEach(function (o) { S.tools[o.id] = []; var h = G.help[o.id], b = G.broken[o.id] || {}; S.toolHelp[o.id] = h ? h.n : 0; S.toolBroken[o.id] = Object.keys(b).length; S.toolOff[o.id] = !!G.off[o.id];
      if (S.toolBroken[o.id] >= 2 && !G.off[o.id]) S.alerts.push({ k: "tool", tool: o.id, txt: "Outil « " + o.nom + " » signalé inaccessible par " + S.toolBroken[o.id] + " joueurs : le désactiver ?" }); });
    Object.keys(G.tables).sort().forEach(function (t) {
      var T = G.tables[t], ps = T.players.map(function (s) { return G.players[s]; }), sum = ps.reduce(function (a, p) { return a + p.pos; }, 0), pts = ps.reduce(function (a, p) { return a + p.score; }, 0);
      var stuck = false;
      if (G.status === "play" && T.cur && now - T.cur.at > STUCK_MS) { stuck = true; S.alerts.push({ k: "stuck", t: t, txt: "Table " + t + " : question ouverte depuis plus de " + Math.round((now - T.cur.at) / 60000) + " min." }); }
      if (G.status === "play" && !T.cur && T.last && now - T.last.at > STUCK_MS && ps.some(function (p) { return !p.done; })) S.alerts.push({ k: "idle", t: t, txt: "Table " + t + " : aucune carte tirée depuis " + Math.round((now - T.last.at) / 60000) + " min." });
      S.tables.push({ id: t, n: ps.length, sum: sum, pts: pts, avg: ps.length ? sum / ps.length : 0, stuck: stuck, round: T.round, cur: !!T.cur, answered: T.cur ? Object.keys(T.cur.ans).length : 0 });
    });
    Object.keys(G.players).forEach(function (s) {
      var p = G.players[s], rs = p.res, n = rs.length, ok = rs.filter(function (r) { return r.pts >= 3; }).length, ms = rs.filter(function (r) { return r.ms != null; }).map(function (r) { return r.ms; });
      var on = online(p, now);
      if (!on && G.status === "play" && !p.done) S.alerts.push({ k: "off", t: p.table, txt: p.nom + " (" + p.table + ") est hors ligne." });
      if (p.pend && now - p.pend.at > 90000 && p.pend.k !== "duel") S.alerts.push({ k: "pend", t: p.table, txt: p.nom + " (" + p.table + ") n'a pas encore réglé l'effet de sa case (" + p.pend.k + ")." });
      Object.keys(p.tools || {}).forEach(function (id) { if (S.tools[id]) S.tools[id].push({ nom: p.nom, col: p.col }); });
      S.bets += p.bets; S.betsWon += p.betsWon; S.duels += p.duelW + p.duelL; S.revs += p.revN; S.revOk += p.revOk; S.traps += p.trapN; S.trapOk += p.trapOk;
      S.players.push({ sid: s, nom: p.nom, table: p.table, col: p.col, pos: p.pos, score: p.score, n: n, ok: ok, rate: n ? p.score / (3 * n) : 0, ms: ms.length ? ms.reduce(function (a, b) { return a + b; }, 0) / ms.length : null, online: on, st: pastille(G, p, now), rd: readState(G, p), done: p.done, tools: Object.keys(p.tools || {}).length, bets: p.bets, betsWon: p.betsWon, duelW: p.duelW, duelL: p.duelL, revOk: p.revOk, revN: p.revN });
      rs.forEach(function (r) {
        S.dist[r.pts]++; S.expected++; if (r.answered) S.answered++; if (r.ms != null) S.resp.push(r.ms);
        var k = r.jeu + "·" + r.id, c = S.cards[k] = S.cards[k] || { jeu: r.jeu, id: r.id, n: 0, pts: 0, ms: 0, nms: 0 }; c.n++; c.pts += r.pts; if (r.ms != null) { c.ms += r.ms; c.nms++; }
        r.detail.forEach(function (d) { var ck = d.c || crit(d.lab), x = S.crit[ck] = S.crit[ck] || { n: 0, ok: 0 }; x.n++; if (d.ok) x.ok++; else S.err[ck + " — " + String(d.lab).slice(0, 60)] = (S.err[ck + " — " + String(d.lab).slice(0, 60)] || 0) + 1; });
      });
    });
    return S;
  }
  /* Instantané envoyé à un joueur */
  function pendView(G, p, now) {
    var pd = p.pend; if (!pd) return null;
    var v = { k: pd.k, at: pd.at, left: Math.max(0, (pd.k === "duel" ? (pd.st === "wait" ? DUEL_WAIT_MS : DUEL_PLAY_MS) : PEND_MS) - (now - pd.at)) };
    if (pd.k === "outil") { var to = D.outils.filter(function (o) { return o.id === pd.tool; })[0]; v.tool = { id: to.id, nom: to.nom, url: to.url, tache: to.tache, off: !!G.off[to.id] }; }
    if (pd.k === "piege") v.card = pd.card;
    if (pd.k === "duel") { v.st = pd.st; v.card = pd.card; v.mine = !!pd.ans; var q = pd.opp ? G.players[pd.opp] : null; if (q) v.opp = { nom: q.nom, table: q.table, col: q.col, done: !!(q.pend && q.pend.ans) }; }
    if (pd.k === "rel") { v.au = pd.au; v.jeu = pd.jeu; v.id = pd.id; v.ans = pd.ans; }
    return v;
  }
  function nudge(G, sid, now) { G.nudge[sid] = now; }
  function snapshot(G, sid, now) {
    var p = G.players[sid]; if (!p) return null; var T = G.tables[p.table], tr = tireur(G, T, now);
    return { t: "snap", now: now, gid: G.gid, code: G.code, off: Object.keys(G.off), rd: readState(G, p), nudge: G.nudge[sid] || 0, status: G.status, end: G.end, min: G.min, jeux: G.jeux, n2: !!G.n2, gate: D.caps.gate, max: D.caps.max,
      me: { sid: sid, nom: p.nom, table: p.table, col: p.col, ci: p.ci, pos: p.pos, score: p.score, done: p.done, tools: p.tools, pend: pendView(G, p, now), notes: (p.notes || []).slice(0, 3), bets: p.bets, betsWon: p.betsWon },
      canDraw: canDraw(G, sid, now), tireur: tr ? tr.nom : null,
      table: { id: T.id, round: T.round,
        players: T.players.map(function (s) { var q = G.players[s]; return { sid: s, nom: q.nom, col: q.col, pos: q.pos, score: q.score, st: pastille(G, q, now), on: online(q, now), tools: Object.keys(q.tools || {}).length, rd: readState(G, q) }; }),
        cur: T.cur ? { jeu: T.cur.jeu, id: T.cur.id, at: T.cur.at, answered: Object.keys(T.cur.ans), mine: !!T.cur.ans[sid] } : null,
        last: T.last ? { round: T.last.round, jeu: T.last.jeu, id: T.last.id, res: T.last.res } : null } };
  }
  var api = { setData: setData, COLORS: COLORS, COLNAMES: COLNAMES, MAXP: MAXP, MAXT: MAXT, newGame: newGame, tid: tid, join: join, start: start, stop: stop, running: running, canDraw: canDraw, draw: draw, pool: pool, counts: counts, setExtra: setExtra, setN2: setN2, nextJeu: nextJeu, setJeu: setJeu, answer: answer, closeRound: closeRound, tick: tick, pastille: pastille, stats: stats, snapshot: snapshot, crit: crit, cardOf: cardOf, online: online, tireur: tireur,
    act: act, actBroken: actBroken, actRead: actRead, actHelp: actHelp, setTool: setTool, toolOff: toolOff, nudge: nudge, readyTable: readyTable, readState: readState, resetRead: resetRead, actOutil: actOutil, actPiege: actPiege, actDuel: actDuel, actRel: actRel, ansText: ansText, soloCard: soloCard, toolFor: toolFor, lim: lim };
  if (typeof module !== "undefined") module.exports = api; else root.J51Core = api;
})(typeof window !== "undefined" ? window : this);
