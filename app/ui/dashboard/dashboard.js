const UIWidget = require('../ui_widget');

const Controls = require('./controls/controls');
const EntityInfo = require('./entity_info/entity_info');
const Selecion = require('./selection/selection');
const Progress = require('./progress/progress');
const Garrison = require('./garrison/garrison');

module.exports = class Dashboard extends UIWidget {

  constructor() {
    super();
    this.controls = new Controls();
    this.info = new EntityInfo();
    this.selection = new Selecion();
    this.progress = new Progress();
    this.garrison = new Garrison();
  }

  template() {
    return 'dashboard';
  }

  onBind($) {
    this.inner = $('.inner');

    this.controls.bind($('.controls'));
    this.info.bind($('.entity-info'));
    this.selection.bind($('.selection'));
    this.progress.bind($('.progress'));
    this.garrison.bind($('.garrison'));
  }

  bindMap(map) {
    this.player = map.players[1];
    this.loadCivResources(resources);
  }

  async loadCivResources(res) {
    // var model = await res.loadInterface(51143);
    var model = await res.loadInterface(this.player.civilization.interface());
    model.load({
      base: resources.palettes[50505],
      player: 0
    });
    var img = model.frames[0].imgs[0];
    this.inner.style.backgroundImage = 'url(' + res.cropUrl(img, 0, 806 ,1280, 218) +')';
  }

};
