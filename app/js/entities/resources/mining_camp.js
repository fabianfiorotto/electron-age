const Building = require('../building');

module.exports = class MiningCamp extends Building {

  getSize() {
    return 2;
  }
  
  iconsResources() {
    return [{
      interface: 50706,
      frames: {
        thumbnail: 39,
      }
    }];
  }

}