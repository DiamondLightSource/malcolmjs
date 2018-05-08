import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import AttributeAlarm from './attributeAlarm/attributeAlarm.component';

const styles = theme => ({
  div: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    width: '100%',
  },
  textName: {
    alignSelf: 'Center',
    flexGrow: 1,
    textAlign: 'Left',
    marginLeft: 4,
    marginRight: 4,
  },
  controlContainer: {
    alignSelf: 'Center',
    width: 150,
  },
});

const ableToRenderAttribute = attribute =>
  attribute &&
  Object.prototype.hasOwnProperty.call(attribute, 'unableToProcess');

const AttributeDetails = props => (
  <div>
    {ableToRenderAttribute(props.attribute) ? (
      <Typography>Unable to render attribute {props.attribute.name}</Typography>
    ) : (
      <div className={props.classes.div}>
        <AttributeAlarm alarmSeverity={props.attribute.alarm.severity} />
        <Typography className={props.classes.textName}>
          {props.attribute.name}:{' '}
        </Typography>
        <div className={props.classes.controlContainer}>{props.children}</div>
      </div>
    )}
  </div>
);

AttributeDetails.propTypes = {
  attribute: PropTypes.shape({
    name: PropTypes.string,
    alarm: PropTypes.shape({
      severity: PropTypes.number,
    }),
    unableToProcess: PropTypes.bool,
  }).isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    div: PropTypes.string,
    textName: PropTypes.string,
    controlContainer: PropTypes.string,
  }).isRequired,
};

export const AttributeDetailsComponent = AttributeDetails;
export default withStyles(styles, { withTheme: true })(AttributeDetails);
