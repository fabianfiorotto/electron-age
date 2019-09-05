const Unit = require('../unit');

module.exports = class Halberdier extends Unit {

  modelsResources() {

    return {
      unit: {
        attacking: 2787,
        dying: 2790,
        stand: 2793,
        rotting: 2794,
        walking: 2797,
      }
    };
  }

  thumbnail() {
    return 104;
  }

};
