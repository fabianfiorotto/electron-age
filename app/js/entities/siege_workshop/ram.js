const Unit = require('../unit');
const CappedRam = require('./capped_ram');

module.exports = class BatteringRam extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 171,
        dying: 176,
        stand: 179,
        rotting: 180,
        walking: 181,

        wheels: 183,
        ram: 173
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
    return 74;
  }

  upgradesTo() {
    return {
      cappedRam: CappedRam,
    };
  }
};
