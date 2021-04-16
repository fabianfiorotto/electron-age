var net = require('net');
const AoeNetProtocol = require('./protocol');


let protocol = new AoeNetProtocol();

var client = new net.Socket();

client.connect(1337, '127.0.0.1', function() {
  console.log('Connected');

  let thePackage = protocol.createPackage();
  thePackage.command = protocol.createLobbySyncClock();
  protocol.sendPackage(client, thePackage);


  thePackage = protocol.createPackage();
  thePackage.command =  protocol.createAction();

  let action = protocol.createMove();

  action.player_id = 2;

  action.x_coord = 614.7;
  action.y_coord = 100;

  action.selection_count = 1;
  action.selected_ids = [8];

  thePackage.command.action = action;
  protocol.sendPackage(client, thePackage);

});

client.on('data', function(data) {
  console.log('Received: ');
  console.log(data);

  let thePackage = protocol.receivePackage(data);
  console.log(thePackage);

  // client.destroy(); // kill client after server's response
  client.end(); // end client after server's response
});

client.on('close', function() {
  console.log('Connection closed');
});
