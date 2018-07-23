/* global self */
/* eslint no-restricted-globals: ["off", "self"] */
import attributeHandler from './malcolmHandlers/attributeHandler';

function processWebSocketMessage(event) {
  const msg = event.data;
  const data = JSON.parse(msg.data);
  const originalRequest = msg.messagesInFlight[data.id];

  let attributeDelta;
  if (data.typeid === 'malcolm:core/Delta:1.0') {
    const { changes } = data;
    attributeDelta = attributeHandler.processDeltaMessage(
      changes,
      originalRequest,
      msg.blocks
    );
  }

  self.postMessage({
    data,
    originalRequest,
    attributeDelta,
  });
}

self.addEventListener('message', processWebSocketMessage);
