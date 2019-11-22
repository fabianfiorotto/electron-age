const Building = require('../building');
module.exports = class Dock extends Building {


  thumbnail() {
    return 13;
  }

  getSize() {
    return 3;
  }

  modelsResources() {
    return {
      model: {
        // building: 409, //beta?
        building: 376,
        animation: 4518,
        shadow: 374,
        marks: 4397,
        debries: 4597
      },
      sounds: {
        click: 5043
      }
    };
  }

};
