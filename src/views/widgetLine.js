/**
 * Created by twi18192 on 27/04/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';

import WidgetLED from './widgetLED';
import WidgetCheckbox from './widgetCheckbox';
import WidgetTextUpdate from './widgetTextUpdate';
import WidgetTextInput from './widgetTextInput';
import WidgetCombo from "./widgetCombo";
import WidgetStatusIcon from './widgetStatusIcon';
import {ListItemText, ListItem, withStyles} from 'material-ui';

const styles = theme => ({
  paramLine: {
    padding: 0,
  },
  paramLabel: {
    width: theme.size.param,
    padding: 0,
    overflow: "hidden",
  },
  paramValue: {
    width: theme.size.param,
    marginRight: theme.spacing.unit * 2,
    overflow: "hidden",
  },
});

class WidgetLine extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    let valcheck = (nextProps.blockAttribute.value !== this.props.blockAttribute.value);
    let statusCheck = false;
    if ((nextProps.blockAttributeStatus !== undefined) && (this.props.blockAttributeStatus !== undefined)) {
      statusCheck = nextProps.blockAttributeStatus.value !== this.props.blockAttributeStatus.value;
    }

    return (valcheck || statusCheck)
  }

  render() {

    let widget;
    let {classes, blockName, blockAttribute, blockAttributeStatus,
      attributeName} = this.props;

    switch (this.props.widgetType) {

      case 'led':
        widget =
          <WidgetLED
            blockAttributeValue={blockAttribute.value}
            className={classes.paramValue}
          />;
        break;

      case 'textupdate':
        widget =
          <WidgetTextUpdate
            blockAttributeValue={blockAttribute.value.toString()}
            className={classes.paramValue}
          />;
        break;

      case 'textinput':
        widget =
          <WidgetTextInput
            blockName={blockName}
            attributeName={attributeName}
            blockAttributeValue={blockAttribute.value.toString()}
            className={classes.paramValue}
          />;
        break;

      case 'combo':
        widget =
          <WidgetCombo
            blockName={blockName}
            attributeName={attributeName}
            blockAttribute={blockAttribute}
            className={classes.paramValue}
          />;
        break;

      case 'checkbox':
        widget =
          <WidgetCheckbox
            blockName={blockName}
            attributeName={attributeName}
            blockAttributeValue={blockAttribute.value}
          />;
        break;

      case 'group':
      case 'icon':
      case 'title':
        // Already handled by sidePaneTabContents
        return null;

      default:
        break;

    }

    return (
      <ListItem dense disableGutters className={classes.paramLine}>
        <WidgetStatusIcon
          blockAttribute={blockAttribute}
          blockAttributeStatus={blockAttributeStatus}
          blockName={blockName}
          attributeName={attributeName}
        />
        <ListItemText
          className={classes.paramLabel}
          primary={blockAttribute.meta.label}
        />
        {widget}
      </ListItem>
    )
  }
}

WidgetLine.propTypes = {
  classes: PropTypes.object.isRequired,
  blockAttribute: PropTypes.object,
  blockAttributeStatus: PropTypes.object,
  blockName: PropTypes.string,
  attributeName: PropTypes.string,
  widgetType: PropTypes.string,
};

export default withStyles(styles)(WidgetLine);