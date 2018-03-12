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
  },
  disconnected: {
    color: theme.palette.disconnected
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

    let {classes, blockAttributeStatus, blockAttributeAlarm, theme} = this.props;
  let icon = <Icon>info_outline</Icon>;

    if (blockAttributeStatus !== undefined) {
      switch (blockAttributeStatus.value) {
        case 'pending':
          icon = <CircularProgress size={theme.spacing.unit * 3}/>;
          break;
        case 'failure':
          icon = <Icon color="error">error</Icon>;
          break;
        default:
          break;
      }
    }

    if (blockAttributeAlarm !== undefined) {
      switch(blockAttributeAlarm.severity) {
        case AlarmStatus.UNDEFINED_ALARM:
        case AlarmStatus.INVALID_ALARM:
          icon = <Icon className={classes.disconnected}>highlight_off</Icon>;
          break;
        case AlarmStatus.MAJOR_ALARM:
          icon = <Icon color="error">error</Icon>;
          break;
        case AlarmStatus.MINOR_ALARM:
          icon = <Icon className={classes.warning}>warning</Icon>;
          break;
        default:
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
  theme: PropTypes.object.isRequired,
  blockAttributeAlarm: PropTypes.object,
  blockAttributeStatus: PropTypes.object,
  blockName: PropTypes.string,
  attributeName: PropTypes.string
};

export default withStyles(styles, {withTheme: true})(WidgetStatusIcon);