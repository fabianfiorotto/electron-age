const Unit = require('../unit');

module.exports = class TradeCart extends Unit {

  modelsResources() {
    return {
      unit: {
        attacking: 1122,
        dying: 1119,
        stand: 1122,
        rotting: 1124,
        walking: 4486,

        carry: 1127,
        carring: 1900, //????
      }
    };
  }

  thumbnail() {
    return 34;
  }
};
