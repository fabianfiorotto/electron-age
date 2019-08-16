const Building = require('../building');
const ManAtArms = require('./man');
const Miliatia = require('./militia');
const LongSwordMan = require('./long_sword.js');
const TwoHandedSwordMan = require('./two_handed.js');
const Champion = require('./champion.js');

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
          manAtArms: 85,
          longSwordMan: 48,
          twoHandedSwordMan: 53,
          champion: 44,
        }
      },
      {
        interface: 50730,
        frames: {
          createMilitia: 8,
          createManAtArms: 13,
          createLongSwordMan: 10,
          createTwoHandedSwordMan: 12,
          createChampion: 72,
        }
      }
    ];
  }

  controls() {
    var icons = this.icons;
    return [
      [
        {
          icon: icons.createMilitia,
          callback : () => this.createUnit(Miliatia)
        },
        {
          icon: icons.createManAtArms,
          condition: () => this.player.tecnologies.manAtArms,
          callback : () => this.createUnit(ManAtArms)
        },
        {
          icon: icons.createLongSwordMan,
          condition: () => this.player.tecnologies.longSwordMan,
          callback : () => this.createUnit(LongSwordMan)
        },
        {
          icon: icons.createTwoHandedSwordMan,
          condition: () => this.player.tecnologies.twoHandedSwordMan,
          callback : () => this.createUnit(TwoHandedSwordMan)
        },
        {
          icon: icons.createChampion,
          condition: () => this.player.tecnologies.champion,
          callback : () => this.createUnit(Champion)
        }
      ],
      null,
      null,
      null,
      null,
      this.developControlGroup({
        manAtArms: 2,
        longSwordMan: 3,
        twoHandedSwordMan: 4,
        champion: 4,
      }),
    ];
  }

};
