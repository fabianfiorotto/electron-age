require('../js/entities/types');

var net = require('net');
require("sylvester");

const ResourceManager = require("../resources");
const AoeNetProtocol = require('../js/net/protocol');
const MapView = require('../ui/map/netmap');
const Lobby = require('../ui/lobby/lobby');
const DebugInfo = require('../ui/debug/debug');

window.resources = new ResourceManager();

let client = new net.Socket();
let protocol = new AoeNetProtocol();

var mapView = new MapView();
let debugInfo = new DebugInfo();
let lobby = new Lobby();

init = async () => {
  await debugInfo.bind('debug');
  setInterval(() => debugInfo.resetFps(), 1000);

  await mapView.bind('map');
  await lobby.bind('lobby');
  await mapView.loadTestMap();
  mapView.bindSocket(client, protocol);
  loop();
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

client.on('data', function(data) {
  // console.log('Received: ');
  // console.log(data);

  let thePackage = protocol.receivePackage(data);
  console.log(thePackage);
});

client.on('close', function() {
  console.log('Connection closed');
});

document.addEventListener("DOMContentLoaded", function() {

  let sendPrimary = document.getElementById('primary');
  let sendStop = document.getElementById('stop');

  let sendButtons = document.querySelectorAll('.send');
  let connectButton = document.getElementById('connect');

  connectButton.addEventListener('click', () => {

    if (connectButton.classList.contains('connected')) {
      connectButton.textContent = "Connect";
      connectButton.classList.remove('connected');
      sendButtons.forEach((button) => button.setAttribute('disabled', 'disabled'));
      client.end();
    }
    else {
      client.connect(1337, '127.0.0.1', function() {
        console.log('Connected');
        connectButton.textContent = "Disconnect";
        connectButton.classList.add('connected');
        sendButtons.forEach((button) => button.removeAttribute('disabled'));


        let thePackage = protocol.createPackage();
        thePackage.command = protocol.createLobbySyncClock();
        protocol.sendPackage(client, thePackage);
      });
    }
  });

  sendPrimary.addEventListener('click', () => {
    let thePackage = protocol.createPackage();
    thePackage.command =  protocol.createAction();
    thePackage.command.action = protocol.createPrimary();
    protocol.sendPackage(client, thePackage);
  });

  sendStop.addEventListener('click', () => {
    let thePackage = protocol.createPackage();
    thePackage.command = protocol. createAction();
    thePackage.command.action = protocol.createStop();
    protocol.sendPackage(client, thePackage);
  });

  init();

});
