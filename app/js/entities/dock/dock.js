const Building = require('../building');

const FishingShip = require('./fishing_ship');
const Galley = require('./galley');

module.exports = class Dock extends Building {


  thumbnail() {
    return 13;
  }

  getSize() {
    return 3;
  }

  unitsIcons() {
    return {
      createFishingShip:      24,
      createGalley:           87,
      createTradeCog:         23,
      createFireGalley:       86,
      createFireShip:         85,
      createDemolitionRaft:   84,
      createDemolitionShip:   83,
    };
  }

  modelsResources() {
    return {
      model: {
        // building: 409, //beta?
        building: 376,
        animation: 4518,
        shadow: 374,
        marks: 4397,
        debris: 4597
      },
      sounds: {
        click: 5043
      }
    };
  }

  controls() {
    var icons = this.icons;
    return [
      {
        icon: icons.createFishingShip,
        time: 5,
        prepare: () => this.prepareUnit(FishingShip),
        callback : () => this.createUnit()
      },
      [
        {
          icon: icons.createGalley,
          time: 5,
          // condition: () => this.player.age >= 2,
          prepare: () =>  this.prepareUnit(Galley),
          callback : () => this.createUnit()
        },
      ]
    ];
  }

  canPlace() {
    var someWater = this.getTilePoints().some((tile) => this.map.terrain.isWater(tile));
    var someLand = this.getTilePoints().some((tile) => this.map.terrain.isLand(tile));
    return someWater && someLand;
  }


  validTargetPos(pos) {
    return this.map.terrain.isWater(pos);
  }

};
