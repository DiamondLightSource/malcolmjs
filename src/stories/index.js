import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

const req = require.context('../', true, /\.stories\.js$/);

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
  },
  alarmState: {
    warning: '#e6c01c',
  },
});

const MaterialUIThemeDecorator = storyFn => (
  <MuiThemeProvider theme={theme}>{storyFn()}</MuiThemeProvider>
);
addDecorator(MaterialUIThemeDecorator);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
