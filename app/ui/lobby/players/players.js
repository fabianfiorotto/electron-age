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
      let isSystem = selects[i].value == 'system'
      command.setReady(i + 1, playerReady || isSystem);
    }
  }

  loadFromPackage(command) {
    let selects = this.table.querySelectorAll('select.status');
    for (let i = 0; i < 8; i++) {
      if (command.player_network_ids[i]) {
        selects[i].value = 'player';
        selects[i].setAttribute('disabled', 'disabled');
      }
      else if (command.getReady(i + 1)) {
        selects[i].value = 'system';
      }
    }
  }

}
