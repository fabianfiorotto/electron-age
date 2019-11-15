
const Entity = require('../entity');

module.exports = class Arrow extends Entity {

  constructor(map, player) {
    super(map, player);
    this.v = $V([10, 10]);
    this.posZ = this.pos;
    this.z = 0;
  }

  setTarget(target) {
    this.targetEntity = target;
    this.target = target.pos;
    this.v = this.target.subtract(this.pos).toUnitVector().multiply(3);
    this.distance = this.pos.distanceFrom(this.target);
    this.orientation = Math.atan2(-this.v.e(2), this.v.e(1));

  }

  draw(camera) {
    if (this.getModel()) {
      this.getModel().draw(this.posZ.subtract(camera), this.orientation, 0, this.player.id);
    }
  }

  update() {
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

      this.posZ = this.pos.add($V([0,z]));
    }
  }

  causeDamage() {
    var entity = this.targetEntity;
    var targetMove = this.target.distanceFrom(entity.pos);

    if (targetMove < 30) {
      if (entity.properties.hitPoints) {
        entity.properties.hitPoints -= 1;
        entity.emitter.emit('did-change-properties', entity.properties);
      }
      else {
        entity.onEntityDestroy();
      }
    }
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
    this.models.arrow = await res.loadProjectile(50);
    var base_id = 50505;
    this.models.arrow.load({
      base: resources.palettes[base_id],
      player: this.player.id
    });
  }

};