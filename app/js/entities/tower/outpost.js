const Building = require('../building');

module.exports = class Outpost extends Building {

  getSize() {
    return 1;
  }

  thumbnail() {
    return 9;
  }

  modelsResources() {
    return {
      model: {
        building: 4330,
        shadow: 4364
      },
    };
  }

};
