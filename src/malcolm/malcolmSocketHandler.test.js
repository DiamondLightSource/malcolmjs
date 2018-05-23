import configureMalcolmSocketHandlers from './malcolmSocketHandler';
import {
  MalcolmBlockMeta,
  MalcolmAttributeData,
  MalcolmSnackbar,
  MalcolmCleanBlocks,
} from './malcolm.types';

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
        {
          typeid: 'malcolm:core/Put:1.0',
          id: 3,
          path: ['TestBlock', 'TestAttr'],
          value: null,
        },
      ],
      blocks: {
        TestBlock: {
          attributes: [
            {
              name: 'TestAttr',
              value: 0,
              pending: true,
            },
          ],
        },
      },
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
    expect(dispatches.length).toEqual(2);
    expect(dispatches[0].type).toEqual(MalcolmCleanBlocks);
    expect(dispatches[1].type).toEqual(MalcolmSnackbar);
    expect(dispatches[1].snackbar.open).toEqual(true);
    expect(dispatches[1].snackbar.message).toEqual(`Connected to WebSocket`);
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

  it('updates snackbar on socket error', () => {
    const error = {
      type: 'TestError',
      message: 'This is a test',
    };
    const errorString = JSON.stringify(error);
    socketContainer.socket.onerror(error);
    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmSnackbar);
    expect(dispatches[0].snackbar.open).toEqual(true);
    expect(dispatches[0].snackbar.message).toEqual(
      `WebSocket Error: ${errorString}`
    );
  });

  it('updates snackbar on socket close', () => {
    socketContainer.socket.onclose();
    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmSnackbar);
    expect(dispatches[0].snackbar.open).toEqual(true);
    expect(dispatches[0].snackbar.message).toEqual(`WebSocket disconnected`);
  });

  it('updates snackbar on malcolm error (no matching request)', () => {
    const malcolmError = JSON.stringify({
      typeid: 'malcolm:core/Error:1.0',
      id: -1,
      message: 'Error: this is a test!',
    });
    socketContainer.socket.send(malcolmError);
    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmSnackbar);
    expect(dispatches[0].snackbar.open).toEqual(true);
    expect(dispatches[0].snackbar.message).toEqual(
      'Error reported by malcolm server: "Error: this is a test!"'
    );
  });

  it('updates snackbar on malcolm error (with matching request)', () => {
    const malcolmError = JSON.stringify({
      typeid: 'malcolm:core/Error:1.0',
      id: 3,
      message: 'Error: this is a test!',
    });
    socketContainer.socket.send(malcolmError);
    expect(dispatches.length).toEqual(1);
    expect(dispatches[0].type).toEqual(MalcolmSnackbar);
    expect(dispatches[0].snackbar.open).toEqual(true);
    expect(dispatches[0].snackbar.message).toEqual(
      'Error in attribute TestAttr for block TestBlock'
    );
  });

  it('removes pending on return', () => {
    const malcolmReturn = JSON.stringify({
      typeid: 'malcolm:core/Return:1.0',
      id: 3,
    });
    socketContainer.socket.send(malcolmReturn);
    expect(
      store.getState().malcolm.blocks.TestBlock.attributes[0].pending
    ).toEqual(false);
  });
  // TODO: add tests for DELTA handling
});
