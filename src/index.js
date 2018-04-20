import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createHistory from 'history/createBrowserHistory';
import io from 'socket.io-client';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import AppReducer from './App.reducer';
import AppRouter from './App.routes';
import configureMalcolmSocketHandlers from './malcolm/malcolmSocketHandler';
import buildMalcolmReduxMiddleware from './malcolm/malcolmReduxMiddleware';
import { malcolmGetAction } from './malcolm/malcolmActionCreators';

const history = createHistory();
const router = routerMiddleware(history);

const socket = io('http://localhost:8000', {
  transports: ['websocket'],
});

const malcolmReduxMiddleware = buildMalcolmReduxMiddleware(socket);

const middleware = [router, thunk, malcolmReduxMiddleware];
const store = createStore(AppReducer, applyMiddleware(...middleware));

configureMalcolmSocketHandlers(socket, store);

// example dispatch, this will be deleted
store.dispatch(malcolmGetAction(['BL18I:XSPRESS3', 'state', 'value']));

ReactDOM.render(
  <Provider store={store}>
    <div>
      <ConnectedRouter history={history}>
        <div>
          <AppRouter />
        </div>
      </ConnectedRouter>
    </div>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
