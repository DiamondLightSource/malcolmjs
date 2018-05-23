import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { openParentPanel } from '../viewState/viewState.actions';
import NavControl from './navcontrol.component';

const drawerWidth = 320;

const processNavigationLists = (paths, blocks) => {
  const navigationLists = paths.map(p => ({
    path: p,
    children: [],
  }));

  if (navigationLists.length === 0) {
    navigationLists.push({
      path: '',
      children: [],
    });
  }

  if (Object.prototype.hasOwnProperty.call(blocks, '.blocks')) {
    navigationLists[0].children = blocks['.blocks'].children;
  }

  let previousBlock;
  for (let i = 1; i < paths.length; i += 1) {
    const path = paths[i - 1];

    if (Object.prototype.hasOwnProperty.call(blocks, path)) {
      previousBlock = blocks[path];
      navigationLists[i].children = previousBlock.children;
    } else if (previousBlock && previousBlock.attributes) {
      const matchingAttribute = previousBlock.attributes.findIndex(
        a => a.name === path
      );
      if (matchingAttribute > -1) {
        const attribute = previousBlock.attributes[matchingAttribute];
        navigationLists[i].children = attribute.children;
      }
    }
  }

  return navigationLists;
};

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
      <div
        className={classNames(props.classes.title, {
          [props.classes.titleShift]: props.open,
        })}
      >
        {props.navigation.map(nav => <NavControl key={nav.path} nav={nav} />)}
        {props.navigation.length === 1 && props.navigation[0].path === '' ? (
          <Typography>Select a root node</Typography>
        ) : null}
      </div>
    </Toolbar>
  </AppBar>
);

const mapStateToProps = state => ({
  open: state.viewState.openParentPanel,
  navigation: processNavigationLists(
    state.malcolm.navigation,
    state.malcolm.blocks
  ),
});

const mapDispatchToProps = dispatch => ({
  openParent: () => dispatch(openParentPanel(true)),
});

NavBar.propTypes = {
  open: PropTypes.bool.isRequired,
  navigation: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      children: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  openParent: PropTypes.func.isRequired,
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
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(NavBar)
);
