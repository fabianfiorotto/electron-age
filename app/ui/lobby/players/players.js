const UIWidget = require('../../ui_widget');

module.exports = class LobbyPlayers extends UIWidget {

  template() {
    return 'lobby/players';
  }

  onBind($) {
    let tbody = $('tbody');
    let tr = $('tbody tr');
    for (var i = 1; i < 8; i++) {
      let tr1 = tr.cloneNode(true);
      tbody.appendChild(tr1);
    }
  }

}
