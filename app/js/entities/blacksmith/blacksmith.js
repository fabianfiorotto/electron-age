const Building = require('../building');

module.exports = class Blacksmith extends Building {

  getSize() {
    return 3;
  }

  thumbnail() {
    return 4;
  }

  tecnologyIcons() {
    return {
      scaleMailArmor: 63,
      scaleBardingArmor: 66,
      chainMailArmor: 22,
      chainBardingArmor: 23,
      plateMailArmor: 64,
      plateBardingArmor: 65,
      fletching: 34,
      bodkinArrow: 35,
      bracer: 37,
      paddedArcherArmor: 49,
      leatherArcherArmor: 50,
      ringArcherArmor: 51,
      forgin: 17,
      ironCasting: 18,
      blastFurnance: 21,
    };
  }

  controls() {
    var icons = this.icons;
    return [
      this.developControlGroup({
        forgin: 2,
        ironCasting: 3,
        blastFurnance: 4,
      }),
      this.developControlGroup({
        scaleMailArmor: 2,
        chainMailArmor: 3,
        plateMailArmor: 4,
      }),
      this.developControlGroup({
        scaleBardingArmor: 2,
        chainBardingArmor: 3,
        plateBardingArmor: 4,
      }),
      null,
      null,
      this.developControlGroup({
        paddedArcherArmor: 2,
        leatherArcherArmor: 3,
        ringArcherArmor: 4,
      }),
      this.developControlGroup({
        fletching: 2,
        bodkinArrow: 3,
        bracer: 4,
      }),
    ];
  }
  modelsResources() {
    return {
      sounds: {
        click: 5011
      }
    };
  }

  minAge() {
    return 2;
  }

};
