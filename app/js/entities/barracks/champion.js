const Unit = require('../unit');

module.exports = class Champion extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 3085,
        dying: 3088,
        stand: 3091,
        rotting: 3092,
        walking: 3095,
      }
    };
  }

  thumbnail() {
    return 72;
  }
};
