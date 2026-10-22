/* © 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. */
(function () {
  "use strict";
  var D = window.DATA, E = window.Engine, app = document.getElementById("app");
  var BASE = location.origin + location.pathname;
  var timers = [];
  function clearTimers() { timers.forEach(clearInterval); timers = []; }
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
  function mount() { clearTimers(); app.innerHTML = ""; for (var i = 0; i < arguments.length; i++) app.appendChild(arguments[i]); window.scrollTo(0, 0); }
  function fmt(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  function teamChip(t) { return h("span", { class: "team", style: "background:" + t.color.hex }, t.name + (t.score !== undefined ? " · " + t.score : "")); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- Accueil ---------- */
  function home() {
    var ex = Object.keys(D.exo), nums = function (a, b) { return parseInt(a.replace(/\D/g, ""), 10) - parseInt(b.replace(/\D/g, ""), 10); };
    var EX = ex.filter(function (i) { return i.indexOf("EX") === 0; }).sort(nums), F = ex.filter(function (i) { return i.charAt(0) === "F"; }).sort(nums);
    mount(h("h1", {}, "Exercices, quiz et jeux"),
      h("p", { class: "meta" }, "Scannez le QR code de la diapositive, ou choisissez ci-dessous. Cas fictif : TransLor."),
      h("h2", {}, "Jeux"),
      h("div", { class: "grid" },
        h("a", { class: "tile g", href: "#/jeu20" }, h("b", {}, "Jeu 20 · Le quiz de la Vigie"), h("div", { class: "meta" }, "54 questions, équipes sur téléphone")),
        h("a", { class: "tile g", href: "#/jeu21" }, h("b", {}, "Jeu 21 · Mardi 6 h 50"), h("div", { class: "meta" }, "Communication de crise, 5 injects")),
        h("a", { class: "tile g", href: "#/quiz-final" }, h("b", {}, "Quiz final"), h("div", { class: "meta" }, "10 questions, individuel"))),
      h("h2", {}, "Exercices"),
      h("div", { class: "grid" }, EX.map(function (i) { return h("a", { class: "tile", href: "#/ex/" + i }, h("b", {}, i.replace("EX", "EX ")), h("div", { class: "meta" }, D.exo[i].titre)); })),
      h("h2", {}, "Exercices flash et exit tickets"),
      h("div", { class: "grid" }, F.map(function (i) { return h("a", { class: "tile f", href: "#/f/" + i }, h("b", {}, i.replace("F", "F ")), h("div", { class: "meta" }, D.exo[i].titre)); })));
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
    var notes = h("textarea", { placeholder: "Vos notes (enregistrées sur cet appareil)" }); notes.value = store("notes-" + id) || "";
    notes.addEventListener("input", function () { store("notes-" + id, notes.value); });
    var corrBox = h("div", {}), roleBox = h("div", {});
    var cb = h("button", { class: "ok", onclick: function () {
      if (corrBox.firstChild) { corrBox.innerHTML = ""; cb.textContent = "Afficher la correction"; return; }
      corrBox.appendChild(correction(e)); cb.textContent = "Masquer la correction";
    } }, "Afficher la correction");
    var parts = [h("p", { class: "meta" }, h("span", { class: "badge" }, id.replace("EX", "EX ").replace("F", "F ")), e.mode + " · " + e.duree + " min · " + e.chap), h("h1", {}, e.titre),
      h("div", { class: "card" }, h("h2", {}, "Mise en situation"), lines(e.situation)),
      h("div", { class: "card" }, h("h2", {}, "À faire"), h("ol", {}, e.taches.map(function (t) { return h("li", {}, t); }))),
      e.livrable ? h("p", { class: "warn" }, "Livrable : " + e.livrable) : null,
      h("div", { class: "card" }, disp, bt, reset)];
    if (e.fiche_role) parts.push(h("div", { class: "card" }, h("p", { class: "meta" }, "Réservé au joueur qui tient le rôle de Marc."),
      h("button", { class: "sec", onclick: function () { roleBox.innerHTML = ""; roleBox.appendChild(h("div", { class: "corr pre" }, e.fiche_role)); } }, "Afficher la fiche de rôle"), roleBox));
    if (id === "EX1") parts.push(styleWidget());
    parts.push(h("div", { class: "card" }, h("h2", {}, "Mes notes"), notes));
    parts.push(h("div", {}, cb, corrBox));
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
  function styleWidget() {
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
      var dir = A >= 11, rel = B >= 11, p = dir ? (rel ? "Animateur" : "Décideur") : (rel ? "Facilitateur" : "Analyste"), x = PROF[p]; store("profil", p);
      res.innerHTML = ""; res.appendChild(h("div", { class: "corr" }, h("h2", {}, "Votre profil : " + p + " (" + x[0] + ")"),
        h("p", {}, "Axe A, façon de s'exprimer : " + A + " / 16 → " + (dir ? "Direct (11 et plus)" : "Nuancé (10 et moins)")),
        h("p", {}, "Axe B, centre d'attention : " + B + " / 16 → " + (rel ? "Relation (11 et plus)" : "Tâche (10 et moins)")),
        h("p", {}, h("b", {}, "Force : "), x[1]), h("p", {}, h("b", {}, "Risque en entreprise : "), x[2]), h("p", {}, h("b", {}, "Conseil : "), x[3]),
        h("p", { class: "meta" }, "Modèle pédagogique simplifié : aucun profil n'est meilleur ; l'enjeu est l'écart avec la personne en face.")));
    } }, "Calculer mon profil");
    return h("div", { class: "card" }, h("h2", {}, "Calculateur de profil (1 = pas du tout d'accord, 4 = tout à fait)"),
      qs.map(function (q, i) { return h("div", {}, h("label", {}, (i + 1) + ". " + q), sel[i]); }), calc, res);
  }

  /* ---------- Jeux : entrée ---------- */
  function params() { var q = (location.hash.split("?")[1] || ""), o = {}; q.split("&").forEach(function (p) { var a = p.split("="); if (a[0]) o[a[0]] = decodeURIComponent(a[1] || ""); }); return o; }
  function gameEntry(mode) {
    var name = mode === "quiz" ? "Jeu 20 · Le quiz de la Vigie" : "Jeu 21 · Mardi 6 h 50", p = params();
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
      var title = mode === "quiz" ? "Jeu 20 · Le quiz de la Vigie" : "Jeu 21 · Mardi 6 h 50";
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
    peer.on("error", function (err) { root.innerHTML = ""; root.appendChild(h("p", { class: "warn" }, "Erreur réseau : " + err.type + ". Vérifiez le code et la connexion.")); });
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
  function route() {
    var p = (location.hash || "#/").replace(/\?.*$/, "").split("/").filter(Boolean); p.shift();
    var a = p[0] || "";
    if (a === "" ) return home();
    if (a === "ex" || a === "f") return exercise(p[1]);
    if (a === "jeu20") return gameEntry("quiz");
    if (a === "jeu21") return gameEntry("crise");
    if (a === "quiz-final") return quizFinal();
    notFound();
  }
  window.addEventListener("hashchange", route); route();
})();
