import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from 'material-ui/Drawer';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { connect } from 'react-redux';
import DrawerHeader from './drawerHeader.component';
import {
  openParentPanel,
  openChildPanel,
} from '../viewState/viewState.actions';

const drawerWidth = 320;

const styles = theme => ({
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'appBarShift-left': {
    marginLeft: drawerWidth,
  },
  'appBarShift-right': {
    marginRight: drawerWidth,
  },
  menuButton: {
    marginLeft: 12,
    opacity: 1,
    width: 48,
    transition: theme.transitions.create(['width', 'opacity'], {
      easing: theme.transitions.easing.easeInOut,
      duration: 2 * theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    width: 0,
    opacity: 0,
    overflow: 'hidden',
  },
  drawer: {
    width: 360,
  },
  drawerContents: {
    maxWidth: '100%',
    height: '100%',
    overflowX: 'hidden',
  },
  title: {
    marginLeft: 0,
    transition: theme.transitions.create('margin-left', {
      easing: theme.transitions.easing.easeInOut,
      duration: 2 * theme.transitions.duration.enteringScreen,
    }),
  },
  titleShift: {
    marginLeft: 20,
  },
});

const DrawerContainer = props => (
  <div>
    <div>
      <AppBar
        className={classNames(props.classes.appBar, {
          [props.classes.appBarShift]: props.open,
          [props.classes[`appBarShift-left`]]: props.open,
        })}
      >
        <Toolbar disableGutters={!props.open}>
          <IconButton
            onClick={props.openParent}
            className={classNames(
              props.classes.menuButton,
              props.open && props.classes.hide
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            className={classNames(props.classes.title, {
              [props.classes.titleShift]: props.open,
            })}
          >
            PANDABOX
          </Typography>
        </Toolbar>
      </AppBar>
      {props.children.filter(
        (c, i) => i !== 0 && i !== props.children.length - 1
      )}
    </div>
    <Drawer
      variant="persistent"
      open={props.open}
      anchor="left"
      classes={{ paper: props.classes.drawer }}
    >
      <div className={props.classes.drawerContents}>
        <DrawerHeader
          closeAction={props.closeParent}
          title={props.parentTitle}
        />
        {props.children[0]}
      </div>
    </Drawer>
    <Drawer
      variant="persistent"
      open={props.openSecondary}
      anchor="right"
      classes={{ paper: props.classes.drawer }}
    >
      <div className={props.classes.drawerContents}>
        <DrawerHeader closeAction={props.closeChild} title={props.childTitle} />
        {props.children[props.children.length - 1]}
      </div>
    </Drawer>
  </div>
);

const mapStateToProps = state => ({
  open: state.viewState.openParentPanel,
  openSecondary: state.viewState.openChildPanel,
});

const mapDispatchToProps = dispatch => ({
  openParent: () => dispatch(openParentPanel(true)),
  closeParent: () => dispatch(openParentPanel(false)),
  closeChild: () => dispatch(openChildPanel(false)),
});

DrawerContainer.propTypes = {
  open: PropTypes.bool.isRequired,
  openSecondary: PropTypes.bool.isRequired,
  openParent: PropTypes.func.isRequired,
  closeParent: PropTypes.func.isRequired,
  closeChild: PropTypes.func.isRequired,
  parentTitle: PropTypes.string.isRequired,
  childTitle: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    appBar: PropTypes.string,
    appBarShift: PropTypes.string,
    'appBarShift-left': PropTypes.string,
    'appBarShift-right': PropTypes.string,
    menuButton: PropTypes.string,
    hide: PropTypes.string,
    title: PropTypes.string,
    titleShift: PropTypes.string,
    drawer: PropTypes.string,
    drawerContents: PropTypes.string,
  }).isRequired,
  children: PropTypes.node.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(DrawerContainer)
);
