const Unit = require('../unit');
const ManAtArms = require('./man');

module.exports = class Militia extends Unit {

  upgradesTo() {
    return {
      manAtArms: ManAtArms,
    };
  }

  defineProperties() {
    return {
      speed: 0.9,
      hitPoints: 40,
      maxHitPoints: 40,
      attack: 4,
      meleeArmor: 0,
      pierceArmor: 1,
      lineofSeight: 4,
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

  thumbnail() {
    return 8;
  }

  defineTypes() {
    return [Unit.INFANTRY]
  }

};
