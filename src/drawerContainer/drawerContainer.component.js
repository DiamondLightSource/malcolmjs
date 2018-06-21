import React from 'react';
import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import DrawerHeader from './drawerHeader.component';
import {
  openParentPanel,
  closeChildPanel,
} from '../viewState/viewState.actions';
import NavBar from '../navbar/navbar.component';

const drawerWidth = 360;

const styles = () => ({
  drawer: {
    width: drawerWidth,
  },
  drawerContents: {
    maxWidth: '100%',
    height: '100%',
    overflowX: 'hidden',
  },
});

const baseUrl = `${window.location.protocol}//${window.location.host}`;

const DrawerContainer = props => (
  <div>
    <div>
      <NavBar />
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
          popOutAction={() =>
            props.popOutAction(baseUrl, drawerWidth, props.parentTitle)
          }
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
        <DrawerHeader
          closeAction={() => props.closeChild(props.urlPath)}
          title={props.childTitle}
          popOutAction={() =>
            props.popOutAction(baseUrl, drawerWidth, props.childTitle)
          }
        />
        {props.children[props.children.length - 1]}
      </div>
    </Drawer>
  </div>
);

const mapStateToProps = state => ({
  open: state.viewState.openParentPanel,
  openSecondary: state.malcolm.childBlock !== undefined,
  urlPath: state.router.location.pathname,
});

const mapDispatchToProps = dispatch => ({
  closeParent: () => dispatch(openParentPanel(false)),
  closeChild: urlPath => dispatch(closeChildPanel(urlPath)),
});

DrawerContainer.propTypes = {
  open: PropTypes.bool.isRequired,
  openSecondary: PropTypes.bool.isRequired,
  urlPath: PropTypes.string.isRequired,
  closeParent: PropTypes.func.isRequired,
  popOutAction: PropTypes.func.isRequired,
  closeChild: PropTypes.func.isRequired,
  parentTitle: PropTypes.string.isRequired,
  childTitle: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    drawer: PropTypes.string,
    drawerContents: PropTypes.string,
  }).isRequired,
  children: PropTypes.node,
};

DrawerContainer.defaultProps = {
  children: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(DrawerContainer)
);
