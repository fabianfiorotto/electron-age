const UIWidget = require('../../ui_widget');

const {dialog} = require('electron').remote;

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

  onBind($) {
    this.quitButton = $('.quit');
    this.quitButton.addEventListener('click', (e) => {
      window.location = '../index.html';
    });

    this.closeButton = $('.close');
    this.closeButton.addEventListener('click', (e) => this.close());

    this.openButton = $('.open-scenario');
    this.openButton.addEventListener('click', (e) => this.openScenario());
  }

  open() {
    this.element.style.display = 'block';
  }

  close() {
    this.element.style.display = '';
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
