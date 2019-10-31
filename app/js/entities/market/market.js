const Building = require('../building');
const TradeCart = require('./cart');

module.exports = class Market extends Building {

  thumbnail() {
    return 16;
  }

  modelsResources() {
    return {
      sounds: {
        click: 5110
      }
    };
  }

  getSize() {
    return 4;
  }

  unitsIcons() {
    return {
      createTradeCart: 34,
    };
  }

  controls() {
    var icons = this.icons;
    return [
      {
        icon: icons.createTradeCart,
        time: 5,
        cost: {wood: 100, gold: 50},
        prepare: () => this.prepareUnit(TradeCart),
        callback : () => this.createUnit()
      }
    ];
  }

};
