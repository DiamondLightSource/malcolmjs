import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import BlockDetails from '../blockDetails/blockDetails.component';

const styles = {
  layout: {
    backgroundColor: 'rgb(66,66,66)',
    display: 'block',
    textAlign: 'center',
    width: 400,
    height: 300,
    paddingTop: 1,
  },
};

const displayContainer = node => <div style={styles.layout}>{node}</div>;

const block = loading => ({
  loading,
  attributes: [
    { name: 'health', loading: true },
    { name: 'icon', loading: false },
  ],
});

storiesOf('Details/Block Details', module)
  .add(
    'block meta loaded - attributes loading',
    withInfo(`
      What the block details component looks like when the block meta data has loaded but the attribute data is still being loaded.
    `)(() => displayContainer(<BlockDetails block={block(false)} />))
  )
  .add(
    'block loading',
    withInfo(`
      Shows that the block details are loading
    `)(() => displayContainer(<BlockDetails block={block(true)} />))
  );
