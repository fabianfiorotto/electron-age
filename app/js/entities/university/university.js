const Building = require('../building');

module.exports = class University extends Building {

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

  unitsIcons() {
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
        "masonry","fortifiedWall","ballistica","guardTower","heatedShot",
        "murderHoles","treadmillCrane"
      ]
    };
  }

  defineControls() {
    var icons = this.icons;

    return {
      developMasonry: {
        icon: this.icons.masonry,
        update: "developArchitecture",
        condition: () => this.techCondition(3, 'masonry'),
        callback : () => this.develop("masonry"),
      },
      developArchitecture: {
        icon: this.icons.architecture,
        condition: () => this.techCondition(4, 'architecture'),
        callback : () => this.develop("architecture"),
      },
      developFortifiedWall: {
        icon: this.icons.fortifiedWall,
        update: "developChemistry",
        condition: () => this.techCondition(3, 'fortifiedWall'),
        callback : () => this.develop("fortifiedWall"),
      },
      developChemistry: {
        icon: this.icons.chemistry,
        update: "developBombardTower",
        condition: () => this.techCondition(4, 'chemistry'),
        callback : () => this.develop("chemistry"),
      },
      developBombardTower: {
        icon: this.icons.bombardTower,
        condition: () => this.techCondition(4, 'bombardTower'),
        callback : () => this.develop("bombardTower"),
      },
      developBallistica: {
        icon: this.icons.ballistica,
        update: "developSiegeEngineers",
        condition: () => this.techCondition(3, 'ballistica'),
        callback : () => this.develop("ballistica"),
      },
      developSiegeEngineers: {
        icon: this.icons.siegeEngineers,
        condition: () => this.techCondition(4, 'siegeEngineers'),
        callback : () => this.develop("siegeEngineers"),
      },
      developGuardTower: {
        icon: this.icons.guardTower,
        upgrade: 'developKeep',
        condition: () => this.techCondition(3, 'guardTower'),
        callback : () => this.develop("guardTower"),
      },
      developKeep: {
        icon: this.icons.keep,
        condition: () => this.techCondition(4, 'keep'),
        callback : () => this.develop("keep"),
      },
      developHeatedShot: {
        icon: this.icons.heatedShot,
        condition: () => this.techCondition(3, 'heatedShot'),
        callback : () => this.develop("heatedShot"),
      },
      developMurderHoles: {
        icon: this.icons.murderHoles,
        condition: () => this.techCondition(3, 'murderHoles'),
        callback : () => this.develop("murderHoles"),
      },
      developTreadmillCrane: {
        icon: this.icons.treadmillCrane,
        condition: () => this.techCondition(3, 'treadmillCrane'),
        callback : () => this.develop("treadmillCrane"),
      },
    }
  }

};
