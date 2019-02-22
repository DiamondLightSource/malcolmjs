import handleLocationChange from './middleware/malcolmRouting';
import MalcolmReconnector from './malcolmReconnector';
import configureMalcolmSocketHandlers from './malcolmSocketHandler';
import {
  MalcolmBlockMeta,
  MalcolmAttributeData,
  MalcolmCleanBlocks,
  MalcolmDisconnected,
  MalcolmRootBlockMeta,
  MalcolmReturn,
  MalcolmAttributeFlag,
  MalcolmError,
  MalcolmMultipleAttributeData,
  MalcolmSend,
} from './malcolm.types';
import { snackbar } from '../viewState/viewState.actions';

jest.mock('./middleware/malcolmRouting');
jest.useFakeTimers();

describe('malcolm socket handler', () => {
  let dispatches = [];
  let connectionState = false;

  let state = {};

  const store = {
    dispatch: action => {
      if (action.type === MalcolmRootBlockMeta) {
        state.malcolm.blocks['.blocks'] = {
          children: [...action.payload.blocks],
        };
        dispatches.push(action);
      } else if (typeof action === 'function') {
        action(a => dispatches.push(a), () => state);
      } else {
        dispatches.push(action);
      }
    },
    getState: () => state,
  };

  class DummySocketConstructor {
    constructor(url) {
      this.url = url;
      this.onmessage = () => {};
      this.onerror = () => {};
      this.onopen = () => {};
      this.onclose = () => {};
      this.send = payload => {
        const event = {
          data: payload,
        };
        this.onmessage(event);
      };
    }
  }

  const socketContainer = {
    socket: {},
    isConnected: () => connectionState,
    setConnected: connected => {
      connectionState = connected;
    },
    queue: [],
    flush: () => {},
  };

  const reconnectingSocketContainer = {
    socket: {},
    isConnected: () => connectionState,
    setConnected: connected => {
      connectionState = connected;
    },
    queue: [],
    flush: () => {},
  };

  const buildMessage = (typeid, id, payload) =>
    JSON.stringify([
      {
        data: {
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
        },
        originalRequest: state.malcolm.messagesInFlight[id],
        attributeDelta: {
          typeid,
          ...payload,
        },
      },
    ]);

  let malcolmWorker = {};

  beforeEach(() => {
    state = {
      router: {
        location: {
          pathname: '',
        },
      },
      malcolm: {
        messagesInFlight: {
          1: {
            id: 1,
            path: ['block1', 'meta'],
          },
          2: {
            id: 2,
            path: ['block1', 'health'],
          },
          3: {
            typeid: 'malcolm:core/Put:1.0',
            id: 3,
            path: ['TestBlock', 'TestAttr'],
            value: null,
          },
          4: {
            id: 4,
            path: ['.', 'blocks', 'value'],
          },
        },
        blocks: {
          TestBlock: {
            name: 'Test:TestBlock',
            attributes: [
              {
                pending: true,
                raw: {
                  value: 0,
                },
                calculated: {
                  name: 'TestAttr',
                },
              },
            ],
          },
          TestBlock2: {
            name: 'Test:TestBlock2',
            attributes: [
              {
                pending: true,
                raw: {
                  value: 0,
                },
                calculated: {
                  name: 'TestAttr',
                },
              },
            ],
          },
        },
        navigation: {
          navigationLists: [],
        },
      },
    };

    dispatches = [];
    socketContainer.socket = new DummySocketConstructor('');
    reconnectingSocketContainer.socket = new MalcolmReconnector(
      '',
      0,
      DummySocketConstructor
    );
    reconnectingSocketContainer.socket.mockConnect = jest.fn();
    reconnectingSocketContainer.socket.connect = inputSocket =>
      inputSocket.mockConnect(inputSocket);
    socketContainer.queue = [];
    handleLocationChange.mockClear();

    const listeners = [];
    malcolmWorker = {
      addEventListener: (type, listener) => listeners.push(listener),
      postMessage: event => {
        listeners.forEach(l => l({ data: event }));
      },
    };

    configureMalcolmSocketHandlers(store, malcolmWorker);
  });

  it('resets blocks on open or reconnect', () => {
    malcolmWorker.postMessage('socket connected');
    expect(dispatches.length).toEqual(2);
    expect(dispatches[0].type).toEqual(MalcolmCleanBlocks);
    expect(dispatches[1].type).toEqual(snackbar);
    expect(dispatches[1].snackbar.open).toEqual(true);
    expect(dispatches[1].snackbar.message).toEqual(`Connected to WebSocket`);
  });

  it('does nothing on receiving a non-malcolm message', () => {
    malcolmWorker.postMessage(
      JSON.stringify([
        {
          data: { typeid: 'notAMalcolmMessage', id: 1 },
          originalRequest: state.malcolm.messagesInFlight[1],
        },
      ])
    );

    expect(dispatches.length).toEqual(0);
  });

  it('handles block meta updates', () => {
    const message = buildMessage('malcolm:core/BlockMeta:1.0', 1, {
      label: 'Block 1',
    });

    malcolmWorker.postMessage(message);

    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmBlockMeta);
    expect(dispatches[0].payload.label).toEqual('Block 1');
  });

  const runAttributeUpdateTest = typeid => {
    const changes = {
      label: 'Attribute 1',
      meta: {
        tags: [],
      },
    };
    const message = buildMessage(typeid, 2, changes);

    malcolmWorker.postMessage(message);

    expect(dispatches.length).toBeGreaterThanOrEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmMultipleAttributeData);
    expect(dispatches[0].payload.actions).toHaveLength(1);
    expect(dispatches[0].payload.actions[0].type).toEqual(MalcolmAttributeData);
    expect(dispatches[0].payload.actions[0].payload.raw.typeid).toEqual(typeid);
  };

  it('handles scalar attribute updates', () => {
    runAttributeUpdateTest('epics:nt/NTScalar:1.0');
  });

  it('handles table attribute updates', () => {
    runAttributeUpdateTest('epics:nt/NTTable:1.0');
  });

  it('handles method updates', () => {
    const changes = {
      label: 'Attribute 1',
      meta: {
        tags: [],
      },
    };
    const message = buildMessage('malcolm:core/Method:1.1', 2, changes);

    malcolmWorker.postMessage(message);

    expect(dispatches.length).toBeGreaterThanOrEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmAttributeData);
    expect(dispatches[0].type).toEqual(MalcolmAttributeData);
    expect(dispatches[0].payload.typeid).toEqual('malcolm:core/Method:1.1');
  });

  it('dispatches a message for unhandled deltas', () => {
    const message = buildMessage('unknown type', 1, {});

    malcolmWorker.postMessage(message);

    expect(dispatches.length).toEqual(3);
    expect(dispatches[0].type).toEqual('unprocessed_delta');
    expect(dispatches[0].payload.typeid).toEqual('unknown type');

    expect(dispatches[1].type).toEqual(MalcolmAttributeData);
    expect(dispatches[1].payload.unableToProcess).toEqual(true);
    expect(dispatches[2].type).toEqual(snackbar);
    expect(dispatches[2].snackbar.open).toEqual(true);
    expect(dispatches[2].snackbar.message).toEqual(
      'Got object of unknown typeid "unknown type"'
    );
  });

  it('updates snackbar on socket error', () => {
    const error = {
      type: 'TestError',
      message: 'This is a test',
    };
    const errorString = JSON.stringify(error);

    malcolmWorker.postMessage(`WebSocket Error: ${errorString}`);

    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(snackbar);
    expect(dispatches[0].snackbar.open).toEqual(true);
    expect(dispatches[0].snackbar.message).toEqual(
      `WebSocket Error: ${errorString}`
    );
  });

  it('updates snackbar and queues root block sub on reconnecting socket close', () => {
    malcolmWorker.postMessage('socket disconnected');
    expect(dispatches.length).toEqual(3);
    expect(dispatches[0].type).toEqual(snackbar);
    expect(dispatches[0].snackbar.open).toEqual(true);
    expect(dispatches[0].snackbar.message).toEqual(
      `WebSocket disconnected; attempting to reconnect...`
    );
    expect(dispatches[1].type).toEqual(MalcolmDisconnected);

    expect(dispatches[2].payload.typeid).toEqual('malcolm:core/Subscribe:1.0');
    expect(dispatches[2].payload.path).toEqual(['.', 'blocks', 'value']);
  });

  it('updates snackbar on malcolm error (no matching request)', () => {
    malcolmWorker.postMessage(
      JSON.stringify([
        {
          data: {
            typeid: 'malcolm:core/Error:1.0',
            id: -1,
            message: 'Error: this is a test!',
          },
          originalRequest: undefined,
        },
      ])
    );

    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(snackbar);
    expect(dispatches[0].snackbar.open).toEqual(true);
    expect(dispatches[0].snackbar.message).toEqual(
      'Error reported by malcolm server: "Error: this is a test!"'
    );
  });

  it('updates snackbar on malcolm error (with matching request)', () => {
    malcolmWorker.postMessage(
      JSON.stringify([
        {
          data: {
            typeid: 'malcolm:core/Error:1.0',
            id: 3,
            message: 'Error: this is a test!',
          },
          originalRequest: state.malcolm.messagesInFlight[3],
        },
      ])
    );

    expect(dispatches.length).toEqual(3);
    expect(dispatches[0].type).toEqual(snackbar);
    expect(dispatches[0].snackbar.open).toEqual(true);
    expect(dispatches[0].snackbar.message).toEqual(
      'Failed to write to attribute TestBlock,TestAttr on block TestBlock (Error: this is a test!)'
    );
    expect(dispatches[2].type).toEqual(MalcolmAttributeFlag);
    expect(dispatches[2].payload.path).toEqual(['TestBlock', 'TestAttr']);
    expect(dispatches[2].payload.flagType).toEqual('pending');
    expect(dispatches[1].type).toEqual(MalcolmError);
    expect(dispatches[1].payload.id).toEqual(3);
  });

  it('disptaches remove pending + stop tracking actions on return', () => {
    const pendingAction = {
      payload: {
        path: ['TestBlock', 'TestAttr'],
        flagType: 'pending',
        flagState: false,
      },
      type: 'malcolm:attributeflag',
    };

    malcolmWorker.postMessage(
      JSON.stringify([
        {
          data: {
            typeid: 'malcolm:core/Return:1.0',
            id: 3,
          },
          originalRequest: state.malcolm.messagesInFlight[3],
        },
      ])
    );

    expect(dispatches.length).toEqual(2);
    expect(dispatches[1]).toEqual(pendingAction);
    expect(dispatches[0].type).toEqual(MalcolmReturn);
    expect(dispatches[0].payload.id).toEqual(3);
  });

  it('does process an update for the root .blocks item', () => {
    malcolmWorker.postMessage(
      JSON.stringify([
        {
          data: {
            typeid: 'malcolm:core/Update:1.0',
            id: 4,
            value: ['block1', 'block2', 'block3'],
          },
          originalRequest: state.malcolm.messagesInFlight[4],
        },
      ])
    );

    expect(dispatches).toHaveLength(1);
    expect(dispatches[0].type).toEqual(MalcolmRootBlockMeta);
    expect(dispatches[0].payload.blocks).toEqual([
      'block1',
      'block2',
      'block3',
    ]);
  });

  it('resubscribes to existing blocks on .blocks update', () => {
    state.malcolm.blocks.block1 = { name: 'block1', loading: true };
    state.malcolm.blocks.block2 = { name: 'block2', loading: true };
    state.malcolm.blocks.block3 = { name: 'block3', loading: true };
    malcolmWorker.postMessage(
      JSON.stringify([
        {
          data: {
            typeid: 'malcolm:core/Update:1.0',
            id: 4,
            value: ['block1', 'block2', 'block3'],
          },
          originalRequest: state.malcolm.messagesInFlight[4],
        },
      ])
    );

    expect(dispatches).toHaveLength(4);
    expect(dispatches[0].type).toEqual(MalcolmRootBlockMeta);
    expect(dispatches[1].type).toEqual(MalcolmSend);
    expect(dispatches[1].payload).toEqual({
      typeid: 'malcolm:core/Subscribe:1.0',
      path: ['block1', 'meta'],
      delta: true,
    });
    expect(dispatches[2].type).toEqual(MalcolmSend);
    expect(dispatches[2].payload).toEqual({
      typeid: 'malcolm:core/Subscribe:1.0',
      path: ['block2', 'meta'],
      delta: true,
    });
    expect(dispatches[3].type).toEqual(MalcolmSend);
    expect(dispatches[3].payload).toEqual({
      typeid: 'malcolm:core/Subscribe:1.0',
      path: ['block3', 'meta'],
      delta: true,
    });
  });

  it('doesnt process an update for if request wasnt for .blocks', () => {
    malcolmWorker.postMessage(
      JSON.stringify([
        {
          data: {
            typeid: 'malcolm:core/Update:1.0',
            id: 1,
            value: ['block1', 'block2', 'block3'],
          },
          originalRequest: state.malcolm.messagesInFlight[1],
        },
      ])
    );

    expect(dispatches).toHaveLength(0);
  });
});
