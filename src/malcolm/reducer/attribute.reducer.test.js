import AttributeReducer, {
  updateLayout,
  updateNavigation,
  portsAreDifferent,
} from './attribute.reducer';
import LayoutReducer from './layout.reducer';
import navigationReducer, {
  processNavigationLists,
} from './navigation.reducer';
import {
  MalcolmAttributeData,
  MalcolmMainAttributeUpdate,
} from '../malcolm.types';

jest.mock('./layout.reducer');
jest.mock('./navigation.reducer');

describe('attribute reducer', () => {
  let state = {};
  let payload = {};

  beforeEach(() => {
    LayoutReducer.processLayout.mockClear();
    processNavigationLists.mockClear();
    navigationReducer.updateNavTypes.mockImplementation(s => s);

    state = {
      messagesInFlight: {
        1: {
          id: 1,
          path: ['block1', 'layout'],
        },
      },
      blocks: {
        block1: {
          attributes: [
            {
              name: 'layout',
              meta: {
                tags: ['widget:flowgraph'],
              },
              children: [],
            },
          ],
        },
      },
      navigation: {
        navigationLists: [],
        rootNav: {},
      },
    };

    payload = {
      delta: true,
      id: 1,
      meta: {
        tags: ['widget:flowgraph'],
        elements: {
          name: {},
        },
      },
      value: {
        mri: ['block2', 'block3', 'block4'],
        name: ['block2', 'block3', 'block4'],
        visible: [true, true, false],
        x: [0, 1, 2],
        y: [3, 4, 5],
      },
    };
  });

  const buildAction = (type, args) => ({
    type,
    payload: args,
  });

  it('updates children for layout attribute', () => {
    state = AttributeReducer(state, buildAction(MalcolmAttributeData, payload));

    expect(state.blocks.block1.attributes[0].children).toHaveLength(3);
    expect(state.blocks.block1.attributes[0].children).toEqual([
      'block2',
      'block3',
      'block4',
    ]);
  });

  it('returns state if it is not a delta', () => {
    state = {
      property: 'test',
    };

    const updatedState = AttributeReducer(
      state,
      buildAction(MalcolmAttributeData, {})
    );

    expect(updatedState).toBe(state);
  });

  it('updates with a layout property if widget:layout', () => {
    state = AttributeReducer(state, buildAction(MalcolmAttributeData, payload));

    expect(state.blocks.block1.attributes[0].layout).not.toBeUndefined();
    expect(state.blocks.block1.attributes[0].layout.blocks).toHaveLength(3);
    expect(
      state.blocks.block1.attributes[0].layout.blocks[2].visible
    ).toBeFalsy();
    expect(
      state.blocks.block1.attributes[0].layout.blocks[2].position.x
    ).toEqual(2);
    expect(
      state.blocks.block1.attributes[0].layout.blocks[2].position.y
    ).toEqual(5);
  });

  it('setMainAttribute sets the main attribute on the state', () => {
    state = AttributeReducer(
      state,
      buildAction(MalcolmMainAttributeUpdate, { attribute: 'health' })
    );
    expect(state.mainAttribute).toEqual('health');
  });

  it('updateLayout updates the layout if the attribute is called layout', () => {
    updateLayout(state, state, 'block1', 'layout');
    expect(LayoutReducer.processLayout).toHaveBeenCalledTimes(1);
  });

  it('updateLayout returns early if the attribute is not found', () => {
    const updatedLayout = updateLayout(state, state, 'block1', 'non-existent');
    expect(updatedLayout).toBe(state.layout);
    expect(LayoutReducer.processLayout).toHaveBeenCalledTimes(0);
  });

  it('updateLayout updates the layout if the attribute is an icon', () => {
    state.blocks.block1.attributes.push({
      name: 'icon attr',
      meta: {
        tags: ['widget:icon'],
      },
    });

    updateLayout(state, state, 'block1', 'icon attr');
    expect(LayoutReducer.processLayout).toHaveBeenCalledTimes(1);
  });

  it('updateLayout updates the layout if the attribute is a port and the ports are different', () => {
    const updatedState = {
      ...state,
      blocks: {
        ...state.blocks,
        block1: {
          ...state.blocks.block1,
          attributes: [
            ...state.blocks.block1.attributes,
            {
              name: 'port 1',
              meta: {
                tags: ['inport:bool:ZERO'],
              },
            },
          ],
        },
      },
    };

    updateLayout(state, updatedState, 'block1', 'port 1');
    expect(LayoutReducer.processLayout).toHaveBeenCalledTimes(1);
  });

  it('updateLayout does not update the layout if the attribute is a port and the ports are the same', () => {
    const updatedState = {
      ...state,
      blocks: {
        ...state.blocks,
        block1: {
          ...state.blocks.block1,
          attributes: [
            ...state.blocks.block1.attributes,
            {
              name: 'port 1',
              meta: {
                tags: ['inport:bool:ZERO'],
              },
            },
          ],
        },
      },
    };

    updateLayout(updatedState, updatedState, 'block1', 'port 1');
    expect(LayoutReducer.processLayout).toHaveBeenCalledTimes(0);
  });

  it('updateNavigation only updates navigation if the attribute is in the path', () => {
    state.navigation.navigationLists = [{ path: 'PANDA' }, { path: 'layout' }];

    updateNavigation(state, 'layout');
    expect(processNavigationLists).toHaveBeenCalledTimes(1);

    processNavigationLists.mockClear();
    updateNavigation(state, 'not in path');
    expect(processNavigationLists).toHaveBeenCalledTimes(0);
  });

  it('portsAreDifferent returns true without metadata', () => {
    const oldAttribute = {};
    const newAttribute = {};
    expect(portsAreDifferent(undefined, newAttribute)).toBeTruthy();
    expect(portsAreDifferent(oldAttribute, newAttribute)).toBeTruthy();
  });

  it('portsAreDifferent returns true if labels are different', () => {
    const oldAttribute = { meta: { label: 'old' } };
    const newAttribute = { meta: { label: 'new' } };
    expect(portsAreDifferent(oldAttribute, newAttribute)).toBeTruthy();
  });

  it('portsAreDifferent returns false if there are no tags', () => {
    const oldAttribute = { meta: { label: 'label' } };
    const newAttribute = { meta: { label: 'label' } };
    expect(portsAreDifferent(oldAttribute, newAttribute)).toBeFalsy();
  });

  it('portsAreDifferent returns true if inports are different', () => {
    const oldAttribute = { meta: { label: 'label', tags: [] } };
    const newAttribute = { meta: { label: 'label', tags: ['inport:bool'] } };
    expect(portsAreDifferent(oldAttribute, newAttribute)).toBeTruthy();
  });

  it('portsAreDifferent returns true if outports are different', () => {
    const oldAttribute = { meta: { label: 'label', tags: [] } };
    const newAttribute = { meta: { label: 'label', tags: ['outport:bool'] } };
    expect(portsAreDifferent(oldAttribute, newAttribute)).toBeTruthy();
  });
});
