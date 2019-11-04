const Unit = require('../unit');

module.exports = class SiegeUnit extends Unit {


  draw(camera) {
    if (this.models.walking && this.models.wheels && this.state == Unit.WALKING) {
      this.models.walking.draw(this.pos.subtract(camera), this.orientation, 0, this.player.id);
    }
    if (this.models.attacking && this.models.ram && this.state == Unit.ATTACKING) {
      this.models.attacking.draw(this.pos.subtract(camera), this.orientation, 0, this.player.id);
    }
    super.draw(camera);
  }

  getModel() {
    switch (this.state) {
      case Unit.WALKING:
        return this.models.wheels || this.models.walking;
      case Unit.DYING:
        return this.models.dying;
      case Unit.ATTACKING:
        return this.models.ram || this.models.attacking;
      case Unit.ROTTING:
        return this.models.rotting;
      default:
        return this.models.stand;
    }
  }

};
