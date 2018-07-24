/* global self */
/* eslint no-restricted-globals: ["off", "self"] */
import attributeHandler from '../malcolmHandlers/attributeHandler';

export function processWebSocketMessage(msg) {
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

  return {
    data,
    originalRequest,
    attributeDelta,
  };
}

function handleMessage(event) {
  const result = processWebSocketMessage(event.data);
  self.postMessage(result);
}

self.addEventListener('message', handleMessage);

export default {
  processWebSocketMessage,
};
