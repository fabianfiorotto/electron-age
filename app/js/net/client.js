var net = require('net');
const AoeNetProtocol = require('./protocol');


let protocol = new AoeNetProtocol();

var client = new net.Socket();

client.connect(1337, '127.0.0.1', function() {
  console.log('Connected');
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
