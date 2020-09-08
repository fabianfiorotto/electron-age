const Unit = require('../unit');
const SlpProjectileModel = require('../../slp/projectile');
const Crossbowman = require('./crossbowman');

const Arrow = require('../projectiles/arrow');

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

  upgradesTo() {
    return {
      crossbow: Crossbowman,
    };
  }

  canReachTarget() {
    return this.target.pos.subtract(this.pos).modulus() < 200.0;
  }

  attack() {
    if (this.target.properties.hitPoints) {
      var arrow = new Arrow(this.map, this.player);
      arrow.pos = this.pos;
      arrow.setTarget(this.target);
      this.map.addEntity(arrow);
    }
    else {
      this.setState(Unit.IDLE);
    }
  }

  thumbnail() {
    return 17;
  }

  defineProperties() {
    return {
      range: 4,
      accuracy: 80,
      speed: 0.96,
      hitPoints: 30,
      maxHitPoints: 30,
      attack: 4,
      meleeArmor: 0,
      pierceArmor: 0,
      lineofSeight: 6,
    };
  }

  defineTypes() {
    return [Unit.ARCHER];
  }

};
