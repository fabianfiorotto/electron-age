const Unit = require('../unit');
const Halberdier = require('./halberdier');

module.exports = class Pikeman extends Unit {

  modelsResources() {

    return {
      unit: {
        attacking: 2826,
        dying: 2829,
        stand: 2832,
        rotting: 2833,
        walking: 2836,
      }
    };
  }

  thumbnail() {
    return 11;
  }

  upgradesTo() {
    return {
      halberdier: Halberdier,
    };
  }
};
