const Building = require('../building');

module.exports = class Mild extends Building {

  getSize() {
    return 3;
  }

  modelsResources() {
    return {
      model: {
        building: 3483,
        animation: 3482
      },
      sounds: {
        click: 5100
      }
    };
  }

  iconsResources() {
    return [
      {
        interface: 50706,
        frames: {
          thumbnail: 19
        }
      }
    ];
  }

};
