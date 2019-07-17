const UIWidget = require('./ui_widget');

module.exports = class ViewResources extends UIWidget{

  template() {
    return 'resources';
  }

  onBind(map, element) {
    this.top = document.getElementsByClassName('top-bar')[0];

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


  async loadResources(res) {
    this.imgs = {};
    var model = await res.loadInterface(51141);
    model.load({
      base: resources.palettes[50505],
      player: 0
    });
    var img = model.frames[0].imgs[0];
    this.top.setAttribute('src', res.cropUrl(img,0 ,0 ,1280, 32));
  }

};
