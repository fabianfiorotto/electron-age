const Unit = require('../unit');
module.exports = class Boat extends Unit {

  draw(camera) {
    if (this.getModel()) {
      this.getModel().draw(this.pos.subtract(camera), this.orientation, this.getFrame(), this.player.id);
    }
    if (this.models.sail) {
      this.models.sail.draw(this.pos.subtract(camera), this.orientation, this.getFrame(), this.player.id);
    }
  }

  getModel() {
    return this.models.hull;
  }

  getFrame() {
    return 0;
  }

  validTargetPos(pos) {
    return this.map.terrain.isWater(pos);
  }

};
