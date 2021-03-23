
var net = require('net');
const BinaryReader = require('../js/binary/reader');
const AoeNetProtocol = require('../js/net/protocol');
const AoeNetPackage = require('../js/net/package');

const BinaryWriter = require('../js/binary/writer');
const Primary = require('../js/net/actions/primary');
const Stop = require('../js/net/actions/stop');
const Action = require('../js/net/actions/action');

const LobbyClock = require('../js/net/sync/lobby_clock');

let reader = new BinaryReader();
let writer = new BinaryWriter();
let client = new net.Socket();

client.on('data', function(data) {
  console.log('Received: ');
  console.log(data);

  reader.loadBuffer(data);
  // let package1 = AoeNetProtocol.receivePackage(reader);
  let thePackage = AoeNetPackage.read(reader);
  console.log(thePackage);
});

client.on('close', function() {
  console.log('Connection closed');
});

const createPrimary = function() {
  let primary = new Primary();
  primary.player_id = 3,
  primary.zero = 1616,
  primary.target_id = 3232,
  primary.selection_count = 3,
  primary.zero2 = Array.from({length: 24}, () => 0),
  primary.x_coord = 45.45,
  primary.y_coord = 55.55,
  primary.selected_ids = [1,2,3];
  return primary;
}

const createStop = function() {
  let stop = new Stop();
  stop.selection_count = 3,
  stop.selected_ids = [1,2,3];
  return stop;
}

const createPackage = function() {
  let thePackage = new AoeNetPackage();

  thePackage.network_source_id = 3222;
  thePackage.network_dest_id = 2111;
  thePackage.option1 = 21;
  thePackage.option2 = 22;
  thePackage.option3 = 23;

  return thePackage;
}

createLobbySyncClock = function() {
  let sync = new LobbyClock();
  sync.connecting1 = LobbyClock.HOST_CONNECTING1;
  sync.unknown = 0;
  sync.connecting2 = LobbyClock.HOST_CONNECTING2;
  return sync;
}

const createAction = function() {
  let action = new Action();
  action.communication_turn = 1000;
  action.individual_counter = 999;

  return action;
}

const sendPackage = function(thePackage) {
  writer.initBuffer(thePackage.byteSize());
  thePackage.pack(writer);
  client.write(writer.buffer);
}

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


        let thePackage = createPackage();
        thePackage.command = createLobbySyncClock();
        sendPackage(thePackage);
      });
    }
  });

  sendPrimary.addEventListener('click', () => {
    let thePackage = createPackage();
    thePackage.command =  createAction();
    thePackage.command.action = createPrimary();
    sendPackage(thePackage);
  });

  sendStop.addEventListener('click', () => {
    let thePackage = createPackage();
    thePackage.command =  createAction();
    thePackage.command.action = createStop();
    sendPackage(thePackage);
  });


});
