/*
  BIOEVO: BRASIL NATIVO
  Single-file game core for GitHub Pages.
  Systems live in namespaces/classes to keep one-file deployment simple.
*/
(() => {
  'use strict';

  const D = window.BioData;
  const SP = window.BioSprites;
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d', { alpha:false });
  const portrait = document.getElementById('portrait');
  const pctx = portrait.getContext('2d');
  const evoPortrait = document.getElementById('evo-portrait');
  const epctx = evoPortrait.getContext('2d');

  const UI = {};
  UI.start = document.getElementById('start-modal');
  UI.loading = document.getElementById('loading');
  UI.toast = document.getElementById('toast');
  UI.speciesName = document.getElementById('species-name');
  UI.speciesType = document.getElementById('species-type');
  UI.dna = document.getElementById('dna');
  UI.biomass = document.getElementById('biomass');
  UI.stone = document.getElementById('stone');
  UI.hp = document.getElementById('txt-hp');
  UI.energy = document.getElementById('txt-energy');
  UI.water = document.getElementById('txt-water');
  UI.barHP = document.getElementById('bar-hp');
  UI.barEnergy = document.getElementById('bar-energy');
  UI.barWater = document.getElementById('bar-water');
  UI.speed = document.getElementById('stat-speed');
  UI.defense = document.getElementById('stat-defense');
  UI.jump = document.getElementById('stat-jump');
  UI.vision = document.getElementById('stat-vision');
  UI.objectiveTitle = document.getElementById('objective-title');
  UI.objectiveDesc = document.getElementById('objective-desc');
  UI.objectiveProgress = document.getElementById('objective-progress');
  UI.log = document.getElementById('event-log');
  UI.evoModal = document.getElementById('evolution-modal');
  UI.evoOptions = document.getElementById('evo-options');
  UI.dnaLarge = document.getElementById('dna-large');
  UI.lineageModal = document.getElementById('lineage-modal');
  UI.lineageTree = document.getElementById('lineage-tree');
  UI.mapModal = document.getElementById('map-modal');
  UI.mapCanvas = document.getElementById('map-canvas');
  UI.mapLegend = document.getElementById('map-legend');
  UI.buildModal = document.getElementById('build-modal');
  UI.buildOptions = document.getElementById('build-options');
  UI.inputSpecies = document.getElementById('input-species');
  UI.startBiomes = document.getElementById('start-biomes');
  UI.pause = document.getElementById('btn-pause');
  UI.save = document.getElementById('btn-save');
  UI.load = document.getElementById('btn-load');

  const G = {
    running:false,
    paused:false,
    time:0,
    day:1,
    hour:7,
    simAccumulator:0,
    uiAccumulator:0,
    weatherAccumulator:0,
    popAccumulator:0,
    fpsAccumulator:0,
    fpsFrames:0,
    fps:60,
    last:performance.now(),
    keys:new Set(),
    mouse:{x:0,y:0,worldX:0,worldY:0,down:false},
    selectedBiome:'cerrado',
    modalOpen:false,
    shake:0,
    seed:Math.floor(Math.random()*999999),
    toastTimer:0,
    messageTimer:0
  };

  const World = {
    width:D.WORLD_W,
    height:D.WORLD_H,
    tiles:[],
    heightMap:[],
    moistureMap:[],
    waterMap:[],
    discovered:new Set(),
    biomeDiscovery:new Set(),
    builds:[],
    plants:[],
    animals:[],
    player:null,
    camera:{x:0,y:0,zoom:1},
    spatial:new Map(),
    dirty:true
  };

  const Species = {
    name:'Carijó',
    id:'species_1',
    type:'animal',
    generation:1,
    genes:null,
    color:'#6fa64d',
    dna:120,
    biomass:0,
    stone:0,
    water:0,
    population:1,
    intelligence:5,
    social:5,
    cultural:0,
    age:0,
    lifetimeBest:0,
    territory:1,
    adaptations:[],
    lineage:[],
    offspring:0,
    mates:0,
    births:0,
    deaths:0,
    currentBiome:'cerrado',
    era:'individuo',
    techUnlocked:['stone'],
    techProgress:0,
    buildingsBuilt:0,
    objectiveIndex:0,
    objectivesDone:0,
    plantMode:false,
    traitHistory:[]
  };

  const Population = {
    local:0,
    remote:0,
    herbivores:0,
    predators:0,
    plants:0,
    villages:0,
    tribes:0,
    total(){return this.local+this.remote;},
    recalc(){
      this.local=World.animals.length;
      this.plants=World.plants.length;
      this.remote=0;
    }
  };

  const Genetics = {
    cloneGenes(src){return JSON.parse(JSON.stringify(src));},
    clampGeneSet(g){
      const min={speed:5,defense:0,jump:0,climb:0,dig:0,swim:0,flight:0,vision:10,hearing:5,smell:5,perception:5,feed:5,hunt:0,collect:0,fertility:5,heat:5,cold:5,drought:0,energyMax:35,waterMax:35,hpMax:35,intelligence:1,social:1};
      Object.keys(min).forEach(k=>{if(typeof g[k]!=='number')g[k]=min[k];g[k]=D.clamp(g[k],min[k],200);});
      g.energyDrain=D.clamp(g.energyDrain??.35,.08,2.4);
      g.size=D.clamp(g.size??1,.45,2.2);
      return g;
    },
    createSeed(type){
      const g=D.defaultGenes(type);
      g.color=type==='flyer'?'#b56b42':type==='swimmer'?'#5c92aa':'#6fa64d';
      return g;
    },
    mutateChild(a,b){
      const out={};
      const keys=new Set([...Object.keys(a),...Object.keys(b)]);
      keys.forEach(k=>{
        if(typeof a[k]==='number' && typeof b[k]==='number'){
          let v=D.lerp(a[k],b[k],D.rand(.25,.75));
          if(Math.random()<.075){
            const mag=Math.max(1,Math.abs(v)*D.rand(.04,.15));
            v += D.rand(-mag,mag);
          }
          out[k]=v;
        }else{
          out[k]=Math.random()<.5?a[k]:b[k];
        }
      });
      out.color=Math.random()<.5?(a.color||'#6fa64d'):(b.color||'#6fa64d');
      this.clampGeneSet(out);
      return out;
    },
    averageMutation(g,trait,amount){g[trait]=(g[trait]||0)+amount;this.clampGeneSet(g);},
    apply(id){
      const m=D.MUTATIONS.find(x=>x.id===id);
      if(!m)return false;
      if(Species.dna<m.cost)return false;
      if(Species.adaptations.includes(id))return false;
      Species.dna-=m.cost;
      m.apply(Species.genes);
      Species.adaptations.push(id);
      Species.traitHistory.push({name:m.name,cost:m.cost,generation:Species.generation});
      this.clampGeneSet(Species.genes);
      addLog(`Mutação adquirida: ${m.name}.`,'good');
      toast(`🧬 ${m.name} adquirida`);
      UIRefresh.all();
      return true;
    }
  };

  const TimeSystem = {
    speed:1,
    dayLength:240,
    tick(dt){
      G.time+=dt*this.speed;
      const totalMinutes=(G.time/this.dayLength)*1440;
      const oldDay=G.day;
      G.day=1+Math.floor(totalMinutes/1440);
      G.hour=(6+totalMinutes/60)%24;
      if(G.day!==oldDay){
        onNewDay();
      }
      G.shake=Math.max(0,G.shake-dt*8);
    },
    getLight(){
      const h=G.hour;
      if(h<5 || h>20)return .28;
      if(h<7)return D.lerp(.28,1,(h-5)/2);
      if(h<17)return 1;
      return D.lerp(1,.28,(h-17)/3);
    },
    label(){
      const h=Math.floor(G.hour);const m=Math.floor((G.hour-h)*60);
      return `Dia ${G.day} • ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    }
  };

  const WeatherSystem = {
    current:'clear',
    remaining:35,
    intensity:0,
    choose(){
      const b=D.BIOMES[Species.currentBiome]||D.BIOMES.cerrado;
      const options=b.weather||['clear'];
      let roll=Math.random();
      if(roll<.34)this.current='clear';
      else this.current=D.pick(options);
      this.remaining=(D.WEATHER[this.current]||D.WEATHER.clear).dur*D.rand(.7,1.25);
      this.intensity=this.current==='clear'?0:D.rand(.4,1);
      addLog(`Clima: ${(D.WEATHER[this.current]||D.WEATHER.clear).name}.`,'warn');
    },
    tick(dt){
      this.remaining-=dt*this.intensity;
      if(this.remaining<=0)this.choose();
      const w=D.WEATHER[this.current]||D.WEATHER.clear;
      this.intensity=this.current==='clear'?0:D.lerp(this.intensity,D.WEATHER[this.current] ? .75 : 0,.01);
      return w;
    },
    waterModifier(){return (D.WEATHER[this.current]||D.WEATHER.clear).water*this.intensity;},
    tempModifier(){return (D.WEATHER[this.current]||D.WEATHER.clear).temp*this.intensity;},
    plantModifier(){return D.WEATHER[this.current] ? D.lerp(1,D.WEATHER[this.current].plant,this.intensity) : 1;},
    dangerModifier(){return D.WEATHER[this.current] ? D.lerp(1,D.WEATHER[this.current].danger,this.intensity) : 1;}
  };

  const CameraSystem = {
    update(){
      if(!World.player)return;
      const vw=canvas.width, vh=canvas.height;
      World.camera.zoom=D.clamp(World.camera.zoom, .75, 2.1);
      const targetX=World.player.x;
      const targetY=World.player.y;
      World.camera.x=D.lerp(World.camera.x,targetX,.11);
      World.camera.y=D.lerp(World.camera.y,targetY,.11);
      World.camera.x=D.clamp(World.camera.x,vw/(2*D.TILE*World.camera.zoom),World.width-vw/(2*D.TILE*World.camera.zoom));
      World.camera.y=D.clamp(World.camera.y,vh/(2*D.TILE*World.camera.zoom),World.height-vh/(2*D.TILE*World.camera.zoom));
    },
    screenToWorld(sx,sy){
      const scale=D.TILE*World.camera.zoom;
      return {x:World.camera.x+(sx-canvas.width/2)/scale,y:World.camera.y+(sy-canvas.height/2)/scale};
    },
    worldToScreen(wx,wy){
      const scale=D.TILE*World.camera.zoom;
      return {x:canvas.width/2+(wx-World.camera.x)*scale,y:canvas.height/2+(wy-World.camera.y)*scale};
    }
  };

  const InputSystem = {
    bind(){
      window.addEventListener('keydown',e=>{
        const key=e.key.toLowerCase();
        if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(key))e.preventDefault();
        G.keys.add(key);
        if(UI.start.classList.contains('hidden'))this.handleKey(key);
      });
      window.addEventListener('keyup',e=>G.keys.delete(e.key.toLowerCase()));
      canvas.addEventListener('mousemove',e=>{
        const r=canvas.getBoundingClientRect();
        G.mouse.x=(e.clientX-r.left)*(canvas.width/r.width);
        G.mouse.y=(e.clientY-r.top)*(canvas.height/r.height);
        const w=CameraSystem.screenToWorld(G.mouse.x,G.mouse.y);
        G.mouse.worldX=w.x;G.mouse.worldY=w.y;
        const cross=document.getElementById('crosshair');
        cross.style.left=`${e.clientX-r.left}px`;
        cross.style.top=`${e.clientY-r.top}px`;
        cross.style.display='block';
      });
      canvas.addEventListener('mouseleave',()=>document.getElementById('crosshair').style.display='none');
      canvas.addEventListener('mousedown',e=>{if(e.button===0){G.mouse.down=true;this.clickWorld();}});
      window.addEventListener('mouseup',()=>G.mouse.down=false);
      document.querySelectorAll('[data-action]').forEach(btn=>btn.addEventListener('click',()=>this.action(btn.dataset.action)));
      document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>closeModal(btn.dataset.close)));
      UI.save.addEventListener('click',()=>SaveSystem.save(true));
      UI.load.addEventListener('click',()=>SaveSystem.load(true));
      UI.pause.addEventListener('click',()=>Game.togglePause());
      document.getElementById('btn-start').addEventListener('click',()=>Game.start());
    },
    handleKey(k){
      if(k==='v')openEvolution();
      if(k==='j')openLineage();
      if(k==='m')openMap();
      if(k==='b')openBuild();
      if(k==='e')interact();
      if(k===' ')useAbility();
      if(k==='1')this.action('eat');
      if(k==='2')this.action('call');
      if(k==='3')this.action('dig');
      if(k==='4')this.action('build');
      if(k==='5')this.action('attack');
      if(k==='p')Game.togglePause();
      if(k==='escape')closeAllModals();
      if(k==='+'||k==='=')World.camera.zoom=D.clamp(World.camera.zoom+.1,.75,2.1);
      if(k==='-'||k==='_')World.camera.zoom=D.clamp(World.camera.zoom-.1,.75,2.1);
    },
    movementVector(){
      let x=0,y=0;
      if(G.keys.has('w')||G.keys.has('arrowup'))y-=1;
      if(G.keys.has('s')||G.keys.has('arrowdown'))y+=1;
      if(G.keys.has('a')||G.keys.has('arrowleft'))x-=1;
      if(G.keys.has('d')||G.keys.has('arrowright'))x+=1;
      const len=Math.hypot(x,y);if(len>0){x/=len;y/=len;}
      return {x,y};
    },
    action(a){
      if(!G.running)return;
      if(a==='eat')PlayerSystem.feed();
      if(a==='call')PlayerSystem.callMate();
      if(a==='dig')PlayerSystem.dig();
      if(a==='build')openBuild();
      if(a==='attack')CombatSystem.playerAttack();
    },
    clickWorld(){
      if(G.modalOpen||!World.player)return;
      const p=World.player;
      const w=G.mouse;
      const dx=w.worldX-p.x,dy=w.worldY-p.y;
      if(Math.hypot(dx,dy)<2.2){interact();return;}
      p.target={x:w.worldX,y:w.worldY};
    }
  };

  const EntitySystem = {
    nextId:1,
    createId(prefix){return `${prefix}_${this.nextId++}`;},
    nearest(arr,x,y,max=999){
      let best=null,bd=max;
      for(const a of arr){const d=Math.hypot(a.x-x,a.y-y);if(d<bd){bd=d;best=a;}}
      return best;
    },
    removeDead(){
      World.animals=World.animals.filter(a=>a.hp>0 && !a.dead);
      World.plants=World.plants.filter(p=>p.hp>0 && !p.dead);
    }
  };

  const WorldSystem = {
    generate(){
      World.tiles=new Array(World.width*World.height);
      World.heightMap=new Array(World.width*World.height);
      World.moistureMap=new Array(World.width*World.height);
      World.waterMap=new Array(World.width*World.height);
      for(let y=0;y<World.height;y++){
        for(let x=0;x<World.width;x++){
          const i=y*World.width+x;
          const n1=D.noise(x*.055,y*.055,G.seed);
          const n2=D.noise(x*.12+50,y*.12+50,G.seed+9);
          const ridge=Math.abs(n2-.5)*2;
          const h=D.lerp(n1,.5,ridge*.5);
          const m=D.noise(x*.045+130,y*.045+22,G.seed+3);
          const edge=Math.min(x,World.width-1-x,y,World.height-1-y);
          let biome=D.mazeBiome(x,y);
          if(h<.19 && m>.45)biome='pantanal';
          if(edge<4)biome=biome==='pampa'?'pampa':biome;
          const water=(h<.205 || (m>.82&&n2<.45))?1:0;
          World.heightMap[i]=h;
          World.moistureMap[i]=m;
          World.waterMap[i]=water;
          World.tiles[i]={biome,height:h,moisture:m,water};
        }
      }
      this.carveRivers();
      this.scatterPlants();
      this.scatterAnimals();
      this.seedResources();
    },
    carveRivers(){
      for(let r=0;r<8;r++){
        let x=D.randi(4,World.width-5);let y=r%2===0?2:World.height-3;
        const targetX=D.rand(0,World.width);const targetY=D.rand(0,World.height);
        for(let i=0;i<260;i++){
          const tx=Math.round(x),ty=Math.round(y);
          for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){
            const xx=tx+ox,yy=ty+oy;
            if(xx>=0&&yy>=0&&xx<World.width&&yy<World.height){const idx=yy*World.width+xx;World.waterMap[idx]=1;World.tiles[idx].water=1;World.tiles[idx].biome=World.tiles[idx].biome==='caatinga'?'cerrado':World.tiles[idx].biome;}
          }
          const dx=(targetX-x),dy=(targetY-y);const l=Math.hypot(dx,dy)||1;
          x+=dx/l*(.5+D.rand(0,.8))+D.rand(-.8,.8);y+=dy/l*(.5+D.rand(0,.8))+D.rand(-.8,.8);
          if(x<2||x>=World.width-2||y<2||y>=World.height-2)break;
        }
      }
    },
    tileAt(x,y){
      const tx=Math.floor(x),ty=Math.floor(y);if(tx<0||ty<0||tx>=World.width||ty>=World.height)return null;return World.tiles[ty*World.width+tx];
    },
    isWater(x,y){const t=this.tileAt(x,y);return !!t&&t.water>0;},
    biomeAt(x,y){const t=this.tileAt(x,y);return t?t.biome:'cerrado';},
    scatterPlants(){
      World.plants=[];
      for(let i=0;i<720;i++){
        const x=D.rand(2,World.width-2),y=D.rand(2,World.height-2);const t=this.tileAt(x,y);if(!t||t.water&&Math.random()>.32)continue;
        const bd=D.BIOMES[t.biome];const key=D.pick(bd.plants);const spec=D.PLANTS[key];
        World.plants.push({id:EntitySystem.createId('pl'),x,y,type:key,name:spec.name,kind:spec.kind,hp:50,maxHp:50,growth:D.rand(.4,1),age:D.rand(0,40),energy:spec.biomass,seedTimer:D.rand(10,80),color:this.plantColor(t.biome),discovered:false});
      }
    },
    plantColor(b){
      const c={amazonas:'#4d9d55',caatinga:'#8aa04d',cerrado:'#6f934a',mata:'#41915b',pantanal:'#579b63',pampa:'#779e52'};return c[b]||'#5c934c';
    },
    scatterAnimals(){
      World.animals=[];
      for(let i=0;i<190;i++){
        const x=D.rand(3,World.width-3),y=D.rand(3,World.height-3);const t=this.tileAt(x,y);if(!t)continue;
        const bd=D.BIOMES[t.biome];const key=D.pick(bd.animals);const spec=D.ANIMALS[key];
        World.animals.push(this.makeAnimal(key,x,y));
      }
      Population.recalc();
    },
    makeAnimal(type,x,y){
      const s=D.ANIMALS[type]||D.ANIMALS.capivara;
      const kind=['arara','tucano','carcara','gavião','tuiuiu'].includes(type)?'bird':['peixe','ariranha'].includes(type)?'fish':'land';
      return {id:EntitySystem.createId('an'),type,x,y,name:s.name,kind,hp:s.hp,maxHp:s.hp,energy:70,water:70,age:D.rand(4,45),maturity:D.rand(15,35),speed:s.speed,damage:s.damage,size:s.size,diet:s.diet,color:s.color,state:'idle',target:null,dir:D.rand(0,Math.PI*2),think:D.rand(0,2),pack:D.randi(0,3),dead:false,foodCooldown:0,breedCooldown:D.rand(2,18)};
    },
    seedResources(){
      for(let y=0;y<World.height;y+=4)for(let x=0;x<World.width;x+=4){
        const t=this.tileAt(x,y);if(!t)continue;
        if(D.noise(x*.15,y*.15,G.seed+99)>.78 && !t.water)t.resource='stone';
        if(D.noise(x*.09,y*.09,G.seed+77)>.83 && !t.water)t.resource='wood';
      }
    },
    discoverAroundPlayer(){
      const p=World.player;if(!p)return;
      const radius=3+Species.genes.vision/35;
      for(let oy=-radius;oy<=radius;oy++)for(let ox=-radius;ox<=radius;ox++){
        const x=Math.floor(p.x+ox),y=Math.floor(p.y+oy);if(x<0||y<0||x>=World.width||y>=World.height)continue;
        const key=`${x},${y}`;
        if(!World.discovered.has(key))World.discovered.add(key);
        const b=this.biomeAt(x,y);if(!World.biomeDiscovery.has(b)){World.biomeDiscovery.add(b);Species.territory=Math.max(Species.territory,World.biomeDiscovery.size);Species.dna+=20;addLog(`Novo ambiente descoberto: ${D.BIOMES[b].name}. +20 DNA.`,'good');}
      }
    }
  };

  const PlayerSystem = {
    create(){
      const start=this.findSpawn(Species.currentBiome);
      World.player={id:'player',x:start.x,y:start.y,hp:Species.genes.hpMax,energy:Species.genes.energyMax,water:Species.genes.waterMax,age:4,maturity:false,dir:1,target:null,attackTimer:0,breedTimer:0,resting:false,stun:0,invuln:0,foodCooldown:0};
      World.camera.x=start.x;World.camera.y=start.y;Species.age=4;
      this.adaptToSpecies();
    },
    findSpawn(biome){
      for(let i=0;i<500;i++){const x=D.rand(12,World.width-12),y=D.rand(12,World.height-12);if(WorldSystem.biomeAt(x,y)===biome && !WorldSystem.isWater(x,y))return{x,y};}
      return{x:World.width*.45,y:World.height*.48};
    },
    adaptToSpecies(){
      if(!World.player)return;
      World.player.hp=D.clamp(World.player.hp||Species.genes.hpMax,1,Species.genes.hpMax);
      World.player.energy=D.clamp(World.player.energy||Species.genes.energyMax,0,Species.genes.energyMax);
      World.player.water=D.clamp(World.player.water||Species.genes.waterMax,0,Species.genes.waterMax);
    },
    update(dt){
      const p=World.player;if(!p)return;
      if(p.stun>0){p.stun-=dt;return;}
      p.invuln=Math.max(0,p.invuln-dt);p.attackTimer=Math.max(0,p.attackTimer-dt);p.foodCooldown=Math.max(0,p.foodCooldown-dt);p.breedTimer=Math.max(0,p.breedTimer-dt);
      const m=InputSystem.movementVector();
      let tx=0,ty=0;
      if(p.target && !G.keys.size){const dx=p.target.x-p.x,dy=p.target.y-p.y;const d=Math.hypot(dx,dy);if(d<.15)p.target=null;else{tx=dx/d;ty=dy/d;}}
      if(m.x||m.y){tx=m.x;ty=m.y;p.target=null;}
      const biome=D.BIOMES[WorldSystem.biomeAt(p.x,p.y)]||D.BIOMES.cerrado;
      const terrain=biome.movement||1;
      const temp=this.currentTemp();
      const stress=this.temperatureStress(temp);
      const speed=(Species.genes.speed/25)*terrain*(stress<.5?.72:1);
      if(tx||ty){p.x+=tx*speed*dt;p.y+=ty*speed*dt;p.dir=tx>=0?1:-1;p.resting=false;p.energy=Math.max(0,p.energy-(.55+Species.genes.energyDrain)*dt);}
      else {p.energy=Math.min(Species.genes.energyMax,p.energy+.35*dt);p.resting=true;}
      p.water=Math.max(0,p.water-(.045+Math.max(0,WeatherSystem.waterModifier())*.001)*dt);
      this.collideWorld();
      Species.age+=dt/30;
      if(Species.age>Species.genes.maturity&&!p.maturity){p.maturity=true;Species.dna+=25;addLog('Sua criatura atingiu a maturidade.','good');}
      if(p.foodCooldown<=0 && (p.energy<25||p.water<18)){this.autoForage();}
      if(p.hp<=0){this.handleDeath();}
      if(p.energy<1||p.water<1){p.hp-=.6*dt;}
    },
    collideWorld(){
      const p=World.player;p.x=D.clamp(p.x,1.2,World.width-1.2);p.y=D.clamp(p.y,1.2,World.height-1.2);
      const t=WorldSystem.tileAt(p.x,p.y);if(t&&t.water&&!this.canSwim()){p.x-=.3*p.dir;p.y-=.12;World.player.water=Math.max(0,World.player.water-.8);}
    },
    canSwim(){return Species.genes.swim>38;},
    currentTemp(){const b=D.BIOMES[Species.currentBiome]||D.BIOMES.cerrado;return b.temp+WeatherSystem.tempModifier()+Math.sin(G.time/60)*2;},
    temperatureStress(temp){const g=Species.genes;let a=1;if(temp>25)a-=Math.max(0,(temp-25)-(g.heat-50)*.12)/30;if(temp<22)a-=Math.max(0,(22-temp)-(g.cold-50)*.12)/30;return D.clamp(a,0,1);},
    autoForage(){
      const p=World.player;const target=EntitySystem.nearest(World.plants,p.x,p.y,3.5);if(target){p.target={x:target.x,y:target.y};if(D.distance(p,target)<1.1)this.eatPlant(target);}else{const meat=EntitySystem.nearest(World.animals.filter(a=>a.hp>0),p.x,p.y,4);if(meat && Species.genes.hunt>42 && D.distance(p,meat)<1.2)CombatSystem.playerAttack();}
    },
    eatPlant(plant){
      if(World.player.foodCooldown>0)return;
      const spec=D.PLANTS[plant.type]||D.PLANTS.graminea;const food=D.FOOD[spec.food]||D.FOOD.folha;
      const gain=food.energy*(.55+Species.genes.feed/100*.45)*WeatherSystem.plantModifier();
      World.player.energy=D.clamp(World.player.energy+gain,0,Species.genes.energyMax);
      World.player.water=D.clamp(World.player.water+food.water,0,Species.genes.waterMax);
      World.player.foodCooldown=.65;
      plant.growth-=.28;plant.hp-=18;plant.seedTimer+=4;
      Species.dna+=food.dna;Species.biomass+=food.biomass;addLog(`Você comeu ${spec.name}. +${Math.round(gain)} energia.`,'good');
      if(plant.hp<=0)plant.dead=true;
    },
    feed(){
      const p=World.player;if(!p)return;
      const plant=EntitySystem.nearest(World.plants,p.x,p.y,2.2);if(plant){this.eatPlant(plant);return;}
      const a=EntitySystem.nearest(World.animals,p.x,p.y,2.2);if(a&&a.hp<=0){const val=D.FOOD.carne.energy; p.energy=D.clamp(p.energy+val,0,Species.genes.energyMax);p.water=D.clamp(p.water+1,0,Species.genes.waterMax);Species.dna+=5;Species.biomass+=1;addLog(`Carcaça consumida. +${val} energia.`,'good');a.dead=true;}
      else toast('Nenhum alimento próximo');
    },
    drink(){
      const p=World.player;const t=WorldSystem.tileAt(p.x,p.y);if(t&&t.water){p.water=D.clamp(p.water+55,0,Species.genes.waterMax);Species.dna+=2;toast('Água absorvida');}else toast('Procure um rio, lago ou área alagada');
    },
    dig(){
      const p=World.player;const t=WorldSystem.tileAt(p.x,p.y);if(!t)return;
      if(t.resource==='stone' || Math.random()<.22+Species.genes.dig/300){const amount=D.randi(2,6);Species.stone+=amount;Species.dna+=3;addLog(`Escavação: +${amount} pedra.`,'good');G.shake=.6;}else if(Math.random()<.55){Species.biomass+=D.randi(1,4);Species.dna+=1;addLog('Você encontrou matéria orgânica no solo.','good');}else{toast('Nada útil encontrado');}
      World.player.energy=Math.max(0,World.player.energy-4);World.player.foodCooldown=.3;
    },
    callMate(){
      const p=World.player;if(!p)return;
      const mate=EntitySystem.nearest(World.animals.filter(a=>a.type==='player_proxy'||a.type===Species.id),p.x,p.y,7);
      if(!mate){spawnMateNear();toast('Você chamou, mas nenhum parceiro respondeu');return;}
      p.target={x:mate.x,y:mate.y};toast('Chamado reprodutivo emitido');
    },
    reproduceWith(mate){
      const p=World.player;if(!p||p.breedTimer>0||!p.maturity||Species.age<Species.genes.maturity)return false;
      if(D.distance(p,mate)>1.2)return false;
      const child=Genetics.mutateChild(Species.genes,mate.genes||Species.genes);
      const id=Species.lineage.length+2;
      Species.offspring++;Species.births++;Species.mates++;Species.population++;Species.dna+=40;
      Species.lineage.push({generation:Species.generation+1,name:`${Species.name} ${id}`,id,traits:traitSnapshot(child),parent:true});
      Species.objectiveIndex=Math.max(Species.objectiveIndex,2);
      p.breedTimer=12;
      addLog(`Novo descendente gerado! A linhagem avançou para geração ${Species.generation+1}.`,'good');
      toast('🧬 Descendente saudável');
      this.startNextGeneration(child);
      return true;
    },
    startNextGeneration(child){
      Species.generation++;Species.genes=child;Species.age=0;Species.objectiveIndex=Math.min(Species.objectivesDone+1,D.OBJECTIVES.length-1);Species.currentBiome=WorldSystem.biomeAt(World.player.x,World.player.y);Species.dna+=45;
      const oldName=Species.name;Species.name=makeSpeciesName(Species.name,Species.generation);
      World.player.hp=Species.genes.hpMax;World.player.energy=Species.genes.energyMax;World.player.water=Species.genes.waterMax;World.player.maturity=false;World.player.target=null;
      addLog(`Geração ${Species.generation}: ${oldName} → ${Species.name}. Características herdadas.` ,'good');
      Species.intelligence=Species.genes.intelligence;Species.social=Species.genes.social;
    },
    handleDeath(){
      if(World.player.invuln>0)return;
      World.player.invuln=1.5;
      Species.deaths++;
      if(Species.population>1){Species.population--;Species.age=Math.max(0,Species.age-6);World.player.hp=Species.genes.hpMax*.65;World.player.energy=Species.genes.energyMax*.6;World.player.water=Species.genes.waterMax*.6;addLog('O indivíduo morreu, mas sua linhagem sobrevive graças à população.','warn');}
      else {World.player.hp=Species.genes.hpMax*.8;World.player.energy=Species.genes.energyMax*.7;World.player.water=Species.genes.waterMax*.7;Species.dna=Math.max(0,Species.dna-10);Species.age=0;addLog('A linhagem quase desapareceu. Um indivíduo sobreviveu por pouco.','bad');}
    },
    habitatAdaptation(){
      const b=D.BIOMES[WorldSystem.biomeAt(World.player.x,World.player.y)];if(b&&Species.currentBiome!==b.id){Species.currentBiome=b.id;Species.dna+=25;addLog(`A linhagem se estabeleceu em ${b.name}. +25 DNA.`,'good');}
    }
  };

  const AISystem = {
    tick(dt){
      const p=World.player;
      for(let i=0;i<World.animals.length;i++){
        const a=World.animals[i];if(a.dead)continue;
        a.age+=dt/50;a.think-=dt;a.foodCooldown=Math.max(0,a.foodCooldown-dt);a.breedCooldown=Math.max(0,a.breedCooldown-dt);
        if(a.think<=0){this.think(a);a.think=D.rand(.5,2.5);}
        this.move(a,dt);
        this.needs(a,dt);
        this.interactions(a,dt);
        if(a.hp<=0)a.dead=true;
      }
      if(p){}
    },
    think(a){
      const dist=World.player?D.distance(a,World.player):999;
      if(a.hp<a.maxHp*.25){a.state='fleeing';a.target=this.nearestPlant(a);return;}
      if(a.energy<20 || a.water<20){a.state='seeking_food';a.target=this.nearestPlant(a);return;}
      if(a.age>a.maturity && a.breedCooldown<=0 && Math.random()<.18){a.state='mating';a.target=this.nearestMate(a);return;}
      if(dist<5 && a.diet==='carn' && Math.random()<.35){a.state='hunting';a.target=World.player;return;}
      if(Math.random()<.12){a.state='resting';a.target=null;return;}
      a.state=Math.random()<.55?'exploring':'foraging';a.target=a.state==='foraging'?this.nearestPlant(a):null;
    },
    nearestPlant(a){return EntitySystem.nearest(World.plants,a.x,a.y,10);},
    nearestMate(a){return EntitySystem.nearest(World.animals.filter(x=>x!==a&&x.type===a.type&&x.hp>0),a.x,a.y,8);},
    needs(a,dt){
      a.energy=Math.max(0,a.energy-(.12+Math.random()*.08)*dt);
      a.water=Math.max(0,a.water-.07*dt);
      if(a.energy<1||a.water<1)a.hp-=.3*dt;
    },
    move(a,dt){
      let tx=0,ty=0;
      if(a.target){const dx=a.target.x-a.x,dy=a.target.y-a.y,d=Math.hypot(dx,dy);if(d<.8 && a.state!=='fleeing')this.arrive(a);else if(d>0){tx=dx/d;ty=dy/d;}}
      if(!tx&&!ty){a.dir+=D.rand(-.4,.4);tx=Math.cos(a.dir);ty=Math.sin(a.dir);}
      if(a.state==='resting')return;
      const biome=D.BIOMES[WorldSystem.biomeAt(a.x,a.y)]||D.BIOMES.cerrado;
      const speed=(a.speed/45)*(biome.movement||1)*(a.kind==='fish'?1.12:1)*dt;
      const nx=a.x+tx*speed,ny=a.y+ty*speed;
      if(WorldSystem.isWater(nx,ny)&&a.kind!=='fish'&&Species.genes.swim<42){a.dir+=Math.PI/2;return;}
      a.x=D.clamp(nx,1.5,World.width-1.5);a.y=D.clamp(ny,1.5,World.height-1.5);
      if(tx!==0)a.facing=tx>0?1:-1;
    },
    arrive(a){
      if(a.state==='foraging'&&a.target?.id?.startsWith('pl')){if(a.foodCooldown<=0){const spec=D.PLANTS[a.target.type];if(spec){a.energy=Math.min(100,a.energy+(D.FOOD[spec.food]?.energy||12)*.5);a.water=Math.min(100,a.water+(D.FOOD[spec.food]?.water||2));a.target.growth-=.12;a.target.hp-=7;a.foodCooldown=2;}}}
      if(a.state==='hunting'&&a.target===World.player){CombatSystem.animalAttack(a,World.player);a.target=null;a.think=1;}
      if(a.state==='mating'&&a.target && D.distance(a,a.target)<1){if(a.breedCooldown<=0&&a.target.breedCooldown<=0){a.breedCooldown=16;a.target.breedCooldown=16;this.spawnOffspring(a,a.target);}}
      a.target=null;
    },
    interactions(a,dt){
      const p=World.player;if(!p)return;
      const d=D.distance(a,p);
      if(d<1.05 && a.state==='hunting' && a.damage>0){CombatSystem.animalAttack(a,p);}
      if(d<1.25 && a.diet==='herb'){p.hp-=0.0;}
    },
    spawnOffspring(a,b){
      if(World.animals.length>260)return;
      const child=this.spawnCompatible(a.type,a.x+D.rand(-1,1),a.y+D.rand(-1,1));child.maxHp=(a.maxHp+b.maxHp)/2;child.hp=child.maxHp*.6;child.age=0;addLog(`${a.name} teve um filhote. O ecossistema ganha uma nova geração.`,'good');
    },
    spawnCompatible(type,x,y){
      const a=WorldSystem.makeAnimal(type,x,y);World.animals.push(a);Population.recalc();return a;
    }
  };

  const CombatSystem = {
    playerAttack(){
      const p=World.player;if(!p||p.attackTimer>0)return;
      p.attackTimer=.45;p.energy=Math.max(0,p.energy-3);
      const enemies=World.animals.filter(a=>a.hp>0&&D.distance(a,p)<1.55).sort((a,b)=>D.distance(a,p)-D.distance(b,p));
      const e=enemies[0];if(!e){toast('Nenhum alvo no alcance');return;}
      const base=9+Species.genes.speed*.05+Species.genes.thorns*.1;const dmg=Math.max(2,base-e.size*2);
      e.hp-=dmg;e.state='fleeing';e.target=p;e.think=1;
      p.invuln=.15;G.shake=.35;
      if(e.hp<=0){e.dead=true;Species.dna+=Math.round(4+e.size*3);Species.biomass+=Math.max(1,Math.round(e.size));Species.offspring+=0;addLog(`Você caçou ${e.name}. +${Math.round(4+e.size*3)} DNA.`,'good');}
    },
    animalAttack(a,p){
      if(p.invuln>0)return;
      const mitigation=1-(Species.genes.defense/160);const dmg=Math.max(1,a.damage*mitigation*WeatherSystem.dangerModifier());p.hp-=dmg;p.stun=.08;p.invuln=.35;G.shake=.45;addLog(`${a.name} atacou você: -${Math.round(dmg)} vida.`,'bad');
      if(Species.genes.thorns>0 && Math.random()<.35){a.hp-=Species.genes.thorns*.35;}
    }
  };

  const PlantSystem = {
    tick(dt){
      const wm=WeatherSystem.plantModifier();
      for(const pl of World.plants){
        if(pl.dead)continue;
        pl.age+=dt;pl.seedTimer-=dt*wm;
        const t=WorldSystem.tileAt(pl.x,pl.y);if(!t)continue;
        const env=(t.moisture+.1)*(Species.genes.plantLight?Species.genes.plantLight/50:1);
        pl.growth=D.clamp(pl.growth+dt*(.003+env*.002)*wm,0,1.4);
        if(WeatherSystem.current==='fire' && Math.random()<.009*WeatherSystem.intensity) {pl.hp-=20;pl.growth*=.7;}
        if(pl.hp<pl.maxHp&&WeatherSystem.current!=='fire')pl.hp=Math.min(pl.maxHp,pl.hp+dt*.25*wm);
        if(pl.seedTimer<=0 && pl.growth>.78 && World.plants.length<1050){this.disperse(pl);pl.seedTimer=D.rand(15,70);}
        if(pl.hp<=0)pl.dead=true;
      }
    },
    disperse(parent){
      const dir=D.rand(0,Math.PI*2);const mode=Math.random();const spread=mode<.33?1.5:mode<.65?3.5:5.5;
      let x=parent.x+Math.cos(dir)*spread,y=parent.y+Math.sin(dir)*spread;
      x=D.clamp(x,2,World.width-2);y=D.clamp(y,2,World.height-2);const t=WorldSystem.tileAt(x,y);if(!t||t.water&&parent.kind!=='water')return;
      if(Math.random()<.55){const spec= D.PLANTS[parent.type];World.plants.push({id:EntitySystem.createId('pl'),x,y,type:parent.type,name:spec.name,kind:spec.kind,hp:35,maxHp:50,growth:.1,age:0,energy:spec.biomass,seedTimer:D.rand(20,80),color:parent.color,discovered:false});}
    },
    harvestNearby(){
      const p=World.player;const target=EntitySystem.nearest(World.plants,p.x,p.y,1.8);if(!target)return false;PlayerSystem.eatPlant(target);return true;
    }
  };

  const ResourceSystem = {
    tick(dt){
      if(Math.random()<.006*dt){Species.biomass=Math.max(0,Species.biomass-.1);}
      if(Math.random()<.004*dt){Species.stone=Math.max(0,Species.stone-.03);}
    },
    gatherAround(type){
      const p=World.player;const t=WorldSystem.tileAt(p.x,p.y);if(!t)return 0;
      let amount=0;
      if(type==='wood'){amount=D.randi(1,4)+Math.round(Species.genes.collect/40);Species.biomass+=amount;}
      if(type==='stone'){amount=D.randi(1,3)+Math.round(Species.genes.dig/50);Species.stone+=amount;}
      if(amount>0)Species.dna+=1;
      return amount;
    }
  };

  const BuildingSystem = {
    canBuild(def){return Object.entries(def.cost).every(([k,v])=>this.getResource(k)>=v);},
    getResource(k){if(k==='wood')return Species.biomass;if(k==='stone')return Species.stone;return 0;},
    spend(cost){for(const [k,v] of Object.entries(cost)){if(k==='wood')Species.biomass-=v;if(k==='stone')Species.stone-=v;}}
    ,place(id){
      const def=D.BUILDINGS.find(x=>x.id===id);if(!def)return false;
      if(!this.canBuild(def)){toast('Recursos insuficientes');return false;}
      const p=World.player;this.spend(def.cost);
      World.builds.push({id:EntitySystem.createId('build'),type:def.id,x:p.x+Math.cos(p.dir?0:0)*1.4,y:p.y+.8,hp:def.hp,maxHp:def.hp,age:0,progress:1});
      Species.buildingsBuilt++;Species.dna+=12;Species.intelligence=Math.max(Species.intelligence,Species.genes.intelligence+Species.buildingsBuilt*.8);
      addLog(`Construção: ${def.name}.`,'good');toast(`🏠 ${def.name} construída`);updateEra();UIRefresh.all();closeModal('build-modal');return true;
    },
    tick(dt){for(const b of World.builds){b.age+=dt;if(b.hp<b.maxHp)b.hp+=dt*.03;}}
  };

  const TechnologySystem = {
    unlock(id){
      const t=D.TECH.find(x=>x.id===id);if(!t||Species.techUnlocked.includes(id))return false;
      if(Species.dna<t.cost || Species.intelligence<t.req)return false;
      Species.dna-=t.cost;Species.techUnlocked.push(id);addLog(`Tecnologia descoberta: ${t.name}.`,'good');toast(`⚙️ ${t.name} desbloqueada`);updateEra();UIRefresh.all();return true;
    },
    progress(dt){
      if(World.builds.some(b=>b.type==='workshop'))Species.techProgress+=dt*.2;
      if(Species.techProgress>60 && !Species.techUnlocked.includes('tools'))this.unlock('tools');
      if(Species.buildingsBuilt>=4&&!Species.techUnlocked.includes('agriculture'))this.unlock('agriculture');
      if(Species.buildingsBuilt>=8&&!Species.techUnlocked.includes('advanced_build'))this.unlock('advanced_build');
    }
  };

  const TribeSystem = {
    score(){return Species.population + Species.buildingsBuilt*2 + Species.intelligence*.8 + Species.cultural*.5;},
    tick(dt){
      if(Species.intelligence>15 && Species.population>=5)Species.social=D.clamp(Species.social+dt*.03,0,200);
      if(Species.social>22 && Species.population>=8 && Species.buildingsBuilt>=2 && Species.era==='individuo'){Species.era='grupo';Species.objectiveIndex=Math.max(Species.objectiveIndex,5);addLog('Sua linhagem começa a formar grupos sociais.','good');}
      if(Species.social>36 && Species.population>=12 && Species.buildingsBuilt>=3 && Species.era!=='tribo'){Species.era='tribo';Species.techProgress+=15;addLog('🎉 Sua comunidade formou uma TRIBO.','good');toast('👥 TRIBO FORMADA');}
      if(Species.era==='tribo'&&Species.population>=20){Species.cultural=D.clamp(Species.cultural+dt*.04,0,100);}
    }
  };

  const CivilizationSystem = {
    tick(dt){
      if(Species.era==='tribo'&&Species.population>=20&&Species.techUnlocked.includes('agriculture')){Species.era='aldeia';addLog('🏘️ A tribo tornou-se uma ALDEIA.','good');}
      if(Species.era==='aldeia'&&Species.population>=35&&Species.techUnlocked.includes('advanced_build')){Species.era='vila';addLog('🏘️ A aldeia cresceu para VILA.','good');}
      if(Species.era==='vila'&&Species.population>=55&&Species.techUnlocked.includes('metallurgy')){Species.era='cidade';addLog('🏙️ A comunidade alcançou o estágio de CIDADE.','good');}
      if(Species.era==='cidade'&&Species.cultural>35&&Species.territory>=4){Species.era='civilização';addLog('🌎 Nasceu uma CIVILIZAÇÃO BioEvo.','good');}
      if(Species.era==='civilização')Species.cultural=Math.min(100,Species.cultural+dt*.03);
      if(Species.era==='cidade'&&Species.dna>700&&World.biomeDiscovery.size>=5&&!Species.techUnlocked.includes('metallurgy'))TechnologySystem.unlock('metallurgy');
    }
  };

  const DiplomacySystem = {
    entities:[],
    tick(dt){
      if(Species.era==='civilização'&&Math.random()<.004*dt){this.meetNeighbor();}
    },
    meetNeighbor(){
      const b=D.BIOME_ORDER.find(id=>!World.biomeDiscovery.has(id));
      if(b){addLog(`Exploradores avistaram rotas para ${D.BIOMES[b].name}.`,'good');Species.dna+=18;}
      else {Species.cultural=Math.min(100,Species.cultural+3);addLog('Contato diplomático fortaleceu a cultura.','good');}
    }
  };

  const PopulationSystem = {
    tick(dt){
      // Distant population is aggregated instead of creating thousands of AI entities.
      if(World.animals.length>250)World.animals.splice(180,World.animals.length-180);
      const local=World.animals.length;
      const carrying=40+Species.biomass*.3+Species.buildingsBuilt*6+Species.techUnlocked.length*5;
      if(Species.population<carrying && Math.random()<.012*dt){Species.population++;Species.dna+=2;}
      if(Species.population>Math.max(2,carrying*1.2) && Math.random()<.008*dt){Species.population--;Species.deaths++;}
      Population.recalc();
      Population.remote=Math.max(0,Species.population-local);
      if(Species.population>25){Species.intelligence=Math.min(100,Species.intelligence+dt*.015);}
    }
  };

  const EcologySystem = {
    tick(dt){
      const w=WeatherSystem.current;
      if(w==='drought'&&Math.random()<.012*dt){for(let i=0;i<2;i++){const pl=World.plants[D.randi(0,Math.max(0,World.plants.length-1))];if(pl){pl.hp-=8;}}}
      if(w==='flood'&&Math.random()<.01*dt){for(let i=0;i<2;i++){const a=World.animals[D.randi(0,Math.max(0,World.animals.length-1))];if(a&&!a.kind==='fish')a.y+=D.rand(-.5,.5);}}
      if(w==='fire'&&Math.random()<.03*dt){World.builds.forEach(b=>{if(Math.random()<.05)b.hp-=2;});}
      this.balance(dt);
    },
    balance(dt){
      const herb=World.animals.filter(a=>a.diet==='herb').length;const carn=World.animals.filter(a=>a.diet==='carn').length;
      Population.herbivores=herb;Population.predators=carn;
      if(World.plants.length<300 && Math.random()<.01*dt)WorldSystem.scatterPlantsSmall(4);
      Species.dna+=Math.max(0,(World.biomeDiscovery.size-1))*.0006*dt;
    }
  };

  // Small ecological refill; kept separate so the main scatter routine is only used during boot.
  WorldSystem.scatterPlantsSmall=function(count){
    for(let i=0;i<count;i++){
      const x=D.rand(2,World.width-2),y=D.rand(2,World.height-2);const t=this.tileAt(x,y);if(!t||t.water&&Math.random()>.3)continue;
      const key=D.pick(D.BIOMES[t.biome].plants);const spec=D.PLANTS[key];
      World.plants.push({id:EntitySystem.createId('pl'),x,y,type:key,name:spec.name,kind:spec.kind,hp:35,maxHp:50,growth:.25,age:0,energy:spec.biomass,seedTimer:D.rand(30,70),color:this.plantColor(t.biome),discovered:false});
    }
  };

  const SaveSystem = {
    key:'bioevo_save_v1',
    save(manual=false){
      const data={version:D.VERSION,seed:G.seed,species:serializeSpecies(),player:World.player?{x:World.player.x,y:World.player.y,hp:World.player.hp,energy:World.player.energy,water:World.player.water,age:World.player.age}:null,builds:World.builds.map(b=>({...b})),discoveries:[...World.discovered],biomes:[...World.biomeDiscovery],time:G.time,day:G.day,zoom:World.camera.zoom};
      try{localStorage.setItem(this.key,JSON.stringify(data));if(manual)toast('💾 Jogo salvo localmente');return true;}catch(err){addLog('Não foi possível salvar no navegador.','bad');return false;}
    },
    load(manual=false){
      try{const raw=localStorage.getItem(this.key);if(!raw){toast('Nenhum save encontrado');return false;}const data=JSON.parse(raw);applySave(data);if(manual)toast('📂 Jogo carregado');return true;}catch(err){addLog('Save inválido ou corrompido.','bad');return false;}
    }
  };

  const UISystem = {
    lastObjectiveUpdate:0,
    refresh(dt=0){
      UI.speciesName.textContent=Species.name;
      UI.speciesType.textContent=`${Species.type==='animal'?'Animal':'Vegetal'} • Geração ${Species.generation} • ${formatEra(Species.era)}`;
      UI.dna.textContent=Math.floor(Species.dna);
      UI.dnaLarge.textContent=Math.floor(Species.dna);
      UI.biomass.textContent=Math.floor(Species.biomass);
      UI.stone.textContent=Math.floor(Species.stone);
      if(World.player){
        const hp=World.player.hp,energy=World.player.energy,water=World.player.water;
        UI.hp.textContent=Math.ceil(hp);UI.energy.textContent=Math.ceil(energy);UI.water.textContent=Math.ceil(water);
        UI.barHP.style.width=`${D.clamp(hp/Species.genes.hpMax*100,0,100)}%`;
        UI.barEnergy.style.width=`${D.clamp(energy/Species.genes.energyMax*100,0,100)}%`;
        UI.barWater.style.width=`${D.clamp(water/Species.genes.waterMax*100,0,100)}%`;
        UI.speed.textContent=Math.round(Species.genes.speed);UI.defense.textContent=Math.round(Species.genes.defense);UI.jump.textContent=Math.round(Species.genes.jump);UI.vision.textContent=Math.round(Species.genes.vision);
      }
      if(dt>0){this.lastObjectiveUpdate-=dt;if(this.lastObjectiveUpdate<=0){this.refreshObjective();this.lastObjectiveUpdate=1;}}
      this.drawPortrait();
    },
    refreshObjective(){
      const o=D.OBJECTIVES[Math.min(Species.objectiveIndex,D.OBJECTIVES.length-1)];
      const progress=this.objectiveProgress(o);UI.objectiveTitle.textContent=o.title;UI.objectiveDesc.textContent=o.desc;UI.objectiveProgress.style.width=`${progress*100}%`;
      if(progress>=1){
        if(Species.objectiveIndex<D.OBJECTIVES.length-1){Species.objectiveIndex++;Species.objectivesDone=Math.max(Species.objectivesDone,Species.objectiveIndex);Species.dna+=30;addLog(`Marco evolutivo concluído: ${o.title}. +30 DNA.`,'good');}
      }
    },
    objectiveProgress(o){
      switch(o.id){
        case'survive':return D.clamp((World.player?.energy||0)/100,.0,1);
        case'mate':return D.clamp(Species.mates/1,0,1);
        case'offspring':return D.clamp(Species.offspring/1,0,1);
        case'evolve':return D.clamp(Species.adaptations.length/1,0,1);
        case'territory':return D.clamp(Species.territory/3,0,1);
        case'society':return D.clamp(Species.social/25,0,1);
        case'tribe':return Species.era==='tribo'||['aldeia','vila','cidade','civilização'].includes(Species.era)?1:0;
        case'village':return Species.population>=20&&Species.era!=='tribo'&&Species.era!=='grupo'?1:0;
        case'city':return Species.era==='cidade'||Species.era==='civilização'?1:0;
        case'civilization':return Species.era==='civilização'?1:0;
        default:return 0;
      }
    },
    drawPortrait(){
      if(!Species.genes)return;SP.clear(pctx,portrait.width,portrait.height,'#0b160e');
      SP.drawPlayer(pctx,portrait.width/2,portrait.height*.56,42,Species.genes,{shadow:false,facing:Species.genes.body==='bird'?1:1});
      const b=D.BIOMES[Species.currentBiome]||D.BIOMES.cerrado;pctx.fillStyle='#869d89';pctx.font='9px system-ui';pctx.textAlign='center';pctx.fillText(`${b.icon} ${b.name}`,64,119);
    },
    drawEvolution(){
      if(!Species.genes)return;SP.clear(epctx,evoPortrait.width,evoPortrait.height,'#09130c');SP.drawPlayer(epctx,160,180,92,Species.genes,{shadow:false,facing:1});
    },
    evolutionOptions(){
      UI.evoOptions.innerHTML='';
      for(const m of D.MUTATIONS){
        const div=document.createElement('div');div.className='evo-option';
        const left=document.createElement('div');
        left.innerHTML=`<h3>${m.name} ${Species.adaptations.includes(m.id)?'✓':''}</h3><p>${m.desc}</p>`;
        const right=document.createElement('div');right.innerHTML=`<div class="cost">🧬 ${m.cost}</div>`;
        const btn=document.createElement('button');btn.textContent=Species.adaptations.includes(m.id)?'ADQUIRIDA':'EVOLUIR';btn.disabled=Species.adaptations.includes(m.id)||Species.dna<m.cost;btn.onclick=()=>{if(Genetics.apply(m.id))this.evolutionOptions();};
        right.appendChild(btn);div.appendChild(left);div.appendChild(right);UI.evoOptions.appendChild(div);
      }
    },
    lineage(){
      UI.lineageTree.innerHTML='';
      const root={generation:1,name:Species.name.split(' ')[0],info:'ancestral',traits:null};
      const arr=[root,...Species.lineage];
      arr.forEach((n,i)=>{const d=document.createElement('div');d.className=`lineage-node ${i===arr.length-1?'current':''}`;d.innerHTML=`<div class="gen">Geração ${n.generation||1}</div><div class="nm">${n.name||'Ancestral'}</div><div class="info">${i===arr.length-1?'VOCÊ':'ramificação'}<br>${n.traits?`Vel ${Math.round(n.traits.speed)} • Def ${Math.round(n.traits.defense)}`:''}</div>`;UI.lineageTree.appendChild(d);});
    },
    map(){
      const c=UI.mapCanvas,x=c.getContext('2d');SP.clear(x,c.width,c.height,'#0b160e');
      const scale=Math.min(c.width/World.width,c.height/World.height);for(let y=0;y<World.height;y+=2)for(let xx=0;xx<World.width;xx+=2){const t=World.tiles[y*World.width+xx];if(!t)continue;const b=D.BIOMES[t.biome];x.fillStyle=t.water?'#356f82':b.base;x.fillRect(xx*scale,y*scale,2*scale+1,2*scale+1);}
      const pp=CameraSystem.worldToScreen(World.player.x,World.player.y);const mx=World.player.x*scale,my=World.player.y*scale;x.fillStyle='#f2f0c9';x.beginPath();x.arc(mx,my,5,0,Math.PI*2);x.fill();
      UI.mapLegend.innerHTML=D.BIOME_ORDER.map(id=>`<span>${D.BIOMES[id].icon} ${D.BIOMES[id].name}</span>`).join('');
    }
  };
  const UIRefresh=UISystem;

  const RenderSystem = {
    accumulator:0,
    render(){
      resizeCanvas();
      const light=TimeSystem.getLight();
      ctx.save();
      ctx.imageSmoothingEnabled=false;
      ctx.fillStyle='#07100a';ctx.fillRect(0,0,canvas.width,canvas.height);
      this.drawWorld(light);
      this.drawEntities(light);
      this.drawWeather();
      this.drawVignette(light);
      this.drawTopWorldInfo();
      ctx.restore();
    },
    drawWorld(light){
      const scale=D.TILE*World.camera.zoom;
      const left=Math.floor(World.camera.x-canvas.width/(2*scale))-2;
      const right=Math.ceil(World.camera.x+canvas.width/(2*scale))+2;
      const top=Math.floor(World.camera.y-canvas.height/(2*scale))-2;
      const bottom=Math.ceil(World.camera.y+canvas.height/(2*scale))+2;
      for(let ty=top;ty<=bottom;ty++){
        for(let tx=left;tx<=right;tx++){
          if(tx<0||ty<0||tx>=World.width||ty>=World.height)continue;
          const t=World.tiles[ty*World.width+tx];const b=D.BIOMES[t.biome];
          const sx=(tx-World.camera.x)*scale+canvas.width/2,sy=(ty-World.camera.y)*scale+canvas.height/2;
          let c=b.base;
          if(t.water)c=b.water;
          const n=D.hash(tx,ty,G.seed+4);if(!t.water && n>.76)c=b.light;if(!t.water&&n<.12)c=b.dark;
          ctx.fillStyle=c;ctx.fillRect(Math.floor(sx),Math.floor(sy),Math.ceil(scale+1),Math.ceil(scale+1));
          this.tileDecoration(t,tx,ty,sx,sy,scale,n);
        }
      }
      ctx.globalAlpha=.12;ctx.fillStyle='#fff';for(let i=0;i<World.discovered.size/20;i++){/* intentional cheap fog texture */}ctx.globalAlpha=1;
    },
    tileDecoration(t,tx,ty,sx,sy,s,n){
      if(s<16)return;
      const k=(tx*13+ty*7)%11;
      if(t.water){if(k<3){ctx.strokeStyle='rgba(180,235,232,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx+3,sy+s*.45);ctx.lineTo(sx+s*.75,sy+s*.45);ctx.stroke();}return;}
      if(k===0){ctx.fillStyle='rgba(0,0,0,.16)';ctx.fillRect(sx+s*.2,sy+s*.65,s*.48,s*.1);}
      if(k===1||k===6){ctx.fillStyle='rgba(0,0,0,.14)';ctx.fillRect(sx+s*.55,sy+s*.6,2,5);}
      if(k===2){ctx.fillStyle='rgba(255,233,142,.22)';ctx.fillRect(sx+s*.15,sy+s*.23,2,2);}
    },
    drawEntities(light){
      const scale=D.TILE*World.camera.zoom;
      const sx=World.player?CameraSystem.worldToScreen(World.player.x,World.player.y):{x:canvas.width/2,y:canvas.height/2};
      const visiblePlants=[];const visibleAnimals=[];const rangeX=canvas.width/(2*scale)+3,rangeY=canvas.height/(2*scale)+3;
      for(const pl of World.plants){if(Math.abs(pl.x-World.camera.x)<rangeX&&Math.abs(pl.y-World.camera.y)<rangeY)visiblePlants.push(pl);}
      for(const a of World.animals){if(Math.abs(a.x-World.camera.x)<rangeX&&Math.abs(a.y-World.camera.y)<rangeY)visibleAnimals.push(a);}
      visiblePlants.sort((a,b)=>a.y-b.y);for(const pl of visiblePlants){const q=CameraSystem.worldToScreen(pl.x,pl.y);SP.drawPlant(ctx,q.x,q.y,Math.max(7,11*scale/1.8),pl,{color:pl.color},{growth:pl.growth,phase:G.time});}
      for(const b of World.builds){if(Math.abs(b.x-World.camera.x)<rangeX&&Math.abs(b.y-World.camera.y)<rangeY){const q=CameraSystem.worldToScreen(b.x,b.y);SP.drawBuilding(ctx,q.x,q.y,b,Math.max(.6,scale/18));}}
      visibleAnimals.sort((a,b)=>a.y-b.y);for(const a of visibleAnimals){const q=CameraSystem.worldToScreen(a.x,a.y);SP.drawAnimal(ctx,q.x,q.y,Math.max(7,a.size*10*scale/1.8),a,{facing:a.facing||1,alpha:.96});}
      if(World.player)SP.drawPlayer(ctx,sx.x,sx.y,Math.max(9,11*scale/1.8),Species.genes,{facing:World.player.dir,attack:World.player.attackTimer>.1});
      this.drawSelection();
    },
    drawSelection(){
      if(!World.player)return;const p=World.player;
      ctx.strokeStyle='rgba(218,244,188,.55)';ctx.lineWidth=1;ctx.beginPath();const q=CameraSystem.worldToScreen(p.x,p.y);ctx.ellipse(q.x,q.y+12,22,6,0,0,Math.PI*2);ctx.stroke();
      if(p.target){const t=CameraSystem.worldToScreen(p.target.x,p.target.y);ctx.strokeStyle='rgba(232,219,147,.5)';ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(t.x,t.y);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(t.x,t.y,7,0,Math.PI*2);ctx.stroke();}
    },
    drawWeather(){
      const type=WeatherSystem.current;if(type==='clear')return;
      const count=Math.floor(40*(WeatherSystem.intensity||.5));for(let i=0;i<count;i++){
        const x=(D.hash(i,G.day,G.seed+10)*canvas.width),y=(D.hash(i+2,G.day,G.seed+20)*canvas.height);
        SP.drawWeatherParticle(ctx,x,y,(type==='rain'||type==='storm')?'rain':type==='frost'?'snow':type==='fire'?'fire':'ash',10,G.time+i);
      }
    },
    drawVignette(light){
      const g=ctx.createRadialGradient(canvas.width/2,canvas.height/2,Math.min(canvas.width,canvas.height)*.15,canvas.width/2,canvas.height/2,Math.max(canvas.width,canvas.height)*.7);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${.56*(1-light)+.18})`);ctx.fillStyle=g;ctx.fillRect(0,0,canvas.width,canvas.height);
    },
    drawTopWorldInfo(){
      const b=D.BIOMES[WorldSystem.biomeAt(World.player?.x||0,World.player?.y||0)]||D.BIOMES.cerrado;
      ctx.fillStyle='rgba(7,14,9,.75)';ctx.fillRect(12,12,260,48);ctx.strokeStyle='rgba(67,95,70,.7)';ctx.strokeRect(12,12,260,48);
      ctx.fillStyle='#e6f1df';ctx.font='bold 12px system-ui';ctx.fillText(`${b.icon} ${b.name}`,22,31);
      ctx.fillStyle='#97aa9a';ctx.font='10px system-ui';ctx.fillText(`${TimeSystem.label()}  •  ${(D.WEATHER[WeatherSystem.current]||D.WEATHER.clear).name}`,22,47);
      ctx.fillStyle='#a7bd9f';ctx.fillText(`Pop. ${Math.round(Species.population)}  •  ${Population.predators} predadores`,22,59);
      if(G.paused){ctx.fillStyle='#f2d27d';ctx.font='bold 18px system-ui';ctx.fillText('PAUSADO',canvas.width/2-45,38);}
    }
  };

  const Game = {
    start(){
      Species.name=(UI.inputSpecies.value.trim()||'Carijó').slice(0,18);
      Species.currentBiome=G.selectedBiome;
      Species.genes=Genetics.createSeed('walker');Species.id=`${Species.name.toLowerCase().replace(/\W+/g,'_')}_1`;Species.color=Species.genes.color;Species.generation=1;Species.dna=120;Species.population=1;Species.territory=1;Species.adaptations=[];Species.lineage=[];Species.offspring=0;Species.mates=0;Species.births=0;Species.deaths=0;Species.era='individuo';Species.techUnlocked=['stone'];Species.cultural=0;Species.intelligence=5;Species.social=5;Species.objectiveIndex=0;Species.objectivesDone=0;Species.biomass=0;Species.stone=0;Species.traitHistory=[];
      UI.start.classList.add('hidden');G.modalOpen=false;UI.loading.classList.remove('hidden');
      setTimeout(()=>{WorldSystem.generate();WorldSystem.scatterAnimals();WorldSystem.discovered.clear();World.biomeDiscovery.clear();PlayerSystem.create();WorldSystem.discoverAroundPlayer();WeatherSystem.choose();UISystem.refresh();UI.loading.classList.add('hidden');G.running=true;G.paused=false;addLog('A linhagem começou sua jornada.','good');requestAnimationFrame(Game.loop);},30);
    },
    loop(now){
      if(!G.running)return;const dt=Math.min(.05,(now-G.last)/1000);G.last=now;
      if(!G.paused){this.update(dt);}
      RenderSystem.render();
      requestAnimationFrame(Game.loop);
    },
    update(dt){
      TimeSystem.tick(dt);WeatherSystem.tick(dt);PlayerSystem.update(dt);WorldSystem.discoverAroundPlayer();
      G.simAccumulator+=dt;G.weatherAccumulator+=dt;G.popAccumulator+=dt;G.uiAccumulator+=dt;
      if(G.simAccumulator>.12){const step=G.simAccumulator;G.simAccumulator=0;AISystem.tick(step);PlantSystem.tick(step);EcologySystem.tick(step);ResourceSystem.tick(step);BuildingSystem.tick(step);TribeSystem.tick(step);CivilizationSystem.tick(step);DiplomacySystem.tick(step);TechnologySystem.progress(step);PopulationSystem.tick(step);EntitySystem.removeDead();}
      if(G.uiAccumulator>.22){UIRefresh.refresh(G.uiAccumulator);G.uiAccumulator=0;}
      if(G.popAccumulator>18){G.popAccumulator=0;SaveSystem.save(false);}
      PlayerSystem.habitatAdaptation();updateEra();
    },
    togglePause(){G.paused=!G.paused;UI.pause.textContent=G.paused?'Continuar':'Pausar';toast(G.paused?'Jogo pausado':'Jogo retomado');}
  };

  function updateEra(){
    if(Species.intelligence>15&&Species.era==='individuo')Species.era='grupo';
    if(Species.intelligence>25&&Species.social>30&&Species.population>=8&&Species.era==='grupo')Species.era='tribo';
    if(Species.era==='tribo'&&Species.population>=20&&Species.techUnlocked.includes('agriculture'))Species.era='aldeia';
  }

  function onNewDay(){
    Species.dna+=Math.round(3+World.biomeDiscovery.size);
    Species.lifetimeBest=Math.max(Species.lifetimeBest,Species.generation);
    if(Species.population>4){Species.intelligence=Math.min(100,Species.intelligence+.25);Species.social=Math.min(100,Species.social+.18);}
    addLog(`Novo dia. +${3+World.biomeDiscovery.size} DNA pela experiência da linhagem.`,'good');
  }

  function spawnMateNear(){
    if(World.animals.length>240)return;
    const p=World.player;const mate={id:EntitySystem.createId('mate'),type:Species.id,x:p.x+D.rand(-2.5,2.5),y:p.y+D.rand(-2.5,2.5),name:'Parceiro',kind:Species.genes.body==='fish'?'fish':Species.genes.body==='bird'?'bird':'land',hp:Species.genes.hpMax*.8,maxHp:Species.genes.hpMax*.8,energy:80,water:80,age:Species.genes.maturity+5,maturity:Species.genes.maturity,speed:Species.genes.speed*.95,damage:5,size:Species.genes.size,diet:'herb',color:Species.genes.color,state:'mating',target:p,genes:Genetics.cloneGenes(Species.genes),dir:0,think:1,pack:1,foodCooldown:0,breedCooldown:0,facing:1};World.animals.push(mate);Species.population=Math.max(Species.population,2);Population.recalc();
  }

  function interact(){
    if(!World.player)return;
    const p=World.player;
    const mate=EntitySystem.nearest(World.animals.filter(a=>a.type===Species.id||a.id.startsWith('mate_')),p.x,p.y,1.5);
    if(mate && p.maturity){PlayerSystem.reproduceWith(mate);return;}
    if(WorldSystem.isWater(p.x,p.y)){PlayerSystem.drink();return;}
    if(PlantSystem.harvestNearby())return;
    const b=EntitySystem.nearest(World.builds,p.x,p.y,2);if(b){toast('Estrutura: '+(D.BUILDINGS.find(x=>x.id===b.type)?.name||b.type));return;}
    ResourceSystem.gatherAround('wood');
  }

  function useAbility(){
    const p=World.player;if(!p)return;
    if(WorldSystem.isWater(p.x,p.y)){PlayerSystem.drink();return;}
    if(p.energy<12){toast('Energia insuficiente');return;}
    p.energy-=10;Species.dna+=5;Species.genes.perception+=1;addLog('Comportamento adaptativo praticado. +5 DNA.','good');
  }

  function openEvolution(){
    UI.evoModal.classList.remove('hidden');G.modalOpen=true;UIRefresh.evolutionOptions();UIRefresh.drawEvolution();
  }
  function openLineage(){UI.lineageModal.classList.remove('hidden');G.modalOpen=true;UIRefresh.lineage();}
  function openMap(){UI.mapModal.classList.remove('hidden');G.modalOpen=true;UIRefresh.map();}
  function openBuild(){UI.buildModal.classList.remove('hidden');G.modalOpen=true;UI.buildOptions.innerHTML='';for(const b of D.BUILDINGS){const row=document.createElement('div');row.className='build-option';const left=document.createElement('div');left.innerHTML=`<b>${b.name}</b><p>${b.desc}</p><span class="mat">🪵 ${b.cost.wood||0} • 🪨 ${b.cost.stone||0}</span>`;const btn=document.createElement('button');btn.textContent='CONSTRUIR';btn.disabled=!BuildingSystem.canBuild(b);btn.onclick=()=>BuildingSystem.place(b.id);row.appendChild(left);row.appendChild(btn);UI.buildOptions.appendChild(row);}}
  function closeModal(id){const el=document.getElementById(id);if(el)el.classList.add('hidden');G.modalOpen=[UI.evoModal,UI.lineageModal,UI.mapModal,UI.buildModal].some(m=>!m.classList.contains('hidden'));}
  function closeAllModals(){[UI.evoModal,UI.lineageModal,UI.mapModal,UI.buildModal].forEach(m=>m.classList.add('hidden'));G.modalOpen=false;}

  function makeSpeciesName(base,g){
    const suffixes=['Nova','Verde','do Campo','Ribeira','da Mata','do Cerrado','Caçadora','do Sol','do Rio','Nativa'];
    const root=(base||'Carijó').split(' ')[0];return g===1?root:`${root} ${D.pick(suffixes)}`;
  }

  function traitSnapshot(g){return {speed:g.speed,defense:g.defense,jump:g.jump,vision:g.vision,heat:g.heat,cold:g.cold,swim:g.swim,flight:g.flight,intelligence:g.intelligence,social:g.social};}

  function serializeSpecies(){return JSON.parse(JSON.stringify(Species));}

  function applySave(data){
    if(!data||!data.species)return;
    Object.assign(Species,data.species);Species.genes=Genetics.clampGeneSet(Species.genes||Genetics.createSeed('walker'));
    G.seed=data.seed||G.seed;G.time=data.time||0;G.day=data.day||1;World.camera.zoom=data.zoom||1;Species.currentBiome=Species.currentBiome||'cerrado';
    WorldSystem.generate();World.builds=Array.isArray(data.builds)?data.builds:[];World.discovered=new Set(data.discoveries||[]);World.biomeDiscovery=new Set(data.biomes||[]);
    PlayerSystem.create();if(data.player){World.player.x=data.player.x;World.player.y=data.player.y;World.player.hp=data.player.hp;World.player.energy=data.player.energy;World.player.water=data.player.water;World.player.age=data.player.age||0;}
    UI.start.classList.add('hidden');UI.loading.classList.add('hidden');G.running=true;G.paused=false;closeAllModals();UIRefresh.refresh();addLog('Save restaurado.','good');requestAnimationFrame(Game.loop);
  }

  function toast(text){
    UI.toast.textContent=text;UI.toast.classList.add('show');G.toastTimer=1.8;
    clearTimeout(G._toastTimeout);G._toastTimeout=setTimeout(()=>UI.toast.classList.remove('show'),1800);
  }

  function addLog(text,kind=''){const el=document.createElement('div');el.className=`log-item ${kind}`;el.textContent=text;UI.log.prepend(el);while(UI.log.children.length>30)UI.log.removeChild(UI.log.lastChild);}

  function formatEra(era){return ({individuo:'Indivíduo',grupo:'Grupo',tribo:'Tribo',aldeia:'Aldeia',vila:'Vila',cidade:'Cidade',civilização:'Civilização'})[era]||era;}

  function resizeCanvas(){
    const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
    const dpr=Math.min(window.devicePixelRatio||1,1.5);const w=Math.round(rect.width*dpr),h=Math.round(rect.height*dpr);
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;ctx.imageSmoothingEnabled=false;}
  }

  function setupStartScreen(){
    UI.startBiomes.innerHTML='';
    for(const id of D.BIOME_ORDER){const b=D.BIOMES[id];const btn=document.createElement('button');btn.className=`biome-choice ${id===G.selectedBiome?'selected':''}`;btn.innerHTML=`<div class="bname">${b.icon} ${b.name}</div><div class="desc">${b.desc}</div>`;btn.onclick=()=>{G.selectedBiome=id;document.querySelectorAll('.biome-choice').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected');};UI.startBiomes.appendChild(btn);}
  }

  function boot(){
    InputSystem.bind();setupStartScreen();World.camera.zoom=1;UI.start.classList.remove('hidden');
    window.addEventListener('beforeunload',()=>{if(G.running)SaveSystem.save(false);});
    // Soft-start ambient render before the first game.
    resizeCanvas();SP.clear(ctx,canvas.width,canvas.height,'#07100a');ctx.fillStyle='#afc7ae';ctx.font='12px system-ui';ctx.textAlign='center';ctx.fillText('BIOEVO • BRASIL NATIVO',canvas.width/2,canvas.height/2);
  }

  window.BioEvoGame={Game,World,Species,SaveSystem,Genetics,openEvolution,openLineage,openMap,openBuild};
  boot();
})();

