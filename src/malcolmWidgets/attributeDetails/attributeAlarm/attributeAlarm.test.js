import React from 'react';
import { createShallow } from 'material-ui/test-utils';
import AttributeAlarm, { AlarmStates } from './attributeAlarm.component';

describe('AttributeAlarm', () => {
  let shallow;

  beforeEach(() => {
    shallow = createShallow();
  });

  it('renders no_alarm correctly', () => {
    const wrapper = shallow(
      <AttributeAlarm alarmSeverity={AlarmStates.NO_ALARM} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders minor_alarm correctly', () => {
    const wrapper = shallow(
      <AttributeAlarm alarmSeverity={AlarmStates.MINOR_ALARM} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders major_alarm correctly', () => {
    const wrapper = shallow(
      <AttributeAlarm alarmSeverity={AlarmStates.MAJOR_ALARM} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders invalid_alarm correctly', () => {
    const wrapper = shallow(
      <AttributeAlarm alarmSeverity={AlarmStates.INVALID_ALARM} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders undefined_alarm correctly', () => {
    const wrapper = shallow(
      <AttributeAlarm alarmSeverity={AlarmStates.UNDEFINED_ALARM} />
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('renders pending correctly', () => {
    const wrapper = shallow(
      <AttributeAlarm alarmSeverity={AlarmStates.PENDING} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
