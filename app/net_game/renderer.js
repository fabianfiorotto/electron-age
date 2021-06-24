require('../js/entities/types');

var net = require('net');
require("sylvester");

const ResourceManager = require("../resources");
const AoeNetProtocol = require('../js/net/protocol');
const NetMapView = require('../ui/map/netmap');
const MapView = require('../ui/map/map');
const Lobby = require('../ui/lobby/lobby');
const DebugInfo = require('../ui/debug/debug');

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
let lobby = new Lobby();

if (urlParams.has('server')) {
  let client = new net.Socket();
  let protocol = new AoeNetProtocol();

  let server = urlParams.get('server') || '127.0.0.1';

  client.connect(1337, server, function() {
    console.log('Connected');

    let thePackage = protocol.createPackage();
    thePackage.command = protocol.createLobbySyncClock();
    protocol.sendPackage(client, thePackage);
  });

  client.on('data', function(data) {
    // console.log('Received: ');
    // console.log(data);

    let thePackage = protocol.receivePackage(data);
    console.log(thePackage);
  });

  client.on('close', function() {
    console.log('Connection closed');
  });
}

init = async () => {
  await debugInfo.bind('debug');
  setInterval(() => debugInfo.resetFps(), 1000);

  await mapView.bind('map');
  await lobby.bind('lobby');
}

idle = function() {
  mapView.draw();
  debugInfo.incFps();
};

loop = function() {
  try {
    idle();
  } catch (e) {
    console.error(e, e.stack);
  } finally {
    setTimeout(loop, 1);
  }
};

document.addEventListener("DOMContentLoaded", function() {
  init();
});
