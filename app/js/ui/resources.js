const UIWidget = require('./ui_widget');

module.exports = class ViewResources extends UIWidget{

  template() {
    return 'resources';
  }

  onBind(map) {
    this.wood = this.element.getElementsByClassName('wood')[0];
    this.food = this.element.getElementsByClassName('food')[0];
    this.gold = this.element.getElementsByClassName('gold')[0];
    this.stone = this.element.getElementsByClassName('stone')[0];
    this.age = this.element.getElementsByClassName('current-age')[0];
    this.population = this.element.getElementsByClassName('population')[0];
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
