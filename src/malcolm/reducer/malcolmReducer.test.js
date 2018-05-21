import malcolmReducer from './malcolmReducer';
import {
  malcolmNewBlockAction,
  malcolmNavigationPath,
} from '../malcolmActionCreators';
import {
  MalcolmBlockMeta,
  MalcolmAttributeData,
  MalcolmAttributePending,
} from '../malcolm.types';
import NavigationReducer from './navigation.reducer';

jest.mock('./navigation.reducer');

const buildAction = (type, id) => ({
  type,
  payload: {
    id,
    typeid: 'malcolm:core/Get:1.0',
  },
});

describe('malcolm reducer', () => {
  let state = {};

  beforeEach(() => {
    state = {
      messagesInFlight: [],
      blocks: {},
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
    expect(newState.messagesInFlight[0].typeid).toEqual('malcolm:core/Get:1.0');
  });

  it('tracks multiple malcolm messages in the state', () => {
    state = malcolmReducer(state, buildAction('malcolm:send'));
    state = malcolmReducer(state, buildAction('malcolm:send'));

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

  it('registers a new block when one is requested', () => {
    state = malcolmReducer(state, malcolmNewBlockAction('block1', true, false));

    expect(state.blocks.block1).toBeDefined();
    expect(state.blocks.block1.name).toEqual('block1');
    expect(state.blocks.block1.loading).toEqual(true);
    expect(state.parentBlock).toEqual('block1');
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
      { name: 'health', loading: true },
      { name: 'icon', loading: true },
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
      type: MalcolmAttributePending,
      payload: {
        id: 1,
        path: ['block1', 'health'],
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
});
