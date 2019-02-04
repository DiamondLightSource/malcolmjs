import React from 'react';
import PropTypes from 'prop-types';
import Warning from '@material-ui/icons/Warning';
import Error from '@material-ui/icons/Error';
import InfoOutline from '@material-ui/icons/InfoOutlined';
import HighlightOff from '@material-ui/icons/HighlightOff';
import Edit from '@material-ui/icons/Edit';
import PowerOff from '@material-ui/icons/PowerOff';
import Send from '@material-ui/icons/Send';
import Reply from '@material-ui/icons/Reply';
import Forward from '@material-ui/icons/Forward';
import Help from '@material-ui/icons/HelpOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTheme } from '@material-ui/core/styles/index';
import blockUtils from '../../../malcolm/blockUtils';
import EditError from './EditError.component';

export const FieldTypes = {
  ATTRIBUTE: 'attribute',
  METHOD: 'method',
  PARAMIN: 'method:takes',
  PARAMOUT: 'method:returns',
};

const AlarmStateNumbers = {
  NO_ALARM: 0,
  MINOR_ALARM: 1,
  MAJOR_ALARM: 2,
  INVALID_ALARM: 3,
  UNDEFINED_ALARM: 4,
  PENDING: -1,
  DIRTY: -2,
  DIRTYANDERROR: -3,
  HELP: -4,
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
  if (blockUtils.attributeHasTag(attribute, 'widget:help')) {
    return AlarmStates.HELP;
  }

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
    case AlarmStates.NO_ALARM: {
      switch (props.fieldType) {
        case FieldTypes.ATTRIBUTE:
          return (
            <InfoOutline nativeColor={props.theme.palette.primary.light} />
          );
        case FieldTypes.METHOD:
          return <Send nativeColor={props.theme.palette.primary.light} />;
        case FieldTypes.PARAMIN:
          return <Forward nativeColor={props.theme.palette.primary.light} />;
        case FieldTypes.PARAMOUT:
          return <Reply nativeColor={props.theme.palette.primary.light} />;
        default:
          return (
            <InfoOutline nativeColor={props.theme.palette.primary.light} />
          );
      }
    }
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

    case AlarmStates.HELP:
      return <Help nativeColor={props.theme.palette.secondary.dark} />;

    default:
      return <div style={{ width: 24 }} />;
  }
};

AttributeAlarm.propTypes = {
  alarmSeverity: PropTypes.number,
  theme: PropTypes.shape({}),
  fieldType: PropTypes.string,
};

AttributeAlarm.defaultProps = {
  fieldType: FieldTypes.ATTRIBUTE,
};

export default withTheme()(AttributeAlarm);
