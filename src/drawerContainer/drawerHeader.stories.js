import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import DrawerHeader from './drawerHeader.component';

storiesOf('Drawer Header', module).add(
  'default',
  withInfo(`
  The header for the drawers either side for the parent and child block details.
  `)(() => <DrawerHeader closeAction={action('closed')} />)
);
