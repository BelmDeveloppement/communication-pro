/* © 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. Créé avec l'aide de Claude (Anthropic), relu par l'auteur.
   Logique « tables et joueurs » du plateau « La route de l'état de l'art » (45 JEUX, 63 cases, un pion par table, points, jauges de maîtrise).
   Pur, sans DOM, testable sous Node. Le navigateur de l'enseignant fait autorité : les joueurs envoient leurs actions, il note et renvoie l'état.
   Règles : 1 case = 1 JEU, toute la classe joue le JEU ouvert par l'enseignant : à l'ouverture, toutes les tables y placent leur pion (une table au milieu d'une carte la termine d'abord ; un JEU non joué est sauté, neutre). Après un JEU, le pion avance jusqu'au JEU suivant et y attend.
   Points : 0 à 3 par JEU, pari ±1, effets en points, bonus « table solidaire » ; jauges de maîtrise par objectif (10 jetons) ; niveau Débutant / Confirmé / Expert (seuils cachés). */
(function (root) {
  "use strict";
  var PE = root.PEngine || (typeof require !== "undefined" ? require("./plateau-engine.js") : null);
  var D = root.PLATEAU_DATA || null;
  function setData(d) { D = d; }
  var COLORS = ["#3B6FD8", "#2E9E6B", "#D6479B", "#E4572E", "#E9A400"];
  var COLNAMES = ["bleu", "vert", "rose", "rouge", "orange"];
  var MAXP = 5, MAXT = 5, OFFLINE_MS = 25000, CARD_MAX_MS = 90 * 60000, STUCK_MS = 20 * 60000, PEND_MS = 150000, DUEL_WAIT_MS = 45000, DUEL_PLAY_MS = 90000;

  function newGame(cfg) {
    cfg = cfg || {};
    return { v: 3, gid: Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36), extra: false, n2: true, help: {}, broken: {}, off: {}, sujets: {}, nudge: {}, code: (cfg.code || "ROUTE").toUpperCase(), jeux: cfg.jeux || ["1"], min: cfg.min || 480, status: "lobby", start: 0, end: 0, tables: {}, players: {}, log: [], arbit: [] };
  }
  function tid(n) { var k = parseInt(String(n).replace(/\D/g, ""), 10); return k >= 1 && k <= MAXT ? "T" + k : null; }
  function tableOf(G, t) { return G.tables[t] || (G.tables[t] = { id: t, players: [], round: 0, seen: {}, cur: null, last: null, pos: G.status === "play" ? startPos(G) : 0, bonus: 0, zs: {}, skip: {}, done: false }); }
  function online(p, now) { return p.sim || (now - p.last) < OFFLINE_MS; }
  /* Frontière : la table joue le JEU de la case où se trouve son pion, à condition que l'enseignant l'ait ouvert (numéro de JEU <= JEU ouvert). */
  function lim(G) { return D.caps.max; }
  function caseOf(T) { return D.cases[T.pos] || null; }
  function jeuHere(T) { var c = caseOf(T); return c && c.type === "jeu" ? c.jeu : null; }
  function playable(G, T) { var j = jeuHere(T); return !!j && !T.done && parseInt(j, 10) <= parseInt(G.jeux[0], 10); }
  function zoneOf(jeu) { return D.jeux[jeu].zone; }
  /* Jauge de la table pour un objectif : 10 jetons = maîtrise complète (points obtenus / points possibles sur tout l'objectif). */
  function caseIx(k) { for (var i = 0; i < D.cases.length; i++) if (D.cases[i].type === "jeu" && String(D.cases[i].jeu) === String(k)) return i; return -1; }
  function startPos(G) { var i = caseIx(G.jeux[0]); return i > 0 ? i : 1; }
  /* JEUX sautés (l'enseignant est passé à un autre JEU avant que la table ne les joue) : neutres, retirés du total possible. */
  function skN(sk, z) { var n = 0; Object.keys(sk || {}).forEach(function (j) { if (D.jeux[j] && D.jeux[j].zone === z) n++; }); return n; }
  function gaugeLvl(T, z, np) { var sum = (T.zs[z] || 0), den = 3 * Math.max(1, D.nz[z] - skN(T.skip, z)) * Math.max(1, np); return Math.max(0, Math.min(10, Math.round(10 * sum / den))); }
  function levelOf(pct) { return pct < 0.45 ? "Débutant" : pct < 0.75 ? "Confirmé" : "Expert"; }
  function mastery(zp, zn, z, np, sk) { var den = 3 * Math.max(1, D.nz[z] - skN(sk, z)) * (np || 1), pct = Math.max(0, (zp[z] || 0) / den); return { z: z, pct: pct, n: zn[z] || 0, lvl: (zn[z] || 0) ? levelOf(pct) : null }; }
  function masteryAll(p) { return Object.keys(D.zones).map(function (z) { return mastery(p.zp, p.zn, z, 1, p.skip); }); }
  function masteryTable(G, T) { var ps = T.players.map(function (s) { return G.players[s]; }), np = Math.max(1, ps.length); return Object.keys(D.zones).map(function (z) { var zp = {}, zn = {}; zp[z] = T.zs[z] || 0; zn[z] = ps.reduce(function (a, p) { return Math.max(a, p.zn[z] || 0); }, 0); return mastery(zp, zn, z, np, T.skip); }); }
  function tableScore(G, T) { return T.players.reduce(function (a, s) { return a + G.players[s].score; }, 0) + (T.bonus || 0); }
  function say(G, p, txt, now) {
    p.notes = p.notes || []; p.notes.unshift({ txt: txt, at: now }); p.notes = p.notes.slice(0, 5);
    G.log.unshift({ t: p.table, n: p.nom, txt: txt, at: now }); G.log = G.log.slice(0, 40);
  }

  function join(G, o, now) {
    settle(G);
    var t = tid(o.table); if (!t) return { ok: false, err: "Table inconnue : choisissez une table de 1 à " + MAXT + "." };
    var nom = String(o.nom || "").trim().slice(0, 18); if (!nom) return { ok: false, err: "Saisissez votre prénom." };
    var T = tableOf(G, t), p = G.players[o.sid];
    if (p && p.table === t) { p.last = now; return { ok: true, player: p }; }
    var same = T.players.map(function (s) { return G.players[s]; }).filter(function (q) { return q.nom.toLowerCase() === nom.toLowerCase(); })[0];
    if (same) { same.last = now; return { ok: true, player: same, rebound: true }; }
    if (T.players.length >= MAXP) return { ok: false, err: "La table " + t + " est complète (" + MAXP + " joueurs)." };
    var used = T.players.map(function (s) { return G.players[s].ci; }), ci = 0; while (used.indexOf(ci) >= 0) ci++;
    p = { sid: o.sid, nom: nom, table: t, ci: ci, col: COLORS[ci], pos: T.pos, score: 0, zp: {}, zn: {}, done: T.done, last: now, joined: now, res: [], sim: !!o.sim, tools: {}, bets: 0, betsWon: 0, duelW: 0, duelL: 0, revN: 0, revOk: 0, trapN: 0, trapOk: 0, pend: null, notes: [], skip: JSON.parse(JSON.stringify(T.skip || {})), read: { common: false, jeux: {} } };
    G.players[p.sid] = p; T.players.push(p.sid); return { ok: true, player: p };
  }
  function settle(G) { Object.keys(G.tables).forEach(function (t) { var T = G.tables[t]; if (T.pos === 0 && G.status === "play") { if (!moveTable(G, T, G.jeux[0], 0)) { T.pos = 1; T.players.forEach(function (s) { G.players[s].pos = 1; }); } delete T.jumped; } }); }
  /* Une partie n'est pas chronométrée : elle dure jusqu'à ce que l'enseignant la termine, et peut être rouverte. */
  function start(G, now) { if (G.status === "play") return; G.status = "play"; G.start = G.start || now; G.end = 0; settle(G); }
  function reopen(G, now) { if (G.status === "ended") { G.status = "play"; G.end = 0; } }
  function stop(G, now) { G.end = now; if (G.status === "play") G.status = "ended"; }
  function running(G, now) { return G.status === "play"; }
  function tireur(G, T, now) {
    var ps = T.players.map(function (s) { return G.players[s]; }).filter(function (p) { return !p.done; }); if (!ps.length) return null;
    return ps[T.round % ps.length];
  }
  /* Lecture obligatoire : document commun (une fois) + fiche du jeu courant (quand on y arrive) */
  function hereJ(G, p) { return jeuHere(G.tables[p.table]); }
  function hasRead(G, p) { if (p.sim) return true; var j = hereJ(G, p); return !!(p.read && p.read.common) && (!j || !!(p.read.jeux && p.read.jeux[j])); }
  function readState(G, p) { if (p.sim) return "ok"; if (!p.read || !p.read.common) return "common"; var j = hereJ(G, p); if (j && !p.read.jeux[j]) return "fiche"; return "ok"; }
  function readyTable(G, T, now) {
    return T.players.every(function (s) { var p = G.players[s]; return p.done || !online(p, now) || hasRead(G, p); });
  }
  function actRead(G, sid, doc, now) {
    var p = G.players[sid]; if (!p) return false; p.read = p.read || { common: false, jeux: {} };
    if (doc === "common") p.read.common = true; else if (doc === "jeu") { var hj = hereJ(G, p); if (hj) p.read.jeux[hj] = true; } else return false;
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
    if (!running(G, now) || T.cur || !playable(G, T)) return false;
    var tr = tireur(G, T, now); if (!tr) return false;
    if (!readyTable(G, T, now)) return false;
    return tr.sid === sid ? !p.pend : (!online(tr, now) || !!tr.pend) && !p.pend;
  }
  function pool(G, jeu) { var j = D.jeux[jeu]; return { cartes: j.cartes.filter(function (c) { return !c.extra || G.extra; }) }; }
  function counts(G, jeu) { var cs = D.jeux[jeu].cartes; return { base: cs.filter(function (c) { return !c.extra; }).length, extra: cs.filter(function (c) { return c.extra; }).length }; }
  function setExtra(G, on) { G.extra = !!on; }
  function setN2(G, on) { G.n2 = !!on; }
  /* Place le pion d'une table sur la case du JEU k. Les JEU non joués entre les deux sont « sautés » : ni points, ni pénalité, ni effets de case. */
  function moveTable(G, T, k, now) {
    var ix = caseIx(k); if (ix < 0 || T.done) return false; T.skip = T.skip || {}; T.played = T.played || {};
    var from = T.pos, act = T.players.map(function (s) { return G.players[s]; }).filter(function (p) { return !p.done; });
    for (var i = Math.max(1, from); i < ix; i++) { var c = D.cases[i]; if (c.type === "jeu" && !T.played[c.jeu]) { T.skip[c.jeu] = true; act.forEach(function (p) { (p.skip = p.skip || {})[c.jeu] = true; }); } }
    if (from === ix) return false;
    T.pos = ix; act.forEach(function (p) { p.pos = ix; }); T.jumped = { jeu: String(k), to: ix, from: from, at: now }; delete T.jump;
    return true;
  }
  /* L'enseignant (ou la diapositive du PowerPoint) ouvre le JEU k : toutes les tables y vont. Une table au milieu d'une carte la termine d'abord. */
  function gotoJeu(G, k, now) {
    k = String(k); if (!D.jeux[k]) return G.jeux[0]; G.jeux = [k]; resetRead(G, k);
    Object.keys(G.tables).forEach(function (t) { var T = G.tables[t]; if (T.done || G.status === "lobby" && T.pos === 0) return; if (T.cur) T.jump = k; else moveTable(G, T, k, now || 0); });
    return k;
  }
  function setJeu(G, k, now) { return gotoJeu(G, k, now); }
  function nextJeu(G, dir, now) { var ks = Object.keys(D.jeux), i = ks.indexOf(G.jeux[0]), n = Math.max(0, Math.min(ks.length - 1, (i < 0 ? 0 : i) + (dir || 1))); return gotoJeu(G, ks[n], now); }
  /* Retire un joueur (il a quitté la partie, ou l'enseignant retire un doublon). Sans « force », seulement s'il n'a encore rien joué. */
  function leave(G, sid, force) {
    var p = G.players[sid]; if (!p) return false; if (!force && (p.res.length || p.pend)) { p.last = 0; return false; }
    var T = G.tables[p.table]; if (T) { T.players = T.players.filter(function (s) { return s !== sid; }); if (T.cur) delete T.cur.ans[sid]; }
    if (p.sujet && G.sujets && G.sujets[p.sujet] === sid) delete G.sujets[p.sujet];
    delete G.players[sid]; if (G.nudge) delete G.nudge[sid]; return true;
  }
  function cardOf(jeu, id) { var src = jeu === "P" ? D.pieges : D.jeux[jeu]; return src.cartes.filter(function (c) { return c.id === id; })[0]; }
  function draw(G, sid, now) {
    if (!canDraw(G, sid, now)) return false;
    var T = G.tables[G.players[sid].table], jeu = jeuHere(T), j = pool(G, jeu);
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
    if (card.t === "saisie") return PE.saisieText(card, ans);
    return String(ans || "(pas de réponse)");
  }
  function critOf(card, i, d) {
    if (card.t === "texte") return crit(d.lab);
    if (card.t === "assoc") return card.labels[card.items[i].ok];
    if (card.t === "trous") return card.slots[i].lab;
    if (card.t === "oral" || card.t === "saisie") return String(d.lab).slice(0, 30);
    if (card.t === "multi") return d.lab.indexOf("À cocher") === 0 ? "cases à cocher" : "cases à laisser vides";
    return "réponse unique";
  }
  /* ---------- cartes individuelles (Piège, Duel) ---------- */
  function soloCard(G, jeu, seed) {
    var pl = D.jeux[jeu].cartes.filter(function (c) { return !c.extra && ["choix", "multi", "trous", "assoc"].indexOf(c.t) >= 0; });
    if (!pl.length) { var ps = D.pieges.cartes; return { jeu: "P", id: PE.shuffle(ps.map(function (c) { return c.id; }), seed)[0] }; }
    return { jeu: jeu, id: PE.shuffle(pl.map(function (c) { return c.id; }), seed)[0] };
  }
  /* Outil rattaché exactement à ce JEU (sinon aucun) ; toolFor sert aux cases Outil : dernier outil rencontré. */
  function exactTool(jeu) { return D.outils.filter(function (o) { return String(o.jeu) === String(jeu); })[0] || null; }
  function toolFor(jeu) { var n = parseInt(jeu, 10), best = null; D.outils.forEach(function (o) { if (parseInt(o.jeu, 10) <= n) best = o; }); return best || D.outils[0]; }
  function pt(G, p, delta) { p.score += delta; return delta; }

  /* Fin d'un tour de table : points de chacun, bonus, jauge, puis le pion avance d'une case en traversant les cases à effet. */
  function applyCase(G, T, p, cs, cur, card, a, r, rd, now) {
    var eff = null;
    if (cs.type === "aleas") {
      var ev = D.events[PE.shuffle(D.events.map(function (e, i) { return i; }), G.code + p.sid + rd + cs.n)[0]];
      pt(G, p, ev.move); eff = { k: "aleas", titre: ev.titre, txt: ev.txt, move: ev.move }; say(G, p, "Aléa « " + ev.titre + " » (" + (ev.move > 0 ? "+" : "") + ev.move + " point)", now);
    } else if (cs.type === "outil" || cs.type === "piege" || cs.type === "duel" || cs.type === "pairs") {
      if (p.pend) return { k: "busy", of: cs.type };
      if (cs.type === "outil") {
        var to = toolFor(cur.jeu);
        if (G.off[to.id]) { pt(G, p, 1); eff = { k: "outil", tool: to.id, off: true }; say(G, p, "Outil « " + to.nom + " » désactivé : +1 point sans tâche", now); }
        else { p.pend = { k: "outil", at: now, tool: to.id }; eff = { k: "outil", tool: to.id }; }
      } else if (cs.type === "piege") {
        var pc = D.pieges.cartes; p.pend = { k: "piege", at: now, card: { jeu: "P", id: PE.shuffle(pc.map(function (c) { return c.id; }), G.code + p.sid + rd + "p")[0] } }; eff = { k: "piege" };
      } else if (cs.type === "duel") {
        p.pend = { k: "duel", at: now, st: "wait", opp: null, card: null, ans: null }; eff = { k: "duel" }; matchDuels(G, p, cur.jeu, now);
      } else {
        var rv = T.players.map(function (x) { return G.players[x]; }).filter(function (q) { return q.sid !== p.sid && !q.done && !q.pend && online(q, now); });
        if (rv.length) { var q = rv[(rd + p.ci) % rv.length]; q.pend = { k: "rel", at: now, au: p.nom, aus: p.sid, jeu: cur.jeu, id: cur.id, ans: ansText(card, a ? a.ans : null), pts: r.pts }; eff = { k: "pairs", par: q.nom }; }
        else eff = { k: "pairs", par: null };
      }
    } else if (cs.type === "gate") eff = { k: "gate" };
    return eff;
  }
  function closeRound(G, t, now) {
    var T = G.tables[t]; if (!T || !T.cur) return false;
    var cur = T.cur, card = cardOf(cur.jeu, cur.id), res = {}, rd = T.round, z = zoneOf(cur.jeu), act = T.players.map(function (s) { return G.players[s]; }).filter(function (p) { return !p.done; });
    var from = T.pos, to = from + 1, path = [], low = false;
    var live = act.filter(function (p) { return !!cur.ans[p.sid] || online(p, now); });
    act.forEach(function (p) {
      var a = cur.ans[p.sid], r = PE.score(card, a ? a.ans : null), bet = a && a.bet ? PE.betDelta(r.pts) : 0;
      if (a && a.bet) { p.bets++; if (bet > 0) p.betsWon++; }
      p.score += r.pts + bet; p.zp[z] = (p.zp[z] || 0) + r.pts; p.zn[z] = (p.zn[z] || 0) + 1; T.zs[z] = (T.zs[z] || 0) + r.pts; if (r.pts < 2) low = true;
      var ms = a ? a.at - cur.at : null, det = r.detail.map(function (d, i) { return { ok: !!d.ok, lab: d.lab, c: critOf(card, i, d) }; });
      res[p.sid] = { pts: r.pts, gain: r.pts + bet, mv: 1, bet: { on: !!(a && a.bet), d: bet }, detail: r.detail, from: from, to: to, final: to, ev: null, evs: [], answered: !!a, ms: ms };
      p.res.push({ n: rd, jeu: cur.jeu, id: cur.id, pts: r.pts, ms: ms, answered: !!a, detail: det, txt: a && card.t === "saisie" ? ansText(card, a.ans).slice(0, 2400) : "" });
    });
    var solid = act.length > 0 && act.every(function (p) { return res[p.sid].pts >= 2; }); if (solid) T.bonus = (T.bonus || 0) + 1;
    /* le pion traverse les cases une par une jusqu'au prochain JEU (ou l'arrivée) */
    for (;;) {
      var cs = D.cases[to]; if (!cs) { to--; break; }
      path.push({ n: cs.n, type: cs.type });
      if (cs.type === "jeu" || cs.type === "exam") break;
      act.forEach(function (p) { var e = applyCase(G, T, p, cs, cur, card, cur.ans[p.sid], PE.score(card, cur.ans[p.sid] ? cur.ans[p.sid].ans : null), rd, now); if (e) { res[p.sid].evs.push(e); res[p.sid].ev = res[p.sid].ev || e; } });
      to++;
    }
    T.pos = to; act.forEach(function (p) { p.pos = to; res[p.sid].to = to; res[p.sid].final = to; res[p.sid].mv = to - from; });
    if (D.cases[to] && D.cases[to].type === "exam") { T.done = true; T.players.forEach(function (s) { G.players[s].done = true; G.players[s].pos = to; }); }
    (T.seen[cur.jeu] = T.seen[cur.jeu] || []).push(cur.id); (T.played = T.played || {})[cur.jeu] = true; if (T.skip) delete T.skip[cur.jeu]; act.forEach(function (p) { if (p.skip) delete p.skip[cur.jeu]; });
    T.last = { round: rd, jeu: cur.jeu, id: cur.id, res: res, at: now, zone: z, gauge: gaugeLvl(T, z, T.players.length), bonus: solid, from: from, to: to, path: path, tscore: tableScore(G, T) }; T.cur = null; T.round++;
    if (T.jump && !T.done) { var jk = T.jump; delete T.jump; if (moveTable(G, T, jk, now)) { T.last.to = T.pos; T.last.jump = jk; act.forEach(function (p) { res[p.sid].to = res[p.sid].final = T.pos; res[p.sid].mv = T.pos - from; res[p.sid].jump = jk; }); } }
    else delete T.jump;
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
      if (pp >= 2) { pt(G, p, 1); say(G, p, "Duel contre la tour gagné : +1 point", now); p.duelW++; } else say(G, p, "Duel contre la tour : pas de gain", now);
      p.pend = null; return;
    }
    var win = null;
    if (pp > pq) win = p; else if (pq > pp) win = q; else if (pp >= 0 && sp && sq) win = sp.at <= sq.at ? p : q;
    if (win && (win === p ? pp : pq) <= 0) win = null;
    if (!win) { say(G, p, "Duel : égalité, rien ne bouge", now); if (q) say(G, q, "Duel : égalité, rien ne bouge", now); }
    else {
      var lo = win === p ? q : p; pt(G, win, 1); pt(G, lo, -1); win.duelW++; lo.duelL++;
      say(G, win, "Duel gagné contre " + lo.nom + " (" + lo.table + ") : +1 point", now); say(G, lo, "Duel perdu contre " + win.nom + " (" + win.table + ") : −1 point", now);
    }
    p.pend = null; if (q && q.pend && q.pend.k === "duel") q.pend = null;
  }

  /* ---------- actions individuelles du joueur ---------- */
  function actOutil(G, sid, ok, now) {
    var p = G.players[sid]; if (!p || !p.pend || p.pend.k !== "outil") return false;
    var to = D.outils.filter(function (o) { return o.id === p.pend.tool; })[0];
    if (ok) { p.tools[to.id] = now; pt(G, p, 1); say(G, p, "Outil « " + to.nom + " » utilisé : +1 point", now); }
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
    if (r.pts >= 2) { p.trapOk++; say(G, p, "Piège évité", now); } else { pt(G, p, -1); say(G, p, "Piège : −1 point", now); }
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
    var pend = p.pend, err = verdict === "err"; p.revN++; p.revOk++; pt(G, p, 1);
    if (err) { G.arbit.unshift({ au: pend.au, aus: pend.aus, rev: p.nom, revs: sid, jeu: pend.jeu, pts: pend.pts, at: now, done: false }); G.arbit = G.arbit.slice(0, 30); say(G, p, "Relecture de " + pend.au + " : une coche te semble fausse, l'enseignant arbitre (+1 point)", now); }
    else say(G, p, "Relecture de " + pend.au + " : saisies validées (+1 point)", now);
    p.pend = null; return { right: !err, pts: pend.pts };
  }
  /* Arbitrage de l'enseignant : une saisie fausse retire 1 point à l'auteur ; sinon rien. */
  function arbitrate(G, i, ok, now) {
    var x = G.arbit[i]; if (!x || x.done) return false; x.done = true; x.ok = !!ok; var au = G.players[x.aus];
    if (ok && au) { pt(G, au, -1); say(G, au, "Relecture : une saisie fausse a été confirmée (−1 point)", now); } return true;
  }
  /* Correction d'un score de JEU par l'enseignant (met à jour points, jauge et classement). */
  function fixJeu(G, sid, jeu, newPts, now) {
    var p = G.players[sid]; if (!p) return false; var r = p.res.filter(function (x) { return x.jeu === String(jeu); })[0]; if (!r) return false;
    newPts = Math.max(0, Math.min(3, newPts | 0)); var d = newPts - r.pts, z = zoneOf(r.jeu); if (!d) return true;
    r.pts = newPts; r.fixed = true; p.score += d; p.zp[z] = (p.zp[z] || 0) + d; G.tables[p.table].zs[z] = (G.tables[p.table].zs[z] || 0) + d; say(G, p, "Score du JEU " + jeu + " corrigé par l'enseignant : " + newPts + "/3", now); return true;
  }
  /* Sujets de l'état de l'art : un sujet par joueur, un joueur par sujet (premier arrivé, premier servi). G.sujets = { nom du sujet : sid } */
  function sujetList() { return (D && D.sujets) || []; }
  function sujetOf(G, sid) { var p = G.players[sid]; return p && p.sujet ? sujetList().filter(function (x) { return x[0] === p.sujet; })[0] || null : null; }
  function claimSujet(G, sid, key, now) {
    var p = G.players[sid]; if (!p) return { ok: false, reason: "joueur" };
    G.sujets = G.sujets || {};
    if (!sujetList().some(function (x) { return x[0] === key; })) return { ok: false, reason: "inconnu" };
    if (p.sujet === key) return { ok: true, reason: "deja" };
    if (p.sujet) return { ok: false, reason: "dejachoisi", mine: p.sujet };
    var o = G.sujets[key]; if (o && G.players[o] && o !== sid) return { ok: false, reason: "pris", par: G.players[o].nom };
    G.sujets[key] = sid; p.sujet = key; p.sujetAt = now; return { ok: true, reason: "ok" };
  }
  function releaseSujet(G, key) { G.sujets = G.sujets || {}; var o = G.sujets[key]; if (o && G.players[o]) { delete G.players[o].sujet; delete G.players[o].sujetAt; } delete G.sujets[key]; }
  function sujetsView(G) { var o = {}; sujetList().forEach(function (x) { var s = (G.sujets || {})[x[0]], p = s && G.players[s]; o[x[0]] = p ? p.nom : null; }); return o; }
  function act(G, sid, m, now) {
    if (m.t === "sujet") { var rs = claimSujet(G, sid, String(m.sujet || ""), now); G.players[sid] && (G.players[sid].sujetRes = rs); return rs.ok; }
    if (m.t === "report") { var pr = G.players[sid]; G.reports = G.reports || []; G.reports.push({ at: now, sid: sid, nom: pr ? pr.nom : "?", table: pr ? pr.table : "?", kind: String(m.kind || "").slice(0, 40), txt: String(m.txt || "").slice(0, 600), jeu: String(m.jeu || "").slice(0, 4), done: false }); if (G.reports.length > 300) G.reports.shift(); return true; }
    if (m.t === "draw") return draw(G, sid, now);
    if (m.t === "ans") { var pp = G.players[sid], TT = pp && G.tables[pp.table]; if (m.card && TT && TT.cur && m.card !== TT.round + ":" + TT.cur.jeu + ":" + TT.cur.id) return false; return answer(G, sid, m.ans, now, m.bet); }
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
    settle(G);
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
      S.players.push({ sid: s, nom: p.nom, table: p.table, col: p.col, pos: p.pos, score: p.score, n: n, ok: ok, rate: n ? rs.reduce(function (t, r) { return t + r.pts; }, 0) / (3 * n) : 0, ms: ms.length ? ms.reduce(function (a, b) { return a + b; }, 0) / ms.length : null, online: on, st: pastille(G, p, now), zp: p.zp, zn: p.zn, rd: readState(G, p), done: p.done, tools: Object.keys(p.tools || {}).length, bets: p.bets, betsWon: p.betsWon, duelW: p.duelW, duelL: p.duelL, revOk: p.revOk, revN: p.revN });
      rs.forEach(function (r) {
        S.dist[r.pts]++; S.expected++; if (r.answered) S.answered++; if (r.ms != null) S.resp.push(r.ms);
        var k = r.jeu + "·" + r.id, c = S.cards[k] = S.cards[k] || { jeu: r.jeu, id: r.id, n: 0, pts: 0, ms: 0, nms: 0 }; c.n++; c.pts += r.pts; if (r.ms != null) { c.ms += r.ms; c.nms++; }
        r.detail.forEach(function (d) { var ck = d.c || crit(d.lab), x = S.crit[ck] = S.crit[ck] || { n: 0, ok: 0 }; x.n++; if (d.ok) x.ok++; else S.err[ck + " — " + String(d.lab).slice(0, 60)] = (S.err[ck + " — " + String(d.lab).slice(0, 60)] || 0) + 1; });
      });
    });
      S.tables.forEach(function (x) { var T = G.tables[x.id]; x.pos = T.pos; x.tscore = tableScore(G, T); x.bonus = T.bonus || 0; x.gauges = Object.keys(D.zones).map(function (z) { return { z: z, lvl: gaugeLvl(T, z, T.players.length) }; }); x.mast = masteryTable(G, T); x.done = !!T.done; });
    S.players.forEach(function (x) { x.mast = masteryAll(G.players[x.sid]); });
    S.arbit = G.arbit;
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
    return { t: "snap", now: now, gid: G.gid, code: G.code, off: Object.keys(G.off), rd: readState(G, p), nudge: G.nudge[sid] || 0, status: G.status, end: G.end, min: G.min, jeux: G.jeux, gate: D.caps.gate, max: D.caps.max, tpos: T.pos, here: jeuHere(T), tdone: !!T.done, tscore: tableScore(G, T), gauges: Object.keys(D.zones).map(function (z) { return { z: z, lvl: gaugeLvl(T, z, T.players.length) }; }), mast: G.status === "ended" || T.done ? masteryAll(p) : null,
      me: { sujet: p.sujet || null, sujetRes: p.sujetRes || null, sid: sid, nom: p.nom, table: p.table, col: p.col, ci: p.ci, pos: p.pos, score: p.score, done: p.done, tools: p.tools, pend: pendView(G, p, now), notes: (p.notes || []).slice(0, 3), bets: p.bets, betsWon: p.betsWon },
      sujets: sujetsView(G), canDraw: canDraw(G, sid, now), played: false, lim: lim(G), wait: !playable(G, T) && !T.done, tireur: tr ? tr.nom : null,
      table: { id: T.id, round: T.round, jumped: T.jumped || null,
        players: T.players.map(function (s) { var q = G.players[s]; return { sid: s, nom: q.nom, col: q.col, pos: q.pos, score: q.score, st: pastille(G, q, now), on: online(q, now), tools: Object.keys(q.tools || {}).length, rd: readState(G, q) }; }),
        cur: T.cur ? { jeu: T.cur.jeu, id: T.cur.id, at: T.cur.at, answered: Object.keys(T.cur.ans), mine: !!T.cur.ans[sid] } : null,
        last: T.last ? { round: T.last.round, jeu: T.last.jeu, id: T.last.id, res: T.last.res, zone: T.last.zone, gauge: T.last.gauge, bonus: T.last.bonus, from: T.last.from, to: T.last.to, path: T.last.path } : null } };
  }
  var api = { setData: setData, COLORS: COLORS, COLNAMES: COLNAMES, MAXP: MAXP, MAXT: MAXT, newGame: newGame, tid: tid, join: join, start: start, stop: stop, running: running, canDraw: canDraw, draw: draw, pool: pool, counts: counts, setExtra: setExtra, setN2: setN2, nextJeu: nextJeu, setJeu: setJeu, gotoJeu: gotoJeu, moveTable: moveTable, leave: leave, caseIx: caseIx, answer: answer, closeRound: closeRound, tick: tick, pastille: pastille, stats: stats, snapshot: snapshot, crit: crit, cardOf: cardOf, online: online, tireur: tireur,
    claimSujet: claimSujet, releaseSujet: releaseSujet, sujetOf: sujetOf, sujetsView: sujetsView, act: act, actBroken: actBroken, actRead: actRead, actHelp: actHelp, setTool: setTool, toolOff: toolOff, nudge: nudge, readyTable: readyTable, readState: readState, resetRead: resetRead, actOutil: actOutil, actPiege: actPiege, actDuel: actDuel, actRel: actRel, ansText: ansText, soloCard: soloCard, toolFor: toolFor, exactTool: exactTool, reopen: reopen, lim: lim, arbitrate: arbitrate, fixJeu: fixJeu, gaugeLvl: gaugeLvl, tableScore: tableScore, mastery: mastery, masteryAll: masteryAll, masteryTable: masteryTable, playable: playable, jeuHere: jeuHere, levelOf: levelOf };
  if (typeof module !== "undefined") module.exports = api; else root.J51Core = api;
})(typeof window !== "undefined" ? window : this);
