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
  if (props.attribute && props.attribute.raw && props.attribute.raw.meta) {
    const { tags } = props.attribute.raw.meta;
    if (tags !== null) {
      widgetTagIndex = tags.findIndex(t => t.indexOf('widget:') !== -1);
    }
  }
  if (widgetTagIndex !== null) {
    let alarm = props.attribute.raw.alarm.severity;
    alarm = props.attribute.calculated.errorState
      ? AlarmStates.MAJOR_ALARM
      : alarm;
    alarm = props.attribute.calculated.dirty ? AlarmStates.DIRTY : alarm;
    alarm =
      props.attribute.calculated.dirty && props.attribute.calculated.errorState
        ? AlarmStates.DIRTYANDERROR
        : alarm;
    alarm = props.attribute.calculated.pending ? AlarmStates.PENDING : alarm;
    const message = props.attribute.calculated.errorMessage
      ? props.attribute.calculated.errorMessage
      : '';

    return (
      <div className={props.classes.div}>
        <Tooltip id="1" title={message} placement="bottom">
          <IconButton className={props.classes.button} disableRipple>
            <AttributeAlarm alarmSeverity={alarm} />
          </IconButton>
        </Tooltip>
        <Typography className={props.classes.textName}>
          {props.attribute.raw.meta.label}:{' '}
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
    calculated: PropTypes.shape({
      name: PropTypes.string,
      pending: PropTypes.bool,
      errorState: PropTypes.bool,
      errorMessage: PropTypes.string,
      unableToProcess: PropTypes.bool,
      dirty: PropTypes.bool,
    }),
    raw: PropTypes.shape({
      meta: PropTypes.shape({
        label: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
      }),
      alarm: PropTypes.shape({
        severity: PropTypes.number,
      }),
    }),
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
