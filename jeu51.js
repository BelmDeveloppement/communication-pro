/* © 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. Créé avec l'aide de Claude (Anthropic), relu par l'auteur.
   Plateau « 5 · La route de l'état de l'art », mode tables et joueurs : page joueur (#/j) et tour de contrôle enseignant (#/tour). */
(function () {
  "use strict";
  var A = window.APP, h = A.h, mount = A.mount, LSget = A.LSget, LSset = A.LSset, D = window.PLATEAU_DATA, PE = window.PEngine, C = window.J51Core, PL = window.PLATEAU;
  var CODE = "ROUTE", NS = "http://www.w3.org/2000/svg";
  var ST = { attend: ["○", "attend", "#8A93A8"], encours: ["✎", "en cours", "#3B6FD8"], validee: ["✓", "validée", "#7A3FB5"], juste: ["★", "juste", "#2E9E6B"], partielle: ["◐", "partielle", "#E9A400"], ratee: ["✗", "ratée", "#E4572E"], fini: ["⚑", "arrivé", "#1F2A5C"] };
  var leave = [];
  function onLeave(f) { leave.push({ f: f, h: location.hash }); }
  window.addEventListener("hashchange", function () { var run = leave.filter(function (x) { return x.h !== location.hash; }); leave = leave.filter(function (x) { return x.h === location.hash; }); run.forEach(function (x) { try { x.f(); } catch (e) {} }); if (!/^#\/tour/.test(location.hash)) document.body.classList.remove("jx-full"); });
  function mmss(ms) { var t = Math.max(0, Math.round(ms / 1000)); return Math.floor(t / 60) + ":" + ("0" + (t % 60)).slice(-2); }
  function rid() { return "p" + Math.random().toString(36).slice(2, 10); }
  function q() { var o = {}, s = (location.hash.split("?")[1] || ""); s.split("&").forEach(function (kv) { if (kv) { var a = kv.split("="); o[a[0]] = decodeURIComponent(a[1] || ""); } }); return o; }
  function sv(tag, attrs, text) { var e = document.createElementNS(NS, tag); Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); }); if (text !== undefined) e.textContent = text; return e; }
  function pct(x) { return Math.round(x * 100) + " %"; }
  function pastille(st, nom, col) { var s = ST[st] || ST.attend; return h("span", { class: "jx-chip", style: "border-color:" + col }, h("i", { style: "background:" + col }), nom, h("b", { style: "color:" + s[2] }, " " + s[0]), h("small", {}, " " + s[1])); }

  /* ---------- Transport : PeerJS (autres appareils) + BroadcastChannel (même navigateur) ---------- */
  function hostNet(code, onmsg, onstatus) {
    var conns = {}, peer = null, dead = false, bc = null, retry = null;
    try { bc = new BroadcastChannel("cpro-j-" + code); bc.onmessage = function (e) { if (e.data && e.data.to === "host") onmsg(e.data.m, null); }; } catch (e) {}
    function open() {
      if (dead || typeof Peer === "undefined") { onstatus(bc ? "local" : "off"); return; }
      try {
        peer = new Peer("cpro-j-" + code);
        peer.on("open", function () { onstatus("ok"); });
        peer.on("connection", function (c) { c.on("data", function (m) { if (m && m.sid) { conns[m.sid] = c; onmsg(m, c); } }); });
        peer.on("error", function (e) { if (e && e.type === "unavailable-id") { onstatus("busy"); retry = setTimeout(function () { try { peer.destroy(); } catch (x) {} open(); }, 5000); } else onstatus("err"); });
        peer.on("disconnected", function () { onstatus("err"); if (!dead) try { peer.reconnect(); } catch (e) {} });
      } catch (e) { onstatus("err"); }
    }
    open();
    return { send: function (sid, m) { var c = conns[sid]; if (c && c.open) try { c.send(m); } catch (e) {} if (bc) try { bc.postMessage({ to: sid, m: m }); } catch (e) {} },
      bind: function (real, sid) { if (conns[sid]) conns[real] = conns[sid]; },
      close: function () { dead = true; clearTimeout(retry); try { peer && peer.destroy(); } catch (e) {} try { bc && bc.close(); } catch (e) {} } };
  }
  function clientNet(code, getSid, onmsg, onlink, hello) {
    var peer = null, conn = null, dead = false, retry = null, bc = null;
    try { bc = new BroadcastChannel("cpro-j-" + code); bc.onmessage = function (e) { if (e.data && e.data.to === getSid()) { onmsg(e.data.m); onlink(true); } }; } catch (e) {}
    function connect() {
      if (dead || typeof Peer === "undefined") return; clearTimeout(retry);
      var again = function (ms) { onlink(false); clearTimeout(retry); retry = setTimeout(connect, ms); };
      try {
        if (peer) try { peer.destroy(); } catch (e) {}
        peer = new Peer(); peer.on("open", function () {
          conn = peer.connect("cpro-j-" + code, { reliable: true });
          conn.on("open", function () { onlink(true); hello(); }); conn.on("data", function (m) { onmsg(m); });
          conn.on("close", function () { again(3000); }); conn.on("error", function () { again(5000); });
        });
        peer.on("error", function () { again(6000); }); peer.on("disconnected", function () { again(5000); });
      } catch (e) { again(8000); }
    }
    connect();
    return { send: function (m) { if (conn && conn.open) try { conn.send(m); } catch (e) {} if (bc) try { bc.postMessage({ to: "host", m: m }); } catch (e) {} },
      close: function () { dead = true; clearTimeout(retry); try { peer && peer.destroy(); } catch (e) {} try { bc && bc.close(); } catch (e) {} } };
  }

  /* ---------- Roue révélatrice (0 à 3 cases) ---------- */
  var WCOL = ["#5B6478", "#E9A400", "#3B6FD8", "#2E9E6B"];
  function wheelEl() {
    var w = sv("svg", { viewBox: "-60 -66 120 126", width: 180, height: 189, style: "display:block;margin:6px auto" }), g = sv("g", { style: "transition:transform 3.2s cubic-bezier(.12,.7,.18,1);transform-origin:0 0" });
    for (var i = 0; i < 4; i++) { var a0 = (i * 90 - 90) * Math.PI / 180, a1 = ((i + 1) * 90 - 90) * Math.PI / 180, am = (a0 + a1) / 2;
      g.appendChild(sv("path", { d: "M0 0 L" + (55 * Math.cos(a0)).toFixed(2) + " " + (55 * Math.sin(a0)).toFixed(2) + " A55 55 0 0 1 " + (55 * Math.cos(a1)).toFixed(2) + " " + (55 * Math.sin(a1)).toFixed(2) + " Z", fill: WCOL[i], stroke: "#fff", "stroke-width": 1.5 }));
      g.appendChild(sv("text", { x: (33 * Math.cos(am)).toFixed(2), y: (33 * Math.sin(am) + 7).toFixed(2), "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: "#fff" }, String(i))); }
    w.appendChild(g); w.appendChild(sv("circle", { cx: 0, cy: 0, r: 5, fill: "#1F2A5C" })); w.appendChild(sv("path", { d: "M-7 -64 L7 -64 L0 -50 Z", fill: "#E4572E", stroke: "#fff", "stroke-width": 1 })); w._g = g; return w;
  }
  function spinWheel(w, pts, done) {
    var fin = false, g = w._g; function end() { if (fin) return; fin = true; setTimeout(done, 700); }
    var R = 360 * 4 + 360 - (pts * 90 + 45); requestAnimationFrame(function () { requestAnimationFrame(function () { g.style.transform = "rotate(" + R + "deg)"; }); });
    g.addEventListener("transitionend", end); var t = setTimeout(end, 3500);
    return function () { if (fin) return; g.style.transition = "none"; g.style.transform = "rotate(" + (360 - (pts * 90 + 45)) + "deg)"; clearTimeout(t); end(); };
  }

  /* ---------- Page joueur ---------- */
  var MK0 = "j-me", MK = MK0;
  function joinPage() {
    var p = q(); MK = MK0 + (p.k || ""); var me = LSget(MK);
    if (me && me.sid && (!p.c || me.code === p.c.toUpperCase()) && (!p.t || String(p.t) === String(me.table).replace(/\D/g, ""))) return play(me);
    var code = h("input", { value: (p.c || CODE).toUpperCase(), maxlength: 8, style: "text-transform:uppercase;max-width:200px" }), nom = h("input", { placeholder: "Votre prénom", maxlength: 18, autocomplete: "given-name" });
    var sel = h("select", {}, [1, 2, 3, 4, 5].map(function (n) { return h("option", { value: String(n) }, "Table " + n); })); if (p.t) sel.value = String(parseInt(p.t, 10) || 1);
    var msg = h("p", { class: "warn", style: "display:none" });
    mount(h("h1", {}, "5 · La route de l'état de l'art"), h("div", { class: "card" }, h("h2", {}, "Rejoindre la partie"),
      h("p", {}, "Votre prénom :"), nom, h("p", {}, "Votre table (numéro écrit sur le plateau) :"), sel, h("p", {}, "Code de partie :"), code,
      h("button", { class: "ok", onclick: function () {
        if (!nom.value.trim()) { msg.style.display = "block"; msg.textContent = "Saisissez votre prénom."; return; }
        play({ sid: rid(), nom: nom.value.trim(), table: "T" + sel.value, code: code.value.trim().toUpperCase() || CODE });
      } }, "Rejoindre"), msg), h("p", { class: "meta" }, "Un joueur = un étudiant, sur son téléphone ou son ordinateur. Cinq joueurs au maximum par table."));
  }
  function play(me) {
    LSset(MK, me);
    var snap = null, net = null, key = "", linkOk = false, rolled = (LSget("j-roll") || {})[me.code + me.sid] || -1, ack = (LSget("j-ack") || {})[me.code + me.sid] || 0, answers = null, tmr = null;
    var head = h("div", {}), board = h("div", {}), body = h("div", {}), info = h("p", { class: "meta" }, "○ Connexion à l'enseignant…");
    function saveFlags() { var r = LSget("j-roll") || {}, a = LSget("j-ack") || {}; r[me.code + me.sid] = rolled; a[me.code + me.sid] = ack; LSset("j-roll", r); LSset("j-ack", a); }
    function send(m) { m.sid = me.sid; if (net) net.send(m); }
    function hello() { send({ t: "join", nom: me.nom, table: me.table }); }
    function onmsg(m) {
      if (m.t === "err") { try { localStorage.removeItem(MK); } catch (e) {} mount(h("h1", {}, "Rejoindre la partie"), h("div", { class: "warn" }, m.msg), h("p", {}, h("a", { href: "#/j" }, "← Réessayer"))); stopAll(); return; }
      if (m.t !== "snap") return; snapAt = Date.now();
      if (m.me.sid !== me.sid) { me.sid = m.me.sid; LSset(MK, me); }
      snap = m; render();
    }
    function stopAll() { if (net) net.close(); net = null; clearInterval(tmr); }
    onLeave(stopAll);
    var snapAt = Date.now(), clockEl = h("span", {});
    function clockTick() { if (!snap) return; var left = snap.end - (Date.now() + (snap.now - snapAt)); clockEl.textContent = snap.status === "play" ? mmss(left) : snap.status === "ended" ? "terminée" : "—"; clockEl.style.color = snap.status === "play" && left < 120000 ? "#E4572E" : ""; }
    function onlink(ok) { linkOk = ok; info.textContent = ok ? "● Connecté à l'enseignant" : "○ Hors ligne : la partie reprendra à la reconnexion"; info.className = ok ? "meta" : "warn"; }
    net = clientNet(me.code, function () { return me.sid; }, onmsg, onlink, hello);
    setTimeout(hello, 400);
    tmr = setInterval(hello, 4000);
    A.timers.push(setInterval(clockTick, 500));

    function pawns() { return snap.table.players.map(function (p) { return { pos: p.pos, col: p.col, label: p.nom }; }); }
    function render() {
      var m = snap.me, ci = m.ci;
      head.innerHTML = ""; head.appendChild(h("div", { class: "card" }, h("span", { class: "jx-dot", style: "background:" + m.col }), h("b", {}, " " + m.nom), "  ·  " + C.COLNAMES[ci] + "  ·  table " + m.table.slice(1),
        h("div", { class: "big" }, "Case " + m.pos + " / 31  ·  " + m.score + " point" + (m.score > 1 ? "s" : "")), h("div", {}, h("span", { class: "meta" }, "Temps de la séance : "), clockEl), info));
      board.innerHTML = ""; board.appendChild(PL.boardSvg(pawns()));
      var T = snap.table, k, last = T.last && T.last.res[m.sid] && T.last.round >= ack ? T.last : null;
      if (T.cur && T.cur.mine === false && !last) k = "card:" + T.round + ":" + T.cur.id;
      else if (last) k = "res:" + last.round + ":" + (rolled >= last.round ? 1 : 0);
      else if (T.cur) k = "wait:" + T.round + ":" + T.cur.answered.length + ":" + T.players.length;
      else k = "idle:" + snap.jeux.join("+") + ":" + T.round + ":" + snap.canDraw + ":" + snap.status + ":" + T.players.length + ":" + snap.tireur;
      clockTick(); if (k === key) return; key = k; body.innerHTML = "";
      if (k.indexOf("card:") === 0) return drawCard(T.cur);
      if (k.indexOf("res:") === 0) return drawResult(last);
      if (k.indexOf("wait:") === 0) return body.appendChild(h("div", { class: "card" }, h("h2", {}, "Réponse envoyée"), h("p", {}, "En attente des autres joueurs de la table…"), chips(T)));
      drawIdle(T);
    }
    function chips(T) { return h("div", {}, T.players.map(function (p) { return pastille(p.st, p.nom, p.col); })); }
    function drawIdle(T) {
      if (snap.status === "lobby") return body.appendChild(h("div", { class: "card" }, h("h2", {}, "En attente du lancement"), h("p", {}, "L'enseignant lance la séance. Joueurs déjà à la table :"), chips(T)));
      if (snap.me.done) return body.appendChild(h("div", { class: "card" }, h("h2", {}, "Arrivée à l'Examen !"), h("p", {}, "Vous avez terminé la route : " + snap.me.score + " points.")));
      if (snap.status === "ended") return body.appendChild(h("div", { class: "card" }, h("h2", {}, "Séance terminée"), h("p", {}, "Case " + snap.me.pos + ", " + snap.me.score + " points. Classement de la table :"), h("ol", {}, T.players.slice().sort(function (a, b) { return b.pos - a.pos || b.score - a.score; }).map(function (p) { return h("li", {}, p.nom + " : case " + p.pos + ", " + p.score + " pt"); }))));
      var j = D.jeux[snap.jeux[0]];
      body.appendChild(h("div", { class: "card" }, h("h2", {}, "Jeu " + snap.jeux.join(" · ") + (snap.jeux.length === 1 ? " · " + j.titre : "")), snap.jeux.length === 1 ? h("p", {}, j.regle) : null,
        snap.canDraw ? h("div", {}, h("p", { class: "big" }, "C'est à vous de tirer la carte pour la table."), h("button", { class: "ok", onclick: function () { send({ t: "draw" }); } }, "Tirer la carte"))
          : h("p", { class: "big" }, "Au tour de " + (snap.tireur || "…") + " de tirer la carte."), chips(T)));
    }
    function drawCard(cur) {
      var c = C.cardOf(cur.jeu, cur.id), j = D.jeux[cur.jeu], box = h("div", { class: "card" }), ans;
      box.appendChild(h("h2", {}, "Jeu " + cur.jeu + " · " + j.titre)); box.appendChild(h("p", { class: "big" }, c.q));
      if (c.t === "choix") {
        ans = -1; var bs = []; PE.shuffle(c.opts.map(function (o, i) { return i; }), me.sid + c.id).forEach(function (i) { var b = h("button", { class: "opt", onclick: function () { ans = i; bs.forEach(function (x) { x.className = "opt"; }); b.className = "opt sel"; } }, c.opts[i]); bs.push(b); box.appendChild(b); });
      } else if (c.t === "assoc") {
        ans = c.items.map(function () { return -1; });
        PE.shuffle(c.items.map(function (it, i) { return i; }), me.sid + c.id).forEach(function (i) { var sel = h("select", {}, [h("option", { value: "-1" }, "Choisir…")].concat(c.labels.map(function (l, k) { return h("option", { value: String(k) }, l); }))); sel.addEventListener("change", function () { ans[i] = +sel.value; }); box.appendChild(h("div", { class: "card", style: "background:#fff" }, h("p", {}, c.items[i].txt), sel)); });
      } else if (c.t === "texte") {
        var ta = h("textarea", { rows: c.rows || 2, placeholder: "Votre requête" }); ans = ""; ta.addEventListener("input", function () { ans = ta.value; }); box.appendChild(ta);
      } else {
        box.appendChild(h("p", { class: "meta" }, "Parlez 60 secondes, puis cochez ce que vous avez réussi :")); ans = c.grille.map(function () { return false; });
        c.grille.forEach(function (g, i) { var cb = h("input", { type: "checkbox", style: "width:auto" }); cb.addEventListener("change", function () { ans[i] = cb.checked; }); box.appendChild(h("label", { style: "display:block;margin:6px 0" }, cb, " " + g)); });
      }
      var msg = h("p", { class: "warn", style: "display:none" }, "Répondez avant de valider.");
      box.appendChild(h("button", { class: "ok", onclick: function () {
        if ((c.t === "choix" && ans < 0) || (c.t === "assoc" && ans.some(function (x) { return x < 0; })) || (c.t === "texte" && !String(ans).trim())) { msg.style.display = "block"; return; }
        send({ t: "ans", ans: ans }); key = "wait:"; body.innerHTML = ""; body.appendChild(h("div", { class: "card" }, h("h2", {}, "Réponse envoyée"), h("p", {}, "En attente des autres joueurs de la table…")));
      } }, "Valider ma réponse"), msg); body.appendChild(box);
    }
    function drawResult(last) {
      var r = last.res[snap.me.sid], c = C.cardOf(last.jeu, last.id), m = snap.me;
      function details() {
        body.innerHTML = "";
        var moved = r.final - r.from, pawn = C.COLNAMES[m.ci];
        body.appendChild(h("div", { class: "card" }, h("h2", {}, r.pts + " point" + (r.pts > 1 ? "s" : "") + " sur 3"), r.answered ? null : h("p", { class: "warn" }, "Pas de réponse envoyée à temps."),
          h("ul", {}, r.detail.map(function (d) { return h("li", { style: "color:" + (d.ok ? "#1b6b45" : "#a33") }, (d.ok ? "✓ " : "✗ ") + d.lab); })),
          c.modele ? h("p", {}, h("b", {}, "Réponse modèle : "), c.modele) : null, h("div", { class: "corr" }, h("b", {}, "Corrigé : "), c.expl)));
        body.appendChild(h("div", { class: "warn big" }, "Pion " + pawn + " : " + (r.to - r.from === 0 ? "il reste" : "avancez de " + (r.to - r.from) + " case" + ((r.to - r.from) > 1 ? "s" : "")) + (r.ev && r.final !== r.to ? ", puis " + (r.final - r.to > 0 ? "avancez" : "reculez") + " de " + Math.abs(r.final - r.to) : "") + " → case " + r.final + "."));
        if (r.ev) body.appendChild(h("div", { class: "card", style: "border-left:6px solid #7A3FB5" }, h("b", {}, "Événement : " + r.ev.titre), h("p", {}, r.ev.txt)));
        body.appendChild(h("p", { class: "meta" }, "Autres joueurs de la table : " + snap.table.players.filter(function (p) { return p.sid !== m.sid; }).map(function (p) { var x = last.res[p.sid]; return p.nom + " +" + (x ? x.pts : 0); }).join(" · ")));
        body.appendChild(h("button", { class: "ok", onclick: function () { ack = last.round + 1; saveFlags(); key = ""; render(); } }, "Continuer"));
      }
      if (rolled >= last.round) return details();
      var wl = wheelEl(), skip;
      body.appendChild(h("div", { class: "card", style: "text-align:center" }, h("p", { class: "big" }, "La roue révèle vos points…"), wl, skip = h("button", { class: "sec" }, "Passer")));
      var stop = spinWheel(wl, r.pts, function () { rolled = last.round; saveFlags(); key = "res:" + last.round + ":1"; details(); }); skip.onclick = stop;
    }
    mount(h("h1", {}, "5 · La route de l'état de l'art"), head, board, body,
      h("p", {}, h("a", { href: "#/plateau/regles" }, "Règles"), "  ·  ", h("a", { href: "#", onclick: function (e) { e.preventDefault(); if (confirm("Quitter la partie ? Vous pourrez la rejoindre avec le même prénom.")) { try { localStorage.removeItem(MK); } catch (x) {} stopAll(); location.hash = "#/j"; } } }, "Quitter la partie")));
    body.appendChild(h("p", { class: "meta" }, "Connexion…"));
  }

  /* ---------- Tour de contrôle ---------- */
  var GK = "j-game", PK = "j-pin";
  function hashPin(s) { var x = 7; for (var i = 0; i < s.length; i++) x = (x * 33 + s.charCodeAt(i)) >>> 0; return x; }
  function towerGate(next) {
    var ok = false; try { ok = sessionStorage.getItem("j-ok") === "1"; } catch (e) {} var ts = LSget("j-okts"); if (ts && Date.now() - ts < 4 * 3600000) ok = true;
    if (ok) return (next || setup)();
    var pin = LSget(PK), inp = h("input", { type: "password", inputmode: "numeric", maxlength: 8, placeholder: "Code PIN", style: "max-width:200px" }), msg = h("p", { class: "warn", style: "display:none" });
    function pass() { try { sessionStorage.setItem("j-ok", "1"); } catch (e) {} LSset("j-okts", Date.now()); (next || setup)(); }
    mount(h("h1", {}, "Tour de contrôle"), h("div", { class: "card" }, h("p", {}, pin ? "Code PIN enseignant :" : "Première utilisation : choisissez un code PIN (4 chiffres ou plus). Il protège l'accès sur cet ordinateur."), inp,
      h("button", { class: "ok", onclick: function () {
        var v = inp.value.trim(); if (v.length < 4) { msg.style.display = "block"; msg.textContent = "Au moins 4 caractères."; return; }
        if (!pin) { LSset(PK, hashPin(v)); return pass(); }
        if (hashPin(v) === pin) return pass(); msg.style.display = "block"; msg.textContent = "Code incorrect.";
      } }, pin ? "Entrer" : "Enregistrer et entrer"), msg), h("p", { class: "meta" }, "Le PIN est stocké dans ce navigateur : il évite qu'un étudiant ouvre la tour sur le poste projeté, ce n'est pas une authentification réseau."));
  }
  function setup() {
    var saved = LSget(GK), jeuxOk = Object.keys(D.jeux), sel = {}, min = h("input", { type: "number", value: "30", min: 5, max: 90, style: "max-width:90px" });
    var boxes = jeuxOk.map(function (k) { var cb = h("input", { type: "checkbox", style: "width:auto" }); cb.checked = k === "5.1"; sel[k] = cb; return h("label", { style: "display:block;margin:4px 0" }, cb, " " + k + " · " + D.jeux[k].titre); });
    mount(h("h1", {}, "Tour de contrôle"),
      saved ? h("div", { class: "card" }, h("h2", {}, "Partie en cours"), h("p", {}, "Code " + saved.code + " · " + Object.keys(saved.players).length + " joueur(s) · séance " + (saved.status === "lobby" ? "pas lancée" : saved.status === "play" ? "en cours" : "terminée")), h("button", { class: "ok", onclick: function () { run(saved, false); } }, "Reprendre cette partie")) : null,
      h("div", { class: "card" }, h("h2", {}, "Nouvelle partie"), h("p", {}, "Jeu(x) joué(s) pendant la séance :"), boxes, h("p", {}, "Durée de la séance (minutes) : ", min),
        h("p", { class: "meta" }, "Code de partie : " + CODE + ". Ouvrez la tour avant que les étudiants ne se connectent."),
        h("button", { class: "ok", onclick: function () { var js = jeuxOk.filter(function (k) { return sel[k].checked; }); if (!js.length) js = ["5.1"]; run(C.newGame({ code: CODE, jeux: js, min: Math.max(5, +min.value || 30) }), false); } }, "Ouvrir la partie"),
        h("button", { class: "sec", onclick: function () { var g = C.newGame({ code: CODE, jeux: ["5.1"], min: 8 }); run(g, true); } }, "Simuler une partie (5 tables)")),
      h("p", {}, h("a", { href: "#/test" }, "Mode test : parcourir tous les jeux et toutes les cartes sans répondre"), "  ·  ", h("a", { href: "#/plateau" }, "← Plateau")));
  }

  function run(G, sim) {
    LSset(GK, G); var net = null, status = "…", dirty = true, view = "proj", tab = "ens", simSt = null, link = {}, wrap = h("div", { class: "jx" }), dead = false;
    function now() { return Date.now(); }
    function save() { LSset(GK, G); }
    function push() { Object.keys(G.players).forEach(function (s) { var p = G.players[s]; if (p.sim) return; var m = C.snapshot(G, s, now()); if (m && net) net.send(s, m); }); }
    function onmsg(m, conn) {
      if (!m || !m.sid) return; var t = now(), sid = m.sid;
      if (m.t === "join") {
        var r = C.join(G, { sid: sid, nom: m.nom, table: m.table }, t);
        if (!r.ok) { if (net) net.send(sid, { t: "err", msg: r.err }); return; }
        if (r.player.sid !== sid) { link[sid] = r.player.sid; if (net) net.bind(r.player.sid, sid); }
        if (net) net.send(sid, C.snapshot(G, r.player.sid, t)); dirty = true; return;
      }
      var real = link[sid] || sid, p = G.players[real]; if (!p) return; p.last = t;
      if (m.t === "draw") C.draw(G, real, t); else if (m.t === "ans") C.answer(G, real, m.ans, t);
      if (net) net.send(sid, C.snapshot(G, real, t)); dirty = true;
    }
    var ctl = null;
    try { ctl = new BroadcastChannel("cpro-j-ctl-" + G.code); ctl.onmessage = function (e) { var m = e.data || {}; if (m.t === "jeu") { C.setJeu(G, m.jeu); dirty = true; refresh(); } if (m.t === "jeu" || m.t === "ping") ctl.postMessage({ t: "pong", jeu: G.jeux[0], extra: !!G.extra }); }; } catch (e) {}
    net = hostNet(G.code, onmsg, function (s) { status = s; refresh(); });
    var flush = setInterval(function () { if (dead) return; C.tick(G, now()); if (simSt) simStep(); if (dirty) { push(); save(); dirty = false; } else if (Math.floor(now() / 1000) % 5 === 0) push(); refresh(); }, 1000);
    onLeave(function () { dead = true; clearInterval(flush); try { ctl && ctl.close(); } catch (e) {} if (net) net.close(); document.body.classList.remove("jx-full"); });

    /* simulation (démo) */
    function simStart() {
      var names = ["Alice", "Bruno", "Chloé", "David", "Emma", "Farid", "Gaëlle", "Hugo", "Inès", "Jules", "Karim", "Léa", "Maël", "Nora", "Omar", "Paul", "Rose", "Sami", "Tina", "Yann", "Zoé", "Adam", "Lina", "Noé", "Eva"], sizes = [5, 4, 5, 3, 5], k = 0;
      sizes.forEach(function (n, ti) { for (var i = 0; i < n; i++) C.join(G, { sid: "sim" + ti + i, nom: names[k++ % names.length], table: String(ti + 1), sim: true }, now()); });
      Object.keys(G.players).forEach(function (s) { G.players[s].skill = 0.35 + Math.random() * 0.55; });
      C.start(G, now()); simSt = { at: {} }; dirty = true;
    }
    function simAns(c, sk) {
      var r = Math.random;
      if (c.t === "choix") { if (r() < sk) return c.ok; var o = []; c.opts.forEach(function (x, i) { if (i !== c.ok) o.push(i); }); return o[Math.floor(r() * o.length)]; }
      if (c.t === "assoc") return c.items.map(function (it) { if (r() < sk) return it.ok; return Math.floor(r() * c.labels.length); });
      if (c.t === "oral") return c.grille.map(function () { return r() < sk; });
      var target = Math.round(3 * Math.max(0, Math.min(1, sk + (r() - 0.5) * 0.7))), words = c.modele.split(" "), best = "Nous n'avons rien trouvé de précis.", bd = 9;
      for (var n = words.length; n >= Math.min(3, words.length); n--) { var cand = words.slice(0, n).join(" "), d = Math.abs(PE.score(c, cand).pts - target); if (d < bd) { bd = d; best = cand; } if (d === 0) break; }
      return best;
    }
    function simStep() {
      var t = now(); Object.keys(G.players).forEach(function (s) { if (G.players[s].sim) G.players[s].last = t; });
      Object.keys(G.tables).forEach(function (tn) {
        var T = G.tables[tn];
        if (!T.cur) { var tr = C.tireur(G, T, t); if (tr && tr.sim && C.running(G, t) && (!T.last || t - T.last.at > 4000 + Math.random() * 5000)) { C.draw(G, tr.sid, t); dirty = true; } return; }
        T.players.forEach(function (s) { var p = G.players[s]; if (!p.sim || p.done || !T.cur || T.cur.ans[s]) return; var k = tn + s + T.round; if (!simSt.at[k]) simSt.at[k] = t + 4000 + Math.random() * 16000;
          if (t >= simSt.at[k]) { C.answer(G, s, simAns(C.cardOf(T.cur.jeu, T.cur.id), p.skill), t); dirty = true; } });
      });
    }

    /* ----- vue ----- */
    var rows = {}, racesEl = h("div", { class: "jx-races" }), sideEl = h("div", { class: "jx-side" }), headEl = h("div", { class: "jx-head" }), tabsEl = h("div", { class: "jx-tabs" }), detEl = h("div", {});
    wrap.appendChild(headEl); wrap.appendChild(tabsEl);
    var main = h("div", { class: "jx-main" }, racesEl, sideEl); wrap.appendChild(main); wrap.appendChild(detEl);
    mount(wrap);
    function setView(v) { view = v; document.body.classList.toggle("jx-full", v === "proj"); wrap.className = "jx " + (v === "proj" ? "jx-p" : "jx-t"); refresh(); }
    function exportCsv(S) {
      var l = ["Table;Prénom;Case;Points;Cartes;Réussite;Temps moyen (s)"]; S.players.forEach(function (p) { l.push([p.table, p.nom, p.pos, p.score, p.n, Math.round(p.rate * 100) + "%", p.ms == null ? "" : Math.round(p.ms / 1000)].join(";")); });
      var a = h("a", { href: "data:text/csv;charset=utf-8," + encodeURIComponent("﻿" + l.join("\n")), download: "route-" + G.code + ".csv" }); document.body.appendChild(a); a.click(); a.remove();
    }
    function refresh() {
      if (dead) return; var t = now(), S = C.stats(G, t), left = G.status === "play" ? G.end - t : 0;
      var rank = S.tables.slice().sort(function (a, b) { return b.sum - a.sum || b.pts - a.pts; }).map(function (x) { return x.id; });
      headEl.innerHTML = "";
      var stTxt = { ok: "● réseau prêt", local: "◐ mode local (même navigateur)", busy: "○ code déjà utilisé : fermez l'autre tour", err: "○ réseau indisponible", off: "○ PeerJS absent" }[status] || "…";
      headEl.appendChild(h("div", { class: "jx-title" }, h("b", {}, "5 · La route de l'état de l'art"), h("span", {}, " · jeu " + G.jeux.join(" + ") + " · " + (D.jeux[G.jeux[0]] ? D.jeux[G.jeux[0]].titre : "")), h("small", {}, "  rejoindre : belmdeveloppement.github.io/communication-pro/#/j  ·  code "), h("b", { class: "jx-code" }, G.code)));
      headEl.appendChild(h("div", { class: "jx-clock" }, G.status === "lobby" ? "Séance non lancée" : G.status === "ended" ? "Séance terminée" : mmss(left), h("small", {}, "  " + Object.keys(G.players).length + " joueurs · " + S.tables.length + " tables · " + stTxt)));
      var ctr = h("div", { class: "jx-ctl" });
      if (G.status === "lobby") ctr.appendChild(h("button", { class: "ok", onclick: function () { C.start(G, now()); dirty = true; refresh(); } }, "Lancer la séance"));
      if (G.status === "play") ctr.appendChild(h("button", { class: "r", onclick: function () { if (confirm("Clôturer la séance maintenant ?")) { C.stop(G, now()); dirty = true; refresh(); } } }, "Clôturer la séance"));
      ctr.appendChild(h("button", { class: "sec", onclick: function () { setView(view === "proj" ? "prof" : "proj"); } }, view === "proj" ? "Vue enseignant" : "Vue projetée"));
      if (view === "proj") ctr.appendChild(h("button", { class: "sec", onclick: function () { try { document.documentElement.requestFullscreen(); } catch (e) {} } }, "Plein écran"));
      var jk = Object.keys(D.jeux), ji = jk.indexOf(G.jeux[0]), cn = C.counts(G, G.jeux[0]);
      ctr.appendChild(h("button", { class: "sec", disabled: ji <= 0 ? "disabled" : null, onclick: function () { C.nextJeu(G, -1); dirty = true; refresh(); } }, "◀ Jeu précédent"));
      ctr.appendChild(h("button", { disabled: ji >= jk.length - 1 ? "disabled" : null, onclick: function () { if (confirm("Passer au jeu " + jk[ji + 1] + " ? Les positions et les points sont conservés ; la question ouverte se termine normalement.")) { C.nextJeu(G, 1); dirty = true; refresh(); } } }, "Jeu suivant ▶" + (ji < jk.length - 1 ? " (" + jk[ji + 1] + ")" : "")));
      if (cn.extra) ctr.appendChild(h("button", { class: G.extra ? "ok" : "sec", onclick: function () { C.setExtra(G, !G.extra); dirty = true; refresh(); } }, G.extra ? "Cartes supplémentaires : activées (" + (cn.base + cn.extra) + ")" : "Débloquer les cartes supplémentaires (+" + cn.extra + ")"));
      ctr.appendChild(h("button", { class: "sec", onclick: function () { exportCsv(S); } }, "Export CSV"));
      ctr.appendChild(h("a", { class: "btn sec", href: "#/test", target: "_blank", style: "text-decoration:none;display:inline-block" }, "Mode test"));
      ctr.appendChild(h("button", { class: "sec", onclick: function () { if (confirm("Terminer et effacer cette partie ?")) { try { localStorage.removeItem(GK); } catch (e) {} dead = true; location.hash = "#/tour"; setTimeout(function () { location.reload(); }, 50); } } }, "Nouvelle partie"));
      headEl.appendChild(ctr);
      /* courses */
      var ids = S.tables.map(function (x) { return x.id; });
      if (!ids.length) { racesEl.innerHTML = ""; rows = {}; racesEl.appendChild(h("div", { class: "jx-empty" }, h("img", { src: "qr-j.svg", alt: "QR de connexion", width: 220, height: 220 }), h("div", {}, h("h2", {}, "Les joueurs se connectent"), h("p", {}, "Scannez le QR ou ouvrez le lien, choisissez votre table (1 à 5) et saisissez le code " + G.code + "."), h("p", { class: "jx-link" }, "belmdeveloppement.github.io/communication-pro/#/j"), h("p", { class: "jx-link2" }, "code  ", h("b", { class: "jx-code" }, G.code)), h("p", { class: "meta" }, "Les tables apparaissent ici dès qu'un joueur s'y inscrit.")))); }
      else { var em = racesEl.querySelector(".jx-empty"); if (em) em.remove(); }
      ids.forEach(function (id) {
        var T = G.tables[id], x = S.tables.filter(function (y) { return y.id === id; })[0], R = rows[id];
        if (!R) { R = rows[id] = { pawns: {} }; R.el = h("div", { class: "jx-row" }); R.lab = h("div", { class: "jx-tlab" }); R.track = h("div", { class: "jx-track" }, h("i", { class: "a1" }), h("i", { class: "a2" }), h("i", { class: "a3" }), h("em", {}, "Examen")); R.sum = h("div", { class: "jx-sum" }); R.chips = h("div", { class: "jx-chips" });
          R.el.appendChild(R.lab); R.el.appendChild(h("div", { class: "jx-mid" }, R.track, R.chips)); R.el.appendChild(R.sum); racesEl.appendChild(R.el); }
        R.lab.innerHTML = ""; R.lab.appendChild(h("b", {}, id)); R.lab.appendChild(h("small", {}, "#" + (rank.indexOf(id) + 1)));
        R.el.className = "jx-row" + (x.stuck ? " stuck" : "");
        R.sum.innerHTML = ""; R.sum.appendChild(h("b", {}, "Σ " + x.sum)); R.sum.appendChild(h("small", {}, x.pts + " pt"));
        var byPos = {};
        T.players.forEach(function (s) { var p = G.players[s], el = R.pawns[s]; if (!el) { el = R.pawns[s] = h("div", { class: "jx-pawn", title: p.nom }, h("span", {}, p.nom.slice(0, 1).toUpperCase())); el.style.background = p.col; R.track.appendChild(el); }
          (byPos[p.pos] = byPos[p.pos] || []).push(el); el.style.left = "calc(" + (p.pos / 31) + " * (100% - 32px) + 2px)"; });
        Object.keys(byPos).forEach(function (k) { byPos[k].forEach(function (el, i) { el.style.top = (3 + i * 4) + "px"; el.style.marginLeft = (i * 7) + "px"; }); });
        var mx = Math.max.apply(null, [1].concat(T.players.map(function (s) { return G.players[s].score; })));
        R.chips.innerHTML = ""; T.players.forEach(function (s) { var p = G.players[s], sp = S.players.filter(function (y) { return y.sid === s; })[0]; var c = pastille(sp.st, p.nom, p.col);
          c.appendChild(h("span", { class: "jx-gauge" }, h("u", { style: "width:" + Math.round(p.score / mx * 100) + "%;background:" + p.col }))); if (!sp.online) c.className += " off"; R.chips.appendChild(c); });
        if (view === "prof" && T.cur) R.chips.appendChild(h("button", { class: "sec jx-mini", onclick: function () { C.closeRound(G, id, now()); dirty = true; refresh(); } }, "Clôturer la question (" + x.answered + "/" + T.players.length + ")"));
      });
      /* panneau latéral */
      sideEl.innerHTML = "";
      var ck = Object.keys(S.crit).sort(function (a, b) { return S.crit[a].ok / S.crit[a].n - S.crit[b].ok / S.crit[b].n; });
      sideEl.appendChild(h("div", { class: "jx-card" }, h("h3", {}, "Réussite par critère"), ck.length ? ck.map(function (k) { var r = S.crit[k].ok / S.crit[k].n; return h("div", { class: "jx-bar" }, h("span", {}, k), h("div", {}, h("u", { style: "width:" + Math.round(r * 100) + "%;background:" + (r < .4 ? "#E4572E" : r < .7 ? "#E9A400" : "#2E9E6B") })), h("b", {}, pct(r))); }) : h("p", { class: "meta" }, "Dès la première carte corrigée.")));
      sideEl.appendChild(h("div", { class: "jx-card" }, h("h3", {}, "Points gagnés par carte"), h("div", { class: "jx-dist" }, S.dist.map(function (n, i) { var tot = S.dist.reduce(function (a, b) { return a + b; }, 0) || 1; return h("div", {}, h("u", { style: "height:" + Math.round(n / tot * 70) + "px" }), h("b", {}, String(i)), h("small", {}, String(n))); }))));
      sideEl.appendChild(h("div", { class: "jx-card" }, h("h3", {}, "Alertes"), S.alerts.length ? S.alerts.slice(0, 6).map(function (a) { return h("p", { class: "jx-al" }, "⚠ " + a.txt); }) : h("p", { class: "meta" }, "Rien à signaler.")));
      /* onglets enseignant */
      tabsEl.innerHTML = detEl.innerHTML = ""; if (view !== "prof") return;
      [["ens", "Joueurs"], ["crit", "Critères et cartes"], ["err", "Erreurs fréquentes"], ["eng", "Engagement"]].forEach(function (a) { tabsEl.appendChild(h("button", { class: a[0] === tab ? "" : "sec", onclick: function () { tab = a[0]; refresh(); } }, a[1])); });
      if (tab === "ens") detEl.appendChild(h("table", {}, h("tr", {}, ["Table", "Joueur", "Case", "Points", "Cartes", "Réussite", "Temps moyen", "État"].map(function (c) { return h("th", {}, c); })),
        S.players.sort(function (a, b) { return a.table < b.table ? -1 : a.table > b.table ? 1 : b.pos - a.pos; }).map(function (p) { return h("tr", {}, h("td", {}, p.table), h("td", {}, h("span", { class: "jx-dot", style: "background:" + p.col }), " " + p.nom), h("td", {}, String(p.pos)), h("td", {}, String(p.score)), h("td", {}, p.n + " (" + p.ok + " à 3 pt)"), h("td", {}, p.n ? pct(p.rate) : "—"), h("td", {}, p.ms == null ? "—" : Math.round(p.ms / 1000) + " s"), h("td", {}, (p.online ? "" : "hors ligne · ") + ST[p.st][1])); })));
      if (tab === "crit") {
        var cards = Object.keys(S.cards).map(function (k) { return S.cards[k]; }).sort(function (a, b) { return a.pts / a.n - b.pts / b.n; });
        detEl.appendChild(h("table", {}, h("tr", {}, ["Carte", "Énoncé, critères et modèle", "Réponses", "Moyenne /3", "Temps moyen"].map(function (c) { return h("th", {}, c); })), cards.map(function (c) { var card = C.cardOf(c.jeu, c.id); return h("tr", {}, h("td", {}, c.jeu + "·" + c.id), h("td", {}, h("div", {}, card.q), card.checks ? h("ul", { class: "meta" }, card.checks.map(function (k) { return h("li", {}, k.lab); })) : null, card.modele ? h("div", { class: "meta" }, h("b", {}, "Modèle : "), card.modele) : null), h("td", {}, String(c.n)), h("td", {}, (c.pts / c.n).toFixed(2)), h("td", {}, c.nms ? Math.round(c.ms / c.nms / 1000) + " s" : "—")); })));
      }
      if (tab === "err") { var er = Object.keys(S.err).sort(function (a, b) { return S.err[b] - S.err[a]; }).slice(0, 8); detEl.appendChild(h("div", { class: "card" }, h("h3", {}, "Critères les plus souvent manqués"), er.length ? h("ol", {}, er.map(function (k) { return h("li", {}, k + " : " + S.err[k] + " fois"); })) : h("p", { class: "meta" }, "Pas encore de données."))); }
      if (tab === "eng") { var tot = S.expected || 1, rs = S.resp.length ? S.resp.reduce(function (a, b) { return a + b; }, 0) / S.resp.length : 0; detEl.appendChild(h("div", { class: "card" }, h("h3", {}, "Engagement"), h("p", {}, "Réponses envoyées : " + S.answered + " sur " + S.expected + " attendues (" + pct(S.answered / tot) + ")."), h("p", {}, "Temps de réponse moyen : " + (rs ? Math.round(rs / 1000) + " s" : "—") + "."), h("p", {}, "Joueurs hors ligne : " + S.players.filter(function (p) { return !p.online; }).length + " sur " + S.players.length + "."))); }
    }
    if (sim) simStart();
    setView(sim ? "proj" : "prof");
    window.J51._G = function () { return G; };
  }

  /* ---------- Mode test : parcourir tous les jeux et toutes les cartes sans répondre ---------- */
  function testPage() {
    var list = [], jk = Object.keys(D.jeux), ix = 0;
    jk.forEach(function (k) { D.jeux[k].cartes.forEach(function (c) { list.push({ jeu: k, c: c }); }); });
    var saved = parseInt(LSget("j-test") || 0, 10); if (saved > 0 && saved < list.length) ix = saved;
    var box = h("div", {}), sync = true, tower = null, ctl = null, info = h("p", { class: "meta" }, "");
    try { ctl = new BroadcastChannel("cpro-j-ctl-" + CODE); ctl.onmessage = function (e) { var m = e.data || {}; if (m.t === "pong") { tower = m.jeu; showInfo(); } }; ctl.postMessage({ t: "ping" }); } catch (e) {}
    function showInfo() { info.textContent = tower ? (sync ? "● Synchronisé avec la tour de contrôle : les joueurs jouent le jeu " + tower + " (au prochain tirage)." : "○ Tour détectée (jeu " + tower + ") mais synchronisation désactivée : aperçu seulement.") : "○ Aucune tour de contrôle ouverte dans ce navigateur : aperçu seulement."; info.className = tower && sync ? "meta" : "warn"; }
    function pushJeu() { if (sync && ctl) try { ctl.postMessage({ t: "jeu", jeu: list[ix].jeu }); } catch (e) {} }
    function go(i) { ix = Math.max(0, Math.min(list.length - 1, i)); LSset("j-test", ix); var before = list[ix].jeu; draw(); if (before !== lastJeu) { lastJeu = before; pushJeu(); } window.scrollTo(0, 0); }
    var lastJeu = list[ix].jeu;
    function jump(dir) { var cur = list[ix].jeu, j = jk.indexOf(cur), t = jk[Math.max(0, Math.min(jk.length - 1, j + dir))]; for (var i = 0; i < list.length; i++) if (list[i].jeu === t) return go(i); }
    function draw() {
      var it = list[ix], c = it.c, j = D.jeux[it.jeu], n = list.filter(function (x) { return x.jeu === it.jeu; }), pos = n.indexOf(it) + 1;
      box.innerHTML = "";
      var cb = h("input", { type: "checkbox", style: "width:auto" }); cb.checked = sync; cb.addEventListener("change", function () { sync = cb.checked; if (sync) pushJeu(); showInfo(); });
      box.appendChild(h("div", { class: "warn" }, "Mode test : les réponses attendues sont affichées. Aucune carte n'est envoyée aux joueurs ; seul le jeu choisi peut l'être."));
      box.appendChild(h("label", { style: "display:block;margin:6px 0" }, cb, " Synchroniser la partie : changer de jeu ici change le jeu des joueurs"), info); showInfo();
      box.appendChild(h("h1", {}, "Jeu " + it.jeu + " · " + j.titre)); box.appendChild(h("p", { class: "meta" }, "Zone " + j.zone + " · carte " + pos + " / " + n.length + (c.extra ? " · carte supplémentaire" : "") + " · type " + c.t + " · " + (ix + 1) + " / " + list.length + " au total"));
      var card = h("div", { class: "card" }); box.appendChild(card);
      card.appendChild(h("p", { class: "big" }, c.q));
      if (c.t === "choix") c.opts.forEach(function (o, i) { card.appendChild(h("div", { class: "opt " + (i === c.ok ? "good" : "") }, (i === c.ok ? "✓ " : "") + o)); });
      else if (c.t === "assoc") c.items.forEach(function (x) { card.appendChild(h("div", { class: "card", style: "background:#fff" }, x.txt, h("b", {}, "  →  " + c.labels[x.ok]))); });
      else if (c.t === "texte") { card.appendChild(h("p", {}, h("b", {}, "Critères notés (1 point chacun) :")), h("ul", {}, c.checks.map(function (k) { return h("li", {}, k.lab); })), h("p", {}, h("b", {}, "Requête modèle : "), c.modele)); }
      else card.appendChild(h("ul", {}, c.grille.map(function (g) { return h("li", {}, g); })));
      box.appendChild(h("div", { class: "corr" }, h("b", {}, "Corrigé : "), c.expl));
      box.appendChild(h("p", { class: "meta" }, "Flèches du clavier : ← → pour les cartes, haut/bas pour les jeux. ", h("a", { href: "#/tour" }, "Tour de contrôle")));
    }
    var bar = h("div", { class: "jx-fab" },
      h("button", { class: "sec", onclick: function () { jump(-1); } }, "⏮ Jeu"), h("button", { onclick: function () { go(ix - 1); } }, "◀ Carte"), h("button", { onclick: function () { go(ix + 1); } }, "Carte ▶"), h("button", { class: "sec", onclick: function () { jump(1); } }, "Jeu ⏭"));
    function key(e) { if (e.key === "ArrowRight") go(ix + 1); else if (e.key === "ArrowLeft") go(ix - 1); else if (e.key === "ArrowDown") jump(1); else if (e.key === "ArrowUp") jump(-1); }
    document.addEventListener("keydown", key); onLeave(function () { document.removeEventListener("keydown", key); bar.remove(); try { ctl && ctl.close(); } catch (e) {} });
    mount(box); document.body.appendChild(bar); draw();
  }

  window.J51 = { route: function (a) { if (a === "tour") return towerGate(); if (a === "test") return towerGate(testPage); return joinPage(); } };
  var hs = location.hash || ""; if (/^#\/(j|tour|test)(\?|\/|$)/.test(hs)) window.dispatchEvent(new Event("hashchange"));
})();
