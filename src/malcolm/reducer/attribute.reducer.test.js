import AttributeReducer, {
  updateLayout,
  updateNavigation,
  portsAreDifferent,
  pushToArchive,
  tickArchive,
} from './attribute.reducer';
import LayoutReducer from './layout/layout.reducer';
import navigationReducer, {
  processNavigationLists,
} from './navigation.reducer';
import {
  MalcolmAttributeData,
  MalcolmMainAttributeUpdate,
  MalcolmRevert,
} from '../malcolm.types';
import { malcolmTypes } from '../../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';
import { ARCHIVE_REFRESH_INTERVAL } from './malcolmReducer';
import {
  buildTestState,
  addMessageInFlight,
  addBlock,
  buildAttribute,
  addBlockArchive,
  buildBlockArchiveAttribute,
  buildMeta,
  addSimpleLocalState,
  addTableLocalState,
  setAttributeFlag,
  setTableFlag,
} from '../../testState.utilities';
import blockUtils from '../blockUtils';
import { shouldClearDirtyFlag } from './table.reducer';

jest.mock('./layout/layout.reducer');
jest.mock('./navigation.reducer');
jest.mock('./table.reducer');

const sourcePort = 'sourcePort';
const sinkPort = 'sinkPort';

const mockStartTime = -957312000000;
const mockNow = -806952600000;
const mockDataTime = -14159025000;

const vanillaDate = Date;

function injectMockDate(mockDateValue) {
  global.Date = class extends vanillaDate {
    constructor(setDate) {
      if (setDate === undefined) {
        super(mockDateValue);
      } else {
        super(setDate);
      }
    }
  };
}

function restoreDate() {
  global.Date = vanillaDate;
}

