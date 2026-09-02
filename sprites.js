/* Procedural pixel-art sprites. Everything is drawn with Canvas primitives so GitHub Pages has no binary asset burden. */
(() => {
  const S = window.BioSprites = {};
  const TAU = Math.PI*2;
  const px = (ctx,x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));};
  const poly = (ctx,pts,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.closePath();ctx.fill();};
  const circle = (ctx,x,y,r,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();};
  const line = (ctx,x1,y1,x2,y2,c,w=1)=>{ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();};
  const outline = (ctx,draw)=>{ctx.save();ctx.translate(1,1);draw('#142219');ctx.restore();draw();};
  const shade = c => {
    const m = c.match(/^#([0-9a-f]{6})$/i); if(!m)return c;
    let n=parseInt(m[1],16); let r=Math.max(0,((n>>16)&255)-24),g=Math.max(0,((n>>8)&255)-24),b=Math.max(0,(n&255)-24);
    return `rgb(${r},${g},${b})`;
  };
  const hi = c => {
    const m = c.match(/^#([0-9a-f]{6})$/i); if(!m)return c;
    let n=parseInt(m[1],16); let r=Math.min(255,((n>>16)&255)+28),g=Math.min(255,((n>>8)&255)+28),b=Math.min(255,(n&255)+28);
    return `rgb(${r},${g},${b})`;
  };
  S.clear = function(ctx,w,h,c='#0b160d'){ctx.fillStyle=c;ctx.fillRect(0,0,w,h);};
  S.drawPlayer = function(ctx,x,y,size,genes,opts={}){
    const facing=opts.facing||1;
    const body=genes.body||'quadruped';
    const color=genes.color||'#6fa64d';
    const dark=shade(color), light=hi(color);
    ctx.save(); ctx.translate(x,y); ctx.scale(facing,1);
    ctx.imageSmoothingEnabled=false;
    if(opts.shadow!==false){ctx.globalAlpha=.24;ellipse(ctx,0,size*.18,size*.43,size*.14,'#071008');ctx.globalAlpha=1;}
    if(body==='fish') drawFish(ctx,size,color,dark,light,genes,opts);
    else if(body==='bird') drawBird(ctx,size,color,dark,light,genes,opts);
    else drawQuadruped(ctx,size,color,dark,light,genes,opts);
    ctx.restore();
  };
  function ellipse(ctx,x,y,rx,ry,c){ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fill();}
  function drawEye(ctx,x,y,r){circle(ctx,x,y,r,'#eef7dc');circle(ctx,x+.4,y,r*.53,'#182116');px(ctx,x+.6,y-r*.5,1,1,'#fff');}
  function drawQuadruped(ctx,s,c,d,l,g,o){
    const k=s;
    outline(ctx,col=>{
      if(g.camouflage>20) col='#25382a';
      ellipse(ctx,-k*.03,-k*.02,k*.48,k*.27,col);
      ellipse(ctx,k*.43,-k*.17,k*.27,k*.25,col);
      if(g.size>1.25) ellipse(ctx,-k*.14,-k*.18,k*.2,k*.16,col);
      px(ctx,-k*.38,k*.13,k*.08,k*.22,col); px(ctx,-k*.12,k*.13,k*.08,k*.24,col);
      px(ctx,k*.24,k*.08,k*.09,k*.26,col); px(ctx,k*.45,k*.02,k*.08,k*.2,col);
      poly(ctx,[[-k*.47,-k*.14],[-k*.68,-k*.27],[-k*.58,-k*.05]],col);
    });
    ellipse(ctx,-k*.03,-k*.02,k*.44,k*.24,c);
    ellipse(ctx,k*.43,-k*.17,k*.24,k*.22,l);
    if(g.size>1.25) ellipse(ctx,-k*.14,-k*.18,k*.18,k*.14,d);
    px(ctx,-k*.36,k*.13,k*.06,k*.22,d); px(ctx,-k*.10,k*.13,k*.06,k*.24,d);
    px(ctx,k*.26,k*.08,k*.07,k*.26,d); px(ctx,k*.48,k*.02,k*.06,k*.2,d);
    circle(ctx,k*.5,-k*.21,k*.042,'#101811');
    drawEye(ctx,k*.48,-k*.21,k*.032);
    poly(ctx,[[k*.59,-k*.09],[k*.73,-k*.045],[k*.59,-k*.01]],'#3b2a1b');
    if(g.thorns>0){for(let i=0;i<4;i++)poly(ctx,[[-k*.18+i*k*.11,-k*.23],[-k*.12+i*k*.11,-k*.43],[-k*.04+i*k*.11,-k*.22]],d);}
    if(g.climb>50){line(ctx,-k*.30,k*.1,-k*.43,k*.24,d,2);}
    if(o.attack){line(ctx,k*.68,-k*.03,k*.86,-k*.12,'#f2e5c5',2);}
  }
  function drawFish(ctx,s,c,d,l,g,o){
    const k=s;
    outline(ctx,col=>{
      ellipse(ctx,-k*.05,0,k*.53,k*.27,col);
      poly(ctx,[[-k*.5,0],[-k*.79,-k*.24],[-k*.74,k*.24]],col);
      poly(ctx,[[0,-k*.16],[k*.15,-k*.4],[k*.22,-k*.12]],col);
      poly(ctx,[[0,k*.16],[k*.15,k*.4],[k*.22,k*.12]],col);
    });
    ellipse(ctx,-k*.05,0,k*.51,k*.25,c);
    poly(ctx,[[-k*.47,0],[-k*.76,-k*.22],[-k*.72,k*.22]],l);
    poly(ctx,[[0,-k*.14],[k*.15,-k*.34],[k*.2,-k*.1]],d);
    poly(ctx,[[0,k*.14],[k*.15,k*.34],[k*.2,k*.1]],d);
    drawEye(ctx,k*.31,-k*.08,k*.035);
    line(ctx,-k*.05,0,k*.25,0,lighten(c),1);
    if(g.camouflage>20){ellipse(ctx,-k*.08,.02,k*.28,k*.1,'#425445');}
  }
  function lighten(c){return c==='#6fa64d'?'#a4cf72':c;}
  function drawBird(ctx,s,c,d,l,g,o){
    const k=s;
    outline(ctx,col=>{
      ellipse(ctx,0,0,k*.29,k*.32,col);
      poly(ctx,[[k*.1,-k*.12],[k*.44,-k*.48],[k*.31,k*.02]],col);
      poly(ctx,[[-k*.06,-k*.05],[-k*.47,-k*.37],[-k*.27,k*.13]],col);
      poly(ctx,[[k*.17,k*.18],[k*.04,k*.5],[k*.25,k*.25]],col);
    });
    ellipse(ctx,0,0,k*.27,k*.30,c);
    poly(ctx,[[k*.08,-k*.12],[k*.42,-k*.45],[k*.29,k*.03]],l);
    poly(ctx,[[-k*.06,-k*.05],[-k*.43,-k*.33],[-k*.23,k*.12]],d);
    poly(ctx,[[k*.13,k*.16],[k*.03,k*.48],[k*.21,k*.22]],d);
    drawEye(ctx,k*.18,-k*.12,k*.035);
    poly(ctx,[[k*.26,-k*.1],[k*.52,-k*.03],[k*.26,k*.02]],'#cfae53');
    if(g.flight>75){line(ctx,-k*.19,-k*.16,-k*.39,-k*.29,'#d6eea0',2);}
  }
  S.drawAnimal = function(ctx,x,y,size,a,opts={}){
    const color=a.color||'#6f7552';
    ctx.save();ctx.translate(x,y);ctx.scale(opts.facing||1,1);
    ctx.globalAlpha=opts.alpha??1;
    const d=shade(color),l=hi(color);
    if(a.kind==='fish') drawFish(ctx,size,color,d,l,{body:'fish'},opts);
    else if(a.kind==='bird') drawBird(ctx,size,color,d,l,{body:'bird'},opts);
    else drawQuadruped(ctx,size,color,d,l,{body:'quadruped',thorns:a.thorns||0},opts);
    ctx.restore();
  };
  S.drawPlant = function(ctx,x,y,size,p,genes={},opts={}){
    ctx.save();ctx.translate(x,y);ctx.imageSmoothingEnabled=false;const s=size;
    const h=(opts.growth??1);
    const leaf=genes.color||'#4e9a4d';const dark=shade(leaf),light=hi(leaf);
    if(p.kind==='tree'){
      px(ctx,-s*.08,0,s*.16,s*.48,'#5a3e28');
      for(let i=0;i<5;i++){const ang=(-1.1+i*.55)+Math.sin(opts.phase||0+i)*.08;circle(ctx,Math.cos(ang)*s*.26,-s*.2+Math.sin(ang)*s*.12,s*(.24+.03*(i%2)),i%2?leaf:light);}
      circle(ctx,0,-s*.36,s*.26,dark);
    }else if(p.kind==='cactus'){
      px(ctx,-s*.1,-s*.4,s*.2,s*.62,'#4d7c43');px(ctx,-s*.3,-s*.22,s*.18,s*.11,'#4d7c43');px(ctx,s*.12,-s*.05,s*.18,s*.1,'#4d7c43');
      if(genes.toxin>10){for(let i=0;i<5;i++)px(ctx,-s*.18+i*s*.09,-s*.3+i%2*s*.08,2,2,'#d8d49a');}
    }else if(p.kind==='vine'){
      line(ctx,0,0,0,-s*.58,dark,3);for(let i=0;i<6;i++){circle(ctx,(i%2?-.12:.12)*s,-s*.1-i*s*.08,s*.12,leaf);}
    }else if(p.kind==='grass'){
      for(let i=0;i<7;i++){line(ctx,0,0,(i-3)*s*.08,-s*(.2+.04*(i%3)),i%2?dark:light,2);}
    }else if(p.kind==='water'){
      circle(ctx,0,-s*.08,s*.34,'#4c9b65');circle(ctx,s*.2,-s*.02,s*.22,'#69b477');
    }else{
      px(ctx,-s*.08,0,s*.16,s*.34,'#69462c');for(let i=0;i<4;i++)circle(ctx,(i-1.5)*s*.13,-s*(.2+(i%2)*.05),s*.15,i%2?leaf:light);
    }
    if(h<1){ctx.globalAlpha=.25+h*.75;}
    ctx.restore();
  };
  S.drawBuilding = function(ctx,x,y,b,scale=1,phase=0){
    ctx.save();ctx.translate(x,y);const s=18*scale;const wood='#704a2b', stone='#737568', roof='#55352a';
    if(b.id==='fire'){
      ellipse(ctx,0,3,s*.46,s*.12,'#060a07');
      px(ctx,-s*.32,0,s*.64,s*.12,wood);px(ctx,-s*.24,-s*.1,s*.48,s*.1,wood);
      poly(ctx,[[-s*.15,0],[0,-s*.62],[s*.18,0]],'#efb84c');poly(ctx,[[-s*.1,-s*.03],[0,-s*.86],[s*.11,-s*.03]],'#f2753d');
    }else if(b.id==='shelter'){
      poly(ctx,[[-s*.55,s*.4],[-s*.55,-s*.12],[0,-s*.58],[s*.55,-s*.12],[s*.55,s*.4]],wood);
      poly(ctx,[[-s*.66,-s*.11],[0,-s*.75],[s*.66,-s*.11]],roof);px(ctx,-s*.09,s*.04,s*.18,s*.36,'#352619');
    }else if(b.id==='storage'){
      px(ctx,-s*.58,-s*.39,s*1.16,s*.78,wood);px(ctx,-s*.48,-s*.30,s*.96,s*.08,'#9c7045');px(ctx,-s*.47,s*.02,s*.95,s*.05,'#4e311f');
    }else if(b.id==='farm'){
      for(let i=0;i<4;i++){line(ctx,-s*.55+i*s*.35,s*.38,-s*.55+i*s*.35,-s*.22,'#8f6e42',2);circle(ctx,-s*.55+i*s*.35,-s*.24,s*.08,'#64a352');}
    }else if(b.id==='fence'){
      for(let i=0;i<5;i++)px(ctx,-s*.6+i*s*.3,-s*.28,s*.05,s*.75,wood);line(ctx,-s*.62,-s*.12,s*.62,-s*.12,wood,3);line(ctx,-s*.62,s*.08,s*.62,s*.08,wood,3);
    }else if(b.id==='bridge'){
      px(ctx,-s*.75,-s*.25,s*1.5,s*.5,wood);for(let i=0;i<7;i++)px(ctx,-s*.66+i*s*.22,-s*.34,s*.04,s*.68,'#a67b47');
    }else if(b.id==='tower'){
      px(ctx,-s*.28,-s*.7,s*.56,s*1.1,stone);poly(ctx,[[-s*.4,-s*.7],[0,-s*.95],[s*.4,-s*.7]],roof);px(ctx,-s*.13,-s*.35,s*.26,s*.2,'#1e2a20');
    }else if(b.id==='workshop'){
      px(ctx,-s*.6,-s*.43,s*1.2,s*.86,wood);poly(ctx,[[-s*.68,-s*.43],[0,-s*.76],[s*.68,-s*.43]],roof);px(ctx,s*.12,-s*.14,s*.22,s*.23,stone);
      line(ctx,-s*.33,-s*.1,-s*.1,-s*.34,'#d4b55f',2);
    }
    ctx.restore();
  };
  S.drawWeatherParticle = function(ctx,x,y,type,size,phase){
    if(type==='rain'||type==='storm'){line(ctx,x,y,x-size*.1,y+size*.8,'#9cdcf1',1);}
    else if(type==='snow'||type==='frost'){circle(ctx,x,y,size*.16,'#d9efe9');}
    else if(type==='ash'||type==='fire'){circle(ctx,x,y,size*.12, type==='fire'?'#ef9a48':'#6f7160');}
  };
  S.pixelPattern = function(ctx,x,y,w,h,kind,seed=0){
    const colors=kind==='water'?['#2d7e9a','#3d8eaa','#5baec0']:kind==='sand'?['#8a6b3d','#9b7946','#b09055']:['#244f31','#2d6036','#397143'];
    for(let j=0;j<h;j+=4)for(let i=0;i<w;i+=4){const k=(i*17+j*23+seed*31)%17;if(k<4)px(ctx,x+i,y+j,2,2,colors[k%colors.length]);}
  };
})();
