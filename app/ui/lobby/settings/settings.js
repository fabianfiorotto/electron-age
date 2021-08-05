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

    this.checkboxes = this.querySelectorAll('.checkboxes input');
    for (let checkbox of this.checkboxes) {
      checkbox.addEventListener('change', (e) => {
        this.emitter.emit('did-change')
      });
    }

  }

  loadPackage(command) {
    for (let checkbox of this.checkboxes) {
      if (checkbox.value) {
        command.setCheckbox(parseInt(checkbox.value), checkbox.checked)
      }
    }
  }

  loadFromPackage(command) {
    for (let checkbox of this.checkboxes) {
      if (checkbox.value) {
        checkbox.checked = command.getCheckbox(parseInt(checkbox.value))
      }
    }
  }

  onChange(bk) {
    return this.emitter.on('did-change', bk)
  }

}
