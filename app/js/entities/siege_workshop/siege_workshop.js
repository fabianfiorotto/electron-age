const Building = require('../building');

const Mangonel = require('./mangonel');
const Onager = require('./onager');
const SiegeOnager = require('./siege_onager');
const BatteringRam = require('./ram');
const CappedRam = require('./capped_ram');
const SiegeRam = require('./siege_ram');
const Scorpion = require('./scorpion');
const HeavyScorpion = require('./heavy_scorpion');
const BombarCannon = require('./cannon');

module.exports = class SiegeWorkshop extends Building {

  getSize() {
    return 4;
  }

  modelsResources() {
    return {
      sounds: {
        click: 5127
      }
    };
  }

  unitsIcons() {
    return {
      createMangonel: 27,
      createBatteringRam: 74,
      createCannon: 30,
      createCappedRam: 63,
      createSiegeRam: 73,
      createScorpion: 80,
      createHeavyScorpion: 89,
      createOnager: 101,
      createSiegeOnager: 102,
      createBombardCannon: 30,
    };
  }

  technologyIcons() {
    return {
      heavyScorpion: 68,
      // heavyScorpion: 38,
      onager: 57,
      siegeOnager: 96,
      cappedRam: 27,
      siegeRam: 86,
    };
  }

  thumbnail() {
    return 22;
  }

  defineDashboardControls() {
    return {
      main: [
        "createMangonel", "createBatteringRam", "createScorpion", "createBombardCannon", null,
        'developOnager', 'developCappedRam', 'developHeavyScorpion'
      ]
    }
  }

  defineControls() {
    var icons = this.icons;
    return {
      createMangonel: {
        icon: icons.createMangonel,
        time: 5,
        upgrade: 'createOnager',
        prepare: () => this.prepareUnit(Mangonel),
        callback : () => this.createUnit()
      },
      createOnager: {
        icon: icons.createOnager,
        time: 5,
        upgrade: 'createSiegeOnager',
        condition: () => this.player.technologies.onager,
        prepare: () => this.prepareUnit(Onager),
        callback : () => this.createUnit()
      },
      createSiegeOnager: {
        icon: icons.createSiegeOnager,
        time: 5,
        condition: () => this.player.technologies.siegeOnager,
        prepare: () => this.prepareUnit(SiegeOnager),
        callback : () => this.createUnit()
      },
      createBatteringRam: {
        icon: icons.createBatteringRam,
        time: 5,
        upgrade: 'createCappedRam',
        prepare: () => this.prepareUnit(BatteringRam),
        callback : () => this.createUnit()
      },
      createCappedRam: {
        icon: icons.createCappedRam,
        time: 5,
        upgrade: 'createSiegeRam',
        condition: () => this.player.technologies.cappedRam,
        prepare: () => this.prepareUnit(CappedRam),
        callback : () => this.createUnit()
      },
      createSiegeRam: {
        icon: icons.createSiegeRam,
        time: 5,
        condition: () => this.player.technologies.siegeRam,
        prepare: () => this.prepareUnit(SiegeRam),
        callback : () => this.createUnit()
      },
      createScorpion: {
        icon: icons.createScorpion,
        time: 5,
        upgrade: 'createHeavyScorpion',
        prepare: () => this.prepareUnit(Scorpion),
        callback : () => this.createUnit()
      },
      createHeavyScorpion: {
        icon: icons.createHeavyScorpion,
        time: 5,
        condition: () => this.player.technologies.heavyScorpion,
        prepare: () => this.prepareUnit(HeavyScorpion),
        callback : () => this.createUnit()
      },
      createBombardCannon: {
        icon: icons.createBombardCannon,
        time: 5,
        prepare: () => this.prepareUnit(BombarCannon),
        callback : () => this.createUnit()
      },
      developOnager: {
        icon: this.icons.onager,
        update: "developSiegeOnager",
        condition: () => this.techCondition(4, 'onager'),
        callback : () => this.develop("onager"),
      },
      developSiegeOnager: {
        icon: this.icons.siegeOnager,
        condition: () => this.techCondition(4, 'siegeOnager'),
        callback : () => this.develop("siegeOnager"),
      },
      developCappedRam: {
        icon: this.icons.cappedRam,
        update: "developSiegeRam",
        condition: () => this.techCondition(4, 'cappedRam'),
        callback : () => this.develop("cappedRam"),
      },
      developSiegeRam: {
        icon: this.icons.siegeRam,
        condition: () => this.techCondition(4, 'siegeRam'),
        callback : () => this.develop("siegeRam"),
      },
      developHeavyScorpion: {
        icon: this.icons.heavyScorpion,
        condition: () => this.techCondition(4, 'heavyScorpion'),
        callback : () => this.develop("heavyScorpion"),
      },
    }
  }

  minAge() {
    return 3;
  }

};
