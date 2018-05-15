import configureMalcolmSocketHandlers from './malcolmSocketHandler';
import { MalcolmBlockMeta, MalcolmAttributeData } from './malcolm.types';

describe('malcolm socket handler', () => {
  let dispatches = [];
  const drain = [];

  const state = {
    malcolm: {
      messagesInFlight: [
        {
          id: 1,
          path: ['block1', 'meta'],
        },
        {
          id: 2,
          path: ['block1', 'health'],
        },
      ],
    },
  };

  const store = {
    dispatch: action => dispatches.push(action),
    getState: () => state,
  };

  const socketContainer = {
    socket: {
      onmessage: () => {},
      onerror: () => {},
      onopen: () => {},
      onclose: () => {},
      send: payload => {
        const event = {
          data: payload,
        };
        socketContainer.socket.onmessage(event);
      },
    },
    isConnected: false,
    queue: [],
    flush: () => {
      drain.push(socketContainer.queue.shift());
    },
  };

  const buildMessage = (typeid, id, payload) =>
    JSON.stringify({
      typeid: 'malcolm:core/Delta:1.0',
      id,
      changes: [
        [
          [],
          {
            typeid,
            ...payload,
          },
        ],
      ],
    });

  beforeEach(() => {
    dispatches = [];
    socketContainer.queue = [];
    configureMalcolmSocketHandlers(socketContainer, store);
  });

  it('sets flag and flushes on open', () => {
    socketContainer.queue.push('flushed test');
    socketContainer.socket.onopen();
    expect(socketContainer.isConnected).toEqual(true);
    expect(drain).toEqual(['flushed test']);
  });

  it('handles block meta updates', () => {
    const message = buildMessage('malcolm:core/BlockMeta:1.0', 1, {
      label: 'Block 1',
    });

    socketContainer.socket.send(message);

    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmBlockMeta);
    expect(dispatches[0].payload.label).toEqual('Block 1');
  });

  it('handles attribute updates', () => {
    const changes = {
      label: 'Attribute 1',
      meta: {
        tags: [],
      },
    };
    const message = buildMessage('epics:nt/NTScalar:1.0', 2, changes);

    socketContainer.socket.send(message);

    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmAttributeData);
    expect(dispatches[0].payload.typeid).toEqual('epics:nt/NTScalar:1.0');
  });

  it('dispatches a message for unhandled deltas', () => {
    const message = buildMessage('unknown type', 1, {});

    socketContainer.socket.send(message);

    expect(dispatches.length).toEqual(2);
    expect(dispatches[0].type).toEqual('unprocessed_delta');
    expect(dispatches[0].payload.typeid).toEqual('unknown type');

    expect(dispatches[1].type).toEqual(MalcolmAttributeData);
    expect(dispatches[1].payload.unableToProcess).toEqual(true);
  });
});
