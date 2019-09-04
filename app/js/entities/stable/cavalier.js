const Unit = require('../unit');
const Paladin = require('./paladin');

module.exports = class Cavalier extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 849,
        dying: 852,
        stand: 855,
        rotting: 856,
        walking: 859,
      }
    };
  }

  upgradesTo() {
    return {
      paladin: Paladin,
    };
  }

  thumbnail() {
    return 20;
  }

};
