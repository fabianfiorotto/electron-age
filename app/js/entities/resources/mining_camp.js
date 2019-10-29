const Building = require('../building');

module.exports = class MiningCamp extends Building {

  getSize() {
    return 2;
  }

  thumbnail() {
    return 39;
  }

};
