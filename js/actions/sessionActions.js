/**
 * Created by twi18192 on 30/09/15.
 */

/* Actions intended for communication from Client to server */

/* Don't forget that I need to import the WebAPIUtils module (ie, the module containing Websockets) here */
var AppDispatcher = require('../dispatcher/appDispatcher');
var appConstants = require('../constants/appConstants');

var WebSocketClient = require('../websocketClient');

var sessionActions = {

  //fetchUpdatedChannelValue: function(item){
  // AppDispatcher.handleViewAction({   /* Notifies the dispatcher, not sure why you do it, but stuff on the internet says you should, maybe I'll see the reason later :P */
  //   actionType: appConstants.FETCHNEWCHANNEL_VALUE,
  //   item: item
  // });
  // WebSocketClient.getChannel(0).setValue(1); /* Not the proper code, just a really basic mockup */
  //},

  //properServerRequestToAddChannelChangeInfoTest: function(item){
  //  AppDispatcher.handleViewAction({
  //    actionType: appConstants.PROPERSERVERREQUEST_TOADDCHANNELCHANGEINFO,
  //    item: item
  //  });
  //  WebSocketClient.subscribeChannel("Test channel 1", function(){console.log("Test channel 1 callback")}, false, "PV", "Version 0.1", 13);
  //  WebSocketClient.subscribeChannel("Test channel 2", function(){console.log("Test channel 2 callback")}, false, "PV", "Version 0.1", 13);
  //},
  //
  //interactJsDrag: function(newBlockCoords){
  //  AppDispatcher.handleViewAction({
  //    actionType: appConstants.SESSION_INTERACTJSDRAG,
  //    item: newBlockCoords
  //  })
  //}

};

module.exports = sessionActions;
