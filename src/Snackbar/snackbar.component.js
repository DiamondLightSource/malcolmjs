import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { malcolmSnackbarState } from '../malcolm/malcolmActionCreators';

const MessageSnackBar = props => (
  <Snackbar
    open={props.open}
    message={props.message}
    onClose={props.handleClose}
    autoHideDuration={4000}
    action={[
      <IconButton key="close" onClick={props.handleClose}>
        <CloseIcon />
      </IconButton>,
    ]}
  />
);

MessageSnackBar.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  open: state.malcolm.snackbar.open,
  message: state.malcolm.snackbar.message,
});

const mapDispatchToProps = dispatch => ({
  handleClose: () => dispatch(malcolmSnackbarState(false, '')),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageSnackBar);
