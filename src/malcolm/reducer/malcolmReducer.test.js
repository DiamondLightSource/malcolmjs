import malcolmReducer, { setErrorState } from './malcolmReducer';
import {
  malcolmNewBlockAction,
  malcolmNavigationPath,
} from '../malcolmActionCreators';
import { registerSocketAndConnect } from '../actions/socket.actions';
import {
  MalcolmBlockMeta,
  MalcolmAttributeData,
  MalcolmAttributeFlag,
  MalcolmCleanBlocks,
  MalcolmDisconnected,
  MalcolmRootBlockMeta,
} from '../malcolm.types';
import { AlarmStates } from '../../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import NavigationReducer from './navigation.reducer';
import MethodReducer from './method.reducer';
import LayoutReducer, { LayoutReduxReducer } from './layout/layout.reducer';

jest.mock('./navigation.reducer');
jest.mock('./method.reducer');
jest.mock('./layout.reducer');

const buildAction = (type, id, path = ['.', 'blocks']) => ({
  type,
  payload: {
    id,
    typeid: 'malcolm:core/Subscribe:1.0',
    path,
  },
});

const testBlock = {
  testBlock: {
    attributes: [
      {
        calculated: {
          name: 'foo',
        },
        raw: {
          value: 1,
          alarm: { severity: 0 },
          meta: { tags: {}, writeable: false },
        },
      },
      {
        calculated: {
          name: 'bar',
        },
        raw: {
          value: 2,
          alarm: { severity: 2 },
          meta: { tags: {}, writeable: true },
        },
      },
    ],
  },
};

