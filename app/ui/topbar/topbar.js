const UIWidget = require('../ui_widget');

const ViewResources = require('./resources/resources');
const TopBarMenu = require('./menu/menu');

module.exports = class TopBar extends UIWidget {

  constructor() {
    super();
    this.viewResources = new ViewResources();
    this.topBarMenu = new TopBarMenu();
  }

  template() {
    return 'topbar';
  }

  onBind($) {
    this.viewResources.bind($('.view-resources'));
    this.topBarMenu.bind($('.top-bar-menu'));
  }

  bindMap(map) {
    this.player = map.players[1];
    this.viewResources.bindMap(map);

    this.loadCivResources(resources);
  }

  async loadCivResources(res) {
    var model = await res.loadInterface(this.player.civilization.interface());
    model.load({
      base: resources.palettes[50505],
      player: 0
    });
    var img = model.frames[0].imgs[0];
    this.element.style.backgroundImage = 'url(' + res.cropUrl(img, 0 ,0 ,1280, 32) +')';
  }

};
