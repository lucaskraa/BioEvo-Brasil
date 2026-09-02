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
const UI={start:$('start-modal'),loading:$('loading'),toast:$('toast'),species:$('species-name'),type:$('species-type'),generation:$('generation-label'),dna:$('dna'),biomass:$('biomass'),stone:$('stone'),population:$('population'),hp:$('txt-hp'),energy:$('txt-energy'),water:$('txt-water'),barHp:$('bar-hp'),barEnergy:$('bar-energy'),barWater:$('bar-water'),speed:$('stat-speed'),defense:$('stat-defense'),jump:$('stat-jump'),vision:$('stat-vision'),objectiveTitle:$('objective-title'),objectiveDesc:$('objective-desc'),objectiveProgress:$('objective-progress'),log:$('event-log'),evo:$('evolution-modal'),evoOptions:$('evo-options'),dnaLarge:$('dna-large'),build:$('build-modal'),buildOptions:$('build-options'),lineage:$('lineage-modal'),lineageTree:$('lineage-tree'),map:$('map-modal'),mapLegend:$('map-legend'),dashboard:$('dashboard'),dashboardBody:$('dashboard-body'),dashboardSubtitle:$('dashboard-subtitle'),polish:$('polish-hud')};
const Game={running:false,paused:false,last:performance.now(),time:0,day:1,hour:6,seed:Math.floor(Math.random()*1e9),selectedBiome:'cerrado',mouse:{x:0,y:0,down:false},keys:{},camera:{x:0,y:0,zoom:1},world:{},player:null,species:null,nearby:[],plants:[],animals:[],buildings:[],particles:[],floating:[],lineage:[],discoveries:new Set(),weather:'clear',weatherTimer:0,weatherTicks:0,objective:null,activeTab:'overview',autosaveTimer:0};
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
  const genes=normGenes({body:'quadruped',color:['#799c53','#b47b52','#6594a6','#9e8b54'][randi(0,3)],size:1.0,speed:48,jump:18,vision:52});
  Game.species={name:name||'Carijó',type:'Terrestre',genes,dna:120,biomass:12,stone:28,population:1,generation:1,knowledge:0,culture:0,technology:0,settlementLevel:0,relations:{},inventory:{madeira:30,pedra:28,agua:55,frutas:24,sementes:14,fibras:12,argila:5,minerio:0,carne:4,peixe:0},mutations:[],unlockedTech:['stone'],season:1,foodMemory:0,explored:[],history:['A linhagem nasceu em '+D.BIOMES[biome].name+'.']};
  Game.player={id:'hero_1',x:D.WORLD_W/2,y:D.WORLD_H/2,hp:genes.hpMax,energy:genes.energyMax,water:genes.waterMax,age:0,alive:true,facing:1,foodCooldown:0,mateCooldown:0,attackCooldown:0};
  // relocate player to a matching tile
  for(let tries=0;tries<800;tries++){const x=randi(6,D.WORLD_W-7),y=randi(6,D.WORLD_H-7);if(D.BIOME_ORDER[tile(x,y)]===biome){Game.player.x=x+.5;Game.player.y=y+.5;break;}}
  Game.lineage=[{id:'g1',name:Game.species.name,generation:1,biome,parents:[],note:'Fundação da linhagem.'}];
  Game.discoveries=new Set([biome]);
};
EvolutionSystem.mutateChild=function(mother,father){
  const keys=['speed','jump','climb','dig','swim','flight','vision','hearing','smell','perception','hunt','collect','feed','fertility','cold','heat','drought','defense','hpMax','energyMax','waterMax','intelligence','social','build'];
  const child=normGenes();
  for(const k of keys){const a=Number(mother[k]??D.START_GENES[k]??0),b=Number(father[k]??D.START_GENES[k]??0);child[k]=clamp(a*.55+b*.45+(rand()-.5)*Math.max(2,(a+b)*.05),0,200);}
  child.body=rand()<.5?mother.body:father.body;child.color=rand()<.5?mother.color:father.color;child.size=clamp(((mother.size||1)+(father.size||1))/2+(rand()-.5)*.18,.65,1.6);
  if(rand()<.08){const pool=D.MUTATIONS.filter(m=>!Game.species.mutations.includes(m.id));if(pool.length){const m=pick(pool);for(const [k,v] of Object.entries(m.effect))if(typeof v==='number')child[k]=(child[k]||0)+v;child._mutation=m.id;}}
  return child;
};
EvolutionSystem.buy=function(id){const m=D.MUTATIONS.find(x=>x.id===id);if(!m||Game.species.dna<m.cost||Game.species.mutations.includes(id))return false;Game.species.dna-=m.cost;Game.species.mutations.push(id);for(const[k,v]of Object.entries(m.effect)){Game.species.genes[k]=(Game.species.genes[k]||0)+v;}Game.species.history.push('Adaptação adquirida: '+m.name);say('Evolução adquirida: '+m.name);return true;};
PlayerSystem={};
PlayerSystem.update=function(dt){
  const p=Game.player,g=Game.species.genes;if(!p||!p.alive)return;
  const ix=(Game.keys.a||Game.keys.ArrowLeft?-1:0)+(Game.keys.d||Game.keys.ArrowRight?1:0);const iy=(Game.keys.w||Game.keys.ArrowUp?-1:0)+(Game.keys.s||Game.keys.ArrowDown?1:0);
  let mx=ix,my=iy;if(mx||my){const len=Math.hypot(mx,my);mx/=len;my/=len;p.facing=mx<0?-1:mx>0?1:p.facing;const biome=BiomeSystem.at(p.x,p.y);const speed=(g.speed||48)/42*D.TILE*dt*biome.movement;p.x=clamp(p.x+mx*speed/D.TILE,.8,D.WORLD_W-.8);p.y=clamp(p.y+my*speed/D.TILE,.8,D.WORLD_H-.8);p.energy=clamp(p.energy-dt*(.5+(g.energyDrain||.035)*20)* (mx||my?1.8:1),0,g.energyMax||100);}
  p.energy=clamp(p.energy-dt*(g.energyDrain||.035)*5,0,g.energyMax||100);p.water=clamp(p.water-dt*(g.waterDrain||.018)*4,0,g.waterMax||100);p.age+=dt*.06;p.foodCooldown-=dt;p.mateCooldown-=dt;p.attackCooldown-=dt;
  const b=BiomeSystem.at(p.x,p.y);if(!Game.discoveries.has(b.id))BiomeSystem.discover(b.id);
  if(p.water<=0)p.hp-=dt*2.2;if(p.energy<=0)p.hp-=dt*1.4;if(p.hp<=0)this.die();
  if(rand()<dt*.08)ResourceSystem.collectNearby();
};
PlayerSystem.die=function(){if(!Game.player.alive)return;Game.player.alive=false;say('Sua linhagem perdeu o indivíduo. Se houver descendentes, você assumirá o próximo.');setTimeout(()=>ReproductionSystem.takeOverDescendant(),900);};
PlayerSystem.eat=function(){if(Game.player.foodCooldown>0)return;const target=ResourceSystem.nearestFood();if(target){const f=D.FOOD.fruta;Game.player.energy=clamp(Game.player.energy+f.energy,0,Game.species.genes.energyMax);Game.player.water=clamp(Game.player.water+f.water,0,Game.species.genes.waterMax);Game.species.dna+=f.dna;Game.species.biomass+=f.biomass;target.growth=Math.max(0,target.growth-18);Game.player.foodCooldown=2.8;spawnFloat('+'+f.energy+' energia',Game.player.x,Game.player.y,'good');}}
PlayerSystem.attack=function(){if(Game.player.attackCooldown>0)return;const prey=Game.animals.filter(a=>dist(a,Game.player)<2.0).sort((a,b)=>dist(a,Game.player)-dist(b,Game.player))[0];if(!prey){say('Nenhum animal ao alcance.');return;}const dmg=Math.max(2,(Game.species.genes.speed||40)*.18+(Game.species.genes.defense||20)*.08+randi(2,8));prey.hp=(prey.hp||24)-dmg;Game.player.attackCooldown=1.1;spawnFloat('-'+Math.round(dmg),prey.x,prey.y,'bad');if(prey.hp<=0){const gain=5+Math.floor((D.ANIMALS[prey.species]?.attack||10)/8);Game.species.dna+=gain;Game.species.inventory.carne=(Game.species.inventory.carne||0)+1;say('Caça bem-sucedida • +'+gain+' DNA');Game.animals.splice(Game.animals.indexOf(prey),1);}}
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
  const p=Game.player,g=Game.species.genes;if(p.mateCooldown>0)return;const mate=Game.animals.find(a=>dist(a,p)<1.8&&a.role!=='predador');if(!mate){say('Procure um parceiro compatível próximo.');return;}if(p.energy<30||p.water<25){say('Você precisa de energia e água para reproduzir.');return;}p.energy-=18;p.water-=8;p.mateCooldown=7;const childGenes=EvolutionSystem.mutateChild(g,mate.genes);const child={id:'desc_'+(Game.lineage.length+1),name:Game.species.name+' • '+(Game.lineage.length+1),genes:childGenes,generation:Game.species.generation+1,parents:[Game.player.id,mate.id],bornDay:Game.day};Game.lineage.push(child);Game.species.population+=1;Game.species.dna+=28;Game.species.generation=Math.max(Game.species.generation,child.generation);Game.player=Object.assign({hp:childGenes.hpMax,energy:childGenes.energyMax,water:childGenes.waterMax,age:0,alive:true,facing:1,foodCooldown:0,mateCooldown:0,attackCooldown:0}, {id:child.id,x:p.x+.7,y:p.y+.4});Game.species.genes=childGenes;if(childGenes._mutation){const m=D.MUTATIONS.find(x=>x.id===childGenes._mutation);if(m&&!Game.species.mutations.includes(m.id))Game.species.mutations.push(m.id);say('Nasceu um descendente com mutação: '+(m?m.name:childGenes._mutation));}else say('Nova geração assumida: geração '+child.generation);return true;
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
  const me=this.worldToScreen(p.x,p.y);SP.drawPlayer(ctx,me.x,me.y,D.TILE*.78,Game.species.genes,{facing:p.facing,shadow:true});
  drawWeatherParticles();drawNightTint();drawFloating();
};
function drawBuildingSprite(x,y,id){ctx.save();ctx.imageSmoothingEnabled=false;const s=D.TILE*.9;const d={shelter:'#8b6948',campfire:'#d88a42',storage:'#9b744b',farm:'#6a9854',fence:'#876b4c',bridge:'#846747',workshop:'#79684e',tower:'#817258',house:'#8e7756',dock:'#657d89'}[id]||'#816';ctx.fillStyle=shadeColor(d,-22);ctx.fillRect(x-s*.35,y-s*.30,s*.7,s*.55);ctx.fillStyle=d;ctx.fillRect(x-s*.3,y-s*.22,s*.6,s*.42);if(id==='campfire')SP.pixelIcon(ctx,x,y-s*.05,15,'#f3b44f','fire');if(id==='farm'){ctx.fillStyle='#99b95d';for(let i=-2;i<=2;i++)ctx.fillRect(x+i*6,y+s*.12,3,7);}ctx.restore();}
function shadeColor(c,d){return c.startsWith('#')?DARK(c,d):c;}function DARK(c,d){const n=parseInt(c.slice(1),16);const r=clamp((n>>16&255)+d,0,255),g=clamp((n>>8&255)+d,0,255),b=clamp((n&255)+d,0,255);return`rgb(${r},${g},${b})`;}
function drawNightTint(){const h=Game.hour;let a=0;if(h<6)a=.34-Math.abs(h-3)*.08;else if(h<8)a=.20-(h-6)*.08;else if(h>18)a=Math.min(.38,(h-18)*.065);if(a>0){ctx.fillStyle=`rgba(5,12,24,${Math.max(0,a)})`;ctx.fillRect(0,0,canvas.width,canvas.height);}}
function drawWeatherParticles(){if(Game.weather==='rain'||Game.weather==='storm'){ctx.save();ctx.strokeStyle='rgba(120,185,220,.34)';ctx.lineWidth=1;for(let i=0;i<70;i++){const x=(i*97+Game.time*180)%canvas.width,y=(i*53+Game.time*270)%canvas.height;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-3,y+11);ctx.stroke();}ctx.restore();}if(Game.weather==='fire'){ctx.save();for(let i=0;i<22;i++){const x=(i*77+Game.time*36)%canvas.width,y=(i*33-Game.time*25)%canvas.height;SP.pixelIcon(ctx,x,y,8,'#db8451','fire');}ctx.restore();}}
function spawnFloat(text,x,y,kind){Game.floating.push({text,x,y,ttl:1.1,kind});if(Game.floating.length>28)Game.floating.shift();}
function drawFloating(){for(let i=Game.floating.length-1;i>=0;i--){const f=Game.floating[i];f.ttl-=.016;const s=RenderSystem.worldToScreen(f.x,f.y);ctx.save();ctx.globalAlpha=Math.max(0,f.ttl);ctx.fillStyle=f.kind==='bad'?'#e07666':'#b9e58d';ctx.font='900 12px monospace';ctx.fillText(f.text,s.x+6,s.y-f.ttl*34);ctx.restore();if(f.ttl<=0)Game.floating.splice(i,1);}}
UISystem.startScreen=function(){const wrap=$('start-biomes');wrap.innerHTML='';D.BIOME_ORDER.forEach((id,i)=>{const b=D.BIOMES[id];const el=document.createElement('button');el.className='biome-choice'+(id===Game.selectedBiome?' selected':'');el.innerHTML=`<span class="biome-icon">${b.icon}</span><strong>${b.name}</strong><small>${b.desc}</small>`;el.onclick=()=>{Game.selectedBiome=id;document.querySelectorAll('.biome-choice').forEach(x=>x.classList.remove('selected'));el.classList.add('selected');};wrap.appendChild(el);});};
UISystem.refresh=function(){if(!Game.species||!Game.player)return;const g=Game.species.genes,p=Game.player,b=BiomeSystem.at(p.x,p.y);UI.species.textContent=Game.species.name;UI.type.textContent=(g.body==='fish'?'AQUÁTICO':g.body==='bird'?'VOADOR':'TERRESTRE');UI.generation.textContent='Geração '+Game.species.generation;UI.dna.textContent=Math.floor(Game.species.dna);UI.biomass.textContent=Math.floor(Game.species.biomass);UI.stone.textContent=Game.species.inventory.pedra||0;UI.population.textContent=Game.species.population;UI.hp.textContent=Math.round(p.hp);UI.energy.textContent=Math.round(p.energy);UI.water.textContent=Math.round(p.water);UI.barHp.style.width=clamp(p.hp/g.hpMax*100,0,100)+'%';UI.barEnergy.style.width=clamp(p.energy/g.energyMax*100,0,100)+'%';UI.barWater.style.width=clamp(p.water/g.waterMax*100,0,100)+'%';UI.speed.textContent=Math.round(g.speed);UI.defense.textContent=Math.round(g.defense);UI.jump.textContent=Math.round(g.jump);UI.vision.textContent=Math.round(g.vision);const habitat=Math.round(BiomeSystem.habitat(g,p.x,p.y));UI.polish.innerHTML=`<div class="ph-chip">BIOMA <b>${b.icon} ${b.name}</b></div><div class="ph-chip">CLIMA <b>${D.WEATHER[Game.weather].name}</b></div><div class="ph-chip">DIA <b>${Game.day}</b></div><div class="ph-chip">HABITAT <b>${habitat}%</b></div>`;UI.dashboardSubtitle.textContent=`${Game.species.name} • ${b.name}`;RenderSystem.drawPortraits();};
RenderSystem.drawPortraits=function(){if(!Game.species)return;pctx.clearRect(0,0,pcanvas.width,pcanvas.height);evoCtx.clearRect(0,0,evoCanvas.width,evoCanvas.height);pctx.fillStyle='#0a160e';pctx.fillRect(0,0,pcanvas.width,pcanvas.height);evoCtx.fillStyle='#0a160e';evoCtx.fillRect(0,0,evoCanvas.width,evoCanvas.height);SP.drawPlayer(pctx,80,72,56,Game.species.genes,{facing:1});SP.drawPlayer(evoCtx,130,110,92,Game.species.genes,{facing:1});UI.dnaLarge.textContent='DNA: '+Math.floor(Game.species.dna);const box=$('gene-summary');box.innerHTML=['speed','defense','vision','heat','cold','drought','fertility','intelligence'].map(k=>`<div class="gene-pill">${k}<b>${Math.round(Game.species.genes[k]||0)}</b></div>`).join('');};
UISystem.renderEvolution=function(){const g=Game.species.genes;UI.evoOptions.innerHTML='';for(const m of D.MUTATIONS){const owned=Game.species.mutations.includes(m.id);const el=document.createElement('article');el.className='evo-option';const effect=Object.entries(m.effect).filter(([,v])=>typeof v==='number').map(([k,v])=>`${k} ${v>=0?'+':''}${v}`).join(' • ');el.innerHTML=`<h3>${m.name}</h3><p>${m.desc}</p><p>${effect}</p><footer><span class="cost">🧬 ${m.cost} DNA</span><button class="small-btn" ${owned?'disabled':''}>${owned?'ADQUIRIDA':'ADAPTAR'}</button></footer>`;el.querySelector('button').onclick=()=>{if(EvolutionSystem.buy(m.id)){UISystem.renderEvolution();UISystem.refresh();}};UI.evoOptions.appendChild(el);}}
UISystem.renderBuild=function(){UI.buildOptions.innerHTML='';for(const b of Object.values(D.BUILDINGS)){const el=document.createElement('article');el.className='build-option';el.innerHTML=`<h3>${b.name}</h3><p>${b.desc}</p><p>🌲 ${b.wood} • 🪨 ${b.stone} • tecnologia ${b.tech}</p><footer><span class="cost">Construção</span><button class="small-btn">ERGUR</button></footer>`;el.querySelector('button').onclick=()=>BuildingSystem.build(b.id);UI.buildOptions.appendChild(el);}}
function renderBuild(){UISystem.renderBuild();}
UISystem.dashboard=function(tab=Game.activeTab){Game.activeTab=tab;const s=Game.species;let html='';if(tab==='overview'){html=`<div class="dashboard-grid"><div class="dash-card"><span>Geração</span><strong>${s.generation}</strong></div><div class="dash-card"><span>População</span><strong>${s.population}</strong></div><div class="dash-card"><span>DNA</span><strong>${Math.floor(s.dna)}</strong></div><div class="dash-card"><span>Cultura</span><strong>${Math.floor(s.culture)}</strong></div></div><div class="dashboard-section" style="margin-top:12px"><h3>História recente</h3><div class="event-log">${s.history.slice(-12).reverse().map(x=>`<div>${x}</div>`).join('')}</div></div>`;}else if(tab==='ecology'){const b=BiomeSystem.at(Game.player.x,Game.player.y);html=`<div class="dashboard-grid"><div class="dash-card"><span>Bioma</span><strong>${b.icon}</strong><span>${b.name}</span></div><div class="dash-card"><span>Umidade</span><strong>${b.humidity}%</strong></div><div class="dash-card"><span>Água</span><strong>${b.water}%</strong></div><div class="dash-card"><span>Clima</span><strong>${D.WEATHER[Game.weather].name}</strong></div></div><div class="dashboard-section" style="margin-top:12px"><h3>Relação animal • vegetal</h3><p style="color:var(--muted);font-size:10px;line-height:1.6">Plantas crescem conforme umidade, fertilidade e clima. Herbívoros consomem crescimento vegetal; predadores perseguem presas e a disponibilidade de alimento altera a população. O fogo e a enchente não são apenas dano: reorganizam recursos e território.</p></div>`;}else if(tab==='lineage'){html=`<div class="dashboard-section"><h3>Gerações registradas</h3>${Game.lineage.map((n,i)=>`<div class="lineage-node"><b>G${n.generation||i+1}</b><span>${n.name}</span><small>${n.note||'Descendente'}</small></div>`).join('')}</div>`;}else if(tab==='culture'){html=`<div class="dashboard-grid"><div class="dash-card"><span>Cultura</span><strong>${Math.floor(s.culture)}</strong></div><div class="dash-card"><span>Sociedade</span><strong>${s.settlementLevel<2?'Grupo':s.settlementLevel===2?'Tribo':s.settlementLevel===3?'Aldeia':'Civilização'}</strong></div><div class="dash-card"><span>Conhecimento</span><strong>${Math.floor(s.knowledge)}</strong></div><div class="dash-card"><span>Tecnologia</span><strong>${Math.floor(s.technology)}</strong></div></div><div class="chip-list" style="margin-top:12px">${['Tradições','Símbolos','Arquitetura','Arte','Música','Costumes'].map(x=>`<span class="chip">${x}</span>`).join('')}</div>`;}else if(tab==='technology'){html='<div class="tech-grid">'+Object.values(D.TECHNOLOGIES).map(t=>{const owned=s.unlockedTech.includes(t.id);return `<article class="tech-card"><strong>${t.name}</strong><p>${t.desc}</p><span class="cost">🧬 ${t.cost} DNA</span><button class="small-btn" data-tech="${t.id}" ${owned?'disabled':''}>${owned?'DOMINADA':'ESTUDAR'}</button></article>`;}).join('')+'</div>';}else{html='<div class="codex-grid dashboard-section">'+D.CODEX.slice(0,80).map(r=>`<article class="codex-record"><div class="codex-index">${r.id.slice(-4)}</div><div class="codex-copy"><h3>${r.title}</h3><p>${r.note}</p></div><div class="codex-seal">BIO</div></article>`).join('')+'</div>';}
  UI.dashboardBody.innerHTML=html;document.querySelectorAll('[data-tech]').forEach(b=>b.onclick=()=>{if(TechnologySystem.unlock(b.dataset.tech))UISystem.dashboard('technology');UISystem.refresh();});document.querySelectorAll('.dashboard-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));};
UISystem.map=function(){const w=mapCanvas.width,h=mapCanvas.height;mapCtx.fillStyle='#07110b';mapCtx.fillRect(0,0,w,h);const cw=w/D.WORLD_W,ch=h/D.WORLD_H;for(let y=0;y<D.WORLD_H;y++){for(let x=0;x<D.WORLD_W;x++){const b=D.BIOMES[D.BIOME_ORDER[tile(x,y)]];mapCtx.fillStyle=b.base;mapCtx.fillRect(x*cw,y*ch,Math.ceil(cw)+1,Math.ceil(ch)+1);}}if(Game.player){mapCtx.fillStyle='#fff';mapCtx.beginPath();mapCtx.arc(Game.player.x*cw,Game.player.y*ch,4,0,Math.PI*2);mapCtx.fill();}UI.mapLegend.innerHTML=D.BIOME_ORDER.map(id=>`<span class="legend-pill">${D.BIOMES[id].icon} ${D.BIOMES[id].name}</span>`).join('');setModal(UI.map,true);};
UISystem.lineage=function(){lineageCtx.fillStyle='#07110b';lineageCtx.fillRect(0,0,lineageCanvas.width,lineageCanvas.height);const nodes=Game.lineage.slice(-22);nodes.forEach((n,i)=>{const x=40+(i%7)*125,y=55+Math.floor(i/7)*130;lineageCtx.fillStyle='#14271a';lineageCtx.fillRect(x,y,104,58);lineageCtx.strokeStyle='#3a6540';lineageCtx.strokeRect(x,y,104,58);lineageCtx.fillStyle='#e8f1e3';lineageCtx.font='900 11px monospace';lineageCtx.fillText('G'+n.generation,x+10,y+18);lineageCtx.fillStyle='#8fa58f';lineageCtx.font='9px monospace';lineageCtx.fillText(String(n.name).slice(0,15),x+10,y+35);if(i>0){lineageCtx.strokeStyle='#547657';lineageCtx.beginPath();lineageCtx.moveTo(x-22,y+28);lineageCtx.lineTo(x,y+28);lineageCtx.stroke();}});UI.lineageTree.innerHTML=nodes.slice().reverse().map(n=>`<div class="lineage-node"><b>G${n.generation}</b><span>${n.name}</span><small>${n.note||'Descendente registrado'}</small></div>`).join('');setModal(UI.lineage,true);};
SaveSystem.serialize=function(){const safe={version:D.VERSION,seed:Game.seed,selectedBiome:Game.selectedBiome,species:Game.species,player:{x:Game.player.x,y:Game.player.y,hp:Game.player.hp,energy:Game.player.energy,water:Game.player.water,alive:Game.player.alive},weather:Game.weather,weatherTimer:Game.weatherTimer,day:Game.day,hour:Game.hour,discoveries:[...Game.discoveries],buildings:Game.buildings.slice(0,160),lineage:Game.lineage.slice(-120)};return JSON.stringify(safe);};
SaveSystem.save=function(){try{localStorage.setItem('bioevo_save_final',this.serialize());say('Jogo salvo localmente.');}catch(e){say('Não foi possível salvar: '+e.message);}};
SaveSystem.load=function(){try{const raw=localStorage.getItem('bioevo_save_final');if(!raw)return false;const s=JSON.parse(raw);if(!s||!s.species||!s.player)return false;Game.seed=s.seed||Game.seed;Game.selectedBiome=s.selectedBiome||'cerrado';Game.species=s.species;Game.player=Object.assign(Game.player||{},s.player,{alive:s.player.alive!==false});Game.weather=s.weather||'clear';Game.weatherTimer=s.weatherTimer||50;Game.day=s.day||1;Game.hour=s.hour||6;Game.discoveries=new Set(s.discoveries||[Game.selectedBiome]);Game.buildings=s.buildings||[];Game.lineage=s.lineage||[];return true;}catch(e){console.warn(e);return false;}};
UISystem.bind=function(){
  window.addEventListener('resize',RenderSystem.resize);RenderSystem.resize();
  window.addEventListener('keydown',e=>{Game.keys[e.key]=true;const k=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();if(k==='q'){UISystem.renderEvolution();setModal(UI.evo,true);}if(k==='b'){UISystem.renderBuild();setModal(UI.build,true);}if(k==='l')UISystem.lineage();if(k==='m')UISystem.map();if(k==='e')PlayerSystem.eat();if(k==='r')ReproductionSystem.tryBreed();if(k==='f')PlayerSystem.attack();if(k==='escape'){[UI.evo,UI.build,UI.lineage,UI.map].forEach(x=>setModal(x,false));UI.dashboard.classList.add('hidden');}if(k===' '){Game.paused=!Game.paused;say(Game.paused?'Simulação pausada.':'Simulação retomada.');}});window.addEventListener('keyup',e=>{Game.keys[e.key]=false;});
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>setModal($(b.dataset.close),false));document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>Actions.run(b.dataset.action));document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{Game.activeTab=b.dataset.tab;UISystem.dashboard(Game.activeTab);});$('btn-start').onclick=Actions.start;
};
const Actions={run(action){if(action==='pause'){Game.paused=!Game.paused;say(Game.paused?'Simulação pausada.':'Simulação retomada.');}if(action==='evolution'){UISystem.renderEvolution();setModal(UI.evo,true);}if(action==='dashboard'){Game.activeTab='overview';UI.dashboard.classList.remove('hidden');UISystem.dashboard('overview');}if(action==='dashboard-close'){UI.dashboard.classList.add('hidden');}if(action==='save'){SaveSystem.save();}},start(){const name=$('input-species').value.trim()||'Carijó';EvolutionSystem.newSpecies(name,Game.selectedBiome);WorldSystem.init();WeatherSystem.start();Game.running=true;UI.start.classList.add('hidden');UI.loading.classList.add('hidden');UISystem.refresh();say('A linhagem '+name+' nasceu em '+D.BIOMES[Game.selectedBiome].name+'.');}};
UISystem.startScreen();UISystem.bind();
function step(dt){if(!Game.running||Game.paused||!Game.player)return;TimeSystem.update(dt);WeatherSystem.update(dt);PlayerSystem.update(dt);PlantSystem.update(dt);AnimalAISystem.update(dt);PopulationSystem.update(dt*.2);DiplomacySystem.update(dt);Game.autosaveTimer+=dt;if(Game.autosaveTimer>30){Game.autosaveTimer=0;SaveSystem.save();}UISystem.refresh();}
function loop(now){const dt=Math.min(.05,(now-Game.last)/1000);Game.last=now;step(dt);RenderSystem.drawWorld();requestAnimationFrame(loop);}
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
