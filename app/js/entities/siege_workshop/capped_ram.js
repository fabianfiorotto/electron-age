const SiegeUnit = require('./siege_unit');
const SiegeRam = require('./siege_ram');

module.exports = class CappedRam extends SiegeUnit {

  modelsResources() {
    return {
      unit: {
        attacking: 1681,
        dying: 1686,
        stand: 1689,
        rotting: 1690,
        walking: 1691,
        wheels: 1693,
        ram: 1683
      }
    };
  }

  thumbnail() {
    return 63;
  }

  upgradesTo() {
    return {
      siegeRam: SiegeRam,
    };
  }
};
