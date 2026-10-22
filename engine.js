/* © 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. — Moteur de jeu (pur, sans réseau) */
(function (root) {
  var COLORS = [
    { id: "bleu", nom: "Bleu", hex: "#3B6FD8" }, { id: "vert", nom: "Vert", hex: "#2E9E6B" },
    { id: "orange", nom: "Orange", hex: "#F28C28" }, { id: "rouge", nom: "Rouge", hex: "#D93636" }, { id: "rose", nom: "Rose", hex: "#E86AA6" }
  ];
  var TITRES = [[0, "Communicant en herbe"], [0.4, "Chargé de communication"], [0.65, "Directeur de la communication"], [0.85, "Porte-parole de l'année"]];
  function titre(score, max) {
    var r = max > 0 ? score / max : 0, t = TITRES[0][1];
    TITRES.forEach(function (x) { if (r >= x[0]) t = x[1]; });
    return t;
  }
  function shuffle(a, rnd) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor((rnd || Math.random)() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* items : [{id, titre, contexte, q, options:[txt], scores:[n], expl:[txt] | expl:txt, bonne}] */
  function itemsQuiz(quiz, n, rnd) {
    var fams = {}; quiz.forEach(function (q) { (fams[q.fam] = fams[q.fam] || []).push(q); });
    var keys = Object.keys(fams).sort(), pool = [];
    keys.forEach(function (k) { fams[k] = shuffle(fams[k], rnd); });
    var i = 0; while (pool.length < Math.min(n, quiz.length)) {
      var k = keys[i % keys.length]; if (fams[k].length) pool.push(fams[k].shift()); i++;
    }
    return shuffle(pool, rnd).map(function (q) {
      return { id: q.id, titre: q.famille + " · " + q.pts + " pt" + (q.pts > 1 ? "s" : ""), contexte: "", q: q.q, options: q.options,
        scores: q.options.map(function (_, k) { return k === q.bonne ? q.pts : 0; }), expl: q.expl, bonne: q.bonne };
    });
  }
  function itemsCrise(injects) {
    var out = [];
    injects.forEach(function (inj) {
      inj.questions.forEach(function (q, j) {
        var sc = q.options.map(function (o) { return o[1]; }), best = sc.indexOf(Math.max.apply(null, sc));
        out.push({ id: inj.id + "-" + (j + 1), titre: inj.repere + " · " + inj.titre, contexte: inj.contexte, q: q.q,
          options: q.options.map(function (o) { return o[0]; }), scores: sc, expl: q.options.map(function (o) { return o[2]; }), bonne: best });
      });
    });
    return out;
  }
  function create(mode, items, secs) {
    return { mode: mode, items: items, idx: -1, phase: "lobby", teams: {}, order: [], answers: {}, secs: secs || 45, deadline: null, last: null,
             max: items.reduce(function (s, it) { return s + Math.max.apply(null, it.scores); }, 0) };
  }
  function join(st, name, teamId) {
    if (teamId && st.teams[teamId]) return st.teams[teamId];
    if (st.order.length >= 5 || st.phase !== "lobby") return null;
    var used = st.order.map(function (id) { return st.teams[id].color.id; });
    var color = COLORS.filter(function (c) { return used.indexOf(c.id) < 0; })[0];
    var id = "t" + (st.order.length + 1) + Math.random().toString(36).slice(2, 6);
    st.teams[id] = { id: id, name: (name || "Équipe").slice(0, 24), color: color, score: 0, hist: [] };
    st.order.push(id); return st.teams[id];
  }
  function start(st, now) { if (!st.order.length) return false; st.idx = 0; st.phase = "question"; st.answers = {}; st.deadline = now + st.secs * 1000; return true; }
  function answer(st, teamId, choice) {
    if (st.phase !== "question" || !st.teams[teamId]) return false;
    if (choice < 0 || choice >= st.items[st.idx].options.length) return false;
    st.answers[teamId] = choice; return true;
  }
  function allAnswered(st) { return st.order.every(function (id) { return st.answers[id] !== undefined; }); }
  function reveal(st) {
    if (st.phase !== "question") return false;
    var it = st.items[st.idx], res = {};
    st.order.forEach(function (id) {
      var a = st.answers[id], pts = a === undefined ? 0 : it.scores[a];
      st.teams[id].score += pts; st.teams[id].hist.push(pts); res[id] = { choix: a, pts: pts };
    });
    st.last = res; st.phase = "reveal"; return true;
  }
  function next(st, now) {
    if (st.phase !== "reveal") return false;
    if (st.idx + 1 >= st.items.length) { st.phase = "end"; return true; }
    st.idx++; st.phase = "question"; st.answers = {}; st.last = null; st.deadline = now + st.secs * 1000; return true;
  }
  function ranking(st) {
    return st.order.map(function (id) { return st.teams[id]; }).sort(function (a, b) { return b.score - a.score; })
      .map(function (t) { return { id: t.id, name: t.name, color: t.color, score: t.score, titre: titre(t.score, st.max) }; });
  }
  /* Vue publique envoyée aux équipes : ni bonnes réponses ni explications avant la révélation */
  function view(st) {
    var it = st.idx >= 0 ? st.items[st.idx] : null, v = {
      mode: st.mode, phase: st.phase, idx: st.idx, total: st.items.length, deadline: st.deadline, max: st.max,
      teams: st.order.map(function (id) { var t = st.teams[id]; return { id: id, name: t.name, color: t.color, score: t.score, repondu: st.answers[id] !== undefined }; }),
      ranking: st.phase === "end" ? ranking(st) : null, item: null, reveal: null };
    if (it && st.phase !== "end") {
      v.item = { id: it.id, titre: it.titre, contexte: it.contexte, q: it.q, options: it.options };
      if (st.phase === "reveal") v.reveal = { bonne: it.bonne, scores: it.scores, expl: it.expl, res: st.last };
    }
    return v;
  }
  var api = { COLORS: COLORS, create: create, join: join, start: start, answer: answer, allAnswered: allAnswered, reveal: reveal, next: next,
              view: view, ranking: ranking, itemsQuiz: itemsQuiz, itemsCrise: itemsCrise, titre: titre, shuffle: shuffle };
  if (typeof module !== "undefined") module.exports = api; else root.Engine = api;
})(this);
