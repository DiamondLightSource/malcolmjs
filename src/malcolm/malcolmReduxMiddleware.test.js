import buildMalcolmReduxMiddleware from './malcolmReduxMiddleware';

describe('malcolm reducer', () => {
  let socketMessages = [];
  const socket = {
    send: msg => socketMessages.push(msg),
  };
  let middleware = {};
  let store = {};
  const messagesInFlight = [];

  beforeEach(() => {
    socketMessages = [];
    middleware = buildMalcolmReduxMiddleware(socket);

    store = {
      getState: () => ({
        malcolm: {
          messagesInFlight,
        },
      }),
    };
  });

  it('calls next for non-malcolm message', () => {
    const next = () => 'next called';
    const action = {
      type: 'non-malcolm',
    };

    const result = middleware({})(next)(action);

    expect(result).toEqual('next called');
  });

  it('calls next for malcolm message', () => {
    const next = () => 'next called';
    const action = {
      type: 'malcolm:send',
    };

    const result = middleware(store)(next)(action);

    expect(result).toEqual('next called');
  });

  it('sends malcolm message correctly', () => {
    const next = () => 'next called';
    const action = {
      type: 'malcolm:send',
      typeid: 'malcolm:core/Get:1.0',
    };

    middleware(store)(next)(action);

    expect(socketMessages.length).toEqual(1);
    expect(socketMessages[0].typeid).toEqual('malcolm:core/Get:1.0');
    expect(socketMessages[0].id).toEqual(1);
  });

  it('finds next id correctly', () => {
    const next = () => 'next called';
    const action = {
      type: 'malcolm:send',
      typeid: 'malcolm:core/Get:1.0',
    };

    messagesInFlight.push({ id: 1 });
    messagesInFlight.push({ id: 3 });
    messagesInFlight.push({ id: 5 });

    middleware(store)(next)(action);

    expect(socketMessages.length).toEqual(1);
    expect(socketMessages[0].typeid).toEqual('malcolm:core/Get:1.0');
    expect(socketMessages[0].id).toEqual(6);
  });
});
