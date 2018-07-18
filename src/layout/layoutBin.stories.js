import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import configureStore from 'redux-mock-store';
import LayoutBin from './layoutBin.component';

const backgroundStyle = {
  width: 200,
  height: 200,
  backgroundColor: 'rgb(48, 48, 48)',
  backgroundImage:
    'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent)',
  backgroundSize: '50px 50px',
  padding: 30,
};

const mockStore = configureStore();

const state = {};

const store = mockStore(state);
store.dispatch = msg => action('dispatch')(msg);

storiesOf('Layout/Bin', module).add('default', () => (
  <div style={backgroundStyle}>
    <LayoutBin store={store} />
  </div>
));
