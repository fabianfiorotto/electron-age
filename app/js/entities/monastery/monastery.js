const Building = require('../building');
const Monk = require('./monk');

module.exports = class Monastery extends Building {

  getSize() {
    return 3;
  }

  modelsResources() {
    return {
      sounds: {
        click: 5031
      }
    };
  }

  thumbnail() {
    return 10;
  }

  unitsIcons() {
    return {
      createMonk: 33,
    };
  }

  controls() {
    var icons = this.icons;
    return [
      {
        icon: icons.createMonk,
        time: 5,
        cost: {gold: 100},
        prepare: () => this.prepareUnit(Monk),
        callback : () => this.createUnit()
      }
    ];
  }

  minAge() {
    return 3;
  }

};
