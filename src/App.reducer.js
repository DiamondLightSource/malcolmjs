import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

const appReducer = combineReducers({
  router: routerReducer,
});
export default appReducer;
