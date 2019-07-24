const Entity = require('./entity');

module.exports = class Resource extends Entity {

  draw(camera) {
    if (this.getModel()) {
      this.getModel().draw(this.pos.subtract(camera), 0, this.getFrame());
    }
  }

  isAt(pos) {
    return this.pos.subtract(pos).modulus() < 50.0;
  }

};
