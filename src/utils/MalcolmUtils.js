/**
 * Created by twi18192 on 02/03/16.
 */

//let MalcolmWebSocketClient = require('../fluxWebsocketClient');
import MalcolmWebSocketClient from '../wsWebsocketClient';
import idLookupTableFunctions from './idLookupTable';
import malcolmProtocol from "../utils/malcolmProtocol";

//let log_debug = false;
//let LOG = log_debug ? console.log.bind(console) : function () {};

class Utils {

constructor()
  {
  this.webSocketOpen = false;
  // bind callbacks to this
  this.webSocketOnOpen = this.webSocketOnOpen.bind(this);
  this.webSocketOnClose = this.webSocketOnClose.bind(this);
  MalcolmWebSocketClient.addWebSocketOnOpenCallback(this.webSocketOnOpen);
  MalcolmWebSocketClient.addWebSocketOnCloseCallback(this.webSocketOnClose);
  }

webSocketOnOpen()
  {
  this.webSocketOpen = true;
  }

webSocketOnClose()
  {
  this.webSocketOpen = false;
  }

initialiseFlowChart(callback)
  {
  MalcolmWebSocketClient.addWebSocketOnOpenCallback(callback);
  // Note that callback() has been bound with a pre-specified initial argument of requestedData from the caller.
  }

malcolmGet(requestedData, successCallback, failureCallback)
  {
  let id = MalcolmWebSocketClient.getNextAvailableId();
  MalcolmWebSocketClient.incrementId();
  let message                               = {};
  message[malcolmProtocol.getTypeIDIdent()] = malcolmProtocol.getTypeIDGet();
  message['id']                             = id;
  message['path']                       = requestedData;
  //let messageJson = JSON.stringify({malcolmProtocol.getTypeIDIdent(): malcolmProtocol.getTypeIDGet(), id: id, endpoint: requestedData});
  let messageJson                           = JSON.stringify(message);

  idLookupTableFunctions.addIdCallbacks(id, messageJson, {
    successCallback: successCallback,
    failureCallback: failureCallback,
    requestedData  : requestedData
  });

  MalcolmWebSocketClient.sendText(messageJson);

  // Added: return the GET id number so that the client object can associate itself
  // with response data.
  return (id);

  }

malcolmSubscribe(requestedData, successCallback, failureCallback)
  {
  let id = MalcolmWebSocketClient.getNextAvailableId();
  MalcolmWebSocketClient.incrementId();
  let message                               = {};
  message[malcolmProtocol.getTypeIDIdent()] = malcolmProtocol.getTypeIDSubscribe();
  message['id']                             = id;
  message['path']                       = requestedData;
  let messageJson                           = JSON.stringify(message);

  idLookupTableFunctions.addIdCallbacks(id, messageJson, {
    successCallback: successCallback,
    failureCallback: failureCallback,
    requestedData  : requestedData
  });

  //console.log('MalcolmWebSocketClient.sendText(): =>');
  //console.log(messageJson);
  MalcolmWebSocketClient.sendText(messageJson);

  // Added: return the GET id number so that the client object can associate itself
  // with response data.
  return (id);
  }

/**
 * @name  malcolmUnsubscribe
 * @param subscriptionId
 * @returns {*}
 *
 * @description  Request the device to stop sending subscription updates of a given subscription ID.
 *               The callbacks to this should be handles locally.
 */
/*malcolmUnsubscribe(subscriptionId)
  {
  let message                               = {};
  message[malcolmProtocol.getTypeIDIdent()] = malcolmProtocol.getTypeIDUnsubscribe();
  message['id']                             = subscriptionId;
  let messageJson                           = JSON.stringify(message);

  idLookupTableFunctions.addIdCallbacks(subscriptionId, messageJson, {
    successCallback: () => {idLookupTableFunctions.removeIdCallback(subscriptionId)},
    failureCallback: () => {},
    requestedData  : requestedData
  });

  MalcolmWebSocketClient.sendText(messageJson);
  return (subscriptionId);
  }*/



malcolmPost(path, parameters, successCallback, failureCallback)
  {
  let id = MalcolmWebSocketClient.getNextAvailableId();
  MalcolmWebSocketClient.incrementId();
  let message                               = {};
  message[malcolmProtocol.getTypeIDIdent()] = malcolmProtocol.getTypeIDPost();
  message['id']                             = id;
  message['path']                           = path;
  message['parameters']                     = parameters;
  let messageJson                           = JSON.stringify(message);

  idLookupTableFunctions.addIdCallbacks(id, messageJson, {
    successCallback: successCallback,
    failureCallback: failureCallback,
  });

  //console.log(`MalcolmUtils.malcolmCall(): ==>`);
  //console.log(messageJson);
  MalcolmWebSocketClient.sendText(messageJson);

  return(id);
  }


malcolmPut(path, value, successCallback, failureCallback)
  {
  let id = MalcolmWebSocketClient.getNextAvailableId();
  MalcolmWebSocketClient.incrementId();
  let message                               = {};
  message[malcolmProtocol.getTypeIDIdent()] = malcolmProtocol.getTypeIDPut();
  message['id']                             = id;
  message['path']                           = path;
  message['value']                          = value;
  let messageJson                           = JSON.stringify(message);

  idLookupTableFunctions.addIdCallbacks(id, messageJson, {
    successCallback: successCallback,
    failureCallback: failureCallback,
  });

  //console.log(`MalcolmUtils.malcolmPut(): ==>`);
  //console.log(messageJson);
  MalcolmWebSocketClient.sendText(messageJson);

  return(id);
  }

/*
 Check object for nested property. If a given property at
 any level does not exist then it will return false
 */

hasOwnNestedProperties(obj /*, level1, level2, ... levelN*/)
  {
  let ret = true;
  if (obj !== null)
    {
    let args = Array.prototype.slice.call(arguments, 1);

    for (let i = 0; i < args.length; i++)
      {
      if (!obj || !obj.hasOwnProperty(args[i]))
        {
        ret = false;
        break;
        }
      obj = obj[args[i]];
      }
    }
  return ret;
  }
}

const MalcolmUtils = new Utils();

export {MalcolmUtils as default};
//export default MalcolmUtils;
//module.exports = MalcolmUtils;
