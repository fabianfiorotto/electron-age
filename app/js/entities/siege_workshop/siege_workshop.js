const Building = require('../building');

module.exports = class SiegeWorkshop extends Building {

  getSize() {
    return 3;
  }

  modelsResources() {
    return {
      sounds: {
        click: 5127
      }
    };
  }

  thumbnail() {
    return 22;
  }

};
