const Projectile = require('./projectile');

module.exports = class Dart extends Projectile {

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

  }

  draw(camera) {
    this.getModel()?.draw(camera);
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
    });
  }

  getModel() {
    return this.models.arrow;
  }

  // modelsResources() {
  //   return {
  //     projectile: {
  //       arrow: 50
  //     }
  //   };
  // }

  async loadResources(res) {
    this.models.arrow = await res.loadProjectileInstance(this, 50);
  }

};
