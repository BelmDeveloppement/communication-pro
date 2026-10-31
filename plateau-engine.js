/* © 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. Créé avec l'aide de Claude (Anthropic), relu par l'auteur.
   Moteur du plateau « 5 · La route de l'état de l'art » (testable sous Node) : notation des cartes, déplacement, ordre d'affichage. */
(function (root) {
  "use strict";
  function norm(s) { return String(s || ""); }
  function seedRand(seed) { var x = 0; seed = String(seed); for (var i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) >>> 0; return function () { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; }; }
  function shuffle(a, seed) { var r = seedRand(seed), b = a.slice(); for (var i = b.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
  /* Note une réponse (0 à 3 points).
     choix : index ; multi : tableau d'index cochés ; assoc : un index d'étiquette par item (-1 si vide) ;
     trous : un index d'option par trou ; texte : chaîne ; oral : tableau de booléens. */
  function score(card, ans) {
    var pts = 0, detail = [];
    if (card.t === "choix") { var ok = ans === card.ok; pts = ok ? 3 : 0; detail.push({ ok: ok, lab: ok ? "Bonne réponse : " + card.opts[card.ok] : "Réponse attendue : " + card.opts[card.ok] }); }
    else if (card.t === "multi") {
      var picks = Array.isArray(ans) ? ans : [], hits = picks.filter(function (i) { return card.oks.indexOf(i) >= 0; }).length, fp = picks.length - hits;
      pts = Math.round(3 * Math.max(0, hits - fp) / card.oks.length);
      card.opts.forEach(function (o, i) { var should = card.oks.indexOf(i) >= 0, did = picks.indexOf(i) >= 0; detail.push({ ok: should === did, lab: (should ? "À cocher : " : "À laisser vide : ") + o }); });
    } else if (card.t === "assoc") {
      var good = 0; card.items.forEach(function (it, i) { var ok = !!ans && ans[i] === it.ok; if (ok) good++; detail.push({ ok: ok, lab: it.txt + " → " + card.labels[it.ok] }); });
      pts = Math.round(3 * good / card.items.length);
    } else if (card.t === "trous") {
      card.slots.forEach(function (s, i) { var ok = !!ans && ans[i] === s.ok; if (ok) pts++; detail.push({ ok: ok, lab: s.lab + " : " + s.opts[s.ok] }); }); pts = Math.min(3, pts);
    } else if (card.t === "texte") {
      var t = norm(ans); card.checks.forEach(function (c) { var ok = new RegExp(c.re, c.f === undefined ? "i" : c.f).test(t); if (ok) pts++; detail.push({ ok: ok, lab: c.lab }); }); pts = Math.min(3, pts);
    } else if (card.t === "oral") {
      var n = 0; (ans || []).forEach(function (v, i) { if (v) n++; detail.push({ ok: !!v, lab: card.grille[i] }); });
      card.grille.forEach(function (g, i) { if (!ans || i >= ans.length) detail.push({ ok: false, lab: g }); });
      pts = Math.min(3, n);
    }
    return { pts: pts, detail: detail };
  }
  /* Règle du recul : 0 point = reculer d'une case ; 1 à 3 points = avancer d'autant. */
  function move(pts) { return pts <= 0 ? -1 : pts; }
  /* Pari : 3 points = +1 case ; 0 ou 1 point = −1 case ; 2 points = 0. */
  function betDelta(pts) { return pts >= 3 ? 1 : pts <= 1 ? -1 : 0; }
  /* Nouvelle position : jamais sous la case 0, jamais au-delà de lim (case 31 tant que le niveau 2 est fermé). */
  function advance(pos, mv, lim) { return Math.max(0, Math.min(pos + mv, lim)); }
  /* Choisit une carte pas encore vue par l'équipe pour ce jeu (repart de zéro quand toutes sont vues). */
  function pickCard(jeu, seen, seed) {
    var ids = jeu.cartes.map(function (c) { return c.id; }), left = ids.filter(function (i) { return (seen || []).indexOf(i) < 0; });
    if (!left.length) { left = ids; seen = []; }
    var id = shuffle(left, seed + ":" + (seen || []).length)[0];
    return { card: jeu.cartes.filter(function (c) { return c.id === id; })[0], reset: left === ids && (seen || []).length > 0 };
  }
  /* Ordre d'affichage propre à un joueur. Jamais l'ordre du corrigé :
     assoc : les items ne s'affichent jamais triés par étiquette, ni avec plus d'un item à sa place « naturelle » ;
     choix / multi : options mélangées ; trous : options mélangées dans chaque trou. */
  function displayOrder(card, seed) {
    var n, ix, k = 0;
    if (card.t === "choix" || card.t === "multi") return shuffle(card.opts.map(function (o, i) { return i; }), seed + ":o");
    if (card.t === "trous") return card.slots.map(function (s, si) { return shuffle(s.opts.map(function (o, i) { return i; }), seed + ":t" + si); });
    if (card.t === "assoc") {
      n = card.items.length; ix = card.items.map(function (it, i) { return i; });
      for (;;) {
        var o = shuffle(ix, seed + ":a" + k), sorted = true, fixed = 0;
        for (var i = 0; i < n; i++) { if (i > 0 && card.items[o[i]].ok < card.items[o[i - 1]].ok) sorted = false; if (card.items[o[i]].ok === i) fixed++; }
        var desc = true; for (var j = 1; j < n; j++) if (card.items[o[j]].ok > card.items[o[j - 1]].ok) desc = false;
        if (!sorted && !desc && fixed <= 1) return o;
        k++; if (k > 400) return o;
      }
    }
    return null;
  }
  var api = { score: score, move: move, betDelta: betDelta, advance: advance, pickCard: pickCard, shuffle: shuffle, displayOrder: displayOrder, seedRand: seedRand };
  if (typeof module !== "undefined") module.exports = api; else root.PEngine = api;
})(typeof window !== "undefined" ? window : this);
