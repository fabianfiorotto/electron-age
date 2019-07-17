const UIWidget = require('./ui_widget');

const Controls = require('./controls');
const EntityInfo = require('./entity_info');
const Selecion = require('./selection');

module.exports = class Dashboard extends UIWidget {

  constructor() {
    super();
    this.controls = new Controls();
    this.info = new EntityInfo();
    this.selection = new Selecion();
  }

  template() {
    return 'dashboard';
  }

  onBind(map) {
    this.bottom = this.element.getElementsByClassName('bottom-bar')[0];

    this.controls.bind(map, this.element.getElementsByClassName('controls')[0]);
    this.info.bind(map, this.element.getElementsByClassName('entity-info')[0]);
    this.selection.bind(map, this.element.getElementsByClassName('selection')[0]);
  }

  async loadResources(res) {
    this.imgs = {};
    var model = await res.loadInterface(51141);
    model.load({
      base: resources.palettes[50505],
      player: 0
    });
    var img = model.frames[0].imgs[0];
    this.bottom.setAttribute('src', res.cropUrl(img, 0, 806 ,1280, 218));
  }

};
