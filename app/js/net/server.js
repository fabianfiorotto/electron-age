const net = require('net');

const AoeNetServerProtocol = require('./server_protocol');

let protocol = new AoeNetServerProtocol();

var server = net.createServer(function(socket) {
  socket.on("error", (err) =>{
    console.log("Caught flash policy server socket error: ");
    console.log(err.stack);
  });

  socket.on('data', function(data) {
    let thePackage = protocol.receivePackage(data);
    let command = thePackage.command;
    if (protocol.isConnecting(thePackage)) {
      thePackage = protocol.connectionAccepedPackage();
      protocol.sendPackage(socket, thePackage);
      protocol.addClient(socket, thePackage);
    }
    // else {
      protocol.broadcast(thePackage)
    // }
  });
  socket.on('close', function() {
    protocol.removeClient(socket);
  });
  socket.on('end', function() {
    protocol.removeClient(socket);
  });

	// socket.pipe(socket);
});

server.listen(1337, '127.0.0.1', () => {
  console.log('listening');
});
