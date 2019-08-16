const Unit = require('../unit');
const ManAtArms = require('./man');

module.exports = class Militia extends Unit {

  upgradesTo() {
    return {
      manAtArms: ManAtArms,
    };
  }

  modelsResources() {
    return {
      unit: {
        attacking: 987,
        dying: 990,
        stand: 993,
        rotting: 994,
        walking: 997,
      },
    };
  }

  iconsResources() {
    return [
      {
        interface: 50730,
        frames: {
          thumbnail: 8,
        }
      },
    ];
  }

};
