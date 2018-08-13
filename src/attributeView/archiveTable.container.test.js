import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import MockCircularBuffer from '../malcolm/reducer/attribute.reducer.mocks';
import ArchiveTable from './archiveTable.container';

describe('archiveTable', () => {
  let shallow;
  let mockArchive;

  beforeEach(() => {
    shallow = createShallow({ dive: true });
    mockArchive = {
      timeStamp: new MockCircularBuffer(5),
      value: new MockCircularBuffer(5),
      alarmState: new MockCircularBuffer(5),
    };
  });

  it('renders correctly', () => {
    mockArchive.timeStamp.push(new Date(1000));
    mockArchive.timeStamp.push(new Date(2000));
    mockArchive.timeStamp.push(new Date(3000));
    mockArchive.timeStamp.push(new Date(3000));
    mockArchive.value.push(1);
    mockArchive.value.push(-1);
    mockArchive.value.push(false);
    mockArchive.value.push(false);
    mockArchive.alarmState.push(0);
    mockArchive.alarmState.push(1);
    mockArchive.alarmState.push(0);
    mockArchive.alarmState.push(0);

    const wrapper = shallow(<ArchiveTable attribute={mockArchive} />);
    expect(wrapper.dive()).toMatchSnapshot();
  });
});
