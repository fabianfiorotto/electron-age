const SiegeUnit = require('./siege_unit');
const SiegeOnager = require('./siege_onager');

module.exports = class Onager extends SiegeUnit {

  modelsResources() {
    return {
      unit: {
        attacking: 3017,
        dying: 3020,
        stand: 3023,
        rotting: 4168,
        walking: 3024,
        wheels: 3026,
      }
    };
  }

  thumbnail() {
    return 101;
  }

  upgradesTo() {
    return {
      siegeOnager: SiegeOnager,
    };
  }
};
