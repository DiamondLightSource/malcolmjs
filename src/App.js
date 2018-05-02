import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import MainMalcolmView from './mainMalcolmView/mainMalcolmView.container';
import './App.css';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const App = () => (
  <div className="App">
    <MuiThemeProvider theme={theme}>
      <MainMalcolmView />
    </MuiThemeProvider>
  </div>
);

export default App;
