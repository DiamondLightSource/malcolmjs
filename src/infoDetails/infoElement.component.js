import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AttributeAlarm, {
  AlarmStates,
} from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import { selectorFunction } from '../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

import blockUtils from '../malcolm/blockUtils';

const styles = theme => ({
  div: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: 'center',
  },
  textName: {
    flexGrow: 1,
    textAlign: 'Left',
    marginLeft: 4,
    marginRight: 4,
  },
  controlContainer: {
    width: 150,
    padding: 2,
  },
  button: {
    width: '22px',
    height: '22px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
});

const InfoElement = props => (
  <div className={props.classes.div}>
    {props.alarm === AlarmStates.NO_ALARM ? (
      <IconButton className={props.classes.button} disableRipple>
        <AttributeAlarm alarmSeverity={props.alarm} />
      </IconButton>
    ) : (
      <AttributeAlarm alarmSeverity={props.alarm} />
    )}
    <Typography className={props.classes.textName}>
      {props.showLabel ? `${props.label}:` : ''}
    </Typography>
    <div className={props.classes.controlContainer}>
      {selectorFunction(
        props.tag,
        props.path,
        props.value,
        props.handlers.eventHandler,
        { isDisabled: props.disabled },
        props.handlers.setFlag,
        props.theme.palette.primary.light,
        { choices: props.choices },
        false,
        false,
        props.handlers.clickHandler
      )}
    </div>
  </div>
);

InfoElement.propTypes = {
  alarm: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  showLabel: PropTypes.bool,
  tag: PropTypes.string.isRequired,
  path: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.oneOf([PropTypes.string, PropTypes.number, PropTypes.bool])
    .isRequired,
  choices: PropTypes.arrayOf(PropTypes.string),
  classes: PropTypes.shape({
    div: PropTypes.string,
    textName: PropTypes.string,
    controlContainer: PropTypes.string,
    button: PropTypes.string,
  }).isRequired,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      primary: PropTypes.shape({
        light: PropTypes.string,
      }),
      secondary: PropTypes.shape({
        main: PropTypes.string,
      }),
    }),
  }).isRequired,
  handlers: PropTypes.shape({
    eventHandler: PropTypes.func,
    setFlag: PropTypes.func,
    clickHandler: PropTypes.func,
  }),
  disabled: PropTypes.bool.isRequired,
};

InfoElement.defaultProps = {
  choices: [],
  handlers: {},
  path: [''],
  showLabel: true,
};

const mapStateToProps = (state, ownProps) => {
  let value;
  let alarmState;
  let disabled;
  const attribute = blockUtils.findAttribute(
    state.malcolm.blocks,
    ownProps.blockName,
    ownProps.attributeName
  );
  if (attribute) {
    if (ownProps.valuePath) {
      const path = ownProps.valuePath.split('.');
      value = attribute;
      path.forEach(pathElement => {
        value = value[pathElement];
      });
    }
    if (ownProps.alarmPath) {
      const path = ownProps.alarmPath.split('.');
      alarmState = attribute;
      path.forEach(pathElement => {
        alarmState = alarmState[pathElement];
      });
    }
    if (ownProps.disabledFlagPath) {
      const fullPath = ownProps.disabledFlagPath.split('.');
      const path = fullPath[0] === 'NOT' ? fullPath.slice(1) : fullPath;
      disabled = attribute;
      path.forEach(pathElement => {
        disabled = disabled[pathElement];
      });
      disabled = fullPath[0] === 'NOT' ? !disabled : !!disabled;
    }
  }
  return {
    alarm: alarmState !== undefined ? alarmState : ownProps.alarm,
    value: value !== undefined ? value : ownProps.value,
    disabled: disabled !== undefined ? disabled : ownProps.disabled,
  };
};

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(InfoElement)
);
