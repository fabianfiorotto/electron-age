const Unit = require('../unit');
const SlpProjectileModel = require('../../slp/projectile');

module.exports = class Archer extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 2,
        dying: 5,
        stand: 8,
        rotting: 9,
        walking: 12,
      }
    };
  }

  canReachTarget() {
    return this.target.pos.subtract(this.pos).modulus() < 200.0;
  }

  draw(camera) {
    super.draw(camera);
    if (this.arrowPos) {
      this.models.arrow.draw(this.arrowPos.subtract(camera), this.orientation, 0, this.player.id);
    }
  }

  update() {
    super.update();
    if (this.arrowPos) {
      var v = this.arrowTarget.subtract(this.arrowPos);
      if (v.modulus() <= 3.0) {
        this.arrowPos = null;
        if (this.target.properties.hitPoints) {
          this.target.properties.hitPoints -= 1;
          this.target.emitter.emit('did-change-properties', this.target.properties);
        }
        else {
          this.state = Unit.IDLE;
          this.target.onEntityDestroy();
        }
      }
      else {
        this.arrowPos = this.arrowPos.add(v.toUnitVector().multiply(3));
      }
    }
  }

  attack() {
    if (!this.arrowPos) {
      this.arrowTarget = this.target.pos;
      this.arrowPos = this.pos;
    }
  }

  async loadResources(res) {
    this.models.arrow = await res.loadProjectile(50);
    var base_id = 50505;
    this.models.arrow.load({
      base: resources.palettes[base_id],
      player: this.player.id
    });
  }

  thumbnail() {
    return 17;
  }

};
