import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import FieldsLoading from './fieldsLoading.component';

const styles = {
  layout: {
    width: 400,
    backgroundColor: 'rgb(66,66,66)',
    display: 'block',
    textAlign: 'center',
  },
};

const displayContainer = node => <div style={styles.layout}>{node}</div>;

const fields = [
  { name: 'health', loading: true },
  { name: 'icon', loading: false },
  { name: 'parameters', loading: true },
];

storiesOf('Fields Loading', module).add(
  'default',
  withInfo(`
      A container to show the loading state of the attributes in a block
    `)(() => displayContainer(<FieldsLoading attributes={fields} />))
);