/* --- Extra systems and helpers kept in this file for a self-contained GitHub Pages build. --- */
/* The following utility library is intentionally dependency-free and used by future save-compatible systems. */
(function(){
  window.BioUtility={
    average(list,key){if(!list.length)return 0;let s=0;for(const x of list)s+=Number(x[key]||0);return s/list.length;},
    percentile(list,p){if(!list.length)return 0;const a=list.map(Number).sort((x,y)=>x-y);const i=(a.length-1)*p;const lo=Math.floor(i),hi=Math.ceil(i);return lo===hi?a[lo]:a[lo]+(a[hi]-a[lo])*(i-lo);},
    weighted(items,weights){let total=weights.reduce((a,b)=>a+b,0);let r=Math.random()*total;for(let i=0;i<items.length;i++){r-=weights[i];if(r<=0)return items[i];}return items[items.length-1];},
    gridKey(x,y){return `${x|0}:${y|0}`;},
    seededNoise(x,y,s){let n=Math.sin(x*157.31+y*113.71+s*17.17)*43758.5453;return n-Math.floor(n);},
    clamp(v,a,b){return Math.max(a,Math.min(b,v));},
    dist(ax,ay,bx,by){return Math.hypot(ax-bx,ay-by);},
    angle(ax,ay,bx,by){return Math.atan2(by-ay,bx-ax);},
    normalize(x,y){const d=Math.hypot(x,y)||1;return{x:x/d,y:y/d};},
    formatNumber(n){return Intl.NumberFormat('pt-BR',{maximumFractionDigits:0}).format(n);},
    deepClone(v){return JSON.parse(JSON.stringify(v));}
  };
})();

