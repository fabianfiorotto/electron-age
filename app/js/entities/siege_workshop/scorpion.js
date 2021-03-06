const SiegeUnit = require('./siege_unit');

const HeavyScorpion = require('./heavy_scorpion');

module.exports = class Scorpion extends SiegeUnit {

  modelsResources() {
    return {
      unit: {
        attacking: 936,
        dying: 939,
        stand: 942,
        rotting: 943,
        walking: 944,

        wheels: 946
      }
    };
  }

  thumbnail() {
    return 80;
  }

  upgradesTo() {
    return {
      heavyScorpion: HeavyScorpion,
    };
  }
};
