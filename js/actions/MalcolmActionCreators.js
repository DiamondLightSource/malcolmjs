/**
 * Created by twi18192 on 02/03/16.
 */

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var appConstants = require('../constants/appConstants.js');
var MalcolmUtils = require('../utils/MalcolmUtils');

var MalcolmActionCreators = {

  initialiseFlowChart: function(requestedData){
    MalcolmUtils.initialiseFlowChart(this.malcolmGet.bind(null, requestedData));

    /* Testing subscribe */
    //MalcolmUtils.initialiseFlowChart(this.malcolmSubscribe.bind(null, requestedData));

  },

  //getBlockList: function(){
  //
  //  /* First notify the stores that we have an initial data fetch pending */
  //
  //  //AppDispatcher.handleAction({
  //  //  //actionType: appConstants.SERVER_REQUESTPENDING,
  //  //  actionType: appConstants.TEST_INITIALDATAFETCH_PENDING,
  //  //  item: 'server request pending'
  //  //});
  //
  //  function getBlockListSuccess(responseMessage){
  //    AppDispatcher.handleAction({
  //      actionType: appConstants.GET_BLOCKLIST_SUCCESS,
  //      item: responseMessage
  //    })
  //  }
  //
  //  function getBlockListFailure(responseMessage){
  //    AppDispatcher.handleAction({
  //      actionType: appConstants.GET_BLOCKLIST_FAILURE,
  //      item: responseMessage
  //    })
  //  }
  //
  //  MalcolmUtils.getBlockList(getBlockListSuccess, getBlockListFailure);
  //
  //},
  //
  //getBlock: function(block){
  //
  //  function testFetchEveryInitialBlockObjectSuccess(responseMessage){
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
  //  MalcolmUtils.getBlock(block, testFetchEveryInitialBlockObjectSuccess,
  //    testFetchEveryInitialBlockObjectFailure)
  //
  //},

  malcolmGet: function(requestedData){

    var testMalcolmGetSuccess;
    var testMalcolmGetFailure;

    function malcolmGetSuccess(responseMessage){
      AppDispatcher.handleAction({
        actionType: appConstants.MALCOLM_GET_SUCCESS,
        item: responseMessage
      })
    }

    function malcolmGetFailure(responseMessage){
      AppDispatcher.handleAction({
        actionType: appConstants.MALCOLM_GET_FAILURE,
        item: responseMessage
      })
    }

    //window.alert(this);

    if(requestedData === 'Z'){
      testMalcolmGetSuccess = function(responseMessage){
        console.log(responseMessage);
        for(var i = 0; i < responseMessage.attributes.blocks.value.length; i++){
          //window.alert("ifhoief");
          /* Doing window.alert doesn't cause an InvariantViolation error like it does
          in the store with this method, unlike the other one with actions being created during the
          consumption of others in the store?
           */

          /* Now, for each block I want to do a 'get' and pass the block
          object to the GUI. I ALSO want to do a subscribe on each of the
          attributes in a block.
          I only want to fetch each block once, so don't put the block get
          inside the attribute subscribe loop!
           */

          var block = responseMessage.attributes.blocks.value[i];
          MalcolmUtils.malcolmGet(block, malcolmGetSuccess, malcolmGetFailure);

          testBlockAttributeSubscribe = function(blockResponseObject){
            console.log(blockResponseObject.attributes);
            for(var attribute in blockResponseObject.attributes) {

              //if (attribute !== 'uptime') {
                console.log(blockResponseObject);
                console.log(attribute);
                console.log(blockResponseObject.attributes[attribute].value);
                //window.alert(blockResponseObject.attributes[attribute]);

                /* Ohhh, I need to put a string of what I want, not just the value (blockResponseObject.attributes[attribute].value) I want! =P */

                var blockName = blockResponseObject.attributes.BLOCKNAME.value;
                var requestedAttributeDataPath = "Z:" + blockName + ".attributes." + attribute;
                actionCreators.malcolmSubscribe(requestedAttributeDataPath);
              //}
            }
          };

          console.log(testBlockAttributeSubscribe);

          MalcolmUtils.malcolmGet(responseMessage.attributes.blocks.value[i], testBlockAttributeSubscribe, malcolmGetFailure);
          //MalcolmUtils.malcolmSubscribe('Z:CLOCKS.attributes.value', malcolmSubscribeSuccess, malcolmSubscribeFailure);


          /* Also need to subscribe channels for each attribute in
          a block, pass another loop as a callback to this? =P
           */
        }
      };

      MalcolmUtils.malcolmGet(requestedData, testMalcolmGetSuccess, malcolmGetFailure);

    }
    else{
      MalcolmUtils.malcolmGet(requestedData, malcolmGetSuccess, malcolmGetFailure);
    }

    //MalcolmUtils.malcolmGet(requestedData, malcolmGetSuccess, malcolmGetFailure);
    //
    //window.alert("fijiwf");


  },

  malcolmSubscribe: function(requestedData){

    //console.log("dijef");

    function malcolmSubscribeSuccess(responseMessage){
      AppDispatcher.handleAction({
        actionType: appConstants.MALCOLM_SUBSCRIBE_SUCCESS,
        item: responseMessage
      })
    }

    function malcolmSubscribeFailure(responseMessage){
      AppDispatcher.handleAction({
        actionType: appConstants.MALCOLM_SUBSCRIBE_FAILURE,
        item: responseMessage
      })
    }

    MalcolmUtils.malcolmSubscribe(requestedData, malcolmSubscribeSuccess, malcolmSubscribeFailure);

  }

};

var actionCreators = MalcolmActionCreators;

function malcolmSubscribeSuccess(responseMessage){
  AppDispatcher.handleAction({
    actionType: appConstants.MALCOLM_SUBSCRIBE_SUCCESS,
    item: responseMessage
  })
}

function malcolmSubscribeFailure(responseMessage){
  AppDispatcher.handleAction({
    actionType: appConstants.MALCOLM_SUBSCRIBE_FAILURE,
    item: responseMessage
  })
}

module.exports = MalcolmActionCreators;
