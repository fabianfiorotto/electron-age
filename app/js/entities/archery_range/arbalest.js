const Unit = require('../unit');
const SlpProjectileModel = require('../../slp/projectile');

module.exports = class Archer extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 2698,
        dying: 2701,
        stand: 2704,
        rotting: 2705,
        walking: 2708,
      }
    };
  }

  thumbnail() {
    return 90;
  }

};
