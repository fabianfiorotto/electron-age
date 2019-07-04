const Stone = require('../resources/stone');
const TownCenter = require('./town_center');
const VillagerRole = require('./role');
const Unit = require('../unit');

module.exports = class Miner extends VillagerRole {

  constructor(villager) {
    super(villager);
    this.resourceType = 'stone';
    this.maxCarry = 10;
  }

  targetReached() {
    if (this.villager.target instanceof Stone) {
      this.villager.state = Unit.WORKING;
    }
    if (this.villager.target instanceof TownCenter) {
      this.villager.transfer(this.villager.player, this.villager.resources);
    }
  }

  femaleModelsResources() {
    return {
      unit: {
        attacking: 1382,
        dying: 1450,
        stand: 1453,
        walking: 1457,
        rotting: 1454,
        working: 1880,
        carry: 1879,
        carryGold: 2218
      }
    };
  }

  maleModelsResources() {
    return {
      unit: {
        attacking: 3479,
        dying: 1555,
        stand: 1558,
        walking: 1563,
        rotting: 1559,
        working: 1560,
        carry: 1552,
        carryGold: 2117
      }
    };
  }

};
