const Entity = require('../entity');

module.exports = class Projectile extends Entity {


  static fire(attacker) {
    var projectile = new this(attacker.map, attacker.player);
    projectile.pos = attacker.pos;
    projectile.setTarget(attacker.target);
    projectile.setAttacker(attacker);
    return projectile;
  }


  setAttacker(attacker) {
    this.attacker = attacker;
  }

  causeDamage() {
    // console.log(this.debug);
    var entity = this.targetEntity;
    var targetMove = this.target.distanceFrom(entity.pos);

    if (targetMove < 30) {
      if (entity.properties.hitPoints) {
        let damage = this.attacker.attackProjectileDamage(entity);
        entity.decProperty({hitPoints: damage});
      }
      else {
        entity.onEntityDestroy();
      }
    }
  }

}
