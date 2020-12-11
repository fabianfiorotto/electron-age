const VillagerRole = require('./role');
const Unit = require('../unit');
const Building = require('../building');

module.exports = class Repairer extends VillagerRole {

  isCarrying() {
    return false;
  }

  work() {
    let target = this.villager.target;
    if (target.isDamaged()) {
      let hitPoints = 1;
      // if (properties.constructionTime) { //BONUS???
      //   const bonus = this.villager.player.builderSpeedBonus;
      //   const time = ( 1 - bonus / 100) * properties.constructionTime;
      //   hitPoints = Math.round(properties.maxHitPoints / time);
      // }
      target.incProperty({hitPoints});
    }
    else {
      this.villager.setState(Unit.IDLE);
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
    if (this.canRepair(this.villager.target) ) {
      this.villager.setState(Unit.WORKING);
    }
  }

  canRepair(entity) {
    let t = EntityType;
    return entity.isDamaged() && entity.isType(t.BUILDING, t.SIEGE_WEAPON, t.SHIP);
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
