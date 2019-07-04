const Unit = require('../unit');

module.exports = class ManAtArms extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 1038,
        dying: 1041,
        stand: 1044,
        rotting: 1045,
        walking: 1048,
      }
    };
  }

};
