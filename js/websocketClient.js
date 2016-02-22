/**
 * Created by twi18192 on 16/02/16.
 */

var Client = require('./writingWebSocketsInReact');
//
//var WebSocketClient = new Client("ws://pc0013.cs.diamond.ac.uk:8080/ws", null, null, null, null);
//
//WebSocketClient.addWebSocketOnOpenCallback(function(){
//  console.log("addWebSocketOnOpenCallback")
//});
//
//WebSocketClient.addWebSocketOnCloseCallback(function(){
//  console.log("addWebSocketOnCloseCallback")
//});
//
//WebSocketClient.addWebSocketOnErrorCallback(function(){
//  console.log("addWebSocketOnErrorCallback")
//});
//
//WebSocketClient.addOnServerMessageCallback(function(){
//  console.log("addOnServerMessageCallback")
//});

//WebSocketClient.subscribeChannel('Z', function(){
//  console.log("subscribed to a channel Z")
//});
//
//console.log(WebSocketClient.isLive);
//console.log(WebSocketClient.getAllChannels());
//
//var Zebra = WebSocketClient.getChannel(0);
//
//console.log(Zebra);
//
//console.log(Zebra.id);
//console.log(Zebra.isConnected());


/* Using the generic websocket constructor function, but I'll be defining my own soon-ish */

//var WebSocketClient = new WebSocket('ws://pc0013.cs.diamond.ac.uk:8080/ws');
var WebSocketClient = new Client('ws://echo.websocket.org');

module.exports = WebSocketClient;
