const Livestock = require('./livestock');

module.exports = class Sheep extends Livestock {

  providesFood() {
    return 100;
  }

  defineProperties() {
    return {
      speed: 0.8,
      hitPoints: 7,
      maxHitPoints: 7,
      attack: 0,
      meleeArmor: 0,
      pierceArmor: 0,
      lineofSeight: 3,
    };
  }

  modelsResources() {
    return {
      unit: {
        dying: 3626,
        stand: 3629,
        rotting: 3631,
        walking: 3634,
      }
    };
  }

  thumbnail() {
    return 96;
  }

};
