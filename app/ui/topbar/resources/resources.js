const UIWidget = require('../../ui_widget');

module.exports = class ViewResources extends UIWidget{

  template() {
    return 'topbar/resources';
  }

  onBind(map, $) {
    this.wood       = $('.wood');
    this.food       = $('.food');
    this.gold       = $('.gold');
    this.stone      = $('.stone');
    this.age        = $('.current-age');
    this.population = $('.population');
    var player = map.players[1];
    player.onDidChangeResources((res) => this.display(res));
    player.onDidChangeAge((age) => this.displayAge(age));
    player.onDidChangePopulation((p) => this.displayPopulation(p));
    this.display(player.resources);
    this.displayAge(player.age);
    this.displayPopulation(player);
  }

  display(res) {
    this.wood.textContent = res.wood;
    this.food.textContent = res.food;
    this.gold.textContent = res.gold;
    this.stone.textContent = res.stone;
  }

  displayAge(age) {
    this.age.textContent = age;
  }

  displayPopulation(player) {
    this.population.textContent = player.population + ' / ' + player.maxPopulation;
  }
};
