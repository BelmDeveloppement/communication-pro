/* © 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. Moteur du plateau « 5 · La route de l'état de l'art » (testable sous Node). */
(function (root) {
  "use strict";
  function norm(s) { return String(s || ""); }
  function seedRand(seed) { var x = 0; for (var i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) >>> 0; return function () { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; }; }
  function shuffle(a, seed) { var r = seedRand(seed), b = a.slice(); for (var i = b.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = b[i]; b[i] = b[j]; b[j] = t; } return b; }
  /* Note une réponse. ans : choix → index ; assoc → tableau d'index (un par item, -1 si vide) ; texte → chaîne ; oral → tableau de booléens. */
  function score(card, ans) {
    var pts = 0, detail = [];
    if (card.t === "choix") { var ok = ans === card.ok; pts = ok ? 3 : 0; detail.push({ ok: ok, lab: ok ? "Bonne réponse" : "Réponse attendue : " + card.opts[card.ok] }); }
    else if (card.t === "assoc") {
      var good = 0; card.items.forEach(function (it, i) { var ok = ans && ans[i] === it.ok; if (ok) good++; detail.push({ ok: ok, lab: it.txt + " → " + card.labels[it.ok] }); });
      pts = Math.round(3 * good / card.items.length);
    } else if (card.t === "texte") {
      var t = norm(ans); card.checks.forEach(function (c) { var ok = new RegExp(c.re, c.f === undefined ? "i" : c.f).test(t); if (ok) pts++; detail.push({ ok: ok, lab: c.lab }); }); pts = Math.min(3, pts);
    } else if (card.t === "oral") {
      var n = 0; (ans || []).forEach(function (v, i) { if (v) n++; detail.push({ ok: !!v, lab: card.grille[i] }); });
      card.grille.forEach(function (g, i) { if (!ans || i >= ans.length) detail.push({ ok: false, lab: g }); });
      pts = Math.min(3, n);
    }
    return { pts: pts, detail: detail };
  }
  function acteOf(pos) { return pos <= 10 ? 1 : pos <= 20 ? 2 : 3; }
  function capFor(acteOuvert, caps) { return caps[Math.min(2, Math.max(0, acteOuvert - 1))]; }
  /* Avance de pts cases sans dépasser la fin de l'acte ouvert. Renvoie la nouvelle position. */
  function advance(pos, pts, acteOuvert, caps) { return Math.min(pos + pts, capFor(acteOuvert, caps)); }
  /* Effet d'une case événement atteinte. */
  function landing(cases, events, pos, acteOuvert, caps) {
    var c = cases[pos]; if (!c || c.type !== "event") return null;
    var ev = events[c.ev]; var np = Math.max(0, Math.min(pos + (ev.move || 0), capFor(acteOuvert, caps)));
    return { ev: ev, pos: np, rejoue: !!ev.rejoue };
  }
  /* Choisit une carte pas encore vue par l'équipe pour ce jeu (repart de zéro quand toutes sont vues). */
  function pickCard(jeu, seen, seed) {
    var ids = jeu.cartes.map(function (c) { return c.id; }), left = ids.filter(function (i) { return (seen || []).indexOf(i) < 0; });
    if (!left.length) { left = ids; seen = []; }
    var id = shuffle(left, seed + ":" + (seen || []).length)[0];
    return { card: jeu.cartes.filter(function (c) { return c.id === id; })[0], reset: left === ids && (seen || []).length > 0 };
  }
  var api = { score: score, advance: advance, landing: landing, pickCard: pickCard, shuffle: shuffle, acteOf: acteOf, capFor: capFor };
  if (typeof module !== "undefined") module.exports = api; else root.PEngine = api;
})(typeof window !== "undefined" ? window : this);
