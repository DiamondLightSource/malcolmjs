import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import BlockDetails from '../blockDetails/blockDetails.component';

storiesOf('Block Details', module).add(
  'default',
  withInfo(`
  A container to hold all the details about a block, typically attributes and methods.
`)(() => <BlockDetails />)
);
