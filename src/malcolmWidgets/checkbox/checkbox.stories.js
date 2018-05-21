import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';

import WidgetCheckbox from './checkbox.component';

const checkbox = (checked, pending) => (
  <WidgetCheckbox
    CheckState={checked}
    checkEventHandler={action('toggleCheck')}
    Pending={pending}
    Label="testCheckbox"
  />
);

storiesOf('checkbox', module)
  .add(
    'unchecked',
    withInfo(`
  A simple checkbox for displaying and toggling on/off status; currently turned off.
  `)(() => checkbox(false, false))
  )
  .add(
    'checked',
    withInfo(`
  A simple checkbox for displaying and toggling on/off status; currently turned on.
  `)(() => checkbox(true, false))
  )
  .add(
    'pending',
    withInfo(`
  A simple checkbox for displaying and toggling on/off status; currently pending.
  `)(() => checkbox(true, true))
  );
