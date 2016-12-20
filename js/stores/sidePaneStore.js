/**
 * Created by twi18192 on 01/09/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var appConstants  = require('../constants/appConstants');
var EventEmitter  = require('events').EventEmitter;
var assign        = require('object-assign');

var CHANGE_EVENT = 'change';

var _stuff = {
  dropdownListVisible: false,
};

var dropdownMenuShow = function ()
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

var dropdownMenuHide = function ()
  {
  _stuff.dropdownListVisible = false;
  };


var sidePaneStore = assign({}, EventEmitter.prototype, {
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

AppDispatcher.register(function (payload)
{
var action = payload.action;
var item   = action.item;
switch (action.actionType)
{

  case appConstants.DROPDOWN_SHOW:
    console.log(payload);
    console.log(action);
    dropdownMenuShow();
    sidePaneStore.emitChange();
    console.log(_stuff.dropdownListVisible);
    break;

  case appConstants.DROPDOWN_HIDE:
    console.log(payload);
    console.log(action);
    dropdownMenuHide();
    sidePaneStore.emitChange();
    console.log(_stuff.dropdownListVisible);
    break;

  default:
    return true;
}
});

module.exports = sidePaneStore;
