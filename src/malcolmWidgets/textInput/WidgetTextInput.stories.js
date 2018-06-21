import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';

import ContainedTextInput from './WidgetTextInput.stories.container';

const textInput = (value, pending, units, error = false, dirty = false) => (
  <ContainedTextInput
    Error={error}
    Value={value}
    Pending={pending}
    submitEventHandler={action('submitted:')}
    focusHandler={action('focused')}
    blurHandler={action('blurred')}
    Units={units}
    isDirty={dirty}
    setDirty={action('set dirty flag to:')}
  />
);

storiesOf('Widgets/textinput', module)
  .add(
    'simple',
    withInfo(`
  textinput.
  `)(() => textInput('someText', false, null))
  )
  .add(
    'with units',
    withInfo(`
  textinput.
  `)(() => textInput('1.21', false, 'GW'))
  )
  .add(
    'errored',
    withInfo(`
  textinput.
  `)(() => textInput('someText', false, '', true, true))
  )
  .add(
    'disabled',
    withInfo(`
  textinput.
  `)(() => textInput('someText', true, null, false))
  );
