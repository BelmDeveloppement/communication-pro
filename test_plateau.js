var P = require("./plateau-engine.js"), fs = require("fs"), vm = require("vm");
var ctx = { window: {} }; vm.runInNewContext(fs.readFileSync("plateau-data.js", "utf8"), ctx); var D = ctx.window.PLATEAU_DATA, bad = 0;
function eq(a, b, m) { if (JSON.stringify(a) !== JSON.stringify(b)) { bad++; console.log("ÉCHEC", m, JSON.stringify(a), JSON.stringify(b)); } }
// chaque carte : la réponse modèle obtient 3 points, une réponse vide 0
Object.keys(D.jeux).forEach(function (k) { D.jeux[k].cartes.forEach(function (c) {
  var good, empty;
  if (c.t === "choix") { good = c.ok; empty = -1; } else if (c.t === "assoc") { good = c.items.map(function (i) { return i.ok; }); empty = c.items.map(function () { return -1; }); }
  else if (c.t === "texte") { good = c.modele; empty = ""; } else { good = c.grille.map(function () { return true; }); empty = []; }
  eq(P.score(c, good).pts, 3, k + "/" + c.id + " modèle"); eq(P.score(c, empty).pts, 0, k + "/" + c.id + " vide");
}); });
eq(P.advance(8, 3, 1, D.caps), 11, "dépassement de la fin d'acte"); eq(P.advance(28, 3, 3, D.caps), 31, "arrivée"); eq(P.advance(10, 2, 1, D.caps), 12, "avance du nombre annoncé");
var ev = D.cases.filter(function (c) { return c.type === "event"; }); eq(ev.length, 6, "6 événements");
var l = P.landing(D.cases, D.events, ev[1].n, 3, D.caps); eq(l.pos, ev[1].n - 1, "recul"); eq(P.landing(D.cases, D.events, 1, 3, D.caps), null, "pas d'événement");
var s = []; for (var i = 0; i < 8; i++) { var r = P.pickCard(D.jeux["5.1"], s, "x"); s.push(r.card.id); } eq(s.slice().sort().length, 8, "8 cartes"); eq(new Set(s).size, 8, "sans doublon");
console.log(bad ? bad + " échec(s)" : "plateau : tous les tests passent");
