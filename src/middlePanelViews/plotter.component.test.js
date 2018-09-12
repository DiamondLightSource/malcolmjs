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

jest.useFakeTimers();

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

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    testArchive = {
      value: new MockCircularBuffer(5),
      timeStamp: new MockCircularBuffer(5),
      alarmState: new MockCircularBuffer(5),
    };
    testArchive.value.push({
      runParameters: { test1: 0 },
      returned: { test2: 1 },
    });
    testArchive.timeStamp.push({
      localRunTime: new Date(0),
      localReturnTime: new Date(4),
    });
    testArchive.alarmState.push(0);
    testArchive.value.push({
      runParameters: { test1: 0 },
      returned: { test2: 1 },
    });
    testArchive.timeStamp.push({
      localRunTime: new Date(2),
      localReturnTime: new Date(5),
    });
    testArchive.alarmState.push(1);
    testArchive.value.push({
      runParameters: { test1: 0 },
      returned: { test2: 1 },
    });
    testArchive.timeStamp.push({
      localRunTime: new Date(3),
      localReturnTime: new Date(6),
    });
    testArchive.alarmState.push(2);
  });

  it('renders correctly for takes', () => {
    const wrapper = shallow(
      <Plotter
        store={{
          getState: () => {},
          subscribe: () => {},
        }}
        attribute={dummyArchive(testArchive, ['takes', 'test1'])}
        openPanels={{}}
        theme={mockTheme}
        deriveState={deriveMethodState}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly for returns', () => {
    const wrapper = shallow(
      <Plotter
        store={{
          getState: () => {},
          subscribe: () => {},
        }}
        attribute={dummyArchive(testArchive, ['returns', 'test2'])}
        openPanels={{}}
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
  let actions;
  let mockArchive;
  let mockStore;

  beforeEach(() => {
    jest.runAllTimers();
    actions = [];
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
    mockStore = {
      getState: () => {},
      subscribe: () => {},
      dispatch: action => {
        actions.push(action);
      },
    };
  });

  it('renders correctly for number', () => {
    mockArchive.meta.typeid = malcolmTypes.number;
    mockArchive.timeStamp.push(new Date(1000));
    mockArchive.timeStamp.push(new Date(2000));
    mockArchive.timeStamp.push(new Date(3000));
    mockArchive.plotValue.push(1);
    mockArchive.plotValue.push(-1);
    mockArchive.plotValue.push(2);
    mockArchive.alarmState.push(0);
    mockArchive.alarmState.push(0);
    mockArchive.alarmState.push(0);

    const wrapper = shallow(
      <Plotter
        store={mockStore}
        attribute={mockArchive}
        openPanels={{}}
        theme={mockTheme}
        deriveState={deriveAttributeState}
        doTick
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly for bool', () => {
    mockArchive.meta.typeid = malcolmTypes.bool;
    mockArchive.timeStamp.push(new Date(1000));
    mockArchive.timeStamp.push(new Date(2000));
    mockArchive.timeStamp.push(new Date(3000));
    mockArchive.plotValue.push(1);
    mockArchive.plotValue.push(0);
    mockArchive.plotValue.push(1);
    mockArchive.alarmState.push(0);
    mockArchive.alarmState.push(0);
    mockArchive.alarmState.push(0);

    const wrapper = shallow(
      <Plotter
        store={mockStore}
        attribute={mockArchive}
        openPanels={{}}
        theme={mockTheme}
        deriveState={deriveAttributeState}
        doTick
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('renders correctly for changing alarm state', () => {
    mockArchive.meta.typeid = malcolmTypes.number;
    mockArchive.timeStamp.push(new Date(1000));
    mockArchive.timeStamp.push(new Date(2000));
    mockArchive.timeStamp.push(new Date(3000));
    mockArchive.plotValue.push(1);
    mockArchive.plotValue.push(-1);
    mockArchive.plotValue.push(2);
    mockArchive.alarmState.push(0);
    mockArchive.alarmState.push(1);
    mockArchive.alarmState.push(0);

    const wrapper = shallow(
      <Plotter
        store={mockStore}
        attribute={mockArchive}
        openPanels={{}}
        theme={mockTheme}
        deriveState={deriveAttributeState}
        doTick
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('dispatches tick action after timeout', () => {
    mockArchive.meta.typeid = malcolmTypes.number;
    mockArchive.timeStamp.push(new Date(1000));
    mockArchive.timeStamp.push(new Date(2000));
    mockArchive.timeStamp.push(new Date(3000));
    mockArchive.plotValue.push(1);
    mockArchive.plotValue.push(-1);
    mockArchive.plotValue.push(2);
    mockArchive.alarmState.push(0);
    mockArchive.alarmState.push(0);
    mockArchive.alarmState.push(0);

    mount(
      <Plotter
        store={mockStore}
        attribute={mockArchive}
        openPanels={{}}
        theme={mockTheme}
        deriveState={deriveAttributeState}
        doTick
      />
    );
    jest.runTimersToTime(1000 * ARCHIVE_REFRESH_INTERVAL);
    expect(actions.length).toEqual(0);
    jest.runTimersToTime(100 * ARCHIVE_REFRESH_INTERVAL);
    expect(actions.length).toEqual(1);
    expect(actions).toEqual([
      { payload: { path: ['test1', 'attr1'] }, type: MalcolmTickArchive },
    ]);
  });
});

describe('Generic Plotter', () => {
  /*
  let mount;
  let mockArchive;
  let mockStore;
  beforeEach(() => {
    
    mount = createMount();
    mockArchive = {
      timeStamp: new MockCircularBuffer(5),
      alarmState: new MockCircularBuffer(5),
      plotValue: new MockCircularBuffer(5),
      meta: {},
    };
    mockStore = {
      getState: () => {},
      subscribe: () => {},
    };
  });
  */

  it('mouse down in plot area calls startChange function', () => {});

  it('plotly date format function behaves as expected', () => {
    const testDate = new Date(-14258381877);
    expect(plotlyDateFormatter(testDate)).toEqual('1969-07-20 00:20:18.123');
  });

  it('plotly date compare behaves as expected', () => {
    expect(comparePlotlyDateString(new Date(-14258381877), '')).toBeFalsy();
    expect(comparePlotlyDateString('', new Date(-14258381877))).toBeFalsy();

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
});
