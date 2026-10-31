/* © 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. */
(function () {
  "use strict";
  var D = window.DATA, E = window.Engine, app = document.getElementById("app");
  var BASE = location.origin + location.pathname;
  var timers = [];
  function clearTimers() { timers.forEach(clearInterval); timers = []; }
  function Sess_off() { if (window.__sess) window.__sess.onchange = null; }
  function h(tag, attrs) {
    var e = document.createElement(tag); attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (attrs[k] === null || attrs[k] === undefined || attrs[k] === false) return;
      if (k === "class") e.className = attrs[k]; else if (k === "style") e.setAttribute("style", attrs[k]);
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), attrs[k]); else if (k === "html") e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]);
    });
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i]; if (c === null || c === undefined || c === false) continue;
      if (Array.isArray(c)) c.forEach(function (x) { if (x) e.appendChild(typeof x === "string" ? document.createTextNode(x) : x); });
      else e.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return e;
  }
  /* Numérotation séquentielle : les identifiants internes (liens, QR) ne changent pas ; seul l'affichage est renuméroté dans l'ordre du PowerPoint. */
  var LAB = (typeof D !== "undefined" && D.labels) || {}, done = typeof WeakSet !== "undefined" ? new WeakSet() : null;
  function relabel(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n, l = []; while ((n = w.nextNode())) l.push(n);
    l.forEach(function (t) { if (done && done.has(t)) return; if (done) done.add(t); var v = t.nodeValue.replace(/\bEX ?(\d+b?)\b/g, function (m, k) { var x = LAB["EX" + k]; return x ? (m.charAt(2) === " " ? "EX " + x.slice(2) : x) : m; }); if (v !== t.nodeValue) t.nodeValue = v; });
  }
  if (typeof MutationObserver !== "undefined") new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(function (x) { if (x.nodeType === 3) { var p = x.parentNode; if (p) relabel(p); } else if (x.nodeType === 1) relabel(x); }); }); }).observe(app, { childList: true, subtree: true });
  function mount() { clearTimers(); app.innerHTML = ""; for (var i = 0; i < arguments.length; i++) if (arguments[i]) app.appendChild(arguments[i]); window.scrollTo(0, 0); }
  function fmt(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  function teamChip(t) { return h("span", { class: "team", style: "background:" + t.color.hex }, t.name + (t.score !== undefined ? " · " + t.score : "")); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- Accueil ---------- */
  function home() {
    var ex = Object.keys(D.exo), nums = function (a, b) { return parseInt(a.replace(/\D/g, ""), 10) - parseInt(b.replace(/\D/g, ""), 10); };
    var EX = ex.filter(function (i) { return i.indexOf("EX") === 0; }).sort(nums), F = ex.filter(function (i) { return i.charAt(0) === "F"; }).sort(nums);
    var bar0 = h("div", {}); Sess.onchange = function () { bar0.innerHTML = ""; bar0.appendChild(sessionBar()); }; Sess.onchange(); Sess.connect();
    mount(h("h1", {}, "Communication professionnelle : exercices, quiz et jeux"), bar0,
      h("p", { class: "meta" }, "Scannez le QR code de la diapositive, ou choisissez ci-dessous. Cas fictif : TransLor."),
      h("p", { class: "meta" }, "Les activités sont rangées dans l'ordre du PowerPoint (la page du support est indiquée sur chaque carte). ", h("a", { href: "#/animateur" }, "Fiche animateur")),
      h("div", { class: "grid" }, (D.parcours || []).map(function (p) {
        if (p.t === "module") return h("h2", { style: "grid-column:1/-1;margin:14px 0 0" }, p.titre);
        var tile = function (cls, href, b, m) { return h("a", { class: "tile " + cls, href: href }, h("b", {}, b), h("div", { class: "meta" }, m + (p.page ? "  ·  page " + p.page : ""))); };
        if (p.t === "ex") { var e = D.exo[p.id]; return tile(p.id.charAt(0) === "F" ? "f" : "", (p.id.charAt(0) === "F" ? "#/f/" : "#/ex/") + p.id, p.id.replace(/^(EX|F)(\d)/, "$1 $2"), e.titre); }
        if (p.t === "seance") return tile("g", "#/plateau/regles", p.titre, "Règles et plateau de la séance");
        if (p.t === "jeu5") return tile("g", "#/j", p.titre, "Plateau 5 : rejoindre la partie (joueur)");
        if (p.t === "jeu") { var nm = p.route === "jeu20" ? ["Jeu 20 · Quiz Chercher, évaluer, argumenter", D.quiz.length + " questions, équipes sur téléphone"] : p.route === "jeu21" ? ["Jeu 21 · Mardi 6 h 50", "Communication de crise, 5 injects"] : ["Quiz final", "10 questions, individuel"]; return tile("g", "#/" + p.route, nm[0], nm[1]); }
        var pg = { outils: ["Boîte à outils", "Sites, modèles à copier, calculettes"], dossier: ["Dossier d'état de l'art", "Modèle PowerPoint à remplir au fil des exercices"], sujets: ["Sujets de l'état de l'art", D.sujets.length + " questions de départ"] }[p.route];
        return tile("", "#/" + p.route, pg[0], pg[1]);
      })),
      h("h2", {}, "Hors parcours"),
      h("div", { class: "grid" }, h("a", { class: "tile g", href: "#/plateau" }, h("b", {}, "Plateau 5 · règles et jeux"), h("div", { class: "meta" }, "Règles, 16 jeux, cases à effet")), h("a", { class: "tile g", href: "#/jeu21" }, h("b", {}, "Jeu 21 · Mardi 6 h 50"), h("div", { class: "meta" }, "Communication de crise, 5 injects"))),
      h("h2", {}, "Annexe : communication générale (hors temps de cours)"),
      h("div", { class: "grid" }, (D.annexe || []).map(function (i) { return h("a", { class: "tile f", href: "#/ex/" + i }, h("b", {}, i.replace("AX", "Annexe X ").replace("AF", "Annexe F ")), h("div", { class: "meta" }, D.exo[i].titre)); })));
  }

  /* ---------- Session : réponses individuelles ---------- */
  function LSget(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function LSset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var Sess = window.__sess = {
    peer: null, conn: null, ok: false, unlocked: [], claims: {}, claimMsg: "", onchange: null, retry: null,
    info: function () { return LSget("sess"); },
    answers: function () { return LSget("rep") || {}; },
    get: function (ex) { return this.answers()[ex] || { a: [], done: false, ts: 0 }; },
    save: function (ex, o) { var r = this.answers(); o.ts = Date.now(); r[ex] = o; LSset("rep", r); this.send(ex); },
    notify: function () { if (this.onchange) this.onchange(); },
    join: function (salle, nom) {
      var i = this.info() || {}; LSset("sess", { salle: salle.toUpperCase(), nom: nom, sid: i.sid || ("s" + Math.random().toString(36).slice(2, 9)) });
      this.close(); this.connect();
    },
    leave: function () { this.close(); try { localStorage.removeItem("sess"); } catch (e) {} this.notify(); },
    close: function () { clearTimeout(this.retry); try { if (this.peer) this.peer.destroy(); } catch (e) {} this.peer = null; this.conn = null; this.ok = false; },
    connect: function () {
      var self = this, i = this.info(); if (!i || this.peer || typeof Peer === "undefined") return;
      var again = function (ms) { self.ok = false; self.notify(); try { if (self.peer) self.peer.destroy(); } catch (e) {} self.peer = null; self.conn = null; clearTimeout(self.retry); self.retry = setTimeout(function () { self.connect(); }, ms); };
      try {
        this.peer = new Peer();
        this.peer.on("open", function () {
          var c = self.peer.connect("cpro-s-" + i.salle, { reliable: true }); self.conn = c;
          c.on("open", function () { self.ok = true; c.send({ t: "hello", sid: i.sid, nom: i.nom, rep: self.answers() }); self.notify(); });
          c.on("data", function (m) {
            if (m.t === "unlock") { self.unlocked = m.list || []; self.notify(); }
            else if (m.t === "claims") { self.claims = m.claims || {}; self.notify(); }
            else if (m.t === "claimres") { if (m.ok) LSset("sujet", m.sujet); self.claimMsg = m.ok ? "" : (m.reason === "pris" ? "Trop tard : ce sujet est déjà pris par " + m.par + "." : "Vous avez déjà choisi un sujet (" + m.mine + "). Un seul choix est possible."); self.notify(); }
          });
          c.on("close", function () { again(4000); }); c.on("error", function () { again(6000); });
        });
        this.peer.on("error", function () { again(8000); }); this.peer.on("disconnected", function () { again(6000); });
      } catch (e) { again(8000); }
    },
    claim: function (sujet) {
      var i = this.info(); this.claimMsg = "";
      if (!i || !this.ok) { this.claimMsg = "Pas connecté à la session : choix impossible. Rejoignez la session du cours pour que le premier arrivé soit servi."; this.notify(); return; }
      try { this.conn.send({ t: "claim", sid: i.sid, nom: i.nom, sujet: sujet }); } catch (e) {}
    },
    send: function (ex) {
      var i = this.info(); if (!i || !this.ok) return; var o = this.get(ex);
      try { this.conn.send({ t: "ans", sid: i.sid, nom: i.nom, ex: ex, a: o.a, done: o.done, ts: o.ts }); } catch (e) {}
    },
    status: function () { var i = this.info(); if (!i) return null; return this.ok ? "Connecté à la session " + i.salle + " (" + i.nom + ")" : "Session " + i.salle + " : hors ligne, vos réponses restent enregistrées sur ce téléphone et seront renvoyées."; }
  };
  function sessionBar() {
    var i = Sess.info();
    if (!i) return h("p", { class: "warn" }, "Pas de session : vos réponses restent sur ce téléphone. ", h("a", { href: "#/session" }, "Rejoindre la session du cours"));
    return h("p", { class: Sess.ok ? "meta" : "warn" }, Sess.status());
  }
  function sessionPage() {
    var p = params(), i = Sess.info() || {};
    var code = h("input", { placeholder: "Code de la session", maxlength: 8, style: "text-transform:uppercase" }); code.value = (p.c || i.salle || "").toUpperCase();
    var nm = h("input", { placeholder: "Votre prénom (ou prénom + initiale)", maxlength: 24 }); nm.value = i.nom || "";
    var msg = h("p", { class: "warn", style: "display:none" });
    mount(h("h1", {}, "Rejoindre la session du cours"),
      h("div", { class: "card" }, h("p", {}, "Saisissez le code affiché par l'enseignant et votre prénom. Vos réponses aux exercices lui seront visibles pendant le cours."), code, h("br"), nm,
        h("button", { onclick: function () { if (!code.value.trim() || !nm.value.trim()) { msg.style.display = "block"; msg.textContent = "Saisissez le code et votre prénom."; return; } Sess.join(code.value.trim(), nm.value.trim()); location.hash = "#/"; } }, "Rejoindre"),
        i.salle ? h("button", { class: "sec", onclick: function () { Sess.leave(); location.hash = "#/"; } }, "Quitter la session") : null), msg,
      h("p", { class: "meta" }, "Vos réponses sont enregistrées sur ce téléphone et transmises directement à l'enseignant, sans serveur de stockage."));
  }

  /* ---------- Exercice ---------- */
  function lines(arr) { return (Array.isArray(arr) ? arr : [arr]).map(function (t) { return h("p", { class: "pre" }, t); }); }
  function exercise(id) {
    var e = D.exo[id]; if (!e) return notFound();
    var left = e.duree * 60, run = null, disp = h("div", { class: "timer" }, fmt(left));
    var bt = h("button", { onclick: function () {
      if (run) { clearInterval(run); run = null; bt.textContent = "Reprendre"; return; }
      bt.textContent = "Pause"; run = setInterval(function () { left--; disp.textContent = fmt(left); if (left <= 0) { clearInterval(run); run = null; disp.textContent = "0:00"; bt.textContent = "Terminé"; try { navigator.vibrate && navigator.vibrate(300); } catch (x) {} } }, 1000); timers.push(run);
    } }, "Démarrer le minuteur");
    var reset = h("button", { class: "sec", onclick: function () { if (run) clearInterval(run); run = null; left = e.duree * 60; disp.textContent = fmt(left); bt.textContent = "Démarrer le minuteur"; } }, "Remise à zéro");
    var state = Sess.get(id), fields = [], saved = h("p", { class: "meta" }), tmr = null;
    function flush() { state.a = fields.map(function (f) { return f.value; }); Sess.save(id, state); saved.textContent = Sess.ok ? "Enregistré et envoyé à l'enseignant." : "Enregistré sur ce téléphone."; }
    function setAnswer(i, txt) { if (fields[i]) { fields[i].value = txt; flush(); } }
    function makeField(i) {
      var ty = e.types && e.types[i], opts = ty === "vf" ? ["VRAI", "FAUX"] : ty === "on" ? ["OUI", "NON"] : Array.isArray(ty) ? ty : null, f;
      if (opts) {
        f = { value: state.a[i] || "" }; var bs = [];
        var paint = function () { bs.forEach(function (b) { b.className = "choice" + (b.getAttribute("data-v") === f.value ? " on" : ""); }); };
        opts.forEach(function (o) { var b = h("button", { class: "choice", "data-v": o, type: "button", onclick: function () { f.value = f.value === o ? "" : o; paint(); flush(); } }, o); bs.push(b); });
        paint(); f.el = h("div", { class: "choices" }, bs); return f;
      }
      if (ty === "toulmin6") {
        var LAB = ["Affirmation (ce que je défends)", "Données (faits, chiffres, sources)", "Garantie (le lien logique)", "Fondement (ce qui soutient la garantie)", "Réfutation (l'objection prévue)", "Qualificatif (probablement, dans la plupart des cas…)"], tas = [], parts0 = (state.a[i] || "").split("\n§\n");
        f = { value: state.a[i] || "" };
        var upd = function () { f.value = tas.map(function (t, k) { return t.value; }).join("\n§\n"); clearTimeout(tmr); tmr = setTimeout(flush, 500); };
        f.el = h("div", { class: "card" }, LAB.map(function (l, k) { var t = h("textarea", { placeholder: l, rows: 2 }); t.value = parts0[k] || ""; t.addEventListener("input", upd); tas.push(t); return h("div", {}, h("label", { class: "meta" }, (k + 1) + ". " + l), t); }));
        return f;
      }
      if (ty === "num") { f = h("input", { type: "text", inputmode: "decimal", pattern: "[0-9]*[.,]?[0-9]*", placeholder: "Un nombre", class: "num" }); f.value = state.a[i] || ""; f.addEventListener("input", function () { clearTimeout(tmr); tmr = setTimeout(flush, 500); }); f.el = f; return f; }
      f = h("textarea", { placeholder: "Votre réponse à la tâche " + (i + 1) }); f.value = state.a[i] || ""; f.addEventListener("input", function () { clearTimeout(tmr); tmr = setTimeout(flush, 500); }); f.el = f; return f;
    }
    var ansBox = h("div", { class: "card" }, h("h2", {}, "Mes réponses"),
      e.taches.map(function (t, i) { var f = makeField(i); fields.push(f); return h("div", {}, h("label", { class: "meta" }, (i + 1) + ". " + t), f.el); }), saved);
    var doneBtn = h("button", { class: "ok" }, state.done ? "Marqué comme terminé (annuler)" : "J'ai terminé");
    doneBtn.addEventListener("click", function () { state.done = !state.done; flush(); doneBtn.textContent = state.done ? "Marqué comme terminé (annuler)" : "J'ai terminé"; });
    var corrBox = h("div", {}), cb = h("button", { class: "ok" }, "Afficher la correction"), lock = h("p", { class: "meta" });
    function refreshLock() {
      var needs = !!Sess.info() && Sess.unlocked.indexOf(id) < 0, shown = !!corrBox.firstChild;
      cb.disabled = needs && !shown ? true : false; if (cb.disabled) cb.setAttribute("disabled", "disabled"); else cb.removeAttribute("disabled");
      lock.textContent = needs && !shown ? "La correction sera ouverte par l'enseignant à la restitution." : "";
    }
    cb.addEventListener("click", function () {
      if (corrBox.firstChild) { corrBox.innerHTML = ""; cb.textContent = "Afficher la correction"; refreshLock(); return; }
      corrBox.appendChild(correction(e)); cb.textContent = "Masquer la correction";
    });
    var bar = h("div", {}); function drawBar() { bar.innerHTML = ""; bar.appendChild(sessionBar()); refreshLock(); }
    Sess.onchange = drawBar; drawBar(); Sess.connect();
    var roleBox = h("div", {});
    var parts = [bar, h("p", { class: "meta" }, h("span", { class: "badge" }, id.replace("EX", "EX ").replace("F", "F ")), e.mode + " · " + e.duree + " min · " + e.chap), h("h1", {}, e.titre),
      h("div", { class: "card" }, h("h2", {}, "Mise en situation"), lines(e.situation), e.tableau ? h("table", {}, h("tr", {}, e.tableau.header.map(function (x) { return h("th", {}, x); })), e.tableau.rows.map(function (r) { return h("tr", {}, r.map(function (x) { return h("td", {}, x); })); })) : null),
      h("div", { class: "card" }, h("h2", {}, "À faire"), h("ol", {}, e.taches.map(function (t) { return h("li", {}, t); }))),
      e.livrable ? h("p", { class: "warn" }, "Livrable : " + e.livrable) : null,
      h("div", { class: "card" }, disp, bt, reset)];
    if (e.fiche_role) parts.push(h("div", { class: "card" }, h("p", { class: "meta" }, "Réservé au joueur qui tient le rôle de Marc."),
      h("button", { class: "sec", onclick: function () { roleBox.innerHTML = ""; roleBox.appendChild(h("div", { class: "corr pre" }, e.fiche_role)); } }, "Afficher la fiche de rôle"), roleBox));
    if (id === "EX2") parts.push(styleWidget(setAnswer));
    parts.push(ansBox, h("div", {}, doneBtn), h("div", {}, cb, lock, corrBox));
    mount.apply(null, parts);
  }
  function correction(e) {
    var c = e.corr; if (!c) return h("p", {}, "Pas de correction pour cet exit ticket.");
    var cols = c.cols || ["Question", "Réponse"];
    var out = [h("div", { class: "corr" }, h("h2", {}, "Méthode"), h("ol", {}, c.methode.map(function (m) { return h("li", {}, m); })),
      h("table", {}, h("tr", {}, cols.map(function (x) { return h("th", {}, x); })), c.rows.map(function (r) { return h("tr", {}, r.map(function (x) { return h("td", { class: "pre" }, x); })); })))];
    if (c.erreurs) out.push(h("div", { class: "corr" }, h("h2", {}, "Erreurs fréquentes"), h("ul", {}, c.erreurs.map(function (m) { return h("li", {}, m); }))));
    if (c.modele) out.push(h("div", { class: "corr" }, h("h2", {}, c.modele_titre || "Exemple modèle"), lines(c.modele), c.retenir ? h("p", { class: "warn" }, "À retenir : " + c.retenir) : null));
    return h("div", {}, out);
  }
  function styleWidget(setAnswer) {
    var qs = ["Je dis franchement ce que je pense, même si cela peut déplaire.", "En réunion, je donne mon avis en premier.", "Je préfère une réponse courte et claire.", "Quand je ne suis pas d'accord, je le dis tout de suite.",
      "Avant de parler d'un problème, je prends des nouvelles de la personne.", "Je repère vite l'ambiance d'une équipe.", "Je préfère régler un désaccord à l'oral.", "J'explique le contexte, pas seulement la consigne."];
    var sel = qs.map(function () { var s = h("select", {}, [1, 2, 3, 4].map(function (n) { return h("option", { value: n }, String(n)); })); s.value = "2"; return s; });
    var res = h("div", {});
    var PROF = { "Décideur": ["Direct + Tâche", "Clarté, rapidité", "Paraît brusque, oublie le contexte", "Ajouter une phrase de contexte"],
      "Animateur": ["Direct + Relation", "Énergie, lien avec les autres", "Dilue le message dans l'ambiance", "Finir par une demande précise"],
      "Analyste": ["Nuancé + Tâche", "Rigueur, précision", "Trop long, décision retardée", "Donner la conclusion d'abord"],
      "Facilitateur": ["Nuancé + Relation", "Écoute, consensus", "Évite le désaccord nécessaire", "Oser dire non avec une alternative"] };
    var calc = h("button", { onclick: function () {
      var v = sel.map(function (s) { return parseInt(s.value, 10); }), A = v[0] + v[1] + v[2] + v[3], B = v[4] + v[5] + v[6] + v[7];
      var dir = A >= 11, rel = B >= 11, p = dir ? (rel ? "Animateur" : "Décideur") : (rel ? "Facilitateur" : "Analyste"), x = PROF[p]; store("profil", p); if (setAnswer) { setAnswer(0, "A = " + A + " ; B = " + B); setAnswer(1, "Direct si A ≥ 11, Relation si B ≥ 11 : " + (dir ? "Direct" : "Nuancé") + " + " + (rel ? "Relation" : "Tâche")); setAnswer(2, "Profil : " + p); }
      res.innerHTML = ""; res.appendChild(h("div", { class: "corr" }, h("h2", {}, "Votre profil : " + p + " (" + x[0] + ")"),
        h("p", {}, "Axe A, façon de s'exprimer : " + A + " / 16 → " + (dir ? "Direct (11 et plus)" : "Nuancé (10 et moins)")),
        h("p", {}, "Axe B, centre d'attention : " + B + " / 16 → " + (rel ? "Relation (11 et plus)" : "Tâche (10 et moins)")),
        h("p", {}, h("b", {}, "Force : "), x[1]), h("p", {}, h("b", {}, "Risque en entreprise : "), x[2]), h("p", {}, h("b", {}, "Conseil : "), x[3]),
        h("p", { class: "meta" }, "Modèle pédagogique simplifié : aucun profil n'est meilleur ; l'enjeu est l'écart avec la personne en face.")));
    } }, "Calculer mon profil");
    return h("div", { class: "card" }, h("h2", {}, "Calculateur de profil (1 = pas du tout d'accord, 4 = tout à fait)"),
      qs.map(function (q, i) { return h("div", {}, h("label", {}, (i + 1) + ". " + q), sel[i]); }), calc, res);
  }

  /* ---------- Enseignant : adresse récapitulative (#/prof) ---------- */
  var ORDRE = (D.ordre || []).concat(D.annexe || []);
  function exOrder() { return ORDRE.filter(function (i) { return D.exo[i]; }); }
  function profPage() {
    var P = LSget("prof") || { salle: "", data: {}, unlocked: [] }, peer = null, online = {}, root = h("div", {}), content = h("div", {}), view = "avancement", sel = "", follow = true, big = false, dirty = false;
    function persist() { LSset("prof", P); }
    function mergeRep(sid, nom, rep) {
      var s = P.data[sid] = P.data[sid] || { nom: nom, rep: {} }; s.nom = nom || s.nom;
      Object.keys(rep || {}).forEach(function (ex) { var o = rep[ex]; if (!s.rep[ex] || (o.ts || 0) >= (s.rep[ex].ts || 0)) s.rep[ex] = { a: o.a || [], done: !!o.done, ts: o.ts || 0 }; });
    }
    P.claims = P.claims || {};
    function broadcastClaims() { Object.keys(online).forEach(function (sid) { try { online[sid].send({ t: "claims", claims: P.claims }); } catch (e) {} }); }
    function broadcastUnlock() { Object.keys(online).forEach(function (sid) { try { online[sid].send({ t: "unlock", list: P.unlocked }); } catch (e) {} }); }
    function open(code) {
      P.salle = code; persist(); if (peer) { try { peer.destroy(); } catch (e) {} }
      peer = new Peer("cpro-s-" + code);
      peer.on("error", function (err) { status.textContent = err.type === "unavailable-id" ? "Ce code est déjà utilisé (une autre page enseignant est ouverte ?). Changez de code." : "Erreur réseau : " + err.type; });
      peer.on("open", function () { status.textContent = "Session ouverte : les étudiants peuvent se connecter."; });
      peer.on("connection", function (c) {
        var sid = null;
        c.on("data", function (m) {
          if (m.t === "hello") { sid = m.sid; online[sid] = c; mergeRep(sid, m.nom, m.rep); c.send({ t: "unlock", list: P.unlocked }); c.send({ t: "claims", claims: P.claims }); }
          else if (m.t === "claim") { sid = m.sid; online[sid] = c; var r0 = E.claim(P.claims, m.sid, m.nom, m.sujet); c.send({ t: "claimres", ok: r0.ok, reason: r0.reason, sujet: m.sujet, par: r0.par, mine: r0.mine }); if (r0.ok) broadcastClaims(); }
          else if (m.t === "ans") { sid = m.sid; online[sid] = c; var r = {}; r[m.ex] = { a: m.a, done: m.done, ts: m.ts }; mergeRep(sid, m.nom, r); P.last = m.ex; }
          persist(); dirty = true;
        });
        c.on("close", function () { if (sid && online[sid] === c) delete online[sid]; dirty = true; });
      });
    }
    var status = h("p", { class: "meta" }, "");
    var code = h("input", { placeholder: "Code de la session (ex. COM1)", maxlength: 8, style: "text-transform:uppercase;max-width:260px" }); code.value = P.salle || newCode();
    var head = h("div", { class: "card" }, h("h2", {}, "Session du cours"), h("p", { class: "meta" }, h("a", { href: "#/animateur" }, "Fiche animateur : conduire la séance")), code,
      h("button", { class: "ok", onclick: function () { if (code.value.trim()) { open(code.value.trim().toUpperCase()); drawHead(); } } }, "Ouvrir la session"), status);
    var qrBox = h("div", {});
    function drawHead() {
      qrBox.innerHTML = ""; if (!P.salle) return;
      var url = BASE + "#/session?c=" + P.salle;
      qrBox.appendChild(h("div", { class: "card" }, h("p", {}, "Code à communiquer : "), h("div", { class: "code" }, P.salle),
        h("img", { src: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(url), width: 200, height: 200, alt: "QR de la session" }),
        h("p", { class: "meta" }, "Les étudiants scannent ce QR (ou saisissent le code) une fois ; ils gardent leur identité pendant tout le cours. Gardez cette page ouverte.")));
    }
    var bar = h("div", { class: "card" });
    function tabs() {
      bar.innerHTML = "";
      [["avancement", "Avancement"], ["exercice", "Réponses d'un exercice"], ["sujets", "Sujets choisis"]].forEach(function (t) { bar.appendChild(h("button", { class: view === t[0] ? "" : "sec", onclick: function () { view = t[0]; tabs(); draw(); } }, t[1])); });
      var s = h("select", { style: "max-width:380px;display:inline-block" }, [h("option", { value: "" }, "Choisir un exercice")].concat(exOrder().map(function (i) { return h("option", { value: i }, i + " · " + D.exo[i].titre.slice(0, 50)); })));
      s.value = sel; s.addEventListener("change", function () { sel = s.value; follow = false; view = "exercice"; tabs(); draw(); });
      var fl = h("input", { type: "checkbox", style: "width:auto" }); fl.checked = follow; fl.addEventListener("change", function () { follow = fl.checked; draw(); });
      var bg = h("input", { type: "checkbox", style: "width:auto" }); bg.checked = big; bg.addEventListener("change", function () { big = bg.checked; content.style.fontSize = big ? "22px" : ""; });
      bar.appendChild(h("div", {}, s, " ", h("label", {}, fl, " Suivre le dernier exercice"), " ", h("label", {}, bg, " Grand texte (projection)")));
      bar.appendChild(h("div", {}, h("button", { class: "sec", onclick: exportCsv }, "Exporter en CSV"),
        h("button", { class: "sec", onclick: function () { if (confirm("Effacer toutes les réponses de la session ?")) { P.data = {}; P.unlocked = []; persist(); broadcastUnlock(); draw(); } } }, "Effacer les réponses")));
    }
    function status3(r, ex) { var o = r && r.rep[ex]; if (!o) return 0; if (o.done) return 2; return o.a.some(function (x) { return x && x.trim(); }) ? 1 : 0; }
    function draw() {
      dirty = false; content.innerHTML = "";
      var sids = Object.keys(P.data).sort(function (a, b) { return P.data[a].nom.localeCompare(P.data[b].nom); });
      content.appendChild(h("p", { class: "meta" }, sids.length + " étudiant(s) connus · " + Object.keys(online).length + " en ligne"));
      if (view === "avancement") {
        var cols = exOrder(), tb = h("table", {}, h("tr", {}, [h("th", {}, "Étudiant")].concat(cols.map(function (c) { return h("th", { title: D.exo[c].titre, style: "padding:4px;font-size:12px" }, c.replace("EX", "").replace("F", "F")); }))));
        sids.forEach(function (sid) {
          var r = P.data[sid];
          tb.appendChild(h("tr", {}, [h("td", {}, (online[sid] ? "● " : "○ ") + r.nom)].concat(cols.map(function (c) {
            var s = status3(r, c); return h("td", { style: "text-align:center;background:" + ["#fff", "#FFE9A8", "#BFE8D0"][s], title: ["vide", "en cours", "terminé"][s] }, ["", "…", "✓"][s]); }))));
        });
        content.appendChild(tb); content.appendChild(h("p", { class: "meta" }, "● en ligne · ○ hors ligne ; … en cours, ✓ terminé. Colonnes F0 à F9 = flashs, 1 à 24 = EX."));
      } else if (view === "sujets") {
        var ks = Object.keys(P.claims);
        content.appendChild(h("div", { class: "card" }, h("h2", {}, "Sujets choisis (premier arrivé, premier servi)"), ks.length ? null : h("p", { class: "meta" }, "Aucun sujet choisi pour l'instant."),
          D.sujets.map(function (s, i) { var c = P.claims[s[0]]; return h("p", {}, (i + 1) + ". " + s[0] + " — ", c ? h("b", {}, c.nom) : h("span", { class: "meta" }, "libre"), " ",
            c ? h("button", { class: "sec", onclick: function () { E.release(P.claims, s[0]); persist(); broadcastClaims(); draw(); } }, "Libérer") : null); }),
          h("button", { class: "sec", onclick: function () { if (confirm("Libérer tous les sujets ?")) { P.claims = {}; persist(); broadcastClaims(); draw(); } } }, "Libérer tous les sujets")));
      } else {
        var ex = follow && P.last ? P.last : sel; if (!ex || !D.exo[ex]) { content.appendChild(h("p", { class: "warn" }, "Choisissez un exercice dans la liste.")); return; }
        var e = D.exo[ex], unl = P.unlocked.indexOf(ex) >= 0, rep = sids.filter(function (s) { return status3(P.data[s], ex) > 0; }).length;
        content.appendChild(h("div", { class: "card" }, h("h2", {}, ex + " · " + e.titre), h("p", {}, rep + " / " + sids.length + " ont répondu · " + sids.filter(function (s) { return status3(P.data[s], ex) === 2; }).length + " terminé(s)"),
          h("button", { class: unl ? "sec" : "ok", onclick: function () { var i = P.unlocked.indexOf(ex); if (i >= 0) P.unlocked.splice(i, 1); else P.unlocked.push(ex); persist(); broadcastUnlock(); draw(); } }, unl ? "Fermer la correction aux étudiants" : "Ouvrir la correction aux étudiants")));
        var fmt = function (v) { v = String(v || ""); return /\n§\n/.test(v) ? v.split("\n§\n").map(function (x, k) { return ["Affirmation", "Données", "Garantie", "Fondement", "Réfutation", "Qualificatif"][k] + " : " + x; }).join("\n") : v; };
        content.appendChild(h("div", { class: "card" }, h("b", {}, "Consignes"), e.taches.map(function (t, i) { return h("div", { class: "meta" }, (i + 1) + ". " + t); })));
        var tb2 = h("table", {}, h("tr", {}, [h("th", {}, "Étudiant")].concat(e.taches.map(function (t, i) { return h("th", { title: t }, String(i + 1)); })).concat([h("th", {}, "État")])));
        sids.forEach(function (sid) {
          var o = P.data[sid].rep[ex]; if (!o) return;
          tb2.appendChild(h("tr", {}, [h("td", {}, (online[sid] ? "● " : "○ ") + P.data[sid].nom)].concat(e.taches.map(function (t, i) { return h("td", { class: "pre", style: "white-space:pre-wrap" }, fmt(o.a[i])); })).concat([h("td", { style: "text-align:center" }, o.done ? "✓" : "…")])));
        });
        content.appendChild(tb2);
      }
    }
    function exportCsv() {
      var q = function (x) { return '"' + String(x || "").replace(/"/g, '""') + '"'; }, rows = [["étudiant", "exercice", "tâche", "réponse", "terminé"].map(q).join(";")];
      Object.keys(P.data).forEach(function (sid) { var r = P.data[sid]; Object.keys(r.rep).forEach(function (ex) { r.rep[ex].a.forEach(function (a, i) { if (a && a.trim()) rows.push([r.nom, ex, i + 1, a, r.rep[ex].done ? "oui" : "non"].map(q).join(";")); }); }); });
      var b = new Blob(["﻿" + rows.join("\n")], { type: "text/csv;charset=utf-8" }), a = h("a", { href: URL.createObjectURL(b), download: "reponses-" + (P.salle || "session") + ".csv" }); document.body.appendChild(a); a.click(); a.remove();
    }
    root.appendChild(h("h1", {}, "Tableau de bord enseignant")); root.appendChild(head); root.appendChild(qrBox); root.appendChild(bar); root.appendChild(content);
    mount(root); tabs(); drawHead(); draw(); if (P.salle) open(P.salle);
    timers.push(setInterval(function () { if (dirty) draw(); }, 700));
  }

  /* ---------- Jeux : entrée ---------- */
  function params() { var q = (location.hash.split("?")[1] || ""), o = {}; q.split("&").forEach(function (p) { var a = p.split("="); if (a[0]) o[a[0]] = decodeURIComponent(a[1] || ""); }); return o; }
  function gameEntry(mode) {
    var name = mode === "quiz" ? "Jeu 20 · Quiz Chercher, évaluer, argumenter" : "Jeu 21 · Mardi 6 h 50", p = params();
    var code = h("input", { placeholder: "Code à 4 caractères", maxlength: 4, style: "text-transform:uppercase" }); code.value = (p.c || "").toUpperCase();
    var nm = h("input", { placeholder: "Nom de l'équipe", maxlength: 24 }); nm.value = store("nom-equipe") || "";
    var nq = h("select", {}, [10, 20, 30, 54].map(function (n) { return h("option", { value: n }, n + " questions"); })); nq.value = "20";
    var msg = h("p", { class: "warn", style: "display:none" });
    mount(h("h1", {}, name),
      h("div", { class: "card" }, h("h2", {}, "Je suis une équipe"), code, h("br"), nm,
        h("button", { onclick: function () { if (!code.value.trim() || !nm.value.trim()) { msg.style.display = "block"; msg.textContent = "Saisissez le code et le nom de l'équipe."; return; } store("nom-equipe", nm.value); teamJoin(mode, code.value.trim().toUpperCase(), nm.value.trim()); } }, "Rejoindre")),
      h("div", { class: "card" }, h("h2", {}, "Je suis l'animateur"), mode === "quiz" ? h("div", {}, h("label", {}, "Nombre de questions (équilibrées par famille)"), nq) : h("p", { class: "meta" }, "10 décisions (5 injects × 2), 4 minutes chacune."),
        h("button", { class: "ok", onclick: function () { hostStart(mode, parseInt(nq.value, 10)); } }, "Créer une salle")), msg,
      h("p", { class: "meta" }, "Les téléphones des équipes se connectent à l'écran de l'animateur (connexion directe). Si le Wi-Fi bloque, utilisez le partage de connexion de l'animateur."));
  }

  /* ---------- Animateur ---------- */
  function newCode() { var a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = ""; for (var i = 0; i < 4; i++) s += a[Math.floor(Math.random() * a.length)]; return s; }
  function hostStart(mode, n) {
    var items = mode === "quiz" ? E.itemsQuiz(D.quiz, n) : E.itemsCrise(D.injects);
    var st = E.create(mode, items, mode === "quiz" ? 45 : 240), conns = {}, code, peer, status = "Connexion au serveur de mise en relation…";
    var root = h("div", {}); mount(root);
    function broadcast() { var v = E.view(st); Object.keys(conns).forEach(function (id) { try { conns[id].send({ t: "view", v: v }); } catch (e) {} }); render(); }
    function openPeer(tries) {
      code = newCode(); peer = new Peer("cpro-" + code);
      peer.on("open", function () { status = ""; render(); });
      peer.on("error", function (err) { if (err.type === "unavailable-id" && tries < 5) openPeer(tries + 1); else { status = "Erreur réseau : " + err.type + ". Vérifiez la connexion Internet."; render(); } });
      peer.on("connection", function (c) {
        c.on("data", function (m) {
          if (m.t === "join") { var t = E.join(st, m.name, m.teamId); if (!t) { c.send({ t: "refus" }); return; } conns[t.id] = c; c.send({ t: "ok", teamId: t.id }); broadcast(); }
          else if (m.t === "answer") { if (E.answer(st, m.teamId, m.choice)) broadcast(); }
        });
        c.on("close", function () { });
      });
    }
    function render() {
      var v = E.view(st), kids = [];
      var title = mode === "quiz" ? "Jeu 20 · Quiz Chercher, évaluer, argumenter" : "Jeu 21 · Mardi 6 h 50";
      kids.push(h("p", { class: "meta" }, title + (v.idx >= 0 && v.phase !== "end" ? " · question " + (v.idx + 1) + "/" + v.total : "")));
      if (status) kids.push(h("p", { class: "warn" }, status));
      if (v.phase === "lobby") {
        var url = BASE + "#/" + (mode === "quiz" ? "jeu20" : "jeu21") + "?c=" + code;
        kids.push(h("div", { class: "card" }, h("p", {}, "Rejoignez la partie : scannez ou saisissez le code"), h("div", { class: "code" }, code || "…"),
          code ? h("img", { src: "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" + encodeURIComponent(url), width: 220, height: 220, alt: "QR code de la salle" }) : null,
          h("p", {}, v.teams.length ? v.teams.map(teamChip) : "En attente des équipes (2 à 5)…"),
          h("button", { class: "ok", disabled: v.teams.length < 1 ? "disabled" : null, onclick: function () { E.start(st, Date.now()); broadcast(); } }, "Démarrer la partie")));
      } else if (v.phase === "question") {
        kids.push(itemBlock(v, null), h("div", { class: "timer", id: "tm" }, ""),
          h("p", {}, "Réponses : " + v.teams.filter(function (t) { return t.repondu; }).length + "/" + v.teams.length + " · ", v.teams.map(function (t) { return h("span", { class: "team", style: "background:" + t.color.hex + (t.repondu ? "" : ";opacity:.35") }, t.name); })),
          h("button", { onclick: function () { E.reveal(st); broadcast(); } }, "Révéler"));
      } else if (v.phase === "reveal") {
        kids.push(itemBlock(v, v.reveal), scoreBlock(v), h("button", { class: "ok", onclick: function () { E.next(st, Date.now()); broadcast(); } }, v.idx + 1 >= v.total ? "Voir le classement final" : "Question suivante"));
      } else {
        kids.push(finalBlock(v));
      }
      root.innerHTML = ""; kids.forEach(function (k) { root.appendChild(k); });
    }
    openPeer(0);
    var tick = setInterval(function () {
      if (st.phase !== "question") return;
      var left = (st.deadline - Date.now()) / 1000, el = document.getElementById("tm"); if (el) el.textContent = fmt(left);
      if (left <= 0 || (E.allAnswered(st) && st.order.length)) { if (left <= 0 || st._waited > 1) { E.reveal(st); st._waited = 0; broadcast(); } else st._waited = (st._waited || 0) + 0.5; }
    }, 500); timers.push(tick);
    render();
  }
  function itemBlock(v, rv) {
    var it = v.item;
    return h("div", { class: "card" }, h("p", { class: "meta" }, it.titre), it.contexte ? h("p", { class: "pre" }, it.contexte) : null, h("p", { class: "big" }, h("b", {}, it.q)),
      it.options.map(function (o, k) { return h("div", { class: "opt" + (rv ? (k === rv.bonne ? " good" : "") : "") }, "ABCD"[k] + ". " + o + (rv ? "   (" + (rv.scores[k] > 0 ? "+" : "") + rv.scores[k] + ")" : "")); }),
      rv ? h("p", { class: "corr pre" }, Array.isArray(rv.expl) ? rv.expl[rv.bonne] : rv.expl) : null);
  }
  function scoreBlock(v) {
    return h("p", {}, v.teams.map(function (t) { var r = v.reveal.res[t.id]; return h("span", { class: "team", style: "background:" + t.color.hex }, t.name + " : " + (r.choix === undefined ? "—" : "ABCD"[r.choix]) + " (" + (r.pts > 0 ? "+" : "") + r.pts + ") = " + t.score); }));
  }
  function finalBlock(v) {
    return h("div", { class: "card" }, h("h1", {}, "Classement final"), h("ol", {}, v.ranking.map(function (r) { return h("li", { class: "big" }, teamChip(r), " " + r.score + " / " + v.max + " · " + r.titre); })),
      h("p", { class: "meta" }, "Notez les points dans le carnet. Retour au menu : "), h("a", { class: "btn", href: "#/" }, "Accueil"));
  }

  /* ---------- Équipe ---------- */
  function teamJoin(mode, code, name) {
    var root = h("div", {}, h("p", { class: "warn" }, "Connexion à la salle " + code + "…")); mount(root);
    var peer = new Peer(), conn, teamId = (function(){try{return sessionStorage.getItem("team-" + code);}catch(e){return null;}})(), v = null, choice = null, lastIdx = -2;
    function draw() {
      var kids = [];
      if (!v) { kids.push(h("p", { class: "warn" }, "Connexion à la salle " + code + "…")); }
      else {
        var me = v.teams.filter(function (t) { return t.id === teamId; })[0];
        if (me) kids.push(h("p", {}, teamChip(me), " score : " + me.score));
        if (v.phase === "lobby") kids.push(h("div", { class: "card" }, h("h2", {}, "Vous êtes dans la salle"), h("p", {}, "En attente du démarrage par l'animateur. Équipes inscrites : " + v.teams.length), h("p", {}, v.teams.map(teamChip))));
        else if (v.phase === "question") {
          var it = v.item; if (v.idx !== lastIdx) { choice = null; lastIdx = v.idx; }
          kids.push(h("div", { class: "card" }, h("p", { class: "meta" }, it.titre + " · " + (v.idx + 1) + "/" + v.total), it.contexte ? h("p", { class: "pre" }, it.contexte) : null, h("p", { class: "big" }, h("b", {}, it.q)),
            it.options.map(function (o, k) { return h("button", { class: "opt" + (choice === k ? " sel" : ""), onclick: function () { choice = k; conn.send({ t: "answer", teamId: teamId, choice: k }); draw(); } }, "ABCD"[k] + ". " + o); }),
            h("p", { class: "meta" }, choice === null ? "Choisissez une réponse (modifiable jusqu'à la révélation)." : "Réponse enregistrée : " + "ABCD"[choice])));
        } else if (v.phase === "reveal") {
          var r = v.reveal.res[teamId] || { pts: 0 };
          kids.push(h("div", { class: "card" }, h("h2", {}, r.choix === undefined ? "Pas de réponse : 0 point" : (r.pts > 0 ? "+" + r.pts + " point" + (r.pts > 1 ? "s" : "") : r.pts < 0 ? r.pts + " point" : "0 point")),
            h("p", {}, "Meilleure réponse : " + "ABCD"[v.reveal.bonne] + ". " + v.item.options[v.reveal.bonne]), h("p", { class: "corr pre" }, Array.isArray(v.reveal.expl) ? v.reveal.expl[v.reveal.bonne] : v.reveal.expl),
            r.choix !== undefined && Array.isArray(v.reveal.expl) && r.choix !== v.reveal.bonne ? h("p", { class: "pre" }, "Votre choix : " + v.reveal.expl[r.choix]) : null));
        } else kids.push(finalBlock(v));
      }
      root.innerHTML = ""; kids.forEach(function (k) { root.appendChild(k); });
    }
    peer.on("open", function () {
      conn = peer.connect("cpro-" + code, { reliable: true });
      conn.on("open", function () { conn.send({ t: "join", name: name, teamId: teamId }); });
      conn.on("data", function (m) {
        if (m.t === "ok") { teamId = m.teamId; try { sessionStorage.setItem("team-" + code, teamId); } catch (e) {} }
        else if (m.t === "refus") { root.innerHTML = ""; root.appendChild(h("p", { class: "warn" }, "Salle complète (5 équipes) ou partie déjà commencée.")); }
        else if (m.t === "view") { v = m.v; draw(); }
      });
      conn.on("error", function () { root.innerHTML = ""; root.appendChild(h("p", { class: "warn" }, "Connexion impossible. Vérifiez le code.")); });
    });
    peer.on("error", function (err) { root.innerHTML = ""; root.appendChild(h("p", { class: "warn" }, err.type === "peer-unavailable" ? "Aucune salle avec ce code. L'animateur doit d'abord créer la salle (bouton « Créer une salle »), puis vous donner le code." : "Erreur réseau : " + err.type + ". Vérifiez la connexion (Wi-Fi bloqué : partage de connexion).")); });
  }

  /* ---------- Quiz final individuel ---------- */
  function quizFinal() {
    var items = E.itemsQuiz(D.quiz, 10), i = 0, score = 0, max = items.reduce(function (s, it) { return s + Math.max.apply(null, it.scores); }, 0), root = h("div", {});
    function draw() {
      root.innerHTML = "";
      if (i >= items.length) { root.appendChild(h("div", { class: "card" }, h("h1", {}, "Score : " + score + " / " + max), h("p", { class: "big" }, E.titre(score, max)), h("button", { onclick: quizFinal }, "Rejouer"), h("a", { class: "btn sec", href: "#/" }, "Accueil"))); return; }
      var it = items[i], done = false;
      var fb = h("div", {});
      root.appendChild(h("div", { class: "card" }, h("p", { class: "meta" }, it.titre + " · " + (i + 1) + "/" + items.length), h("p", { class: "big" }, h("b", {}, it.q)),
        it.options.map(function (o, k) {
          var b = h("button", { class: "opt", onclick: function () {
            if (done) return; done = true; score += it.scores[k]; b.className = "opt " + (k === it.bonne ? "good" : "bad");
            fb.appendChild(h("p", { class: "corr pre" }, (k === it.bonne ? "Bonne réponse. " : "Meilleure réponse : " + "ABCD"[it.bonne] + ". ") + it.expl));
            fb.appendChild(h("button", { onclick: function () { i++; draw(); } }, i + 1 >= items.length ? "Voir mon score" : "Suivant"));
          } }, "ABCD"[k] + ". " + o); return b;
        }), fb));
    }
    mount(root); draw();
  }

  function notFound() { mount(h("h1", {}, "Page introuvable"), h("a", { class: "btn", href: "#/" }, "Accueil")); }

  /* ---------- Sujets ---------- */
  function sujetsPage() {
    var mine = store("sujet"), cl = Sess.claims || {}, info = Sess.info();
    Sess.onchange = sujetsPage; Sess.connect();
    var myK = null; Object.keys(cl).forEach(function (k) { if (info && cl[k].sid === info.sid) myK = k; }); if (Sess.ok) mine = myK; else if (myK) mine = myK;
    mount(h("h1", {}, "Sujets de l'état de l'art"), sessionBar(),
      h("p", { class: "meta" }, "Chaque étudiant choisit un seul sujet, et un sujet ne peut être pris que par un seul étudiant : le premier qui appuie est servi. Ensuite, formulez votre question de décision (EX1)."),
      Sess.claimMsg ? h("p", { class: "warn" }, Sess.claimMsg) : null,
      h("div", {}, D.sujets.map(function (s, i) {
        var c = cl[s[0]], prisAutre = c && !(info && c.sid === info.sid), isMine = mine === s[0];
        var b = h("button", { class: isMine ? "ok" : "sec", onclick: function () { Sess.claim(s[0]); } }, isMine ? "Votre sujet ✓" : prisAutre ? "Pris par " + c.nom : "Choisir");
        if (prisAutre || (mine && !isMine)) { b.setAttribute("disabled", "disabled"); b.disabled = true; }
        return h("div", { class: "card", style: prisAutre ? "opacity:.55" : "" }, h("b", {}, (i + 1) + ". " + s[0]), h("p", {}, s[1]), b); })),
      h("p", {}, h("a", { href: "#/ex/EX1" }, "→ Exercice EX1 : formuler la question")), h("p", {}, h("a", { href: "#/" }, "← Retour à l'accueil")));
  }

  /* ---------- Boîte à outils ---------- */
  var MODELES = [
    ["Requête de recherche (Scholar)", "Outil réel", "Concepts : …, …, …\nSynonymes FR : … OR …\nSynonymes EN : … OR …\nRequête : (\"…\" OR \"…\") (\"…\" OR \"…\") -mot-exclu\nFiltre de dates : depuis 20XX\nDate de la recherche : …  Nombre de résultats : …"],
    ["Fiche de lecture d'un article", "Modèle", "Référence : …\nQuestion de l'article : …\nMéthode (échantillon, durée, groupe témoin ?) : …\nRésultat principal (avec chiffre) : …\nLimites : … / … / …\nFinancement et conflits d'intérêts : …\nCe que je peux écrire honnêtement : « … »"],
    ["Plan de l'état de l'art (2 pages)", "Modèle", "Résumé d'ouverture (3 lignes) : question, méthode, conclusion\n1. Question et contexte (10 %)\n2. Méthode de recherche : requêtes, bases, période, sources retenues et écartées (15 %)\n3. Panorama des solutions, avec sources (25 %)\n4. Comparaison : matrice, test de sensibilité (25 %)\n5. Discussion et limites (15 %)\n6. Conclusion : recommandation, qualificatif, réserve (10 %)\nRéférences (Zotero)"],
    ["Grille de notation de l'état de l'art (20 points)", "Modèle", "Question et contexte : /2\nMéthode de recherche : /3\nQualité des sources : /4\nComparaison : /4\nArgumentation : /4\nClarté et références : /3\nTotal : /20"],
    ["Grille de jury (pitch, 20 points)", "Modèle", "Message clé : /3\nStructure : /3\nClarté et vulgarisation : /3\nPreuves et sources : /4\nRéponse aux questions : /4\nVoix et posture : /3\nTotal : /20\nFeedback SBI : S … B … I …"],
    ["Fiche : vulnérabilité clé de mon organisation", "Modèle", "Vulnérabilité : …\nQui, quoi, quand, impact : …\nPreuve (donnée, observation, source) : …\nArgument : affirmation … ; données … ; garantie … ; réfutation …\nRecommandation (qualificatif, réserve) : …\nComment la vérifier avec le tuteur, et quand : …"],
    ["Note de synthèse d'une page", "Modèle", "Conclusion (une phrase) : …\nArgument 1 (chiffré) : …\nArgument 2 (chiffré) : …\nArgument 3 (chiffré) : …\nRisque ou réserve : …\nDécision demandée et date : …"],
    ["DESC : feedback ou désaccord", "Concept", "D · Décrire : « … (faits, sans jugement) »\nE · Exprimer : « … (l'effet sur moi ou sur le travail) »\nS · Spécifier : « … (ce que je demande, précis et daté) »\nC · Conséquences : « … (ce qui s'améliore, ou ce qui se passera sinon) »"],
    ["SBI : feedback en trois temps", "Concept", "S · Situation : quand, où ? « … »\nB · Comportement : ce que j'ai vu ou entendu. « … »\nI · Impact : l'effet sur moi, l'équipe ou le client. « … »\nPuis une question : « Comment voyez-vous les choses ? »"],
    ["Reformulation (écho, clarification, synthèse, reflet)", "Concept", "Écho : « Vous dites que … »\nClarification : « Quand vous dites …, que voulez-vous dire exactement ? »\nSynthèse : « Si je résume, vous avez … contraintes : … et … »\nReflet : « Vous semblez … »\nInterdits : conseil, jugement, « moi aussi »."],
    ["E-mail en pyramide inversée", "Modèle", "Objet : [sujet] + [action attendue] (8 mots)\n\nBonjour [prénom],\n\nConclusion / demande : …\nAction attendue, de qui, pour quand : …\nContexte en deux lignes : …\nDétails : en pièce jointe.\n\nCordialement,"],
    ["Compte rendu de réunion (Markdown)", "Modèle", "# Compte rendu — [objet], [date]\n**Participants :** …\n\n## Décisions\n- …\n\n## Actions (qui / quoi / quand)\n- [Qui] : [quoi] avant le [date]\n\n## Points ouverts\n- … (responsable : …)\n\n**Prochaine réunion :** …"],
    ["Ticket d'incident (GitHub Issues, Markdown)", "Outil réel", "**Titre :** [où] : [quoi] depuis [quand]\n\n## Contexte\n…\n## Impact\n[nombre de personnes, temps perdu]\n## Observé / attendu\nObservé : …\nAttendu : …\n## Pour reproduire\n1. …\n2. …\n## Pièces jointes\n[capture, journal]\n## Dernier changement\n…\n**Priorité :** P1 / P2 / P3 / P4 — justification : …"],
    ["Modèle de Toulmin", "Concept", "Affirmation : …\nDonnées : …\nGarantie : …\nFondement : …\nRéfutation (sauf si…) : …\nQualificatif (probablement, dans ces conditions…) : …"],
    ["Grille d'évaluation d'une source (six questions)", "Concept", "| Source | Qui ? | Quand ? | Pourquoi ? | Sur quoi ? | Recoupé ? | Reproductible ? | Total /12 |\n|---|---|---|---|---|---|---|---|\n| … | 0-2 | 0-2 | 0-2 | 0-2 | 0-2 | 0-2 | … |\nSeuils : 9 et plus fiable ; 5 à 8 à recouper ; 4 et moins à écarter ou à citer avec prudence."],
    ["Matrice pondérée (tableur)", "Outil réel", "Ligne 1 : critères. Ligne 7 : poids (somme = 100 %).\nLignes 2 à 4 : une solution par ligne, scores de 1 à 5.\nNote : =SOMMEPROD(B2:E2;$B$7:$E$7)\nTest de sensibilité : changer les poids et regarder si le classement change."],
    ["Plan de pitch (2 minutes)", "Modèle", "Message clé (une phrase) : …\nAccroche (scène ou chiffre) : …\nProblème : …\nSolution : …\nPreuve (fait, chiffre, exemple) : …\nAppel à décision (daté, chiffré) : …"],
    ["Ordre du jour de réunion", "Modèle", "Objectif de la réunion (une phrase) : …\nDate, durée, lieu : …\nInvités et rôle : …\nAnimateur : … Secrétaire : … Gardien du temps : …\nPoints (durée, décision attendue) :\n1. … (10 min) — décider / informer / discuter\n2. …"],
    ["Message de crise (trois éléments)", "Modèle", "Fait : « … »\nConsigne : « … »\nProchain point : « … à [heure] »\n(Pas de promesse non fondée, pas de coupable, pas de « tout va bien ».)"],
    ["Plan 30-60-90 jours", "Modèle", "Compétence 1 : …\n  J+30 : … (indicateur : …)\n  J+60 : … (indicateur : …)\n  J+90 : … (indicateur : …)\nCompétence 2 : …\nCompétence 3 : …\nPremier pas demain (moins de 15 min) : …\nDate de point avec : … le …"]
  ];
  function copier(txt, btn) {
    function ok() { btn.textContent = "Copié ✓"; setTimeout(function () { btn.textContent = "Copier"; }, 1500); }
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt).then(ok, fallback); return; } } catch (e) {}
    fallback();
    function fallback() { var t = document.createElement("textarea"); t.value = txt; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); ok(); } catch (e) { btn.textContent = "Copie impossible"; } document.body.removeChild(t); }
  }
  function num(v) { var x = parseFloat(String(v).replace(",", ".")); return isFinite(x) ? x : 0; }
  function euro(x) { return Math.round(x).toLocaleString("fr-FR") + " €"; }
  function calculette(titre, champs, calc) {
    var inputs = {}, out = h("div", { class: "pre" });
    var box = h("div", { class: "card" }, h("h3", {}, titre));
    champs.forEach(function (c) { var i = h("input", { type: "text", inputmode: "decimal", value: String(c[2]) }); inputs[c[0]] = i; i.addEventListener("input", upd); box.appendChild(h("label", {}, c[1])); box.appendChild(i); });
    box.appendChild(out);
    function upd() { var v = {}; Object.keys(inputs).forEach(function (k) { v[k] = num(inputs[k].value); }); out.textContent = calc(v); }
    upd(); return box;
  }

  function evaluateurSource() {
    var crit = ["Qui ? (auteur compétent, indépendant)", "Quand ? (date adaptée)", "Pourquoi ? (informer plutôt que vendre)", "Sur quoi ? (données et méthode visibles)", "Recoupé ? (autres sources indépendantes)", "Reproductible ? (méthode refaisable)"];
    var sel = [], out = h("div", { class: "pre" }), box = h("div", { class: "card" }, h("h3", {}, "Évaluateur de source (grille en six questions)"));
    crit.forEach(function (c) { var s = h("select", {}, h("option", { value: "0" }, "0"), h("option", { value: "1" }, "1"), h("option", { value: "2" }, "2")); s.addEventListener("change", upd); sel.push(s); box.appendChild(h("label", {}, c + " : 0 à 2")); box.appendChild(s); });
    box.appendChild(out);
    function upd() { var t = 0; sel.forEach(function (s) { t += parseInt(s.value, 10); }); out.textContent = "Total : " + t + " / 12 → " + (t >= 9 ? "fiable : à retenir" : t >= 5 ? "à recouper avant de citer" : "à écarter ou à citer avec prudence") + "\n(Seuils pédagogiques du cours.)"; }
    upd(); return box;
  }
  function matrice() {
    var box = h("div", { class: "card" }, h("h3", {}, "Matrice pondérée (3 solutions, 4 critères)")), out = h("div", { class: "pre" }), poids = [], noms = [], scores = [];
    box.appendChild(h("p", { class: "meta" }, "Saisissez les poids (somme = 100) et les scores de 1 à 5. Modifiez les poids pour le test de sensibilité."));
    var wr = h("div", { class: "grid" }); ["Coût", "Sécurité", "Restauration", "Simplicité"].forEach(function (n, j) { var i = h("input", { value: [30, 30, 25, 15][j], inputmode: "decimal" }); i.addEventListener("input", upd); poids.push(i); wr.appendChild(h("div", {}, h("label", {}, "Poids " + n + " (%)"), i)); }); box.appendChild(wr);
    [["Disque local", [5, 2, 2, 5]], ["Cloud", [3, 4, 4, 4]], ["Hybride", [2, 5, 5, 3]]].forEach(function (s) { var row = h("div", { class: "grid" }), line = [], nm = h("input", { value: s[0] }); nm.addEventListener("input", upd); noms.push(nm);
      row.appendChild(h("div", {}, h("label", {}, "Solution"), nm)); s[1].forEach(function (v) { var i = h("input", { value: v, inputmode: "decimal" }); i.addEventListener("input", upd); line.push(i); row.appendChild(h("div", {}, h("label", {}, "Score"), i)); }); scores.push(line); box.appendChild(row); });
    box.appendChild(out);
    function upd() { var w = poids.map(function (i) { return num(i.value); }), sw = w.reduce(function (a, b) { return a + b; }, 0) || 1;
      var res = scores.map(function (l, k) { return [noms[k].value, l.reduce(function (a, i, j) { return a + num(i.value) * w[j] / sw; }, 0)]; }).sort(function (a, b) { return b[1] - a[1]; });
      out.textContent = "Somme des poids : " + sw + " %\n" + res.map(function (r, i) { return (i + 1) + ". " + r[0] + " : " + r[1].toFixed(2); }).join("\n") + "\n(Scores fictifs d'exemple : à remplacer et à sourcer.)"; }
    upd(); return box;
  }

  function dossierPage() {
    var SEC = [["0", "Mon offre cible", "EX0"], ["1", "Question de décision", "EX1"], ["2", "Besoin du commanditaire", "EX4"], ["3", "Stratégie de recherche", "EX7, EX8"], ["4", "Sources institutionnelles", "EX9"], ["5", "Sources enregistrées et évaluées", "EX10, EX11b, EX12"], ["6", "Origine d'un chiffre", "EX13"],
      ["7", "Fiche de lecture", "EX14"], ["8", "Références vérifiées (IA)", "EX15"], ["9", "Argument de Toulmin", "EX16, EX19"], ["10", "Chiffre de fournisseur et objections", "EX18, EX20"], ["11", "Matrice pondérée", "EX21, EX22"], ["12", "Plan et résumé d'ouverture", "EX23"],
      ["13", "État de l'art (2 pages)", "EX24"], ["14", "Retours de relecture", "EX25"], ["15", "Pitch et jury", "EX26, EX27"], ["16", "Fiche de vulnérabilité", "EX28"], ["17", "Bibliographie (Zotero)", "EX10"], ["18", "Déclaration d'usage de l'IA", "tout le cours"], ["19", "Plan de veille et journal de sources", "V4"], ["20", "Fiche de veille d'une vulnérabilité (CVE)", "V5"], ["21", "Benchmark : mesures et écarts", "V8"]];
    mount(h("h1", {}, "Dossier d'état de l'art"),
      h("div", { class: "card" }, h("p", {}, "Un seul fichier PowerPoint (une diapositive par section, précédée d'un exemple fictif à supprimer), rempli au fil des exercices sur le sujet choisi par votre équipe. Chaque exercice indique « → Dossier, section X »."),
        h("a", { class: "btn", href: "modele-dossier-etat-de-l-art.pptx", download: "modele-dossier-etat-de-l-art.pptx" }, "Télécharger le modèle (PowerPoint)"),
        h("p", { class: "meta" }, "Ouvrir avec PowerPoint ou LibreOffice Impress, ou importer dans Google Slides. Aucune donnée confidentielle ni personnelle.")),
      h("div", { class: "card" }, h("h2", {}, "Les 22 sections (0 à 21)"), h("table", {}, h("tr", {}, ["Section", "Titre", "Exercices"].map(function (x) { return h("th", {}, x); })),
        SEC.map(function (r) { return h("tr", {}, r.map(function (x) { return h("td", {}, x); })); }))),
      h("p", { class: "meta" }, "© 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. Créé avec l'aide de Claude (Anthropic), relu par l'auteur."));
  }
  function outilsPage() {
    var calcs = [
      calculette("Calculette · coût de la non-communication (EX2)", [["n", "Salariés", 120], ["h", "Heures perdues par salarié et par semaine", 1.5], ["s", "Semaines travaillées", 45], ["c", "Coût horaire chargé (€)", 32],
        ["r", "Réduction de la perte par le plan (%)", 40], ["f", "Heures de formation par salarié", 7], ["p", "Prestation (€)", 6000], ["d", "Décote de prudence sur le gain (%)", 50]],
        function (v) { var hp = v.n * v.h * v.s, cout = hp * v.c, gain = cout * v.r / 100, plan = v.n * v.f * v.c + v.p, gp = gain * (1 - v.d / 100);
          return "Heures perdues par an : " + Math.round(hp).toLocaleString("fr-FR") + " h\nCoût annuel : " + euro(cout) + "\nGain annuel : " + euro(gain) + "\nCoût du plan : " + euro(plan) +
            "\nROI année 1 : " + (plan ? Math.round((gain - plan) / plan * 100) : 0) + " %\nRetour : " + (gain ? (plan / gain * 12).toFixed(1) : "—") + " mois" +
            "\nVersion prudente : gain " + euro(gp) + ", ROI " + (plan ? Math.round((gp - plan) / plan * 100) : 0) + " %, retour " + (gp ? (plan / gp * 12).toFixed(1) : "—") + " mois\n(Hypothèses pédagogiques inventées.)"; }),
      calculette("Calculette · coût d'une réunion (F7)", [["n", "Participants", 8], ["d", "Durée (heures)", 1], ["s", "Réunions par an", 45], ["c", "Coût horaire chargé (€)", 32]],
        function (v) { var u = v.n * v.d * v.c; return "Une réunion : " + euro(u) + "\nPar an : " + euro(u * v.s); })];
    var ref = [["Google Scholar", "https://scholar.google.com/", "Recherche d'articles scientifiques. Astuce : « guillemets », OR, − et filtre de dates."], ["Semantic Scholar", "https://www.semanticscholar.org/", "Recherche d'articles avec résumés."],
      ["Zotero", "https://www.zotero.org/", "Gestion de références, gratuit : installer l'extension du navigateur (EX10)."], ["GitHub Issues", "https://docs.github.com/fr/issues", "Tickets d'incident et demandes (EX14)."],
      ["LanguageTool", "https://languagetool.org/fr", "Correcteur de ton et d'orthographe pour vos e-mails."],
      ["doi.org", "https://doi.org/", "Ouvrir un DOI : vérifier qu'il mène au bon article (EX15)."], ["Légifrance", "https://www.legifrance.gouv.fr/", "Textes de loi et décrets (F0)."], ["service-public.fr", "https://www.service-public.fr/", "Informations officielles pour les particuliers et les agents (F0)."],
      ["Questions écrites, Assemblée nationale", "https://questions.assemblee-nationale.fr/", "Questions et réponses ministérielles (F0)."], ["NIST, publications", "https://csrc.nist.gov/publications", "SP 800-63B-4 (EX11b)."], ["ANSSI / cyber.gouv.fr", "https://cyber.gouv.fr/", "Guides et recommandations (EX9, EX11b)."], ["ENISA", "https://www.enisa.europa.eu/publications", "Rapports européens (EX11b)."],
      ["Perplexity (IA)", "https://www.perplexity.ai/", "Réponses avec liens vers les sources : ouvrir chaque lien. Aucune donnée confidentielle."], ["Elicit (IA)", "https://elicit.com/", "Recherche et extraction dans des articles scientifiques."], ["Consensus (IA)", "https://consensus.app/", "Moteur de recherche académique assisté par IA."],
      ["NotebookLM (IA)", "https://notebooklm.google.com/", "Interroger vos propres documents publics."], ["Scite (IA)", "https://scite.ai/", "Citations qui soutiennent ou contredisent (payant)."],
      ["OpenAlex", "https://openalex.org/", "Base ouverte d'articles, d'auteurs et de citations : retrouver une référence (jeu 5.9)."], ["Connected Papers", "https://www.connectedpapers.com/", "Carte des articles liés à partir d'un article ; plan gratuit limité."], ["ResearchRabbit", "https://www.researchrabbit.ai/", "Explorer la littérature par proximité de citations ; vérifier les conditions du plan gratuit."], ["Litmaps", "https://www.litmaps.com/", "Suivre la littérature d'un sujet en carte ; plan gratuit limité."],
      ["TinEye", "https://tineye.com/", "Recherche inversée d'image : retrouver la première publication d'une photo."], ["Google Lens", "https://lens.google.com/", "Recherche d'image depuis le téléphone."], ["InVID-WeVerify", "https://www.invid-project.eu/tools-and-services/invid-verification-plugin/", "Extension de navigateur pour vérifier photos et vidéos."], ["Google Fact Check Explorer", "https://toolbox.google.com/factcheck/explorer", "Chercher si une affirmation a déjà été vérifiée par des médias de vérification."],
      ["RFC Editor", "https://www.rfc-editor.org/", "Lire un protocole à la source."], ["MDN Web Docs", "https://developer.mozilla.org/fr/", "Documentation web de référence."], ["Stack Overflow", "https://stackoverflow.com/", "Erreurs et exemples de code : vérifier la date et les votes."],
      ["VirusTotal", "https://www.virustotal.com/", "Analyser un fichier ou une adresse suspects. Ne déposez jamais de donnée confidentielle."], ["Shodan", "https://www.shodan.io/", "Voir ce qu'une machine expose sur Internet : usage défensif, sur son propre périmètre."], ["Have I Been Pwned", "https://haveibeenpwned.com/", "Un compte a-t-il fuité ?"],
      ["Wolfram Alpha", "https://www.wolframalpha.com/", "Calculs et ordres de grandeur."], ["Our World in Data", "https://ourworldindata.org/", "Données et graphiques sourcés."],
      ["Google Alerts", "https://www.google.com/alerts", "Alertes sur une requête (V4) ; option flux RSS à tester."], ["Inoreader", "https://www.inoreader.com/", "Lecteur de flux RSS, plan gratuit limité (V4) ; exporter en OPML."],
      ["CERT-FR", "https://cert.cyber.gouv.fr/", "Avis et alertes de sécurité ; lien « Flux RSS » (V4, V5)."], ["NVD", "https://nvd.nist.gov/", "Vulnérabilités (CVE) et score CVSS (V5)."], ["EUVD (ENISA)", "https://euvd.enisa.europa.eu/", "Base européenne de vulnérabilités ; adresse à vérifier (V5)."],
      ["KEV (CISA)", "https://www.cisa.gov/known-exploited-vulnerabilities-catalog", "Vulnérabilités exploitées ; adresse à vérifier (V5)."], ["EPSS (FIRST)", "https://www.first.org/epss/", "Probabilité d'exploitation à 30 jours (V5)."], ["Retraction Watch Database", "https://retractiondatabase.org/", "Articles rétractés (EX15)."]];
    mount(h("h1", {}, "Boîte à outils"), h("p", { class: "meta" }, "Concepts et modèles à copier-coller, calculettes, outils réels. Les calculettes « coût de la non-communication » et « réunion » servent à l'annexe. Cas fictif TransLor ; chiffres inventés. Adresses des outils réels à vérifier avant le cours."),
      h("h2", {}, "Calculettes"), evaluateurSource(), matrice(), calcs[0], calcs[1],
      h("h2", {}, "Outils réels"), h("div", { class: "card" }, ref.map(function (r) { return h("p", {}, h("a", { href: r[1], target: "_blank", rel: "noopener" }, r[0]), " : " + r[2]); })),
      h("h2", {}, "Modèles à copier"),
      h("div", {}, MODELES.map(function (m) { var b = h("button", { onclick: function () { copier(m[2], b); } }, "Copier"); return h("div", { class: "card" }, h("b", {}, m[0]), h("span", { class: "meta" }, " · " + m[1]), h("pre", { class: "pre" }, m[2]), b); })),
      h("p", {}, h("a", { href: "#/" }, "← Retour à l'accueil")));
  }

  /* ---------- Fiche animateur (#/animateur) ---------- */
  function aidePage() {
    var li = function () { return h("ul", {}, [].slice.call(arguments).map(function (t) { return h("li", {}, t); })); };
    mount(h("h1", {}, "Fiche animateur : conduire la séance"),
      h("p", { class: "meta" }, "Une page. À ouvrir sur l'ordinateur relié au vidéoprojecteur (navigateur récent : Chrome, Edge ou Firefox)."),
      h("div", { class: "card" }, h("h2", {}, "1 · La veille"), li("Ouvrir la page animateur (lien en bas de chaque page d'exercice du support, ou #/prof) et vérifier qu'elle s'affiche.", "Tester avec deux téléphones : rejoindre la session, répondre à un exercice, voir la réponse arriver.", "Prévoir le partage de connexion d'un téléphone si le Wi-Fi de la salle bloque les connexions directes.")),
      h("div", { class: "card" }, h("h2", {}, "2 · Au début du cours"), li("Page animateur : saisir un code (ex. COM1), cliquer sur « Ouvrir la session ». Garder cette page ouverte jusqu'à la fin.", "Projeter le QR de la session : chaque étudiant le scanne une fois et saisit son prénom. En l'absence de QR, afficher le code et l'adresse du site.", "Contrôler le compteur « n en ligne » : les absents de la liste n'ont pas rejoint la session.")),
      h("div", { class: "card" }, h("h2", {}, "3 · À chaque exercice"), li("Projeter la page du support ; les étudiants scannent son QR et répondent sur leur téléphone.", "Onglet « Réponses d'un exercice » : un tableau, une ligne par étudiant, une colonne par consigne. Cocher « Grand texte » pour le projeter.", "Après la restitution, cliquer sur « Ouvrir la correction aux étudiants », puis projeter la page de correction du support.", "Exercice 1 : l'onglet « Sujets choisis » montre qui a pris quel sujet (premier arrivé, premier servi).")),
      h("div", { class: "card" }, h("h2", {}, "4 · En fin de journée"), li("Cliquer sur « Exporter en CSV » : les réponses sont gardées dans le navigateur de cet ordinateur seulement, l'export est la sauvegarde.", "Ne pas utiliser « Effacer les réponses » avant d'avoir exporté.")),
      h("div", { class: "card" }, h("h2", {}, "5 · Le plateau « 5 · La route de l'état de l'art »"), li("Tour de contrôle (#/tour) : PIN, « Ouvrir la partie », choisir le ou les jeux, « Lancer la séance ». Les 16 jeux (5.1 à 5.16) se jouent avec le bouton « Jeu suivant » ; le bouton « Débloquer les cartes supplémentaires » ajoute 12 cartes par jeu (8 pour le 5.8).", "Joueurs : QR du plateau ou lien #/j, code ROUTE, prénom et table 1 à 5. Un QR de reconnexion reste affiché en permanence sur la tour (« Connexion perdue ? Scannez à nouveau, même prénom, même table »).", "Plateau physique 80 × 60 cm : route de 63 cases à gauche, bandeau de droite avec l'atelier d'outils (16 emplacements, jetons de couleur), la case « Je mise » et la légende. Version imprimée par table (PDF « Plateau 80 × 60 »).", "Règles : 1 à 3 points = on avance d'autant ; 0 point = on recule d'une case ; pari facultatif (+1 / −1) ; cases Aléa, Outil, Piège, Duel et Relecture réglées à l'écran du joueur.", "Case 31 : fin du niveau 1. Le bouton « Ouvrir le niveau 2 » libère les joueurs arrivés à la porte et ouvre les cases 32 à 62 (jeux 5.9 à 5.16). Le niveau 2 se joue hors du temps de cours si besoin.", "Duels : appariés entre tables ; sans adversaire au bout de 45 secondes, le joueur affronte la tour. Relecture : un joueur de la même table relit la réponse et donne son verdict.", "Mode test (#/test) : parcourt les 16 jeux et toutes les cartes avec les réponses attendues, sans rien envoyer aux joueurs sauf le jeu choisi. « Simuler une partie » lance 5 tables fictives avec effets de cases.", "Les corrigés détaillés de toutes les cartes sont dans la fiche enseignant (PDF, non publié).",)),
      h("div", { class: "card" }, h("h2", {}, "6 · Si cela ne marche pas"), li("« Aucune salle avec ce code » : la session n'est pas ouverte ; ouvrir la page animateur et cliquer sur « Ouvrir la session ».", "« Ce code est déjà utilisé » : une autre page animateur est ouverte ; fermer l'autre onglet ou changer de code.", "Les réponses n'arrivent pas : changer de réseau (partage de connexion). Les étudiants gardent leur saisie sur leur téléphone et la renvoient en rechargeant la page.", "Pas d'écran de projection du QR : écrire le code au tableau.", "Les étudiants sans smartphone : binômes, ou réponses sur papier.")),
      h("p", {}, h("a", { href: "#/prof" }, "→ Ouvrir la page animateur"), "  ·  ", h("a", { href: "#/" }, "← Accueil")));
  }

  window.APP = { h: h, mount: mount, LSget: LSget, LSset: LSset, BASE: BASE, timers: timers };
  function route() {
    var p = (location.hash || "#/").replace(/\?.*$/, "").split("/").filter(Boolean); p.shift();
    Sess_off(); var a = p[0] || "";
    if (a === "" ) return home();
    if (a === "ex" || a === "f") return exercise(p[1]);
    if (a === "jeu20") return gameEntry("quiz");
    if (a === "jeu21") return gameEntry("crise");
    if (a === "quiz-final") return quizFinal();
    if (a === "session") return sessionPage();
    if (a === "prof") return profPage();
    if (a === "animateur") return aidePage();
    if ((a === "j" || a === "tour" || a === "test") && window.J51) return window.J51.route(a);
    if (a === "plateau" && window.PLATEAU) return window.PLATEAU.route(p.slice(1));
    if (a === "outils") return outilsPage();
    if (a === "sujets") return sujetsPage();
    if (a === "dossier") return dossierPage();
    notFound();
  }
  window.addEventListener("hashchange", route); route();
})();
