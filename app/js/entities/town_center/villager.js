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

    this.properties = {};
    this.properties.speed = 0.8;
    this.properties.hitPoints = 25;
    this.properties.maxHitPoints = 25;
    this.properties.attack = 1;
    this.properties.meleeArmor = 1;
    this.properties.pierceArmor = 0;
    this.properties.lineofSeight = 4;

    this.roles = {};
    this.roles.forager = new Forager(this);
    this.roles.shepherd = new Shephard(this);
    this.roles.miner = new Miner(this);
    this.roles.lumberJack = new LumberJack(this);
    this.roles.farmer = new Farmer(this);
    this.roles.builder = new Builder(this);
    this.roles.builder = new Builder(this);

  }

  setPath(path) {
    if (path.length && this.building != null) {
      if (this.map.canPlace(this.building)) {
        super.setPath(path);
        this.startBuilding();
      }
      else {
        console.log("Can't build there");
      }
    }
    else {
      super.setPath(path);
    }
  }

  setTarget(entity) {
    if (entity && entity instanceof Berries) {
      this.role = this.roles.forager;
    }
    if (entity && entity instanceof Stone) {
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
      civilian: 30,
      military: 31,
      repair: 28,
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

  controls() {
    var icons = this.icons;
    var civilian = [
      {
        icon: icons.house,
        cost: {wood: 25},
        callback : () => this.build(House),
      },
      {
        icon: icons.mill,
        cost: {wood: 100},
        callback : () => this.build(Mill)
      },
      {
        icon: icons.miningCamp,
        cost: {wood: 100},
        callback : () => this.build(MiningCamp)
      },
      {
        icon: icons.lumberCamp,
        cost: {wood: 100},
        callback : () => this.build(LumberCamp)
      },
      {
        icon: icons.dock,
        callback : () => this.build(Dock)
      },
      {
        icon: icons.farm,
        callback : () => this.build(Farm)
      },
      {
        icon: icons.blacksmith,
        cost: {wood: 150},
        condition: () => this.player.age >= 2,
        callback : () => this.build(Blacksmith)
      },
      {
        icon: icons.market,
        cost: {wood: 175},
        condition: () => this.player.age >= 2,
        callback : () => this.build(Market)
      },
      {
        icon: icons.monastery,
        cost: {wood: 175},
        condition: () => this.player.age >= 3,
        callback : () => this.build(Monastery)
      },
      {
        icon: icons.university,
        cost: {wood: 200},
        condition: () => this.player.age >= 3,
        callback : () => this.build(University)
      },
      {
        icon: icons.townCenter,
        callback : () => this.build(TownCenter)
      },
    ];
    var military = [
      {
        icon: icons.barracks,
        cost: {wood: 175},
        callback: () => this.build(Barracks)
      },
      {
        icon: icons.archeryRange,
        cost: {wood: 175},
        condition: () => this.player.age >= 2,
        callback: () => this.build(ArqueryRange)
      },
      {
        icon: icons.stable,
        cost: {wood: 175},
        condition: () => this.player.age >= 2,
        callback: () => this.build(Stable)
      },
      {
        icon: icons.siegeWorkshop,
        cost: {wood: 200},
        condition: () => this.player.age >= 3,
        callback: () => this.build(SiegeWorkshop)
      },
      null,
      {
        icon: icons.outpost,
        callback: () => this.build(Outpost)
      },
      {
        icon: icons.palisade,
        callback: () => this.build(Palisade)
      },
      [
        {
          icon: icons.wall,
          condition: () => this.player.age >= 2,
          callback: () => this.build(StoneWall)
        },
        {
          icon: icons.wall,
          condition: () => this.player.tecnologies.fortifiedWall,
          callback: () => this.build(FortifiedWall)
        },
      ],
      {
        icon: icons.watchTower,
        condition: () => this.player.age >= 2,
        callback: () => this.build(WatchTower)
      },
      {
        icon: icons.bombardTower,
        condition: () => this.player.age >= 4,
        callback: () => this.build(BombardTower)
      },
      {
        icon: icons.door,
        condition: () => this.player.age >= 2,
        callback: () => this.build(Palisade)
      },
      {
        icon: icons.castle,
        cost: {stone: 650},
        condition: () => this.player.age >= 3,
        callback: () => this.build(Castle)
      },
    ];
    return [
      {
        icon: icons.civilian,
        group: civilian,
      },
      {
        icon: icons.military,
        group: military,
      },
      {
        icon: icons.repair,
        callback: () => console.log("repair")
      },
      null,
      {
        icon: icons.shelter,
        callback: () => console.log("shelter")
      }
    ];
  }

  blur() {
    if (this.building && this.building.isImaginary()) {
      this.map.removeEntity(this.building);
    }
    this.building = null;
  }

  async loadResources(res) {
    await super.loadResources(res);
    for (const [key,role] of Object.entries(this.roles)){
      await resources.load(role);
    }
  }
};
