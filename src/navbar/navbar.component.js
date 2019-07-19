/* eslint jsx-a11y/no-static-element-interactions: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Settings from '@material-ui/icons/Settings';
import {
  openParentPanel,
  editThemeAction,
} from '../viewState/viewState.actions';
import NavControl from './navcontrol.component';
import navigationActions from '../malcolm/actions/navigation.actions';

const drawerWidth = 320;

const styles = theme => ({
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
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    width: 0,
    opacity: 0,
    overflow: 'hidden',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 0,
    transition: theme.transitions.create('margin-left', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  titleShift: {
    marginLeft: 20,
  },
  navPath: {
    marginRight: 10,
  },
});

const NavBar = props => (
  <AppBar
    className={classNames(props.classes.appBar, {
      [props.classes.appBarShift]: props.parentPanelOpen,
      [props.classes[`appBarShift-left`]]: props.parentPanelOpen,
    })}
  >
    <Toolbar disableGutters={!props.parentPanelOpen}>
      <IconButton
        onClick={props.openParent}
        className={classNames(
          props.classes.menuButton,
          props.parentPanelOpen && props.classes.hide
        )}
      >
        <MenuIcon />
      </IconButton>
      <div
        className={classNames(props.classes.title, {
          [props.classes.titleShift]: props.parentPanelOpen,
        })}
      >
        {props.navigation.length === 0 ? (
          <Typography>Select a root block</Typography>
        ) : null}
        {props.navigation.map(nav => (
          <NavControl
            key={nav.path}
            nav={nav}
            navigateToChild={child =>
              props.navigateToChild(nav.parent.basePath, child)
            }
          />
        ))}
        {props.finalNavHasChildren ? (
          <NavControl
            key={`${props.finalNav.path}++`}
            nav={props.finalNav}
            navigateToChild={child =>
              props.navigateToChild(
                props.navigation.length === 0 ? '/' : props.finalNav.basePath,
                child
              )
            }
            isFinalNav
          />
        ) : null}
      </div>
      <IconButton
        onClick={props.toggleThemeEditor}
        style={{
          position: 'absolute',
          right: props.childPanelOpen ? '364px' : '4px',
        }}
      >
        <Settings />
      </IconButton>
    </Toolbar>
  </AppBar>
);

const mapStateToProps = state => {
  const finalNav =
    state.malcolm.navigation.navigationLists.length === 0
      ? state.malcolm.navigation.rootNav
      : state.malcolm.navigation.navigationLists.slice(-1)[0];
  return {
    parentPanelOpen: state.viewState.openParentPanel,
    childPanelOpen:
      state.viewState.mobileViewIndex === undefined &&
      state.malcolm.childBlock !== undefined,
    navigation: state.malcolm.navigation.navigationLists,
    finalNav,
    finalNavHasChildren:
      finalNav && finalNav.children && finalNav.children.length !== 0,
  };
};

const mapDispatchToProps = dispatch => ({
  openParent: () => dispatch(openParentPanel(true)),
  toggleThemeEditor: () => dispatch(editThemeAction()),
  navigateToChild: (basePath, child) => {
    dispatch(
      push({
        pathname: `/gui${basePath}${child}`,
        search: window.location.search,
      })
    );
    dispatch(navigationActions.subscribeToChildren());
  },
});

NavBar.propTypes = {
  parentPanelOpen: PropTypes.bool.isRequired,
  childPanelOpen: PropTypes.bool.isRequired,
  navigation: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      children: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  finalNav: PropTypes.shape({
    path: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.string),
    basePath: PropTypes.string,
  }),
  finalNavHasChildren: PropTypes.bool.isRequired,
  openParent: PropTypes.func.isRequired,
  toggleThemeEditor: PropTypes.func.isRequired,
  navigateToChild: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    appBar: PropTypes.string,
    appBarShift: PropTypes.string,
    'appBarShift-left': PropTypes.string,
    'appBarShift-right': PropTypes.string,
    menuButton: PropTypes.string,
    hide: PropTypes.string,
    title: PropTypes.string,
    titleShift: PropTypes.string,
    navPath: PropTypes.string,
  }).isRequired,
};

NavBar.defaultProps = {
  navigation: [],
  finalNav: {
    path: '',
    children: [],
    basePath: '/',
  },
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(NavBar)
);
