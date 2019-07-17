const UIWidget = require('./ui_widget');

const ViewResources = require('./resources');


module.exports = class TopBar extends UIWidget {

  constructor() {
    super();
    this.viewResources = new ViewResources();
  }

  onBind(map) {
    this.viewResources.bind(map, this.element.getElementsByClassName('view-resources')[0]);
  }

  async loadResources(res) {
    this.imgs = {};
    var model = await res.loadInterface(51141);
    model.load({
      base: resources.palettes[50505],
      player: 0
    });
    var img = model.frames[0].imgs[0];
    this.element.style.backgroundImage = 'url(' + res.cropUrl(img, 0 ,0 ,1280, 32) +')';
  }

};
