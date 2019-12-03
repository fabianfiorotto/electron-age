const Building = require('../building');
const Wall = require('./wall');

module.exports = class Palisade extends Wall {

  modelsResources() {
    return {
      model: {
        // building: 1828
        building: 4915
      },
    };
  }

  thumbnail() {
    return 30;
  }

};
