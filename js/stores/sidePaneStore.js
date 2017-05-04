/**
 * Created by twi18192 on 01/09/15.
 */

import AppDispatcher from '../dispatcher/appDispatcher.js';
import appConstants from '../constants/appConstants.js';
import EventEmitter from 'events';

let CHANGE_EVENT = 'change';

let _stuff = {
  dropdownListVisible: false,
};

let dropdownMenuShow = function ()
  {

  /* Want to have it so that you can toggle the dropdown menu if you click on the button more than once */

  if (_stuff.dropdownListVisible === false)
    {
    _stuff.dropdownListVisible = true;
    }
  else if (_stuff.dropdownListVisible === true)
    {
    _stuff.dropdownListVisible = false;
    }
  };

let dropdownMenuHide = function ()
  {
  _stuff.dropdownListVisible = false;
  };


class SidePaneStore extends EventEmitter {
constructor()
  {
  super();
  }

addChangeListener(cb)
  {
  this.on(CHANGE_EVENT, cb)
  }

removeChangeListener(cb)
  {
  this.removeListener(CHANGE_EVENT, cb)
  }

emitChange()
  {
  this.emit(CHANGE_EVENT)
  }

getDropdownState()
  {
  return _stuff.dropdownListVisible;
  }

}

let sidePaneStore = new SidePaneStore();

/*
let sidePaneStore = assign({}, EventEmitter.prototype, {
  addChangeListener   : function (cb)
    {
    this.on(CHANGE_EVENT, cb)
    },
  removeChangeListener: function (cb)
    {
    this.removeListener(CHANGE_EVENT, cb)
    },
  emitChange          : function ()
    {
    this.emit(CHANGE_EVENT)
    },
  getDropdownState    : function ()
    {
    return _stuff.dropdownListVisible;
    }

});
*/

AppDispatcher.register((payload) =>
{
let action = payload.action;
let item   = action.item;
switch (action.actionType)
{

  case appConstants.DROPDOWN_SHOW:
    console.log(payload);
    console.log(action);
    dropdownMenuShow();
    sidePaneStore.emitChange();
    console.log(`_stuff.dropdownListVisible: ${_stuff.dropdownListVisible}`);
    break;

  case appConstants.DROPDOWN_HIDE:
    console.log(payload);
    console.log(action);
    dropdownMenuHide();
    sidePaneStore.emitChange();
    console.log(`_stuff.dropdownListVisible: ${_stuff.dropdownListVisible}`);
    break;

  default:
    break;
}
});

export {sidePaneStore as default, SidePaneStore};
