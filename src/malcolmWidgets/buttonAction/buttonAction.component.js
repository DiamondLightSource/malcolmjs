import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const styles = () => ({
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    paddingTop: 4,
    paddingBottom: 4,
    minHeight: 28,
    maxHeight: 28,
  },
});

const ButtonAction = props => (
  <div className={props.classes.container}>
    <Button
      color="primary"
      variant={props.method ? 'raised' : ''}
      className={props.classes.button}
      onClick={props.clickAction}
      disabled={props.disabled}
    >
      {props.text}
    </Button>
  </div>
);

ButtonAction.propTypes = {
  method: PropTypes.bool,
  text: PropTypes.string.isRequired,
  clickAction: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  classes: PropTypes.shape({
    button: PropTypes.string,
    container: PropTypes.string,
  }).isRequired,
};

ButtonAction.defaultProps = {
  method: false,
  disabled: false,
};

export default withStyles(styles, { withTheme: true })(ButtonAction);
