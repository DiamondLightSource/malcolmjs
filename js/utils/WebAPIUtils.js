/**
 * Created by twi18192 on 18/02/16.
 */

var WebAPI = require('../WebAPI');

var WebAPIUtils = {
  getClocksOUTAValue: function(channelId){
    /* valuePath is the path of whatever you want to get, ie Z:CLOCKS.attributes.A.value */

    /* need to do a 'get' from the server */

    // Get
    //function get(idSub, channelSub) {
    //  var message = '{"type" : "Get", "id" : ' + idSub + ', "endpoint" : "' + channelSub + '"}';
    //  sendMessage(message); // Sends the message through socket
    //  socket.onmessage = function(e) { newMessage(e) };
    //};

    WebAPI.getValue(channelId);

  },

  subscribeChannel: function(){
    WebAPI.subscribeChannel();
  }
};

module.exports = WebAPIUtils;
