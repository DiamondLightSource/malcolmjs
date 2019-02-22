import React from 'react';
import { createShallow, createMount } from '@material-ui/core/test-utils';
import MockCircularBuffer from '../malcolm/reducer/attribute.reducer.mocks';
import {
  deriveStateFromProps as deriveMethodState,
  dummyArchive,
} from './methodView/methodArchive.container';
import { deriveStateFromProps as deriveAttributeState } from './attributeView/attributeView.container';
import { malcolmTypes } from '../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';
import { MalcolmTickArchive } from '../malcolm/malcolm.types';
import Plotter, {
  comparePlotlyDateString,
  plotlyDateFormatter,
} from './plotter.component';
import { ARCHIVE_REFRESH_INTERVAL } from '../malcolm/reducer/malcolmReducer';
import {
  buildTestState,
  buildMockDispatch,
  addBlock,
  buildAttribute,
  addBlockArchive,
} from '../testState.utilities';

const plotlyDates = require('plotly.js/src/lib/dates');

jest.useFakeTimers();

/*
const finishChangeMock = jest.fn();

class MockPlot extends Plotter {
  finishChangingViewState(event) {
    finishChangeMock(event);
  }
}
*/
const mockTheme = {
  palette: {
    primary: { light: '#f0f0f0' },
    text: { primary: '#000' },
    background: { default: '#424242' },
  },
  alarmState: { warning: '#fff', error: '#ff0000', disconnected: '#0500ff' },
};

