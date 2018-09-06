import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import MockCircularBuffer from '../malcolm/reducer/attribute.reducer.mocks';
import { deriveStateFromProps as deriveMethodState } from './methodView/methodArchive.container';
import { deriveStateFromProps as deriveAttributeState } from './attributeView/attributeView.container';
import { malcolmTypes } from '../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

import Plotter from './plotter.component';

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

  it('renders correctly', () => {
    const wrapper = shallow(
      <Plotter
        store={{
          getState: () => {},
          subscribe: () => {},
        }}
        attribute={testArchive}
        openPanels={{}}
        selectedParam={['takes', 'test1']}
        theme={mockTheme}
        deriveState={deriveMethodState}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});

describe('attributePlot', () => {
  let shallow;
  let mockArchive;
  let mockStore;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
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
});
