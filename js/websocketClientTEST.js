/**
 * Created by twi18192 on 01/10/15.
 */

var Client = require('./writingWebSocketsInReact');

var WebSocketClient = new Client("wss://echo.websocket.org", null, 10, null, null);

console.log("trying to show all channels");
console.log(WebSocketClient.getAllChannels());
/* This works correctly! :) */

WebSocketClient.addWebSocketOnErrorCallback(function(){
  console.log("just a simple error")
});

//WebSocketClient.close();
//WebSocketClient.sendText("Hello");

//console.log(WebSocketClient.getSentMessages());

//WebSocketClient.subscribeChannel("Test channel", function(){console.log("Test channel 1 callback")}, false, "PV", "Version 0.1", 13);


//WebSocketClient.subscribeChannel("Test channel 2", function(){console.log("Created another test channel")}, false, "PV", "Version 0.2", 16);

//console.log(WebSocketClient.getAllChannels());




module.exports = WebSocketClient;
