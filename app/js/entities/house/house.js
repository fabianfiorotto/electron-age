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
      constructionTime: 25,
      hitPoints: 550,
      meleeArmor: 0,
      pierceArmor: 7,
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
    this.models.building.randomFrame();
  }

};
