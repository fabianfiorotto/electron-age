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

  defineDashboardControls() {
    return {
      main: [
        'createMonk'
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
      }
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
