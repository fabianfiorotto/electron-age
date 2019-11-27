const Building = require('../building');

module.exports = class GuardTower extends Building {

  getSize() {
    return 1;
  }

  thumbnail() {
    return 26;
  }

  minAge() {
    return 3;
  }

};
