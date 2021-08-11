const UIWidget = require('../ui_widget');

const LobbyPlayers = require('./players/players');
const LobbySettings = require('./settings/settings');
const LobbyChat = require('./chat/chat');

module.exports = class Lobby extends UIWidget {

  constructor() {
    super();
    this.options = {};
    this.players = new LobbyPlayers();
    this.chat = new LobbyChat();
    this.settings = new LobbySettings(this.options);
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

    this.start.addEventListener('click', async (e) => {
      this.element.style.display = 'none';

      await mapView.loadTestMap(this.options);
      mapView.bindSocket?.(client, protocol);
      loop();
    });
    this.cancel.addEventListener('click', (e) => {
      window.location = '../index.html';
    });

    this.ready.addEventListener('click' , () => {
      // this.sendPackage();
      this.sendReadyPackage();
    });

    this.settings.onChange(() => {
      this.sendPackage();
    });

    setTimeout(() => this.sendReadyPackage(), 300); // TODO REMOVE THIS HACK!!
  }

  sendReadyPackage() {
    let thePackage = protocol.createLobbyReady();
    thePackage.command.value   = this.ready.checked ? 1    : 0;
    thePackage.command.unknow2 = this.ready.checked ? 0x04 : 0;
    protocol.sendPackage(client, thePackage);
  }

  sendPackage() {
    let thePackage = protocol.createLobbyConfig();
    this.loadPackage(thePackage.command);
    serverProtocol?.broadcast(thePackage);
  }

  loadPackage(command) {
    this.settings.loadPackage(command);
    this.players.loadPackage(command);
  }

  loadFromPackage(command) {
    this.checked = !!command.ready;
    this.settings.loadFromPackage(command);
    this.players.loadFromPackage(command);
  }

  playerConnected() {
    this.players.playerConnected();
  }

  setPlayerReady(playerId, value) {
    this.players.setReady(playerId, value);
    this.sendPackage();
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
