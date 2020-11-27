const UIWidget = require('../../../ui_widget');

module.exports = class FirstRow extends UIWidget {

  template() {
    return 'popups/diplomacy/first';
  }

  onBind($) {
    this.name   = $('.player-name');
    this.wood   = $('.wood');
    this.food   = $('.food');
    this.gold   = $('.gold');
    this.stone  = $('.stone');
  }

  bindMap(map) {
    var player = map.players[1];
    this.name.textContent = player.name;
    player.onDidChangeResources((res) => this.display(res));
    this.display(player.resources);
  }

  display(res) {
    this.wood.textContent = res.wood;
    this.food.textContent = res.food;
    this.gold.textContent = res.gold;
    this.stone.textContent = res.stone;
  }

}
