var fs=require("fs"),vm=require("vm");
global.window={};vm.runInThisContext(fs.readFileSync("plateau-data.js","utf8"));
var PE=require("./plateau-engine.js");global.window.PEngine=PE;
var J=require("./jeu51-core.js");J.setData(window.PLATEAU_DATA);
var D=window.PLATEAU_DATA,n=0;function ok(c,m){n++;if(!c){console.log("FAIL",m);process.exitCode=1;}}
var G=J.newGame({}),t=1000;
var r=J.join(G,{sid:"a",nom:"Ana",table:"1"},t);ok(r.ok&&r.player.col==="#3B6FD8","join1");
ok(!J.join(G,{sid:"x",nom:"X",table:"9"},t).ok,"table 9");
ok(!J.join(G,{sid:"x",nom:"",table:"1"},t).ok,"nom vide");
for(var i=0;i<4;i++)ok(J.join(G,{sid:"p"+i,nom:"P"+i,table:"T1"},t).ok,"join p"+i);
ok(!J.join(G,{sid:"z",nom:"Zed",table:"1"},t).ok,"table pleine");
var rb=J.join(G,{sid:"new",nom:"ana",table:"1"},t);ok(rb.rebound&&rb.player.sid==="a","reprise par prénom");
ok(!J.canDraw(G,"a",t),"pas avant lancement");
J.start(G,t);ok(J.canDraw(G,"a",t)&&!J.canDraw(G,"p0",t),"tireur=Ana");
ok(J.draw(G,"a",t+1),"draw");ok(!J.draw(G,"a",t+2),"double draw refusé");
var T=G.tables.T1,c=J.cardOf(T.cur.jeu,T.cur.id);
J.answer(G,"a",c.modele,t+5);ok(T.cur,"round ouvert");ok(!J.answer(G,"a","x",t+6),"double réponse");
["p0","p1","p2"].forEach(function(s){J.answer(G,s,"rien",t+7)});ok(T.cur,"attend p3");
J.answer(G,"p3",c.modele,t+9);ok(!T.cur&&T.last,"round clos");
ok(G.players.a.pos===3&&G.players.p0.pos===0,"avance de pts");
ok(J.canDraw(G,"p0",t+10)&&!J.canDraw(G,"a",t+10),"tireur tourne");
var S=J.stats(G,t+10);ok(S.tables[0].sum===6,"somme table = "+S.tables[0].sum);ok(S.crit["guillemets"],"critere guillemets");
ok(J.snapshot(G,"a",t+10).table.players.length===5,"snap");
J.draw(G,"p0",t+11);J.tick(G,t+11+400000);ok(!G.tables.T1.cur,"timeout clôture");
J.tick(G,t+31*60000);ok(G.status==="ended"&&!J.canDraw(G,"p1",t+31*60000),"fin séance");
JSON.parse(JSON.stringify(G));console.log(n+" assertions");
// --- cartes supplémentaires et jeu suivant
var G2=J.newGame({}),t2=5000;J.join(G2,{sid:"a",nom:"A",table:"1"},t2);J.start(G2,t2);
var seen={};for(var k=0;k<8;k++){J.draw(G2,"a",t2);var cu=G2.tables.T1.cur;seen[cu.id]=1;ok(+cu.id<=8,"base seulement "+cu.id);J.answer(G2,"a","x",t2);G2.players.a.last=t2;}
ok(Object.keys(seen).length===8,"8 cartes de base distinctes");
J.setExtra(G2,true);var ex=0;for(var k=0;k<12;k++){J.draw(G2,"a",t2);ex+= +G2.tables.T1.cur.id>8?1:0;J.answer(G2,"a","x",t2);}
ok(ex>=10,"cartes supplémentaires tirées : "+ex);
ok(J.nextJeu(G2,1)==="5.2"&&G2.jeux[0]==="5.2","jeu suivant");ok(J.nextJeu(G2,-1)==="5.1"&&J.nextJeu(G2,-1)==="5.1","jeu précédent borné");
J.nextJeu(G2,1);J.draw(G2,"a",t2);ok(G2.tables.T1.cur.jeu==="5.2","tirage 5.2");
console.log(n+" assertions (total)");
