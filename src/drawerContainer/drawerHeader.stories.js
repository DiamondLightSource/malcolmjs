import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import DrawerHeader from './drawerHeader.component';

storiesOf('Drawer Header', module).add(
  'default',
  withInfo(`
  The header for the drawers either side for the parent and child block details.
  `)(() => (
    <MuiThemeProvider>
      <DrawerHeader />
    </MuiThemeProvider>
  ))
);
