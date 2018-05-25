import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import ContainedWidgetTextUpdate from './WidgetTextUpdate.stories.container';

const TextUpdate = (text, units) => (
  <ContainedWidgetTextUpdate Text={text} Units={units} />
);

storiesOf('WidgetTextUpdate', module)
  .add(
    'simple text',
    withInfo(`
  A simple field for displaying some text.
  `)(() => TextUpdate('Hello World!', null))
  )
  .add(
    'text with units',
    withInfo(`
  A simple field for displaying some text (with units).
  `)(() => TextUpdate('1.21', 'GW'))
  )
  .add(
    'text supplied as number',
    withInfo(`
  A simple field for displaying some text (with units).
  `)(() => TextUpdate(1.21, 'GW'))
  );