describe('malcolm reducer', () => {
  let state = {};

  beforeEach(() => {
    MethodReducer.mockClear();
    MethodReducer.mockImplementation(s => s);
    NavigationReducer.updateNavTypes.mockImplementation(s => s);
    NavigationReducer.updateNavigationPath.mockImplementation(s => s);
    LayoutReducer.processLayout.mockImplementation(() => ({
      blocks: [{ loading: true }],
    }));
    LayoutReduxReducer.mockImplementation(s => s);

    state = {
      messagesInFlight: {},
      blocks: {},
      navigation: {
        navigationLists: [],
        rootNav: {
          path: '',
          children: [],
        },
      },
      layoutState: {
        selectedBlocks: [],
      },
    };
  });

  it("doesn't affect state for non-malcolm messages", () => {
    const newState = malcolmReducer(state, buildAction('not malcolm:send'));

    expect(newState).toEqual(state);
  });

  it('passes through to the methodReducer', () => {
    malcolmReducer(state, buildAction('test'));
    expect(MethodReducer).toHaveBeenCalledTimes(1);
  });

  it('tracks malcolm messages in the state', () => {
    const newState = malcolmReducer(state, buildAction('malcolm:send', 1));

    expect(Object.keys(newState.messagesInFlight).length).toEqual(1);
    expect(newState.messagesInFlight[1].type).not.toBeDefined();
    expect(newState.messagesInFlight[1].typeid).toEqual(
      'malcolm:core/Subscribe:1.0'
    );
  });

  it('tracks multiple malcolm messages in the state', () => {
    state = malcolmReducer(state, buildAction('malcolm:send', 1));
    state = malcolmReducer(state, buildAction('malcolm:send', 2, ['PANDA']));

    expect(Object.keys(state.messagesInFlight).length).toEqual(2);
  });

  it('does not tracks multiple malcolm subscriptions with the same path', () => {
    state = malcolmReducer(state, buildAction('malcolm:send', 1));
    state = malcolmReducer(state, buildAction('malcolm:send', 2));
    expect(Object.keys(state.messagesInFlight).length).toEqual(1);
  });

  it('does track multiple malcolm non-subscription messages with the same path', () => {
    state = malcolmReducer(state, buildAction('malcolm:send', 1));
    const malcolmGetAction = buildAction('malcolm:send', 2);
    malcolmGetAction.payload.typeid = 'malcolm:core/Get:1.0';
    state = malcolmReducer(state, malcolmGetAction);
    expect(Object.keys(state.messagesInFlight).length).toEqual(2);
  });

  it('stops tracking a message once an error response is received', () => {
    state = {
      messagesInFlight: { 1: { id: 1 }, 123: { id: 123 } },
    };

    const newState = malcolmReducer(state, buildAction('malcolm:error', 1));

    expect(Object.keys(newState.messagesInFlight).length).toEqual(1);
    expect(newState.messagesInFlight[123].id).toEqual(123);
  });

  it('stops tracking a message once an return response is received', () => {
    state = {
      messagesInFlight: { 1: { id: 1 }, 123: { id: 123 } },
    };

    const newState = malcolmReducer(state, buildAction('malcolm:return', 1));

    expect(Object.keys(newState.messagesInFlight).length).toEqual(1);
    expect(newState.messagesInFlight[123].id).toEqual(123);
  });

  it('registers a new block when one is requested', () => {
    state = malcolmReducer(state, malcolmNewBlockAction('block1', true, false));

    expect(state.blocks.block1).toBeDefined();
    expect(state.blocks.block1.name).toEqual('block1');
    expect(state.blocks.block1.loading).toEqual(true);
    expect(state.parentBlock).toEqual('block1');
  });

  it('does not register a new block if it already exists', () => {
    // initialise the block
    state = malcolmReducer(state, malcolmNewBlockAction('block1', true, false));
    state.blocks.block1.children = ['block2'];

    // attempt to re-register the block
    state = malcolmReducer(state, malcolmNewBlockAction('block1', true, false));

    // check the state has not been changed
    expect(state.blocks.block1.children).toEqual(['block2']);
  });

  it('updates block if it exists', () => {
    state.blocks.block1 = {
      name: 'block1',
      loading: true,
    };

    state.messagesInFlight[1] = {
      id: 1,
      path: ['block1', 'meta'],
    };

    const action = {
      type: MalcolmBlockMeta,
      payload: {
        id: 1,
        delta: true,
        label: 'Block 1',
        fields: ['health', 'icon'],
      },
    };

    state = malcolmReducer(state, action);

    expect(state.blocks.block1.loading).toEqual(false);
    expect(state.blocks.block1.label).toEqual('Block 1');
    expect(state.blocks.block1.attributes[0].calculated).toEqual({
      name: 'health',
      loading: true,
      children: [],
    });
    expect(state.blocks.block1.attributes[1].calculated).toEqual({
      name: 'icon',
      loading: true,
      children: [],
    });
  });

  it('updates attribute data', () => {
    state.blocks.block1 = {
      name: 'block1',
      loading: true,
      attributes: [
        {
          calculated: {
            name: 'health',
            loading: true,
          },
        },
      ],
    };

    state.messagesInFlight[1] = {
      id: 1,
      path: ['block1', 'health'],
    };

    const action = {
      type: MalcolmAttributeData,
      payload: {
        id: 1,
        delta: true,
      },
    };

    state = malcolmReducer(state, action);

    expect(state.blocks.block1.attributes.length).toEqual(1);
    expect(state.blocks.block1.attributes[0].calculated.name).toEqual('health');
    expect(state.blocks.block1.attributes[0].calculated.path).toEqual([
      'block1',
      'health',
    ]);
    expect(state.blocks.block1.attributes[0].calculated.loading).toEqual(false);
  });

  it('set flag sets attribute pending', () => {
    state.blocks.block1 = {
      name: 'block1',
      loading: true,
      attributes: [
        {
          calculated: {
            name: 'health',
            loading: true,
            path: ['block1', 'health'],
            pending: false,
          },
        },
      ],
    };

    const action = {
      type: MalcolmAttributeFlag,
      payload: {
        id: 1,
        path: ['block1', 'health'],
        flagType: 'pending',
        flagState: true,
      },
    };

    state = malcolmReducer(state, action);

    expect(state.blocks.block1.attributes.length).toEqual(1);
    expect(state.blocks.block1.attributes[0].calculated.name).toEqual('health');
    expect(state.blocks.block1.attributes[0].calculated.pending).toEqual(true);
  });

  it('set flag does nothing if block does not exist', () => {
    const action = {
      type: MalcolmAttributeFlag,
      payload: {
        id: 1,
        path: ['block1', 'health'],
        flagType: 'redHerring',
        flagState: true,
      },
    };
    const newState = malcolmReducer(state, action);
    expect(newState).toEqual(state);
  });

  it('set flag does nothing if block has no attributes yet', () => {
    state.blocks.block1 = {
      name: 'block1',
      loading: true,
    };

    const action = {
      type: MalcolmAttributeFlag,
      payload: {
        id: 1,
        path: ['block1', 'health'],
        flagType: 'redHerring',
        flagState: true,
      },
    };
    const newState = malcolmReducer(state, action);
    expect(newState).toEqual(state);
  });

  it('set flag does nothing if block has attributes but not specified one', () => {
    state.blocks.block1 = {
      name: 'block1',
      loading: true,
      attributes: [
        {
          name: 'health',
          loading: true,
          path: ['block1', 'health'],
          pending: false,
        },
      ],
    };

    const action = {
      type: MalcolmAttributeFlag,
      payload: {
        id: 1,
        path: ['block1', 'layout'],
        flagType: 'redHerring',
        flagState: true,
      },
    };
    const newState = malcolmReducer(state, action);
    expect(newState).toEqual(state);
  });

  it('sets flag on block if path is single element array', () => {
    state.blocks.block1 = {
      name: 'block1',
      loading: true,
    };

    const action = {
      type: MalcolmAttributeFlag,
      payload: {
        id: 1,
        path: ['block1'],
        flagType: 'redHerring',
        flagState: true,
      },
    };

    state = malcolmReducer(state, action);

    expect(state.blocks.block1.redHerring).toBeDefined();
    expect(state.blocks.block1.redHerring).toEqual(true);
  });

  it('calls the navigation reducer when path update is received', () => {
    const action = malcolmNavigationPath(['PANDA', 'layout', 'PANDA:TTLIN1']);

    state = malcolmReducer(state, action);

    expect(NavigationReducer.updateNavigationPath).toHaveBeenCalledTimes(1);
  });

  it('does clean', () => {
    state.blocks = testBlock;
    const tidyBlock = {
      name: 'testBlock',
      loading: true,
      children: [],
    };
    const action = { type: MalcolmCleanBlocks };
    state = malcolmReducer(state, action);
    expect(state.blocks.testBlock).toEqual(tidyBlock);
  });

  it('does disconnect', () => {
    state.blocks = testBlock;
    const action = { type: MalcolmDisconnected };
    state = malcolmReducer(state, action);
    expect(state.blocks.testBlock.attributes[0].raw.meta.writeable).toEqual(
      false
    );
    expect(state.blocks.testBlock.attributes[1].raw.meta.writeable).toEqual(
      false
    );
    expect(state.blocks.testBlock.attributes[0].raw.alarm.severity).toEqual(
      AlarmStates.UNDEFINED_ALARM
    );
    expect(state.blocks.testBlock.attributes[1].raw.alarm.severity).toEqual(
      AlarmStates.UNDEFINED_ALARM
    );
  });

  it('updates the root block', () => {
    const blocks = ['block1', 'block2'];
    const action = {
      type: MalcolmRootBlockMeta,
      payload: {
        id: 1,
        blocks,
      },
    };

    state.blocks['.blocks'] = {
      children: [],
    };

    state = malcolmReducer(state, action);

    expect(state.blocks['.blocks'].children).toEqual(blocks);
  });

  it('updates socket on socket connect actions', () => {
    const dummyReconnectorSocket = {
      socket: {
        url: '',
        connect: jest.fn(),
        send: () => {},
        isConnected: false,
      },
    };
    const action = registerSocketAndConnect(
      dummyReconnectorSocket,
      'test:8008'
    );
    state = malcolmReducer(state, action);
    expect(dummyReconnectorSocket.socket.url).toEqual('test:8008');
    expect(dummyReconnectorSocket.socket.connect.mock.calls.length).toEqual(1);
    expect(dummyReconnectorSocket.socket.connect.mock.calls[0]).toEqual([
      dummyReconnectorSocket.socket,
    ]);
  });

  it('setErrorState returns state if message with id is not found', () => {
    let updatedState = setErrorState(state, 1234567, 1);
    expect(updatedState).toBe(state);

    state.messagesInFlight[1] = { id: 1 };
    updatedState = setErrorState(state, 1234567, 1);
    expect(updatedState).toBe(state);
  });

  it('setErrorState updates the error state on the matching attribute', () => {
    state.blocks = testBlock;
    state.messagesInFlight[1] = {
      id: 1,
      path: ['testBlock', 'foo'],
    };

    const updatedState = setErrorState(state, 1, 123);

    const attribute = updatedState.blocks.testBlock.attributes.find(
      a => a.calculated.name === 'foo'
    );
    expect(attribute.calculated.errorState).toEqual(123);
  });

  /* TODO: this needs to be fixed in the malcolm reducer
  it('setErrorState resets layout if its PUT returns an error', () => {
    jest.mock('./attribute.reducer');
    state.messagesInFlight.push({
      id: 1,
      path: ['testBlock', 'layout'],
    });

    setErrorState(state, 1, 123);
    expect(updateAttribute).toHaveBeenCalledWith(state, { id: 1, delta: true });
  });
  */
});
