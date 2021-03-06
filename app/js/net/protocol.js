const BinaryWritter = require('../binary/writer');
const BinaryReader = require('../binary/reader');

const Move = require('./actions/move');
const Primary = require('./actions/primary');
const Stop = require('./actions/stop');
const Action = require('./actions/action');
const Generic = require('./actions/generic');

const AoeNetPackage = require('./package');
const LobbyTurn = require('./sync/lobby_turn');
const LobbyClock = require('./sync/lobby_clock');
const LobbyReady = require('./sync/lobby_ready');

module.exports = class AoeNetProtocol {

  constructor() {
    this.writer = new BinaryWritter();
    this.reader = new BinaryReader();
    this.networkId = 0;
  }

  isConnecting(thePackage) {
    let command = thePackage.command;
    return command.id() == 0x35 && command.connecting1;
  }

  createGeneric(actionName) {
    let generic = new Generic();
    generic.setActionName(actionName);
    return generic;
  }

  createPrimary() {
    let primary = new Primary();
    primary.player_id = 3,
    primary.zero = 1616,
    primary.target_id = 0,
    primary.selection_count = 3,
    primary.zero2 = Array.from({length: 24}, () => 0),
    primary.x_coord = 45.45,
    primary.y_coord = 55.55,
    primary.selected_ids = [1,2,3];
    return primary;
  }

  createMove() {
    let primary = new Move();
    primary.player_id = 3,
    primary.zero = 1616,
    primary.selection_count = 3,
    primary.zero2 = Array.from({length: 24}, () => 0),
    primary.x_coord = 45.45,
    primary.y_coord = 55.55,
    primary.selected_ids = [1,2,3];
    return primary;
  }

  createStop() {
    let stop = new Stop();
    stop.selection_count = 3,
    stop.selected_ids = [1,2,3];
    return stop;
  }

  createPackage() {
    let thePackage = new AoeNetPackage();
    thePackage.network_source_id = protocol.network_id;
    thePackage.network_dest_id = 2111;
    thePackage.option1 = 21;
    thePackage.option2 = 22;
    thePackage.option3 = 23;

    return thePackage;
  }

  createAction() {
    let action = new Action();
    action.communication_turn = 1000;
    action.individual_counter = 999;

    return action;
  }

  createLobbySyncClock() {
    let sync = new LobbyClock();
    sync.connecting1 = LobbyClock.HOST_CONNECTING1;
    sync.unknown = 0;
    sync.connecting2 = LobbyClock.HOST_CONNECTING2;
    return sync;
  }

  createLobbyTurn() {
    let sync = new LobbyTurn();
    sync.communication_turn = 0;
    return sync;
  }

  createLobbyReady() {
    let thePackage = this.createPackage();
    let config = new LobbyReady();
    config.loadDefautValues();
    thePackage.command = config;
    return thePackage;
  }

  sendPackage(socket, thePackage) {
    this.writer.initBuffer(thePackage.byteSize());
    thePackage.pack(this.writer);
    socket.write(this.writer.buffer);
  }

  receivePackage(data) {
    this.reader.loadBuffer(data);
    return AoeNetPackage.read(this.reader);
  }

  isHost() {
    return typeof serverProtocol != 'undefined';
  }

}
