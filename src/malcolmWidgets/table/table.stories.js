import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';

import ContainedTable from './table.stories.container';

const simpleAttribute = {
  labels: ['Test', '1', '2', '3'],
  values: {
    Test: ['#1', '#2', '#3'],
    '1': ['a', 'b', 'c'],
    '2': ['d', 'e', 'f'],
    '3': ['g', 'h', 'i'],
  },
};

const harderAttribute = {
  typeid: 'epics:nt/NTTable:1.0',
  path: ['PANDA', 'layout'],
  labels: ['name', 'mri', 'x', 'y', 'visible'],
  value: {
    typeid: 'malcolm:core/Table:1.0',
    name: ['TTLIN1', 'TTLIN2', 'INENC1', 'INENC2'],
    mri: ['PANDA:TTLIN1', 'PANDA:TTLIN2', 'PANDA:INENC1', 'PANDA:INENC2'],
    x: [0.0, 0.0, 0.0, 0.0],
    y: [0.0, 0.0, 0.0, 0.0],
    visible: [false, false, false, false],
  },
  alarm: {
    typeid: 'alarm_t',
    severity: 0,
    status: 0,
    message: '',
  },
  timeStamp: {
    typeid: 'time_t',
    secondsPastEpoch: 0,
    nanoseconds: 0,
    userTag: 0,
  },
  meta: {
    typeid: 'malcolm:core/TableMeta:1.0',
    description: 'Layout of child blocks',
    tags: ['widget:flowgraph'],
    writeable: true,
    label: 'Layout',
    elements: {
      name: {
        typeid: 'malcolm:core/StringArrayMeta:1.0',
        description: 'Names of the layout parts',
        tags: ['widget:textupdate'],
        writeable: false,
        label: '',
      },
      mri: {
        typeid: 'malcolm:core/StringArrayMeta:1.0',
        description: 'Malcolm full names of child blocks',
        tags: ['widget:textupdate'],
        writeable: false,
        label: '',
      },
      x: {
        typeid: 'malcolm:core/NumberArrayMeta:1.0',
        dtype: 'float64',
        description: 'X Coordinates of child blocks',
        tags: ['widget:textinput'],
        writeable: true,
        label: '',
      },
      y: {
        typeid: 'malcolm:core/NumberArrayMeta:1.0',
        dtype: 'float64',
        description: 'Y Coordinates of child blocks',
        tags: ['widget:textinput'],
        writeable: true,
        label: '',
      },
      visible: {
        typeid: 'malcolm:core/BooleanArrayMeta:1.0',
        description: 'Whether child blocks are visible',
        tags: ['widget:checkbox'],
        writeable: true,
        label: '',
      },
    },
  },
};

storiesOf('Widgets/WidgetTable', module)
  .add(
    'Simple Table',
    withInfo(`
    A simple table (containing text).
    `)(() => <ContainedTable attribute={simpleAttribute} simple />)
  )
  .add(
    'Complex Table',
    withInfo(`
    A more complex table (containing widgets).
    `)(() => (
      <ContainedTable
        attribute={harderAttribute}
        eventHandler={action(`row was changed!: `)}
      />
    ))
  );
