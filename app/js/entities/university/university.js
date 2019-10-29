const Building = require('../building');

module.exports = class University extends Building {

  getSize() {
    return 4;
  }

  modelsResources() {
    return {
      sounds: {
        click: 5229
      }
    };
  }

  thumbnail() {
    return 32;
  }

  unitsIcons() {
    return {
      masonry: 13,
      architecture: 14,
      fortifiedWall: 46,
      chemistry: 12,
      bombardTower: 47,
      ballistica: 25,
      siegeEngineers: 101,
      guardTower: 76,
      keep: 26,
      heatedShot: 104,
      murderHoles: 61,
      treadmillCrane: 60,
    };
  }

  controls() {
    var icons = this.icons;
    return [
      this.developControlGroup({
        masonry: 3,
        architecture: 4,
      }),
      this.developControlGroup({
        fortifiedWall: 3,
        chemistry: 4,
        bombardTower: 4,
      }),
      this.developControlGroup({
        ballistica: 3,
        siegeEngineers: 4,
      }),
      this.developControlGroup({
        guardTower: 3,
        keep: 4,
      }),
      this.developControlGroup({
        heatedShot: 3,
      }),
      this.developControlGroup({
        murderHoles: 3,
      }),
      this.developControlGroup({
        treadmillCrane: 3,
      }),
    ];
  }

};
