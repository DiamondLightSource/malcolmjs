const WebSocket = require('ws');
const fs = require('fs');
const dataLoader = require('./loadCannedData');
const subscriptionFeed = require('./subscriptionFeed');

let settings = JSON.parse(fs.readFileSync('./server/server-settings.json'));

let malcolmMessages = dataLoader.loadData('./server/canned_data/');
let pathIndexedMessages = dataLoader.loadDatabyPath('./server/canned_data/');
let subscriptions = [];
let subscribedPaths = {};

const io = new WebSocket.Server({port: 8000});

io.on('connection', function (socket) {
  socket.on('message', message => {
    try {
      message = JSON.parse(message);
      handleMessage(socket, message);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on('disconnect', () => handleDisconnect());
  socket.on('error', (err) => {
    subscriptionFeed.cancelAllSubscriptions();
    subscriptions = [];
    subscribedPaths = {};
    console.log('errored');
    console.log(err);
  });
});



const port = 8000;
console.log('listening on port ', port);

function handleMessage(socket, message) {
  let simplifiedMessage = message;
  const originalId = message.id;
  delete simplifiedMessage.id;
  if (simplifiedMessage.typeid.indexOf('Unsubscribe') > -1) {
    handleUnsubscribe(socket, originalId);

  } else if (malcolmMessages.hasOwnProperty(JSON.stringify(simplifiedMessage))) {
    let response = Object.assign({id: originalId}, malcolmMessages[JSON.stringify(simplifiedMessage)]);

    if (simplifiedMessage.typeid.indexOf('Subscribe') > -1) {
      subscriptions.push(originalId.toString());
      subscribedPaths[JSON.stringify(simplifiedMessage.path)] = originalId.toString();

      subscriptionFeed.checkForActiveSubscription(simplifiedMessage, response, socket);
    }

    sendResponse(socket, response);

    
  } else if (simplifiedMessage.typeid.indexOf('Put') > -1) {
    let response;
    if (pathIndexedMessages.hasOwnProperty(JSON.stringify(simplifiedMessage.path))) {
      pathIndexedMessages[JSON.stringify(simplifiedMessage.path)].changes[0][1].value = simplifiedMessage.value;
      if (subscribedPaths.hasOwnProperty(JSON.stringify(simplifiedMessage.path))) {
        response = {
          id: parseInt(subscribedPaths[JSON.stringify(simplifiedMessage.path)]),
          typeid: 'malcolm:core/Delta:1.0',
          changes: [
            [
              ["value"],
              pathIndexedMessages[JSON.stringify(simplifiedMessage.path)].changes[0][1].value,
            ],
          ],
        };
        sendResponse(socket, response);
      }

      response = { id: originalId, typeid: 'malcolm:core/Return:1.0' };
    } else {
      response = buildErrorMessage(originalId, message);
    }
    sendResponse(socket, response);
  } else {
    sendResponse(socket, buildErrorMessage(originalId, message));
  }
}

function sendResponse(socket, message) {
  setTimeout(() => {
    if (socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify(message))
    }
  }, Math.ceil(settings.delay));
}

function handleDisconnect() {
  console.log('client disconnected');
  subscriptionFeed.cancelAllSubscriptions();
  subscriptions = [];
  subscribedPaths = {};
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