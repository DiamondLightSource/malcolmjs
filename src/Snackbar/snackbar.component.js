import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles/index';
import { malcolmSnackbarState } from '../malcolm/malcolmActionCreators';

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
    autoHideDuration={5000}
    className={props.classes.snackbar}
    SnackbarContentProps={{ className: props.classes.snackbarContent }}
    action={[
      <IconButton key="close" onClick={props.handleClose} color="secondary">
        <CloseIcon />
      </IconButton>,
    ]}
  />
);

MessageSnackBar.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    snackbar: PropTypes.string.isRequired,
    snackbarContent: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  open: state.malcolm.snackbar.open,
  message: state.malcolm.snackbar.message,
});

const mapDispatchToProps = dispatch => ({
  handleClose: () => dispatch(malcolmSnackbarState(false, '')),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(MessageSnackBar)
);
