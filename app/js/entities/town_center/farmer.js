const VillagerRole = require('./role');
const Unit = require('../unit');
const Building = require('../building');
const Farm = require('../mill/farm');

module.exports = class Farmer extends VillagerRole {

  constructor(villager) {
    super(villager);
    this.resourceType = 'food';
    this.maxCarry = 10;
  }

  isCarrying() {
    return false;
  }

  update() {
    if (this.villager.target && this.villager.target.state == Building.INCOMPLETE) {
      this.updateFarm();
    }
    else {
      super.update();
    }
  }

  updateFarm() {
    this.villager.each(500, 'work' , () => {
      if (this.villager.target && this.villager.state == Unit.WORKING) {
        var properties = this.villager.target.properties;
        if (properties.hitPoints < properties.maxHitPoints) {
          var hit = properties.hitPoints;
          var max = properties.maxHitPoints;
          if (Math.floor(hit * 3 / max) != Math.floor((hit+1) * 3 / max)) {
            this.villager.target.setStage(Math.floor((hit+1) * 3 / max));
          }
          properties.hitPoints++;
          this.villager.target.emitter.emit('did-change-properties', properties);
        }
        else {
          this.villager.target.state = Building.FINISHED;
        }
      }
    });
  }

  getModel() {
    if (this.villager.path.length > 0) {
      return this.models.walking;
    }
    else if (this.villager.state == Unit.WORKING) {
      if (this.villager.target) {
        var properties = this.villager.target.properties;
        var hit = properties.hitPoints;
        var max = properties.maxHitPoints;
        if (Math.floor(hit * 3 / max) == 0) {
          return this.models.sowing;
        }
      }
      return this.models.working;
    }
    else {
      return this.models.stand;
    }
  }

  targetReached() {
    if (this.villager.target instanceof Farm) {
      this.villager.setState(Unit.WORKING);
    }
    super.targetReached();
  }

  femaleModelsResources() {
    return {
      unit: {
        attacking: 1382,
        dying: 1411,
        stand: 1414,
        walking: 1418,
        rotting: 1415,
        working: 1876,
        sowing: 3840
      }
    };
  }

  maleModelsResources() {
    return {
      unit: {
        attacking: 3479,
        dying: 1506,
        stand: 1509,
        walking: 1515,
        rotting: 1511,
        working: 1512,
        sowing: 3842,
      }
    };
  }


};
