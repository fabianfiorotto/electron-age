const Unit = require('../unit');

const Building = require('../building');
const House = require('../house/house');
const MiningCamp = require('../resources/mining_camp');
const LumberCamp = require('../resources/lumber_camp');
const Mill = require('../mill/mill');
const Dock = require('../dock/dock');
const Blacksmith = require('../blacksmith/blacksmith');
const Market = require('../market/market');
const Monastery = require('../monastery/monastery');
const University = require('../university/university');
const Barracks = require('../barracks/barracks');
const Stable = require('../stable/stable');
const ArqueryRange = require('../archery_range/archery_range');
const SiegeWorkshop = require('../siege_workshop/siege_workshop');
const Castle = require('../castle/castle');
const Palisade = require('../wall/palisade');
const StoneWall = require('../wall/stone');
const FortifiedWall = require('../wall/fortified');
const TownCenter = require('./town_center');
const Outpost = require('../tower/outpost');
const WatchTower = require('../tower/watch');
const BombardTower = require('../tower/bombard');
const Farm = require('../mill/farm');
const Livestock = require('../mill/livestock');

const Berries = require('../resources/berries');
const Stone = require('../resources/stone');
const Gold = require('../resources/gold');
const Tree = require('../resources/tree');

const Forager    = require('./forager');
const Farmer     = require('./farmer');
const Shephard   = require('./shepherd');
const Builder    = require('./builder');
const Miner      = require('./miner');
const LumberJack = require('./lumberjack');

