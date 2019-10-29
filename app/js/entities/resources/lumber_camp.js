const Building = require('../building');

module.exports = class LumberCamp extends Building {

  getSize() {
    return 2;
  }

  thumbnail() {
    return 40;
  }

}
