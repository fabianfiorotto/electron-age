const net = require('net');
const BinaryWritter = require('../binary/writer');
const Header = require('./actions/header');
const Action = require('./actions/primary');


let writer = new BinaryWritter();


var server = net.createServer(function(socket) {
  socket.on("error", (err) =>{
    console.log("Caught flash policy server socket error: ");
    console.log(err.stack);
  });

	// socket.write('Echo server\r\n');



  let header = new Header();
  let action = new Action();


  header.network_source_id = 3222;
  header.network_dest_id = 2111;
  header.command = 0x3e;
  header.option1 = 21;
  header.option2 = 22;
  header.option3 = 23;
  header.communication_turn = 1000;
  header.individual_counter = 999;


  action.action_identifier = 3,
  action.player_id = 3,
  action.zero = 1616,
  action.target_id = 3232,
  action.selection_count = 3,
  action.zero2 = Array.from({length: 24}, () => 0),
  action.x_coord = 45.45,
  action.y_coord = 55.55,
  action.selected_ids = [1,2,3];

  writer.initBuffer(header.byteSize() + action.byteSize());
// writer.initBuffer(200);

header.pack(writer);
  action.pack(writer);

  socket.write(writer.buffer);


  socket.on('data', function(data) {
  	console.log('Received: ' + data);
  });
	// socket.pipe(socket);
});

server.listen(1337, '127.0.0.1');
