import TableReducer from './table.reducer';
import { MalcolmTableUpdate, MalcolmLocalCopy } from '../malcolm.types';
import { harderAttribute } from '../../malcolmWidgets/table/table.stories';

describe('Table reducer', () => {
  const copyAction = {
    type: MalcolmLocalCopy,
    payload: {
      path: ['block1', 'layout'],
    },
  };

  const expectedCopy = {
    value: harderAttribute.value,
    labels: Object.keys(harderAttribute.meta.elements),
  };

  const expectedValue = harderAttribute.value;
  expectedValue.x[1] = 10;
  expectedValue.y[1] = 15;
  expectedValue.visible[1] = true;

  let state;

  beforeEach(() => {
    state = {
      blocks: {
        block1: {
          attributes: [harderAttribute],
        },
      },
    };
  });

  it('creates local state copy', () => {
    const testState = TableReducer(state, copyAction);

    expect(testState.blocks.block1.attributes[0]).toEqual({
      ...harderAttribute,
      localState: expectedCopy,
    });
  });

  it('puts row to local state', () => {
    const payload = {
      path: ['block1', 'layout'],
      value: {
        name: 'TTLIN2',
        mri: 'PANDA:TTLIN2',
        x: 10.0,
        y: 15.0,
        visible: true,
      },
      row: 1,
    };
    const action = {
      type: MalcolmTableUpdate,
      payload,
    };
    let testState = TableReducer(state, copyAction);
    testState = TableReducer(testState, action);

    expect(testState.blocks.block1.attributes[0].localState.value).toEqual(
      expectedValue
    );
  });

  it('updates existing local state copy', () => {
    state.localState = expectedCopy;
    state.value = expectedValue;

    const testState = TableReducer(state, copyAction);

    expect(testState.blocks.block1.attributes[0].localState.value).toEqual(
      expectedValue
    );
  });
});
