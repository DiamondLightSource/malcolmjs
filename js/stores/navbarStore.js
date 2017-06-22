/**
 * Created by Ian Gillingham on 19/05/17.
 */

import AppDispatcher from '../dispatcher/appDispatcher.js';
import appConstants from '../constants/appConstants.js';
import EventEmitter from 'events';
import {NavbarEventInfo} from '../actions/navbarActions';
import paneStore from './paneStore';

let CHANGE_EVENT = 'change';

let _navbarState = {
  navbarState: false,
};

let toggleFooter = function ()
  {
  _navbarState.footerState = !_navbarState.footerState
  };

class NavbarStore extends EventEmitter {
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

getNavbarState()
  {
  return _navbarState.footerState;
  }

actionShowBlockList(eventInfo)
  {
  paneStore.setBlockListTabStateTrue();
  this.emitChange();
  }
}

AppDispatcher.register(function (payload)
{
let action = payload.action;
switch (action.actionType)
{
  case appConstants.NAVBAR_ACTION:
    console.log('navbarStore: NAVBAR_ACTION received from dispatcher vvvvv');
    console.log(payload);
    console.log(action);
    if (action.item instanceof NavbarEventInfo)
      {
      navbarStore.actionShowBlockList(action.item);
      }

    console.log('navbarStore: NAVBAR_ACTION ^^^^^');
    break;

  default:
    return true;
}
return (true);
});

let navbarStore = new NavbarStore();

export default navbarStore;
