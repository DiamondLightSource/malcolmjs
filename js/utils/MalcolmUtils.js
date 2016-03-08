/**
 * Created by twi18192 on 02/03/16.
 */

var WebSocketClient = require('../fluxWebsocketClient');
var idLookupTableFunctions = require('./idLookupTable');

console.log(WebSocketClient);

var MalcolmUtils = {

  /* Moved to its own independent file */
  //invokeIdCallback: function(id, success, json){
  //  /* 'success' will be a boolean value;
  //  if 'success' is true then invoke the success callback,
  //  and if it's false then invoke the failure callback
  //   */
  //
  //  if(success === true){
  //    idLookupTable[id].successCallback(json)
  //  }
  //  else if(success === false){
  //    idLookupTable[id].failureCallback(json)
  //  }
  //
  //},

  initialiseFlowChart: function(callback){
    WebSocketClient.addWebSocketOnOpenCallback(callback);
  },

  //getBlockList: function(successCallback, failureCallback){
  //
  //  var id = WebSocketClient.getNextAvailableId();
  //  WebSocketClient.incrementId();
  //  var message = JSON.stringify({type: 'Get', id: id, endpoint: 'Z'});
  //
  //  //idLookupTable[id] = {
  //  //  successCallback: successCallback,
  //  //  failureCallback: failureCallback
  //  //};
  //
  //  idLookupTableFunctions.addIdCallbacks(id, {
  //    successCallback: successCallback,
  //    failureCallback: failureCallback
  //  });
  //
  //  WebSocketClient.sendText(message);
  //
  //},
  //
  //getBlock: function(block, successCallback, failureCallback){
  //  var id = WebSocketClient.getNextAvailableId();
  //  WebSocketClient.incrementId();
  //  var message = JSON.stringify({type: 'Get', id: id, endpoint: block});
  //
  //  idLookupTableFunctions.addIdCallbacks(id, {
  //    successCallback: successCallback,
  //    failureCallback: failureCallback
  //  });
  //
  //  WebSocketClient.sendText(message);
  //
  //},

  malcolmGet: function(requestedData, successCallback, failureCallback){
    var id = WebSocketClient.getNextAvailableId();
    WebSocketClient.incrementId();
    var message = JSON.stringify({type: 'Get', id: id, endpoint: requestedData});

    idLookupTableFunctions.addIdCallbacks(id, {
      successCallback: successCallback,
      failureCallback: failureCallback
    });

    WebSocketClient.sendText(message);
  },

  malcolmSubscribe: function(requestedData, successCallback, failureCallback){
    var id = WebSocketClient.getNextAvailableId();
    WebSocketClient.incrementId();
    var message = JSON.stringify({type: 'Subscribe', id: id, endpoint: requestedData});

    idLookupTableFunctions.addIdCallbacks(id, {
      successCallback: successCallback,
      failureCallback: failureCallback
    });

    WebSocketClient.sendText(message);
  }

};

/* Moved to its own independent file */
//var idLookupTable = {
//
//};

module.exports = MalcolmUtils;
