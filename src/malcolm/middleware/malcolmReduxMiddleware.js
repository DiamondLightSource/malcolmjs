import { MalcolmSend } from '../malcolm.types';
import handleLocationChange from './malcolmRouting';

function sendMalcolmMessage(socketContainer, payload) {
  const message = { ...payload };
  delete message.type;
  const msg = JSON.stringify(message);

  socketContainer.queue.push(msg);
  socketContainer.flush();
}

function getNextId(malcolmState) {
  const copiedState = malcolmState;
  if (copiedState.counter) {
    copiedState.counter += 1;
  } else {
    copiedState.counter = 1;
  }
  return copiedState.counter;
}

function subscriptionActive(path, messagesInFlight) {
  return messagesInFlight.some(
    m =>
      m.typeid === 'malcolm:core/Subscribe:1.0' && m.path.join() === path.join()
  );
}

// eslint-disable-next-line no-unused-vars
const buildMalcolmReduxMiddleware = socketContainer => store => next => action => {
  const updatedAction = { ...action };
  const { messagesInFlight, blocks } = store.getState().malcolm;

  switch (action.type) {
    case MalcolmSend:
      updatedAction.payload.id = getNextId(store.getState().malcolm);

      if (
        action.payload.typeid !== 'malcolm:core/Subscribe:1.0' ||
        !subscriptionActive(updatedAction.payload.path, messagesInFlight)
      ) {
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
