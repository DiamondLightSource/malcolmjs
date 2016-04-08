/**
 * Created by twi18192 on 02/03/16.
 */

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var appConstants = require('../constants/appConstants.js');
var MalcolmUtils = require('../utils/MalcolmUtils');

var MalcolmActionCreators = {

  initialiseFlowChart: function(requestedData){

    /* Try sending an initialise flowChart start action here */

    AppDispatcher.handleAction({
      actionType: appConstants.INITIALISE_FLOWCHART_START,
      item: 'initialise flowChart start'
    });

    MalcolmUtils.initialiseFlowChart(this.malcolmGet.bind(null, requestedData));

    //window.alert("initialisation finished?");

    //AppDispatcher.handleAction({
    //  actionType: appConstants.INITIALISE_FLOWCHART_END,
    //  item: "initialise flowChart end"
    //});

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
        item: {
          responseMessage: responseMessage,
          requestedData: requestedData
        }
      })
    }

    function malcolmGetFailure(responseMessage){
      AppDispatcher.handleAction({
        actionType: appConstants.MALCOLM_GET_FAILURE,
        item: {
          responseMessage: responseMessage,
          requestedData: requestedData
        }
      })
    }

    //window.alert(this);

    if(requestedData === 'Z'){
      testMalcolmGetSuccess = function(responseMessage){
        console.log(responseMessage);

        /* First, give the GUI the list of all possible blocks */

        //malcolmGetSuccess(responseMessage);

        /* Actually, fetch Z:VISIBILITY, it'll make it
        easier to group the blocks by type for a treeview
         */

        /* Now also need to subscribe to all visible attributes in Z:VISIBILITY */

        var zVisibilitySubscribe = function(zVisibility){
          /* This is to return Z:VISIBILITY to the GUI, but I still
          need to subscribe to all the blocks, so a for loop is
          part of the callback too
           */
          malcolmGetSuccess(zVisibility);
          for(var attribute in zVisibility.attributes){
            if(zVisibility.attributes[attribute].tags !== undefined){
              /* Then it's a block visible attribute, so subscribe to it */

              actionCreators.malcolmSubscribe('VISIBILITY', attribute);

            }
          }
        };

        MalcolmUtils.malcolmGet('Z:VISIBILITY', zVisibilitySubscribe, malcolmGetFailure);

        for(var i = 0; i < responseMessage.attributes.blocks.value.length; i++){
          //if(responseMessage.attributes.blocks.value[i].indexOf('6') !== -1 ||
          //  responseMessage.attributes.blocks.value[i].indexOf("CLOCKS") !== -1 ||
          //  responseMessage.attributes.blocks.value[i].indexOf("BITS") !== -1) {
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
            //MalcolmUtils.malcolmGet(block, malcolmGetSuccess, malcolmGetFailure);

            var testBlockAttributeSubscribe = function (blockResponseObject) {
              /* This sends the block info to the blockStore,
               and then proceeds to do the for loop subscription
               to all the block's attributes, rather than doing
               two separate gets (one to give blockStore the block
               info, and then another to get the block info in order
               to do a subscribe to all its attributes)
               */
              malcolmGetSuccess(blockResponseObject);
              console.log(blockResponseObject.attributes);
              if (blockResponseObject.attributes.VISIBLE.value === 'Show') {
                for (var attribute in blockResponseObject.attributes) {

                  if (attribute !== 'uptime') {
                    console.log(blockResponseObject);
                    console.log(attribute);
                    //console.log(blockResponseObject.attributes[attribute].value);
                    //window.alert(blockResponseObject.attributes[attribute]);

                    /* Ohhh, I need to put a string of what I want, not just the value (blockResponseObject.attributes[attribute].value) I want! =P */

                    var blockName = blockResponseObject.attributes.BLOCKNAME.value;
                    //var requestedAttributeDataPath = "Z:" + blockName + ".attributes." + attribute;
                    actionCreators.malcolmSubscribe(blockName, attribute);
                  }
                }

                //AppDispatcher.handleAction({
                //  actionType: appConstants.INITIALISE_FLOWCHART_END,
                //  item: "initialise flowChart end"
                //});

              }

            };

            /* Comment out the subscribe while I'm testing server write for
             block position
             */
            MalcolmUtils.malcolmGet(responseMessage.attributes.blocks.value[i], testBlockAttributeSubscribe, malcolmGetFailure);
            //MalcolmUtils.malcolmSubscribe('Z:CLOCKS.attributes.value', malcolmSubscribeSuccess, malcolmSubscribeFailure);


            /* Also need to subscribe channels for each attribute in
             a block, pass another loop as a callback to this? =P
             */
          //}
        }

        //window.alert("send initalise flowChart end here?");

        //AppDispatcher.handleAction({
        //  actionType: appConstants.INITIALISE_FLOWCHART_END,
        //  item: "initialise flowChart end"
        //})

      };

      MalcolmUtils.malcolmGet(requestedData, testMalcolmGetSuccess, malcolmGetFailure);

      //AppDispatcher.handleAction({
      //  actionType: appConstants.INITIALISE_FLOWCHART_END,
      //  item: "initialise flowChart end"
      //});

    }
    else{
      MalcolmUtils.malcolmGet(requestedData, malcolmGetSuccess, malcolmGetFailure);
    }

    //MalcolmUtils.malcolmGet(requestedData, malcolmGetSuccess, malcolmGetFailure);
    //
    //window.alert("fijiwf");


  },

  malcolmSubscribe: function(blockName, attribute){

    function malcolmSubscribeSuccess(responseMessage){
      //console.log(requestedData);
      AppDispatcher.handleAction({
        actionType: appConstants.MALCOLM_SUBSCRIBE_SUCCESS,
        item: {
          responseMessage: responseMessage,
          requestedData: {
            blockName: blockName,
            attribute: attribute
          }
        }
      })
    }

    function malcolmSubscribeFailure(responseMessage){
      AppDispatcher.handleAction({
        actionType: appConstants.MALCOLM_SUBSCRIBE_FAILURE,
        item: {
          responseMessage: responseMessage,
          requestedData: {
            blockName: blockName,
            attribute: attribute
          }
        }
      })
    }

    var requestedAttributeDataPath = "Z:" + blockName + ".attributes." + attribute;

    MalcolmUtils.malcolmSubscribe(requestedAttributeDataPath, malcolmSubscribeSuccess, malcolmSubscribeFailure);

  },

  malcolmCall: function(blockName, method, args){

    console.log(blockName);
    console.log(method);
    console.log(args);

    function malcolmCallSuccess(responseMessage){
      AppDispatcher.handleAction({
        actionType: appConstants.MALCOLM_CALL_SUCCESS,
        item: {
          responseMessage: responseMessage,
          requestedDataToWrite: {
            blockName: blockName,
            method: method,
            args: args
          }
        }
      })
    }

    function malcolmCallFailure(responseMessage){
      AppDispatcher.handleAction({
        actionType: appConstants.MALCOLM_CALL_FAILURE,
        item: {
          responseMessage: responseMessage,
          requestedDataToWrite: {
            blockName: blockName,
            method: method,
            args: args
          }
        }
      })
    }

    /* AT this point I don't really know the syntax of the write request,
    so this will likely be wrong and should be changed accordingly
     */
    var requestedDataToWritePath = "Z:" + blockName;

    MalcolmUtils.malcolmCall(requestedDataToWritePath,
      method, args, malcolmCallSuccess, malcolmCallFailure);

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
