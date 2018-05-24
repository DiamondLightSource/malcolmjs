import AttributeReducer from './attribute.reducer';

describe('attribute reducer', () => {
  it('updates children for layout attribute', () => {
    let state = {
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
    };

    const payload = {
      delta: true,
      id: 1,
      meta: {
        elements: {
          mri: {},
        },
      },
      value: {
        mri: ['block2', 'block3', 'block4'],
      },
    };

    state = AttributeReducer.updateAttribute(state, payload);

    expect(state.blocks.block1.attributes[0].children).toHaveLength(3);
    expect(state.blocks.block1.attributes[0].children).toEqual([
      'block2',
      'block3',
      'block4',
    ]);
  });

  it('returns state if it is not a delta', () => {
    const state = {
      property: 'test',
    };

    const updatedState = AttributeReducer.updateAttribute(state, {});

    expect(updatedState).toBe(state);
  });
});
