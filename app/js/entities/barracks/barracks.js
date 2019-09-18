const Building = require('../building');
const ManAtArms = require('./man');
const Militia = require('./militia');
const LongSwordMan = require('./long_sword.js');
const TwoHandedSwordMan = require('./two_handed.js');
const Champion = require('./champion.js');

const Spearman = require('./spearman');
const Pikeman = require('./pikeman');
const Halberdier = require('./halberdier');

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
          pikeman: 36,
          halberdier: 106,
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
          createSpearman: 31,
          createPikerman: 11,
          createHalberdier: 104,
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
          time: 5,
          prepare: () => this.prepareUnit(Militia),
          callback : () => this.createUnit()
        },
        {
          icon: icons.createManAtArms,
          time: 5,
          condition: () => this.player.tecnologies.manAtArms,
          prepare: () =>  this.prepareUnit(ManAtArms),
          callback : () => this.createUnit()
        },
        {
          icon: icons.createLongSwordMan,
          time: 5,
          condition: () => this.player.tecnologies.longSwordMan,
          prepare: () =>  this.prepareUnit(LongSwordMan),
          callback : () => this.createUnit()
        },
        {
          icon: icons.createTwoHandedSwordMan,
          time: 5,
          condition: () => this.player.tecnologies.twoHandedSwordMan,
          prepare: () =>  this.prepareUnit(TwoHandedSwordMan),
          callback : () => this.createUnit()
        },
        {
          icon: icons.createChampion,
          time: 5,
          condition: () => this.player.tecnologies.champion,
          prepare: () =>  this.prepareUnit(Champion),
          callback : () => this.createUnit()
        }
      ],
      [
        {
          icon: icons.createSpearman,
          time: 5,
          condition: () => this.player.age >= 3,
          prepare: () =>  this.prepareUnit(Spearman),
          callback : () => this.createUnit()
        },
        {
          icon: icons.createPikerman,
          time: 5,
          condition: () => this.player.tecnologies.pikeman,
          prepare: () =>  this.prepareUnit(Pikeman),
          callback : () => this.createUnit()
        },
        {
          icon: icons.createHalberdier,
          time: 5,
          condition: () => this.player.tecnologies.halberdier,
          prepare: () =>  this.prepareUnit(Halberdier),
          callback : () => this.createUnit()
        }
      ],
      null,
      null,
      null,
      this.developControlGroup({
        manAtArms: 2,
        longSwordMan: 3,
        twoHandedSwordMan: 4,
        champion: 4,
      }),
      this.developControlGroup({
        pikeman: 3,
        halberdier: 4,
      }),
    ];
  }

};
