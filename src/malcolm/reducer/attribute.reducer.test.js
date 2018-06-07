import AttributeReducer, { updateLayout } from './attribute.reducer';
import LayoutReducer from './layout.reducer';

jest.mock('./layout.reducer');

describe('attribute reducer', () => {
  let state = {};
  let payload = {};

  beforeEach(() => {
    LayoutReducer.processLayout.mockClear();
    state = {
      messagesInFlight: [
        {
          id: 1,
          path: ['block1', 'layout'],
        },
      ],
      blocks: {
        block1: {
          attributes: [
            {
              name: 'layout',
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
          mri: {},
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

  it('updates children for layout attribute', () => {
    state = AttributeReducer.updateAttribute(state, payload);

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

    const updatedState = AttributeReducer.updateAttribute(state, {});

    expect(updatedState).toBe(state);
  });

  it('updates with a layout property if widget:layout', () => {
    state = AttributeReducer.updateAttribute(state, payload);

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
    state = AttributeReducer.setMainAttribute(state, { attribute: 'health' });
    expect(state.mainAttribute).toEqual('health');
  });

  it('if the main attribute is layout then the layout reducer is called', () => {
    state = AttributeReducer.setMainAttribute(state, { attribute: 'layout' });
    expect(LayoutReducer.processLayout).toHaveBeenCalledTimes(1);
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
});
