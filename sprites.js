/* BIOEVO SPRITES — procedural pixel art. No PNGs, no external assets. */
(()=>{
  'use strict';
  const S=window.BioSprites={};
  const TAU=Math.PI*2;
  function C(ctx,c){ctx.fillStyle=c;return ctx;}
  function R(ctx,x,y,w,h,c){C(ctx,c).fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));}
  function E(ctx,x,y,rx,ry,c){C(ctx,c);ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fill();}
  function L(ctx,x1,y1,x2,y2,c,w=1){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
  function P(ctx,pts,c){C(ctx,c);ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath();ctx.fill();}
  function shade(c,d=-20){const n=parseInt(c.slice(1),16);const r=Math.max(0,Math.min(255,(n>>16&255)+d));const g=Math.max(0,Math.min(255,(n>>8&255)+d));const b=Math.max(0,Math.min(255,(n&255)+d));return `rgb(${r},${g},${b})`;}
  function hi(c,d=28){return shade(c,d);}
  S.shadow=function(ctx,x,y,w,h){ctx.save();ctx.globalAlpha=.20;E(ctx,x,y,w,h,'#000');ctx.restore();};
  S.pixelRect=function(ctx,x,y,w,h,c){R(ctx,x,y,w,h,c);R(ctx,x+1,y-1,w-2,1,hi(c,24));};
  S.drawPlayer=function(ctx,x,y,size,g,opt={}){const face=opt.facing||1;ctx.save();ctx.translate(x,y);ctx.scale(face,1);ctx.imageSmoothingEnabled=false;const c=g.color||'#7a9b4c';const d=shade(c,-28);const l=hi(c,32);if(opt.shadow!==false)S.shadow(ctx,0,size*.36,size*.55,size*.14);if(g.body==='fish')drawFish(ctx,size,c,d,l,g,opt);else if(g.body==='bird')drawBird(ctx,size,c,d,l,g,opt);else drawBeast(ctx,size,c,d,l,g,opt);ctx.restore();};
  function eye(ctx,x,y,r){E(ctx,x,y,r,'#edf7dc');E(ctx,x+.5,y,r*.52,'#121a13');R(ctx,x+.5,y-r*.7,1,1,'#fff');}
  function drawBeast(ctx,s,c,d,l,g,o){const k=s; E(ctx,-k*.05,0,k*.47,k*.26,d); E(ctx,-k*.02,-k*.01,k*.43,k*.22,c); E(ctx,k*.39,-k*.18,k*.23,k*.20,l); R(ctx,-k*.32,k*.14,k*.07,k*.24,d); R(ctx,-k*.09,k*.14,k*.07,k*.25,d); R(ctx,k*.20,k*.10,k*.08,k*.27,d); R(ctx,k*.42,k*.06,k*.07,k*.24,d); P(ctx,[[-k*.42,-k*.08],[-k*.62,-k*.28],[-k*.58,-k*.03]],d); eye(ctx,k*.46,-k*.22,k*.035); P(ctx,[[k*.54,-k*.08],[k*.69,-k*.03],[k*.55,k*.02]],'#5a3a25'); if(g.thorns>0){for(let i=0;i<4;i++)P(ctx,[[-k*.18+i*k*.10,-k*.20],[-k*.12+i*k*.10,-k*.39],[-k*.05+i*k*.10,-k*.20]],d);} if(g.camouflage>12)R(ctx,-k*.20,-k*.06,k*.24,k*.08,shade(c,-8)); if(o.attack)L(ctx,k*.62,-k*.04,k*.85,-k*.16,'#f2dfc1',2);}
  function drawFish(ctx,s,c,d,l,g,o){const k=s;E(ctx,-k*.03,0,k*.50,k*.25,c);P(ctx,[[-k*.46,0],[-k*.78,-k*.22],[-k*.78,k*.22]],l);P(ctx,[[0,-k*.16],[k*.17,-k*.39],[k*.22,-k*.13]],d);P(ctx,[[0,k*.16],[k*.17,k*.39],[k*.22,k*.13]],d);eye(ctx,k*.30,-k*.07,k*.035);L(ctx,-k*.18,0,k*.22,0,shade(c,-18),1);}
  function drawBird(ctx,s,c,d,l,g,o){const k=s;E(ctx,-k*.02,0,k*.28,k*.34,c);P(ctx,[[-k*.04,-k*.06],[-k*.39,-k*.42],[k*.04,-k*.15]],l);P(ctx,[[k*.06,-k*.10],[k*.46,-k*.22],[k*.22,k*.02]],d);P(ctx,[[k*.20,-k*.10],[k*.54,-k*.17],[k*.29,-k*.01]],l);eye(ctx,k*.20,-k*.22,k*.03);P(ctx,[[k*.26,-k*.18],[k*.56,-k*.13],[k*.26,-k*.08]],'#bd8f4e');R(ctx,-k*.12,k*.24,k*.05,k*.18,d);R(ctx,k*.02,k*.24,k*.05,k*.18,d);}
  S.drawAnimal=function(ctx,x,y,size,spec,opt={}){const g=spec.genes||spec;const gg=Object.assign({body:'quadruped',color:spec.color||'#78965a',speed:40,defense:20,thorns:0,camouflage:0},g);S.drawPlayer(ctx,x,y,size,gg,opt);};
  S.drawPlant=function(ctx,x,y,size,plant,phase=0){ctx.save();ctx.translate(x,y);ctx.imageSmoothingEnabled=false;const c=plant.color||'#4c8b54';const d=shade(c,-24);const l=hi(c,30);S.shadow(ctx,0,size*.38,size*.34,size*.10);if(plant.kind==='cacto'){R(ctx,-size*.08,-size*.33,size*.16,size*.66,d);E(ctx,-size*.22,-size*.18,size*.14,size*.24,c);E(ctx,size*.22,-size*.10,size*.14,size*.28,c);R(ctx,-size*.20,size*.08,size*.06,size*.26,d);R(ctx,size*.14,size*.10,size*.06,size*.25,d);}else if(plant.kind==='árvore'){R(ctx,-size*.04,-size*.08,size*.08,size*.42,d);E(ctx,0,-size*.25,size*.34,size*.25,c);E(ctx,-size*.23,-size*.15,size*.22,size*.20,l);E(ctx,size*.20,-size*.14,size*.24,size*.18,d);}else{R(ctx,-1,-size*.18,2,size*.50,d);for(let i=0;i<5;i++){const a=(i/5)*TAU+phase*.15;P(ctx,[[0,-size*.02],[Math.cos(a)*size*.32,-size*.30+Math.sin(a)*size*.18],[Math.cos(a+.12)*size*.22,-size*.02]],i%2?c:l);}}ctx.restore();};
  S.pixelIcon=function(ctx,x,y,size,color,type){ctx.save();ctx.translate(x,y);const d=shade(color,-24),l=hi(color,30);if(type==='dna'){L(ctx,-size*.18,-size*.36,size*.18,size*.36,color,2);L(ctx,size*.18,-size*.36,-size*.18,size*.36,d,2);for(let i=-2;i<=2;i++)L(ctx,-size*.13,i*size*.11,size*.13,i*size*.11,l,2);}else if(type==='drop'){P(ctx,[[0,-size*.42],[-size*.22,0],[0,size*.35],[size*.22,0]],color);}else if(type==='heart'){P(ctx,[[0,size*.32],[-size*.36,-size*.12],[-size*.30,-size*.30],[-size*.14,-size*.36],[0,-size*.20],[size*.14,-size*.36],[size*.30,-size*.30],[size*.36,-size*.12]],color);}else if(type==='leaf'){P(ctx,[[0,size*.34],[-size*.36,0],[0,-size*.36],[size*.34,0]],color);L(ctx,0,size*.30,0,-size*.28,d,1);}else{R(ctx,-size*.25,-size*.25,size*.50,size*.50,color);R(ctx,-size*.10,-size*.10,size*.20,size*.20,l);}ctx.restore();};
  S.fauna_001=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['onca'])||{color:'#d79d4d'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_002=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['lobo_guara'])||{color:'#bf8a63'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_003=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['tamandua'])||{color:'#d2b07a'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_004=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['anta'])||{color:'#6f4f3b'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_005=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['capivara'])||{color:'#96725b'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_006=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['tatu'])||{color:'#7e6b5b'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_007=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['arara'])||{color:'#6e9bd3'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_008=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['tucano'])||{color:'#222b29'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_009=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['jacare'])||{color:'#587249'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_010=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['ariranha'])||{color:'#715f4e'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_011=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['veado'])||{color:'#ae8c63'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_012=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['ema'])||{color:'#8d7b67'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_013=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['quati'])||{color:'#9c704d'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_014=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['mico'])||{color:'#cf8a4e'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_015=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['sapo'])||{color:'#5a9257'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_016=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['carcara'])||{color:'#6a5139'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_017=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['gavião'])||{color:'#68594c'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_018=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['graxaim'])||{color:'#9b785e'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_019=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['prea'])||{color:'#8c765b'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_020=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['lagarto'])||{color:'#6f874b'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_021=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['tuiuiu'])||{color:'#d8d6ca'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_022=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['peixe_rei'])||{color:'#5d99b8'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_023=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['jacuting'])||{color:'#252b2c'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.fauna_024=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.ANIMALS&&window.BioData.ANIMALS['paca'])||{color:'#806347'};S.drawAnimal(ctx,x,y,size,d,opt);};
  S.flora_001=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['acai'])||{kind:'árvore',color:'#496f39'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+1*.17);};
  S.flora_002=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['buriti'])||{kind:'árvore',color:'#4d7d39'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+2*.17);};
  S.flora_003=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['castanha'])||{kind:'árvore',color:'#49603b'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+3*.17);};
  S.flora_004=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['mandacaru'])||{kind:'cacto',color:'#759451'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+4*.17);};
  S.flora_005=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['xique'])||{kind:'cacto',color:'#89a160'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+5*.17);};
  S.flora_006=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['juazeiro'])||{kind:'árvore',color:'#59783f'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+6*.17);};
  S.flora_007=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['pequi'])||{kind:'árvore',color:'#64783b'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+7*.17);};
  S.flora_008=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['baru'])||{kind:'árvore',color:'#657e44'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+8*.17);};
  S.flora_009=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['ipe'])||{kind:'árvore',color:'#7a6a3e'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+0*.17);};
  S.flora_010=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['palmito'])||{kind:'árvore',color:'#46734b'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+1*.17);};
  S.flora_011=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['pitanga'])||{kind:'arbusto',color:'#657d42'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+2*.17);};
  S.flora_012=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['samambaia'])||{kind:'folhagem',color:'#3c7a4b'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+3*.17);};
  S.flora_013=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['aguape'])||{kind:'aquática',color:'#5b9258'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+4*.17);};
  S.flora_014=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['caranda'])||{kind:'palmeira',color:'#5c7d48'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+5*.17);};
  S.flora_015=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['butia'])||{kind:'palmeira',color:'#718e4e'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+6*.17);};
  S.flora_016=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['graminea'])||{kind:'grama',color:'#6f9a4a'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+7*.17);};
  S.flora_017=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['campo_flora'])||{kind:'flor',color:'#879d56'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+8*.17);};
  S.flora_018=function(ctx,x,y,size,opt={}){const d=(window.BioData&&window.BioData.PLANTS&&window.BioData.PLANTS['arbusto'])||{kind:'arbusto',color:'#658143'};S.drawPlant(ctx,x,y,size,d,(opt.phase||0)+0*.17);};
  S.icon_0001=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0002=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0003=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0004=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0005=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0006=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0007=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0008=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0009=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0010=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0011=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0012=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0013=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0014=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0015=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0016=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0017=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0018=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0019=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0020=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0021=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0022=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0023=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0024=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0025=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0026=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0027=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0028=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0029=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0030=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0031=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0032=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0033=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0034=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0035=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0036=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0037=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0038=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0039=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0040=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0041=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0042=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0043=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0044=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0045=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0046=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0047=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0048=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0049=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0050=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0051=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0052=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0053=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0054=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0055=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0056=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0057=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0058=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0059=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0060=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0061=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0062=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0063=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0064=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0065=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0066=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0067=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0068=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0069=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0070=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0071=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0072=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0073=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0074=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0075=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0076=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0077=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0078=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0079=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0080=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0081=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0082=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0083=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0084=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0085=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0086=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0087=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0088=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0089=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0090=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0091=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0092=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0093=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0094=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0095=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0096=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0097=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0098=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0099=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0100=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0101=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0102=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0103=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0104=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0105=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0106=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0107=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0108=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0109=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0110=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0111=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0112=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0113=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0114=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0115=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0116=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0117=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0118=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0119=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0120=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0121=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0122=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0123=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0124=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0125=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0126=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0127=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0128=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0129=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0130=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0131=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0132=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0133=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0134=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0135=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0136=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0137=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0138=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0139=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0140=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0141=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0142=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0143=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0144=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0145=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0146=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0147=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0148=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0149=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0150=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0151=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0152=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0153=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0154=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0155=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0156=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0157=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0158=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0159=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0160=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0161=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0162=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0163=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0164=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0165=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0166=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0167=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0168=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0169=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0170=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0171=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0172=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0173=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0174=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0175=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0176=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0177=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0178=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0179=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0180=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0181=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0182=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0183=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0184=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0185=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0186=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0187=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0188=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0189=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0190=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0191=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0192=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0193=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0194=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0195=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0196=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0197=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0198=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0199=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0200=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0201=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0202=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0203=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0204=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0205=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0206=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0207=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0208=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0209=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0210=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0211=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0212=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0213=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0214=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0215=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0216=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0217=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0218=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0219=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0220=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0221=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0222=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0223=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0224=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0225=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0226=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0227=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0228=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0229=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0230=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0231=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0232=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0233=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0234=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0235=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0236=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0237=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0238=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0239=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0240=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0241=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0242=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0243=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0244=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0245=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0246=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0247=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0248=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0249=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0250=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0251=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0252=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0253=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0254=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0255=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0256=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0257=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0258=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0259=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0260=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0261=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0262=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0263=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0264=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0265=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0266=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0267=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0268=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0269=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0270=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0271=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0272=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0273=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0274=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0275=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0276=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0277=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0278=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0279=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0280=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0281=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0282=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0283=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0284=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0285=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0286=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0287=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0288=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0289=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0290=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0291=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0292=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0293=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0294=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0295=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0296=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0297=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0298=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0299=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0300=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0301=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0302=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0303=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0304=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0305=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0306=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0307=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0308=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0309=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0310=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0311=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0312=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0313=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0314=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0315=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0316=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0317=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0318=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0319=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0320=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0321=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0322=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0323=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0324=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0325=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0326=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0327=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0328=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0329=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0330=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0331=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0332=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0333=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0334=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0335=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0336=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0337=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0338=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0339=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0340=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0341=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0342=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0343=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0344=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0345=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0346=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0347=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0348=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0349=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0350=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0351=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0352=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0353=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0354=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0355=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0356=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0357=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0358=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0359=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0360=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0361=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0362=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0363=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0364=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0365=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0366=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0367=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0368=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0369=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0370=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0371=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0372=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0373=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0374=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0375=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0376=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0377=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0378=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0379=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0380=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.icon_0381=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','dna');};
  S.icon_0382=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','drop');};
  S.icon_0383=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','heart');};
  S.icon_0384=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','leaf');};
  S.icon_0385=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','star');};
  S.icon_0386=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','food');};
  S.icon_0387=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','fire');};
  S.icon_0388=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','home');};
  S.icon_0389=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','water');};
  S.icon_0390=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','sun');};
  S.icon_0391=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','moon');};
  S.icon_0392=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','tree');};
  S.icon_0393=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','fish');};
  S.icon_0394=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','bird');};
  S.icon_0395=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','stone');};
  S.icon_0396=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#63b5d1','tool');};
  S.icon_0397=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e07666','seed');};
  S.icon_0398=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#e3c86e','culture');};
  S.icon_0399=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#9d87d6','tech');};
  S.icon_0400=function(ctx,x,y,size){S.pixelIcon(ctx,x,y,size,'#83ca72','shield');};
  S.anim_0001=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(1%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0002=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(2%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0003=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(3%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0004=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(4%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0005=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(5%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0006=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(6%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0007=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(7%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0008=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(8%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0009=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(9%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0010=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(10%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0011=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(11%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0012=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(12%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0013=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(13%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0014=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(14%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0015=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(15%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0016=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(16%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0017=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(17%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0018=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(18%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0019=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(19%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0020=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(20%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0021=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(21%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0022=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(22%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0023=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(23%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0024=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(24%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0025=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(25%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0026=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(26%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0027=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(27%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0028=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(28%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0029=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(29%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0030=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(30%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0031=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(31%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0032=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(32%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0033=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(33%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0034=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(34%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0035=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(35%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0036=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(36%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0037=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(37%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0038=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(38%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0039=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(39%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0040=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(40%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0041=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(41%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0042=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(42%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0043=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(43%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0044=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(44%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0045=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(45%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0046=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(46%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0047=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(47%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0048=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(48%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0049=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(49%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0050=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(50%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0051=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(51%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0052=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(52%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0053=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(53%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0054=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(54%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0055=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(55%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0056=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(56%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0057=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(57%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0058=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(58%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0059=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(59%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0060=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(60%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0061=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(61%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0062=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(62%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0063=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(63%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0064=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(64%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0065=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(65%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0066=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(66%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0067=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(67%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0068=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(68%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0069=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(69%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0070=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(70%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0071=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(71%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0072=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(72%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0073=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(73%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0074=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(74%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0075=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(75%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0076=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(76%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0077=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(77%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0078=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(78%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0079=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(79%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0080=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(80%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0081=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(81%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0082=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(82%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0083=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(83%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0084=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(84%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0085=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(85%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0086=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(86%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0087=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(87%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0088=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(88%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0089=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(89%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0090=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(90%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0091=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(91%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0092=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(92%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0093=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(93%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0094=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(94%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0095=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(95%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0096=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(96%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0097=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(97%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0098=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(98%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0099=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(99%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0100=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(100%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0101=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(101%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0102=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(102%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0103=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(103%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0104=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(104%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0105=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(105%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0106=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(106%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0107=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(107%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0108=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(108%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0109=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(109%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0110=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(110%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0111=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(111%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0112=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(112%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0113=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(113%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0114=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(114%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0115=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(115%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0116=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(116%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0117=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(117%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0118=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(118%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0119=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(119%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0120=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(120%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0121=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(121%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0122=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(122%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0123=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(123%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0124=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(124%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0125=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(125%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0126=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(126%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0127=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(127%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0128=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(128%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0129=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(129%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0130=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(130%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0131=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(131%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0132=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(132%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0133=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(133%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0134=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(134%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0135=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(135%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0136=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(136%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0137=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(137%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0138=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(138%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0139=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(139%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0140=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(140%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0141=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(141%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0142=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(142%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0143=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(143%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0144=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(144%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0145=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(145%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0146=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(146%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0147=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(147%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0148=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(148%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0149=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(149%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0150=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(150%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0151=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(151%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0152=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(152%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0153=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(153%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0154=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(154%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0155=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(155%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0156=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(156%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0157=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(157%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0158=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(158%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0159=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(159%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0160=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(160%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0161=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(161%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0162=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(162%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0163=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(163%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0164=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(164%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0165=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(165%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0166=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(166%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0167=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(167%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0168=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(168%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0169=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(169%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0170=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(170%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0171=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(171%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0172=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(172%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0173=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(173%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0174=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(174%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0175=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(175%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0176=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(176%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0177=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(177%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0178=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(178%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0179=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(179%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0180=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(180%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0181=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(181%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0182=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(182%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0183=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(183%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0184=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(184%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0185=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(185%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0186=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(186%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0187=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(187%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0188=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(188%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0189=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(189%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0190=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(190%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0191=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(191%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0192=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(192%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0193=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(193%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0194=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(194%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0195=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(195%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0196=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(196%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0197=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(197%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0198=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(198%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0199=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(199%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0200=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(200%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0201=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(201%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0202=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(202%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0203=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(203%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0204=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(204%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0205=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(205%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0206=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(206%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0207=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(207%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0208=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(208%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0209=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(209%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0210=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(210%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0211=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(211%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0212=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(212%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0213=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(213%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0214=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(214%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0215=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(215%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0216=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(216%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0217=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(217%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0218=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(218%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0219=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(219%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0220=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(220%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0221=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(221%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0222=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(222%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0223=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(223%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0224=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(224%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0225=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(225%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0226=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(226%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0227=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(227%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0228=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(228%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0229=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(229%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0230=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(230%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0231=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(231%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0232=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(232%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0233=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(233%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0234=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(234%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0235=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(235%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0236=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(236%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0237=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(237%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0238=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(238%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0239=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(239%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0240=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(240%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0241=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(241%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0242=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(242%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0243=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(243%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0244=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(244%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0245=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(245%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0246=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(246%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0247=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(247%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0248=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(248%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0249=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(249%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0250=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(250%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0251=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(251%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0252=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(252%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0253=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(253%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0254=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(254%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0255=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(255%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0256=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(256%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0257=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(257%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0258=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(258%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0259=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(259%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0260=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(260%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0261=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(261%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0262=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(262%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0263=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(263%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0264=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(264%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0265=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(265%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0266=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(266%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0267=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(267%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0268=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(268%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0269=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(269%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0270=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(270%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0271=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(271%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0272=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(272%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0273=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(273%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0274=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(274%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0275=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(275%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0276=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(276%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0277=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(277%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0278=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(278%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0279=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(279%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0280=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(280%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0281=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(281%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0282=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(282%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0283=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(283%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0284=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(284%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0285=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(285%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0286=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(286%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0287=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(287%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0288=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(288%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0289=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(289%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0290=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(290%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0291=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(291%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0292=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(292%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0293=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(293%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0294=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(294%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0295=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(295%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0296=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(296%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0297=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(297%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0298=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(298%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0299=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(299%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0300=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(300%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0301=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(301%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0302=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(302%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0303=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(303%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0304=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(304%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0305=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(305%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0306=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(306%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0307=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(307%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0308=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(308%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0309=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(309%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0310=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(310%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0311=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(311%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0312=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(312%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0313=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(313%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0314=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(314%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0315=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(315%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0316=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(316%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0317=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(317%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0318=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(318%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0319=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(319%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0320=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(320%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0321=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(321%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0322=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(322%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0323=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(323%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0324=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(324%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0325=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(325%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0326=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(326%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0327=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(327%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0328=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(328%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0329=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(329%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0330=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(330%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0331=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(331%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0332=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(332%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0333=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(333%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0334=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(334%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0335=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(335%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0336=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(336%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0337=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(337%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0338=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(338%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0339=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(339%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0340=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(340%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0341=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(341%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0342=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(342%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0343=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(343%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0344=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(344%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0345=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(345%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0346=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(346%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0347=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(347%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0348=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(348%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0349=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(349%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0350=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(350%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0351=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(351%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0352=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(352%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0353=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(353%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0354=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(354%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0355=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(355%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0356=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(356%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0357=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(357%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0358=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(358%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0359=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(359%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0360=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(360%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0361=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(361%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0362=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(362%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0363=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(363%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0364=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(364%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0365=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(365%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0366=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(366%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0367=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(367%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0368=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(368%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0369=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(369%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0370=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(370%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0371=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(371%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0372=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(372%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0373=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(373%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0374=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(374%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0375=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(375%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0376=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(376%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0377=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(377%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0378=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(378%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0379=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(379%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0380=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(380%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0381=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(381%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0382=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(382%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0383=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(383%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0384=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(384%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0385=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(385%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0386=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(386%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0387=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(387%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0388=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(388%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0389=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(389%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0390=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(390%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0391=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(391%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0392=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(392%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0393=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(393%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0394=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(394%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0395=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(395%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0396=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(396%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0397=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(397%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0398=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(398%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0399=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(399%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0400=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(400%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0401=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(401%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0402=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(402%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0403=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(403%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0404=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(404%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0405=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(405%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0406=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(406%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0407=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(407%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0408=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(408%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0409=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(409%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0410=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(410%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0411=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(411%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0412=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(412%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0413=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(413%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0414=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(414%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0415=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(415%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0416=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(416%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0417=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(417%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0418=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(418%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0419=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(419%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0420=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(420%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0421=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(421%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0422=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(422%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0423=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(423%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0424=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(424%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0425=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(425%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0426=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(426%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0427=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(427%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0428=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(428%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0429=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(429%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0430=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(430%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0431=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(431%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0432=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(432%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0433=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(433%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0434=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(434%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0435=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(435%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0436=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(436%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0437=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(437%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0438=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(438%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0439=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(439%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0440=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(440%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0441=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(441%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0442=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(442%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0443=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(443%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0444=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(444%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0445=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(445%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0446=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(446%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0447=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(447%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0448=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(448%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0449=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(449%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0450=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(450%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0451=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(451%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0452=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(452%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0453=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(453%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0454=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(454%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0455=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(455%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0456=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(456%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0457=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(457%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0458=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(458%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0459=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(459%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0460=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(460%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0461=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(461%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0462=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(462%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0463=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(463%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0464=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(464%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0465=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(465%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0466=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(466%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0467=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(467%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0468=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(468%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0469=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(469%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0470=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(470%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0471=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(471%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0472=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(472%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0473=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(473%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0474=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(474%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0475=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(475%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0476=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(476%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0477=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(477%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0478=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(478%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0479=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(479%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0480=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(480%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0481=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(481%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0482=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(482%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0483=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(483%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0484=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(484%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0485=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(485%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0486=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(486%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0487=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(487%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0488=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(488%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0489=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(489%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0490=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(490%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0491=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(491%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0492=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(492%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0493=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(493%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0494=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(494%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0495=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(495%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0496=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(496%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0497=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(497%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0498=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(498%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0499=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(499%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0500=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(500%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0501=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(501%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0502=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(502%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0503=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(503%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0504=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(504%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0505=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(505%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0506=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(506%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0507=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(507%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0508=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(508%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0509=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(509%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0510=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(510%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0511=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(511%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0512=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(512%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0513=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(513%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0514=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(514%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0515=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(515%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0516=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(516%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0517=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(517%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0518=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(518%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0519=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(519%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0520=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(520%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0521=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(521%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0522=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(522%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0523=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(523%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0524=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(524%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0525=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(525%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0526=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(526%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0527=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(527%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0528=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(528%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0529=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(529%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0530=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(530%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0531=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(531%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0532=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(532%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0533=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(533%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0534=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(534%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0535=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(535%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0536=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(536%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0537=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(537%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0538=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(538%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0539=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(539%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0540=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(540%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0541=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(541%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0542=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(542%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0543=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(543%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0544=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(544%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0545=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(545%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0546=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(546%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0547=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(547%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0548=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(548%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0549=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(549%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0550=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(550%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0551=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(551%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0552=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(552%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0553=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(553%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0554=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(554%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0555=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(555%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0556=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(556%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0557=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(557%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0558=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(558%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0559=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(559%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0560=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(560%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0561=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(561%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0562=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(562%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0563=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(563%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0564=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(564%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0565=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(565%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0566=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(566%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0567=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(567%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0568=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(568%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0569=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(569%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0570=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(570%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0571=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(571%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0572=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(572%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0573=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(573%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0574=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(574%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0575=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(575%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0576=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(576%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0577=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(577%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0578=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(578%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0579=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(579%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0580=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(580%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0581=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(581%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0582=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(582%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0583=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(583%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0584=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(584%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0585=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(585%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0586=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(586%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0587=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(587%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0588=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(588%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0589=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(589%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0590=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(590%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0591=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(591%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0592=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(592%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0593=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(593%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0594=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(594%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0595=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(595%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0596=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(596%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0597=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(597%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0598=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(598%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0599=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(599%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0600=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(600%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0601=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(601%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0602=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(602%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0603=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(603%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0604=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(604%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0605=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(605%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0606=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(606%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0607=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(607%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0608=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(608%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0609=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(609%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0610=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(610%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0611=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(611%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0612=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(612%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0613=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(613%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0614=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(614%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0615=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(615%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0616=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(616%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0617=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(617%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0618=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(618%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0619=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(619%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0620=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(620%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0621=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(621%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0622=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(622%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0623=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(623%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0624=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(624%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0625=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(625%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0626=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(626%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0627=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(627%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0628=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(628%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0629=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(629%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0630=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(630%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0631=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(631%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0632=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(632%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0633=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+3)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(633%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0634=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+4)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(634%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0635=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+5)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(635%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0636=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+6)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(636%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0637=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+0)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(637%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0638=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+1)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(638%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0639=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+2)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(639%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0640=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+3)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(640%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0641=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+4)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(641%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0642=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+5)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(642%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0643=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+6)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(643%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0644=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+0)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(644%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0645=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+1)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(645%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0646=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+2)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(646%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0647=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+3)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(647%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0648=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+4)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(648%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0649=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+5)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(649%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0650=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+6)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(650%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0651=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+0)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(651%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0652=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+1)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(652%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0653=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+2)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(653%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0654=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+3)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(654%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0655=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+4)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(655%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0656=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+5)*2;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(656%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.anim_0657=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.25+6)*3;
    S.pixelIcon(ctx,x,y+bob,size,'#63b5d1','leaf');
    if(657%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#63b5d1',-25),1);}
  };
  S.anim_0658=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.50+0)*4;
    S.pixelIcon(ctx,x,y+bob,size,'#e3c86e','drop');
    if(658%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e3c86e',-25),1);}
  };
  S.anim_0659=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.75+1)*5;
    S.pixelIcon(ctx,x,y+bob,size,'#e07666','heart');
    if(659%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#e07666',-25),1);}
  };
  S.anim_0660=function(ctx,x,y,size,phase=0){
    const bob=Math.sin(phase*1.00+2)*1;
    S.pixelIcon(ctx,x,y+bob,size,'#83ca72','dna');
    if(660%3===0){L(ctx,x-size*.25,y+bob-size*.34,x+size*.22,y+bob+size*.18,shade('#83ca72',-25),1);}
  };
  S.drawTreeLineage=function(ctx,nodes,box){ctx.save();ctx.clearRect(0,0,box.w,box.h);ctx.imageSmoothingEnabled=false;for(const n of nodes||[]){const x=20+n.depth*110,y=30+n.row*42;L(ctx,x-55,y,x,y,'#557d57',2);S.pixelIcon(ctx,x,y,18,'#83ca72','dna');}ctx.restore();};
  S.drawBiomeCard=function(ctx,x,y,w,h,biome){ctx.save();ctx.fillStyle=biome.base||'#27452d';ctx.fillRect(x,y,w,h);ctx.globalAlpha=.15;for(let i=0;i<10;i++){E(ctx,x+(i*37%w),y+(i*19%h),12,8,biome.light||'#7ab96c');}ctx.globalAlpha=1;ctx.fillStyle='#edf4e8';ctx.font='900 12px monospace';ctx.fillText((biome.icon||'')+' '+(biome.name||''),x+10,y+20);ctx.restore();};
  window.BioSprites=S;
})();
