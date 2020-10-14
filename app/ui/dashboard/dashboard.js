const UIWidget = require('../ui_widget');

const Controls = require('./controls/controls');
const EntityInfo = require('./entity_info/entity_info');
const Selecion = require('./selection/selection');
const Progress = require('./progress/progress');

module.exports = class Dashboard extends UIWidget {

  constructor() {
    super();
    this.controls = new Controls();
    this.info = new EntityInfo();
    this.selection = new Selecion();
    this.progress = new Progress();
  }

  template() {
    return 'dashboard';
  }

  onBind(map, $) {
    this.controls.bind(map, $('.controls'));
    this.info.bind(map, $('.entity-info'));
    this.selection.bind(map, $('.selection'));
    this.progress.bind(map, $('.progress'));
    this.player = map.players[1];
  }

  async loadResources(res) {
    this.imgs = {};
    var model = await res.loadInterface(this.player.civilization.interface());
    model.load({
      base: resources.palettes[50505],
      player: 0
    });
    var img = model.frames[0].imgs[0];
    this.element.style.backgroundImage = 'url(' + res.cropUrl(img, 0, 806 ,1280, 218) +')';
  }

};
