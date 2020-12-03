const Entity = require('../entity');

module.exports = class Relic extends Entity {


  initialize() {
    this.pos = $V([965, 127]);
  }

  modelsResources() {
    return {
      model: {
        relic: 53,
      }
    };
  }

  getModel() {
    return this.models.relic;
  }


  iconsResources() {
    return [
      {
        interface: 50730,
        frames: {
          thumbnail: 26,
        }
      },
    ];
  }

  isAt(pos) {
    return this.pos.subtract(pos).modulus() < 20.0;
  }

  draw(camera) {
    if (this.getModel()) {
      this.getModel().draw(this.pos.subtract(camera), 0, this.getFrame());
    }
  }

  defineTypes() {
    return [EntityType.RELIC];
  }

}
