module.exports = class ViewResources {

  bind(element, map) {
    this.wood = document.getElementsByClassName('wood')[0];
    this.food = document.getElementsByClassName('food')[0];
    this.gold = document.getElementsByClassName('gold')[0];
    this.stone = document.getElementsByClassName('stone')[0];
    this.age = document.getElementsByClassName('current-age')[0];
    var player = map.players[0];
    player.onDidChangeResources((res) => this.display(res));
    player.onDidChangeAge((age) => this.displayAge(age));
    this.display(map.players[0].resources);
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


};
