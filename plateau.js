/* © 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. Créé avec l'aide de Claude (Anthropic), relu par l'auteur.
   Plateau « 5 · La route de l'état de l'art » : dessin du plateau (63 cases), page d'accueil et règles. Le jeu se joue sur #/j (joueurs) et #/tour (enseignant). */
(function () {
  "use strict";
  var A = window.APP, h = A.h, mount = A.mount, D = window.PLATEAU_DATA, NS = "http://www.w3.org/2000/svg";
  function sv(tag, attrs, text) { var e = document.createElementNS(NS, tag); Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); }); if (text !== undefined) e.textContent = text; return e; }
  function abbr(n) { var w = String(n || "?").trim(); return (w.slice(0, 1) || "?").toUpperCase(); }
  /* symbole et couleur de chaque type de case */
  var TS = { depart: ["▶", "#5B6478"], exam: ["★", "#1F2A5C"], gate: ["🔒", "#1F2A5C"], aleas: ["?", "#7A3FB5"], outil: ["⚙", "#0F8B8D"], piege: ["!", "#C0392B"], duel: ["VS", "#B8860B"], pairs: ["✎", "#8E5A2B"] };
  function zcol(c) { return c.type === "jeu" ? D.zones[c.zone].col : (TS[c.type] || ["", "#5B6478"])[1]; }
  function glyph(c) { return c.type === "jeu" ? c.jeu.replace("5.", "") : TS[c.type][0]; }

  /* Plateau 2D : le carré de la route (600 × 600 mm), y vers le haut comme sur le PDF */
  function boardSvg(pawns, opts) {
    opts = opts || {}; var s = sv("svg", { viewBox: "0 0 600 600", width: "100%", style: "background:#F3F5F9;border-radius:10px;display:block;max-height:" + (opts.max || 520) + "px" }), Y = function (y) { return 600 - y; };
    s.appendChild(sv("polyline", { points: D.cases.map(function (c) { return c.x + "," + Y(c.y); }).join(" "), fill: "none", stroke: "#B9C4E8", "stroke-width": 9, "stroke-linejoin": "round" }));
    s.appendChild(sv("text", { x: 300, y: 205, "font-size": 15, fill: "#5B6478", "text-anchor": "middle", "font-weight": 700 }, "Niveau 1 : cases 0 à 31 (extérieur)"));
    s.appendChild(sv("text", { x: 300, y: 225, "font-size": 15, fill: "#5B6478", "text-anchor": "middle", "font-weight": 700 }, "Niveau 2 : cases 32 à 62 (intérieur)"));
    D.cases.forEach(function (c) {
      var g = sv("g", {}), big = c.type === "exam" || c.type === "depart" || c.type === "gate";
      g.appendChild(sv("circle", { cx: c.x, cy: Y(c.y), r: big ? 24 : 18, fill: zcol(c), stroke: "#fff", "stroke-width": 3 }));
      g.appendChild(sv("text", { x: c.x, y: Y(c.y) + (c.type === "jeu" ? 6 : 6), "font-size": c.type === "jeu" ? 16 : c.type === "duel" ? 13 : 17, fill: "#fff", "text-anchor": "middle", "font-weight": 800 }, c.type === "gate" ? "31" : glyph(c)));
      g.appendChild(sv("text", { x: c.x, y: Y(c.y) + (big ? 38 : 31), "font-size": 11, fill: "#5B6478", "text-anchor": "middle" }, c.type === "exam" ? "Examen" : c.type === "depart" ? "Départ" : c.type === "gate" ? "Fin niv. 1" : String(c.n)));
      s.appendChild(g);
    });
    var byPos = {}; (pawns || []).forEach(function (p) { (byPos[p.pos] = byPos[p.pos] || []).push(p); });
    Object.keys(byPos).forEach(function (k) {
      var c = D.cases[+k]; if (!c) return;
      byPos[k].forEach(function (p, i) {
        var n = byPos[k].length, a = (i / n) * Math.PI * 2 - Math.PI / 2, r = n > 1 ? 15 : 0, cx = c.x + Math.cos(a) * r, cy = Y(c.y) - 26 + Math.sin(a) * r;
        var g = sv("g", {}); g.appendChild(sv("circle", { cx: cx, cy: cy, r: opts.big ? 15 : 12, fill: p.col, stroke: "#fff", "stroke-width": 2.5 }));
        g.appendChild(sv("text", { x: cx, y: cy + 5, "font-size": 14, fill: "#fff", "text-anchor": "middle", "font-weight": 800 }, abbr(p.label))); s.appendChild(g);
      });
    });
    return s;
  }

  function legend() {
    var rows = [["jeu", "Case jeu (numéro = jeu 5.x)", "On tire une carte du jeu ; tout le monde répond."], ["aleas", "Aléa", "Un événement de la vie professionnelle : +2, +1 ou −1 case."], ["outil", "Outil", "Un vrai outil à essayer 2 minutes ; réussi, il vous donne +1 case et un jeton posé sur l'atelier."], ["piege", "Piège", "Une question individuelle : une erreur coûte une case."], ["duel", "Duel", "Un adversaire d'une autre table, même question : le gagnant avance, le perdant recule d'une case."], ["pairs", "Relecture", "Un voisin lit votre réponse à voix haute et dit s'il y voit une erreur."]];
    return h("table", {}, h("tr", {}, ["Symbole", "Case", "Effet"].map(function (t) { return h("th", {}, t); })), rows.map(function (r) { var c = r[0] === "jeu" ? { type: "jeu", jeu: "5.1", zone: "O3" } : { type: r[0] }; return h("tr", {}, h("td", {}, h("span", { class: "team", style: "background:" + zcol(c) }, glyph(c))), h("td", {}, r[1]), h("td", {}, r[2])); }));
  }

  function entry() {
    mount(h("h1", {}, "5 · La route de l'état de l'art"),
      h("p", { class: "meta" }, "Un plateau de 63 cases en deux niveaux, 16 jeux. Chaque joueur répond sur son téléphone ou son ordinateur ; la table avance ensemble."),
      h("div", { class: "grid" }, h("a", { class: "tile", href: "#/j" }, h("b", {}, "Je suis un joueur"), h("div", { class: "meta" }, "Rejoindre la partie : prénom, numéro de table, code ROUTE")),
        h("a", { class: "tile f", href: "#/plateau/regles" }, h("b", {}, "Règles et jeux"), h("div", { class: "meta" }, Object.keys(D.jeux).length + " jeux : 5.1 à 5.16")),
        h("a", { class: "tile r", href: "#/tour" }, h("b", {}, "Tour de contrôle"), h("div", { class: "meta" }, "Enseignant : PIN, partie, simulation, mode test"))),
      h("div", { class: "card" }, h("h2", {}, "Le plateau"), boardSvg([])),
      h("div", { class: "card" }, h("h2", {}, "Plateau physique à imprimer"), h("p", {}, h("a", { href: "Plateau_5_80x60.pdf" }, "Plateau 80 × 60 cm (5 versions : tables 1 à 5, plus une vierge)"), " · ", h("a", { href: "Plateau_5_A3.pdf" }, "A3 (essai)"), " · ", h("a", { href: "Plateau_5_pions.pdf" }, "Pions et jetons à découper (A4)"))));
  }
  function rules() {
    mount(h("h1", {}, "Règles du plateau"),
      h("div", { class: "card" }, h("ol", {},
        h("li", {}, "Un joueur = un étudiant, sur son téléphone ou son ordinateur. Une table réunit jusqu'à 5 joueurs autour du même plateau (tables 1 à 5) ; chaque joueur a son pion, de la couleur affichée sur son écran."),
        h("li", {}, "À tour de rôle, un joueur tire la carte pour la table. Tous répondent en même temps ; chaque réponse est corrigée seule et vaut 0 à 3 points."),
        h("li", {}, "1 à 3 points : votre pion avance d'autant de cases. 0 point : il recule d'une case (jamais avant le départ)."),
        h("li", {}, "Le pari : avant de valider, vous pouvez cocher « Je mise ». 3 points : +1 case de plus. 0 ou 1 point : −1 case de plus. 2 points : rien."),
        h("li", {}, "Selon la case où vous vous arrêtez, un effet se déclenche (légende ci-dessous). Les effets se règlent sur votre écran, quelques secondes."),
        h("li", {}, "Atelier d'outils : chaque jeu a son outil. Chaque outil essayé pose un jeton à votre couleur sur l'atelier du plateau."),
        h("li", {}, "La case 31 termine le niveau 1. Le niveau 2 (cases 32 à 62, jeux 5.9 à 5.16) est ouvert par l'enseignant. L'arrivée est la case 62, « Examen »."),
        h("li", {}, "La séance est chronométrée. Le score d'une table est la somme des cases atteintes par ses joueurs ; départage : les points."))),
      h("div", { class: "card" }, h("h2", {}, "Légende des cases"), legend()),
      h("div", { class: "card" }, h("h2", {}, "Les cinq zones du syllabus"), Object.keys(D.zones).map(function (z) { return h("p", {}, h("span", { class: "team", style: "background:" + D.zones[z].col }, z), D.zones[z].syl); })),
      h("div", {}, Object.keys(D.jeux).map(function (k) { var j = D.jeux[k], o = D.outils.filter(function (x) { return x.jeu === k; })[0]; return h("div", { class: "card" }, h("h2", {}, "Jeu " + k + " · " + j.titre), h("p", { class: "meta" }, "Zone " + j.zone + " · acte " + j.acte + " · niveau " + (j.acte > 3 ? 2 : 1) + " · " + j.duree + " min par carte environ"), h("p", {}, j.regle), o ? h("p", { class: "meta" }, "Outil du jeu : ", h("a", { href: o.url, target: "_blank", rel: "noopener" }, o.nom), " — " + o.tache) : null); })),
      h("p", {}, h("a", { href: "#/plateau" }, "← Retour")));
  }
  window.PLATEAU = { boardSvg: boardSvg, legend: legend, TS: TS, route: function (p) { var a = p[0] || ""; if (a === "regles") return rules(); return entry(); } };
  if ((location.hash || "").indexOf("#/plateau") === 0) window.dispatchEvent(new Event("hashchange"));
})();
