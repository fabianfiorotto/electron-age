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
        condition: () => this.techCondition(2, 'forgin'),
        callback : () => this.develop('forgin'),
      },
      developIronCasting: {
        icon: this.icons.ironCasting,
        upgrade: 'developBlastFurnance',
        condition: () => this.techCondition(3, 'ironCasting', 'forgin'),
        callback : () => this.develop('ironCasting'),
      },
      developBlastFurnance: {
        icon: this.icons.blastFurnance,
        condition: () => this.techCondition(4, 'blastFurnance', 'ironCasting'),
        callback : () => this.develop('blastFurnance'),
      },
      developScaleMailArmor: {
        icon: this.icons.scaleMailArmor,
        update: 'developChainMailArmor',
        condition: () => this.techCondition(2, 'scaleMailArmor'),
        callback : () => this.develop('scaleMailArmor'),
      },
      developChainMailArmor: {
        icon: this.icons.chainMailArmor,
        update: 'developPlateMailArmor',
        condition: () => this.techCondition(3, 'chainMailArmor', 'scaleMailArmor'),
        callback : () => this.develop('chainMailArmor'),
      },
      developPlateMailArmor: {
        icon: this.icons.plateMailArmor,
        condition: () => this.techCondition(4, 'plateMailArmor', 'chainMailArmor'),
        callback : () => this.develop('plateMailArmor'),
      },
      developScaleBardingArmor: {
        icon: this.icons.scaleBardingArmor,
        upgrade: 'developChainBardingArmor',
        condition: () => this.techCondition(2, 'scaleBardingArmor'),
        callback : () => this.develop('scaleBardingArmor'),
      },
      developChainBardingArmor: {
        icon: this.icons.chainBardingArmor,
        upgrade: 'developPlateBardingArmor',
        condition: () => this.techCondition(3, 'chainBardingArmor', 'scaleBardingArmor'),
        callback : () => this.develop('chainBardingArmor'),
      },
      developPlateBardingArmor: {
        icon: this.icons.plateBardingArmor,
        condition: () => this.techCondition(4, 'plateBardingArmor', 'chainBardingArmor'),
        callback : () => this.develop('plateBardingArmor'),
      },
      developPaddedArcherArmor: {
        icon: this.icons.paddedArcherArmor,
        update: 'developLeatherArcherArmor',
        condition: () => this.techCondition(2, 'paddedArcherArmor'),
        callback : () => this.develop('paddedArcherArmor'),
      },
      developLeatherArcherArmor: {
        icon: this.icons.leatherArcherArmor,
        update: 'developRingArcherArmor',
        condition: () => this.techCondition(3, 'leatherArcherArmor', 'paddedArcherArmor'),
        callback : () => this.develop('leatherArcherArmor'),
      },
      developRingArcherArmor: {
        icon: this.icons.ringArcherArmor,
        condition: () => this.techCondition(4, 'ringArcherArmor', 'eatherArcherArmor'),
        callback : () => this.develop('ringArcherArmor'),
      },
      developFletching: {
        icon: this.icons.fletching,
        upgrade: 'developBodkinArrow',
        condition: () => this.techCondition(2, 'fletching'),
        callback : () => this.develop('fletching'),
      },
      developBodkinArrow: {
        icon: this.icons.bodkinArrow,
        upgrade: 'developBracer',
        condition: () => this.techCondition(3, 'bodkinArrow', 'fletching'),
        callback : () => this.develop('bodkinArrow'),
      },
      developBracer: {
        icon: this.icons.bracer,
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
        if (entity.isType(Building.INFANTRY, Building.CAVALRY)) {
          entity.incProperty({attack: 1});
        }
      },
      updatePlayer(player) {

      }
    }
  }




};
