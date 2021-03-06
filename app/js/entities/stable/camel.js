const Unit = require('../unit');
const HeavyCamel = require('./heavy');

module.exports = class Camel extends Unit {

  static cavalryAttackBonus = {
    apply(attacker, target) {
      return target.isType(EntityType.CAVALRY);
    },
    value(attacker, target) {
      return 9;
    }
  }

  static camelAttackBonus = {
    apply(attacker, target) {
      return target.isType(EntityType.CAMEL);
    },
    value(attacker, target) {
      return 5;
    }
  }

  static shipAttackBonus = {
    apply(attacker, target) {
      return target.isType(EntityType.SHIP);
    },
    value(attacker, target) {
      return 5;
    }
  }

  modelsResources() {
    return {
      unit: {
        attacking: 676,
        dying: 679,
        stand: 682,
        rotting: 683,
        walking: 686,
      }
    };
  }

  upgradesTo() {
    return {
      heavyCamel: HeavyCamel,
    };
  }

  thumbnail() {
    return 78;
  }

  defineProperties() {
    return {
      speed: 1.45,
      hitPoints: 100,
      attack: 6,
      meleeArmor: 0,
      pierceArmor: 0,
      lineofSeight: 4,
    }
  }

  defineTypes() {
    return [EntityType.CAMEL];
  }

  defineAttackBonuses() {
    return [
      Camel.cavalryAttackBonus,
      Camel.camelAttackBonus,
      Camel.shipAttackBonus
    ]
  }


};
