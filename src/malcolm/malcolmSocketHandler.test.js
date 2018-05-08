import configureMalcolmSocketHandlers from './malcolmSocketHandler';
import { MalcolmBlockMeta, MalcolmAttributeData } from './malcolm.types';

describe('malcolm socket handler', () => {
  let dispatches = [];
  let socketMethods = {};

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

  const socket = {
    on: (methodName, operation) => {
      socketMethods[methodName] = operation;
    },
    send: (methodName, payload) => socketMethods[methodName](payload),
  };

  const buildMessage = (typeid, id, payload) => ({
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
    socketMethods = {};

    configureMalcolmSocketHandlers(socket, store);
  });

  it('handles block meta updates', () => {
    const message = buildMessage('malcolm:core/BlockMeta:1.0', 1, {
      label: 'Block 1',
    });

    socket.send('message', message);

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

    socket.send('message', message);

    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmAttributeData);
    expect(dispatches[0].payload.typeid).toEqual('epics:nt/NTScalar:1.0');
  });

  it('dispatches a message for unhandled deltas', () => {
    const message = buildMessage('unknown type', 1, {});

    socket.send('message', message);

    expect(dispatches.length).toEqual(2);
    expect(dispatches[0].type).toEqual('unprocessed_delta');
    expect(dispatches[0].payload.typeid).toEqual('unknown type');

    expect(dispatches[1].type).toEqual(MalcolmAttributeData);
    expect(dispatches[1].payload.unableToProcess).toEqual(true);
  });
});
