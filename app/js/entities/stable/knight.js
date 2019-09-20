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

  defineProperties() {
    return {
      speed: 1.35,
      hitPoints: 100,
      maxHitPoints: 100,
      attack: 4,
      meleeArmor: 2,
      pierceArmor: 2,
      lineofSeight: 4,
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
