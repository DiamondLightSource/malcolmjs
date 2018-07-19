import React from 'react';
import PropTypes from 'prop-types';
import Delete from '@material-ui/icons/Delete';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import layoutAction from '../malcolm/actions/layout.action';

const styles = theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderStyle: 'dashed',
    borderThickness: 4,
    borderColor: theme.palette.secondary.light,
    color: theme.palette.secondary.light,
    cursor: 'move',
    '&:hover': {
      borderColor: theme.palette.secondary.main,
      color: theme.palette.secondary.main,
      // backgroundColor: theme.palette.secondary.contrastText,
      boxShadow: `0 0 20px ${theme.palette.secondary.light}`,
    },
  },
  icon: {
    width: 30,
    height: 30,
    color: 'inherit',
    cursor: 'inherit',
  },
});

const LayoutBin = props => (
  <div
    className={props.classes.container}
    onMouseEnter={props.mouseEnter}
    onMouseLeave={props.mouseLeave}
    onMouseUp={props.mouseUpHandler}
    role="presentation"
  >
    <Delete className={props.classes.icon} />
  </div>
);

export const mapStateToProps = () => ({});

export const mapDispatchToProps = dispatch => ({
  mouseEnter: () => {
    dispatch(layoutAction.mouseInsideDeleteZone(true));
  },
  mouseLeave: () => {
    dispatch(layoutAction.mouseInsideDeleteZone(false));
  },
  mouseUpHandler: () => {
    dispatch(layoutAction.showLayoutBin(false));
    dispatch(layoutAction.deleteBlocks());
  },
});

LayoutBin.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
    icon: PropTypes.string,
  }).isRequired,
  mouseEnter: PropTypes.func.isRequired,
  mouseLeave: PropTypes.func.isRequired,
  mouseUpHandler: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(LayoutBin)
);
