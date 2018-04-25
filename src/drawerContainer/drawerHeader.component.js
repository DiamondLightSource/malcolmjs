import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import NavigationClose from '@material-ui/icons/Close';
import OpenInNew from '@material-ui/icons/OpenInNew';

const styles = {
  toolbar: {
    minWidth: 320,
    display: 'flex',
  },
  title: {
    flexGrow: 1,
  },
};

const DrawerHeader = () => (
  <div>
    <AppBar position="static">
      <Toolbar style={styles.toolbar}>
        <IconButton>
          <NavigationClose />
        </IconButton>
        <Typography variant="title" color="inherit" style={styles.title}>
          Title
        </Typography>
        <IconButton>
          <OpenInNew />
        </IconButton>
      </Toolbar>
    </AppBar>
  </div>
);

export default DrawerHeader;
