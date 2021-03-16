var net = require('net');
const BinaryReader = require('../binary/reader');
const AoeNetProtocol = require('./protocol');

const AoeNetPackage = require('./package')

let reader = new BinaryReader();

var client = new net.Socket();

client.connect(1337, '127.0.0.1', function() {
  console.log('Connected');
  client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
  console.log('Received: ');
  console.log(data);

  reader.loadBuffer(data);
  // let package1 = AoeNetProtocol.receivePackage(reader);
  let thePackage = AoeNetPackage.read(reader);
  console.log(thePackage);

  // client.destroy(); // kill client after server's response
  client.end(); // end client after server's response
});

client.on('close', function() {
  console.log('Connection closed');
});
