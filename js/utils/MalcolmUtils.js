/**
 * Created by twi18192 on 02/03/16.
 */

//var WebSocketClient = require('../fluxWebsocketClient');
var WebSocketClient = require('../wsWebsocketClient');
var idLookupTableFunctions = require('./idLookupTable');

console.log(WebSocketClient);

var MalcolmUtils = {

  initialiseFlowChart: function(callback){
    WebSocketClient.addWebSocketOnOpenCallback(callback);
  },

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
  },

  malcolmCall: function(requestedDataToWrite, method, args, successCallback, failureCallback){
    var id = WebSocketClient.getNextAvailableId();
    WebSocketClient.incrementId();
    var message = JSON.stringify({
      type: 'Call',
      id: id,
      endpoint: requestedDataToWrite,
      method: method,
      arguments: args
    });

    idLookupTableFunctions.addIdCallbacks(id, {
      successCallback: successCallback,
      failureCallback: failureCallback
    });

    WebSocketClient.sendText(message);
  }

};

module.exports = MalcolmUtils;
