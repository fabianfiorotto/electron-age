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

  technologyIcons() {
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


  defineDashboardControls() {
    return {
      main: [
        "createArcher", "createSkirmisher", "createCavalryArcher", null, null,
        "developCrossbow", "developElitSkirmisher", "createHeavyCavalryArcher", null, null,
        "developEhumbRing", "developEarthianTactics"
      ],
    };
  }

  defineControls() {
    var icons = this.icons;
    return {
      createArcher: {
        icon: icons.createArcher,
        upgrade: 'createCrossbowman',
        callback : () => this.createUnit(Archer)
      },
      createCrossbowman: {
        icon: icons.createCrossbowman,
        upgrade: 'createArbalest',
        condition: () => this.player.technologies.crossbow,
        callback : () => this.createUnit(Crossbowman)
      },
      createArbalest: {
        icon: icons.createArbalest,
        condition: () => this.player.technologies.arbalest,
        callback : () => this.createUnit(Albalest)
      },
      createSkirmisher: {
        icon: icons.createSkirmisher,
        upgrade: 'createElitSkirmisher',
        callback : () => this.createUnit(Skirmisher)
      },
      createElitSkirmisher: {
        icon: icons.createElitSkirmisher,
        condition: () => this.player.technologies.elitSkirmisher,
        callback : () => this.createUnit(ElitSkirmisher)
      },
      createCavalryArcher: {
        icon: icons.createCavalryArcher,
        condition: () => this.player.age >= 3,
        upgrade: 'createHeavyCavalryArcher',
        callback : () => this.createUnit(CavalryArcher)
      },
      createHeavyCavalryArcher: {
        icon: icons.createHeavyCavalryArcher,
        condition: () => this.player.technologies.heavyCavalryArcher,
        callback : () => this.createUnit(HeavyCavalryArcher)
      },
      developCrossbow: {
        icon: this.icons.crossbow,
        upgrade: 'developArbalest',
        condition: () => this.techCondition(3, 'crossbow'),
        callback : () => this.develop('crossbow'),
      },
      developArbalest: {
        icon: this.icons.arbalest,
        condition: () => this.techCondition(4, 'arbalest', 'crossbow'),
        callback : () => this.develop('arbalest'),
      },
      developElitSkirmisher: {
        icon: this.icons.elitSkirmisher,
        condition: () => this.techCondition(3, 'elitSkirmisher' , 'arbalest'),
        callback : () => this.develop('elitSkirmisher'),
      },
      developEeavyCavalryArcher: {
        icon: this.icons.heavyCavalryArcher,
        condition: () => this.techCondition(4, 'heavyCavalryArcher'),
        callback : () => this.develop('heavyCavalryArcher'),
      },
      developEhumbRing: {
        icon: this.icons.thumbRing,
        condition: () => this.techCondition(3, 'thumbRing'),
        callback : () => this.develop('thumbRing'),
      },
      developEarthianTactics: {
        icon: this.icons.parthianTactics,
        condition: () => this.techCondition(4, 'parthianTactics'),
        callback : () => this.develop('parthianTactics'),
      },
    }
  }

  minAge() {
    return 2;
  }

};
