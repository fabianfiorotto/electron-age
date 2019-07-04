const Building = require('../building');

module.exports = class Market extends Building {

  iconsResources() {
    return [{
      interface: 50706,
      frames: {
        thumbnail: 16,
      }
    }];
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
