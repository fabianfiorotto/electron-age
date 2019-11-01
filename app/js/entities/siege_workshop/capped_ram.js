const Unit = require('../unit');
const SiegeRam = require('./siege_ram');

module.exports = class CappedRam extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 1681,
        dying: 1686,
        stand: 1689,
        rotting: 1690,
        walking: 1691,
        wheels: 1693,
        ram: 1683
      }
    };
  }

  draw(camera) {
    if (this.models.walking && this.state == Unit.ATTACKING) {
      this.models.walking.draw(this.pos.subtract(camera), this.orientation, 0, this.player.id);
    }
    super.draw(camera);
  }

  getModel() {
    if (this.state == Unit.ATTACKING) {
      return this.models.ram;
    }
    else {
      return super.getModel();
    }
  }

  thumbnail() {
    return 63;
  }

  upgradesTo() {
    return {
      siegeRam: SiegeRam,
    };
  }
};
