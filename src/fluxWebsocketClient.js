/**
 * Created by twi18192 on 18/02/16.
 */

import idLookupTableFunctions from './utils/idLookupTable';
import config from './utils/config';
import malcolmProtocol from './utils/malcolmProtocol';
//import LOG from './utils/MalcolmUtils'

const debug = false;

//var LOG = debug ? console.log.bind(console) : function () {};

function Client(url)
  {

  var channelIDIndex            = 0;
  var websocket                 = null;
  var webSocketOnOpenCallbacks  = [];
  var webSocketOnCloseCallbacks = [];
  var webSocketOnErrorCallbacks = [];

  this.addWebSocketOnOpenCallback = function (callback)
    {
    webSocketOnOpenCallbacks.push(callback);
    };

  this.addWebSocketOnCloseCallback = function (callback)
    {
    webSocketOnCloseCallbacks.push(callback);
    };

  this.addWebSocketOnErrorCallback = function (callback)
    {
    webSocketOnErrorCallbacks.push(callback);
    };

  this.sendText = function (message)
    {
    websocket.send(message);
    };

  this.close = function ()
    {
    websocket.close();
    };

  this.getNextAvailableId = function ()
    {
    return channelIDIndex;
    };

  this.incrementId = function ()
    {
    channelIDIndex += 1;
    };

  LOG('Flux WebSocket: Connecting to: ' + url);
  openWebSocket(url);

  function openWebSocket(url)
    {

    if ("WebSocket" in window)
      {
      LOG("WebSocket in window");
      websocket = new WebSocket(url);
      }
    else if ("MozWebSocket" in window)
      {
      LOG("MozWebSocket in window");
      websocket = new MozWebSocket(url);
      }
    else
      {
      throw new Error("WebSocket isn't supported by this browser.");
      }
    websocket.binaryType = "arraybuffer";

    websocket.onopen = function (evt)
      {
      LOG("WebSocket - onopen() - OK");
      for (var i = 0; i < webSocketOnOpenCallbacks.length; i++)
        {
        webSocketOnOpenCallbacks[i](evt);
        }
      };

    websocket.onclose = function (evt)
      {
      for (var j = 0; j < webSocketOnCloseCallbacks.length; j++)
        {
        webSocketOnCloseCallbacks[j](evt);
        }
      };

    websocket.onerror = function (evt)
      {
      /* This is not for websocket messages which are informing the client
       of an error with an interaction with the server, this is for an
       error that is about the websocket itself
       */
      LOG("Flux WebSocket error: " + evt);
      for (var k = 0; k < webSocketOnErrorCallbacks.length; k++)
        {
        webSocketOnErrorCallbacks[k](evt);
        }
      };

    websocket.onmessage = function (evt)
      {
      var json = JSON.parse(evt.data);

      if (malcolmProtocol.isError(json))
        {
        if (idLookupTableFunctions.hasId(json.id))
          {
          let reqMsg = idLookupTableFunctions.getRequestMessage(json.id);

          LOG("websocket.onmessage ERROR:  requestedData,  return message  => ");
          LOG(reqMsg, json.message);
          idLookupTableFunctions.invokeIdCallback(json.id, false, json.message);
          }
        }
      else if (malcolmProtocol.isReturn(json) || malcolmProtocol.isValue(json) || malcolmProtocol.isUpdate(json))
        {
        if (idLookupTableFunctions.hasId(json.id))
          {
          idLookupTableFunctions.invokeIdCallback(json.id, true, json.value);
          }
        }
      }
    }
  }

/*var WebSocketClient = new Client('ws://pc0090:8080/ws');*/
//var WebSocketClient = new Client('ws://pc0070:8080/ws');

/*  For development purposes, a table of available Zebra/PandA servers
 */
config.setServerName('pc70');
config.setProtocolVersion('V2_0');
config.setdeviceName('P');
var url             = config.getServerURL();
var WebSocketClient = new Client(url);


module.exports = WebSocketClient;
