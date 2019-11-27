const Building = require('../building');

module.exports = class WatchTower extends Building {

  getSize() {
    return 1;
  }

  thumbnail() {
    return 25;
  }

  minAge() {
    return 2;
  }
};
