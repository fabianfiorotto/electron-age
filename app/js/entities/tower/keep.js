const Building = require('../building');

module.exports = class Keep extends Building {

  getSize() {
    return 1;
  }

  thumbnail() {
    return 27;
  }

  minAge() {
    return 4;
  }

};
