import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AttributeAlarm from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import { selectorFunction } from '../malcolmWidgets/attributeDetails/attributeSelector/attributeSelector.component';

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
    <Tooltip id="1" title={props.message} placement="bottom">
      <IconButton className={props.classes.button} disableRipple>
        <AttributeAlarm alarmSeverity={props.alarm} />
      </IconButton>
    </Tooltip>
    <Typography className={props.classes.textName}>{props.label}: </Typography>
    <div className={props.classes.controlContainer}>
      {selectorFunction(
        props.tag,
        [''],
        props.value,
        props.handlers.eventHandler,
        {},
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
  message: PropTypes.string,
  label: PropTypes.string.isRequired,
  tag: PropTypes.string.isRequired,
  value: PropTypes.oneOf(PropTypes.string, PropTypes.number, PropTypes.bool)
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
};

InfoElement.defaultProps = {
  choices: [],
  message: '',
  handlers: {},
};

export default withStyles(styles, { withTheme: true })(InfoElement);
