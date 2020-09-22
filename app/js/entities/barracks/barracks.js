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

  thumbnail() {
    return 2;
  }

  technologyIcons() {
    return {
      manAtArms: 85,
      longSwordMan: 48,
      twoHandedSwordMan: 53,
      champion: 44,
      pikeman: 36,
      halberdier: 106,
    };
  }

  unitsIcons() {
    return {
      createMilitia: 8,
      createManAtArms: 13,
      createLongSwordMan: 10,
      createTwoHandedSwordMan: 12,
      createChampion: 72,
      createSpearman: 31,
      createPikerman: 11,
      createHalberdier: 104,
    };
  }

  defineDashboardControls() {
    return {
      main: ["createMilitia", "createSpearman"]
    };
  }

  defineControls() {
    var icons = this.icons;
    return {
      createMilitia: {
        icon: icons.createMilitia,
        time: 5,
        cost: {food: 60, gold: 20},
        upgrade: 'createManAtArms',
        prepare: () => this.prepareUnit(Militia),
        callback : () => this.createUnit()
      },
      createManAtArms: {
        icon: icons.createManAtArms,
        time: 5,
        upgrade: 'createLongSwordMan',
        condition: () => this.player.technologies.manAtArms,
        prepare: () =>  this.prepareUnit(ManAtArms),
        callback : () => this.createUnit()
      },
      createLongSwordMan: {
        icon: icons.createLongSwordMan,
        time: 5,
        upgrade: 'createTwoHandedSwordMan',
        condition: () => this.player.technologies.longSwordMan,
        prepare: () =>  this.prepareUnit(LongSwordMan),
        callback : () => this.createUnit()
      },
      createTwoHandedSwordMan: {
        icon: icons.createTwoHandedSwordMan,
        time: 5,
        upgrade: 'createChampion',
        condition: () => this.player.technologies.twoHandedSwordMan,
        prepare: () =>  this.prepareUnit(TwoHandedSwordMan),
        callback : () => this.createUnit()
      },
      createChampion: {
        icon: icons.createChampion,
        time: 5,
        condition: () => this.player.technologies.champion,
        prepare: () =>  this.prepareUnit(Champion),
        callback : () => this.createUnit()
      },
      createSpearman: {
        icon: icons.createSpearman,
        time: 5,
        upgrade: 'createPikerman',
        condition: () => this.player.age >= 3,
        prepare: () =>  this.prepareUnit(Spearman),
        callback : () => this.createUnit()
      },
      createPikerman: {
        icon: icons.createPikerman,
        time: 5,
        upgrade: 'createHalberdier',
        condition: () => this.player.technologies.pikeman,
        prepare: () =>  this.prepareUnit(Pikeman),
        callback : () => this.createUnit()
      },
      createHalberdier: {
        icon: icons.createHalberdier,
        time: 5,
        condition: () => !this.player.technologies.halberdier,
        prepare: () =>  this.prepareUnit(Halberdier),
        callback : () => this.createUnit()
      },
      developManAtArms: {
        icon: this.manAtArms,
        upgrade: 'developLongSwordMan',
        condition: () => this.techCondition(2, 'manAtArms'),
        callback : () => this.develop("manAtArms"),
      },
      developLongSwordMan: {
        icon: this.longSwordMan,
        upgrade: 'developTwoHandedSwordMan',
        condition: () => this.techCondition(3, 'longSwordMan', 'manAtArms'),
        callback : () => this.develop("longSwordMan"),
      },
      developTwoHandedSwordMan: {
        icon: icons.twoHandedSwordMan,
        upgrade: 'developChampion',
        condition: () => this.techCondition(4, 'twoHandedSwordMan', 'longSwordMan'),
        callback : () => this.develop("twoHandedSwordMan"),
      },
      developChampion: {
        icon: icons.champion,
        condition: () => this.techCondition(4, 'champion', 'twoHandedSwordMan'),
        callback : () => this.develop("champion"),
      },
      developPikeman: {
        icon: icons.pikeman,
        upgrade: 'developHalberdier',
        condition: () => this.techCondition(4,'pikeman'),
        callback : () => this.develop("pikeman"),
      },
      developHalberdier: {
        icon: icons.halberdier,
        condition: () => this.techCondition(4, 'halberdier', 'pikeman'),
        callback : () => this.develop("halberdier"),
      },

    }
  }

};
