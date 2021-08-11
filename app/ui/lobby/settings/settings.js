const UIWidget = require('../../ui_widget');

module.exports = class LobbySettings extends UIWidget {

  constructor(options) {
    super();
    this.options = options;

    this.mapSizeOptions = {
      "0x00": 120,
      "0x10": 144,
      "0x20": 168,
      "0x30": 200,
      "0x40": 220,
      "0x50": 240,
    };

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

    this.mapSize = $('.map-size');
    this.options['mapSize'] = this.mapSizeOptions[this.mapSize.value];
    this.mapSize.addEventListener('change', (e) => {
      this.options['mapSize'] = this.mapSizeOptions[this.mapSize.value];
    });

    this.revealMap = $('.reveal-map');
    this.gameSpeed = $('.game-speed');
    this.startingAge = $('.starting-age');
    this.startingResources = $('.starting-resources');
    this.mapSize2 = $('.map-size');
    this.difficulty = $('.difficulty');

    this.checkboxes = this.querySelectorAll('.checkboxes input');
    this._bindInputs(this.checkboxes);
    this.selects = this.querySelectorAll('select');
    this._bindInputs(this.selects);
  }

  _bindInputs(inputs) {
    for (let input of inputs) {
      if (this.isHost()) {
        input.addEventListener('change', (e) => {
          this.emitter.emit('did-change')
        });
      }
      else {
        input.setAttribute('disabled', 'disabled');
      }
    }
  }

  loadPackage(command) {
    for (let checkbox of this.checkboxes) {
      if (checkbox.value) {
        command.setCheckbox(parseInt(checkbox.value), checkbox.checked)
      }
    }
    command.setRevealMap(parseInt(this.revealMap.value));
    command.setGameSpeed(parseInt(this.gameSpeed.value));
    command.setStartingAges(parseInt(this.startingAge.value));
    command.setStartingResources(parseInt(this.startingResources.value));
    command.setMapSize(parseInt(this.mapSize2.value));
    command.setDifficulty(parseInt(this.difficulty.value));
    command.max_population = parseInt(this.maxPopulation.value);

    for (var i = 0; i < 8; i++) {
      let networkId = 0;
      if (this.isHost() && serverProtocol.clients[i]) {
        networkId = serverProtocol.clients[i].id;
      }
      command.player_network_ids[i] = networkId;
    }
  }

  loadFromPackage(command) {
    for (let checkbox of this.checkboxes) {
      if (checkbox.value) {
        checkbox.checked = command.getCheckbox(parseInt(checkbox.value))
      }
    }
    this.revealMap.value = this._hex(command.getRevealMap());
    this.gameSpeed.value = this._hex(command.getGameSpeed());
    this.startingAge.value = this._hex(command.getStartingAges());
    this.startingResources.value = this._hex(command.getStartingResources());
    this.mapSize2.value = this._hex(command.getMapSize());
    this.difficulty.value = this._hex(command.getDifficulty());

    this.maxPopulation.value = command.max_population;
  }

  isHost() {
    return typeof serverProtocol != 'undefined';
  }

  onChange(bk) {
    return this.emitter.on('did-change', bk)
  }

  _hex(value) {
    return '0x' + value.toString(16).padStart(2, '0');
  }

}
