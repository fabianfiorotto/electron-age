const Boat = require('./boat');
module.exports = class FishingShip extends Boat {

  modelsResources() {
    return {
      unit: {
        hull: 444,
      }
    };
  }

  thumbnail() {
    return 24;
  }

};
