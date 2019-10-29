const Building = require('../building');

module.exports = class Palisade extends Building {

  getSize() {
    return 1;
  }

  getFrame() {
    return 2;
  }

  modelsResources() {
    return {
      model: {
        // building: 1828
        building: 4915
      },
    };
  }

  thumbnail() {
    return 30;
  }

};
