import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import MockCircularBuffer from '../malcolm/reducer/attribute.reducer.mocks';
import { malcolmTypes } from '../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';
import AttributePlot from './attributePlot.component';

const mockTheme = {
  palette: {
    primary: { light: '#f0f0f0' },
    text: { primary: '#000' },
    background: { default: '#424242' },
  },
  alarmState: { warning: '#fff', error: '#ff0000', disconnected: '#0500ff' },
};

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
      <AttributePlot
        store={mockStore}
        attribute={mockArchive}
        openPanels={{}}
        theme={mockTheme}
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
      <AttributePlot
        store={mockStore}
        attribute={mockArchive}
        openPanels={{}}
        theme={mockTheme}
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
      <AttributePlot
        store={mockStore}
        attribute={mockArchive}
        openPanels={{}}
        theme={mockTheme}
      />
    );
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
