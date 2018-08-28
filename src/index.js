import React from 'react';
import ReactDOM from 'react-dom';
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import { blue, orange, green, purple, grey } from '@material-ui/core/colors';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import AppReducer from './AppReducer';
import AppRouter from './AppRouter';
import './App.css';
import configureMalcolmSocketHandlers from './malcolm/malcolmSocketHandler';
import buildMalcolmReduxMiddleware from './malcolm/middleware/malcolmReduxMiddleware';
import MessageSnackBar from './Snackbar/snackbar.component';
import MalcolmWorkerBuilder from './malcolm/worker/malcolm.worker';
import {
  configureSocket,
  registerSocketAndConnect,
} from './malcolm/actions/socket.actions';
import ReduxTimingMiddleware from './userTimingMiddleware';

require('typeface-roboto');

const history = createHistory();
const router = routerMiddleware(history);

const worker = MalcolmWorkerBuilder();

const malcolmReduxMiddleware = buildMalcolmReduxMiddleware(worker);

const middleware = [router, thunk, malcolmReduxMiddleware];
if (process.env.NODE_ENV === `development`) {
  middleware.push(logger);
  // const {whyDidYouUpdate} = require('why-did-you-update');
  // whyDidYouUpdate(React);
  middleware.push(ReduxTimingMiddleware);
}

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const store = createStore(
  AppReducer,
  composeEnhancers(applyMiddleware(...middleware))
);

configureMalcolmSocketHandlers(store, worker);
if (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_E2E) {
  // if production connect directly to ws://{{host}}/ws
  store.dispatch(
    registerSocketAndConnect(worker, `ws://${window.location.host}/ws`)
  );
}

store.dispatch(configureSocket(worker));

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
  },
  widgetColours: {
    textUpdateBar: grey[700],
  },
  alarmState: {
    warning: '#e6c01c',
    error: '#e8001f',
    disconnected: '#9d07bb',
  },
  // port colours should not use the themes secondary colour, it is used to highlight blocks and links
  portColours: {
    bool: blue,
    int32: orange,
    motor: green,
    NDArray: purple,
  },
});

ReactDOM.render(
  <Provider store={store}>
    <div className="App">
      <ConnectedRouter history={history}>
        <MuiThemeProvider theme={theme}>
          <AppRouter />
          <MessageSnackBar timeout={5000} />
        </MuiThemeProvider>
      </ConnectedRouter>
    </div>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
