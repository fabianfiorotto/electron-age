const Wall = require('./wall');

module.exports = class FortifiedWall extends Wall {

  minAge() {
    return 3;
  }

  thumbnail() {
    return 31;
  }

  getFrame() {
    return this.getStoneWallFrame();
  }

  getModel() {
    return this.getStoneWallModel();
  }

};
