const Unit = require('../unit');
const SlpProjectileModel = require('../../slp/projectile');

module.exports = class HeavyCavalryArcher extends Unit {

  modelsResources() {

    return {
      unit: {
        attacking: 3757,
        dying: 3760,
        stand: 3763,
        rotting: 3764,
        walking: 3767,
      }
    };
  }

  thumbnail() {
    return 71;
  }

};
