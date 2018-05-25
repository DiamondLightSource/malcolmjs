import React from 'react';
import PropTypes from 'prop-types';
import { Warning, Error, InfoOutline, HighlightOff } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';

export const AlarmStates = {
  NO_ALARM: 0,
  MINOR_ALARM: 1,
  MAJOR_ALARM: 2,
  INVALID_ALARM: 3,
  UNDEFINED_ALARM: 4,
  PENDING: -1,
};

const AttributeAlarm = props => {
  switch (props.alarmSeverity) {
    case AlarmStates.NO_ALARM:
      return <InfoOutline nativeColor="#72a7cf" />;

    case AlarmStates.MINOR_ALARM:
      return <Warning nativeColor="#ffd42a" />;

    case AlarmStates.MAJOR_ALARM:
      return <Error nativeColor="#c01a19" />;

    case AlarmStates.INVALID_ALARM:
      return <HighlightOff nativeColor="#573c8b" />;

    case AlarmStates.UNDEFINED_ALARM:
      return <HighlightOff nativeColor="#573c8b" />;

    case AlarmStates.PENDING:
      return <CircularProgress size={24} color="secondary" />;

    default:
      return <div />;
  }
};

AttributeAlarm.propTypes = {
  alarmSeverity: PropTypes.number,
};

export default AttributeAlarm;