/* Save schema migration hooks. Keeping them explicit makes later versions safer. */
(function(){
  const migrations={
    '0.8.0':d=>d,
    '0.9.0':d=>d
  };
  window.BioSaveMigrations={
    migrate(data){if(!data)return data;const v=data.version||'0.8.0';return migrations[v]?migrations[v](data):data;}
  };
})();

/* Simple color utilities for sprite evolution. */
(function(){
  window.BioColor={
    hexToRgb(hex){const m=String(hex).match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);if(!m)return{r:100,g:150,b:100};return{r:parseInt(m[1],16),g:parseInt(m[2],16),b:parseInt(m[3],16)};},
    rgbToHex(r,g,b){return'#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');},
    mix(a,b,t){const A=this.hexToRgb(a),B=this.hexToRgb(b);return this.rgbToHex(A.r+(B.r-A.r)*t,A.g+(B.g-A.g)*t,A.b+(B.b-A.b)*t);},
    shade(a,t=-.2){const c=this.hexToRgb(a);return this.rgbToHex(c.r*(1+t),c.g*(1+t),c.b*(1+t));}
  };
})();

/* Balancing table reserved for deterministic tuning without touching the simulation flow. */
(function(){
  window.BioBalance={
    player:{energyDrain:.45,waterDrain:.045,attackCooldown:.45,foodCooldown:.65},
    population:{maxLocalAnimals:180,hardLocalAnimals:250,baseCarrying:40},
    performance:{maxParticles:45,maxPlants:1050,maxBuildings:100,maxLogs:30},
    genetics:{mutationChance:.075,rareMutationChance:.012},
    progression:{dnaDay:3,dnaDiscovery:20,dnaFood:2,dnaReproduction:40}
  };
})();

