const Unit = require('../unit');
const Champion = require('./champion.js');

module.exports = class TwoHandedSwordMan extends Unit {

  upgradesTo() {
    return {
      champion: Champion,
    };
  }

  modelsResources() {
    return {
      unit: {
        attacking: 2800,
        dying: 2803,
        stand: 2806,
        rotting: 2807,
        walking: 2810,
      }
    };
  }

  thumbnail() {
    return 12;
  }

};
