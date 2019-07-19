import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import SwipableViews from 'react-swipeable-views';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import NavigationClose from '@material-ui/icons/Close';
import ExpandMore from '@material-ui/icons/ExpandMore';
import BlockDetails from '../blockDetails/blockDetails.component';
import MiddlePanelContainer from './middlePanel.container';
import {
  openHeaderBar,
  setMobileViewIndex,
} from '../viewState/viewState.actions';
// eslint-disable-next-line import/no-named-as-default
import InfoDetails from '../infoDetails/infoDetails.component';
import NavTypes from '../malcolm/NavTypes';
import navigationActions from '../malcolm/actions/navigation.actions';
import NavControl from '../navbar/navcontrol.component';

const styles = theme => ({
  container: {
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    minHeight: '100vh',
    paddingTop: 1,
  },
  toolbar: {
    minWidth: 320,
    display: 'flex',
    padding: '0 8px',
  },
  title: {
    flexGrow: 1,
  },
});

const MalcolmMobile = props => {
  let display;
  if (props.currentViewIndex === undefined) {
    props.setViewIndex(props.navCount);
    return <div className={props.classes.container} />;
  }
  if (props.isRootNav) {
    display = [
      <div
        style={{
          width: '100%',
          paddingTop: props.openHeader ? '64px' : '0px',
          alignItems: 'center',
        }}
      >
        <NavControl
          key={`${props.rootNav.path}++`}
          nav={props.rootNav}
          navigateToChild={child => props.navigateToChild('/', child)}
          isFinalNav
          divOverride={{ display: 'block' }}
        />
      </div>,
    ];
  } else {
    display = props.displayElements.map(element => {
      switch (element.navType) {
        case NavTypes.Block:
          return (
            <div
              style={{
                width: '100%',
                paddingTop: props.openHeader ? '64px' : '0px',
              }}
            >
              <BlockDetails mri={element.blockMri} />
            </div>
          );
        case NavTypes.Info:
          return (
            <div
              style={{
                width: '100%',
                paddingTop: props.openHeader ? '64px' : '0px',
              }}
            >
              <InfoDetails />
            </div>
          );
        case NavTypes.Attribute:
          return (
            <div
              style={{
                height: props.openHeader ? 'calc(100vh - 64px)' : '100vh',
                width: '100%',
              }}
            >
              <MiddlePanelContainer
                mobile
                mri={[element.parent.blockMri, element.path]}
              />
            </div>
          );
        default:
          return <Typography>Error parsing address!</Typography>;
      }
    });
  }
  return (
    <div className={props.classes.container}>
      {!props.openHeader ? (
        <IconButton
          onClick={props.openAction}
          style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
            zIndex: 1000,
            height: '28px',
            width: '28px',
            padding: 0,
            marginLeft: '16px',
            marginTop: '4px',
          }}
        >
          <ExpandMore style={{ maxHeight: '28px', maxWidth: '28px' }} />
        </IconButton>
      ) : null}
      <Drawer
        anchor="top"
        open={props.openHeader}
        PaperProps={{ style: { height: '64px' } }}
        variant="persistent"
      >
        <AppBar>
          <Toolbar className={props.classes.toolbar}>
            <IconButton onClick={props.closeAction}>
              <NavigationClose />
            </IconButton>
            <Typography
              variant="title"
              color="inherit"
              className={props.classes.title}
            >
              {props.isRootNav
                ? 'Select a root block'
                : props.displayElements[props.currentViewIndex].label}
            </Typography>
          </Toolbar>
        </AppBar>
      </Drawer>
      <SwipableViews
        index={display.length - 1}
        onChangeIndex={props.setViewIndex}
      >
        {display}
      </SwipableViews>
    </div>
  );
};

const mapStateToProps = state => {
  const displayElements =
    state.malcolm.navigation.navigationLists.length > 0
      ? state.malcolm.navigation.navigationLists
      : [{}];
  const { rootNav } = state.malcolm.navigation;
  return {
    isRootNav: state.malcolm.navigation.navigationLists.length === 0,
    rootNav,
    displayElements,
    openHeader: state.viewState.openHeaderBar,
    navCount: state.malcolm.navigation.navigationLists.length - 1,
    currentViewIndex: state.viewState.mobileViewIndex,
  };
};

const mapDispatchToProps = dispatch => ({
  closeAction: () => {
    dispatch(openHeaderBar(false));
  },

  openAction: () => {
    dispatch(openHeaderBar(true));
  },
  navigateToChild: (basePath, child) => {
    dispatch(push(`/gui${basePath}${child}`));
    dispatch(navigationActions.subscribeToChildren());
  },
  setViewIndex: index => {
    // TODO: add hook to re-process layout if index changes to a flowgraph attribute (either here or in reducer)
    dispatch(setMobileViewIndex(index));
  },
});

MalcolmMobile.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
    toolbar: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  displayElements: PropTypes.arrayOf(
    PropTypes.shape({
      navType: PropTypes.string,
      label: PropTypes.string,
      blockMri: PropTypes.string,
    })
  ).isRequired,
  openHeader: PropTypes.bool.isRequired,
  closeAction: PropTypes.func.isRequired,
  openAction: PropTypes.func.isRequired,
  isRootNav: PropTypes.bool.isRequired,
  rootNav: PropTypes.shape({ path: PropTypes.string }).isRequired,
  navigateToChild: PropTypes.func.isRequired,
  setViewIndex: PropTypes.func.isRequired,
  currentViewIndex: PropTypes.number.isRequired,
  navCount: PropTypes.number.isRequired,
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(MalcolmMobile)
);
