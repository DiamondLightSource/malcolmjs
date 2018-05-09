import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import AttributeAlarm from './attributeAlarm/attributeAlarm.component';
import AttributeSelector from './attributeSelector/attributeSelector.component';

const styles = theme => ({
  div: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    width: '100%',
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
  },
});

const ableToRenderAttribute = attribute =>
  attribute &&
  Object.prototype.hasOwnProperty.call(attribute, 'unableToProcess');

const AttributeDetails = props => (
  <div>
    {ableToRenderAttribute(props.attribute) ? (
      <Typography style={{ padding: 8 }}>
        Unable to render attribute {props.attribute.name}
      </Typography>
    ) : (
      <div className={props.classes.div}>
        <AttributeAlarm alarmSeverity={props.attribute.alarm.severity} />
        <Typography className={props.classes.textName}>
          {props.attribute.meta.label}:{' '}
        </Typography>
        <div className={props.classes.controlContainer}>
          <AttributeSelector attribute={props.attribute} />
        </div>
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
    meta: PropTypes.shape({
      label: PropTypes.string,
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
