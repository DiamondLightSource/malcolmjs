import malcolmReducer, { setErrorState } from './malcolmReducer';
import {
  malcolmNewBlockAction,
  malcolmNavigationPath,
} from '../malcolmActionCreators';
import {
  MalcolmBlockMeta,
  MalcolmAttributeData,
  MalcolmAttributeFlag,
  MalcolmSnackbar,
  MalcolmCleanBlocks,
  MalcolmDisconnected,
  MalcolmRootBlockMeta,
} from '../malcolm.types';
import { AlarmStates } from '../../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import NavigationReducer from './navigation.reducer';

jest.mock('./navigation.reducer');

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
        name: 'foo',
        value: 1,
        alarm: { severity: 0 },
        meta: { tags: {}, writeable: false },
      },
      {
        name: 'bar',
        value: 2,
        alarm: { severity: 2 },
        meta: { tags: {}, writeable: true },
      },
    ],
  },
};

describe('malcolm reducer', () => {
  let state = {};

  beforeEach(() => {
    state = {
      messagesInFlight: [],
      blocks: {},
      navigation: {
        navigationLists: [],
        rootNav: {
          path: '',
          children: [],
        },
      },
    };
  });

  it("doesn't affect state for non-malcolm messages", () => {
    const newState = malcolmReducer(state, buildAction('not malcolm:send'));

    expect(newState).toEqual(state);
  });

  it('tracks malcolm messages in the state', () => {
    const newState = malcolmReducer(state, buildAction('malcolm:send'));

    expect(newState.messagesInFlight.length).toEqual(1);
    expect(newState.messagesInFlight[0].type).not.toBeDefined();
    expect(newState.messagesInFlight[0].typeid).toEqual(
      'malcolm:core/Subscribe:1.0'
    );
  });

  it('tracks multiple malcolm messages in the state', () => {
    state = malcolmReducer(state, buildAction('malcolm:send', 1));
    state = malcolmReducer(state, buildAction('malcolm:send', 2, ['PANDA']));

    expect(state.messagesInFlight.length).toEqual(2);
  });

  it('does not tracks multiple malcolm subscriptions with the same path', () => {
    state = malcolmReducer(state, buildAction('malcolm:send', 1));
    state = malcolmReducer(state, buildAction('malcolm:send', 2));
    expect(state.messagesInFlight.length).toEqual(1);
  });

  it('does track multiple malcolm non-subscription messages with the same path', () => {
    state = malcolmReducer(state, buildAction('malcolm:send', 1));
    const malcolmGetAction = buildAction('malcolm:send', 2);
    malcolmGetAction.payload.typeid = 'malcolm:core/Get:1.0';
    state = malcolmReducer(state, malcolmGetAction);
    expect(state.messagesInFlight.length).toEqual(2);
  });

  it('stops tracking a message once an error response is received', () => {
    state = {
      messagesInFlight: [{ id: 1 }, { id: 123 }],
    };

    const newState = malcolmReducer(state, buildAction('malcolm:error', 1));

    expect(newState.messagesInFlight.length).toEqual(1);
    expect(newState.messagesInFlight[0].id).toEqual(123);
  });

  it('stops tracking a message once an return response is received', () => {
    state = {
      messagesInFlight: [{ id: 1 }, { id: 123 }],
    };

    const newState = malcolmReducer(state, buildAction('malcolm:return', 1));

    expect(newState.messagesInFlight.length).toEqual(1);
    expect(newState.messagesInFlight[0].id).toEqual(123);
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

    state.messagesInFlight.push({
      id: 1,
      path: ['block1', 'meta'],
    });

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
    expect(state.blocks.block1.attributes).toEqual([
      { name: 'health', loading: true, children: [] },
      { name: 'icon', loading: true, children: [] },
    ]);
  });

  it('updates attribute data', () => {
    state.blocks.block1 = {
      name: 'block1',
      loading: true,
      attributes: [
        {
          name: 'health',
          loading: true,
        },
      ],
    };

    state.messagesInFlight.push({
      id: 1,
      path: ['block1', 'health'],
    });

    const action = {
      type: MalcolmAttributeData,
      payload: {
        id: 1,
        delta: true,
      },
    };

    state = malcolmReducer(state, action);

    expect(state.blocks.block1.attributes.length).toEqual(1);
    expect(state.blocks.block1.attributes[0].name).toEqual('health');
    expect(state.blocks.block1.attributes[0].path).toEqual([
      'block1',
      'health',
    ]);
    expect(state.blocks.block1.attributes[0].loading).toEqual(false);
  });

  it('sets attribute pending', () => {
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
        path: ['block1', 'health'],
        flagType: 'pending',
        flagState: true,
      },
    };

    state = malcolmReducer(state, action);

    expect(state.blocks.block1.attributes.length).toEqual(1);
    expect(state.blocks.block1.attributes[0].name).toEqual('health');
    expect(state.blocks.block1.attributes[0].pending).toEqual(true);
  });

  it('calls the navigation reducer when path update is received', () => {
    const action = malcolmNavigationPath(['PANDA', 'layout', 'PANDA:TTLIN1']);

    state = malcolmReducer(state, action);

    expect(NavigationReducer.updateNavigationPath).toHaveBeenCalledTimes(1);
  });

  it('updates snackbar', () => {
    state.snackbar = {
      open: false,
      message: '',
    };

    const action = {
      type: MalcolmSnackbar,
      snackbar: {
        open: true,
        message: 'This is a test!',
      },
    };

    state = malcolmReducer(state, action);

    expect(state.snackbar.open).toEqual(true);
    expect(state.snackbar.message).toEqual('This is a test!');
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
    expect(state.blocks.testBlock.attributes[0].meta.writeable).toEqual(false);
    expect(state.blocks.testBlock.attributes[1].meta.writeable).toEqual(false);
    expect(state.blocks.testBlock.attributes[0].alarm.severity).toEqual(
      AlarmStates.UNDEFINED_ALARM
    );
    expect(state.blocks.testBlock.attributes[1].alarm.severity).toEqual(
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

  it('setErrorState returns state if message with id is not found', () => {
    let updatedState = setErrorState(state, 1234567, 1);
    expect(updatedState).toBe(state);

    state.messagesInFlight.push({ id: 1 });
    updatedState = setErrorState(state, 1234567, 1);
    expect(updatedState).toBe(state);
  });

  it('setErrorState updates the error state on the matching attribute', () => {
    state.blocks = testBlock;
    state.messagesInFlight.push({
      id: 1,
      path: ['testBlock', 'foo'],
    });

    const updatedState = setErrorState(state, 1, 123);

    const attribute = updatedState.blocks.testBlock.attributes.find(
      a => a.name === 'foo'
    );
    expect(attribute.errorState).toEqual(123);
  });
});
