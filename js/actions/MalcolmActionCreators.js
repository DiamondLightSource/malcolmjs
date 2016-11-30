/*eslint-env es6*/

/**
 * Created by twi18192 on 02/03/16.
 */

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var appConstants  = require('../constants/appConstants.js');
import MalcolmUtils from '../utils/MalcolmUtils';
import config from "../utils/config";

let MalcolmActionCreators;


MalcolmActionCreators = {

  /* default device name to Z, which was the original name for the simulator device */
  //  deviceId: "Z",
  deviceId           : ((config.getProtocolVersion() === 'V2_0') ? "P" : "Z"),
  topLevelGetId      : 0,
  topLevelSubscribeId: 0,
  initialiseFlowChart: function (requestedData)
    {

    /* Try sending an initialise flowChart start action here */

    AppDispatcher.handleAction({
      actionType: appConstants.INITIALISE_FLOWCHART_START,
      item      : 'initialise flowChart start'
    });

    // NB: bind in this context, forces a pre-specified initial argument of requestedData.
    // The specified function argument becomes registered with WebSocketClient as a OnOpen callback,
    // which initiates the first Get of the top level layout information.
    MalcolmUtils.initialiseFlowChart(this.malcolmGet.bind(null, requestedData));

    //window.alert("initialisation finished?");

    //AppDispatcher.handleAction({
    //  actionType: appConstants.INITIALISE_FLOWCHART_END,
    //  item: "initialise flowChart end"
    //});

    /* Testing subscribe */
    //MalcolmUtils.initialiseFlowChart(this.malcolmSubscribe.bind(null, requestedData));

    },

  malcolmGet: function (requestedData)
    {
    function malcolmGetSuccess(responseMessage)
      {
      // Dispatch MALCOLM_GET_SUCCESS to all subscribers.
      AppDispatcher.handleAction(
        {
          actionType: appConstants.MALCOLM_GET_SUCCESS,
          item      : {
            responseMessage: responseMessage,
            requestedData  : requestedData
          }
        })
      }

    // Dispatch MALCOLM_GET_FAILURE to all subscribers.
    function malcolmGetFailure(responseMessage)
      {
      AppDispatcher.handleAction(
        {
          actionType: appConstants.MALCOLM_GET_FAILURE,
          item      : {
            responseMessage: responseMessage,
            requestedData  : requestedData
          }
        })
      }

    let itemGetSuccess = function (responseMessage)
      {
      //console.log('MalcolmActionCreators: itemGetSuccess...');
      //console.log('requestedData =>');
      //console.log(requestedData);
      //console.log('responseMessage =>');
      //console.log(responseMessage);
      /* This is to return P:<item>
       */
      malcolmGetSuccess(responseMessage);

      };

    // Note: This is the callback function which handles the
    // subscription return.
    let zVisibilitySubscribe = function (zVisibility)
      {
      //console.log('MalcolmActionCreators: zVisibility...')
      //console.log(zVisibility);
      // zVisibility represents the top level object for the device
      // which includes layout and visibility details:
      // zVisibility.layout.value.visible[]
      // IJG 31/10/16

      /* This is to return Z:VISIBILITY to the GUI, but I still
       need to subscribe to all the blocks, so a for loop is
       part of the callback too
       */
      malcolmGetSuccess(zVisibility);

      // Subscribe to the visibility list.
      actionCreators.malcolmSubscribe(actionCreators.deviceId,["layout","value","visible"]);

      //==========================================================================================
      // TODO:
      // The old Protocol_1 attributes pattern do not fit with Protocol_2.
      // Instead we need to interrogate each block in the upper list (from Get),
      // by Get or Subscribe to each block, then assemble the attributes into a local store.
      // It begs the question as to why there is an attributeStore instead of each block item holding
      // its own attributes?
      // Ian Gillingham - October 2016.
      //==========================================================================================


      };

    let testMalcolmGetSuccess = function (responseMessage)
      {
      //console.log(`MalcolmActionCreators: testMalcolmGetSuccess: responseMessage...  topLevelGetId = ${actionCreators.topLevelGetId}`)
      //console.log(responseMessage);

      /* Fetch Z:VISIBILITY, and then subscribe to all visible
       attributes in Z:VISIBILITY
       */

      //=============*!*!*!*!*!*!
      // TEMPORARY RETURN TO AVOID EXCEPTION DURING DEV: TODO
      //=============*!*!*!*!*!*!
      //return;

      // Instruct MalcolmUtils to get the visibility information for all blocks on the remote instrument.
      // Was: MalcolmUtils.malcolmGet('Z:VISIBILITY', zVisibilitySubscribe, malcolmGetFailure);
      MalcolmUtils.malcolmGet([actionCreators.deviceId], zVisibilitySubscribe, malcolmGetFailure);

      };


    console.log('MalcolmActionCreators: malcolmGet: Requested data...');
    console.log(requestedData);
    console.log('MalcolmActionCreators: malcolmGet: deviceId...');
    console.log(actionCreators.deviceId);

    if (requestedData === actionCreators.deviceId)
      {

      /*
       ===========================================================================
       This is the initial malcolmGet call that returns the top level device block (once called Z);
       It is then passed a callback function that loops through all the contained
       attributes.blocks.value and fetches each block in that list
       ===========================================================================
       */

      actionCreators.topLevelGetId = MalcolmUtils.malcolmGet(requestedData, testMalcolmGetSuccess, malcolmGetFailure);
      //console.log(`MalcolmActionCreators: malcolmGet(): Issue Request for data:  topLevelGetId = ${actionCreators.topLevelGetId}`);
      }
    else
      {
      actionCreators.topLevelGetId = MalcolmUtils.malcolmGet(requestedData, malcolmGetSuccess, malcolmGetFailure);
      //console.log(`MalcolmActionCreators: malcolmGet() [requestedData !== actionCreators.deviceId]: Issue Request for data:  topLevelGetId = ${actionCreators.topLevelGetId}`);
      }

    },

  /**
   *
   * @param {string} blockName - MRI name of block (e.g. "P:OUTENC3")
   * @param {[string]} attribute - array of attribute tree to subscribe to
   */
  malcolmSubscribe: function (blockName, attribute)
    {

    function malcolmSubscribeSuccess(responseMessage)
      {
      //console.log(requestedData);
      AppDispatcher.handleAction({
        actionType: appConstants.MALCOLM_SUBSCRIBE_SUCCESS,
        item      : {
          responseMessage: responseMessage,
          requestedData  : {
            blockName: blockName,
            attribute: attribute
          }
        }
      })
      }

    function malcolmSubscribeFailure(responseMessage)
      {
      AppDispatcher.handleAction({
        actionType: appConstants.MALCOLM_SUBSCRIBE_FAILURE,
        item      : {
          responseMessage: responseMessage,
          requestedData  : {
            blockName: blockName,
            attribute: attribute
          }
        }
      })
      }

    //let requestedAttributeDataPath = [actionCreators.deviceId, blockName, "attributes", attribute];
    let requestedAttributeDataPath = [blockName].concat(attribute);

    console.log(`MalcolmActionCreators.malcolmSubscribe(): blockName = ${blockName}   attribute = ${JSON.stringify(attribute)}`);
    let id = MalcolmUtils.malcolmSubscribe(requestedAttributeDataPath, malcolmSubscribeSuccess, malcolmSubscribeFailure);

    },

  malcolmCall: function (blockName, method, args)
    {
    let requestedDataToWritePath;

    AppDispatcher.handleAction({
      actionType: appConstants.MALCOLM_CALL_PENDING,
      item      : {
        requestedDataToWrite: {
          blockName: blockName,
          method   : method,
          args     : args
        }
      }
    });

    function malcolmCallSuccess(responseMessage)
      {
      AppDispatcher.handleAction({
        actionType: appConstants.MALCOLM_CALL_SUCCESS,
        item      : {
          responseMessage     : responseMessage,
          requestedDataToWrite: {
            blockName: blockName,
            method   : method,
            args     : args
          }
        }
      })
      }

    function malcolmCallFailure(responseMessage)
      {
      AppDispatcher.handleAction({
        actionType: appConstants.MALCOLM_CALL_FAILURE,
        item      : {
          responseMessage     : responseMessage,
          requestedDataToWrite: {
            blockName: blockName,
            method   : method,
            args     : args
          }
        }
      })
      }


    requestedDataToWritePath = [actionCreators.deviceId, blockName];

    MalcolmUtils.malcolmCall(requestedDataToWritePath,
      method, args, malcolmCallSuccess, malcolmCallFailure);

    }

};

const actionCreators = MalcolmActionCreators;

module.exports = MalcolmActionCreators;