describe('attribute reducer', () => {
  let state = {};
  let payload = {};
  let payload2 = {};
  let payload3 = {};

  beforeEach(() => {
    injectMockDate(mockNow);
    shouldClearDirtyFlag.mockImplementation(attribute => attribute);

    LayoutReducer.processLayout.mockClear();
    LayoutReducer.updateLayoutAndEngine.mockClear();
    processNavigationLists.mockClear();
    navigationReducer.updateNavTypes.mockImplementation(s => s);
    LayoutReducer.processLayout.mockImplementation(() => ({
      blocks: [{ loading: true }],
    }));

    LayoutReducer.updateLayoutAndEngine.mockImplementation(() => ({
      layout: {
        blocks: [{ loading: true }],
      },
      layoutEngine: {
        diagramModel: {
          offsetX: 10,
          offsetY: 20,
          zoom: 30,
        },
      },
    }));

    afterEach(() => {
      restoreDate();
    });

    state = buildTestState().malcolm;
    addMessageInFlight(1, ['block1', 'layout'], state);
    addMessageInFlight(2, ['block1', 'testInput'], state);
    addMessageInFlight(3, ['block1', 'table'], state);
    addBlock(
      'block1',
      [
        buildAttribute(
          'layout',
          ['block1', 'layout'],
          undefined,
          0,
          buildMeta(['widget:flowgraph'])
        ),
        buildAttribute(
          'testInput',
          ['block1', 'testInput'],
          'testing',
          0,
          buildMeta(['widget:textinput'])
        ),
        buildAttribute(
          'table',
          ['block1', 'table'],
          undefined,
          0,
          buildMeta(['widget:table'], true, '', malcolmTypes.table)
        ),
      ],
      state
    );
    addBlockArchive('block1', [buildBlockArchiveAttribute('layout', 5)], state);

    payload = {
      delta: true,
      id: 1,
      raw: {
        meta: {
          tags: ['widget:flowgraph'],
          elements: {
            mri: {},
            name: {},
          },
        },
        value: {
          mri: ['test:block2', 'test:block3', 'test:block4'],
          name: ['block2', 'block3', 'block4'],
          visible: [true, true, false],
          x: [0, 1, 2],
          y: [3, 4, 5],
        },
        timeStamp: {
          secondsPastEpoch: 123456789,
          nanoseconds: 10111213,
        },
      },
    };
    payload2 = {
      delta: true,
      id: 2,
      raw: { meta: { tags: ['widget:textinput'] }, value: 'testing#123' },
    };
    payload3 = {
      id: 3,
      delta: true,
      raw: {
        meta: {
          typeid: malcolmTypes.table,
          tags: ['widget:table'],
          elements: {
            mri: {},
            name: {},
            visible: {},
            x: {},
            y: {},
          },
        },
        value: JSON.parse(JSON.stringify(payload.raw.value)),
      },
    };
  });

  const buildAction = (type, args) => ({
    type,
    payload: args,
  });

  it('updates children for layout attribute', () => {
    state = AttributeReducer(state, buildAction(MalcolmAttributeData, payload));

    expect(state.blocks.block1.attributes[0].calculated.children).toHaveLength(
      3
    );
    expect(state.blocks.block1.attributes[0].calculated.children).toEqual([
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

  it('sets flags, clears error and copies attribute on revert action', () => {
    state.blocks.block1.attributes[0].raw.value = payload.raw.value;
    state.blocks.block1.attributes[0].calculated.errorState = true;
    state.blocks.block1.attributes[0].calculated.dirty = true;
    state.blocks.block1.attributes[0].calculated.errorMessage = 'test error!';
    const updatedState = AttributeReducer(
      state,
      buildAction(MalcolmRevert, { path: ['block1', 'layout'] })
    );

    expect(updatedState.blocks.block1.attributes[0]).not.toBe(
      state.blocks.block1.attributes[0]
    );
    expect(
      updatedState.blocks.block1.attributes[0].calculated.errorState
    ).toBeFalsy();
    expect(
      updatedState.blocks.block1.attributes[0].calculated.errorMessage
    ).not.toBeDefined();
    expect(
      updatedState.blocks.block1.attributes[0].calculated.forceUpdate
    ).toBeTruthy();
  });

  it('updates with a layout property if widget:layout', () => {
    state = AttributeReducer(state, buildAction(MalcolmAttributeData, payload));

    expect(
      state.blocks.block1.attributes[0].calculated.layout
    ).not.toBeUndefined();
    expect(
      state.blocks.block1.attributes[0].calculated.layout.blocks
    ).toHaveLength(3);
    expect(
      state.blocks.block1.attributes[0].calculated.layout.blocks[2].visible
    ).toBeFalsy();
    expect(
      state.blocks.block1.attributes[0].calculated.layout.blocks[2].position.x
    ).toEqual(2);
    expect(
      state.blocks.block1.attributes[0].calculated.layout.blocks[2].position.y
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
      calculated: {
        name: 'icon attr',
      },
      raw: {
        meta: {
          tags: ['widget:icon'],
        },
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
              calculated: {
                name: 'port 1',
              },
              raw: {
                meta: {
                  tags: [`${sinkPort}:bool:ZERO`],
                },
              },
            },
          ],
        },
      },
    };

    updateLayout(state, updatedState, 'block1', 'port 1');
    expect(LayoutReducer.processLayout).toHaveBeenCalledTimes(2);
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
              calculated: {
                name: 'port 1',
              },
              raw: {
                meta: {
                  tags: [`${sinkPort}:bool:ZERO`],
                },
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
    const oldAttribute = { raw: { meta: { label: 'old' } } };
    const newAttribute = { raw: { meta: { label: 'new' } } };
    expect(portsAreDifferent(oldAttribute, newAttribute)).toBeTruthy();
  });

  it('portsAreDifferent returns false if there are no tags', () => {
    const oldAttribute = { raw: { meta: { label: 'label' } } };
    const newAttribute = { raw: { meta: { label: 'label' } } };
    expect(portsAreDifferent(oldAttribute, newAttribute)).toBeFalsy();
  });

  it('portsAreDifferent returns true if source ports are different', () => {
    const oldAttribute = { raw: { meta: { label: 'label', tags: [] } } };
    const newAttribute = {
      raw: { meta: { label: 'label', tags: [`${sourcePort}:bool`] } },
    };
    expect(portsAreDifferent(oldAttribute, newAttribute)).toBeTruthy();
  });

  it('portsAreDifferent returns true if sink ports are different', () => {
    const oldAttribute = { raw: { meta: { label: 'label', tags: [] } } };
    const newAttribute = {
      raw: { meta: { label: 'label', tags: [`${sinkPort}:bool`] } },
    };
    expect(portsAreDifferent(oldAttribute, newAttribute)).toBeTruthy();
  });

  it('pushToArchive sets connectTime on first push', () => {
    const testArchive = pushToArchive(state.blockArchive.block1.attributes[0], {
      raw: { timeStamp: { secondsPastEpoch: 123456789, nanoseconds: 1230000 } },
    });
    expect(testArchive.connectTime).toBeCloseTo(123456789.00123, 6);
    expect(testArchive.timeSinceConnect.counter).toEqual(1);
    expect(testArchive.timeSinceConnect[0]).toEqual(0);
  });

  it('pushToArchive pushes value & timestamp to archive', () => {
    state.blockArchive.block1.attributes[0].connectTime = 100000000;
    const testArchive = pushToArchive(state.blockArchive.block1.attributes[0], {
      raw: {
        timeStamp: { secondsPastEpoch: 123456789, nanoseconds: 1230000 },
        value: 'testing123',
      },
    });
    expect(testArchive.timeSinceConnect.counter).toEqual(1);
    expect(testArchive.timeSinceConnect[0]).toEqual(23456789.00123);
    expect(testArchive.value.counter).toEqual(1);
    expect(testArchive.value[0]).toEqual('testing123');
    expect(testArchive.plotTime).toBeCloseTo(23456789.00123, 6);
  });

  it('pushToArchive sets typeid if defined in payload', () => {
    state.blockArchive.block1.attributes[0].connectTime = 100000000;
    const testArchive = pushToArchive(state.blockArchive.block1.attributes[0], {
      raw: {
        timeStamp: { secondsPastEpoch: 123456789, nanoseconds: 1230000 },
        meta: { typeid: 'test' },
      },
    });
    expect(testArchive.connectTime).toEqual(100000000);
    expect(testArchive.meta.typeid).toEqual('test');
    expect(testArchive.timeSinceConnect.counter).toEqual(1);
    expect(testArchive.timeSinceConnect[0]).toBeCloseTo(23456789.00123, 6);
  });

  it('pushToArchive sets plotValue if attribute is bool', () => {
    state.blockArchive.block1.attributes[0].connectTime = 100000000;
    state.blockArchive.block1.attributes[0].meta.typeid = malcolmTypes.bool;
    const testArchive1 = pushToArchive(
      state.blockArchive.block1.attributes[0],
      {
        raw: {
          timeStamp: { secondsPastEpoch: 123456789, nanoseconds: 1230000 },
          value: true,
        },
      }
    );
    expect(testArchive1.timeSinceConnect.counter).toEqual(1);
    expect(testArchive1.timeSinceConnect[0]).toBeCloseTo(23456789.00123, 6);
    expect(testArchive1.value.counter).toEqual(1);
    expect(testArchive1.value[0]).toEqual(true);
    expect(testArchive1.plotValue.counter).toEqual(2);
    expect(testArchive1.plotValue[0]).toEqual(1);
    expect(testArchive1.plotValue[1]).toEqual(1);
    const testArchive2 = pushToArchive(
      state.blockArchive.block1.attributes[0],
      {
        raw: {
          timeStamp: { secondsPastEpoch: 123456789, nanoseconds: 2460000 },
          value: false,
        },
      }
    );
    expect(testArchive2.timeSinceConnect.counter).toEqual(2);
    expect(testArchive2.timeSinceConnect[1]).toBeCloseTo(23456789.00246, 6);
    expect(testArchive2.value.counter).toEqual(2);
    expect(testArchive2.value[1]).toEqual(false);
    expect(testArchive2.plotValue.counter).toEqual(3);
    expect(testArchive2.plotValue[1]).toEqual(0);
    expect(testArchive2.plotValue[2]).toEqual(0);
  });

  const runPushToArchiveTest = (timestep, expectedPlotTime) => {
    state.blockArchive.block1.attributes[0].connectTime = 100000000;
    state.blockArchive.block1.attributes[0].value.push(1);
    state.blockArchive.block1.attributes[0].timeSinceConnect.push(
      23456789.00123
    );
    state.blockArchive.block1.attributes[0].plotTime = 23456789.00123;
    const testArchive = pushToArchive(state.blockArchive.block1.attributes[0], {
      raw: {
        timeStamp: {
          secondsPastEpoch: 123456789 + timestep * ARCHIVE_REFRESH_INTERVAL,
          nanoseconds: 1230000,
        },
        value: 2,
      },
    });
    expect(testArchive.plotTime).toBeCloseTo(expectedPlotTime, 6);
  };

  it('pushToArchive doesnt increment plot time if timestep less than ARCHIVE_REFRESH_INTERVAL', () => {
    runPushToArchiveTest(0.5, 23456789.00123);
  });

  it('pushToArchive does increment plot time if timestep greater than ARCHIVE_REFRESH_INTERVAL', () => {
    runPushToArchiveTest(2.0, 23456789.00123 + 2.0 * ARCHIVE_REFRESH_INTERVAL);
  });

  it('creates local state for textInput', () => {
    state = AttributeReducer(
      state,
      buildAction(MalcolmAttributeData, payload2)
    );
    const testAttribute = blockUtils.findAttribute(
      state.blocks,
      'block1',
      'testInput'
    );
    expect(testAttribute.localState).toBeDefined();
    expect(testAttribute.localState).toEqual('testing#123');
  });

  it('updates local state for clean textInput', () => {
    state = addSimpleLocalState(state, 'block1', 'testInput', 'testing#0');
    state = AttributeReducer(
      state,
      buildAction(MalcolmAttributeData, payload2)
    );
    const testAttribute = blockUtils.findAttribute(
      state.blocks,
      'block1',
      'testInput'
    );
    expect(testAttribute.localState).toBeDefined();
    expect(testAttribute.localState).toEqual('testing#123');
  });

  it('doesnt update local state for dirty textInput', () => {
    state = addSimpleLocalState(state, 'block1', 'testInput', 'testing');
    state = setAttributeFlag(state, 'block1', 'testInput', 'dirty', true);
    state = AttributeReducer(
      state,
      buildAction(MalcolmAttributeData, payload2)
    );
    const testAttribute = blockUtils.findAttribute(
      state.blocks,
      'block1',
      'testInput'
    );
    expect(testAttribute.localState).toBeDefined();
    expect(testAttribute.localState).toEqual('testing');
  });

  it('does update local state for dirty textInput if forceUpdate is true', () => {
    state = setAttributeFlag(state, 'block1', 'testInput', 'dirty', true);
    state = setAttributeFlag(
      state,
      'block1',
      'testInput',
      'forceUpdate',
      'true'
    );
    state = AttributeReducer(
      state,
      buildAction(MalcolmAttributeData, payload2)
    );
    const testAttribute = blockUtils.findAttribute(
      state.blocks,
      'block1',
      'testInput'
    );
    expect(testAttribute.localState).toBeDefined();
    expect(testAttribute.localState).toEqual('testing#123');
  });

  it('updates table local state if dirty is false', () => {
    const labels = Object.keys(payload.raw.value);
    state = addTableLocalState(state, 'block1', 'table', labels, 3);
    state = AttributeReducer(
      state,
      buildAction(MalcolmAttributeData, payload3)
    );
    const testAttribute = blockUtils.findAttribute(
      state.blocks,
      'block1',
      'table'
    );
    const expectedState = payload.raw.value[labels[0]].map((val, index) => {
      const row = {};
      labels.forEach(label => {
        row[label] = payload.raw.value[label][index];
      });
      return row;
    });

    expect(testAttribute.localState).toBeDefined();
    expect(testAttribute.localState.value).toEqual(expectedState);
  });

  it('doesnt update table local state if dirty flag is true', () => {
    const labels = Object.keys(payload.raw.value);
    state = addTableLocalState(state, 'block1', 'table', labels, 3);
    state = setTableFlag(state, 'block1', 'table', 'dirty', true);
    state = setAttributeFlag(state, 'block1', 'table', 'dirty', true);
    state = AttributeReducer(
      state,
      buildAction(MalcolmAttributeData, payload3)
    );
    const testAttribute = blockUtils.findAttribute(
      state.blocks,
      'block1',
      'table'
    );
    const expectedState = [];
    for (let i = 0; i < 3; i += 1) {
      const row = {};
      labels.forEach(label => {
        row[label] = '';
      });
      expectedState[i] = row;
    }
    expect(testAttribute.localState).toBeDefined();
    expect(testAttribute.localState.value).toEqual(expectedState);
  });

  it('updates table local state if dirty flag is true but shouldClearDirtyFlag clears', () => {
    shouldClearDirtyFlag.mockImplementation(attribute => {
      const updatedAttribute = attribute;
      updatedAttribute.localState.flags.table.dirty = false;
      updatedAttribute.calculated.dirty = false;
      return updatedAttribute;
    });
    const labels = Object.keys(payload.raw.value);
    state = addTableLocalState(state, 'block1', 'table', labels, 3);
    state = setTableFlag(state, 'block1', 'table', 'dirty', true);
    state = setAttributeFlag(state, 'block1', 'table', 'dirty', true);
    state = AttributeReducer(
      state,
      buildAction(MalcolmAttributeData, payload3)
    );
    const testAttribute = blockUtils.findAttribute(
      state.blocks,
      'block1',
      'table'
    );
    const expectedState = payload.raw.value[labels[0]].map((val, index) => {
      const row = {};
      labels.forEach(label => {
        row[label] = payload.raw.value[label][index];
      });
      return row;
    });

    expect(testAttribute.localState).toBeDefined();
    expect(testAttribute.localState.value).toEqual(expectedState);
  });

  it('updates table local state if dirty flag is true but forceUpdate is true', () => {
    const labels = Object.keys(payload.raw.value);
    state = addTableLocalState(state, 'block1', 'table', labels, 3);
    state = setTableFlag(state, 'block1', 'table', 'dirty', true);
    state = setAttributeFlag(state, 'block1', 'table', 'dirty', true);
    state = setAttributeFlag(state, 'block1', 'table', 'forceUpdate', true);
    state = AttributeReducer(
      state,
      buildAction(MalcolmAttributeData, payload3)
    );
    const testAttribute = blockUtils.findAttribute(
      state.blocks,
      'block1',
      'table'
    );
    const expectedState = payload.raw.value[labels[0]].map((val, index) => {
      const row = {};
      labels.forEach(label => {
        row[label] = payload.raw.value[label][index];
      });
      return row;
    });

    expect(testAttribute.localState).toBeDefined();
    expect(testAttribute.localState.value).toEqual(expectedState);
  });

  it('tickArchive does tick', () => {
    const archive = state.blockArchive.block1.attributes[0];
    archive.tickingSince = new Date(mockStartTime);
    archive.plotTime = 7;
    archive.value.push('ticker test!');
    archive.value.push('ticker test!');
    archive.timeStamp.push(new Date(mockDataTime));
    archive.timeStamp.push(new Date(mockDataTime));

    const updatedState = tickArchive(state, { path: ['block1', 'layout'] });
    const updatedArchive = updatedState.blockArchive.block1.attributes[0];
    expect(updatedArchive.timeStamp.size()).toEqual(2);
    expect(updatedArchive.value.size()).toEqual(2);

    expect(updatedArchive.timeStamp.get(1)).toEqual(
      new Date(mockNow - mockStartTime + mockDataTime)
    );
    expect(updatedArchive.value.get(1)).toEqual('ticker test!');
    expect(updatedArchive.plotTime).toEqual(8);
  });
});
