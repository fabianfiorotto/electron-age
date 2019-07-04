const Building = require('../building');
const Archer = require('./archer');

module.exports = class ArcheryRange extends Building {

  getSize() {
    return 3;
  }

  iconsResources() {
    return [{
      interface: 50706,
      frames: {
        thumbnail: 0,
      }
    },
    {
      interface: 50730,
      frames: {
        archer: 17,
      }
    }];
  }

  modelsResources() {
    return {
      sounds: {
        click: 5003
      }
    };
  }

  controls() {
    var icons = this.icons;
    return [
      [
        {
          icon: icons.archer,
          callback : () => this.createUnit(Archer)
        }
      ],
    ];
  }

};
