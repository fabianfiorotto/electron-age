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

  tecnologyIcons() {
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

  controls() {
    var icons = this.icons;
    return [
      [
        {
          icon: icons.createMangonel,
          time: 5,
          prepare: () => this.prepareUnit(Mangonel),
          callback : () => this.createUnit()
        },
        {
          icon: icons.createOnager,
          time: 5,
          condition: () => this.player.tecnologies.onager,
          prepare: () => this.prepareUnit(Onager),
          callback : () => this.createUnit()
        },
        {
          icon: icons.createSiegeOnager,
          time: 5,
          condition: () => this.player.tecnologies.siegeOnager,
          prepare: () => this.prepareUnit(SiegeOnager),
          callback : () => this.createUnit()
        },
      ],
      [
        {
          icon: icons.createBatteringRam,
          time: 5,
          prepare: () => this.prepareUnit(BatteringRam),
          callback : () => this.createUnit()
        },
        {
          icon: icons.createCappedRam,
          time: 5,
          condition: () => this.player.tecnologies.cappedRam,
          prepare: () => this.prepareUnit(CappedRam),
          callback : () => this.createUnit()
        },
        {
          icon: icons.createSiegeRam,
          time: 5,
          condition: () => this.player.tecnologies.siegeRam,
          prepare: () => this.prepareUnit(SiegeRam),
          callback : () => this.createUnit()
        },
      ],
      [
        {
          icon: icons.createScorpion,
          time: 5,
          prepare: () => this.prepareUnit(Scorpion),
          callback : () => this.createUnit()
        },
        {
          icon: icons.createHeavyScorpion,
          time: 5,
          condition: () => this.player.tecnologies.heavyScorpion,
          prepare: () => this.prepareUnit(HeavyScorpion),
          callback : () => this.createUnit()
        },
      ],
      {
        icon: icons.createBombardCannon,
        time: 5,
        prepare: () => this.prepareUnit(BombarCannon),
        callback : () => this.createUnit()
      },
      null,
      this.developControlGroup({
        onager: 4,
        siegeOnager: 4,
      }),
      this.developControlGroup({
        cappedRam: 4,
        siegeRam: 4,
      }),
      this.developControlGroup({
        heavyScorpion: 4,
      }),
    ];

  }

};