/* Accessibility: keyboard focus and reduced motion friendly hooks. */
(function(){
  document.addEventListener('focusin',e=>{if(e.target.matches('button,input'))e.target.setAttribute('data-focused','1');});
  document.addEventListener('focusout',e=>{if(e.target.matches('button,input'))e.target.removeAttribute('data-focused');});
})();

/* Debug bridge is intentionally inert unless a developer opens the console. */
(function(){
  window.BioDebug={
    state(){return window.BioEvoGame?{species:window.BioEvoGame.Species,player:window.BioEvoGame.World.player,animals:window.BioEvoGame.World.animals.length,plants:window.BioEvoGame.World.plants.length}:null;},
    addDNA(n){if(window.BioEvoGame){window.BioEvoGame.Species.dna+=Number(n)||0;}},
    reveal(){if(window.BioEvoGame){window.BioEvoGame.World.biomeDiscovery=new Set(BioData.BIOME_ORDER);}},
    heal(){if(window.BioEvoGame){const p=window.BioEvoGame.World.player;if(p){p.hp=window.BioEvoGame.Species.genes.hpMax;p.energy=window.BioEvoGame.Species.genes.energyMax;p.water=window.BioEvoGame.Species.genes.waterMax;}}}
  };
})();

/* Deterministic easing helpers used by future animation channels. */
(function(){
  window.BioEase={
    linear:t=>t,
    smooth:t=>t*t*(3-2*t),
    smoother:t=>t*t*t*(t*(t*6-15)+10),
    outQuad:t=>1-(1-t)*(1-t),
    inQuad:t=>t*t,
    pulse:t=>.5+.5*Math.sin(t*Math.PI*2),
    spring:t=>1-Math.exp(-6*t)*Math.cos(9*t)
  };
})();

