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
  <div className={props.classes.container} style={props.style} id={props.id}>
    <Button
      color="primary"
      variant={props.method ? 'raised' : 'flat'}
      className={props.classes.button}
      onClick={props.clickAction}
      disabled={props.disabled}
      style={props.fontSize ? { fontSize: props.fontSize } : {}}
    >
      {props.text}
    </Button>
  </div>
);

ButtonAction.propTypes = {
  style: PropTypes.shape({}),
  method: PropTypes.bool,
  text: PropTypes.string.isRequired,
  clickAction: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  classes: PropTypes.shape({
    button: PropTypes.string,
    container: PropTypes.string,
  }).isRequired,
  fontSize: PropTypes.number,
  id: PropTypes.string,
};

ButtonAction.defaultProps = {
  method: false,
  disabled: false,
  style: {},
  fontSize: undefined,
  id: undefined,
};

export default withStyles(styles, { withTheme: true })(ButtonAction);
