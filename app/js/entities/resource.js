const Entity = require('./entity');

module.exports = class Resource extends Entity {

  draw(camera) {
    this.getModel()?.draw(camera);
  }

  isAt(pos) {
    return this.pos.subtract(pos).modulus() < 50.0;
  }

  drawSelection(camera) {
    resources.drawSquare(this.pos.subtract(camera), 100);
  }

  defineTypes() {
    return [EntityType.RESOURCE];
  }

};
