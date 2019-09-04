const Unit = require('../unit');
const Cavalier = require('./cavalier');

module.exports = class Knight extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 663,
        dying: 666,
        stand: 669,
        rotting: 670,
        walking: 673,
      }
    };
  }

  upgradesTo() {
    return {
      cavalier: Cavalier,
    };
  }

  thumbnail() {
    return 1;
  }

};
