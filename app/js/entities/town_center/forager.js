const Berries = require('../resources/berries');
const TownCenter = require('./town_center');
const VillagerRole = require('./role');
const Unit = require('../unit');

module.exports = class Forager extends VillagerRole {

  constructor(villager) {
    super(villager);
    this.resourceType = 'food';
    this.maxCarry = 10;
  }

  targetReached() {
    if (this.villager.target instanceof Berries) {
      this.villager.setState(Unit.WORKING);
    }
    super.targetReached();
  }

  femaleModelsResources() {
    return {
      unit: {
        attacking: 1382,
        dying: 2568,
        stand: 2571,
        walking: 2576,
        rotting: 2572,
        working: 2573,
        carry: 3570
      }
    };
  }

  maleModelsResources() {
    return {
      unit: {
        attacking: 3479,
        dying: 2583,
        stand: 2586,
        walking: 2592,
        rotting: 2588,
        working: 2589,
        carry: 1519 //hunter
      }
    };
  }

};
