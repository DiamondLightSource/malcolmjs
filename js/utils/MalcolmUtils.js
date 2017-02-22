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
  message['endpoint']                       = requestedData;
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
  message['endpoint']                       = requestedData;
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

malcolmCall(requestedDataToWrite, method, args, successCallback, failureCallback)
  {
  let id = MalcolmWebSocketClient.getNextAvailableId();
  MalcolmWebSocketClient.incrementId();
  let message                               = {};
  message[malcolmProtocol.getTypeIDIdent()] = malcolmProtocol.getTypeIDPost();
  message['id']                             = id;
  message['endpoint']                       = requestedDataToWrite;
  message['parameters']                     = {'method':method, 'arguments':args};
  let messageJson                           = JSON.stringify(message);

  idLookupTableFunctions.addIdCallbacks(id, messageJson, {
    successCallback: successCallback,
    failureCallback: failureCallback,
    requestedData  : requestedDataToWrite
  });

  console.log(`MalcolmUtils.malcolmCall(): ==>`);
  console.log(messageJson);
  MalcolmWebSocketClient.sendText(messageJson);

  return(id);
  }


malcolmPut(requestedDataToWrite, endpoint, value, successCallback, failureCallback)
  {
  let id = MalcolmWebSocketClient.getNextAvailableId();
  MalcolmWebSocketClient.incrementId();
  let message                               = {};
  message[malcolmProtocol.getTypeIDIdent()] = malcolmProtocol.getTypeIDPut();
  message['id']                             = id;
  message['endpoint']                       = endpoint;
  message['value']                          = value;
  let messageJson                           = JSON.stringify(message);

  idLookupTableFunctions.addIdCallbacks(id, messageJson, {
    successCallback: successCallback,
    failureCallback: failureCallback,
    requestedData  : requestedDataToWrite
  });

  console.log(`MalcolmUtils.malcolmPut(): ==>`);
  console.log(messageJson);
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


/**
 * isEquivalent(a, b)
 * Compares two objects for value equivalence.
 *
 * @param a
 * @param b
 * @returns {boolean}
 */
isEquivalent(a, b)
  {
  if ((a != undefined) && (b != undefined))
    {
    // Create arrays of property names
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length)
      {
      return false;
      }

    for (let i = 0; i < aProps.length; i++)
      {
      let propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName])
        {
        return false;
        }
      }

    // If we made it this far, objects
    // are considered equivalent
    return true;
    }
  else
    {
    return false;
    }
  }

}

const MalcolmUtils = new Utils();

export {MalcolmUtils as default};
//export default MalcolmUtils;
//module.exports = MalcolmUtils;
