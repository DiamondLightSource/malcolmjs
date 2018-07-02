import TableReducer from './table.reducer';
import { MalcolmTableUpdate, MalcolmLocalCopy } from '../malcolm.types';
import { harderAttribute } from '../../malcolmWidgets/table/table.stories';

const addRow = (table, columns, row) => {
  columns.forEach(label => table[label].splice(row, 0, undefined));
  return table;
};

describe('Table reducer', () => {
  const labels = Object.keys(harderAttribute.meta.elements);
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

  const expectedValue = JSON.parse(JSON.stringify(harderAttribute.value));
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

  it('puts existing row to local state', () => {
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

  it('adds row to bottom of local state', () => {
    const payload = {
      path: ['block1', 'layout'],
      value: { insertRow: true },
      row: 4,
    };
    const action = {
      type: MalcolmTableUpdate,
      payload,
    };
    let testState = TableReducer(state, copyAction);
    testState = TableReducer(testState, action);
    let splicedValue = JSON.parse(JSON.stringify(harderAttribute.value));
    splicedValue = addRow(splicedValue, labels, 4);
    expect(testState.blocks.block1.attributes[0].localState.value).toEqual(
      splicedValue
    );
  });

  it('adds row in middle of local state', () => {
    const payload = {
      path: ['block1', 'layout'],
      value: { insertRow: true },
      row: 1,
    };
    const action = {
      type: MalcolmTableUpdate,
      payload,
    };
    let testState = TableReducer(state, copyAction);
    testState = TableReducer(testState, action);
    let splicedValue = JSON.parse(JSON.stringify(harderAttribute.value));
    splicedValue = addRow(splicedValue, labels, 1);
    expect(testState.blocks.block1.attributes[0].localState.value).toEqual(
      splicedValue
    );
  });

  it('updates existing local state copy', () => {
    state.localState = expectedCopy;
    state.value = expectedValue;

    const testState = TableReducer(state, copyAction);

    expect(testState.blocks.block1.attributes[0].localState.value).toEqual(
      harderAttribute.value
    );
  });
});
