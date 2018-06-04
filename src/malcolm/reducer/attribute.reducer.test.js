import AttributeReducer from './attribute.reducer';

describe('attribute reducer', () => {
  let state = {};
  let payload = {};

  beforeEach(() => {
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
      navigation: [],
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
});
