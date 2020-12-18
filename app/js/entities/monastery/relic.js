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
    this.getModel()?.draw(camera);
  }

  drawSelection(camera) {
    resources.drawCircle(this.pos.subtract(camera), 30);
  }

  defineTypes() {
    return [EntityType.RELIC];
  }

}
