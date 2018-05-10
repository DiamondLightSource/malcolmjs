import React from 'react';
import ReactDOM from 'react-dom';
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createHistory from 'history/createBrowserHistory';
import io from 'socket.io-client';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import AppReducer from './App.reducer';
import AppRouter from './App.routes';
import './App.css';
import configureMalcolmSocketHandlers from './malcolm/malcolmSocketHandler';
import buildMalcolmReduxMiddleware from './malcolm/malcolmReduxMiddleware';

require('typeface-roboto');

const history = createHistory();
const router = routerMiddleware(history);

const socket = io('http://localhost:8000', {
  transports: ['websocket'],
});

const malcolmReduxMiddleware = buildMalcolmReduxMiddleware(socket);

const middleware = [router, thunk, malcolmReduxMiddleware];
if (process.env.NODE_ENV === `development`) {
  middleware.push(logger);
}

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = createStore(
  AppReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

configureMalcolmSocketHandlers(socket, store);

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

ReactDOM.render(
  <Provider store={store}>
    <div className="App">
      <ConnectedRouter history={history}>
        <MuiThemeProvider theme={theme}>
          <AppRouter />
        </MuiThemeProvider>
      </ConnectedRouter>
    </div>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