module.exports = class Villager extends Unit {

  constructor(map,player) {
    super(map, player);
    this.pos = $V([100,100]);
    this.genre = Math.random() > 0.5 ? "f" : "m";

    this.building = null;

    this.roles = {};
    this.roles.forager = new Forager(this);
    this.roles.shepherd = new Shephard(this);
    this.roles.miner = new Miner(this);
    this.roles.lumberJack = new LumberJack(this);
    this.roles.farmer = new Farmer(this);
    this.roles.builder = new Builder(this);
    this.roles.builder = new Builder(this);

  }

  defineProperties() {
    return {
      speed: 0.8,
      hitPoints: 25,
      attack: 1,
      meleeArmor: 1,
      pierceArmor: 0,
      lineofSeight: 4,
    };
  }

  setTarget(entity) {
    if (entity && entity instanceof Berries) {
      this.role = this.roles.forager;
    }
    if (entity && entity instanceof Stone || entity instanceof Gold) {
      this.role = this.roles.miner;
    }
    if (entity && entity instanceof Tree) {
      this.role = this.roles.lumberJack;
    }
    if (entity && entity instanceof Farm) {
      this.role = this.roles.farmer;
    }
    if (entity && entity instanceof Livestock) {
      this.role = this.roles.shepherd;
    }
    else if (entity && entity instanceof Building && entity.state == Building.INCOMPLETE) {
      this.role = this.roles.builder;
    }
    if (entity && entity instanceof TownCenter && entity.state == Building.FINISHED) {
      this.setState(Unit.IDLE);
    }
    this.target = entity;
  }

  targetReached() {
    super.targetReached();
    if (this.role) {
      this.role.targetReached();
    }
  }

  femaleModelsResources() {
    return {
      unit: {
        attacking: 1382,
        dying: 1385,
        stand: 1388,
        rotting: 1389,
        walking: 1392
      }
    };
  }

  maleModelsResources() {
    return {
      unit: {
        attacking: 1473,
        dying: 1476,
        stand: 1479,
        rotting: 1481,
        walking: 1484
      },
      sounds: {
        spawn: 5353,
      }
    };
  }

  modelsResources() {
    if (this.genre == "f") {
      return this.femaleModelsResources();
    }
    else {
      return this.maleModelsResources();
    }
  }

  iconsResources() {
    return [
      {
        interface: 50730,
        frames: {
          thumbnail: this.genre == 'f' ? 16 : 15,
        }
      },
      {
        interface: 50706,
        frames: {
          house:      34,
          mill:       19,
          miningCamp: 39,
          lumberCamp: 40,
          dock:       13,
          farm:       35,
          blacksmith:  4,
          market:     16,
          monastery:  10,
          university: 32,
          townCenter: 28,

          barracks:       2,
          archeryRange:   0,
          stable:        23,
          siegeWorkshop: 22,
          castle:         7,
          palisade:      30,
          wall:          31,
          outpost:        9,
          watchTower:    25,
          guardTower:    26,
          keep:          27,
          bombardTower:  42,
          door:          36,
        }
      },
      {
        interface: 50721,
        frames: this.controlsIcons()
      },
      {
        interface: 51000,
        frames: {
          shelter: 14,
        }
      }
    ];
  }

  controlsIcons() {
    return {
      cancel: 0,
      civilian: 30,
      military: 31,
      repair: 28,
      nextMenu: 32,
    };
  }

  getModel() {
    if (this.role) {
      return this.role.getModel();
    }
    else {
      return super.getModel();
    }
  }

  getFrame() {
    if (this.role) {
      return this.role.getFrame();
    }
    else {
      return super.getFrame();
    }
  }

  nextFrame() {
    if (this.role) {
      return this.role.nextFrame();
    }
    else {
      return super.nextFrame();
    }
  }

  update() {
    super.update();
    if (this.role) {
      this.role.update();
    }
  }

  build(buildingClass) {
    if (this.building && this.building.isImaginary()) {
      this.map.removeEntity(this.building);
    }
    this.building = new buildingClass(this.map, this.player);
    this.building.setState(buildingClass.IMAGINARY);
    this.map.addEntity(this.building);
  }

  startBuilding() {
    // this.map.addEntity(this.building);
    this.role = this.roles.builder;
    this.setTarget(this.building);
    this.building.startBuilding();
    this.building = null;
  }

  attack() {
    if (this.target instanceof Livestock) {
      this.role.attack();
    }
    else {
      super.attack();
    }
  }

  canReachTarget(){
    if (this.path.length) {
      let v = this.path[0].subtract(this.pos).toUnitVector();
      return this.target.isAt(this.pos.add(v));
    }
    else {
      super.canReachTarget();
    }
  }

  defineDashboardControls() {
    return {
      main: [
        "menuCivilian", "menuMilitary", "repair", null, "shelter",
      ],
      civilian: [
        "buildHouse", "buildMill", "buildMiningCamp", 'buildLumberCamp', 'buildDock',
        "buildFarm", "buildBlacksmith", "buildMarket", "buildMonastery", 'buildUniversity',
        "buildTownCenter", null, null, "nextMenuMilitary", "backToMain"
      ],
      military: [
        "buildBarracks", "buildArcheryRange", 'buildStable', 'buildSiegeWorkshop', null,
        'buildOutpost', 'buildPalisade', 'buildSoneWall', 'buildWatchTower', 'buildBombardTower',
        'buildDoor', null, 'buildCasle', "nextMenuCivilian", "backToMain"
      ],
    }
  }

  defineControls() {
    var icons = this.icons;
    return {
      buildHouse: {
        icon: icons.house,
        cost: {wood: 25},
        callback : () => this.build(House),
      },
      buildMill: {
        icon: icons.mill,
        cost: {wood: 100},
        callback : () => this.build(Mill)
      },
      buildMiningCamp: {
        icon: icons.miningCamp,
        cost: {wood: 100},
        callback : () => this.build(MiningCamp)
      },
      buildLumberCamp: {
        icon: icons.lumberCamp,
        cost: {wood: 100},
        callback : () => this.build(LumberCamp)
      },
      buildDock: {
        icon: icons.dock,
        callback : () => this.build(Dock)
      },
      buildFarm: {
        icon: icons.farm,
        callback : () => this.build(Farm)
      },
      buildBlacksmith: {
        icon: icons.blacksmith,
        cost: {wood: 150},
        condition: () => this.player.age >= 2,
        callback : () => this.build(Blacksmith)
      },
      buildMarket: {
        icon: icons.market,
        cost: {wood: 175},
        condition: () => this.player.age >= 2,
        callback : () => this.build(Market)
      },
      buildMonastery: {
        icon: icons.monastery,
        cost: {wood: 175},
        condition: () => this.player.age >= 3,
        callback : () => this.build(Monastery)
      },
      buildUniversity: {
        icon: icons.university,
        cost: {wood: 200},
        condition: () => this.player.age >= 3,
        callback : () => this.build(University)
      },
      buildTownCenter: {
        icon: icons.townCenter,
        callback : () => this.build(TownCenter)
      },
      buildBarracks: {
        icon: icons.barracks,
        cost: {wood: 175},
        callback: () => this.build(Barracks)
      },
      buildArcheryRange: {
        icon: icons.archeryRange,
        cost: {wood: 175},
        condition: () => this.player.age >= 2,
        callback: () => this.build(ArqueryRange)
      },
      buildStable: {
        icon: icons.stable,
        cost: {wood: 175},
        condition: () => this.player.age >= 2,
        callback: () => this.build(Stable)
      },
      buildSiegeWorkshop: {
        icon: icons.siegeWorkshop,
        cost: {wood: 200},
        condition: () => this.player.age >= 3,
        callback: () => this.build(SiegeWorkshop)
      },
      buildOutpost: {
        icon: icons.outpost,
        callback: () => this.build(Outpost)
      },
      buildPalisade: {
        icon: icons.palisade,
        callback: () => this.build(Palisade)
      },
      buildSoneWall: {
        icon: icons.wall,
        upgrade: 'buildFortifiedWall',
        condition: () => this.player.age >= 2,
        callback: () => this.build(StoneWall)
      },
      buildFortifiedWall: {
        icon: icons.wall,
        condition: () => this.player.technologies.fortifiedWall,
        callback: () => this.build(FortifiedWall)
      },
      buildWatchTower: {
        icon: icons.watchTower,
        condition: () => this.player.age >= 2,
        callback: () => this.build(WatchTower)
      },
      buildBombardTower: {
        icon: icons.bombardTower,
        condition: () => this.player.technologies.bombardTower,
        callback: () => this.build(BombardTower)
      },
      buildDoor: {
        icon: icons.door,
        condition: () => this.player.age >= 2,
        callback: () => this.build(Palisade)
      },
      buildCasle: {
        icon: icons.castle,
        cost: {stone: 650},
        condition: () => this.player.age >= 3,
        callback: () => this.build(Castle)
      },
      menuCivilian: {
        icon: icons.civilian,
        menu: 'civilian',
      },
      menuMilitary: {
        icon: icons.military,
        menu: 'military',
      },
      nextMenuCivilian: {
        icon: icons.nextMenu,
        menu: 'civilian',
      },
      nextMenuMilitary: {
        icon: icons.nextMenu,
        menu: 'military',
      },
      backToMain: {
        icon: icons.cancel,
        menu: 'main',
      },
      repair: {
        icon: icons.repair,
        callback: () => console.log("repair")
      },
      shelter: {
        icon: icons.shelter,
        callback: () => console.log("shelter")
      }
    }
  }


  getCursorFor(entity) {
    return entity.isType(EntityType.RESOURCE) ? 'pointer' : super.getCursorFor(entity);
  }

  async loadResources(res) {
    await super.loadResources(res);
    for (const [key,role] of Object.entries(this.roles)){
      await resources.load(role);
    }
  }
};
