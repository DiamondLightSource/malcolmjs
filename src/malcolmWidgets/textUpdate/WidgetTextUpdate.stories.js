import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import ContainedWidgetTextUpdate from './WidgetTextUpdate.stories.container';

const TextUpdate = (text, units) => (
  <ContainedWidgetTextUpdate Text={text} Units={units} />
);

storiesOf('Widgets/WidgetTextUpdate', module)
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
  )
  .add(
    'truncated text',
    withInfo(`
  A simple field for displaying some text (truncated text).
  `)(() =>
      TextUpdate(
        '3.1415926535 8979323846 2643383279 5028841971 6939937510 5820974944 5923078164 0628620899 8628034825 3421170679',
        null
      )
    )
  )
  .add(
    'truncated text with units',
    withInfo(`
  A simple field for displaying some text (truncated text).
  `)(() =>
      TextUpdate(
        '3.1415926535 8979323846 2643383279 5028841971 6939937510 5820974944 5923078164 0628620899 8628034825 3421170679',
        'rad'
      )
    )
  );
