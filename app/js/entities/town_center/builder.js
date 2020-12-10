const VillagerRole = require('./role');
const Unit = require('../unit');
const Building = require('../building');

module.exports = class Builder extends VillagerRole {

  isCarrying() {
    return false;
  }

  work() {
    var building = this.villager.target;
    var properties = building.properties;
    if (properties.hitPoints < properties.maxHitPoints) {
      let hitPoints = 1;
      if (properties.constructionTime) {
        const bonus = this.villager.player.builderSpeedBonus;
        const time = ( 1 - bonus / 100) * properties.constructionTime;
        hitPoints = Math.round(properties.maxHitPoints / time);
      }
      building.incProperty({hitPoints});
      building.updateBuildingProcess();
    }
    else {
      var villager = this.villager;
      building.setState(Building.FINISHED);
      villager.player.emitter.emit('did-entity-moved', building);
      villager.setState(Unit.IDLE);
      var newTarget = villager.map.closest(building.pos, 200, (e) => this.isAIncompleBuilding(e));
      if (newTarget) {
        villager.setTarget(newTarget);
        villager.setTargetPos(newTarget.pos);
        villager.setState(Unit.WALKING);
      }
    }
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
    if (this.isAIncompleBuilding(this.villager.target) ) {
      this.villager.setState(Unit.WORKING);
    }
  }

  isAIncompleBuilding(entity) {
    return entity instanceof Building && entity.state == Building.INCOMPLETE;
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
