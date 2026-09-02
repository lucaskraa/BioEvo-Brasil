/* BIOEVO: BRASIL NATIVO — DATA CORE — conteúdo original, executável e sem dependências externas. */
(()=>{
  'use strict';
  const D=window.BioData={};
  D.VERSION='1.0.0-final';
  D.TILE=32; D.WORLD_W=240; D.WORLD_H=180; D.MAX_ACTIVE_ENTITIES=260;
  D.BIOME_ORDER=[]; D.BIOMES={};
  D.BIOMES.amazonia={id:'amazonia',name:'Amazônia',icon:'🌳',base:'#1e633d',light:'#3fa967',waterColor:'#167fa3',temp:26,humidity:88,water:90,desc:'Floresta quente, úmida e cortada por rios.',plants:[],animals:[],weather:[]};
  D.BIOME_ORDER.push('amazonia');
  D.BIOMES.caatinga={id:'caatinga',name:'Caatinga',icon:'🌵',base:'#8d6b3c',light:'#c8a45d',waterColor:'#548a9b',temp:31,humidity:34,water:28,desc:'Sertão seco; água e sombra definem a sobrevivência.',plants:[],animals:[],weather:[]};
  D.BIOME_ORDER.push('caatinga');
  D.BIOMES.cerrado={id:'cerrado',name:'Cerrado',icon:'🌾',base:'#79633b',light:'#b6a060',waterColor:'#5c8798',temp:27,humidity:52,water:54,desc:'Savana brasileira com fogo natural e estação seca.',plants:[],animals:[],weather:[]};
  D.BIOME_ORDER.push('cerrado');
  D.BIOMES.mata={id:'mata',name:'Mata Atlântica',icon:'🌴',base:'#245f43',light:'#52a36d',waterColor:'#3b93ac',temp:24,humidity:75,water:74,desc:'Floresta densa, encostas e grande diversidade.',plants:[],animals:[],weather:[]};
  D.BIOME_ORDER.push('mata');
  D.BIOMES.pantanal={id:'pantanal',name:'Pantanal',icon:'🌊',base:'#507a58',light:'#84ad70',waterColor:'#3e91b4',temp:26,humidity:79,water:84,desc:'Planícies alagáveis onde a água redesenha o mapa.',plants:[],animals:[],weather:[]};
  D.BIOME_ORDER.push('pantanal');
  D.BIOMES.pampa={id:'pampa',name:'Pampa',icon:'🌱',base:'#5f794b',light:'#9bbd67',waterColor:'#628ca1',temp:20,humidity:58,water:63,desc:'Campos abertos, ventos e inverno mais pronunciado.',plants:[],animals:[],weather:[]};
  D.BIOME_ORDER.push('pampa');
  D.BIOMES.amazonia.plants.push('acai');
  D.BIOMES.amazonia.plants.push('buriti');
  D.BIOMES.amazonia.plants.push('castanha');
  D.BIOMES.amazonia.plants.push('mandacaru');
  D.BIOMES.amazonia.plants.push('xique');
  D.BIOMES.amazonia.plants.push('juazeiro');
  D.BIOMES.amazonia.plants.push('pequi');
  D.BIOMES.amazonia.plants.push('baru');
  D.BIOMES.amazonia.animals.push('onca');
  D.BIOMES.amazonia.animals.push('lobo_guara');
  D.BIOMES.amazonia.animals.push('tamandua');
  D.BIOMES.amazonia.animals.push('anta');
  D.BIOMES.amazonia.animals.push('capivara');
  D.BIOMES.amazonia.animals.push('tatu');
  D.BIOMES.amazonia.animals.push('arara');
  D.BIOMES.amazonia.animals.push('tucano');
  D.BIOMES.amazonia.animals.push('jacare');
  D.BIOMES.amazonia.weather.push('clear');
  D.BIOMES.amazonia.weather.push('rain');
  D.BIOMES.amazonia.weather.push('storm');
  D.BIOMES.amazonia.weather.push('drought');
  D.BIOMES.amazonia.weather.push('heat');
  D.BIOMES.amazonia.weather.push('cold');
  D.BIOMES.amazonia.weather.push('frost');
  D.BIOMES.amazonia.weather.push('flood');
  D.BIOMES.amazonia.weather.push('fire');
  D.BIOMES.caatinga.plants.push('acai');
  D.BIOMES.caatinga.plants.push('buriti');
  D.BIOMES.caatinga.plants.push('castanha');
  D.BIOMES.caatinga.plants.push('mandacaru');
  D.BIOMES.caatinga.plants.push('xique');
  D.BIOMES.caatinga.plants.push('juazeiro');
  D.BIOMES.caatinga.plants.push('pequi');
  D.BIOMES.caatinga.plants.push('baru');
  D.BIOMES.caatinga.animals.push('onca');
  D.BIOMES.caatinga.animals.push('lobo_guara');
  D.BIOMES.caatinga.animals.push('tamandua');
  D.BIOMES.caatinga.animals.push('anta');
  D.BIOMES.caatinga.animals.push('capivara');
  D.BIOMES.caatinga.animals.push('tatu');
  D.BIOMES.caatinga.animals.push('arara');
  D.BIOMES.caatinga.animals.push('tucano');
  D.BIOMES.caatinga.animals.push('jacare');
  D.BIOMES.caatinga.weather.push('clear');
  D.BIOMES.caatinga.weather.push('rain');
  D.BIOMES.caatinga.weather.push('storm');
  D.BIOMES.caatinga.weather.push('drought');
  D.BIOMES.caatinga.weather.push('heat');
  D.BIOMES.caatinga.weather.push('cold');
  D.BIOMES.caatinga.weather.push('frost');
  D.BIOMES.caatinga.weather.push('flood');
  D.BIOMES.caatinga.weather.push('fire');
  D.BIOMES.cerrado.plants.push('acai');
  D.BIOMES.cerrado.plants.push('buriti');
  D.BIOMES.cerrado.plants.push('castanha');
  D.BIOMES.cerrado.plants.push('mandacaru');
  D.BIOMES.cerrado.plants.push('xique');
  D.BIOMES.cerrado.plants.push('juazeiro');
  D.BIOMES.cerrado.plants.push('pequi');
  D.BIOMES.cerrado.plants.push('baru');
  D.BIOMES.cerrado.animals.push('onca');
  D.BIOMES.cerrado.animals.push('lobo_guara');
  D.BIOMES.cerrado.animals.push('tamandua');
  D.BIOMES.cerrado.animals.push('anta');
  D.BIOMES.cerrado.animals.push('capivara');
  D.BIOMES.cerrado.animals.push('tatu');
  D.BIOMES.cerrado.animals.push('arara');
  D.BIOMES.cerrado.animals.push('tucano');
  D.BIOMES.cerrado.animals.push('jacare');
  D.BIOMES.cerrado.weather.push('clear');
  D.BIOMES.cerrado.weather.push('rain');
  D.BIOMES.cerrado.weather.push('storm');
  D.BIOMES.cerrado.weather.push('drought');
  D.BIOMES.cerrado.weather.push('heat');
  D.BIOMES.cerrado.weather.push('cold');
  D.BIOMES.cerrado.weather.push('frost');
  D.BIOMES.cerrado.weather.push('flood');
  D.BIOMES.cerrado.weather.push('fire');
  D.BIOMES.mata.plants.push('acai');
  D.BIOMES.mata.plants.push('buriti');
  D.BIOMES.mata.plants.push('castanha');
  D.BIOMES.mata.plants.push('mandacaru');
  D.BIOMES.mata.plants.push('xique');
  D.BIOMES.mata.plants.push('juazeiro');
  D.BIOMES.mata.plants.push('pequi');
  D.BIOMES.mata.plants.push('baru');
  D.BIOMES.mata.animals.push('onca');
  D.BIOMES.mata.animals.push('lobo_guara');
  D.BIOMES.mata.animals.push('tamandua');
  D.BIOMES.mata.animals.push('anta');
  D.BIOMES.mata.animals.push('capivara');
  D.BIOMES.mata.animals.push('tatu');
  D.BIOMES.mata.animals.push('arara');
  D.BIOMES.mata.animals.push('tucano');
  D.BIOMES.mata.animals.push('jacare');
  D.BIOMES.mata.weather.push('clear');
  D.BIOMES.mata.weather.push('rain');
  D.BIOMES.mata.weather.push('storm');
  D.BIOMES.mata.weather.push('drought');
  D.BIOMES.mata.weather.push('heat');
  D.BIOMES.mata.weather.push('cold');
  D.BIOMES.mata.weather.push('frost');
  D.BIOMES.mata.weather.push('flood');
  D.BIOMES.mata.weather.push('fire');
  D.BIOMES.pantanal.plants.push('acai');
  D.BIOMES.pantanal.plants.push('buriti');
  D.BIOMES.pantanal.plants.push('castanha');
  D.BIOMES.pantanal.plants.push('mandacaru');
  D.BIOMES.pantanal.plants.push('xique');
  D.BIOMES.pantanal.plants.push('juazeiro');
  D.BIOMES.pantanal.plants.push('pequi');
  D.BIOMES.pantanal.plants.push('baru');
  D.BIOMES.pantanal.animals.push('onca');
  D.BIOMES.pantanal.animals.push('lobo_guara');
  D.BIOMES.pantanal.animals.push('tamandua');
  D.BIOMES.pantanal.animals.push('anta');
  D.BIOMES.pantanal.animals.push('capivara');
  D.BIOMES.pantanal.animals.push('tatu');
  D.BIOMES.pantanal.animals.push('arara');
  D.BIOMES.pantanal.animals.push('tucano');
  D.BIOMES.pantanal.animals.push('jacare');
  D.BIOMES.pantanal.weather.push('clear');
  D.BIOMES.pantanal.weather.push('rain');
  D.BIOMES.pantanal.weather.push('storm');
  D.BIOMES.pantanal.weather.push('drought');
  D.BIOMES.pantanal.weather.push('heat');
  D.BIOMES.pantanal.weather.push('cold');
  D.BIOMES.pantanal.weather.push('frost');
  D.BIOMES.pantanal.weather.push('flood');
  D.BIOMES.pantanal.weather.push('fire');
  D.BIOMES.pampa.plants.push('acai');
  D.BIOMES.pampa.plants.push('buriti');
  D.BIOMES.pampa.plants.push('castanha');
  D.BIOMES.pampa.plants.push('mandacaru');
  D.BIOMES.pampa.plants.push('xique');
  D.BIOMES.pampa.plants.push('juazeiro');
  D.BIOMES.pampa.plants.push('pequi');
  D.BIOMES.pampa.plants.push('baru');
  D.BIOMES.pampa.animals.push('onca');
  D.BIOMES.pampa.animals.push('lobo_guara');
  D.BIOMES.pampa.animals.push('tamandua');
  D.BIOMES.pampa.animals.push('anta');
  D.BIOMES.pampa.animals.push('capivara');
  D.BIOMES.pampa.animals.push('tatu');
  D.BIOMES.pampa.animals.push('arara');
  D.BIOMES.pampa.animals.push('tucano');
  D.BIOMES.pampa.animals.push('jacare');
  D.BIOMES.pampa.weather.push('clear');
  D.BIOMES.pampa.weather.push('rain');
  D.BIOMES.pampa.weather.push('storm');
  D.BIOMES.pampa.weather.push('drought');
  D.BIOMES.pampa.weather.push('heat');
  D.BIOMES.pampa.weather.push('cold');
  D.BIOMES.pampa.weather.push('frost');
  D.BIOMES.pampa.weather.push('flood');
  D.BIOMES.pampa.weather.push('fire');
  D.FOOD={};
  D.FOOD.fruta={id:'fruta',name:'Fruta',energy:24,water:6,biomass:1,dna:2,kind:'vegetal'};
  D.FOOD.folha={id:'folha',name:'Folha',energy:13,water:4,biomass:1,dna:1,kind:'vegetal'};
  D.FOOD.semente={id:'semente',name:'Semente',energy:15,water:3,biomass:1,dna:2,kind:'vegetal'};
  D.FOOD.inseto={id:'inseto',name:'Inseto',energy:18,water:1,biomass:0,dna:2,kind:'animal'};
  D.FOOD.peixe={id:'peixe',name:'Peixe',energy:29,water:3,biomass:0,dna:3,kind:'animal'};
  D.FOOD.carne={id:'carne',name:'Carne',energy:40,water:1,biomass:0,dna:5,kind:'animal'};
  D.FOOD.mel={id:'mel',name:'Mel',energy:32,water:4,biomass:0,dna:4,kind:'animal'};
  D.FOOD.fungo={id:'fungo',name:'Fungo',energy:20,water:5,biomass:1,dna:2,kind:'fungo'};
  D.WEATHER={};
  D.WEATHER.clear={id:'clear',name:'Céu limpo',duration:60,water:0,temp:0,plant:1.0,danger:1.0};
  D.WEATHER.rain={id:'rain',name:'Chuva',duration:42,water:18,temp:-2,plant:1.28,danger:0.96};
  D.WEATHER.storm={id:'storm',name:'Tempestade',duration:28,water:25,temp:-3,plant:1.12,danger:1.18};
  D.WEATHER.drought={id:'drought',name:'Seca',duration:68,water:-22,temp:5,plant:0.52,danger:1.12};
  D.WEATHER.heat={id:'heat',name:'Onda de calor',duration:30,water:-15,temp:7,plant:0.72,danger:1.12};
  D.WEATHER.cold={id:'cold',name:'Frio',duration:36,water:-2,temp:-6,plant:0.67,danger:1.04};
  D.WEATHER.frost={id:'frost',name:'Geada',duration:24,water:-7,temp:-10,plant:0.42,danger:1.08};
  D.WEATHER.flood={id:'flood',name:'Enchente',duration:38,water:30,temp:-1,plant:1.03,danger:1.15};
  D.WEATHER.fire={id:'fire',name:'Incêndio',duration:22,water:-19,temp:12,plant:0.18,danger:1.48};
  D.MUTATIONS=[];
  D.MUTATIONS.push({id:'swift_legs',name:'Pernas velozes',group:'movimento',cost:80,desc:'+14 velocidade, +5 salto, -7 energia máxima.',effect:{"speed":14,"jump":5,"energyMax":-7}});
  D.MUTATIONS.push({id:'armor',name:'Carapaça resistente',group:'defesa',cost:105,desc:'+24 defesa, -8 velocidade, -4 salto.',effect:{"defense":24,"speed":-8,"jump":-4}});
  D.MUTATIONS.push({id:'heat_skin',name:'Pele termorresistente',group:'adaptação',cost:70,desc:'+18 calor, +5 defesa, -3 velocidade.',effect:{"heat":18,"defense":5,"speed":-3}});
  D.MUTATIONS.push({id:'cold_fur',name:'Pelagem densa',group:'adaptação',cost:65,desc:'+18 frio, +3 defesa, -4 velocidade.',effect:{"cold":18,"defense":3,"speed":-4}});
  D.MUTATIONS.push({id:'water_storage',name:'Reserva hídrica',group:'adaptação',cost:95,desc:'+30 água máxima, +14 seca, -3 energia.',effect:{"waterMax":30,"drought":14,"energyMax":-3}});
  D.MUTATIONS.push({id:'keen_eyes',name:'Visão aguçada',group:'sentidos',cost:60,desc:'+20 visão e +4 percepção.',effect:{"vision":20,"perception":4}});
  D.MUTATIONS.push({id:'keen_smell',name:'Olfato apurado',group:'sentidos',cost:62,desc:'+18 olfato e +6 caça.',effect:{"smell":18,"hunt":6}});
  D.MUTATIONS.push({id:'webbed_feet',name:'Patas palmadas',group:'movimento',cost:68,desc:'+24 natação, -3 velocidade terrestre.',effect:{"swim":24,"speed":-3}});
  D.MUTATIONS.push({id:'air_sacs',name:'Sacos aéreos',group:'movimento',cost:110,desc:'+26 voo, +9 visão, +0.05 gasto.',effect:{"flight":26,"vision":9,"energyDrain":0.05}});
  D.MUTATIONS.push({id:'thorns',name:'Espinhos',group:'defesa',cost:88,desc:'+16 defesa, +14 contra-ataque.',effect:{"defense":16,"thorns":14}});
  D.MUTATIONS.push({id:'camouflage',name:'Camuflagem',group:'defesa',cost:76,desc:'+22 furtividade, +5 defesa.',effect:{"camouflage":22,"defense":5}});
  D.MUTATIONS.push({id:'efficient_digest',name:'Digestão eficiente',group:'alimentação',cost:74,desc:'+20 eficiência e +8 energia.',effect:{"feed":20,"energyMax":8}});
  D.MUTATIONS.push({id:'burrow_claws',name:'Garras escavadoras',group:'movimento',cost:72,desc:'+22 escavação e +3 defesa.',effect:{"dig":22,"defense":3}});
  D.MUTATIONS.push({id:'social_brain',name:'Cérebro social',group:'inteligência',cost:130,desc:'+18 inteligência, +16 sociabilidade.',effect:{"intelligence":18,"social":16}});
  D.MUTATIONS.push({id:'tool_use',name:'Mãos manipuladoras',group:'inteligência',cost:155,desc:'+18 construção, +10 inteligência, -4 corrida.',effect:{"build":18,"intelligence":10,"speed":-4}});
  D.MUTATIONS.push({id:'hearing',name:'Audição ampla',group:'sentidos',cost:58,desc:'+18 audição e +3 percepção.',effect:{"hearing":18,"perception":3}});
  D.MUTATIONS.push({id:'thick_stem',name:'Caule grosso',group:'planta',cost:72,desc:'Planta: +22 resistência estrutural.',effect:{"stem":22}});
  D.MUTATIONS.push({id:'deep_roots',name:'Raízes profundas',group:'planta',cost:78,desc:'Planta: +28 acesso a água subterrânea.',effect:{"rootDepth":28}});
  D.MUTATIONS.push({id:'broad_leaves',name:'Folhas largas',group:'planta',cost:66,desc:'Planta: +20 captação de luz, -10 resistência à seca.',effect:{"leafArea":20,"drought":-10}});
  D.MUTATIONS.push({id:'sweet_fruit',name:'Fruto doce',group:'planta',cost:86,desc:'Planta: +22 atração de animais, +12 dispersão.',effect:{"fruitAppeal":22,"seedSpread":12}});
  D.MUTATIONS.push({id:'toxin',name:'Defesa química',group:'planta',cost:102,desc:'Planta: +30 toxicidade, -8 crescimento.',effect:{"toxin":30,"growth":-8}});
  D.MUTATIONS.push({id:'wind_seeds',name:'Sementes aladas',group:'planta',cost:84,desc:'Planta: +25 dispersão pelo vento.',effect:{"windSpread":25}});
  D.MUTATIONS.push({id:'showy_flower',name:'Flor chamativa',group:'planta',cost:82,desc:'Planta: +25 polinização e +8 dispersão.',effect:{"pollination":25,"seedSpread":8}});
  D.ANIMALS={};
  D.ANIMALS.onca={id:'onca',name:'Onça-pintada',role:'predador',color:'#d79d4d',hp:45,speed:1.08,vision:66,attack:38,feed:70};
  D.ANIMALS.lobo_guara={id:'lobo_guara',name:'Lobo-guará',role:'predador',color:'#bf8a63',hp:32,speed:1.15,vision:58,attack:30,feed:45};
  D.ANIMALS.tamandua={id:'tamandua',name:'Tamanduá-bandeira',role:'insetívoro',color:'#d2b07a',hp:26,speed:1.0,vision:45,attack:26,feed:55};
  D.ANIMALS.anta={id:'anta',name:'Anta',role:'herbívoro',color:'#6f4f3b',hp:38,speed:0.82,vision:52,attack:24,feed:35};
  D.ANIMALS.capivara={id:'capivara',name:'Capivara',role:'herbívoro',color:'#96725b',hp:34,speed:0.86,vision:42,attack:22,feed:38};
  D.ANIMALS.tatu={id:'tatu',name:'Tatu',role:'onívoro',color:'#7e6b5b',hp:28,speed:0.9,vision:60,attack:30,feed:34};
  D.ANIMALS.arara={id:'arara',name:'Arara',role:'voador',color:'#6e9bd3',hp:18,speed:1.22,vision:50,attack:34,feed:62};
  D.ANIMALS.tucano={id:'tucano',name:'Tucano',role:'voador',color:'#222b29',hp:19,speed:1.2,vision:64,attack:25,feed:70};
  D.ANIMALS.jacare={id:'jacare',name:'Jacaré',role:'aquático',color:'#587249',hp:42,speed:0.78,vision:72,attack:36,feed:28};
  D.ANIMALS.ariranha={id:'ariranha',name:'Ariranha',role:'aquático',color:'#715f4e',hp:30,speed:1.1,vision:60,attack:29,feed:48};
  D.ANIMALS.veado={id:'veado',name:'Veado-campeiro',role:'herbívoro',color:'#ae8c63',hp:29,speed:1.1,vision:62,attack:28,feed:44};
  D.ANIMALS.ema={id:'ema',name:'Ema',role:'corredor',color:'#8d7b67',hp:27,speed:1.18,vision:58,attack:30,feed:48};
  D.ANIMALS.quati={id:'quati',name:'Quati',role:'onívoro',color:'#9c704d',hp:22,speed:1.08,vision:68,attack:24,feed:60};
  D.ANIMALS.mico={id:'mico',name:'Mico-leão',role:'onívoro',color:'#cf8a4e',hp:16,speed:1.16,vision:78,attack:24,feed:72};
  D.ANIMALS.sapo={id:'sapo',name:'Sapo',role:'anfíbio',color:'#5a9257',hp:8,speed:0.88,vision:74,attack:18,feed:66};
  D.ANIMALS.carcara={id:'carcara',name:'Carcará',role:'voador',color:'#6a5139',hp:17,speed:1.14,vision:70,attack:20,feed:62};
  D.ANIMALS.gavião={id:'gavião',name:'Gavião',role:'voador',color:'#68594c',hp:18,speed:1.18,vision:78,attack:28,feed:75};
  D.ANIMALS.graxaim={id:'graxaim',name:'Graxaim-do-campo',role:'predador',color:'#9b785e',hp:21,speed:1.07,vision:64,attack:26,feed:58};
  D.ANIMALS.prea={id:'prea',name:'Preá',role:'herbívoro',color:'#8c765b',hp:10,speed:0.95,vision:46,attack:18,feed:35};
  D.ANIMALS.lagarto={id:'lagarto',name:'Lagarto',role:'insetívoro',color:'#6f874b',hp:7,speed:1.02,vision:72,attack:12,feed:54};
  D.ANIMALS.tuiuiu={id:'tuiuiu',name:'Tuiuiú',role:'voador',color:'#d8d6ca',hp:24,speed:1.05,vision:92,attack:36,feed:80};
  D.ANIMALS.peixe_rei={id:'peixe_rei',name:'Peixe-rei',role:'peixe',color:'#5d99b8',hp:9,speed:1.12,vision:55,attack:18,feed:70};
  D.ANIMALS.jacuting={id:'jacuting',name:'Jacutinga',role:'voador',color:'#252b2c',hp:14,speed:1.04,vision:70,attack:24,feed:76};
  D.ANIMALS.paca={id:'paca',name:'Paca',role:'herbívoro',color:'#806347',hp:18,speed:0.91,vision:50,attack:22,feed:46};
  D.PLANTS={};
  D.PLANTS.acai={id:'acai',name:'Açaí',kind:'árvore',color:'#496f39',durability:25,water:68,growth:1.2};
  D.PLANTS.buriti={id:'buriti',name:'Buriti',kind:'árvore',color:'#4d7d39',durability:28,water:74,growth:1.15};
  D.PLANTS.castanha={id:'castanha',name:'Castanheira',kind:'árvore',color:'#49603b',durability:32,water:78,growth:1.05};
  D.PLANTS.mandacaru={id:'mandacaru',name:'Mandacaru',kind:'cacto',color:'#759451',durability:18,water:18,growth:0.72};
  D.PLANTS.xique={id:'xique',name:'Xique-xique',kind:'cacto',color:'#89a160',durability:15,water:20,growth:0.76};
  D.PLANTS.juazeiro={id:'juazeiro',name:'Juazeiro',kind:'árvore',color:'#59783f',durability:22,water:34,growth:0.94};
  D.PLANTS.pequi={id:'pequi',name:'Pequizeiro',kind:'árvore',color:'#64783b',durability:24,water:48,growth:0.98};
  D.PLANTS.baru={id:'baru',name:'Baruzeiro',kind:'árvore',color:'#657e44',durability:23,water:50,growth:0.96};
  D.PLANTS.ipe={id:'ipe',name:'Ipê',kind:'árvore',color:'#7a6a3e',durability:26,water:55,growth:1.02};
  D.PLANTS.palmito={id:'palmito',name:'Palmito-juçara',kind:'árvore',color:'#46734b',durability:19,water:72,growth:1.0};
  D.PLANTS.pitanga={id:'pitanga',name:'Pitangueira',kind:'arbusto',color:'#657d42',durability:15,water:63,growth:1.1};
  D.PLANTS.samambaia={id:'samambaia',name:'Samambaia',kind:'folhagem',color:'#3c7a4b',durability:8,water:80,growth:1.3};
  D.PLANTS.aguape={id:'aguape',name:'Aguapé',kind:'aquática',color:'#5b9258',durability:10,water:84,growth:1.15};
  D.PLANTS.caranda={id:'caranda',name:'Carandá',kind:'palmeira',color:'#5c7d48',durability:18,water:76,growth:1.07};
  D.PLANTS.butia={id:'butia',name:'Butiá',kind:'palmeira',color:'#718e4e',durability:17,water:52,growth:0.97};
  D.PLANTS.graminea={id:'graminea',name:'Gramínea',kind:'grama',color:'#6f9a4a',durability:5,water:60,growth:1.35};
  D.PLANTS.campo_flora={id:'campo_flora',name:'Flor campestre',kind:'flor',color:'#879d56',durability:6,water:58,growth:1.25};
  D.PLANTS.arbusto={id:'arbusto',name:'Arbusto',kind:'arbusto',color:'#658143',durability:9,water:54,growth:1.18};
  D.RESOURCES={};
  D.RESOURCES.madeira={id:'madeira',name:'Madeira',icon:'🌲',baseValue:12,use:'construção e ferramentas'};
  D.RESOURCES.pedra={id:'pedra',name:'Pedra',icon:'🪨',baseValue:16,use:'abrigos e ferramentas'};
  D.RESOURCES.agua={id:'agua',name:'Água',icon:'💧',baseValue:3,use:'sobrevivência e agricultura'};
  D.RESOURCES.frutas={id:'frutas',name:'Frutas',icon:'🍈',baseValue:6,use:'alimentação'};
  D.RESOURCES.sementes={id:'sementes',name:'Sementes',icon:'🌰',baseValue:5,use:'agricultura'};
  D.RESOURCES.fibras={id:'fibras',name:'Fibras',icon:'🪢',baseValue:4,use:'roupas e estruturas'};
  D.RESOURCES.argila={id:'argila',name:'Argila',icon:'🟤',baseValue:10,use:'cerâmica e construção'};
  D.RESOURCES.minerio={id:'minerio',name:'Minério',icon:'⛏️',baseValue:25,use:'metalurgia'};
  D.RESOURCES.carne={id:'carne',name:'Carne',icon:'🥩',baseValue:18,use:'alimentação'};
  D.RESOURCES.peixe={id:'peixe',name:'Peixe',icon:'🐟',baseValue:14,use:'alimentação'};
  D.BUILDINGS={};
  D.BUILDINGS.shelter={id:'shelter',name:'Abrigo de folhas',wood:35,stone:18,tech:2,desc:'Aumenta descanso e proteção contra clima.'};
  D.BUILDINGS.campfire={id:'campfire',name:'Fogueira',wood:20,stone:8,tech:1,desc:'Aquece a comunidade e afasta predadores noturnos.'};
  D.BUILDINGS.storage={id:'storage',name:'Armazém',wood:50,stone:30,tech:3,desc:'Eleva o limite de recursos armazenados.'};
  D.BUILDINGS.farm={id:'farm',name:'Horta',wood:65,stone:28,tech:4,desc:'Produz sementes e alimento em ciclos.'};
  D.BUILDINGS.fence={id:'fence',name:'Cerca',wood:22,stone:12,tech:1,desc:'Reduz incursões e protege plantações.'};
  D.BUILDINGS.bridge={id:'bridge',name:'Ponte',wood:80,stone:42,tech:5,desc:'Permite atravessar rios com segurança.'};
  D.BUILDINGS.workshop={id:'workshop',name:'Oficina',wood:95,stone:58,tech:6,desc:'Libera ferramentas e produção avançada.'};
  D.BUILDINGS.tower={id:'tower',name:'Torre de vigia',wood:120,stone:75,tech:8,desc:'Aumenta visão territorial e defesa.'};
  D.BUILDINGS.house={id:'house',name:'Casa',wood:130,stone:90,tech:9,desc:'Acomoda famílias e aumenta crescimento populacional.'};
  D.BUILDINGS.dock={id:'dock',name:'Cais',wood:145,stone:75,tech:8,desc:'Amplia pesca e mobilidade aquática.'};
  D.TECHNOLOGIES={};
  D.TECHNOLOGIES.stone={id:'stone',name:'Pedra lascada',cost:0,desc:'Primeiras ferramentas',effects:{"speed":2,"build":4}};
  D.TECHNOLOGIES.tools={id:'tools',name:'Ferramentas compostas',cost:100,desc:'Pedra + fibras',effects:{"build":12,"collect":8}};
  D.TECHNOLOGIES.agriculture={id:'agriculture',name:'Agricultura',cost:180,desc:'Cultivo planejado',effects:{"food":16,"population":4}};
  D.TECHNOLOGIES.pottery={id:'pottery',name:'Cerâmica',cost:260,desc:'Recipientes e armazenamento',effects:{"storage":30,"waterMax":8}};
  D.TECHNOLOGIES.metallurgy={id:'metallurgy',name:'Metalurgia',cost:420,desc:'Liga e ferramentas',effects:{"build":22,"defense":8}};
  D.TECHNOLOGIES.engineering={id:'engineering',name:'Engenharia',cost:650,desc:'Obras e estruturas',effects:{"build":35,"bridge":1}};
  D.TECHNOLOGIES.writing={id:'writing',name:'Registros',cost:900,desc:'Memória e administração',effects:{"culture":24,"research":18}};
  D.TECHNOLOGIES.navigation={id:'navigation',name:'Navegação',cost:1250,desc:'Rotas fluviais e costeiras',effects:{"exploration":30,"swim":10}};
  D.TECHNOLOGIES.medicine={id:'medicine',name:'Práticas de cura',cost:1650,desc:'Menor mortalidade',effects:{"hpMax":18,"fertility":8}};
  D.TECHNOLOGIES.astronomy={id:'astronomy',name:'Astronomia',cost:2200,desc:'Calendários e estações',effects:{"research":30,"weather":12}};
  D.START_GENES={body:'quadruped',color:'#7a9b4c',size:1,speed:48,jump:18,climb:14,dig:8,swim:12,flight:0,vision:52,hearing:38,smell:42,perception:40,hunt:30,collect:38,feed:42,fertrility:45,fertility:45,cold:34,heat:46,drought:35,defense:32,hpMax:100,energyMax:100,waterMax:100,energyDrain:.035,waterDrain:.018,thorns:0,camouflage:0,intelligence:8,social:10,build:0,populationBias:0,rootDepth:0,stem:0,leafArea:0,pollination:0,fruitAppeal:0,seedSpread:0,toxin:0,windSpread:0,growth:50};
  D.TIPS=[
    'Observe água, sombra e distância antes de perseguir uma presa.',
    'Uma mutação boa em um bioma pode ser ruim em outro.',
    'Chuva favorece plantas e reorganiza o mapa de recursos.',
    'Filhotes herdariam tendências dos pais e podem sofrer mutações.',
    'Use o botão de evolução em momentos de segurança.',
    'Fogueiras ajudam no frio, mas atraem atenção.',
    'A agricultura estabiliza o alimento, porém exige água.',
    'Construções deixam uma marca permanente no território.',
    'Quando sua inteligência cresce, a escala passa do indivíduo para a comunidade.',
    'O mundo distante é simulado em blocos para manter o desempenho.',
  ];
  D.PALETTE={text:'#e8f1e3',muted:'#8fa58f',panel:'#0d1a12',panel2:'#122318',line:'#28422d',accent:'#83ca72',gold:'#e3c86e',water:'#63b5d1',danger:'#e07666'};
  D.CODEX=[];
  D.CODEX.push({id:'codex_0001',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0001',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0002',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0002',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0003',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0003',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0004',biome:'mata',subject:'Anta',title:'Registro ecológico 0004',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0005',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0005',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0006',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0006',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0007',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0007',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0008',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0008',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0009',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0009',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0010',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0010',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0011',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0011',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0012',biome:'pampa',subject:'Ema',title:'Registro ecológico 0012',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0013',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0013',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0014',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0014',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0015',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0015',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0016',biome:'mata',subject:'Carcará',title:'Registro ecológico 0016',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0017',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0017',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0018',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0018',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0019',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0019',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0020',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0020',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0021',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0021',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0022',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0022',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0023',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0023',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0024',biome:'pampa',subject:'Paca',title:'Registro ecológico 0024',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0025',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0025',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0026',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0026',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0027',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0027',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0028',biome:'mata',subject:'Anta',title:'Registro ecológico 0028',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0029',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0029',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0030',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0030',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0031',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0031',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0032',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0032',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0033',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0033',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0034',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0034',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0035',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0035',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0036',biome:'pampa',subject:'Ema',title:'Registro ecológico 0036',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0037',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0037',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0038',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0038',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0039',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0039',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0040',biome:'mata',subject:'Carcará',title:'Registro ecológico 0040',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0041',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0041',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0042',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0042',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0043',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0043',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0044',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0044',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0045',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0045',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0046',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0046',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0047',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0047',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0048',biome:'pampa',subject:'Paca',title:'Registro ecológico 0048',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0049',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0049',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0050',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0050',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0051',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0051',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0052',biome:'mata',subject:'Anta',title:'Registro ecológico 0052',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0053',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0053',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0054',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0054',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0055',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0055',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0056',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0056',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0057',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0057',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0058',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0058',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0059',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0059',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0060',biome:'pampa',subject:'Ema',title:'Registro ecológico 0060',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0061',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0061',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0062',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0062',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0063',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0063',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0064',biome:'mata',subject:'Carcará',title:'Registro ecológico 0064',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0065',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0065',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0066',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0066',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0067',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0067',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0068',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0068',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0069',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0069',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0070',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0070',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0071',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0071',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0072',biome:'pampa',subject:'Paca',title:'Registro ecológico 0072',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0073',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0073',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0074',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0074',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0075',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0075',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0076',biome:'mata',subject:'Anta',title:'Registro ecológico 0076',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0077',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0077',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0078',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0078',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0079',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0079',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0080',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0080',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0081',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0081',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0082',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0082',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0083',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0083',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0084',biome:'pampa',subject:'Ema',title:'Registro ecológico 0084',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0085',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0085',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0086',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0086',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0087',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0087',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0088',biome:'mata',subject:'Carcará',title:'Registro ecológico 0088',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0089',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0089',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0090',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0090',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0091',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0091',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0092',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0092',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0093',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0093',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0094',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0094',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0095',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0095',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0096',biome:'pampa',subject:'Paca',title:'Registro ecológico 0096',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0097',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0097',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0098',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0098',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0099',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0099',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0100',biome:'mata',subject:'Anta',title:'Registro ecológico 0100',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0101',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0101',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0102',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0102',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0103',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0103',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0104',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0104',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0105',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0105',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0106',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0106',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0107',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0107',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0108',biome:'pampa',subject:'Ema',title:'Registro ecológico 0108',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0109',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0109',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0110',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0110',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0111',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0111',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0112',biome:'mata',subject:'Carcará',title:'Registro ecológico 0112',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0113',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0113',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0114',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0114',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0115',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0115',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0116',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0116',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0117',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0117',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0118',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0118',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0119',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0119',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0120',biome:'pampa',subject:'Paca',title:'Registro ecológico 0120',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0121',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0121',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0122',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0122',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0123',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0123',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0124',biome:'mata',subject:'Anta',title:'Registro ecológico 0124',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0125',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0125',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0126',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0126',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0127',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0127',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0128',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0128',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0129',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0129',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0130',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0130',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0131',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0131',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0132',biome:'pampa',subject:'Ema',title:'Registro ecológico 0132',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0133',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0133',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0134',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0134',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0135',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0135',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0136',biome:'mata',subject:'Carcará',title:'Registro ecológico 0136',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0137',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0137',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0138',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0138',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0139',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0139',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0140',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0140',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0141',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0141',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0142',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0142',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0143',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0143',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0144',biome:'pampa',subject:'Paca',title:'Registro ecológico 0144',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0145',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0145',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0146',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0146',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0147',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0147',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0148',biome:'mata',subject:'Anta',title:'Registro ecológico 0148',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0149',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0149',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0150',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0150',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0151',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0151',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0152',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0152',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0153',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0153',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0154',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0154',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0155',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0155',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0156',biome:'pampa',subject:'Ema',title:'Registro ecológico 0156',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0157',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0157',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0158',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0158',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0159',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0159',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0160',biome:'mata',subject:'Carcará',title:'Registro ecológico 0160',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0161',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0161',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0162',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0162',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0163',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0163',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0164',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0164',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0165',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0165',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0166',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0166',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0167',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0167',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0168',biome:'pampa',subject:'Paca',title:'Registro ecológico 0168',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0169',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0169',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0170',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0170',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0171',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0171',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0172',biome:'mata',subject:'Anta',title:'Registro ecológico 0172',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0173',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0173',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0174',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0174',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0175',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0175',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0176',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0176',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0177',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0177',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0178',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0178',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0179',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0179',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0180',biome:'pampa',subject:'Ema',title:'Registro ecológico 0180',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0181',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0181',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0182',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0182',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0183',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0183',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0184',biome:'mata',subject:'Carcará',title:'Registro ecológico 0184',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0185',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0185',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0186',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0186',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0187',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0187',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0188',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0188',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0189',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0189',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0190',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0190',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0191',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0191',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0192',biome:'pampa',subject:'Paca',title:'Registro ecológico 0192',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0193',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0193',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0194',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0194',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0195',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0195',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0196',biome:'mata',subject:'Anta',title:'Registro ecológico 0196',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0197',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0197',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0198',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0198',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0199',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0199',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0200',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0200',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0201',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0201',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0202',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0202',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0203',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0203',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0204',biome:'pampa',subject:'Ema',title:'Registro ecológico 0204',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0205',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0205',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0206',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0206',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0207',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0207',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0208',biome:'mata',subject:'Carcará',title:'Registro ecológico 0208',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0209',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0209',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0210',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0210',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0211',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0211',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0212',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0212',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0213',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0213',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0214',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0214',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0215',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0215',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0216',biome:'pampa',subject:'Paca',title:'Registro ecológico 0216',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0217',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0217',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0218',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0218',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0219',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0219',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0220',biome:'mata',subject:'Anta',title:'Registro ecológico 0220',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0221',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0221',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0222',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0222',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0223',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0223',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0224',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0224',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0225',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0225',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0226',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0226',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0227',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0227',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0228',biome:'pampa',subject:'Ema',title:'Registro ecológico 0228',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0229',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0229',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0230',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0230',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0231',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0231',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0232',biome:'mata',subject:'Carcará',title:'Registro ecológico 0232',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0233',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0233',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0234',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0234',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0235',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0235',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0236',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0236',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0237',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0237',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0238',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0238',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0239',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0239',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0240',biome:'pampa',subject:'Paca',title:'Registro ecológico 0240',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0241',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0241',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0242',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0242',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0243',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0243',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0244',biome:'mata',subject:'Anta',title:'Registro ecológico 0244',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0245',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0245',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0246',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0246',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0247',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0247',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0248',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0248',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0249',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0249',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0250',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0250',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0251',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0251',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0252',biome:'pampa',subject:'Ema',title:'Registro ecológico 0252',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0253',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0253',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0254',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0254',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0255',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0255',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0256',biome:'mata',subject:'Carcará',title:'Registro ecológico 0256',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0257',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0257',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0258',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0258',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0259',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0259',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0260',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0260',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0261',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0261',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0262',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0262',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0263',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0263',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0264',biome:'pampa',subject:'Paca',title:'Registro ecológico 0264',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0265',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0265',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0266',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0266',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0267',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0267',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0268',biome:'mata',subject:'Anta',title:'Registro ecológico 0268',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0269',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0269',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0270',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0270',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0271',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0271',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0272',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0272',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0273',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0273',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0274',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0274',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0275',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0275',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0276',biome:'pampa',subject:'Ema',title:'Registro ecológico 0276',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0277',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0277',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0278',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0278',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0279',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0279',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0280',biome:'mata',subject:'Carcará',title:'Registro ecológico 0280',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0281',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0281',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0282',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0282',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0283',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0283',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0284',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0284',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0285',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0285',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0286',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0286',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0287',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0287',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0288',biome:'pampa',subject:'Paca',title:'Registro ecológico 0288',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0289',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0289',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0290',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0290',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0291',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0291',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0292',biome:'mata',subject:'Anta',title:'Registro ecológico 0292',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0293',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0293',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0294',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0294',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0295',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0295',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0296',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0296',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0297',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0297',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0298',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0298',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0299',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0299',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0300',biome:'pampa',subject:'Ema',title:'Registro ecológico 0300',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0301',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0301',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0302',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0302',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0303',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0303',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0304',biome:'mata',subject:'Carcará',title:'Registro ecológico 0304',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0305',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0305',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0306',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0306',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0307',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0307',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0308',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0308',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0309',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0309',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0310',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0310',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0311',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0311',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0312',biome:'pampa',subject:'Paca',title:'Registro ecológico 0312',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0313',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0313',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0314',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0314',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0315',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0315',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0316',biome:'mata',subject:'Anta',title:'Registro ecológico 0316',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0317',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0317',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0318',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0318',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0319',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0319',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0320',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0320',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0321',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0321',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0322',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0322',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0323',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0323',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0324',biome:'pampa',subject:'Ema',title:'Registro ecológico 0324',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0325',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0325',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0326',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0326',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0327',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0327',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0328',biome:'mata',subject:'Carcará',title:'Registro ecológico 0328',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0329',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0329',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0330',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0330',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0331',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0331',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0332',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0332',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0333',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0333',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0334',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0334',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0335',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0335',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0336',biome:'pampa',subject:'Paca',title:'Registro ecológico 0336',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0337',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0337',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0338',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0338',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0339',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0339',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0340',biome:'mata',subject:'Anta',title:'Registro ecológico 0340',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0341',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0341',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0342',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0342',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0343',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0343',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0344',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0344',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0345',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0345',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0346',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0346',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0347',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0347',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0348',biome:'pampa',subject:'Ema',title:'Registro ecológico 0348',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0349',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0349',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0350',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0350',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0351',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0351',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0352',biome:'mata',subject:'Carcará',title:'Registro ecológico 0352',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0353',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0353',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0354',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0354',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0355',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0355',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0356',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0356',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0357',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0357',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0358',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0358',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0359',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0359',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0360',biome:'pampa',subject:'Paca',title:'Registro ecológico 0360',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0361',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0361',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0362',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0362',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0363',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0363',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0364',biome:'mata',subject:'Anta',title:'Registro ecológico 0364',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0365',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0365',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0366',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0366',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0367',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0367',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0368',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0368',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0369',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0369',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0370',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0370',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0371',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0371',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0372',biome:'pampa',subject:'Ema',title:'Registro ecológico 0372',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0373',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0373',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0374',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0374',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0375',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0375',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0376',biome:'mata',subject:'Carcará',title:'Registro ecológico 0376',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0377',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0377',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0378',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0378',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0379',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0379',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0380',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0380',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0381',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0381',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0382',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0382',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0383',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0383',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0384',biome:'pampa',subject:'Paca',title:'Registro ecológico 0384',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0385',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0385',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0386',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0386',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0387',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0387',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0388',biome:'mata',subject:'Anta',title:'Registro ecológico 0388',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0389',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0389',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0390',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0390',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0391',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0391',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0392',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0392',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0393',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0393',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0394',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0394',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0395',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0395',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0396',biome:'pampa',subject:'Ema',title:'Registro ecológico 0396',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0397',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0397',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0398',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0398',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0399',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0399',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0400',biome:'mata',subject:'Carcará',title:'Registro ecológico 0400',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0401',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0401',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0402',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0402',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0403',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0403',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0404',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0404',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0405',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0405',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0406',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0406',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0407',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0407',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0408',biome:'pampa',subject:'Paca',title:'Registro ecológico 0408',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0409',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0409',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0410',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0410',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0411',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0411',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0412',biome:'mata',subject:'Anta',title:'Registro ecológico 0412',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0413',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0413',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0414',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0414',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0415',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0415',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0416',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0416',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0417',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0417',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0418',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0418',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0419',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0419',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0420',biome:'pampa',subject:'Ema',title:'Registro ecológico 0420',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0421',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0421',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0422',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0422',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0423',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0423',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0424',biome:'mata',subject:'Carcará',title:'Registro ecológico 0424',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0425',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0425',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0426',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0426',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0427',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0427',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0428',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0428',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0429',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0429',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0430',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0430',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0431',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0431',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0432',biome:'pampa',subject:'Paca',title:'Registro ecológico 0432',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0433',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0433',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0434',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0434',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0435',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0435',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0436',biome:'mata',subject:'Anta',title:'Registro ecológico 0436',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0437',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0437',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0438',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0438',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0439',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0439',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0440',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0440',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0441',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0441',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0442',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0442',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0443',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0443',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0444',biome:'pampa',subject:'Ema',title:'Registro ecológico 0444',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0445',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0445',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0446',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0446',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0447',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0447',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0448',biome:'mata',subject:'Carcará',title:'Registro ecológico 0448',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0449',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0449',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0450',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0450',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0451',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0451',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0452',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0452',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0453',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0453',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0454',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0454',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0455',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0455',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0456',biome:'pampa',subject:'Paca',title:'Registro ecológico 0456',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0457',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0457',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0458',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0458',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0459',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0459',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0460',biome:'mata',subject:'Anta',title:'Registro ecológico 0460',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0461',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0461',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0462',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0462',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0463',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0463',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0464',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0464',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0465',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0465',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0466',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0466',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0467',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0467',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0468',biome:'pampa',subject:'Ema',title:'Registro ecológico 0468',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0469',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0469',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0470',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0470',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0471',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0471',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0472',biome:'mata',subject:'Carcará',title:'Registro ecológico 0472',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0473',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0473',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0474',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0474',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0475',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0475',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0476',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0476',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0477',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0477',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0478',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0478',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0479',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0479',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0480',biome:'pampa',subject:'Paca',title:'Registro ecológico 0480',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0481',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0481',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0482',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0482',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0483',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0483',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0484',biome:'mata',subject:'Anta',title:'Registro ecológico 0484',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0485',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0485',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0486',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0486',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0487',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0487',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0488',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0488',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0489',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0489',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0490',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0490',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0491',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0491',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0492',biome:'pampa',subject:'Ema',title:'Registro ecológico 0492',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0493',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0493',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0494',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0494',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0495',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0495',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0496',biome:'mata',subject:'Carcará',title:'Registro ecológico 0496',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0497',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0497',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0498',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0498',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0499',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0499',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0500',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0500',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0501',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0501',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0502',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0502',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0503',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0503',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0504',biome:'pampa',subject:'Paca',title:'Registro ecológico 0504',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0505',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0505',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0506',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0506',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0507',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0507',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0508',biome:'mata',subject:'Anta',title:'Registro ecológico 0508',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0509',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0509',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0510',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0510',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0511',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0511',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0512',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0512',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0513',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0513',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0514',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0514',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0515',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0515',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0516',biome:'pampa',subject:'Ema',title:'Registro ecológico 0516',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0517',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0517',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0518',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0518',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0519',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0519',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0520',biome:'mata',subject:'Carcará',title:'Registro ecológico 0520',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0521',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0521',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0522',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0522',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0523',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0523',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0524',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0524',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0525',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0525',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0526',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0526',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0527',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0527',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0528',biome:'pampa',subject:'Paca',title:'Registro ecológico 0528',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0529',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0529',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0530',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0530',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0531',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0531',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0532',biome:'mata',subject:'Anta',title:'Registro ecológico 0532',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0533',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0533',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0534',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0534',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0535',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0535',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0536',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0536',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0537',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0537',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0538',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0538',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0539',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0539',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0540',biome:'pampa',subject:'Ema',title:'Registro ecológico 0540',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0541',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0541',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0542',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0542',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0543',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0543',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0544',biome:'mata',subject:'Carcará',title:'Registro ecológico 0544',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0545',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0545',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0546',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0546',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0547',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0547',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0548',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0548',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0549',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0549',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0550',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0550',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0551',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0551',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0552',biome:'pampa',subject:'Paca',title:'Registro ecológico 0552',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0553',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0553',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0554',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0554',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0555',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0555',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0556',biome:'mata',subject:'Anta',title:'Registro ecológico 0556',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0557',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0557',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0558',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0558',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0559',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0559',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0560',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0560',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0561',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0561',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0562',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0562',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0563',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0563',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0564',biome:'pampa',subject:'Ema',title:'Registro ecológico 0564',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0565',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0565',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0566',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0566',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0567',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0567',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0568',biome:'mata',subject:'Carcará',title:'Registro ecológico 0568',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0569',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0569',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0570',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0570',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0571',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0571',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0572',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0572',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0573',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0573',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0574',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0574',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0575',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0575',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0576',biome:'pampa',subject:'Paca',title:'Registro ecológico 0576',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0577',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0577',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0578',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0578',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0579',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0579',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0580',biome:'mata',subject:'Anta',title:'Registro ecológico 0580',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0581',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0581',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0582',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0582',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0583',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0583',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0584',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0584',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0585',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0585',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0586',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0586',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0587',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0587',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0588',biome:'pampa',subject:'Ema',title:'Registro ecológico 0588',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0589',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0589',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0590',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0590',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0591',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0591',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0592',biome:'mata',subject:'Carcará',title:'Registro ecológico 0592',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0593',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0593',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0594',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0594',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0595',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0595',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0596',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0596',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0597',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0597',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0598',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0598',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0599',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0599',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0600',biome:'pampa',subject:'Paca',title:'Registro ecológico 0600',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0601',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0601',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0602',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0602',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0603',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0603',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0604',biome:'mata',subject:'Anta',title:'Registro ecológico 0604',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0605',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0605',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0606',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0606',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0607',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0607',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0608',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0608',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0609',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0609',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0610',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0610',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0611',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0611',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0612',biome:'pampa',subject:'Ema',title:'Registro ecológico 0612',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0613',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0613',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0614',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0614',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0615',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0615',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0616',biome:'mata',subject:'Carcará',title:'Registro ecológico 0616',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0617',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0617',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0618',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0618',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0619',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0619',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0620',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0620',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0621',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0621',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0622',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0622',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0623',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0623',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0624',biome:'pampa',subject:'Paca',title:'Registro ecológico 0624',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0625',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0625',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0626',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0626',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0627',biome:'cerrado',subject:'Tamanduá-bandeira',title:'Registro ecológico 0627',note:'Tamanduá-bandeira participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0628',biome:'mata',subject:'Anta',title:'Registro ecológico 0628',note:'Anta participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0629',biome:'pantanal',subject:'Capivara',title:'Registro ecológico 0629',note:'Capivara participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0630',biome:'pampa',subject:'Tatu',title:'Registro ecológico 0630',note:'Tatu participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0631',biome:'amazonia',subject:'Arara',title:'Registro ecológico 0631',note:'Arara participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0632',biome:'caatinga',subject:'Tucano',title:'Registro ecológico 0632',note:'Tucano participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0633',biome:'cerrado',subject:'Jacaré',title:'Registro ecológico 0633',note:'Jacaré participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0634',biome:'mata',subject:'Ariranha',title:'Registro ecológico 0634',note:'Ariranha participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0635',biome:'pantanal',subject:'Veado-campeiro',title:'Registro ecológico 0635',note:'Veado-campeiro participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0636',biome:'pampa',subject:'Ema',title:'Registro ecológico 0636',note:'Ema participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0637',biome:'amazonia',subject:'Quati',title:'Registro ecológico 0637',note:'Quati participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0638',biome:'caatinga',subject:'Mico-leão',title:'Registro ecológico 0638',note:'Mico-leão participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0639',biome:'cerrado',subject:'Sapo',title:'Registro ecológico 0639',note:'Sapo participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0640',biome:'mata',subject:'Carcará',title:'Registro ecológico 0640',note:'Carcará participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0641',biome:'pantanal',subject:'Gavião',title:'Registro ecológico 0641',note:'Gavião participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0642',biome:'pampa',subject:'Graxaim-do-campo',title:'Registro ecológico 0642',note:'Graxaim-do-campo participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0643',biome:'amazonia',subject:'Preá',title:'Registro ecológico 0643',note:'Preá participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0644',biome:'caatinga',subject:'Lagarto',title:'Registro ecológico 0644',note:'Lagarto participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0645',biome:'cerrado',subject:'Tuiuiú',title:'Registro ecológico 0645',note:'Tuiuiú participa da dinâmica de Cerrado; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0646',biome:'mata',subject:'Peixe-rei',title:'Registro ecológico 0646',note:'Peixe-rei participa da dinâmica de Mata Atlântica; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0647',biome:'pantanal',subject:'Jacutinga',title:'Registro ecológico 0647',note:'Jacutinga participa da dinâmica de Pantanal; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0648',biome:'pampa',subject:'Paca',title:'Registro ecológico 0648',note:'Paca participa da dinâmica de Pampa; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0649',biome:'amazonia',subject:'Onça-pintada',title:'Registro ecológico 0649',note:'Onça-pintada participa da dinâmica de Amazônia; observe seus horários, alimentação e relação com o clima.'});
  D.CODEX.push({id:'codex_0650',biome:'caatinga',subject:'Lobo-guará',title:'Registro ecológico 0650',note:'Lobo-guará participa da dinâmica de Caatinga; observe seus horários, alimentação e relação com o clima.'});
  D.OBSERVATIONS=[];
  D.OBSERVATIONS.push({id:'obs_0001',
    biome:'amazonia', subject:'onca', plant:'acai',
    season:1, waterPressure:7,
    predationPressure:11, foodPressure:13,
    fieldNote:'Onça-pintada responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0002',
    biome:'caatinga', subject:'lobo_guara', plant:'buriti',
    season:2, waterPressure:14,
    predationPressure:22, foodPressure:26,
    fieldNote:'Lobo-guará responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0003',
    biome:'cerrado', subject:'tamandua', plant:'castanha',
    season:3, waterPressure:21,
    predationPressure:33, foodPressure:39,
    fieldNote:'Tamanduá-bandeira responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0004',
    biome:'mata', subject:'anta', plant:'mandacaru',
    season:4, waterPressure:28,
    predationPressure:44, foodPressure:52,
    fieldNote:'Anta responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0005',
    biome:'pantanal', subject:'capivara', plant:'xique',
    season:1, waterPressure:35,
    predationPressure:55, foodPressure:65,
    fieldNote:'Capivara responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0006',
    biome:'pampa', subject:'tatu', plant:'juazeiro',
    season:2, waterPressure:42,
    predationPressure:66, foodPressure:78,
    fieldNote:'Tatu responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0007',
    biome:'amazonia', subject:'arara', plant:'pequi',
    season:3, waterPressure:49,
    predationPressure:77, foodPressure:91,
    fieldNote:'Arara responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0008',
    biome:'caatinga', subject:'tucano', plant:'baru',
    season:4, waterPressure:56,
    predationPressure:88, foodPressure:4,
    fieldNote:'Tucano responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0009',
    biome:'cerrado', subject:'jacare', plant:'ipe',
    season:1, waterPressure:63,
    predationPressure:99, foodPressure:17,
    fieldNote:'Jacaré responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0010',
    biome:'mata', subject:'ariranha', plant:'palmito',
    season:2, waterPressure:70,
    predationPressure:10, foodPressure:30,
    fieldNote:'Ariranha responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0011',
    biome:'pantanal', subject:'veado', plant:'pitanga',
    season:3, waterPressure:77,
    predationPressure:21, foodPressure:43,
    fieldNote:'Veado-campeiro responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0012',
    biome:'pampa', subject:'ema', plant:'samambaia',
    season:4, waterPressure:84,
    predationPressure:32, foodPressure:56,
    fieldNote:'Ema responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0013',
    biome:'amazonia', subject:'quati', plant:'aguape',
    season:1, waterPressure:91,
    predationPressure:43, foodPressure:69,
    fieldNote:'Quati responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0014',
    biome:'caatinga', subject:'mico', plant:'caranda',
    season:2, waterPressure:98,
    predationPressure:54, foodPressure:82,
    fieldNote:'Mico-leão responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0015',
    biome:'cerrado', subject:'sapo', plant:'butia',
    season:3, waterPressure:5,
    predationPressure:65, foodPressure:95,
    fieldNote:'Sapo responde às condições de Cerrado; Butiá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0016',
    biome:'mata', subject:'carcara', plant:'graminea',
    season:4, waterPressure:12,
    predationPressure:76, foodPressure:8,
    fieldNote:'Carcará responde às condições de Mata Atlântica; Gramínea é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0017',
    biome:'pantanal', subject:'gavião', plant:'campo_flora',
    season:1, waterPressure:19,
    predationPressure:87, foodPressure:21,
    fieldNote:'Gavião responde às condições de Pantanal; Flor campestre é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0018',
    biome:'pampa', subject:'graxaim', plant:'arbusto',
    season:2, waterPressure:26,
    predationPressure:98, foodPressure:34,
    fieldNote:'Graxaim-do-campo responde às condições de Pampa; Arbusto é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0019',
    biome:'amazonia', subject:'prea', plant:'acai',
    season:3, waterPressure:33,
    predationPressure:9, foodPressure:47,
    fieldNote:'Preá responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0020',
    biome:'caatinga', subject:'lagarto', plant:'buriti',
    season:4, waterPressure:40,
    predationPressure:20, foodPressure:60,
    fieldNote:'Lagarto responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0021',
    biome:'cerrado', subject:'tuiuiu', plant:'castanha',
    season:1, waterPressure:47,
    predationPressure:31, foodPressure:73,
    fieldNote:'Tuiuiú responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0022',
    biome:'mata', subject:'peixe_rei', plant:'mandacaru',
    season:2, waterPressure:54,
    predationPressure:42, foodPressure:86,
    fieldNote:'Peixe-rei responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0023',
    biome:'pantanal', subject:'jacuting', plant:'xique',
    season:3, waterPressure:61,
    predationPressure:53, foodPressure:99,
    fieldNote:'Jacutinga responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0024',
    biome:'pampa', subject:'paca', plant:'juazeiro',
    season:4, waterPressure:68,
    predationPressure:64, foodPressure:12,
    fieldNote:'Paca responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0025',
    biome:'amazonia', subject:'onca', plant:'pequi',
    season:1, waterPressure:75,
    predationPressure:75, foodPressure:25,
    fieldNote:'Onça-pintada responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0026',
    biome:'caatinga', subject:'lobo_guara', plant:'baru',
    season:2, waterPressure:82,
    predationPressure:86, foodPressure:38,
    fieldNote:'Lobo-guará responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0027',
    biome:'cerrado', subject:'tamandua', plant:'ipe',
    season:3, waterPressure:89,
    predationPressure:97, foodPressure:51,
    fieldNote:'Tamanduá-bandeira responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0028',
    biome:'mata', subject:'anta', plant:'palmito',
    season:4, waterPressure:96,
    predationPressure:8, foodPressure:64,
    fieldNote:'Anta responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0029',
    biome:'pantanal', subject:'capivara', plant:'pitanga',
    season:1, waterPressure:3,
    predationPressure:19, foodPressure:77,
    fieldNote:'Capivara responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0030',
    biome:'pampa', subject:'tatu', plant:'samambaia',
    season:2, waterPressure:10,
    predationPressure:30, foodPressure:90,
    fieldNote:'Tatu responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0031',
    biome:'amazonia', subject:'arara', plant:'aguape',
    season:3, waterPressure:17,
    predationPressure:41, foodPressure:3,
    fieldNote:'Arara responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0032',
    biome:'caatinga', subject:'tucano', plant:'caranda',
    season:4, waterPressure:24,
    predationPressure:52, foodPressure:16,
    fieldNote:'Tucano responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0033',
    biome:'cerrado', subject:'jacare', plant:'butia',
    season:1, waterPressure:31,
    predationPressure:63, foodPressure:29,
    fieldNote:'Jacaré responde às condições de Cerrado; Butiá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0034',
    biome:'mata', subject:'ariranha', plant:'graminea',
    season:2, waterPressure:38,
    predationPressure:74, foodPressure:42,
    fieldNote:'Ariranha responde às condições de Mata Atlântica; Gramínea é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0035',
    biome:'pantanal', subject:'veado', plant:'campo_flora',
    season:3, waterPressure:45,
    predationPressure:85, foodPressure:55,
    fieldNote:'Veado-campeiro responde às condições de Pantanal; Flor campestre é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0036',
    biome:'pampa', subject:'ema', plant:'arbusto',
    season:4, waterPressure:52,
    predationPressure:96, foodPressure:68,
    fieldNote:'Ema responde às condições de Pampa; Arbusto é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0037',
    biome:'amazonia', subject:'quati', plant:'acai',
    season:1, waterPressure:59,
    predationPressure:7, foodPressure:81,
    fieldNote:'Quati responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0038',
    biome:'caatinga', subject:'mico', plant:'buriti',
    season:2, waterPressure:66,
    predationPressure:18, foodPressure:94,
    fieldNote:'Mico-leão responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0039',
    biome:'cerrado', subject:'sapo', plant:'castanha',
    season:3, waterPressure:73,
    predationPressure:29, foodPressure:7,
    fieldNote:'Sapo responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0040',
    biome:'mata', subject:'carcara', plant:'mandacaru',
    season:4, waterPressure:80,
    predationPressure:40, foodPressure:20,
    fieldNote:'Carcará responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0041',
    biome:'pantanal', subject:'gavião', plant:'xique',
    season:1, waterPressure:87,
    predationPressure:51, foodPressure:33,
    fieldNote:'Gavião responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0042',
    biome:'pampa', subject:'graxaim', plant:'juazeiro',
    season:2, waterPressure:94,
    predationPressure:62, foodPressure:46,
    fieldNote:'Graxaim-do-campo responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0043',
    biome:'amazonia', subject:'prea', plant:'pequi',
    season:3, waterPressure:1,
    predationPressure:73, foodPressure:59,
    fieldNote:'Preá responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0044',
    biome:'caatinga', subject:'lagarto', plant:'baru',
    season:4, waterPressure:8,
    predationPressure:84, foodPressure:72,
    fieldNote:'Lagarto responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0045',
    biome:'cerrado', subject:'tuiuiu', plant:'ipe',
    season:1, waterPressure:15,
    predationPressure:95, foodPressure:85,
    fieldNote:'Tuiuiú responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0046',
    biome:'mata', subject:'peixe_rei', plant:'palmito',
    season:2, waterPressure:22,
    predationPressure:6, foodPressure:98,
    fieldNote:'Peixe-rei responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0047',
    biome:'pantanal', subject:'jacuting', plant:'pitanga',
    season:3, waterPressure:29,
    predationPressure:17, foodPressure:11,
    fieldNote:'Jacutinga responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0048',
    biome:'pampa', subject:'paca', plant:'samambaia',
    season:4, waterPressure:36,
    predationPressure:28, foodPressure:24,
    fieldNote:'Paca responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0049',
    biome:'amazonia', subject:'onca', plant:'aguape',
    season:1, waterPressure:43,
    predationPressure:39, foodPressure:37,
    fieldNote:'Onça-pintada responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0050',
    biome:'caatinga', subject:'lobo_guara', plant:'caranda',
    season:2, waterPressure:50,
    predationPressure:50, foodPressure:50,
    fieldNote:'Lobo-guará responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0051',
    biome:'cerrado', subject:'tamandua', plant:'butia',
    season:3, waterPressure:57,
    predationPressure:61, foodPressure:63,
    fieldNote:'Tamanduá-bandeira responde às condições de Cerrado; Butiá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0052',
    biome:'mata', subject:'anta', plant:'graminea',
    season:4, waterPressure:64,
    predationPressure:72, foodPressure:76,
    fieldNote:'Anta responde às condições de Mata Atlântica; Gramínea é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0053',
    biome:'pantanal', subject:'capivara', plant:'campo_flora',
    season:1, waterPressure:71,
    predationPressure:83, foodPressure:89,
    fieldNote:'Capivara responde às condições de Pantanal; Flor campestre é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0054',
    biome:'pampa', subject:'tatu', plant:'arbusto',
    season:2, waterPressure:78,
    predationPressure:94, foodPressure:2,
    fieldNote:'Tatu responde às condições de Pampa; Arbusto é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0055',
    biome:'amazonia', subject:'arara', plant:'acai',
    season:3, waterPressure:85,
    predationPressure:5, foodPressure:15,
    fieldNote:'Arara responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0056',
    biome:'caatinga', subject:'tucano', plant:'buriti',
    season:4, waterPressure:92,
    predationPressure:16, foodPressure:28,
    fieldNote:'Tucano responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0057',
    biome:'cerrado', subject:'jacare', plant:'castanha',
    season:1, waterPressure:99,
    predationPressure:27, foodPressure:41,
    fieldNote:'Jacaré responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0058',
    biome:'mata', subject:'ariranha', plant:'mandacaru',
    season:2, waterPressure:6,
    predationPressure:38, foodPressure:54,
    fieldNote:'Ariranha responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0059',
    biome:'pantanal', subject:'veado', plant:'xique',
    season:3, waterPressure:13,
    predationPressure:49, foodPressure:67,
    fieldNote:'Veado-campeiro responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0060',
    biome:'pampa', subject:'ema', plant:'juazeiro',
    season:4, waterPressure:20,
    predationPressure:60, foodPressure:80,
    fieldNote:'Ema responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0061',
    biome:'amazonia', subject:'quati', plant:'pequi',
    season:1, waterPressure:27,
    predationPressure:71, foodPressure:93,
    fieldNote:'Quati responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0062',
    biome:'caatinga', subject:'mico', plant:'baru',
    season:2, waterPressure:34,
    predationPressure:82, foodPressure:6,
    fieldNote:'Mico-leão responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0063',
    biome:'cerrado', subject:'sapo', plant:'ipe',
    season:3, waterPressure:41,
    predationPressure:93, foodPressure:19,
    fieldNote:'Sapo responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0064',
    biome:'mata', subject:'carcara', plant:'palmito',
    season:4, waterPressure:48,
    predationPressure:4, foodPressure:32,
    fieldNote:'Carcará responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0065',
    biome:'pantanal', subject:'gavião', plant:'pitanga',
    season:1, waterPressure:55,
    predationPressure:15, foodPressure:45,
    fieldNote:'Gavião responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0066',
    biome:'pampa', subject:'graxaim', plant:'samambaia',
    season:2, waterPressure:62,
    predationPressure:26, foodPressure:58,
    fieldNote:'Graxaim-do-campo responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0067',
    biome:'amazonia', subject:'prea', plant:'aguape',
    season:3, waterPressure:69,
    predationPressure:37, foodPressure:71,
    fieldNote:'Preá responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0068',
    biome:'caatinga', subject:'lagarto', plant:'caranda',
    season:4, waterPressure:76,
    predationPressure:48, foodPressure:84,
    fieldNote:'Lagarto responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0069',
    biome:'cerrado', subject:'tuiuiu', plant:'butia',
    season:1, waterPressure:83,
    predationPressure:59, foodPressure:97,
    fieldNote:'Tuiuiú responde às condições de Cerrado; Butiá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0070',
    biome:'mata', subject:'peixe_rei', plant:'graminea',
    season:2, waterPressure:90,
    predationPressure:70, foodPressure:10,
    fieldNote:'Peixe-rei responde às condições de Mata Atlântica; Gramínea é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0071',
    biome:'pantanal', subject:'jacuting', plant:'campo_flora',
    season:3, waterPressure:97,
    predationPressure:81, foodPressure:23,
    fieldNote:'Jacutinga responde às condições de Pantanal; Flor campestre é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0072',
    biome:'pampa', subject:'paca', plant:'arbusto',
    season:4, waterPressure:4,
    predationPressure:92, foodPressure:36,
    fieldNote:'Paca responde às condições de Pampa; Arbusto é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0073',
    biome:'amazonia', subject:'onca', plant:'acai',
    season:1, waterPressure:11,
    predationPressure:3, foodPressure:49,
    fieldNote:'Onça-pintada responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0074',
    biome:'caatinga', subject:'lobo_guara', plant:'buriti',
    season:2, waterPressure:18,
    predationPressure:14, foodPressure:62,
    fieldNote:'Lobo-guará responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0075',
    biome:'cerrado', subject:'tamandua', plant:'castanha',
    season:3, waterPressure:25,
    predationPressure:25, foodPressure:75,
    fieldNote:'Tamanduá-bandeira responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0076',
    biome:'mata', subject:'anta', plant:'mandacaru',
    season:4, waterPressure:32,
    predationPressure:36, foodPressure:88,
    fieldNote:'Anta responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0077',
    biome:'pantanal', subject:'capivara', plant:'xique',
    season:1, waterPressure:39,
    predationPressure:47, foodPressure:1,
    fieldNote:'Capivara responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0078',
    biome:'pampa', subject:'tatu', plant:'juazeiro',
    season:2, waterPressure:46,
    predationPressure:58, foodPressure:14,
    fieldNote:'Tatu responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0079',
    biome:'amazonia', subject:'arara', plant:'pequi',
    season:3, waterPressure:53,
    predationPressure:69, foodPressure:27,
    fieldNote:'Arara responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0080',
    biome:'caatinga', subject:'tucano', plant:'baru',
    season:4, waterPressure:60,
    predationPressure:80, foodPressure:40,
    fieldNote:'Tucano responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0081',
    biome:'cerrado', subject:'jacare', plant:'ipe',
    season:1, waterPressure:67,
    predationPressure:91, foodPressure:53,
    fieldNote:'Jacaré responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0082',
    biome:'mata', subject:'ariranha', plant:'palmito',
    season:2, waterPressure:74,
    predationPressure:2, foodPressure:66,
    fieldNote:'Ariranha responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0083',
    biome:'pantanal', subject:'veado', plant:'pitanga',
    season:3, waterPressure:81,
    predationPressure:13, foodPressure:79,
    fieldNote:'Veado-campeiro responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0084',
    biome:'pampa', subject:'ema', plant:'samambaia',
    season:4, waterPressure:88,
    predationPressure:24, foodPressure:92,
    fieldNote:'Ema responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0085',
    biome:'amazonia', subject:'quati', plant:'aguape',
    season:1, waterPressure:95,
    predationPressure:35, foodPressure:5,
    fieldNote:'Quati responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0086',
    biome:'caatinga', subject:'mico', plant:'caranda',
    season:2, waterPressure:2,
    predationPressure:46, foodPressure:18,
    fieldNote:'Mico-leão responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0087',
    biome:'cerrado', subject:'sapo', plant:'butia',
    season:3, waterPressure:9,
    predationPressure:57, foodPressure:31,
    fieldNote:'Sapo responde às condições de Cerrado; Butiá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0088',
    biome:'mata', subject:'carcara', plant:'graminea',
    season:4, waterPressure:16,
    predationPressure:68, foodPressure:44,
    fieldNote:'Carcará responde às condições de Mata Atlântica; Gramínea é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0089',
    biome:'pantanal', subject:'gavião', plant:'campo_flora',
    season:1, waterPressure:23,
    predationPressure:79, foodPressure:57,
    fieldNote:'Gavião responde às condições de Pantanal; Flor campestre é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0090',
    biome:'pampa', subject:'graxaim', plant:'arbusto',
    season:2, waterPressure:30,
    predationPressure:90, foodPressure:70,
    fieldNote:'Graxaim-do-campo responde às condições de Pampa; Arbusto é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0091',
    biome:'amazonia', subject:'prea', plant:'acai',
    season:3, waterPressure:37,
    predationPressure:1, foodPressure:83,
    fieldNote:'Preá responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0092',
    biome:'caatinga', subject:'lagarto', plant:'buriti',
    season:4, waterPressure:44,
    predationPressure:12, foodPressure:96,
    fieldNote:'Lagarto responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0093',
    biome:'cerrado', subject:'tuiuiu', plant:'castanha',
    season:1, waterPressure:51,
    predationPressure:23, foodPressure:9,
    fieldNote:'Tuiuiú responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0094',
    biome:'mata', subject:'peixe_rei', plant:'mandacaru',
    season:2, waterPressure:58,
    predationPressure:34, foodPressure:22,
    fieldNote:'Peixe-rei responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0095',
    biome:'pantanal', subject:'jacuting', plant:'xique',
    season:3, waterPressure:65,
    predationPressure:45, foodPressure:35,
    fieldNote:'Jacutinga responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0096',
    biome:'pampa', subject:'paca', plant:'juazeiro',
    season:4, waterPressure:72,
    predationPressure:56, foodPressure:48,
    fieldNote:'Paca responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0097',
    biome:'amazonia', subject:'onca', plant:'pequi',
    season:1, waterPressure:79,
    predationPressure:67, foodPressure:61,
    fieldNote:'Onça-pintada responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0098',
    biome:'caatinga', subject:'lobo_guara', plant:'baru',
    season:2, waterPressure:86,
    predationPressure:78, foodPressure:74,
    fieldNote:'Lobo-guará responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0099',
    biome:'cerrado', subject:'tamandua', plant:'ipe',
    season:3, waterPressure:93,
    predationPressure:89, foodPressure:87,
    fieldNote:'Tamanduá-bandeira responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0100',
    biome:'mata', subject:'anta', plant:'palmito',
    season:4, waterPressure:0,
    predationPressure:0, foodPressure:0,
    fieldNote:'Anta responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0101',
    biome:'pantanal', subject:'capivara', plant:'pitanga',
    season:1, waterPressure:7,
    predationPressure:11, foodPressure:13,
    fieldNote:'Capivara responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0102',
    biome:'pampa', subject:'tatu', plant:'samambaia',
    season:2, waterPressure:14,
    predationPressure:22, foodPressure:26,
    fieldNote:'Tatu responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0103',
    biome:'amazonia', subject:'arara', plant:'aguape',
    season:3, waterPressure:21,
    predationPressure:33, foodPressure:39,
    fieldNote:'Arara responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0104',
    biome:'caatinga', subject:'tucano', plant:'caranda',
    season:4, waterPressure:28,
    predationPressure:44, foodPressure:52,
    fieldNote:'Tucano responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0105',
    biome:'cerrado', subject:'jacare', plant:'butia',
    season:1, waterPressure:35,
    predationPressure:55, foodPressure:65,
    fieldNote:'Jacaré responde às condições de Cerrado; Butiá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0106',
    biome:'mata', subject:'ariranha', plant:'graminea',
    season:2, waterPressure:42,
    predationPressure:66, foodPressure:78,
    fieldNote:'Ariranha responde às condições de Mata Atlântica; Gramínea é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0107',
    biome:'pantanal', subject:'veado', plant:'campo_flora',
    season:3, waterPressure:49,
    predationPressure:77, foodPressure:91,
    fieldNote:'Veado-campeiro responde às condições de Pantanal; Flor campestre é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0108',
    biome:'pampa', subject:'ema', plant:'arbusto',
    season:4, waterPressure:56,
    predationPressure:88, foodPressure:4,
    fieldNote:'Ema responde às condições de Pampa; Arbusto é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0109',
    biome:'amazonia', subject:'quati', plant:'acai',
    season:1, waterPressure:63,
    predationPressure:99, foodPressure:17,
    fieldNote:'Quati responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0110',
    biome:'caatinga', subject:'mico', plant:'buriti',
    season:2, waterPressure:70,
    predationPressure:10, foodPressure:30,
    fieldNote:'Mico-leão responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0111',
    biome:'cerrado', subject:'sapo', plant:'castanha',
    season:3, waterPressure:77,
    predationPressure:21, foodPressure:43,
    fieldNote:'Sapo responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0112',
    biome:'mata', subject:'carcara', plant:'mandacaru',
    season:4, waterPressure:84,
    predationPressure:32, foodPressure:56,
    fieldNote:'Carcará responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0113',
    biome:'pantanal', subject:'gavião', plant:'xique',
    season:1, waterPressure:91,
    predationPressure:43, foodPressure:69,
    fieldNote:'Gavião responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0114',
    biome:'pampa', subject:'graxaim', plant:'juazeiro',
    season:2, waterPressure:98,
    predationPressure:54, foodPressure:82,
    fieldNote:'Graxaim-do-campo responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0115',
    biome:'amazonia', subject:'prea', plant:'pequi',
    season:3, waterPressure:5,
    predationPressure:65, foodPressure:95,
    fieldNote:'Preá responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0116',
    biome:'caatinga', subject:'lagarto', plant:'baru',
    season:4, waterPressure:12,
    predationPressure:76, foodPressure:8,
    fieldNote:'Lagarto responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0117',
    biome:'cerrado', subject:'tuiuiu', plant:'ipe',
    season:1, waterPressure:19,
    predationPressure:87, foodPressure:21,
    fieldNote:'Tuiuiú responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0118',
    biome:'mata', subject:'peixe_rei', plant:'palmito',
    season:2, waterPressure:26,
    predationPressure:98, foodPressure:34,
    fieldNote:'Peixe-rei responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0119',
    biome:'pantanal', subject:'jacuting', plant:'pitanga',
    season:3, waterPressure:33,
    predationPressure:9, foodPressure:47,
    fieldNote:'Jacutinga responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0120',
    biome:'pampa', subject:'paca', plant:'samambaia',
    season:4, waterPressure:40,
    predationPressure:20, foodPressure:60,
    fieldNote:'Paca responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0121',
    biome:'amazonia', subject:'onca', plant:'aguape',
    season:1, waterPressure:47,
    predationPressure:31, foodPressure:73,
    fieldNote:'Onça-pintada responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0122',
    biome:'caatinga', subject:'lobo_guara', plant:'caranda',
    season:2, waterPressure:54,
    predationPressure:42, foodPressure:86,
    fieldNote:'Lobo-guará responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0123',
    biome:'cerrado', subject:'tamandua', plant:'butia',
    season:3, waterPressure:61,
    predationPressure:53, foodPressure:99,
    fieldNote:'Tamanduá-bandeira responde às condições de Cerrado; Butiá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0124',
    biome:'mata', subject:'anta', plant:'graminea',
    season:4, waterPressure:68,
    predationPressure:64, foodPressure:12,
    fieldNote:'Anta responde às condições de Mata Atlântica; Gramínea é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0125',
    biome:'pantanal', subject:'capivara', plant:'campo_flora',
    season:1, waterPressure:75,
    predationPressure:75, foodPressure:25,
    fieldNote:'Capivara responde às condições de Pantanal; Flor campestre é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0126',
    biome:'pampa', subject:'tatu', plant:'arbusto',
    season:2, waterPressure:82,
    predationPressure:86, foodPressure:38,
    fieldNote:'Tatu responde às condições de Pampa; Arbusto é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0127',
    biome:'amazonia', subject:'arara', plant:'acai',
    season:3, waterPressure:89,
    predationPressure:97, foodPressure:51,
    fieldNote:'Arara responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0128',
    biome:'caatinga', subject:'tucano', plant:'buriti',
    season:4, waterPressure:96,
    predationPressure:8, foodPressure:64,
    fieldNote:'Tucano responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0129',
    biome:'cerrado', subject:'jacare', plant:'castanha',
    season:1, waterPressure:3,
    predationPressure:19, foodPressure:77,
    fieldNote:'Jacaré responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0130',
    biome:'mata', subject:'ariranha', plant:'mandacaru',
    season:2, waterPressure:10,
    predationPressure:30, foodPressure:90,
    fieldNote:'Ariranha responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0131',
    biome:'pantanal', subject:'veado', plant:'xique',
    season:3, waterPressure:17,
    predationPressure:41, foodPressure:3,
    fieldNote:'Veado-campeiro responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0132',
    biome:'pampa', subject:'ema', plant:'juazeiro',
    season:4, waterPressure:24,
    predationPressure:52, foodPressure:16,
    fieldNote:'Ema responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0133',
    biome:'amazonia', subject:'quati', plant:'pequi',
    season:1, waterPressure:31,
    predationPressure:63, foodPressure:29,
    fieldNote:'Quati responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0134',
    biome:'caatinga', subject:'mico', plant:'baru',
    season:2, waterPressure:38,
    predationPressure:74, foodPressure:42,
    fieldNote:'Mico-leão responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0135',
    biome:'cerrado', subject:'sapo', plant:'ipe',
    season:3, waterPressure:45,
    predationPressure:85, foodPressure:55,
    fieldNote:'Sapo responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0136',
    biome:'mata', subject:'carcara', plant:'palmito',
    season:4, waterPressure:52,
    predationPressure:96, foodPressure:68,
    fieldNote:'Carcará responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0137',
    biome:'pantanal', subject:'gavião', plant:'pitanga',
    season:1, waterPressure:59,
    predationPressure:7, foodPressure:81,
    fieldNote:'Gavião responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0138',
    biome:'pampa', subject:'graxaim', plant:'samambaia',
    season:2, waterPressure:66,
    predationPressure:18, foodPressure:94,
    fieldNote:'Graxaim-do-campo responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0139',
    biome:'amazonia', subject:'prea', plant:'aguape',
    season:3, waterPressure:73,
    predationPressure:29, foodPressure:7,
    fieldNote:'Preá responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0140',
    biome:'caatinga', subject:'lagarto', plant:'caranda',
    season:4, waterPressure:80,
    predationPressure:40, foodPressure:20,
    fieldNote:'Lagarto responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0141',
    biome:'cerrado', subject:'tuiuiu', plant:'butia',
    season:1, waterPressure:87,
    predationPressure:51, foodPressure:33,
    fieldNote:'Tuiuiú responde às condições de Cerrado; Butiá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0142',
    biome:'mata', subject:'peixe_rei', plant:'graminea',
    season:2, waterPressure:94,
    predationPressure:62, foodPressure:46,
    fieldNote:'Peixe-rei responde às condições de Mata Atlântica; Gramínea é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0143',
    biome:'pantanal', subject:'jacuting', plant:'campo_flora',
    season:3, waterPressure:1,
    predationPressure:73, foodPressure:59,
    fieldNote:'Jacutinga responde às condições de Pantanal; Flor campestre é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0144',
    biome:'pampa', subject:'paca', plant:'arbusto',
    season:4, waterPressure:8,
    predationPressure:84, foodPressure:72,
    fieldNote:'Paca responde às condições de Pampa; Arbusto é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0145',
    biome:'amazonia', subject:'onca', plant:'acai',
    season:1, waterPressure:15,
    predationPressure:95, foodPressure:85,
    fieldNote:'Onça-pintada responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0146',
    biome:'caatinga', subject:'lobo_guara', plant:'buriti',
    season:2, waterPressure:22,
    predationPressure:6, foodPressure:98,
    fieldNote:'Lobo-guará responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0147',
    biome:'cerrado', subject:'tamandua', plant:'castanha',
    season:3, waterPressure:29,
    predationPressure:17, foodPressure:11,
    fieldNote:'Tamanduá-bandeira responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0148',
    biome:'mata', subject:'anta', plant:'mandacaru',
    season:4, waterPressure:36,
    predationPressure:28, foodPressure:24,
    fieldNote:'Anta responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0149',
    biome:'pantanal', subject:'capivara', plant:'xique',
    season:1, waterPressure:43,
    predationPressure:39, foodPressure:37,
    fieldNote:'Capivara responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0150',
    biome:'pampa', subject:'tatu', plant:'juazeiro',
    season:2, waterPressure:50,
    predationPressure:50, foodPressure:50,
    fieldNote:'Tatu responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0151',
    biome:'amazonia', subject:'arara', plant:'pequi',
    season:3, waterPressure:57,
    predationPressure:61, foodPressure:63,
    fieldNote:'Arara responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0152',
    biome:'caatinga', subject:'tucano', plant:'baru',
    season:4, waterPressure:64,
    predationPressure:72, foodPressure:76,
    fieldNote:'Tucano responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0153',
    biome:'cerrado', subject:'jacare', plant:'ipe',
    season:1, waterPressure:71,
    predationPressure:83, foodPressure:89,
    fieldNote:'Jacaré responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0154',
    biome:'mata', subject:'ariranha', plant:'palmito',
    season:2, waterPressure:78,
    predationPressure:94, foodPressure:2,
    fieldNote:'Ariranha responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0155',
    biome:'pantanal', subject:'veado', plant:'pitanga',
    season:3, waterPressure:85,
    predationPressure:5, foodPressure:15,
    fieldNote:'Veado-campeiro responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0156',
    biome:'pampa', subject:'ema', plant:'samambaia',
    season:4, waterPressure:92,
    predationPressure:16, foodPressure:28,
    fieldNote:'Ema responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0157',
    biome:'amazonia', subject:'quati', plant:'aguape',
    season:1, waterPressure:99,
    predationPressure:27, foodPressure:41,
    fieldNote:'Quati responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0158',
    biome:'caatinga', subject:'mico', plant:'caranda',
    season:2, waterPressure:6,
    predationPressure:38, foodPressure:54,
    fieldNote:'Mico-leão responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0159',
    biome:'cerrado', subject:'sapo', plant:'butia',
    season:3, waterPressure:13,
    predationPressure:49, foodPressure:67,
    fieldNote:'Sapo responde às condições de Cerrado; Butiá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0160',
    biome:'mata', subject:'carcara', plant:'graminea',
    season:4, waterPressure:20,
    predationPressure:60, foodPressure:80,
    fieldNote:'Carcará responde às condições de Mata Atlântica; Gramínea é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0161',
    biome:'pantanal', subject:'gavião', plant:'campo_flora',
    season:1, waterPressure:27,
    predationPressure:71, foodPressure:93,
    fieldNote:'Gavião responde às condições de Pantanal; Flor campestre é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0162',
    biome:'pampa', subject:'graxaim', plant:'arbusto',
    season:2, waterPressure:34,
    predationPressure:82, foodPressure:6,
    fieldNote:'Graxaim-do-campo responde às condições de Pampa; Arbusto é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0163',
    biome:'amazonia', subject:'prea', plant:'acai',
    season:3, waterPressure:41,
    predationPressure:93, foodPressure:19,
    fieldNote:'Preá responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0164',
    biome:'caatinga', subject:'lagarto', plant:'buriti',
    season:4, waterPressure:48,
    predationPressure:4, foodPressure:32,
    fieldNote:'Lagarto responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0165',
    biome:'cerrado', subject:'tuiuiu', plant:'castanha',
    season:1, waterPressure:55,
    predationPressure:15, foodPressure:45,
    fieldNote:'Tuiuiú responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0166',
    biome:'mata', subject:'peixe_rei', plant:'mandacaru',
    season:2, waterPressure:62,
    predationPressure:26, foodPressure:58,
    fieldNote:'Peixe-rei responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0167',
    biome:'pantanal', subject:'jacuting', plant:'xique',
    season:3, waterPressure:69,
    predationPressure:37, foodPressure:71,
    fieldNote:'Jacutinga responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0168',
    biome:'pampa', subject:'paca', plant:'juazeiro',
    season:4, waterPressure:76,
    predationPressure:48, foodPressure:84,
    fieldNote:'Paca responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0169',
    biome:'amazonia', subject:'onca', plant:'pequi',
    season:1, waterPressure:83,
    predationPressure:59, foodPressure:97,
    fieldNote:'Onça-pintada responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0170',
    biome:'caatinga', subject:'lobo_guara', plant:'baru',
    season:2, waterPressure:90,
    predationPressure:70, foodPressure:10,
    fieldNote:'Lobo-guará responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0171',
    biome:'cerrado', subject:'tamandua', plant:'ipe',
    season:3, waterPressure:97,
    predationPressure:81, foodPressure:23,
    fieldNote:'Tamanduá-bandeira responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0172',
    biome:'mata', subject:'anta', plant:'palmito',
    season:4, waterPressure:4,
    predationPressure:92, foodPressure:36,
    fieldNote:'Anta responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0173',
    biome:'pantanal', subject:'capivara', plant:'pitanga',
    season:1, waterPressure:11,
    predationPressure:3, foodPressure:49,
    fieldNote:'Capivara responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0174',
    biome:'pampa', subject:'tatu', plant:'samambaia',
    season:2, waterPressure:18,
    predationPressure:14, foodPressure:62,
    fieldNote:'Tatu responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0175',
    biome:'amazonia', subject:'arara', plant:'aguape',
    season:3, waterPressure:25,
    predationPressure:25, foodPressure:75,
    fieldNote:'Arara responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0176',
    biome:'caatinga', subject:'tucano', plant:'caranda',
    season:4, waterPressure:32,
    predationPressure:36, foodPressure:88,
    fieldNote:'Tucano responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0177',
    biome:'cerrado', subject:'jacare', plant:'butia',
    season:1, waterPressure:39,
    predationPressure:47, foodPressure:1,
    fieldNote:'Jacaré responde às condições de Cerrado; Butiá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0178',
    biome:'mata', subject:'ariranha', plant:'graminea',
    season:2, waterPressure:46,
    predationPressure:58, foodPressure:14,
    fieldNote:'Ariranha responde às condições de Mata Atlântica; Gramínea é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0179',
    biome:'pantanal', subject:'veado', plant:'campo_flora',
    season:3, waterPressure:53,
    predationPressure:69, foodPressure:27,
    fieldNote:'Veado-campeiro responde às condições de Pantanal; Flor campestre é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0180',
    biome:'pampa', subject:'ema', plant:'arbusto',
    season:4, waterPressure:60,
    predationPressure:80, foodPressure:40,
    fieldNote:'Ema responde às condições de Pampa; Arbusto é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0181',
    biome:'amazonia', subject:'quati', plant:'acai',
    season:1, waterPressure:67,
    predationPressure:91, foodPressure:53,
    fieldNote:'Quati responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0182',
    biome:'caatinga', subject:'mico', plant:'buriti',
    season:2, waterPressure:74,
    predationPressure:2, foodPressure:66,
    fieldNote:'Mico-leão responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0183',
    biome:'cerrado', subject:'sapo', plant:'castanha',
    season:3, waterPressure:81,
    predationPressure:13, foodPressure:79,
    fieldNote:'Sapo responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0184',
    biome:'mata', subject:'carcara', plant:'mandacaru',
    season:4, waterPressure:88,
    predationPressure:24, foodPressure:92,
    fieldNote:'Carcará responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0185',
    biome:'pantanal', subject:'gavião', plant:'xique',
    season:1, waterPressure:95,
    predationPressure:35, foodPressure:5,
    fieldNote:'Gavião responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0186',
    biome:'pampa', subject:'graxaim', plant:'juazeiro',
    season:2, waterPressure:2,
    predationPressure:46, foodPressure:18,
    fieldNote:'Graxaim-do-campo responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0187',
    biome:'amazonia', subject:'prea', plant:'pequi',
    season:3, waterPressure:9,
    predationPressure:57, foodPressure:31,
    fieldNote:'Preá responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0188',
    biome:'caatinga', subject:'lagarto', plant:'baru',
    season:4, waterPressure:16,
    predationPressure:68, foodPressure:44,
    fieldNote:'Lagarto responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0189',
    biome:'cerrado', subject:'tuiuiu', plant:'ipe',
    season:1, waterPressure:23,
    predationPressure:79, foodPressure:57,
    fieldNote:'Tuiuiú responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0190',
    biome:'mata', subject:'peixe_rei', plant:'palmito',
    season:2, waterPressure:30,
    predationPressure:90, foodPressure:70,
    fieldNote:'Peixe-rei responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0191',
    biome:'pantanal', subject:'jacuting', plant:'pitanga',
    season:3, waterPressure:37,
    predationPressure:1, foodPressure:83,
    fieldNote:'Jacutinga responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0192',
    biome:'pampa', subject:'paca', plant:'samambaia',
    season:4, waterPressure:44,
    predationPressure:12, foodPressure:96,
    fieldNote:'Paca responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0193',
    biome:'amazonia', subject:'onca', plant:'aguape',
    season:1, waterPressure:51,
    predationPressure:23, foodPressure:9,
    fieldNote:'Onça-pintada responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0194',
    biome:'caatinga', subject:'lobo_guara', plant:'caranda',
    season:2, waterPressure:58,
    predationPressure:34, foodPressure:22,
    fieldNote:'Lobo-guará responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0195',
    biome:'cerrado', subject:'tamandua', plant:'butia',
    season:3, waterPressure:65,
    predationPressure:45, foodPressure:35,
    fieldNote:'Tamanduá-bandeira responde às condições de Cerrado; Butiá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0196',
    biome:'mata', subject:'anta', plant:'graminea',
    season:4, waterPressure:72,
    predationPressure:56, foodPressure:48,
    fieldNote:'Anta responde às condições de Mata Atlântica; Gramínea é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0197',
    biome:'pantanal', subject:'capivara', plant:'campo_flora',
    season:1, waterPressure:79,
    predationPressure:67, foodPressure:61,
    fieldNote:'Capivara responde às condições de Pantanal; Flor campestre é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0198',
    biome:'pampa', subject:'tatu', plant:'arbusto',
    season:2, waterPressure:86,
    predationPressure:78, foodPressure:74,
    fieldNote:'Tatu responde às condições de Pampa; Arbusto é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0199',
    biome:'amazonia', subject:'arara', plant:'acai',
    season:3, waterPressure:93,
    predationPressure:89, foodPressure:87,
    fieldNote:'Arara responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0200',
    biome:'caatinga', subject:'tucano', plant:'buriti',
    season:4, waterPressure:0,
    predationPressure:0, foodPressure:0,
    fieldNote:'Tucano responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0201',
    biome:'cerrado', subject:'jacare', plant:'castanha',
    season:1, waterPressure:7,
    predationPressure:11, foodPressure:13,
    fieldNote:'Jacaré responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0202',
    biome:'mata', subject:'ariranha', plant:'mandacaru',
    season:2, waterPressure:14,
    predationPressure:22, foodPressure:26,
    fieldNote:'Ariranha responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0203',
    biome:'pantanal', subject:'veado', plant:'xique',
    season:3, waterPressure:21,
    predationPressure:33, foodPressure:39,
    fieldNote:'Veado-campeiro responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0204',
    biome:'pampa', subject:'ema', plant:'juazeiro',
    season:4, waterPressure:28,
    predationPressure:44, foodPressure:52,
    fieldNote:'Ema responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0205',
    biome:'amazonia', subject:'quati', plant:'pequi',
    season:1, waterPressure:35,
    predationPressure:55, foodPressure:65,
    fieldNote:'Quati responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0206',
    biome:'caatinga', subject:'mico', plant:'baru',
    season:2, waterPressure:42,
    predationPressure:66, foodPressure:78,
    fieldNote:'Mico-leão responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0207',
    biome:'cerrado', subject:'sapo', plant:'ipe',
    season:3, waterPressure:49,
    predationPressure:77, foodPressure:91,
    fieldNote:'Sapo responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0208',
    biome:'mata', subject:'carcara', plant:'palmito',
    season:4, waterPressure:56,
    predationPressure:88, foodPressure:4,
    fieldNote:'Carcará responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0209',
    biome:'pantanal', subject:'gavião', plant:'pitanga',
    season:1, waterPressure:63,
    predationPressure:99, foodPressure:17,
    fieldNote:'Gavião responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0210',
    biome:'pampa', subject:'graxaim', plant:'samambaia',
    season:2, waterPressure:70,
    predationPressure:10, foodPressure:30,
    fieldNote:'Graxaim-do-campo responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0211',
    biome:'amazonia', subject:'prea', plant:'aguape',
    season:3, waterPressure:77,
    predationPressure:21, foodPressure:43,
    fieldNote:'Preá responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0212',
    biome:'caatinga', subject:'lagarto', plant:'caranda',
    season:4, waterPressure:84,
    predationPressure:32, foodPressure:56,
    fieldNote:'Lagarto responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0213',
    biome:'cerrado', subject:'tuiuiu', plant:'butia',
    season:1, waterPressure:91,
    predationPressure:43, foodPressure:69,
    fieldNote:'Tuiuiú responde às condições de Cerrado; Butiá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0214',
    biome:'mata', subject:'peixe_rei', plant:'graminea',
    season:2, waterPressure:98,
    predationPressure:54, foodPressure:82,
    fieldNote:'Peixe-rei responde às condições de Mata Atlântica; Gramínea é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0215',
    biome:'pantanal', subject:'jacuting', plant:'campo_flora',
    season:3, waterPressure:5,
    predationPressure:65, foodPressure:95,
    fieldNote:'Jacutinga responde às condições de Pantanal; Flor campestre é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0216',
    biome:'pampa', subject:'paca', plant:'arbusto',
    season:4, waterPressure:12,
    predationPressure:76, foodPressure:8,
    fieldNote:'Paca responde às condições de Pampa; Arbusto é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0217',
    biome:'amazonia', subject:'onca', plant:'acai',
    season:1, waterPressure:19,
    predationPressure:87, foodPressure:21,
    fieldNote:'Onça-pintada responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0218',
    biome:'caatinga', subject:'lobo_guara', plant:'buriti',
    season:2, waterPressure:26,
    predationPressure:98, foodPressure:34,
    fieldNote:'Lobo-guará responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0219',
    biome:'cerrado', subject:'tamandua', plant:'castanha',
    season:3, waterPressure:33,
    predationPressure:9, foodPressure:47,
    fieldNote:'Tamanduá-bandeira responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0220',
    biome:'mata', subject:'anta', plant:'mandacaru',
    season:4, waterPressure:40,
    predationPressure:20, foodPressure:60,
    fieldNote:'Anta responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0221',
    biome:'pantanal', subject:'capivara', plant:'xique',
    season:1, waterPressure:47,
    predationPressure:31, foodPressure:73,
    fieldNote:'Capivara responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0222',
    biome:'pampa', subject:'tatu', plant:'juazeiro',
    season:2, waterPressure:54,
    predationPressure:42, foodPressure:86,
    fieldNote:'Tatu responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0223',
    biome:'amazonia', subject:'arara', plant:'pequi',
    season:3, waterPressure:61,
    predationPressure:53, foodPressure:99,
    fieldNote:'Arara responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0224',
    biome:'caatinga', subject:'tucano', plant:'baru',
    season:4, waterPressure:68,
    predationPressure:64, foodPressure:12,
    fieldNote:'Tucano responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0225',
    biome:'cerrado', subject:'jacare', plant:'ipe',
    season:1, waterPressure:75,
    predationPressure:75, foodPressure:25,
    fieldNote:'Jacaré responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0226',
    biome:'mata', subject:'ariranha', plant:'palmito',
    season:2, waterPressure:82,
    predationPressure:86, foodPressure:38,
    fieldNote:'Ariranha responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0227',
    biome:'pantanal', subject:'veado', plant:'pitanga',
    season:3, waterPressure:89,
    predationPressure:97, foodPressure:51,
    fieldNote:'Veado-campeiro responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0228',
    biome:'pampa', subject:'ema', plant:'samambaia',
    season:4, waterPressure:96,
    predationPressure:8, foodPressure:64,
    fieldNote:'Ema responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0229',
    biome:'amazonia', subject:'quati', plant:'aguape',
    season:1, waterPressure:3,
    predationPressure:19, foodPressure:77,
    fieldNote:'Quati responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0230',
    biome:'caatinga', subject:'mico', plant:'caranda',
    season:2, waterPressure:10,
    predationPressure:30, foodPressure:90,
    fieldNote:'Mico-leão responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0231',
    biome:'cerrado', subject:'sapo', plant:'butia',
    season:3, waterPressure:17,
    predationPressure:41, foodPressure:3,
    fieldNote:'Sapo responde às condições de Cerrado; Butiá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0232',
    biome:'mata', subject:'carcara', plant:'graminea',
    season:4, waterPressure:24,
    predationPressure:52, foodPressure:16,
    fieldNote:'Carcará responde às condições de Mata Atlântica; Gramínea é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0233',
    biome:'pantanal', subject:'gavião', plant:'campo_flora',
    season:1, waterPressure:31,
    predationPressure:63, foodPressure:29,
    fieldNote:'Gavião responde às condições de Pantanal; Flor campestre é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0234',
    biome:'pampa', subject:'graxaim', plant:'arbusto',
    season:2, waterPressure:38,
    predationPressure:74, foodPressure:42,
    fieldNote:'Graxaim-do-campo responde às condições de Pampa; Arbusto é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0235',
    biome:'amazonia', subject:'prea', plant:'acai',
    season:3, waterPressure:45,
    predationPressure:85, foodPressure:55,
    fieldNote:'Preá responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0236',
    biome:'caatinga', subject:'lagarto', plant:'buriti',
    season:4, waterPressure:52,
    predationPressure:96, foodPressure:68,
    fieldNote:'Lagarto responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0237',
    biome:'cerrado', subject:'tuiuiu', plant:'castanha',
    season:1, waterPressure:59,
    predationPressure:7, foodPressure:81,
    fieldNote:'Tuiuiú responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0238',
    biome:'mata', subject:'peixe_rei', plant:'mandacaru',
    season:2, waterPressure:66,
    predationPressure:18, foodPressure:94,
    fieldNote:'Peixe-rei responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0239',
    biome:'pantanal', subject:'jacuting', plant:'xique',
    season:3, waterPressure:73,
    predationPressure:29, foodPressure:7,
    fieldNote:'Jacutinga responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0240',
    biome:'pampa', subject:'paca', plant:'juazeiro',
    season:4, waterPressure:80,
    predationPressure:40, foodPressure:20,
    fieldNote:'Paca responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0241',
    biome:'amazonia', subject:'onca', plant:'pequi',
    season:1, waterPressure:87,
    predationPressure:51, foodPressure:33,
    fieldNote:'Onça-pintada responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0242',
    biome:'caatinga', subject:'lobo_guara', plant:'baru',
    season:2, waterPressure:94,
    predationPressure:62, foodPressure:46,
    fieldNote:'Lobo-guará responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0243',
    biome:'cerrado', subject:'tamandua', plant:'ipe',
    season:3, waterPressure:1,
    predationPressure:73, foodPressure:59,
    fieldNote:'Tamanduá-bandeira responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0244',
    biome:'mata', subject:'anta', plant:'palmito',
    season:4, waterPressure:8,
    predationPressure:84, foodPressure:72,
    fieldNote:'Anta responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0245',
    biome:'pantanal', subject:'capivara', plant:'pitanga',
    season:1, waterPressure:15,
    predationPressure:95, foodPressure:85,
    fieldNote:'Capivara responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0246',
    biome:'pampa', subject:'tatu', plant:'samambaia',
    season:2, waterPressure:22,
    predationPressure:6, foodPressure:98,
    fieldNote:'Tatu responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0247',
    biome:'amazonia', subject:'arara', plant:'aguape',
    season:3, waterPressure:29,
    predationPressure:17, foodPressure:11,
    fieldNote:'Arara responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0248',
    biome:'caatinga', subject:'tucano', plant:'caranda',
    season:4, waterPressure:36,
    predationPressure:28, foodPressure:24,
    fieldNote:'Tucano responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0249',
    biome:'cerrado', subject:'jacare', plant:'butia',
    season:1, waterPressure:43,
    predationPressure:39, foodPressure:37,
    fieldNote:'Jacaré responde às condições de Cerrado; Butiá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0250',
    biome:'mata', subject:'ariranha', plant:'graminea',
    season:2, waterPressure:50,
    predationPressure:50, foodPressure:50,
    fieldNote:'Ariranha responde às condições de Mata Atlântica; Gramínea é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0251',
    biome:'pantanal', subject:'veado', plant:'campo_flora',
    season:3, waterPressure:57,
    predationPressure:61, foodPressure:63,
    fieldNote:'Veado-campeiro responde às condições de Pantanal; Flor campestre é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0252',
    biome:'pampa', subject:'ema', plant:'arbusto',
    season:4, waterPressure:64,
    predationPressure:72, foodPressure:76,
    fieldNote:'Ema responde às condições de Pampa; Arbusto é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0253',
    biome:'amazonia', subject:'quati', plant:'acai',
    season:1, waterPressure:71,
    predationPressure:83, foodPressure:89,
    fieldNote:'Quati responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0254',
    biome:'caatinga', subject:'mico', plant:'buriti',
    season:2, waterPressure:78,
    predationPressure:94, foodPressure:2,
    fieldNote:'Mico-leão responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0255',
    biome:'cerrado', subject:'sapo', plant:'castanha',
    season:3, waterPressure:85,
    predationPressure:5, foodPressure:15,
    fieldNote:'Sapo responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0256',
    biome:'mata', subject:'carcara', plant:'mandacaru',
    season:4, waterPressure:92,
    predationPressure:16, foodPressure:28,
    fieldNote:'Carcará responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0257',
    biome:'pantanal', subject:'gavião', plant:'xique',
    season:1, waterPressure:99,
    predationPressure:27, foodPressure:41,
    fieldNote:'Gavião responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0258',
    biome:'pampa', subject:'graxaim', plant:'juazeiro',
    season:2, waterPressure:6,
    predationPressure:38, foodPressure:54,
    fieldNote:'Graxaim-do-campo responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0259',
    biome:'amazonia', subject:'prea', plant:'pequi',
    season:3, waterPressure:13,
    predationPressure:49, foodPressure:67,
    fieldNote:'Preá responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0260',
    biome:'caatinga', subject:'lagarto', plant:'baru',
    season:4, waterPressure:20,
    predationPressure:60, foodPressure:80,
    fieldNote:'Lagarto responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0261',
    biome:'cerrado', subject:'tuiuiu', plant:'ipe',
    season:1, waterPressure:27,
    predationPressure:71, foodPressure:93,
    fieldNote:'Tuiuiú responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0262',
    biome:'mata', subject:'peixe_rei', plant:'palmito',
    season:2, waterPressure:34,
    predationPressure:82, foodPressure:6,
    fieldNote:'Peixe-rei responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0263',
    biome:'pantanal', subject:'jacuting', plant:'pitanga',
    season:3, waterPressure:41,
    predationPressure:93, foodPressure:19,
    fieldNote:'Jacutinga responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0264',
    biome:'pampa', subject:'paca', plant:'samambaia',
    season:4, waterPressure:48,
    predationPressure:4, foodPressure:32,
    fieldNote:'Paca responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0265',
    biome:'amazonia', subject:'onca', plant:'aguape',
    season:1, waterPressure:55,
    predationPressure:15, foodPressure:45,
    fieldNote:'Onça-pintada responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0266',
    biome:'caatinga', subject:'lobo_guara', plant:'caranda',
    season:2, waterPressure:62,
    predationPressure:26, foodPressure:58,
    fieldNote:'Lobo-guará responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0267',
    biome:'cerrado', subject:'tamandua', plant:'butia',
    season:3, waterPressure:69,
    predationPressure:37, foodPressure:71,
    fieldNote:'Tamanduá-bandeira responde às condições de Cerrado; Butiá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0268',
    biome:'mata', subject:'anta', plant:'graminea',
    season:4, waterPressure:76,
    predationPressure:48, foodPressure:84,
    fieldNote:'Anta responde às condições de Mata Atlântica; Gramínea é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0269',
    biome:'pantanal', subject:'capivara', plant:'campo_flora',
    season:1, waterPressure:83,
    predationPressure:59, foodPressure:97,
    fieldNote:'Capivara responde às condições de Pantanal; Flor campestre é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0270',
    biome:'pampa', subject:'tatu', plant:'arbusto',
    season:2, waterPressure:90,
    predationPressure:70, foodPressure:10,
    fieldNote:'Tatu responde às condições de Pampa; Arbusto é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0271',
    biome:'amazonia', subject:'arara', plant:'acai',
    season:3, waterPressure:97,
    predationPressure:81, foodPressure:23,
    fieldNote:'Arara responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0272',
    biome:'caatinga', subject:'tucano', plant:'buriti',
    season:4, waterPressure:4,
    predationPressure:92, foodPressure:36,
    fieldNote:'Tucano responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0273',
    biome:'cerrado', subject:'jacare', plant:'castanha',
    season:1, waterPressure:11,
    predationPressure:3, foodPressure:49,
    fieldNote:'Jacaré responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0274',
    biome:'mata', subject:'ariranha', plant:'mandacaru',
    season:2, waterPressure:18,
    predationPressure:14, foodPressure:62,
    fieldNote:'Ariranha responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0275',
    biome:'pantanal', subject:'veado', plant:'xique',
    season:3, waterPressure:25,
    predationPressure:25, foodPressure:75,
    fieldNote:'Veado-campeiro responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0276',
    biome:'pampa', subject:'ema', plant:'juazeiro',
    season:4, waterPressure:32,
    predationPressure:36, foodPressure:88,
    fieldNote:'Ema responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0277',
    biome:'amazonia', subject:'quati', plant:'pequi',
    season:1, waterPressure:39,
    predationPressure:47, foodPressure:1,
    fieldNote:'Quati responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0278',
    biome:'caatinga', subject:'mico', plant:'baru',
    season:2, waterPressure:46,
    predationPressure:58, foodPressure:14,
    fieldNote:'Mico-leão responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0279',
    biome:'cerrado', subject:'sapo', plant:'ipe',
    season:3, waterPressure:53,
    predationPressure:69, foodPressure:27,
    fieldNote:'Sapo responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0280',
    biome:'mata', subject:'carcara', plant:'palmito',
    season:4, waterPressure:60,
    predationPressure:80, foodPressure:40,
    fieldNote:'Carcará responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0281',
    biome:'pantanal', subject:'gavião', plant:'pitanga',
    season:1, waterPressure:67,
    predationPressure:91, foodPressure:53,
    fieldNote:'Gavião responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0282',
    biome:'pampa', subject:'graxaim', plant:'samambaia',
    season:2, waterPressure:74,
    predationPressure:2, foodPressure:66,
    fieldNote:'Graxaim-do-campo responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0283',
    biome:'amazonia', subject:'prea', plant:'aguape',
    season:3, waterPressure:81,
    predationPressure:13, foodPressure:79,
    fieldNote:'Preá responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0284',
    biome:'caatinga', subject:'lagarto', plant:'caranda',
    season:4, waterPressure:88,
    predationPressure:24, foodPressure:92,
    fieldNote:'Lagarto responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0285',
    biome:'cerrado', subject:'tuiuiu', plant:'butia',
    season:1, waterPressure:95,
    predationPressure:35, foodPressure:5,
    fieldNote:'Tuiuiú responde às condições de Cerrado; Butiá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0286',
    biome:'mata', subject:'peixe_rei', plant:'graminea',
    season:2, waterPressure:2,
    predationPressure:46, foodPressure:18,
    fieldNote:'Peixe-rei responde às condições de Mata Atlântica; Gramínea é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0287',
    biome:'pantanal', subject:'jacuting', plant:'campo_flora',
    season:3, waterPressure:9,
    predationPressure:57, foodPressure:31,
    fieldNote:'Jacutinga responde às condições de Pantanal; Flor campestre é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0288',
    biome:'pampa', subject:'paca', plant:'arbusto',
    season:4, waterPressure:16,
    predationPressure:68, foodPressure:44,
    fieldNote:'Paca responde às condições de Pampa; Arbusto é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0289',
    biome:'amazonia', subject:'onca', plant:'acai',
    season:1, waterPressure:23,
    predationPressure:79, foodPressure:57,
    fieldNote:'Onça-pintada responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0290',
    biome:'caatinga', subject:'lobo_guara', plant:'buriti',
    season:2, waterPressure:30,
    predationPressure:90, foodPressure:70,
    fieldNote:'Lobo-guará responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0291',
    biome:'cerrado', subject:'tamandua', plant:'castanha',
    season:3, waterPressure:37,
    predationPressure:1, foodPressure:83,
    fieldNote:'Tamanduá-bandeira responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0292',
    biome:'mata', subject:'anta', plant:'mandacaru',
    season:4, waterPressure:44,
    predationPressure:12, foodPressure:96,
    fieldNote:'Anta responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0293',
    biome:'pantanal', subject:'capivara', plant:'xique',
    season:1, waterPressure:51,
    predationPressure:23, foodPressure:9,
    fieldNote:'Capivara responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0294',
    biome:'pampa', subject:'tatu', plant:'juazeiro',
    season:2, waterPressure:58,
    predationPressure:34, foodPressure:22,
    fieldNote:'Tatu responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0295',
    biome:'amazonia', subject:'arara', plant:'pequi',
    season:3, waterPressure:65,
    predationPressure:45, foodPressure:35,
    fieldNote:'Arara responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0296',
    biome:'caatinga', subject:'tucano', plant:'baru',
    season:4, waterPressure:72,
    predationPressure:56, foodPressure:48,
    fieldNote:'Tucano responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0297',
    biome:'cerrado', subject:'jacare', plant:'ipe',
    season:1, waterPressure:79,
    predationPressure:67, foodPressure:61,
    fieldNote:'Jacaré responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0298',
    biome:'mata', subject:'ariranha', plant:'palmito',
    season:2, waterPressure:86,
    predationPressure:78, foodPressure:74,
    fieldNote:'Ariranha responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0299',
    biome:'pantanal', subject:'veado', plant:'pitanga',
    season:3, waterPressure:93,
    predationPressure:89, foodPressure:87,
    fieldNote:'Veado-campeiro responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0300',
    biome:'pampa', subject:'ema', plant:'samambaia',
    season:4, waterPressure:0,
    predationPressure:0, foodPressure:0,
    fieldNote:'Ema responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0301',
    biome:'amazonia', subject:'quati', plant:'aguape',
    season:1, waterPressure:7,
    predationPressure:11, foodPressure:13,
    fieldNote:'Quati responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0302',
    biome:'caatinga', subject:'mico', plant:'caranda',
    season:2, waterPressure:14,
    predationPressure:22, foodPressure:26,
    fieldNote:'Mico-leão responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0303',
    biome:'cerrado', subject:'sapo', plant:'butia',
    season:3, waterPressure:21,
    predationPressure:33, foodPressure:39,
    fieldNote:'Sapo responde às condições de Cerrado; Butiá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0304',
    biome:'mata', subject:'carcara', plant:'graminea',
    season:4, waterPressure:28,
    predationPressure:44, foodPressure:52,
    fieldNote:'Carcará responde às condições de Mata Atlântica; Gramínea é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0305',
    biome:'pantanal', subject:'gavião', plant:'campo_flora',
    season:1, waterPressure:35,
    predationPressure:55, foodPressure:65,
    fieldNote:'Gavião responde às condições de Pantanal; Flor campestre é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0306',
    biome:'pampa', subject:'graxaim', plant:'arbusto',
    season:2, waterPressure:42,
    predationPressure:66, foodPressure:78,
    fieldNote:'Graxaim-do-campo responde às condições de Pampa; Arbusto é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0307',
    biome:'amazonia', subject:'prea', plant:'acai',
    season:3, waterPressure:49,
    predationPressure:77, foodPressure:91,
    fieldNote:'Preá responde às condições de Amazônia; Açaí é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0308',
    biome:'caatinga', subject:'lagarto', plant:'buriti',
    season:4, waterPressure:56,
    predationPressure:88, foodPressure:4,
    fieldNote:'Lagarto responde às condições de Caatinga; Buriti é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0309',
    biome:'cerrado', subject:'tuiuiu', plant:'castanha',
    season:1, waterPressure:63,
    predationPressure:99, foodPressure:17,
    fieldNote:'Tuiuiú responde às condições de Cerrado; Castanheira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0310',
    biome:'mata', subject:'peixe_rei', plant:'mandacaru',
    season:2, waterPressure:70,
    predationPressure:10, foodPressure:30,
    fieldNote:'Peixe-rei responde às condições de Mata Atlântica; Mandacaru é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0311',
    biome:'pantanal', subject:'jacuting', plant:'xique',
    season:3, waterPressure:77,
    predationPressure:21, foodPressure:43,
    fieldNote:'Jacutinga responde às condições de Pantanal; Xique-xique é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0312',
    biome:'pampa', subject:'paca', plant:'juazeiro',
    season:4, waterPressure:84,
    predationPressure:32, foodPressure:56,
    fieldNote:'Paca responde às condições de Pampa; Juazeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0313',
    biome:'amazonia', subject:'onca', plant:'pequi',
    season:1, waterPressure:91,
    predationPressure:43, foodPressure:69,
    fieldNote:'Onça-pintada responde às condições de Amazônia; Pequizeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0314',
    biome:'caatinga', subject:'lobo_guara', plant:'baru',
    season:2, waterPressure:98,
    predationPressure:54, foodPressure:82,
    fieldNote:'Lobo-guará responde às condições de Caatinga; Baruzeiro é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0315',
    biome:'cerrado', subject:'tamandua', plant:'ipe',
    season:3, waterPressure:5,
    predationPressure:65, foodPressure:95,
    fieldNote:'Tamanduá-bandeira responde às condições de Cerrado; Ipê é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0316',
    biome:'mata', subject:'anta', plant:'palmito',
    season:4, waterPressure:12,
    predationPressure:76, foodPressure:8,
    fieldNote:'Anta responde às condições de Mata Atlântica; Palmito-juçara é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0317',
    biome:'pantanal', subject:'capivara', plant:'pitanga',
    season:1, waterPressure:19,
    predationPressure:87, foodPressure:21,
    fieldNote:'Capivara responde às condições de Pantanal; Pitangueira é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0318',
    biome:'pampa', subject:'tatu', plant:'samambaia',
    season:2, waterPressure:26,
    predationPressure:98, foodPressure:34,
    fieldNote:'Tatu responde às condições de Pampa; Samambaia é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0319',
    biome:'amazonia', subject:'arara', plant:'aguape',
    season:3, waterPressure:33,
    predationPressure:9, foodPressure:47,
    fieldNote:'Arara responde às condições de Amazônia; Aguapé é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.OBSERVATIONS.push({id:'obs_0320',
    biome:'caatinga', subject:'tucano', plant:'caranda',
    season:4, waterPressure:40,
    predationPressure:20, foodPressure:60,
    fieldNote:'Tucano responde às condições de Caatinga; Carandá é parte da paisagem.',
    playerHint:'Ajuste sua estratégia ao clima antes de gastar DNA ou ampliar a população.'});
  D.makeGeneMap=function(g){const s=Object.assign({},D.START_GENES,g||{});delete s.body;delete s.color;delete s.size;return s;};
  D.cloneGenes=function(g){return JSON.parse(JSON.stringify(g||D.START_GENES));};
  D.randomBiome=function(){return D.BIOME_ORDER[Math.floor(Math.random()*D.BIOME_ORDER.length)];};
  D.clamp=function(v,a,b){return Math.max(a,Math.min(b,v));};
  D.pick=function(arr){return arr[Math.floor(Math.random()*arr.length)];};
  D.weightedPick=function(items){let sum=items.reduce((n,x)=>n+(x.w||1),0);let r=Math.random()*sum;for(const x of items){r-=x.w||1;if(r<=0)return x.v;}return items[items.length-1].v;};
  window.BioData=D;
})();
