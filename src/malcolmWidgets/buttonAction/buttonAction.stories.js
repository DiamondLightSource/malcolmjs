import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import ButtonAction from './buttonAction.component';

const backgroundStyle = {
  width: 200,
  height: 100,
  backgroundColor: '#424242',
  padding: 10,
};

storiesOf('Widgets/ButtonAction', module).add(
  'default',
  withInfo(`
  A simple button to fire a method that the widget is bound to.
  `)(() => (
    <div style={backgroundStyle}>
      <ButtonAction text="View" clickAction={action('clicked')} />
    </div>
  ))
);
