const Building = require('../building');
const Dart = require('../projectiles/dart');

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

  getProjectileClass() {
    return Dart;
  }

};
