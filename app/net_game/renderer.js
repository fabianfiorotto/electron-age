require('../js/entities/types');

var net = require('net');
require("sylvester");

const ResourceManager = require("../resources");
const AoeNetProtocol = require('../js/net/protocol');
const AoeNetServerProtocol = require('../js/net/server_protocol');
const NetMapView = require('../ui/map/netmap');
const MapView = require('../ui/map/map');
const Lobby = require('../ui/lobby/lobby');
const DebugInfo = require('../ui/debug/debug');

serverConnect = function(protocol, port, callback) {
  if (!callback) {
    callback = port;
    port = 1337;
  }

  var server = net.createServer(function(socket) {
    socket.on("error", (err) =>{
      console.log("Caught flash policy server socket error: ");
      console.log(err.stack);
    });

    socket.on('data', function(data) {
      let thePackage = protocol.receivePackage(data);
      let command = thePackage.command;
      thePackage.perform();

      if (protocol.isConnecting(thePackage)) {
        protocol.broadcast(thePackage); ///???

        let config = protocol.createLobbyConfig();
        protocol.sendPackage(socket, config);

        thePackage = protocol.connectionAccepedPackage();
        protocol.sendPackage(socket, thePackage);
        protocol.addClient(socket, thePackage);
      }
      else {
        protocol.broadcast(thePackage)
      }
    });
    socket.on('close', function() {
      protocol.removeClient(socket);
    });
    socket.on('end', function() {
      protocol.removeClient(socket);
    });

    // socket.pipe(socket);
  });
  server.listen(1337, '127.0.0.1', callback);
}

clientConnect = function(client, protocol, server, port = 1337) {
  client.connect(port, server, function() {
    console.log('Connected');
    let thePackage = protocol.createPackage();
    thePackage.command = protocol.createLobbySyncClock();
    protocol.sendPackage(client, thePackage);
  });

  client.on('data', function(data) {
    let thePackage = protocol.receivePackage(data);
    thePackage.perform();
    console.log(thePackage);
    if (protocol.isConnecting(thePackage)) {
      lobby.playerConnected();
    }
  });

  client.on('close', function() {
    console.log('Connection closed');
  });
}


window.resources = new ResourceManager();

let queryString = window.location.hash.slice(1)
let urlParams = new URLSearchParams(queryString);

var mapView;
if (urlParams.has('server')) {
  mapView = new NetMapView();
}
else {
  mapView = new MapView();
}
let debugInfo = new DebugInfo();
var lobby = new Lobby();

if (urlParams.has('server')) {
  var client = new net.Socket();
  var protocol = new AoeNetProtocol();
  var serverProtocol;

  let server = urlParams.get('server') || '127.0.0.1';

  if (server == 'create') {
    serverProtocol = new AoeNetServerProtocol();
    server = '127.0.0.1';
    serverConnect(serverProtocol, () => {
      clientConnect(client, protocol, server);
    });
  }
  else {
    clientConnect(client, protocol, server);
  }

}

var loop = async () => {
  for await(let _null of resources.timeoutIterable()) {
    mapView.draw();
    debugInfo.incFps();
  }
}

document.addEventListener("DOMContentLoaded", async function() {
  await debugInfo.bind('debug');
  setInterval(() => debugInfo.resetFps(), 1000);

  await mapView.bind('map');
  await lobby.bind('lobby');

});
