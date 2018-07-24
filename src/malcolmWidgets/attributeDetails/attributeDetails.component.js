import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AttributeAlarm, {
  getAlarmState,
} from './attributeAlarm/attributeAlarm.component';
import AttributeSelector from './attributeSelector/attributeSelector.component';
import blockUtils from '../../malcolm/blockUtils';
import navigationActions from '../../malcolm/actions/navigation.actions';

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

const EMPTY_STRING = '';

const AttributeDetails = props => {
  if (props.widgetTagIndex !== null) {
    return (
      <div className={props.classes.div}>
        <Tooltip id="1" title={props.message} placement="bottom">
          <IconButton
            className={props.classes.button}
            disableRipple
            onClick={() =>
              props.buttonClickHandler(props.blockName, props.attributeName)
            }
          >
            <AttributeAlarm alarmSeverity={props.alarm} />
          </IconButton>
        </Tooltip>
        <Typography className={props.classes.textName}>
          {props.label}:{' '}
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
    message =
      attribute && attribute.raw && attribute.raw.meta.description
        ? attribute.raw.meta.description
        : EMPTY_STRING;
    message =
      attribute && attribute.calculated && attribute.calculated.errorMessage
        ? attribute.calculated.errorMessage
        : message;
  }

  return {
    widgetTagIndex,
    alarm,
    message,
    label: attribute.raw.meta ? attribute.raw.meta.label : EMPTY_STRING,
  };
};

const mapDispatchToProps = dispatch => ({
  buttonClickHandler: (blockName, attributeName) => {
    dispatch(navigationActions.navigateToInfo(blockName, attributeName));
  },
});

export const AttributeDetailsComponent = AttributeDetails;
export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(AttributeDetails)
);
