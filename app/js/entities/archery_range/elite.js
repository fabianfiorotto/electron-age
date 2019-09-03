const Unit = require('../unit');
const SlpProjectileModel = require('../../slp/projectile');

module.exports = class EliteSkirmisher extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 607,
        dying: 610,
        stand: 613,
        rotting: 614,
        walking: 617,
      }
    };
  }

  thumbnail() {
    return 21;
  }

};
