import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import configureStore from 'redux-mock-store';

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
const mockStore = configureStore();

const block = loading => ({
  loading,
  attributes: [
    { name: 'health', loading: true },
    { name: 'icon', loading: false },
  ],
});

const buildState = loading => ({
  malcolm: {
    parentBlock: 'block1',
    blocks: {
      block1: block(loading),
    },
  },
});

storiesOf('Details/Block Details', module)
  .add(
    'block meta loaded - attributes loading',
    withInfo(`
      What the block details component looks like when the block meta data has loaded but the attribute data is still being loaded.
    `)(() =>
      displayContainer(
        <BlockDetails parent store={mockStore(buildState(false))} />
      )
    )
  )
  .add(
    'block loading',
    withInfo(`
      Shows that the block details are loading
    `)(() =>
      displayContainer(
        <BlockDetails parent store={mockStore(buildState(true))} />
      )
    )
  )
  .add(
    'block not found',
    withInfo(`
      Shows that the block details could not be found
    `)(() =>
      displayContainer(
        <BlockDetails parent store={mockStore(buildState(404))} />
      )
    )
  );
