const io = require('socket.io-client');
const fs = require('fs');
const { print, stringify } = require('q-i');

const stdin = process.openStdin();
const socket = io('http://localhost:8000', {
  transports: ['websocket'],
});

const sendMessage = (msg) => {
  console.log("Sending...");
  console.log(stringify(msg));
  socket.send(msg);
}

const buildUnsubscribeMessage = (id) => {
  return {
    typeid: 'malcolm:core/Unsubscribe:1.0',
    id
  };
}

stdin.addListener("data", function(d) {
  const input = d.toString().trim().split(':');
  const command = input[0];
  const parameters = input[1];

  if (command === 'canned') {
    fs.readFile('../../server/canned_data/Sub/request_' + parameters, 'utf8', function (err,data) {
      if (err) {
        console.log('File doesn\'t exist, sending a subscribe with that path');
        const defaultSubscribe = {
          "typeid": "malcolm:core/Subscribe:1.0", 
          "id": Math.round(Math.random()*100), 
          "path": [parameters], 
          "delta": true
        }
        sendMessage(defaultSubscribe);
        return;
      }

      const message = JSON.parse(data);
      sendMessage(message);
    });
  } else if (command === 'unsubscribe') {
    sendMessage(buildUnsubscribeMessage(parameters));
  }
});

socket.on('connect', () => {
  console.log('connected to socket');
});

socket.on('message', data => {
  console.log("Received...");
  console.log(stringify(data));
});