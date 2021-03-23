const net = require('net');
const BinaryWritter = require('../binary/writer');
const BinaryReader = require('../binary/reader');
const Primary = require('./actions/primary');
const Stop = require('./actions/stop');
const Action = require('./actions/action');

const AoeNetPackage = require('./package');
const LobbyTurn = require('./sync/lobby_turn');

let writer = new BinaryWritter();
let reader = new BinaryReader();

var server = net.createServer(function(socket) {
  socket.on("error", (err) =>{
    console.log("Caught flash policy server socket error: ");
    console.log(err.stack);
  });

	// socket.write('Echo server\r\n');



  let thePackage = new AoeNetPackage();

  let action = new Action();
  action.communication_turn = 1000;
  action.individual_counter = 999;

  thePackage.network_source_id = 3222;
  thePackage.network_dest_id = 2111;
  thePackage.option1 = 21;
  thePackage.option2 = 22;
  thePackage.option3 = 23;

  let primary = new Primary();
  primary.player_id = 3,
  primary.zero = 1616,
  primary.target_id = 3232,
  primary.selection_count = 3,
  primary.zero2 = Array.from({length: 24}, () => 0),
  primary.x_coord = 45.45,
  primary.y_coord = 55.55,
  primary.selected_ids = [1,2,3];

  let stop = new Stop();
  stop.selection_count = 3,
  stop.selected_ids = [1,2,3];

  // action.action = primary;
  action.action = stop;

  thePackage.command = action;

  writer.initBuffer(thePackage.byteSize());

  thePackage.pack(writer);

  socket.write(writer.buffer);


  socket.on('data', function(data) {
    reader.loadBuffer(data);
    let thePackage = AoeNetPackage.read(reader);
    console.log(thePackage);
  });
	// socket.pipe(socket);
});

server.listen(1337, '127.0.0.1');