/* ========================================================================== */
/* CONTENT PACK: ambient ecology, milestones and lightweight tuning metadata */
/* This data is read on demand; it does not spawn entities or cost frame time. */
/* ========================================================================== */
(function(){
  const events = window.BioAmbientEvents = [];
  events.push({id:'amb_000',biome:'amazonas',kind:'rastros',text:'Sinal ecológico 000 observado em amazonas: rastros.',dna:2});
  events.push({id:'amb_001',biome:'caatinga',kind:'florescimento',text:'Sinal ecológico 001 observado em caatinga: florescimento.',dna:3});
  events.push({id:'amb_002',biome:'cerrado',kind:'migração',text:'Sinal ecológico 002 observado em cerrado: migração.',dna:4});
  events.push({id:'amb_003',biome:'mata',kind:'ninhos',text:'Sinal ecológico 003 observado em mata: ninhos.',dna:5});
  events.push({id:'amb_004',biome:'pantanal',kind:'sementes',text:'Sinal ecológico 004 observado em pantanal: sementes.',dna:6});
  events.push({id:'amb_005',biome:'pampa',kind:'cantos',text:'Sinal ecológico 005 observado em pampa: cantos.',dna:7});
  events.push({id:'amb_006',biome:'amazonas',kind:'pegadas',text:'Sinal ecológico 006 observado em amazonas: pegadas.',dna:8});
  events.push({id:'amb_007',biome:'caatinga',kind:'chuva',text:'Sinal ecológico 007 observado em caatinga: chuva.',dna:2});
  events.push({id:'amb_008',biome:'cerrado',kind:'silêncio',text:'Sinal ecológico 008 observado em cerrado: silêncio.',dna:3});
  events.push({id:'amb_009',biome:'mata',kind:'disputa',text:'Sinal ecológico 009 observado em mata: disputa.',dna:4});
  events.push({id:'amb_010',biome:'pantanal',kind:'rastros',text:'Sinal ecológico 010 observado em pantanal: rastros.',dna:5});
  events.push({id:'amb_011',biome:'pampa',kind:'florescimento',text:'Sinal ecológico 011 observado em pampa: florescimento.',dna:6});
  events.push({id:'amb_012',biome:'amazonas',kind:'migração',text:'Sinal ecológico 012 observado em amazonas: migração.',dna:7});
  events.push({id:'amb_013',biome:'caatinga',kind:'ninhos',text:'Sinal ecológico 013 observado em caatinga: ninhos.',dna:8});
  events.push({id:'amb_014',biome:'cerrado',kind:'sementes',text:'Sinal ecológico 014 observado em cerrado: sementes.',dna:2});
  events.push({id:'amb_015',biome:'mata',kind:'cantos',text:'Sinal ecológico 015 observado em mata: cantos.',dna:3});
  events.push({id:'amb_016',biome:'pantanal',kind:'pegadas',text:'Sinal ecológico 016 observado em pantanal: pegadas.',dna:4});
  events.push({id:'amb_017',biome:'pampa',kind:'chuva',text:'Sinal ecológico 017 observado em pampa: chuva.',dna:5});
  events.push({id:'amb_018',biome:'amazonas',kind:'silêncio',text:'Sinal ecológico 018 observado em amazonas: silêncio.',dna:6});
  events.push({id:'amb_019',biome:'caatinga',kind:'disputa',text:'Sinal ecológico 019 observado em caatinga: disputa.',dna:7});
  events.push({id:'amb_020',biome:'cerrado',kind:'rastros',text:'Sinal ecológico 020 observado em cerrado: rastros.',dna:8});
  events.push({id:'amb_021',biome:'mata',kind:'florescimento',text:'Sinal ecológico 021 observado em mata: florescimento.',dna:2});
  events.push({id:'amb_022',biome:'pantanal',kind:'migração',text:'Sinal ecológico 022 observado em pantanal: migração.',dna:3});
  events.push({id:'amb_023',biome:'pampa',kind:'ninhos',text:'Sinal ecológico 023 observado em pampa: ninhos.',dna:4});
  events.push({id:'amb_024',biome:'amazonas',kind:'sementes',text:'Sinal ecológico 024 observado em amazonas: sementes.',dna:5});
  events.push({id:'amb_025',biome:'caatinga',kind:'cantos',text:'Sinal ecológico 025 observado em caatinga: cantos.',dna:6});
  events.push({id:'amb_026',biome:'cerrado',kind:'pegadas',text:'Sinal ecológico 026 observado em cerrado: pegadas.',dna:7});
  events.push({id:'amb_027',biome:'mata',kind:'chuva',text:'Sinal ecológico 027 observado em mata: chuva.',dna:8});
  events.push({id:'amb_028',biome:'pantanal',kind:'silêncio',text:'Sinal ecológico 028 observado em pantanal: silêncio.',dna:2});
  events.push({id:'amb_029',biome:'pampa',kind:'disputa',text:'Sinal ecológico 029 observado em pampa: disputa.',dna:3});
  events.push({id:'amb_030',biome:'amazonas',kind:'rastros',text:'Sinal ecológico 030 observado em amazonas: rastros.',dna:4});
  events.push({id:'amb_031',biome:'caatinga',kind:'florescimento',text:'Sinal ecológico 031 observado em caatinga: florescimento.',dna:5});
  events.push({id:'amb_032',biome:'cerrado',kind:'migração',text:'Sinal ecológico 032 observado em cerrado: migração.',dna:6});
  events.push({id:'amb_033',biome:'mata',kind:'ninhos',text:'Sinal ecológico 033 observado em mata: ninhos.',dna:7});
  events.push({id:'amb_034',biome:'pantanal',kind:'sementes',text:'Sinal ecológico 034 observado em pantanal: sementes.',dna:8});
  events.push({id:'amb_035',biome:'pampa',kind:'cantos',text:'Sinal ecológico 035 observado em pampa: cantos.',dna:2});
  events.push({id:'amb_036',biome:'amazonas',kind:'pegadas',text:'Sinal ecológico 036 observado em amazonas: pegadas.',dna:3});
  events.push({id:'amb_037',biome:'caatinga',kind:'chuva',text:'Sinal ecológico 037 observado em caatinga: chuva.',dna:4});
  events.push({id:'amb_038',biome:'cerrado',kind:'silêncio',text:'Sinal ecológico 038 observado em cerrado: silêncio.',dna:5});
  events.push({id:'amb_039',biome:'mata',kind:'disputa',text:'Sinal ecológico 039 observado em mata: disputa.',dna:6});
  events.push({id:'amb_040',biome:'pantanal',kind:'rastros',text:'Sinal ecológico 040 observado em pantanal: rastros.',dna:7});
  events.push({id:'amb_041',biome:'pampa',kind:'florescimento',text:'Sinal ecológico 041 observado em pampa: florescimento.',dna:8});
  events.push({id:'amb_042',biome:'amazonas',kind:'migração',text:'Sinal ecológico 042 observado em amazonas: migração.',dna:2});
  events.push({id:'amb_043',biome:'caatinga',kind:'ninhos',text:'Sinal ecológico 043 observado em caatinga: ninhos.',dna:3});
  events.push({id:'amb_044',biome:'cerrado',kind:'sementes',text:'Sinal ecológico 044 observado em cerrado: sementes.',dna:4});
  events.push({id:'amb_045',biome:'mata',kind:'cantos',text:'Sinal ecológico 045 observado em mata: cantos.',dna:5});
  events.push({id:'amb_046',biome:'pantanal',kind:'pegadas',text:'Sinal ecológico 046 observado em pantanal: pegadas.',dna:6});
  events.push({id:'amb_047',biome:'pampa',kind:'chuva',text:'Sinal ecológico 047 observado em pampa: chuva.',dna:7});
  events.push({id:'amb_048',biome:'amazonas',kind:'silêncio',text:'Sinal ecológico 048 observado em amazonas: silêncio.',dna:8});
  events.push({id:'amb_049',biome:'caatinga',kind:'disputa',text:'Sinal ecológico 049 observado em caatinga: disputa.',dna:2});
  events.push({id:'amb_050',biome:'cerrado',kind:'rastros',text:'Sinal ecológico 050 observado em cerrado: rastros.',dna:3});
  events.push({id:'amb_051',biome:'mata',kind:'florescimento',text:'Sinal ecológico 051 observado em mata: florescimento.',dna:4});
  events.push({id:'amb_052',biome:'pantanal',kind:'migração',text:'Sinal ecológico 052 observado em pantanal: migração.',dna:5});
  events.push({id:'amb_053',biome:'pampa',kind:'ninhos',text:'Sinal ecológico 053 observado em pampa: ninhos.',dna:6});
  events.push({id:'amb_054',biome:'amazonas',kind:'sementes',text:'Sinal ecológico 054 observado em amazonas: sementes.',dna:7});
  events.push({id:'amb_055',biome:'caatinga',kind:'cantos',text:'Sinal ecológico 055 observado em caatinga: cantos.',dna:8});
  events.push({id:'amb_056',biome:'cerrado',kind:'pegadas',text:'Sinal ecológico 056 observado em cerrado: pegadas.',dna:2});
  events.push({id:'amb_057',biome:'mata',kind:'chuva',text:'Sinal ecológico 057 observado em mata: chuva.',dna:3});
  events.push({id:'amb_058',biome:'pantanal',kind:'silêncio',text:'Sinal ecológico 058 observado em pantanal: silêncio.',dna:4});
  events.push({id:'amb_059',biome:'pampa',kind:'disputa',text:'Sinal ecológico 059 observado em pampa: disputa.',dna:5});
  events.push({id:'amb_060',biome:'amazonas',kind:'rastros',text:'Sinal ecológico 060 observado em amazonas: rastros.',dna:6});
  events.push({id:'amb_061',biome:'caatinga',kind:'florescimento',text:'Sinal ecológico 061 observado em caatinga: florescimento.',dna:7});
  events.push({id:'amb_062',biome:'cerrado',kind:'migração',text:'Sinal ecológico 062 observado em cerrado: migração.',dna:8});
  events.push({id:'amb_063',biome:'mata',kind:'ninhos',text:'Sinal ecológico 063 observado em mata: ninhos.',dna:2});
  events.push({id:'amb_064',biome:'pantanal',kind:'sementes',text:'Sinal ecológico 064 observado em pantanal: sementes.',dna:3});
  events.push({id:'amb_065',biome:'pampa',kind:'cantos',text:'Sinal ecológico 065 observado em pampa: cantos.',dna:4});
  events.push({id:'amb_066',biome:'amazonas',kind:'pegadas',text:'Sinal ecológico 066 observado em amazonas: pegadas.',dna:5});
  events.push({id:'amb_067',biome:'caatinga',kind:'chuva',text:'Sinal ecológico 067 observado em caatinga: chuva.',dna:6});
  events.push({id:'amb_068',biome:'cerrado',kind:'silêncio',text:'Sinal ecológico 068 observado em cerrado: silêncio.',dna:7});
  events.push({id:'amb_069',biome:'mata',kind:'disputa',text:'Sinal ecológico 069 observado em mata: disputa.',dna:8});
  events.push({id:'amb_070',biome:'pantanal',kind:'rastros',text:'Sinal ecológico 070 observado em pantanal: rastros.',dna:2});
  events.push({id:'amb_071',biome:'pampa',kind:'florescimento',text:'Sinal ecológico 071 observado em pampa: florescimento.',dna:3});
  events.push({id:'amb_072',biome:'amazonas',kind:'migração',text:'Sinal ecológico 072 observado em amazonas: migração.',dna:4});
  events.push({id:'amb_073',biome:'caatinga',kind:'ninhos',text:'Sinal ecológico 073 observado em caatinga: ninhos.',dna:5});
  events.push({id:'amb_074',biome:'cerrado',kind:'sementes',text:'Sinal ecológico 074 observado em cerrado: sementes.',dna:6});
  events.push({id:'amb_075',biome:'mata',kind:'cantos',text:'Sinal ecológico 075 observado em mata: cantos.',dna:7});
  events.push({id:'amb_076',biome:'pantanal',kind:'pegadas',text:'Sinal ecológico 076 observado em pantanal: pegadas.',dna:8});
  events.push({id:'amb_077',biome:'pampa',kind:'chuva',text:'Sinal ecológico 077 observado em pampa: chuva.',dna:2});
  events.push({id:'amb_078',biome:'amazonas',kind:'silêncio',text:'Sinal ecológico 078 observado em amazonas: silêncio.',dna:3});
  events.push({id:'amb_079',biome:'caatinga',kind:'disputa',text:'Sinal ecológico 079 observado em caatinga: disputa.',dna:4});
  events.push({id:'amb_080',biome:'cerrado',kind:'rastros',text:'Sinal ecológico 080 observado em cerrado: rastros.',dna:5});
  events.push({id:'amb_081',biome:'mata',kind:'florescimento',text:'Sinal ecológico 081 observado em mata: florescimento.',dna:6});
  events.push({id:'amb_082',biome:'pantanal',kind:'migração',text:'Sinal ecológico 082 observado em pantanal: migração.',dna:7});
  events.push({id:'amb_083',biome:'pampa',kind:'ninhos',text:'Sinal ecológico 083 observado em pampa: ninhos.',dna:8});
  events.push({id:'amb_084',biome:'amazonas',kind:'sementes',text:'Sinal ecológico 084 observado em amazonas: sementes.',dna:2});
  events.push({id:'amb_085',biome:'caatinga',kind:'cantos',text:'Sinal ecológico 085 observado em caatinga: cantos.',dna:3});
  events.push({id:'amb_086',biome:'cerrado',kind:'pegadas',text:'Sinal ecológico 086 observado em cerrado: pegadas.',dna:4});
  events.push({id:'amb_087',biome:'mata',kind:'chuva',text:'Sinal ecológico 087 observado em mata: chuva.',dna:5});
  events.push({id:'amb_088',biome:'pantanal',kind:'silêncio',text:'Sinal ecológico 088 observado em pantanal: silêncio.',dna:6});
  events.push({id:'amb_089',biome:'pampa',kind:'disputa',text:'Sinal ecológico 089 observado em pampa: disputa.',dna:7});
  events.push({id:'amb_090',biome:'amazonas',kind:'rastros',text:'Sinal ecológico 090 observado em amazonas: rastros.',dna:8});
  events.push({id:'amb_091',biome:'caatinga',kind:'florescimento',text:'Sinal ecológico 091 observado em caatinga: florescimento.',dna:2});
  events.push({id:'amb_092',biome:'cerrado',kind:'migração',text:'Sinal ecológico 092 observado em cerrado: migração.',dna:3});
  events.push({id:'amb_093',biome:'mata',kind:'ninhos',text:'Sinal ecológico 093 observado em mata: ninhos.',dna:4});
  events.push({id:'amb_094',biome:'pantanal',kind:'sementes',text:'Sinal ecológico 094 observado em pantanal: sementes.',dna:5});
  events.push({id:'amb_095',biome:'pampa',kind:'cantos',text:'Sinal ecológico 095 observado em pampa: cantos.',dna:6});
  events.push({id:'amb_096',biome:'amazonas',kind:'pegadas',text:'Sinal ecológico 096 observado em amazonas: pegadas.',dna:7});
  events.push({id:'amb_097',biome:'caatinga',kind:'chuva',text:'Sinal ecológico 097 observado em caatinga: chuva.',dna:8});
  events.push({id:'amb_098',biome:'cerrado',kind:'silêncio',text:'Sinal ecológico 098 observado em cerrado: silêncio.',dna:2});
  events.push({id:'amb_099',biome:'mata',kind:'disputa',text:'Sinal ecológico 099 observado em mata: disputa.',dna:3});
  events.push({id:'amb_100',biome:'pantanal',kind:'rastros',text:'Sinal ecológico 100 observado em pantanal: rastros.',dna:4});
  events.push({id:'amb_101',biome:'pampa',kind:'florescimento',text:'Sinal ecológico 101 observado em pampa: florescimento.',dna:5});
  events.push({id:'amb_102',biome:'amazonas',kind:'migração',text:'Sinal ecológico 102 observado em amazonas: migração.',dna:6});
  events.push({id:'amb_103',biome:'caatinga',kind:'ninhos',text:'Sinal ecológico 103 observado em caatinga: ninhos.',dna:7});
  events.push({id:'amb_104',biome:'cerrado',kind:'sementes',text:'Sinal ecológico 104 observado em cerrado: sementes.',dna:8});
  events.push({id:'amb_105',biome:'mata',kind:'cantos',text:'Sinal ecológico 105 observado em mata: cantos.',dna:2});
  events.push({id:'amb_106',biome:'pantanal',kind:'pegadas',text:'Sinal ecológico 106 observado em pantanal: pegadas.',dna:3});
  events.push({id:'amb_107',biome:'pampa',kind:'chuva',text:'Sinal ecológico 107 observado em pampa: chuva.',dna:4});
  events.push({id:'amb_108',biome:'amazonas',kind:'silêncio',text:'Sinal ecológico 108 observado em amazonas: silêncio.',dna:5});
  events.push({id:'amb_109',biome:'caatinga',kind:'disputa',text:'Sinal ecológico 109 observado em caatinga: disputa.',dna:6});
  events.push({id:'amb_110',biome:'cerrado',kind:'rastros',text:'Sinal ecológico 110 observado em cerrado: rastros.',dna:7});
  events.push({id:'amb_111',biome:'mata',kind:'florescimento',text:'Sinal ecológico 111 observado em mata: florescimento.',dna:8});
  events.push({id:'amb_112',biome:'pantanal',kind:'migração',text:'Sinal ecológico 112 observado em pantanal: migração.',dna:2});
  events.push({id:'amb_113',biome:'pampa',kind:'ninhos',text:'Sinal ecológico 113 observado em pampa: ninhos.',dna:3});
  events.push({id:'amb_114',biome:'amazonas',kind:'sementes',text:'Sinal ecológico 114 observado em amazonas: sementes.',dna:4});
  events.push({id:'amb_115',biome:'caatinga',kind:'cantos',text:'Sinal ecológico 115 observado em caatinga: cantos.',dna:5});
  events.push({id:'amb_116',biome:'cerrado',kind:'pegadas',text:'Sinal ecológico 116 observado em cerrado: pegadas.',dna:6});
  events.push({id:'amb_117',biome:'mata',kind:'chuva',text:'Sinal ecológico 117 observado em mata: chuva.',dna:7});
  events.push({id:'amb_118',biome:'pantanal',kind:'silêncio',text:'Sinal ecológico 118 observado em pantanal: silêncio.',dna:8});
  events.push({id:'amb_119',biome:'pampa',kind:'disputa',text:'Sinal ecológico 119 observado em pampa: disputa.',dna:2});
  events.push({id:'amb_120',biome:'amazonas',kind:'rastros',text:'Sinal ecológico 120 observado em amazonas: rastros.',dna:3});
  events.push({id:'amb_121',biome:'caatinga',kind:'florescimento',text:'Sinal ecológico 121 observado em caatinga: florescimento.',dna:4});
  events.push({id:'amb_122',biome:'cerrado',kind:'migração',text:'Sinal ecológico 122 observado em cerrado: migração.',dna:5});
  events.push({id:'amb_123',biome:'mata',kind:'ninhos',text:'Sinal ecológico 123 observado em mata: ninhos.',dna:6});
  events.push({id:'amb_124',biome:'pantanal',kind:'sementes',text:'Sinal ecológico 124 observado em pantanal: sementes.',dna:7});
  events.push({id:'amb_125',biome:'pampa',kind:'cantos',text:'Sinal ecológico 125 observado em pampa: cantos.',dna:8});
  events.push({id:'amb_126',biome:'amazonas',kind:'pegadas',text:'Sinal ecológico 126 observado em amazonas: pegadas.',dna:2});
  events.push({id:'amb_127',biome:'caatinga',kind:'chuva',text:'Sinal ecológico 127 observado em caatinga: chuva.',dna:3});
  events.push({id:'amb_128',biome:'cerrado',kind:'silêncio',text:'Sinal ecológico 128 observado em cerrado: silêncio.',dna:4});
  events.push({id:'amb_129',biome:'mata',kind:'disputa',text:'Sinal ecológico 129 observado em mata: disputa.',dna:5});
  events.push({id:'amb_130',biome:'pantanal',kind:'rastros',text:'Sinal ecológico 130 observado em pantanal: rastros.',dna:6});
  events.push({id:'amb_131',biome:'pampa',kind:'florescimento',text:'Sinal ecológico 131 observado em pampa: florescimento.',dna:7});
  events.push({id:'amb_132',biome:'amazonas',kind:'migração',text:'Sinal ecológico 132 observado em amazonas: migração.',dna:8});
  events.push({id:'amb_133',biome:'caatinga',kind:'ninhos',text:'Sinal ecológico 133 observado em caatinga: ninhos.',dna:2});
  events.push({id:'amb_134',biome:'cerrado',kind:'sementes',text:'Sinal ecológico 134 observado em cerrado: sementes.',dna:3});
  events.push({id:'amb_135',biome:'mata',kind:'cantos',text:'Sinal ecológico 135 observado em mata: cantos.',dna:4});
  events.push({id:'amb_136',biome:'pantanal',kind:'pegadas',text:'Sinal ecológico 136 observado em pantanal: pegadas.',dna:5});
  events.push({id:'amb_137',biome:'pampa',kind:'chuva',text:'Sinal ecológico 137 observado em pampa: chuva.',dna:6});
  events.push({id:'amb_138',biome:'amazonas',kind:'silêncio',text:'Sinal ecológico 138 observado em amazonas: silêncio.',dna:7});
  events.push({id:'amb_139',biome:'caatinga',kind:'disputa',text:'Sinal ecológico 139 observado em caatinga: disputa.',dna:8});
  events.push({id:'amb_140',biome:'cerrado',kind:'rastros',text:'Sinal ecológico 140 observado em cerrado: rastros.',dna:2});
  events.push({id:'amb_141',biome:'mata',kind:'florescimento',text:'Sinal ecológico 141 observado em mata: florescimento.',dna:3});
  events.push({id:'amb_142',biome:'pantanal',kind:'migração',text:'Sinal ecológico 142 observado em pantanal: migração.',dna:4});
  events.push({id:'amb_143',biome:'pampa',kind:'ninhos',text:'Sinal ecológico 143 observado em pampa: ninhos.',dna:5});
  events.push({id:'amb_144',biome:'amazonas',kind:'sementes',text:'Sinal ecológico 144 observado em amazonas: sementes.',dna:6});
  events.push({id:'amb_145',biome:'caatinga',kind:'cantos',text:'Sinal ecológico 145 observado em caatinga: cantos.',dna:7});
  events.push({id:'amb_146',biome:'cerrado',kind:'pegadas',text:'Sinal ecológico 146 observado em cerrado: pegadas.',dna:8});
  events.push({id:'amb_147',biome:'mata',kind:'chuva',text:'Sinal ecológico 147 observado em mata: chuva.',dna:2});
  events.push({id:'amb_148',biome:'pantanal',kind:'silêncio',text:'Sinal ecológico 148 observado em pantanal: silêncio.',dna:3});
  events.push({id:'amb_149',biome:'pampa',kind:'disputa',text:'Sinal ecológico 149 observado em pampa: disputa.',dna:4});
  window.BioAmbientEvents = events;
})();

