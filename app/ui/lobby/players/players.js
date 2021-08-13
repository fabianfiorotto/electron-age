const UIWidget = require('../../ui_widget');

module.exports = class LobbyPlayers extends UIWidget {

  constructor() {
    super();
    this.players = Array.from({length: 8}, () => ({ready: false}));
  }

  template() {
    return 'lobby/players';
  }

  onBind($) {
    this.table = $('table');
    let tbody = $('tbody');
    let tr = $('tbody tr');
    for (var i = 1; i < 8; i++) {
      let tr1 = tr.cloneNode(true);
      tbody.appendChild(tr1);
    }

    let inputs = this.querySelectorAll('select, input');
    for (let input of inputs) {
      input.addEventListener('change', (e) => {
        this.emitter.emit('did-change')
      });
    }
  }

  playerConnected() {
    let option = this.table.querySelector('option[value=open]:checked')
    if (option) {
      let select = option.parentNode;
      select.value = 'player';
      select.setAttribute('disabled', 'disabled');
    }
  }

  setReady(playerId, value) {
    this.players[playerId].ready = value;
  }

  loadPackage(command) {
    let selects = this.table.querySelectorAll('select.status');
    for (var i = 0; i < 8; i++) {
      let playerReady = this.players[i].ready;
      let isSystem = selects[i].value == 'system';
      let isClosed = selects[i].value == 'closed';
      command.setReady(i + 1, playerReady || isSystem || isClosed);

      command.player_civ_id[i] = isClosed ? 0 : 1;
    }
  }

  loadFromPackage(command) {
    let selects = this.table.querySelectorAll('select.status');
    for (let i = 0; i < 8; i++) {
      if (command.player_network_ids[i]) {
        selects[i].value = 'player';
        selects[i].setAttribute('disabled', 'disabled');
      }
      else if (!command.getReady(i + 1)) {
        selects[i].value = 'open';
      }
      else if (command.player_civ_id[i]) {
        selects[i].value = 'system';
      }
      else {
        selects[i].value = 'closed';
      }
    }
  }

  onChange(bk) {
    return this.emitter.on('did-change', bk)
  }
}
