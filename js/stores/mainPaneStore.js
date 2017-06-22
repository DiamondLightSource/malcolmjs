/**
 * Created by twi18192 on 25/08/15.
 */

import AppDispatcher from '../dispatcher/appDispatcher.js';
import appConstants from '../constants/appConstants.js';
import EventEmitter from 'events';
//import * as assign from 'object-assign';

let CHANGE_EVENT = 'change';

let _stuff = {
  footerState: false,
};

let toggleFooter = function ()
  {
  _stuff.footerState = !_stuff.footerState
  };

class MainPaneStore extends EventEmitter
  {
  constructor()
    {
    super();
    }

  addChangeListener(cb)
    {
    this.on(CHANGE_EVENT, cb);
    }

  removeChangeListener(cb)
    {
    this.removeListener(CHANGE_EVENT, cb);
    }

  emitChange()
    {
    this.emit(CHANGE_EVENT)
    }

  getFooterState()
    {
    return _stuff.footerState;
    }
  }

AppDispatcher.register(function (payload)
  {
  let action = payload.action;
  switch (action.actionType)
    {
    case appConstants.FOOTER_TOGGLE:
      console.log('mainPaneStore: FOOTER_TOGGLE received from dispatcher vvvvv');
      console.log(payload);
      console.log(action);
      toggleFooter();
      mainPaneStore.emitChange();

      console.log(_stuff.footerState);
      console.log('mainPaneStore: FOOTER_TOGGLE ^^^^^');
      break;

    default:
      return true;
    }
  return(true);
  });

let mainPaneStore = new MainPaneStore();

export default mainPaneStore;
