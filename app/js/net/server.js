const net = require('net');

const AoeNetProtocol = require('./protocol');

let protocol = new AoeNetProtocol();
let clients = [];
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

      let client = {socket, id: thePackage.network_dest_id}
      clients.push(client);
    }
    else {
      for (var client of clients) {
        if (client.id != thePackage.network_source_id) {
          protocol.sendPackage(client.socket, thePackage);
        }
      }
    }
  });
  socket.on('close', function() {
    const index = clients.findIndex((c) => c.socket == socket);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
  socket.on('end', function() {
    const index = clients.findIndex((c) => c.socket == socket);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });

	// socket.pipe(socket);
});

server.listen(1337, '127.0.0.1');
