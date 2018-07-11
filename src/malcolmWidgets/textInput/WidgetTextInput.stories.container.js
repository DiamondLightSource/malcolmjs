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
      Error={props.Error}
      Value={props.Value}
      Pending={props.Pending}
      submitEventHandler={props.submitEventHandler}
      focusHandler={props.focusHandler}
      blurHandler={props.blurHandler}
      Units={props.Units}
      isDirty={props.isDirty}
      setFlag={props.setDirty}
    />
  </div>
);

ContainedTextInput.propTypes = {
  Error: PropTypes.bool.isRequired,
  Value: PropTypes.string.isRequired,
  submitEventHandler: PropTypes.func.isRequired,
  blurHandler: PropTypes.func.isRequired,
  focusHandler: PropTypes.func.isRequired,
  Pending: PropTypes.bool,
  Units: PropTypes.string,
  classes: PropTypes.shape({
    div: PropTypes.string,
  }).isRequired,
  isDirty: PropTypes.bool.isRequired,
  setDirty: PropTypes.func.isRequired,
};

ContainedTextInput.defaultProps = {
  Pending: false,
  Units: null,
};

export default withStyles(styles, { withTheme: true })(ContainedTextInput);
