/* BIOEVO: BRASIL NATIVO — GAME CORE — systems-first single bundle. */
(()=>{
'use strict';
const D=window.BioData,SP=window.BioSprites;
const canvas=document.getElementById('game'); const ctx=canvas.getContext('2d',{alpha:false});
const pcanvas=document.getElementById('portrait'); const pctx=pcanvas.getContext('2d');
const evoCanvas=document.getElementById('evo-portrait'); const evoCtx=evoCanvas.getContext('2d');
const mapCanvas=document.getElementById('map-canvas'); const mapCtx=mapCanvas.getContext('2d');
const lineageCanvas=document.getElementById('lineage-canvas'); const lineageCtx=lineageCanvas.getContext('2d');
const $=id=>document.getElementById(id);
const UI={start:$('start-modal'),loading:$('loading'),toast:$('toast'),species:$('species-name'),type:$('species-type'),generation:$('generation-label'),stageLabel:$('stage-label'),controlsHint:$('controls-hint'),dna:$('dna'),biomass:$('biomass'),stone:$('stone'),population:$('population'),hp:$('txt-hp'),energy:$('txt-energy'),water:$('txt-water'),barHp:$('bar-hp'),barEnergy:$('bar-energy'),barWater:$('bar-water'),speed:$('stat-speed'),defense:$('stat-defense'),jump:$('stat-jump'),vision:$('stat-vision'),objectiveTitle:$('objective-title'),objectiveDesc:$('objective-desc'),objectiveProgress:$('objective-progress'),log:$('event-log'),evo:$('evolution-modal'),evoTitle:$('evo-modal-title'),evoOptions:$('evo-options'),dnaLarge:$('dna-large'),build:$('build-modal'),buildOptions:$('build-options'),lineage:$('lineage-modal'),lineageTree:$('lineage-tree'),map:$('map-modal'),mapLegend:$('map-legend'),dashboard:$('dashboard'),dashboardBody:$('dashboard-body'),dashboardSubtitle:$('dashboard-subtitle'),polish:$('polish-hud')};
const Game={running:false,paused:false,last:performance.now(),time:0,day:1,hour:6,seed:Math.floor(Math.random()*1e9),selectedBiome:'cerrado',stage:'cell',cell:null,mouse:{x:0,y:0,down:false},keys:{},camera:{x:0,y:0,zoom:1},world:{},player:null,species:null,nearby:[],plants:[],animals:[],buildings:[],particles:[],floating:[],lineage:[],discoveries:new Set(),weather:'clear',weatherTimer:0,weatherTicks:0,objective:null,activeTab:'overview',autosaveTimer:0};
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function rand(){Game.seed=(Game.seed*1664525+1013904223)>>>0;return Game.seed/4294967296;}
function randi(a,b){return Math.floor(rand()*(b-a+1))+a;}
function pick(arr){return arr[Math.floor(rand()*arr.length)];}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
function tile(x,y){return Game.world.grid[y*D.WORLD_W+x]||0;}
function key(x,y){return y*D.WORLD_W+x;}
function say(text){const node=document.createElement('div');node.textContent=text;UI.log.prepend(node);while(UI.log.children.length>22)UI.log.lastChild.remove();UI.toast.textContent=text;UI.toast.classList.remove('hidden');clearTimeout(say.timer);say.timer=setTimeout(()=>UI.toast.classList.add('hidden'),2200);}
function setModal(el,on=true){el.classList.toggle('hidden',!on);}
function normGenes(g){return Object.assign(D.cloneGenes(D.START_GENES),g||{});}

/* ===== APPEARANCE SYSTEM V4 ===== */
const AppearanceSystem={};
AppearanceSystem.palette=['#71c6c0','#6e9bd3','#78b966','#d99a68','#d36f82','#a984cf','#d7b867','#d8d6ca','#5f7654','#383d48'];
AppearanceSystem.defaults=function(){return{
  cell:{shape:'organic',primary:'#71c6c0',secondary:'#b8ece1',pattern:'soft',length:1,width:1},
  animal:{body:'fish',primary:'#6594a6',secondary:'#a5d6da',pattern:'spots',head:'round',tail:'fin',length:1,width:1,eye:1},
  plant:{habit:'herb',stem:'#5c7a48',leaf:'#78b966',accent:'#d7b867',leafShape:'oval',root:'fibrous',flower:'bud',fruit:'none',height:1,width:1,leafCount:5}
};};
AppearanceSystem.ensure=function(){
  if(!Game.species)return this.defaults();
  const d=this.defaults(),a=Game.species.appearance||{};
  Game.species.appearance={
    cell:Object.assign({},d.cell,a.cell||{}),
    animal:Object.assign({},d.animal,a.animal||{}),
    plant:Object.assign({},d.plant,a.plant||{})
  };
  return Game.species.appearance;
};
AppearanceSystem.canAnimalBody=function(body){
  const owned=Game.species?.mutations||[];
  if(body==='fish')return true;
  if(body==='quadruped')return owned.includes('swift_legs')||owned.includes('tool_use');
  if(body==='bird')return owned.includes('air_sacs');
  return false;
};
AppearanceSystem.canPlantHabit=function(habit){
  const owned=Game.species?.mutations||[];
  if(habit==='herb')return true;
  if(habit==='shrub')return owned.includes('broad_leaves');
  if(habit==='tree')return owned.includes('thick_stem');
  if(habit==='cactus')return owned.includes('deep_roots')&&owned.includes('water_storage');
  return false;
};
AppearanceSystem.syncGenes=function(){
  if(!Game.species)return;
  const a=this.ensure(),g=Game.species.genes||{};
  if(Game.stage==='cell'){g.color=a.cell.primary;return;}
  if(g.body==='plant'||Game.species.lifePath==='vegetal'){
    g.body='plant';g.color=a.plant.leaf;g.appearance=Object.assign({},a.plant);return;
  }
  if(!this.canAnimalBody(a.animal.body))a.animal.body='fish';
  g.body=a.animal.body;g.color=a.animal.primary;g.appearance=Object.assign({},a.animal);
};
AppearanceSystem.applyMutation=function(id){
  const a=this.ensure();
  if(id==='armor')a.animal.pattern='bands';
  if(id==='cold_fur')a.animal.pattern='soft';
  if(id==='air_sacs'&&this.canAnimalBody('bird'))a.animal.body='bird';
  if(id==='swift_legs'&&a.animal.body==='fish')a.animal.body='quadruped';
  if(id==='thick_stem'&&a.plant.habit==='herb')a.plant.habit='tree';
  if(id==='broad_leaves'&&a.plant.habit==='herb')a.plant.habit='shrub';
  if(id==='deep_roots')a.plant.root='deep';
  if(id==='showy_flower')a.plant.flower='star';
  if(id==='sweet_fruit')a.plant.fruit='berry';
};
AppearanceSystem.drawCellPattern=function(target,r,a){
  const c=a.secondary||'#b8ece1';target.save();target.globalAlpha=.42;target.fillStyle=c;target.strokeStyle=c;
  if(a.pattern==='spots'){for(const p of [[-.32,-.18],[.12,-.28],[.32,.08],[-.08,.26],[-.38,.18]]){target.beginPath();target.arc(p[0]*r,p[1]*r,Math.max(1.5,r*.08),0,Math.PI*2);target.fill();}}
  else if(a.pattern==='stripes'){target.lineWidth=Math.max(1.2,r*.06);for(const xx of [-.35,-.12,.12,.35]){target.beginPath();target.moveTo(xx*r,-r*.62);target.lineTo(xx*r,r*.62);target.stroke();}}
  else if(a.pattern==='glow'){target.globalAlpha=.24;target.shadowColor=c;target.shadowBlur=r*.45;target.beginPath();target.arc(0,0,r*.68,0,Math.PI*2);target.strokeStyle=c;target.lineWidth=Math.max(2,r*.08);target.stroke();}
  else {target.globalAlpha=.18;target.beginPath();target.ellipse(-r*.16,-r*.18,r*.34,r*.18,-.35,0,Math.PI*2);target.fill();}
  if(a.shape==='segmented'){target.globalAlpha=.22;target.fillStyle='#0d2b2d';for(const xx of [-.32,0,.32])target.fillRect(xx*r-r*.025,-r*.7,r*.05,r*1.4);}
  target.restore();
};
AppearanceSystem.drawLeaf=function(target,x,y,s,shape,color,rot=0){
  target.save();target.translate(x,y);target.rotate(rot);target.fillStyle=color;target.beginPath();
  if(shape==='lance'){target.moveTo(0,-s);target.quadraticCurveTo(s*.55,0,0,s);target.quadraticCurveTo(-s*.55,0,0,-s);}
  else if(shape==='heart'){target.moveTo(0,s*.9);target.bezierCurveTo(-s*1.15,s*.15,-s*.8,-s*.8,0,-s*.25);target.bezierCurveTo(s*.8,-s*.8,s*1.15,s*.15,0,s*.9);}
  else if(shape==='frond'){target.moveTo(0,s);for(let i=4;i>=-4;i--){const yy=i*s*.2;target.lineTo((i%2?1:-1)*s*.65,yy);}target.closePath();}
  else target.ellipse(0,0,s*.68,s,0,0,Math.PI*2);
  target.closePath();target.fill();target.restore();
};
AppearanceSystem.drawPlant=function(target,x,y,size,opt={}){
  const a=this.ensure().plant,owned=Game.species?.mutations||[];target.save();target.translate(x,y);target.scale(a.width||1,a.height||1);target.imageSmoothingEnabled=false;
  target.fillStyle='rgba(0,0,0,.22)';target.beginPath();target.ellipse(0,size*.34,size*.34,size*.09,0,0,Math.PI*2);target.fill();
  target.strokeStyle='rgba(124,92,61,.58)';target.lineWidth=Math.max(1,size*.028);
  if(a.root==='deep'){target.beginPath();target.moveTo(0,size*.2);target.lineTo(0,size*.48);target.stroke();}
  else {for(const ang of [-2.7,-2.15,-1.0,-.45]){target.beginPath();target.moveTo(0,size*.2);target.lineTo(Math.cos(ang)*size*.28,size*.24+Math.abs(Math.sin(ang))*size*.18);target.stroke();}}
  if(a.habit==='cactus'){
    target.fillStyle=a.stem;target.fillRect(-size*.09,-size*.34,size*.18,size*.68);
    for(const side of [-1,1]){target.fillRect(side*size*.09,-size*.18,size*.18,size*.09);target.fillRect(side*size*.20,-size*.18,size*.07,size*.28);}
  }else{
    const trunk=a.habit==='tree'?size*.12:a.habit==='shrub'?size*.075:size*.045;
    target.strokeStyle=a.stem;target.lineWidth=Math.max(3,trunk);target.lineCap='round';target.beginPath();target.moveTo(0,size*.22);target.lineTo(0,-size*(a.habit==='tree'?.34:.24));target.stroke();
    const count=Math.round(a.leafCount||5),spread=a.habit==='tree'?size*.34:a.habit==='shrub'?size*.28:size*.22;
    for(let i=0;i<count;i++){const ang=(i/(Math.max(1,count-1))-.5)*Math.PI*1.55;const lx=Math.sin(ang)*spread,ly=-size*.18-Math.cos(ang)*size*(a.habit==='tree'?.20:.13);this.drawLeaf(target,lx,ly,size*(a.habit==='tree'?.13:.11),a.leafShape,a.leaf,ang*.5);}
  }
  if(a.flower!=='none'&&(owned.includes('showy_flower')||a.flower==='bud')){target.fillStyle=a.accent;const petals=a.flower==='star'?6:4;for(let i=0;i<petals;i++){const ang=i/petals*Math.PI*2;target.beginPath();target.ellipse(Math.cos(ang)*size*.055,-size*.39+Math.sin(ang)*size*.055,size*.032,size*.065,ang,0,Math.PI*2);target.fill();}target.beginPath();target.arc(0,-size*.39,size*.032,0,Math.PI*2);target.fill();}
  if(a.fruit!=='none'&&owned.includes('sweet_fruit')){target.fillStyle='#d56f66';for(const p of [[-.13,-.15],[.16,-.22],[.05,-.08]]){target.beginPath();target.arc(p[0]*size,p[1]*size,size*.04,0,Math.PI*2);target.fill();}}
  if(owned.includes('thorns')||owned.includes('toxin')){target.strokeStyle='#d9d3b0';target.lineWidth=1;for(let i=0;i<5;i++){const yy=-size*.22+i*size*.09;target.beginPath();target.moveTo(size*.04,yy);target.lineTo(size*.15,yy-size*.045);target.stroke();}}
  target.restore();
};
AppearanceSystem.drawAnimal=function(target,x,y,size,opt={}){
  const a=this.ensure().animal,g=Game.species.genes;this.syncGenes();target.save();target.translate(x,y);target.scale(a.length||1,a.width||1);SP.drawPlayer(target,0,0,size,g,opt);
  target.save();target.scale(opt.facing||1,1);target.globalAlpha=.48;target.fillStyle=a.secondary;target.strokeStyle=a.secondary;
  if(a.pattern==='spots'){for(const p of [[-.2,-.08],[.02,.05],[.18,-.13]]){target.beginPath();target.arc(p[0]*size,p[1]*size,size*.045,0,Math.PI*2);target.fill();}}
  else if(a.pattern==='stripes'||a.pattern==='bands'){target.lineWidth=Math.max(1.5,size*.025);for(const xx of [-.20,-.05,.10,.24]){target.beginPath();target.moveTo(xx*size,-size*.18);target.lineTo((xx+.04)*size,size*.16);target.stroke();}}
  if((Game.species.mutations||[]).includes('armor')){target.globalAlpha=.45;target.strokeStyle='#d8d0ab';target.lineWidth=Math.max(1,size*.025);for(let i=0;i<4;i++){target.beginPath();target.arc(-size*.06,size*.01,size*(.18+i*.035),Math.PI*1.05,Math.PI*1.95);target.stroke();}}
  target.restore();target.restore();
};
AppearanceSystem.drawCurrent=function(target,x,y,size,opt={}){
  if(Game.species?.genes?.body==='plant'||Game.species?.lifePath==='vegetal')this.drawPlant(target,x,y,size,opt);else this.drawAnimal(target,x,y,size,opt);
};
AppearanceSystem.choiceButtons=function(section,key,choices){
  const a=this.ensure()[section];return '<div class="appearance-choices">'+choices.map(c=>{const locked=!!c.locked;return '<button class="appearance-choice '+(a[key]===c.value?'active ':'')+(locked?'locked':'')+'" data-look-key="'+key+'" data-look-value="'+c.value+'" '+(locked?'disabled':'')+'><b>'+c.icon+'</b><span>'+c.label+'</span>'+(locked?'<small>'+c.locked+'</small>':'')+'</button>';}).join('')+'</div>';
};
AppearanceSystem.paletteButtons=function(section,key){
  const value=this.ensure()[section][key];return '<div class="palette-row">'+this.palette.map(c=>'<button class="palette-dot '+(value===c?'active':'')+'" data-look-key="'+key+'" data-look-value="'+c+'" style="--swatch:'+c+'" aria-label="'+c+'"></button>').join('')+'</div>';
};
AppearanceSystem.renderEditor=function(section,root){
  const a=this.ensure()[section],owned=Game.species?.mutations||[];
  let html='<div class="appearance-editor"><div class="appearance-hero"><div><span class="evo-kicker">EDITOR DE FORMA</span><strong>Seu corpo faz parte da evolução</strong><p>As escolhas visuais ficam salvas na linhagem e aparecem no mundo. Novas estruturas são liberadas pelas mutações.</p></div><span class="appearance-live">● AO VIVO</span></div>';
  if(section==='cell'){
    html+='<section class="appearance-section"><h3>Forma celular</h3>'+this.choiceButtons('cell','shape',[
      {value:'organic',label:'Orgânica',icon:'◌'},{value:'oval',label:'Oval',icon:'⬭'},{value:'spore',label:'Esporo',icon:'✹'},{value:'segmented',label:'Segmentada',icon:'▰'}
    ])+'</section>';
    html+='<section class="appearance-section"><h3>Padrão</h3>'+this.choiceButtons('cell','pattern',[
      {value:'soft',label:'Suave',icon:'◍'},{value:'spots',label:'Pintas',icon:'⠿'},{value:'stripes',label:'Listras',icon:'≋'},{value:'glow',label:'Bioluz',icon:'✦'}
    ])+'</section>';
    html+='<section class="appearance-section"><h3>Cor principal</h3>'+this.paletteButtons('cell','primary')+'<h3>Cor secundária</h3>'+this.paletteButtons('cell','secondary')+'</section>';
    html+='<section class="appearance-section slider-grid"><label>Comprimento <input type="range" min=".78" max="1.35" step=".01" value="'+a.length+'" data-look-range="length"><output>'+Number(a.length).toFixed(2)+'×</output></label><label>Largura <input type="range" min=".78" max="1.30" step=".01" value="'+a.width+'" data-look-range="width"><output>'+Number(a.width).toFixed(2)+'×</output></label></section>';
  }else if(section==='animal'){
    html+='<section class="appearance-section"><h3>Plano corporal</h3>'+this.choiceButtons('animal','body',[
      {value:'fish',label:'Aquático',icon:'🐟'},
      {value:'quadruped',label:'Terrestre',icon:'🐾',locked:this.canAnimalBody('quadruped')?'':'Evolua pernas'},
      {value:'bird',label:'Voador',icon:'🪽',locked:this.canAnimalBody('bird')?'':'Evolua sacos aéreos'}
    ])+'</section>';
    html+='<section class="appearance-section"><h3>Padrão da pele</h3>'+this.choiceButtons('animal','pattern',[
      {value:'soft',label:'Lisa',icon:'◍'},{value:'spots',label:'Pintas',icon:'⠿'},{value:'stripes',label:'Listras',icon:'≋'},{value:'bands',label:'Faixas',icon:'▤'}
    ])+'</section>';
    html+='<section class="appearance-section"><h3>Cor principal</h3>'+this.paletteButtons('animal','primary')+'<h3>Marcas</h3>'+this.paletteButtons('animal','secondary')+'</section>';
    html+='<section class="appearance-section slider-grid"><label>Corpo comprido <input type="range" min=".78" max="1.35" step=".01" value="'+a.length+'" data-look-range="length"><output>'+Number(a.length).toFixed(2)+'×</output></label><label>Altura do corpo <input type="range" min=".78" max="1.30" step=".01" value="'+a.width+'" data-look-range="width"><output>'+Number(a.width).toFixed(2)+'×</output></label></section>';
  }else{
    html+='<section class="appearance-section"><h3>Porte da planta</h3>'+this.choiceButtons('plant','habit',[
      {value:'herb',label:'Herbácea',icon:'🌱'},
      {value:'shrub',label:'Arbusto',icon:'🌿',locked:this.canPlantHabit('shrub')?'':'Folhas largas'},
      {value:'tree',label:'Árvore',icon:'🌳',locked:this.canPlantHabit('tree')?'':'Caule grosso'},
      {value:'cactus',label:'Suculenta',icon:'🌵',locked:this.canPlantHabit('cactus')?'':'Raízes + reserva hídrica'}
    ])+'</section>';
    html+='<section class="appearance-section"><h3>Folhas</h3>'+this.choiceButtons('plant','leafShape',[
      {value:'oval',label:'Ovais',icon:'🍃'},{value:'lance',label:'Lanceoladas',icon:'↟'},{value:'heart',label:'Cordiformes',icon:'♥'},{value:'frond',label:'Frondes',icon:'〰'}
    ])+'</section>';
    html+='<section class="appearance-section"><h3>Raízes e reprodução</h3>'+this.choiceButtons('plant','root',[
      {value:'fibrous',label:'Fibrosas',icon:'⌁'},{value:'deep',label:'Profundas',icon:'↓',locked:owned.includes('deep_roots')?'':'Raízes profundas'}
    ])+this.choiceButtons('plant','flower',[
      {value:'none',label:'Sem flor',icon:'·'},{value:'bud',label:'Botão',icon:'●'},{value:'star',label:'Flor aberta',icon:'✿',locked:owned.includes('showy_flower')?'':'Flor chamativa'}
    ])+this.choiceButtons('plant','fruit',[
      {value:'none',label:'Sem fruto',icon:'·'},{value:'berry',label:'Frutos',icon:'●',locked:owned.includes('sweet_fruit')?'':'Fruto doce'}
    ])+'</section>';
    html+='<section class="appearance-section"><h3>Folhagem</h3>'+this.paletteButtons('plant','leaf')+'<h3>Caule</h3>'+this.paletteButtons('plant','stem')+'<h3>Flor/fruto</h3>'+this.paletteButtons('plant','accent')+'</section>';
    html+='<section class="appearance-section slider-grid"><label>Altura <input type="range" min=".78" max="1.45" step=".01" value="'+a.height+'" data-look-range="height"><output>'+Number(a.height).toFixed(2)+'×</output></label><label>Abertura <input type="range" min=".78" max="1.40" step=".01" value="'+a.width+'" data-look-range="width"><output>'+Number(a.width).toFixed(2)+'×</output></label><label>Quantidade de folhas <input type="range" min="3" max="10" step="1" value="'+a.leafCount+'" data-look-range="leafCount"><output>'+a.leafCount+'</output></label></section>';
  }
  html+='</div>';root.innerHTML=html;
  root.querySelectorAll('[data-look-key]').forEach(btn=>btn.onclick=()=>{if(btn.disabled)return;const key=btn.dataset.lookKey,val=btn.dataset.lookValue;this.ensure()[section][key]=val;this.syncGenes();RenderSystem.drawPortraits();this.renderEditor(section,root);});
  root.querySelectorAll('[data-look-range]').forEach(input=>input.oninput=()=>{const key=input.dataset.lookRange,val=Number(input.value);this.ensure()[section][key]=val;input.parentElement.querySelector('output').textContent=key==='leafCount'?String(Math.round(val)):val.toFixed(2)+'×';this.syncGenes();RenderSystem.drawPortraits();});
};

// ===== WORLDSYSTEM =====
const WorldSystem={};
WorldSystem.description="Generates a deterministic tile world using layered noise-like smoothing, biome bands, rivers, resources, and landmarks.";
// ===== BIOMESYSTEM =====
const BiomeSystem={};
BiomeSystem.description="Resolves climate, movement, resource richness, and habitat quality from tile and weather.";
// ===== WEATHERSYSTEM =====
const WeatherSystem={};
WeatherSystem.description="Transitions rain, drought, heat, cold, frost, storm, flood, and fire with gameplay effects.";
// ===== TIMESYSTEM =====
const TimeSystem={};
TimeSystem.description="Runs compressed days and seasons without tying simulation speed to device refresh rate.";
// ===== ENTITYSYSTEM =====
const EntitySystem={};
EntitySystem.description="Maintains a capped active entity set and swaps distant populations into statistical simulation.";
// ===== ANIMALAISYSTEM =====
const AnimalAISystem={};
AnimalAISystem.description="Uses needs, utility scores, local sensing, flee/chase/feed/mate/rest states, and personality.";
// ===== PLANTSYSTEM =====
const PlantSystem={};
PlantSystem.description="Grows flora from water, sunlight, soil fertility, and climate; handles regrowth and dispersal.";
// ===== GENETICSSYSTEM =====
const GeneticsSystem={};
GeneticsSystem.description="Creates heritable offspring using weighted parental traits plus low-frequency mutation.";
// ===== REPRODUCTIONSYSTEM =====
const ReproductionSystem={};
ReproductionSystem.description="Matches compatible adults, consumes energy, spawns descendants, and records lineage.";
// ===== EVOLUTIONSYSTEM =====
const EvolutionSystem={};
EvolutionSystem.description="Spends DNA on mutations, applies trade-offs, and keeps adaptations visible.";
// ===== POPULATIONSYSTEM =====
const PopulationSystem={};
PopulationSystem.description="Simulates births, mortality, migration, and distant territory in compact population cells.";
// ===== RESOURCESYSTEM =====
const ResourceSystem={};
ResourceSystem.description="Generates harvest nodes, depletion, regrowth, inventory capacity, and resource conversion.";
// ===== COMBATSYSTEM =====
const CombatSystem={};
CombatSystem.description="Resolves attacks, defense, thorns, fleeing, damage falloff, and death rewards.";
// ===== BUILDINGSYSTEM =====
const BuildingSystem={};
BuildingSystem.description="Places structures, checks materials, enforces footprint/collision, and updates territory score.";
// ===== TRIBESYSTEM =====
const TribeSystem={};
TribeSystem.description="Transforms individual-scale growth into roles, cohesion, settlement capacity, and leadership.";
// ===== CIVILIZATIONSYSTEM =====
const CivilizationSystem={};
CivilizationSystem.description="Advances village, town, city, civilizational milestones, culture, trade, and diplomacy.";
// ===== TECHNOLOGYSYSTEM =====
const TechnologySystem={};
TechnologySystem.description="Unlocks the historical progression from stone to engineering and abstract later sciences.";
// ===== DIPLOMACYSYSTEM =====
const DiplomacySystem={};
DiplomacySystem.description="Tracks relations with neighboring groups and resolves trade, alliance, dispute, and war events.";
// ===== SAVESYSTEM =====
const SaveSystem={};
SaveSystem.description="Serializes only stable state to LocalStorage and rejects malformed or oversized saves safely.";
// ===== UISYSTEM =====
const UISystem={};
UISystem.description="Updates HUD, modals, dashboard tabs, logs, objectives, and action hints.";
// ===== RENDERSYSTEM =====
const RenderSystem={};
RenderSystem.description="Draws a pixel-art scene with depth layers, weather, particles, lighting, and responsive camera.";

// ===== CELLSYSTEM =====
const CellSystem={};
CellSystem.description="Estágio celular amplo com cadeia alimentar, células autônomas, predadores, absorção e exploração em mapa microscópico grande.";
CellSystem.WORLD_W=9200;
CellSystem.WORLD_H=6200;
CellSystem.PARTICLE_TARGET=500;
CellSystem.MICROBE_TARGET=105;
CellSystem.mutationIcon={flagellum:'〰',membrane:'◯',phagocytosis:'◉',photosynthesis:'☀',chemoreceptors:'⌁',cilia:'✺',vacuole:'◌',chloroplasts:'✦',toxin:'✹',nucleus:'⬢',multicellular:'⬡'};
CellSystem.mutations=[
  {id:'flagellum',name:'Flagelo',branch:'neutral',cost:10,desc:'Mais velocidade para explorar o mundo microscópico.',effect:{mobility:18}},
  {id:'membrane',name:'Membrana reforçada',branch:'neutral',cost:12,desc:'Mais resistência quando células maiores atacam.',effect:{membrane:22}},
  {id:'phagocytosis',name:'Fagocitose',branch:'animal',cost:16,desc:'Engole células com tamanho mais próximo do seu e recebe mais energia ao caçar.',effect:{animal:2,feeding:24}},
  {id:'photosynthesis',name:'Fotossíntese primitiva',branch:'plant',cost:16,desc:'Transforma luz em energia e abre a tendência vegetal.',effect:{plant:2,photosynthesis:20}},
  {id:'chemoreceptors',name:'Quimiorreceptores',branch:'neutral',cost:14,desc:'Percebe alimento e ameaças a uma distância maior.',effect:{sense:24}},
  {id:'cilia',name:'Cílios motores',branch:'animal',cost:18,desc:'Controle fino e aceleração na água.',requires:['flagellum'],effect:{animal:1,mobility:20}},
  {id:'vacuole',name:'Vacúolo de reserva',branch:'neutral',cost:20,desc:'Guarda energia e água por mais tempo.',effect:{storage:28}},
  {id:'chloroplasts',name:'Cloroplastos estáveis',branch:'plant',cost:22,desc:'A fotossíntese fica mais eficiente.',requires:['photosynthesis'],effect:{plant:2,photosynthesis:28}},
  {id:'toxin',name:'Toxina celular',branch:'animal',cost:22,desc:'Dano químico contra células que encostam em você.',requires:['phagocytosis'],effect:{animal:1,toxin:26}},
  {id:'nucleus',name:'Núcleo complexo',branch:'neutral',cost:28,desc:'Organiza o DNA e libera saltos evolutivos maiores.',requiresCount:3,effect:{complexity:35}},
  {id:'multicellular',name:'Multicelularidade',branch:'neutral',cost:42,desc:'Células passam a cooperar e formam o primeiro organismo.',requires:['nucleus'],requiresCount:5,final:true,effect:{complexity:60}}
];
CellSystem.biomeTheme=function(){
  const themes={
    amazonia:{water:'#0b3b46',glow:'#2b8c78'},
    caatinga:{water:'#243b42',glow:'#a88a52'},
    cerrado:{water:'#163f46',glow:'#7c9a58'},
    mata:{water:'#123f45',glow:'#4f9b72'},
    pantanal:{water:'#0d4454',glow:'#5aa8a7'},
    pampa:{water:'#173d49',glow:'#79a07d'}
  };
  return themes[Game.selectedBiome]||themes.cerrado;
};
CellSystem.init=function(){
  Game.stage='cell';
  AppearanceSystem.ensure();
  document.body.classList.add('cell-stage');
  Game.world={};
  Game.plants=[];Game.animals=[];Game.buildings=[];
  const x=CellSystem.WORLD_W*.5,y=CellSystem.WORLD_H*.5;
  Game.cell={
    x,y,radius:19,
    hp:100,hpMax:100,energy:78,energyMax:100,water:100,waterMax:100,
    mobility:16,membrane:8,feeding:8,photosynthesis:0,sense:8,storage:0,toxin:0,complexity:0,
    animal:0,plant:0,age:0,pulse:0,feedCooldown:0,hitCooldown:0,densityTimer:0,
    camera:{x,y},particles:[],microbes:[],effects:[],absorbed:0,cellsEaten:0,explored:new Set()
  };
  Game.player={id:'cell_0',x,y,hp:100,energy:78,water:100,alive:true,facing:1,foodCooldown:0,mateCooldown:0,attackCooldown:0};
  for(let i=0;i<380;i++)CellSystem.spawnParticle(true);
  for(let i=380;i<CellSystem.PARTICLE_TARGET;i++)CellSystem.spawnParticle(false);
  for(let i=0;i<72;i++)CellSystem.spawnMicrobe(i<12?'small':null,true);
  for(let i=72;i<CellSystem.MICROBE_TARGET;i++)CellSystem.spawnMicrobe(null,false);
  Game.species.history.push('A primeira célula da linhagem surgiu em águas primitivas.');
  Game.lineage=[{id:'cell_origin',name:Game.species.name,generation:0,biome:'micro',parents:[],note:'Origem unicelular.'}];
  Game.discoveries=new Set();
  CellSystem.refreshObjective();
};
CellSystem.spawnParticle=function(nearPlayer=false){
  const cell=Game.cell;if(!cell)return;
  const roll=rand();
  const type=roll<.38?'nutrient':roll<.57?'protein':roll<.72?'mineral':roll<.91?'light':'dna';
  const colors={nutrient:'#f2b95f',protein:'#e58c98',mineral:'#64d2ce',light:'#9ce06f',dna:'#8da8ff'};
  let x,y;
  if(nearPlayer){
    const a=rand()*Math.PI*2,d=55+rand()*1050;
    x=clamp(cell.x+Math.cos(a)*d,20,CellSystem.WORLD_W-20);
    y=clamp(cell.y+Math.sin(a)*d,20,CellSystem.WORLD_H-20);
  }else{
    x=30+rand()*(CellSystem.WORLD_W-60);y=30+rand()*(CellSystem.WORLD_H-60);
  }
  const shape=type==='mineral'?'crystal':type==='protein'?'chain':type==='light'?'glow':type==='dna'?'dna':'orb';
  cell.particles.push({x,y,vx:(rand()-.5)*18,vy:(rand()-.5)*18,r:type==='dna'?5:type==='protein'?4+randi(0,2):3+randi(0,3),type,shape,color:colors[type],value:type==='dna'?5:type==='protein'?3:2,phase:rand()*6.28,spin:(rand()-.5)*1.4});
};
CellSystem.spawnMicrobe=function(sizeClass=null,nearPlayer=false){
  const cell=Game.cell;if(!cell)return;
  let radius;
  if(sizeClass==='small')radius=7+rand()*8;
  else{const roll=rand();radius=roll<.34?7+rand()*10:roll<.70?16+rand()*11:roll<.92?28+rand()*12:41+rand()*15;}
  let x,y;
  if(nearPlayer){const a=rand()*Math.PI*2,d=240+rand()*1550;x=clamp(cell.x+Math.cos(a)*d,50,CellSystem.WORLD_W-50);y=clamp(cell.y+Math.sin(a)*d,50,CellSystem.WORLD_H-50);}else{x=50+rand()*(CellSystem.WORLD_W-100);y=50+rand()*(CellSystem.WORLD_H-100);}
  if(radius>cell.radius*1.15&&Math.hypot(x-cell.x,y-cell.y)<560){const a=rand()*Math.PI*2,d=650+rand()*650;x=clamp(cell.x+Math.cos(a)*d,50,CellSystem.WORLD_W-50);y=clamp(cell.y+Math.sin(a)*d,50,CellSystem.WORLD_H-50);}
  const forms=['blob','oval','spore','star','ring','segmented','ciliate','armored'];
  let form=pick(forms);if(radius>40&&rand()<.6)form=pick(['armored','star','oval']);if(radius<15&&rand()<.55)form=pick(['spore','ring','ciliate','blob']);
  const palette=['#d56f78','#d59a60','#72bb8a','#77a8ce','#9b80cc','#61bbb0','#ba709f','#d18465'];
  const photosynthetic=rand()<.2,aggressive=radius>25?(.5+rand()*.48):(.08+rand()*.38);
  const color=photosynthetic?pick(['#70b96f','#67ad77','#8cbd67']):pick(palette);
  const flagella=form==='ciliate'?true:rand()<.45,toxin=form==='star'?rand()<.45:rand()<.1;
  cell.microbes.push({id:'micro_'+Math.random().toString(36).slice(2),x,y,radius,color,form,vx:(rand()-.5)*30,vy:(rand()-.5)*30,angle:rand()*Math.PI*2,rotation:rand()*Math.PI*2,turn:rand()*2,pulse:rand()*6.28,tailPhase:rand()*6.28,squash:rand()*6.28,speed:52+rand()*62-Math.max(0,radius-20)*.72,aggressive,photosynthetic,toxin,nucleus:rand()<.5,flagella,hp:radius*4,maxHp:radius*4,cooldown:0,state:'wander',lobes:randi(3,7),spikes:randi(5,10),segments:randi(3,6)});
};
CellSystem.path=function(){
  const cell=Game.cell||{};
  if((cell.plant||0)>(cell.animal||0)+1)return 'vegetal';
  if((cell.animal||0)>(cell.plant||0)+1)return 'animal';
  if((cell.plant||0)>0&&(cell.animal||0)>0)return 'mixotrófica';
  return 'indefinida';
};
CellSystem.canBuy=function(m){
  const owned=Game.species.mutations||[];
  if(owned.includes(m.id))return {ok:false,reason:'Adquirida'};
  if(Game.species.dna<m.cost)return {ok:false,reason:'DNA insuficiente'};
  if(m.requires&&m.requires.some(id=>!owned.includes(id)))return {ok:false,reason:'Falta: '+m.requires.map(id=>CellSystem.mutations.find(x=>x.id===id)?.name||id).join(', ')};
  if(m.requiresCount&&owned.filter(id=>CellSystem.mutations.some(x=>x.id===id&&x.id!=='multicellular')).length<m.requiresCount)return {ok:false,reason:'Tenha '+m.requiresCount+' adaptações'};
  return {ok:true,reason:''};
};
CellSystem.buy=function(id){
  const m=CellSystem.mutations.find(x=>x.id===id);if(!m)return false;
  const check=CellSystem.canBuy(m);if(!check.ok){say(check.reason);return false;}
  Game.species.dna-=m.cost;Game.species.mutations.push(m.id);
  for(const[k,v]of Object.entries(m.effect||{}))Game.cell[k]=(Game.cell[k]||0)+v;
  AppearanceSystem.applyMutation(m.id);AppearanceSystem.syncGenes();
  if(m.id==='vacuole'){Game.cell.energyMax+=24;Game.cell.waterMax+=18;}
  if(m.id==='membrane'){Game.cell.hpMax+=24;Game.cell.hp=Math.min(Game.cell.hpMax,Game.cell.hp+24);}
  Game.species.history.push('Célula: '+m.name);say('Mutação: '+m.name);
  if(m.final){CellSystem.transition();return true;}
  CellSystem.refreshObjective();return true;
};
CellSystem.consumeParticle=function(p,index){
  const cell=Game.cell;
  if(p.type==='light'&&cell.photosynthesis<=0)return false;
  const feedBoost=1+(cell.feeding||0)/100;
  if(p.type==='nutrient'){cell.energy=clamp(cell.energy+7*feedBoost,0,cell.energyMax);Game.species.biomass+=1;Game.species.dna+=1.4*feedBoost;}
  else if(p.type==='protein'){cell.energy=clamp(cell.energy+10*feedBoost,0,cell.energyMax);Game.species.biomass+=2;Game.species.dna+=2.2*feedBoost;}
  else if(p.type==='mineral'){cell.energy=clamp(cell.energy+2,0,cell.energyMax);Game.species.dna+=.8;}
  else if(p.type==='light'){cell.energy=clamp(cell.energy+5+(cell.photosynthesis||0)*.13,0,cell.energyMax);Game.species.dna+=.65;}
  else if(p.type==='dna'){Game.species.dna+=p.value;cell.energy=clamp(cell.energy+3,0,cell.energyMax);}
  CellSystem.burst(p.x,p.y,p.color,3);cell.particles.splice(index,1);cell.absorbed++;return true;
};
CellSystem.burst=function(x,y,color,count=8){
  const cell=Game.cell;if(!cell)return;
  for(let i=0;i<count;i++)cell.effects.push({x,y,vx:(rand()-.5)*85,vy:(rand()-.5)*85,ttl:.35+rand()*.45,max:.8,color,r:1.5+rand()*2.5});
  if(cell.effects.length>180)cell.effects.splice(0,cell.effects.length-180);
};
CellSystem.updateEffects=function(dt){
  const cell=Game.cell;for(let i=cell.effects.length-1;i>=0;i--){const e=cell.effects[i];e.ttl-=dt;e.x+=e.vx*dt;e.y+=e.vy*dt;e.vx*=.97;e.vy*=.97;if(e.ttl<=0)cell.effects.splice(i,1);}
};
CellSystem.repopulateAroundPlayer=function(){
  const cell=Game.cell;
  const localFood=cell.particles.reduce((n,p)=>n+(Math.hypot(p.x-cell.x,p.y-cell.y)<1150?1:0),0);
  if(localFood<135){const need=Math.min(70,135-localFood);for(let i=0;i<need;i++){const far=cell.particles.find(p=>Math.hypot(p.x-cell.x,p.y-cell.y)>2200);if(far){const a=rand()*Math.PI*2,d=90+rand()*1050;far.x=clamp(cell.x+Math.cos(a)*d,20,CellSystem.WORLD_W-20);far.y=clamp(cell.y+Math.sin(a)*d,20,CellSystem.WORLD_H-20);}else CellSystem.spawnParticle(true);}}
  const localCells=cell.microbes.reduce((n,m)=>n+(Math.hypot(m.x-cell.x,m.y-cell.y)<1500?1:0),0);
  if(localCells<30){const need=Math.min(14,30-localCells);for(let i=0;i<need;i++){const far=cell.microbes.find(m=>Math.hypot(m.x-cell.x,m.y-cell.y)>2800);if(far){const a=rand()*Math.PI*2,d=350+rand()*1250;far.x=clamp(cell.x+Math.cos(a)*d,50,CellSystem.WORLD_W-50);far.y=clamp(cell.y+Math.sin(a)*d,50,CellSystem.WORLD_H-50);}else CellSystem.spawnMicrobe(null,true);}}
};
CellSystem.absorb=function(){
  const cell=Game.cell;if(!cell||cell.feedCooldown>0)return;
  cell.feedCooldown=.18;
  let n=0;
  for(let i=cell.particles.length-1;i>=0;i--){
    const p=cell.particles[i],d=Math.hypot(p.x-cell.x,p.y-cell.y);
    if(d>cell.radius+28+(cell.sense||0)*.12)continue;
    if(CellSystem.consumeParticle(p,i))n++;
    if(n>=6)break;
  }
};
CellSystem.eatMicrobe=function(index){
  const cell=Game.cell,m=cell.microbes[index];if(!m)return;
  const bonus=Game.species.mutations.includes('phagocytosis')?1.45:1;
  Game.species.dna+=Math.max(2,m.radius*.34*bonus);
  Game.species.biomass+=Math.max(1,Math.round(m.radius/10));
  cell.energy=clamp(cell.energy+10+m.radius*.55*bonus,0,cell.energyMax);
  cell.radius=clamp(cell.radius+m.radius*.035,14,54);
  cell.cellsEaten++;
  CellSystem.burst(m.x,m.y,m.color,Math.min(20,6+Math.round(m.radius/3)));
  cell.microbes.splice(index,1);
  if(cell.cellsEaten%4===0)say('Você está crescendo ao absorver outras células.');
};
CellSystem.damagePlayer=function(m,dt){
  const cell=Game.cell;if(cell.hitCooldown>0)return;
  const protection=clamp((cell.membrane||0)/90,0,.72);
  const damage=(4+Math.max(0,m.radius-cell.radius)*.35)*(1-protection);
  cell.hp-=damage;cell.energy=Math.max(0,cell.energy-damage*.28);cell.hitCooldown=.24;CellSystem.burst(cell.x,cell.y,'#ff7885',7);
  const dx=cell.x-m.x,dy=cell.y-m.y,len=Math.hypot(dx,dy)||1;
  cell.x=clamp(cell.x+dx/len*20,cell.radius,CellSystem.WORLD_W-cell.radius);
  cell.y=clamp(cell.y+dy/len*20,cell.radius,CellSystem.WORLD_H-cell.radius);
  if(m.toxin)cell.hp-=2.5*(1-protection);
};
CellSystem.respawn=function(){
  const cell=Game.cell;
  cell.hp=cell.hpMax*.72;cell.energy=cell.energyMax*.55;cell.water=cell.waterMax;
  cell.radius=Math.max(15,cell.radius*.9);Game.species.dna=Math.max(0,Game.species.dna-7);
  cell.x=CellSystem.WORLD_W*.5+(rand()-.5)*280;cell.y=CellSystem.WORLD_H*.5+(rand()-.5)*280;
  cell.camera.x=cell.x;cell.camera.y=cell.y;say('Uma célula maior quase engoliu você. A linhagem perdeu parte do DNA.');
};
CellSystem.updateMicrobes=function(dt){
  const cell=Game.cell;
  for(let i=cell.microbes.length-1;i>=0;i--){
    const m=cell.microbes[i];m.pulse+=dt*(1.1+m.speed/120);m.tailPhase+=dt*(3+m.speed/24);m.squash+=dt*(1.5+m.speed/90);m.turn-=dt;m.cooldown-=dt;
    const dx=cell.x-m.x,dy=cell.y-m.y,d=Math.hypot(dx,dy)||1;
    const bigger=m.radius>cell.radius*1.14,smaller=cell.radius>m.radius*(Game.species.mutations.includes('phagocytosis')?1.06:1.28);
    if(bigger&&d<720&&m.aggressive>.38){
      m.state='hunt';m.vx=dx/d*m.speed*1.12;m.vy=dy/d*m.speed*1.12;
    }else if(smaller&&d<430){
      m.state='flee';m.vx=-dx/d*m.speed*1.2;m.vy=-dy/d*m.speed*1.2;
    }else if(m.turn<=0){
      m.state='wander';m.angle+=(rand()-.5)*2.2;m.turn=.7+rand()*2.8;m.vx=Math.cos(m.angle)*m.speed*.48;m.vy=Math.sin(m.angle)*m.speed*.48;
    }
    m.angle=Math.atan2(m.vy,m.vx);m.rotation+=(m.state==='hunt'?1.4:.35)*dt*(m.form==='star'?1.5:.3);
    m.x=clamp(m.x+m.vx*dt,m.radius,CellSystem.WORLD_W-m.radius);
    m.y=clamp(m.y+m.vy*dt,m.radius,CellSystem.WORLD_H-m.radius);
    if(m.photosynthetic)m.hp=clamp(m.hp+dt*.6,0,m.maxHp);
    if(d<(m.radius+cell.radius)*.78){
      if(smaller){CellSystem.eatMicrobe(i);continue;}
      if(bigger){CellSystem.damagePlayer(m,dt);}
      else{
        const nx=dx/d,ny=dy/d;cell.x=clamp(cell.x+nx*3,cell.radius,CellSystem.WORLD_W-cell.radius);cell.y=clamp(cell.y+ny*3,cell.radius,CellSystem.WORLD_H-cell.radius);
      }
    }
    if(Game.species.mutations.includes('toxin')&&d<(m.radius+cell.radius)*.95)m.hp-=dt*(4+(cell.toxin||0)*.16);
    if(m.hp<=0){Game.species.dna+=2;cell.microbes.splice(i,1);}
  }

  for(let i=cell.microbes.length-1;i>=0;i--){
    const a=cell.microbes[i];if(!a)continue;
    for(let j=i-1;j>=0;j--){
      const b=cell.microbes[j];if(!b)continue;
      const d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d>(a.radius+b.radius)*.68)continue;
      const big=a.radius>=b.radius?a:b,small=big===a?b:a;
      if(big.radius<small.radius*1.3)continue;
      big.radius=clamp(big.radius+small.radius*.012,7,58);big.hp=Math.min(big.maxHp,big.hp+small.radius*.25);
      CellSystem.burst(small.x,small.y,small.color,Math.min(12,4+Math.round(small.radius/4)));
      const remove=big===a?j:i;
      cell.microbes.splice(remove,1);
      if(remove===i)break;
    }
  }
};
CellSystem.update=function(dt){
  const cell=Game.cell;if(!cell)return;
  cell.age+=dt;cell.pulse+=dt;cell.feedCooldown-=dt;cell.hitCooldown-=dt;
  const ix=(Game.keys.a||Game.keys.ArrowLeft?-1:0)+(Game.keys.d||Game.keys.ArrowRight?1:0);
  const iy=(Game.keys.w||Game.keys.ArrowUp?-1:0)+(Game.keys.s||Game.keys.ArrowDown?1:0);
  let mx=ix,my=iy;
  if(mx||my){
    const len=Math.hypot(mx,my)||1;mx/=len;my/=len;
    const speed=115+(cell.mobility||0)*2.8;
    cell.x=clamp(cell.x+mx*speed*dt,cell.radius,CellSystem.WORLD_W-cell.radius);
    cell.y=clamp(cell.y+my*speed*dt,cell.radius,CellSystem.WORLD_H-cell.radius);
    cell.energy-=dt*(1.25-Math.min(.45,(cell.mobility||0)/130));
  }
  const photo=cell.photosynthesis>0?(1+(cell.photosynthesis||0)*.026):0;
  cell.energy=clamp(cell.energy+photo*dt-.42*dt,0,cell.energyMax);
  cell.water=clamp(cell.water-.02*dt,0,cell.waterMax);
  if(cell.energy<=0)cell.hp-=6*dt;
  if(cell.hp<=0)CellSystem.respawn();

  for(let i=cell.particles.length-1;i>=0;i--){
    const p=cell.particles[i];p.phase+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
    if(p.x<8||p.x>CellSystem.WORLD_W-8)p.vx*=-1;if(p.y<8||p.y>CellSystem.WORLD_H-8)p.vy*=-1;
    if(Math.hypot(p.x-cell.x,p.y-cell.y)<cell.radius+p.r+4)CellSystem.consumeParticle(p,i);
  }
  CellSystem.updateMicrobes(dt);CellSystem.updateEffects(dt);
  if(cell.photosynthesis>0)Game.species.dna+=dt*.055*(1+cell.photosynthesis/55);

  const zoneX=Math.floor(cell.x/700),zoneY=Math.floor(cell.y/700);cell.explored.add(zoneX+':'+zoneY);
  while(cell.particles.length<CellSystem.PARTICLE_TARGET)CellSystem.spawnParticle(true);
  while(cell.microbes.length<CellSystem.MICROBE_TARGET)CellSystem.spawnMicrobe(null,true);
  cell.densityTimer-=dt;if(cell.densityTimer<=0){cell.densityTimer=1.25;CellSystem.repopulateAroundPlayer();}

  cell.camera.x+=(cell.x-cell.camera.x)*Math.min(1,dt*4.6);
  cell.camera.y+=(cell.y-cell.camera.y)*Math.min(1,dt*4.6);
  Game.player.x=cell.x;Game.player.y=cell.y;Game.player.hp=cell.hp;Game.player.energy=cell.energy;Game.player.water=cell.water;
  CellSystem.refreshObjective();
};
CellSystem.refreshObjective=function(){
  if(!Game.species||!Game.cell)return;
  const owned=Game.species.mutations.filter(id=>CellSystem.mutations.some(m=>m.id===id));
  const hasNucleus=owned.includes('nucleus');
  UI.objectiveTitle.textContent=hasNucleus?'Prepare a multicelularidade':'Cresça e evolua';
  UI.objectiveDesc.textContent=hasNucleus?'Acumule DNA suficiente para unir suas células.':'Absorva partículas e células menores. Fuja das maiores e compre adaptações quando tiver DNA.';
  UI.objectiveProgress.textContent=Math.min(owned.length,5)+' / 5 adaptações';
  const bar=UI.objectiveProgress.parentElement?.querySelector('em');if(bar)bar.style.width=clamp(owned.length/5*100,0,100)+'%';
};
CellSystem.toScreen=function(x,y){
  const c=Game.cell.camera;return{x:canvas.width*.5+(x-c.x),y:canvas.height*.5+(y-c.y)};
};
CellSystem.visible=function(x,y,r=0){
  const s=CellSystem.toScreen(x,y);return s.x>-r-80&&s.y>-r-80&&s.x<canvas.width+r+80&&s.y<canvas.height+r+80;
};
CellSystem.drawBlob=function(target,x,y,r,color,pulse=0,nucleus=false,flagella=false,toxin=false){
  const cell=Game.cell||{},owned=Game.species?.mutations||[],app=AppearanceSystem.ensure().cell;color=app.primary||color;target.save();target.translate(x,y);
  const path=CellSystem.path(),breathe=1+Math.sin(Game.time*3.4+pulse)*.045,sx=(path==='animal'?1.10:path==='vegetal'?.96:1)*(1+Math.sin(Game.time*2.2+pulse)*.025)*(app.length||1),sy=(path==='animal'?.90:path==='vegetal'?1.06:1)*(1-Math.sin(Game.time*2.2+pulse)*.018)*(app.width||1);target.scale(sx,sy);
  target.shadowColor=color;target.shadowBlur=Math.min(28,r*.72);target.fillStyle=color;target.beginPath();
  for(let i=0;i<=24;i++){const a=i/24*Math.PI*2,shape=app.shape||'organic',freq=shape==='spore'?7:shape==='segmented'?3:path==='vegetal'?5:path==='animal'?2:3,amp=shape==='oval'?.018:shape==='spore'?.105:shape==='segmented'?.035:.06,wave=Math.sin(a*freq+pulse+Game.time*2.7)*amp+Math.sin(a*(freq+2)-Game.time*1.8)*.024,rr=r*breathe*(1+wave),px=Math.cos(a)*rr,py=Math.sin(a)*rr;if(i===0)target.moveTo(px,py);else target.lineTo(px,py);}target.closePath();target.fill();target.shadowBlur=0;
  target.strokeStyle='rgba(232,255,249,.55)';target.lineWidth=Math.max(1.5,r*.075+(cell.membrane||0)*.015);target.stroke();AppearanceSystem.drawCellPattern(target,r,app);
  target.fillStyle='rgba(15,42,48,.42)';target.beginPath();target.ellipse(-r*.12,-r*.04,r*.39,r*.32,Math.sin(Game.time*.5)*.08,0,Math.PI*2);target.fill();
  if(nucleus){target.fillStyle='rgba(129,103,198,.88)';target.beginPath();target.arc(-r*.1,-r*.05,r*.17+Math.sin(Game.time*2.4)*.5,0,Math.PI*2);target.fill();}
  if(owned.includes('vacuole')){target.fillStyle='rgba(183,235,239,.24)';for(let i=0;i<3;i++){const a=i/3*Math.PI*2+Game.time*.18;target.beginPath();target.arc(Math.cos(a)*r*.38,Math.sin(a)*r*.30,r*.10,0,Math.PI*2);target.fill();}}
  if(owned.includes('chemoreceptors')){target.strokeStyle='rgba(196,244,232,.62)';target.lineWidth=Math.max(1,r*.045);for(const a of [-.55,.55]){target.beginPath();target.moveTo(r*.7,Math.sin(a)*r*.45);target.quadraticCurveTo(r*1.15,Math.sin(a+Game.time*.8)*r*.65,r*1.35,Math.sin(a+Game.time)*r*.5);target.stroke();}}
  if(owned.includes('phagocytosis')){const mouth=Math.max(.08,.18+Math.sin(Game.time*5)*.04);target.strokeStyle='rgba(18,49,50,.8)';target.lineWidth=Math.max(2,r*.11);target.beginPath();target.arc(r*.47,0,r*.25,-mouth*Math.PI,mouth*Math.PI);target.stroke();}
  if(toxin){target.fillStyle='rgba(255,105,126,.86)';for(let i=0;i<7;i++){const a=i/7*Math.PI*2+Game.time*.38;target.beginPath();target.arc(Math.cos(a)*r*.68,Math.sin(a)*r*.68,Math.max(2,r*.065),0,Math.PI*2);target.fill();}}
  if(flagella){target.strokeStyle='rgba(190,244,230,.68)';target.lineWidth=Math.max(1.5,r*.075);target.beginPath();target.moveTo(-r*.78,0);target.bezierCurveTo(-r*1.25,-r*.55+Math.sin(Game.time*7+pulse)*r*.25,-r*1.75,r*.42,-r*2.35,Math.sin(Game.time*6.4+pulse)*r*.5);target.stroke();}
  target.restore();
};
CellSystem.drawMicrobe=function(target,m,x,y){
  target.save();target.translate(x,y);target.rotate(m.rotation||0);const r=m.radius,breath=1+Math.sin(m.pulse*2.2)*.04;target.scale(1+Math.sin(m.squash)*.035,1-Math.sin(m.squash)*.025);target.shadowColor=m.color;target.shadowBlur=Math.min(22,r*.45);target.fillStyle=m.color;const form=m.form||'blob';target.beginPath();
  if(form==='oval')target.ellipse(0,0,r*1.18,r*.72,0,0,Math.PI*2);
  else if(form==='ring')target.arc(0,0,r*breath,0,Math.PI*2);
  else if(form==='star'||form==='armored'){const spikes=m.spikes||7;for(let i=0;i<=spikes*2;i++){const a=i/(spikes*2)*Math.PI*2,rr=i%2===0?r*(form==='star'?1.18:1.08):r*.76,px=Math.cos(a)*rr,py=Math.sin(a)*rr;if(i===0)target.moveTo(px,py);else target.lineTo(px,py);}target.closePath();}
  else if(form==='segmented')target.ellipse(0,0,r*1.25,r*.68,0,0,Math.PI*2);
  else if(form==='spore'){const lobes=m.lobes||5;for(let i=0;i<=22;i++){const a=i/22*Math.PI*2,rr=r*(.88+.14*Math.sin(a*lobes+m.pulse)),px=Math.cos(a)*rr,py=Math.sin(a)*rr;if(i===0)target.moveTo(px,py);else target.lineTo(px,py);}target.closePath();}
  else{for(let i=0;i<=22;i++){const a=i/22*Math.PI*2,rr=r*breath*(1+.055*Math.sin(a*(m.lobes||4)+m.pulse)),px=Math.cos(a)*rr,py=Math.sin(a)*rr;if(i===0)target.moveTo(px,py);else target.lineTo(px,py);}target.closePath();}
  target.fill();target.shadowBlur=0;target.strokeStyle='rgba(238,255,250,.35)';target.lineWidth=Math.max(1.2,r*.055);target.stroke();
  if(form==='ring'){target.globalCompositeOperation='destination-out';target.beginPath();target.arc(0,0,r*.42,0,Math.PI*2);target.fill();target.globalCompositeOperation='source-over';}
  if(form==='segmented'){target.fillStyle='rgba(22,48,52,.24)';const seg=m.segments||4;for(let i=1;i<seg;i++){const xx=-r*.8+i*(r*1.6/seg);target.fillRect(xx,-r*.62,Math.max(1,r*.045),r*1.24);}}
  if(m.photosynthetic){target.fillStyle='rgba(190,238,100,.75)';for(let i=0;i<4;i++){const a=i/4*Math.PI*2+m.pulse*.12;target.beginPath();target.arc(Math.cos(a)*r*.47,Math.sin(a)*r*.36,Math.max(1.5,r*.08),0,Math.PI*2);target.fill();}}
  if(m.nucleus){target.fillStyle='rgba(39,61,70,.52)';target.beginPath();target.arc(-r*.1,-r*.04,r*.25,0,Math.PI*2);target.fill();}
  if(m.toxin){target.fillStyle='rgba(255,108,128,.78)';for(let i=0;i<5;i++){const a=i/5*Math.PI*2+m.pulse*.2;target.beginPath();target.arc(Math.cos(a)*r*.68,Math.sin(a)*r*.68,Math.max(1.8,r*.06),0,Math.PI*2);target.fill();}}
  if(m.flagella||form==='ciliate'){target.strokeStyle='rgba(206,247,238,.5)';target.lineWidth=Math.max(1,r*.045);if(form==='ciliate'){for(let i=0;i<12;i++){const a=i/12*Math.PI*2;target.beginPath();target.moveTo(Math.cos(a)*r*.86,Math.sin(a)*r*.86);target.lineTo(Math.cos(a)*r*(1.10+Math.sin(m.tailPhase+i)*.04),Math.sin(a)*r*(1.10+Math.sin(m.tailPhase+i)*.04));target.stroke();}}else{target.beginPath();target.moveTo(-r*.82,0);target.bezierCurveTo(-r*1.3,-r*.5+Math.sin(m.tailPhase)*r*.28,-r*1.7,r*.3,-r*2.15,Math.sin(m.tailPhase*1.15)*r*.48);target.stroke();}}
  if(m.state==='hunt'){target.strokeStyle='rgba(255,100,112,.32)';target.lineWidth=2;target.beginPath();target.arc(0,0,r+7+Math.sin(m.pulse*4)*2,0,Math.PI*2);target.stroke();}
  target.restore();
};
CellSystem.drawFood=function(target,p,x,y){
  target.save();target.translate(x,y);target.rotate(p.phase*.22);target.globalAlpha=p.type==='light'?.72:.95;target.fillStyle=p.color;target.strokeStyle=p.color;target.shadowColor=p.color;target.shadowBlur=p.type==='light'||p.type==='dna'?10:4;
  if(p.shape==='crystal'){target.beginPath();target.moveTo(0,-p.r*1.3);target.lineTo(p.r,0);target.lineTo(0,p.r*1.3);target.lineTo(-p.r,0);target.closePath();target.fill();}
  else if(p.shape==='chain'){for(let i=-1;i<=1;i++){target.beginPath();target.arc(i*p.r*.95,Math.sin(p.phase+i)*1.5,p.r*.72,0,Math.PI*2);target.fill();}}
  else if(p.shape==='dna'){target.lineWidth=1.5;for(let i=-2;i<=2;i++){const yy=i*2.4;target.beginPath();target.moveTo(-p.r,yy+Math.sin(p.phase+i)*2);target.lineTo(p.r,yy-Math.sin(p.phase+i)*2);target.stroke();}}
  else{target.beginPath();target.arc(0,0,p.r+Math.sin(p.phase*2)*.55,0,Math.PI*2);target.fill();}
  target.restore();
};
CellSystem.drawRadar=function(){
  const cell=Game.cell,w=142,h=92,x=canvas.width-w-18,y=18;
  ctx.save();ctx.fillStyle='rgba(3,13,18,.72)';ctx.fillRect(x,y,w,h);ctx.strokeStyle='rgba(166,220,211,.18)';ctx.strokeRect(x,y,w,h);
  for(const m of cell.microbes){
    if(m.radius<cell.radius*1.15)continue;
    ctx.fillStyle='rgba(232,101,111,.65)';ctx.fillRect(x+m.x/CellSystem.WORLD_W*w-1,y+m.y/CellSystem.WORLD_H*h-1,2,2);
  }
  ctx.fillStyle='#d8fff0';ctx.beginPath();ctx.arc(x+cell.x/CellSystem.WORLD_W*w,y+cell.y/CellSystem.WORLD_H*h,3,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#9cbeb7';ctx.font='10px system-ui';ctx.fillText('mapa microscópico',x+8,y+h-8);ctx.restore();
};
CellSystem.draw=function(){
  const cell=Game.cell,theme=CellSystem.biomeTheme();
  ctx.fillStyle=theme.water;ctx.fillRect(0,0,canvas.width,canvas.height);
  const grad=ctx.createRadialGradient(canvas.width*.5,canvas.height*.46,30,canvas.width*.5,canvas.height*.46,Math.max(canvas.width,canvas.height)*.75);
  grad.addColorStop(0,'rgba(42,120,125,.2)');grad.addColorStop(.65,'rgba(4,38,47,.08)');grad.addColorStop(1,'rgba(2,10,16,.58)');ctx.fillStyle=grad;ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.save();
  const grid=240,ox=((-cell.camera.x%grid)+grid)%grid,oy=((-cell.camera.y%grid)+grid)%grid;
  ctx.strokeStyle='rgba(150,225,215,.035)';ctx.lineWidth=1;
  for(let x=ox;x<canvas.width;x+=grid){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
  for(let y=oy;y<canvas.height;y+=grid){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
  for(let i=0;i<42;i++){
    const wx=(i*613+Game.seed%1100)%CellSystem.WORLD_W,wy=(i*397+(Game.seed>>4)%800)%CellSystem.WORLD_H;
    if(!CellSystem.visible(wx,wy,50))continue;const s=CellSystem.toScreen(wx,wy);
    ctx.fillStyle='rgba(112,203,194,.035)';ctx.beginPath();ctx.arc(s.x,s.y,12+(i%5)*7,0,Math.PI*2);ctx.fill();
  }

  for(const p of cell.particles){if(!CellSystem.visible(p.x,p.y,12))continue;const s=CellSystem.toScreen(p.x,p.y);CellSystem.drawFood(ctx,p,s.x,s.y);}
  ctx.globalAlpha=1;

  const visibleMicrobes=cell.microbes.filter(m=>CellSystem.visible(m.x,m.y,m.radius)).sort((a,b)=>a.radius-b.radius);
  for(const m of visibleMicrobes){
    const s=CellSystem.toScreen(m.x,m.y);CellSystem.drawMicrobe(ctx,m,s.x,s.y);
  }

  const me=CellSystem.toScreen(cell.x,cell.y),path=CellSystem.path(),base=AppearanceSystem.ensure().cell.primary||(path==='vegetal'?'#70c06f':path==='animal'?'#df9569':'#71c6c0');
  CellSystem.drawBlob(ctx,me.x,me.y,cell.radius,base,cell.pulse,Game.species.mutations.includes('nucleus'),Game.species.mutations.includes('flagellum'),Game.species.mutations.includes('toxin'));
  if(Game.species.mutations.includes('cilia')){
    ctx.strokeStyle='rgba(188,243,228,.58)';ctx.lineWidth=1.4;for(let i=0;i<16;i++){const a=i/16*Math.PI*2;ctx.beginPath();ctx.moveTo(me.x+Math.cos(a)*(cell.radius+2),me.y+Math.sin(a)*(cell.radius+2));ctx.lineTo(me.x+Math.cos(a)*(cell.radius+8),me.y+Math.sin(a)*(cell.radius+8));ctx.stroke();}
  }
  if(Game.species.mutations.includes('chloroplasts')){ctx.fillStyle='#a6e777';for(let i=0;i<6;i++){const a=i/6*Math.PI*2+Game.time*.18;ctx.beginPath();ctx.arc(me.x+Math.cos(a)*cell.radius*.58,me.y+Math.sin(a)*cell.radius*.58,3,0,Math.PI*2);ctx.fill();}}
  for(const e of cell.effects){if(!CellSystem.visible(e.x,e.y,8))continue;const s=CellSystem.toScreen(e.x,e.y);ctx.globalAlpha=clamp(e.ttl/e.max,0,1);ctx.fillStyle=e.color;ctx.beginPath();ctx.arc(s.x,s.y,e.r,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;ctx.restore();

  ctx.save();
  ctx.fillStyle='rgba(3,14,18,.72)';ctx.fillRect(16,16,250,76);
  ctx.fillStyle='#e2f6ef';ctx.font='700 14px system-ui';ctx.fillText(Game.species.name+' • célula',30,39);
  ctx.fillStyle='#9abeb6';ctx.font='12px system-ui';ctx.fillText('DNA '+Math.floor(Game.species.dna)+'   tamanho '+cell.radius.toFixed(1),30,60);
  ctx.fillStyle=cell.hp<35?'#ff8b91':'#97e3bd';ctx.fillText('vida '+Math.max(0,Math.round(cell.hp))+'   energia '+Math.round(cell.energy),30,79);
  ctx.restore();
  CellSystem.drawRadar();
};
CellSystem.drawPortrait=function(target,x,y,size){
  const cell=Game.cell||{membrane:0};const path=CellSystem.path();const base=AppearanceSystem.ensure().cell.primary||(path==='vegetal'?'#70c06f':path==='animal'?'#df9569':'#71c6c0');
  CellSystem.drawBlob(target,x,y,size*.34,base,cell.pulse||0,Game.species?.mutations?.includes('nucleus'),Game.species?.mutations?.includes('flagellum'),Game.species?.mutations?.includes('toxin'));
};
CellSystem.transition=function(){
  const cell=Game.cell,path=CellSystem.path(),appearance=AppearanceSystem.ensure();
  Game.stage='organism';document.body.classList.remove('cell-stage');
  const plant=path==='vegetal';
  const genes=normGenes({
    body:plant?'plant':appearance.animal.body,color:plant?appearance.plant.leaf:appearance.animal.primary,size:.72,
    speed:plant?0:36+(cell.mobility||0)*.28,jump:plant?0:5,swim:plant?0:58+(cell.mobility||0)*.35,
    defense:22+(cell.membrane||0)*.35,vision:20+(cell.sense||0)*.8,feed:plant?10:38+(cell.feeding||0)*.6,
    rootDepth:plant?48+(cell.storage||0)*.5:0,leafArea:plant?44+(cell.photosynthesis||0)*.6:0,
    toxin:cell.toxin||0,intelligence:8+Math.round((cell.complexity||0)*.12)
  });
  Game.species.genes=genes;Game.species.type=plant?'Vegetal':'Aquático';Game.species.lifePath=path;Game.species.generation=1;AppearanceSystem.syncGenes();
  Game.species.history.push('Multicelularidade alcançada. Caminho inicial: '+path+'.');
  WorldSystem.init();WeatherSystem.start();
  Game.player={id:'hero_1',x:D.WORLD_W/2,y:D.WORLD_H/2,hp:genes.hpMax,energy:genes.energyMax,water:genes.waterMax,age:0,alive:true,facing:1,foodCooldown:0,mateCooldown:0,attackCooldown:0};
  for(let tries=0;tries<800;tries++){const x=randi(6,D.WORLD_W-7),y=randi(6,D.WORLD_H-7);if(D.BIOME_ORDER[tile(x,y)]===Game.selectedBiome){Game.player.x=x+.5;Game.player.y=y+.5;break;}}
  Game.lineage.push({id:'g1',name:Game.species.name,generation:1,biome:Game.selectedBiome,parents:['cell_origin'],genes:normGenes(genes),appearance:JSON.parse(JSON.stringify(Game.species.appearance)),note:plant?'Primeiro organismo vegetal multicelular.':'Primeiro organismo animal aquático.'});
  Game.discoveries=new Set([Game.selectedBiome]);setModal(UI.evo,false);
  say(plant?'A linhagem tornou-se um organismo vegetal multicelular.':'A linhagem tornou-se um organismo animal aquático.');UISystem.refresh();
};



WorldSystem.init=function(){
  Game.world={w:D.WORLD_W,h:D.WORLD_H,grid:new Uint8Array(D.WORLD_W*D.WORLD_H),moisture:new Float32Array(D.WORLD_W*D.WORLD_H),height:new Float32Array(D.WORLD_W*D.WORLD_H),fertility:new Float32Array(D.WORLD_W*D.WORLD_H)};
  for(let y=0;y<D.WORLD_H;y++){
    for(let x=0;x<D.WORLD_W;x++){
      const nx=x/D.WORLD_W,ny=y/D.WORLD_H;
      const coast=Math.abs(nx-.52)+Math.abs(ny-.48)*.65;
      const ridge=Math.sin(nx*16+Game.seed*.00001)*.15+Math.cos(ny*21)*.10+Math.sin((nx+ny)*34)*.05;
      const h=clamp(.50+(ny-.5)*.18+ridge+(rand()-.5)*.08,0,1);
      const m=clamp(.55+Math.sin(nx*12)*.12+Math.cos(ny*17)*.12-(ny-.5)*.15+(rand()-.5)*.18,0,1);
      const fert=clamp(.45+m*.4-(h-.5)*.2+(rand()-.5)*.1,0,1);
      let id=Math.floor((ny*D.BIOME_ORDER.length)+((nx>.82)?1:0))%D.BIOME_ORDER.length;
      if(m>.78)id=0;
      if(m<.22 && h>.48)id=1;
      if(ny>.80)id=5;
      if(Math.abs(ny-.57)<.10 && m>.62)id=4;
      if(h>.73 && m>.40)id=2;
      if(nx>.56 && ny>.26 && ny<.78 && m>.56)id=3;
      Game.world.grid[key(x,y)]=id;
      Game.world.height[key(x,y)]=h;
      Game.world.moisture[key(x,y)]=m;
      Game.world.fertility[key(x,y)]=fert;
    }
  }
  this.carveRivers();
  this.seedResources();
};
WorldSystem.carveRivers=function(){
  const rivers=3+randi(0,2);
  for(let r=0;r<rivers;r++){
    let x=randi(5,D.WORLD_W-6), y=0;
    for(let s=0;s<D.WORLD_H;s++){
      const w=2+(r%3);
      for(let yy=-w;yy<=w;yy++)for(let xx=-w;xx<=w;xx++){
        const tx=clamp(x+xx,0,D.WORLD_W-1),ty=clamp(y+yy,0,D.WORLD_H-1);
        if(xx*xx+yy*yy<=w*w)Game.world.moisture[key(tx,ty)]=1;
      }
      x=clamp(x+randi(-2,2),2,D.WORLD_W-3);y++;
    }
  }
};
WorldSystem.seedResources=function(){
  Game.plants=[];Game.animals=[];Game.buildings=[];
  for(let i=0;i<420;i++)this.spawnPlant();
  for(let i=0;i<170;i++)this.spawnAnimal();
};
WorldSystem.spawnPlant=function(){
  const x=randi(2,D.WORLD_W-3),y=randi(2,D.WORLD_H-3),b=D.BIOME_ORDER[tile(x,y)];
  const spec=D.PLANTS[pick(D.BIOMES[b].plants)]||D.PLANTS.graminea;
  Game.plants.push({id:'p_'+Math.random().toString(36).slice(2),x:x+.5,y:y+.5,species:spec.id,age:rand()*80,water:spec.water,growth:spec.growth,energy:rand(),seed:rand()});
};
WorldSystem.spawnAnimal=function(){
  const x=randi(3,D.WORLD_W-4),y=randi(3,D.WORLD_H-4),b=D.BIOME_ORDER[tile(x,y)];
  const sid=pick(D.BIOMES[b].animals);const spec=D.ANIMALS[sid]||D.ANIMALS.capivara;
  const role=spec.role;const genes={body:role==='voador'?'bird':role==='aquático'?'fish':'quadruped',color:spec.color,speed:42*spec.speed,defense:24,vision:spec.vision/2,attack:spec.attack,feed:spec.feed};
  Game.animals.push({id:'a_'+Math.random().toString(36).slice(2),x:x+.5,y:y+.5,species:sid,role,state:'wander',vx:0,vy:0,hunger:rand()*50,thirst:rand()*50,energy:70+rand()*30,age:rand()*100,genes,personality:{aggressive:rand(),curious:rand(),social:rand(),territorial:rand()},cool:rand()*10});
};
BiomeSystem.at=function(x,y){const tx=clamp(Math.floor(x),0,D.WORLD_W-1),ty=clamp(Math.floor(y),0,D.WORLD_H-1);return D.BIOMES[D.BIOME_ORDER[tile(tx,ty)]];};
BiomeSystem.habitat=function(g,x,y){const b=this.at(x,y);const temp=b.temp+WeatherSystem.tempOffset();const heat=g.heat||40,cold=g.cold||40;const tempFit=100-Math.min(100,Math.abs(temp-24)*2.4);const waterFit=clamp((b.water+g.drought-35),0,100);return clamp((tempFit+(waterFit)+((g.speed||0))/3)/2.3,0,100);};
BiomeSystem.discover=function(biomeId){if(Game.discoveries.has(biomeId))return;Game.discoveries.add(biomeId);Game.species.dna+=35;say('Novo bioma descoberto: '+D.BIOMES[biomeId].name+' • +35 DNA');};
EvolutionSystem.newSpecies=function(name,biome){
  const genes=normGenes({body:'cell',color:'#70b9b8',size:.35,speed:16,jump:0,swim:18,vision:8,defense:8});
  Game.species={name:name||'Carijó',type:'Célula primitiva',lifePath:'indefinida',genes,appearance:AppearanceSystem.defaults(),dna:18,biomass:0,stone:0,population:1,generation:0,knowledge:0,culture:0,technology:0,settlementLevel:0,relations:{},inventory:{madeira:0,pedra:0,agua:0,frutas:0,sementes:0,fibras:0,argila:0,minerio:0,carne:0,peixe:0},mutations:[],unlockedTech:[],season:1,foodMemory:0,explored:[],history:['A linhagem começou como uma célula simples. Bioma de destino: '+D.BIOMES[biome].name+'.']};
  AppearanceSystem.syncGenes();
};

EvolutionSystem.mutateChild=function(mother,father){
  const keys=['speed','jump','climb','dig','swim','flight','vision','hearing','smell','perception','hunt','collect','feed','fertility','cold','heat','drought','defense','hpMax','energyMax','waterMax','intelligence','social','build'];
  const child=normGenes();
  for(const k of keys){const a=Number(mother[k]??D.START_GENES[k]??0),b=Number(father[k]??D.START_GENES[k]??0);child[k]=clamp(a*.55+b*.45+(rand()-.5)*Math.max(2,(a+b)*.05),0,200);}
  child.body=rand()<.5?mother.body:father.body;child.color=rand()<.5?mother.color:father.color;child.size=clamp(((mother.size||1)+(father.size||1))/2+(rand()-.5)*.18,.65,1.6);
  if(rand()<.08){const pool=D.MUTATIONS.filter(m=>!Game.species.mutations.includes(m.id));if(pool.length){const m=pick(pool);for(const [k,v] of Object.entries(m.effect))if(typeof v==='number')child[k]=(child[k]||0)+v;child._mutation=m.id;}}
  return child;
};
EvolutionSystem.buy=function(id){const m=D.MUTATIONS.find(x=>x.id===id);if(!m||Game.species.dna<m.cost||Game.species.mutations.includes(id))return false;Game.species.dna-=m.cost;Game.species.mutations.push(id);for(const[k,v]of Object.entries(m.effect)){Game.species.genes[k]=(Game.species.genes[k]||0)+v;}AppearanceSystem.applyMutation(id);AppearanceSystem.syncGenes();Game.species.history.push('Adaptação adquirida: '+m.name);say('Evolução adquirida: '+m.name);return true;};
const PlayerSystem={};
PlayerSystem.update=function(dt){
  const p=Game.player,g=Game.species.genes;if(!p||!p.alive)return;
  if(g.body==='plant'){
    const b=BiomeSystem.at(p.x,p.y);const sun=Math.max(.12,Math.sin((Game.hour/24)*Math.PI));
    p.energy=clamp(p.energy+dt*(.7+sun*(g.leafArea||30)*.018)-dt*.25,0,g.energyMax||100);
    p.water=clamp(p.water+dt*(b.water*.012+(g.rootDepth||0)*.012)-dt*.35,0,g.waterMax||100);
    p.age+=dt*.04;p.foodCooldown-=dt;p.mateCooldown-=dt;p.attackCooldown-=dt;
    if(!Game.discoveries.has(b.id))BiomeSystem.discover(b.id);
    if(p.energy<=0||p.water<=0)p.hp-=dt*1.2;else p.hp=clamp(p.hp+dt*.16,0,g.hpMax||100);
    if(p.hp<=0)this.die();return;
  }
  const ix=(Game.keys.a||Game.keys.ArrowLeft?-1:0)+(Game.keys.d||Game.keys.ArrowRight?1:0);const iy=(Game.keys.w||Game.keys.ArrowUp?-1:0)+(Game.keys.s||Game.keys.ArrowDown?1:0);
  let mx=ix,my=iy;if(mx||my){const len=Math.hypot(mx,my);mx/=len;my/=len;p.facing=mx<0?-1:mx>0?1:p.facing;const biome=BiomeSystem.at(p.x,p.y);const speed=(g.speed||48)/42*D.TILE*dt*biome.movement;p.x=clamp(p.x+mx*speed/D.TILE,.8,D.WORLD_W-.8);p.y=clamp(p.y+my*speed/D.TILE,.8,D.WORLD_H-.8);p.energy=clamp(p.energy-dt*(.5+(g.energyDrain||.035)*20)* (mx||my?1.8:1),0,g.energyMax||100);}
  p.energy=clamp(p.energy-dt*(g.energyDrain||.035)*5,0,g.energyMax||100);p.water=clamp(p.water-dt*(g.waterDrain||.018)*4,0,g.waterMax||100);p.age+=dt*.06;p.foodCooldown-=dt;p.mateCooldown-=dt;p.attackCooldown-=dt;
  const b=BiomeSystem.at(p.x,p.y);if(!Game.discoveries.has(b.id))BiomeSystem.discover(b.id);
  if(p.water<=0)p.hp-=dt*2.2;if(p.energy<=0)p.hp-=dt*1.4;if(p.hp<=0)this.die();
  if(rand()<dt*.08)ResourceSystem.collectNearby();
};
PlayerSystem.die=function(){if(!Game.player.alive)return;Game.player.alive=false;say('Sua linhagem perdeu o indivíduo. Se houver descendentes, você assumirá o próximo.');setTimeout(()=>ReproductionSystem.takeOverDescendant(),900);};
PlayerSystem.eat=function(){if(Game.species.genes.body==='plant'){if(Game.player.foodCooldown>0)return;Game.player.energy=clamp(Game.player.energy+12,0,Game.species.genes.energyMax);Game.player.water=clamp(Game.player.water+10,0,Game.species.genes.waterMax);Game.species.dna+=2;Game.player.foodCooldown=2;say('Fotossíntese e absorção radicular • +2 DNA');return;}if(Game.player.foodCooldown>0)return;const target=ResourceSystem.nearestFood();if(target){const f=D.FOOD.fruta;Game.player.energy=clamp(Game.player.energy+f.energy,0,Game.species.genes.energyMax);Game.player.water=clamp(Game.player.water+f.water,0,Game.species.genes.waterMax);Game.species.dna+=f.dna;Game.species.biomass+=f.biomass;target.growth=Math.max(0,target.growth-18);Game.player.foodCooldown=2.8;spawnFloat('+'+f.energy+' energia',Game.player.x,Game.player.y,'good');}}
PlayerSystem.attack=function(){if(Game.species.genes.body==='plant'){say((Game.species.genes.toxin||0)>0?'A planta libera compostos defensivos.':'Esta linhagem vegetal ainda não possui defesa ativa.');return;}if(Game.player.attackCooldown>0)return;const prey=Game.animals.filter(a=>dist(a,Game.player)<2.0).sort((a,b)=>dist(a,Game.player)-dist(b,Game.player))[0];if(!prey){say('Nenhum animal ao alcance.');return;}const dmg=Math.max(2,(Game.species.genes.speed||40)*.18+(Game.species.genes.defense||20)*.08+randi(2,8));prey.hp=(prey.hp||24)-dmg;Game.player.attackCooldown=1.1;spawnFloat('-'+Math.round(dmg),prey.x,prey.y,'bad');if(prey.hp<=0){const gain=5+Math.floor((D.ANIMALS[prey.species]?.attack||10)/8);Game.species.dna+=gain;Game.species.inventory.carne=(Game.species.inventory.carne||0)+1;say('Caça bem-sucedida • +'+gain+' DNA');Game.animals.splice(Game.animals.indexOf(prey),1);}}
PlantSystem.update=function(dt){
  for(const p of Game.plants){
    const b=BiomeSystem.at(p.x,p.y);const weather=D.WEATHER[Game.weather];const sun=Math.max(0,Math.sin((Game.hour/24)*Math.PI));p.age+=dt*(.2+b.water*.004)*weather.plant; p.water=clamp(p.water+dt*(b.water*.08+weather.water*.02),0,120);p.growth=clamp(p.growth+dt*(b.water/80)*weather.plant*(.35+(Game.world.fertility[key(Math.floor(p.x),Math.floor(p.y))]||.5)),0,160); if(Game.weather==='fire'&&rand()<dt*.015)p.growth-=22;if(p.growth<8&&rand()<dt*.02)p.growth=0; if(p.growth<8&&rand()<dt*.08)p.growth=20+rand()*50;
  }
  while(Game.plants.length<380&&rand()<dt*.12)WorldSystem.spawnPlant();
};
ResourceSystem.nearestFood=function(){
  const px=Game.player.x,py=Game.player.y;let best=null,bestD=2.4;for(const plant of Game.plants){if(plant.growth<25)continue;const d=Math.hypot(px-plant.x,py-plant.y);if(d<bestD){best=plant;bestD=d;}}return best;
};
ResourceSystem.collectNearby=function(){
  const p=Game.player;if(!p)return;for(const plant of Game.plants){if(Math.hypot(p.x-plant.x,p.y-plant.y)<.9&&plant.growth>35&&rand()<.25){Game.species.inventory.frutas=(Game.species.inventory.frutas||0)+1;Game.species.biomass+=1;plant.growth-=18;Game.species.dna+=1;}}
};
AnimalAISystem.update=function(dt){
  const p=Game.player;
  for(let i=Game.animals.length-1;i>=0;i--){
    const a=Game.animals[i];const spec=D.ANIMALS[a.species]||{};a.age+=dt*.04;a.hunger+=dt*(.4+spec.feed*.003);a.thirst+=dt*.28;a.energy=clamp(a.energy-dt*.7,0,100);a.cool-=dt;
    const nearP=dist(a,p);let target=null;let targetD=Infinity;
    if(nearP<Math.min(4,(a.genes.vision||30)/18)){a.state=spec.role==='predador'&&nearP<3?'hunt':(p&&nearP<1.25?'flee':'observe');}
    if(a.hunger>72){let food=Game.plants.find(q=>q.growth>30&&dist(a,q)<2.7);if(food&&dist(a,food)<targetD){target=food;targetD=dist(a,food);a.state='feed';}}
    if(spec.role==='predador'&&p&&nearP<3.0&&a.personality.aggressive>.58){target=p;a.state='hunt';}
    if(!target||targetD>2.7){if(a.cool<=0){a.vx=(rand()-.5)*2;a.vy=(rand()-.5)*2;a.cool=1+rand()*4;}target={x:a.x+a.vx*2,y:a.y+a.vy*2};}
    let mult=0.015*spec.speed; if(a.state==='flee')mult*=1.4;if(a.state==='hunt')mult*=1.25;const dx=target.x-a.x,dy=target.y-a.y,len=Math.hypot(dx,dy)||1;a.x=clamp(a.x+dx/len*mult*dt,.5,D.WORLD_W-.5);a.y=clamp(a.y+dy/len*mult*dt,.5,D.WORLD_H-.5);
    if(a.state==='feed'&&targetD<.7){a.hunger=Math.max(0,a.hunger-26);a.energy=clamp(a.energy+12,0,100);if(target.growth!==undefined)target.growth-=14;}
    if(a.state==='hunt'&&p&&nearP<1.15&&a.cool<=0){p.hp-=Math.max(2,(spec.attack||8)*.07);a.cool=1.2;spawnFloat('-'+Math.round(spec.attack*.07),p.x,p.y,'bad');}
    if(a.hunger>98||a.thirst>98||a.energy<2){if(rand()<dt*.03){Game.animals.splice(i,1);continue;}}
    if(a.age>220&&rand()<dt*.01){Game.animals.splice(i,1);continue;}
    if(nearP<2.6&&a.energy>45&&a.hunger<45&&rand()<dt*.002){ReproductionSystem.spawnWildChild(a);}
  }
  while(Game.animals.length<D.MAX_ACTIVE_ENTITIES*.62&&rand()<dt*.08)WorldSystem.spawnAnimal();
};
ReproductionSystem.spawnWildChild=function(parent){const child=Object.assign({},parent,{id:'a_'+Math.random().toString(36).slice(2),x:parent.x+(rand()-.5),y:parent.y+(rand()-.5),age:0,hunger:10,energy:80});child.genes=normGenes(parent.genes);Game.animals.push(child);};
ReproductionSystem.tryBreed=function(){
  const p=Game.player,g=Game.species.genes;
  if(g.body==='plant'){
    if(p.mateCooldown>0)return;
    if(p.energy<38||p.water<35){say('A planta precisa acumular energia e água antes de produzir sementes.');return;}
    p.energy-=22;p.water-=12;p.mateCooldown=8;Game.species.population+=1;Game.species.dna+=18;Game.species.generation+=1;
    Game.lineage.push({id:'seed_'+Game.lineage.length,name:Game.species.name+' • semente '+Game.species.generation,generation:Game.species.generation,parents:[p.id],genes:normGenes(g),biome:BiomeSystem.at(p.x,p.y).id,note:'Nova geração vegetal por dispersão de sementes.'});
    say('Sementes dispersas • nova geração vegetal • +18 DNA');return true;
  }
  if(p.mateCooldown>0)return;const mate=Game.animals.find(a=>dist(a,p)<1.8&&a.role!=='predador');if(!mate){say('Procure um parceiro compatível próximo.');return;}if(p.energy<30||p.water<25){say('Você precisa de energia e água para reproduzir.');return;}p.energy-=18;p.water-=8;p.mateCooldown=7;const childGenes=EvolutionSystem.mutateChild(g,mate.genes);const child={id:'desc_'+(Game.lineage.length+1),name:Game.species.name+' • '+(Game.lineage.length+1),genes:childGenes,generation:Game.species.generation+1,parents:[Game.player.id,mate.id],bornDay:Game.day};Game.lineage.push(child);Game.species.population+=1;Game.species.dna+=28;Game.species.generation=Math.max(Game.species.generation,child.generation);Game.player=Object.assign({hp:childGenes.hpMax,energy:childGenes.energyMax,water:childGenes.waterMax,age:0,alive:true,facing:1,foodCooldown:0,mateCooldown:0,attackCooldown:0}, {id:child.id,x:p.x+.7,y:p.y+.4});Game.species.genes=childGenes;if(childGenes._mutation){const m=D.MUTATIONS.find(x=>x.id===childGenes._mutation);if(m&&!Game.species.mutations.includes(m.id))Game.species.mutations.push(m.id);say('Nasceu um descendente com mutação: '+(m?m.name:childGenes._mutation));}else say('Nova geração assumida: geração '+child.generation);return true;
};
ReproductionSystem.takeOverDescendant=function(){const child=Game.lineage.slice().reverse().find(x=>x.genes&&!x.taken);if(!child){say('A linhagem acabou. Pressione R para tentar reconstruir a população.');return;}child.taken=true;Game.player={id:child.id,x:Game.player?.x||D.WORLD_W/2,y:Game.player?.y||D.WORLD_H/2,hp:child.genes.hpMax,energy:child.genes.energyMax,water:child.genes.waterMax,age:0,alive:true,facing:1,foodCooldown:0,mateCooldown:0,attackCooldown:0};Game.species.genes=normGenes(child.genes);Game.species.generation=child.generation;say('Você assumiu o controle de '+child.name+'.');};

PopulationSystem.update=function(dt){
  if(!Game.species)return;
  const h=Game.species.genes;const habitat=BiomeSystem.habitat(h,Game.player.x,Game.player.y);const food=Game.species.inventory.frutas+(Game.species.inventory.carne||0)+(Game.species.inventory.peixe||0);
  const birthRate=.0014*(1+(h.fertility||45)/90)*(food>20?1.2:.7);const mortality=.0009*(habitat<45?1.8:1)*(Game.species.population>8?1.1:.85);Game.species.population=Math.max(1,Math.round(Game.species.population+Game.species.population*(birthRate-mortality)*dt));Game.species.knowledge+=dt*(habitat/120);if(Game.species.population>=6&&Game.species.settlementLevel<1){Game.species.settlementLevel=1;Game.species.culture+=12;say('Sua espécie está formando grupos sociais.');}if(Game.species.population>=18&&Game.species.settlementLevel<2&&h.intelligence>35){Game.species.settlementLevel=2;Game.species.culture+=20;say('A linhagem alcançou organização tribal.');}if(Game.species.population>=60&&Game.species.technology>=3){Game.species.settlementLevel=3;say('Uma aldeia permanente começa a surgir.');}
};
BuildingSystem.canBuild=function(b){const inv=Game.species.inventory;return inv.madeira>=b.wood&&inv.pedra>=b.stone&&Game.species.technology>=b.tech;};
BuildingSystem.build=function(id){const b=D.BUILDINGS[id];if(!b)return false;if(!this.canBuild(b)){say('Materiais ou tecnologia insuficientes.');return false;}Game.species.inventory.madeira-=b.wood;Game.species.inventory.pedra-=b.stone;Game.buildings.push({id:id,x:Math.floor(Game.player.x),y:Math.floor(Game.player.y),age:0,integrity:100});Game.species.culture+=4;Game.species.dna+=4;say('Construído: '+b.name);renderBuild();return true;};
TechnologySystem.unlock=function(id){const t=D.TECHNOLOGIES[id];if(!t||Game.species.unlockedTech.includes(id))return false;if(Game.species.dna<t.cost){say('DNA insuficiente para estudar '+t.name+'.');return false;}Game.species.dna-=t.cost;Game.species.unlockedTech.push(id);Game.species.technology=Math.max(Game.species.technology,Game.species.unlockedTech.length);for(const[k,v]of Object.entries(t.effects)){if(k==='culture')Game.species.culture+=v;if(k==='build')Game.species.genes.build=(Game.species.genes.build||0)+v;if(k==='defense')Game.species.genes.defense+=v;if(k==='waterMax')Game.species.genes.waterMax+=v;if(k==='hpMax')Game.species.genes.hpMax+=v;}say('Tecnologia dominada: '+t.name);return true;};
DiplomacySystem.update=function(dt){if(!Game.species)return;for(const id of D.BIOME_ORDER){if(id===Game.selectedBiome)continue;if(Game.species.relations[id]===undefined)Game.species.relations[id]=0;Game.species.relations[id]=clamp(Game.species.relations[id]+(rand()-.5)*dt*.2,-100,100);}};
WeatherSystem.start=function(){Game.weather='clear';Game.weatherTimer=60;};
WeatherSystem.tempOffset=function(){return (D.WEATHER[Game.weather]?.temp)||0;};
WeatherSystem.update=function(dt){Game.weatherTimer-=dt;if(Game.weatherTimer>0)return;const b=BiomeSystem.at(Game.player?.x||0,Game.player?.y||0);const weights=b.weather.map(id=>({v:id,w:id==='clear'?2:1}));Game.weather=D.weightedPick(weights);Game.weatherTimer=D.WEATHER[Game.weather].duration;Game.weatherTicks++;if(Game.weather==='fire'){for(const p of Game.plants){if(Math.random()<.002)p.growth-=30;}}say('Clima: '+D.WEATHER[Game.weather].name);};
TimeSystem.update=function(dt){Game.time+=dt;Game.hour=6+(Game.time/18)%24;const newDay=1+Math.floor(Game.time/300);if(newDay!==Game.day){Game.day=newDay;Game.species.dna+=5;Game.species.history.push('Dia '+Game.day+' concluído.');if(Game.day%4===0)PopulationSystem.update(14);}};
RenderSystem.resize=function(){const r=canvas.getBoundingClientRect();canvas.width=Math.max(560,Math.floor(r.width*devicePixelRatio));canvas.height=Math.max(420,Math.floor(r.height*devicePixelRatio));ctx.imageSmoothingEnabled=false;};
RenderSystem.worldToScreen=function(x,y){const scale=1.8;return{x:canvas.width/2+(x-Game.camera.x)*D.TILE*scale,y:canvas.height/2+(y-Game.camera.y)*D.TILE*scale};};
RenderSystem.drawTile=function(x,y,b){const px=(x-Game.camera.x)*D.TILE*1.8+canvas.width/2,py=(y-Game.camera.y)*D.TILE*1.8+canvas.height/2;const s=D.TILE*1.8+1;const h=Game.world.height[key(x,y)]||.5;ctx.fillStyle=b.base;ctx.fillRect(px,py,s,s);if(h>.72){ctx.fillStyle='rgba(210,230,190,.06)';ctx.fillRect(px,py,s,s*.5);}if(Game.weather==='rain'||Game.weather==='storm'){ctx.fillStyle='rgba(80,150,180,.12)';ctx.fillRect(px,py,s,s);}if(Game.world.moisture[key(x,y)]>.94){ctx.fillStyle='rgba(65,140,180,.5)';ctx.fillRect(px+2,py+2,s-4,s-4);}};
RenderSystem.drawWorld=function(){
  const p=Game.player;if(!p)return;Game.camera.x+=(p.x-Game.camera.x)*.12;Game.camera.y+=(p.y-Game.camera.y)*.12;const z=1.8;const cols=Math.ceil(canvas.width/(D.TILE*z))+4,rows=Math.ceil(canvas.height/(D.TILE*z))+4;const sx=Math.floor(Game.camera.x-cols/2),sy=Math.floor(Game.camera.y-rows/2);ctx.fillStyle='#061009';ctx.fillRect(0,0,canvas.width,canvas.height);
  for(let y=sy;y<sy+rows;y++){if(y<0||y>=D.WORLD_H)continue;for(let x=sx;x<sx+cols;x++){if(x<0||x>=D.WORLD_W)continue;this.drawTile(x,y,BiomeSystem.at(x+.1,y+.1));}}
  for(const b of Game.buildings){if(Math.abs(b.x-p.x)<cols/2&&Math.abs(b.y-p.y)<rows/2){const s=this.worldToScreen(b.x+.5,b.y+.5);drawBuildingSprite(s.x,s.y,b.id);}}
  for(const plant of Game.plants){if(plant.growth<8)continue;if(Math.abs(plant.x-p.x)>cols/2||Math.abs(plant.y-p.y)>rows/2)continue;const s=this.worldToScreen(plant.x,plant.y);const spec=D.PLANTS[plant.species];SP.drawPlant(ctx,s.x,s.y,D.TILE*.7,spec,Game.time*.05);}
  for(const a of Game.animals){if(Math.abs(a.x-p.x)>cols/2||Math.abs(a.y-p.y)>rows/2)continue;const s=this.worldToScreen(a.x,a.y);SP.drawAnimal(ctx,s.x,s.y,D.TILE*.62,D.ANIMALS[a.species],{attack:a.state==='hunt'});}
  const me=this.worldToScreen(p.x,p.y);AppearanceSystem.drawCurrent(ctx,me.x,me.y,D.TILE*.78,{facing:p.facing,shadow:true});
  drawWeatherParticles();drawNightTint();drawFloating();
};
function drawBuildingSprite(x,y,id){ctx.save();ctx.imageSmoothingEnabled=false;const s=D.TILE*.9;const d={shelter:'#8b6948',campfire:'#d88a42',storage:'#9b744b',farm:'#6a9854',fence:'#876b4c',bridge:'#846747',workshop:'#79684e',tower:'#817258',house:'#8e7756',dock:'#657d89'}[id]||'#816';ctx.fillStyle=shadeColor(d,-22);ctx.fillRect(x-s*.35,y-s*.30,s*.7,s*.55);ctx.fillStyle=d;ctx.fillRect(x-s*.3,y-s*.22,s*.6,s*.42);if(id==='campfire')SP.pixelIcon(ctx,x,y-s*.05,15,'#f3b44f','fire');if(id==='farm'){ctx.fillStyle='#99b95d';for(let i=-2;i<=2;i++)ctx.fillRect(x+i*6,y+s*.12,3,7);}ctx.restore();}
function shadeColor(c,d){return c.startsWith('#')?DARK(c,d):c;}function DARK(c,d){const n=parseInt(c.slice(1),16);const r=clamp((n>>16&255)+d,0,255),g=clamp((n>>8&255)+d,0,255),b=clamp((n&255)+d,0,255);return`rgb(${r},${g},${b})`;}
function drawNightTint(){const h=Game.hour;let a=0;if(h<6)a=.34-Math.abs(h-3)*.08;else if(h<8)a=.20-(h-6)*.08;else if(h>18)a=Math.min(.38,(h-18)*.065);if(a>0){ctx.fillStyle=`rgba(5,12,24,${Math.max(0,a)})`;ctx.fillRect(0,0,canvas.width,canvas.height);}}
function drawWeatherParticles(){if(Game.weather==='rain'||Game.weather==='storm'){ctx.save();ctx.strokeStyle='rgba(120,185,220,.34)';ctx.lineWidth=1;for(let i=0;i<70;i++){const x=(i*97+Game.time*180)%canvas.width,y=(i*53+Game.time*270)%canvas.height;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-3,y+11);ctx.stroke();}ctx.restore();}if(Game.weather==='fire'){ctx.save();for(let i=0;i<22;i++){const x=(i*77+Game.time*36)%canvas.width,y=(i*33-Game.time*25)%canvas.height;SP.pixelIcon(ctx,x,y,8,'#db8451','fire');}ctx.restore();}}
function spawnFloat(text,x,y,kind){Game.floating.push({text,x,y,ttl:1.1,kind});if(Game.floating.length>28)Game.floating.shift();}
function drawFloating(){for(let i=Game.floating.length-1;i>=0;i--){const f=Game.floating[i];f.ttl-=.016;const s=RenderSystem.worldToScreen(f.x,f.y);ctx.save();ctx.globalAlpha=Math.max(0,f.ttl);ctx.fillStyle=f.kind==='bad'?'#e07666':'#b9e58d';ctx.font='900 12px monospace';ctx.fillText(f.text,s.x+6,s.y-f.ttl*34);ctx.restore();if(f.ttl<=0)Game.floating.splice(i,1);}}
UISystem.startScreen=function(){const wrap=$('start-biomes');wrap.innerHTML='';D.BIOME_ORDER.forEach((id,i)=>{const b=D.BIOMES[id];const el=document.createElement('button');el.className='biome-choice'+(id===Game.selectedBiome?' selected':'');el.innerHTML=`<span class="biome-icon">${b.icon}</span><strong>${b.name}</strong><small>${b.desc}</small>`;el.onclick=()=>{Game.selectedBiome=id;document.querySelectorAll('.biome-choice').forEach(x=>x.classList.remove('selected'));el.classList.add('selected');};wrap.appendChild(el);});};
UISystem.refresh=function(){if(!Game.species||!Game.player)return;
  if(Game.stage==='cell'){
    const p=Game.player,cell=Game.cell,path=CellSystem.path();
    UI.stageLabel.textContent='ESTÁGIO CELULAR';UI.species.textContent=Game.species.name;UI.type.textContent='CÉLULA • '+path.toUpperCase();UI.generation.textContent='Origem da linhagem';
    UI.dna.textContent=Math.floor(Game.species.dna);UI.biomass.textContent=Math.floor(Game.species.biomass);UI.stone.textContent='—';UI.population.textContent='1';
    UI.hp.textContent=Math.round(p.hp);UI.energy.textContent=Math.round(p.energy);UI.water.textContent=Math.round(p.water);
    UI.barHp.style.width=clamp(p.hp/cell.hpMax*100,0,100)+'%';UI.barEnergy.style.width=clamp(p.energy/cell.energyMax*100,0,100)+'%';UI.barWater.style.width=clamp(p.water/cell.waterMax*100,0,100)+'%';
    UI.speed.textContent=Math.round(cell.mobility);UI.defense.textContent=Math.round(cell.membrane);UI.jump.textContent=Math.round(cell.feeding+cell.photosynthesis);UI.vision.textContent=Math.round(cell.sense);
    UI.polish.innerHTML=`<div class="ph-chip">FASE <b>🦠 CÉLULA</b></div><div class="ph-chip">CAMINHO <b>${path}</b></div><div class="ph-chip">ABSORÇÕES <b>${cell.absorbed}</b></div><div class="ph-chip">COMPLEXIDADE <b>${Math.round(cell.complexity)}%</b></div>`;
    UI.dashboardSubtitle.textContent=`${Game.species.name} • estágio celular`;
    if(UI.controlsHint)UI.controlsHint.textContent='WASD / setas • encoste em alimento e células menores • Q evoluir';
    RenderSystem.drawPortraits();return;
  }
  const g=Game.species.genes,p=Game.player,b=BiomeSystem.at(p.x,p.y);UI.stageLabel.textContent=g.body==='plant'?'ORGANISMO VEGETAL':'ORGANISMO COMPLEXO';UI.species.textContent=Game.species.name;UI.type.textContent=(g.body==='plant'?'VEGETAL':g.body==='fish'?'AQUÁTICO':g.body==='bird'?'VOADOR':'TERRESTRE');UI.generation.textContent='Geração '+Game.species.generation;UI.dna.textContent=Math.floor(Game.species.dna);UI.biomass.textContent=Math.floor(Game.species.biomass);UI.stone.textContent=Game.species.inventory.pedra||0;UI.population.textContent=Game.species.population;UI.hp.textContent=Math.round(p.hp);UI.energy.textContent=Math.round(p.energy);UI.water.textContent=Math.round(p.water);UI.barHp.style.width=clamp(p.hp/g.hpMax*100,0,100)+'%';UI.barEnergy.style.width=clamp(p.energy/g.energyMax*100,0,100)+'%';UI.barWater.style.width=clamp(p.water/g.waterMax*100,0,100)+'%';UI.speed.textContent=Math.round(g.speed);UI.defense.textContent=Math.round(g.defense);UI.jump.textContent=Math.round(g.jump);UI.vision.textContent=Math.round(g.vision);const habitat=Math.round(BiomeSystem.habitat(g,p.x,p.y));UI.polish.innerHTML=`<div class="ph-chip">BIOMA <b>${b.icon} ${b.name}</b></div><div class="ph-chip">CLIMA <b>${D.WEATHER[Game.weather].name}</b></div><div class="ph-chip">DIA <b>${Game.day}</b></div><div class="ph-chip">HABITAT <b>${habitat}%</b></div>`;UI.dashboardSubtitle.textContent=`${Game.species.name} • ${b.name}`;if(UI.controlsHint)UI.controlsHint.textContent=g.body==='plant'?'E absorver • R dispersar sementes • Q evoluir • M mapa • L linhagem':'WASD / setas para mover • E comer • R reproduzir • Q evoluir • B construir • M mapa • L linhagem';RenderSystem.drawPortraits();};
RenderSystem.drawPortraits=function(){if(!Game.species)return;pctx.clearRect(0,0,pcanvas.width,pcanvas.height);evoCtx.clearRect(0,0,evoCanvas.width,evoCanvas.height);pctx.fillStyle='#0a160e';pctx.fillRect(0,0,pcanvas.width,pcanvas.height);evoCtx.fillStyle='#0a160e';evoCtx.fillRect(0,0,evoCanvas.width,evoCanvas.height);if(Game.stage==='cell'){CellSystem.drawPortrait(pctx,80,72,56);CellSystem.drawPortrait(evoCtx,130,110,92);UI.dnaLarge.textContent='DNA: '+Math.floor(Game.species.dna);const cell=Game.cell;const box=$('gene-summary');box.innerHTML=[['mobilidade',cell.mobility],['membrana',cell.membrane],['alimentação',cell.feeding],['fotossíntese',cell.photosynthesis],['sentidos',cell.sense],['complexidade',cell.complexity]].map(([k,v])=>`<div class="gene-pill">${k}<b>${Math.round(v||0)}</b></div>`).join('');return;}AppearanceSystem.syncGenes();AppearanceSystem.drawCurrent(pctx,80,72,56,{facing:1,shadow:false});AppearanceSystem.drawCurrent(evoCtx,130,110,92,{facing:1,shadow:false});UI.dnaLarge.textContent='DNA: '+Math.floor(Game.species.dna);const box=$('gene-summary');box.innerHTML=['speed','defense','vision','heat','cold','drought','fertility','intelligence'].map(k=>`<div class="gene-pill">${k}<b>${Math.round(Game.species.genes[k]||0)}</b></div>`).join('');};
UISystem.renderEvolution=function(){
  Game.evoView=Game.evoView||'adaptations';UI.evoOptions.innerHTML='';
  const switcher=document.createElement('div');switcher.className='evo-switch';switcher.innerHTML=`<button class="${Game.evoView==='adaptations'?'active':''}" data-evo-view="adaptations">🧬 ADAPTAÇÕES</button><button class="${Game.evoView==='appearance'?'active':''}" data-evo-view="appearance">🎨 APARÊNCIA</button>`;UI.evoOptions.appendChild(switcher);
  switcher.querySelectorAll('[data-evo-view]').forEach(b=>b.onclick=()=>{Game.evoView=b.dataset.evoView;UISystem.renderEvolution();});
  if(Game.stage==='cell'){
    UI.evoTitle.textContent='EDITOR EVOLUTIVO • CÉLULA';
    const ownedCount=Game.species.mutations.filter(id=>CellSystem.mutations.some(m=>m.id===id)).length;
    const intro=document.createElement('div');intro.className='cell-evo-path evo-full';
    intro.innerHTML=`<div class='evo-status-main'><div><span class='evo-kicker'>CAMINHO ATUAL</span><strong>${CellSystem.path()}</strong></div><div class='evo-dna-pill'>🧬 ${Math.floor(Game.species.dna)} DNA</div></div><div class='evo-progress-row'><span>${Math.min(ownedCount,5)} / 5 adaptações para avançar</span><i><em style='width:${clamp(ownedCount/5*100,0,100)}%'></em></i></div><p class="evo-editor-note">Mutações mudam o que a célula consegue fazer. Aparência muda o corpo que sua linhagem carrega adiante.</p>`;
    UI.evoOptions.insertBefore(intro,switcher);
    if(Game.evoView==='appearance'){const host=document.createElement('div');host.className='evo-full';UI.evoOptions.appendChild(host);AppearanceSystem.renderEditor('cell',host);RenderSystem.drawPortraits();return;}
    for(const m of CellSystem.mutations){
      const owned=Game.species.mutations.includes(m.id),check=CellSystem.canBuy(m),el=document.createElement('article');
      el.className='evo-option cell-mutation'+(owned?' owned':'')+(!owned&&!check.ok?' locked':'');el.dataset.branch=m.branch;
      const branch=m.branch==='plant'?'vegetal':m.branch==='animal'?'animal':'estrutura',icon=CellSystem.mutationIcon[m.id]||'◌';
      el.innerHTML=`<div class='mutation-head'><span class='mutation-icon'>${icon}</span><div><h3>${m.name}</h3><span class='mutation-branch'>${branch}</span></div></div><p>${m.desc}</p><footer><span class='cost'>🧬 ${m.cost}</span><button class='small-btn' ${owned||!check.ok?'disabled':''}>${owned?'FEITO':check.ok?(m.final?'AVANÇAR':'EVOLUIR'):check.reason}</button></footer>`;
      el.querySelector('button').onclick=()=>{if(CellSystem.buy(m.id)){UISystem.renderEvolution();UISystem.refresh();}};UI.evoOptions.appendChild(el);
    }
    RenderSystem.drawPortraits();return;
  }
  UI.evoTitle.textContent='EDITOR EVOLUTIVO';const g=Game.species.genes,isPlant=g.body==='plant'||Game.species.lifePath==='vegetal';
  const intro=document.createElement('div');intro.className='cell-evo-path evo-full';intro.innerHTML=`<div class='evo-status-main'><div><span class='evo-kicker'>LINHAGEM</span><strong>${isPlant?'vegetal':g.body==='bird'?'voadora':g.body==='quadruped'?'terrestre':'aquática'}</strong></div><div class='evo-dna-pill'>🧬 ${Math.floor(Game.species.dna)} DNA</div></div><p class="evo-editor-note">Você pode redesenhar a espécie, mas novos planos corporais e estruturas só aparecem quando a evolução libera.</p>`;UI.evoOptions.insertBefore(intro,switcher);
  if(Game.evoView==='appearance'){const host=document.createElement('div');host.className='evo-full';UI.evoOptions.appendChild(host);AppearanceSystem.renderEditor(isPlant?'plant':'animal',host);RenderSystem.drawPortraits();return;}
  const pool=D.MUTATIONS.filter(m=>isPlant?(m.group==='planta'||m.group==='defesa'||m.group==='adaptação'):m.group!=='planta');
  for(const m of pool){const owned=Game.species.mutations.includes(m.id);const el=document.createElement('article');el.className='evo-option';const effect=Object.entries(m.effect).filter(([,v])=>typeof v==='number').map(([k,v])=>`${k} ${v>=0?'+':''}${v}`).join(' • ');el.innerHTML=`<h3>${m.name}</h3><p>${m.desc}</p><p>${effect}</p><footer><span class='cost'>🧬 ${m.cost} DNA</span><button class='small-btn' ${owned?'disabled':''}>${owned?'ADQUIRIDA':'ADAPTAR'}</button></footer>`;el.querySelector('button').onclick=()=>{if(EvolutionSystem.buy(m.id)){UISystem.renderEvolution();UISystem.refresh();}};UI.evoOptions.appendChild(el);}
  RenderSystem.drawPortraits();
};
UISystem.renderBuild=function(){UI.buildOptions.innerHTML='';for(const b of Object.values(D.BUILDINGS)){const el=document.createElement('article');el.className='build-option';el.innerHTML=`<h3>${b.name}</h3><p>${b.desc}</p><p>🌲 ${b.wood} • 🪨 ${b.stone} • tecnologia ${b.tech}</p><footer><span class="cost">Construção</span><button class="small-btn">ERGUR</button></footer>`;el.querySelector('button').onclick=()=>BuildingSystem.build(b.id);UI.buildOptions.appendChild(el);}}
function renderBuild(){UISystem.renderBuild();}
UISystem.dashboard=function(tab=Game.activeTab){Game.activeTab=tab;const s=Game.species;let html='';if(Game.stage==='cell'){const cell=Game.cell,path=CellSystem.path();UI.dashboardBody.innerHTML=`<div class="dashboard-grid"><div class="dash-card"><span>Estágio</span><strong>🦠</strong><span>Celular</span></div><div class="dash-card"><span>DNA</span><strong>${Math.floor(s.dna)}</strong></div><div class="dash-card"><span>Adaptações</span><strong>${s.mutations.length}</strong></div><div class="dash-card"><span>Tendência</span><strong>${path}</strong></div></div><div class="dashboard-section" style="margin-top:12px"><h3>Construção da linhagem</h3><p style="color:var(--muted);font-size:10px;line-height:1.7">Sua espécie ainda não é animal nem planta. Fagocitose, toxinas e motilidade empurram a linhagem para estratégias animais; fotossíntese e cloroplastos reforçam a estratégia vegetal. A multicelularidade encerra esta fase.</p></div>`;document.querySelectorAll('.dashboard-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));return;}if(tab==='overview'){html=`<div class="dashboard-grid"><div class="dash-card"><span>Geração</span><strong>${s.generation}</strong></div><div class="dash-card"><span>População</span><strong>${s.population}</strong></div><div class="dash-card"><span>DNA</span><strong>${Math.floor(s.dna)}</strong></div><div class="dash-card"><span>Cultura</span><strong>${Math.floor(s.culture)}</strong></div></div><div class="dashboard-section" style="margin-top:12px"><h3>História recente</h3><div class="event-log">${s.history.slice(-12).reverse().map(x=>`<div>${x}</div>`).join('')}</div></div>`;}else if(tab==='ecology'){const b=BiomeSystem.at(Game.player.x,Game.player.y);html=`<div class="dashboard-grid"><div class="dash-card"><span>Bioma</span><strong>${b.icon}</strong><span>${b.name}</span></div><div class="dash-card"><span>Umidade</span><strong>${b.humidity}%</strong></div><div class="dash-card"><span>Água</span><strong>${b.water}%</strong></div><div class="dash-card"><span>Clima</span><strong>${D.WEATHER[Game.weather].name}</strong></div></div><div class="dashboard-section" style="margin-top:12px"><h3>Relação animal • vegetal</h3><p style="color:var(--muted);font-size:10px;line-height:1.6">Plantas crescem conforme umidade, fertilidade e clima. Herbívoros consomem crescimento vegetal; predadores perseguem presas e a disponibilidade de alimento altera a população. O fogo e a enchente não são apenas dano: reorganizam recursos e território.</p></div>`;}else if(tab==='lineage'){html=`<div class="dashboard-section"><h3>Gerações registradas</h3>${Game.lineage.map((n,i)=>`<div class="lineage-node"><b>G${n.generation||i+1}</b><span>${n.name}</span><small>${n.note||'Descendente'}</small></div>`).join('')}</div>`;}else if(tab==='culture'){html=`<div class="dashboard-grid"><div class="dash-card"><span>Cultura</span><strong>${Math.floor(s.culture)}</strong></div><div class="dash-card"><span>Sociedade</span><strong>${s.settlementLevel<2?'Grupo':s.settlementLevel===2?'Tribo':s.settlementLevel===3?'Aldeia':'Civilização'}</strong></div><div class="dash-card"><span>Conhecimento</span><strong>${Math.floor(s.knowledge)}</strong></div><div class="dash-card"><span>Tecnologia</span><strong>${Math.floor(s.technology)}</strong></div></div><div class="chip-list" style="margin-top:12px">${['Tradições','Símbolos','Arquitetura','Arte','Música','Costumes'].map(x=>`<span class="chip">${x}</span>`).join('')}</div>`;}else if(tab==='technology'){html='<div class="tech-grid">'+Object.values(D.TECHNOLOGIES).map(t=>{const owned=s.unlockedTech.includes(t.id);return `<article class="tech-card"><strong>${t.name}</strong><p>${t.desc}</p><span class="cost">🧬 ${t.cost} DNA</span><button class="small-btn" data-tech="${t.id}" ${owned?'disabled':''}>${owned?'DOMINADA':'ESTUDAR'}</button></article>`;}).join('')+'</div>';}else{html='<div class="codex-grid dashboard-section">'+D.CODEX.slice(0,80).map(r=>`<article class="codex-record"><div class="codex-index">${r.id.slice(-4)}</div><div class="codex-copy"><h3>${r.title}</h3><p>${r.note}</p></div><div class="codex-seal">BIO</div></article>`).join('')+'</div>';}
  UI.dashboardBody.innerHTML=html;document.querySelectorAll('[data-tech]').forEach(b=>b.onclick=()=>{if(TechnologySystem.unlock(b.dataset.tech))UISystem.dashboard('technology');UISystem.refresh();});document.querySelectorAll('.dashboard-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));};
UISystem.map=function(){const w=mapCanvas.width,h=mapCanvas.height;mapCtx.fillStyle='#07110b';mapCtx.fillRect(0,0,w,h);const cw=w/D.WORLD_W,ch=h/D.WORLD_H;for(let y=0;y<D.WORLD_H;y++){for(let x=0;x<D.WORLD_W;x++){const b=D.BIOMES[D.BIOME_ORDER[tile(x,y)]];mapCtx.fillStyle=b.base;mapCtx.fillRect(x*cw,y*ch,Math.ceil(cw)+1,Math.ceil(ch)+1);}}if(Game.player){mapCtx.fillStyle='#fff';mapCtx.beginPath();mapCtx.arc(Game.player.x*cw,Game.player.y*ch,4,0,Math.PI*2);mapCtx.fill();}UI.mapLegend.innerHTML=D.BIOME_ORDER.map(id=>`<span class="legend-pill">${D.BIOMES[id].icon} ${D.BIOMES[id].name}</span>`).join('');setModal(UI.map,true);};
UISystem.lineage=function(){lineageCtx.fillStyle='#07110b';lineageCtx.fillRect(0,0,lineageCanvas.width,lineageCanvas.height);const nodes=Game.lineage.slice(-22);nodes.forEach((n,i)=>{const x=40+(i%7)*125,y=55+Math.floor(i/7)*130;lineageCtx.fillStyle='#14271a';lineageCtx.fillRect(x,y,104,58);lineageCtx.strokeStyle='#3a6540';lineageCtx.strokeRect(x,y,104,58);lineageCtx.fillStyle='#e8f1e3';lineageCtx.font='900 11px monospace';lineageCtx.fillText('G'+n.generation,x+10,y+18);lineageCtx.fillStyle='#8fa58f';lineageCtx.font='9px monospace';lineageCtx.fillText(String(n.name).slice(0,15),x+10,y+35);if(i>0){lineageCtx.strokeStyle='#547657';lineageCtx.beginPath();lineageCtx.moveTo(x-22,y+28);lineageCtx.lineTo(x,y+28);lineageCtx.stroke();}});UI.lineageTree.innerHTML=nodes.slice().reverse().map(n=>`<div class="lineage-node"><b>G${n.generation}</b><span>${n.name}</span><small>${n.note||'Descendente registrado'}</small></div>`).join('');setModal(UI.lineage,true);};
SaveSystem.serialize=function(){const cellSave=Game.stage==='cell'&&Game.cell?Object.assign({},Game.cell,{explored:[...(Game.cell.explored||[])]}):null;const safe={version:D.VERSION,stage:Game.stage,seed:Game.seed,selectedBiome:Game.selectedBiome,species:Game.species,cell:cellSave,player:{x:Game.player.x,y:Game.player.y,hp:Game.player.hp,energy:Game.player.energy,water:Game.player.water,alive:Game.player.alive},weather:Game.weather,weatherTimer:Game.weatherTimer,day:Game.day,hour:Game.hour,discoveries:[...Game.discoveries],buildings:Game.buildings.slice(0,160),lineage:Game.lineage.slice(-120)};return JSON.stringify(safe);};
SaveSystem.save=function(){try{localStorage.setItem('bioevo_save_final',this.serialize());say('Jogo salvo localmente.');}catch(e){say('Não foi possível salvar: '+e.message);}};
SaveSystem.load=function(){try{const raw=localStorage.getItem('bioevo_save_final');if(!raw)return false;const s=JSON.parse(raw);if(!s||!s.species||!s.player)return false;Game.stage=s.stage||'organism';Game.seed=s.seed||Game.seed;Game.selectedBiome=s.selectedBiome||'cerrado';Game.species=s.species;AppearanceSystem.ensure();AppearanceSystem.syncGenes();Game.player=Object.assign(Game.player||{},s.player,{alive:s.player.alive!==false});Game.cell=s.cell||null;if(Game.cell){Game.cell.explored=new Set(Array.isArray(Game.cell.explored)?Game.cell.explored:[]);Game.cell.camera=Game.cell.camera||{x:Game.cell.x,y:Game.cell.y};Game.cell.microbes=(Game.cell.microbes||[]).map(m=>Object.assign({form:'blob',rotation:0,tailPhase:0,squash:0,lobes:4,spikes:7,segments:4,pulse:0,turn:0,cooldown:0,state:'wander'},m));Game.cell.particles=(Game.cell.particles||[]).map(p=>Object.assign({shape:p?.type==='mineral'?'crystal':p?.type==='protein'?'chain':p?.type==='dna'?'dna':'orb',phase:0},p));Game.cell.effects=[];Game.cell.densityTimer=0;}Game.weather=s.weather||'clear';Game.weatherTimer=s.weatherTimer||50;Game.day=s.day||1;Game.hour=s.hour||6;Game.discoveries=new Set(s.discoveries||[]);Game.buildings=s.buildings||[];Game.lineage=s.lineage||[];if(Game.stage==='cell'&&Game.cell){document.body.classList.add('cell-stage');}return true;}catch(e){console.warn(e);return false;}};
UISystem.bind=function(){
  window.addEventListener('resize',RenderSystem.resize);RenderSystem.resize();
  window.addEventListener('keydown',e=>{Game.keys[e.key]=true;const k=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();if(k==='q'){UISystem.renderEvolution();setModal(UI.evo,true);}if(k==='e'){if(Game.stage==='cell')CellSystem.absorb();else PlayerSystem.eat();}if(Game.stage!=='cell'&&k==='b'){UISystem.renderBuild();setModal(UI.build,true);}if(Game.stage!=='cell'&&k==='l')UISystem.lineage();if(Game.stage!=='cell'&&k==='m')UISystem.map();if(Game.stage!=='cell'&&k==='r')ReproductionSystem.tryBreed();if(Game.stage!=='cell'&&k==='f')PlayerSystem.attack();if(k==='escape'){[UI.evo,UI.build,UI.lineage,UI.map].forEach(x=>setModal(x,false));UI.dashboard.classList.add('hidden');}if(k===' '){Game.paused=!Game.paused;say(Game.paused?'Simulação pausada.':'Simulação retomada.');}});window.addEventListener('keyup',e=>{Game.keys[e.key]=false;});
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>setModal($(b.dataset.close),false));document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>Actions.run(b.dataset.action));document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{Game.activeTab=b.dataset.tab;UISystem.dashboard(Game.activeTab);});$('btn-start').onclick=Actions.start;
};
const Actions={run(action){if(action==='pause'){Game.paused=!Game.paused;say(Game.paused?'Simulação pausada.':'Simulação retomada.');}if(action==='evolution'){UISystem.renderEvolution();setModal(UI.evo,true);}if(action==='dashboard'){Game.activeTab='overview';UI.dashboard.classList.remove('hidden');UISystem.dashboard('overview');}if(action==='dashboard-close'){UI.dashboard.classList.add('hidden');}if(action==='save'){SaveSystem.save();}},start(){const name=$('input-species').value.trim()||'Carijó';EvolutionSystem.newSpecies(name,Game.selectedBiome);CellSystem.init();Game.running=true;UI.start.classList.add('hidden');UI.loading.classList.add('hidden');UISystem.refresh();say('A vida começou: '+name+' é agora uma célula simples. Colete DNA e escolha como evoluir.');}};
UISystem.startScreen();UISystem.bind();
function step(dt){if(!Game.running||Game.paused||!Game.player)return;if(Game.stage==='cell'){Game.time+=dt;CellSystem.update(dt);}else{TimeSystem.update(dt);WeatherSystem.update(dt);PlayerSystem.update(dt);PlantSystem.update(dt);AnimalAISystem.update(dt);PopulationSystem.update(dt*.2);DiplomacySystem.update(dt);}Game.autosaveTimer+=dt;if(Game.autosaveTimer>30){Game.autosaveTimer=0;SaveSystem.save();}UISystem.refresh();}
function loop(now){const dt=Math.min(.05,(now-Game.last)/1000);Game.last=now;step(dt);if(Game.stage==='cell'&&Game.cell)CellSystem.draw();else RenderSystem.drawWorld();requestAnimationFrame(loop);}
requestAnimationFrame(loop);
})();
// Diagnostic rule 0001: water
function diagnostic_0001(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0001',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0002: energy
function diagnostic_0002(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0002',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0003: temperature
function diagnostic_0003(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0003',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0004: predation
function diagnostic_0004(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0004',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0005: reproduction
function diagnostic_0005(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0005',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0006: territory
function diagnostic_0006(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0006',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0007: culture
function diagnostic_0007(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0007',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0008: technology
function diagnostic_0008(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0008',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0009: exploration
function diagnostic_0009(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0009',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0010: water
function diagnostic_0010(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0010',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0011: energy
function diagnostic_0011(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0011',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0012: temperature
function diagnostic_0012(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0012',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0013: predation
function diagnostic_0013(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0013',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0014: reproduction
function diagnostic_0014(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0014',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0015: territory
function diagnostic_0015(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0015',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0016: culture
function diagnostic_0016(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0016',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0017: technology
function diagnostic_0017(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0017',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0018: exploration
function diagnostic_0018(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0018',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0019: water
function diagnostic_0019(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0019',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0020: energy
function diagnostic_0020(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0020',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0021: temperature
function diagnostic_0021(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0021',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0022: predation
function diagnostic_0022(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0022',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0023: reproduction
function diagnostic_0023(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0023',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0024: territory
function diagnostic_0024(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0024',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0025: culture
function diagnostic_0025(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0025',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0026: technology
function diagnostic_0026(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0026',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0027: exploration
function diagnostic_0027(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0027',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0028: water
function diagnostic_0028(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0028',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0029: energy
function diagnostic_0029(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0029',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0030: temperature
function diagnostic_0030(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0030',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0031: predation
function diagnostic_0031(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0031',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0032: reproduction
function diagnostic_0032(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0032',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0033: territory
function diagnostic_0033(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0033',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0034: culture
function diagnostic_0034(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0034',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0035: technology
function diagnostic_0035(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0035',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0036: exploration
function diagnostic_0036(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0036',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0037: water
function diagnostic_0037(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0037',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0038: energy
function diagnostic_0038(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0038',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0039: temperature
function diagnostic_0039(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0039',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0040: predation
function diagnostic_0040(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0040',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0041: reproduction
function diagnostic_0041(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0041',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0042: territory
function diagnostic_0042(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0042',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0043: culture
function diagnostic_0043(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0043',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0044: technology
function diagnostic_0044(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0044',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0045: exploration
function diagnostic_0045(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0045',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0046: water
function diagnostic_0046(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0046',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0047: energy
function diagnostic_0047(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0047',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0048: temperature
function diagnostic_0048(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0048',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0049: predation
function diagnostic_0049(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0049',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0050: reproduction
function diagnostic_0050(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0050',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0051: territory
function diagnostic_0051(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0051',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0052: culture
function diagnostic_0052(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0052',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0053: technology
function diagnostic_0053(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0053',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0054: exploration
function diagnostic_0054(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0054',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0055: water
function diagnostic_0055(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0055',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0056: energy
function diagnostic_0056(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0056',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0057: temperature
function diagnostic_0057(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0057',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0058: predation
function diagnostic_0058(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0058',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0059: reproduction
function diagnostic_0059(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0059',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0060: territory
function diagnostic_0060(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0060',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0061: culture
function diagnostic_0061(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0061',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0062: technology
function diagnostic_0062(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0062',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0063: exploration
function diagnostic_0063(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0063',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0064: water
function diagnostic_0064(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0064',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0065: energy
function diagnostic_0065(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0065',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0066: temperature
function diagnostic_0066(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0066',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0067: predation
function diagnostic_0067(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0067',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0068: reproduction
function diagnostic_0068(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0068',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0069: territory
function diagnostic_0069(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0069',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0070: culture
function diagnostic_0070(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0070',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0071: technology
function diagnostic_0071(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0071',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0072: exploration
function diagnostic_0072(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0072',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0073: water
function diagnostic_0073(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0073',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0074: energy
function diagnostic_0074(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0074',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0075: temperature
function diagnostic_0075(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0075',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0076: predation
function diagnostic_0076(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0076',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0077: reproduction
function diagnostic_0077(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0077',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0078: territory
function diagnostic_0078(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0078',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0079: culture
function diagnostic_0079(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0079',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0080: technology
function diagnostic_0080(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0080',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0081: exploration
function diagnostic_0081(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0081',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0082: water
function diagnostic_0082(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0082',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0083: energy
function diagnostic_0083(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0083',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0084: temperature
function diagnostic_0084(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0084',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0085: predation
function diagnostic_0085(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0085',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0086: reproduction
function diagnostic_0086(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0086',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0087: territory
function diagnostic_0087(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0087',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0088: culture
function diagnostic_0088(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0088',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0089: technology
function diagnostic_0089(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0089',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0090: exploration
function diagnostic_0090(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0090',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0091: water
function diagnostic_0091(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0091',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0092: energy
function diagnostic_0092(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0092',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0093: temperature
function diagnostic_0093(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0093',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0094: predation
function diagnostic_0094(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0094',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0095: reproduction
function diagnostic_0095(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0095',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0096: territory
function diagnostic_0096(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0096',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0097: culture
function diagnostic_0097(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0097',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0098: technology
function diagnostic_0098(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0098',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0099: exploration
function diagnostic_0099(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0099',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0100: water
function diagnostic_0100(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0100',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0101: energy
function diagnostic_0101(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0101',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0102: temperature
function diagnostic_0102(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0102',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0103: predation
function diagnostic_0103(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0103',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0104: reproduction
function diagnostic_0104(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0104',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0105: territory
function diagnostic_0105(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0105',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0106: culture
function diagnostic_0106(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0106',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0107: technology
function diagnostic_0107(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0107',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0108: exploration
function diagnostic_0108(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0108',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0109: water
function diagnostic_0109(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0109',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0110: energy
function diagnostic_0110(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0110',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0111: temperature
function diagnostic_0111(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0111',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0112: predation
function diagnostic_0112(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0112',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0113: reproduction
function diagnostic_0113(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0113',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0114: territory
function diagnostic_0114(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0114',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0115: culture
function diagnostic_0115(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0115',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0116: technology
function diagnostic_0116(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0116',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0117: exploration
function diagnostic_0117(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0117',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0118: water
function diagnostic_0118(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0118',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0119: energy
function diagnostic_0119(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0119',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0120: temperature
function diagnostic_0120(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0120',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0121: predation
function diagnostic_0121(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0121',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0122: reproduction
function diagnostic_0122(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0122',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0123: territory
function diagnostic_0123(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0123',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0124: culture
function diagnostic_0124(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0124',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0125: technology
function diagnostic_0125(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0125',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0126: exploration
function diagnostic_0126(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0126',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0127: water
function diagnostic_0127(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0127',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0128: energy
function diagnostic_0128(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0128',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0129: temperature
function diagnostic_0129(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0129',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0130: predation
function diagnostic_0130(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0130',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0131: reproduction
function diagnostic_0131(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0131',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0132: territory
function diagnostic_0132(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0132',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0133: culture
function diagnostic_0133(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0133',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0134: technology
function diagnostic_0134(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0134',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0135: exploration
function diagnostic_0135(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0135',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0136: water
function diagnostic_0136(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0136',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0137: energy
function diagnostic_0137(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0137',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0138: temperature
function diagnostic_0138(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0138',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0139: predation
function diagnostic_0139(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0139',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0140: reproduction
function diagnostic_0140(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0140',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0141: territory
function diagnostic_0141(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0141',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0142: culture
function diagnostic_0142(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0142',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0143: technology
function diagnostic_0143(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0143',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0144: exploration
function diagnostic_0144(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0144',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0145: water
function diagnostic_0145(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0145',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0146: energy
function diagnostic_0146(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0146',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0147: temperature
function diagnostic_0147(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0147',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0148: predation
function diagnostic_0148(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0148',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0149: reproduction
function diagnostic_0149(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0149',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0150: territory
function diagnostic_0150(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0150',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0151: culture
function diagnostic_0151(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0151',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0152: technology
function diagnostic_0152(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0152',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0153: exploration
function diagnostic_0153(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0153',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0154: water
function diagnostic_0154(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0154',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0155: energy
function diagnostic_0155(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0155',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0156: temperature
function diagnostic_0156(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0156',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0157: predation
function diagnostic_0157(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0157',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0158: reproduction
function diagnostic_0158(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0158',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0159: territory
function diagnostic_0159(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0159',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0160: culture
function diagnostic_0160(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0160',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0161: technology
function diagnostic_0161(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0161',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0162: exploration
function diagnostic_0162(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0162',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0163: water
function diagnostic_0163(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0163',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0164: energy
function diagnostic_0164(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0164',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0165: temperature
function diagnostic_0165(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0165',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0166: predation
function diagnostic_0166(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0166',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0167: reproduction
function diagnostic_0167(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0167',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0168: territory
function diagnostic_0168(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0168',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0169: culture
function diagnostic_0169(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0169',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0170: technology
function diagnostic_0170(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0170',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0171: exploration
function diagnostic_0171(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0171',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0172: water
function diagnostic_0172(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0172',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0173: energy
function diagnostic_0173(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0173',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0174: temperature
function diagnostic_0174(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0174',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0175: predation
function diagnostic_0175(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0175',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0176: reproduction
function diagnostic_0176(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0176',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0177: territory
function diagnostic_0177(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0177',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0178: culture
function diagnostic_0178(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0178',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0179: technology
function diagnostic_0179(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0179',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0180: exploration
function diagnostic_0180(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0180',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0181: water
function diagnostic_0181(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0181',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0182: energy
function diagnostic_0182(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0182',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0183: temperature
function diagnostic_0183(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0183',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0184: predation
function diagnostic_0184(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0184',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0185: reproduction
function diagnostic_0185(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0185',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0186: territory
function diagnostic_0186(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0186',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0187: culture
function diagnostic_0187(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0187',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0188: technology
function diagnostic_0188(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0188',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0189: exploration
function diagnostic_0189(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0189',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0190: water
function diagnostic_0190(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0190',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0191: energy
function diagnostic_0191(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0191',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0192: temperature
function diagnostic_0192(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0192',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0193: predation
function diagnostic_0193(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0193',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0194: reproduction
function diagnostic_0194(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0194',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0195: territory
function diagnostic_0195(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0195',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0196: culture
function diagnostic_0196(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0196',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0197: technology
function diagnostic_0197(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0197',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0198: exploration
function diagnostic_0198(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0198',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0199: water
function diagnostic_0199(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0199',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0200: energy
function diagnostic_0200(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0200',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0201: temperature
function diagnostic_0201(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0201',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0202: predation
function diagnostic_0202(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0202',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0203: reproduction
function diagnostic_0203(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0203',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0204: territory
function diagnostic_0204(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0204',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0205: culture
function diagnostic_0205(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0205',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0206: technology
function diagnostic_0206(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0206',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0207: exploration
function diagnostic_0207(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0207',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0208: water
function diagnostic_0208(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0208',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0209: energy
function diagnostic_0209(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0209',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0210: temperature
function diagnostic_0210(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0210',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0211: predation
function diagnostic_0211(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0211',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0212: reproduction
function diagnostic_0212(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0212',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0213: territory
function diagnostic_0213(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0213',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0214: culture
function diagnostic_0214(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0214',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0215: technology
function diagnostic_0215(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0215',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0216: exploration
function diagnostic_0216(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0216',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0217: water
function diagnostic_0217(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0217',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0218: energy
function diagnostic_0218(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0218',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0219: temperature
function diagnostic_0219(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0219',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0220: predation
function diagnostic_0220(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0220',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0221: reproduction
function diagnostic_0221(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0221',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0222: territory
function diagnostic_0222(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0222',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0223: culture
function diagnostic_0223(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0223',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0224: technology
function diagnostic_0224(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0224',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0225: exploration
function diagnostic_0225(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0225',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0226: water
function diagnostic_0226(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0226',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0227: energy
function diagnostic_0227(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0227',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0228: temperature
function diagnostic_0228(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0228',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0229: predation
function diagnostic_0229(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0229',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0230: reproduction
function diagnostic_0230(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0230',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0231: territory
function diagnostic_0231(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0231',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0232: culture
function diagnostic_0232(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0232',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0233: technology
function diagnostic_0233(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0233',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0234: exploration
function diagnostic_0234(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0234',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0235: water
function diagnostic_0235(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0235',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0236: energy
function diagnostic_0236(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0236',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0237: temperature
function diagnostic_0237(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0237',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0238: predation
function diagnostic_0238(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0238',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0239: reproduction
function diagnostic_0239(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0239',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0240: territory
function diagnostic_0240(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0240',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0241: culture
function diagnostic_0241(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0241',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0242: technology
function diagnostic_0242(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0242',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0243: exploration
function diagnostic_0243(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0243',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0244: water
function diagnostic_0244(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0244',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0245: energy
function diagnostic_0245(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0245',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0246: temperature
function diagnostic_0246(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0246',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0247: predation
function diagnostic_0247(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0247',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0248: reproduction
function diagnostic_0248(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0248',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0249: territory
function diagnostic_0249(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0249',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0250: culture
function diagnostic_0250(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0250',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0251: technology
function diagnostic_0251(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0251',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0252: exploration
function diagnostic_0252(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0252',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0253: water
function diagnostic_0253(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0253',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0254: energy
function diagnostic_0254(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0254',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0255: temperature
function diagnostic_0255(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0255',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0256: predation
function diagnostic_0256(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0256',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0257: reproduction
function diagnostic_0257(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0257',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0258: territory
function diagnostic_0258(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0258',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0259: culture
function diagnostic_0259(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0259',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0260: technology
function diagnostic_0260(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0260',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0261: exploration
function diagnostic_0261(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0261',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0262: water
function diagnostic_0262(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0262',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0263: energy
function diagnostic_0263(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0263',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0264: temperature
function diagnostic_0264(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0264',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0265: predation
function diagnostic_0265(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0265',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0266: reproduction
function diagnostic_0266(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0266',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0267: territory
function diagnostic_0267(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0267',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0268: culture
function diagnostic_0268(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0268',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0269: technology
function diagnostic_0269(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0269',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0270: exploration
function diagnostic_0270(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0270',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0271: water
function diagnostic_0271(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0271',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0272: energy
function diagnostic_0272(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0272',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0273: temperature
function diagnostic_0273(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0273',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0274: predation
function diagnostic_0274(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0274',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0275: reproduction
function diagnostic_0275(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0275',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0276: territory
function diagnostic_0276(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0276',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0277: culture
function diagnostic_0277(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0277',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0278: technology
function diagnostic_0278(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0278',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0279: exploration
function diagnostic_0279(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0279',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0280: water
function diagnostic_0280(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0280',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0281: energy
function diagnostic_0281(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0281',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0282: temperature
function diagnostic_0282(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0282',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0283: predation
function diagnostic_0283(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0283',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0284: reproduction
function diagnostic_0284(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0284',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0285: territory
function diagnostic_0285(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0285',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0286: culture
function diagnostic_0286(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0286',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0287: technology
function diagnostic_0287(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0287',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0288: exploration
function diagnostic_0288(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0288',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0289: water
function diagnostic_0289(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0289',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0290: energy
function diagnostic_0290(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0290',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0291: temperature
function diagnostic_0291(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0291',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0292: predation
function diagnostic_0292(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0292',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0293: reproduction
function diagnostic_0293(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0293',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0294: territory
function diagnostic_0294(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0294',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0295: culture
function diagnostic_0295(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0295',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0296: technology
function diagnostic_0296(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0296',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0297: exploration
function diagnostic_0297(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0297',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0298: water
function diagnostic_0298(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0298',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0299: energy
function diagnostic_0299(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0299',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0300: temperature
function diagnostic_0300(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0300',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0301: predation
function diagnostic_0301(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0301',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0302: reproduction
function diagnostic_0302(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0302',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0303: territory
function diagnostic_0303(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0303',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0304: culture
function diagnostic_0304(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0304',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0305: technology
function diagnostic_0305(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0305',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0306: exploration
function diagnostic_0306(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0306',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0307: water
function diagnostic_0307(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0307',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0308: energy
function diagnostic_0308(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0308',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0309: temperature
function diagnostic_0309(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0309',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0310: predation
function diagnostic_0310(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0310',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0311: reproduction
function diagnostic_0311(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0311',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0312: territory
function diagnostic_0312(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0312',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0313: culture
function diagnostic_0313(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0313',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0314: technology
function diagnostic_0314(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0314',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0315: exploration
function diagnostic_0315(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0315',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0316: water
function diagnostic_0316(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0316',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0317: energy
function diagnostic_0317(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0317',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0318: temperature
function diagnostic_0318(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0318',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0319: predation
function diagnostic_0319(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0319',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0320: reproduction
function diagnostic_0320(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0320',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0321: territory
function diagnostic_0321(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0321',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0322: culture
function diagnostic_0322(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0322',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0323: technology
function diagnostic_0323(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0323',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0324: exploration
function diagnostic_0324(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0324',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0325: water
function diagnostic_0325(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0325',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0326: energy
function diagnostic_0326(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0326',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0327: temperature
function diagnostic_0327(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0327',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0328: predation
function diagnostic_0328(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0328',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0329: reproduction
function diagnostic_0329(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0329',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0330: territory
function diagnostic_0330(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0330',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0331: culture
function diagnostic_0331(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0331',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0332: technology
function diagnostic_0332(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0332',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0333: exploration
function diagnostic_0333(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0333',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0334: water
function diagnostic_0334(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0334',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0335: energy
function diagnostic_0335(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0335',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0336: temperature
function diagnostic_0336(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0336',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0337: predation
function diagnostic_0337(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0337',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0338: reproduction
function diagnostic_0338(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0338',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0339: territory
function diagnostic_0339(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0339',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0340: culture
function diagnostic_0340(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0340',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0341: technology
function diagnostic_0341(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0341',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0342: exploration
function diagnostic_0342(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0342',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0343: water
function diagnostic_0343(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0343',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0344: energy
function diagnostic_0344(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0344',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0345: temperature
function diagnostic_0345(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0345',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0346: predation
function diagnostic_0346(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0346',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0347: reproduction
function diagnostic_0347(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0347',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0348: territory
function diagnostic_0348(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0348',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0349: culture
function diagnostic_0349(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0349',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0350: technology
function diagnostic_0350(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0350',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0351: exploration
function diagnostic_0351(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0351',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0352: water
function diagnostic_0352(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0352',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0353: energy
function diagnostic_0353(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0353',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0354: temperature
function diagnostic_0354(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0354',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0355: predation
function diagnostic_0355(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0355',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0356: reproduction
function diagnostic_0356(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0356',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0357: territory
function diagnostic_0357(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0357',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0358: culture
function diagnostic_0358(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0358',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0359: technology
function diagnostic_0359(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0359',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0360: exploration
function diagnostic_0360(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0360',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0361: water
function diagnostic_0361(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0361',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0362: energy
function diagnostic_0362(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0362',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0363: temperature
function diagnostic_0363(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0363',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0364: predation
function diagnostic_0364(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0364',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0365: reproduction
function diagnostic_0365(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0365',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0366: territory
function diagnostic_0366(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0366',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0367: culture
function diagnostic_0367(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0367',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0368: technology
function diagnostic_0368(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0368',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0369: exploration
function diagnostic_0369(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0369',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0370: water
function diagnostic_0370(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0370',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0371: energy
function diagnostic_0371(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0371',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0372: temperature
function diagnostic_0372(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0372',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0373: predation
function diagnostic_0373(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0373',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0374: reproduction
function diagnostic_0374(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0374',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0375: territory
function diagnostic_0375(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0375',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0376: culture
function diagnostic_0376(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0376',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0377: technology
function diagnostic_0377(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0377',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0378: exploration
function diagnostic_0378(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0378',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0379: water
function diagnostic_0379(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0379',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0380: energy
function diagnostic_0380(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0380',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0381: temperature
function diagnostic_0381(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0381',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0382: predation
function diagnostic_0382(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0382',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0383: reproduction
function diagnostic_0383(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0383',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0384: territory
function diagnostic_0384(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0384',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0385: culture
function diagnostic_0385(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0385',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0386: technology
function diagnostic_0386(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0386',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0387: exploration
function diagnostic_0387(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0387',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0388: water
function diagnostic_0388(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0388',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0389: energy
function diagnostic_0389(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0389',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0390: temperature
function diagnostic_0390(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0390',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0391: predation
function diagnostic_0391(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0391',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0392: reproduction
function diagnostic_0392(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0392',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0393: territory
function diagnostic_0393(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0393',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0394: culture
function diagnostic_0394(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0394',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0395: technology
function diagnostic_0395(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0395',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0396: exploration
function diagnostic_0396(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0396',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0397: water
function diagnostic_0397(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0397',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0398: energy
function diagnostic_0398(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0398',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0399: temperature
function diagnostic_0399(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0399',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0400: predation
function diagnostic_0400(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0400',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0401: reproduction
function diagnostic_0401(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0401',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0402: territory
function diagnostic_0402(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0402',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0403: culture
function diagnostic_0403(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0403',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0404: technology
function diagnostic_0404(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0404',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0405: exploration
function diagnostic_0405(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0405',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0406: water
function diagnostic_0406(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0406',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0407: energy
function diagnostic_0407(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0407',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0408: temperature
function diagnostic_0408(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0408',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0409: predation
function diagnostic_0409(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0409',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0410: reproduction
function diagnostic_0410(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0410',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0411: territory
function diagnostic_0411(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0411',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0412: culture
function diagnostic_0412(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0412',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0413: technology
function diagnostic_0413(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0413',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0414: exploration
function diagnostic_0414(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0414',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0415: water
function diagnostic_0415(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0415',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0416: energy
function diagnostic_0416(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0416',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0417: temperature
function diagnostic_0417(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0417',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0418: predation
function diagnostic_0418(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0418',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0419: reproduction
function diagnostic_0419(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0419',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0420: territory
function diagnostic_0420(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0420',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0421: culture
function diagnostic_0421(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0421',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0422: technology
function diagnostic_0422(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0422',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0423: exploration
function diagnostic_0423(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0423',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0424: water
function diagnostic_0424(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0424',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0425: energy
function diagnostic_0425(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0425',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0426: temperature
function diagnostic_0426(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0426',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0427: predation
function diagnostic_0427(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0427',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0428: reproduction
function diagnostic_0428(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0428',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0429: territory
function diagnostic_0429(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0429',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0430: culture
function diagnostic_0430(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0430',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0431: technology
function diagnostic_0431(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0431',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0432: exploration
function diagnostic_0432(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0432',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0433: water
function diagnostic_0433(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0433',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0434: energy
function diagnostic_0434(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0434',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0435: temperature
function diagnostic_0435(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0435',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0436: predation
function diagnostic_0436(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0436',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0437: reproduction
function diagnostic_0437(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0437',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0438: territory
function diagnostic_0438(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0438',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0439: culture
function diagnostic_0439(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0439',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0440: technology
function diagnostic_0440(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0440',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0441: exploration
function diagnostic_0441(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0441',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0442: water
function diagnostic_0442(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0442',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0443: energy
function diagnostic_0443(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0443',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0444: temperature
function diagnostic_0444(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0444',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0445: predation
function diagnostic_0445(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0445',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0446: reproduction
function diagnostic_0446(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0446',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0447: territory
function diagnostic_0447(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0447',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0448: culture
function diagnostic_0448(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0448',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0449: technology
function diagnostic_0449(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0449',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0450: exploration
function diagnostic_0450(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0450',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0451: water
function diagnostic_0451(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0451',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0452: energy
function diagnostic_0452(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0452',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0453: temperature
function diagnostic_0453(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0453',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0454: predation
function diagnostic_0454(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0454',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0455: reproduction
function diagnostic_0455(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0455',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0456: territory
function diagnostic_0456(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0456',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0457: culture
function diagnostic_0457(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0457',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0458: technology
function diagnostic_0458(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0458',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0459: exploration
function diagnostic_0459(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0459',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0460: water
function diagnostic_0460(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0460',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0461: energy
function diagnostic_0461(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0461',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0462: temperature
function diagnostic_0462(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0462',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0463: predation
function diagnostic_0463(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0463',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0464: reproduction
function diagnostic_0464(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0464',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0465: territory
function diagnostic_0465(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0465',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0466: culture
function diagnostic_0466(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0466',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0467: technology
function diagnostic_0467(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0467',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0468: exploration
function diagnostic_0468(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0468',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0469: water
function diagnostic_0469(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0469',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0470: energy
function diagnostic_0470(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0470',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0471: temperature
function diagnostic_0471(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0471',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0472: predation
function diagnostic_0472(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0472',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0473: reproduction
function diagnostic_0473(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0473',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0474: territory
function diagnostic_0474(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0474',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0475: culture
function diagnostic_0475(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0475',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0476: technology
function diagnostic_0476(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0476',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0477: exploration
function diagnostic_0477(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0477',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0478: water
function diagnostic_0478(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0478',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0479: energy
function diagnostic_0479(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0479',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0480: temperature
function diagnostic_0480(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0480',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0481: predation
function diagnostic_0481(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0481',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0482: reproduction
function diagnostic_0482(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0482',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0483: territory
function diagnostic_0483(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0483',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0484: culture
function diagnostic_0484(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0484',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0485: technology
function diagnostic_0485(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0485',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0486: exploration
function diagnostic_0486(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0486',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0487: water
function diagnostic_0487(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0487',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0488: energy
function diagnostic_0488(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0488',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0489: temperature
function diagnostic_0489(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0489',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0490: predation
function diagnostic_0490(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0490',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0491: reproduction
function diagnostic_0491(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0491',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0492: territory
function diagnostic_0492(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0492',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0493: culture
function diagnostic_0493(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0493',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0494: technology
function diagnostic_0494(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0494',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0495: exploration
function diagnostic_0495(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0495',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0496: water
function diagnostic_0496(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0496',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0497: energy
function diagnostic_0497(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0497',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0498: temperature
function diagnostic_0498(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0498',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0499: predation
function diagnostic_0499(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0499',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0500: reproduction
function diagnostic_0500(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0500',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0501: territory
function diagnostic_0501(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0501',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0502: culture
function diagnostic_0502(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0502',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0503: technology
function diagnostic_0503(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0503',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0504: exploration
function diagnostic_0504(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0504',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0505: water
function diagnostic_0505(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0505',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0506: energy
function diagnostic_0506(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0506',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0507: temperature
function diagnostic_0507(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0507',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0508: predation
function diagnostic_0508(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0508',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0509: reproduction
function diagnostic_0509(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0509',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0510: territory
function diagnostic_0510(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0510',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0511: culture
function diagnostic_0511(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0511',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0512: technology
function diagnostic_0512(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0512',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0513: exploration
function diagnostic_0513(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0513',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0514: water
function diagnostic_0514(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0514',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0515: energy
function diagnostic_0515(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0515',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0516: temperature
function diagnostic_0516(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0516',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0517: predation
function diagnostic_0517(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0517',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0518: reproduction
function diagnostic_0518(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0518',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0519: territory
function diagnostic_0519(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0519',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0520: culture
function diagnostic_0520(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0520',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0521: technology
function diagnostic_0521(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0521',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0522: exploration
function diagnostic_0522(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0522',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0523: water
function diagnostic_0523(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0523',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0524: energy
function diagnostic_0524(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0524',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0525: temperature
function diagnostic_0525(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0525',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0526: predation
function diagnostic_0526(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0526',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0527: reproduction
function diagnostic_0527(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0527',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0528: territory
function diagnostic_0528(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0528',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0529: culture
function diagnostic_0529(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0529',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0530: technology
function diagnostic_0530(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0530',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0531: exploration
function diagnostic_0531(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0531',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0532: water
function diagnostic_0532(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0532',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0533: energy
function diagnostic_0533(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0533',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0534: temperature
function diagnostic_0534(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0534',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0535: predation
function diagnostic_0535(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0535',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0536: reproduction
function diagnostic_0536(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0536',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0537: territory
function diagnostic_0537(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0537',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0538: culture
function diagnostic_0538(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0538',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0539: technology
function diagnostic_0539(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0539',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0540: exploration
function diagnostic_0540(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0540',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0541: water
function diagnostic_0541(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0541',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0542: energy
function diagnostic_0542(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0542',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0543: temperature
function diagnostic_0543(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0543',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0544: predation
function diagnostic_0544(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0544',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0545: reproduction
function diagnostic_0545(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0545',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0546: territory
function diagnostic_0546(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0546',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0547: culture
function diagnostic_0547(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0547',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0548: technology
function diagnostic_0548(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0548',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0549: exploration
function diagnostic_0549(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0549',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0550: water
function diagnostic_0550(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0550',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0551: energy
function diagnostic_0551(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0551',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0552: temperature
function diagnostic_0552(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0552',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0553: predation
function diagnostic_0553(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0553',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0554: reproduction
function diagnostic_0554(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0554',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0555: territory
function diagnostic_0555(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0555',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0556: culture
function diagnostic_0556(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0556',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0557: technology
function diagnostic_0557(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0557',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0558: exploration
function diagnostic_0558(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0558',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0559: water
function diagnostic_0559(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0559',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0560: energy
function diagnostic_0560(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0560',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0561: temperature
function diagnostic_0561(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0561',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0562: predation
function diagnostic_0562(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0562',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0563: reproduction
function diagnostic_0563(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0563',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0564: territory
function diagnostic_0564(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0564',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0565: culture
function diagnostic_0565(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0565',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0566: technology
function diagnostic_0566(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0566',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0567: exploration
function diagnostic_0567(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0567',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0568: water
function diagnostic_0568(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0568',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0569: energy
function diagnostic_0569(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0569',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0570: temperature
function diagnostic_0570(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0570',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0571: predation
function diagnostic_0571(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0571',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0572: reproduction
function diagnostic_0572(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0572',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0573: territory
function diagnostic_0573(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0573',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0574: culture
function diagnostic_0574(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0574',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0575: technology
function diagnostic_0575(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0575',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0576: exploration
function diagnostic_0576(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0576',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0577: water
function diagnostic_0577(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0577',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0578: energy
function diagnostic_0578(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0578',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0579: temperature
function diagnostic_0579(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0579',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0580: predation
function diagnostic_0580(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0580',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0581: reproduction
function diagnostic_0581(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0581',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0582: territory
function diagnostic_0582(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0582',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0583: culture
function diagnostic_0583(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0583',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0584: technology
function diagnostic_0584(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0584',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0585: exploration
function diagnostic_0585(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0585',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0586: water
function diagnostic_0586(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0586',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0587: energy
function diagnostic_0587(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0587',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0588: temperature
function diagnostic_0588(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0588',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0589: predation
function diagnostic_0589(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0589',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0590: reproduction
function diagnostic_0590(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0590',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0591: territory
function diagnostic_0591(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0591',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0592: culture
function diagnostic_0592(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0592',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0593: technology
function diagnostic_0593(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0593',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0594: exploration
function diagnostic_0594(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0594',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0595: water
function diagnostic_0595(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0595',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0596: energy
function diagnostic_0596(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0596',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0597: temperature
function diagnostic_0597(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0597',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0598: predation
function diagnostic_0598(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0598',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0599: reproduction
function diagnostic_0599(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0599',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0600: territory
function diagnostic_0600(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0600',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0601: culture
function diagnostic_0601(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0601',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0602: technology
function diagnostic_0602(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0602',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0603: exploration
function diagnostic_0603(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0603',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0604: water
function diagnostic_0604(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0604',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0605: energy
function diagnostic_0605(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0605',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0606: temperature
function diagnostic_0606(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0606',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0607: predation
function diagnostic_0607(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0607',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0608: reproduction
function diagnostic_0608(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0608',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0609: territory
function diagnostic_0609(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0609',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0610: culture
function diagnostic_0610(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0610',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0611: technology
function diagnostic_0611(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0611',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0612: exploration
function diagnostic_0612(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0612',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0613: water
function diagnostic_0613(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0613',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0614: energy
function diagnostic_0614(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0614',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0615: temperature
function diagnostic_0615(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0615',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0616: predation
function diagnostic_0616(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0616',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0617: reproduction
function diagnostic_0617(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0617',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0618: territory
function diagnostic_0618(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0618',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0619: culture
function diagnostic_0619(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0619',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0620: technology
function diagnostic_0620(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0620',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0621: exploration
function diagnostic_0621(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0621',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0622: water
function diagnostic_0622(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0622',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0623: energy
function diagnostic_0623(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0623',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0624: temperature
function diagnostic_0624(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0624',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0625: predation
function diagnostic_0625(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0625',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0626: reproduction
function diagnostic_0626(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0626',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0627: territory
function diagnostic_0627(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0627',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0628: culture
function diagnostic_0628(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0628',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0629: technology
function diagnostic_0629(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0629',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0630: exploration
function diagnostic_0630(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0630',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0631: water
function diagnostic_0631(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0631',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0632: energy
function diagnostic_0632(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0632',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0633: temperature
function diagnostic_0633(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0633',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0634: predation
function diagnostic_0634(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0634',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0635: reproduction
function diagnostic_0635(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0635',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0636: territory
function diagnostic_0636(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0636',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0637: culture
function diagnostic_0637(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0637',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0638: technology
function diagnostic_0638(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0638',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0639: exploration
function diagnostic_0639(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0639',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0640: water
function diagnostic_0640(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0640',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0641: energy
function diagnostic_0641(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0641',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0642: temperature
function diagnostic_0642(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0642',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0643: predation
function diagnostic_0643(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0643',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0644: reproduction
function diagnostic_0644(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0644',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0645: territory
function diagnostic_0645(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0645',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0646: culture
function diagnostic_0646(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0646',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0647: technology
function diagnostic_0647(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0647',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0648: exploration
function diagnostic_0648(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0648',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0649: water
function diagnostic_0649(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0649',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0650: energy
function diagnostic_0650(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0650',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0651: temperature
function diagnostic_0651(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0651',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0652: predation
function diagnostic_0652(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0652',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0653: reproduction
function diagnostic_0653(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0653',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0654: territory
function diagnostic_0654(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0654',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0655: culture
function diagnostic_0655(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0655',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0656: technology
function diagnostic_0656(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0656',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0657: exploration
function diagnostic_0657(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0657',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0658: water
function diagnostic_0658(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0658',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0659: energy
function diagnostic_0659(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0659',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0660: temperature
function diagnostic_0660(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0660',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0661: predation
function diagnostic_0661(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0661',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0662: reproduction
function diagnostic_0662(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0662',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0663: territory
function diagnostic_0663(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0663',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0664: culture
function diagnostic_0664(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0664',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0665: technology
function diagnostic_0665(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0665',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0666: exploration
function diagnostic_0666(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0666',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0667: water
function diagnostic_0667(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0667',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0668: energy
function diagnostic_0668(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0668',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0669: temperature
function diagnostic_0669(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0669',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0670: predation
function diagnostic_0670(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0670',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0671: reproduction
function diagnostic_0671(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0671',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0672: territory
function diagnostic_0672(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0672',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0673: culture
function diagnostic_0673(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0673',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0674: technology
function diagnostic_0674(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0674',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0675: exploration
function diagnostic_0675(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0675',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0676: water
function diagnostic_0676(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0676',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0677: energy
function diagnostic_0677(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0677',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0678: temperature
function diagnostic_0678(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0678',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0679: predation
function diagnostic_0679(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0679',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0680: reproduction
function diagnostic_0680(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0680',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0681: territory
function diagnostic_0681(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0681',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0682: culture
function diagnostic_0682(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0682',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0683: technology
function diagnostic_0683(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0683',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0684: exploration
function diagnostic_0684(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0684',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0685: water
function diagnostic_0685(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0685',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0686: energy
function diagnostic_0686(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0686',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0687: temperature
function diagnostic_0687(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0687',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0688: predation
function diagnostic_0688(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0688',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0689: reproduction
function diagnostic_0689(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0689',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0690: territory
function diagnostic_0690(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(8+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0690',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0691: culture
function diagnostic_0691(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(9+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0691',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0692: technology
function diagnostic_0692(s={}){
  const base=Number(s.technology||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(10+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0692',domain:'technology',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0693: exploration
function diagnostic_0693(s={}){
  const base=Number(s.exploration||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(0+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0693',domain:'exploration',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0694: water
function diagnostic_0694(s={}){
  const base=Number(s.water||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(1+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0694',domain:'water',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0695: energy
function diagnostic_0695(s={}){
  const base=Number(s.energy||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(2+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0695',domain:'energy',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0696: temperature
function diagnostic_0696(s={}){
  const base=Number(s.temperature||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(3+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0696',domain:'temperature',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0697: predation
function diagnostic_0697(s={}){
  const base=Number(s.predation||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(4+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0697',domain:'predation',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0698: reproduction
function diagnostic_0698(s={}){
  const base=Number(s.reproduction||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(5+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0698',domain:'reproduction',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0699: territory
function diagnostic_0699(s={}){
  const base=Number(s.territory||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(6+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0699',domain:'territory',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
// Diagnostic rule 0700: culture
function diagnostic_0700(s={}){
  const base=Number(s.culture||s.dna||s.population||0);
  const habitat=Number(s.habitat||50);
  const pressure=(7+1)*.17;
  const score=Math.max(0,Math.min(100,Math.round(base+habitat*pressure)));
  return {id:'diagnostic_0700',domain:'culture',score,signal:score>70?'favorável':score>40?'estável':'pressionado'};
}
