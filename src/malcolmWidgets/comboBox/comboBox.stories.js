import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';

import WidgetComboBox from './comboBox.component';

const checkbox = (value, pending) => (
  <WidgetComboBox
    Value={value}
    Pending={pending}
    Choices={['1', '2', '3']}
    selectEventHandler={action('selected:')}
  />
);

storiesOf('Widgets/combobbox', module).add(
  'simple',
  withInfo(`
  A simple combobox.
  `)(() => checkbox('2', false))
);
