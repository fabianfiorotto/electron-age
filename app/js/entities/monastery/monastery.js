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

  iconsResources() {
    return [
      {
        interface: 50706,
        frames: {
          thumbnail: 32
        }
      }
    ];
  }

};
