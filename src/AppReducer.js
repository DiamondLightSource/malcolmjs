import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import malcolmReducer from './malcolm/reducer/malcolmReducer';
import viewStateReducer from './viewState/viewState.reducer';

const AppReducer = combineReducers({
  router: routerReducer,
  malcolm: malcolmReducer,
  viewState: viewStateReducer,
});

export default AppReducer;
