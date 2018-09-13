import AttributeReducer, {
  updateLayout,
  updateNavigation,
  portsAreDifferent,
  pushToArchive,
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
import MockCircularBuffer from './attribute.reducer.mocks';

jest.mock('./layout/layout.reducer');
jest.mock('./navigation.reducer');

const sourcePort = 'sourcePort';
const sinkPort = 'sinkPort';

describe('attribute reducer', () => {
  let state = {};
  let payload = {};

  beforeEach(() => {
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
              calculated: {
                name: 'layout',
                children: [],
              },
              raw: {
                meta: {
                  tags: ['widget:flowgraph'],
                },
              },
            },
          ],
        },
      },
      blockArchive: {
        block1: {
          attributes: [
            {
              name: 'layout',
              meta: {},
              value: new MockCircularBuffer(5),
              alarmState: new MockCircularBuffer(5),
              plotValue: new MockCircularBuffer(5),
              timeStamp: new MockCircularBuffer(5),
              timeSinceConnect: new MockCircularBuffer(5),
              connectTime: -1,
              counter: 0,
              refreshRate: ARCHIVE_REFRESH_INTERVAL,
              plotTime: 0,
            },
          ],
        },
      },
      navigation: {
        navigationLists: [],
        rootNav: {},
      },
      layoutState: {
        selectedBlocks: [],
      },
    };

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

  it('pushToArchive doesnt increment plot time if timestep less than ARCHIVE_REFRESH_INTERVAL', () => {
    state.blockArchive.block1.attributes[0].connectTime = 100000000;
    state.blockArchive.block1.attributes[0].value.push(1);
    state.blockArchive.block1.attributes[0].timeSinceConnect.push(
      23456789.00123
    );
    state.blockArchive.block1.attributes[0].plotTime = 23456789.00123;
    const testArchive = pushToArchive(state.blockArchive.block1.attributes[0], {
      raw: {
        timeStamp: {
          secondsPastEpoch: 123456789 + 0.5 * ARCHIVE_REFRESH_INTERVAL,
          nanoseconds: 1230000,
        },
        value: 2,
      },
    });
    expect(testArchive.plotTime).toBeCloseTo(23456789.00123, 6);
  });
  it('pushToArchive does increment plot time if timestep greater than ARCHIVE_REFRESH_INTERVAL', () => {
    state.blockArchive.block1.attributes[0].connectTime = 100000000;
    state.blockArchive.block1.attributes[0].value.push(1);
    state.blockArchive.block1.attributes[0].timeSinceConnect.push(
      23456789.00123
    );
    state.blockArchive.block1.attributes[0].plotTime = 23456789.00123;
    const testArchive = pushToArchive(state.blockArchive.block1.attributes[0], {
      raw: {
        timeStamp: {
          secondsPastEpoch: 123456789 + 2.0 * ARCHIVE_REFRESH_INTERVAL,
          nanoseconds: 1230000,
        },
        value: 2,
      },
    });
    expect(testArchive.plotTime).toBeCloseTo(
      23456789.00123 + 2.0 * ARCHIVE_REFRESH_INTERVAL,
      6
    );
  });
});
