const Building = require('../building');

module.exports = class Monastery extends Building {

  getSize() {
    return 3;
  }

  modelsResources() {
    return {
      sounds: {
        click: 5031
      }
    };
  }

  thumbnail() {
    return 32;
  }

};
