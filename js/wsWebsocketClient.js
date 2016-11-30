/**
 * Created by Ian Gillingham on 7/07/16.
 */

var W3CWebSocket    = require('websocket').w3cwebsocket;
var WebSocketClient = require('websocket').client;

var idLookupTableFunctions = require('./utils/idLookupTable');

import config from './utils/config';
import malcolmProtocol from './utils/malcolmProtocol';

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
    //console.log('Client.sendText: ' + message);
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

  function openWebSocket(url)
    {
    console.log("wsWebSocketClient: openWebSocket()  url: " + url);
    //console.log(window);
    websocket            = new W3CWebSocket(url);
    websocket.binaryType = "arraybuffer";

    websocket.setTimeout(0);

    websocket.onopen = function (evt)
      {
      console.log("openWebSocket().onopen callback");
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
      console.log('WebSocket Connection Error : evt = ' + JSON.stringify(evt));
      for (var k = 0; k < webSocketOnErrorCallbacks.length; k++)
        {
        webSocketOnErrorCallbacks[k](evt);
        }
      };

    websocket.onbeforeunload = function()
      {
      websocket.close();
      };

    websocket.onmessage = function (evt)
      {
      var json = JSON.parse(evt.data);
      //console.log("websocket.onmessage: ");
      //console.log(JSON.parse(JSON.stringify(json)));
      if (malcolmProtocol.isError(json))
        {
        if (idLookupTableFunctions.hasId(json.id))
          {
          let reqMsg = idLookupTableFunctions.getRequestMessage(json.id);

          console.log("websocket.onmessage ERROR:  requestedData,  return message  => ");
          console.log(reqMsg, json.message);
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
      };

    }

  function openWebSocketClient(url)
    {
    console.log("wsWebSocketClient: openWebSocketClient()  url: " + url);
    //console.log(window);
    websocket = new WebSocketClient();
    websocket.connect(url);

    websocket.on('connect', function (connection)
    {
    console.log("jofswf");
    for (var i = 0; i < webSocketOnOpenCallbacks.length; i++)
      {
      webSocketOnOpenCallbacks[i](connection);
      }
    });

    websocket.on('connectFailed', function (evt)
    {
    /* This is not for websocket messages which are informing the client
     of an error with an interaction with the server, this is for an
     error that is about the websocket itself
     */
    console.log('WebSocketClient Connection Error : evt = ' + evt.toString());
    for (var k = 0; k < webSocketOnErrorCallbacks.length; k++)
      {
      webSocketOnErrorCallbacks[k](evt);
      }
    });

    websocket.on('close', function (evt)
    {
    var j = 0;
    for (j = 0; j < webSocketOnCloseCallbacks.length; j++)
      {
      webSocketOnCloseCallbacks[j](evt);
      }
    });


    websocket.on('message', function (message)
    {
    var json = '';
    if (message.type === 'utf8')
      {
      json = JSON.parse(message.text);
      //console.log("websocketClient.onmessage: ");
      //console.log(JSON.parse(JSON.stringify(json)));
      if (malcolmProtocol.isError(json))
        {
        idLookupTableFunctions.invokeIdCallback(json.id, false, json.message);
        }
      else if (malcolmProtocol.isReturn(json) || malcolmProtocol.isValue(json))
        {
        idLookupTableFunctions.invokeIdCallback(json.id, true, json.value);
        }
      }
    });

    }

  // Mainline code for this class
  openWebSocket(url);
  //openWebSocketClient(url);

  }

/*  For development purposes, a table of available Zebra/PandA servers
 */
config.setServerName('pc70');
config.setProtocolVersion('V2_0');
config.setdeviceName('P');
var url             = config.getServerURL();
var WebSocketClient = new Client(url);

module.exports = WebSocketClient;
