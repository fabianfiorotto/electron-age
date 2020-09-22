const Building = require('../building');

const Trebuchet = require('./trebuchet');
const Petard = require('./petard');

module.exports = class Castle extends Building {

  getSize() {
    return 4;
  }

  modelsResources() {
    return {
      sounds: {
        click: 5032
      }
    };
  }

  thumbnail() {
    return 7;
  }

  unitsIcons() {
    return {
      createTrebuchet: 29,
      createPetard: 58,
    };
  }

  defineDashboardControls() {
    return {
      main: [
        'createPetard', 'createTrebuchet'
      ]
    };
  }

  defineControls() {
    var icons = this.icons;
    return {
      createPetard: {
        icon: icons.createPetard,
        time: 5,
        prepare: () => this.prepareUnit(Petard),
        callback : () => this.createUnit()
      },
      createTrebuchet: {
        icon: icons.createTrebuchet,
        time: 5,
        prepare: () => this.prepareUnit(Trebuchet),
        callback : () => this.createUnit()
      },
    }
  }

  minAge() {
    return 3;
  }

};
