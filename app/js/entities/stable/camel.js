const Unit = require('../unit');
const HeavyCamel = require('./heavy');

module.exports = class Camel extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 676,
        dying: 679,
        stand: 682,
        rotting: 683,
        walking: 686,
      }
    };
  }

  upgradesTo() {
    return {
      heavyCamel: HeavyCamel,
    };
  }

  thumbnail() {
    return 78;
  }

};
