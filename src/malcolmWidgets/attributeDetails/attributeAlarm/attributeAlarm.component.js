import React from 'react';
import PropTypes from 'prop-types';
import {
  Warning,
  Error,
  InfoOutline,
  HighlightOff,
  Edit,
} from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withTheme } from '@material-ui/core/styles/index';

export const AlarmStates = {
  NO_ALARM: 0,
  MINOR_ALARM: 1,
  MAJOR_ALARM: 2,
  INVALID_ALARM: 3,
  UNDEFINED_ALARM: 4,
  PENDING: -1,
  DIRTY: -2,
};

const AttributeAlarm = props => {
  switch (props.alarmSeverity) {
    case AlarmStates.NO_ALARM:
      return <InfoOutline nativeColor={props.theme.palette.primary.light} />;

    case AlarmStates.MINOR_ALARM:
      return <Warning nativeColor={props.theme.alarmState.warning} />;

    case AlarmStates.MAJOR_ALARM:
      return <Error nativeColor={props.theme.palette.error.main} />;

    case AlarmStates.INVALID_ALARM:
      return <HighlightOff nativeColor={props.theme.palette.primary.dark} />;

    case AlarmStates.UNDEFINED_ALARM:
      return <HighlightOff nativeColor={props.theme.palette.primary.dark} />;

    case AlarmStates.PENDING:
      return (
        <CircularProgress
          size={24}
          style={{ color: props.theme.palette.secondary.light }}
        />
      );

    case AlarmStates.DIRTY:
      return <Edit nativeColor={props.theme.palette.primary.light} />;

    default:
      return <div />;
  }
};

AttributeAlarm.propTypes = {
  alarmSeverity: PropTypes.number,
  theme: PropTypes.shape({}),
};

export default withTheme()(AttributeAlarm);
