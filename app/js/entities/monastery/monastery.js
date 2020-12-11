const Building = require('../building');
const Monk = require('./monk');

module.exports = class Monastery extends Building {

  getSize() {
    return 3;
  }

  modelsResources() {
    return {
      sounds: {
        click: 5031
      }
    };
  }

  thumbnail() {
    return 10;
  }

  unitsIcons() {
    return {
      createMonk: 33,
    };
  }

  technologyIcons() {
    return {
      redemption: 92,
      atonement: 93,
      herbalMedicine: 114,
      heresy: 108,
      sancticy: 83,
      fervor: 73,
      faith: 11,
      illumination: 74,
      blockPrinting: 82,
      theocracy: 109,
    }
  }


  defineDashboardControls() {
    return {
      main: [
        'createMonk', 'developRedemption', 'developAtonement', 'developFervor', null,
        'developSancticy'
      ]
    }
  }

  defineControls() {
    var icons = this.icons;
    return {
      createMonk: {
        icon: icons.createMonk,
        time: 5,
        cost: {gold: 100},
        prepare: () => this.prepareUnit(Monk),
        callback : () => this.createUnit()
      },
      developRedemption: {
        icon: this.icons.redemption,
        cost: {food: 150, wood: 175},
        time: 50,
        condition: () => this.techCondition(3, 'redemption'),
        callback : () => this.develop("redemption"),
      },
      developAtonement: {
        icon: this.icons.atonement,
        cost: {food: 150, wood: 175},
        time: 50,
        condition: () => this.techCondition(3, 'atonement'),
        callback : () => this.develop("atonement"),
      },
      developHerbalMedicine: {
        icon: this.icons.herbalMedicine,
        cost: {food: 150, wood: 175},
        time: 50,
        condition: () => this.techCondition(3, 'herbalMedicine'),
        callback : () => this.develop("herbalMedicine"),
      },
      developHeresy: {
        icon: this.icons.heresy,
        cost: {food: 150, wood: 175},
        time: 50,
        condition: () => this.techCondition(3, 'heresy'),
        callback : () => this.develop("heresy"),
      },
      developSancticy: {
        icon: this.icons.sancticy,
        cost: {food: 150, wood: 175},
        time: 50,
        condition: () => this.techCondition(3, 'sancticy'),
        callback : () => this.develop("sancticy"),
      },
      developFervor: {
        icon: this.icons.fervor,
        cost: {food: 150, wood: 175},
        time: 50,
        condition: () => this.techCondition(3, 'fervor'),
        callback : () => this.develop("fervor"),
      },
      developFaith: {
        icon: this.icons.faith,
        cost: {food: 150, wood: 175},
        time: 50,
        condition: () => this.techCondition(3, 'faith'),
        callback : () => this.develop("faith"),
      },
      developIllumination: {
        icon: this.icons.illumination,
        cost: {food: 150, wood: 175},
        time: 50,
        condition: () => this.techCondition(3, 'illumination'),
        callback : () => this.develop("illumination"),
      },
      developBlockPrinting: {
        icon: this.icons.blockPrinting,
        cost: {food: 150, wood: 175},
        time: 50,
        condition: () => this.techCondition(3, 'blockPrinting'),
        callback : () => this.develop("blockPrinting"),
      },
      developTheocracy: {
        icon: this.icons.theocracy,
        cost: {food: 150, wood: 175},
        time: 50,
        condition: () => this.techCondition(3, 'theocracy'),
        callback : () => this.develop("theocracy"),
      },
    }
  }

  minAge() {
    return 3;
  }

  update() {
    super.update();

    this.each(2000, 'relic_gold' , () => {
      let gold = this.garrisonedEntities.length;
      if (gold) {
        this.resources = {gold: gold};
        this.transfer(this.player, {gold: gold});
      }
    });
  }

  defineTypes() {
    return [EntityType.BUILDING, EntityType.MONASTERY];
  }

  canGarrison(entity) {
    return entity.isType(EntityType.RELIC);
  }

};
