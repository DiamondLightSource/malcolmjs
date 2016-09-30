/**
 * Created by twi18192 on 02/03/16.
 */

// var WebSocketClient = require('../fluxWebsocketClient');
var WebSocketClient = require('../wsWebsocketClient');
var idLookupTableFunctions = require('./idLookupTable');
var malcolmProtocol = require('../utils/malcolmProtocol');

//console.log(WebSocketClient);

var MalcolmUtils = {

  initialiseFlowChart: function(callback){
    WebSocketClient.addWebSocketOnOpenCallback(callback);
  },

  malcolmGet: function(requestedData, successCallback, failureCallback){
    var id = WebSocketClient.getNextAvailableId();
    WebSocketClient.incrementId();
    var message = {};
    message[malcolmProtocol.getTypeIDIdent()] = malcolmProtocol.getTypeIDGet();
    message['id'] = id;
    message['endpoint'] = requestedData;
    //var messageJson = JSON.stringify({malcolmProtocol.getTypeIDIdent(): malcolmProtocol.getTypeIDGet(), id: id, endpoint: requestedData});
    var messageJson = JSON.stringify(message);

    idLookupTableFunctions.addIdCallbacks(id, {
      successCallback: successCallback,
      failureCallback: failureCallback
    });

    WebSocketClient.sendText(messageJson);
  },

  malcolmSubscribe: function(requestedData, successCallback, failureCallback){
    var id = WebSocketClient.getNextAvailableId();
    WebSocketClient.incrementId();
    var message = {};
    message[malcolmProtocol.getTypeIDIdent()] = malcolmProtocol.getTypeIDSubscribe();
    message['id'] = id;
    message['endpoint'] = requestedData;
    var messageJson = JSON.stringify(message);
    //console.log("Subscribe: ");
    //console.log(messageJson);
    idLookupTableFunctions.addIdCallbacks(id, {
      successCallback: successCallback,
      failureCallback: failureCallback
    });

    WebSocketClient.sendText(messageJson);
  },

  malcolmCall: function(requestedDataToWrite, method, args, successCallback, failureCallback){
    var id = WebSocketClient.getNextAvailableId();
    WebSocketClient.incrementId();
    var message = {};
    message[malcolmProtocol.getTypeIDIdent()] = malcolmProtocol.getTypeIDCall();
    message['id'] = id;
    message['endpoint'] = requestedDataToWrite;
    message['method'] = method;
    message['arguments'] = args;
    var messageJson = JSON.stringify(message);

    idLookupTableFunctions.addIdCallbacks(id, {
      successCallback: successCallback,
      failureCallback: failureCallback
    });

    WebSocketClient.sendText(messageJson);
  }

};

module.exports = MalcolmUtils;
