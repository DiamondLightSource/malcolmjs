/* global self */
/* eslint no-restricted-globals: ["off", "self"] */
import attributeHandler from '../malcolmHandlers/attributeHandler';
import MalcolmSocketContainer from '../malcolmSocket';
import MalcolmReconnector from '../malcolmReconnector';

const webSocket = new MalcolmReconnector('', 5000, WebSocket);
const socketContainer = new MalcolmSocketContainer(webSocket);
console.log('connecting to worker socket');

const messagesInFlight = {};
const existingAttributes = {};

let bufferedMessages = [];

export function processWebSocketMessage(msg) {
  const data = JSON.parse(msg.data);
  const originalRequest = messagesInFlight[data.id];

  let attributeDelta;
  if (data.typeid === 'malcolm:core/Delta:1.0') {
    attributeDelta = attributeHandler.processDeltaMessage(
      data.changes,
      existingAttributes[data.id]
    );

    existingAttributes[data.id] = attributeDelta;
  }

  return {
    data,
    originalRequest,
    attributeDelta,
  };
}

socketContainer.socket.onopen = () => {
  console.log('connected to worker socket');
  self.postMessage('socket connected');
  socketContainer.setConnected(true);
  socketContainer.flush();
};

socketContainer.socket.onmessage = event => {
  const result = processWebSocketMessage({
    data: event.data,
  });
  bufferedMessages.push(result);
};

socketContainer.socket.onclose = () => {
  console.log('socket disconnected');
  self.postMessage('socket disconnected');
};

socketContainer.socket.onerror = error => {
  self.postMessage(`WebSocket Error: ${JSON.stringify(error)}`);
};

function handleMessage(event) {
  if (event.data.startsWith('connect::')) {
    const socketUrl = event.data.replace('connect::', '');
    socketContainer.socket.url = socketUrl;
    socketContainer.socket.connect(socketContainer.socket);
  } else {
    const request = JSON.parse(event.data);
    messagesInFlight[request.id] = request;

    socketContainer.queue.push(event.data);
    socketContainer.flush();
  }
}

self.addEventListener('message', handleMessage);

setInterval(() => {
  const messagesToSend = bufferedMessages;
  bufferedMessages = [];

  self.postMessage(JSON.stringify(messagesToSend));
}, 50);

export default {
  processWebSocketMessage,
};
