const Building = require('../building');

module.exports = class Blacksmith extends Building {

  getSize() {
    return 3;
  }

  iconsResources() {
    return [{
      interface: 50706,
      frames: {
        thumbnail: 4,
      }
    }];
  }

  modelsResources() {
    return {
      sounds: {
        click: 5011
      }
    };
  }

};
