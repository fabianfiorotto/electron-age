const SiegeUnit = require('./siege_unit');
const CappedRam = require('./capped_ram');

module.exports = class BatteringRam extends SiegeUnit {

  modelsResources() {
    return {
      unit: {
        attacking: 171,
        dying: 176,
        stand: 179,
        rotting: 180,
        walking: 181,

        wheels: 183,
        ram: 173
      }
    };
  }

  thumbnail() {
    return 74;
  }

  upgradesTo() {
    return {
      cappedRam: CappedRam,
    };
  }
};