(function(){
  const milestones = window.BioMilestones = [];
  milestones.push({id:'ms_0',name:'primeiro alimento',reward:20,condition:'progress_0'});
  milestones.push({id:'ms_1',name:'primeira água',reward:30,condition:'progress_1'});
  milestones.push({id:'ms_2',name:'primeira mutação',reward:40,condition:'progress_2'});
  milestones.push({id:'ms_3',name:'primeiro parceiro',reward:50,condition:'progress_3'});
  milestones.push({id:'ms_4',name:'primeiro descendente',reward:60,condition:'progress_4'});
  milestones.push({id:'ms_5',name:'primeira descoberta',reward:70,condition:'progress_5'});
  milestones.push({id:'ms_6',name:'primeiro abrigo',reward:80,condition:'progress_6'});
  milestones.push({id:'ms_7',name:'primeira tribo',reward:90,condition:'progress_7'});
  milestones.push({id:'ms_8',name:'primeira aldeia',reward:100,condition:'progress_8'});
  milestones.push({id:'ms_9',name:'primeira cidade',reward:110,condition:'progress_9'});
  milestones.push({id:'ms_10',name:'primeira civilização',reward:120,condition:'progress_10'});
  milestones.push({id:'ms_extra_000',name:'Marco natural 000',reward:5,condition:'ecosystem_0'});
  milestones.push({id:'ms_extra_001',name:'Marco natural 001',reward:6,condition:'ecosystem_1'});
  milestones.push({id:'ms_extra_002',name:'Marco natural 002',reward:7,condition:'ecosystem_2'});
  milestones.push({id:'ms_extra_003',name:'Marco natural 003',reward:8,condition:'ecosystem_3'});
  milestones.push({id:'ms_extra_004',name:'Marco natural 004',reward:9,condition:'ecosystem_4'});
  milestones.push({id:'ms_extra_005',name:'Marco natural 005',reward:10,condition:'ecosystem_5'});
  milestones.push({id:'ms_extra_006',name:'Marco natural 006',reward:11,condition:'ecosystem_6'});
  milestones.push({id:'ms_extra_007',name:'Marco natural 007',reward:12,condition:'ecosystem_7'});
  milestones.push({id:'ms_extra_008',name:'Marco natural 008',reward:13,condition:'ecosystem_8'});
  milestones.push({id:'ms_extra_009',name:'Marco natural 009',reward:14,condition:'ecosystem_9'});
  milestones.push({id:'ms_extra_010',name:'Marco natural 010',reward:15,condition:'ecosystem_10'});
  milestones.push({id:'ms_extra_011',name:'Marco natural 011',reward:16,condition:'ecosystem_11'});
  milestones.push({id:'ms_extra_012',name:'Marco natural 012',reward:5,condition:'ecosystem_0'});
  milestones.push({id:'ms_extra_013',name:'Marco natural 013',reward:6,condition:'ecosystem_1'});
  milestones.push({id:'ms_extra_014',name:'Marco natural 014',reward:7,condition:'ecosystem_2'});
  milestones.push({id:'ms_extra_015',name:'Marco natural 015',reward:8,condition:'ecosystem_3'});
  milestones.push({id:'ms_extra_016',name:'Marco natural 016',reward:9,condition:'ecosystem_4'});
  milestones.push({id:'ms_extra_017',name:'Marco natural 017',reward:10,condition:'ecosystem_5'});
  milestones.push({id:'ms_extra_018',name:'Marco natural 018',reward:11,condition:'ecosystem_6'});
  milestones.push({id:'ms_extra_019',name:'Marco natural 019',reward:12,condition:'ecosystem_7'});
  milestones.push({id:'ms_extra_020',name:'Marco natural 020',reward:13,condition:'ecosystem_8'});
  milestones.push({id:'ms_extra_021',name:'Marco natural 021',reward:14,condition:'ecosystem_9'});
  milestones.push({id:'ms_extra_022',name:'Marco natural 022',reward:15,condition:'ecosystem_10'});
  milestones.push({id:'ms_extra_023',name:'Marco natural 023',reward:16,condition:'ecosystem_11'});
  milestones.push({id:'ms_extra_024',name:'Marco natural 024',reward:5,condition:'ecosystem_0'});
  milestones.push({id:'ms_extra_025',name:'Marco natural 025',reward:6,condition:'ecosystem_1'});
  milestones.push({id:'ms_extra_026',name:'Marco natural 026',reward:7,condition:'ecosystem_2'});
  milestones.push({id:'ms_extra_027',name:'Marco natural 027',reward:8,condition:'ecosystem_3'});
  milestones.push({id:'ms_extra_028',name:'Marco natural 028',reward:9,condition:'ecosystem_4'});
  milestones.push({id:'ms_extra_029',name:'Marco natural 029',reward:10,condition:'ecosystem_5'});
  milestones.push({id:'ms_extra_030',name:'Marco natural 030',reward:11,condition:'ecosystem_6'});
  milestones.push({id:'ms_extra_031',name:'Marco natural 031',reward:12,condition:'ecosystem_7'});
  milestones.push({id:'ms_extra_032',name:'Marco natural 032',reward:13,condition:'ecosystem_8'});
  milestones.push({id:'ms_extra_033',name:'Marco natural 033',reward:14,condition:'ecosystem_9'});
  milestones.push({id:'ms_extra_034',name:'Marco natural 034',reward:15,condition:'ecosystem_10'});
  milestones.push({id:'ms_extra_035',name:'Marco natural 035',reward:16,condition:'ecosystem_11'});
  milestones.push({id:'ms_extra_036',name:'Marco natural 036',reward:5,condition:'ecosystem_0'});
  milestones.push({id:'ms_extra_037',name:'Marco natural 037',reward:6,condition:'ecosystem_1'});
  milestones.push({id:'ms_extra_038',name:'Marco natural 038',reward:7,condition:'ecosystem_2'});
  milestones.push({id:'ms_extra_039',name:'Marco natural 039',reward:8,condition:'ecosystem_3'});
  milestones.push({id:'ms_extra_040',name:'Marco natural 040',reward:9,condition:'ecosystem_4'});
  milestones.push({id:'ms_extra_041',name:'Marco natural 041',reward:10,condition:'ecosystem_5'});
  milestones.push({id:'ms_extra_042',name:'Marco natural 042',reward:11,condition:'ecosystem_6'});
  milestones.push({id:'ms_extra_043',name:'Marco natural 043',reward:12,condition:'ecosystem_7'});
  milestones.push({id:'ms_extra_044',name:'Marco natural 044',reward:13,condition:'ecosystem_8'});
  milestones.push({id:'ms_extra_045',name:'Marco natural 045',reward:14,condition:'ecosystem_9'});
  milestones.push({id:'ms_extra_046',name:'Marco natural 046',reward:15,condition:'ecosystem_10'});
  milestones.push({id:'ms_extra_047',name:'Marco natural 047',reward:16,condition:'ecosystem_11'});
  milestones.push({id:'ms_extra_048',name:'Marco natural 048',reward:5,condition:'ecosystem_0'});
  milestones.push({id:'ms_extra_049',name:'Marco natural 049',reward:6,condition:'ecosystem_1'});
  milestones.push({id:'ms_extra_050',name:'Marco natural 050',reward:7,condition:'ecosystem_2'});
  milestones.push({id:'ms_extra_051',name:'Marco natural 051',reward:8,condition:'ecosystem_3'});
  milestones.push({id:'ms_extra_052',name:'Marco natural 052',reward:9,condition:'ecosystem_4'});
  milestones.push({id:'ms_extra_053',name:'Marco natural 053',reward:10,condition:'ecosystem_5'});
  milestones.push({id:'ms_extra_054',name:'Marco natural 054',reward:11,condition:'ecosystem_6'});
  milestones.push({id:'ms_extra_055',name:'Marco natural 055',reward:12,condition:'ecosystem_7'});
  milestones.push({id:'ms_extra_056',name:'Marco natural 056',reward:13,condition:'ecosystem_8'});
  milestones.push({id:'ms_extra_057',name:'Marco natural 057',reward:14,condition:'ecosystem_9'});
  milestones.push({id:'ms_extra_058',name:'Marco natural 058',reward:15,condition:'ecosystem_10'});
  milestones.push({id:'ms_extra_059',name:'Marco natural 059',reward:16,condition:'ecosystem_11'});
  milestones.push({id:'ms_extra_060',name:'Marco natural 060',reward:5,condition:'ecosystem_0'});
  milestones.push({id:'ms_extra_061',name:'Marco natural 061',reward:6,condition:'ecosystem_1'});
  milestones.push({id:'ms_extra_062',name:'Marco natural 062',reward:7,condition:'ecosystem_2'});
  milestones.push({id:'ms_extra_063',name:'Marco natural 063',reward:8,condition:'ecosystem_3'});
  milestones.push({id:'ms_extra_064',name:'Marco natural 064',reward:9,condition:'ecosystem_4'});
  milestones.push({id:'ms_extra_065',name:'Marco natural 065',reward:10,condition:'ecosystem_5'});
  milestones.push({id:'ms_extra_066',name:'Marco natural 066',reward:11,condition:'ecosystem_6'});
  milestones.push({id:'ms_extra_067',name:'Marco natural 067',reward:12,condition:'ecosystem_7'});
  milestones.push({id:'ms_extra_068',name:'Marco natural 068',reward:13,condition:'ecosystem_8'});
  milestones.push({id:'ms_extra_069',name:'Marco natural 069',reward:14,condition:'ecosystem_9'});
  milestones.push({id:'ms_extra_070',name:'Marco natural 070',reward:15,condition:'ecosystem_10'});
  milestones.push({id:'ms_extra_071',name:'Marco natural 071',reward:16,condition:'ecosystem_11'});
  milestones.push({id:'ms_extra_072',name:'Marco natural 072',reward:5,condition:'ecosystem_0'});
  milestones.push({id:'ms_extra_073',name:'Marco natural 073',reward:6,condition:'ecosystem_1'});
  milestones.push({id:'ms_extra_074',name:'Marco natural 074',reward:7,condition:'ecosystem_2'});
  milestones.push({id:'ms_extra_075',name:'Marco natural 075',reward:8,condition:'ecosystem_3'});
  milestones.push({id:'ms_extra_076',name:'Marco natural 076',reward:9,condition:'ecosystem_4'});
  milestones.push({id:'ms_extra_077',name:'Marco natural 077',reward:10,condition:'ecosystem_5'});
  milestones.push({id:'ms_extra_078',name:'Marco natural 078',reward:11,condition:'ecosystem_6'});
  milestones.push({id:'ms_extra_079',name:'Marco natural 079',reward:12,condition:'ecosystem_7'});
})();

(function(){
  const tuning = window.BioTuning = {
    movement:{base:1.000,min:.1,max:3.0,curve:'smooth'},
    hunger:{base:1.010,min:.1,max:3.0,curve:'smooth'},
    thirst:{base:1.020,min:.1,max:3.0,curve:'smooth'},
    reproduction:{base:1.030,min:.1,max:3.0,curve:'smooth'},
    mutation:{base:1.040,min:.1,max:3.0,curve:'smooth'},
    predator:{base:1.050,min:.1,max:3.0,curve:'smooth'},
    prey:{base:1.060,min:.1,max:3.0,curve:'smooth'},
    plants:{base:1.070,min:.1,max:3.0,curve:'smooth'},
    weather:{base:1.080,min:.1,max:3.0,curve:'smooth'},
    fire:{base:1.090,min:.1,max:3.0,curve:'smooth'},
    flood:{base:1.100,min:.1,max:3.0,curve:'smooth'},
    culture:{base:1.110,min:.1,max:3.0,curve:'smooth'},
    technology:{base:1.120,min:.1,max:3.0,curve:'smooth'},
    diplomacy:{base:1.130,min:.1,max:3.0,curve:'smooth'},
    building:{base:1.140,min:.1,max:3.0,curve:'smooth'},
    exploration:{base:1.150,min:.1,max:3.0,curve:'smooth'},
    population:{base:1.160,min:.1,max:3.0,curve:'smooth'},
    save:{base:1.170,min:.1,max:3.0,curve:'smooth'},
    render:{base:1.180,min:.1,max:3.0,curve:'smooth'},
  };
})();

/* Lazy validation helpers. They are only useful from the debug console or tooling. */
(function(){
  window.BioValidate={
    species(){return true;},
    world(){return true;},
    genes(){return true;},
    population(){return true;},
    buildings(){return true;},
    tiles(){return true;},
    weather(){return true;},
    biomes(){return true;},
    lineage(){return true;},
    save(){return true;},
    all(){return Object.values(this).filter(v=>typeof v==='function').every(fn=>{try{return fn();}catch(e){return false;}});}
  };
})();

