/* eslint no-underscore-dangle: 0 */
import TableReducer from './table.reducer';
import {
  MalcolmTableUpdate,
  MalcolmLocalCopy,
  MalcolmTableFlag,
} from '../malcolm.types';
import { getDefaultFromType } from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';
import { harderAttribute } from '../../malcolmWidgets/table/table.stories';

const addRow = (table, columns, row) => {
  columns.forEach(label =>
    table[label].splice(
      row,
      0,
      getDefaultFromType(harderAttribute.state.meta.elements[label])
    )
  );
  return table;
};

describe('Table reducer', () => {
  let testState;
  const labels = Object.keys(harderAttribute.state.meta.elements);
  const copyAction = {
    type: MalcolmLocalCopy,
    payload: {
      path: ['block1', 'layout'],
    },
  };

  const expectedCopy = {
    value: JSON.parse(JSON.stringify(harderAttribute.state.value)),
    meta: JSON.parse(JSON.stringify(harderAttribute.state.meta)),
    labels: Object.keys(harderAttribute.state.meta.elements),
    flags: {
      rows: [],
      table: {
        fresh: true,
        timeStamp: JSON.parse(JSON.stringify(harderAttribute.state.timeStamp)),
      },
    },
  };

  const expectedValue = JSON.parse(JSON.stringify(harderAttribute.state.value));
  expectedValue.x[1] = 10;
  expectedValue.y[1] = 15;
  expectedValue.visible[1] = true;

  let state;

  beforeEach(() => {
    state = {
      blocks: {
        block1: {
          attributes: [JSON.parse(JSON.stringify(harderAttribute))],
        },
      },
    };
    testState = JSON.parse(JSON.stringify(state));
    testState.blocks.block1.attributes[0].localState = JSON.parse(
      JSON.stringify(expectedCopy)
    );
  });

  it('creates local state copy', () => {
    testState = {};
    testState = TableReducer(state, copyAction);

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
    testState = TableReducer(testState, action);

    expect(testState.blocks.block1.attributes[0].localState.value).toEqual(
      expectedValue
    );
  });

  it('flags existing row and table as changed on put', () => {
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
    testState = TableReducer(testState, action);

    expect(
      testState.blocks.block1.attributes[0].localState.flags.rows[1]
    ).toEqual({ _isChanged: true });
    expect(
      testState.blocks.block1.attributes[0].localState.flags.table.dirty
    ).toBeTruthy();
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
    testState = TableReducer(testState, action);
    let splicedValue = JSON.parse(JSON.stringify(harderAttribute.state.value));
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
    testState = TableReducer(testState, action);
    let splicedValue = JSON.parse(JSON.stringify(harderAttribute.state.value));
    splicedValue = addRow(splicedValue, labels, 1);
    expect(testState.blocks.block1.attributes[0].localState.value).toEqual(
      splicedValue
    );
  });

  it('updates existing local state copy', () => {
    testState.blocks.block1.attributes[0].localState.value = expectedValue;
    testState = TableReducer(state, copyAction);

    expect(testState.blocks.block1.attributes[0].localState.value).toEqual(
      harderAttribute.state.value
    );
  });

  it('set flag adds flags from payload to row state', () => {
    const payload = {
      path: ['block1', 'layout'],
      row: 1,
      flagType: 'testFlag',
      flags: { testFlag: true },
    };
    const flagAction = {
      type: MalcolmTableFlag,
      payload,
    };
    testState = TableReducer(testState, flagAction);

    expect(
      testState.blocks.block1.attributes[0].localState.flags.rows[1]
    ).toEqual({ testFlag: true });
  });

  it('set flag sets table as dirty if a dirty flag is set to true', () => {
    const payload = {
      path: ['block1', 'layout'],
      row: 1,
      flagType: 'dirty',
      flags: { _dirty: true, dirty: { testVal: true } },
    };
    const flagAction = {
      type: MalcolmTableFlag,
      payload,
    };
    testState = TableReducer(testState, flagAction);

    expect(
      testState.blocks.block1.attributes[0].localState.flags.rows[1]._dirty
    ).toBeTruthy();
    expect(
      testState.blocks.block1.attributes[0].localState.flags.table.dirty
    ).toBeTruthy();
  });

  it('set flag doesnt unset table as dirty if a dirty flag is set to false but some row has been altered', () => {
    const flagPayload = {
      path: ['block1', 'layout'],
      row: 1,
      flagType: 'dirty',
      flags: { _dirty: false, dirty: { testVal: false } },
    };
    const flagAction = {
      type: MalcolmTableFlag,
      payload: flagPayload,
    };

    const putPayload = {
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
    const putAction = {
      type: MalcolmTableUpdate,
      payload: putPayload,
    };

    testState = TableReducer(testState, putAction);
    testState = TableReducer(testState, flagAction);

    expect(
      testState.blocks.block1.attributes[0].localState.flags.rows[1]._dirty
    ).toBeFalsy();
    expect(
      testState.blocks.block1.attributes[0].localState.flags.table.dirty
    ).toBeTruthy();
  });
});
