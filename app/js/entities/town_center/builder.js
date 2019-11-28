const VillagerRole = require('./role');
const Unit = require('../unit');
const Building = require('../building');

module.exports = class Builder extends VillagerRole {

  isCarrying() {
    return false;
  }

  update() {
    this.villager.each(500, 'work' , () => {
      if (this.villager.state == Unit.WORKING) {
        var building = this.villager.target;
        var properties = building.properties;
        if (properties.hitPoints < properties.maxHitPoints) {
          properties.hitPoints++;
          building.emitter.emit('did-change-properties', properties);
        }
        else {
          building.setState(Building.FINISHED);
          this.villager.setState(Unit.IDLE);
        }
      }
    });
  }

  getModel() {
    if (this.villager.path.length > 0) {
      return this.models.walking;
    }
    else if (this.villager.state == Unit.WORKING) {
      return this.models.working;
    }
    else {
      return this.models.stand;
    }
  }

  targetReached() {
    this.villager.state = Unit.WORKING;
  }

  femaleModelsResources() {
    return {
      unit: {
        attacking: 1382,
        dying: 1398,
        stand: 1401,
        walking: 1405,
        rotting: 1402,
        working: 1874,
      }
    };
  }

  maleModelsResources() {
    return {
      unit: {
        attacking: 3479,
        dying: 1490,
        stand: 1493,
        walking: 1499,
        rotting: 1495,
        working: 1496,
      }
    };

  }


};
