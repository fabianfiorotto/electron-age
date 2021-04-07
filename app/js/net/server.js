const net = require('net');

const AoeNetProtocol = require('./protocol');

let protocol = new AoeNetProtocol();
let last_id = 0;

var server = net.createServer(function(socket) {
  socket.on("error", (err) =>{
    console.log("Caught flash policy server socket error: ");
    console.log(err.stack);
  });

  let thePackage = protocol.createPackage();
  thePackage.command =  protocol.createAction();
  thePackage.command.action = protocol.createPrimary();
  // thePackage.command.action = protocol.createStop();

  protocol.sendPackage(socket, thePackage);

  socket.on('data', function(data) {
    let thePackage = protocol.receivePackage(data);
    console.log(thePackage);
    let command = thePackage.command;
    if (command.id() == 0x35 && command.connecting1) {
      thePackage = protocol.createPackage();
      thePackage.command = protocol.createLobbyTurn();
      thePackage.network_dest_id = last_id++;
      protocol.sendPackage(socket, thePackage);
    }
  });
	// socket.pipe(socket);
});

server.listen(1337, '127.0.0.1');
