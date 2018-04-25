import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from 'material-ui/Drawer';
import DrawerHeader from './drawerHeader.component';

const DrawerContainer = props => (
  <div>
    <AppBar>
      <Toolbar disableGutters={false}>
        <IconButton>
          <MenuIcon />
        </IconButton>
        <Typography variant="title" color="inherit" noWrap>
          MalcolmJS
        </Typography>
      </Toolbar>
    </AppBar>
    <Drawer variant="persistent" open={props.open} anchor="left">
      <DrawerHeader />
      <div>Drawer contents</div>
    </Drawer>
    <Drawer variant="persistent" open={props.openSecondary} anchor="right">
      <DrawerHeader />
      <div>Drawer contents</div>
    </Drawer>
  </div>
);

DrawerContainer.propTypes = {
  open: PropTypes.bool.isRequired,
  openSecondary: PropTypes.bool.isRequired,
};

export default DrawerContainer;
