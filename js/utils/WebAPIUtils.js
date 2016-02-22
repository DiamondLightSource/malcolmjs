/**
 * Created by twi18192 on 18/02/16.
 */

var WebAPI = require('../WebAPI');

var WebAPIUtils = {
  //getClocksOUTAValue: function(channelId){
  //  /* valuePath is the path of whatever you want to get, ie Z:CLOCKS.attributes.A.value */
  //
  //  /* need to do a 'get' from the server */
  //
  //  // Get
  //  //function get(idSub, channelSub) {
  //  //  var message = '{"type" : "Get", "id" : ' + idSub + ', "endpoint" : "' + channelSub + '"}';
  //  //  sendMessage(message); // Sends the message through socket
  //  //  socket.onmessage = function(e) { newMessage(e) };
  //  //};
  //
  //  WebAPI.getValue(channelId);
  //
  //},
  //
  //subscribeChannel: function(){
  //  WebAPI.subscribeChannel();
  //},

  testWrite: function(successCallback, failureCallback){
    /* Do a simple write to the server */
    /* I don't have access to the file that was used in the GUI server thing, but using WebPods' protocol to
    say what value it should be / the message layout shouldn't be too bad for now:

     {
     “message” : “write”,
     “id” : <unique-id-integer>,
     “value” : <json-value>
     }

     */
    var message = '{"type" : "Write", "id" : ' + 0 + ', "value" : "' + "false" + '"}'; // setting something to 'false'

    WebAPI.testWrite(message, successCallback, failureCallback);



  }
};

module.exports = WebAPIUtils;
