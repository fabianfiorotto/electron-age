const Unit = require('../unit');
const SlpProjectileModel = require('../../slp/projectile');
const ElitSkirmisher = require('./elite');

module.exports = class Skirmisher extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 1644,
        dying: 1647,
        stand: 1650,
        rotting: 1651,
        walking: 1654,
      }
    };
  }

  upgradesTo() {
    return {
      elitSkirmisher: ElitSkirmisher,
    };
  }

  thumbnail() {
    return 21;
  }

};
