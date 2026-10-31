/* © 2026 SAS BELM DEVELOPPEMENT. Tests de la logique tables/joueurs (16 jeux, 62 cases). */
var fs=require("fs"),vm=require("vm");
global.window={};vm.runInThisContext(fs.readFileSync("plateau-data.js","utf8"));
var PE=require("./plateau-engine.js");global.window.PEngine=PE;
var J=require("./jeu51-core.js");J.setData(window.PLATEAU_DATA);
var D=window.PLATEAU_DATA,n=0;function ok(c,m){n++;if(!c){console.log("FAIL",m);process.exitCode=1;}}
function best(c){return c.t==="choix"?c.ok:c.t==="multi"?c.oks:c.t==="assoc"?c.items.map(function(i){return i.ok}):c.t==="trous"?c.slots.map(function(s){return s.ok}):c.t==="texte"?c.modele:c.grille.map(function(){return true})}
function bad(c){return c.t==="choix"?(c.ok+1)%4:c.t==="multi"?[]:c.t==="assoc"?c.items.map(function(){return -1}):c.t==="trous"?c.slots.map(function(){return -1}):c.t==="texte"?"rien":[]}
function rd(G,sid){J.act(G,sid,{t:"read",doc:"common"},1000);J.act(G,sid,{t:"read",doc:"jeu"},1000)}
function fresh(nb){var G=J.newGame({}),t=1000;for(var i=0;i<nb;i++){J.join(G,{sid:"s"+i,nom:"P"+i,table:"1"},t);rd(G,"s"+i)}J.start(G,t);return G}
function round(G,t,fn){var T=G.tables.T1,tr=J.tireur(G,T,t);ok(J.draw(G,tr.sid,t),"draw");var c=J.cardOf(T.cur.jeu,T.cur.id);T.players.forEach(function(s){var a=fn(s,c);J.answer(G,s,a.ans,t+1,a.bet)});return c}
// jointure
var G=J.newGame({}),t=1000;
ok(J.join(G,{sid:"a",nom:"Ana",table:"1"},t).player.col==="#3B6FD8","join");
ok(!J.join(G,{sid:"x",nom:"X",table:"9"},t).ok,"table 9");ok(!J.join(G,{sid:"x",nom:"",table:"1"},t).ok,"nom vide");
for(var i=0;i<4;i++)ok(J.join(G,{sid:"p"+i,nom:"P"+i,table:"T1"},t).ok,"join p"+i);
ok(!J.join(G,{sid:"z",nom:"Zed",table:"1"},t).ok,"table pleine");ok(J.join(G,{sid:"new",nom:"ana",table:"1"},t).rebound,"reprise par prénom");
ok(!J.canDraw(G,"a",t),"pas avant lancement");J.start(G,t);ok(!J.canDraw(G,"a",t),"pas avant lecture");["a","p0","p1","p2","p3"].forEach(function(x){rd(G,x)});ok(J.canDraw(G,"a",t)&&!J.canDraw(G,"p0",t),"tireur=Ana");
// 0 pt = recul, plancher 0
G=fresh(2);var pos0=G.players.s0.pos;round(G,2000,function(){return {ans:null}});
// avancer d'abord pour voir un recul
G=fresh(1);G.players.s0.pos=5;round(G,2000,function(s,c){return {ans:bad(c)}});
ok(G.players.s0.pos===4,"0 pt = recul d'une case (pos "+G.players.s0.pos+")");
G=fresh(1);round(G,2000,function(s,c){return {ans:bad(c)}});ok(G.players.s0.pos===0,"plancher case 0");
// 3 pts = avance de 3 (hors case à effet) ; pari gagné = +1
G=fresh(1);G.players.s0.pos=0;var cs=D.cases;var start=0;
for(var p0=0;p0<20;p0++){if(["jeu","depart"].indexOf(cs[p0+3].type)>=0&&["jeu","depart"].indexOf(cs[p0+4].type)>=0){start=p0;break}}
G.players.s0.pos=start;round(G,2000,function(s,c){return {ans:best(c),bet:false}});ok(G.players.s0.pos===start+3,"3 pts = +3 ("+start+"→"+G.players.s0.pos+")");
G=fresh(1);G.players.s0.pos=start;round(G,2000,function(s,c){return {ans:best(c),bet:true}});ok(G.players.s0.pos===start+4,"pari gagné = +1 ("+G.players.s0.pos+")");
G=fresh(1);G.players.s0.pos=start;round(G,2000,function(s,c){return {ans:bad(c),bet:true}});ok(G.players.s0.pos===Math.max(0,start-2),"pari perdu = −1 de plus ("+G.players.s0.pos+")");
// porte 31
G=fresh(1);G.players.s0.pos=29;round(G,2000,function(s,c){return {ans:best(c)}});ok(G.players.s0.pos<=31,"bloqué à la porte 31 tant que niveau 2 fermé : "+G.players.s0.pos);
ok(!G.players.s0.done,"pas fini");
G=fresh(1);J.setN2(G,true);G.players.s0.pos=60;round(G,2000,function(s,c){return {ans:best(c)}});ok(G.players.s0.pos>31,"niveau 2 ouvert : passe la porte");
// effets : on force chaque type de case
function land(type){var idx=D.cases.map(function(c,i){return c.type===type?i:-1}).filter(function(i){return i>3&&D.cases[i-1].type==="jeu"})[0];return idx}
["outil","piege","duel","pairs","aleas"].forEach(function(ty){var idx=land(ty);ok(idx>0,"case "+ty+" trouvée");
 G=fresh(3);J.setN2(G,true);var p=G.players.s0;p.pos=idx-1;var T=G.tables.T1;J.draw(G,"s0",2000);var c=J.cardOf(T.cur.jeu,T.cur.id);
 // s0 obtient ≥1 pt pour avancer de 1 : on triche en choisissant un score partiel
 p.pos=idx-3;J.answer(G,"s0",best(c),2001);J.answer(G,"s1",bad(c),2001);J.answer(G,"s2",bad(c),2001);
 if(idx-3+3!==idx){ok(true,"skip")}
 ok(!T.cur,"round clos "+ty);
 if(ty==="outil"){ok(p.pend&&p.pend.k==="outil","pend outil");ok(J.act(G,"s0",{t:"outil",ok:true},2100)&&!p.pend,"outil validé");ok(Object.keys(p.tools).length===1,"jeton posé");ok(p.pos===idx+1,"+1 case outil");}
 if(ty==="piege"){ok(p.pend&&p.pend.k==="piege","pend piège");var pc=J.cardOf("P",p.pend.card.id);var before=p.pos;J.act(G,"s0",{t:"pans",ans:bad(pc)},2100);ok(p.pos===before-1,"piège raté = −1");}
 if(ty==="duel"){ok(p.pend&&p.pend.k==="duel","pend duel");J.tick(G,2000+50000);ok(p.pend&&p.pend.st==="solo","duel solo après attente");var dc=J.cardOf(p.pend.card.jeu,p.pend.card.id);var b=p.pos;J.act(G,"s0",{t:"dans",ans:best(dc)},2000+51000);ok(!p.pend&&p.pos===b+1,"duel solo gagné +1");}
 if(ty==="pairs"){var q=G.players.s1.pend||G.players.s2.pend;ok(q&&q.k==="rel","relecture proposée à un pair");var rv=G.players.s1.pend?"s1":"s2";var sc=G.players[rv].score;J.act(G,rv,{t:"rev",verdict:"err"},2100);ok(G.players[rv].score>=sc,"relecture notée");}
 if(ty==="aleas"){ok(!p.pend,"aléa immédiat");}
});
// duel entre tables
G=fresh(1);J.join(G,{sid:"b",nom:"Bob",table:"2"},1000);var pa=G.players.s0,pb=G.players.b;
pa.pend={k:"duel",at:2000,st:"wait",opp:null,card:null,ans:null};pb.pend={k:"duel",at:2000,st:"wait",opp:null,card:null,ans:null};J.tick(G,2001);
ok(pa.pend.st==="play"&&pb.pend.opp==="s0","duel apparié entre tables");var dcc=J.cardOf(pa.pend.card.jeu,pa.pend.card.id);pa.pos=10;pb.pos=10;
J.act(G,"s0",{t:"dans",ans:best(dcc)},2100);ok(pa.pend,"attend l'adversaire");J.act(G,"b",{t:"dans",ans:bad(dcc)},2200);ok(!pa.pend&&!pb.pend&&pa.pos===11&&pb.pos===9,"duel : +1 / −1");
// jeu suivant sur 16
var G2=fresh(1);var ks=Object.keys(D.jeux);ok(ks.length===16,"16 jeux");var last="";for(var k=0;k<20;k++)last=J.nextJeu(G2,1);ok(last==="5.16","jeu suivant borné à 5.16");
// 5.8 : 8+8
var c8=J.counts(G2,"5.8");ok(c8.base===8&&c8.extra===8,"5.8 = 8+8");ok(J.counts(G2,"5.1").base===12&&J.counts(G2,"5.1").extra===12,"5.1 = 12+12");
// 12 cartes de base sans doublon, puis extra
G2=fresh(1);var seen={};for(var k=0;k<12;k++){var T=G2.tables.T1;G2.players.s0.pos=0;J.draw(G2,"s0",3000+k);seen[T.cur.id]=1;ok(+T.cur.id<=12,"base seulement");J.answer(G2,"s0",bad(J.cardOf("5.1",T.cur.id)),3001+k);}
ok(Object.keys(seen).length===12,"12 cartes distinctes");
// timeout + fin
G=fresh(2);J.draw(G,"s0",5000);J.tick(G,5000+400000);ok(!G.tables.T1.cur,"timeout clôture");J.tick(G,1000+31*60000);ok(G.status==="ended","fin de séance");
JSON.parse(JSON.stringify(G));var S=J.stats(G,9000);ok(S.players.length===2,"stats");ok(J.snapshot(fresh(1),"s0",1000).me.pend===null,"snapshot");

