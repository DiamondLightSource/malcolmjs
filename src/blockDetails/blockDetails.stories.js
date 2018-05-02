import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import BlockDetails from '../blockDetails/blockDetails.component';

const styles = {
  layout: {
    backgroundColor: 'rgb(66,66,66)',
    display: 'block',
    textAlign: 'center',
  },
};

const displayContainer = node => <div style={styles.layout}>{node}</div>;

storiesOf('Block Details', module)
  .add(
    'block loaded',
    withInfo(`
      A container to hold all the details about a block, typically attributes and methods.
    `)(() => displayContainer(<BlockDetails block={{ loading: false }} />))
  )
  .add(
    'block loading',
    withInfo(`
      Shows that the block details are loading
    `)(() => displayContainer(<BlockDetails block={{ loading: true }} />))
  );
