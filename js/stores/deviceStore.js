/**
 * Created by twi18192 on 24/09/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var appConstants = require('../constants/appConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var allDeviceContent = {
  /* Will contain all the blocks/devices, along with their attributes-key pairs*/
  redBlockContent: {
    name: "Red block",
    hack: "redBlockTabOpen",
    info: {work: {height: "400 pixels", width: "230 pixels"}}
  },
  blueBlockContent: {
    name: "Blue block",
    hack: "blueBlockTabOpen",
    info: {
      work: {height: "100 pixels", width: "100 pixels"}
    }
  },
  greenBlockContent: {
    name: "Green block",
    hack: "greenBlockTabOpen",
    info: {work: {height: "100 pixels", width: "100 pixels"}
    }
  }

};

var deviceStore = assign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb)
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb)
  },
  emitChange: function(){
    this.emit(CHANGE_EVENT)
  },
  getRedBlockContent: function(){
    return allDeviceContent.redBlockContent;
  }
});

AppDispatcher.register(function(payload){
  var action = payload.action;
  var item = action.item;
  switch(action.actionType){

    case appConstants.MOCK_SERVERREQUEST:
      console.log('mock server request running');
          console.log(payload);
          console.log(item);
          /* just a mock, so do nothing :P*/
          /* Just as a reference though, this'll be something like "you will have received an object of info, stick it into allDeviceContent/replace whatever it was with the newer object" */
          deviceStore.emitChange();
          break;

    default:
          return 'deviceStore: default'
  }
});

module.exports = deviceStore;
