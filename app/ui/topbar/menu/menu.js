const UIWidget = require('../../ui_widget');

const MainManu = require('../../popups/main_menu/main_menu');
const Diplomacy = require('../../popups/diplomacy/diplomacy');

module.exports = class TopBarMenu extends UIWidget {


  constructor() {
    super();
    this.mainManu = new MainManu();
    this.diplomacy = new Diplomacy();
  }

  onBind($) {
    this.mainManu.bind($('.main-menu'));
    this.diplomacy.bind($('.diplomacy'));

    this.openDiplomacy = $('.open-diplomacy');
    this.openDiplomacy.addEventListener('click',(e) => this.diplomacy.open());

    this.openMainManu = $('.open-main-menu');
    this.openMainManu.addEventListener('click',(e) => this.mainManu.open());
  }

  template() {
    return 'topbar/menu';
  }

};
