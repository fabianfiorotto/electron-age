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

    this.ready.addEventListener('click' ,()=> this.sendReadyPackage());
    this.settings.onChange(() => this.sendConfigPackage());
    this.players.onChange(() => this.sendConfigPackage());
  }

  sendReadyPackage() {
    let thePackage = protocol.createLobbyReady();
    thePackage.command.player_id = this.playerId;
    thePackage.command.value   = this.ready.checked ? 1    : 0;
    thePackage.command.unknow2 = this.ready.checked ? 0x04 : 0;
    protocol.sendPackage(client, thePackage);
  }

  sendConfigPackage() {
    let thePackage = serverProtocol.createLobbyConfig();
    this.loadPackage(thePackage.command);
    serverProtocol?.broadcast(thePackage, true);
  }

  loadPackage(command) {
    this.settings.loadPackage(command);
    this.players.loadPackage(command);
  }

  loadFromPackage(command) {
    if (!this.playerId) {
      this.playerId = command.player_network_ids.indexOf(protocol.networkId) + 1;
    }
    if (!this.ready) {
      return;
    }
    this.checked = command.getReady(this.playerId);
    this.settings.loadFromPackage(command);
    this.players.loadFromPackage(command);
  }

  setPlayerReady(playerId, value) {
    this.players.setReady(playerId, value);
    this.sendConfigPackage();
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
