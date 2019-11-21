import React from 'react';
import ReactDOM from 'react-dom';
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './index.css';
// import registerServiceWorker from './registerServiceWorker';
import { unregister } from './registerServiceWorker';
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
import ConnectedThemeProvider, {
  defaultTheme,
} from './mainMalcolmView/connectedThemeProvider';

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

const staticTheme = createMuiTheme(defaultTheme);

configureMalcolmSocketHandlers(store, worker);
if (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_E2E) {
  // if production connect directly to ws://{{host}}/ws
  store.dispatch(
    registerSocketAndConnect(worker, `ws://${window.location.host}/ws`)
  );
}

store.dispatch(configureSocket(worker));

// temporary logging whilst Tom measures performance on a real PANDA
setInterval(() => {
  console.log(Object.keys(store.getState().malcolm.blocks));
}, 60000);

// eslint-disable-next-line no-unused-vars
const normal = (
  <MuiThemeProvider theme={staticTheme}>
    <AppRouter />
    <MessageSnackBar timeout={5000} />
  </MuiThemeProvider>
);
const dynamic = (
  <ConnectedThemeProvider>
    <AppRouter />
    <MessageSnackBar timeout={5000} />
  </ConnectedThemeProvider>
);

ReactDOM.render(
  <Provider store={store}>
    <div className="App">
      <ConnectedRouter history={history}>{dynamic}</ConnectedRouter>
    </div>
  </Provider>,
  document.getElementById('root')
);

// Disable serviceWorker & fancy caching behaviour for now, causes issues since
// doesn't cache redirect and seems to completely miss updates sometimes.
// N.B. requires HTTPS connection to work on anything other than localhost
// registerServiceWorker();
unregister();
