/* eslint no-underscore-dangle: 0 */
import TableReducer, { shouldClearDirtyFlag } from './table.reducer';
import {
  MalcolmTableUpdate,
  MalcolmLocalCopy,
  MalcolmTableFlag,
} from '../malcolm.types';
import { getDefaultFromType } from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';
import {
  harderAttribute,
  expectedCopy,
} from '../../malcolmWidgets/table/table.stories';

const addRow = (table, columns, row) => {
  const defaultRow = {};
  columns.forEach(label => {
    defaultRow[label] = getDefaultFromType(
      harderAttribute.raw.meta.elements[label]
    );
  });
  table.splice(row, 0, defaultRow);
  return table;
};

const rowValues = harderAttribute.raw.value[
  Object.keys(harderAttribute.raw.meta.elements)[0]
].map((val, row) => {
  const rowData = {};
  Object.keys(harderAttribute.raw.meta.elements).forEach(label => {
    rowData[label] = harderAttribute.raw.value[label][row];
  });
  return rowData;
});

describe('Table reducer', () => {
  let testState;
  const labels = Object.keys(harderAttribute.raw.meta.elements);
  const copyAction = {
    type: MalcolmLocalCopy,
    payload: {
      path: ['block1', 'layout'],
    },
  };

  const expectedValue = JSON.parse(JSON.stringify(rowValues));
  expectedValue[0].outa1 = false;
  expectedValue[0].outf2 = true;
  expectedValue[0].repeats = 10;

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
      calculated: {
        ...harderAttribute.calculated,
        alarms: {
          dirty: null,
        },
      },
      localState: expectedCopy,
    });
  });

  it('puts existing row to local state', () => {
    const payload = {
      path: ['block1', 'layout'],
      value: {
        outa1: false,
        outa2: false,
        outb1: false,
        outb2: false,
        outc1: false,
        outc2: false,
        outd1: false,
        outd2: false,
        oute1: false,
        oute2: false,
        outf1: false,
        outf2: true,
        position: 0,
        repeats: 10,
        time1: 0,
        time2: 0,
        trigger: 'POSC>=POSITION',
      },
      row: 0,
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
    let splicedValue = harderAttribute.raw.value[
      Object.keys(harderAttribute.raw.meta.elements)[0]
    ].map((val, row) => {
      const rowData = {};
      Object.keys(harderAttribute.raw.meta.elements).forEach(label => {
        rowData[label] = harderAttribute.raw.value[label][row];
      });
      return rowData;
    });
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
    let splicedValue = harderAttribute.raw.value[
      Object.keys(harderAttribute.raw.meta.elements)[0]
    ].map((val, row) => {
      const rowData = {};
      Object.keys(harderAttribute.raw.meta.elements).forEach(label => {
        rowData[label] = harderAttribute.raw.value[label][row];
      });
      return rowData;
    });
    splicedValue = addRow(splicedValue, labels, 1);
    expect(testState.blocks.block1.attributes[0].localState.value).toEqual(
      splicedValue
    );
    expect(
      testState.blocks.block1.attributes[0].localState.flags.rows
        .slice(1)
        .map(row => row._isChanged)
    ).toEqual(
      testState.blocks.block1.attributes[0].localState.flags.rows
        .slice(1)
        .map(() => true)
    );
  });

  it('updates existing local state copy', () => {
    testState.blocks.block1.attributes[0].localState.value = expectedValue;
    testState = TableReducer(state, copyAction);

    expect(testState.blocks.block1.attributes[0].localState.value).toEqual(
      harderAttribute.raw.value[
        Object.keys(harderAttribute.raw.meta.elements)[0]
      ].map((val, row) => {
        const rowData = {};
        Object.keys(harderAttribute.raw.meta.elements).forEach(label => {
          rowData[label] = harderAttribute.raw.value[label][row];
        });
        return rowData;
      })
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

  it('set flag sets row selected on table', () => {
    const payload = {
      path: ['block1', 'layout'],
      row: 1,
      flagType: 'selected',
      flags: { selected: true },
    };
    const flagAction = {
      type: MalcolmTableFlag,
      payload,
    };
    testState = TableReducer(testState, flagAction);

    expect(
      testState.blocks.block1.attributes[0].localState.flags.rows[1]
    ).toEqual({ selected: true });
    expect(
      testState.blocks.block1.attributes[0].localState.flags.table.selectedRow
    ).toEqual(1);
  });

  it('set flag deselects all other rows', () => {
    testState.blocks.block1.attributes[0].localState.flags.table.selectedRow = 1;
    testState.blocks.block1.attributes[0].localState.flags.rows[1] = {
      selected: true,
    };
    const payload = {
      path: ['block1', 'layout'],
      row: 2,
      flagType: 'selected',
      flags: { selected: true },
    };
    const flagAction = {
      type: MalcolmTableFlag,
      payload,
    };
    testState = TableReducer(testState, flagAction);

    expect(
      testState.blocks.block1.attributes[0].localState.flags.rows[1]
    ).toEqual({ selected: false });
    expect(
      testState.blocks.block1.attributes[0].localState.flags.rows[2]
    ).toEqual({ selected: true });
    expect(
      testState.blocks.block1.attributes[0].localState.flags.table.selectedRow
    ).toEqual(2);
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

  it('shouldClearDirty does nothing if dirty flag not true', () => {
    let testAttr = shouldClearDirtyFlag(testState.blocks.block1.attributes[0]);
    expect(testAttr.localState.flags.table.dirty).toBeFalsy();
    testState.blocks.block1.attributes[0].raw.value.repeats[0] += 1;
    testAttr = shouldClearDirtyFlag(testState.blocks.block1.attributes[0]);
    expect(testAttr.localState.flags.table.dirty).toBeFalsy();
  });

  it('shouldClearDirty clears dirty if all rows match', () => {
    testState.blocks.block1.attributes[0].localState.flags.table.dirty = true;
    const testAttr = shouldClearDirtyFlag(
      testState.blocks.block1.attributes[0]
    );
    expect(testAttr.localState.flags.table.dirty).toBeFalsy();
  });

  it('shouldClearDirty doesnt clear dirty if not all rows match', () => {
    testState.blocks.block1.attributes[0].localState.flags.table.dirty = true;
    testState.blocks.block1.attributes[0].raw.value.repeats[0] += 1;
    const testAttr = shouldClearDirtyFlag(
      testState.blocks.block1.attributes[0]
    );
    expect(testAttr.localState.flags.table.dirty).toBeTruthy();
  });
});
