const Building = require('../building');
const ManAtArms = require('./man');
const Miliatia = require('./militia');

module.exports = class Barracks extends Building {

  getSize() {
    return 3;
  }

  modelsResources() {
    return {
      model: {
        building: 2683
      },
      sounds: {
        click: 5012
      }
    };
  }

  iconsResources() {
    return [
      {
        interface: 50706,
        frames: {
          thumbnail: 2,
        }
      },
      {
        interface: 50729,
        frames: {
          researchManAtArms: 85
        }
      },
      {
        interface: 50730,
        frames: {
          militia: 8,
          manAtArms: 13
        }
      }
    ];
  }

  controls() {
    var icons = this.icons;
    return [
      [
        {
          icon: icons.militia,
          callback : () => this.createUnit(Miliatia)
        },
        {
          icon: icons.manAtArms,
          condition: () => this.player.tecnologies.manAtArms,
          callback : () => this.createUnit(ManAtArms)
        }
      ],
      null,
      null,
      null,
      null,
      {
        icon: icons.researchManAtArms,
        condition: () => this.player.age >= 2 && !this.player.tecnologies.manAtArms,
        callback : () => this.player.develop("manAtArms")
      },
    ];
  }

};
