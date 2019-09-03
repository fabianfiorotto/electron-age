const Unit = require('../unit');
const SlpProjectileModel = require('../../slp/projectile');
const HeavyCavalryArcher = require('./heavy');

module.exports = class CavalryArcher extends Unit {

  modelsResources() {

    return {
      unit: {
        attacking: 320,
        dying: 323,
        stand: 326,
        rotting: 327,
        walking: 330,
      }
    };
  }

  upgradesTo() {
    return {
      heavyCavalryArcher: HeavyCavalryArcher,
    };
  }

  thumbnail() {
    return 19;
  }

};
