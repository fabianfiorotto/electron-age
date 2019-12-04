const Wall = require('./wall');
const FortifiedWall = require('./fortified');

module.exports = class StoneWall extends Wall {

  minAge() {
    return 2;
  }

  thumbnail() {
    return 29;
  }

  getFrame() {
    return this.getStoneWallFrame();
  }

  getModel() {
    return this.getStoneWallModel();
  }

  upgradesTo() {
    return {
      fortifiedWall: FortifiedWall,
    };
  }

};
