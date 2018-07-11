import buildMalcolmReduxMiddleware from './malcolmReduxMiddleware';
import {
  MalcolmNewBlock,
  MalcolmSend,
  MalcolmNavigationPathUpdate,
} from '../malcolm.types';

describe('malcolm redux middleware', () => {
  let socketMessages = [];
  let dispatches = [];
  const socketContainer = {
    socket: {
      send: msg => socketMessages.push(JSON.parse(msg)),
    },
    isConnected: true,
    queue: [],
    flush: () => {
      while (socketContainer.queue.length > 0) {
        socketContainer.socket.send(socketContainer.queue[0]);
        socketContainer.queue.shift();
      }
    },
  };
  let middleware = {};
  let store = {};
  let malcolmState;
  const messagesInFlight = [];
  const next = () => 'next called';

  beforeEach(() => {
    socketMessages = [];
    dispatches = [];
    middleware = buildMalcolmReduxMiddleware(socketContainer);
    malcolmState = {
      messagesInFlight,
      counter: 0,
      blocks: {},
    };
    store = {
      getState: () => ({ malcolm: malcolmState }),
      dispatch: action => dispatches.push(action),
    };
  });

  it('calls next for non-malcolm message', () => {
    const action = {
      type: 'non-malcolm',
    };

    const result = middleware(store)(next)(action);

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
        path: ['PANDA'],
      },
    };

    messagesInFlight.push({ id: 1, path: ['PANDA1'] });
    messagesInFlight.push({ id: 2, path: ['PANDA2'] });
    messagesInFlight.push({ id: 5, path: ['PANDA3'] });
    malcolmState.counter = 5;
    middleware(store)(next)(action);

    expect(socketMessages.length).toEqual(1);
    expect(socketMessages[0].typeid).toEqual('malcolm:core/Get:1.0');
    expect(socketMessages[0].id).toEqual(6);
  });

  it('does not subscribe again if the path is already being tracked', () => {
    const action = {
      type: 'malcolm:send',
      payload: {
        typeid: 'malcolm:core/Subscribe:1.0',
        path: ['PANDA'],
      },
    };

    messagesInFlight.push({
      id: 1,
      typeid: 'malcolm:core/Subscribe:1.0',
      path: ['PANDA'],
    });

    middleware(store)(next)(action);

    expect(socketMessages.length).toEqual(0);
  });

  it('loads block details on location change', () => {
    const action = {
      type: '@@router/LOCATION_CHANGE',
      payload: {
        pathname: '/gui/PANDA/layout/PANDA:TTLIN1',
      },
    };

    middleware(store)(next)(action);

    expect(dispatches.length).toEqual(3);

    expect(dispatches[0].type).toEqual(MalcolmNavigationPathUpdate);
    expect(dispatches[0].payload.blockPaths).toEqual([
      'PANDA',
      'layout',
      'PANDA:TTLIN1',
    ]);

    expect(dispatches[1].type).toEqual(MalcolmNewBlock);
    expect(dispatches[1].payload.blockName).toEqual('.blocks');

    expect(dispatches[2].type).toEqual(MalcolmSend);
    expect(dispatches[2].payload.typeid).toEqual('malcolm:core/Subscribe:1.0');
    expect(dispatches[2].payload.path).toEqual(['.', 'blocks']);
  });
});
