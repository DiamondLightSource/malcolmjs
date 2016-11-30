/**
 * Created by twi18192 on 02/03/16.
 */

let WebSocketClient = require('../fluxWebsocketClient');
//let WebSocketClient        = require('../wsWebsocketClient');
let idLookupTableFunctions = require('./idLookupTable');
import malcolmProtocol from "../utils/malcolmProtocol";

class Utils {

initialiseFlowChart(callback)
  {
  WebSocketClient.addWebSocketOnOpenCallback(callback);
  // Note that callback() has been bound with a pre-specified initial argument of requestedData from the caller.
  }

malcolmGet(requestedData, successCallback, failureCallback)
  {
  let id = WebSocketClient.getNextAvailableId();
  WebSocketClient.incrementId();
  let message                               = {};
  message[malcolmProtocol.getTypeIDIdent()] = malcolmProtocol.getTypeIDGet();
  message['id']                             = id;
  message['endpoint']                       = requestedData;
  //let messageJson = JSON.stringify({malcolmProtocol.getTypeIDIdent(): malcolmProtocol.getTypeIDGet(), id: id, endpoint: requestedData});
  let messageJson                           = JSON.stringify(message);

  idLookupTableFunctions.addIdCallbacks(id, messageJson, {
    successCallback: successCallback,
    failureCallback: failureCallback,
    requestedData  : requestedData
  });

  WebSocketClient.sendText(messageJson);

  // Added: return the GET id number so that the client object can associate itself
  // with response data.
  return (id);

  }

malcolmSubscribe(requestedData, successCallback, failureCallback)
  {
  let id = WebSocketClient.getNextAvailableId();
  WebSocketClient.incrementId();
  let message                               = {};
  message[malcolmProtocol.getTypeIDIdent()] = malcolmProtocol.getTypeIDSubscribe();
  message['id']                             = id;
  message['endpoint']                       = requestedData;
  let messageJson                           = JSON.stringify(message);
  idLookupTableFunctions.addIdCallbacks(id, messageJson, {
    successCallback: successCallback,
    failureCallback: failureCallback
  });

  console.log('WebSocketClient.sendText(): =>');
  console.log(messageJson);
  WebSocketClient.sendText(messageJson);

  // Added: return the GET id number so that the client object can associate itself
  // with response data.
  return (id);
  }

malcolmCall(requestedDataToWrite, method, args, successCallback, failureCallback)
  {
  let id = WebSocketClient.getNextAvailableId();
  WebSocketClient.incrementId();
  let message                               = {};
  message[malcolmProtocol.getTypeIDIdent()] = malcolmProtocol.getTypeIDCall();
  message['id']                             = id;
  message['endpoint']                       = requestedDataToWrite;
  message['method']                         = method;
  message['arguments']                      = args;
  let messageJson                           = JSON.stringify(message);

  idLookupTableFunctions.addIdCallbacks(id, messageJson, {
    successCallback: successCallback,
    failureCallback: failureCallback
  });

  WebSocketClient.sendText(messageJson);
  }


/*
  Check object for nested property. If a given property at
  any level does not exist then it will return false
   */

hasOwnNestedProperties(obj /*, level1, level2, ... levelN*/)
  {
  var args = Array.prototype.slice.call(arguments, 1);

  for (var i = 0; i < args.length; i++)
    {
    if (!obj || !obj.hasOwnProperty(args[i]))
      {
      return false;
      }
    obj = obj[args[i]];
    }
  return true;
  }

}

let MalcolmUtils = new Utils();

export default MalcolmUtils;
