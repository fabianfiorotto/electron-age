const Unit = require('../unit');

module.exports = class SiegeRam extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 3027,
        dying: 3032,
        stand: 3035,
        rotting: 3036,
        walking: 3037,

        wheels: 3039,
        ram: 3029
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
    return 73;
  }

};
