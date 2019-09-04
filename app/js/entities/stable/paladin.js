const Unit = require('../unit');

module.exports = class Paladin extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 3072,
        dying: 3075,
        stand: 3078,
        rotting: 3079,
        walking: 3082,
      }
    };
  }

  thumbnail() {
    return 2;
  }

};
