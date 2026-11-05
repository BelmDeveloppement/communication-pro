/* © 2026 SAS BELM DEVELOPPEMENT. Tous droits réservés. Créé avec l'aide de Claude (Anthropic), relu par l'auteur.
   Plateau « 5 · La route de l'état de l'art » : dessin du plateau (63 cases), page d'accueil et règles. Le jeu se joue sur #/j (joueurs) et #/tour (enseignant). */
(function () {
  "use strict";
  var A = window.APP, h = A.h, mount = A.mount, D = window.PLATEAU_DATA, NS = "http://www.w3.org/2000/svg";
  function sv(tag, attrs, text) { var e = document.createElementNS(NS, tag); Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); }); if (text !== undefined) e.textContent = text; return e; }
  function abbr(n) { var w = String(n || "?").trim(); return (w.slice(0, 1) || "?").toUpperCase(); }
  /* symbole et couleur de chaque type de case */
  var TS = { depart: ["▶", "#5B6478"], exam: ["★", "#1F2A5C"], gate: ["🔒", "#1F2A5C"], aleas: ["?", "#7A3FB5"], outil: ["⚙", "#0F8B8D"], piege: ["!", "#C0392B"], duel: ["VS", "#B8860B"], pairs: ["✎", "#8E5A2B"] };
  function zcol(c) { return (c.type === "jeu" || (c.zone && D.zones[c.zone])) ? D.zones[c.zone].col : (TS[c.type] || ["", "#5B6478"])[1]; }
  function glyph(c) { return c.type === "jeu" ? c.jeu : TS[c.type][0]; }

  /* Plateau 2D : le carré de la route (600 × 600 mm), y vers le haut comme sur le PDF */
  function boardSvg(pawns, opts) {
    opts = opts || {}; var s = sv("svg", { viewBox: "0 0 600 600", width: "100%", style: "background:#F3F5F9;border-radius:10px;display:block;max-height:" + (opts.max || 520) + "px" }), Y = function (y) { return 600 - y; };
    s.appendChild(sv("polyline", { points: D.cases.map(function (c) { return c.x + "," + Y(c.y); }).join(" "), fill: "none", stroke: "#B9C4E8", "stroke-width": 9, "stroke-linejoin": "round" }));
    s.appendChild(sv("text", { x: 300, y: 205, "font-size": 15, fill: "#5B6478", "text-anchor": "middle", "font-weight": 700 }, Object.keys(D.jeux).length + " JEUX, dans l'ordre du cours"));
    s.appendChild(sv("text", { x: 300, y: 225, "font-size": 15, fill: "#5B6478", "text-anchor": "middle", "font-weight": 700 }, "Départ case 0 · Arrivée case 62"));
    D.cases.forEach(function (c) {
      var g = sv("g", {}), big = c.type === "exam" || c.type === "depart" || c.type === "gate";
      g.appendChild(sv("circle", { cx: c.x, cy: Y(c.y), r: big ? 24 : 18, fill: zcol(c), stroke: "#fff", "stroke-width": 3 }));
      g.appendChild(sv("text", { x: c.x, y: Y(c.y) + (c.type === "jeu" ? 6 : 6), "font-size": c.type === "jeu" ? 16 : c.type === "duel" ? 13 : 17, fill: "#fff", "text-anchor": "middle", "font-weight": 800 }, c.type === "gate" ? "31" : glyph(c)));
      g.appendChild(sv("text", { x: c.x, y: Y(c.y) + (big ? 38 : 31), "font-size": 9, fill: "#5B6478", "text-anchor": "middle" }, c.type === "exam" ? "Examen" : c.type === "depart" ? "Départ" : c.type === "gate" ? "Mi-parcours" : c.type === "jeu" ? (D.jeux[c.jeu].court || "") : String(c.n)));
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
    var rows = [["jeu", "Case JEU (numéro = JEU du cours)", "Jalon du cours : l'enseignant ouvre le JEU, toute la classe le joue."], ["aleas", "Aléa", "Un événement de la vie professionnelle : +2, +1 ou −1 point."], ["outil", "Outil", "Un vrai outil à essayer 2 minutes ; réussi, il vous donne +1 point."], ["piege", "Piège", "Une question individuelle : une erreur coûte 1 point."], ["duel", "Duel", "Un adversaire d'une autre table, même question : le gagnant gagne 1 point, le perdant en perd 1."], ["pairs", "Relecture", "Un camarade de table relit vos critères cochés et donne son verdict (+1 point pour lui)."]];
    return h("table", {}, h("tr", {}, ["Symbole", "Case", "Effet"].map(function (t) { return h("th", {}, t); })), rows.map(function (r) { var c = r[0] === "jeu" ? { type: "jeu", jeu: "1", zone: "P1" } : { type: r[0] }; return h("tr", {}, h("td", {}, h("span", { class: "team", style: "background:" + zcol(c) }, glyph(c))), h("td", {}, r[1]), h("td", {}, r[2])); }));
  }

  function entry() {
    mount(h("h1", {}, "La route de l'état de l'art"),
      h("p", { class: "meta" }, "Un plateau de 63 cases pour 45 JEU, dans l'ordre du cours. L'enseignant ouvre un JEU à la fois ; chaque joueur coche ses critères sur son téléphone ou son ordinateur."),
      h("div", { class: "grid" }, h("a", { class: "tile", href: "#/j" }, h("b", {}, "Je suis un joueur"), h("div", { class: "meta" }, "Rejoindre la partie : prénom, numéro de table, code ROUTE")),
        h("a", { class: "tile f", href: "#/plateau/regles" }, h("b", {}, "Règles et jeux"), h("div", { class: "meta" }, Object.keys(D.jeux).length + " JEUX, numérotés de 1 à " + Object.keys(D.jeux).length)),
        h("a", { class: "tile r", href: "#/tour" }, h("b", {}, "Tour de contrôle"), h("div", { class: "meta" }, "Enseignant : PIN, partie, simulation, mode test"))),
      h("div", { class: "card" }, h("h2", {}, "Le plateau"), boardSvg([])),
      h("div", { class: "card" }, h("h2", {}, "Plateau physique à imprimer"), h("p", {}, h("a", { href: "Plateau_80x60.pdf?v=2" }, "Plateau unique 80 × 60 cm (le même pour les 5 tables)"))));
  }
  function rules() {
    mount(h("h1", {}, "Règles du plateau"),
      h("div", { class: "card" }, h("ol", {},
        h("li", {}, "Une table réunit jusqu'à 5 joueurs (tables 1 à 5) autour du même plateau et d'un seul pion. Chaque joueur répond sur son téléphone ou son ordinateur."),
        h("li", {}, "1 case = 1 JEU. Vous passez par toutes les cases : le pion est sur un JEU, la table le joue, puis le pion avance d'une case. L'enseignant ouvre les JEU au fil du cours : le pion ne dépasse pas le JEU ouvert."),
        h("li", {}, "Pour chaque JEU, chaque joueur coche les critères que sa production remplit : 0 à 3 points. Le pion avance quand toute la table a validé."),
        h("li", {}, "Le pari : avant de valider, vous pouvez cocher « Je mise ». 3 points : +1 point de plus. 0 ou 1 point : −1 point. 2 points : rien."),
        h("li", {}, "Les cases à effet (légende ci-dessous) se règlent sur votre écran, quelques secondes, et donnent ou retirent des points."),
        h("li", {}, "Cinq jauges de maîtrise, une par objectif : après chaque JEU, l'écran indique le nombre de jetons à poser (sur 10). En fin de séance : un niveau Débutant, Confirmé ou Expert par objectif."),
        h("li", {}, "Score de la table = somme des points de ses joueurs + bonus « table solidaire » (+1 quand tous ont au moins 2 points sur un JEU). La case 31 marque la mi-parcours, l'arrivée est la case 62."))),
      h("div", { class: "card" }, h("h2", {}, "Légende des cases"), legend()),
      h("div", { class: "card" }, h("h2", {}, "Les cinq zones du syllabus"), Object.keys(D.zones).map(function (z) { return h("p", {}, h("span", { class: "team", style: "background:" + D.zones[z].col }, z), D.zones[z].syl); })),
      h("div", {}, Object.keys(D.jeux).map(function (k) { var j = D.jeux[k], o = D.outils.filter(function (x) { return x.jeu === k; })[0]; return h("div", { class: "card" }, h("h2", {}, "Jeu " + k + " · " + j.titre), h("p", { class: "meta" }, "Bloc " + D.zones[j.zone].nom + " · " + j.mode), h("p", {}, j.regle), o ? h("p", { class: "meta" }, "Outil du jeu : ", h("a", { href: o.url, target: "_blank", rel: "noopener" }, o.nom), " — " + o.tache) : null); })),
      h("p", {}, h("a", { href: "#/plateau" }, "← Retour")));
  }
  window.PLATEAU = { boardSvg: boardSvg, legend: legend, TS: TS, route: function (p) { var a = p[0] || ""; if (a === "regles") return rules(); return entry(); } };
  if ((location.hash || "").indexOf("#/plateau") === 0) window.dispatchEvent(new Event("hashchange"));
})();
