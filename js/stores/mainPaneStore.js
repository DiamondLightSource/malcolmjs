/**
 * Created by twi18192 on 25/08/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var appConstants = require('../constants/appConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _stuff = {
    footerState: false,
};

var toggleFooter = function(){
    _stuff.footerState = !_stuff.footerState
  };

var mainPaneStore = assign({}, EventEmitter.prototype, {
  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb);
  },
  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },
  emitChange: function(){
    this.emit(CHANGE_EVENT)
  },
  getFooterState: function(){
    return _stuff.footerState;
  },
});

AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.actionType){
    case appConstants.FOOTER_TOGGLE:
      console.log(payload);
      console.log(action);
      toggleFooter();
      mainPaneStore.emitChange();
      console.log(_stuff.footerState);
      break;

    default:
          return true;
  }
});

module.exports = mainPaneStore;
