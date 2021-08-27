const AoeNetProtocol = require('./protocol');

const LobbyConfig = require('./sync/lobby_config');

module.exports = class AoeNetServerProtocol extends AoeNetProtocol {
  constructor() {
    super();
    this.clients = [];
    this.last_id = 0;

    this.networkIds = [];
  }

  connectionAccepedPackage() {
    let thePackage = this.createPackage();
    thePackage.command = protocol.createLobbySyncClock();
    thePackage.network_dest_id = ++this.last_id;
    this.networkIds.push(thePackage.network_dest_id);
    return thePackage;
  }

  createLobbyConfig() {
    let thePackage = this.createPackage();
    let config = new LobbyConfig();
    config.loadDefautValues();
    for (var i in this.networkIds) {
      config.player_network_ids[i] = this.networkIds[i];
    }
    thePackage.command = config;
    return thePackage;
  }

  broadcast(thePackage, all = false) {
    for (let client of this.clients) {
      if (all || client.id != thePackage.network_source_id) {
        this.sendPackage(client.socket, thePackage);
      }
    }
  }

  addClient(socket, thePackage) {
    let client = {socket, id: thePackage.network_dest_id}
    this.clients.push(client);
  }

  removeClient(socket) {
    const index = this.clients.findIndex((c) => c.socket == socket);
    if (index > -1) {
      this.clients.splice(index, 1);
    }
  }
}
