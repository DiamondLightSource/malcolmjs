import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import malcolmReducer from './malcolm/malcolmReducer';

const appReducer = combineReducers({
  router: routerReducer,
  malcolm: malcolmReducer,
});

export default appReducer;
