/**
 * Created by twi18192 on 18/02/16.
 */

var idLookupTableFunctions = require('./utils/idLookupTable');
var Config                 = require('./utils/config');
var malcolmProtocol        = require('./utils/malcolmProtocol');

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

  console.log('Flux WebSocket: Connecting to: ' + url);
  openWebSocket(url);

  function openWebSocket(url)
    {

    if ("WebSocket" in window)
      {
      console.log("WebSocket in window");
      websocket = new WebSocket(url);
      }
    else if ("MozWebSocket" in window)
      {
      console.log("MozWebSocket in window");
      websocket = new MozWebSocket(url);
      }
    else
      {
      throw new Error("WebSocket isn't supported by this browser.");
      }
    websocket.binaryType = "arraybuffer";

    websocket.onopen = function (evt)
      {
      console.log("WebSocket - onopen() - OK");
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
      console.log("Flux WebSocket error: " + evt);
      for (var k = 0; k < webSocketOnErrorCallbacks.length; k++)
        {
        webSocketOnErrorCallbacks[k](evt);
        }
      };

    websocket.onmessage = function (evt)
      {
      var json = JSON.parse(evt.data);

      if (json.type === 'Error')
        {
        idLookupTableFunctions.invokeIdCallback(json.id, false, json.message);
        }
      else if (json.type === 'Return' || json.type === 'Value')
        {
        idLookupTableFunctions.invokeIdCallback(json.id, true, json.value);
        }
      };

    }

  }

/*var WebSocketClient = new Client('ws://pc0090:8080/ws');*/
//var WebSocketClient = new Client('ws://pc0070:8080/ws');

/*  For development purposes, a table of available Zebra/PandA servers
 */
Config.setServerName('pc70');
Config.setProtocolVersion('V2_0');
Config.setdeviceName('P');
var url             = Config.getServerURL();
var WebSocketClient = new Client(url);


module.exports = WebSocketClient;
