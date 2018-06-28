import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import Layout from '../layout/layout.component';
import { malcolmSelectBlock } from '../malcolm/malcolmActionCreators';
import AttributeAlarm, {
  AlarmStates,
} from '../malcolmWidgets/attributeDetails/attributeAlarm/attributeAlarm.component';
import blockUtils from '../malcolm/blockUtils';

import malcolmLogo from '../malcolm-logo.png';

const styles = () => ({
  container: {
    marginTop: 64,
    height: '100%',
    width: '100%',
  },
  layoutArea: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    height: 'calc(100vh - 64px)',
    backgroundColor: 'rgb(48, 48, 48)',
    backgroundImage:
      'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent)',
    backgroundSize: '50px 50px',
  },
  alarm: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    margin: 15,
    top: 5,
  },
  alarmText: {
    marginRight: 5,
  },
  tableArea: {
    width: '100%',
    height: 'calc(100vh - 64px)',
    backgroundColor: 'rgb(48, 48, 48)',
    align: 'center',
    verticalAlign: 'middle',
  },
});

const findAttributeComponent = props => {
  switch (props.mainAttribute) {
    case 'layout':
      return (
        <div className={props.classes.layoutArea}>
          <Layout />
          <div
            className={props.classes.alarm}
            style={{ left: props.openParent ? 365 : 5 }}
          >
            <AttributeAlarm alarmSeverity={props.mainAttributeAlarmState} />
          </div>
        </div>
      );
    case 'table':
      return (
        <div className={props.classes.tableArea}>
          <br />
          <br />
          <br />
          <br />
          <Typography variant="title">(╯°□°)╯︵ ┻━┻</Typography>
          <br />
          <br />
          <br />
          <br />
          <Typography variant="title">No table found!</Typography>
          <div
            className={props.classes.alarm}
            style={{ left: props.openParent ? 365 : 5 }}
          >
            <AttributeAlarm alarmSeverity={props.mainAttributeAlarmState} />
          </div>
        </div>
      );
    default:
      return (
        <div className={props.classes.tableArea}>
          <br />
          <br />
          <br />
          <img src={malcolmLogo} alt=" " />
        </div>
      );
  }
};

const resetSelection = dispatch => {
  dispatch(malcolmSelectBlock(''));
};

const MiddlePanelContainer = props => (
  <div
    className={props.classes.container}
    onClick={() => props.resetSelection()}
    role="presentation"
  >
    {findAttributeComponent(props)}
  </div>
);

const mapStateToProps = state => {
  const attribute = blockUtils.findAttribute(
    state.malcolm.blocks,
    state.malcolm.parentBlock,
    state.malcolm.mainAttribute
  );

  let alarm = AlarmStates.PENDING;

  if (attribute && attribute.alarm) {
    alarm = attribute.alarm.severity;
    alarm = attribute.errorState ? AlarmStates.MAJOR_ALARM : alarm;
    alarm = attribute.pending ? AlarmStates.PENDING : alarm;
  }

  return {
    mainAttribute: state.malcolm.mainAttribute,
    mainAttributeAlarmState: alarm,
    openParent: state.viewState.openParentPanel,
  };
};

const mapDispatchToProps = dispatch => ({
  resetSelection: () => resetSelection(dispatch),
});

findAttributeComponent.propTypes = {
  mainAttribute: PropTypes.string.isRequired,
  mainAttributeAlarmState: PropTypes.number.isRequired,
  openParent: PropTypes.bool.isRequired,
  classes: PropTypes.shape({
    layoutArea: PropTypes.string,
    alarm: PropTypes.string,
    alarmText: PropTypes.string,
    tableArea: PropTypes.string,
  }).isRequired,
};

MiddlePanelContainer.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
  }).isRequired,
  resetSelection: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(MiddlePanelContainer)
);
