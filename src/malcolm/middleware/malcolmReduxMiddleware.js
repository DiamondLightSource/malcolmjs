import { MalcolmIncrementMessageCount, MalcolmSend } from '../malcolm.types';
import handleLocationChange from './malcolmRouting';

function sendMalcolmMessage(worker, payload) {
  const message = { ...payload };
  delete message.type;
  const msg = JSON.stringify(message);

  worker.postMessage(msg);
}

function subscriptionActive(path, messagesInFlight) {
  return Object.keys(messagesInFlight).some(
    m =>
      messagesInFlight[m].typeid === 'malcolm:core/Subscribe:1.0' &&
      messagesInFlight[m].path.join() === path.join()
  );
}

// eslint-disable-next-line no-unused-vars
const buildMalcolmReduxMiddleware = worker => store => next => action => {
  const updatedAction = { ...action };
  const { messagesInFlight, blocks } = store.getState().malcolm;

  switch (action.type) {
    case MalcolmSend:
      store.dispatch({ type: MalcolmIncrementMessageCount });
      updatedAction.payload.id = store.getState().malcolm.counter;

      if (
        action.payload.typeid !== 'malcolm:core/Subscribe:1.0' ||
        !subscriptionActive(updatedAction.payload.path, messagesInFlight)
      ) {
        sendMalcolmMessage(worker, action.payload);
      }

      break;

    case '@@router/LOCATION_CHANGE':
      handleLocationChange(
        action.payload.pathname,
        blocks,
        store.dispatch,
        store.getState
      );

      break;

    default:
      break;
  }

  return next(updatedAction);
};

export default buildMalcolmReduxMiddleware;
