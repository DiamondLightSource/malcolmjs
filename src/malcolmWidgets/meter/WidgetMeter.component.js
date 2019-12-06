import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { fade } from '@material-ui/core/styles/colorManipulator';
import TextInput from '../textInput/WidgetTextInput.component';

const ReactFitText = require('react-fittext');

const styles = () => ({
  div: {
    display: 'grid',
    gridTemplateColumns: '100%',
    gridTemplateRows: '100%',
  },
});

const WidgetMeter = props => {
  const prog = Math.min(props.value / props.limits.limitHigh * 100, 100);
  const startCol = 'transparent';
  const endCol =
    props.value > props.limits.limitHigh
      ? props.theme.palette.Error
      : props.theme.palette.primary.main;
  const value = props.readOnly ? props.value : props.localState.value;
  const display = props.isBlockDisplay ? (
    <ReactFitText compressor={1.05}>
      <Typography style={{ padding: '2px' }}>
        {`${value} / ${props.limits.limitHigh}`}
      </Typography>
    </ReactFitText>
  ) : (
    <TextInput
      Value={value}
      Units={`/ ${props.limits.limitHigh}`}
      setFlag={props.setFlag}
      localState={props.localState}
      submitEventHandler={props.submitEventHandler}
      Pending={props.readOnly}
      alwaysContrastText
    />
  );
  const stripStyle = {
    position: 'relative',
    gridColumn: '1',
    gridRow: '1',
    left: `calc(${prog}%)`,
    minWidth: `${100 - prog}%`,
    maxWidth: `${100 - prog}%`,
    borderLeft: `2px solid ${endCol}`,
  };

  return (
    <div className={props.classes.div}>
      <div
        style={{
          gridColumn: '1',
          gridRow: '1',
          position: 'relative',
          left: '0px',
          backgroundImage: `linear-gradient(to right, ${startCol}, ${endCol})`,
          minWidth: '100%',
        }}
      />
      <div
        style={{
          ...stripStyle,
          backgroundColor: props.theme.palette.background.paper,
        }}
      />
      <div
        style={{
          ...stripStyle,
          backgroundColor:
            props.isSelected && !props.isBlockDisplay
              ? fade(props.theme.palette.secondary.main, 0.175)
              : props.theme.palette.background.paper,
        }}
      />
      <div
        style={{
          gridColumn: '1',
          gridRow: '1',
          position: 'relative',
        }}
      >
        {display}
      </div>
    </div>
  );
};

WidgetMeter.propTypes = {
  classes: PropTypes.shape({
    div: PropTypes.string,
  }).isRequired,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      primary: PropTypes.shape({
        main: PropTypes.string,
      }),
      secondary: PropTypes.shape({
        main: PropTypes.string,
      }),
      Error: PropTypes.string,
      background: PropTypes.shape({
        paper: PropTypes.string,
      }),
      divider: PropTypes.string,
    }),
  }).isRequired,
  value: PropTypes.number.isRequired,
  submitEventHandler: PropTypes.func.isRequired,
  localState: PropTypes.shape({
    set: PropTypes.func,
    value: PropTypes.oneOfType(
      PropTypes.string,
      PropTypes.bool,
      PropTypes.number
    ),
  }),
  setFlag: PropTypes.func.isRequired,
  limits: PropTypes.shape({
    limitHigh: PropTypes.number,
  }).isRequired,
  readOnly: PropTypes.bool,
  isBlockDisplay: PropTypes.bool,
  isSelected: PropTypes.bool,
};

WidgetMeter.defaultProps = {
  readOnly: false,
  isBlockDisplay: false,
  isSelected: false,
  localState: { set: () => {} },
};

export default withStyles(styles, { withTheme: true })(WidgetMeter);
