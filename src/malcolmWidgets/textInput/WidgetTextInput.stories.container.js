import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import WidgetTextInput from './WidgetTextInput.component';

const styles = theme => ({
  div: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: theme.palette.background.paper,
    width: 148,
    padding: 10,
  },
});

const ContainedTextInput = props => (
  <div className={props.classes.div}>
    <WidgetTextInput
      Value={props.Value}
      Pending={props.Pending}
      submitEventHandler={props.submitEventHandler}
      focusHandler={props.focusHandler}
      blurHandler={props.blurHandler}
      Units={props.Units}
    />
  </div>
);

ContainedTextInput.propTypes = {
  Value: PropTypes.string.isRequired,
  submitEventHandler: PropTypes.func.isRequired,
  blurHandler: PropTypes.func.isRequired,
  focusHandler: PropTypes.func.isRequired,
  Pending: PropTypes.bool,
  Units: PropTypes.string,
  classes: PropTypes.shape({
    div: PropTypes.string,
  }).isRequired,
};

ContainedTextInput.defaultProps = {
  Pending: false,
  Units: null,
};

export default withStyles(styles, { withTheme: true })(ContainedTextInput);
