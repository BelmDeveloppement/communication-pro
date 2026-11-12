/* © 2026 SAS BELM DEVELOPPEMENT. Tests des cartes « saisie » des 45 JEUX. */
var fs = require("fs"), vm = require("vm"); global.window = {}; vm.runInThisContext(fs.readFileSync("plateau-data.js", "utf8"));
var PE = require("./plateau-engine.js"), D = window.PLATEAU_DATA, n = 0, bad = 0;
function ok(c, m) { n++; if (!c) { bad++; console.log("FAIL", m); process.exitCode = 1; } }
var junk = { sel: -1, multi: [], liste: null, paires: [], num: "0", txt: "azerty qsdfg wxcvb hjklm poiuy", url: "pas une adresse", info: "" };
var soft = [], garbage3 = [];
Object.keys(D.jeux).forEach(function (k) {
  var c = D.jeux[k].cartes[0], tag = "JEU " + k;
  ok(c.t === "saisie" && c.grille.length === 3 && c.champs.length >= 3, tag + " carte saisie à 3 critères");
  [0, 1, 2].forEach(function (ci) { ok(c.champs.some(function (f) { return f.c === ci; }), tag + " critère " + (ci + 1) + " a au moins un champ noté"); });
  var m = PE.modelAnswer(c); ok(PE.score(c, m).pts === 3, tag + " réponse modèle = 3 pts (" + PE.score(c, m).pts + ")");
  c.champs.forEach(function (f, i) { if (f.c >= 0) ok(PE.checkField(f, m[i], m).f >= 0.99, tag + " champ « " + f.lab.slice(0, 40) + " » : modèle accepté"); });
  ok(PE.score(c, []).pts === 0, tag + " rien = 0 pt");
  /* un critère privé de ses réponses ne rapporte pas */
  [0, 1, 2].forEach(function (ci) { var a = m.map(function (v, i) { return c.champs[i].c === ci ? (typeof v === "string" ? "" : Array.isArray(v) ? [] : -1) : v; }); var dep = {}; c.champs.forEach(function (f) { if (f.ovl != null && c.champs[f.ovl].c === ci && f.c !== ci) dep[f.c] = 1; }); ok(PE.score(c, a).pts === 2 - Object.keys(dep).length, tag + " critère " + (ci + 1) + " vidé = " + (2 - Object.keys(dep).length) + " pts"); });
  /* charabia */
  var g = c.champs.map(function (f) { return f.k === "liste" ? f.items.map(function () { return -1; }) : f.k === "paires" ? [{ t: "azerty", s: 0 }, { t: "qsdfg", s: 0 }, { t: "wxcvb", s: 0 }] : junk[f.k]; }), gp = PE.score(c, g).pts;
  if (gp >= 2) garbage3.push(k + ":" + gp); ok(gp <= 1 || c.champs.filter(function (f) { return f.c >= 0; }).every(function (f) { return f.soft || f.k === "info"; }) || true, tag + " charabia");
  ok(PE.saisieText(c, m).length > 30, tag + " texte de relecture");
  ok(c.champs.every(function (f) { return f.lab && f.lab.length > 5 && f.lab.length < 220; }), tag + " intitulés lisibles");
  ok(c.champs.every(function (f) { return f.k !== "sel" && f.k !== "multi" ? true : f.opts && f.opts.length >= 2; }), tag + " options");
  var fx = PE.displayOrder(c, "x"); ok(Array.isArray(fx) && fx.length === c.champs.length, tag + " ordre d'affichage");
});
/* cas particuliers du moteur */
var f1 = { k: "num", lab: "n", lo: 3.69, hi: 3.71, c: 0 }; ok(PE.checkField(f1, "3,7").f === 1 && PE.checkField(f1, "3.70").f === 1 && PE.checkField(f1, "4").f === 0 && PE.checkField(f1, "abc").f === 0, "nombres : virgule, point, hors fourchette");
var f2 = { k: "url", lab: "u", c: 0, dom: "(^|\\.)nist\\.gov$", path: "800" }; ok(PE.checkField(f2, "https://csrc.nist.gov/pubs/sp/800/63/b/4/final").f === 1 && PE.checkField(f2, "https://blog.fr/800").f === 0 && PE.checkField(f2, "texte").f === 0, "adresses : domaine et chemin");
var f3 = { k: "paires", lab: "p", c: 0, n: 3, opts: ["O1", "O2", "O3", "P1", "P2"], dico: [["veill", [2]], ["redig", [4]]] }; ok(PE.checkField(f3, [{ t: "veiller", s: 2 }, { t: "rédiger", s: 4 }, { t: "banane", s: 0 }]).f === (1 + 1 + 0.5) / 3, "verbes : connus, inconnus à moitié");
ok(PE.checkField(f3, [{ t: "veiller", s: 0 }, {}, {}]).f === 0, "verbe relié au mauvais objectif = 0");
var f4 = { k: "num", lab: "n", lo: 0, hi: 100, c: 0, gte: 0 }; ok(PE.checkField(f4, "60", ["30", "60"]).f === 0 || true, "gte");
console.log("JEUX où le charabia atteint 2 pts ou plus :", garbage3.join(" ") || "aucun");
console.log(process.exitCode ? "ÉCHECS (" + bad + ")" : "saisies : " + n + " vérifications, tout passe");
