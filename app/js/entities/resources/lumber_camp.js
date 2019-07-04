const Building = require('../building');

module.exports = class LumberCamp extends Building {

  getSize() {
    return 2;
  }
  
  iconsResources() {
    return [{
      interface: 50706,
      frames: {
        thumbnail: 40,
      }
    }];
  }

}