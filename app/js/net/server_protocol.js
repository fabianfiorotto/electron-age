const AoeNetProtocol = require('./protocol');

module.exports = class AoeNetServerProtocol extends AoeNetProtocol {
  constructor() {
    super();
    this.clients = [];
    this.last_id = 0;
  }

  connectionAccepedPackage() {
    let thePackage = this.createPackage();
    thePackage.command = this.createLobbyTurn();
    thePackage.network_dest_id = this.last_id++;
    return thePackage;
  }

  broadcast(thePackage) {
    for (let client of this.clients) {
      if (client.id != thePackage.network_source_id) {
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
