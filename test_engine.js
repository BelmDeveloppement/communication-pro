const E = require("./engine.js"); const fs = require("fs");
const D = JSON.parse(fs.readFileSync("../out/data.json", "utf8"));
let ok = 0; function check(c, m) { if (!c) { console.log("ÉCHEC:", m); process.exitCode = 1; } else ok++; }
// quiz
const items = E.itemsQuiz(D.quiz, 20); check(items.length === 20, "20 questions");
const fam = {}; items.forEach(i => fam[i.titre.split(" · ")[0]] = 1); check(Object.keys(fam).length >= 4, "familles variées");
const st = E.create("quiz", items, 45);
const t = []; for (let i = 0; i < 5; i++) t.push(E.join(st, "Eq" + i));
check(t.map(x => x.color.id).join() === "bleu,vert,orange,rouge,rose", "5 couleurs dans l'ordre");
check(E.join(st, "Six") === null, "6e équipe refusée");
check(E.start(st, 0), "démarrage");
const v0 = E.view(st); check(!("bonne" in v0.item) && v0.reveal === null, "pas de fuite avant révélation");
E.answer(st, t[0].id, st.items[0].bonne); E.answer(st, t[1].id, (st.items[0].bonne + 1) % 4);
check(!E.allAnswered(st), "pas tous répondu"); check(E.reveal(st), "révélation");
check(st.teams[t[0].id].score === st.items[0].scores[st.items[0].bonne] && st.teams[t[1].id].score === 0, "points");
let guard = 0; while (st.phase !== "end" && guard++ < 100) { if (st.phase === "reveal") E.next(st, 0); else { st.order.forEach(id => E.answer(st, id, st.items[st.idx].bonne)); E.reveal(st); } }
check(st.phase === "end", "fin de partie"); check(E.ranking(st)[0].score > 0, "classement");
// crise
const ci = E.itemsCrise(D.injects); check(ci.length === 10, "10 décisions");
const c = E.create("crise", ci, 240); check(c.max === 30, "max 30 = " + c.max);
const a = E.join(c, "A"); E.start(c, 0);
ci.forEach((it, i) => { E.answer(c, a.id, it.bonne); E.reveal(c); E.next(c, 0); });
check(c.teams[a.id].score === 30 && c.phase === "end", "score parfait 30"); check(E.ranking(c)[0].titre === "Porte-parole de l'année", "titre");
// répartition des bonnes réponses crise et quiz
const rc = [0,0,0,0]; ci.forEach(i => rc[i.bonne]++); const rq = [0,0,0,0]; D.quiz.forEach(q => rq[q.bonne]++);
console.log("bonnes réponses crise A-D:", rc.join("/"), "| quiz A-D:", rq.join("/"), "| tests ok:", ok);
