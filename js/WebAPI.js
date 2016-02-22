/**
 * Created by twi18192 on 18/02/16.
 */

var WebSocketClient = require('./websocketClient');
//var FluxWebSocketClient = require('./fluxWebsocketClient');

var appConstants = require('./constants/appConstants');
var AppDispatcher = require('./dispatcher/appDispatcher');


/* Need a function to check if the server interaction was a success or a failure */

//function serverInteractionCallback(message){
//
//  console.log(message);
//
//  /* Check stuff and have if statements to do different things for a successful response and a failed response
//  Note that these notifications to the store will be in the form of action dispatches still!!!*/
//
//    /* ie, if failed, dispatch an action that tells the store to show an error icon next to that particular field */
//
//    /* if successful, dispatch an action to update the store with the new data */
//    /* For now, assume that we have asuccessful response, so now I can dispatch an action to alter some data and act
//    a proper data fetch from an actual server!
//     */
//    //AppDispatcher.handleAction({
//    //  actionType: appConstants.TEST_DATAFETCH,
//    //  item: message
//    //});
//
//  AppDispatcher.handleAction({
//    actionType: appConstants.TEST_SUBSCRIBECHANNEL,
//    item: message
//  });
//}
//
//function dispatchServerRequestPending(){
//  AppDispatcher.handleAction({
//    actionType: appConstants.SERVER_REQUESTPENDING,
//    item: 'server request pending' /* pretty sure something else more useful should go here */
//  })
//}

var WebAPI = {
  //getValue: function(channelId, valuePath){
  //
  //  /* Make a dispatch telling stores that I have a server request pending */
  //
  //  dispatchServerRequestPending();
  //
  //  /* Create the message to be sent */
  //
  //  var message = '{"type" : "Get", "id" : ' + channelId + ', "endpoint" : "' + "Z:CLOCKS.attributes.OUTA.value" + '"}';
  //  var messageThatShouldCauseError = '{"ttpe" : "Het", "id" : ' + channelId + ', "endpoint" : "' + "rhgw" + '"}';
  //  /* I won't actually be using the writingWebSocketsInReact.js file, I'll be writing my own, so use the simpler pseudocode
  //   to represent websocket message sending for now, but it'll change when I write websockets myself
  //   */
  //
  //  /* Make the request */
  //
  //  //FluxWebSocketClient.close(); /* trying to get an error, doesn't work closing the websocket then trying to send a message? */
  //
  //  FluxWebSocketClient.sendText(message, serverInteractionCallback);
  //
  //  /* Note that I need a success callback if the get was successful, and an error callback if the get was a failure
  //  that goes along with my above request
  //   */
  //  /* Will likely implement a similar thing to the webpods thing I documented that had an onErrorCallback thing */
  //
  //},
  //
  //subscribeChannel: function(){
  //  console.log("subscribe channel");
  //  FluxWebSocketClient.subscribeChannel('Z:CLOCKS.attributes.OUTA', serverInteractionCallback, true);
  //},



  /* Back to using the WebPODS client constructor */

  testWrite: function(message, successCallBack, failureCallback){

    /* The checking of whether the write was a success of a failure should go here I guess? */
    /* I need to check the response somehow */
    /* Problem with using addWebSocketOnErrorCallback or addOnServerMessageCallback is that ALL functions in the
    array will be called, not the channel specific one, so if ONE channel gets an error then ALL channels with give
    thier error message???
     */
    /* I suppose there'll be channel id's, could I potentially use that to access the correct callback? */

    /* Here I would have somehting like:
     websocket.onmessage = fucntion(event){do stuff to dispatch the action finally}
     */

    /* May need to use something more sophisticated later, like .call(), but for now this'll work */

    //successCallBack();
    /* Hmm, the message from the server needs to be the input parameter of the callback function,
    how do I do that? */

    /* I can't just make websocket.onmessage have a callback function can I, since it RECEIVES its
    paramaters from the server, if I try to specify more arguments it'll throw and error saying it's not
    receving enough input parameters? */

    /* Maybe just use addOnServerMessageCallBacks for now and worry about this later? =P */


    WebSocketClient.addOnServerMessageCallback(successCallBack);
    WebSocketClient.addWebSocketOnErrorCallback(failureCallback);

    WebSocketClient.sendText(message);

    /* Not sure what to do now, do I make the stores do something with the response info? */

  }


};

module.exports = WebAPI;
