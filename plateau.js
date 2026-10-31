/* © 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. Plateau « 5 · La route de l'état de l'art » : équipes (téléphone) et animateur. */
(function () {
  "use strict";
  var A = window.APP, h = A.h, mount = A.mount, LSget = A.LSget, LSset = A.LSset, BASE = A.BASE, D = window.PLATEAU_DATA, PE = window.PEngine;
  var COLS = ["#3B6FD8", "#2E9E6B", "#E9A400", "#E4572E", "#D6479B", "#1F2A5C", "#7A3FB5", "#0E8A9E"];
  var NS = "http://www.w3.org/2000/svg";
  var SEANCE_MIN = { 1: 30, 2: 30, 3: 40 };
  function mmss(ms) { var t = Math.max(0, Math.round(ms / 1000)); return Math.floor(t / 60) + ":" + ("0" + (t % 60)).slice(-2); }
  function teamCol(name) { var x = 0; String(name).split("").forEach(function (c) { x = (x * 31 + c.charCodeAt(0)) >>> 0; }); return COLS[x % COLS.length]; }
  function abbr(n) { var w = String(n || "?").replace(/^(les|le|la|l')\s*/i, "").trim(); return (w.slice(0, 2) || "?").replace(/^./, function (c) { return c.toUpperCase(); }); }
  function rnd(n) { return "s" + Math.random().toString(36).slice(2, 9) + (n || ""); }
  function q(params) { var o = {}, s = (location.hash.split("?")[1] || ""); s.split("&").forEach(function (p) { var a = p.split("="); if (a[0]) o[a[0]] = decodeURIComponent(a[1] || ""); }); return o; }
  function sv(tag, attrs, text) { var e = document.createElementNS(NS, tag); Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); }); if (text !== undefined) e.textContent = text; return e; }
  function zcol(c) { return c.type === "jeu" ? D.zones[c.zone].col : c.type === "event" ? "#7A3FB5" : c.type === "exam" ? "#1F2A5C" : "#5B6478"; }
  function caseLabel(c) { return c.type === "jeu" ? c.jeu : c.type === "event" ? "?" : c.type === "exam" ? "★" : "▶"; }

  /* ---------- Plateau 2D (SVG) ---------- */
  function boardSvg(pawns, opts) {
    opts = opts || {}; var s = sv("svg", { viewBox: "0 0 120 66", width: "100%", style: "background:#F3F5F9;border-radius:10px;display:block" }), pts = D.cases.map(function (c) { return c.x + "," + c.y; }).join(" ");
    s.appendChild(sv("polyline", { points: pts, fill: "none", stroke: "#B9C4E8", "stroke-width": 3, "stroke-linejoin": "round" }));
    [["1", 14], ["2", 33], ["3", 52]].forEach(function (a) { s.appendChild(sv("text", { x: 17, y: +a[1] - 8.6, "font-size": 2.6, fill: "#5B6478", "font-weight": 700 }, "Acte " + a[0] + " · " + D.actes[a[0]].nom + "  (jeux " + D.actes[a[0]].jeux.join(", ") + ")")); });
    D.cases.forEach(function (c) {
      var g = sv("g", {});
      g.appendChild(sv("circle", { cx: c.x, cy: c.y, r: c.type === "exam" || c.type === "depart" ? 4.2 : 3.6, fill: zcol(c), stroke: "#fff", "stroke-width": 0.6 }));
      g.appendChild(sv("text", { x: c.x, y: c.y + 0.6, "font-size": c.type === "jeu" ? 2.4 : 3, fill: "#fff", "text-anchor": "middle", "font-weight": 700 }, caseLabel(c)));
      g.appendChild(sv("text", { x: c.x, y: c.y + 6.2, "font-size": 2, fill: "#5B6478", "text-anchor": "middle" }, c.type === "depart" ? "Départ" : c.type === "exam" ? "Examen" : String(c.n)));
      s.appendChild(g);
    });
    var byPos = {};
    (pawns || []).forEach(function (p) { (byPos[p.pos] = byPos[p.pos] || []).push(p); });
    Object.keys(byPos).forEach(function (k) {
      var c = D.cases[+k]; if (!c) return;
      byPos[k].forEach(function (p, i) {
        var a = (i / byPos[k].length) * Math.PI * 2, r = byPos[k].length > 1 ? 2.4 : 0;
        var g = sv("g", {}); g.appendChild(sv("circle", { cx: c.x + Math.cos(a) * r, cy: c.y - 4.6 + Math.sin(a) * r, r: opts.big ? 2.6 : 2.2, fill: p.col, stroke: "#fff", "stroke-width": 0.5 }));
        g.appendChild(sv("text", { x: c.x + Math.cos(a) * r, cy: 0, y: c.y - 3.9 + Math.sin(a) * r, "font-size": 2.2, fill: "#fff", "text-anchor": "middle", "font-weight": 700 }, abbr(p.label)));
        s.appendChild(g);
      });
    });
    return s;
  }

  /* ---------- Pages d'accueil et règles ---------- */
  function entry() {
    var jeux = Object.keys(D.jeux);
    mount(h("h1", {}, "5 · La route de l'état de l'art"),
      h("p", { class: "meta" }, "Un plateau de 30 cases en trois actes. Chaque joueur répond sur son téléphone ou son ordinateur ; la table avance ensemble."),
      h("div", { class: "grid" }, h("a", { class: "tile", href: "#/j" }, h("b", {}, "Je suis un joueur"), h("div", { class: "meta" }, "Rejoindre la partie : prénom, numéro de table, code ROUTE")),
        h("a", { class: "tile f", href: "#/plateau/regles" }, h("b", {}, "Règles et jeux"), h("div", { class: "meta" }, jeux.length + " jeux : 5.1 à 5.8")),
        h("a", { class: "tile r", href: "#/plateau/demo" }, h("b", {}, "Partie démo en 3D"), h("div", { class: "meta" }, "Une partie simulée avec les vraies cartes, la roue et les pions (sans téléphones)"))),
      h("div", { class: "card" }, h("h2", {}, "Plateau physique à imprimer"), h("p", {}, h("a", { href: "Plateau_5_A2.pdf" }, "Plateau A2 (impression chez un imprimeur)"), " · ", h("a", { href: "Plateau_5_A3.pdf" }, "A3 (essai)"), " · ", h("a", { href: "Plateau_5_pions.pdf" }, "Pions à découper (A4)"))));
  }
  function rules() {
    mount(h("h1", {}, "Règles du plateau"),
      h("div", { class: "card" }, h("ol", {}, h("li", {}, "Un joueur = un étudiant, sur son téléphone ou son ordinateur. Une table réunit jusqu'à 5 joueurs autour du même plateau (tables 1 à 5). Chaque joueur a son pion, de la couleur affichée sur son écran."), h("li", {}, "À tour de rôle, un joueur tire la carte pour la table. Tous les joueurs de la table répondent à la même carte, en même temps, sur leur écran."), h("li", {}, "Chaque réponse est corrigée seule : 0 à 3 points, c'est le nombre de cases dont votre pion avance."), h("li", {}, "Une roue tourne puis s'arrête sur vos points (aucun hasard : le résultat vient de votre réponse). Vous déplacez ensuite votre pion de ce nombre de cases."), h("li", {}, "Une case « ? » est un événement : il fait avancer ou reculer le pion de celui qui s'y arrête."), h("li", {}, "La séance est chronométrée. À la fin du temps, plus de nouvelle carte. Le score d'une table est la somme des cases atteintes par ses joueurs ; le classement des tables se fait sur ce score, puis sur les points."), h("li", {}, "Arriver à « Examen » termine la route d'un joueur."))),
      h("div", { class: "card" }, h("h2", {}, "Les cinq zones du syllabus"), Object.keys(D.zones).map(function (z) { return h("p", {}, h("span", { class: "team", style: "background:" + D.zones[z].col }, z), D.zones[z].syl); })),
      h("div", {}, Object.keys(D.jeux).map(function (k) { var j = D.jeux[k]; return h("div", { class: "card" }, h("h2", {}, "Jeu " + k + " · " + j.titre), h("p", { class: "meta" }, "Zone " + j.zone + " · acte " + j.acte + " · " + j.duree + " min par carte environ"), h("p", {}, j.regle)); })),
      h("p", {}, h("a", { href: "#/plateau" }, "← Retour")));
  }

  /* ---------- Équipe ---------- */
  var TK = "pl-eq";
  function newTeam(code, nom, table) { return { code: code, sid: rnd(), nom: nom, table: table || "", pos: 0, score: 0, seen: {}, cur: null, res: null, done: false, cfg: { mode: "numerique", acte: 1 }, log: [] }; }
  var conn = null, peer = null, retry = null, st = null, onCfg = null;
  function teamSend() { if (!conn || !conn.open || !st) return; try { conn.send({ t: "state", sid: st.sid, nom: st.nom, table: st.table, pos: st.pos, score: st.score, done: st.done, last: st.log[st.log.length - 1] || null, n: st.log.length }); } catch (e) {} }
  function save() { LSset(TK, st); teamSend(); }
  function teamConnect() {
    if (!st || typeof Peer === "undefined") return; if (peer) { try { peer.destroy(); } catch (e) {} } clearTimeout(retry); conn = null;
    var again = function (ms) { clearTimeout(retry); retry = setTimeout(teamConnect, ms); setLink(false); };
    try {
      peer = new Peer();
      peer.on("open", function () {
        conn = peer.connect("cpro-p-" + st.code, { reliable: true });
        conn.on("open", function () { setLink(true); conn.send({ t: "hello", sid: st.sid, nom: st.nom, table: st.table, pos: st.pos, score: st.score, done: st.done, n: st.log.length }); });
        conn.on("data", function (m) {
          if (m.t === "cfg") { st.cfg = { mode: m.mode, acte: m.acte, bonus: !!m.bonus, end: m.end || 0 }; LSset(TK, st); if (onCfg) onCfg(); }
          else if (m.t === "adj") { st.pos = Math.max(0, Math.min(31, st.pos + (m.delta || 0))); st.log.push({ jeu: "—", pts: m.delta, note: "ajustement animateur" }); LSset(TK, st); teamSend(); if (onCfg) onCfg(true); }
        });
        conn.on("close", function () { again(4000); }); conn.on("error", function () { again(6000); });
      });
      peer.on("error", function () { again(8000); }); peer.on("disconnected", function () { again(6000); });
    } catch (e) { again(8000); }
  }
  var linkEl = null;
  function setLink(ok) { if (linkEl) { linkEl.textContent = ok ? "● Connecté à l'animateur" : "○ Hors ligne : la partie continue, l'animateur verra votre progression à la reconnexion"; linkEl.className = ok ? "meta" : "warn"; } }

  function teamJoinPage() {
    var p = q(), saved = LSget(TK);
    if (saved && saved.sid && (!p.c || saved.code === p.c.toUpperCase())) { st = saved; return teamPlay(); }
    var code = h("input", { placeholder: "Code de la table (ex. COM1)", maxlength: 8, style: "text-transform:uppercase;max-width:280px" }); code.value = (p.c || "").toUpperCase();
    var nom = h("input", { placeholder: "Nom de l'équipe", maxlength: 24 }), table = h("input", { placeholder: "Numéro ou nom de la table (facultatif)", maxlength: 16 }), msg = h("p", { class: "warn", style: "display:none" });
    mount(h("h1", {}, "Rejoindre la partie"), h("div", { class: "card" }, h("p", {}, "Code donné par l'animateur :"), code, h("p", {}, "Nom de votre équipe :"), nom, h("p", {}, "Votre table :"), table,
      h("button", { onclick: function () { if (!code.value.trim() || !nom.value.trim()) { msg.style.display = "block"; msg.textContent = "Saisissez le code et le nom de l'équipe."; return; } st = newTeam(code.value.trim().toUpperCase(), nom.value.trim(), table.value.trim()); LSset(TK, st); teamPlay(); } }, "Rejoindre"), msg),
      h("p", {}, h("a", { href: "#/plateau" }, "← Retour")));
  }

  function nextGameCase(pos) {
    for (var n = pos + 1; n < D.cases.length; n++) if (D.cases[n].type === "jeu") return D.cases[n];
    for (var m = Math.min(pos, 30); m > 0; m--) if (D.cases[m].type === "jeu") return D.cases[m];
    return null;
  }
  function teamPlay() {
    var top = h("div", {}), board = h("div", {}), main = h("div", {}), ans = null, tmEl = null, over = false;
    function timeUp() { return !!(st.cfg.end && Date.now() > st.cfg.end); }
    A.timers.push(setInterval(function () { if (!tmEl || !st.cfg.end) return; var left = st.cfg.end - Date.now(); tmEl.textContent = left > 0 ? mmss(left) : "0:00"; tmEl.style.color = left < 120000 ? "#E4572E" : ""; if (left <= 0 && !over) { over = true; if (!st.cur && !st.res) draw(); } if (left > 0) over = false; }, 500));
    linkEl = h("p", { class: "warn" }, "○ Connexion à l'animateur…");
    function fresh() {
      top.innerHTML = ""; var cap = PE.capFor(st.cfg.acte, D.caps);
      tmEl = h("div", { class: "timer", style: "font-size:30px" }, "");
      top.appendChild(h("div", { class: "card" }, h("b", {}, st.nom), st.table ? "  ·  table " + st.table : "", h("div", { class: "big" }, "Case " + st.pos + " / 31  ·  " + st.score + " point" + (st.score > 1 ? "s" : "")), st.cfg.end ? h("div", {}, h("span", { class: "meta" }, "Temps restant dans la séance : "), tmEl) : null, linkEl,
        h("p", { class: "meta" }, "Acte " + st.cfg.acte + " ouvert : " + D.actes[st.cfg.acte].nom + " · " + (st.cfg.mode === "physique" ? "plateau physique : vous déplacez votre pion à la main" : "plateau numérique : le pion avance seul"))));
      board.innerHTML = ""; board.appendChild(boardSvg([{ pos: st.pos, col: teamCol(st.nom), label: st.nom }]));
      return cap;
    }
    onCfg = function (move) { var ph = st.res ? "res" : st.cur ? "card" : "idle"; fresh(); if (ph === "idle" || move) draw(); };
    function jeuOf(id) { return D.jeux[id]; }
    function draw() {
      var cap = fresh(); main.innerHTML = ""; ans = null;
      if (st.res) return drawResult();
      if (st.cur) return drawCard();
      if (st.pos >= 31) { main.appendChild(h("div", { class: "card" }, h("h2", {}, "Arrivée à l'Examen !"), h("p", {}, "Votre équipe a terminé la route. Total : " + st.score + " points."))); return; }
      var nx = nextGameCase(st.pos);
      if (timeUp() && st.pos < cap) { main.appendChild(h("div", { class: "warn" }, "Temps de la séance écoulé : l'animateur ouvre l'acte suivant. Votre pion sera replacé au début de cet acte si vous n'avez pas fini celui-ci.")); return; }
      if (st.pos >= cap) {
        main.appendChild(h("div", { class: "warn" }, "En attente des autres équipes : fin de l'acte " + st.cfg.acte + ". L'animateur ouvrira l'acte suivant."));
        if (st.cfg.bonus) { var js = D.actes[st.cfg.acte].jeux, code = js[(st.bonusN || 0) % js.length], jb = jeuOf(code);
          main.appendChild(h("div", { class: "card" }, h("h2", {}, "Cartes bonus"), h("p", {}, "En attendant les autres équipes : une carte de plus ne fait pas avancer le pion, mais ses points servent à départager les équipes."), h("p", { class: "meta" }, "Jeu " + code + " · " + jb.titre),
            h("button", { class: "ok", onclick: function () { var r = PE.pickCard(jb, (st.seen[code] || []), st.sid + "b"); if (r.reset) st.seen[code] = []; st.bonusN = (st.bonusN || 0) + 1; st.cur = { jeu: code, id: r.card.id, bonus: true }; save(); draw(); } }, "Tirer une carte bonus"))); }
        return; }
      var j = jeuOf(nx.jeu);
      main.appendChild(h("div", { class: "card" }, h("h2", {}, "Prochaine carte : jeu " + nx.jeu + " · " + j.titre), h("p", {}, h("span", { class: "team", style: "background:" + D.zones[j.zone].col }, j.zone), D.zones[j.zone].nom), h("p", {}, j.regle),
        h("button", { class: "ok", onclick: function () { var r = PE.pickCard(j, (st.seen[nx.jeu] || []), st.sid); if (r.reset) st.seen[nx.jeu] = []; st.cur = { jeu: nx.jeu, id: r.card.id }; save(); draw(); } }, "Tirer la carte")));
    }
    function cardOf() { return jeuOf(st.cur.jeu).cartes.filter(function (c) { return c.id === st.cur.id; })[0]; }
    function drawCard() {
      var c = cardOf(), j = jeuOf(st.cur.jeu), box = h("div", { class: "card" }), btn;
      box.appendChild(h("h2", {}, "Jeu " + st.cur.jeu + " · " + j.titre)); box.appendChild(h("p", { class: "big" }, c.q));
      if (c.t === "choix") {
        ans = -1; var order = PE.shuffle(c.opts.map(function (o, i) { return i; }), st.sid + c.id), bs = [];
        order.forEach(function (i) { var b = h("button", { class: "opt", onclick: function () { ans = i; bs.forEach(function (x) { x.className = "opt"; }); b.className = "opt sel"; } }, c.opts[i]); bs.push(b); box.appendChild(b); });
      } else if (c.t === "assoc") {
        ans = c.items.map(function () { return -1; }); var ord = PE.shuffle(c.items.map(function (it, i) { return i; }), st.sid + c.id);
        ord.forEach(function (i) { var sel = h("select", {}, [h("option", { value: "-1" }, "Choisir…")].concat(c.labels.map(function (l, k) { return h("option", { value: String(k) }, l); }))); sel.addEventListener("change", function () { ans[i] = +sel.value; }); box.appendChild(h("div", { class: "card", style: "background:#fff" }, h("p", {}, c.items[i].txt), sel)); });
      } else if (c.t === "texte") {
        var ta = h("textarea", { rows: c.rows || 2, placeholder: "Votre réponse" }); ans = ""; ta.addEventListener("input", function () { ans = ta.value; }); box.appendChild(ta);
      } else if (c.t === "oral") {
        var left = c.sec, disp = h("div", { class: "timer" }, "1:00"), run = null, tb = h("button", { onclick: function () { if (run) return; tb.textContent = "En cours…"; run = setInterval(function () { left--; disp.textContent = Math.floor(Math.max(0, left) / 60) + ":" + ("0" + (Math.max(0, left) % 60)).slice(-2); if (left <= 0) { clearInterval(run); try { navigator.vibrate && navigator.vibrate(300); } catch (e) {} } }, 1000); A.timers.push(run); } }, "Lancer les 60 secondes");
        box.appendChild(disp); box.appendChild(tb); box.appendChild(h("p", { class: "meta" }, "Parlez, puis l'équipe voisine coche ce qu'elle a entendu :"));
        ans = c.grille.map(function () { return false; });
        c.grille.forEach(function (g, i) { var cb = h("input", { type: "checkbox", style: "width:auto" }); cb.addEventListener("change", function () { ans[i] = cb.checked; }); box.appendChild(h("label", { style: "display:block;margin:6px 0" }, cb, " " + g)); });
      }
      btn = h("button", { class: "ok", onclick: function () {
        if ((c.t === "choix" && ans < 0) || (c.t === "assoc" && ans.some(function (x) { return x < 0; })) || (c.t === "texte" && !String(ans).trim())) { alert("Répondez avant de valider."); return; }
        validate(c);
      } }, "Valider"); box.appendChild(btn); main.appendChild(box);
    }
    function validate(c) {
      var bonus = !!st.cur.bonus, r = PE.score(c, ans), from = st.pos, np = bonus ? from : PE.advance(from, r.pts, st.cfg.acte, D.caps), eff = bonus ? null : PE.landing(D.cases, D.events, np, st.cfg.acte, D.caps), jeu = st.cur.jeu;
      (st.seen[jeu] = st.seen[jeu] || []).push(c.id); st.score += r.pts; st.pos = eff ? eff.pos : np; if (st.pos >= 31) st.done = true;
      st.res = { jeu: jeu, id: c.id, bonus: bonus, rolled: false, pts: r.pts, detail: r.detail, from: from, to: np, final: st.pos, ev: eff ? { titre: eff.ev.titre, txt: eff.ev.txt, rejoue: eff.rejoue } : null };
      st.log.push({ jeu: jeu, pts: r.pts, to: st.pos, bonus: bonus }); st.cur = null; save(); draw();
    }
    var WCOL = ["#5B6478", "#E9A400", "#3B6FD8", "#2E9E6B"];
    function wheelEl() {
      var w = sv("svg", { viewBox: "-60 -66 120 126", width: 200, height: 210, style: "display:block;margin:6px auto" }), g = sv("g", { style: "transition:transform 3.4s cubic-bezier(.12,.7,.18,1);transform-origin:0 0" });
      for (var i = 0; i < 4; i++) { var a0 = (i * 90 - 90) * Math.PI / 180, a1 = ((i + 1) * 90 - 90) * Math.PI / 180, am = (a0 + a1) / 2;
        g.appendChild(sv("path", { d: "M0 0 L" + (55 * Math.cos(a0)).toFixed(2) + " " + (55 * Math.sin(a0)).toFixed(2) + " A55 55 0 0 1 " + (55 * Math.cos(a1)).toFixed(2) + " " + (55 * Math.sin(a1)).toFixed(2) + " Z", fill: WCOL[i], stroke: "#fff", "stroke-width": 1.5 }));
        g.appendChild(sv("text", { x: (33 * Math.cos(am)).toFixed(2), y: (33 * Math.sin(am) + 7).toFixed(2), "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: "#fff" }, String(i))); }
      w.appendChild(g); w.appendChild(sv("circle", { cx: 0, cy: 0, r: 5, fill: "#1F2A5C" })); w.appendChild(sv("path", { d: "M-7 -64 L7 -64 L0 -50 Z", fill: "#E4572E", stroke: "#fff", "stroke-width": 1 })); w._g = g; return w;
    }
    function spinWheel(w, pts, done) {
      var fin = false, g = w._g; function end() { if (fin) return; fin = true; setTimeout(done, 900); }
      var R = 360 * 4 + 360 - (pts * 90 + 45); requestAnimationFrame(function () { requestAnimationFrame(function () { g.style.transform = "rotate(" + R + "deg)"; }); });
      g.addEventListener("transitionend", end); var t = setTimeout(end, 3700);
      return function () { if (fin) return; g.style.transition = "none"; g.style.transform = "rotate(" + (360 - (pts * 90 + 45)) + "deg)"; clearTimeout(t); end(); };
    }
    function drawResult() {
      if (!st.res.rolled) { var wl = wheelEl(), skip; main.appendChild(h("div", { class: "card", style: "text-align:center" }, h("p", { class: "big" }, "La roue révèle vos points…"), wl, skip = h("button", { class: "sec" }, "Passer"))); var stop = spinWheel(wl, st.res.pts, function () { st.res.rolled = true; save(); draw(); }); skip.onclick = stop; return; }
      var r = st.res, c = jeuOf(r.jeu).cartes.filter(function (x) { return x.id === r.id; })[0], phys = st.cfg.mode === "physique", moved = r.final - r.from;
      main.appendChild(h("div", { class: "card" }, h("h2", {}, r.pts + " point" + (r.pts > 1 ? "s" : "") + " sur 3"), h("ul", {}, r.detail.map(function (d) { return h("li", { style: "color:" + (d.ok ? "#1b6b45" : "#a33") }, (d.ok ? "✓ " : "✗ ") + d.lab); })),
        c.modele ? h("p", {}, h("b", {}, "Réponse modèle : "), c.modele) : null, h("div", { class: "corr" }, h("b", {}, "Corrigé : "), c.expl)));
      main.appendChild(h("div", { class: phys && !r.bonus ? "warn big" : "card" }, r.bonus ? "Points bonus : +" + r.pts + ". Votre pion reste sur la case " + r.final + "." : phys ? "Déplacez votre pion de " + (r.to - r.from) + " case" + ((r.to - r.from) > 1 ? "s" : "") + (r.ev && r.final !== r.to ? ", puis " + (r.final - r.to > 0 ? "avancez" : "reculez") + " de " + Math.abs(r.final - r.to) : "") + " : case " + r.final + "." : "Votre pion va à la case " + r.final + "."));
      if (!r.bonus && r.final < 31 && r.final >= PE.capFor(st.cfg.acte, D.caps)) main.appendChild(h("div", { class: "warn" }, "En attente des autres équipes : vous avez terminé l'acte " + st.cfg.acte + "."));
      if (r.ev) main.appendChild(h("div", { class: "card", style: "border-left:6px solid #7A3FB5" }, h("b", {}, "Événement : " + r.ev.titre), h("p", {}, r.ev.txt)));
      main.appendChild(h("button", { class: "ok", onclick: function () { var rej = r.ev && r.ev.rejoue, jeu = r.jeu; st.res = null; if (rej && st.pos < PE.capFor(st.cfg.acte, D.caps)) { var j = jeuOf(jeu), rr = PE.pickCard(j, st.seen[jeu] || [], st.sid + "j"); st.cur = { jeu: jeu, id: rr.card.id }; } save(); draw(); } }, r.ev && r.ev.rejoue ? "Rejouer une carte" : "Carte suivante"));
    }
    mount(h("h1", {}, "5 · La route de l'état de l'art"), top, board, main, h("p", {}, h("a", { href: "#/plateau/regles" }, "Règles"), "  ·  ", h("a", { href: "#", onclick: function (e) { e.preventDefault(); if (confirm("Quitter la partie ? Votre progression sera perdue.")) { try { localStorage.removeItem(TK); } catch (x) {} if (peer) try { peer.destroy(); } catch (x) {} st = null; location.hash = "#/plateau"; } } }, "Quitter la partie")));
    draw(); teamConnect(); teamSend();
  }

  /* ---------- Animateur ---------- */
  var PK = "pl-prof";
  function animPage() {
    var infoP = null, P = LSget(PK) || { code: "", mode: "numerique", acte: 1, teams: {} }, hpeer = null, online = {}, view = "plateau", big = false, dirty = true, three = null, content = h("div", {}), status = h("p", { class: "meta" }, "");
    function persist() { LSset(PK, P); }
    function cfgMsg() { return { t: "cfg", mode: P.mode, acte: P.acte, bonus: !!P.bonus, end: P.end || 0 }; }
    function bcast() { Object.keys(online).forEach(function (sid) { try { online[sid].send(cfgMsg()); } catch (e) {} }); }
    function ingest(m, c) {
      if (m.t !== "hello" && m.t !== "state") return;
      var prevN = P.teams[m.sid] ? (P.teams[m.sid].n || 0) : null, o = P.teams[m.sid] = P.teams[m.sid] || { ci: Object.keys(P.teams).length }; ["nom", "table", "pos", "score", "done", "n"].forEach(function (k) { if (m[k] !== undefined) o[k] = m[k]; }); if (m.last) o.last = m.last; o.ts = Date.now();
      if (c) { online[m.sid] = c; if (m.t === "hello") try { c.send(cfgMsg()); } catch (e) {} }
      if (m.t === "state" && prevN !== null && o.n > prevN && m.last && m.last.jeu !== "—" && view === "3d" && three) three.play({ key: m.sid, pts: m.last.pts, nom: o.nom, col: COLS[(o.ci || 0) % COLS.length], bonus: m.last.bonus }, pawns());
      persist(); dirty = true;
    }
    function open(code) {
      P.code = code; persist(); if (hpeer) try { hpeer.destroy(); } catch (e) {} if (typeof Peer === "undefined") { status.textContent = "Bibliothèque réseau absente."; return; }
      hpeer = new Peer("cpro-p-" + code);
      hpeer.on("error", function (err) { status.textContent = err.type === "unavailable-id" ? "Ce code est déjà utilisé (une autre page animateur est ouverte ?). Changez de code." : "Erreur réseau : " + err.type; });
      hpeer.on("open", function () { status.textContent = "Partie ouverte : les équipes peuvent rejoindre."; });
      hpeer.on("connection", function (c) { var sid = null; c.on("data", function (m) { sid = m.sid || sid; ingest(m, c); }); c.on("close", function () { if (sid && online[sid] === c) delete online[sid]; dirty = true; }); });
    }
    function teams() { return Object.keys(P.teams).map(function (k) { var o = P.teams[k]; o.sid = k; return o; }); }
    function pawns() { return teams().map(function (t) { return { pos: t.pos || 0, col: COLS[(t.ci || 0) % COLS.length], label: t.nom || "?", nom: t.nom, table: t.table, sid: t.sid }; }); }
    var code = h("input", { placeholder: "Code de la partie (ex. COM1)", maxlength: 8, style: "text-transform:uppercase;max-width:260px" }); code.value = P.code || "COM1";
    var qrBox = h("div", {});
    function drawQr() { qrBox.innerHTML = ""; if (!P.code) return; var url = BASE + "#/plateau/equipe?c=" + P.code; qrBox.appendChild(h("div", { class: "card" }, h("p", {}, "Code à donner aux équipes : ", h("span", { class: "code", style: "font-size:40px" }, P.code)), h("img", { src: "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" + encodeURIComponent(url), width: 180, height: 180, alt: "QR de la partie" }), h("p", { class: "meta" }, "Les équipes scannent ce QR (ou saisissent le code). En physique, un code par table : ouvrez une partie par table, ou partagez un seul code et notez le numéro de table à la connexion."))); }
    function ctrl() {
      var box = h("div", { class: "card" }, h("h2", {}, "Partie"), code, h("button", { class: "ok", onclick: function () { if (code.value.trim()) { open(code.value.trim().toUpperCase()); drawQr(); } } }, "Ouvrir la partie"), status,
        h("div", {}, h("b", {}, "Mode : "), [["numerique", "Plateau numérique (projeté)"], ["physique", "Plateaux physiques (un par table)"]].map(function (m) { return h("button", { class: P.mode === m[0] ? "" : "sec", onclick: function () { P.mode = m[0]; persist(); bcast(); rebuild(); } }, m[1]); })),
        h("div", {}, h("b", {}, "Acte ouvert : "), [1, 2, 3].map(function (a) { return h("button", { class: P.acte === a ? "" : "sec", onclick: function () { P.acte = a; persist(); bcast(); rebuild(); } }, "Acte " + a + " · " + D.actes[a].nom + " (" + D.actes[a].jeux.join(", ") + ")"); })),
        chronoRow(),
        h("div", {}, h("button", { class: "sec", onclick: function () { pushLate(); } }, "Passer les retardataires au début de l'acte " + Math.min(3, Math.max(2, P.acte))),
          h("button", { class: P.bonus ? "" : "sec", onclick: function () { P.bonus = !P.bonus; persist(); bcast(); rebuild(); } }, "Cartes bonus pour les équipes en avance : " + (P.bonus ? "activées" : "désactivées")), h("a", { href: "#/plateau/demo", target: "_blank", style: "margin-left:12px" }, "Partie démo 3D (autre onglet)")));
      return box;
    }
    var ctrlBox = h("div", {}), bar = h("div", { class: "card" });
    function rebuild() { ctrlBox.innerHTML = ""; ctrlBox.appendChild(ctrl()); }
    function tabs() {
      bar.innerHTML = ""; [["plateau", "Plateau"], ["tableau", "Tableau des tables"], ["3d", "Vue 3D"]].forEach(function (t) { bar.appendChild(h("button", { class: view === t[0] ? "" : "sec", onclick: function () { view = t[0]; three = null; tabs(); dirty = true; draw(); } }, t[1])); });
      var bg = h("input", { type: "checkbox", style: "width:auto" }); bg.checked = big; bg.addEventListener("change", function () { big = bg.checked; content.style.fontSize = big ? "24px" : ""; });
      bar.appendChild(h("label", { style: "margin-left:12px" }, bg, " Grand texte (projection)")); bar.appendChild(h("button", { class: "sec", onclick: exportCsv }, "Exporter en CSV"));
      bar.appendChild(h("button", { class: "sec", onclick: function () { if (confirm("Effacer toutes les équipes de la partie ?")) { P.teams = {}; persist(); dirty = true; draw(); } } }, "Effacer les équipes"));
    }
    function draw() {
      var ts = teams(), infoTxt = ts.length + " équipe(s) · " + Object.keys(online).length + " en ligne · mode " + (P.mode === "physique" ? "physique" : "numérique") + " · acte " + P.acte + " ouvert";
      if (view === "3d" && three && content.contains(infoP)) { dirty = false; infoP.textContent = infoTxt; three.update(pawns()); return; }
      dirty = false; content.innerHTML = ""; infoP = h("p", { class: "meta" }, infoTxt); content.appendChild(infoP);
      if (view === "3d") { three = null; var box = h("div", { style: "width:100%;height:560px;background:#F3F5F9;border-radius:10px;position:relative" }), cam = h("input", { type: "checkbox", style: "width:auto" }); cam.checked = true; cam.addEventListener("change", function () { if (three) three.setAuto(cam.checked); });
        content.appendChild(h("label", {}, cam, " Caméra automatique (suit l'équipe qui joue) · glisser pour tourner le plateau")); content.appendChild(box); load3d(box, function (api) { three = api; if (api) api.update(pawns()); else { content.innerHTML = ""; content.appendChild(h("p", { class: "warn" }, "La 3D n'est pas disponible sur cet appareil : plateau 2D affiché.")); content.appendChild(boardSvg(pawns(), { big: true })); } }); return; }
      if (view === "plateau") { content.appendChild(boardSvg(pawns(), { big: true })); content.appendChild(h("p", {}, ts.map(function (t) { return h("span", { class: "team", style: "background:" + COLS[(t.ci || 0) % COLS.length] }, (t.table ? t.table + " · " : "") + t.nom + " · case " + t.pos); }))); return; }
      var rank = ts.slice().sort(function (a, b) { return (b.pos - a.pos) || (b.score - a.score); });
      var tb = h("table", {}, h("tr", {}, ["Rang", "Table", "Équipe", "Case", "Statut", "Points", "Dernier jeu", "En ligne", "Ajuster"].map(function (x) { return h("th", {}, x); })));
      rank.forEach(function (t, i) { var l = t.last;
        tb.appendChild(h("tr", {}, [h("td", {}, String(i + 1)), h("td", {}, t.table || "—"), h("td", {}, h("span", { class: "team", style: "background:" + COLS[(t.ci || 0) % COLS.length] }, t.nom)), h("td", {}, t.done ? "Examen ✓" : String(t.pos)), h("td", {}, t.done ? "" : ((t.pos || 0) >= PE.capFor(P.acte, D.caps) ? "En attente des autres équipes" : "En jeu")), h("td", {}, String(t.score)), h("td", {}, l ? (l.jeu + " · " + l.pts + " pt") : ""), h("td", {}, online[t.sid] ? "●" : "○"),
          h("td", {}, h("button", { class: "sec", onclick: function () { adj(t.sid, -1); } }, "−1"), h("button", { class: "sec", onclick: function () { adj(t.sid, 1); } }, "+1"))])); });
      content.appendChild(tb); content.appendChild(h("p", { class: "meta" }, "Classement : case atteinte, puis points. « Ajuster » déplace le pion de l'équipe (arbitrage d'une réponse orale, par exemple)."));
    }
    var chronoOut = h("span", { class: "big", style: "margin:0 10px;font-variant-numeric:tabular-nums" }, ""), chronoMin = h("input", { type: "number", min: 1, max: 90, style: "width:80px;display:inline-block" }), clos = h("button", { class: "ok", style: "display:none", onclick: function () { closeActe(); } }, "Clôturer : ouvrir l'acte suivant et passer les retardataires");
    function chronoRow() {
      chronoMin.value = SEANCE_MIN[P.acte] || 30;
      return h("div", {}, h("b", {}, "Chrono de la séance : "), chronoMin, " min ", h("button", { onclick: function () { P.end = Date.now() + (+chronoMin.value || 30) * 60000; persist(); bcast(); tickChrono(); } }, "Démarrer le chrono"), h("button", { class: "sec", onclick: function () { P.end = 0; persist(); bcast(); tickChrono(); } }, "Arrêter"), chronoOut, clos);
    }
    function tickChrono() { var left = (P.end || 0) - Date.now(); if (!P.end) { chronoOut.textContent = ""; clos.style.display = "none"; return; } chronoOut.textContent = left > 0 ? mmss(left) : "Temps écoulé"; chronoOut.style.color = left <= 0 ? "#E4572E" : ""; clos.style.display = left <= 0 && P.acte < 3 ? "" : "none"; }
    function closeActe() { if (P.acte >= 3) return; P.acte++; P.end = 0; persist(); bcast(); rebuild(); pushLate(true); }
    function pushLate(skip) {
      if (P.acte < 2) { alert("Ouvrez d'abord l'acte suivant, puis passez les retardataires."); return; }
      var lim = D.caps[P.acte - 2], late = teams().filter(function (t) { return (t.pos || 0) < lim; });
      if (!late.length) { status.textContent = "Aucun retardataire : toutes les équipes ont terminé l'acte " + (P.acte - 1) + "."; return; }
      if (!skip && !confirm(late.length + " équipe(s) n'ont pas fini l'acte " + (P.acte - 1) + " : elles passent à la case " + lim + ", début de l'acte " + P.acte + ". Confirmer ?")) return;
      late.forEach(function (t) { adj(t.sid, lim - (t.pos || 0)); }); status.textContent = late.length + " équipe(s) passée(s) au début de l'acte " + P.acte + ".";
    }
    function adj(sid, d) { var t = P.teams[sid]; if (!t) return; t.pos = Math.max(0, Math.min(31, (t.pos || 0) + d)); persist(); try { online[sid] && online[sid].send({ t: "adj", delta: d }); } catch (e) {} dirty = true; draw(); }
    function exportCsv() {
      var qq = function (x) { return '"' + String(x === undefined ? "" : x).replace(/"/g, '""') + '"'; }, rows = [["table", "équipe", "case", "points", "dernier jeu", "points du dernier jeu"].map(qq).join(";")];
      teams().forEach(function (t) { rows.push([t.table || "", t.nom, t.pos, t.score, t.last ? t.last.jeu : "", t.last ? t.last.pts : ""].map(qq).join(";")); });
      var b = new Blob(["﻿" + rows.join("\n")], { type: "text/csv;charset=utf-8" }), a = h("a", { href: URL.createObjectURL(b), download: "plateau-" + (P.code || "partie") + ".csv" }); document.body.appendChild(a); a.click(); a.remove();
    }
    window.PLATEAU._ingest = function (m, c) { ingest(m, c); draw(); }; window.PLATEAU._teams = function () { return P.teams; };
    mount(h("h1", {}, "Plateau : tableau de bord animateur"), h("p", { class: "meta" }, h("a", { href: "#/animateur" }, "Fiche animateur"), "  ·  ", h("a", { href: "#/plateau/regles" }, "Règles")), ctrlBox, qrBox, bar, content);
    rebuild(); tabs(); drawQr(); draw(); if (P.code) open(P.code);
    A.timers.push(setInterval(tickChrono, 500)); A.timers.push(setInterval(function () { if (dirty) draw(); else if (view === "3d" && three) three.update(pawns()); }, 700));
  }

  /* ---------- 3D (Three.js chargé à la demande) : tuiles, pions qui sautent, dé qui roule, caméra qui suit ---------- */
  function load3d(box, cb, opts) {
    opts = opts || {};
    function go() {
      try {
        var T = window.THREE; var cv = document.createElement("canvas"); var gl = cv.getContext("webgl") || cv.getContext("experimental-webgl"); if (!gl) return cb(null);
        var W = box.clientWidth || 900, H = box.clientHeight || 520, r = new T.WebGLRenderer({ antialias: true, alpha: true }); r.setSize(W, H); box.appendChild(r.domElement);
        var sc = new T.Scene(), cam = new T.PerspectiveCamera(45, W / H, 0.1, 200), ang = 0, dragging = false, lx = 0, tilt = 0.9, auto = true;
        sc.add(new T.AmbientLight(0xffffff, 0.62)); var dl = new T.DirectionalLight(0xffffff, 0.45); dl.position.set(8, 14, 6); sc.add(dl);
        function P3(c) { return new T.Vector3(c.x * 0.2 - 12, 0, c.y * 0.2 - 6.6); }
        var g = new T.Group(); sc.add(g);
        var base = new T.Mesh(new T.BoxGeometry(27, 0.4, 16), new T.MeshLambertMaterial({ color: 0xc5d5ee })); base.position.y = -0.4; g.add(base);
        var tiles = [];
        D.cases.forEach(function (c) {
          var p = P3(c), big = c.type === "exam", m = new T.Mesh(new T.BoxGeometry(1.85, big ? 1.4 : 0.5, 1.85), new T.MeshLambertMaterial({ color: zcol(c) })); m.position.set(p.x, 0.15, p.z); g.add(m); tiles.push(m);
          var cvs = document.createElement("canvas"); cvs.width = cvs.height = 128; var x = cvs.getContext("2d"); x.fillStyle = "#fff"; x.textAlign = "center"; x.textBaseline = "middle";
          x.font = "bold 58px sans-serif"; x.fillText(caseLabel(c), 64, 58); x.font = "bold 26px sans-serif"; x.fillText(c.type === "depart" ? "Départ" : c.type === "exam" ? "Examen" : String(c.n), 64, 108);
          var pl = new T.Mesh(new T.PlaneGeometry(1.75, 1.75), new T.MeshBasicMaterial({ map: new T.CanvasTexture(cvs), transparent: true })); pl.rotation.x = -Math.PI / 2; pl.position.set(p.x, big ? 0.86 : 0.41, p.z); g.add(pl);
        });
        g.add(new T.Line(new T.BufferGeometry().setFromPoints(D.cases.map(function (c) { var p = P3(c); p.y = 0.05; return p; })), new T.LineBasicMaterial({ color: 0xb9c4e8 })));
        function tileTop(i) { var c = D.cases[i], p = P3(c); p.y = c.type === "exam" ? 1.7 : 0.9; return p; }
        /* roue : 4 secteurs 0 à 3, aiguille fixe ; l'arrêt est décidé par la réponse (aucun hasard) */
        var WC = ["#5B6478", "#E9A400", "#3B6FD8", "#2E9E6B"], wc = document.createElement("canvas"); wc.width = wc.height = 256; var wx = wc.getContext("2d");
        for (var wi = 0; wi < 4; wi++) { var a0 = (wi * 90 - 90) * Math.PI / 180, a1 = ((wi + 1) * 90 - 90) * Math.PI / 180; wx.fillStyle = WC[wi]; wx.beginPath(); wx.moveTo(128, 128); wx.arc(128, 128, 124, a0, a1); wx.closePath(); wx.fill(); wx.strokeStyle = "#fff"; wx.lineWidth = 5; wx.stroke();
          var am = (a0 + a1) / 2; wx.fillStyle = "#fff"; wx.font = "bold 70px sans-serif"; wx.textAlign = "center"; wx.textBaseline = "middle"; wx.fillText(String(wi), 128 + 78 * Math.cos(am), 128 + 78 * Math.sin(am)); }
        var wheel = new T.Group(), disc = new T.Mesh(new T.CircleGeometry(1.6, 48), new T.MeshBasicMaterial({ map: new T.CanvasTexture(wc) })); disc.rotation.x = -Math.PI / 2; wheel.add(disc);
        var rim = new T.Mesh(new T.CylinderGeometry(1.68, 1.68, 0.12, 48), new T.MeshLambertMaterial({ color: 0x1f2a5c })); rim.position.y = -0.08; wheel.add(rim);
        var needle = new T.Mesh(new T.ConeGeometry(0.28, 0.7, 12), new T.MeshLambertMaterial({ color: 0xe4572e })); needle.position.set(0, 0.35, -1.75); needle.rotation.x = Math.PI; var holder = new T.Group(); holder.add(wheel); holder.add(needle); holder.visible = false; sc.add(holder);
        var cap = document.createElement("div"); cap.style.cssText = "position:absolute;left:10px;top:10px;background:rgba(31,42,92,.88);color:#fff;padding:8px 14px;border-radius:8px;font:600 18px sans-serif;display:none;max-width:70%"; box.appendChild(cap);
        function say(t, col) { if (!t) { cap.style.display = "none"; return; } cap.style.display = "block"; cap.style.borderLeft = "8px solid " + (col || "#fff"); cap.textContent = t; }
        var pw = {}, nser = 0, focus = new T.Vector3(0, 0, 0), focusT = new T.Vector3(0, 0, 0), rad = 13.5, radT = 13.5, lastMove = 0, now0 = performance.now();
        function mkPawn(p) {
          var m = new T.Group(), mat = new T.MeshLambertMaterial({ color: p.col }), body = new T.Mesh(new T.CylinderGeometry(0.3, 0.4, 0.85, 16), mat), head = new T.Mesh(new T.SphereGeometry(0.33, 16, 12), mat); head.position.y = 0.65; m.add(body); m.add(head);
          var a = nser++ * 2.4; var o = { m: m, idx: 0, want: 0, anim: null, off: new T.Vector3(Math.cos(a) * 0.42, 0, Math.sin(a) * 0.42) }; var t0 = tileTop(0); m.position.set(t0.x + o.off.x, t0.y, t0.z + o.off.z); g.add(m); return o;
        }
        function apply(list) { list.forEach(function (p) { var k = p.sid || p.nom; if (!pw[k]) pw[k] = mkPawn(p); pw[k].want = Math.max(0, Math.min(D.cases.length - 1, p.pos)); pw[k].nom = p.nom || p.label; pw[k].col = p.col; }); }
        var jobs = [], busy = null, pending = null, lastList = [];
        function pawnsIdle() { return Object.keys(pw).every(function (k) { return pw[k].idx === pw[k].want && !pw[k].anim; }); }
        function startJob(j) {
          busy = { j: j, t: 0, phase: "roll" }; var pawn = pw[j.key]; var o = pawn ? pawn.m.position.clone() : new T.Vector3(0, 0, 0);
          busy.at = o.clone().add(new T.Vector3(2.2, 0, -1.4)); busy.R = 360 * 4 + 360 - (j.pts * 90 + 45);
          holder.visible = true; focusT.copy(o); radT = 10; lastMove = performance.now(); say((j.nom || "Équipe") + " : la roue tourne…", j.col);
        }
        function endJob() { holder.visible = false; var j = busy.j; busy = null; apply(pending || j.list || lastList); pending = null; lastMove = performance.now(); if (j.done) try { j.done(); } catch (e) {} }
        r.domElement.addEventListener("pointerdown", function (e) { dragging = true; lx = e.clientX; }); window.addEventListener("pointerup", function () { dragging = false; });
        r.domElement.addEventListener("pointermove", function (e) { if (dragging) { ang -= (e.clientX - lx) * 0.01; lx = e.clientX; } });
        var alive = true, prev = performance.now();
        function loop() {
          if (!alive || !document.body.contains(r.domElement)) { alive = false; return; }
          var nowt = performance.now(), dt = Math.min(0.1, (nowt - prev) / 1000); prev = nowt; var sp = opts.speed ? opts.speed() : 1; dt *= sp;
          if (!busy && jobs.length && pawnsIdle()) startJob(jobs.shift());
          if (busy) {
            busy.t += dt; var T1 = 2.6, u = Math.min(1, busy.t / T1);
            if (busy.phase === "roll") {
              var e = 1 - Math.pow(1 - u, 3); wheel.rotation.y = -(e * busy.R) * Math.PI / 180; holder.position.set(busy.at.x, 2.3 + Math.sin(u * 6) * 0.05 * (1 - u), busy.at.z);
              if (u >= 1) { busy.phase = "show"; busy.t = 0; say((busy.j.nom || "Équipe") + " : " + busy.j.pts + " point" + (busy.j.pts > 1 ? "s" : "") + (busy.j.bonus ? " (bonus)" : busy.j.pts ? " : le pion avance de " + busy.j.pts + " case" + (busy.j.pts > 1 ? "s" : "") : " : le pion reste"), busy.j.col); }
            } else if (busy.t > 2.0) endJob();
          }
          if (!busy) {
            var moving = false;
            Object.keys(pw).forEach(function (k) {
              var o = pw[k];
              if (!o.anim && o.idx !== o.want) { var nx = o.idx + (o.want > o.idx ? 1 : -1), a = o.m.position.clone(), b = tileTop(nx).add(o.off), far = Math.abs(o.want - o.idx) > 6; o.anim = { a: a, b: b, t: 0, d: far ? 0.2 : 0.4, nx: nx }; }
              if (o.anim) { moving = true; o.anim.t += dt; var s = Math.min(1, o.anim.t / o.anim.d); o.m.position.lerpVectors(o.anim.a, o.anim.b, s); o.m.position.y = o.anim.a.y + (o.anim.b.y - o.anim.a.y) * s + Math.sin(Math.PI * s) * 0.9; if (s >= 1) { o.idx = o.anim.nx; o.anim = null; } if (moving) { focusT.copy(o.m.position); radT = 11; lastMove = nowt; } }
            });
            if (!moving && nowt - lastMove > 2200) { focusT.set(0, 0, 0); radT = 13.5; }
          }
          if (auto) { focus.lerp(focusT, 0.06); rad += (radT - rad) * 0.04; } else { focus.lerp(new T.Vector3(0, 0, 0), 0.1); rad += (13.5 - rad) * 0.1; }
          cam.position.set(focus.x + Math.sin(ang) * rad, focus.y + rad * tilt, focus.z + Math.cos(ang) * rad); cam.lookAt(focus);
          r.render(sc, cam); requestAnimationFrame(loop);
        }
        loop();
        cb({ update: function (list) { lastList = list; if (busy || jobs.length) pending = list; else apply(list); },
          play: function (ev, list) { ev.list = list; lastList = list; jobs.push(ev); },
          setAuto: function (v) { auto = !!v; }, idle: function () { return !busy && !jobs.length && pawnsIdle(); }, say: say,
          flash: function (i) { var m = tiles[i]; if (!m) return; var c0 = m.material.color.clone(); m.material.color.offsetHSL(0, 0, 0.3); m.position.y = 0.35; setTimeout(function () { m.material.color.copy(c0); m.position.y = 0.15; }, 1300); } });
      } catch (e) { cb(null); }
    }
    if (window.THREE) return go();
    var s = document.createElement("script"); s.src = "three.min.js"; s.onload = go; s.onerror = function () { cb(null); }; document.head.appendChild(s);
  }

  /* ---------- Partie démo « jeu réel » : cinq équipes fictives, vraies cartes, réponses simulées, séquence stricte ---------- */
  var DEMO_TEAMS = [["Alpha Cyber", 0.82], ["Les Pingouins", 0.7], ["Octet Club", 0.55], ["Team Sentinelle", 0.45], ["Les Zélés", 0.3]];
  function mulberry(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function simAnswer(c, sk, rnd) {
    if (c.t === "choix") { if (rnd() < sk) return c.ok; var o = []; c.opts.forEach(function (x, i) { if (i !== c.ok) o.push(i); }); return o[Math.floor(rnd() * o.length)]; }
    if (c.t === "assoc") return c.items.map(function (it) { if (rnd() < sk) return it.ok; var k, g = 0; do { k = Math.floor(rnd() * c.labels.length); g++; } while (k === it.ok && g < 9); return k; });
    if (c.t === "oral") return c.grille.map(function () { return rnd() < sk; });
    var target = Math.round(3 * Math.max(0, Math.min(1, sk + (rnd() - 0.5) * 0.7))), words = c.modele.split(" "), best = "Nous n'avons rien trouvé de précis.", bd = 9;
    for (var n = words.length; n >= Math.min(3, words.length); n--) { var cand = words.slice(0, n).join(" "), d = Math.abs(PE.score(c, cand).pts - target); if (d < bd) { bd = d; best = cand; } if (d === 0) break; }
    if ((target === 0 && PE.score(c, best).pts > 0) || bd > 0 && PE.score(c, best).pts === 0) best = "Nous n'avons rien trouvé de précis.";
    return best;
  }
  function demoPage() {
    var ABORT = {}, S = null, api = null, gen = 0, seed = Math.floor(Math.random() * 90000) + 10000, speed = 1, box, fb = h("div", {}), banner = h("p", { class: "big" }, ""), clock = h("span", { class: "meta" }, ""), phone = h("div", {}), phoneHead = h("div", {}), phoneBody = h("div", {}), logBox = h("ol", { reversed: "reversed", style: "max-height:220px;overflow:auto;margin:0;padding-left:26px" }), tabsBar = h("div", { class: "card" }), views = {}, curTab = "plateau", btnRun, btnStep, seedLab = h("span", { class: "meta" }, ""), sel;
    function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms / speed); }); }
    function chk(g) { if (g !== gen || !document.body.contains(box)) throw ABORT; }
    function fresh() { var rnd = mulberry(seed); return { rnd: rnd, acte: 1, started: false, fin: false, run: false, step: false, turn: 0, min: 0, teams: DEMO_TEAMS.map(function (t, i) { return { nom: t[0], sk: t[1], col: COLS[i % COLS.length], pos: 0, score: 0, seen: {}, n: 0, good: 0, mins: 0, st: {}, last: null, el: 0, nA: 0 }; }), actes: [], log: [] }; }
    function list() { return S.teams.map(function (t) { return { sid: t.nom, nom: t.nom, label: t.nom, col: t.col, pos: t.pos }; }); }
    function say(txt) { logBox.insertBefore(h("li", {}, txt), logBox.firstChild); }
    function cap() { return PE.capFor(S.acte, D.caps); }
    function head(t, extra) { phoneHead.innerHTML = ""; if (!t) { phoneHead.appendChild(h("b", {}, "Écran d'une équipe (téléphone)")); return; } phoneHead.appendChild(h("span", { class: "team", style: "background:" + t.col }, t.nom)); phoneHead.appendChild(h("span", { class: "meta" }, "  case " + t.pos + " · " + t.score + " pt" + (extra ? " · " + extra : ""))); }
    function drawTable() {
      var v = views.table; v.innerHTML = ""; var rank = S.teams.slice().sort(function (a, b) { return (b.pos - a.pos) || (b.score - a.score); });
      var tb = h("table", {}, h("tr", {}, ["Rang", "Équipe", "Case", "Statut", "Points", "Dernier jeu", "Cartes jouées"].map(function (x) { return h("th", {}, x); })));
      rank.forEach(function (t, i) { tb.appendChild(h("tr", {}, [h("td", {}, String(i + 1)), h("td", {}, h("span", { class: "team", style: "background:" + t.col }, t.nom)), h("td", {}, t.pos >= 31 ? "Examen ✓" : String(t.pos)), h("td", {}, t.pos >= 31 ? "Arrivée" : t.pos >= cap() ? "En attente des autres équipes" : "En jeu"), h("td", {}, String(t.score)), h("td", {}, t.last ? t.last.jeu + " · " + t.last.pts + " pt" : ""), h("td", {}, String(t.n))])); });
      v.appendChild(h("p", { class: "meta" }, "Ce que l'animateur voit : acte " + S.acte + " ouvert · classement par case atteinte, puis par points.")); v.appendChild(tb);
    }
    function summary() {
      var v = views.recap; v.innerHTML = ""; var rank = S.teams.slice().sort(function (a, b) { return (b.pos - a.pos) || (b.score - a.score); }), jeux = Object.keys(D.jeux);
      v.appendChild(h("p", { class: "meta" }, "Récapitulatif de la partie simulée (graine " + seed + "). Les équipes jouent en parallèle dans la réalité : la durée d'un acte est celle de l'équipe la plus lente."));
      var tb = h("table", {}, h("tr", {}, ["Rang", "Équipe", "Case", "Points", "Cartes", "Réponses à 3 pts", "Temps de jeu simulé (total)"].concat(jeux).map(function (x) { return h("th", {}, x); })));
      rank.forEach(function (t, i) { tb.appendChild(h("tr", {}, [h("td", {}, String(i + 1)), h("td", {}, t.nom), h("td", {}, String(t.pos)), h("td", {}, String(t.score)), h("td", {}, String(t.n)), h("td", {}, String(t.good)), h("td", {}, t.mins + " min")].concat(jeux.map(function (k) { var x = t.st[k]; return h("td", {}, x ? (x.pts + " / " + x.n * 3) : "—"); })))); });
      v.appendChild(tb);
      v.appendChild(h("h3", {}, "Séances plafonnées")); v.appendChild(h("ul", {}, S.actes.length ? S.actes.map(function (a) { return h("li", {}, "Séance " + a.acte + " plafonnée à " + a.budget + " min : " + a.cards + " cartes jouées, " + a.late + " équipe(s) replacée(s) au début de l'acte suivant"); }) : h("li", {}, "Aucun acte terminé pour l'instant.")));
      v.appendChild(h("p", { class: "meta" }, "Chaque séance a un temps fixe (30, 30 et 40 minutes) : à la fin, l'animateur ouvre l'acte suivant et les équipes en retard avancent. Temps simulé = durée indicative par carte de chaque jeu."));
    }
    function setTab(t) { curTab = t; Object.keys(views).forEach(function (k) { views[k].style.display = k === t ? "" : "none"; }); drawTabs(); if (t === "table") drawTable(); if (t === "recap") summary(); }
    function drawTabs() { tabsBar.innerHTML = ""; [["plateau", "Plateau et carte"], ["table", "Tableau animateur"], ["recap", "Récapitulatif"]].forEach(function (t) { tabsBar.appendChild(h("button", { class: curTab === t[0] ? "" : "sec", onclick: function () { setTab(t[0]); } }, t[1])); }); }
    function bandeau(txt, col) { banner.textContent = txt; banner.style.borderLeft = col ? "8px solid " + col : ""; banner.style.paddingLeft = col ? "10px" : ""; if (api) api.say(txt, col); }
    function opt(txt, cls) { return h("div", { class: "opt " + (cls || ""), style: "text-align:left;margin:4px 0;padding:8px 10px;border-radius:8px;border:2px solid #C5CCE0;background:#fff" }, txt); }
    async function playCard(t, g) {
      var nx = nextGameCase(t.pos); if (!nx) return false; var j = D.jeux[nx.jeu], r = PE.pickCard(j, t.seen[nx.jeu] || [], t.nom + S.turn + seed); if (r.reset) t.seen[nx.jeu] = []; (t.seen[nx.jeu] = t.seen[nx.jeu] || []).push(r.card.id); var c = r.card;
      head(t, "jeu " + nx.jeu); phoneBody.innerHTML = ""; bandeau("Au tour de « " + t.nom + " » · jeu " + nx.jeu + " · " + j.titre, t.col); if (api) api.focus && api.focus(t.nom);
      phoneBody.appendChild(h("p", { class: "meta" }, h("span", { class: "team", style: "background:" + D.zones[j.zone].col }, j.zone), " " + D.zones[j.zone].nom + " · carte " + c.id));
      await sleep(1500); chk(g);
      phoneBody.appendChild(h("p", { class: "big" }, c.q)); var els = [];
      if (c.t === "choix") c.opts.forEach(function (o) { var e = opt(o); els.push(e); phoneBody.appendChild(e); });
      else if (c.t === "assoc") c.items.forEach(function (it) { var s2 = h("span", { class: "meta" }, " → ?"); els.push(s2); phoneBody.appendChild(h("div", { class: "card", style: "background:#fff;margin:4px 0;padding:6px 10px" }, it.txt, s2)); });
      else if (c.t === "oral") { phoneBody.appendChild(h("p", { class: "meta" }, "L'équipe parle 60 secondes ; l'équipe voisine coche ce qu'elle a entendu :")); c.grille.forEach(function (gr) { var e = h("div", {}, "☐ " + gr); els.push(e); phoneBody.appendChild(e); }); }
      else { var ta = h("div", { style: "border:2px solid #C5CCE0;border-radius:8px;background:#fff;min-height:48px;padding:8px;font-style:italic" }, "(l'équipe écrit sa réponse…)"); els.push(ta); phoneBody.appendChild(ta); }
      await sleep(2600); chk(g);
      var ans = simAnswer(c, t.sk, S.rnd); bandeau(t.nom + " répond…", t.col);
      if (c.t === "choix") els[ans].style.borderColor = "#3B6FD8", els[ans].style.background = "#E3ECFC";
      else if (c.t === "assoc") ans.forEach(function (a, i) { els[i].textContent = " → " + c.labels[a]; els[i].style.fontWeight = 700; });
      else if (c.t === "oral") ans.forEach(function (a, i) { els[i].textContent = (a ? "☑ " : "☐ ") + c.grille[i]; });
      else { els[0].textContent = ans; els[0].style.fontStyle = "normal"; }
      await sleep(2600); chk(g);
      var res = PE.score(c, ans); bandeau("Correction : " + res.pts + " point" + (res.pts > 1 ? "s" : "") + " sur 3", t.col);
      if (c.t === "choix") { els[c.ok].style.borderColor = "#2E9E6B"; els[c.ok].style.background = "#E3F5EA"; if (ans !== c.ok) { els[ans].style.borderColor = "#E4572E"; els[ans].style.background = "#FCE6E0"; } }
      phoneBody.appendChild(h("h3", {}, res.pts + " point" + (res.pts > 1 ? "s" : "") + " sur 3")); phoneBody.appendChild(h("ul", {}, res.detail.map(function (d) { return h("li", { style: "color:" + (d.ok ? "#1b6b45" : "#a33") }, (d.ok ? "✓ " : "✗ ") + d.lab); })));
      if (c.modele) phoneBody.appendChild(h("p", {}, h("b", {}, "Réponse modèle : "), c.modele)); phoneBody.appendChild(h("div", { class: "corr" }, h("b", {}, "Corrigé : "), c.expl));
      await sleep(4200); chk(g);
      var from = t.pos, np = PE.advance(from, res.pts, S.acte, D.caps), eff = PE.landing(D.cases, D.events, np, S.acte, D.caps), mins = j.duree;
      t.n++; t.nA++; t.el += mins; t.mins += mins; t.score += res.pts; if (res.pts === 3) t.good++; var x = t.st[nx.jeu] = t.st[nx.jeu] || { n: 0, pts: 0 }; x.n++; x.pts += res.pts; t.last = { jeu: nx.jeu, pts: res.pts };
      var line = t.nom + " · jeu " + nx.jeu + " · " + res.pts + " pt → case " + np; t.pos = np;
      if (api) { await new Promise(function (ok) { api.play({ key: t.nom, pts: res.pts, nom: t.nom, col: t.col, done: ok }, list()); }); chk(g); await idle(g); api.flash(np); } else { fb.innerHTML = ""; fb.appendChild(boardSvg(list(), { big: true })); await sleep(1500); }
      bandeau(t.nom + " : le pion est arrivé case " + np, t.col); head(t); await sleep(1200); chk(g);
      if (eff) {
        phoneBody.appendChild(h("div", { class: "card", style: "border-left:6px solid #7A3FB5" }, h("b", {}, "Événement : " + eff.ev.titre), h("p", {}, eff.ev.txt))); bandeau("Événement « " + eff.ev.titre + " »", "#7A3FB5"); await sleep(3200); chk(g);
        t.pos = eff.pos; line += " · événement « " + eff.ev.titre + " » → case " + eff.pos; if (api) { api.update(list()); await sleep(300); await idle(g); api.flash(eff.pos); } else { fb.innerHTML = ""; fb.appendChild(boardSvg(list(), { big: true })); }
        bandeau(t.nom + " : case " + eff.pos, t.col); head(t); await sleep(1000); chk(g); if (eff.rejoue) S.again = true;
      }
      say(line); drawTable(); if (curTab === "recap") summary(); return true;
    }
    async function idle(g) { for (var i = 0; i < 400; i++) { if (api.idle()) return; await new Promise(function (r) { setTimeout(r, 60); }); chk(g); } }
    async function turn(g) {
      if (!S.started) { S.started = true; bandeau("Séance 0 : les cinq équipes rejoignent la partie", "#1F2A5C"); say("Séance 0 : formation des équipes (aucune carte jouée)"); head(null); phoneBody.innerHTML = ""; phoneBody.appendChild(h("p", {}, "Les équipes scannent le QR, saisissent le code de la table et leur nom : " + S.teams.map(function (t) { return t.nom; }).join(", ") + ".")); await sleep(3000); chk(g); bandeau("L'animateur ouvre l'acte 1 : " + D.actes[1].nom, "#1F2A5C"); say("▶ Séance 1 : acte 1 ouvert"); await sleep(2200); chk(g); return; }
      var n = S.teams.length, t = null, budget = SEANCE_MIN[S.acte];
      S.teams.forEach(function (q) { if (q.pos < cap() && q.pos < 31 && q.el < budget && (!t || q.el < t.el)) t = q; });
      if (t) { clock.textContent = "Séance " + S.acte + " · temps écoulé (simulé) : " + t.el + " / " + budget + " min"; }
      if (!t) {
        var mx = 0, slow = "", cards = 0, late = []; S.teams.forEach(function (q) { if (q.el > mx) { mx = q.el; slow = q.nom; } cards += q.nA; if (q.pos < cap() && q.pos < 31) late.push(q); });
        S.actes.push({ acte: S.acte, min: mx, slow: slow, cards: cards, budget: budget, late: late.length });
        if (S.acte < 3) {
          bandeau("Temps de la séance " + S.acte + " écoulé (" + budget + " min) : l'animateur clôture l'acte", "#E9A400"); say("⏱ Séance " + S.acte + " terminée (" + budget + " min) : " + late.length + " équipe(s) en retard"); await sleep(2600); chk(g);
          var lim = cap(); S.acte++; S.teams.forEach(function (q) { q.el = 0; q.nA = 0; });
          bandeau("L'animateur ouvre l'acte " + S.acte + " : " + D.actes[S.acte].nom, "#1F2A5C"); say("▶ Séance " + S.acte + " : acte " + S.acte + " ouvert"); await sleep(2000); chk(g);
          if (late.length) { bandeau("Retardataires : " + late.map(function (q) { return q.nom; }).join(", ") + " passent au début de l'acte " + S.acte + " (case " + lim + ")", "#E9A400"); late.forEach(function (q) { say(q.nom + " : retardataire, case " + q.pos + " → case " + lim); q.pos = lim; }); if (api) { api.update(list()); await sleep(400); await idle(g); } else { fb.innerHTML = ""; fb.appendChild(boardSvg(list(), { big: true })); } drawTable(); await sleep(1800); chk(g); }
        } else { S.fin = true; S.run = false; bandeau("Fin de la séance 3 : classement final", "#1F2A5C"); say("★ Partie terminée (temps écoulé)"); btnRun.textContent = "Lancer"; summary(); setTab("recap"); }
        return;
      }
      S.again = false; await playCard(t, g); if (!S.again) S.turn = (S.turn + 1) % n; await sleep(700); chk(g);
    }
    async function loop(g) {
      try { while (!S.fin) { while (g === gen && !S.run && !S.step) await new Promise(function (r) { setTimeout(r, 120); }); chk(g); S.step = false; await turn(g); } } catch (e) { if (e !== ABORT) throw e; }
    }
    function reset(newSeed) {
      gen++; if (newSeed) seed = Math.floor(Math.random() * 90000) + 10000; S = fresh(); logBox.innerHTML = ""; phoneBody.innerHTML = ""; head(null); bandeau("Prête : « Lancer » ou « Pas à pas »", "#1F2A5C"); seedLab.textContent = "Scénario n° " + seed; if (btnRun) btnRun.textContent = "Lancer"; if (api) api.update(list()); drawTable(); summary(); loop(gen);
    }
    btnRun = h("button", { class: "ok", onclick: function () { if (S.fin) reset(false); S.run = !S.run; btnRun.textContent = S.run ? "Pause (à la fin du tour)" : "Lancer"; } }, "Lancer");
    btnStep = h("button", { class: "sec", onclick: function () { if (S.fin) reset(false); S.run = false; btnRun.textContent = "Lancer"; S.step = true; } }, "Pas à pas");
    sel = h("select", { onchange: function () { speed = +sel.value; } }, [["1", "Lent (présentation)"], ["2", "Normal"], ["5", "Rapide"]].map(function (o) { return h("option", { value: o[0] }, o[1]); })); sel.style.cssText = "width:auto;display:inline-block;max-width:200px";
    var cam = h("input", { type: "checkbox", style: "width:auto" }); cam.checked = true; cam.addEventListener("change", function () { if (api) api.setAuto(cam.checked); });
    box = h("div", { style: "width:100%;height:540px;background:#F3F5F9;border-radius:10px;position:relative" });
    views.plateau = h("div", { style: "display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start" }, h("div", { style: "flex:1.7 1 460px;min-width:0" }, box, fb), h("div", { style: "flex:1 1 320px;max-width:440px" }, h("div", { class: "card", style: "border:3px solid #1F2A5C;border-radius:22px;padding:12px 14px" }, phoneHead, phoneBody)));
    views.table = h("div", { style: "display:none" }); views.recap = h("div", { style: "display:none" });
    mount(h("h1", {}, "Démo : une partie simulée, proche du réel"), h("p", { class: "meta" }, "Cinq équipes fictives de niveaux différents jouent avec les vraies cartes : carte tirée, réponse simulée, correction du vrai moteur, roue, déplacement du pion, événements. Une équipe à la fois, dans l'ordre. L'écran de droite est celui du téléphone de l'équipe qui joue. Glisser sur le plateau pour le tourner."),
      h("div", { class: "card" }, btnRun, btnStep, h("button", { class: "sec", onclick: function () { reset(false); } }, "Rejouer le même scénario"), h("button", { class: "sec", onclick: function () { reset(true); } }, "Nouveau scénario"), h("label", { style: "margin-left:10px" }, "Vitesse : ", sel), h("label", { style: "margin-left:10px" }, cam, " Caméra automatique"), " ", seedLab, h("a", { href: "#/plateau", style: "margin-left:14px" }, "← Retour"), h("div", {}, clock)),
      banner, tabsBar, views.plateau, views.table, views.recap, h("div", { class: "card" }, h("h2", {}, "Déroulé"), logBox));
    drawTabs(); reset(false); window.PLATEAU._demo = { S: function () { return S; } };
    load3d(box, function (a) { if (a) { api = a; api.update(list()); } else { box.style.display = "none"; fb.appendChild(h("p", { class: "warn" }, "La 3D n'est pas disponible sur cet appareil : plateau 2D affiché.")); fb.appendChild(boardSvg(list(), { big: true })); } }, { speed: function () { return speed; } });
  }

  window.PLATEAU = { boardSvg: boardSvg, route: function (p) { var a = p[0] || ""; if (a === "equipe") return teamJoinPage(); if (a === "anim") return animPage(); if (a === "regles") return rules(); if (a === "demo") return demoPage(); return entry(); } };
  if ((location.hash || "").indexOf("#/plateau") === 0) window.dispatchEvent(new Event("hashchange"));
})();
