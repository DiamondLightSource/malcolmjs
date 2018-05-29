import { MalcolmSend } from '../malcolm.types';
import handleLocationChange from './malcolmRouting';

function sendMalcolmMessage(socketContainer, payload) {
  const message = { ...payload };
  delete message.type;
  const msg = JSON.stringify(message);
  socketContainer.queue.push(msg);
  socketContainer.flush();
}

function findNextId(messagesInFlight) {
  if (!messagesInFlight || messagesInFlight.length === 0) {
    return 1;
  }

  const maxId = Math.max(...messagesInFlight.map(m => m.id));
  return maxId + 1;
}

function subscriptionActive(path, messagesInFlight) {
  return messagesInFlight.some(m => m.path.join() === path.join());
}

// eslint-disable-next-line no-unused-vars
const buildMalcolmReduxMiddleware = socketContainer => store => next => action => {
  const updatedAction = { ...action };
  const { messagesInFlight, blocks } = store.getState().malcolm;

  switch (action.type) {
    case MalcolmSend:
      updatedAction.payload.id = findNextId(messagesInFlight);

      if (!subscriptionActive(updatedAction.payload.path, messagesInFlight)) {
        sendMalcolmMessage(socketContainer, action.payload);
      }

      break;

    case '@@router/LOCATION_CHANGE':
      handleLocationChange(action.payload.pathname, blocks, store.dispatch);

      break;

    default:
      break;
  }

  return next(updatedAction);
};

export default buildMalcolmReduxMiddleware;
