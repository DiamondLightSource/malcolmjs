import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AttributeAlarm, {
  AlarmStates,
} from './attributeAlarm/attributeAlarm.component';
import AttributeSelector from './attributeSelector/attributeSelector.component';
import blockUtils from '../../malcolm/blockUtils';

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

const AttributeDetails = props => {
  let widgetTagIndex = null;
  if (Object.prototype.hasOwnProperty.call(props.attribute, 'meta')) {
    const { tags } = props.attribute.meta;
    if (tags !== null) {
      widgetTagIndex = tags.findIndex(t => t.indexOf('widget:') !== -1);
    }
  }
  if (widgetTagIndex !== null) {
    let alarm = props.attribute.alarm.severity;
    alarm = props.attribute.errorState ? AlarmStates.MAJOR_ALARM : alarm;
    alarm = props.attribute.pending ? AlarmStates.PENDING : alarm;
    const message = props.attribute.errorMessage
      ? props.attribute.errorMessage
      : '';
    return (
      <div className={props.classes.div}>
        <Tooltip id="1" title={message} placement="bottom">
          <IconButton className={props.classes.button} disableRipple>
            <AttributeAlarm alarmSeverity={alarm} />
          </IconButton>
        </Tooltip>
        <Typography className={props.classes.textName}>
          {props.attribute.meta.label}:{' '}
        </Typography>
        <div className={props.classes.controlContainer}>
          <AttributeSelector attribute={props.attribute} />
        </div>
      </div>
    );
  }
  return null;
};

AttributeDetails.propTypes = {
  attribute: PropTypes.shape({
    name: PropTypes.string,
    pending: PropTypes.bool,
    errorState: PropTypes.bool,
    errorMessage: PropTypes.string.isOptional,
    alarm: PropTypes.shape({
      severity: PropTypes.number,
    }),
    meta: PropTypes.shape({
      label: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    }),
    unableToProcess: PropTypes.bool,
  }).isRequired,
  classes: PropTypes.shape({
    div: PropTypes.string,
    textName: PropTypes.string,
    controlContainer: PropTypes.string,
    button: PropTypes.string,
  }).isRequired,
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

  return {
    attribute,
  };
};

export const AttributeDetailsComponent = AttributeDetails;
export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(AttributeDetails)
);
