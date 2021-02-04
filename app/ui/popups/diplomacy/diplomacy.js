const UIWidget = require('../../ui_widget');

const FirstRow = require('./first/first');
const Row = require('./row/row');

module.exports = class Diplomacy extends UIWidget {

  constructor() {
    super();
    this.firstRow = new FirstRow();
    this.row = new Row();
  }


  onBind($) {
    this.closeButton = $('.close');
    this.closeButton.addEventListener('click', (e) => this.close());

    this.firstRow.bind($('.first-row'));
    this.row.bind($('.row'));

    this.allyVictory =  $('.ally-victory input');
  }

  open() {
    this.element.style.display = 'block';
  }

  close() {
    this.element.style.display = 'none';
  }


  template() {
    return 'popups/diplomacy';
  }


  async loadResources(res) {
    this.imgs = {};
    var model = await res.loadInterface(50221);
    model.load({
      base: resources.palettes[50505],
      player: 0
    });
    var img = model.frames[0].imgs[0];
    this.element.style.backgroundImage = 'url(' + res.getUrl(img) +')';
  }
};
