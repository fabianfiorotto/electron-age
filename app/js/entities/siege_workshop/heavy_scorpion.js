const Unit = require('../unit');

module.exports = class heavyScorpion extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 2813,
        dying: 2816,
        stand: 2819,
        rotting: 2820,
        walking: 2821,
        wheels: 2823
      }
    };
  }

  thumbnail() {
    return 89;
  }
};
