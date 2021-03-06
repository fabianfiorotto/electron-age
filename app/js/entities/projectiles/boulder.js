const Projectile = require('./projectile');

module.exports = class Boulder extends Projectile {

  constructor(map, player) {
    super(map, player);
    this.v = $V([10, 10]);
  }

  setTarget(target) {
    this.targetEntity = target;
    this.target = target.pos;
    this.v = this.target.subtract(this.pos).toUnitVector().multiply(3);
    this.distance = this.pos.distanceFrom(this.target);
    this.orientation = Math.atan2(-this.v.e(2), this.v.e(1));


    this.debug = [];
  }

  draw(camera) {
    if (this.getModel()) {
      this.getModel().draw(camera);
    }
  }

  update() {
    this.each(10, 'projectile_move' , () => {
      var oldDis = this.pos.distanceFrom(this.target);

      this.pos = this.pos.add(this.v);
      var dis = this.pos.distanceFrom(this.target);

      if (oldDis < dis) {
        this.map.removeEntity(this);
        this.causeDamage();
      }
      else {
        var d = dis / this.distance;
        var z = 300 * d**2 - 300 * d;
        this.orientation = Math.atan(300*2*d - 300);

        let model = this.getModel();
        if (model) {
          model.pos = $V([0,z]);
        }
      }
    });
  }

  getModel() {
    if (this.player.technologies.chemistry) {
      return this.models.burningBolder;
    }
    else {
      return this.models.boulder;
    }
  }

  modelsResources() {
    return {
      model: {
        boulder: 212,
        burningBolder: 210
      }
    };
  }
};
