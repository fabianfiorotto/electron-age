const Unit = require('../unit');
const LightCavalry = require('./light');

module.exports = class ScoutCavalry extends Unit {

  defineProperties() {
    return {
      speed: 1.2,
      hitPoints: 45,
      maxHitPoints: 45,
      attack: 3,
      meleeArmor: 0,
      pierceArmor: 1,
      lineofSeight: 4,
    };
  }

  updateProperties() {
    if (this.player.age >= 2) {
      this.properties.speed = 1.55;
      this.properties.attack = 5;
    }
  }


  modelsResources() {
    return {
      unit: {
        attacking: 2079,
        dying: 2082,
        stand: 2085,
        rotting: 2086,
        walking: 2089,
      }
    };
  }

  upgradesTo() {
    return {
      lightCavalry: LightCavalry,
    };
  }

  thumbnail() {
    return 64;
  }

  updateSpeedProperty() {
    switch (this.player.age) {
      case 2:
        break;
      case 3:
        this.properties.speed = 1.55;
        break;
      case 4:
        this.properties.speed = 1.55;
        break;
    }
  }

};
