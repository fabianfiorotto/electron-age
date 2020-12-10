const Unit = require('../unit');
module.exports = class Boat extends Unit {

  draw(camera) {
    if (this.getModel()) {
      this.getModel().draw(camera);
    }
    if (this.models.sail) {
      this.models.sail.draw(camera);
    }
  }

  getModel() {
    return this.models.hull;
  }

  validTargetPos(pos) {
    return this.map.terrain.isWater(pos);
  }

};