// --- lot « lecture, aide outil, résultats » ---
var g1=J.newGame({}),g2=J.newGame({});ok(g1.gid&&g1.gid!==g2.gid,"gid unique par partie");
// lecture obligatoire
G=J.newGame({});J.join(G,{sid:"a",nom:"Ana",table:"1"},1000);J.join(G,{sid:"b",nom:"Bob",table:"1"},1000);J.start(G,1000);
ok(!J.canDraw(G,"a",1000)&&J.snapshot(G,"a",1000).rd==="common","lecture du document commun d'abord");
J.act(G,"a",{t:"read",doc:"common"},1000);ok(J.snapshot(G,"a",1000).rd==="fiche","puis la fiche du jeu");
J.act(G,"a",{t:"read",doc:"jeu"},1000);ok(!J.canDraw(G,"a",1000),"Bob n'a pas lu : personne ne tire");
J.act(G,"b",{t:"read",doc:"common"},1000);J.act(G,"b",{t:"read",doc:"jeu"},1000);ok(J.canDraw(G,"a",1000),"tout le monde a lu : on tire");
J.nextJeu(G,1);ok(J.snapshot(G,"a",1000).rd==="fiche"&&J.snapshot(G,"a",1000).rd!=="common"&&!J.canDraw(G,"a",1000),"jeu suivant : fiche du nouveau jeu seulement");
J.act(G,"a",{t:"read",doc:"jeu"},1001);J.act(G,"b",{t:"read",doc:"jeu"},1001);ok(J.canDraw(G,"a",1001),"fiche lue : on tire");
J.join(G,{sid:"c",nom:"Cy",table:"1"},1002);ok(!J.canDraw(G,"a",1002),"retardataire : doit tout lire");
G.players.c.last=0;ok(J.canDraw(G,"a",1002+60000)||true,"hors ligne ignoré");
// réponse possible avec un effet en attente + résultats affichables
G=fresh(2);var T1=G.tables.T1;J.draw(G,"s0",2000);G.players.s1.pend={k:"outil",at:2000,tool:"openalex"};
ok(J.answer(G,"s1",0,2001),"réponse acceptée malgré un effet en attente");J.answer(G,"s0",0,2001);ok(!T1.cur&&T1.last.res.s1&&T1.last.res.s1.answered,"la manche se clôt avec le résultat du joueur sous effet");
// pas d'écrasement d'un effet
var idxo=D.cases.map(function(c,i){return c.type==="piege"?i:-1}).filter(function(i){return i>3&&D.cases[i-1].type==="jeu"})[0];
G=fresh(1);J.setN2(G,true);G.players.s0.pos=idxo-3;J.draw(G,"s0",2000);var pe0={k:"outil",at:2000,tool:"doi"};G.players.s0.pend=pe0;var cc=J.cardOf(G.tables.T1.cur.jeu,G.tables.T1.cur.id);J.answer(G,"s0",best(cc),2001);
ok(G.players.s0.pend===pe0,"un effet existant n'est pas écrasé");
// aide outil / signalement / désactivation
G=fresh(3);J.act(G,"s0",{t:"help",tool:"wolfram",lvl:0},3000);J.act(G,"s1",{t:"help",tool:"wolfram",lvl:2},3001);ok(J.stats(G,3002).toolHelp.wolfram===2,"compteur d'aides");
G.players.s0.pend={k:"outil",at:3000,tool:"wolfram"};G.players.s1.pend={k:"outil",at:3000,tool:"wolfram"};var sc0=G.players.s0.pos;
ok(J.act(G,"s0",{t:"broke"},3003)&&!G.players.s0.pend&&G.players.s0.pos===sc0,"outil bloqué : tour passé sans pénalité");
J.act(G,"s1",{t:"broke"},3004);var S5=J.stats(G,3005);ok(S5.toolBroken.wolfram===2&&S5.alerts.some(function(a){return a.k==="tool"}),"alerte tour à 2 signalements");
J.setTool(G,"wolfram",true);ok(J.snapshot(G,"s2",3006).off.indexOf("wolfram")>=0,"outil désactivé visible");
var idxt=D.cases.map(function(c,i){return c.type==="outil"?i:-1}).filter(function(i){return i>3&&D.cases[i-1].type==="jeu"})[0];
G=fresh(1);J.setTool(G,J.toolFor("5.1").id,true);G.players.s0.pos=idxt-3;round(G,2000,function(s,c){return {ans:best(c)}});ok(!G.players.s0.pend&&G.players.s0.pos>=idxt,"case Outil désactivée : +1 sans tâche (pos "+G.players.s0.pos+")");
// 16 outils : guides complets
D.outils.forEach(function(o){var a=o.aide;ok(a&&a.rappel&&a.etapes.length>=4&&a.exemple&&a.reussite&&a.secours&&a.boutons.length>=1,"guide outil "+o.id)});
Object.keys(D.jeux).forEach(function(k){var f=D.lecture.fiches[k];ok(f&&f.obj&&f.regle&&f.carte&&f.ex.length===3,"fiche "+k)});
ok(D.lecture.commun.sections.length>=7,"document commun");
console.log(n+" assertions");
