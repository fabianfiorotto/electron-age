const UIWidget = require('../../../ui_widget');

const AoeMap = require('../../../../js/map');

module.exports = class Row extends UIWidget {

  template() {
    return 'popups/diplomacy/row';
  }

  onBind($) {
    this.name   = $('.player-name');
    this.theirStance = $('.their-stance');

    this.ally = $('.ally');
    this.neutral = $('.neutral');
    this.enemy = $('.enemy');

  }

  bindMap(map) {
    var player1 = map.players[1];
    var player2 = map.players[2];
    this.name.textContent = player2.name;

    switch (player1.getDiplomacy(player2)) {
      case AoeMap.ALLY:
        this.ally.checked = true;
        break;
      case AoeMap.NEUTRAL:
        this.neutral.checked = true;
        break;
      case AoeMap.ENEMY:
        this.enemy.checked = true;
        break;
    }

    switch (player2.getDiplomacy(player1)) {
      case AoeMap.ALLY:
        this.theirStance.textContent = 'Ally';
        break;
      case AoeMap.NEUTRAL:
        this.theirStance.textContent = 'Neutral';
        break;
      case AoeMap.ENEMY:
        this.theirStance.textContent = 'Enemy';
        break;
    }

    this.ally.addEventListener('change', () => player1.setDiplomacy(player2, AoeMap.ALLY));
    this.neutral.addEventListener('change', () => player1.setDiplomacy(player2, AoeMap.NEUTRAL));
    this.enemy.addEventListener('change', () => player1.setDiplomacy(player2, AoeMap.ENEMY));
  }

}
