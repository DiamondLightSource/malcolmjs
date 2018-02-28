/**
 * Created by Ian Gillingham on 7/07/16.
 */

//import W3CWebSocket from 'websocket';
//import WebSocketClient from  'websocket';

import idLookupTableFunctions from './utils/idLookupTable';
import appConstants from './constants/appConstants';

import EventEmitter from 'events';
import malcolmProtocol from './utils/malcolmProtocol';
import params from "./utils/queryParams";

let W3CWebSocket    = require('websocket').w3cwebsocket;
let WebSocketClient = require('websocket').client;

//import {LOG} from './utils/MalcolmUtils'

//let debug = true;

class WSClient extends EventEmitter
  {

  constructor(url)
    {
    super();
    this.channelIDIndex            = 0;
    this.websocket                 = null;
    this.webSocketOnOpenCallbacks  = [];
    this.webSocketOnCloseCallbacks = [];
    this.webSocketOnErrorCallbacks = [];

    this.webSocketOpen = false;

    // Mainline code for this class
    this.openWebSocket(url);
    //openWebSocketClient(url);

    }


  addWebSocketOnOpenCallback(callback)
    {
    this.webSocketOnOpenCallbacks.push(callback);
    }

  addWebSocketOnCloseCallback(callback)
    {
    this.webSocketOnCloseCallbacks.push(callback);
    }

  addWebSocketOnErrorCallback(callback)
    {
    this.webSocketOnErrorCallbacks.push(callback);
    }

  sendText(message)
    {
    //console.log('Client.sendText: ' + message);
    this.websocket.send(message);
    }

  close()
    {
    this.websocket.close();
    }

  getNextAvailableId()
    {
    return this.channelIDIndex;
    }

  incrementId()
    {
    this.channelIDIndex += 1;
    }

  openWebSocket(url)
    {
    //LOG('Flux WebSocket: Connecting to: ' + url);
    console.log("wsWebSocketClient: openWebSocket()  url: " + url);
    //console.log(window);
    this.websocket            = new W3CWebSocket(url);
    this.websocket.binaryType = "arraybuffer";

    //websocket.setTimeout(0);

    this.websocket.onopen = (evt) =>
      {
      console.log("openWebSocket().onopen callback");
      for (let i = 0; i < this.webSocketOnOpenCallbacks.length; i++)
        {
        this.webSocketOnOpenCallbacks[i](evt);
        }
      };

    this.websocket.onclose = (evt) =>
      {
      for (let j = 0; j < this.webSocketOnCloseCallbacks.length; j++)
        {
        this.webSocketOnCloseCallbacks[j](evt);
        }
      };

    this.websocket.onerror = (evt) =>
      {
      /* This is not for websocket messages which are informing the client
       of an error with an interaction with the server, this is for an
       error that is about the websocket itself
       */
      console.log('WebSocket Connection Error : evt = ' + JSON.stringify(evt));
      for (let k = 0; k < this.webSocketOnErrorCallbacks.length; k++)
        {
        this.webSocketOnErrorCallbacks[k](evt);
        }
      };

    this.websocket.onbeforeunload = () =>
      {
      console.log('** websocket.onbeforeunload() **');
      this.websocket.close();
      };

    this.websocket.onmessage = (evt) =>
      {
      let json = JSON.parse(evt.data);
      //console.log("websocket.onmessage: ");
      //console.log(JSON.parse(JSON.stringify(json)));
      if (malcolmProtocol.isError(json))
        {
        if (idLookupTableFunctions.hasId(json.id))
          {
          let reqMsg = idLookupTableFunctions.getRequestMessage(json.id);

          console.log("websocket.onmessage ERROR:  requestedData   => ");
          console.log(reqMsg);
          console.log("websocket.onmessage ERROR:  return message  => ");
          console.log(json.message);
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

  openWebSocketClient(url)
    {
    console.log("wsWebSocketClient: openWebSocketClient()  url: " + url);
    //console.log(window);
    this.websocket = new WebSocketClient();
    this.websocket.connect(url);

    this.websocket.on('connect', connection =>
    {
    //console.log("jofswf");
    for (let i = 0; i < this.webSocketOnOpenCallbacks.length; i++)
      {
      this.webSocketOnOpenCallbacks[i](connection);
      }
    });

    this.websocket.on('connectFailed', evt =>
    {
    /* This is not for websocket messages which are informing the client
     of an error with an interaction with the server, this is for an
     error that is about the websocket itself
     */
    console.log('WebSocketClient Connection Error : evt = ' + evt.toString());
    for (let k = 0; k < this.webSocketOnErrorCallbacks.length; k++)
      {
      this.webSocketOnErrorCallbacks[k](evt);
      }
    });

    this.websocket.on('close', evt =>
    {
    for (let j = 0; j < this.webSocketOnCloseCallbacks.length; j++)
      {
      this.webSocketOnCloseCallbacks[j](evt);
      }
    });


    this.websocket.on('message', message =>
    {
    let json = '';
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
    })

    }

  emitChange()
    {
    this.emit(appConstants.WEBSOCKET_STATE);
    }

  addChangeListener(callback)
    {
    this.on(appConstants.WEBSOCKET_STATE, callback);
    }

  removeChangeListener(callback)
    {
    this.removeListener(appConstants.WEBSOCKET_STATE, callback);
    }

  }

let url = "ws://" + params.getWsHost() + "/ws";
let MalcolmWebSocketClient = new WSClient(url);

export {MalcolmWebSocketClient as default};
