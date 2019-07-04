const Building = require('../building');

module.exports = class Stable extends Building {

  getSize() {
    return 3;
  }

  iconsResources() {
    return [{
      interface: 50706,
      frames: {
        thumbnail: 23,
      }
    }];
  }

  modelsResources() {
    return {
      sounds: {
        click: 5134
      }
    };
  }

};
