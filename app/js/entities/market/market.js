const Building = require('../building');

module.exports = class Market extends Building {

  thumbnail() {
    return 16;
  }

  modelsResources() {
    return {
      sounds: {
        click: 5110
      }
    };
  }

  getSize() {
    return 4;
  }

};
