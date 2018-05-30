import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';

import ContainedTextInput from './WidgetTextInput.stories.container';

const submitAction = action('submitted:');

const submitEvent = event => {
  if (event.key === 'Enter') {
    submitAction(event.target.value);
  }
};

const checkbox = (value, pending, units) => (
  <ContainedTextInput
    Value={value}
    Pending={pending}
    submitEventHandler={submitEvent}
    focusHandler={action('focused')}
    blurHandler={action('blurred')}
    Units={units}
  />
);

storiesOf('Widgets/textinput', module)
  .add(
    'simple',
    withInfo(`
  textinput.
  `)(() => checkbox('someText', false, null))
  )
  .add(
    'with units',
    withInfo(`
  textinput.
  `)(() => checkbox('1.21', false, 'GW'))
  )
  .add(
    'disabled',
    withInfo(`
  textinput.
  `)(() => checkbox('someText', true, null))
  );
