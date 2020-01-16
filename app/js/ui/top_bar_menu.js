const UIWidget = require('./ui_widget');

const MainManu = require('./popups/main_menu.js');

module.exports = class TopBarMenu extends UIWidget {


  constructor() {
    super();
    this.mainManu = new MainManu();
  }

  onBind(map) {
    this.mainManu.bind(map, this.element.getElementsByClassName('main-menu')[0]);


    this.openMainManu = this.element.getElementsByClassName('open-main-menu')[0];

    this.openMainManu.addEventListener('click',(e) => this.mainManu.open());
  }

  template() {
    return 'top_bar_menu';
  }

};
