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
    return this.target.pos.subtract(this.pos).modulus() < 300.0;
  }

  getProjectileClass() {
    return Arrow;
  }

  thumbnail() {
    return 17;
  }

};
