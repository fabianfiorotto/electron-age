const net = require('net');
const BinaryWritter = require('../binary/writer');
const Header = require('./actions/header');
const Primary = require('./actions/primary');
const Stop = require('./actions/stop');
const Action = require('./actions/action');

const AoeNetPackage = require('./package')


let writer = new BinaryWritter();


var server = net.createServer(function(socket) {
  socket.on("error", (err) =>{
    console.log("Caught flash policy server socket error: ");
    console.log(err.stack);
  });

	// socket.write('Echo server\r\n');



  let thePackage = new AoeNetPackage();

  let header = new Header();
  let action = new Action();

  thePackage.network_source_id = 3222;
  thePackage.network_dest_id = 2111;

  header.option1 = 21;
  header.option2 = 22;
  header.option3 = 23;
  header.communication_turn = 1000;
  header.individual_counter = 999;


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

  action.header = header;
  // action.action = primary;
  action.action = stop;

  thePackage.command = action;

  writer.initBuffer(thePackage.byteSize());

  thePackage.pack(writer);

  socket.write(writer.buffer);


  socket.on('data', function(data) {
  	console.log('Received: ' + data);
  });
	// socket.pipe(socket);
});

server.listen(1337, '127.0.0.1');
