const Building = require('../building');

const Camel = require('./camel');
const Cavalier = require('./cavalier');
const HeavyCamel = require('./heavy');
const Knight = require('./knight');
const LightCavalry = require('./light');
const Paladin = require('./paladin');
const ScoutCavalry = require('./scout');

module.exports = class Stable extends Building {

  getSize() {
    return 3;
  }

  thumbnail() {
    return 23;
  }

  technologyIcons() {
    return {
      lightCavalry: 43,
      cavalier: 78,
      paladin: 45,
      heavyCamel: 55,
    };
  }

  unitsIcons() {
    return {
      createCamel: 78,
      createCavalier: 49,
      createHeavyCamel: 79,
      createKnight: 1,
      createLightCavalry: 91,
      createPaladin: 2,
      createScoutCavalry: 64,
    };
  }

  modelsResources() {
    return {
      sounds: {
        click: 5134
      }
    };
  }

  defineDashboardControls() {
    return {
      main: [
        "createScoutCavalry", "createKnight", "createCamel", null, null,
        "developLightCavalry", "developCavalier", "developHeavyCamel"
      ]
    }
  }

  defineControls() {
    var icons = this.icons;
    return {
      createScoutCavalry: {
        icon: icons.createScoutCavalry,
        condition: () => this.player.age >= 2,
        callback : () => this.createUnit(ScoutCavalry),
      },
      createLightCavalry: {
        icon: icons.createLightCavalry,
        condition: () => this.player.technologies.lightCavalry,
        callback : () => this.createUnit(LightCavalry),
      },
      createKnight: {
        icon: icons.createKnight,
        condition: () => this.player.age >= 3,
        callback : () => this.createUnit(Knight)
      },
      createCavalier: {
        icon: icons.createCavalier,
        condition: () => this.player.technologies.cavalier,
        callback : () => this.createUnit(Cavalier)
      },
      createPaladin: {
        icon: icons.createPaladin,
        condition: () => this.player.technologies.paladin,
        callback : () => this.createUnit(Paladin)
      },
      createCamel: {
        icon: icons.createCamel,
        condition: () => this.player.age >= 3,
        callback : () => this.createUnit(Camel)
      },
      createHeavyCamel: {
        icon: icons.createHeavyCamel,
        condition: () => this.player.technologies.heavyCamel,
        callback : () => this.createUnit(HeavyCamel)
      },
      developLightCavalry: {
        icon: this.icons.lightCavalry,
        condition: () => this.techCondition(3, 'lightCavalry'),
        callback : () => this.develop("lightCavalry"),
      },
      developCavalier: {
        icon: this.icons.cavalier,
        upgrade: 'developPaladin',
        condition: () => this.techCondition(4, 'cavalier'),
        callback : () => this.develop("cavalier"),
      },
      developPaladin: {
        icon: this.icons.paladin,
        condition: () => this.techCondition(4, 'paladin'),
        callback : () => this.develop("paladin"),
      },
      developHeavyCamel: {
        icon: this.icons.heavyCamel,
        condition: () => this.techCondition(4, 'heavyCamel'),
        callback : () => this.develop("heavyCamel"),
      },
    }
  }

  minAge() {
    return 2;
  }

};
