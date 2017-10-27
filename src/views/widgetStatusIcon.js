/**
 * Created by twi18192 on 18/04/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import {Icon, IconButton, CircularProgress, withStyles} from 'material-ui';
import paneActions from '../actions/paneActions';


const AlarmStatus = {
  NO_ALARM: 0,
  MINOR_ALARM: 1,
  MAJOR_ALARM: 2,
  INVALID_ALARM: 3,
  UNDEFINED_ALARM: 4
};

const styles = theme => ({
  warning: {
    color: theme.palette.warning
  }
});

class WidgetStatusIcon extends React.Component {
  onButtonClick = () => {
    /* Needs to open the modal dialog box,
     so that info needs to be in a store
     so I can change it via an action
     (since it's in a separate component)
     */
    paneActions.openModalDialogBox({
      blockName: this.props.blockName,
      attributeName: this.props.attributeName,
      message: this.props.blockAttributeStatus.message
    });
  };

  render() {

    /* Decide which icon to display,
     go through the 'alarm' subattribute
     and also look at the websocket success
     or fail somehow too
     */

    let {classes, blockAttributeStatus, blockAttribute} = this.props;
    let icon = "info_outline";

    switch(blockAttributeStatus) {
      case 'pending':
        icon = <CircularProgress/>;
        break;
      case 'failure':
        icon = <Icon color="error">error</Icon>;
        break;
    }

    if (blockAttribute.alarm !== undefined) {
      switch(blockAttribute.alarm.severity) {
        case AlarmStatus.UNDEFINED_ALARM:
          icon = <Icon color="error">bug_report</Icon>;
          break;
        case AlarmStatus.INVALID_ALARM:
          icon = "highlight_off";
          break;
        case AlarmStatus.MAJOR_ALARM:
          icon = <Icon color="error">error</Icon>;
          break;
        case AlarmStatus.MINOR_ALARM:
          icon = <Icon className={classes.warning}>warning</Icon>;
          break;
      }
    }

    return (
      <IconButton onClick={this.onButtonClick}>
        {icon}
      </IconButton>
    );
  }
}

WidgetStatusIcon.propTypes = {
  classes: PropTypes.object.isRequired,  
  blockAttribute: PropTypes.object,
  blockAttributeStatus: PropTypes.object,
  blockName: PropTypes.string,
  attributeName: PropTypes.string
};

export default withStyles(styles)(WidgetStatusIcon);