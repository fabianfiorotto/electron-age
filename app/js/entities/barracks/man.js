const Unit = require('../unit');
const LongSwordMan = require('./long_sword.js');

module.exports = class ManAtArms extends Unit {

  upgradesTo() {
    return {
      longSwordMan: LongSwordMan,
    };
  }

  modelsResources() {
    return {
      unit: {
        attacking: 1038,
        dying: 1041,
        stand: 1044,
        rotting: 1045,
        walking: 1048,
      }
    };
  }


  thumbnail() {
    return 13;
  }

};
