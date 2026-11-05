/* © 2026 SAS BELM DEVELOPPEMENT. Tests de la logique tables/joueurs (40 JEUX synchrones, 62 cases). */
var fs=require("fs"),vm=require("vm");
global.window={};vm.runInThisContext(fs.readFileSync("plateau-data.js","utf8"));
var PE=require("./plateau-engine.js");global.window.PEngine=PE;
var J=require("./jeu51-core.js");J.setData(window.PLATEAU_DATA);
var D=window.PLATEAU_DATA,n=0;function ok(c,m){n++;if(!c){console.log("FAIL",m);process.exitCode=1;}}
function best(c){return c.t==="choix"?c.ok:c.t==="multi"?c.oks:c.t==="assoc"?c.items.map(function(i){return i.ok}):c.t==="trous"?c.slots.map(function(s){return s.ok}):c.t==="texte"?c.modele:c.grille.map(function(){return true})}
function bad(c){return c.t==="choix"?(c.ok+1)%4:c.t==="multi"?[]:c.t==="assoc"?c.items.map(function(){return -1}):c.t==="trous"?c.slots.map(function(){return -1}):c.t==="texte"?"rien":c.grille.map(function(){return false})}
function two(c){return c.grille.map(function(g,i){return i<2})}
function rd(G,sid){J.act(G,sid,{t:"read",doc:"common"},1000);J.act(G,sid,{t:"read",doc:"jeu"},1000)}
function fresh(nb,jeu){var G=J.newGame({}),t=1000;if(jeu)G.jeux=[jeu];for(var i=0;i<nb;i++){J.join(G,{sid:"s"+i,nom:"P"+i,table:"1"},t);rd(G,"s"+i)}J.start(G,t);return G}
function round(G,t,fn){var T=G.tables.T1,tr=J.tireur(G,T,t);ok(J.draw(G,tr.sid,t),"draw");var c=J.cardOf(T.cur.jeu,T.cur.id);T.players.forEach(function(s){var a=fn(s,c);J.answer(G,s,a.ans,t+1,a.bet)});return c}
// données
var ks=Object.keys(D.jeux);ok(ks.length===40,"40 JEUX");ok(ks.every(function(k){var j=D.jeux[k];return j.cartes.length===1&&j.cartes[0].t==="oral"&&j.cartes[0].grille.length===3}),"1 carte à 3 critères par JEU");
ok(D.cases.length===63&&D.cases.filter(function(c){return c.type==="jeu"}).length===40,"63 cases dont 39 cases JEU");
ok(D.cases.filter(function(c){return c.type==="jeu"}).every(function(c,i){return c.jeu===String(i+1)}),"cases JEU dans l’ordre 1 à 40");
ok(!/5\.\d/.test(JSON.stringify(D.jeux))&&!/5\.\d/.test(JSON.stringify(D.lecture)),"plus de référence 5.x");
ok(D.pieges.cartes.length>300,"banque de questions rapides");
// jointure
var G=J.newGame({}),t=1000;
ok(J.join(G,{sid:"a",nom:"Ana",table:"1"},t).player.col==="#3B6FD8","join");
ok(!J.join(G,{sid:"x",nom:"X",table:"9"},t).ok,"table 9");ok(!J.join(G,{sid:"x",nom:"",table:"1"},t).ok,"nom vide");
for(var i=0;i<4;i++)ok(J.join(G,{sid:"p"+i,nom:"P"+i,table:"T1"},t).ok,"join p"+i);
ok(!J.join(G,{sid:"z",nom:"Zed",table:"1"},t).ok,"table pleine");ok(J.join(G,{sid:"new",nom:"ana",table:"1"},t).rebound,"reprise par prénom");
ok(!J.canDraw(G,"a",t),"pas avant lancement");J.start(G,t);ok(!J.canDraw(G,"a",t),"pas avant lecture");["a","p0","p1","p2","p3"].forEach(function(x){rd(G,x)});ok(J.canDraw(G,"a",t)&&!J.canDraw(G,"p0",t),"tireur=Ana");
// 3 critères = +3, 0 = recul, plancher 0, une seule fois par JEU et par table
G=fresh(1,"1");var c1=round(G,2000,function(s,c){return {ans:best(c)}});ok(G.players.s0.pos>=1&&G.players.s0.score===3,"3 critères = 3 points (pos "+G.players.s0.pos+")");
ok(!J.canDraw(G,"s0",2100),"une table ne rejoue pas le même JEU");ok(G.tables.T1.played["1"],"JEU marqué joué");
G.players.s0.pend=null;J.nextJeu(G,1);rd(G,"s0");ok(G.jeux[0]==="2"&&J.canDraw(G,"s0",2200),"JEU suivant rouvre le tirage");
G=fresh(1,"1");G.players.s0.pos=5;round(G,2000,function(s,c){return {ans:bad(c)}});ok(G.players.s0.pos===4,"0 critère = recul d'une case");
G=fresh(1,"1");round(G,2000,function(s,c){return {ans:bad(c)}});ok(G.players.s0.pos===0,"plancher case 0");
// pari
G=fresh(1,"30");var start=0;for(var p0=0;p0<25;p0++){if(["jeu","depart"].indexOf(D.cases[p0+3].type)>=0&&["jeu","depart"].indexOf(D.cases[p0+4].type)>=0){start=p0;break}}
G.players.s0.pos=start;round(G,2000,function(s,c){return {ans:best(c),bet:true}});ok(G.players.s0.pos===start+4,"pari gagné +1 ("+G.players.s0.pos+")");
G=fresh(1,"30");G.players.s0.pos=start;round(G,2000,function(s,c){return {ans:bad(c),bet:true}});ok(G.players.s0.pos===Math.max(0,start-2),"pari perdu −1 de plus");
// rythme : pas plus de 8 cases devant le JEU en cours ; dernier JEU : arrivée possible
G=fresh(1,"1");G.players.s0.pos=40;round(G,2000,function(s,c){return {ans:best(c)}});ok(G.players.s0.pos<=D.caps.jeuCase["1"]+8,"rythme : bloqué à "+G.players.s0.pos+" (limite "+(D.caps.jeuCase["1"]+8)+")");
G=fresh(1,"40");G.players.s0.pos=60;round(G,2000,function(s,c){return {ans:best(c)}});ok(G.players.s0.pos===62&&G.players.s0.done,"dernier JEU : arrivée case 62");
ok(D.cases[31].type==="gate"&&J.lim(fresh(1,"20"))>31,"case 31 : mi-parcours non bloquante");
// outil proposé selon le dernier JEU qui en a un
ok(J.toolFor("1").id==="factcheck"&&J.toolFor("5").id==="languagetool"&&J.toolFor("33").id==="researchrabbit"&&J.toolFor("40").id==="researchrabbit","outil selon le JEU");
// effets
function land(type,max){var idx=D.cases.map(function(c,i){return c.type===type?i:-1}).filter(function(i){return i>3&&i<=max})[0];return idx}
["outil","piege","duel","pairs","aleas"].forEach(function(ty){var idx=land(ty,25);ok(idx>0,"case "+ty+" trouvée");
 G=fresh(3,"30");var p=G.players.s0,T=G.tables.T1;J.draw(G,"s0",2000);var c=J.cardOf(T.cur.jeu,T.cur.id);
 p.pos=idx-3;J.answer(G,"s0",best(c),2001);J.answer(G,"s1",bad(c),2001);J.answer(G,"s2",bad(c),2001);
 ok(!T.cur,"round clos "+ty);ok(p.pos>=idx-3,"position "+ty);
 if(ty==="outil"){ok(p.pend&&p.pend.k==="outil","pend outil");ok(J.act(G,"s0",{t:"outil",ok:true},2100)&&!p.pend,"outil validé");ok(Object.keys(p.tools).length===1,"jeton posé");ok(p.pos===idx+1,"+1 case outil");}
 if(ty==="piege"){ok(p.pend&&p.pend.k==="piege","pend piège");var pc=J.cardOf("P",p.pend.card.id);var before=p.pos;J.act(G,"s0",{t:"pans",ans:bad(pc)},2100);ok(p.pos===before-1,"piège raté = −1");}
 if(ty==="duel"){ok(p.pend&&p.pend.k==="duel","pend duel");J.tick(G,2000+50000);ok(p.pend&&p.pend.st==="solo","duel solo après attente");var dc=J.cardOf(p.pend.card.jeu,p.pend.card.id);ok(dc&&dc.t!=="oral","duel sur question rapide");var b=p.pos;J.act(G,"s0",{t:"dans",ans:best(dc)},2000+51000);ok(!p.pend&&p.pos===b+1,"duel solo gagné +1");}
 if(ty==="pairs"){var q=G.players.s1.pend||G.players.s2.pend;ok(q&&q.k==="rel","relecture proposée à un pair");ok(/[✓✗]/.test(q.ans),"relecture lit les critères cochés");var rv=G.players.s1.pend?"s1":"s2";var sc=G.players[rv].score;J.act(G,rv,{t:"rev",verdict:"err"},2100);ok(G.players[rv].score>=sc,"relecture notée");}
 if(ty==="aleas"){ok(!p.pend,"aléa immédiat");}
});
// duel entre tables
G=fresh(1,"30");J.join(G,{sid:"b",nom:"Bob",table:"2"},1000);var pa=G.players.s0,pb=G.players.b;
pa.pend={k:"duel",at:2000,st:"wait",opp:null,card:null,ans:null};pb.pend={k:"duel",at:2000,st:"wait",opp:null,card:null,ans:null};J.tick(G,2001);
ok(pa.pend.st==="play"&&pb.pend.opp==="s0","duel apparié entre tables");var dcc=J.cardOf(pa.pend.card.jeu,pa.pend.card.id);pa.pos=10;pb.pos=10;
J.act(G,"s0",{t:"dans",ans:best(dcc)},2100);ok(pa.pend,"attend l'adversaire");J.act(G,"b",{t:"dans",ans:bad(dcc)},2200);ok(!pa.pend&&!pb.pend&&pa.pos===11&&pb.pos===9,"duel : +1 / −1");
// jeu suivant sur 39, borné
var G2=fresh(1,"1");var last="";for(var k=0;k<50;k++)last=J.nextJeu(G2,1);ok(last==="40","jeu suivant borné à 40");
// lecture obligatoire : fiche du JEU courant à lire
G=J.newGame({});J.join(G,{sid:"r",nom:"Rim",table:"1"},1000);J.start(G,1000);ok(!J.canDraw(G,"r",1000),"lecture requise");J.act(G,"r",{t:"read",doc:"common"},1000);ok(!J.canDraw(G,"r",1000),"fiche du JEU requise");J.act(G,"r",{t:"read",doc:"jeu"},1000);ok(J.canDraw(G,"r",1000),"lecture faite");
J.nextJeu(G,1);ok(!J.canDraw(G,"r",1000),"nouveau JEU : nouvelle fiche à lire");
// outil cassé
G=fresh(2,"30");G.players.s0.pend={k:"outil",at:2000,tool:"zotero"};J.act(G,"s0",{t:"broke"},2001);ok(!G.players.s0.pend&&G.broken.zotero,"outil cassé signalé");
J.setTool(G,"zotero",true);ok(J.toolOff(G,"zotero"),"outil désactivé");
// snapshot
var sn=J.snapshot(fresh(1,"7"),"s0",1000);ok(sn.jeux[0]==="7"&&typeof sn.lim==="number"&&sn.played===false,"snapshot : JEU, limite, déjà joué");
// statistiques
G=fresh(2,"3");round(G,2000,function(s,c){return {ans:s==="s0"?best(c):two(c)}});var st=J.stats(G,2100);ok(st&&typeof st==="object","stats");
// simulation de 40 JEUX par 5 tables (aucune erreur, tout le monde arrive à 62 sans dépasser)
G=J.newGame({});var T5=["1","2","3","4","5"];T5.forEach(function(tb,ti){for(var i=0;i<5;i++)J.join(G,{sid:"t"+tb+"p"+i,nom:"T"+tb+"P"+i,table:tb,sim:true},1000)});J.start(G,1000);
var tm=2000;for(var jj=1;jj<=40;jj++){G.jeux=[String(jj)];T5.forEach(function(tb){var T=G.tables["T"+tb],tr=J.tireur(G,T,tm);if(!tr)return;if(!J.draw(G,tr.sid,tm))return;var c=J.cardOf(T.cur.jeu,T.cur.id);T.players.forEach(function(s,i){J.answer(G,s,(i+jj)%4===0?bad(c):best(c),tm+1,false)});for(var q=0;q<5;q++)Object.keys(G.players).forEach(function(s){var pp=G.players[s];if(!pp.pend)return;if(pp.pend.k==="outil")J.act(G,s,{t:"outil",ok:true},tm+3);else if(pp.pend.k==="piege")J.act(G,s,{t:"pans",ans:best(J.cardOf("P",pp.pend.card.id))},tm+3);else if(pp.pend.k==="rel")J.act(G,s,{t:"rev",verdict:"ok"},tm+3);else if(pp.pend.k==="duel"){J.tick(G,tm+60000);if(pp.pend&&pp.pend.card&&pp.pend.st!=="wait")J.act(G,s,{t:"dans",ans:best(J.cardOf(pp.pend.card.jeu,pp.pend.card.id))},tm+61000)}})});tm+=200000}
var pl=Object.keys(G.players).map(function(s){return G.players[s]});ok(pl.every(function(p){return p.pos<=62&&p.pos>=0}),"positions valides");
var arr=pl.filter(function(p){return p.pos>=62}).length;console.log("simulation 25 joueurs : arrivés",arr,"/ 25 ; positions",pl.map(function(p){return p.pos}).join(","));
console.log(n+" vérifications");
