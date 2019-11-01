const Unit = require('../unit');

module.exports = class BombarCannon extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 61,
        dying: 64,
        stand: 67,
        rotting: 68,
        walking: 71,
      }
    };
  }

  thumbnail() {
    return 30;
  }
};
