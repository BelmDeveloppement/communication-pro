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
    } else if (card.t === "saisie") { return scoreSaisie(card, ans);
    } else if (card.t === "oral") {
      var n = 0; (ans || []).forEach(function (v, i) { if (v) n++; detail.push({ ok: !!v, lab: card.grille[i] }); });
      card.grille.forEach(function (g, i) { if (!ans || i >= ans.length) detail.push({ ok: false, lab: g }); });
      pts = Math.min(3, n);
    }
    return { pts: pts, detail: detail };
  }

  /* ---------- Cartes « saisie » : le joueur saisit, l'application contrôle ----------
     champ.k : sel (liste déroulante), multi (cases à cocher), num (nombre dans une fourchette), txt (texte contrôlé),
     url (adresse), paires (lignes « texte + choix »), liste (un choix par ligne), info (non noté).
     champ.c : numéro du critère (0 à 2) auquel le champ contribue ; -1 = non noté. Un critère est acquis quand la moyenne de ses champs atteint 0,75. */
  function fold(s) { return String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  function nwords(s) { var m = String(s || "").match(/[0-9A-Za-zÀ-ÿ]+(?:['’\-][0-9A-Za-zÀ-ÿ]+)*/g); return m ? m.length : 0; }
  function numOf(s) { var t = String(s == null ? "" : s).replace(/\s/g, "").replace(",", ".").replace(/[^\d.\-]/g, ""); var x = parseFloat(t); return isNaN(x) ? null : x; }
  function arr(x) { return Array.isArray(x) ? x : [x]; }
  function optTxt(f, i) { return i >= 0 && f.opts && f.opts[i] != null ? f.opts[i] : "(vide)"; }
  function expTxt(f) {
    if (f.k === "sel") return arr(f.ok).map(function (i) { return f.opts[i]; }).join(" ou ");
    if (f.k === "multi") return f.oks.map(function (i) { return f.opts[i]; }).join(" ; ");
    if (f.k === "liste") return f.items.map(function (it) { return it.txt + " → " + f.opts[arr(it.ok)[0]]; }).join(" ; ");
    if (f.k === "paires") return (f.ex || []).map(function (r) { return r[0] + " → " + f.opts[r[1]]; }).join(" ; ");
    return f.ex != null ? String(f.ex) : "";
  }
  function gotTxt(f, v) {
    if (f.k === "sel") return optTxt(f, v);
    if (f.k === "multi") { var a = (v || []).map(function (i) { return f.opts[i]; }).filter(Boolean); return a.length ? a.join(" ; ") : "(rien coché)"; }
    if (f.k === "liste") return f.items.map(function (it, i) { return it.txt + " → " + optTxt(f, v && v[i] != null ? v[i] : -1); }).join(" ; ");
    if (f.k === "paires") return (v || []).map(function (r) { return (r && r.t ? r.t : "?") + " → " + optTxt(f, r && r.s != null ? r.s : -1); }).join(" ; ") || "(vide)";
    var s = String(v == null ? "" : v).trim(); return s || "(vide)";
  }
  function formOk(f, s) { var t = String(s == null ? "" : s).trim(); if (t.length < (f.min == null ? 2 : f.min)) return false; if (f.minw && nwords(t) < f.minw) return false; if (f.maxw && nwords(t) > f.maxw) return false; return true; }
  function checkField(f, v, A) {
    A = A || [];
    var r = 0, note = "";
    if (f.k === "sel") r = arr(f.ok).indexOf(v) >= 0 ? 1 : 0;
    else if (f.k === "multi") {
      var picks = Array.isArray(v) ? v : [], bad = f.bad || f.opts.map(function (o, i) { return i; }).filter(function (i) { return f.oks.indexOf(i) < 0; });
      var hits = picks.filter(function (i) { return f.oks.indexOf(i) >= 0; }).length, fp = picks.filter(function (i) { return bad.indexOf(i) >= 0; }).length;
      r = Math.max(0, (hits - fp) / f.oks.length);
    } else if (f.k === "num") { var x = numOf(v); r = x != null && x >= f.lo && x <= f.hi ? 1 : 0; if (r && f.gte != null) { var y = numOf(A[f.gte]); if (y != null && x < y) r = 0; } if (r && f.lt != null) { var z = numOf(A[f.lt]); if (z != null && x >= z) r = 0; } }
    else if (f.k === "txt") {
      var s = String(v == null ? "" : v);
      if (!formOk(f, s)) r = 0;
      else if (f.ovl != null && !fold(A[f.ovl] || "").split(/[^a-z0-9]+/).some(function (w) { return w.length >= 5 && fold(s).indexOf(w) >= 0; })) r = 0;
      else if (f.res && f.res.length) { var m = f.res.filter(function (re) { return new RegExp(re, "i").test(fold(s)); }).length, need = f.need || f.res.length; r = Math.min(1, m / need); }
      else { r = 1; if (f.soft) note = "forme contrôlée ; contenu à valider par l'enseignant"; }
    } else if (f.k === "url") {
      var u = String(v == null ? "" : v).trim(), mm = /^(https?:\/\/)?((?:[a-z0-9-]+\.)+[a-z]{2,})(?::\d+)?(\/\S*)?$/i.exec(u);
      if (!mm) r = 0; else { r = !f.dom || new RegExp(f.dom, "i").test(mm[2]) ? 1 : 0; if (r && f.path && !new RegExp(f.path, "i").test(mm[3] || "")) r = 0; }
    } else if (f.k === "paires") {
      var rows = Array.isArray(v) ? v : [], tot = 0, unk = 0;
      for (var i = 0; i < f.n; i++) {
        var q = rows[i] || {}, t = String(q.t || "").trim();
        if (t.length < 2 || q.s == null || q.s < 0) continue;
        var hit = null; (f.dico || []).forEach(function (d) { if (hit == null && new RegExp(d[0], "i").test(fold(t))) hit = d[1]; });
        if (hit == null) { tot += 0.5; unk++; } else if (arr(hit).indexOf(q.s) >= 0) tot += 1;
      }
      r = tot / f.n; if (unk) note = unk + " verbe(s) non reconnu(s) : à valider par l'enseignant";
    } else if (f.k === "liste") { var g = 0; f.items.forEach(function (it, i) { if (v && arr(it.ok).indexOf(v[i]) >= 0) g++; }); r = g / f.items.length; }
    else if (f.k === "info") r = formOk(f, v) ? 1 : 0;
    return { f: r, note: note };
  }
  /* Rend une saisie exploitable même si le client envoie un format inattendu (jamais d'exception, texte borné). */
  function clean(f, v) {
    if (f.k === "sel") return typeof v === "number" && v === Math.floor(v) ? v : -1;
    if (f.k === "multi") return Array.isArray(v) ? v.filter(function (x) { return typeof x === "number"; }).slice(0, 40) : [];
    if (f.k === "liste") { var o = []; for (var i = 0; i < f.items.length; i++) o.push(Array.isArray(v) && typeof v[i] === "number" ? v[i] : -1); return o; }
    if (f.k === "paires") { var r = []; for (var j = 0; j < f.n; j++) { var q = Array.isArray(v) && v[j] && typeof v[j] === "object" ? v[j] : {}; r.push({ t: String(q.t == null ? "" : q.t).slice(0, 200), s: typeof q.s === "number" ? q.s : -1 }); } return r; }
    return typeof v === "string" ? v.slice(0, 4000) : typeof v === "number" ? String(v) : "";
  }
  function scoreSaisie(card, ans) {
    var A0 = Array.isArray(ans) ? ans : [], A = card.champs.map(function (f, i) { return clean(f, A0[i]); }), per = card.champs.map(function (f, i) { var c = checkField(f, A[i], A); return { f: f, i: i, r: c.f, note: c.note, got: gotTxt(f, A[i]) }; }), pts = 0, detail = [];
    card.grille.forEach(function (g, ci) {
      var mine = per.filter(function (x) { return x.f.c === ci; }), mean = mine.length ? mine.reduce(function (a, x) { return a + x.r; }, 0) / mine.length : 0, ok = mine.length > 0 && mean >= 0.75;
      if (ok) pts++;
      detail.push({ ok: ok, lab: g, sub: mine.map(function (x) { return { ok: x.r >= 0.75, part: x.r > 0 && x.r < 0.75, lab: x.f.lab, got: x.got, exp: expTxt(x.f), why: x.f.why || "", note: x.note }; }) });
    });
    return { pts: Math.min(3, pts), detail: detail };
  }
  /* Réponse parfaite (tests, mode simulation) : un champ par entrée de card.champs. */
  function modelAnswer(card) {
    return card.champs.map(function (f) {
      if (f.k === "sel") return arr(f.ok)[0];
      if (f.k === "multi") return f.oks.slice();
      if (f.k === "liste") return f.items.map(function (it) { return arr(it.ok)[0]; });
      if (f.k === "paires") return (f.ex || []).map(function (r) { return { t: r[0], s: r[1] }; });
      return f.ex != null ? String(f.ex) : "";
    });
  }
  function saisieText(card, ans) { var A = Array.isArray(ans) ? ans : []; return card.champs.map(function (f, i) { return f.lab + " : " + gotTxt(f, A[i]); }).join("\n"); }
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
    if (card.t === "saisie") return card.champs.map(function (f, fi) { return f.opts && !f.fix ? shuffle(f.opts.map(function (o, i) { return i; }), seed + ":s" + fi) : f.opts ? f.opts.map(function (o, i) { return i; }) : null; });
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
  var api = { modelAnswer: modelAnswer, saisieText: saisieText, expTxt: expTxt, checkField: checkField, score: score, move: move, betDelta: betDelta, advance: advance, pickCard: pickCard, shuffle: shuffle, displayOrder: displayOrder, seedRand: seedRand };
  if (typeof module !== "undefined") module.exports = api; else root.PEngine = api;
})(typeof window !== "undefined" ? window : this);
