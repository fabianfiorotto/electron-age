
var net = require('net');
const AoeNetProtocol = require('../js/net/protocol');

let client = new net.Socket();
let protocol = new AoeNetProtocol();

client.on('data', function(data) {
  console.log('Received: ');
  console.log(data);

  let thePackage = protocol.receivePackage(data);
  console.log(thePackage);
});

client.on('close', function() {
  console.log('Connection closed');
});

document.addEventListener("DOMContentLoaded", function() {

  let sendPrimary = document.getElementById('primary');
  let sendStop = document.getElementById('stop');

  let sendButtons = document.querySelectorAll('.send');
  let connectButton = document.getElementById('connect');

  connectButton.addEventListener('click', () => {

    if (connectButton.classList.contains('connected')) {
      connectButton.textContent = "Connect";
      connectButton.classList.remove('connected');
      sendButtons.forEach((button) => button.setAttribute('disabled', 'disabled'));
      client.end();
    }
    else {
      client.connect(1337, '127.0.0.1', function() {
        console.log('Connected');
        connectButton.textContent = "Disconnect";
        connectButton.classList.add('connected');
        sendButtons.forEach((button) => button.removeAttribute('disabled'));


        let thePackage = protocol.createPackage();
        thePackage.command = protocol.createLobbySyncClock();
        protocol.sendPackage(client, thePackage);
      });
    }
  });

  sendPrimary.addEventListener('click', () => {
    let thePackage = protocol.createPackage();
    thePackage.command =  protocol.createAction();
    thePackage.command.action = protocol.createPrimary();
    protocol.sendPackage(client, thePackage);
  });

  sendStop.addEventListener('click', () => {
    let thePackage = protocol.createPackage();
    thePackage.command = protocol. createAction();
    thePackage.command.action = protocol.createStop();
    protocol.sendPackage(client, thePackage);
  });


});
