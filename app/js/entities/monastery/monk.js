const Unit = require('../unit');

module.exports = class Monk extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 768,
        dying: 771,
        stand: 774,
        rotting: 775,
        walking: 779,

        heal: 776,
        carry: 3827,
        carring: 3831

      }
    };
  }

  thumbnail() {
    return 33;
  }
};
