import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AttributeAlarm from './attributeAlarm/attributeAlarm.component';
import AttributeSelector from './attributeSelector/attributeSelector.component';

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
    return (
      <div className={props.classes.div}>
        {props.attribute.pending ? (
          <AttributeAlarm alarmSeverity={-1} />
        ) : (
          <AttributeAlarm alarmSeverity={props.attribute.alarm.severity} />
        )}
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
  }).isRequired,
};

export const AttributeDetailsComponent = AttributeDetails;
export default withStyles(styles, { withTheme: true })(AttributeDetails);
