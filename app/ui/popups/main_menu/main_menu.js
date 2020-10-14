const UIWidget = require('../../ui_widget');

const {dialog} = require('electron').remote;

const fs = require('fs').promises;


module.exports = class MainManu extends UIWidget {

  async loadResources(res) {
    this.imgs = {};
    var model = await res.loadInterface(50222);
    model.load({
      base: resources.palettes[50505],
      player: 0
    });
    var img = model.frames[0].imgs[0];
    this.element.style.backgroundImage = 'url(' + res.getUrl(img) +')';
  }

  onBind(map) {
    this.closeButton = this.element.getElementsByClassName('close')[0];
    this.closeButton.addEventListener('click', (e) => this.close());

    this.openButton = this.element.getElementsByClassName('open-scenario')[0];
    this.openButton.addEventListener('click', (e) => this.openScenario());

  }

  open() {
    this.element.style.display = '';
  }

  close() {
    this.element.style.display = 'none';
  }

  async openScenario() {
    this.close();
    var event = await dialog.showOpenDialog({
        properties: ['openFile']
    });
    if (!event.canceled) {
      mapView.loadMapScx(event.filePaths[0]);
    }
  }

  template() {
    return 'popups/main_menu';
  }

};
