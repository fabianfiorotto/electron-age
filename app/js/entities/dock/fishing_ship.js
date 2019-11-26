const Unit = require('../unit');
module.exports = class FishingShip extends Unit {

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

  getModel() {
    return this.models.hull;
  }

};
