import React from 'react';
import PropTypes from 'prop-types';
import Warning from '@material-ui/icons/Warning';
import Error from '@material-ui/icons/Error';
import InfoOutline from '@material-ui/icons/InfoOutlined';
import HighlightOff from '@material-ui/icons/HighlightOff';
import Edit from '@material-ui/icons/Edit';
import PowerOff from '@material-ui/icons/PowerOff';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTheme } from '@material-ui/core/styles/index';
import EditError from './EditError.component';

const AlarmStateNumbers = {
  NO_ALARM: 0,
  MINOR_ALARM: 1,
  MAJOR_ALARM: 2,
  INVALID_ALARM: 3,
  UNDEFINED_ALARM: 4,
  PENDING: -1,
  DIRTY: -2,
  DIRTYANDERROR: -3,
};

Object.entries(AlarmStateNumbers).forEach(entry => {
  [AlarmStateNumbers[entry[1]]] = entry;
});

export const AlarmStates = AlarmStateNumbers;

export const AlarmStatesByIndex = [
  AlarmStates.NO_ALARM,
  AlarmStates.MINOR_ALARM,
  AlarmStates.MAJOR_ALARM,
  AlarmStates.UNDEFINED_ALARM,
];

export const getAlarmState = attribute => {
  let alarm = AlarmStates.NO_ALARM;
  if (attribute && attribute.raw && attribute.raw.alarm) {
    alarm = attribute.raw.alarm.severity;
    alarm = attribute.calculated.errorState ? AlarmStates.MAJOR_ALARM : alarm;
    alarm = attribute.calculated.dirty ? AlarmStates.DIRTY : alarm;
    alarm =
      attribute.calculated.dirty && attribute.calculated.errorState
        ? AlarmStates.DIRTYANDERROR
        : alarm;
    alarm = attribute.calculated.pending ? AlarmStates.PENDING : alarm;
  } else if (attribute && attribute.calculated) {
    alarm = attribute.calculated.errorState ? AlarmStates.MAJOR_ALARM : alarm;
    alarm = attribute.calculated.pending ? AlarmStates.PENDING : alarm;
  }
  return alarm;
};

const AttributeAlarm = props => {
  switch (props.alarmSeverity) {
    case AlarmStates.NO_ALARM:
      return <InfoOutline nativeColor={props.theme.palette.primary.light} />;

    case AlarmStates.MINOR_ALARM:
      return <Warning nativeColor={props.theme.alarmState.warning} />;

    case AlarmStates.MAJOR_ALARM:
      return <Error nativeColor={props.theme.alarmState.error} />;

    case AlarmStates.INVALID_ALARM:
      return <HighlightOff nativeColor={props.theme.alarmState.disconnected} />;

    case AlarmStates.UNDEFINED_ALARM:
      return <PowerOff nativeColor={props.theme.alarmState.disconnected} />;

    case AlarmStates.PENDING:
      return (
        <CircularProgress
          size={24}
          style={{ color: props.theme.palette.secondary.light }}
        />
      );

    case AlarmStates.DIRTY:
      return <Edit nativeColor={props.theme.palette.primary.light} />;

    case AlarmStates.DIRTYANDERROR:
      return <EditError nativeColor={props.theme.palette.error.main} />;

    default:
      return <div style={{ width: 24 }} />;
  }
};

AttributeAlarm.propTypes = {
  alarmSeverity: PropTypes.number,
  theme: PropTypes.shape({}),
};

export default withTheme()(AttributeAlarm);
