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

  iconsResources() {
    return [
      {
        interface: 50706,
        frames: {
          thumbnail: 22
        }
      }
    ];
  }

};
