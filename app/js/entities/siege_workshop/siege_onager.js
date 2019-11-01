const Unit = require('../unit');

module.exports = class SiegeOnager extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 3553,
        dying: 3556,
        stand: 3559,
        rotting: 3560,
        walking: 3561,
        wheels: 3563,






      }
    };
  }

  thumbnail() {
    return 102;
  }
};
