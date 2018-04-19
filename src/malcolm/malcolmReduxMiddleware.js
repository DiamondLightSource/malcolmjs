function buildMalcolmMessage(action) {
  const message = { ...action };
  delete message.type;

  return message;
}

// eslint-disable-next-line no-unused-vars
const buildMalcolmReduxMiddleware = socket => store => next => action => {
  const result = next(action);

  if (action.type === 'malcolm:send') {
    // we need to put some more logic in here to make the right kind of malcolm message

    socket.send(buildMalcolmMessage(action));
  }

  return result;
};

export default buildMalcolmReduxMiddleware;
