const Unit = require('../unit');
const TwoHandedSwordMan = require('./two_handed.js');

module.exports = class LongSwordMan extends Unit {

  upgradesTo() {
    return {
      twoHandedSwordMan: TwoHandedSwordMan,
    };
  }

  modelsResources() {
    return {
      unit: {
        attacking: 702,
        dying: 705,
        stand: 708,
        rotting: 710,
        walking: 713,
      }
    };
  }

  thumbnail() {
    return 10;
  }

};
