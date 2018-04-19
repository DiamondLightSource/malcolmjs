function buildMalcolmMessage(action, nextId) {
  const message = { ...action, id: nextId };
  delete message.type;

  return message;
}

function findNextId(messagesInFlight) {
  if (!messagesInFlight || messagesInFlight.length === 0) {
    return 1;
  }
  const maxId = Math.max(messagesInFlight.map(m => m.id));
  return maxId + 1;
}

// eslint-disable-next-line no-unused-vars
const buildMalcolmReduxMiddleware = socket => store => next => action => {
  const result = next(action);

  if (action.type === 'malcolm:send') {
    // we need to put some more logic in here to make the right kind of malcolm message
    const nextId = findNextId(store.getState().malcolm.messagesInFlight);
    socket.send(buildMalcolmMessage(action, nextId));
  }

  return result;
};

export default buildMalcolmReduxMiddleware;
