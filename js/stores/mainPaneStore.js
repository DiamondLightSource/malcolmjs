/**
 * Created by twi18192 on 25/08/15.
 */

let AppDispatcher = require('../dispatcher/appDispatcher');
let appConstants = require('../constants/appConstants');
let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');

let CHANGE_EVENT = 'change';

let _stuff = {
    footerState: false,
};

let toggleFooter = function(){
    _stuff.footerState = !_stuff.footerState
  };

let mainPaneStore = assign({}, EventEmitter.prototype, {
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
  let action = payload.action;
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
