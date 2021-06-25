const UIWidget = require('../../ui_widget');

module.exports = class LobbySettings extends UIWidget {

  constructor(options) {
    super();
    this.options = options;
  }

  template() {
    return 'lobby/settings';
  }

  onBind($) {
    this.maxPopulation = $('.maxPopulation');
    this.options['maxPopulation'] = this.maxPopulation.value;
    this.maxPopulation.addEventListener('change', (e) => {
      this.options['maxPopulation'] = this.maxPopulation.value;
    });

    this.mapSize = $('.mapSize');
    this.options['mapSize'] = this.mapSize.value;
    this.mapSize.addEventListener('change', (e) => {
      this.options['mapSize'] = this.mapSize.value;
    });

  }

}