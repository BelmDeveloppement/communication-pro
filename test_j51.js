/* © 2026 SAS BELM DEVELOPPEMENT. Tests de la logique tables/joueurs : 45 JEU, un pion par table, points, jauges, maîtrise. */
var fs = require("fs"), vm = require("vm"); global.window = {}; vm.runInThisContext(fs.readFileSync("plateau-data.js", "utf8"));
var PE = require("./plateau-engine.js"); global.window.PEngine = PE; var J = require("./jeu51-core.js"); J.setData(window.PLATEAU_DATA);
var D = window.PLATEAU_DATA, n = 0; function ok(c, m) { n++; if (!c) { console.log("FAIL", m); process.exitCode = 1; } } function eq(a, b, m) { ok(JSON.stringify(a) === JSON.stringify(b), m + " : " + JSON.stringify(a) + " ≠ " + JSON.stringify(b)); }
var NOW = 1000;
function ansPts(c, q) { return PE.modelAnswer(c).map(function (v, i) { return c.champs[i].c < q ? v : (typeof v === "string" ? "" : Array.isArray(v) ? [] : -1); }); }
function ansFor(G, sid, q) { var T = G.tables[G.players[sid].table], c = J.cardOf(T.cur.jeu, T.cur.id); return ansPts(c, q); }

function game(nb, table) { var G = J.newGame({}); for (var i = 0; i < nb; i++) { var sid = "s" + (table || 1) + i; J.join(G, { sid: sid, nom: "P" + i, table: String(table || 1), sim: true }, NOW); } J.start(G, NOW); return G; }
function play(G, t, pts, bets) { var T = G.tables[t], tr = J.tireur(G, T, NOW); if (!J.draw(G, tr.sid, NOW)) return false; T.players.forEach(function (s, i) { var q = typeof pts === "function" ? pts(s, i) : pts; J.answer(G, s, ansFor(G, s, q), NOW + 1, bets && bets[i]); }); return true; }
function settleAll(G) { Object.keys(G.players).forEach(function (s) { var p = G.players[s]; if (!p.pend) return; var k = p.pend.k;
  if (k === "outil") J.act(G, s, { t: "outil", ok: true }, NOW); else if (k === "piege") J.act(G, s, { t: "pans", ans: [] }, NOW); else if (k === "rel") J.act(G, s, { t: "rev", verdict: "ok" }, NOW);
  else if (k === "duel") { p.pend.st = "solo"; p.pend.card = J.soloCard(G, "1", "x"); J.tick(G, NOW); J.act(G, s, { t: "dans", ans: [] }, NOW); } }); }
