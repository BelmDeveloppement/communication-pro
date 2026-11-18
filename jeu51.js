/* © 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. Créé avec l'aide de Claude (Anthropic), relu par l'auteur.
   Plateau « 5 · La route de l'état de l'art », mode tables et joueurs : page joueur (#/j) et tour de contrôle enseignant (#/tour). */
(function () {
  "use strict";
  var A = window.APP, h = A.h, mount = A.mount, LSget = A.LSget, LSset = A.LSset, D = window.PLATEAU_DATA, PE = window.PEngine, C = window.J51Core, PL = window.PLATEAU;
  var CODE = "ROUTE", NS = "http://www.w3.org/2000/svg";
  var ST = { attend: ["○", "attend", "#8A93A8"], encours: ["✎", "en cours", "#3B6FD8"], validee: ["✓", "validée", "#7A3FB5"], juste: ["★", "juste", "#2E9E6B"], partielle: ["◐", "partielle", "#E9A400"], ratee: ["✗", "ratée", "#E4572E"], fini: ["⚑", "arrivé", "#1F2A5C"], effet: ["✦", "effet de case", "#0F8B8D"] };
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
  var PCFG = { config: { iceServers: [
    { urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" },
    { urls: "turn:openrelay.metered.ca:80", username: "openrelayproject", credential: "openrelayproject" },
    { urls: "turn:openrelay.metered.ca:443", username: "openrelayproject", credential: "openrelayproject" },
    { urls: "turn:openrelay.metered.ca:443?transport=tcp", username: "openrelayproject", credential: "openrelayproject" } ] } };
  var RELAY = window.CPRO_RELAY || "wss://cpro-relay.belmdeveloppement.workers.dev/ws";
  /* Liaison WebSocket vers le relais (Cloudflare) : reconnexion automatique, battement toutes les 20 s */
  function relaySock(url, onopen, onmsg, onstate, onreplaced) {
    var ws = null, dead = false, retry = null, hb = null, tries = 0, up = false;
    function st(v) { if (v !== up) { up = v; onstate(v); } }
    function open() {
      if (dead || typeof WebSocket === "undefined") return; clearTimeout(retry);
      try { ws = new WebSocket(url); } catch (e) { return again(); }
      var me = ws;
      ws.onopen = function () { tries = 0; st(true); clearInterval(hb); hb = setInterval(function () { try { me.send("ping"); } catch (e) {} }, 20000); onopen(); };
      ws.onmessage = function (e) { if (e.data === "pong") return; try { onmsg(JSON.parse(e.data)); } catch (x) {} };
      ws.onclose = function (e) { if (me === ws) { st(false); clearInterval(hb); if (e && e.code === 4001) { dead = true; if (onreplaced) onreplaced(); } else again(); } };
      ws.onerror = function () { try { me.close(); } catch (e) {} };
    }
    function again() { if (dead) return; tries++; clearTimeout(retry); retry = setTimeout(open, Math.min(8000, 1500 * tries)); }
    open();
    return { ok: function () { return up && ws && ws.readyState === 1; }, send: function (o) { try { ws.send(typeof o === "string" ? o : JSON.stringify(o)); return true; } catch (e) { return false; } },
      close: function () { dead = true; clearTimeout(retry); clearInterval(hb); try { ws && ws.close(); } catch (e) {} } };
  }
  function hostNet(code, onmsg, onstatus, local) {
    var conns = {}, peer = null, dead = false, bc = null, retry = null, via = {}, rl = null, rlOk = false, pst = "…", pd = "";
    var emit = onstatus; function report() { if (rlOk) emit("ok"); else emit(pst, pd); }
    if (!local) rl = relaySock(RELAY + "?room=" + encodeURIComponent(code) + "&role=host", function () {}, function (m) { if (m && m.sid) { via[m.sid] = "r"; onmsg(m, null); } }, function (v) { rlOk = v; report(); }, function () { pst = "busy"; report(); });
    onstatus = function (s, d) { pst = s; pd = d || ""; report(); };
    try { bc = new BroadcastChannel("cpro-j-" + code); bc.onmessage = function (e) { if (e.data && e.data.to === "host") onmsg(e.data.m, null); }; } catch (e) {}
    function open() {
      if (dead || local || typeof Peer === "undefined") { onstatus(bc ? "local" : "off"); return; }
      try {
        peer = new Peer("cpro-j-" + code, PCFG);
        peer.on("open", function () { onstatus("ok"); });
        peer.on("connection", function (c) { c.on("data", function (m) { if (m && m.sid) { conns[m.sid] = c; via[m.sid] = "p"; onmsg(m, c); } }); });
        peer.on("error", function (e) { var ty = e && e.type; if (ty === "unavailable-id") { onstatus("busy"); retry = setTimeout(function () { try { peer.destroy(); } catch (x) {} open(); }, 5000); } else if (ty === "network" || ty === "server-error" || ty === "socket-error" || ty === "socket-closed" || ty === "ssl-unavailable") { onstatus("err", ty); clearTimeout(retry); retry = setTimeout(function () { try { peer.destroy(); } catch (x) {} open(); }, 6000); } /* autres erreurs (liaison ratée d'un joueur) : la tour reste en service */ });
        peer.on("disconnected", function () { onstatus("err"); if (!dead) try { peer.reconnect(); } catch (e) {} });
      } catch (e) { onstatus("err"); }
    }
    open();
    return { send: function (sid, m) { var c = conns[sid], done = false; if (via[sid] === "r" && rl && rl.ok()) done = rl.send({ to: sid, m: m }); if (!done && c && c.open) try { c.send(m); } catch (e) {} if (bc) try { bc.postMessage({ to: sid, m: m }); } catch (e) {} },
      bind: function (real, sid) { if (conns[sid]) conns[real] = conns[sid]; if (via[sid]) via[real] = via[sid]; },
      close: function () { dead = true; clearTimeout(retry); try { rl && rl.close(); } catch (e) {} try { peer && peer.destroy(); } catch (e) {} try { bc && bc.close(); } catch (e) {} } };
  }
  function clientNet(code, getSid, onmsg, onlink, hello, local) {
    var peer = null, conn = null, dead = false, retry = null, bc = null, rl = null, hostUp = false, peerLink = false, peerOn = false, late = null;
    try { bc = new BroadcastChannel("cpro-j-" + code); bc.onmessage = function (e) { if (e.data && e.data.to === getSid()) { onmsg(e.data.m); onlink(true); } }; } catch (e) {}
    function link() { onlink((rl && rl.ok() && hostUp) || peerLink); }
    if (!local) {
      rl = relaySock(RELAY + "?room=" + encodeURIComponent(code) + "&role=client&sid=" + encodeURIComponent(getSid()), function () {}, function (m) {
        if (m && m.__ctl === "host") { var was = hostUp; hostUp = !!m.up; if (hostUp) { hello(); } link(); return; }
        onmsg(m); hostUp = true; link();
      }, function (v) { if (!v) { hostUp = false; link(); } });
      /* repli : si le relais ne répond pas en 5 s, on tente aussi la liaison directe */
      late = setTimeout(function () { if (!(rl && rl.ok()) && !peerOn) { peerOn = true; connect(); } }, 5000);
    }
    function connect() {
      if (dead || local || typeof Peer === "undefined") return; clearTimeout(retry);
      var again = function (ms) { peerLink = false; link(); clearTimeout(retry); retry = setTimeout(connect, ms); };
      try {
        if (peer) try { peer.destroy(); } catch (e) {}
        peer = new Peer(undefined, PCFG); peer.on("open", function () {
          conn = peer.connect("cpro-j-" + code, { reliable: true });
          conn.on("open", function () { peerLink = true; link(); hello(); }); conn.on("data", function (m) { onmsg(m); });
          conn.on("close", function () { again(3000); }); conn.on("error", function () { again(5000); });
        });
        peer.on("error", function () { again(6000); }); peer.on("disconnected", function () { again(5000); });
      } catch (e) { again(8000); }
    }
    if (local) connect();
    return { send: function (m) { var done = false; if (rl && rl.ok() && hostUp) done = rl.send(m); if (!done && conn && conn.open) try { conn.send(m); } catch (e) {} if (bc) try { bc.postMessage({ to: "host", m: m }); } catch (e) {} },
      close: function () { dead = true; clearTimeout(retry); clearTimeout(late); try { rl && rl.close(); } catch (e) {} try { peer && peer.destroy(); } catch (e) {} try { bc && bc.close(); } catch (e) {} } };
  }

  /* ---------- Roue révélatrice (0 à 3 cases) ---------- */
  var WCOL = ["#C0392B", "#E9A400", "#3B6FD8", "#2E9E6B"];
  function wheelEl() {
    var w = sv("svg", { viewBox: "-60 -66 120 126", width: 180, height: 189, style: "display:block;margin:6px auto" }), g = sv("g", { style: "transition:transform 3.2s cubic-bezier(.12,.7,.18,1);transform-origin:0 0" });
    for (var i = 0; i < 4; i++) { var a0 = (i * 90 - 90) * Math.PI / 180, a1 = ((i + 1) * 90 - 90) * Math.PI / 180, am = (a0 + a1) / 2;
      g.appendChild(sv("path", { d: "M0 0 L" + (55 * Math.cos(a0)).toFixed(2) + " " + (55 * Math.sin(a0)).toFixed(2) + " A55 55 0 0 1 " + (55 * Math.cos(a1)).toFixed(2) + " " + (55 * Math.sin(a1)).toFixed(2) + " Z", fill: WCOL[i], stroke: "#fff", "stroke-width": 1.5 }));
      g.appendChild(sv("text", { x: (33 * Math.cos(am)).toFixed(2), y: (33 * Math.sin(am) + 7).toFixed(2), "text-anchor": "middle", "font-size": i === 0 ? 15 : 22, "font-weight": 800, fill: "#fff" }, i === 0 ? "0 : −1" : String(i))); }
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
  var PRIOR_UI = { "9": [["7", "votre requête du JEU 7"]], "13": [["3", "votre question de décision du JEU 3"]], "16": [["9", "vos résultats du JEU 9"], ["10", "vos résultats du JEU 10"]], "27": [["3", "votre question du JEU 3"], ["16", "vos sources notées du JEU 16"]], "28": [["27", "votre fiche de Toulmin du JEU 27"]], "32": [["3", "vos critères du JEU 3"]], "35": [["16", "vos sources du JEU 16"]], "37": [["34", "votre plan du JEU 34"], ["32", "votre matrice du JEU 32"], ["16", "vos sources du JEU 16"]], "39": [["37", "votre grille du JEU 37"]] };
  var JOIN_URL = "https://belmdeveloppement.github.io/communication-pro/#/j";
  function joinLink() {
    var cp = h("button", { class: "sec", type: "button", style: "margin-left:6px;padding:2px 8px", onclick: function () { try { navigator.clipboard.writeText(JOIN_URL); cp.textContent = "Copié"; setTimeout(function () { cp.textContent = "Copier"; }, 1500); } catch (e) { cp.textContent = "Sélectionnez le lien"; } } }, "Copier");
    return h("span", { class: "jx-join" }, h("a", { href: JOIN_URL, target: "_blank", rel: "noopener" }, "belmdeveloppement.github.io/communication-pro/#/j"), cp);
  }
  function barsEl(gauges, titre) {
    var w = h("div", { class: "jx-bars" }); if (titre) w.appendChild(h("div", { class: "jx-bt" }, titre));
    (gauges || []).forEach(function (g) { var z = D.zones[g.z], r = h("div", { class: "jx-br", title: z.syl + " : " + g.lvl + " sur 10" }, h("span", { class: "jx-bl" }, g.z + " " + z.nom)), n = h("span", { class: "jx-bn" });
      for (var i = 1; i <= 10; i++) n.appendChild(h("i", { style: i <= g.lvl ? "background:" + z.col : "" })); r.appendChild(n); r.appendChild(h("b", { class: "jx-bv" }, g.lvl + "/10")); w.appendChild(r); });
    return w;
  }
  function cloudEl(list) {
    var w = h("div", { class: "jx-cloud" }), mx = list.length ? list[0].n : 1, cols = ["#3B6FD8", "#2E9E6B", "#E9A400", "#E4572E", "#D6479B"];
    if (!list.length) w.appendChild(h("span", { class: "meta" }, "Aucun mot reçu pour l'instant."));
    list.forEach(function (x, i) { w.appendChild(h("span", { style: "font-size:" + Math.round(16 + 40 * x.n / mx) + "px;color:" + cols[i % 5], title: x.n + " joueur(s)" }, x.w)); });
    return w;
  }
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
    var snap = null, net = null, key = "", linkOk = false, gidCur = null, rolled = -1, ack = 0, answers = null, tmr = null;
    var pa = (function () { var o = LSget("j-pa"); return o && o.sid === me.sid ? o.pa : null; })();
    function paSave() { LSset("j-pa", pa ? { sid: me.sid, pa: pa } : {}); }
    function cardId(T) { return T && T.cur ? T.round + ":" + T.cur.jeu + ":" + T.cur.id : ""; }
    function resend() { if (pa && snap && snap.table.cur && !snap.table.cur.mine && pa.card === cardId(snap.table)) send(pa.msg); }
    var head = h("div", {}), board = h("div", {}), body = h("div", {}), info = h("p", { class: "meta" }, "○ Connexion à l'enseignant…");
    function fk() { return me.code + me.sid + ":" + gidCur; }
    function loadFlags() { var r = LSget("j-roll") || {}, a = LSget("j-ack") || {}; rolled = r[fk()] != null ? r[fk()] : -1; ack = a[fk()] || 0; }
    function saveFlags() { var r = {}, a = {}; r[fk()] = rolled; a[fk()] = ack; LSset("j-roll", r); LSset("j-ack", a); }
    function send(m) { m.sid = me.sid; if (net) net.send(m); }
    function hello() { send({ t: "join", nom: me.nom, table: me.table }); }
    function onmsg(m) {
      if (m.t === "err") { try { localStorage.removeItem(MK); } catch (e) {} mount(h("h1", {}, "Rejoindre la partie"), h("div", { class: "warn" }, m.msg), h("p", {}, h("a", { href: "#/j" }, "← Réessayer"))); stopAll(); return; }
      if (m.t !== "snap") return;
      if (gidCur && m.gid !== gidCur && Date.now() - snapAt < 9000) { rejAt = Date.now(); return; } /* une autre tour répond : on reste sur la partie en cours */
      if (rejAt && m.gid === gidCur && Date.now() - rejAt < 9000) dualAt = Date.now();
      snapAt = Date.now();
      if (m.me.sid !== me.sid) { me.sid = m.me.sid; LSset(MK, me); }
      if (m.gid !== gidCur) { gidCur = m.gid; loadFlags(); key = ""; hold = null; }
      snap = m; render();
    }
    function stopAll() { if (net) net.close(); net = null; clearInterval(tmr); }
    onLeave(stopAll);
    var snapAt = Date.now(), clockEl = h("span", {}), dualAt = 0, rejAt = 0, dualEl = h("div", { class: "warn", style: "display:none" }, "Deux tours de contrôle répondent à ce code. Fermez la tour ou le mode test ouvert dans un autre onglet de cet appareil : seule la tour de l'enseignant doit rester ouverte."), readT = {};
    function dualShow() { dualEl.style.display = Date.now() - dualAt < 15000 ? "block" : "none"; }
    function clockTick() { if (!snap) return; var left = snap.end - (Date.now() + (snap.now - snapAt)); clockEl.textContent = snap.status === "play" ? mmss(left) : snap.status === "ended" ? "terminée" : "—"; clockEl.style.color = snap.status === "play" && left < 120000 ? "#E4572E" : ""; }
    function onlink(ok) { linkOk = ok; info.textContent = ok ? "● Connecté à l'enseignant" : "○ Hors ligne : la partie reprendra à la reconnexion"; info.className = ok ? "meta" : "warn"; }
    net = clientNet(me.code, function () { return me.sid; }, onmsg, onlink, hello, !!me.local);
    setTimeout(hello, 400);
    tmr = setInterval(function () { hello(); resend(); }, 4000); A.timers.push(setInterval(resend, 2000));
    A.timers.push(setInterval(clockTick, 500));

    /* ----- sujet de l'état de l'art : un sujet par joueur, un joueur par sujet ----- */
    function sujetTxt() { var k = snap && snap.me.sujet; if (!k) return null; var x = (D.sujets || []).filter(function (y) { return y[0] === k; })[0]; return x ? { nom: x[0], q: x[1] } : { nom: k, q: "" }; }
    function sujetLine() {
      var s = sujetTxt();
      return h("div", { style: "margin:6px 0" }, s ? h("span", {}, h("b", {}, "Votre sujet : "), s.nom, h("span", { class: "meta" }, s.q ? " · " + s.q : "")) : h("span", { class: "warn", style: "padding:2px 6px" }, "Vous n'avez pas encore choisi de sujet."), " ",
        s ? null : h("button", { class: "ok", style: "margin:0", onclick: sujetModal }, "Choisir mon sujet"));
    }
    function sujetModal() {
      var ov = h("div", { style: "position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:60;overflow:auto;padding:12px" }), box = h("div", { class: "card", style: "max-width:640px;margin:0 auto" }), list = h("div", {});
      function draw() {
        list.innerHTML = ""; var mine = snap.me.sujet, res = snap.me.sujetRes;
        if (res && !res.ok && !mine) list.appendChild(h("p", { class: "warn" }, res.reason === "pris" ? "Trop tard : ce sujet est déjà pris par " + res.par + "." : res.reason === "dejachoisi" ? "Vous avez déjà choisi un sujet." : "Choix impossible."));
        (D.sujets || []).forEach(function (x, i) {
          var o = (snap.sujets || {})[x[0]], isMine = mine === x[0], b = isMine ? h("b", {}, "Votre sujet ✓") : o ? h("span", { class: "meta" }, "Pris par " + o) : mine ? h("span", { class: "meta" }, "libre") : h("button", { class: "ok", style: "margin:0", onclick: function () { send({ t: "sujet", sujet: x[0] }); } }, "Choisir");
          list.appendChild(h("div", { style: "display:flex;justify-content:space-between;gap:8px;align-items:center;border-bottom:1px solid #e4e8f0;padding:6px 0" }, h("div", {}, h("b", {}, (i + 1) + ". " + x[0]), h("div", { class: "meta" }, x[1])), b));
        });
      }
      box.appendChild(h("h2", {}, "Choisir mon sujet"));
      box.appendChild(h("p", { class: "meta" }, "Un seul sujet par personne ; un sujet ne peut être pris que par une seule personne (le premier qui appuie est servi). Vous le retrouverez dans tous les JEUX qui suivent. Vous ne pourrez pas en changer sans l'enseignant."));
      box.appendChild(list); box.appendChild(h("button", { class: "sec", onclick: function () { clearInterval(iv); ov.remove(); } }, "Fermer")); ov.appendChild(box); document.body.appendChild(ov); draw();
      var last = ""; var iv = setInterval(function () { var sg = JSON.stringify([snap.me.sujet, snap.sujets, snap.me.sujetRes]); if (sg !== last) { last = sg; draw(); } }, 400); onLeave(function () { clearInterval(iv); try { ov.remove(); } catch (e) {} });
    }
    function pawns() { return [{ pos: snap.tpos, col: "#1F2A5C", label: "Table " + snap.table.id.slice(1) }]; }
    var wordsEl = h("div", {}), wsig = "";
    function drawWords() {
      var q = snap.me.wq, mine = snap.me.wmine || [], sg = (q || "") + "|" + mine.join(","); if (sg === wsig) return; wsig = sg; wordsEl.innerHTML = ""; if (!q) return;
      var ins = [0, 1, 2].map(function (i) { return h("input", { placeholder: "Mot " + (i + 1) + (i ? " (facultatif)" : ""), maxlength: 30, value: mine[i] || "", style: "margin:4px 0" }); }), msg = h("p", { class: "meta" }, mine.length ? "Envoyé : " + mine.join(", ") + ". Vous pouvez modifier puis renvoyer." : "");
      wordsEl.appendChild(h("div", { class: "card", style: "border-left:6px solid #D6479B;background:#FFF4FA" }, h("h2", {}, "Nuage de mots · question " + q), h("p", {}, "Répondez en 1 à 3 mots (sur l'écran du cours : question " + q + ")."), ins, h("button", { onclick: function () { var w = ins.map(function (x) { return x.value; }).filter(function (x) { return x.trim(); }); send({ t: "words", w: w }); msg.textContent = w.length ? "Envoyé : " + w.join(", ") : "Mots effacés."; } }, "Envoyer"), msg));
    }
    function render() {
      var m = snap.me, ci = m.ci;
      head.innerHTML = ""; head.appendChild(h("div", { class: "card" }, h("span", { class: "jx-dot", style: "background:" + m.col }), h("b", {}, " " + m.nom), "  ·  " + C.COLNAMES[ci] + "  ·  table " + m.table.slice(1),
        h("div", { class: "big" }, "Pion de la table sur la case " + snap.tpos + " / 62  ·  " + m.score + " point" + (m.score > 1 ? "s" : "")), sujetLine(), info), dualEl); dualShow();
      drawWords(); board.innerHTML = ""; board.appendChild(PL.boardSvg(pawns())); if (snap.gauges) board.appendChild(barsEl(snap.gauges, "Maîtrise de votre table (5 objectifs, 10 crans)"));
      var T = snap.table, k, pe = snap.me.pend, last = T.last && T.last.res[m.sid] && T.last.round >= ack ? T.last : null;
      if (pa && (!T.cur || T.cur.mine || pa.card !== cardId(T))) { pa = null; paSave(); }
      var needRead = snap.rd !== "ok" && snap.status !== "ended" && !m.done && !(T.cur && T.cur.mine);
      if (last) k = "res:" + last.round + ":" + (rolled >= last.round ? 1 : 0);
      else if (needRead) k = "read:" + snap.rd + ":" + snap.here + ":" + snap.nudge;
      else if (T.cur && T.cur.mine === false && pa) k = "send:" + T.round + ":" + T.cur.id;
      else if (T.cur && T.cur.mine === false) k = "card:" + T.round + ":" + T.cur.id;
      else if (pe) k = "pend:" + pe.k + ":" + (pe.st || "") + ":" + (pe.mine ? 1 : 0) + ":" + (pe.opp ? pe.opp.nom + pe.opp.done : "") + ":" + (pe.card ? pe.card.id : "") + ":" + (pe.id || "") + ":" + T.round + ":" + (pe.tool ? pe.tool.off : "");
      else if (T.cur) k = "wait:" + T.round + ":" + T.cur.answered.length + ":" + T.players.length;
      else k = "idle:" + (T.jumped ? T.jumped.at : 0) + ":" + snap.jeux.join("+") + ":" + T.round + ":" + snap.canDraw + ":" + snap.status + ":" + T.players.length + ":" + snap.tireur;
      clockTick(); if (hold) return; if (k === key) return; key = k; body.innerHTML = "";
      if (k.indexOf("read:") === 0) return drawRead();
      if (k.indexOf("pend:") === 0) return drawPend(pe);
      if (k.indexOf("send:") === 0) return drawSending();
      if (k.indexOf("card:") === 0) return drawCard(T.cur);
      if (k.indexOf("res:") === 0) return drawResult(last);
      if (k.indexOf("wait:") === 0) return body.appendChild(h("div", { class: "card" }, h("h2", {}, "Réponse envoyée"), h("p", {}, "En attente des autres joueurs de la table…"), chips(T)));
      drawIdle(T);
    }
    /* ----- bandeau fixe d'aide : informations essentielles de chaque JEU, jamais les résultats ----- */
    function aideModal(k) {
      var ov = h("div", { style: "position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:60;overflow:auto;padding:12px" }), box = h("div", { class: "card", style: "max-width:600px;margin:0 auto" });
      var sel = h("select", { "aria-label": "Choisir un JEU" }, [h("option", { value: "common" }, "Règles du plateau")].concat(Object.keys(D.jeux).sort(function (a, b) { return a - b; }).map(function (n) { return h("option", { value: n }, "JEU " + n + " · " + D.jeux[n].titre.slice(0, 40)); })));
      var content = h("div", {});
      function show(v) { content.innerHTML = ""; if (v === "common") content.appendChild(h("div", {}, h("h2", {}, D.lecture.commun.titre), docEl(D.lecture.commun))); else content.appendChild(ficheEl(v)); }
      sel.value = k || "common"; sel.onchange = function () { show(sel.value); show2 = sel.value; };
      var show2 = sel.value; show(show2);
      box.appendChild(h("p", { class: "meta" }, "Aide : rappel des règles et de la méthode. Elle ne donne jamais les résultats."));
      box.appendChild(sel); box.appendChild(content); box.appendChild(h("button", { class: "sec", onclick: function () { ov.remove(); } }, "Fermer")); ov.appendChild(box); document.body.appendChild(ov);
    }
    function aideBar() {
      var cur = function () { return snap && snap.here ? String(snap.here) : null; };
      return h("div", { style: "position:sticky;top:0;z-index:40;background:#1F2A5C;color:#fff;padding:6px 10px;border-radius:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px" },
        h("b", {}, "Aide"),
        h("button", { class: "sec", style: "margin:0", onclick: function () { aideModal("common"); } }, "Règles"),
        h("button", { class: "sec", style: "margin:0", onclick: function () { aideModal(cur()); } }, "JEU en cours"),
        h("button", { class: "sec", style: "margin:0", onclick: function () { aideModal(cur() || "common"); } }, "Tous les JEUX"));
    }
    function chips(T) { return h("div", {}, T.players.map(function (p) { return pastille(p.st, p.nom, p.col); })); }
    /* ----- lecture obligatoire ----- */
    function docEl(doc) { return h("div", {}, doc.sections.map(function (sc) { return h("div", {}, h("h3", {}, sc[0]), h("ul", {}, sc[1].map(function (l) { return h("li", {}, l); }))); })); }
    function toolBlock(to) {
      var a = to.aide;
      return h("div", { class: "card", style: "background:#EEF7F7" }, h("h3", {}, "Outil à découvrir : " + to.nom), h("p", {}, h("b", {}, "À quoi il sert : "), a.rappel), h("p", {}, h("b", {}, "Tâche : "), to.tache),
        h("ol", {}, a.etapes.map(function (e) { return h("li", {}, e); })), h("p", {}, h("b", {}, "Réussite : "), a.reussite), h("p", {}, h("b", {}, "Si l'outil est inaccessible : "), "appuyez sur « Cet outil ne marche pas » : vous passez votre tour sans pénalité. " + a.secours));
    }
    /* Énoncé du JEU repris du support projeté (but, mise en situation, à faire, en clair). */
    function enonceEl(k) {
      var e = (D.enonces || {})[k]; if (!e) return null; var box = h("div", { class: "card", style: "background:#F4F7FF;border-left:6px solid #3B6FD8" });
      function para(t) { return String(t).split("\n").map(function (l) { return h("p", { style: "margin:4px 0" }, l); }); }
      if (/sujet/i.test(JSON.stringify(e))) { var sj = sujetTxt(); box.appendChild(sj ? h("p", { style: "margin:0 0 6px;background:#E4F6EC;padding:4px 8px;border-radius:6px" }, h("b", {}, "Votre sujet : "), sj.nom, sj.q ? " · " + sj.q : "") : h("p", { class: "warn", style: "margin:0 0 6px" }, "Choisissez d'abord votre sujet (bouton « Choisir mon sujet » en haut de l'écran).")); }
      if (e.clair) box.appendChild(h("p", { class: "big", style: "margin:0 0 6px" }, h("b", {}, "En clair, vous : "), e.clair));
      if (e.rend) box.appendChild(h("p", {}, h("b", {}, "Vous rendez : "), e.rend));
      if (e.but) box.appendChild(h("p", {}, h("b", {}, "But du JEU : "), e.but));
      var zz = D.jeux[k] && D.zones[D.jeux[k].zone]; if (zz) box.appendChild(h("p", { class: "meta", style: "margin:2px 0 6px" }, "Lien avec le syllabus ECUE-S7-1-2 : " + zz.syl + "."));
      (PRIOR_UI[k] || []).forEach(function (x) { var txt = snap && snap.me.rec && snap.me.rec[x[0]]; box.appendChild(h("div", { style: "background:#FFF8E1;border-left:4px solid #E9A400;padding:4px 8px;margin:6px 0" }, h("b", {}, "Rappel : " + x[1] + " (copie, à recopier ou coller) : "), txt ? h("div", {}, h("div", { style: "white-space:pre-wrap" }, txt), h("button", { class: "sec", type: "button", style: "padding:2px 8px;margin-top:4px", onclick: function (ev) { var b = ev.target; try { navigator.clipboard.writeText(txt); b.textContent = "Copié"; setTimeout(function () { b.textContent = "Copier"; }, 1500); } catch (e) { b.textContent = "Sélectionnez le texte"; } } }, "Copier")) : h("span", { class: "meta" }, "Aucune production trouvée pour votre équipe : reprenez-la dans votre carnet ou jouez d'abord le JEU " + x[0] + "."))); });
      if (e.consigne) { box.appendChild(h("p", { style: "margin-bottom:0" }, h("b", {}, "Consigne"))); para(e.consigne).forEach(function (x) { box.appendChild(x); }); }
      if (e.situation) { box.appendChild(h("p", { style: "margin-bottom:0" }, h("b", {}, "Mise en situation"))); para(e.situation).forEach(function (x) { box.appendChild(x); }); }
      if (e.afaire && e.afaire.length) { box.appendChild(h("p", { style: "margin-bottom:0" }, h("b", {}, "À faire"))); box.appendChild(h("ol", {}, e.afaire.map(function (l) { return h("li", {}, l); }))); }
      if (e.livrable) box.appendChild(h("p", {}, h("b", {}, "Livrable : "), e.livrable));
      if (e.outil) box.appendChild(h("p", {}, h("b", {}, "Outil : "), e.outil));
      if (e.page > 0) box.appendChild(h("p", { class: "meta", style: "margin:6px 0 0" }, "Même énoncé que la diapositive " + e.page + " du support projeté."));
      return box;
    }
    function critEl(k) {
      var c = D.jeux[k].cartes.filter(function (x) { return (x.t === "oral" || x.t === "saisie") && !x.extra; })[0]; if (!c || !c.grille) return null;
      return h("div", {}, h("p", { style: "margin-bottom:0" }, h("b", {}, "Les 3 critères (1 point chacun)")), h("ul", {}, c.grille.map(function (g) { return h("li", {}, g); })));
    }
    function ficheEl(k) {
      var f = D.lecture.fiches[k], j = D.jeux[k], to = C.exactTool(k), e = (D.enonces || {})[k];
      return h("div", {}, h("h2", {}, "JEU " + k + " · " + j.titre), enonceEl(k) || h("p", {}, h("b", {}, "Objectif : "), f.obj), h("p", {}, h("b", {}, "Règle : "), f.regle), critEl(k) || h("p", {}, h("b", {}, "Cartes et points : "), f.carte),
        h("p", {}, f.ex[2]), to ? toolBlock(to) : null);
    }
    function drawRead() {
      var common = snap.rd === "common", wait = me.local ? 0 : (common ? 10 : 8), k = snap.here, rk = gidCur + ":" + snap.rd + ":" + k, t0 = readT[rk] || (readT[rk] = Date.now());
      function leftS() { return Math.max(0, wait - Math.floor((Date.now() - t0) / 1000)); } /* le compte à rebours garde son heure de départ, même si l'écran se redessine */
      var btn = h("button", { class: "ok" }, "J'ai lu"), tm = null;
      function tickRead() { var l = leftS(); if (l <= 0) { clearInterval(tm); btn.removeAttribute("disabled"); btn.textContent = "J'ai lu"; } else { btn.setAttribute("disabled", "disabled"); btn.textContent = "J'ai lu (" + l + " s)"; } }
      tickRead(); if (leftS() > 0) tm = setInterval(tickRead, 500);
      jumpNote();
      btn.onclick = function () { clearInterval(tm); send({ t: "read", doc: common ? "common" : "jeu" }); btn.disabled = true; btn.textContent = "Merci, en attente de la table…"; };
      body.appendChild(h("div", { class: "card", style: "border-left:6px solid #E9A400" }, h("b", {}, common ? "Lecture obligatoire avant le premier jeu" : "Lecture obligatoire : nouveau jeu " + k),
        h("p", { class: "meta" }, "Personne ne peut tirer une carte tant que tous les joueurs connectés de la table n'ont pas lu." + (snap.nudge ? " L'enseignant vous demande de terminer la lecture." : ""))));
      body.appendChild(h("div", { class: "card" }, common ? h("div", {}, h("h2", {}, D.lecture.commun.titre), docEl(D.lecture.commun)) : ficheEl(k), btn));
      body.appendChild(chips(snap.table));
    }
    function jumpNote() {
      var ju = snap.table.jumped; if (!ju || ju.to !== snap.tpos || !ju.at || snap.now - ju.at > 600000 || snap.status !== "play") return;
      body.appendChild(h("div", { class: "warn big" }, "L'enseignant est passé au JEU " + ju.jeu + ". Placez le pion de la table sur la case " + ju.to + "."));
    }
    /* ----- aide outil ----- */
    function helpModal(to, lvl0) {
      var a = to.aide, lvl = lvl0 || 0, ov = h("div", { style: "position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:50;overflow:auto;padding:12px" }), box = h("div", { class: "card", style: "max-width:560px;margin:0 auto" });
      function show() {
        box.innerHTML = ""; box.appendChild(h("h2", {}, "Aide · " + to.nom));
        box.appendChild(h("p", { class: "meta" }, "Niveau " + (lvl + 1) + " / 3 · demander de l'aide ne coûte aucun point"));
        if (lvl === 0) { box.appendChild(h("p", { class: "big" }, a.rappel)); box.appendChild(h("p", {}, h("b", {}, "Tâche : "), to.tache)); }
        if (lvl === 1) { box.appendChild(h("ol", {}, a.etapes.map(function (e) { return h("li", {}, e); }))); box.appendChild(h("p", {}, h("b", {}, "Réussite : "), a.reussite)); box.appendChild(h("p", { class: "meta" }, a.limites)); }
        if (lvl === 2) { box.appendChild(h("div", { class: "corr" }, h("b", {}, "Exemple résolu : "), a.exemple)); box.appendChild(h("p", { class: "meta" }, "Si l'outil reste inaccessible : " + a.secours)); }
        box.appendChild(h("p", {}, a.boutons.map(function (b) { return h("a", { href: b[1], target: "_blank", rel: "noopener", class: "btn", style: "margin:3px;display:inline-block" }, b[0] + " ↗"); })));
        (a.copier || []).forEach(function (c) { box.appendChild(h("p", {}, h("b", {}, c[0] + " : "), h("code", {}, c[1]))); });
        var row = h("p", {});
        if (lvl < 2) row.appendChild(h("button", { class: "ok", onclick: function () { lvl++; send({ t: "help", tool: to.id, lvl: lvl }); show(); } }, lvl === 0 ? "Voir les étapes" : "Voir un exemple résolu"));
        row.appendChild(h("button", { class: "sec", onclick: function () { ov.remove(); } }, "Fermer")); box.appendChild(row);
      }
      send({ t: "help", tool: to.id, lvl: lvl }); show(); ov.appendChild(box); document.body.appendChild(ov);
    }
    function helpBtn(to) { return h("button", { class: "sec", onclick: function () { helpModal(to, 0); } }, "Aide outil · " + to.nom); }
    function drawIdle(T) {
      if (snap.status === "lobby") return body.appendChild(h("div", { class: "card" }, h("h2", {}, "En attente du démarrage"), h("p", {}, "L'enseignant va démarrer la partie. Joueurs déjà à la table :"), chips(T)));
      if (snap.me.done) return body.appendChild(h("div", { class: "card" }, h("h2", {}, "Arrivée à l'Examen !"), h("p", {}, "Vous avez terminé la route : " + snap.me.score + " points. Score de la table : " + snap.tscore + "."), h("ul", {}, (snap.mast || []).map(function (x) { return h("li", {}, D.zones[x.z].syl.split(" · ")[0] + " " + D.zones[x.z].nom + " : " + (x.lvl || "pas encore travaillé")); }))));
      if (snap.status === "ended") return body.appendChild(h("div", { class: "card" }, h("h2", {}, "Partie terminée"), h("p", {}, "Case " + snap.tpos + ", " + snap.me.score + " points. Score de la table : " + snap.tscore + ". Niveaux de maîtrise (vous) :"), h("ul", {}, (snap.mast || []).map(function (x) { return h("li", {}, D.zones[x.z].syl.split(" · ")[0] + " " + D.zones[x.z].nom + " : " + (x.lvl || "pas encore travaillé")); }))));
      var hj = snap.here, j = hj ? D.jeux[hj] : null, nt = snap.me.notes && snap.me.notes[0] && snap.now - snap.me.notes[0].at < 120000 ? snap.me.notes[0].txt : null;
      if (nt) body.appendChild(h("div", { class: "card", style: "border-left:6px solid #0F8B8D" }, h("b", {}, "Dernier événement : "), nt));
      jumpNote();
      if (!j) return body.appendChild(h("div", { class: "card" }, h("h2", {}, "Rien à jouer pour l'instant"), h("p", {}, "Votre pion est sur la case " + snap.tpos + ".")));
      if (snap.wait) return body.appendChild(h("div", { class: "card", style: "border-left:6px solid #1F2A5C" }, h("h2", {}, "Case " + snap.tpos + " · JEU " + hj + " · " + j.titre), h("p", { class: "big" }, "Attendez le signal de l'enseignant : ce JEU n'est pas encore ouvert."), h("p", {}, "L'enseignant est sur le JEU " + (snap.jeux && snap.jeux[0] ? snap.jeux[0] : "…") + ". Votre table est en avance : ne cherchez pas à passer au suivant, l'écran se débloquera tout seul à l'ouverture. En attendant, relisez le concept du JEU précédent.")));
      body.appendChild(h("div", { class: "card" }, h("h2", {}, "Case " + snap.tpos + " · JEU " + hj + " · " + j.titre), enonceEl(hj) || h("p", {}, j.regle), C.exactTool(hj) ? h("p", {}, helpBtn(C.exactTool(hj))) : null,
        snap.canDraw ? h("div", {}, h("p", { class: "big" }, "C'est à vous de lancer le JEU pour la table."), h("button", { class: "ok", onclick: function () { send({ t: "draw" }); } }, "Commencer le JEU"))
          : h("p", { class: "big" }, "Au tour de " + (snap.tireur || "…") + " de lancer le JEU."), chips(T)));
    }
    /* ----- formulaire commun à tous les types de cartes ----- */
    function cardForm(c, seed, box) {
      var ans, order = PE.displayOrder(c, seed), ready;
      if (c.t === "choix") {
        ans = -1; var bs = []; order.forEach(function (i) { var b = h("button", { class: "opt", onclick: function () { ans = i; bs.forEach(function (x) { x.className = "opt"; }); b.className = "opt sel"; } }, c.opts[i]); bs.push(b); box.appendChild(b); });
        ready = function () { return ans >= 0; };
      } else if (c.t === "multi") {
        ans = []; box.appendChild(h("p", { class: "meta" }, "Cochez toutes les réponses justes (chaque erreur retire un point)."));
        order.forEach(function (i) { var cb = h("input", { type: "checkbox", style: "width:auto;margin-right:8px" }); var lb = h("label", { class: "opt", style: "display:block;cursor:pointer" }, cb, c.opts[i]); cb.addEventListener("change", function () { var k = ans.indexOf(i); if (cb.checked && k < 0) ans.push(i); if (!cb.checked && k >= 0) ans.splice(k, 1); lb.className = "opt" + (cb.checked ? " sel" : ""); }); box.appendChild(lb); });
        ready = function () { return true; };
      } else if (c.t === "assoc") {
        ans = c.items.map(function () { return -1; });
        order.forEach(function (i) { var sel = h("select", {}, [h("option", { value: "-1" }, "Choisir…")].concat(c.labels.map(function (l, k) { return h("option", { value: String(k) }, l); }))); sel.addEventListener("change", function () { ans[i] = +sel.value; }); box.appendChild(h("div", { class: "card", style: "background:#fff" }, h("p", {}, c.items[i].txt), sel)); });
        ready = function () { return !ans.some(function (x) { return x < 0; }); };
      } else if (c.t === "trous") {
        ans = c.slots.map(function () { return -1; });
        c.slots.forEach(function (sl, si) { var sel = h("select", {}, [h("option", { value: "-1" }, "Choisir…")].concat(order[si].map(function (k) { return h("option", { value: String(k) }, sl.opts[k]); }))); sel.addEventListener("change", function () { ans[si] = +sel.value; }); box.appendChild(h("div", { class: "card", style: "background:#fff" }, h("p", {}, h("b", {}, sl.lab)), sel)); });
        ready = function () { return !ans.some(function (x) { return x < 0; }); };
      } else if (c.t === "texte") {
        var ta = h("textarea", { rows: c.rows || 2, placeholder: "Votre requête" }); ans = ""; ta.addEventListener("input", function () { ans = ta.value; }); box.appendChild(ta);
        ready = function () { return !!String(ans).trim(); };
      } else if (c.t === "saisie") {
        ans = c.champs.map(function (f) { return f.k === "multi" ? [] : f.k === "sel" ? -1 : f.k === "liste" ? f.items.map(function () { return -1; }) : f.k === "paires" ? (function () { var a = []; for (var q = 0; q < f.n; q++) a.push({ t: "", s: -1 }); return a; })() : ""; });
        var filled = function (f, i) { var v = ans[i]; if (f.k === "sel") return v >= 0; if (f.k === "multi") return v.length > 0; if (f.k === "liste") return v.some(function (x) { return x >= 0; }); if (f.k === "paires") return v.some(function (r) { return String(r.t).trim().length > 0; }); return String(v).trim().length > 0; };
        var selEl = function (f, ord, cur, onch) { var sl = h("select", {}, [h("option", { value: "-1" }, "Choisir…")].concat(ord.map(function (k) { return h("option", { value: String(k) }, f.opts[k]); }))); sl.value = String(cur); sl.addEventListener("change", function () { onch(+sl.value); }); return sl; };
        c.champs.forEach(function (f, i) {
          var ord = order && order[i] ? order[i] : (f.opts || []).map(function (o, k) { return k; }), cell = h("div", { class: "card", style: "background:#fff" }, h("p", {}, h("b", {}, f.lab), f.c < 0 ? h("small", { class: "meta" }, "  (non noté)") : null));
          if (f.ph) cell.appendChild(h("p", { class: "meta" }, f.ph));
          if (f.k === "sel") cell.appendChild(selEl(f, ord, -1, function (v) { ans[i] = v; }));
          else if (f.k === "multi") ord.forEach(function (k) { var cb = h("input", { type: "checkbox", style: "width:auto;margin-right:8px" }); cb.addEventListener("change", function () { var j = ans[i].indexOf(k); if (cb.checked && j < 0) ans[i].push(k); if (!cb.checked && j >= 0) ans[i].splice(j, 1); }); cell.appendChild(h("label", { style: "display:block;margin:4px 0;cursor:pointer" }, cb, f.opts[k])); });
          else if (f.k === "liste") f.items.forEach(function (it, q) { cell.appendChild(h("div", { style: "margin:6px 0" }, h("p", { class: "meta", style: "margin:0 0 2px" }, it.txt), selEl(f, ord, -1, function (v) { ans[i][q] = v; }))); });
          else if (f.k === "paires") for (var q = 0; q < f.n; q++) (function (q) { var tx = h("input", { placeholder: f.ph2 || "Votre texte", style: "margin-bottom:4px" }); tx.addEventListener("input", function () { ans[i][q].t = tx.value; }); cell.appendChild(h("div", { style: "margin:6px 0" }, tx, selEl(f, ord, -1, function (v) { ans[i][q].s = v; }))); })(q);
          else { var many = f.k === "txt" && (f.rows || 1) > 1, el = many ? h("textarea", { rows: f.rows }) : h("input", { placeholder: f.k === "url" ? "https://…" : f.k === "num" ? "Un nombre" : "", inputmode: f.k === "num" ? "decimal" : null }); el.addEventListener("input", function () { ans[i] = el.value; }); cell.appendChild(el); if (f.unit) cell.appendChild(h("small", { class: "meta" }, " " + f.unit)); }
          box.appendChild(cell);
        });
        ready = function () { return c.champs.some(filled); };
        return { get: function () { return ans; }, ok: ready, empty: function () { return c.champs.filter(function (f, i) { return f.c >= 0 && !filled(f, i); }).length; } };
      } else {
        box.appendChild(h("p", { class: "meta" }, "Cochez seulement ce que votre production montre réellement :")); ans = c.grille.map(function () { return false; });
        c.grille.forEach(function (g, i) { var cb = h("input", { type: "checkbox", style: "width:auto" }); cb.addEventListener("change", function () { ans[i] = cb.checked; }); box.appendChild(h("label", { style: "display:block;margin:6px 0" }, cb, " " + g)); });
        ready = function () { return true; };
      }
      return { get: function () { return ans; }, ok: ready };
    }
    function correctText(c) {
      if (c.t === "choix") return c.opts[c.ok];
      if (c.t === "multi") return c.oks.map(function (i) { return c.opts[i]; }).join(" ; ");
      if (c.t === "assoc") return c.items.map(function (it) { return it.txt + " → " + c.labels[it.ok]; }).join(" ; ");
      if (c.t === "trous") return c.slots.map(function (sl) { return sl.lab + " : " + sl.opts[sl.ok]; }).join(" ; ");
      return c.modele || "";
    }
    function reportModal() {
      var ov = h("div", { style: "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);z-index:90;display:flex;align-items:center;justify-content:center;padding:12px" }), box = h("div", { class: "card", style: "max-width:520px;width:100%;max-height:92vh;overflow:auto" });
      var kind = h("select", {}, ["Énoncé ou consigne erronée", "Correction ou points injustes", "Problème d'affichage ou bouton qui ne marche pas", "Connexion", "Autre"].map(function (k) { return h("option", { value: k }, k); }));
      var tx = h("textarea", { rows: 4, placeholder: "Décrivez en une ou deux phrases ce qui ne va pas.", maxlength: 600 }), st = h("p", { class: "meta" });
      var cur = snap && snap.table && snap.table.cur ? snap.table.cur : null;
      box.appendChild(h("h2", {}, "Signaler un problème")); box.appendChild(h("p", { class: "meta" }, "Le message part à l'enseignant avec votre prénom, votre table et le JEU en cours.")); box.appendChild(kind); box.appendChild(tx); box.appendChild(st);
      box.appendChild(h("button", { class: "ok", onclick: function () {
        if (!tx.value.trim()) { st.className = "warn"; st.textContent = "Écrivez quelques mots."; return; }
        if (!linkOk) { st.className = "warn"; st.textContent = "Vous êtes hors ligne : le message ne peut pas partir. Reconnectez-vous puis réessayez."; return; }
        send({ t: "report", kind: kind.value, txt: tx.value.trim(), jeu: cur ? cur.jeu : "" }); st.className = "meta"; st.textContent = "Merci, le message est envoyé à l'enseignant."; setTimeout(function () { try { document.body.removeChild(ov); } catch (e) {} }, 1400);
      } }, "Envoyer"));
      box.appendChild(h("button", { class: "sec", onclick: function () { try { document.body.removeChild(ov); } catch (e) {} } }, "Fermer")); ov.appendChild(box); document.body.appendChild(ov);
    }
    function drawSending() {
      body.appendChild(h("div", { class: "card" }, h("h2", {}, "Envoi de votre réponse…"), h("p", {}, "Votre réponse n'est pas encore arrivée chez l'enseignant. L'application la renvoie toute seule toutes les quelques secondes : gardez cette page ouverte."), h("p", { class: "meta" }, linkOk ? "● Connecté : confirmation attendue." : "○ Hors ligne : changez de réseau (partage de connexion du téléphone) ou rechargez la page ; votre réponse est conservée sur cet appareil."), h("button", { class: "sec", onclick: function () { resend(); send({ t: "join", nom: me.nom, table: me.table }); } }, "Renvoyer maintenant")));
    }
    function drawCard(cur) {
      var c = C.cardOf(cur.jeu, cur.id), j = D.jeux[cur.jeu], box = h("div", { class: "card" });
      box.appendChild(h("h2", {}, "JEU " + cur.jeu + " · " + j.titre));
      var en = (c.t === "oral" || c.t === "saisie") && cur.jeu !== "P" ? enonceEl(cur.jeu) : null;
      if (en) { box.appendChild(en); box.appendChild(h("p", { class: "big" }, c.t === "saisie" ? "Saisissez vos résultats dans les champs ci-dessous : l'application les contrôle. 1 point par critère atteint, 3 au maximum." : "Quand vous avez terminé, cochez les critères que votre production remplit : 1 point chacun.")); }
      else box.appendChild(h("p", { class: "big" }, c.q));
      if (cur.jeu !== "P" && C.exactTool(cur.jeu)) box.appendChild(h("p", {}, helpBtn(C.exactTool(cur.jeu))));
      var f = cardForm(c, me.sid + c.id, box), bet = { checked: false };
      var msg = h("p", { class: "warn", style: "display:none" }, "Répondez avant de valider.");
      box.appendChild(h("button", { class: "ok", onclick: function () {
        if (!f.ok()) { msg.style.display = "block"; return; }
        if (f.empty && f.empty() && !confirm(f.empty() + " champ(s) vide(s) : ils compteront pour 0. Valider quand même ?")) return;
        pa = { card: cardId(snap.table), msg: { t: "ans", ans: f.get(), bet: bet.checked, card: cardId(snap.table) } }; paSave(); send(pa.msg); key = ""; render();
      } }, "Valider ma réponse"), msg); body.appendChild(box);
    }
    function moveText(r, m, last) {
      var t = [], n = r.to - r.from, zc = D.zones[last.zone];
      t.push(r.pts + " point" + (r.pts > 1 ? "s" : "") + " sur 3 pour ce JEU.");
      if (r.bet && r.bet.on) t.push(r.bet.d > 0 ? "Pari gagné : +1 point." : r.bet.d < 0 ? "Pari perdu : −1 point." : "Pari neutre (2 points).");
      if (last.bonus) t.push("Table solidaire : +1 point pour la table.");
      if (r.jump) t.push("L'enseignant est passé au JEU " + r.jump + " : quand toute la table a fini, placez le pion sur la case " + r.to + ".");
      else t.push("Quand toute la table a fini : avancez le pion de " + n + " case" + (n > 1 ? "s" : "") + ", jusqu'à la case " + r.to + ".");
      t.push("Jauge " + last.zone + " (" + zc.nom + ") : " + last.gauge + " jeton" + (last.gauge > 1 ? "s" : "") + " sur 10. Complétez ou retirez des jetons de couleur " + zc.nom.toLowerCase() + " (celle de l'objectif) pour arriver à ce niveau.");
      return t.join(" ");
    }
    function drawResult(last) {
      var r = last.res[snap.me.sid], c = C.cardOf(last.jeu, last.id), m = snap.me;
      function details() {
        body.innerHTML = "";
        body.appendChild(h("div", { class: "card" }, h("h2", {}, r.pts + " point" + (r.pts > 1 ? "s" : "") + " sur 3 · JEU " + last.jeu), r.answered ? null : h("p", { class: "warn" }, "Pas de réponse envoyée à temps."),
          c.t === "choix" ? null : h("ul", {}, r.detail.map(function (d) { return h("li", { style: "color:" + (d.ok ? "#1b6b45" : "#a33") }, (d.ok ? "✓ " : "✗ ") + d.lab, d.sub && d.sub.length ? h("ul", { class: "meta", style: "color:#333;font-weight:400" }, d.sub.map(function (x) { return h("li", {}, h("b", { style: "color:" + (x.ok ? "#1b6b45" : x.part ? "#B36B00" : "#a33") }, (x.ok ? "✓ " : x.part ? "◐ " : "✗ ") + x.lab), h("div", {}, "Votre saisie : " + x.got), x.ok ? null : h("div", {}, h("b", {}, "Attendu : "), x.exp), x.why ? h("div", { class: "meta" }, x.why) : null, x.note ? h("div", { class: "meta" }, "ℹ " + x.note) : null); })) : null); })),
          c.t === "saisie" ? null : h("p", {}, h("b", {}, "Réponse attendue : "), correctText(c)), h("div", { class: "corr" }, h("b", {}, "Corrigé : "), c.expl)));
        body.appendChild(h("div", { class: "warn big" }, moveText(r, m, last)));
        if (r.ev && r.ev.k === "aleas") body.appendChild(h("div", { class: "card", style: "border-left:6px solid #7A3FB5" }, h("b", {}, "Aléa : " + r.ev.titre), h("p", {}, r.ev.txt), h("p", { class: "big" }, (r.ev.move > 0 ? "Vous gagnez " : r.ev.move < 0 ? "Vous perdez " : "Aucun point en jeu") + (r.ev.move ? Math.abs(r.ev.move) + " point" + (Math.abs(r.ev.move) > 1 ? "s" : "") + "." : "."))));
        if (r.ev && r.ev.k === "gate") body.appendChild(h("div", { class: "card", style: "border-left:6px solid #1F2A5C" }, h("b", {}, "Case 31 : mi-parcours"), h("p", {}, "Bravo, vous êtes à mi-chemin du plateau. Pas d'effet : continuez.")));
        if (r.ev && ["outil", "piege", "duel", "pairs"].indexOf(r.ev.k) >= 0) body.appendChild(h("div", { class: "card", style: "border-left:6px solid #0F8B8D" }, h("b", {}, "Case à effet : " + D.types[r.ev.k]), h("p", {}, r.ev.k === "pairs" && !r.ev.par ? "Personne n'est disponible pour relire votre réponse : l'effet est annulé." : "L'effet se règle à l'écran suivant.")));
        body.appendChild(h("p", { class: "meta" }, "Autres joueurs de la table : " + snap.table.players.filter(function (p) { return p.sid !== m.sid; }).map(function (p) { var x = last.res[p.sid]; return p.nom + " +" + (x ? x.pts : 0); }).join(" · ")));
        body.appendChild(h("button", { class: "ok", onclick: function () { ack = last.round + 1; saveFlags(); key = ""; render(); } }, "Continuer"));
      }
      if (rolled >= last.round) return details();
      var wl = wheelEl(), skip;
      body.appendChild(h("div", { class: "card", style: "text-align:center" }, h("p", { class: "big" }, "La roue révèle vos points…"), wl, skip = h("button", { class: "sec" }, "Passer")));
      var stop = spinWheel(wl, r.pts, function () { rolled = last.round; saveFlags(); key = "res:" + last.round + ":1"; details(); }); skip.onclick = stop;
    }
    /* ----- effets de cases : outil, piège, duel, relecture ----- */
    var hold = null;
    function feedback(titre, lines, cls) { hold = true; key = "hold"; body.innerHTML = ""; body.appendChild(h("div", { class: "card", style: "border-left:6px solid " + (cls || "#0F8B8D") }, h("h2", {}, titre), lines.map(function (l) { return typeof l === "string" ? h("p", {}, l) : l; }), h("button", { class: "ok", onclick: function () { hold = null; key = ""; render(); } }, "Continuer"))); }
    function drawPend(pe) {
      var box = h("div", { class: "card", style: "border-left:6px solid #0F8B8D" });
      if (pe.k === "outil") {
        box.appendChild(h("h2", {}, "Case Outil : " + pe.tool.nom)); box.appendChild(h("p", { class: "big" }, pe.tool.tache));
        var to = D.outils.filter(function (o) { return o.id === pe.tool.id; })[0];
        box.appendChild(h("p", {}, h("a", { href: pe.tool.url, target: "_blank", rel: "noopener", class: "btn" }, "Ouvrir " + pe.tool.nom + " ↗"), " ", helpBtn(to)));
        box.appendChild(h("p", { class: "meta" }, "Si l'outil est inaccessible, passez votre tour sans pénalité. Essayez l'outil quelques minutes. Si vous avez réussi la tâche : +1 point."));
        box.appendChild(h("button", { class: "ok", onclick: function () { send({ t: "outil", ok: true }); feedback("Outil validé", ["+1 point."]); } }, "J'ai réussi la tâche"));
        box.appendChild(h("button", { class: "sec", onclick: function () { send({ t: "outil", ok: false }); feedback("Tour passé", ["L'outil sera pour une prochaine fois."]); } }, "Passer mon tour"));
        box.appendChild(h("button", { class: "sec", onclick: function () { send({ t: "broke" }); feedback("Merci", ["Votre tour est passé sans pénalité. L'enseignant est prévenu que l'outil « " + pe.tool.nom + " » ne marche pas."]); } }, "Cet outil ne marche pas"));
      } else if (pe.k === "piege") {
        var c = C.cardOf("P", pe.card.id); box.appendChild(h("h2", {}, "Case Piège")); box.appendChild(h("p", { class: "big" }, c.q)); var f = cardForm(c, me.sid + "P" + c.id, box), msg = h("p", { class: "warn", style: "display:none" }, "Répondez avant de valider.");
        box.appendChild(h("button", { class: "ok", onclick: function () { if (!f.ok()) { msg.style.display = "block"; return; } var a = f.get(), pts = PE.score(c, a).pts; send({ t: "pans", ans: a }); feedback(pts >= 2 ? "Piège évité" : "Piège : −1 point", [pts >= 2 ? "Aucun point perdu." : "Vous perdez 1 point.", h("p", {}, h("b", {}, "Réponse attendue : "), correctText(c)), h("div", { class: "corr" }, h("b", {}, "Corrigé : "), c.expl)], pts >= 2 ? "#2E9E6B" : "#C0392B"); } }, "Valider"), msg);
      } else if (pe.k === "duel") {
        box.appendChild(h("h2", {}, "Case Duel"));
        if (pe.st === "wait") { box.appendChild(h("p", { class: "big" }, "En attente d'un adversaire d'une autre table…")); box.appendChild(h("p", { class: "meta" }, "Sans adversaire au bout de 45 secondes, vous affrontez la tour : réussissez la question (2 points ou plus) pour gagner +1 point.")); }
        else {
          var dc = C.cardOf(pe.card.jeu, pe.card.id); box.appendChild(h("p", { class: "meta" }, pe.st === "solo" ? "Duel contre la tour : 2 points ou plus = +1 point." : "Adversaire : " + pe.opp.nom + " (table " + pe.opp.table.slice(1) + "). Le meilleur score gagne +1 point, l'autre perd 1 point ; à égalité, le plus rapide l'emporte.")); box.appendChild(h("p", { class: "big" }, dc.q));
          if (pe.mine) box.appendChild(h("p", { class: "warn" }, "Réponse envoyée" + (pe.st === "solo" ? "." : ", en attente de " + pe.opp.nom + "…")));
          else { var f2 = cardForm(dc, me.sid + "D" + dc.id, box), mg = h("p", { class: "warn", style: "display:none" }, "Répondez avant de valider."); box.appendChild(h("button", { class: "ok", onclick: function () { if (!f2.ok()) { mg.style.display = "block"; return; } send({ t: "dans", ans: f2.get() }); } }, "Valider")); box.appendChild(mg); }
        }
      } else if (pe.k === "rel") {
        var rc = C.cardOf(pe.jeu, pe.id); box.appendChild(h("h2", {}, "Case Relecture : lisez la réponse de " + pe.au)); box.appendChild(h("p", { class: "meta" }, "Question : " + rc.q)); box.appendChild(h("p", { class: "big" }, "Réponse de " + pe.au + " : " + pe.ans));
        box.appendChild(h("p", {}, "Cette réponse est-elle entièrement correcte ? Vous gagnez 1 point pour la relecture ; si une saisie vous semble fausse, l'enseignant arbitre."));
        box.appendChild(h("button", { class: "ok", onclick: function () { send({ t: "rev", verdict: "err" }); feedback("Verdict envoyé", ["Vous avez signalé une saisie douteuse : l'enseignant arbitre. +1 point pour la relecture."]); } }, "Une coche me semble fausse"));
        box.appendChild(h("button", { class: "sec", onclick: function () { send({ t: "rev", verdict: "ok" }); feedback("Verdict envoyé", ["Coches validées. +1 point pour la relecture."]); } }, "Rien à redire"));
      }
      body.appendChild(box);
    }
    mount(aideBar(), h("h1", {}, "5 · La route de l'état de l'art"), head, wordsEl, board, body,
      h("p", {}, h("a", { href: "#/plateau/regles" }, "Règles"), "  ·  ", h("a", { href: "#", onclick: function (e) { e.preventDefault(); reportModal(); } }, "⚠ Signaler un problème"), "  ·  ", h("a", { href: "#", onclick: function (e) { e.preventDefault(); if (confirm("Quitter la partie ? Vous reviendrez au formulaire d'inscription. Vos points sont conservés si vous rejoignez la même table avec le même prénom.")) { send({ t: "leave" }); try { localStorage.removeItem(MK); } catch (x) {} setTimeout(function () { stopAll(); if (/^#\/j$/.test(location.hash)) joinPage(); else location.hash = "#/j"; }, 150); } } }, "Quitter la partie")));
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
    var saved = LSget(GK), jeuxOk = Object.keys(D.jeux), sel = {};
    var boxes = h("select", {}, jeuxOk.map(function (k) { return h("option", { value: k }, k + " · " + D.jeux[k].titre); }));
    mount(h("h1", {}, "Tour de contrôle"),
      saved ? h("div", { class: "card" }, h("h2", {}, "Partie en cours"), h("p", {}, "Code " + saved.code + " · " + Object.keys(saved.players).length + " joueur(s) · partie " + (saved.status === "lobby" ? "pas encore démarrée" : saved.status === "play" ? "en cours" : "terminée")), h("button", { class: "ok", onclick: function () { run(saved, false); } }, "Reprendre cette partie")) : null,
      h("div", { class: "card" }, h("h2", {}, "Nouvelle partie"), h("p", {}, "JEU de départ (vous passerez au suivant avec « JEU suivant ») :"), boxes, h("p", { class: "meta" }, "Une partie n'est pas chronométrée : elle dure jusqu'à « Terminer la partie » et peut reprendre un autre jour sur ce navigateur (« Reprendre cette partie »)."),
        h("p", { class: "meta" }, "Code de partie : " + CODE + ". Ouvrez la tour avant que les étudiants ne se connectent."),
        h("button", { class: "ok", onclick: function () { run(C.newGame({ code: CODE, jeux: [boxes.value || "1"] }), false); } }, "Ouvrir la partie"),
        h("button", { class: "sec", onclick: function () { var g = C.newGame({ code: CODE, jeux: ["1"], min: 480 }); run(g, true); } }, "Simuler une partie (5 tables)")),
      h("p", {}, h("a", { href: "#/test" }, "Mode test : parcourir tous les jeux et toutes les cartes sans répondre"), "  ·  ", h("a", { href: "#/plateau" }, "← Plateau")));
  }

  function run(G, sim, viewer) {
    if (!viewer) LSset(GK, G); var net = null, status = "…", statusDetail = "", dirty = true, view = "proj", tab = "ens", simSt = null, link = {}, wrap = h("div", { class: "jx" }), dead = false;
    function now() { return Date.now(); }
    function save() { if (!viewer) LSset(GK, G); }
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
      if (m.t === "leave") { C.leave(G, real); dirty = true; return; }
      C.act(G, real, m, t);
      if (net) net.send(sid, C.snapshot(G, real, t)); dirty = true;
    }
    var ctl = null;
    if (!viewer) try { ctl = new BroadcastChannel("cpro-j-ctl-" + G.code); ctl.onmessage = function (e) { var m = e.data || {}; if (m.t === "tool") { C.setTool(G, m.tool, !!m.off); dirty = true; refresh(); } if (m.t === "jeu") { C.setJeu(G, m.jeu, now()); dirty = true; refresh(); } if (m.t === "jeu" || m.t === "ping") ctl.postMessage({ t: "pong", jeu: G.jeux[0], extra: !!G.extra }); }; } catch (e) {}

    /* ----- liaison PowerPoint : la macro envoie « JEU|n|diapo » sur un relais, la tour l'écoute ----- */
    var ppt = pptCfg(), es = null, ps = null, lastSig = "", lastRx = "", pp = { st: "…", rl: "…", nt: "…", last: null, pend: null, note: "" };
    function jeuIx(k) { return Object.keys(D.jeux).indexOf(String(k)); }
    function unfinishedTxt() { var n = 0, tot = 0; Object.keys(G.tables).forEach(function (t) { var T = G.tables[t]; if (!T.players || !T.players.length) return; tot++; if (T.cur) n++; }); return n ? "\n\n⚠ " + n + " table(s) sur " + tot + " sont au milieu d'une carte du JEU en cours : elles la terminent avant de passer au suivant (aucune saisie perdue)." : ""; }
    function openJeu(k, why) { C.gotoJeu(G, String(k), now()); pp.pend = null; pp.note = why || ""; dirty = true; refresh(); }
    function onSignal(kind, k, slide) {
      var rx = kind + "|" + k + "|" + slide, t0 = now(); if (rx === lastRx && t0 - (pp.last ? pp.last.at : 0) < 3000) return; lastRx = rx;   /* même signal reçu par le relais ET par ntfy */
      pp.last = { kind: kind, jeu: k, slide: slide, at: t0 };
      if (kind === "JEU" && /^10[1-5]$/.test(String(k))) { C.setWq(G, k - 100); dirty = true; pp.note = "Nuage de mots ouvert : question n° " + (k - 100) + " (diapositive " + slide + ")."; return refresh(); }
      if (kind === "TEST") { pp.note = "Signal de test reçu : la liaison fonctionne."; return refresh(); }
      if (kind !== "JEU" || !D.jeux[k] || ppt.mode === "off") return refresh();
      if (k === G.jeux[0]) { pp.pend = null; pp.note = "Diapositive du JEU " + k + " : déjà ouvert."; return refresh(); }
      if (ppt.mode === "auto" && jeuIx(k) > jeuIx(G.jeux[0])) return openJeu(k, "JEU " + k + " ouvert par le PowerPoint (diapositive " + slide + ").");
      pp.pend = k; pp.note = jeuIx(k) < jeuIx(G.jeux[0]) ? "Retour en arrière : le JEU " + k + " n'est pas relancé automatiquement." : "Le PowerPoint est sur le JEU " + k + "."; refresh();
    }
    function st() { pp.st = ppt.mode === "off" ? "off" : (pp.rl === "ok" || pp.nt === "ok") ? "ok" : (pp.rl === "err" && pp.nt === "err") ? "err" : "…"; }
    function room() { return String(ppt.topic).replace(/[^A-Za-z0-9]/g, "").slice(0, 40); }
    function fromRelay(d) {
      if (!d || d.a !== "msg" || d.t !== "diapos") return;
      if (d.ts && Date.now() - d.ts > 30 * 60000) return;   /* dernière diapo rejouée à l'abonnement : ignorée si trop ancienne */
      var m = String(d.m || "").split("|"); onSignal(m[0], m[1], m[2] || "?");
    }
    function listen() {
      try { es && es.close(); } catch (e) {} es = null; try { ps && ps.close(); } catch (e) {} ps = null;
      if (ppt.mode === "off") { pp.rl = pp.nt = "off"; st(); return; }
      pp.rl = pp.nt = "…"; st();
      /* voie principale : relais Cloudflare (bus /ps, sujet « diapos », salle = clé de liaison) */
      try {
        var url = RELAY.replace(/\/ws$/, "/ps") + "?room=" + encodeURIComponent(room());
        ps = relaySock(url, function () { try { ps.send({ a: "sub", t: "diapos", since: 0 }); } catch (e) {} }, fromRelay, function (v) { pp.rl = v ? "ok" : "err"; st(); refresh(); });
      } catch (e) { pp.rl = "err"; }
      /* secours : ntfy.sh (même clé comme sujet) */
      if (typeof EventSource === "undefined") pp.nt = "err";
      else try { es = new EventSource(relayBase() + "/" + ppt.topic + "/sse");
        es.onopen = function () { pp.nt = "ok"; st(); refresh(); }; es.onerror = function () { pp.nt = "err"; st(); refresh(); };
        es.onmessage = function (e) { try { var d = JSON.parse(e.data); if (d.event && d.event !== "message") return; var m = String(d.message || "").split("|"); onSignal(m[0], m[1], m[2] || "?"); } catch (x) {} };
      } catch (e) { pp.nt = "err"; }
      st();
    }
    if (!viewer) listen();
    if (!viewer) net = hostNet(G.code, onmsg, function (s, d) { status = s; statusDetail = d || ""; refresh(); });
    /* vue projetée dans un autre onglet : la tour diffuse l'état de la partie (même navigateur), l'onglet projeté l'affiche sans rien modifier */
    var pj2 = null;
    try { pj2 = new BroadcastChannel("cpro-j-proj-" + G.code); } catch (e) {}
    function sendProj() { try { pj2 && pj2.postMessage({ t: "G", g: JSON.parse(JSON.stringify(G)) }); } catch (e) {} }
    if (viewer) { if (pj2) pj2.onmessage = function (e) { var m = e.data || {}; if (m.t === "G" && m.g) { Object.keys(G).forEach(function (k) { delete G[k]; }); Object.assign(G, m.g); refresh(); } }; try { pj2 && pj2.postMessage({ t: "want" }); } catch (e) {} }
    else if (pj2) pj2.addEventListener("message", function (e) { if (e.data && e.data.t === "want") sendProj(); });
    var flush = setInterval(function () { if (dead) return; if (viewer) { refresh(); return; } C.tick(G, now()); if (simSt) simStep(); if (dirty) { push(); save(); sendProj(); dirty = false; } else if (Math.floor(now() / 1000) % 5 === 0) { push(); sendProj(); } refresh(); }, 1000);
    onLeave(function () { dead = true; try { pj2 && pj2.close(); } catch (e) {} clearInterval(flush); try { ctl && ctl.close(); } catch (e) {} try { es && es.close(); } catch (e) {} try { ps && ps.close(); } catch (e) {} if (net) net.close(); document.body.classList.remove("jx-full"); });

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
      if (c.t === "trous") return c.slots.map(function (sl) { if (r() < sk) return sl.ok; return Math.floor(r() * sl.opts.length); });
      if (c.t === "multi") { var a = []; c.opts.forEach(function (o, i) { var good = c.oks.indexOf(i) >= 0; if (r() < (good ? sk : (1 - sk) * 0.3)) a.push(i); }); return a; }
      if (c.t === "oral") return c.grille.map(function () { return r() < sk; });
      if (c.t === "saisie") return PE.modelAnswer(c).map(function (v) { if (r() < sk) return v; return typeof v === "string" ? "" : Array.isArray(v) ? [] : -1; });
      var target = Math.round(3 * Math.max(0, Math.min(1, sk + (r() - 0.5) * 0.7))), words = c.modele.split(" "), best = "Nous n'avons rien trouvé de précis.", bd = 9;
      for (var n = words.length; n >= Math.min(3, words.length); n--) { var cand = words.slice(0, n).join(" "), d = Math.abs(PE.score(c, cand).pts - target); if (d < bd) { bd = d; best = cand; } if (d === 0) break; }
      return best;
    }
    function simStep() {
      var t = now(); Object.keys(G.players).forEach(function (s) { if (G.players[s].sim) G.players[s].last = t; });
      Object.keys(G.players).forEach(function (s) { var p = G.players[s]; if (!p.sim || !p.pend) return; var k = "pend" + s + p.pend.at; if (!simSt.at[k]) simSt.at[k] = t + 2500 + Math.random() * 6000; if (t < simSt.at[k]) return;
        var pd = p.pend, rd = Math.random(); dirty = true;
        if (pd.k === "outil") C.act(G, s, { t: "outil", ok: rd < 0.8 }, t);
        else if (pd.k === "piege") C.act(G, s, { t: "pans", ans: simAns(C.cardOf("P", pd.card.id), p.skill) }, t);
        else if (pd.k === "duel" && pd.st !== "wait" && !pd.ans) C.act(G, s, { t: "dans", ans: simAns(C.cardOf(pd.card.jeu, pd.card.id), p.skill) }, t);
        else if (pd.k === "rel") C.act(G, s, { t: "rev", verdict: rd < 0.5 ? "err" : "ok" }, t); });
      Object.keys(G.tables).forEach(function (tn) {
        var T = G.tables[tn];
        if (!T.cur) { var tr = C.tireur(G, T, t); if (tr && tr.sim && C.running(G, t) && (!T.last || t - T.last.at > 4000 + Math.random() * 5000)) { C.draw(G, tr.sid, t); dirty = true; } return; }
        T.players.forEach(function (s) { var p = G.players[s]; if (!p.sim || p.done || !T.cur || T.cur.ans[s]) return; var k = tn + s + T.round; if (!simSt.at[k]) simSt.at[k] = t + 4000 + Math.random() * 16000;
          if (t >= simSt.at[k]) { C.answer(G, s, simAns(C.cardOf(T.cur.jeu, T.cur.id), p.skill), t, false); dirty = true; } });
      });
    }

    /* ----- vue ----- */
    var pj = "", rows = {}, racesEl = h("div", { class: "jx-races" }), sideEl = h("div", { class: "jx-side" }), headEl = h("div", { class: "jx-head" }), tabsEl = h("div", { class: "jx-tabs" }), detEl = h("div", {});
    wrap.appendChild(headEl); wrap.appendChild(tabsEl);
    var cloudHost = h("div", { class: "jx-cloudhost" }); wrap.appendChild(cloudHost); var main = h("div", { class: "jx-main" }, racesEl, sideEl); wrap.appendChild(main); wrap.appendChild(detEl); var drawerEl = h("div", { class: "jx-drawer" }); wrap.appendChild(drawerEl);
    mount(wrap);
    function setView(v) { view = v; document.body.classList.toggle("jx-full", v === "proj"); wrap.className = "jx " + (v === "proj" ? "jx-p" : "jx-t"); refresh(); }
    function exportCsv(S) {
      var l = ["Table;Prénom;Case de la table;Points;JEUX joués;Réussite;Temps moyen (s);" + Object.keys(D.zones).map(function (z) { return "Maîtrise " + z; }).join(";")]; S.players.forEach(function (p) { l.push([p.table, p.nom, p.pos, p.score, p.n, Math.round(p.rate * 100) + "%", p.ms == null ? "" : Math.round(p.ms / 1000)].concat(p.mast.map(function (m) { return m.lvl ? m.lvl + " " + Math.round(m.pct * 100) + "%" : ""; })).join(";")); });
      var a = h("a", { href: "data:text/csv;charset=utf-8," + encodeURIComponent("﻿" + l.join("\n")), download: "route-" + G.code + ".csv" }); document.body.appendChild(a); a.click(); a.remove();
    }
    function refresh() {
      if (dead) return; document.body.classList.toggle("jx-full", view === "proj"); var t = now(), S = C.stats(G, t), left = G.status === "play" ? G.end - t : 0;
      var rank = S.tables.slice().sort(function (a, b) { return b.tscore - a.tscore || b.pos - a.pos; }).map(function (x) { return x.id; });
      headEl.innerHTML = "";
      var stTxt = { ok: "● réseau prêt", local: "◐ mode local (même navigateur)", busy: "○ code déjà utilisé : fermez l'autre tour", err: "○ réseau indisponible" + (statusDetail ? " (" + statusDetail + ")" : "") + " · nouvel essai automatique", off: "○ PeerJS absent" }[status] || "…";
      headEl.appendChild(h("div", { class: "jx-title" }, h("b", {}, "La route de l'état de l'art"), h("span", {}, " · JEU ouvert : " + G.jeux.join(" + ") + " · " + (D.jeux[G.jeux[0]] ? D.jeux[G.jeux[0]].titre : "")), h("small", {}, "  rejoindre : belmdeveloppement.github.io/communication-pro/#/j  ·  code "), h("b", { class: "jx-code" }, G.code)));
      headEl.appendChild(h("div", { class: "jx-clock" }, G.status === "lobby" ? "Partie ouverte : inscriptions" : G.status === "ended" ? "Partie terminée" : "Partie en cours", h("small", {}, "  " + Object.keys(G.players).length + " joueurs · " + S.tables.length + " tables · " + stTxt)));
      var ctr = h("div", { class: "jx-ctl" });
      if (G.status === "lobby") ctr.appendChild(h("button", { class: "ok", onclick: function () { C.start(G, now()); dirty = true; refresh(); } }, "Démarrer la partie"));
      if (G.status === "ended") ctr.appendChild(h("button", { class: "ok", onclick: function () { C.reopen(G, now()); dirty = true; refresh(); } }, "Rouvrir la partie"));
      if (!viewer) ctr.appendChild(h("button", { class: "sec", onclick: function () { if (sim) return setView(view === "proj" ? "prof" : "proj"); sendProj(); window.open(location.href.split("#")[0] + "#/projection", "_blank"); } }, sim && view === "proj" ? "Vue enseignant" : "Vue projetée (nouvel onglet)"));
      if (view === "proj") ctr.appendChild(h("button", { class: "sec", onclick: function () { try { document.documentElement.requestFullscreen(); } catch (e) {} } }, "Plein écran"));
      var jk = Object.keys(D.jeux), ji = jk.indexOf(G.jeux[0]), cn = C.counts(G, G.jeux[0]);
      ctr.appendChild(h("button", { class: "sec", disabled: ji <= 0 ? "disabled" : null, onclick: function () { if (confirm("Revenir au JEU " + jk[ji - 1] + " ? Toutes les tables reviennent sur ce JEU.")) { C.nextJeu(G, -1, now()); dirty = true; refresh(); } } }, "◀ JEU précédent"));
      ctr.appendChild(h("button", { disabled: ji >= jk.length - 1 ? "disabled" : null, onclick: function () { if (confirm("Ouvrir le JEU " + jk[ji + 1] + " ?" + unfinishedTxt() + " Toutes les tables passent sur ce JEU. Une table au milieu d'une carte la termine d'abord. Un JEU non joué est sauté : ni point, ni pénalité.")) { C.nextJeu(G, 1, now()); dirty = true; refresh(); } } }, "Ouvrir le JEU " + (ji < jk.length - 1 ? jk[ji + 1] : "") + " ▶"));
      if (cn.extra) ctr.appendChild(h("button", { class: G.extra ? "ok" : "sec", onclick: function () { C.setExtra(G, !G.extra); dirty = true; refresh(); } }, G.extra ? "Cartes supplémentaires : activées (" + (cn.base + cn.extra) + ")" : "Débloquer les cartes supplémentaires (+" + cn.extra + ")"));
      if (view === "prof") ctr.appendChild(h("button", { class: tab === "corr" ? "ok" : "", onclick: function () { tab = tab === "corr" ? "ens" : "corr"; refresh(); } }, tab === "corr" ? "Fermer le corrigé" : "📖 Corrigé du JEU " + G.jeux[0]));
      ctr.appendChild(h("button", { class: "sec", onclick: function () { exportCsv(S); } }, "Export CSV"));
      var endBtn = G.status === "play" ? h("button", { class: "r", style: "margin-left:28px", onclick: function () { if (confirm("Terminer la partie pour toute la classe ? Les joueurs verront leur bilan. À faire seulement à la fin du cours (vous pourrez la rouvrir en cas d'erreur).")) { C.stop(G, now()); dirty = true; refresh(); } } }, "Terminer la partie (fin du cours)") : null;
      ctr.appendChild(h("a", { class: "btn sec", href: "#/test", target: "_blank", style: "text-decoration:none;display:inline-block" }, "Mode test"));
      ctr.appendChild(h("a", { class: "btn", href: "#/simu?j=" + G.jeux[0], target: "_blank", style: "text-decoration:none;display:inline-block" }, "Simulation joueur"));
      ctr.appendChild(h("button", { class: "sec", onclick: function () { if (confirm("Terminer et effacer cette partie ?")) { try { localStorage.removeItem(GK); } catch (e) {} dead = true; location.hash = "#/tour"; setTimeout(function () { location.reload(); }, 50); } } }, "Nouvelle partie"));
      if (endBtn) ctr.appendChild(endBtn);
      if (viewer) { ctr.innerHTML = ""; ctr.appendChild(h("button", { class: "sec", onclick: function () { try { document.documentElement.requestFullscreen(); } catch (e) {} } }, "Plein écran")); }
      if (!viewer) { var wb = h("span", { class: "meta" }, "Nuage de mots : "); [1, 2, 3, 4, 5].forEach(function (q) { wb.appendChild(h("button", { class: G.wq === String(q) ? "ok" : "sec", style: "padding:2px 8px;margin-right:3px", onclick: function () { C.setWq(G, G.wq === String(q) ? null : q); dirty = true; refresh(); } }, String(q))); }); wb.appendChild(h("button", { class: "sec", style: "padding:2px 8px", onclick: function () { C.setWq(G, null); dirty = true; refresh(); } }, "Fermer")); ctr.appendChild(wb); }
      headEl.appendChild(ctr);
      cloudHost.innerHTML = ""; if (G.wq) { var cl = C.cloud(G, G.wq), nr = Object.keys((G.words || {})[G.wq] || {}).length; cloudHost.appendChild(h("div", { class: "jx-card", style: "margin:8px 0" }, h("h3", {}, "Nuage de mots · question " + G.wq + " · " + nr + " joueur(s) ont répondu"), cloudEl(cl), !viewer ? h("button", { class: "sec", onclick: function () { if (confirm("Effacer les mots de cette question ?")) { delete (G.words || {})[G.wq]; dirty = true; refresh(); } } }, "Effacer les mots") : null)); }
      var ppTxt = { ok: "● PowerPoint relié", err: "○ relais PowerPoint indisponible", off: "○ liaison PowerPoint désactivée" }[pp.st] || "… liaison PowerPoint";
      var ppBar = h("div", { class: "jx-ctl jx-ppt" }, h("small", {}, ppTxt + (pp.note ? " · " + pp.note : "")));
      if (pp.pend && D.jeux[pp.pend]) { ppBar.appendChild(h("button", { class: "ok", onclick: function () { openJeu(pp.pend, "JEU " + pp.pend + " ouvert à la main depuis le signal du PowerPoint."); } }, "Ouvrir le JEU " + pp.pend + " (diapositive affichée)")); ppBar.appendChild(h("button", { class: "sec", onclick: function () { pp.pend = null; pp.note = ""; refresh(); } }, "Ignorer")); }
      if (!viewer) headEl.appendChild(ppBar);
      /* courses */
      var ids = S.tables.map(function (x) { return x.id; });
      if (!ids.length) { racesEl.innerHTML = ""; rows = {}; racesEl.appendChild(h("div", { class: "jx-empty" }, h("img", { src: "qr-j.svg", alt: "QR de connexion", width: 220, height: 220 }), h("div", {}, h("h2", {}, "Les joueurs se connectent"), h("p", {}, "Scannez le QR ou ouvrez le lien, choisissez votre table (1 à 5) et saisissez le code " + G.code + "."), h("p", { class: "jx-link" }, joinLink()), h("p", { class: "jx-link2" }, "code  ", h("b", { class: "jx-code" }, G.code)), h("p", { class: "meta" }, "Les tables apparaissent ici dès qu'un joueur s'y inscrit.")))); }
      else { var em = racesEl.querySelector(".jx-empty"); if (em) em.remove(); }
      ids.forEach(function (id) {
        var T = G.tables[id], x = S.tables.filter(function (y) { return y.id === id; })[0], R = rows[id];
        if (!R) { R = rows[id] = { pawns: {} }; R.el = h("div", { class: "jx-row" }); R.lab = h("div", { class: "jx-tlab" }); R.track = (function () {
          var t = h("div", { class: "jx-track" }), seg = [], cur = null;
          D.cases.forEach(function (c, i) { var z = c.zone || (cur ? cur.z : "P1"); if (c.type === "depart") z = "P1"; if (c.type === "gate" || c.type === "exam") z = cur ? cur.z : "P1"; if (!cur || cur.z !== z) { cur = { z: z, a: i }; seg.push(cur); } });
          seg.forEach(function (g, k) { var end = k + 1 < seg.length ? seg[k + 1].a : 63, i = h("i", {}); i.style.left = (g.a / 62 * 100) + "%"; i.style.width = ((end - g.a) / 62 * 100) + "%"; i.style.background = D.zones[g.z].col + "30"; t.appendChild(i); });
          t.appendChild(h("s", { class: "gate", title: "Case 31 : mi-parcours" })); t.appendChild(h("em", {}, "Examen")); return t; })(); R.sum = h("div", { class: "jx-sum" }); R.chips = h("div", { class: "jx-chips" });
          R.el.appendChild(R.lab); R.el.appendChild(h("div", { class: "jx-mid" }, R.track, R.chips)); R.el.appendChild(R.sum); racesEl.appendChild(R.el); }
        R.lab.innerHTML = ""; R.lab.appendChild(h("b", {}, id)); R.lab.appendChild(h("small", {}, "#" + (rank.indexOf(id) + 1)));
        R.el.className = "jx-row" + (x.stuck ? " stuck" : "");
        R.sum.innerHTML = ""; R.sum.appendChild(h("b", {}, x.tscore + " pt")); R.sum.appendChild(h("small", {}, "case " + x.pos + (x.bonus ? " · +" + x.bonus + " solidaire" : "")));
        var byPos = {};
        T.players.forEach(function (s) { var p = G.players[s], el = R.pawns[s]; if (!el) { el = R.pawns[s] = h("div", { class: "jx-pawn", title: p.nom }, h("span", {}, p.nom.slice(0, 1).toUpperCase())); el.style.background = p.col; R.track.appendChild(el); }
          (byPos[p.pos] = byPos[p.pos] || []).push(el); el.style.left = "calc(" + (p.pos / 62) + " * (100% - 32px) + 2px)"; });
        Object.keys(byPos).forEach(function (k) { byPos[k].forEach(function (el, i) { el.style.top = (3 + i * 4) + "px"; el.style.marginLeft = (i * 7) + "px"; }); });
        var mx = Math.max.apply(null, [1].concat(T.players.map(function (s) { return G.players[s].score; })));
        R.chips.innerHTML = ""; T.players.forEach(function (s) { var p = G.players[s], sp = S.players.filter(function (y) { return y.sid === s; })[0]; var c = pastille(sp.st, p.nom, p.col);
          c.appendChild(h("span", { class: "jx-gauge" }, h("u", { style: "width:" + Math.round(p.score / mx * 100) + "%;background:" + p.col }))); if (!sp.online) c.className += " off"; if (sp.rd !== "ok" && G.status !== "lobby") c.appendChild(h("small", { style: "color:#B36B00;font-weight:700" }, " 📖 lit " + (sp.rd === "common" ? "(règles)" : "(fiche)"))); else if (G.status !== "lobby") c.appendChild(h("small", { style: "color:#1b6b45" }, " ✓ a lu")); R.chips.appendChild(c); });
        if (view === "prof" && T.cur) R.chips.appendChild(h("button", { class: "sec jx-mini", onclick: function () { C.closeRound(G, id, now()); dirty = true; refresh(); } }, "Clôturer la question (" + x.answered + "/" + T.players.length + ")"));
      });
      /* panneau latéral */
      sideEl.innerHTML = "";
      sideEl.appendChild(h("div", { class: "jx-qr" }, h("img", { src: "qr-j.svg", alt: "QR de connexion" }), h("div", {}, h("b", {}, "Connexion perdue ? Scannez à nouveau"), h("small", {}, "même prénom, même table · code " + G.code), joinLink())));
      var LV = { "Débutant": "#E4572E", "Confirmé": "#E9A400", "Expert": "#2E9E6B" };
      sideEl.appendChild(h("div", { class: "jx-card" }, h("h3", {}, "Classement des tables"), h("table", {}, S.tables.slice().sort(function (a, b) { return b.tscore - a.tscore || b.pos - a.pos; }).map(function (x, i) { return h("tr", {}, h("td", {}, "#" + (i + 1)), h("td", {}, h("b", {}, x.id)), h("td", {}, x.tscore + " pt"), h("td", {}, "case " + x.pos), h("td", {}, barsEl(x.gauges))); })),
        h("p", { class: "meta" }, "Jauges sur 10 par objectif · duels : " + Math.round(S.duels / 2) + " · pièges évités : " + S.trapOk + "/" + S.traps)));
      if (view === "prof") {
        sideEl.appendChild(h("div", { class: "jx-card" }, h("h3", {}, "Classement individuel (enseignant)"), h("table", {}, S.players.slice().sort(function (a, b) { return b.score - a.score; }).slice(0, 12).map(function (p, i) { return h("tr", {}, h("td", {}, "#" + (i + 1)), h("td", {}, h("span", { class: "jx-dot", style: "background:" + p.col }), " " + p.nom + " (" + p.table + ")"), h("td", {}, p.score + " pt")); }))));
        var op = (G.arbit || []).map(function (x, i) { return [x, i]; }).filter(function (y) { return !y[0].done; });
        sideEl.appendChild(h("div", { class: "jx-card" }, h("h3", {}, "Relectures à arbitrer (" + op.length + ")"), op.length ? op.slice(0, 5).map(function (y) { var x = y[0]; return h("p", { class: "meta" }, x.rev + " conteste une saisie de " + x.au + " (JEU " + x.jeu + ", " + x.pts + "/3) ", h("button", { class: "r jx-mini", onclick: function () { C.arbitrate(G, y[1], true, now()); dirty = true; refresh(); } }, "Saisie fausse : −1 pt"), h("button", { class: "sec jx-mini", onclick: function () { C.arbitrate(G, y[1], false, now()); dirty = true; refresh(); } }, "Saisie correcte")); }) : h("p", { class: "meta" }, "Aucune.")));
      }
      var nrd = S.players.filter(function (p) { return p.rd !== "ok" && p.online && !p.done; }).length;
      if (G.status !== "lobby") sideEl.appendChild(h("div", { class: "jx-card" }, h("h3", {}, "Lecture des règles"), h("p", {}, nrd ? nrd + " joueur(s) n'ont pas fini de lire (pastille 📖 sur chaque table)." : "Tous les joueurs connectés ont lu."),
        nrd ? h("button", { class: "sec jx-mini", onclick: function () { S.players.forEach(function (p) { if (p.rd !== "ok") C.nudge(G, p.sid, now()); }); dirty = true; refresh(); } }, "Relancer") : null));
      sideEl.appendChild(h("div", { class: "jx-card" }, h("h3", {}, "Aide outils"), h("div", {}, D.outils.map(function (o) { var hn = S.toolHelp[o.id], bn = S.toolBroken[o.id]; if (!hn && !bn && !S.toolOff[o.id]) return null;
        return h("p", { class: "meta" }, o.nom + " : " + hn + " ouverture(s) d'aide" + (bn ? " · " + bn + " signalement(s)" : "") + (S.toolOff[o.id] ? " · DÉSACTIVÉ " : " "), S.toolOff[o.id] ? h("button", { class: "sec jx-mini", onclick: function () { C.setTool(G, o.id, false); dirty = true; refresh(); } }, "Réactiver") : null); })),
        h("a", { href: "#/outils-test", target: "_blank", class: "btn sec", style: "text-decoration:none;display:inline-block;margin-top:4px" }, "Test des outils")));
      var ck = Object.keys(S.crit).sort(function (a, b) { return S.crit[a].ok / S.crit[a].n - S.crit[b].ok / S.crit[b].n; });
      sideEl.appendChild(h("div", { class: "jx-card" }, h("h3", {}, "Réussite par critère"), ck.length ? ck.map(function (k) { var r = S.crit[k].ok / S.crit[k].n; return h("div", { class: "jx-bar" }, h("span", {}, k), h("div", {}, h("u", { style: "width:" + Math.round(r * 100) + "%;background:" + (r < .4 ? "#E4572E" : r < .7 ? "#E9A400" : "#2E9E6B") })), h("b", {}, pct(r))); }) : h("p", { class: "meta" }, "Dès la première carte corrigée.")));
      sideEl.appendChild(h("div", { class: "jx-card" }, h("h3", {}, "Points gagnés par carte"), h("div", { class: "jx-dist" }, S.dist.map(function (n, i) { var tot = S.dist.reduce(function (a, b) { return a + b; }, 0) || 1; return h("div", {}, h("u", { style: "height:" + Math.round(n / tot * 70) + "px" }), h("b", {}, String(i)), h("small", {}, String(n))); }))));
      sideEl.appendChild(h("div", { class: "jx-card" }, h("h3", {}, "Alertes"), S.alerts.length ? S.alerts.slice(0, 6).map(function (a) { return h("p", { class: "jx-al" }, "⚠ " + a.txt, a.k === "tool" ? h("button", { class: "r jx-mini", onclick: function () { C.setTool(G, a.tool, true); dirty = true; refresh(); } }, "Désactiver cet outil") : null); }) : h("p", { class: "meta" }, "Rien à signaler.")));
      /* onglets enseignant */
      var sig = [view, tab, G.jeux[0], !!G.extra, pp.st, ppt.mode, ppt.topic, pp.last ? pp.last.at : 0].join("|");
      drawerEl.className = "jx-drawer" + (view === "prof" && tab === "corr" ? " on" : "");
      if (view === "prof" && ((tab === "corr" && drawerEl.firstChild) || (tab === "ppt" && detEl.firstChild)) && sig === lastSig) return; lastSig = sig;
      tabsEl.innerHTML = detEl.innerHTML = drawerEl.innerHTML = ""; if (view !== "prof") return;
      var nrep = (G.reports || []).filter(function (r) { return !r.done; }).length;
      [["ens", "Joueurs"], ["prod", "Saisies des joueurs"], ["suj", "Sujets (" + Object.keys(G.sujets || {}).length + "/" + (D.sujets || []).length + ")"], ["rep", "Signalements" + (nrep ? " (" + nrep + ")" : "")], ["mast", "Maîtrise"], ["pts", "Points par JEU"], ["crit", "Critères et cartes"], ["err", "Erreurs fréquentes"], ["eng", "Engagement"], ["corr", "Corrigé du JEU ouvert"], ["ppt", "Liaison PowerPoint"]].forEach(function (a) { tabsEl.appendChild(h("button", { style: a[0] === "rep" && nrep ? "background:#C0392B" : "", class: a[0] === tab ? "" : "sec", onclick: function () { tab = a[0]; refresh(); if (a[0] === "ppt" || a[0] === "prod") try { tabsEl.scrollIntoView({ behavior: "smooth" }); } catch (e) {} } }, a[1])); });
      if (tab === "ens") detEl.appendChild(h("table", {}, h("tr", {}, ["Rang", "Table", "Joueur", "Points", "JEUX joués", "Réussite", "Temps moyen", "Duels", "État", "Retirer"].map(function (c) { return h("th", {}, c); })),
        S.players.slice().sort(function (a, b) { return b.score - a.score; }).map(function (p, i) { return h("tr", {}, h("td", {}, String(i + 1)), h("td", {}, p.table), h("td", {}, h("span", { class: "jx-dot", style: "background:" + p.col }), " " + p.nom), h("td", {}, String(p.score)), h("td", {}, p.n + " (" + p.ok + " à 3 pt)"), h("td", {}, p.n ? pct(p.rate) : "—"), h("td", {}, p.ms == null ? "—" : Math.round(p.ms / 1000) + " s"), h("td", {}, p.duelW + "V " + p.duelL + "D"), h("td", {}, (p.online ? "" : "hors ligne · ") + ST[p.st][1]), h("td", {}, p.online ? "" : h("button", { class: "sec jx-mini", title: "Retirer un doublon ou un joueur parti", onclick: function () { if (confirm("Retirer " + p.nom + " (" + p.table + ") de la partie ? Ses points sont perdus.")) { C.leave(G, p.sid, true); dirty = true; refresh(); } } }, "Retirer"))); })));
      if (tab === "mast") {
        var zs = Object.keys(D.zones), cell = function (m) { return h("td", { style: "font-weight:700;color:" + (m.lvl ? LV[m.lvl] : "#8A93A8") }, m.lvl ? m.lvl + " (" + Math.round(m.pct * 100) + " %)" : "—"); };
        detEl.appendChild(h("div", { class: "card" }, h("h3", {}, "Niveaux de maîtrise par objectif (indice de progression, seuils non communiqués aux étudiants)"), h("table", {}, h("tr", {}, [h("th", {}, "Table / joueur")].concat(zs.map(function (z) { return h("th", { style: "color:" + D.zones[z].col }, z + " " + D.zones[z].nom + " (" + D.nz[z] + " JEU)"); }))),
          S.tables.map(function (x) { return h("tr", { style: "background:#EEF2FB" }, [h("td", {}, h("b", {}, "Table " + x.id.slice(1)))].concat(x.mast.map(cell))); }).concat(S.players.slice().sort(function (a, b) { return a.table < b.table ? -1 : a.table > b.table ? 1 : 0; }).map(function (p) { return h("tr", {}, [h("td", {}, h("span", { class: "jx-dot", style: "background:" + p.col }), " " + p.nom + " (" + p.table + ")")].concat(p.mast.map(cell))); })))));
      }
      if (tab === "pts") {
        var ps = S.players.slice().sort(function (a, b) { return a.table < b.table ? -1 : a.table > b.table ? 1 : a.nom < b.nom ? -1 : 1; }); if (!ps.length) return detEl.appendChild(h("p", { class: "meta" }, "Aucun joueur."));
        if (!G.sel || !G.players[G.sel]) G.sel = ps[0].sid;
        var sel = h("select", { onchange: function () { G.sel = sel.value; refresh(); } }, ps.map(function (p) { var o = h("option", { value: p.sid }, p.nom + " (" + p.table + ")"); if (p.sid === G.sel) o.selected = true; return o; })), pl = G.players[G.sel];
        detEl.appendChild(h("div", { class: "card" }, h("h3", {}, "Points par JEU et correction"), sel, h("table", {}, h("tr", {}, ["JEU", "Objectif", "Points /3", "Corriger"].map(function (c) { return h("th", {}, c); })),
          pl.res.map(function (r) { return h("tr", {}, h("td", {}, r.jeu + " · " + D.jeux[r.jeu].court), h("td", {}, D.jeux[r.jeu].zone), h("td", {}, r.pts + (r.fixed ? " (corrigé)" : "")), h("td", {}, [0, 1, 2, 3].map(function (v) { return h("button", { class: v === r.pts ? "" : "sec jx-mini", onclick: function () { C.fixJeu(G, G.sel, r.jeu, v, now()); dirty = true; refresh(); } }, String(v)); }))); })),
          h("p", { class: "meta" }, "Un changement met à jour le score, le classement, la jauge et le niveau de maîtrise.")));
      }
      if (tab === "crit") {
        var cards = Object.keys(S.cards).map(function (k) { return S.cards[k]; }).sort(function (a, b) { return a.pts / a.n - b.pts / b.n; });
        detEl.appendChild(h("table", {}, h("tr", {}, ["Carte", "Énoncé, critères et modèle", "Réponses", "Moyenne /3", "Temps moyen"].map(function (c) { return h("th", {}, c); })), cards.map(function (c) { var card = C.cardOf(c.jeu, c.id); return h("tr", {}, h("td", {}, c.jeu + "·" + c.id), h("td", {}, h("div", {}, card.q), card.checks ? h("ul", { class: "meta" }, card.checks.map(function (k) { return h("li", {}, k.lab); })) : null, card.modele ? h("div", { class: "meta" }, h("b", {}, "Modèle : "), card.modele) : null), h("td", {}, String(c.n)), h("td", {}, (c.pts / c.n).toFixed(2)), h("td", {}, c.nms ? Math.round(c.ms / c.nms / 1000) + " s" : "—")); })));
      }
      if (tab === "corr") {
        var kj = G.jeux[0], J = D.jeux[kj], fo = D.lecture.fiches[kj], cs = J.cartes.filter(function (c) { return G.extra || !c.extra; });
        drawerEl.appendChild(h("div", { style: "display:flex;justify-content:space-between;align-items:center;gap:10px" }, h("b", {}, "Corrigé réservé à l'enseignant"), h("button", { class: "sec", onclick: function () { tab = "ens"; refresh(); } }, "Fermer ✕")));
        drawerEl.appendChild(h("div", { class: "warn" }, "Absent de la « Vue projetée ». Ne projetez pas cet écran pendant que les tables jouent."));
        drawerEl.appendChild(h("div", { class: "card" }, h("h2", {}, "JEU " + kj + " · " + J.titre), h("p", { class: "meta" }, "Objectif " + J.zone + " · " + cs.length + " carte(s) en jeu" + (G.extra ? " (cartes supplémentaires comprises)" : "") + ". Chaque joueur reçoit une de ces cartes."),
          fo ? h("p", {}, h("b", {}, "Objectif annoncé aux joueurs : "), fo.obj) : null, fo ? h("p", {}, h("b", {}, "Règle : "), fo.regle) : null, fo && fo.ex ? h("ul", { class: "meta" }, fo.ex.map(function (x) { return h("li", {}, x); })) : null));
        cs.forEach(function (c, i) { drawerEl.appendChild(h("p", { class: "meta", style: "margin:10px 0 2px" }, "Carte " + (i + 1) + " / " + cs.length + (c.extra ? " · supplémentaire" : ""))); drawerEl.appendChild(answerEl(c)); });
      }
      if (tab === "suj") {
        var sjr = (D.sujets || []).map(function (x, i) { var sd = (G.sujets || {})[x[0]], pl = sd && G.players[sd]; return h("tr", {}, h("td", {}, String(i + 1)), h("td", {}, x[0]), h("td", {}, pl ? pl.nom + " (" + pl.table + ")" : h("span", { class: "meta" }, "libre")), h("td", {}, pl ? h("button", { class: "sec jx-mini", onclick: function () { C.releaseSujet(G, x[0]); dirty = true; refresh(); } }, "Libérer") : "")); });
        var sans = Object.keys(G.players).map(function (k) { return G.players[k]; }).filter(function (q) { return !q.sujet && !q.sim; });
        detEl.appendChild(h("div", { class: "card" }, h("h3", {}, "Sujets choisis par les joueurs"), h("table", {}, h("tr", {}, ["N°", "Sujet", "Joueur", ""].map(function (c) { return h("th", {}, c); })), sjr),
          h("p", { class: "meta" }, sans.length ? "Sans sujet : " + sans.map(function (q) { return q.nom + " (" + q.table + ")"; }).join(", ") : "Tous les joueurs connectés ont un sujet."), h("p", { class: "meta" }, "« Libérer » rend le sujet disponible et permet au joueur d'en choisir un autre.")));
      }
      if (tab === "rep") {
        var rl = G.reports || [], hh = function (t) { var d = new Date(t); return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); };
        detEl.appendChild(h("div", { class: "card" }, h("h3", {}, "Signalements des joueurs (" + nrep + " à traiter)"), h("p", { class: "meta" }, "Envoyés depuis le bouton « Signaler un problème » de l'écran joueur. « Traité » retire la ligne de la liste à traiter ; « Copier » exporte tout pour corriger l'application après le cours."),
          h("button", { class: "sec", onclick: function () { var tx = rl.map(function (r) { return hh(r.at) + " · " + r.table + " " + r.nom + " · JEU " + (r.jeu || "?") + " · " + r.kind + " · " + r.txt + (r.done ? " [traité]" : ""); }).join("\n"); try { navigator.clipboard.writeText(tx); } catch (e) {} } }, "Copier tous les signalements"),
          rl.length ? h("table", {}, h("tr", {}, ["Heure", "Table", "Joueur", "JEU", "Type", "Message", "Statut"].map(function (c) { return h("th", {}, c); })), rl.slice().reverse().map(function (r) { return h("tr", {}, h("td", {}, hh(r.at)), h("td", {}, r.table), h("td", {}, r.nom), h("td", {}, r.jeu || "—"), h("td", {}, r.kind), h("td", { style: "white-space:pre-wrap" }, r.txt), h("td", {}, r.done ? "traité" : h("button", { class: "sec", onclick: function () { r.done = true; dirty = true; lastSig = ""; refresh(); } }, "Traité"))); })) : h("p", { class: "meta" }, "Aucun signalement pour l'instant.")));
      }
      if (tab === "prod") {
        if (!pj) pj = G.jeux[0];
        var psel = h("select", { style: "max-width:420px", onchange: function () { pj = psel.value; lastSig = ""; refresh(); } }, Object.keys(D.jeux).map(function (k) { var o = h("option", { value: k }, k + " · " + D.jeux[k].titre); if (k === pj) o.selected = true; return o; }));
        var prows = []; Object.keys(G.players).forEach(function (sid) { var pl = G.players[sid]; pl.res.forEach(function (r) { if (r.jeu === pj) prows.push({ sid: sid, pl: pl, r: r }); }); });
        prows.sort(function (a, b) { return a.pl.table < b.pl.table ? -1 : a.pl.table > b.pl.table ? 1 : a.pl.nom < b.pl.nom ? -1 : 1; });
        detEl.appendChild(h("div", { class: "card" }, h("h3", {}, "Saisies des joueurs sur ce JEU : " + prows.length + " sur " + Object.keys(G.players).length + " joueurs"), h("p", { class: "meta" }, "JEU : "), psel, h("p", { class: "meta" }, "Lisez la saisie ; si l'application s'est trompée ou si le fond doit être jugé (textes libres), corrigez les points avec les boutons 0 à 3."),
          prows.length ? h("table", {}, h("tr", {}, ["Table", "Joueur", "Points", "Saisie", "Corriger"].map(function (c) { return h("th", {}, c); })), prows.map(function (x) { return h("tr", {}, h("td", {}, x.pl.table), h("td", {}, x.pl.nom), h("td", {}, String(x.r.pts)), h("td", { style: "white-space:pre-wrap;font-size:13px;max-width:560px" }, x.r.txt || "(JEU déclaratif ou pas de saisie)"), h("td", {}, [0, 1, 2, 3].map(function (v) { return h("button", { class: v === x.r.pts ? "" : "sec jx-mini", onclick: function () { C.fixJeu(G, x.sid, pj, v, now()); dirty = true; lastSig = ""; refresh(); } }, String(v)); }))); })) : h("p", { class: "meta" }, "Aucune production pour ce JEU pour l'instant.")));
      }
      if (tab === "ppt") {
        var modeSel = h("select", { style: "max-width:420px", onchange: function () { ppt.mode = modeSel.value; LSset("j-ppt", ppt); pp.pend = null; listen(); refresh(); } }, [["auto", "Automatique (recommandé) : la diapositive d'un JEU placé après le JEU actuel l'ouvre toute seule"], ["ask", "Avec confirmation : un bouton « Ouvrir le JEU n » apparaît, rien ne s'ouvre sans votre clic"], ["off", "Désactivée"]].map(function (m) { var o = h("option", { value: m[0] }, m[1]); if (m[0] === ppt.mode) o.selected = true; return o; }));
        var jsel = h("select", { style: "max-width:420px" }, Object.keys(D.jeux).map(function (k) { var o = h("option", { value: k }, k + " · " + D.jeux[k].titre); if (k === G.jeux[0]) o.selected = true; return o; }));
        var key = h("input", { value: ppt.topic, style: "max-width:320px" });
        detEl.appendChild(h("div", { class: "card" }, h("h2", {}, "Liaison PowerPoint"),
          h("p", {}, "Quand vous arrivez, en diaporama, sur la diapositive d'énoncé d'un JEU, la tour ouvre ce JEU et place toutes les tables dessus : les écrans des joueurs affichent sa fiche, cette vue et la vue projetée le suivent. Une table au milieu d'une carte la termine d'abord. Un JEU non joué est sauté : ni point, ni pénalité. Les diapositives d'énoncé des 45 JEUX et les 4 questions du nuage de mots portent une étiquette invisible (ROUTE_JEU) : rien à modifier jeu par jeu."),
          h("p", {}, h("b", {}, "État : "), ({ ok: "la tour écoute (relais Cloudflare : " + (pp.rl === "ok" ? "joignable" : "indisponible") + " · secours ntfy : " + (pp.nt === "ok" ? "joignable" : "indisponible") + ").", err: "relais et secours injoignables (réseau ou pare-feu). Utilisez le secours manuel ci-dessous.", off: "liaison désactivée." }[pp.st] || "connexion en cours…"), pp.last ? " Dernier signal : " + (pp.last.kind === "TEST" ? "test" : (/^10[1-4]$/.test(pp.last.jeu) ? "nuage de mots, question " + (pp.last.jeu - 100) : "JEU " + pp.last.jeu) + ", diapositive " + pp.last.slide) + " à " + new Date(pp.last.at).toLocaleTimeString("fr-FR") + "." : " Aucun signal reçu pour l'instant."),
          h("p", {}, h("b", {}, "Mode : "), modeSel), h("p", { class: "meta" }, "Retour en arrière : revenir sur la diapositive d'un JEU déjà passé ne le relance pas ; un bouton « Ouvrir le JEU n » apparaît en haut de la tour.")));
        detEl.appendChild(h("div", { class: "card" }, h("h3", {}, "Secours manuel (Mac, macros bloquées, relais indisponible)"), h("p", {}, "Je suis au JEU n° ", jsel, " ", h("button", { onclick: function () { openJeu(jsel.value, "JEU " + jsel.value + " ouvert à la main."); } }, "Ouvrir ce JEU"))));
        detEl.appendChild(h("div", { class: "card" }, h("h3", {}, "Installation sous Windows (une seule fois par ordinateur)"),
          h("ol", {}, ["Installez le complément JeuxLive.ppam (le même que pour les autres jeux en direct) : Fichier, Options, Compléments, Atteindre…, Ajouter, puis cochez-le. Il se charge ensuite tout seul à chaque ouverture de PowerPoint.", "Aucune clé à coller dans PowerPoint : le support v25 porte déjà sa clé. Sur le PC de cours, ouvrez une fois le lien de la tour fourni avec la livraison (adresse de l'application suivie de ?cle=…) : la clé est mémorisée dans le navigateur.", "Essai : Alt+F8 (ou la fenêtre Exécution, voir le README), TesterPlateau, puis vérifiez la tour. Cette page doit afficher « Signal de test reçu ».", "Ensuite, rien à faire : lancez le diaporama du support (aucun fichier .pptm, aucun import de macro), la tour suit les diapositives."].map(function (x) { return h("li", {}, x); })),
          h("p", { class: "meta" }, "Le complément envoie le numéro du JEU au relais Cloudflare (voie principale) et à ntfy.sh (secours). Aucune modification n'est à faire dans les JEUX eux-mêmes. Le complément n'a pas encore été essayé sous PowerPoint : faites l'essai TesterPlateau avant le premier cours.")));
        detEl.appendChild(h("div", { class: "card" }, h("h3", {}, "Clé de liaison"), h("p", { class: "meta" }, "La clé est propre à ce navigateur et reste la même d'un cours à l'autre. Sur un autre ordinateur, collez ici la clé d'origine affichée ci-dessous : copiez-la, puis collez-la dans ConfigurerCle sur l\'autre ordinateur."),
          key, " ", h("button", { class: "sec", onclick: function () { var v = key.value.trim(); if (!/^[A-Za-z0-9_-]{8,64}$/.test(v)) return alert("Clé invalide : 8 à 64 lettres, chiffres ou tirets."); ppt.topic = v; LSset("j-ppt", ppt); listen(); refresh(); } }, "Enregistrer la clé"),
          h("p", { class: "meta" }, "Seul le numéro du JEU et celui de la diapositive transitent par le relais (Cloudflare, ntfy.sh en secours) : aucun nom, aucune réponse d'étudiant.")));
      }
      if (tab === "err") { var er = Object.keys(S.err).sort(function (a, b) { return S.err[b] - S.err[a]; }).slice(0, 8); detEl.appendChild(h("div", { class: "card" }, h("h3", {}, "Critères les plus souvent manqués"), er.length ? h("ol", {}, er.map(function (k) { return h("li", {}, k + " : " + S.err[k] + " fois"); })) : h("p", { class: "meta" }, "Pas encore de données."))); }
      if (tab === "eng") { var tot = S.expected || 1, rs = S.resp.length ? S.resp.reduce(function (a, b) { return a + b; }, 0) / S.resp.length : 0; detEl.appendChild(h("div", { class: "card" }, h("h3", {}, "Engagement"), h("p", {}, "Réponses envoyées : " + S.answered + " sur " + S.expected + " attendues (" + pct(S.answered / tot) + ")."), h("p", {}, "Temps de réponse moyen : " + (rs ? Math.round(rs / 1000) + " s" : "—") + "."), h("p", {}, "Joueurs hors ligne : " + S.players.filter(function (p) { return !p.online; }).length + " sur " + S.players.length + "."))); }
    }
    if (sim) simStart();
    setView(sim || viewer ? "proj" : "prof");
    window.J51._G = function () { return G; };
  }


  /* ---------- Corrigé d'une carte (tour de contrôle et mode test) ---------- */
  function answerEl(c) {
    var card = h("div", { class: "card" }); card.appendChild(h("p", { class: "big" }, c.q));
    if (c.t === "choix") c.opts.forEach(function (o, i) { card.appendChild(h("div", { class: "opt " + (i === c.ok ? "good" : "") }, (i === c.ok ? "✓ " : "") + o)); });
    else if (c.t === "multi") c.opts.forEach(function (o, i) { card.appendChild(h("div", { class: "opt " + (c.oks.indexOf(i) >= 0 ? "good" : "") }, (c.oks.indexOf(i) >= 0 ? "✓ " : "") + o)); });
    else if (c.t === "trous") { card.appendChild(h("p", {}, h("b", {}, "Phrase modèle : "), c.modele)); c.slots.forEach(function (sl) { card.appendChild(h("p", {}, h("b", {}, sl.lab + " : "))); sl.opts.forEach(function (o, i) { card.appendChild(h("div", { class: "opt " + (i === sl.ok ? "good" : "") }, (i === sl.ok ? "✓ " : "") + o)); }); }); }
    else if (c.t === "assoc") c.items.forEach(function (x) { card.appendChild(h("div", { class: "card", style: "background:#fff" }, x.txt, h("b", {}, "  →  " + c.labels[x.ok]))); });
    else if (c.t === "saisie") { c.champs.forEach(function (f) { card.appendChild(h("div", { class: "card", style: "background:#fff" }, h("p", {}, h("b", {}, f.lab), f.c >= 0 ? h("small", { class: "meta" }, "  · critère " + (f.c + 1) + " : " + c.grille[f.c]) : h("small", { class: "meta" }, "  · non noté")), h("p", { class: "good opt", style: "margin:4px 0" }, h("b", {}, f.k === "txt" || f.k === "url" ? "Exemple de réponse : " : "Attendu : "), PE.expTxt(f) || "(libre)"), f.why ? h("p", { class: "meta" }, f.why) : null, f.soft ? h("p", { class: "meta" }, "Forme contrôlée par l'application ; le fond est à valider par l'enseignant (onglet « Productions »).") : null)); }); }
    else if (c.t === "texte") { card.appendChild(h("p", {}, h("b", {}, "Critères notés (1 point chacun) :"))); card.appendChild(h("ul", {}, c.checks.map(function (k) { return h("li", {}, k.lab); }))); card.appendChild(h("p", {}, h("b", {}, "Réponse modèle : "), c.modele)); }
    else if (c.grille) card.appendChild(h("ul", {}, c.grille.map(function (g) { return h("li", {}, g); })));
    card.appendChild(h("div", { class: "corr" }, h("b", {}, "Corrigé : "), c.expl));
    return card;
  }

  /* ---------- Liaison PowerPoint : fichiers de macro (Windows) ---------- */
  var RELAY0 = "https://ntfy.sh";
  function relayBase() { return (LSget("j-relay") || RELAY0).replace(/\/+$/, ""); }
  function cleDuLien() { try { var m = /[?&#]cle=([A-Za-z0-9_-]{8,64})/.exec(location.search + location.hash); return m ? m[1] : ""; } catch (e) { return ""; } }
  function pptCfg() { var c = LSget("j-ppt"), kl = cleDuLien(); if (kl && c && c.topic !== kl) { c.topic = kl; LSset("j-ppt", c); } else if (kl && !c) { c = { topic: kl, mode: "auto", v: 3 }; LSset("j-ppt", c); } if (!c || !c.topic) { c = { topic: "route-" + Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 12), mode: "auto", v: 3 }; LSset("j-ppt", c); } else if (c.v !== 3) { c.v = 3; if (c.mode === "ask") c.mode = "auto"; LSset("j-ppt", c); } return c; }
  function dl(name, txt) { var a = h("a", { href: URL.createObjectURL(new Blob([txt], { type: "text/plain" })), download: name }); document.body.appendChild(a); a.click(); a.remove(); }

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
      box.appendChild(h("div", { class: "warn" }, "Mode test : les réponses attendues sont affichées. Aucune carte n'est envoyée aux joueurs ; seul le jeu choisi peut l'être. Les 45 JEUX sont parcourus."));
      box.appendChild(h("label", { style: "display:block;margin:6px 0" }, cb, " Synchroniser la partie : changer de jeu ici change le jeu des joueurs"), info); showInfo();
      box.appendChild(h("h1", {}, "JEU " + it.jeu + " · " + j.titre)); box.appendChild(h("p", { class: "meta" }, "Zone " + j.zone + " · carte " + pos + " / " + n.length + (c.extra ? " · carte supplémentaire" : "") + " · type " + c.t + " · " + (ix + 1) + " / " + list.length + " au total"));
      box.appendChild(answerEl(c));
      box.appendChild(h("p", { class: "meta" }, "Flèches du clavier : ← → pour les cartes, haut/bas pour les jeux. ", h("a", { href: "#/tour" }, "Tour de contrôle")));
    }
    var bar = h("div", { class: "jx-fab" },
      h("button", { class: "sec", onclick: function () { jump(-1); } }, "⏮ Jeu"), h("button", { onclick: function () { go(ix - 1); } }, "◀ Carte"), h("button", { onclick: function () { go(ix + 1); } }, "Carte ▶"), h("button", { class: "sec", onclick: function () { jump(1); } }, "Jeu ⏭"));
    function key(e) { if (e.key === "ArrowRight") go(ix + 1); else if (e.key === "ArrowLeft") go(ix - 1); else if (e.key === "ArrowDown") jump(1); else if (e.key === "ArrowUp") jump(-1); }
    document.addEventListener("keydown", key); onLeave(function () { document.removeEventListener("keydown", key); bar.remove(); try { ctl && ctl.close(); } catch (e) {} });
    mount(box); document.body.appendChild(bar); draw();
  }

  /* ---------- Test des outils depuis le réseau de la salle ---------- */
  function toolsTestPage() {
    var st = LSget("j-tooltest") || {}, ctl = null; var G0 = LSget(GK);
    try { ctl = new BroadcastChannel("cpro-j-ctl-" + CODE); } catch (e) {}
    var rows = h("div", {});
    function save() { LSset("j-tooltest", st); }
    function draw() {
      rows.innerHTML = "";
      D.outils.forEach(function (o) {
        var a = o.aide, sel = st[o.id] || "";
        function mark(v) { st[o.id] = v; save(); if (ctl) try { ctl.postMessage({ t: "tool", tool: o.id, off: v === "ko" }); } catch (e) {} draw(); }
        rows.appendChild(h("div", { class: "card", style: "border-left:6px solid " + (sel === "ok" ? "#2E9E6B" : sel === "ko" ? "#C0392B" : "#bbb") }, h("b", {}, "JEU " + o.jeu + " · " + o.nom), h("p", { class: "meta" }, o.tache),
          h("p", {}, h("a", { href: o.url, target: "_blank", rel: "noopener", class: "btn" }, "Ouvrir " + o.nom + " ↗"), " ", a.boutons.slice(1).map(function (b) { return h("a", { href: b[1], target: "_blank", rel: "noopener", class: "btn sec", style: "margin-left:4px" }, b[0] + " ↗"); })),
          h("p", {}, h("button", { class: sel === "ok" ? "ok" : "sec", onclick: function () { mark("ok"); } }, "✓ Accessible"), h("button", { class: sel === "ko" ? "r" : "sec", onclick: function () { mark("ko"); } }, "✗ Bloqué"), h("small", { class: "meta" }, sel === "ko" ? " Cet outil sera proposé à la désactivation dans la tour." : ""))));
      });
    }
    draw();
    var nbko = function () { return D.outils.filter(function (o) { return st[o.id] === "ko"; }).length; };
    mount(h("h1", {}, "Test des outils"), h("p", {}, "À faire depuis le réseau de la salle, avant le cours. Ouvrez chaque outil dans un nouvel onglet : s'il s'affiche et répond, cochez « Accessible » ; sinon « Bloqué ». Un outil bloqué est désactivé dans la partie en cours (la case Outil donne alors +1 case sans tâche)."),
      h("p", { class: "meta" }, "Certains outils demandent un compte gratuit ou limitent l'offre gratuite : à vérifier aussi. Si l'outil est inaccessible, les joueurs passent leur tour sans pénalité."), rows,
      h("button", { class: "sec", onclick: function () { st = {}; save(); draw(); } }, "Tout effacer"), h("p", {}, h("a", { href: "#/tour" }, "← Tour de contrôle")));
  }
  /* ---------- Simulation joueur (enseignant) : même écran que les joueurs, partie privée, aucune table réelle ---------- */
  function projPage() {
    var g = LSget(GK);
    if (!g) return mount(h("h1", {}, "Vue projetée"), h("div", { class: "warn" }, "Aucune partie en cours sur ce navigateur. Ouvrez la tour de contrôle, puis cliquez sur « Vue projetée »."), h("p", {}, h("a", { href: "#/tour" }, "← Tour de contrôle")));
    run(g, false, true);
  }
  function simuPage() {
    var p = q(), code = "SIM" + Math.random().toString(36).slice(2, 6).toUpperCase(), k0 = D.jeux[p.j] ? p.j : "1", G = C.newGame({ code: code, jeux: [k0] }), net = null, dirty = true, link = {}, dead = false;
    C.start(G, Date.now());
    function now() { return Date.now(); }
    function push() { Object.keys(G.players).forEach(function (s) { var m = C.snapshot(G, s, now()); if (m && net) net.send(s, m); }); }
    function onmsg(m) {
      if (!m || !m.sid) return; var t = now(), sid = m.sid;
      if (m.t === "join") { var r = C.join(G, { sid: sid, nom: m.nom, table: m.table }, t); if (!r.ok) { if (net) net.send(sid, { t: "err", msg: r.err }); return; } if (r.player.sid !== sid) { link[sid] = r.player.sid; if (net) net.bind(r.player.sid, sid); } if (net) net.send(sid, C.snapshot(G, r.player.sid, t)); dirty = true; return; }
      var real = link[sid] || sid, pl = G.players[real]; if (!pl) return; pl.last = t;
      if (m.t === "leave") { C.leave(G, real, true); dirty = true; return; }
      C.act(G, real, m, t); if (net) net.send(sid, C.snapshot(G, real, t)); dirty = true;
    }
    net = hostNet(code, onmsg, function () {}, true);
    var flush = setInterval(function () { if (dead) return; C.tick(G, now()); if (dirty) { push(); dirty = false; } else if (Math.floor(now() / 1000) % 5 === 0) push(); }, 1000);
    onLeave(function () { dead = true; clearInterval(flush); if (net) net.close(); });
    var me = { sid: rid(), nom: "Enseignant", table: "T1", code: code, local: true };
    MK = "j-me-simu"; play(me);
    var sel = h("select", { style: "max-width:360px" }, Object.keys(D.jeux).sort(function (a, b) { return a - b; }).map(function (k) { var o = h("option", { value: k }, k + " · " + D.jeux[k].titre); if (k === k0) o.selected = true; return o; }));
    var cor = h("div", {}), shown = false;
    var bar = h("div", { class: "card", style: "background:#FFF6E0;border:2px solid #E9A400" }, h("b", {}, "Simulation joueur (enseignant)"), h("p", { class: "meta" }, "Vous voyez l'écran exact des joueurs, sur une table privée : rien n'est envoyé aux étudiants, rien n'est compté dans la partie. Les cases à effet (Aléa, Outil, Piège, Duel, Relecture) se jouent comme en vrai ; un duel sans adversaire se joue contre la tour."),
      h("div", {}, sel, " ", h("button", { onclick: function () { C.setJeu(G, sel.value, now()); dirty = true; if (shown) showCor(); } }, "Ouvrir ce JEU"), " ", h("button", { class: "sec", onclick: function () { shown = !shown; if (shown) showCor(); else cor.innerHTML = ""; } }, "Afficher / masquer le corrigé")), cor);
    function showCor() { cor.innerHTML = ""; var J = D.jeux[sel.value], cs = J.cartes.filter(function (c) { return !c.extra; }); cor.appendChild(h("p", { class: "meta" }, "Corrigé du JEU " + sel.value + " : à ne pas projeter.")); cs.forEach(function (c, i) { cor.appendChild(h("p", { class: "meta" }, "Carte " + (i + 1) + " / " + cs.length)); cor.appendChild(answerEl(c)); }); }
    sel.addEventListener("change", function () { if (shown) showCor(); });
    var root = document.getElementById("app"); root.insertBefore(bar, root.firstChild);
  }
  window.J51 = { route: function (a) { if (a === "simu") return simuPage(); if (a === "outils-test") return towerGate(toolsTestPage); if (a === "tour") return towerGate(); if (a === "projection") return towerGate(projPage); if (a === "test") return towerGate(testPage); return joinPage(); } };
  var hs = location.hash || ""; if (/^#\/(j|tour|projection|test|outils-test|simu)(\?|\/|$)/.test(hs)) window.dispatchEvent(new Event("hashchange"));
})();
