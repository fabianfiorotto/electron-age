const Tree = require('../resources/tree');
const TownCenter = require('./town_center');
const VillagerRole = require('./role');
const Unit = require('../unit');

module.exports = class LumberJack extends VillagerRole {

  constructor(villager) {
    super(villager);
    this.resourceType = 'wood';
    this.maxCarry = 10;
  }

  targetReached() {
    super.targetReached();
    if (this.villager.target instanceof Tree) {
      this.villager.state = Unit.WORKING;
    }
  }

  femaleModelsResources() {
    return {
      unit: {
        attacking: 1434,
        dying: 1437,
        stand: 1440,
        walking: 1444,
        rotting: 1441,
        working: 1884,
        carry: 1883,
      }
    };
  }

  maleModelsResources() {
    return {
      unit: {
        attacking: 1535,
        dying: 1539,
        stand: 1542,
        walking: 1548,
        rotting: 1544,
        working: 1545,
        carry: 1536,
      }
    };
  }

};