function placeBefore(G, type) { var c = D.cases.filter(function (x) { return x.type === type; })[0], q = D.cases[c.n - 1]; G.tables.T1.pos = q.n; G.players.s10.pos = G.players.s11.pos = q.n; G.jeux = [q.jeu]; }
// données
eq(Object.keys(D.jeux).length, 45, "45 JEU"); eq(Object.keys(D.nz).map(function (z) { return D.nz[z]; }).reduce(function (a, b) { return a + b; }, 0), 45, "objectifs : 45 JEU répartis");
eq(D.cases.filter(function (c) { return c.type === "jeu"; }).length, 45, "45 cases JEU");
// départ : le pion arrive sur la case 1
var G = game(3); eq(G.tables.T1.pos, 1, "pion sur la case 1 au lancement"); G.jeux = ["1"]; ok(J.playable(G, G.tables.T1), "JEU 1 jouable quand ouvert");
// frontière
ok(play(G, "T1", 3), "tour JEU 1"); eq(G.tables.T1.pos, 2, "pion avance d'une case"); ok(!play(G, "T1", 3), "JEU 2 pas ouvert : pas de tirage"); eq(G.tables.T1.pos, 2, "le pion ne dépasse pas le JEU ouvert");
J.setJeu(G, "2"); ok(play(G, "T1", 2), "JEU 2 ouvert : tirage"); eq(G.tables.T1.pos, 3, "pion sur la case 3");
// points : somme, bonus solidaire, jauge
eq(G.players.s10.score, 5, "points du joueur : 3 + 2"); eq(G.tables.T1.bonus, 2, "bonus table solidaire sur 2 JEU (tous >= 2)"); eq(J.tableScore(G, G.tables.T1), 3 * 5 + 2, "score de table");
var last = G.tables.T1.last; eq(last.zone, "P1", "objectif du JEU 2"); ok(last.gauge >= 1 && last.gauge <= 10, "jauge entre 0 et 10");
ok(!play(G, "T1", 1) || true, "-"); 
// pas de bonus quand un joueur est sous 2
var G2 = game(3); G2.jeux = ["1"]; play(G2, "T1", function (s, i) { return i === 0 ? 1 : 3; }); eq(G2.tables.T1.bonus || 0, 0, "pas de bonus si un joueur < 2");
// pari
var G3 = game(2); G3.jeux = ["1"]; play(G3, "T1", function (s, i) { return i === 0 ? 3 : 0; }, [true, true]); eq([G3.players.s10.score, G3.players.s11.score], [4, -1], "pari gagné +1, perdu −1");
// parcours complet : toutes les cases traversées une par une, 45 JEU, arrivée
var G4 = game(2); var visited = [], np = 0;
for (var k = 1; k <= 45; k++) { J.setJeu(G4, String(k)); eq(D.cases[G4.tables.T1.pos].jeu, String(k), "le pion est sur le JEU " + k); ok(play(G4, "T1", 3), "tour " + k); G4.tables.T1.last.path.forEach(function (c) { visited.push(c.n); }); settleAll(G4); }
eq(visited, Array.from({ length: 61 }, function (_, i) { return i + 2; }), "toutes les cases 2 à 62 traversées une fois, dans l'ordre"); ok(G4.tables.T1.done && G4.players.s10.done, "arrivée"); eq(G4.tables.T1.pos, 62, "pion à l'arrivée");
var S4 = J.stats(G4, NOW); S4.tables[0].gauges.forEach(function (g) { eq(g.lvl, 10, "jauge pleine " + g.z); }); S4.players[0].mast.forEach(function (m) { eq(m.lvl, "Expert", "niveau Expert " + m.z); });
var sn = J.snapshot(G4, "s10", NOW); ok(sn.mast && sn.mast.length === 5, "niveaux visibles à l'arrivée");
// niveaux : zéro partout = Débutant ; les seuils ne sont pas dans l'instantané
var G5 = game(2); G5.jeux = ["1"]; play(G5, "T1", 0); var m5 = J.stats(G5, NOW).players[0].mast.filter(function (m) { return m.z === "P1"; })[0]; eq(m5.lvl, "Débutant", "0 point = Débutant"); eq(J.snapshot(G5, "s10", NOW).mast, null, "niveaux cachés pendant la séance");
eq(J.levelOf(0.44), "Débutant", "seuil"); eq(J.levelOf(0.45), "Confirmé", "seuil"); eq(J.levelOf(0.75), "Expert", "seuil");
// effets (points) : case 4 = Outil
var G6 = game(2); for (var j = 1; j <= 3; j++) { J.setJeu(G6, String(j)); play(G6, "T1", 3); } eq(G6.tables.T1.pos, 5, "traverse la case Outil 4 puis JEU 4 en case 5"); var p0 = G6.players.s10; eq(p0.pend && p0.pend.k, "outil", "effet Outil en attente"); var before = p0.score; J.act(G6, "s10", { t: "outil", ok: true }, NOW); eq(p0.score, before + 1, "outil réussi +1 point");
var p1 = G6.players.s11; J.act(G6, "s11", { t: "broke" }, NOW); eq(p1.pend, null, "outil inaccessible : sans pénalité");
// piège −1, relecture +1 et arbitrage −1
var Gp = game(2); placeBefore(Gp, "piege"); play(Gp, "T1", 3); eq(Gp.players.s10.pend && Gp.players.s10.pend.k, "piege", "effet Piège (case 13)"); var sc = Gp.players.s10.score; J.act(Gp, "s10", { t: "pans", ans: [] }, NOW); eq(Gp.players.s10.score, sc - 1, "piège raté −1 point");
var Gr = game(2); placeBefore(Gr, "pairs"); play(Gr, "T1", 3); var rv = ["s10", "s11"].filter(function (s) { return Gr.players[s].pend && Gr.players[s].pend.k === "rel"; })[0]; ok(rv, "relecture en attente"); var au = rv === "s10" ? "s11" : "s10"; var s0 = Gr.players[rv].score, a0 = Gr.players[au].score;
J.act(Gr, rv, { t: "rev", verdict: "err" }, NOW); eq(Gr.players[rv].score, s0 + 1, "relecture +1 point"); eq(Gr.arbit.length, 1, "contestation en attente d'arbitrage"); J.arbitrate(Gr, 0, true, NOW); eq(Gr.players[au].score, a0 - 1, "coche fausse confirmée : −1 point à l'auteur");
// correction de score par l'enseignant
var Gf = game(2); Gf.jeux = ["1"]; play(Gf, "T1", 3); var z = D.jeux["1"].zone, zs = Gf.tables.T1.zs[z]; J.fixJeu(Gf, "s10", "1", 1, NOW); eq(Gf.players.s10.score, 1, "score corrigé"); eq(Gf.tables.T1.zs[z], zs - 2, "jauge de table corrigée"); eq(J.stats(Gf, NOW).players.filter(function (p) { return p.sid === "s10"; })[0].mast.filter(function (m) { return m.z === z; })[0].pct < 0.5, true, "maîtrise recalculée");
// deux tables indépendantes, nouvel arrivant rejoint à la case du pion
var Gt = game(2, 1); J.join(Gt, { sid: "t20", nom: "Z", table: "2", sim: true }, NOW); J.start(Gt, NOW); Gt.jeux = ["1"]; play(Gt, "T1", 3); eq([Gt.tables.T1.pos, Gt.tables.T2.pos], [2, 1], "tables indépendantes"); J.join(Gt, { sid: "late", nom: "Tard", table: "1", sim: true }, NOW); eq(Gt.players.late.pos, 2, "retardataire placé sur la case du pion");
// règle « tous sur le JEU X » : saut de toutes les tables, JEU sautés neutres, saut différé si une carte est en cours
var Gj = game(2, 1); J.join(Gj, { sid: "t20", nom: "Z", table: "2", sim: true }, NOW); J.start(Gj, NOW);
J.gotoJeu(Gj, "5", NOW); eq([D.cases[Gj.tables.T1.pos].jeu, D.cases[Gj.tables.T2.pos].jeu], ["5", "5"], "toutes les tables sautent au JEU 5"); eq(Object.keys(Gj.tables.T1.skip), ["1", "2", "3", "4"], "JEU 1 à 4 sautés"); eq(Gj.players.s10.score, 0, "aucun point pour un JEU sauté"); eq(Gj.players.s10.pend, null, "aucun effet de case pendant un saut");
var zj = D.jeux["5"].zone, skz = ["1", "2", "3", "4"].filter(function (k) { return D.jeux[k].zone === zj; }).length; play(Gj, "T1", 3);
eq(J.stats(Gj, NOW).players.filter(function (p) { return p.sid === "s10"; })[0].mast.filter(function (m) { return m.z === zj; })[0].pct, 3 / (3 * (D.nz[zj] - skz)), "maîtrise : JEU sautés retirés du total possible");
settleAll(Gj); var Tj = Gj.tables.T2, trj = J.tireur(Gj, Tj, NOW); ok(J.draw(Gj, trj.sid, NOW), "table 2 tire le JEU 5"); J.gotoJeu(Gj, "9", NOW); eq(D.cases[Tj.pos].jeu, "5", "carte en cours : la table 2 ne saute pas tout de suite"); eq(Tj.jump, "9", "saut différé noté");
eq(D.cases[Gj.tables.T1.pos].jeu, "9", "la table 1, sans carte en cours, saute au JEU 9"); J.answer(Gj, "t20", ansFor(Gj, "t20", 3), NOW + 1); eq(D.cases[Tj.pos].jeu, "9", "carte terminée : la table 2 saute au JEU 9"); eq(Tj.last.jump, "9", "le résultat annonce le saut"); eq(Gj.players.t20.score, 3, "points de la carte terminée conservés");
ok(!Tj.skip["5"] && Tj.skip["6"] && Tj.skip["8"], "JEU 5 joué, JEU 6 à 8 sautés"); J.gotoJeu(Gj, "6", NOW); settleAll(Gj); play(Gj, "T2", 2); ok(!Tj.skip["6"], "retour en arrière : un JEU rejoué n'est plus sauté");
var Gs = J.newGame({ jeux: ["7"] }); J.join(Gs, { sid: "a", nom: "A", table: "1", sim: true }, NOW); J.start(Gs, NOW); eq(D.cases[Gs.tables.T1.pos].jeu, "7", "partie ouverte sur le JEU 7 : le pion part du JEU 7"); J.join(Gs, { sid: "b", nom: "B", table: "3", sim: true }, NOW); eq(D.cases[Gs.tables.T3.pos].jeu, "7", "table créée en cours de séance : sur le JEU ouvert");
// joueur fantôme : retrait
var Gl = game(2); ok(J.leave(Gl, "s11"), "un joueur qui n'a rien joué peut quitter"); eq(Gl.tables.T1.players, ["s10"], "il est retiré de la table"); Gl.jeux = ["1"]; play(Gl, "T1", 3); ok(!J.leave(Gl, "s10"), "un joueur qui a joué n'est pas retiré sans confirmation de l'enseignant"); ok(J.leave(Gl, "s10", true), "retrait forcé par l'enseignant");
// partie sans chronomètre : elle ne se termine que sur décision de l'enseignant, et peut être rouverte
var Gc = game(1); ok(J.running(Gc, NOW + 100 * 3600000), "pas de fin automatique, même 100 heures plus tard"); J.tick(Gc, NOW + 100 * 3600000); eq(Gc.status, "play", "toujours en cours après un tick tardif"); J.stop(Gc, NOW); eq(Gc.status, "ended", "terminée par l'enseignant"); ok(!J.canDraw(Gc, "s10", NOW), "plus de tirage une fois terminée"); J.reopen(Gc, NOW); eq(Gc.status, "play", "rouverte");
ok(J.exactTool("1") && !J.exactTool("2") && J.exactTool("4"), "outil exact : JEU 1 et 4 en ont un, pas le JEU 2"); eq(Object.keys(D.enonces).length, 45, "45 énoncés repris du support"); ok(Object.keys(D.enonces).every(function (k) { var e = D.enonces[k]; return e.page >= 0 && (e.but || e.consigne); }), "chaque énoncé a un but ou une consigne");
console.log(process.exitCode ? "ÉCHECS" : "logique tables/joueurs : " + n + " vérifications, tout passe");
