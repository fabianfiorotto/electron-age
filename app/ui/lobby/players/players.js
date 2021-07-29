const UIWidget = require('../../ui_widget');

module.exports = class LobbyPlayers extends UIWidget {

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

}
