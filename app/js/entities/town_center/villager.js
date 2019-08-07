const Unit = require('../unit');

const Building = require('../building');
const House = require('../house/house');
const MiningCamp = require('../resources/mining_camp');
const LumberCamp = require('../resources/lumber_camp');
const Mild = require('../mild/mild');
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
const TownCenter = require('./town_center');

const Berries = require('../resources/berries');
const Stone = require('../resources/stone');
const Tree = require('../resources/tree');

const Forager    = require('./forager');
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
      this.role = new Forager(this);
      resources.load(this.role);
    }
    if (entity && entity instanceof Stone) {
      this.role = new Miner(this);
      resources.load(this.role);
    }
    if (entity && entity instanceof Tree) {
      this.role = new LumberJack(this);
      resources.load(this.role);
    }
    if (entity && entity instanceof Building && entity.state == Building.INCOMPLETE) {
      this.role = new Builder(this);
      resources.load(this.role);
    }
    if (entity && entity instanceof TownCenter && entity.state == Building.FINISHED) {
      this.state = Unit.IDLE;
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
          mild:       19,
          miningCamp: 39,
          lumberCamp: 40,
          dock:       13,
          farm:       35,
          blacksmith:  4,
          market:     16,
          monastery:  10,
          palisade:   30,
          university: 32,
          townCenter: 28,

          barracks:       2,
          archeryRange:   0,
          stable:        23,
          siegeWorkshop: 22,
          castle:         7,
        }
      },
      {
        interface: 50721,
        frames: {
          civilian: 30,
          military: 31
        }
      }
    ];
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

  update() {
    super.update();
    if (this.role) {
      this.role.update();
    }
  }

  build(buildingClass) {
    this.building = new buildingClass(this.map, this.player);
    this.building.state = buildingClass.IMAGINARY;
    this.map.addEntity(this.building);
  }

  startBuilding() {
    // this.map.addEntity(this.building);
    this.role = new Builder(this);
    resources.load(this.role);
    this.setTarget(this.building);
    this.building.state = this.building.constructor.INCOMPLETE;
    this.building.frame = 0;
    this.building.properties.hitPoints = 1;
    this.building = null;
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
        icon: icons.mild,
        callback : () => this.build(Mild)
      },
      {
        icon: icons.miningCamp,
        callback : () => this.build(MiningCamp)
      },
      {
        icon: icons.lumberCamp,
        callback : () => this.build(LumberCamp)
      },
      {
        icon: icons.dock,
        callback : () => console.log("buildDock")
      },
      {
        icon: icons.farm,
        callback : () => console.log("buildFarm")
      },
      {
        icon: icons.blacksmith,
        condition: () => this.player.age >= 2,
        callback : () => this.build(Blacksmith)
      },
      {
        icon: icons.market,
        condition: () => this.player.age >= 2,
        callback : () => this.build(Market)
      },
      {
        icon: icons.monastery,
        condition: () => this.player.age >= 3,
        callback : () => this.build(Monastery)
      },
      {
        icon: icons.university,
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
        callback: () => this.build(Barracks)
      },
      {
        icon: icons.archeryRange,
        condition: () => this.player.age >= 2,
        callback: () => this.build(ArqueryRange)
      },
      {
        icon: icons.stable,
        condition: () => this.player.age >= 2,
        callback: () => this.build(Stable)
      },
      {
        icon: icons.siegeWorkshop,
        condition: () => this.player.age >= 3,
        callback: () => this.build(SiegeWorkshop)
      },
      {
        icon: icons.palisade,
        callback: () => this.build(Palisade)
      },
      {
        icon: icons.castle,
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
    ];
  }

  blur() {
    if (this.building && this.building.isImaginary()) {
      this.map.removeEntity(this.building);
    }
    this.building = null;
  }
};
