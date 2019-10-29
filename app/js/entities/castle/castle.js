const Building = require('../building');

module.exports = class Castle extends Building {

  getSize() {
    return 4;
  }

  modelsResources() {
    return {
      sounds: {
        click: 5032
      }
    };
  }

  thumbnail() {
    return 7;
  }

};
