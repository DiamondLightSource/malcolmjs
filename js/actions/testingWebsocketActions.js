/**
 * Created by twi18192 on 22/02/16.
 */

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var appConstants = require('../constants/appConstants.js');
var WebAPIUtils = require('../utils/WebAPIUtils');

var testingWebsocketActions = {

  testWrite: function() {

    /* First, do a write to the server of a bit of dummy new data by invoking a funciton in WebAPIUtils */

    WebAPIUtils.testWrite(successWriteAction, failWriteAction);

    /* Then, depending on the response being a success or a failure, dispatch the appropriate action
     to reflect whatever was received by the server in response to the write operation we wanted to perform
     */
    /* Perhaps assume that the write is successful for now and try and deal with a failed one / error later ? */
    /* Could pass two callbacks, a success and a fail one, and have an if statement somewhere that checks the
    response to see which one should be called?
     */

    function successWriteAction(responseMessage) {
      AppDispatcher.handleAction({
        actionType: appConstants.TEST_WRITE_SUCCESS,
        item: responseMessage
      })
    }

    function failWriteAction(responseMessage){
      AppDispatcher.handleAction({
        actionType: appConstants.TEST_WRITE_FAILURE,
        item: responseMessage
      })
    }

  },

  testAddWebsocketOnOpenCallback: function(){

    WebAPIUtils.testAddWebsocketOnOpenCallback(this.testInitialDataFetch)

  },

  testInitialDataFetch: function(){

    /* Listening for this in the store will allow me to show a loading icon while
    the initial data is fetched form the server.
    May have to implement waitFor in case the server request comes back quick enough?
     */

    AppDispatcher.handleAction({
      //actionType: appConstants.SERVER_REQUESTPENDING,
      actionType: appConstants.TEST_INITIALDATAFETCH_PENDING,
      item: 'server request pending'
    });

    WebAPIUtils.testInitialDataFetch(successInitialDataFetchAction, failInitialDataFetchAction);

    /* Callbacks for the entire data fetch */

    function successInitialDataFetchAction(responseMessage) {
      AppDispatcher.handleAction({
        actionType: appConstants.TEST_INITIALDATAFETCH_SUCCESS,
        item: responseMessage
      })
    }

    function failInitialDataFetchAction(responseMessage){
      AppDispatcher.handleAction({
        actionType: appConstants.TEST_INITIALDATAFETCH_FAILURE,
        item: responseMessage
      })
    }

    /* Callbacks for each block data object fetch */

    //function testFetchEveryInitialBlockObjectSuccess(responseMessage){
    //  console.log("fetching block object");
    //
    //  AppDispatcher.handleAction({
    //    actionType: appConstants.TEST_FETCHINITIALBLOCKOBJECT_SUCCESS,
    //    item: responseMessage
    //  })
    //}
    //
    //function testFetchEveryInitialBlockObjectFailure(responseMessage){
    //  AppDispatcher.handleAction({
    //    actionType: appConstants.TEST_FETCHINITIALBLOCKOBJECT_FAILURE,
    //    item: responseMessage
    //  })
    //}

  },

  //testFetchEveryInitialBlockObject: function(blockName){
  //
  //  WebAPIUtils.testFetchEveryInitialBlockObject(blockName,
  //    testFetchEveryInitialBlockObjectSuccess, testFetchEveryInitialBlockObjectFailure);
  //
  //  function testFetchEveryInitialBlockObjectSuccess(responseMessage) {
  //    console.log("fetching block object");
  //
  //    AppDispatcher.handleAction({
  //      actionType: appConstants.TEST_FETCHINITIALBLOCKOBJECT_SUCCESS,
  //      item: responseMessage
  //    })
  //  }
  //
  //  function testFetchEveryInitialBlockObjectFailure(responseMessage){
  //    AppDispatcher.handleAction({
  //      actionType: appConstants.TEST_FETCHINITIALBLOCKOBJECT_FAILURE,
  //      item: responseMessage
  //    })
  //  }
  //
  //}


};

module.exports = testingWebsocketActions;
