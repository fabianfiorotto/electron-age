const VillagerRole = require('./role');
const Livestock = require('../mill/livestock');
const Unit = require('../unit');
const TownCenter = require('./town_center');

module.exports = class Shephard extends VillagerRole {

  constructor(villager) {
    super(villager);
    this.resourceType = 'food';
    this.maxCarry = 10;
  }

  femaleModelsResources() {
    return {
      unit: {
        attacking: 3677,
        dying: 3678,
        stand: 3679,
        walking: 3681,
        rotting: 4656,
        working: 2573, //forager
        carry: 3570,
        herding: 3841
      }
    };
  }

  maleModelsResources() {
    return {
      unit: {
        attacking: 3682,
        dying: 3683,
        stand: 3684,
        walking: 3686,
        rotting: 4649,
        herding: 3843,
        working: 2589, //forager
        carry: 1519 //hunter
      }
    };
  }

  attack() {
    var villager = this.villager;
    var target = this.villager.target;

    if (target.properties.hitPoints) {
      target.properties.hitPoints = 0;
      target.butchered = true;
      target.emitter.emit('did-change-properties', target.properties);
    }
    else {
      villager.setState(Unit.WORKING);
      target.onEntityDestroy();
    }
  }

  targetReached() {
    super.targetReached();
    var villager = this.villager;
    var target = this.villager.target;
    if (target instanceof Livestock) {
      if (target.butchered) {
        villager.setState(Unit.WORKING);
      }
      else {
        villager.setState(Unit.ATTACKING);
      }
    }
  }

};
