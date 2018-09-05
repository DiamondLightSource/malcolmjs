import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import MockCircularBuffer from '../../malcolm/reducer/attribute.reducer.mocks';

import MethodPlot from './methodPlot.component';

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
      <MethodPlot
        attribute={testArchive}
        openPanels={{}}
        selectedParam={['takes', 'test1']}
        theme={mockTheme}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
