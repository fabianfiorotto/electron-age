const Unit = require('../unit');

module.exports = class HeavyCamel extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 2762,
        dying: 2765,
        stand: 2768,
        rotting: 2769,
        walking: 2772,
      }
    };
  }

  thumbnail() {
    return 79;
  }

};
