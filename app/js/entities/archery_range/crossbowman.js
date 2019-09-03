const Unit = require('../unit');
const SlpProjectileModel = require('../../slp/projectile');
const Arbalest = require('./arbalest');

module.exports = class Crossbowman extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 186,
        dying: 189,
        stand: 192,
        rotting: 193,
        walking: 196,
      }
    };
  }

  upgradesTo() {
    return {
      arbalest: Arbalest,
    };
  }

  thumbnail() {
    return 18;
  }

};
