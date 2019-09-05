const Unit = require('../unit');
const Pikeman = require('./pikeman');

module.exports = class Spearman extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 867,
        dying: 870,
        stand: 873,
        rotting: 874,
        walking: 877,
      }
    };
  }

  thumbnail() {
    return 31;
  }

  upgradesTo() {
    return {
      pikeman: Pikeman,
    };
  }

};
