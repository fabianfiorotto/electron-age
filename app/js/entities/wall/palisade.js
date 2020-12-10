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

  startBuilding() {
    super.startBuilding();
    this.models.marks.frame = 0;
  }

  updateBuildingProcess() {
    let {hitPoints, maxHitPoints} = this.properties;
    this.models.marks.progressFrame(hitPoints / maxHitPoints);
  }

  thumbnail() {
    return 30;
  }

  updateBuildingProcess() {
  }

};
