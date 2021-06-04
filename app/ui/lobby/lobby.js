const UIWidget = require('../ui_widget');

const LobbyPlayers = require('./players/players');
const LobbySettings = require('./settings/settings');
const LobbyChat = require('./chat/chat');

module.exports = class Lobby extends UIWidget {

  constructor() {
    super();
    this.players = new LobbyPlayers();
    this.chat = new LobbyChat();
    this.settings = new LobbySettings();
  }

  template() {
    return 'lobby';
  }

  onBind($) {
    this.ready = $(".ready");
    this.start = $(".start");
    this.cancel = $(".cancel");

    this.players.bind($('.players'));
    this.settings.bind($('.settings'));
    this.chat.bind($('.chat'));

    this.start.addEventListener('click', (e) => {
      this.element.style.display = 'none';
    });
    this.cancel.addEventListener('click', (e) => {
      window.location = '../index.html';
    });

  }

  async loadResources(res) {
    let palette = await res.loadPalette(50503);
    var model = await res.loadInterface(50104);
    model.load({
      base: palette,
      player: 0
    });
    var img = model.frames[0].imgs[0];
    this.element.style.backgroundImage = 'url(' + res.getUrl(img) +')';
  }

}
