import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ContainedSimpleTable from './table.stories.container';

storiesOf('Widgets/WidgetTable', module).add(
  'Table',
  withInfo(`
  A simple table (containing text).
  `)(() => (
    <ContainedSimpleTable
      labels={['Test', '1', '2', '3']}
      values={{
        Test: ['#1', '#2', '#3'],
        '1': ['a', 'b', 'c'],
        '2': ['d', 'e', 'f'],
        '3': ['g', 'h', 'i'],
      }}
    />
  ))
);
