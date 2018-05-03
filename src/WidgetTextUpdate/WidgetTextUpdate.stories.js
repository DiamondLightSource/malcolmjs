import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import WidgetTextUpdate from './WidgetTextUpdate.component';

const TextUpdate = (text, units) => (
  <WidgetTextUpdate Text={text} Units={units} />
);

storiesOf('WidgetTextUpdate', module)
  .add(
    'Hello world',
    withInfo(`
  A simple field for displaying some text.
  `)(() => TextUpdate('Hello World!', null))
  )
  .add(
    'Power level',
    withInfo(`
  A simple field for displaying some text (with units).
  `)(() => TextUpdate('1.21', 'GW'))
  );
