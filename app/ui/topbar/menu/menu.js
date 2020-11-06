const UIWidget = require('../../ui_widget');

const MainManu = require('../../popups/main_menu/main_menu');

module.exports = class TopBarMenu extends UIWidget {


  constructor() {
    super();
    this.mainManu = new MainManu();
  }

  onBind($) {
    this.mainManu.bind($('.main-menu'));

    this.openMainManu = $('.open-main-menu');
    this.openMainManu.addEventListener('click',(e) => this.mainManu.open());
  }

  template() {
    return 'topbar/menu';
  }

};
