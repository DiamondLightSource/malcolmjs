import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles/index';
import { snackbarState } from '../viewState/viewState.actions';

const styles = theme => ({
  snackbarContent: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.textColor,
    height: 20,
    padding: 6,
    flexWrap: 'nowrap',
  },
  snackbar: {
    position: 'absolute',
    bottom: '50px',
    margin: 2,
  },
});

const MessageSnackBar = props => (
  <Snackbar
    open={props.open}
    message={props.message}
    onClose={props.handleClose}
    autoHideDuration={props.timeout}
    className={props.classes.snackbar}
    ContentProps={{ className: props.classes.snackbarContent }}
    action={[
      <IconButton key="close" onClick={props.handleClose}>
        <CloseIcon />
      </IconButton>,
    ]}
  />
);

MessageSnackBar.propTypes = {
  timeout: PropTypes.number,
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    snackbar: PropTypes.string.isRequired,
    snackbarContent: PropTypes.string.isRequired,
  }).isRequired,
};

MessageSnackBar.defaultProps = {
  timeout: null,
};

const mapStateToProps = state => ({
  open: state.viewState.snackbar.open,
  message: state.viewState.snackbar.message,
});

const mapDispatchToProps = dispatch => ({
  handleClose: () => dispatch(snackbarState(false, '')),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(MessageSnackBar)
);