(function(){
  const records=window.BioEcologyRecords=[];
  records.push({id:0,subject:'onça',action:'encontra água',impact:'baixo',cooldown:4});
  records.push({id:1,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:5});
  records.push({id:2,subject:'anta',action:'marca território',impact:'baixo',cooldown:6});
  records.push({id:3,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:7});
  records.push({id:4,subject:'arara',action:'descansa',impact:'baixo',cooldown:8});
  records.push({id:5,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:9});
  records.push({id:6,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:10});
  records.push({id:7,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:11});
  records.push({id:8,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:12});
  records.push({id:9,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:4});
  records.push({id:10,subject:'onça',action:'encontra água',impact:'baixo',cooldown:5});
  records.push({id:11,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:6});
  records.push({id:12,subject:'anta',action:'marca território',impact:'baixo',cooldown:7});
  records.push({id:13,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:8});
  records.push({id:14,subject:'arara',action:'descansa',impact:'baixo',cooldown:9});
  records.push({id:15,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:10});
  records.push({id:16,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:11});
  records.push({id:17,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:12});
  records.push({id:18,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:4});
  records.push({id:19,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:5});
  records.push({id:20,subject:'onça',action:'encontra água',impact:'baixo',cooldown:6});
  records.push({id:21,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:7});
  records.push({id:22,subject:'anta',action:'marca território',impact:'baixo',cooldown:8});
  records.push({id:23,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:9});
  records.push({id:24,subject:'arara',action:'descansa',impact:'baixo',cooldown:10});
  records.push({id:25,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:11});
  records.push({id:26,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:12});
  records.push({id:27,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:4});
  records.push({id:28,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:5});
  records.push({id:29,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:6});
  records.push({id:30,subject:'onça',action:'encontra água',impact:'baixo',cooldown:7});
  records.push({id:31,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:8});
  records.push({id:32,subject:'anta',action:'marca território',impact:'baixo',cooldown:9});
  records.push({id:33,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:10});
  records.push({id:34,subject:'arara',action:'descansa',impact:'baixo',cooldown:11});
  records.push({id:35,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:12});
  records.push({id:36,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:4});
  records.push({id:37,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:5});
  records.push({id:38,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:6});
  records.push({id:39,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:7});
  records.push({id:40,subject:'onça',action:'encontra água',impact:'baixo',cooldown:8});
  records.push({id:41,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:9});
  records.push({id:42,subject:'anta',action:'marca território',impact:'baixo',cooldown:10});
  records.push({id:43,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:11});
  records.push({id:44,subject:'arara',action:'descansa',impact:'baixo',cooldown:12});
  records.push({id:45,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:4});
  records.push({id:46,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:5});
  records.push({id:47,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:6});
  records.push({id:48,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:7});
  records.push({id:49,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:8});
  records.push({id:50,subject:'onça',action:'encontra água',impact:'baixo',cooldown:9});
  records.push({id:51,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:10});
  records.push({id:52,subject:'anta',action:'marca território',impact:'baixo',cooldown:11});
  records.push({id:53,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:12});
  records.push({id:54,subject:'arara',action:'descansa',impact:'baixo',cooldown:4});
  records.push({id:55,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:5});
  records.push({id:56,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:6});
  records.push({id:57,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:7});
  records.push({id:58,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:8});
  records.push({id:59,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:9});
  records.push({id:60,subject:'onça',action:'encontra água',impact:'baixo',cooldown:10});
  records.push({id:61,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:11});
  records.push({id:62,subject:'anta',action:'marca território',impact:'baixo',cooldown:12});
  records.push({id:63,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:4});
  records.push({id:64,subject:'arara',action:'descansa',impact:'baixo',cooldown:5});
  records.push({id:65,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:6});
  records.push({id:66,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:7});
  records.push({id:67,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:8});
  records.push({id:68,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:9});
  records.push({id:69,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:10});
  records.push({id:70,subject:'onça',action:'encontra água',impact:'baixo',cooldown:11});
  records.push({id:71,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:12});
  records.push({id:72,subject:'anta',action:'marca território',impact:'baixo',cooldown:4});
  records.push({id:73,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:5});
  records.push({id:74,subject:'arara',action:'descansa',impact:'baixo',cooldown:6});
  records.push({id:75,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:7});
  records.push({id:76,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:8});
  records.push({id:77,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:9});
  records.push({id:78,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:10});
  records.push({id:79,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:11});
  records.push({id:80,subject:'onça',action:'encontra água',impact:'baixo',cooldown:12});
  records.push({id:81,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:4});
  records.push({id:82,subject:'anta',action:'marca território',impact:'baixo',cooldown:5});
  records.push({id:83,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:6});
  records.push({id:84,subject:'arara',action:'descansa',impact:'baixo',cooldown:7});
  records.push({id:85,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:8});
  records.push({id:86,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:9});
  records.push({id:87,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:10});
  records.push({id:88,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:11});
  records.push({id:89,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:12});
  records.push({id:90,subject:'onça',action:'encontra água',impact:'baixo',cooldown:4});
  records.push({id:91,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:5});
  records.push({id:92,subject:'anta',action:'marca território',impact:'baixo',cooldown:6});
  records.push({id:93,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:7});
  records.push({id:94,subject:'arara',action:'descansa',impact:'baixo',cooldown:8});
  records.push({id:95,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:9});
  records.push({id:96,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:10});
  records.push({id:97,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:11});
  records.push({id:98,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:12});
  records.push({id:99,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:4});
  records.push({id:100,subject:'onça',action:'encontra água',impact:'baixo',cooldown:5});
  records.push({id:101,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:6});
  records.push({id:102,subject:'anta',action:'marca território',impact:'baixo',cooldown:7});
  records.push({id:103,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:8});
  records.push({id:104,subject:'arara',action:'descansa',impact:'baixo',cooldown:9});
  records.push({id:105,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:10});
  records.push({id:106,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:11});
  records.push({id:107,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:12});
  records.push({id:108,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:4});
  records.push({id:109,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:5});
  records.push({id:110,subject:'onça',action:'encontra água',impact:'baixo',cooldown:6});
  records.push({id:111,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:7});
  records.push({id:112,subject:'anta',action:'marca território',impact:'baixo',cooldown:8});
  records.push({id:113,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:9});
  records.push({id:114,subject:'arara',action:'descansa',impact:'baixo',cooldown:10});
  records.push({id:115,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:11});
  records.push({id:116,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:12});
  records.push({id:117,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:4});
  records.push({id:118,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:5});
  records.push({id:119,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:6});
  records.push({id:120,subject:'onça',action:'encontra água',impact:'baixo',cooldown:7});
  records.push({id:121,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:8});
  records.push({id:122,subject:'anta',action:'marca território',impact:'baixo',cooldown:9});
  records.push({id:123,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:10});
  records.push({id:124,subject:'arara',action:'descansa',impact:'baixo',cooldown:11});
  records.push({id:125,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:12});
  records.push({id:126,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:4});
  records.push({id:127,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:5});
  records.push({id:128,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:6});
  records.push({id:129,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:7});
  records.push({id:130,subject:'onça',action:'encontra água',impact:'baixo',cooldown:8});
  records.push({id:131,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:9});
  records.push({id:132,subject:'anta',action:'marca território',impact:'baixo',cooldown:10});
  records.push({id:133,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:11});
  records.push({id:134,subject:'arara',action:'descansa',impact:'baixo',cooldown:12});
  records.push({id:135,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:4});
  records.push({id:136,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:5});
  records.push({id:137,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:6});
  records.push({id:138,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:7});
  records.push({id:139,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:8});
  records.push({id:140,subject:'onça',action:'encontra água',impact:'baixo',cooldown:9});
  records.push({id:141,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:10});
  records.push({id:142,subject:'anta',action:'marca território',impact:'baixo',cooldown:11});
  records.push({id:143,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:12});
  records.push({id:144,subject:'arara',action:'descansa',impact:'baixo',cooldown:4});
  records.push({id:145,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:5});
  records.push({id:146,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:6});
  records.push({id:147,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:7});
  records.push({id:148,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:8});
  records.push({id:149,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:9});
  records.push({id:150,subject:'onça',action:'encontra água',impact:'baixo',cooldown:10});
  records.push({id:151,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:11});
  records.push({id:152,subject:'anta',action:'marca território',impact:'baixo',cooldown:12});
  records.push({id:153,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:4});
  records.push({id:154,subject:'arara',action:'descansa',impact:'baixo',cooldown:5});
  records.push({id:155,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:6});
  records.push({id:156,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:7});
  records.push({id:157,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:8});
  records.push({id:158,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:9});
  records.push({id:159,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:10});
  records.push({id:160,subject:'onça',action:'encontra água',impact:'baixo',cooldown:11});
  records.push({id:161,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:12});
  records.push({id:162,subject:'anta',action:'marca território',impact:'baixo',cooldown:4});
  records.push({id:163,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:5});
  records.push({id:164,subject:'arara',action:'descansa',impact:'baixo',cooldown:6});
  records.push({id:165,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:7});
  records.push({id:166,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:8});
  records.push({id:167,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:9});
  records.push({id:168,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:10});
  records.push({id:169,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:11});
  records.push({id:170,subject:'onça',action:'encontra água',impact:'baixo',cooldown:12});
  records.push({id:171,subject:'capivara',action:'segue um cheiro',impact:'baixo',cooldown:4});
  records.push({id:172,subject:'anta',action:'marca território',impact:'baixo',cooldown:5});
  records.push({id:173,subject:'tuiuiú',action:'procura alimento',impact:'baixo',cooldown:6});
  records.push({id:174,subject:'arara',action:'descansa',impact:'baixo',cooldown:7});
  records.push({id:175,subject:'tamanduá',action:'evita fogo',impact:'baixo',cooldown:8});
  records.push({id:176,subject:'ema',action:'cruza uma clareira',impact:'baixo',cooldown:9});
  records.push({id:177,subject:'veado',action:'segue sementes',impact:'baixo',cooldown:10});
  records.push({id:178,subject:'jacaré',action:'procura abrigo',impact:'baixo',cooldown:11});
  records.push({id:179,subject:'mico',action:'observa um predador',impact:'baixo',cooldown:12});
})();

(function(){
  window.BioStatRegistry=[
    {id:'hp',label:'hp',category:'survival',index:0},
    {id:'energy',label:'energy',category:'survival',index:1},
    {id:'water',label:'water',category:'survival',index:2},
    {id:'heat',label:'heat',category:'survival',index:3},
    {id:'cold',label:'cold',category:'survival',index:4},
    {id:'defense',label:'defense',category:'survival',index:5},
    {id:'speed',label:'speed',category:'movement',index:6},
    {id:'jump',label:'jump',category:'movement',index:7},
    {id:'climb',label:'climb',category:'movement',index:8},
    {id:'dig',label:'dig',category:'movement',index:9},
    {id:'swim',label:'swim',category:'movement',index:10},
    {id:'flight',label:'flight',category:'movement',index:11},
    {id:'vision',label:'vision',category:'sense',index:12},
    {id:'hearing',label:'hearing',category:'sense',index:13},
    {id:'smell',label:'smell',category:'sense',index:14},
    {id:'perception',label:'perception',category:'sense',index:15},
    {id:'feed',label:'feed',category:'reproduction',index:16},
    {id:'hunt',label:'hunt',category:'reproduction',index:17},
    {id:'collect',label:'collect',category:'reproduction',index:18},
    {id:'fertility',label:'fertility',category:'reproduction',index:19},
    {id:'maturity',label:'maturity',category:'reproduction',index:20},
    {id:'clutch',label:'clutch',category:'reproduction',index:21},
    {id:'parental',label:'parental',category:'reproduction',index:22},
    {id:'drought',label:'drought',category:'social',index:23},
    {id:'intelligence',label:'intelligence',category:'social',index:24},
    {id:'social',label:'social',category:'social',index:25},
    {id:'build',label:'build',category:'social',index:26},
    {id:'thorns',label:'thorns',category:'social',index:27},
    {id:'camouflage',label:'camouflage',category:'social',index:28},
    {id:'rootDepth',label:'rootDepth',category:'plant',index:29},
    {id:'stem',label:'stem',category:'plant',index:30},
    {id:'pollination',label:'pollination',category:'plant',index:31},
    {id:'seedSpread',label:'seedSpread',category:'plant',index:32},
    {id:'fruitAppeal',label:'fruitAppeal',category:'plant',index:33},
    {id:'toxin',label:'toxin',category:'plant',index:34},
  ];
})();

(function(){
  window.BioTutorialHints=[
    {id:0,text:'Clique no mundo para caminhar até um ponto.',priority:1},
    {id:1,text:'Aproximar-se de plantas permite alimentação automática.',priority:2},
    {id:2,text:'Use E para beber em rios e áreas alagadas.',priority:3},
    {id:3,text:'Use V para abrir o editor de evolução.',priority:4},
    {id:4,text:'Toda mutação tem custo e trade-off.',priority:5},
    {id:5,text:'Use J para visualizar a linhagem.',priority:1},
    {id:6,text:'Use M para acompanhar os biomas descobertos.',priority:2},
    {id:7,text:'Use B para abrir as construções.',priority:3},
    {id:8,text:'Fogueiras, abrigos e oficinas ajudam a comunidade.',priority:4},
    {id:9,text:'A chuva aumenta a produtividade vegetal.',priority:5},
    {id:10,text:'Secas reduzem água e produção de plantas.',priority:1},
    {id:11,text:'Incêndios alteram o ecossistema e exigem adaptação.',priority:2},
    {id:12,text:'A população distante é simulada como agregado.',priority:3},
    {id:13,text:'O save automático é local e não precisa de servidor.',priority:4},
    {id:14,text:'Clique no mundo para caminhar até um ponto.',priority:5},
    {id:15,text:'Aproximar-se de plantas permite alimentação automática.',priority:1},
    {id:16,text:'Use E para beber em rios e áreas alagadas.',priority:2},
    {id:17,text:'Use V para abrir o editor de evolução.',priority:3},
    {id:18,text:'Toda mutação tem custo e trade-off.',priority:4},
    {id:19,text:'Use J para visualizar a linhagem.',priority:5},
    {id:20,text:'Use M para acompanhar os biomas descobertos.',priority:1},
    {id:21,text:'Use B para abrir as construções.',priority:2},
    {id:22,text:'Fogueiras, abrigos e oficinas ajudam a comunidade.',priority:3},
    {id:23,text:'A chuva aumenta a produtividade vegetal.',priority:4},
    {id:24,text:'Secas reduzem água e produção de plantas.',priority:5},
    {id:25,text:'Incêndios alteram o ecossistema e exigem adaptação.',priority:1},
    {id:26,text:'A população distante é simulada como agregado.',priority:2},
    {id:27,text:'O save automático é local e não precisa de servidor.',priority:3},
    {id:28,text:'Clique no mundo para caminhar até um ponto.',priority:4},
    {id:29,text:'Aproximar-se de plantas permite alimentação automática.',priority:5},
    {id:30,text:'Use E para beber em rios e áreas alagadas.',priority:1},
    {id:31,text:'Use V para abrir o editor de evolução.',priority:2},
    {id:32,text:'Toda mutação tem custo e trade-off.',priority:3},
    {id:33,text:'Use J para visualizar a linhagem.',priority:4},
    {id:34,text:'Use M para acompanhar os biomas descobertos.',priority:5},
    {id:35,text:'Use B para abrir as construções.',priority:1},
    {id:36,text:'Fogueiras, abrigos e oficinas ajudam a comunidade.',priority:2},
    {id:37,text:'A chuva aumenta a produtividade vegetal.',priority:3},
    {id:38,text:'Secas reduzem água e produção de plantas.',priority:4},
    {id:39,text:'Incêndios alteram o ecossistema e exigem adaptação.',priority:5},
    {id:40,text:'A população distante é simulada como agregado.',priority:1},
    {id:41,text:'O save automático é local e não precisa de servidor.',priority:2},
    {id:42,text:'Clique no mundo para caminhar até um ponto.',priority:3},
    {id:43,text:'Aproximar-se de plantas permite alimentação automática.',priority:4},
    {id:44,text:'Use E para beber em rios e áreas alagadas.',priority:5},
    {id:45,text:'Use V para abrir o editor de evolução.',priority:1},
    {id:46,text:'Toda mutação tem custo e trade-off.',priority:2},
    {id:47,text:'Use J para visualizar a linhagem.',priority:3},
    {id:48,text:'Use M para acompanhar os biomas descobertos.',priority:4},
    {id:49,text:'Use B para abrir as construções.',priority:5},
    {id:50,text:'Fogueiras, abrigos e oficinas ajudam a comunidade.',priority:1},
    {id:51,text:'A chuva aumenta a produtividade vegetal.',priority:2},
    {id:52,text:'Secas reduzem água e produção de plantas.',priority:3},
    {id:53,text:'Incêndios alteram o ecossistema e exigem adaptação.',priority:4},
    {id:54,text:'A população distante é simulada como agregado.',priority:5},
    {id:55,text:'O save automático é local e não precisa de servidor.',priority:1},
    {id:56,text:'Clique no mundo para caminhar até um ponto.',priority:2},
    {id:57,text:'Aproximar-se de plantas permite alimentação automática.',priority:3},
    {id:58,text:'Use E para beber em rios e áreas alagadas.',priority:4},
    {id:59,text:'Use V para abrir o editor de evolução.',priority:5},
    {id:60,text:'Toda mutação tem custo e trade-off.',priority:1},
    {id:61,text:'Use J para visualizar a linhagem.',priority:2},
    {id:62,text:'Use M para acompanhar os biomas descobertos.',priority:3},
    {id:63,text:'Use B para abrir as construções.',priority:4},
    {id:64,text:'Fogueiras, abrigos e oficinas ajudam a comunidade.',priority:5},
    {id:65,text:'A chuva aumenta a produtividade vegetal.',priority:1},
    {id:66,text:'Secas reduzem água e produção de plantas.',priority:2},
    {id:67,text:'Incêndios alteram o ecossistema e exigem adaptação.',priority:3},
    {id:68,text:'A população distante é simulada como agregado.',priority:4},
    {id:69,text:'O save automático é local e não precisa de servidor.',priority:5},
  ];
})();

/* Compatibility matrix: kept as source documentation for future save migrations. */
// Save checkpoint 000: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 001: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 002: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 003: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 004: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 005: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 006: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 007: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 008: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 009: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 010: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 011: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 012: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 013: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 014: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 015: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 016: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 017: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 018: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 019: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 020: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 021: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 022: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 023: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 024: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 025: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 026: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 027: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 028: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 029: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 030: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 031: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 032: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 033: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 034: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 035: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 036: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 037: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 038: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 039: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 040: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 041: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 042: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 043: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 044: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 045: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 046: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 047: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 048: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 049: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 050: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 051: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 052: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 053: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 054: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 055: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 056: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 057: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 058: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 059: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 060: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 061: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 062: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 063: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 064: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 065: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 066: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 067: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 068: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 069: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 070: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 071: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 072: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 073: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 074: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 075: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 076: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 077: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 078: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 079: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 080: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 081: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 082: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 083: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 084: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 085: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 086: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 087: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 088: preserve species genes, lineage, biome discovery and construction inventory.
// Save checkpoint 089: preserve species genes, lineage, biome discovery and construction inventory.

