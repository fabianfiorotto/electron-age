const Unit = require('../unit');

module.exports = class Trebuchet extends Unit {

  modelsResources() {
    return {
      unit: {
        stand: 4497,
        walking: 4498
      }
    };
  }

  thumbnail() {
    return 58;
  }

};
