const Building = require('../building');

module.exports = class House extends Building {

  iconsResources() {
    return [{
      interface: 50706,
      frames: {
        thumbnail: 34,
      }
    }];
  }

  getSize() {
    return 2;
  }

  modelsResources() {
    return {
      model: {
        building: 2223
      },
      sounds: {
        click: 5463
      }
    };
  }

  onResourcesLoaded() {
    this.modelFrame = Math.floor(Math.random() * this.models.building.frames.length);
  }

};
