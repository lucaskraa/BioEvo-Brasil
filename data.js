/* BioEvo: Brasil Nativo - data tables. No dependencies. */
(() => {
  const U = window.BioData = {};
  U.VERSION = '0.9.0';
  U.TILE = 32;
  U.WORLD_W = 240;
  U.WORLD_H = 180;
  U.SIM_CHUNK = 24;
  U.BIOMES = {
    amazonas: {
      id:'amazonas', name:'Amazônia', icon:'🌳', base:'#1d5a35', light:'#4b9a55', dark:'#103b28', water:'#2c8ead',
      temp:26, humidity:88, water:90, movement:.88, danger:1.05, desc:'Floresta quente, úmida e cheia de rios.',
      plants:['açaí','buriti','castanha','cipó','fruto_verde'], animals:['jaguar','anta','capivara','arara','sapo'], weather:['rain','storm','heat']
    },
    caatinga: {
      id:'caatinga', name:'Caatinga', icon:'🌵', base:'#8a6c3c', light:'#c59b53', dark:'#5a452b', water:'#6e9eae',
      temp:31, humidity:34, water:32, movement:.96, danger:1.12, desc:'Seca, quente e resistente; água vale ouro.',
      plants:['mandacaru','xique_xique','juazeiro','arbusto_seco','fruto_seco'], animals:['tatu','prea','jaguar','carcara','lagarto'], weather:['drought','heat','rain']
    },
    cerrado: {
      id:'cerrado', name:'Cerrado', icon:'🌾', base:'#79683f', light:'#b19a55', dark:'#4a432d', water:'#638fa4',
      temp:27, humidity:52, water:55, movement:1, danger:1.08, desc:'Savana tropical moldada por fogo, seca e chuva.',
      plants:['pequi','baruzeiro','graminea','ipê','fruto_cerrado'], animals:['lobo_guara','tamandua','ema','capivara','jaguar'], weather:['rain','drought','fire','heat']
    },
    mata: {
      id:'mata', name:'Mata Atlântica', icon:'🌴', base:'#246044', light:'#4e9b62', dark:'#143d2b', water:'#3f91ae',
      temp:24, humidity:75, water:75, movement:.9, danger:1.1, desc:'Floresta densa, relevo variado e muita vida.',
      plants:['palmito','pitanga','ipê','samambaia','fruto_mata'], animals:['mico','onca_parda','tucano','capivara','quati'], weather:['rain','storm','cold']
    },
    pantanal: {
      id:'pantanal', name:'Pantanal', icon:'🌊', base:'#55784c', light:'#86ad68', dark:'#334b37', water:'#438eae',
      temp:26, humidity:78, water:82, movement:.82, danger:1.06, desc:'Águas sazonais transformam o território.',
      plants:['aguape','caranda','graminea','arvore_ribeirinha','fruto_pantanal'], animals:['tuiuiu','jacare','capivara','onca','ariranha'], weather:['rain','flood','storm','heat']
    },
    pampa: {
      id:'pampa', name:'Pampa', icon:'🌱', base:'#5c7847', light:'#93ad5f', dark:'#34472d', water:'#5f8da0',
      temp:20, humidity:58, water:62, movement:1.04, danger:1.02, desc:'Campos abertos, ventos e invernos mais frios.',
      plants:['graminea','butia','campo_flora','arbusto','fruto_pampa'], animals:['veado','ema','graxaim','capivara','gavião'], weather:['cold','rain','frost','heat']
    }
  };
  U.BIOME_ORDER = Object.keys(U.BIOMES);
  U.FOOD = {
    fruta:{name:'Fruta', energy:24, water:6, biomass:1, dna:2, herb:true},
    folha:{name:'Folhas', energy:12, water:3, biomass:1, dna:1, herb:true},
    peixe:{name:'Peixe', energy:28, water:3, biomass:0, dna:3, meat:true},
    carne:{name:'Carne', energy:38, water:1, biomass:0, dna:5, meat:true},
    semente:{name:'Semente', energy:14, water:2, biomass:1, dna:2, herb:true},
    inseto:{name:'Inseto', energy:17, water:1, biomass:0, dna:2, meat:true}
  };
  U.WEATHER = {
    clear:{name:'Céu limpo', dur:55, water:0, temp:0, plant:1, danger:1},
    rain:{name:'Chuva', dur:42, water:18, temp:-2, plant:1.28, danger:.96},
    storm:{name:'Tempestade', dur:28, water:24, temp:-3, plant:1.1, danger:1.18},
    drought:{name:'Seca', dur:62, water:-22, temp:5, plant:.55, danger:1.1},
    heat:{name:'Onda de calor', dur:30, water:-14, temp:7, plant:.72, danger:1.1},
    cold:{name:'Frio', dur:35, water:-2, temp:-7, plant:.65, danger:1.04},
    frost:{name:'Geada', dur:24, water:-6, temp:-10, plant:.42, danger:1.08},
    flood:{name:'Enchente', dur:38, water:32, temp:-1, plant:1.02, danger:1.13},
    fire:{name:'Incêndio', dur:22, water:-18, temp:12, plant:.18, danger:1.45}
  };
  U.MUTATIONS = [
    {id:'dense_fur', name:'Pelagem densa', group:'defesa', cost:55, desc:'+12 resistência ao frio, +4 defesa, -3 velocidade.', apply:g=>{g.cold+=12;g.defense+=4;g.speed-=3;g.energyMax-=2;}},
    {id:'heat_skin', name:'Pele termorresistente', group:'defesa', cost:70, desc:'+15 resistência ao calor, +5 defesa, -4 velocidade.', apply:g=>{g.heat+=15;g.defense+=5;g.speed-=4;}},
    {id:'swift_legs', name:'Pernas rápidas', group:'movimento', cost:80, desc:'+14 velocidade e +6 salto, maior gasto de energia.', apply:g=>{g.speed+=14;g.jump+=6;g.energyDrain+=.08;}},
    {id:'power_legs', name:'Membros potentes', group:'movimento', cost:78, desc:'+10 salto, +7 escavação, -5 velocidade.', apply:g=>{g.jump+=10;g.dig+=7;g.speed-=5;}},
    {id:'keen_eyes', name:'Visão aguçada', group:'sentidos', cost:60, desc:'+18 visão e +5 percepção.', apply:g=>{g.vision+=18;g.perception+=5;}},
    {id:'keen_smell', name:'Olfato apurado', group:'sentidos', cost:60, desc:'+16 olfato e caça mais eficiente.', apply:g=>{g.smell+=16;g.hunt+=5;}},
    {id:'webbed_feet', name:'Patas palmadas', group:'movimento', cost:65, desc:'+18 natação, -3 velocidade terrestre.', apply:g=>{g.swim+=18;g.speed-=3;}},
    {id:'air_sacs', name:'Sacos aéreos', group:'movimento', cost:95, desc:'+22 voo e +8 visão, exige evolução voadora.', apply:g=>{g.flight+=22;g.vision+=8;g.energyDrain+=.04;}},
    {id:'armor', name:'Carapaça', group:'defesa', cost:105, desc:'+22 defesa, -8 velocidade.', apply:g=>{g.defense+=22;g.speed-=8;g.energyMax-=8;}},
    {id:'spines', name:'Espinhos', group:'defesa', cost:90, desc:'+14 defesa e dano de contra-ataque.', apply:g=>{g.defense+=14;g.thorns+=12;}},
    {id:'efficient_digestion', name:'Digestão eficiente', group:'alimentação', cost:72, desc:'+18 eficiência alimentar e +5 energia máxima.', apply:g=>{g.feed+=18;g.energyMax+=5;}},
    {id:'water_storage', name:'Armazenamento de água', group:'adaptação', cost:90, desc:'+25 água máxima, melhor contra seca.', apply:g=>{g.waterMax+=25;g.drought+=18;}},
    {id:'deep_roots', name:'Raízes profundas', group:'planta', cost:75, desc:'Mutação vegetal: +25 acesso a água profunda.', apply:g=>{g.rootDepth+=25;}},
    {id:'thick_stem', name:'Caule grosso', group:'planta', cost:75, desc:'Mutação vegetal: +18 resistência estrutural.', apply:g=>{g.stem+=18;}},
    {id:'bright_flowers', name:'Flores atrativas', group:'planta', cost:80, desc:'Mutação vegetal: +20 polinização e dispersão animal.', apply:g=>{g.pollination+=20;g.seedSpread+=8;}},
    {id:'sweet_fruit', name:'Frutos doces', group:'planta', cost:85, desc:'Mutação vegetal: aumenta consumo por animais e dispersão.', apply:g=>{g.fruitAppeal+=20;g.seedSpread+=12;}},
    {id:'toxic_defense', name:'Defesa tóxica', group:'planta', cost:100, desc:'Mutação vegetal: herbívoros sofrem risco ao consumir.', apply:g=>{g.toxin+=25;}},
    {id:'camouflage', name:'Camuflagem', group:'defesa', cost:75, desc:'+20 furtividade e menor chance de ser caçado.', apply:g=>{g.camouflage+=20;}},
    {id:'social_brain', name:'Cérebro social', group:'inteligência', cost:130, desc:'+15 inteligência social e aproxima a era tribal.', apply:g=>{g.intelligence+=15;g.social+=12;}},
    {id:'tool_hands', name:'Mãos hábeis', group:'civilização', cost:160, desc:'+18 construção e coleta; requisito para oficinas.', apply:g=>{g.build+=18;g.collect+=8;g.intelligence+=8;}},
    {id:'endurance', name:'Resistência', group:'sobrevivência', cost:95, desc:'+20 energia máxima e menor drenagem.', apply:g=>{g.energyMax+=20;g.energyDrain=Math.max(0,g.energyDrain-.05);g.hpMax+=5;}},
    {id:'fertility', name:'Fertilidade elevada', group:'reprodução', cost:90, desc:'+15 fertilidade e +1 descendente potencial.', apply:g=>{g.fertility+=15;g.clutch+=1;}}
  ];
  U.BUILDINGS = [
    {id:'fire', name:'Fogueira', cost:{wood:8,stone:2}, time:4, hp:120, desc:'Aumenta segurança e reúne membros à noite.'},
    {id:'shelter', name:'Abrigo', cost:{wood:18,stone:4}, time:9, hp:240, desc:'Proteção contra clima e descanso.'},
    {id:'storage', name:'Armazém', cost:{wood:24,stone:8}, time:12, hp:300, desc:'Aumenta capacidade e conservação de recursos.'},
    {id:'farm', name:'Plantação', cost:{wood:15,stone:4}, time:15, hp:180, desc:'Produz alimento de forma previsível.'},
    {id:'fence', name:'Cerca', cost:{wood:14,stone:2}, time:6, hp:160, desc:'Define território e reduz invasões.'},
    {id:'bridge', name:'Ponte', cost:{wood:30,stone:8}, time:16, hp:260, desc:'Permite atravessar áreas alagadas e rios rasos.'},
    {id:'tower', name:'Torre', cost:{wood:26,stone:18}, time:17, hp:360, desc:'Aumenta visão e vigilância territorial.'},
    {id:'workshop', name:'Oficina', cost:{wood:34,stone:22}, time:24, hp:330, desc:'Desbloqueia tecnologia e construção avançada.'}
  ];
  U.TECH = [
    {id:'stone', name:'Pedra', cost:0, req:0, desc:'Ferramentas rudimentares e coleta organizada.'},
    {id:'tools', name:'Ferramentas', cost:180, req:80, desc:'Aumenta coleta, caça e construção.'},
    {id:'agriculture', name:'Agricultura', cost:360, req:100, desc:'Plantação e armazenamento de alimentos.'},
    {id:'metallurgy', name:'Metalurgia', cost:650, req:160, desc:'Metal e construções resistentes.'},
    {id:'advanced_build', name:'Construção avançada', cost:900, req:220, desc:'Pontes, torres e grandes estruturas.'},
    {id:'engineering', name:'Engenharia', cost:1350, req:300, desc:'Infraestrutura e eficiência civilizacional.'}
  ];
  U.SPECIES_ARCHETYPES = [
    {id:'walker', name:'Terrestre', type:'animal', body:'quadruped'},
    {id:'swimmer', name:'Aquático', type:'animal', body:'fish'},
    {id:'flyer', name:'Voador', type:'animal', body:'bird'}
  ];
  U.ANIMALS = {
    capivara:{name:'Capivara', diet:'herb', size:1.25, hp:72, speed:40, damage:7, habitat:['pantanal','cerrado','amazonas','mata'], color:'#8c704f'},
    anta:{name:'Anta', diet:'herb', size:1.45, hp:94, speed:34, damage:10, habitat:['amazonas','cerrado','mata'], color:'#51463a'},
    jaguar:{name:'Onça-pintada', diet:'carn', size:1.2, hp:90, speed:68, damage:22, habitat:['amazonas','cerrado'], color:'#c18b3c'},
    onca:{name:'Onça-pantaneira', diet:'carn', size:1.15, hp:88, speed:65, damage:21, habitat:['pantanal'], color:'#c19545'},
    onca_parda:{name:'Onça-parda', diet:'carn', size:1.1, hp:78, speed:64, damage:19, habitat:['mata'], color:'#9d744e'},
    lobo_guara:{name:'Lobo-guará', diet:'omn', size:.95, hp:58, speed:62, damage:12, habitat:['cerrado','pampa'], color:'#aa563c'},
    tamandua:{name:'Tamanduá', diet:'insect', size:1, hp:54, speed:28, damage:5, habitat:['cerrado','mata'], color:'#756452'},
    tatu:{name:'Tatu', diet:'omn', size:.65, hp:35, speed:31, damage:5, habitat:['caatinga'], color:'#7b6755'},
    prea:{name:'Preá', diet:'herb', size:.42, hp:24, speed:43, damage:2, habitat:['caatinga'], color:'#9a815f'},
    lagarto:{name:'Lagarto', diet:'insect', size:.5, hp:27, speed:48, damage:4, habitat:['caatinga'], color:'#6f7f3d'},
    carcara:{name:'Carcará', diet:'carn', size:.7, hp:42, speed:74, damage:10, habitat:['caatinga','cerrado'], color:'#754a3c'},
    arara:{name:'Arara', diet:'fruit', size:.72, hp:34, speed:86, damage:3, habitat:['amazonas'], color:'#d14535'},
    tucano:{name:'Tucano', diet:'fruit', size:.65, hp:30, speed:78, damage:4, habitat:['mata'], color:'#283743'},
    mico:{name:'Mico', diet:'omn', size:.48, hp:28, speed:70, damage:4, habitat:['mata'], color:'#7b4f36'},
    quati:{name:'Quati', diet:'omn', size:.65, hp:38, speed:58, damage:5, habitat:['mata'], color:'#8d6844'},
    jacare:{name:'Jacaré', diet:'carn', size:1.4, hp:110, speed:36, damage:24, habitat:['pantanal'], color:'#536647'},
    ariranha:{name:'Ariranha', diet:'carn', size:.8, hp:44, speed:66, damage:11, habitat:['pantanal','amazonas'], color:'#654c39'},
    tuiuiu:{name:'Tuiuiú', diet:'fish', size:1.1, hp:48, speed:78, damage:8, habitat:['pantanal'], color:'#e5e5df'},
    ema:{name:'Ema', diet:'herb', size:1.1, hp:58, speed:67, damage:7, habitat:['cerrado','pampa'], color:'#6d6254'},
    veado:{name:'Veado-campeiro', diet:'herb', size:1.0, hp:55, speed:71, damage:7, habitat:['pampa'], color:'#9b744d'},
    graxaim:{name:'Graxaim', diet:'omn', size:.75, hp:42, speed:58, damage:7, habitat:['pampa'], color:'#766451'},
    gavião:{name:'Gavião', diet:'carn', size:.75, hp:39, speed:92, damage:10, habitat:['pampa'], color:'#5f4c3d'},
    sapo:{name:'Sapo', diet:'insect', size:.38, hp:20, speed:39, damage:2, habitat:['amazonas'], color:'#587c4a'},
    peixe:{name:'Peixe', diet:'omn', size:.35, hp:18, speed:62, damage:2, habitat:['pantanal','amazonas'], color:'#6c9ab0'}
  };
  U.PLANTS = {
    açaí:{name:'Açaí', kind:'tree', food:'fruta', biomass:9, water:12, value:12},
    buriti:{name:'Buriti', kind:'tree', food:'fruta', biomass:12, water:15, value:10},
    castanha:{name:'Castanheira', kind:'tree', food:'semente', biomass:14, water:10, value:14},
    cipó:{name:'Cipó', kind:'vine', food:'folha', biomass:5, water:6, value:6},
    fruto_verde:{name:'Frutífera verde', kind:'shrub', food:'fruta', biomass:5, water:6, value:8},
    mandacaru:{name:'Mandacaru', kind:'cactus', food:'fruta', biomass:7, water:2, value:9},
    'xique_xique':{name:'Xique-xique', kind:'cactus', food:'folha', biomass:5, water:2, value:6},
    juazeiro:{name:'Juazeiro', kind:'tree', food:'fruta', biomass:8, water:4, value:9},
    arbusto_seco:{name:'Arbusto seco', kind:'shrub', food:'folha', biomass:3, water:2, value:4},
    fruto_seco:{name:'Fruta resistente', kind:'shrub', food:'fruta', biomass:4, water:3, value:6},
    pequi:{name:'Pequi', kind:'tree', food:'fruta', biomass:9, water:6, value:12},
    baruzeiro:{name:'Baruzeiro', kind:'tree', food:'semente', biomass:10, water:5, value:10},
    graminea:{name:'Gramínea', kind:'grass', food:'folha', biomass:2, water:2, value:3},
    'ipê':{name:'Ipê', kind:'tree', food:'flor', biomass:7, water:6, value:7},
    fruto_cerrado:{name:'Fruto do Cerrado', kind:'shrub', food:'fruta', biomass:4, water:4, value:7},
    palmito:{name:'Palmito', kind:'tree', food:'fruta', biomass:8, water:9, value:9},
    pitanga:{name:'Pitanga', kind:'shrub', food:'fruta', biomass:4, water:6, value:8},
    samambaia:{name:'Samambaia', kind:'grass', food:'folha', biomass:3, water:8, value:4},
    fruto_mata:{name:'Fruto da Mata', kind:'shrub', food:'fruta', biomass:4, water:6, value:8},
    aguape:{name:'Aguapé', kind:'water', food:'folha', biomass:4, water:15, value:4},
    caranda:{name:'Carandá', kind:'tree', food:'fruta', biomass:8, water:13, value:8},
    arvore_ribeirinha:{name:'Árvore ribeirinha', kind:'tree', food:'fruta', biomass:9, water:14, value:9},
    butia:{name:'Butiá', kind:'tree', food:'fruta', biomass:7, water:7, value:8},
    campo_flora:{name:'Flora do campo', kind:'grass', food:'folha', biomass:3, water:5, value:4},
    arbusto:{name:'Arbusto', kind:'shrub', food:'folha', biomass:4, water:4, value:5},
    fruto_pampa:{name:'Fruto do Pampa', kind:'shrub', food:'fruta', biomass:4, water:5, value:6}
  };
  U.OBJECTIVES = [
    {id:'survive', title:'Sobreviva', desc:'Alimente-se, beba água e mantenha energia.', need:100},
    {id:'mate', title:'Encontre um parceiro', desc:'Procure outro membro compatível da sua espécie.', need:1},
    {id:'offspring', title:'Gere descendentes', desc:'Reproduza-se para iniciar a próxima geração.', need:1},
    {id:'evolve', title:'Invista em evolução', desc:'Use DNA para adaptar a linhagem ao ambiente.', need:1},
    {id:'territory', title:'Conquiste território', desc:'Explore a borda do bioma e descubra uma nova região.', need:3},
    {id:'society', title:'Forme uma sociedade', desc:'Acumule inteligência social e reúna membros.', need:25},
    {id:'tribe', title:'Crie uma tribo', desc:'Construa abrigo, fogueira e organize a comunidade.', need:1},
    {id:'village', title:'Erga uma aldeia', desc:'Desbloqueie agricultura e mantenha população estável.', need:20},
    {id:'city', title:'Construa uma cidade', desc:'Alcance tecnologia avançada e infraestrutura.', need:1},
    {id:'civilization', title:'Civilização', desc:'Conecte territórios e desenvolva cultura.', need:1}
  ];

  U.defaultGenes = function(seedType) {
    const aquatic = seedType === 'swimmer';
    const flyer = seedType === 'flyer';
    return {
      body: aquatic ? 'fish' : (flyer ? 'bird':'quadruped'),
      size: 1,
      hpMax: 100,
      energyMax: 100,
      waterMax: 100,
      heat: 50,
      cold: 50,
      defense: 20,
      speed: aquatic ? 60 : (flyer ? 72 : 50),
      jump: 20,
      climb: flyer ? 35 : 20,
      dig: 15,
      swim: aquatic ? 85 : 25,
      flight: flyer ? 75 : 8,
      vision: flyer ? 70 : 50,
      hearing: 50,
      smell: 50,
      perception: 45,
      feed: 50,
      hunt: aquatic ? 50 : 40,
      collect: 40,
      fertility: 55,
      maturity: 24,
      clutch: 1,
      parental: 40,
      drought: 25,
      energyDrain: .35,
      intelligence: 5,
      social: 5,
      build: 0,
      thorns: 0,
      camouflage: 0,
      rootDepth: 0,
      stem: 0,
      pollination: 20,
      seedSpread: 20,
      fruitAppeal: 20,
      toxin: 0,
      plantLight: 50
    };
  };
  U.clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
  U.rand = (a=0,b=1)=>a+Math.random()*(b-a);
  U.randi = (a,b)=>Math.floor(U.rand(a,b+1));
  U.pick = arr=>arr[Math.floor(Math.random()*arr.length)];
  U.distance = (a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  U.lerp = (a,b,t)=>a+(b-a)*t;
  U.hash = (x,y,s=0)=>{
    let n = Math.sin(x*127.1+y*311.7+s*74.7)*43758.5453123;
    return n-Math.floor(n);
  };
  U.noise = (x,y,s=0)=>{
    const ix=Math.floor(x), iy=Math.floor(y), fx=x-ix, fy=y-iy;
    const a=U.hash(ix,iy,s), b=U.hash(ix+1,iy,s), c=U.hash(ix,iy+1,s), d=U.hash(ix+1,iy+1,s);
    const ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy);
    return U.lerp(U.lerp(a,b,ux),U.lerp(c,d,ux),uy);
  };
  U.mazeBiome = function(tx,ty){
    const nx=tx/U.WORLD_W, ny=ty/U.WORLD_H;
    if(ny>.78) return nx<.52?'pampa':'mata';
    if(nx<.23 && ny>.24 && ny<.78) return 'amazonas';
    if(nx<.40 && ny<.44) return 'caatinga';
    if(nx<.68 && ny<.60) return 'cerrado';
    if(nx>.63 && ny>.33 && ny<.78) return 'pantanal';
    return 'mata';
  };
})();
