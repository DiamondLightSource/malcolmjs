import * as React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'material-ui/Checkbox';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import { darken, lighten } from 'material-ui/styles/colorManipulator';

const styles = theme => ({
  div: {
    backgroundColor: theme.palette.background.paper,
  },
  checkBoxRoot: {
    color: lighten(theme.palette.primary.light, 0.1),
    '&$checkBoxChecked': {
      color: theme.palette.primary.light,
    },
  },
  checkBoxChecked: {},

  spinner: {
    size: 44,
    color: darken(theme.palette.primary.light, 0.25),
  },
});

const WidgetCheckbox = props => (
  <div className={props.classes.div}>
    {props.Pending ? (
      <CircularProgress size={44} className={props.classes.spinner} />
    ) : (
      <Checkbox
        checked={props.CheckState}
        onChange={props.checkEventHandler}
        classes={{
          root: props.classes.checkBoxRoot,
          checked: props.classes.checkBoxChecked,
        }}
        value={props.Label}
      />
    )}
  </div>
);

WidgetCheckbox.propTypes = {
  CheckState: PropTypes.bool.isRequired,
  checkEventHandler: PropTypes.func.isRequired,
  Pending: PropTypes.bool,
  Label: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    div: PropTypes.string,
    checkBoxRoot: PropTypes.string,
    checkBoxChecked: PropTypes.string,
    spinner: PropTypes.string,
  }).isRequired,
};

WidgetCheckbox.defaultProps = {
  Pending: false,
};

export default withStyles(styles, { withTheme: true })(WidgetCheckbox);
