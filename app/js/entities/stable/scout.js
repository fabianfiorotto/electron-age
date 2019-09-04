const Unit = require('../unit');
const LightCavalry = require('./light');

module.exports = class ScoutCavalry extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 2079,
        dying: 2082,
        stand: 2085,
        rotting: 2086,
        walking: 2089,
      }
    };
  }

  upgradesTo() {
    return {
      lightCavalry: LightCavalry,
    };
  }

  thumbnail() {
    return 64;
  }


};
