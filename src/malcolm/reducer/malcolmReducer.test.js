import malcolmReducer from './malcolmReducer';
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
  MalcolmRootBlockMeta,
} from '../malcolm.types';
import NavigationReducer from './navigation.reducer';
import MethodReducer from './method.reducer';

import LayoutReducer, { LayoutReduxReducer } from './layout/layout.reducer';
import {
  buildTestState,
  addMessageInFlight,
  addBlockArchive,
  addBlock,
  buildAttribute,
  buildBlockArchiveAttribute,
  buildMeta,
} from '../../testState.utilities';

jest.mock('./navigation.reducer');
jest.mock('./method.reducer');
jest.mock('./layout/layout.reducer');

const buildAction = (type, id, path = ['.', 'blocks']) => ({
  type,
  payload: {
    id,
    typeid: 'malcolm:core/Subscribe:1.0',
    path,
  },
});

const testBlockAttributes = [
  buildAttribute('foo', ['testBlock', 'foo'], 1, 0, buildMeta([], false)),
  buildAttribute('bar', ['testBlock', 'bar'], 2, 2, buildMeta([], true)),
];

describe('malcolm reducer', () => {
  let state = {};

  beforeEach(() => {
    MethodReducer.mockClear();
    MethodReducer.mockImplementation(s => s);
    NavigationReducer.updateNavTypes.mockImplementation(s => s);
    NavigationReducer.updateNavigationPath.mockImplementation(s => s);
    LayoutReducer.updateLayoutAndEngine.mockClear();
    LayoutReducer.processLayout.mockClear();
    LayoutReducer.processLayout.mockImplementation(() => ({
      blocks: [{ loading: true }],
    }));
    LayoutReducer.updateLayoutAndEngine.mockImplementation(() => ({
      layout: {
        blocks: [{ loading: true }],
      },
      layoutEngine: {
        diagramModel: {
          offsetX: 10,
          offsetY: 20,
          zoom: 30,
        },
      },
    }));

    LayoutReduxReducer.mockImplementation(s => s);

    state = buildTestState().malcolm;
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
    state.blocks.block1.children = { block2: {} };

    // attempt to re-register the block
    state = malcolmReducer(state, malcolmNewBlockAction('block1', true, false));

    // check the state has not been changed
    expect(state.blocks.block1.children).toEqual({ block2: {} });
  });

  const buildEmptyAttributeAndFireBlockMeta = () => {
    addBlockArchive('block1', [], state);
    addMessageInFlight(1, ['block1', 'meta'], state);

    const action = {
      type: MalcolmBlockMeta,
      payload: {
        id: 1,
        delta: true,
        label: 'Block 1',
        fields: ['health', 'icon'],
      },
    };

    return malcolmReducer(state, action);
  };

  it('updates block if it exists', () => {
    addBlock('block1', [], state);

    state = buildEmptyAttributeAndFireBlockMeta();

    expect(state.blocks.block1.loading).toEqual(false);
    expect(state.blocks.block1.label).toEqual('Block 1');
    expect(state.blocks.block1.attributes[0].calculated).toEqual({
      name: 'health',
      loading: true,
      children: {},
      alarms: {},
    });
    expect(state.blocks.block1.attributes[1].calculated).toEqual({
      name: 'icon',
      loading: true,
      children: {},
      alarms: {},
    });
  });

  it('marks attribute as orphaned but doesnt remove from attributes if receives a delta to fields and it is missing', () => {
    addBlock(
      'block1',
      [buildAttribute('health'), buildAttribute('BruceWayne')],
      state
    );
    state = buildEmptyAttributeAndFireBlockMeta();

    expect(state.blocks.block1.loading).toEqual(false);
    expect(state.blocks.block1.label).toEqual('Block 1');
    expect(state.blocks.block1.attributes[0].calculated.name).toEqual('health');
    expect(state.blocks.block1.attributes[1].calculated.name).toEqual('icon');
    expect(state.blocks.block1.attributes[2].calculated.name).toEqual(
      'BruceWayne'
    );
    expect(state.blocks.block1.children).toEqual({
      health: { label: 'health' },
      icon: { label: 'icon' },
    });
    expect(state.blocks.block1.orphans).toEqual(['BruceWayne']);
  });

  it('updates attribute data and pushes to archive', () => {
    addBlock('block1', [buildAttribute('health')], state);
    addBlockArchive('block1', [buildBlockArchiveAttribute('health', 3)], state);
    addMessageInFlight(1, ['block1', 'health'], state);

    const action = {
      type: MalcolmAttributeData,
      payload: {
        id: 1,
        delta: true,
        raw: {
          timeStamp: {
            secondsPastEpoch: 123456789,
            nanoseconds: 1230000,
          },
        },
      },
    };

    state = malcolmReducer(state, action);

    expect(state.blockArchive.block1.attributes[0].value.counter).toEqual(1);
    expect(state.blockArchive.block1.attributes[0].timeStamp.counter).toEqual(
      2
    );
    expect(state.blockArchive.block1.attributes[0].connectTime).toEqual(
      123456789.00123
    );
  });

  it('set flag sets attribute pending', () => {
    addBlock('block1', [buildAttribute('health', ['block1', 'health'])], state);

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
    addBlock('block1', undefined, state);

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
    addBlock('block1', [buildAttribute('health', ['block1', 'health'])], state);

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
    addBlock('block1', undefined, state);

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
    expect(LayoutReducer.updateLayoutAndEngine).toHaveBeenCalledTimes(1);
  });

  it('does clean', () => {
    addBlock('testBlock', testBlockAttributes, state);

    const tidyBlock = {
      ...state.blocks.testBlock,
      loading: true,
    };
    const action = { type: MalcolmCleanBlocks };
    state = malcolmReducer(state, action);
    expect(state.blocks.testBlock).toEqual(tidyBlock);
  });

  it('updates the root block', () => {
    const blocks = {
      mri: ['block1', 'block2'],
      label: ['1st block', '2nd block'],
    };
    const blockLabelMap = {
      block1: { label: '1st block', mri: 'block1' },
      block2: { label: '2nd block', mri: 'block2' },
    };
    const action = {
      type: MalcolmRootBlockMeta,
      payload: {
        id: 1,
        blocks,
      },
    };

    addBlock('.blocks', undefined, state);

    state = malcolmReducer(state, action);

    expect(state.blocks['.blocks'].children).toEqual(blockLabelMap);
  });

  it('updates socket on socket connect actions', () => {
    const worker = {
      postMessage: jest.fn(),
    };

    const action = registerSocketAndConnect(worker, 'test:8008');
    state = malcolmReducer(state, action);
    expect(worker.postMessage).toBeCalledWith('connect::test:8008');
  });
});
