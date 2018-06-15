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
  },
});

const ButtonAction = props => (
  <div className={props.classes.container}>
    <Button
      variant="raised"
      color="primary"
      className={props.classes.button}
      onClick={props.clickAction}
    >
      {props.text}
    </Button>
  </div>
);

ButtonAction.propTypes = {
  text: PropTypes.string.isRequired,
  clickAction: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    button: PropTypes.string,
    container: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles, { withTheme: true })(ButtonAction);
