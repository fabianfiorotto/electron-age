const Building = require('../building');

module.exports = class BombardTower extends Building {

  getSize() {
    return 1;
  }

  thumbnail() {
    return 42;
  }

  minAge() {
    return 4;
  }
};
