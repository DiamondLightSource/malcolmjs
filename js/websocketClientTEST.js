/**
 * Created by twi18192 on 01/10/15.
 */

var ClientTest = require('./writingWebSocketsInReact');

var WebSocketClientTest = new ClientTest("wss://echo.websocket.org", null, 10, null, null);

console.log("trying to show all channels");
console.log(WebSocketClientTest.getAllChannels());
/* This works correctly! :) */

WebSocketClientTest.addWebSocketOnErrorCallback(function(){
  console.log("just a simple error")
});

//WebSocketClient.close();
//WebSocketClient.sendText("Hello");

//console.log(WebSocketClient.getSentMessages());

//WebSocketClient.subscribeChannel("Test channel", function(){console.log("Test channel 1 callback")}, false, "PV", "Version 0.1", 13);


//WebSocketClient.subscribeChannel("Test channel 2", function(){console.log("Created another test channel")}, false, "PV", "Version 0.2", 16);

//console.log(WebSocketClient.getAllChannels());




module.exports = WebSocketClientTest;
