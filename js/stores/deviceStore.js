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
    info: {work: {height: "400 pixels", width: "230 pixels", ChannelName: "Channel name"}}
  },
  blueBlockContent: {
    name: "Blue block",
    hack: "blueBlockTabOpen",
    info: {
      work: {height: "20 pixels", width: "460 pixels"}
    }
  },
  greenBlockContent: {
    name: "Green block",
    hack: "greenBlockTabOpen",
    info: {work: {height: "10 pixels", width: "980 pixels"}
    }
  }

};

var changeBlockContent = function(infoFromServer){
  /* Code to alter/update the appropriate block object in allDeviceContent.
  Not sure if I should filter out the 'message' type and all that from the
  json that comes from the server before this, or do it in here to get the
  actual changed value?
   */

  /* Also, I suppose it depends on if each Channel does indeed represent just one
  block attribute, because then you could use probably some of the json to
  distinguish which block and which attribute to change, making this function
  easier to write
   */
};

//var mockBlockContentPlayingWithServer = {
//  redBlockContent: {
//    name: "Red block",
//    hack: "redBlockTabOpen",
//    info: {work: {height: "400 pixels", width: "230 pixels", ChannelName: "Channel name"}}
//  },
//};

var simpleChangeChannelName = function(name){
  allDeviceContent.redBlockContent.info.work.ChannelName = name
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
  },
  getBlueBlockContent: function(){
    return allDeviceContent.blueBlockContent;
  },
  getGreenBlockContent: function(){
    return allDeviceContent.greenBlockContent;
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

    /* Testing/mocking up a case where info has been passed from server to the dispatcher, and now to deviceStore (ie, here :P) */

    case appConstants.PASSUPDATEDCHANNEL_VALUE:
          console.log(payload);
          console.log(action);
          break;





    case appConstants.PROPERSERVERREQUEST_TOADDCHANNELCHANGEINFO:
          console.log(payload);
          console.log(action);
          deviceStore.emitChange();
          break;

    case appConstants.PASSNAMEOFCHANNELTHATSBEEN_SUBSCRIBED:
          console.log(payload);
          console.log(action);
          simpleChangeChannelName(item);
          deviceStore.emitChange();
          break;


    default:
          return 'deviceStore: default'
  }
});

module.exports = deviceStore;
