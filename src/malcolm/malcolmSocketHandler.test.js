import configureMalcolmSocketHandlers from './malcolmSocketHandler';
import { MalcolmBlockMeta } from './malcolm.types';

describe('malcolm socket handler', () => {
  let dispatches = [];
  let socketMethods = {};

  const store = {
    dispatch: action => dispatches.push(action),
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
      changes: [
        [
          [],
          {
            typeid: 'malcolm:core/BlockMeta:1.0',
            label: 'Block 1',
          },
        ],
      ],
    };

    socket.send('message', message);

    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmBlockMeta);
    expect(dispatches[0].payload.label).toEqual('Block 1');
  });
});
