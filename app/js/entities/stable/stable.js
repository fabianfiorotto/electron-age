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

  tecnologyIcons() {
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

  controls() {
    var icons = this.icons;
    return [
      [
        {
          icon: icons.createScoutCavalry,
          condition: () => this.player.age >= 2,
          callback : () => this.createUnit(ScoutCavalry),
        },
        {
          icon: icons.createLightCavalry,
          condition: () => this.player.tecnologies.lightCavalry,
          callback : () => this.createUnit(LightCavalry),
        },
      ],
      [
        {
          icon: icons.createKnight,
          condition: () => this.player.age >= 3,
          callback : () => this.createUnit(Knight)
        },
        {
          icon: icons.createCavalier,
          condition: () => this.player.tecnologies.cavalier,
          callback : () => this.createUnit(Cavalier)
        },
        {
          icon: icons.createPaladin,
          condition: () => this.player.tecnologies.paladin,
          callback : () => this.createUnit(Paladin)
        },
      ],
      [
        {
          icon: icons.createCamel,
          condition: () => this.player.age >= 3,
          callback : () => this.createUnit(Camel)
        },
        {
          icon: icons.createHeavyCamel,
          condition: () => this.player.tecnologies.heavyCamel,
          callback : () => this.createUnit(HeavyCamel)
        }
      ],
      null,
      null,
      this.developControlGroup({
        lightCavalry: 3,
      }),
      this.developControlGroup({
        cavalier: 4,
        paladin: 4,
      }),
      this.developControlGroup({
        heavyCamel: 4,
      }),

    ];
  }

  minAge() {
    return 2;
  }

};
