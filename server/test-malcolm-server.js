const io = require('socket.io')();
const fs = require('fs');

let settings = JSON.parse(fs.readFileSync('./server/server-settings.json'));

let malcolmMessages = {};
let subscriptions = [];

const dataFolder = './server/canned_data/Sub/';
fs.readdir(dataFolder, (err, files) => {
  files.filter(f => f.startsWith('request_')).forEach(file => {
    const request = JSON.parse(fs.readFileSync(dataFolder + file).toString());
    delete request.id;

    const response = JSON.parse(fs.readFileSync((dataFolder + file).replace('request_', 'response_')).toString());
    delete response.id;

    malcolmMessages[JSON.stringify(request)] = response;
  });
})

io.on('connection', function (socket) {
  socket.on('message', message => handleMessage(socket, message));
  socket.on('disconnect', () => handleDisconnect());
});

const port = 8000;
io.listen(port);
console.log('listening on port ', port);

function handleMessage(socket, message) {
  let simplifiedMessage = message;
  const originalId = message.id;
  delete simplifiedMessage.id

  if (simplifiedMessage.typeid.indexOf('Unsubscribe') > -1) {
    handleUnsubscribe(socket, originalId);

  } else if(malcolmMessages.hasOwnProperty(JSON.stringify(simplifiedMessage))){
    if (simplifiedMessage.typeid.indexOf('Subscribe') > -1) {
      subscriptions.push(originalId.toString());
    }

    let response = Object.assign({id: originalId}, malcolmMessages[JSON.stringify(simplifiedMessage)]);
    sendResponse(socket, response);

  } else {
    sendResponse(socket, buildErrorMessage(originalId, message));
  }
}

function sendResponse(socket, message) {
  setTimeout(() => {
    socket.send(message)
  }, settings.delay);
}

function handleDisconnect() {
  console.log('client disconnected');
}

function buildErrorMessage(id, message) {
  const errorResponse = {
    typeid: 'malcolm:core/Error:1.0',
    id,
    message: 'There was no canned response to the message: ' + JSON.stringify(message)
  };
  return errorResponse;
}

function buildReturnMessage(id, value) {
  const response = {
    typeid: 'malcolm:core/Return:1.0',
    id,
    value
  };
  return response;
}

function handleUnsubscribe(socket, id) {
  const index = subscriptions.indexOf(id.toString());
    if (index > -1) {
      subscriptions.splice(index, 1);
      sendResponse(socket, buildReturnMessage(id, null));
    } else {
      sendResponse(socket, {
        typeid: 'malcolm:core/Error:1.0',
        id,
        message: 'The id: ' + id + ' is not currently being subscribed' 
      });
    }
}