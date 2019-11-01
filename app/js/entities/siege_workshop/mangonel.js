const Unit = require('../unit');
const Onager = require('./onager');

module.exports = class Mangonel extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 716,
        dying: 719,
        stand: 722,
        rotting: 723,
        walking: 724,
        wheels: 726,
      }
    };
  }

  thumbnail() {
    return 27;
  }

  upgradesTo() {
    return {
      onager: Onager,
    };
  }
};
