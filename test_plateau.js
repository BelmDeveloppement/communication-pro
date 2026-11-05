/* © 2026 SAS BELM DEVELOPPEMENT. Tests du contenu et du moteur : 40 JEUX à critères, banque de questions rapides, équilibrage, ordre des items, cases. */
var P = require("./plateau-engine.js"), fs = require("fs"), vm = require("vm");
var ctx = { window: {} }; vm.runInNewContext(fs.readFileSync("plateau-data.js", "utf8"), ctx); var D = ctx.window.PLATEAU_DATA, bad = 0, n = 0;
function ok(c, m) { n++; if (!c) { bad++; console.log("ÉCHEC", m); } }
function eq(a, b, m) { ok(JSON.stringify(a) === JSON.stringify(b), m + " " + JSON.stringify(a) + " ≠ " + JSON.stringify(b)); }
function best(c) { return c.t === "choix" ? c.ok : c.t === "multi" ? c.oks : c.t === "assoc" ? c.items.map(function (i) { return i.ok; }) : c.t === "trous" ? c.slots.map(function (s) { return s.ok; }) : c.grille.map(function () { return true; }); }
function empty(c) { return c.t === "choix" ? -1 : c.t === "multi" ? [] : c.t === "assoc" ? c.items.map(function () { return -1; }) : c.t === "trous" ? c.slots.map(function () { return -1; }) : []; }
// 39 JEUX : une carte à trois critères
var ks = Object.keys(D.jeux); eq(ks.length, 40, "40 JEUX");
ks.forEach(function (k, i) { var j = D.jeux[k], c = j.cartes[0]; ok(k === String(i + 1), "ordre " + k);
  ok(j.titre && j.court && j.court.length <= 16 && j.mode && D.zones[j.zone], k + " champs"); ok(j.cartes.length === 1 && c.t === "oral" && c.grille.length === 3, k + " carte à 3 critères");
  eq(P.score(c, best(c)).pts, 3, k + " 3 critères = 3 pts"); eq(P.score(c, [true, false, true]).pts, 2, k + " 2 pts"); eq(P.score(c, []).pts, 0, k + " rien = 0");
  ok(c.grille.every(function (g) { return g.length > 8 && g.length < 90; }), k + " critères lisibles"); ok(c.expl.length > 20, k + " erreur fréquente");
  ok(!/5\.\d/.test(j.titre + j.regle + c.grille.join("")), k + " pas de 5.x"); ok(D.lecture.fiches[k] && D.lecture.fiches[k].obj && D.lecture.fiches[k].ex.length === 3, k + " fiche de lecture"); });
// banque de questions rapides (anciens quiz) : Piège, Duel, Relecture
var B = D.pieges; ok(B.cartes.length >= 300, "banque " + B.cartes.length); var ids = {};
B.cartes.forEach(function (c) { ok(!ids[c.id], "id unique " + c.id); ids[c.id] = 1; ok(["choix", "multi", "assoc", "trous"].indexOf(c.t) >= 0, "type " + c.t);
  eq(P.score(c, best(c)).pts, 3, c.id + " modèle = 3 pts"); eq(P.score(c, empty(c)).pts, 0, c.id + " vide = 0"); ok(c.expl && c.expl.length > 20, c.id + " correction");
  if (c.t === "choix") { ok(c.opts.length === 4 && c.ok >= 0 && c.ok < 4 && new Set(c.opts).size === 4, c.id + " 4 options distinctes"); }
  if (c.t === "multi") ok(c.oks.length >= 1 && c.oks.length < c.opts.length, c.id + " multi cohérent"); });
var ch = B.cartes.filter(function (c) { return c.t === "choix"; }), pos = [0, 0, 0, 0], lg = 0;
ch.forEach(function (c) { pos[c.ok]++; var L = c.opts.map(function (o) { return o.length; }), m = Math.max.apply(0, L); if (L[c.ok] === m && L.filter(function (x) { return x === m; }).length === 1) lg++; });
pos.forEach(function (p, i) { ok(p / ch.length <= 0.35, "position " + "ABCD"[i] + " trop fréquente : " + pos); }); ok(lg / ch.length <= 0.35, "bonne réponse la plus longue : " + (lg / ch.length).toFixed(2));
var m = B.cartes.filter(function (c) { return c.t === "multi" && c.oks.length >= 2; })[0]; var half = m.oks.slice(0, 1); ok(P.score(m, half).pts < 3 && P.score(m, half).pts >= 0, "multi partiel");
ok(P.score(m, m.opts.map(function (o, i) { return i; })).pts <= 1, "tout cocher n'est pas payant");
// règles de déplacement
eq(P.move(0), -1, "0 pt = recul"); eq(P.move(2), 2, "2 pts"); eq(P.advance(0, -1, 31), 0, "plancher case 0"); eq(P.advance(30, 3, 31), 31, "plafond"); eq(P.advance(60, 3, 62), 62, "arrivée 62");
eq([0, 1, 2, 3].map(P.betDelta), [-1, -1, 0, 1], "pari");
// plateau
eq(D.cases.length, 63, "63 cases"); eq(D.cases[0].type, "depart", "départ"); eq(D.cases[31].type, "gate", "mi-parcours"); eq(D.cases[62].type, "exam", "arrivée");
var types = {}; D.cases.forEach(function (c) { types[c.type] = (types[c.type] || 0) + 1; }); eq(types.jeu, 40, "40 cases JEU"); eq(types.outil, 7, "7 cases Outil"); eq(types.aleas, 4, "4 aléas"); eq(types.piege, 4, "4 pièges"); eq(types.duel, 3, "3 duels"); eq(types.pairs, 2, "2 relectures");
var jc = D.caps.jeuCase; eq(Object.keys(jc).length, 40, "case de chaque JEU"); ok(ks.every(function (k, i) { return i === 0 || jc[k] > jc[ks[i - 1]]; }), "cases JEU croissantes");
eq(D.outils.length, 16, "16 outils"); D.outils.forEach(function (o) { ok(D.jeux[o.jeu], "outil sur un JEU existant " + o.id); ok(o.aide && o.aide.rappel, "aide " + o.id); });
// assoc : jamais l'ordre de la correction (1000 tirages)
var ca = B.cartes.filter(function (c) { return c.t === "assoc"; }), fixed = 0, same = 0, firstPos = {};
for (var s = 0; s < 1000; s++) { var c = ca[s % ca.length], o = P.displayOrder(c, "seed" + s); var id = o.every(function (v, i) { return c.items[v].ok === i; }) || o.every(function (v, i) { return i === 0 || c.items[v].ok >= c.items[o[i - 1]].ok; }); if (id) same++; var f = 0; o.forEach(function (v, i) { if (c.items[v].ok === i) f++; }); if (f > 1) fixed++; firstPos[o[0]] = 1; }
ok(same === 0, "assoc jamais l'ordre de la correction : " + same); ok(fixed === 0, "assoc au plus un item à sa place : " + fixed);
console.log(bad ? bad + " échec(s) sur " + n : "plateau : " + n + " vérifications, tout passe");