describe('MethodPlot', () => {
  let shallow;
  let testArchive;

  let state;
  let mockStore;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    testArchive = {
      value: new MockCircularBuffer(5),
      timeStamp: new MockCircularBuffer(5),
      alarmState: new MockCircularBuffer(5),
    };
    testArchive.value.push({
      took: { test1: 0 },
      returned: { test2: 1 },
    });
    testArchive.timeStamp.push({
      runTime: new Date(0),
      returnTime: new Date(4),
    });
    testArchive.alarmState.push(0);
    testArchive.value.push({
      took: { test1: 0 },
      returned: { test2: 1 },
    });
    testArchive.timeStamp.push({
      runTime: new Date(2),
      returnTime: new Date(5),
    });
    testArchive.alarmState.push(1);
    testArchive.value.push({
      took: { test1: 0 },
      returned: { test2: 1 },
    });
    testArchive.timeStamp.push({
      runTime: new Date(3),
      returnTime: new Date(6),
    });
    testArchive.alarmState.push(2);

    state = buildTestState();
    addBlock(
      'block1',
      [buildAttribute('attr1', ['block1', 'attr1'], 0)],
      state.malcolm
    );
    mockStore = buildMockDispatch(() => state);
  });

  it('renders correctly for takes', () => {
    addBlockArchive(
      'block1',
      [dummyArchive(testArchive, ['takes', 'test1'])],
      state.malcolm
    );

    const wrapper = shallow(
      <Plotter
        store={mockStore}
        blockName="block1"
        attributeName="attr1"
        // attribute={dummyArchive(testArchive, ['takes', 'test1'])}
        // openPanels={{}}
        theme={mockTheme}
        deriveState={deriveMethodState}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly for returns', () => {
    addBlockArchive(
      'block1',
      [dummyArchive(testArchive, ['returns', 'test2'])],
      state.malcolm
    );

    const wrapper = shallow(
      <Plotter
        store={mockStore}
        blockName="block1"
        attributeName="attr1"
        theme={mockTheme}
        deriveState={deriveMethodState}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});

describe('attributePlot', () => {
  let shallow;
  let mount;
  // let actions;
  let mockArchive;
  let state;
  let mockStore;

  beforeEach(() => {
    jest.runAllTimers();
    // actions = [];
    shallow = createShallow({ dive: true });
    mount = createMount();
    mockArchive = {
      parent: 'test1',
      name: 'attr1',
      timeStamp: new MockCircularBuffer(5),
      alarmState: new MockCircularBuffer(5),
      plotValue: new MockCircularBuffer(5),
      meta: {},
    };
    // mockStore = {
    //   getState: () => {},
    //   subscribe: () => {},
    //   dispatch: action => {
    //     actions.push(action);
    //   },
    // };

    state = buildTestState();
    addBlock(
      'block1',
      [buildAttribute('attr1', ['block1', 'attr1'], 0)],
      state.malcolm
    );
    mockStore = buildMockDispatch(() => state);
  });

  const buildMockArchive = (values, alarms) => {
    mockArchive.timeStamp.push(new Date(1000));
    mockArchive.timeStamp.push(new Date(2000));
    mockArchive.timeStamp.push(new Date(3000));
    values.forEach(v => mockArchive.plotValue.push(v));
    alarms.forEach(v => mockArchive.alarmState.push(v));
  };

  it('renders correctly for number', () => {
    mockArchive.meta.typeid = malcolmTypes.number;
    buildMockArchive([1, -1, 2], [0, 0, 0]);

    addBlockArchive('block1', [mockArchive], state.malcolm);

    const wrapper = shallow(
      <Plotter
        store={mockStore}
        blockName="block1"
        attributeName="attr1"
        theme={mockTheme}
        deriveState={deriveAttributeState}
        doTick
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly for bool', () => {
    mockArchive.meta.typeid = malcolmTypes.bool;
    buildMockArchive([1, 0, 1], [0, 0, 0]);

    addBlockArchive('block1', [mockArchive], state.malcolm);

    const wrapper = shallow(
      <Plotter
        store={mockStore}
        blockName="block1"
        attributeName="attr1"
        theme={mockTheme}
        deriveState={deriveAttributeState}
        doTick
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly for changing alarm state', () => {
    mockArchive.meta.typeid = malcolmTypes.number;
    buildMockArchive([1, -1, 2], [0, 1, 0]);

    addBlockArchive('block1', [mockArchive], state.malcolm);

    const wrapper = shallow(
      <Plotter
        store={mockStore}
        blockName="block1"
        attributeName="attr1"
        theme={mockTheme}
        deriveState={deriveAttributeState}
        doTick
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('dispatches tick action after timeout', () => {
    mockArchive.meta.typeid = malcolmTypes.number;
    buildMockArchive([1, -1, 2], [0, 0, 0]);

    addBlockArchive('block1', [mockArchive], state.malcolm);

    mount(
      <Plotter
        store={mockStore}
        blockName="block1"
        attributeName="attr1"
        theme={mockTheme}
        deriveState={deriveAttributeState}
        doTick
      />
    );
    jest.runTimersToTime(1000 * ARCHIVE_REFRESH_INTERVAL);
    expect(mockStore.actions.length).toEqual(0);
    jest.runTimersToTime(100 * ARCHIVE_REFRESH_INTERVAL);
    expect(mockStore.actions.length).toEqual(1);
    expect(mockStore.actions).toEqual([
      { payload: { path: ['test1', 'attr1'] }, type: MalcolmTickArchive },
    ]);
  });
});

describe('Generic Plotter', () => {
  it('mouse down in plot area calls startChange function', () => {});

  it('plotly date compare behaves as expected', () => {
    expect(
      comparePlotlyDateString(new Date(-14258381877), '1969-07-20 00:20:18.123')
    ).toBeFalsy();
    expect(
      comparePlotlyDateString('1969-07-20 00:20:18.123', new Date(-14258381877))
    ).toBeFalsy();

    // identical strings are equal
    expect(
      comparePlotlyDateString(
        '1969-07-20 00:20:18.123',
        '1969-07-20 00:20:18.123'
      )
    ).toBeTruthy();
    // variations after 3rd decimal place are ignored
    expect(
      comparePlotlyDateString(
        '1969-07-20 00:20:18.123',
        '1969-07-20 00:20:18.1234'
      )
    ).toBeTruthy();
    expect(
      comparePlotlyDateString(
        '1969-07-20 00:20:18.1234',
        '1969-07-20 00:20:18.123'
      )
    ).toBeTruthy();
    // trailing zeros do not effect equality
    expect(
      comparePlotlyDateString(
        '1969-07-20 00:20:18.12',
        '1969-07-20 00:20:18.120'
      )
    ).toBeTruthy();
    expect(
      comparePlotlyDateString(
        '1969-07-20 00:20:18.120',
        '1969-07-20 00:20:18.12'
      )
    ).toBeTruthy();
    // differing years returns false
    expect(
      comparePlotlyDateString(
        '1968-07-20 00:20:18.123',
        '1969-07-20 00:20:18.123'
      )
    ).toBeFalsy();
    // differing months returns false
    expect(
      comparePlotlyDateString(
        '1969-08-20 00:20:18.123',
        '1969-07-20 00:20:18.123'
      )
    ).toBeFalsy();
    // differing days returns false
    expect(
      comparePlotlyDateString(
        '1969-07-21 00:20:18.123',
        '1969-07-20 00:20:18.123'
      )
    ).toBeFalsy();
    // differing hours returns false
    expect(
      comparePlotlyDateString(
        '1969-07-20 01:20:18.123',
        '1969-07-20 00:20:18.123'
      )
    ).toBeFalsy();
    // differing minutes returns false
    expect(
      comparePlotlyDateString(
        '1969-07-20 00:21:18.123',
        '1969-07-20 00:20:18.123'
      )
    ).toBeFalsy();
    // differing seconds returns false
    expect(
      comparePlotlyDateString(
        '1969-07-20 00:20:19.123',
        '1969-07-20 00:20:18.123'
      )
    ).toBeFalsy();
    // differing number of milliseconds returns false
    expect(
      comparePlotlyDateString(
        '1969-07-20 00:20:18.121',
        '1969-07-20 00:20:18.120'
      )
    ).toBeFalsy();
  });

  it('plotly date format function behaves as expected', () => {
    const testDate = plotlyDateFormatter(new Date(-14258381877));
    const plotlyDateString = plotlyDates.ms2DateTimeLocal(-14258381877);
    expect(plotlyDateString).toEqual(testDate);
    expect(comparePlotlyDateString(plotlyDateString, testDate)).toBeTruthy();
  });
});