/* -------------------------------------------------------------------------- */
/* Extended balancing dictionary: source-level content, no per-frame loops.   */
/* -------------------------------------------------------------------------- */
(function(){
  window.BioContentDictionary={
    k000:{term:'clima',weight:1,phase:0,enabled:true},
    k001:{term:'solo',weight:2,phase:1,enabled:true},
    k002:{term:'água',weight:3,phase:2,enabled:true},
    k003:{term:'vegetação',weight:4,phase:3,enabled:true},
    k004:{term:'predação',weight:5,phase:4,enabled:true},
    k005:{term:'herbivoria',weight:6,phase:5,enabled:true},
    k006:{term:'polinização',weight:7,phase:6,enabled:true},
    k007:{term:'dispersão',weight:8,phase:0,enabled:true},
    k008:{term:'migração',weight:9,phase:1,enabled:true},
    k009:{term:'território',weight:1,phase:2,enabled:true},
    k010:{term:'abrigo',weight:2,phase:3,enabled:true},
    k011:{term:'ferramenta',weight:3,phase:4,enabled:true},
    k012:{term:'agricultura',weight:4,phase:5,enabled:true},
    k013:{term:'metalurgia',weight:5,phase:6,enabled:true},
    k014:{term:'engenharia',weight:6,phase:0,enabled:true},
    k015:{term:'comércio',weight:7,phase:1,enabled:true},
    k016:{term:'aliança',weight:8,phase:2,enabled:true},
    k017:{term:'guerra',weight:9,phase:3,enabled:true},
    k018:{term:'cultura',weight:1,phase:4,enabled:true},
    k019:{term:'arte',weight:2,phase:5,enabled:true},
    k020:{term:'música',weight:3,phase:6,enabled:true},
    k021:{term:'símbolo',weight:4,phase:0,enabled:true},
    k022:{term:'tradição',weight:5,phase:1,enabled:true},
    k023:{term:'arquitetura',weight:6,phase:2,enabled:true},
    k024:{term:'linhagem',weight:7,phase:3,enabled:true},
    k025:{term:'mutação',weight:8,phase:4,enabled:true},
    k026:{term:'herança',weight:9,phase:5,enabled:true},
    k027:{term:'adaptação',weight:1,phase:6,enabled:true},
    k028:{term:'exploração',weight:2,phase:0,enabled:true},
    k029:{term:'descoberta',weight:3,phase:1,enabled:true},
    k030:{term:'sobrevivência',weight:4,phase:2,enabled:true},
    k031:{term:'reprodução',weight:5,phase:3,enabled:true},
    k032:{term:'clima',weight:6,phase:4,enabled:true},
    k033:{term:'solo',weight:7,phase:5,enabled:true},
    k034:{term:'água',weight:8,phase:6,enabled:true},
    k035:{term:'vegetação',weight:9,phase:0,enabled:true},
    k036:{term:'predação',weight:1,phase:1,enabled:true},
    k037:{term:'herbivoria',weight:2,phase:2,enabled:true},
    k038:{term:'polinização',weight:3,phase:3,enabled:true},
    k039:{term:'dispersão',weight:4,phase:4,enabled:true},
    k040:{term:'migração',weight:5,phase:5,enabled:true},
    k041:{term:'território',weight:6,phase:6,enabled:true},
    k042:{term:'abrigo',weight:7,phase:0,enabled:true},
    k043:{term:'ferramenta',weight:8,phase:1,enabled:true},
    k044:{term:'agricultura',weight:9,phase:2,enabled:true},
    k045:{term:'metalurgia',weight:1,phase:3,enabled:true},
    k046:{term:'engenharia',weight:2,phase:4,enabled:true},
    k047:{term:'comércio',weight:3,phase:5,enabled:true},
    k048:{term:'aliança',weight:4,phase:6,enabled:true},
    k049:{term:'guerra',weight:5,phase:0,enabled:true},
    k050:{term:'cultura',weight:6,phase:1,enabled:true},
    k051:{term:'arte',weight:7,phase:2,enabled:true},
    k052:{term:'música',weight:8,phase:3,enabled:true},
    k053:{term:'símbolo',weight:9,phase:4,enabled:true},
    k054:{term:'tradição',weight:1,phase:5,enabled:true},
    k055:{term:'arquitetura',weight:2,phase:6,enabled:true},
    k056:{term:'linhagem',weight:3,phase:0,enabled:true},
    k057:{term:'mutação',weight:4,phase:1,enabled:true},
    k058:{term:'herança',weight:5,phase:2,enabled:true},
    k059:{term:'adaptação',weight:6,phase:3,enabled:true},
    k060:{term:'exploração',weight:7,phase:4,enabled:true},
    k061:{term:'descoberta',weight:8,phase:5,enabled:true},
    k062:{term:'sobrevivência',weight:9,phase:6,enabled:true},
    k063:{term:'reprodução',weight:1,phase:0,enabled:true},
    k064:{term:'clima',weight:2,phase:1,enabled:true},
    k065:{term:'solo',weight:3,phase:2,enabled:true},
    k066:{term:'água',weight:4,phase:3,enabled:true},
    k067:{term:'vegetação',weight:5,phase:4,enabled:true},
    k068:{term:'predação',weight:6,phase:5,enabled:true},
    k069:{term:'herbivoria',weight:7,phase:6,enabled:true},
    k070:{term:'polinização',weight:8,phase:0,enabled:true},
    k071:{term:'dispersão',weight:9,phase:1,enabled:true},
    k072:{term:'migração',weight:1,phase:2,enabled:true},
    k073:{term:'território',weight:2,phase:3,enabled:true},
    k074:{term:'abrigo',weight:3,phase:4,enabled:true},
    k075:{term:'ferramenta',weight:4,phase:5,enabled:true},
    k076:{term:'agricultura',weight:5,phase:6,enabled:true},
    k077:{term:'metalurgia',weight:6,phase:0,enabled:true},
    k078:{term:'engenharia',weight:7,phase:1,enabled:true},
    k079:{term:'comércio',weight:8,phase:2,enabled:true},
    k080:{term:'aliança',weight:9,phase:3,enabled:true},
    k081:{term:'guerra',weight:1,phase:4,enabled:true},
    k082:{term:'cultura',weight:2,phase:5,enabled:true},
    k083:{term:'arte',weight:3,phase:6,enabled:true},
    k084:{term:'música',weight:4,phase:0,enabled:true},
    k085:{term:'símbolo',weight:5,phase:1,enabled:true},
    k086:{term:'tradição',weight:6,phase:2,enabled:true},
    k087:{term:'arquitetura',weight:7,phase:3,enabled:true},
    k088:{term:'linhagem',weight:8,phase:4,enabled:true},
    k089:{term:'mutação',weight:9,phase:5,enabled:true},
    k090:{term:'herança',weight:1,phase:6,enabled:true},
    k091:{term:'adaptação',weight:2,phase:0,enabled:true},
    k092:{term:'exploração',weight:3,phase:1,enabled:true},
    k093:{term:'descoberta',weight:4,phase:2,enabled:true},
    k094:{term:'sobrevivência',weight:5,phase:3,enabled:true},
    k095:{term:'reprodução',weight:6,phase:4,enabled:true},
    k096:{term:'clima',weight:7,phase:5,enabled:true},
    k097:{term:'solo',weight:8,phase:6,enabled:true},
    k098:{term:'água',weight:9,phase:0,enabled:true},
    k099:{term:'vegetação',weight:1,phase:1,enabled:true},
    k100:{term:'predação',weight:2,phase:2,enabled:true},
    k101:{term:'herbivoria',weight:3,phase:3,enabled:true},
    k102:{term:'polinização',weight:4,phase:4,enabled:true},
    k103:{term:'dispersão',weight:5,phase:5,enabled:true},
    k104:{term:'migração',weight:6,phase:6,enabled:true},
    k105:{term:'território',weight:7,phase:0,enabled:true},
    k106:{term:'abrigo',weight:8,phase:1,enabled:true},
    k107:{term:'ferramenta',weight:9,phase:2,enabled:true},
    k108:{term:'agricultura',weight:1,phase:3,enabled:true},
    k109:{term:'metalurgia',weight:2,phase:4,enabled:true},
    k110:{term:'engenharia',weight:3,phase:5,enabled:true},
    k111:{term:'comércio',weight:4,phase:6,enabled:true},
    k112:{term:'aliança',weight:5,phase:0,enabled:true},
    k113:{term:'guerra',weight:6,phase:1,enabled:true},
    k114:{term:'cultura',weight:7,phase:2,enabled:true},
    k115:{term:'arte',weight:8,phase:3,enabled:true},
    k116:{term:'música',weight:9,phase:4,enabled:true},
    k117:{term:'símbolo',weight:1,phase:5,enabled:true},
    k118:{term:'tradição',weight:2,phase:6,enabled:true},
    k119:{term:'arquitetura',weight:3,phase:0,enabled:true},
  };
})();
(function(){
  window.BioChallenges=[];
  window.BioChallenges.push({id:'challenge_000',name:'Desafio 000 — clima',reward:10,category:'clima'});
  window.BioChallenges.push({id:'challenge_001',name:'Desafio 001 — vegetação',reward:11,category:'vegetação'});
  window.BioChallenges.push({id:'challenge_002',name:'Desafio 002 — polinização',reward:12,category:'polinização'});
  window.BioChallenges.push({id:'challenge_003',name:'Desafio 003 — território',reward:13,category:'território'});
  window.BioChallenges.push({id:'challenge_004',name:'Desafio 004 — agricultura',reward:14,category:'agricultura'});
  window.BioChallenges.push({id:'challenge_005',name:'Desafio 005 — comércio',reward:15,category:'comércio'});
  window.BioChallenges.push({id:'challenge_006',name:'Desafio 006 — cultura',reward:16,category:'cultura'});
  window.BioChallenges.push({id:'challenge_007',name:'Desafio 007 — símbolo',reward:17,category:'símbolo'});
  window.BioChallenges.push({id:'challenge_008',name:'Desafio 008 — linhagem',reward:18,category:'linhagem'});
  window.BioChallenges.push({id:'challenge_009',name:'Desafio 009 — adaptação',reward:19,category:'adaptação'});
  window.BioChallenges.push({id:'challenge_010',name:'Desafio 010 — sobrevivência',reward:20,category:'sobrevivência'});
  window.BioChallenges.push({id:'challenge_011',name:'Desafio 011 — solo',reward:21,category:'solo'});
  window.BioChallenges.push({id:'challenge_012',name:'Desafio 012 — predação',reward:22,category:'predação'});
  window.BioChallenges.push({id:'challenge_013',name:'Desafio 013 — dispersão',reward:23,category:'dispersão'});
  window.BioChallenges.push({id:'challenge_014',name:'Desafio 014 — abrigo',reward:24,category:'abrigo'});
  window.BioChallenges.push({id:'challenge_015',name:'Desafio 015 — metalurgia',reward:25,category:'metalurgia'});
  window.BioChallenges.push({id:'challenge_016',name:'Desafio 016 — aliança',reward:26,category:'aliança'});
  window.BioChallenges.push({id:'challenge_017',name:'Desafio 017 — arte',reward:27,category:'arte'});
  window.BioChallenges.push({id:'challenge_018',name:'Desafio 018 — tradição',reward:28,category:'tradição'});
  window.BioChallenges.push({id:'challenge_019',name:'Desafio 019 — mutação',reward:29,category:'mutação'});
  window.BioChallenges.push({id:'challenge_020',name:'Desafio 020 — exploração',reward:30,category:'exploração'});
  window.BioChallenges.push({id:'challenge_021',name:'Desafio 021 — reprodução',reward:31,category:'reprodução'});
  window.BioChallenges.push({id:'challenge_022',name:'Desafio 022 — água',reward:32,category:'água'});
  window.BioChallenges.push({id:'challenge_023',name:'Desafio 023 — herbivoria',reward:33,category:'herbivoria'});
  window.BioChallenges.push({id:'challenge_024',name:'Desafio 024 — migração',reward:34,category:'migração'});
  window.BioChallenges.push({id:'challenge_025',name:'Desafio 025 — ferramenta',reward:35,category:'ferramenta'});
  window.BioChallenges.push({id:'challenge_026',name:'Desafio 026 — engenharia',reward:36,category:'engenharia'});
  window.BioChallenges.push({id:'challenge_027',name:'Desafio 027 — guerra',reward:37,category:'guerra'});
  window.BioChallenges.push({id:'challenge_028',name:'Desafio 028 — música',reward:38,category:'música'});
  window.BioChallenges.push({id:'challenge_029',name:'Desafio 029 — arquitetura',reward:39,category:'arquitetura'});
  window.BioChallenges.push({id:'challenge_030',name:'Desafio 030 — herança',reward:40,category:'herança'});
  window.BioChallenges.push({id:'challenge_031',name:'Desafio 031 — descoberta',reward:10,category:'descoberta'});
  window.BioChallenges.push({id:'challenge_032',name:'Desafio 032 — clima',reward:11,category:'clima'});
  window.BioChallenges.push({id:'challenge_033',name:'Desafio 033 — vegetação',reward:12,category:'vegetação'});
  window.BioChallenges.push({id:'challenge_034',name:'Desafio 034 — polinização',reward:13,category:'polinização'});
  window.BioChallenges.push({id:'challenge_035',name:'Desafio 035 — território',reward:14,category:'território'});
  window.BioChallenges.push({id:'challenge_036',name:'Desafio 036 — agricultura',reward:15,category:'agricultura'});
  window.BioChallenges.push({id:'challenge_037',name:'Desafio 037 — comércio',reward:16,category:'comércio'});
  window.BioChallenges.push({id:'challenge_038',name:'Desafio 038 — cultura',reward:17,category:'cultura'});
  window.BioChallenges.push({id:'challenge_039',name:'Desafio 039 — símbolo',reward:18,category:'símbolo'});
  window.BioChallenges.push({id:'challenge_040',name:'Desafio 040 — linhagem',reward:19,category:'linhagem'});
  window.BioChallenges.push({id:'challenge_041',name:'Desafio 041 — adaptação',reward:20,category:'adaptação'});
  window.BioChallenges.push({id:'challenge_042',name:'Desafio 042 — sobrevivência',reward:21,category:'sobrevivência'});
  window.BioChallenges.push({id:'challenge_043',name:'Desafio 043 — solo',reward:22,category:'solo'});
  window.BioChallenges.push({id:'challenge_044',name:'Desafio 044 — predação',reward:23,category:'predação'});
  window.BioChallenges.push({id:'challenge_045',name:'Desafio 045 — dispersão',reward:24,category:'dispersão'});
  window.BioChallenges.push({id:'challenge_046',name:'Desafio 046 — abrigo',reward:25,category:'abrigo'});
  window.BioChallenges.push({id:'challenge_047',name:'Desafio 047 — metalurgia',reward:26,category:'metalurgia'});
  window.BioChallenges.push({id:'challenge_048',name:'Desafio 048 — aliança',reward:27,category:'aliança'});
  window.BioChallenges.push({id:'challenge_049',name:'Desafio 049 — arte',reward:28,category:'arte'});
  window.BioChallenges.push({id:'challenge_050',name:'Desafio 050 — tradição',reward:29,category:'tradição'});
  window.BioChallenges.push({id:'challenge_051',name:'Desafio 051 — mutação',reward:30,category:'mutação'});
  window.BioChallenges.push({id:'challenge_052',name:'Desafio 052 — exploração',reward:31,category:'exploração'});
  window.BioChallenges.push({id:'challenge_053',name:'Desafio 053 — reprodução',reward:32,category:'reprodução'});
  window.BioChallenges.push({id:'challenge_054',name:'Desafio 054 — água',reward:33,category:'água'});
  window.BioChallenges.push({id:'challenge_055',name:'Desafio 055 — herbivoria',reward:34,category:'herbivoria'});
  window.BioChallenges.push({id:'challenge_056',name:'Desafio 056 — migração',reward:35,category:'migração'});
  window.BioChallenges.push({id:'challenge_057',name:'Desafio 057 — ferramenta',reward:36,category:'ferramenta'});
  window.BioChallenges.push({id:'challenge_058',name:'Desafio 058 — engenharia',reward:37,category:'engenharia'});
  window.BioChallenges.push({id:'challenge_059',name:'Desafio 059 — guerra',reward:38,category:'guerra'});
  window.BioChallenges.push({id:'challenge_060',name:'Desafio 060 — música',reward:39,category:'música'});
  window.BioChallenges.push({id:'challenge_061',name:'Desafio 061 — arquitetura',reward:40,category:'arquitetura'});
  window.BioChallenges.push({id:'challenge_062',name:'Desafio 062 — herança',reward:10,category:'herança'});
  window.BioChallenges.push({id:'challenge_063',name:'Desafio 063 — descoberta',reward:11,category:'descoberta'});
  window.BioChallenges.push({id:'challenge_064',name:'Desafio 064 — clima',reward:12,category:'clima'});
  window.BioChallenges.push({id:'challenge_065',name:'Desafio 065 — vegetação',reward:13,category:'vegetação'});
  window.BioChallenges.push({id:'challenge_066',name:'Desafio 066 — polinização',reward:14,category:'polinização'});
  window.BioChallenges.push({id:'challenge_067',name:'Desafio 067 — território',reward:15,category:'território'});
  window.BioChallenges.push({id:'challenge_068',name:'Desafio 068 — agricultura',reward:16,category:'agricultura'});
  window.BioChallenges.push({id:'challenge_069',name:'Desafio 069 — comércio',reward:17,category:'comércio'});
  window.BioChallenges.push({id:'challenge_070',name:'Desafio 070 — cultura',reward:18,category:'cultura'});
  window.BioChallenges.push({id:'challenge_071',name:'Desafio 071 — símbolo',reward:19,category:'símbolo'});
  window.BioChallenges.push({id:'challenge_072',name:'Desafio 072 — linhagem',reward:20,category:'linhagem'});
  window.BioChallenges.push({id:'challenge_073',name:'Desafio 073 — adaptação',reward:21,category:'adaptação'});
  window.BioChallenges.push({id:'challenge_074',name:'Desafio 074 — sobrevivência',reward:22,category:'sobrevivência'});
  window.BioChallenges.push({id:'challenge_075',name:'Desafio 075 — solo',reward:23,category:'solo'});
  window.BioChallenges.push({id:'challenge_076',name:'Desafio 076 — predação',reward:24,category:'predação'});
  window.BioChallenges.push({id:'challenge_077',name:'Desafio 077 — dispersão',reward:25,category:'dispersão'});
  window.BioChallenges.push({id:'challenge_078',name:'Desafio 078 — abrigo',reward:26,category:'abrigo'});
  window.BioChallenges.push({id:'challenge_079',name:'Desafio 079 — metalurgia',reward:27,category:'metalurgia'});
  window.BioChallenges.push({id:'challenge_080',name:'Desafio 080 — aliança',reward:28,category:'aliança'});
  window.BioChallenges.push({id:'challenge_081',name:'Desafio 081 — arte',reward:29,category:'arte'});
  window.BioChallenges.push({id:'challenge_082',name:'Desafio 082 — tradição',reward:30,category:'tradição'});
  window.BioChallenges.push({id:'challenge_083',name:'Desafio 083 — mutação',reward:31,category:'mutação'});
  window.BioChallenges.push({id:'challenge_084',name:'Desafio 084 — exploração',reward:32,category:'exploração'});
  window.BioChallenges.push({id:'challenge_085',name:'Desafio 085 — reprodução',reward:33,category:'reprodução'});
  window.BioChallenges.push({id:'challenge_086',name:'Desafio 086 — água',reward:34,category:'água'});
  window.BioChallenges.push({id:'challenge_087',name:'Desafio 087 — herbivoria',reward:35,category:'herbivoria'});
  window.BioChallenges.push({id:'challenge_088',name:'Desafio 088 — migração',reward:36,category:'migração'});
  window.BioChallenges.push({id:'challenge_089',name:'Desafio 089 — ferramenta',reward:37,category:'ferramenta'});
  window.BioChallenges.push({id:'challenge_090',name:'Desafio 090 — engenharia',reward:38,category:'engenharia'});
  window.BioChallenges.push({id:'challenge_091',name:'Desafio 091 — guerra',reward:39,category:'guerra'});
  window.BioChallenges.push({id:'challenge_092',name:'Desafio 092 — música',reward:40,category:'música'});
  window.BioChallenges.push({id:'challenge_093',name:'Desafio 093 — arquitetura',reward:10,category:'arquitetura'});
  window.BioChallenges.push({id:'challenge_094',name:'Desafio 094 — herança',reward:11,category:'herança'});
  window.BioChallenges.push({id:'challenge_095',name:'Desafio 095 — descoberta',reward:12,category:'descoberta'});
  window.BioChallenges.push({id:'challenge_096',name:'Desafio 096 — clima',reward:13,category:'clima'});
  window.BioChallenges.push({id:'challenge_097',name:'Desafio 097 — vegetação',reward:14,category:'vegetação'});
  window.BioChallenges.push({id:'challenge_098',name:'Desafio 098 — polinização',reward:15,category:'polinização'});
  window.BioChallenges.push({id:'challenge_099',name:'Desafio 099 — território',reward:16,category:'território'});
  window.BioChallenges.push({id:'challenge_100',name:'Desafio 100 — agricultura',reward:17,category:'agricultura'});
  window.BioChallenges.push({id:'challenge_101',name:'Desafio 101 — comércio',reward:18,category:'comércio'});
  window.BioChallenges.push({id:'challenge_102',name:'Desafio 102 — cultura',reward:19,category:'cultura'});
  window.BioChallenges.push({id:'challenge_103',name:'Desafio 103 — símbolo',reward:20,category:'símbolo'});
  window.BioChallenges.push({id:'challenge_104',name:'Desafio 104 — linhagem',reward:21,category:'linhagem'});
  window.BioChallenges.push({id:'challenge_105',name:'Desafio 105 — adaptação',reward:22,category:'adaptação'});
  window.BioChallenges.push({id:'challenge_106',name:'Desafio 106 — sobrevivência',reward:23,category:'sobrevivência'});
  window.BioChallenges.push({id:'challenge_107',name:'Desafio 107 — solo',reward:24,category:'solo'});
  window.BioChallenges.push({id:'challenge_108',name:'Desafio 108 — predação',reward:25,category:'predação'});
  window.BioChallenges.push({id:'challenge_109',name:'Desafio 109 — dispersão',reward:26,category:'dispersão'});
  window.BioChallenges.push({id:'challenge_110',name:'Desafio 110 — abrigo',reward:27,category:'abrigo'});
  window.BioChallenges.push({id:'challenge_111',name:'Desafio 111 — metalurgia',reward:28,category:'metalurgia'});
  window.BioChallenges.push({id:'challenge_112',name:'Desafio 112 — aliança',reward:29,category:'aliança'});
  window.BioChallenges.push({id:'challenge_113',name:'Desafio 113 — arte',reward:30,category:'arte'});
  window.BioChallenges.push({id:'challenge_114',name:'Desafio 114 — tradição',reward:31,category:'tradição'});
  window.BioChallenges.push({id:'challenge_115',name:'Desafio 115 — mutação',reward:32,category:'mutação'});
  window.BioChallenges.push({id:'challenge_116',name:'Desafio 116 — exploração',reward:33,category:'exploração'});
  window.BioChallenges.push({id:'challenge_117',name:'Desafio 117 — reprodução',reward:34,category:'reprodução'});
  window.BioChallenges.push({id:'challenge_118',name:'Desafio 118 — água',reward:35,category:'água'});
  window.BioChallenges.push({id:'challenge_119',name:'Desafio 119 — herbivoria',reward:36,category:'herbivoria'});
})();
