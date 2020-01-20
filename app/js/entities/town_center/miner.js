const Stone = require('../resources/stone');
const Gold = require('../resources/gold');
const VillagerRole = require('./role');
const Unit = require('../unit');

module.exports = class Miner extends VillagerRole {

  constructor(villager) {
    super(villager);
    this.maxCarry = 10;
  }

  targetReached() {
    let target = this.villager.target;
    if (target instanceof Stone || target instanceof Gold) {
      if (target instanceof Stone) {
        this.resourceType = 'stone';
      }
      else {
        this.resourceType = 'gold';
      }
      this.villager.setState(Unit.WORKING);
    }
    super.targetReached();
  }

  getModel() {
    let state = this.villager.state;
    let walkingOrIdle = state == Unit.WALKING || state == Unit.IDLE;
    if (walkingOrIdle && this.isCarrying() && this.resourceType == 'gold') {
      return this.models.carryGold;
    }
    else {
      return super.getModel();
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
