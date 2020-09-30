const Building = require('../building');

module.exports = class Blacksmith extends Building {

  getSize() {
    return 3;
  }

  thumbnail() {
    return 4;
  }

  technologyIcons() {
    return {
      scaleMailArmor: 63,
      scaleBardingArmor: 66,
      chainMailArmor: 22,
      chainBardingArmor: 23,
      plateMailArmor: 64,
      plateBardingArmor: 65,
      fletching: 34,
      bodkinArrow: 35,
      bracer: 37,
      paddedArcherArmor: 49,
      leatherArcherArmor: 50,
      ringArcherArmor: 51,
      forgin: 17,
      ironCasting: 18,
      blastFurnance: 21,
    };
  }

  defineDashboardControls() {
    return {
      main: [
        "developForgin", "developScaleMailArmor", 'developScaleBardingArmor', null, null,
        null, "developPaddedArcherArmor", "developFletching"
      ]
    }
  }

  defineControls() {
    var icons = this.icons;
    return {
      developForgin: {
        icon: this.icons.forgin,
        upgrade: 'developIronCasting',
        time: 50,
        cost: {food: 150},
        condition: () => this.techCondition(2, 'forgin'),
        callback : () => this.develop('forgin'),
      },
      developIronCasting: {
        icon: this.icons.ironCasting,
        upgrade: 'developBlastFurnance',
        time: 75,
        cost: {food: 220, gold: 120},
        condition: () => this.techCondition(3, 'ironCasting', 'forgin'),
        callback : () => this.develop('ironCasting'),
      },
      developBlastFurnance: {
        icon: this.icons.blastFurnance,
        time: 100,
        cost: {food: 275, gold: 225},
        condition: () => this.techCondition(4, 'blastFurnance', 'ironCasting'),
        callback : () => this.develop('blastFurnance'),
      },
      developScaleMailArmor: {
        icon: this.icons.scaleMailArmor,
        update: 'developChainMailArmor',
        time: 40,
        cost: {food: 100},
        condition: () => this.techCondition(2, 'scaleMailArmor'),
        callback : () => this.develop('scaleMailArmor'),
      },
      developChainMailArmor: {
        icon: this.icons.chainMailArmor,
        time: 55,
        cost: {food: 200, gold: 100},
        update: 'developPlateMailArmor',
        condition: () => this.techCondition(3, 'chainMailArmor', 'scaleMailArmor'),
        callback : () => this.develop('chainMailArmor'),
      },
      developPlateMailArmor: {
        icon: this.icons.plateMailArmor,
        time: 70,
        cost: {food: 300, gold: 150},
        condition: () => this.techCondition(4, 'plateMailArmor', 'chainMailArmor'),
        callback : () => this.develop('plateMailArmor'),
      },
      developScaleBardingArmor: {
        icon: this.icons.scaleBardingArmor,
        time: 45,
        cost: {food: 150},
        upgrade: 'developChainBardingArmor',
        condition: () => this.techCondition(2, 'scaleBardingArmor'),
        callback : () => this.develop('scaleBardingArmor'),
      },
      developChainBardingArmor: {
        icon: this.icons.chainBardingArmor,
        time: 60,
        cost: {food: 250, gold: 150},
        upgrade: 'developPlateBardingArmor',
        condition: () => this.techCondition(3, 'chainBardingArmor', 'scaleBardingArmor'),
        callback : () => this.develop('chainBardingArmor'),
      },
      developPlateBardingArmor: {
        icon: this.icons.plateBardingArmor,
        time: 75,
        cost: {food: 350, gold: 200},
        condition: () => this.techCondition(4, 'plateBardingArmor', 'chainBardingArmor'),
        callback : () => this.develop('plateBardingArmor'),
      },
      developPaddedArcherArmor: {
        icon: this.icons.paddedArcherArmor,
        time: 40,
        cost: {food: 100},
        update: 'developLeatherArcherArmor',
        condition: () => this.techCondition(2, 'paddedArcherArmor'),
        callback : () => this.develop('paddedArcherArmor'),
      },
      developLeatherArcherArmor: {
        icon: this.icons.leatherArcherArmor,
        time: 55,
        cost: {food: 150, gold: 150},
        update: 'developRingArcherArmor',
        condition: () => this.techCondition(3, 'leatherArcherArmor', 'paddedArcherArmor'),
        callback : () => this.develop('leatherArcherArmor'),
      },
      developRingArcherArmor: {
        icon: this.icons.ringArcherArmor,
        time: 70,
        cost: {food: 250, gold: 250},
        condition: () => this.techCondition(4, 'ringArcherArmor', 'eatherArcherArmor'),
        callback : () => this.develop('ringArcherArmor'),
      },
      developFletching: {
        icon: this.icons.fletching,
        time: 30,
        cost: {food: 100, gold: 50},
        upgrade: 'developBodkinArrow',
        condition: () => this.techCondition(2, 'fletching'),
        callback : () => this.develop('fletching'),
      },
      developBodkinArrow: {
        icon: this.icons.bodkinArrow,
        time: 35,
        cost: {food: 200, gold: 100},
        upgrade: 'developBracer',
        condition: () => this.techCondition(3, 'bodkinArrow', 'fletching'),
        callback : () => this.develop('bodkinArrow'),
      },
      developBracer: {
        icon: this.icons.bracer,
        time: 40,
        cost: {food: 300, gold: 200},
        condition: () => this.techCondition(4, 'bracer', 'bodkinArrow'),
        callback : () => this.develop('bracer'),
      },
    }
  }

  modelsResources() {
    return {
      sounds: {
        click: 5011
      }
    };
  }

  minAge() {
    return 2;
  }


  forginTechnology() {
    return {
      updateEntity(entity) {
        if (entity.isType(EntityType.INFANTRY, EntityType.CAVALRY)) {
          entity.incProperty({attack: 1});
        }
      },
      updatePlayer(player) {

      }
    }
  }

  ironCastingTechnology() {
    return {
      updateEntity(entity) {
        if (entity.isType(EntityType.INFANTRY, EntityType.CAVALRY)) {
          entity.incProperty({attack: 1});
        }
      }
    }
  }

  blastFurnanceTechnology() {
    return {
      updateEntity(entity) {
        if (entity.isType(EntityType.INFANTRY, EntityType.CAVALRY)) {
          entity.incProperty({attack: 2});
        }
      }
    }
  }

  paddedArcherArmorTechnology() {
    return {
      updateEntity(entity) {
        if (entity.isType(EntityType.ARCHER)) {
          entity.incProperty({meleeArmor: 1, pierceArmor: 1});
        }
      }
    }
  }

  leatherArcherArmorTechnology() {
    return {
      updateEntity(entity) {
        if (entity.isType(EntityType.ARCHER)) {
          entity.incProperty({meleeArmor: 1, pierceArmor: 1});
        }
      }
    }
  }

  ringArcherArmorTechnology() {
    return {
      updateEntity(entity) {
        if (entity.isType(EntityType.ARCHER)) {
          entity.incProperty({meleeArmor: 1, pierceArmor: 2});
        }
      }
    }
  }

  fletchingTechnology() {
    return {
      updateEntity(entity) {
        if (entity.isType(EntityType.ARCHER)) {
          entity.incProperty({attack: 1, range: 1});
        }
      }
    };
  }

  bodkinArrowTechnology() {
    return {
      updateEntity(entity) {
        if (entity.isType(EntityType.ARCHER)) {
          entity.incProperty({attack: 1, range: 1});
        }
      }
    };
  }

  bracerTechnology() {
    return {
      updateEntity(entity) {
        if (entity.isType(EntityType.ARCHER)) {
          entity.incProperty({attack: 1, range: 1});
        }
      }
    };
  }



};
