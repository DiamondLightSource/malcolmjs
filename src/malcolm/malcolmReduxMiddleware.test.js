import buildMalcolmReduxMiddleware from './malcolmReduxMiddleware';
import { MalcolmNewBlock, MalcolmSend } from './malcolm.types';

describe('malcolm reducer', () => {
  let socketMessages = [];
  let dispatches = [];
  const socket = {
    send: msg => socketMessages.push(msg),
  };
  let middleware = {};
  let store = {};
  const messagesInFlight = [];
  const next = () => 'next called';

  beforeEach(() => {
    socketMessages = [];
    dispatches = [];
    middleware = buildMalcolmReduxMiddleware(socket);

    store = {
      getState: () => ({
        malcolm: {
          messagesInFlight,
        },
      }),
      dispatch: action => dispatches.push(action),
    };
  });

  it('calls next for non-malcolm message', () => {
    const action = {
      type: 'non-malcolm',
    };

    const result = middleware({})(next)(action);

    expect(result).toEqual('next called');
  });

  it('calls next for malcolm message', () => {
    const action = {
      type: 'malcolm:send',
      payload: {},
    };

    const result = middleware(store)(next)(action);

    expect(result).toEqual('next called');
  });

  it('sends malcolm message correctly', () => {
    const action = {
      type: 'malcolm:send',
      payload: {
        typeid: 'malcolm:core/Get:1.0',
      },
    };

    middleware(store)(next)(action);

    expect(socketMessages.length).toEqual(1);
    expect(socketMessages[0].typeid).toEqual('malcolm:core/Get:1.0');
    expect(socketMessages[0].id).toEqual(1);
  });

  it('finds next id correctly', () => {
    const action = {
      type: 'malcolm:send',
      payload: {
        typeid: 'malcolm:core/Get:1.0',
      },
    };

    messagesInFlight.push({ id: 1 });
    messagesInFlight.push({ id: 3 });
    messagesInFlight.push({ id: 5 });

    middleware(store)(next)(action);

    expect(socketMessages.length).toEqual(1);
    expect(socketMessages[0].typeid).toEqual('malcolm:core/Get:1.0');
    expect(socketMessages[0].id).toEqual(6);
  });

  it('loads block details on location change', () => {
    const action = {
      type: '@@router/LOCATION_CHANGE',
      payload: {
        search: '?block=PANDA:TTLIN1',
      },
    };

    middleware(store)(next)(action);

    expect(dispatches.length).toEqual(2);
    expect(dispatches[0].type).toEqual(MalcolmNewBlock);
    expect(dispatches[0].payload.blockName).toEqual('PANDA:TTLIN1');

    expect(dispatches[1].type).toEqual(MalcolmSend);
    expect(dispatches[1].payload.typeid).toEqual('malcolm:core/Subscribe:1.0');
    expect(dispatches[1].payload.path).toEqual(['PANDA:TTLIN1', 'meta']);
  });
});
