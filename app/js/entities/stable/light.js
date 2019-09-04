const Unit = require('../unit');

module.exports = class LightCavalry extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 2998,
        dying: 3001,
        stand: 3004,
        rotting: 3005,
        walking: 3008,
      }
    };
  }

  thumbnail() {
    return 91;
  }

};
