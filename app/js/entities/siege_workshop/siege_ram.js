const SiegeUnit = require('./siege_unit');

module.exports = class SiegeRam extends SiegeUnit {

  modelsResources() {
    return {
      unit: {
        attacking: 3027,
        dying: 3032,
        stand: 3035,
        rotting: 3036,
        walking: 3037,

        wheels: 3039,
        ram: 3029
      }
    };
  }

  thumbnail() {
    return 73;
  }

};
