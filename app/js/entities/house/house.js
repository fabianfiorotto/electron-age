const Building = require('../building');

module.exports = class House extends Building {

  thumbnail() {
    return 34;
  }

  getSize() {
    return 2;
  }

  defineProperties() {
    return {
      hitPoints: 100,
      maxHitPoints: 100,
      population: 5,
      lineofSeight: 2,
    };
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
