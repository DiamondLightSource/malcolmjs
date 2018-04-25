import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import logo from './logo.svg';
import DrawerContainer from './drawerContainer/drawerContainer.component';
import './App.css';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const App = () => (
  <div className="App">
    <MuiThemeProvider theme={theme}>
      <DrawerContainer open openSecondary>
        <div>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
      </DrawerContainer>
    </MuiThemeProvider>
  </div>
);

export default App;
