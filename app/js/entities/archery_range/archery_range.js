const Building = require('../building');
const Arbalest = require('./arbalest');
const Archer = require('./archer');
const Crossbowman = require('./crossbowman');
const CavalryArcher = require('./cavalry');
const Skirmisher = require('./skirmisher');
const ElitSkirmisher = require('./elite');
const HeavyCavalryArcher = require('./heavy');

module.exports = class ArcheryRange extends Building {

  getSize() {
    return 3;
  }

  thumbnail() {
    return 0;
  }

  tecnologyIcons() {
    return {
      elitSkirmisher: 28,
      crossbow: 29,
      arbalest: 54,
      heavyCavalryArcher: 52,
      thumbRing: 112,
      parthianTactics: 111,
    };
  }

  unitsIcons() {
    return {
      createArbalest: 90,
      createArcher: 17,
      createCrossbowman: 18,
      createCavalryArcher: 19,
      createHeavyCavalryArcher: 19,
      createSkirmisher: 20,
      createElitSkirmisher: 21,
    };
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
          icon: icons.createArcher,
          callback : () => this.createUnit(Archer)
        },
        {
          icon: icons.createCrossbowman,
          condition: () => this.player.tecnologies.crossbow,
          callback : () => this.createUnit(Crossbowman)
        },
        {
          icon: icons.createArbalest,
          condition: () => this.player.tecnologies.arbalest,
          callback : () => this.createUnit(Albalest)
        },
      ],
      [
        {
          icon: icons.createSkirmisher,
          callback : () => this.createUnit(Skirmisher)
        },
        {
          icon: icons.createElitSkirmisher,
          condition: () => this.player.tecnologies.elitSkirmisher,
          callback : () => this.createUnit(ElitSkirmisher)
        }
      ],
      [
        {
          icon: icons.createCavalryArcher,
          condition: () => this.player.age >= 3,
          callback : () => this.createUnit(CavalryArcher)
        },
        {
          icon: icons.createHeavyCavalryArcher,
          condition: () => this.player.tecnologies.heavyCavalryArcher,
          callback : () => this.createUnit(HeavyCavalryArcher)
        }
      ],
      null,
      null,
      this.developControlGroup({
        crossbow: 3,
        arbalest: 4,
      }),
      this.developControlGroup({
        elitSkirmisher: 3,
      }),
      this.developControlGroup({
        heavyCavalryArcher: 4,
      }),
      null,
      null,
      this.developControlGroup({
        thumbRing: 3,
      }),
      null,
      this.developControlGroup({
        parthianTactics: 4,
      }),
    ];
  }

};
