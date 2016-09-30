/**
 * Created by Ian Gillingham on 7/07/16.
 */

var W3CWebSocket = require('websocket').w3cwebsocket;

var idLookupTableFunctions = require('./utils/idLookupTable');

var Config = require('./utils/config');
var malcolmProtocol = require('./utils/malcolmProtocol');

function Client(url){

    var channelIDIndex = 0;
    var websocket = null;
    var webSocketOnOpenCallbacks = [];
    var webSocketOnCloseCallbacks = [];
    var webSocketOnErrorCallbacks = [];

    this.addWebSocketOnOpenCallback = function(callback){
        webSocketOnOpenCallbacks.push(callback);
    };

    this.addWebSocketOnCloseCallback = function(callback){
        webSocketOnCloseCallbacks.push(callback);
    };

    this.addWebSocketOnErrorCallback = function(callback){
        webSocketOnErrorCallbacks.push(callback);
    };

    this.sendText = function(message){
      //console.log('Client.sendText: '+message);
        websocket.send(message);
    };

    this.close = function(){
        websocket.close();
    };

    this.getNextAvailableId = function(){
        return channelIDIndex;
    };

    this.incrementId = function(){
        channelIDIndex += 1;
    };

    openWebSocket(url);

    function openWebSocket(url){
        console.log("wsWebSocketClient: openWebSocket()");
        //console.log(window);
        websocket = new W3CWebSocket(url);
        websocket.binaryType = "arraybuffer";

        websocket.onopen = function(evt){
            console.log("jofswf");
            for(var i = 0; i < webSocketOnOpenCallbacks.length; i++){
                webSocketOnOpenCallbacks[i](evt);
            }
        };

        websocket.onclose = function(evt){
            for(var j = 0; j < webSocketOnCloseCallbacks.length; j++){
                webSocketOnCloseCallbacks[j](evt);
            }
        };

        websocket.onerror = function(evt){
            /* This is not for websocket messages which are informing the client
             of an error with an interaction with the server, this is for an
             error that is about the websocket itself
             */
            for(var k = 0; k < webSocketOnErrorCallbacks.length; k++){
                webSocketOnErrorCallbacks[k](evt);
            }
        };

        websocket.onmessage = function(evt){
            var json  = JSON.parse(evt.data);
            //console.log("websocket.onmessage: ");
            //console.log(JSON.parse(JSON.stringify(json)));
            if(malcolmProtocol.isError(json)){
                idLookupTableFunctions.invokeIdCallback(json.id, false, json.message);
            }
            else if(malcolmProtocol.isReturn(json) || malcolmProtocol.isValue(json)){
                idLookupTableFunctions.invokeIdCallback(json.id, true, json.value);
            }
        };

    }

}

/*  For development purposes, a table of available Zebra/PandA servers
 */
Config.setServerName('isaSpare');
Config.setProtocolVersion('V1_0');
Config.setdeviceName('Z');
var url = Config.getServerURL();
var WebSocketClient = new Client(url);

module.exports = WebSocketClient;
