import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import appReducer from './App.reducer'

const middleware = [thunk]
let store = createStore(appReducer, applyMiddleware(...middleware))

ReactDOM.render(
<Provider store={store}>
  <App />
</Provider>,
document.getElementById('root'));

registerServiceWorker();
