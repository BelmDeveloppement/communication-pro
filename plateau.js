/* © 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. Plateau « 5 · La route de l'état de l'art » : équipes (téléphone) et animateur. */
(function () {
  "use strict";
  var A = window.APP, h = A.h, mount = A.mount, LSget = A.LSget, LSset = A.LSset, BASE = A.BASE, D = window.PLATEAU_DATA, PE = window.PEngine;
  var COLS = ["#3B6FD8", "#2E9E6B", "#E9A400", "#E4572E", "#D6479B", "#1F2A5C", "#7A3FB5", "#0E8A9E"];
  var NS = "http://www.w3.org/2000/svg";
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
      h("p", { class: "meta" }, "Un plateau de 30 cases en trois actes. Chaque équipe joue sur son téléphone ; la bonne réponse fait avancer le pion."),
      h("div", { class: "grid" }, h("a", { class: "tile", href: "#/plateau/equipe" }, h("b", {}, "Je suis une équipe"), h("div", { class: "meta" }, "Rejoindre la partie avec le code de la table")),
        h("a", { class: "tile g", href: "#/plateau/anim" }, h("b", {}, "Je suis l'animateur"), h("div", { class: "meta" }, "Ouvrir la partie, projeter le plateau, suivre les tables")),
        h("a", { class: "tile f", href: "#/plateau/regles" }, h("b", {}, "Règles et jeux"), h("div", { class: "meta" }, jeux.length + " jeux : 5.1 à 5.8"))));
  }
  function rules() {
    mount(h("h1", {}, "Règles du plateau"),
      h("div", { class: "card" }, h("ol", {}, h("li", {}, "Chaque équipe a un pion, posé sur « Départ »."), h("li", {}, "À son tour, l'équipe tire une carte du jeu de la prochaine case de jeu, répond sur son téléphone, puis lit le corrigé."), h("li", {}, "Le nombre de points (0 à 3) est le nombre de cases dont le pion avance."), h("li", {}, "Une case « ? » est un événement : il fait avancer, reculer ou rejouer."), h("li", {}, "Le plateau a trois actes. L'animateur ouvre l'acte suivant à chaque séance : on ne peut pas dépasser la fin de l'acte ouvert."), h("li", {}, "Arriver à « Examen » termine la partie. Le classement : la case atteinte, puis les points."))),
      h("div", { class: "card" }, h("h2", {}, "Les cinq zones du syllabus"), Object.keys(D.zones).map(function (z) { return h("p", {}, h("span", { class: "team", style: "background:" + D.zones[z].col }, z), D.zones[z].syl); })),
      Object.keys(D.jeux).map(function (k) { var j = D.jeux[k]; return h("div", { class: "card" }, h("h2", {}, "Jeu " + k + " · " + j.titre), h("p", { class: "meta" }, "Zone " + j.zone + " · acte " + j.acte + " · " + j.duree + " min par carte environ"), h("p", {}, j.regle)); }),
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
          if (m.t === "cfg") { st.cfg = { mode: m.mode, acte: m.acte }; LSset(TK, st); if (onCfg) onCfg(); }
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
    var top = h("div", {}), board = h("div", {}), main = h("div", {}), ans = null;
    linkEl = h("p", { class: "warn" }, "○ Connexion à l'animateur…");
    function fresh() {
      top.innerHTML = ""; var cap = PE.capFor(st.cfg.acte, D.caps);
      top.appendChild(h("div", { class: "card" }, h("b", {}, st.nom), st.table ? "  ·  table " + st.table : "", h("div", { class: "big" }, "Case " + st.pos + " / 31  ·  " + st.score + " point" + (st.score > 1 ? "s" : "")), linkEl,
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
      if (st.pos >= cap) { main.appendChild(h("div", { class: "warn" }, "Fin de l'acte " + st.cfg.acte + " : attendez que l'animateur ouvre l'acte suivant.")); return; }
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
      var r = PE.score(c, ans), from = st.pos, np = PE.advance(from, r.pts, st.cfg.acte, D.caps), eff = PE.landing(D.cases, D.events, np, st.cfg.acte, D.caps), jeu = st.cur.jeu;
      (st.seen[jeu] = st.seen[jeu] || []).push(c.id); st.score += r.pts; st.pos = eff ? eff.pos : np; if (st.pos >= 31) st.done = true;
      st.res = { jeu: jeu, id: c.id, pts: r.pts, detail: r.detail, from: from, to: np, final: st.pos, ev: eff ? { titre: eff.ev.titre, txt: eff.ev.txt, rejoue: eff.rejoue } : null };
      st.log.push({ jeu: jeu, pts: r.pts, to: st.pos }); st.cur = null; save(); draw();
    }
    function drawResult() {
      var r = st.res, c = jeuOf(r.jeu).cartes.filter(function (x) { return x.id === r.id; })[0], phys = st.cfg.mode === "physique", moved = r.final - r.from;
      main.appendChild(h("div", { class: "card" }, h("h2", {}, r.pts + " point" + (r.pts > 1 ? "s" : "") + " sur 3"), h("ul", {}, r.detail.map(function (d) { return h("li", { style: "color:" + (d.ok ? "#1b6b45" : "#a33") }, (d.ok ? "✓ " : "✗ ") + d.lab); })),
        c.modele ? h("p", {}, h("b", {}, "Réponse modèle : "), c.modele) : null, h("div", { class: "corr" }, h("b", {}, "Corrigé : "), c.expl)));
      main.appendChild(h("div", { class: phys ? "warn big" : "card" }, phys ? "Déplacez votre pion de " + (r.to - r.from) + " case" + ((r.to - r.from) > 1 ? "s" : "") + (r.ev && r.final !== r.to ? ", puis " + (r.final - r.to > 0 ? "avancez" : "reculez") + " de " + Math.abs(r.final - r.to) : "") + " : case " + r.final + "." : "Votre pion va à la case " + r.final + "."));
      if (r.ev) main.appendChild(h("div", { class: "card", style: "border-left:6px solid #7A3FB5" }, h("b", {}, "Événement : " + r.ev.titre), h("p", {}, r.ev.txt)));
      main.appendChild(h("button", { class: "ok", onclick: function () { var rej = r.ev && r.ev.rejoue, jeu = r.jeu; st.res = null; if (rej && st.pos < PE.capFor(st.cfg.acte, D.caps)) { var j = jeuOf(jeu), rr = PE.pickCard(j, st.seen[jeu] || [], st.sid + "j"); st.cur = { jeu: jeu, id: rr.card.id }; } save(); draw(); } }, r.ev && r.ev.rejoue ? "Rejouer une carte" : "Carte suivante"));
    }
    mount(h("h1", {}, "5 · La route de l'état de l'art"), top, board, main, h("p", {}, h("a", { href: "#/plateau/regles" }, "Règles"), "  ·  ", h("a", { href: "#", onclick: function (e) { e.preventDefault(); if (confirm("Quitter la partie ? Votre progression sera perdue.")) { try { localStorage.removeItem(TK); } catch (x) {} if (peer) try { peer.destroy(); } catch (x) {} st = null; location.hash = "#/plateau"; } } }, "Quitter la partie")));
    draw(); teamConnect(); teamSend();
  }

  /* ---------- Animateur ---------- */
  var PK = "pl-prof";
  function animPage() {
    var P = LSget(PK) || { code: "", mode: "numerique", acte: 1, teams: {} }, hpeer = null, online = {}, view = "plateau", big = false, dirty = true, three = null, content = h("div", {}), status = h("p", { class: "meta" }, "");
    function persist() { LSset(PK, P); }
    function cfgMsg() { return { t: "cfg", mode: P.mode, acte: P.acte }; }
    function bcast() { Object.keys(online).forEach(function (sid) { try { online[sid].send(cfgMsg()); } catch (e) {} }); }
    function ingest(m, c) {
      if (m.t !== "hello" && m.t !== "state") return;
      var o = P.teams[m.sid] = P.teams[m.sid] || { ci: Object.keys(P.teams).length }; ["nom", "table", "pos", "score", "done", "n"].forEach(function (k) { if (m[k] !== undefined) o[k] = m[k]; }); if (m.last) o.last = m.last; o.ts = Date.now();
      if (c) { online[m.sid] = c; if (m.t === "hello") try { c.send(cfgMsg()); } catch (e) {} }
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
        h("div", {}, h("b", {}, "Acte ouvert : "), [1, 2, 3].map(function (a) { return h("button", { class: P.acte === a ? "" : "sec", onclick: function () { P.acte = a; persist(); bcast(); rebuild(); } }, "Acte " + a + " · " + D.actes[a].nom + " (" + D.actes[a].jeux.join(", ") + ")"); })));
      return box;
    }
    var ctrlBox = h("div", {}), bar = h("div", { class: "card" });
    function rebuild() { ctrlBox.innerHTML = ""; ctrlBox.appendChild(ctrl()); }
    function tabs() {
      bar.innerHTML = ""; [["plateau", "Plateau"], ["tableau", "Tableau des tables"], ["3d", "Vue 3D"]].forEach(function (t) { bar.appendChild(h("button", { class: view === t[0] ? "" : "sec", onclick: function () { view = t[0]; tabs(); dirty = true; draw(); } }, t[1])); });
      var bg = h("input", { type: "checkbox", style: "width:auto" }); bg.checked = big; bg.addEventListener("change", function () { big = bg.checked; content.style.fontSize = big ? "24px" : ""; });
      bar.appendChild(h("label", { style: "margin-left:12px" }, bg, " Grand texte (projection)")); bar.appendChild(h("button", { class: "sec", onclick: exportCsv }, "Exporter en CSV"));
      bar.appendChild(h("button", { class: "sec", onclick: function () { if (confirm("Effacer toutes les équipes de la partie ?")) { P.teams = {}; persist(); dirty = true; draw(); } } }, "Effacer les équipes"));
    }
    function draw() {
      if (view === "3d" && three && !dirty) { three.update(pawns()); return; }
      dirty = false; content.innerHTML = ""; var ts = teams();
      content.appendChild(h("p", { class: "meta" }, ts.length + " équipe(s) · " + Object.keys(online).length + " en ligne · mode " + (P.mode === "physique" ? "physique" : "numérique") + " · acte " + P.acte + " ouvert"));
      if (view === "3d") { three = null; var box = h("div", { style: "width:100%;height:520px;background:#F3F5F9;border-radius:10px;position:relative" }); content.appendChild(box); load3d(box, function (api) { three = api; if (api) api.update(pawns()); else { content.innerHTML = ""; content.appendChild(h("p", { class: "warn" }, "La 3D n'est pas disponible sur cet appareil : plateau 2D affiché.")); content.appendChild(boardSvg(pawns(), { big: true })); } }); return; }
      if (view === "plateau") { content.appendChild(boardSvg(pawns(), { big: true })); content.appendChild(h("p", {}, ts.map(function (t) { return h("span", { class: "team", style: "background:" + COLS[(t.ci || 0) % COLS.length] }, (t.table ? t.table + " · " : "") + t.nom + " · case " + t.pos); }))); return; }
      var rank = ts.slice().sort(function (a, b) { return (b.pos - a.pos) || (b.score - a.score); });
      var tb = h("table", {}, h("tr", {}, ["Rang", "Table", "Équipe", "Case", "Points", "Dernier jeu", "En ligne", "Ajuster"].map(function (x) { return h("th", {}, x); })));
      rank.forEach(function (t, i) { var l = t.last;
        tb.appendChild(h("tr", {}, [h("td", {}, String(i + 1)), h("td", {}, t.table || "—"), h("td", {}, h("span", { class: "team", style: "background:" + COLS[(t.ci || 0) % COLS.length] }, t.nom)), h("td", {}, t.done ? "Examen ✓" : String(t.pos)), h("td", {}, String(t.score)), h("td", {}, l ? (l.jeu + " · " + l.pts + " pt") : ""), h("td", {}, online[t.sid] ? "●" : "○"),
          h("td", {}, h("button", { class: "sec", onclick: function () { adj(t.sid, -1); } }, "−1"), h("button", { class: "sec", onclick: function () { adj(t.sid, 1); } }, "+1"))])); });
      content.appendChild(tb); content.appendChild(h("p", { class: "meta" }, "Classement : case atteinte, puis points. « Ajuster » déplace le pion de l'équipe (arbitrage d'une réponse orale, par exemple)."));
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
    A.timers.push(setInterval(function () { if (dirty) draw(); else if (view === "3d" && three) three.update(pawns()); }, 700));
  }

  /* ---------- 3D (Three.js chargé à la demande) ---------- */
  function load3d(box, cb) {
    function go() {
      try {
        var T = window.THREE; var cv = document.createElement("canvas"); var gl = cv.getContext("webgl") || cv.getContext("experimental-webgl"); if (!gl) return cb(null);
        var W = box.clientWidth || 900, H = box.clientHeight || 520, r = new T.WebGLRenderer({ antialias: true, alpha: true }); r.setSize(W, H); box.appendChild(r.domElement);
        var sc = new T.Scene(), cam = new T.PerspectiveCamera(45, W / H, 0.1, 200), ang = 0, dragging = false, lx = 0, tilt = 0.9;
        sc.add(new T.AmbientLight(0xffffff, 0.8)); var dl = new T.DirectionalLight(0xffffff, 0.8); dl.position.set(8, 14, 6); sc.add(dl);
        function P3(c) { return new T.Vector3(c.x * 0.2 - 12, 0, c.y * 0.2 - 6.6); }
        var g = new T.Group(); sc.add(g);
        var base = new T.Mesh(new T.BoxGeometry(26, 0.4, 15.4), new T.MeshLambertMaterial({ color: 0xc5d5ee })); base.position.y = -0.4; g.add(base);
        D.cases.forEach(function (c, i) {
          var p = P3(c), m = new T.Mesh(new T.BoxGeometry(1.5, c.type === "exam" ? 1.4 : 0.5, 1.5), new T.MeshLambertMaterial({ color: zcol(c) })); m.position.set(p.x, 0.15, p.z); g.add(m);
          var cvs = document.createElement("canvas"); cvs.width = cvs.height = 64; var x = cvs.getContext("2d"); x.fillStyle = "#fff"; x.font = "bold 30px sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(c.type === "jeu" ? c.jeu : c.type === "event" ? "?" : c.type === "exam" ? "★" : "▶", 32, 34);
          var pl = new T.Mesh(new T.PlaneGeometry(1.3, 1.3), new T.MeshBasicMaterial({ map: new T.CanvasTexture(cvs), transparent: true })); pl.rotation.x = -Math.PI / 2; pl.position.set(p.x, c.type === "exam" ? 0.86 : 0.41, p.z); g.add(pl);
        });
        var line = new T.Line(new T.BufferGeometry().setFromPoints(D.cases.map(function (c) { var p = P3(c); p.y = 0.05; return p; })), new T.LineBasicMaterial({ color: 0xb9c4e8 })); g.add(line);
        var pawnsM = {}, targets = {};
        function frame() { var rad = 13.5; cam.position.set(Math.sin(ang) * rad, rad * tilt, Math.cos(ang) * rad); cam.lookAt(0, 0, 0); }
        r.domElement.addEventListener("pointerdown", function (e) { dragging = true; lx = e.clientX; }); window.addEventListener("pointerup", function () { dragging = false; });
        r.domElement.addEventListener("pointermove", function (e) { if (dragging) { ang -= (e.clientX - lx) * 0.01; lx = e.clientX; } });
        var alive = true;
        function loop() { if (!alive || !document.body.contains(r.domElement)) { alive = false; return; } Object.keys(pawnsM).forEach(function (k) { var m = pawnsM[k], t = targets[k]; if (t) m.position.lerp(t, 0.12); }); frame(); r.render(sc, cam); requestAnimationFrame(loop); }
        loop();
        cb({ update: function (list) {
          var byPos = {}; list.forEach(function (p) { (byPos[p.pos] = byPos[p.pos] || []).push(p); });
          list.forEach(function (p) {
            var k = p.sid || p.nom; if (!pawnsM[k]) { var m = new T.Group(), body = new T.Mesh(new T.CylinderGeometry(0.28, 0.36, 0.8, 16), new T.MeshLambertMaterial({ color: p.col })), head = new T.Mesh(new T.SphereGeometry(0.3, 16, 12), new T.MeshLambertMaterial({ color: p.col })); head.position.y = 0.6; m.add(body); m.add(head); var c0 = D.cases[0], p0 = P3(c0); m.position.set(p0.x, 0.9, p0.z); g.add(m); pawnsM[k] = m; }
            var c = D.cases[p.pos], p3 = P3(c), arr = byPos[p.pos], i = arr.indexOf(p), a = i / arr.length * Math.PI * 2, rr = arr.length > 1 ? 0.45 : 0;
            targets[k] = new T.Vector3(p3.x + Math.cos(a) * rr, (c.type === "exam" ? 1.7 : 0.9), p3.z - 0.5 + Math.sin(a) * rr);
          });
        } });
      } catch (e) { cb(null); }
    }
    if (window.THREE) return go();
    var s = document.createElement("script"); s.src = "three.min.js"; s.onload = go; s.onerror = function () { cb(null); }; document.head.appendChild(s);
  }

  window.PLATEAU = { route: function (p) { var a = p[0] || ""; if (a === "equipe") return teamJoinPage(); if (a === "anim") return animPage(); if (a === "regles") return rules(); return entry(); } };
  if ((location.hash || "").indexOf("#/plateau") === 0) window.dispatchEvent(new Event("hashchange"));
})();
