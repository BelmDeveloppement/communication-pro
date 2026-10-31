/* © 2026 SAS BELM DEVELOPPEMENT. Tests du contenu et du moteur : notation, équilibrage des réponses, ordre des items. */
var P = require("./plateau-engine.js"), fs = require("fs"), vm = require("vm");
var ctx = { window: {} }; vm.runInNewContext(fs.readFileSync("plateau-data.js", "utf8"), ctx); var D = ctx.window.PLATEAU_DATA, bad = 0, n = 0;
function ok(c, m) { n++; if (!c) { bad++; console.log("ÉCHEC", m); } }
function eq(a, b, m) { ok(JSON.stringify(a) === JSON.stringify(b), m + " " + JSON.stringify(a) + " ≠ " + JSON.stringify(b)); }
function best(c) { return c.t === "choix" ? c.ok : c.t === "multi" ? c.oks : c.t === "assoc" ? c.items.map(function (i) { return i.ok; }) : c.t === "trous" ? c.slots.map(function (s) { return s.ok; }) : c.t === "texte" ? c.modele : c.grille.map(function () { return true; }); }
function empty(c) { return c.t === "choix" ? -1 : c.t === "multi" ? [] : c.t === "assoc" ? c.items.map(function () { return -1; }) : c.t === "trous" ? c.slots.map(function () { return -1; }) : c.t === "texte" ? "" : []; }
var all = Object.keys(D.jeux).map(function (k) { return [k, D.jeux[k]]; }).concat([["P", D.pieges]]);
ok(Object.keys(D.jeux).length === 16, "16 jeux");
all.forEach(function (a) { var k = a[0], j = a[1];
  ok(j.cartes.length >= (k === "5.8" ? 16 : 12), k + " nombre de cartes " + j.cartes.length);
  var ids = {}; j.cartes.forEach(function (c) { ok(!ids[c.id], k + " id unique " + c.id); ids[c.id] = 1;
    eq(P.score(c, best(c)).pts, 3, k + "/" + c.id + " modèle = 3 pts"); eq(P.score(c, empty(c)).pts, 0, k + "/" + c.id + " vide = 0");
    ok(c.expl && c.expl.length > 20, k + "/" + c.id + " correction présente");
    if (c.t === "choix") { ok(c.opts.length === 4 && c.ok >= 0 && c.ok < 4, k + "/" + c.id + " 4 options"); ok(new Set(c.opts).size === 4, k + "/" + c.id + " options distinctes"); }
    if (c.t === "multi") ok(c.oks.length >= 1 && c.oks.length < c.opts.length, k + "/" + c.id + " multi cohérent");
  });
  var ch = j.cartes.filter(function (c) { return c.t === "choix"; });
  if (ch.length >= 12) { var pos = [0, 0, 0, 0], lg = 0; ch.forEach(function (c) { pos[c.ok]++; var L = c.opts.map(function (o) { return o.length; }), m = Math.max.apply(0, L); if (L[c.ok] === m && L.filter(function (x) { return x === m; }).length === 1) lg++; });
    pos.forEach(function (p, i) { ok(p / ch.length <= 0.35, k + " position " + "ABCD"[i] + " trop fréquente : " + pos); });
    ok(lg / ch.length <= 0.35, k + " bonne réponse la plus longue trop souvent : " + (lg / ch.length).toFixed(2)); }
  var mu = j.cartes.filter(function (c) { return c.t === "multi"; });
  if (mu.length >= 6) { var lg2 = 0; mu.forEach(function (c) { var g = c.oks.map(function (i) { return c.opts[i].length; }), b = c.opts.filter(function (o, i) { return c.oks.indexOf(i) < 0; }).map(function (o) { return o.length; }); if (g.reduce(function (x, y) { return x + y; }) / g.length > b.reduce(function (x, y) { return x + y; }) / b.length) lg2++; });
    ok(lg2 / mu.length <= 0.75, k + " multi : justes plus longues trop souvent " + (lg2 / mu.length).toFixed(2)); }
});
// partiel multi
var m = D.jeux["5.9"].cartes.filter(function (c) { return c.t === "multi" && c.oks.length >= 2; })[0];
var half = m.oks.slice(0, 1); ok(P.score(m, half).pts < 3 && P.score(m, half).pts >= 0, "multi partiel");
var wrong = m.opts.map(function (o, i) { return i; }); ok(P.score(m, wrong).pts <= 1, "tout cocher n'est pas payant");
// règles de déplacement
eq(P.move(0), -1, "0 pt = recul"); eq(P.move(2), 2, "2 pts"); eq(P.advance(0, -1, 31), 0, "plancher case 0"); eq(P.advance(30, 3, 31), 31, "plafond porte 31"); eq(P.advance(60, 3, 62), 62, "arrivée 62");
eq([0, 1, 2, 3].map(P.betDelta), [-1, -1, 0, 1], "pari");
// plateau
eq(D.cases.length, 63, "63 cases"); eq(D.cases[0].type, "depart", "départ"); eq(D.cases[31].type, "gate", "porte 31"); eq(D.cases[62].type, "exam", "examen");
var types = {}; D.cases.forEach(function (c) { types[c.type] = (types[c.type] || 0) + 1; }); ok(types.aleas >= 6 && types.outil >= 6 && types.piege >= 4 && types.duel >= 2 && types.pairs >= 2, "cases à effet " + JSON.stringify(types));
eq(D.outils.length, 16, "16 outils"); var oj = {}; D.outils.forEach(function (o) { oj[o.jeu] = 1; }); eq(Object.keys(oj).length, 16, "un outil par jeu");
// 5.4 : jamais l'ordre de la correction (1000 tirages)
var c4 = D.jeux["5.4"].cartes, fixed = 0, same = 0, tot = 0, firstPos = {};
for (var s = 0; s < 1000; s++) { var c = c4[s % c4.length], o = P.displayOrder(c, "seed" + s); tot++; var id = o.every(function (v, i) { return c.items[v].ok === i; }) || o.every(function (v, i) { return i === 0 || c.items[v].ok >= c.items[o[i - 1]].ok; }); if (id) same++; var f = 0; o.forEach(function (v, i) { if (c.items[v].ok === i) f++; }); if (f > 1) fixed++; firstPos[o[0]] = (firstPos[o[0]] || 0) + 1; ok(o.slice().sort(function (a, b) { return a - b; }).every(function (v, i) { return v === i; }), "permutation valide"); }
ok(same === 0, "5.4 jamais l'ordre de la correction : " + same); ok(fixed === 0, "5.4 au plus un item à sa place : " + fixed); ok(Object.keys(firstPos).length >= 5, "5.4 le premier item varie " + JSON.stringify(firstPos));
var s2 = []; for (var i = 0; i < 12; i++) { var r = P.pickCard({ cartes: D.jeux["5.1"].cartes.filter(function (c) { return !c.extra; }) }, s2, "x"); s2.push(r.card.id); } eq(new Set(s2).size, 12, "12 cartes de base sans doublon");
console.log(bad ? bad + " échec(s) sur " + n : "plateau : " + n + " vérifications, tout passe");
