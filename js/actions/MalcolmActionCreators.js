/**
 * Created by twi18192 on 02/03/16.
 */

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var appConstants = require('../constants/appConstants.js');
var MalcolmUtils = require('../utils/MalcolmUtils');
var Config = require('../utils/config');

var MalcolmActionCreators = {

  /* default device name to Z, which was the original name for the simulator device */
//  deviceId: "Z",
  deviceId: ((Config.getProtocolVersion() === 'V2_0') ? "P" : "Z"),
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

  malcolmGet: function(requestedData){

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

    if(requestedData === actionCreators.deviceId){

      var testMalcolmGetSuccess = function(responseMessage){
        console.log(responseMessage);

        /* Fetch Z:VISIBILITY, and then subscribe to all visible
        attributes in Z:VISIBILITY
        */

        var zVisibilitySubscribe = function(zVisibility){
          /* This is to return Z:VISIBILITY to the GUI, but I still
          need to subscribe to all the blocks, so a for loop is
          part of the callback too
           */
          malcolmGetSuccess(zVisibility);

          for(var attribute in zVisibility.attributes){
            if(zVisibility.attributes[attribute].tags !== undefined){
              /* Then it's a block visible attribute, so subscribe to it */

              if (Config.getProtocolVersion() === 'V2_0')
                {
                actionCreators.malcolmSubscribe(['VISIBILITY', attribute]);
                }
              else
                {
                  actionCreators.malcolmSubscribe('VISIBILITY', attribute);
                  //console.log('malcolmGet: attribute: '+attribute);
                }


            }
          }
        };

        if (Config.getProtocolVersion() === 'V2_0')
          {
          MalcolmUtils.malcolmGet([actionCreators.deviceId], zVisibilitySubscribe, malcolmGetFailure);
          }
        else
          {
          MalcolmUtils.malcolmGet(actionCreators.deviceId+':VISIBILITY', zVisibilitySubscribe, malcolmGetFailure);
          }


        /* Fetching each block in the list */

        for(var i = 0; i < responseMessage.attributes.blocks.value.length; i++){

          /* Try doing the block attribute subscribe in block's componentDidMount
          instead of here, so simply fetch each block and hand it to the GUI
          to populate testAllBlockInfo
           */

          var block = responseMessage.attributes.blocks.value[i];

          if (Config.getProtocolVersion() === 'V2_0')
          {
            MalcolmUtils.malcolmGet([block], malcolmGetSuccess, malcolmGetFailure);
          }
          else
          {
            MalcolmUtils.malcolmGet(block, malcolmGetSuccess, malcolmGetFailure);
          }

        }

      };

      /* This is the initial malcolmGet call that returns Z; I then
      pass it a callback function that loops through Z.attributes.blocks.value
      and fetches each block in that list
       */

      MalcolmUtils.malcolmGet(requestedData, testMalcolmGetSuccess, malcolmGetFailure);

    }
    else
      {
      MalcolmUtils.malcolmGet(requestedData, malcolmGetSuccess, malcolmGetFailure);
      }

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

    var requestedAttributeDataPath = '';

    if (Config.getProtocolVersion() === 'V2_0')
      {
      requestedAttributeDataPath = [actionCreators.deviceId, blockName, "attributes", attribute];
      }
    else
      {
      requestedAttributeDataPath = actionCreators.deviceId + ":" + blockName + ".attributes." + attribute;
      }

    MalcolmUtils.malcolmSubscribe(requestedAttributeDataPath, malcolmSubscribeSuccess, malcolmSubscribeFailure);

  },

  malcolmCall: function(blockName, method, args){

    AppDispatcher.handleAction({
      actionType: appConstants.MALCOLM_CALL_PENDING,
      item: {
        requestedDataToWrite: {
          blockName: blockName,
          method: method,
          args: args
        }
      }
    });

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

    var requestedDataToWritePath = '';

    if (Config.getProtocolVersion() === 'V2_0')
      {
      requestedDataToWritePath = [actionCreators.deviceId, blockName];
      }
    else
      {
      requestedDataToWritePath = actionCreators.deviceId + ":" + blockName;
      }

    MalcolmUtils.malcolmCall(requestedDataToWritePath,
      method, args, malcolmCallSuccess, malcolmCallFailure);

  }

};

var actionCreators = MalcolmActionCreators;

console.log("MalcolmActionCreators: deviceId = "+MalcolmActionCreators.deviceId);

module.exports = MalcolmActionCreators;
