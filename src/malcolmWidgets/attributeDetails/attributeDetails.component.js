import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { fade } from '@material-ui/core/styles/colorManipulator';
import AttributeAlarm, {
  AlarmStates,
  getAlarmState,
} from './attributeAlarm/attributeAlarm.component';
import AttributeSelector from './attributeSelector/attributeSelector.component';
import blockUtils from '../../malcolm/blockUtils';
import navigationActions from '../../malcolm/actions/navigation.actions';

const styles = theme => ({
  div: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    paddingLeft: 4,
    paddingRight: 4,
    alignItems: 'center',
  },
  textName: {
    flexGrow: 1,
    textAlign: 'Left',
    marginLeft: 4,
    marginRight: 4,
  },
  controlContainer: {
    width: 180,
    padding: 2,
  },
  button: {
    width: '24px',
    height: '24px',
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
});

const copyPathToClipboard = (event, path) => {
  if (event.button === 1) {
    const dummyElement = document.createElement('textarea');
    dummyElement.value = JSON.stringify(path);
    dummyElement.setAttribute('readonly', '');
    dummyElement.style.position = 'absolute';
    dummyElement.style.left = `${event.pageX}px`;
    dummyElement.style.top = `${event.pageY}px`;
    document.body.appendChild(dummyElement);
    dummyElement.select();
    document.execCommand('copy');
    document.body.removeChild(dummyElement);
  }
};

const EMPTY_STRING = '';

const AttributeDetails = props => {
  if (props.widgetTagIndex !== null) {
    const rowHighlight = props.isMainAttribute
      ? { backgroundColor: fade(props.theme.palette.secondary.main, 0.25) }
      : {};
    return (
      <div className={props.classes.div} style={rowHighlight}>
        <Tooltip id="1" title={props.message} placement="bottom">
          <IconButton
            tabIndex="-1"
            className={props.classes.button}
            disableRipple
            onClick={() =>
              props.buttonClickHandler(props.blockName, props.attributeName)
            }
          >
            <AttributeAlarm alarmSeverity={props.alarm} />
          </IconButton>
        </Tooltip>
        <Typography
          className={props.classes.textName}
          onClick={() =>
            props.nameClickHandler([props.blockName, props.attributeName])
          }
          onMouseDown={event =>
            copyPathToClipboard(event, [props.blockName, props.attributeName])
          }
          style={{ cursor: 'pointer' }}
        >
          {props.label}{' '}
        </Typography>
        <div className={props.classes.controlContainer}>
          <AttributeSelector
            blockName={props.blockName}
            attributeName={props.attributeName}
          />
        </div>
      </div>
    );
  }
  return null;
};

AttributeDetails.propTypes = {
  attributeName: PropTypes.string.isRequired,
  blockName: PropTypes.string.isRequired,
  widgetTagIndex: PropTypes.number,
  alarm: PropTypes.number,
  message: PropTypes.string,
  label: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    div: PropTypes.string,
    textName: PropTypes.string,
    controlContainer: PropTypes.string,
    button: PropTypes.string,
  }).isRequired,
  buttonClickHandler: PropTypes.func.isRequired,
  nameClickHandler: PropTypes.func.isRequired,
  isMainAttribute: PropTypes.bool.isRequired,
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      secondary: PropTypes.shape({
        main: PropTypes.string,
      }),
    }),
  }).isRequired,
};

AttributeDetails.defaultProps = {
  widgetTagIndex: null,
  message: undefined,
  alarm: undefined,
};

const mapStateToProps = (state, ownProps) => {
  let attribute;
  if (ownProps.attributeName && ownProps.blockName) {
    attribute = blockUtils.findAttribute(
      state.malcolm.blocks,
      ownProps.blockName,
      ownProps.attributeName
    );
  }

  let widgetTagIndex = null;
  if (attribute && attribute.raw && attribute.raw.meta) {
    const { tags } = attribute.raw.meta;
    if (tags !== null) {
      widgetTagIndex = tags.findIndex(t => t.indexOf('widget:') !== -1);
    }
  }

  let alarm;
  let message;
  if (widgetTagIndex !== null) {
    alarm = getAlarmState(attribute);
    // note: we don't need to check attribute exists here as the only
    // way widgetTagIndex !== null is if attribute.raw.meta exists
    // (see line 148 and 145 above)
    message = attribute.raw.meta.description || EMPTY_STRING;
    message =
      attribute.raw.alarm &&
      attribute.raw.alarm.severity !== AlarmStates.NO_ALARM
        ? attribute.raw.alarm.message
        : message;
    message =
      attribute.calculated && attribute.calculated.errorState
        ? attribute.calculated.errorMessage
        : message;
  }

  return {
    widgetTagIndex,
    alarm,
    message,
    label:
      attribute && attribute.raw && attribute.raw.meta
        ? attribute.raw.meta.label
        : EMPTY_STRING,
    isMainAttribute:
      attribute &&
      attribute.calculated &&
      ownProps.blockName === state.malcolm.parentBlock &&
      state.malcolm.mainAttribute === attribute.calculated.name,
  };
};

const mapDispatchToProps = dispatch => ({
  buttonClickHandler: (blockName, attributeName) => {
    dispatch(navigationActions.navigateToInfo(blockName, attributeName));
  },
  nameClickHandler: path => {
    dispatch(navigationActions.navigateToAttribute(path[0], path[1]));
  },
});

export const AttributeDetailsComponent = AttributeDetails;
export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(AttributeDetails)
);
