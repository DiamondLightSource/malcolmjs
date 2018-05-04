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

  beforeEach(() => {
    dispatches = [];
    socketMethods = {};
  });

  it('handles block meta updates', () => {
    configureMalcolmSocketHandlers(socket, store);

    const message = {
      typeid: 'malcolm:core/Delta:1.0',
      id: 1,
      changes: [
        [
          [],
          {
            typeid: 'malcolm:core/BlockMeta:1.0',
            label: 'Block 1',
            meta: {
              tags: [],
            },
          },
        ],
      ],
    };

    socket.send('message', message);

    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmBlockMeta);
    expect(dispatches[0].payload.label).toEqual('Block 1');
  });

  it('handles attribute updates', () => {
    configureMalcolmSocketHandlers(socket, store);

    const message = {
      typeid: 'malcolm:core/Delta:1.0',
      id: 2,
      changes: [
        [
          [],
          {
            typeid: 'epics:nt/NTScalar:1.0',
            label: 'Attribute 1',
            meta: {
              tags: [],
            },
          },
        ],
      ],
    };

    socket.send('message', message);

    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmAttributeData);
    expect(dispatches[0].payload.typeid).toEqual('epics:nt/NTScalar:1.0');
  });
});
