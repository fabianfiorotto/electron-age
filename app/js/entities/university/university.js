const Building = require('../building');

module.exports = class University extends Building {

  static heatedShotAttackBonus = {
    apply(attacker, target) {
      return target.isType(Building.SHIP);
    },
    value(attacker, target) {
      return attacker.properties.attack * 1.25;
    }
  }

  getSize() {
    return 4;
  }

  modelsResources() {
    return {
      sounds: {
        click: 5229
      }
    };
  }

  thumbnail() {
    return 32;
  }

  technologyIcons() {
    return {
      masonry: 13,
      architecture: 14,
      fortifiedWall: 46,
      chemistry: 12,
      bombardTower: 47,
      ballistica: 25,
      siegeEngineers: 101,
      guardTower: 76,
      keep: 26,
      heatedShot: 104,
      murderHoles: 61,
      treadmillCrane: 60,
    };
  }

  defineDashboardControls() {
    return {
      main: [
        "developMasonry","developFortifiedWall","developBallistica","developGuardTower","developHeatedShot",
        "developMurderHoles","developTreadmillCrane"
      ]
    };
  }

  defineControls() {
    var icons = this.icons;

    return {
      developMasonry: {
        icon: this.icons.masonry,
        update: "developArchitecture",
        cost: {food: 150, wood: 175},
        time: 50,
        condition: () => this.techCondition(3, 'masonry'),
        callback : () => this.develop("masonry"),
      },
      developArchitecture: {
        icon: this.icons.architecture,
        cost: {food: 300, wood: 200},
        time: 70,
        condition: () => this.techCondition(4, 'architecture'),
        callback : () => this.develop("architecture"),
      },
      developFortifiedWall: {
        icon: this.icons.fortifiedWall,
        cost: {stone: 5},
        time: 10,
        update: "developChemistry",
        condition: () => this.techCondition(3, 'fortifiedWall'),
        callback : () => this.develop("fortifiedWall"),
      },
      developChemistry: {
        icon: this.icons.chemistry,
        cost: {food: 300, gold: 200},
        time: 100,
        update: "developBombardTower",
        condition: () => this.techCondition(4, 'chemistry'),
        callback : () => this.develop("chemistry"),
      },
      developBombardTower: {
        icon: this.icons.bombardTower,
        cost: {food: 800, wood: 400},
        time: 60,
        condition: () => this.techCondition(4, 'bombardTower'),
        callback : () => this.develop("bombardTower"),
      },
      developBallistica: {
        icon: this.icons.ballistica,
        cost: {wood: 300, gold: 175},
        time: 60,
        update: "developSiegeEngineers",
        condition: () => this.techCondition(3, 'ballistica'),
        callback : () => this.develop("ballistica"),
      },
      developSiegeEngineers: {
        icon: this.icons.siegeEngineers,
        cost: {food: 500, wood: 600},
        time: 45,
        condition: () => this.techCondition(4, 'siegeEngineers'),
        callback : () => this.develop("siegeEngineers"),
      },
      developGuardTower: {
        icon: this.icons.guardTower,
        cost: {wood: 50, stone: 125},
        time: 80,
        upgrade: 'developKeep',
        condition: () => this.techCondition(3, 'guardTower'),
        callback : () => this.develop("guardTower"),
      },
      developKeep: {
        icon: this.icons.keep,
        cost: {wood: 50, stone: 125},
        time: 80,
        condition: () => this.techCondition(4, 'keep'),
        callback : () => this.develop("keep"),
      },
      developHeatedShot: {
        icon: this.icons.heatedShot,
        cost: {food: 350, gold: 100},
        time: 30,
        condition: () => this.techCondition(3, 'heatedShot'),
        callback : () => this.develop("heatedShot"),
      },
      developMurderHoles: {
        cost: {food: 200, stone: 100},
        time: 60,
        icon: this.icons.murderHoles,
        condition: () => this.techCondition(3, 'murderHoles'),
        callback : () => this.develop("murderHoles"),
      },
      developTreadmillCrane: {
        icon: this.icons.treadmillCrane,
        cost: {food: 300, wood: 200},
        time: 50,
        condition: () => this.techCondition(3, 'treadmillCrane'),
        callback : () => this.develop("treadmillCrane"),
      },
    }
  }

  masonryTechnology() {
    return {
      updateEntity(entity) {
        if (entity.isType(Building.BUILDING)) {
          entity.incProperty({armor: 1, pierceArmor: 1, buildingArmor: 3});
          entity.incMaxHitPointsPerc(10);
        }
      }
    }
  }

  architectureTechnology() {
    return {
      updateEntity(entity) {
        if (entity.isType(Building.BUILDING)) {
          entity.incProperty({armor: 1, pierceArmor: 1, buildingArmor: 3});
          entity.incMaxHitPointsPerc(10);
        }
      }
    }
  }

  chemistryTechnology() {
    return {
      updateEntity(entity) {
        if (entity.isType(Building.ARCHER, Building.SIEGE_WEAPON, Building.DEFENSIVE_STRUCTURE)) {
          entity.incProperty({attack: 1});
        }
      }
    }
  }

  ballisticaTechnology() {
    return {
      updateEntity(entity) {
        if (entity.isType(Building.ARCHER, Building.SHIP, Building.SIEGE_WEAPON, Building.DEFENSIVE_STRUCTURE)) {
          entity.incProperty({accuracy: 1}); ///TODO: +1???
        }
      }
    }
  }

  heatedShotTechnology() {
    return {
      updateEntity(entity) {
        if (entity.isType(Building.DEFENSIVE_STRUCTURE)) {
          entity.attackBonuses.push(this.heatedShotAttackBonus);
        }
      }
    }
  }

  treadmillCraneTechnology() {
    return {
      updatePlayer(player) {
        player.builderSpeedBonus += 30;
      }
    }
  }

};
