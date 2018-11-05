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
    style={{ marginBottom: props.footerHeight + 2 }}
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
  footerHeight: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    snackbar: PropTypes.string.isRequired,
    snackbarContent: PropTypes.string.isRequired,
  }).isRequired,
};

MessageSnackBar.defaultProps = {
  timeout: null,
};

const mapStateToProps = state => {
  const isDetailsRoute = state.router.location.pathname.startsWith('/details/');

  return {
    open: state.viewState.snackbar.open,
    message: state.viewState.snackbar.message,
    footerHeight: isDetailsRoute ? 0 : state.viewState.footerHeight,
  };
};

const mapDispatchToProps = dispatch => ({
  handleClose: () => dispatch(snackbarState(false, '')),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(MessageSnackBar)
);
