/**
 * Created by twi18192 on 10/03/16.
 */
import blockCollection from '../classes/blockItems';
import MalcolmUtils from '../utils/MalcolmUtils';
import MalcolmActionCreators from '../actions/MalcolmActionCreators'

let AppDispatcher = require('../dispatcher/appDispatcher.js');
let appConstants  = require('../constants/appConstants.js');
let EventEmitter  = require('events').EventEmitter;
let assign        = require('../../node_modules/object-assign/index.js');

let CHANGE_EVENT = 'change';

let update = require('react-addons-update');

let allBlockAttributes = {};

let allBlockAttributesIconStatus = {};

let allBlockItems = [];

/**
 *
 * @param {number} blockId
 * @param {string} blockAttribute
 * @param {string|number} attributeValue
 */
allBlockAttributes.addBlockAttribute = function (blockId, blockAttribute, attributeValue)
  {
  //updateAttributeValue(blockId, blockAttribute, attributeValue);
  if (!this.hasOwnProperty(blockId))
    {
    this[blockId]              = {};
    this[blockId].attributes   = [];
    this[blockId]['BLOCKNAME'] = {};
    this[blockId]['ICON'] = {};
    this[blockId]['ICON'].value = '';
    }
  this[blockId]['BLOCKNAME'].value = blockId;
  this[blockId].attributes.push(blockAttribute);
  this[blockId][blockAttribute] = {};
  //this[blockId][blockAttribute].value = attributeValue;
  this[blockId][blockAttribute] = attributeValue;
  };

function updateAttributeValue(blockId, attribute, newValue)
  {
  //allBlockAttributes[blockId][attribute].value = newValue;

  /* Try using update to cause the reference to change! */

  //let oldAttributes = allBlockAttributes;
  //let oldClocksAttributes = allBlockAttributes['CLOCKS'];

  let updatedAttribute = update(allBlockAttributes[blockId][attribute],
    {$merge: {value: newValue}});

  /* I want to replace the whole attributes object for a
   new object, because I don't want to check each individual
   attribute object, I want to just check the entire block
   attribute object in allBlockAttributes
   */

  let attributestoMerge = {};

  attributestoMerge[attribute] = updatedAttribute;

  let updatedAttributes = update(allBlockAttributes[blockId],
    {$merge: attributestoMerge});

  allBlockAttributes[blockId] = update(allBlockAttributes[blockId],
    {$set: updatedAttributes});

  //if(blockId === 'CLOCKS'){
  //  console.log("updating CLOCKS' attributes");
  //}
  //
  //console.log(oldAttributes === allBlockAttributes);
  //console.log(oldClocksAttributes === allBlockAttributes['CLOCKS']);

  }

function updateAttributeIconStatus(blockId, attribute, statusObject)
  {

  /* In the case of block moving the method name doesn't reflect
   the attribute name that you want to update (_set_coords is
   called whenever a block is moved, yet the attributes to update
   are X_COORD and Y_COORD), so use the attributeName variable
   to check this and adjust accordingly
   */

  let attributeName;

  if (attribute !== 'coords' && attribute !== 'visible'
    && attribute.indexOf('_visible') === -1)
    {
    attributeName = attribute;
    }
  else if (attribute === 'visible')
    {
    attributeName = 'VISIBLE';
    }
  else if (attribute.indexOf('_visible') !== -1)
    {
    attributeName = attribute.slice(0, attribute.indexOf('_visible'));
    }
  else
    {
    attributeName = 'X_COORD';
    /* Then also run the function again to update the Y_COORD attribute status */
    updateAttributeIconStatus(blockId, 'Y_COORD', statusObject);
    }

  let updatedAttribute = update(allBlockAttributesIconStatus[blockId][attributeName],
    {
      $merge: {
        value  : statusObject.value,
        message: statusObject.message
      }
    });

  let attributesToMerge = {};

  attributesToMerge[attributeName] = updatedAttribute;

  let updatedAttributes = update(allBlockAttributesIconStatus[blockId],
    {$merge: attributesToMerge});

  allBlockAttributesIconStatus[blockId] = update(allBlockAttributesIconStatus[blockId],
    {$set: updatedAttributes});

  }

// todo: should this be declared as: let attributeStore = merge(EventEmitter.prototype, {...  ??
// IG 19 Oct 2016
let attributeStore = assign({}, EventEmitter.prototype, {

  addChangeListener              : function (cb)
    {
    this.on(CHANGE_EVENT, cb)
    },
  removeChangeListener           : function (cb)
    {
    this.removeListener(CHANGE_EVENT, cb)
    },
  emitChange                     : function ()
    {
    this.emit(CHANGE_EVENT)
    },
  getAllBlockAttributes          : function ()
    {
    return allBlockAttributes;
    },
  getAllBlockAttributesIconStatus: function ()
    {
    return allBlockAttributesIconStatus;
    }

});

attributeStore.dispatchToken = AppDispatcher.register(function (payload)
  {
  let action          = payload.action;
  let item            = action.item;
  let responseMessage = JSON.parse('null');
  let requestedData   = JSON.parse('null');

  switch (action.actionType)
  {
    case appConstants.MALCOLM_GET_SUCCESS:
      {
      //console.log('attributeStore: MALCOLM_GET_SUCCESS: ');
      //console.log("REQUESTED: => " + JSON.stringify(item.requestedData));
      //console.log("RESPONSE: => " + JSON.stringify(item.responseMessage));

      // Determine whether the GET notification is in response to:
      // Top level item list or individual item attributes.
      // The top level case will have a 'layout' attribute.
      if (item.responseMessage.hasOwnProperty('layout'))
        {
        //console.log("item.responseMessage.layout = ");
        //console.log(item.responseMessage.layout);
        //console.log("item.responseMessage.layout.value.length = " + item.responseMessage.layout.value.name.length);

        // === blockCollection.createBlockItemsFromSchema(item.responseMessage);

        // Iterate through all blocks available in responseMessage
        // extracting each block attributes, building up the allBlockAttributes table.
        //
        for (let i = 0; i < item.responseMessage.layout.value.name.length; i++)
          {
          let blockName = item.responseMessage.layout.value.name[i];
          let blockMRI = item.responseMessage.layout.value.mri[i];

          //==========================================================================================
          // TODO:
          // The old Protocol_1 attributes pattern do not fit with Protocol_2.
          // Instead we need to interrogate each block in the upper list (from Get),
          // by Get or Subscribe to each block, then assemble the attributes into a local store.
          // It begs the question as to why there is an attributeStore instead of each blockStore holding
          // its own attributes?
          // Ian Gillingham - October 2016.
          //==========================================================================================

          // here we go...
          //
          // Create an instance of BlockItem to be associated with this block and to provide callbacks.
          let requestedAttributeDataPath = [blockMRI];
          console.log(`MalcolmActionCreators.malcolmSubscribe(): blockMRI = ${blockMRI}`);
          MalcolmUtils.malcolmSubscribe(requestedAttributeDataPath, malcolmSubscribeSuccess, malcolmSubscribeFailure);


          if (item.responseMessage.layout.value.hasOwnProperty("visible"))
            {
            console.log(`attributeStore => visible : blockName = ${blockName}`);
            allBlockAttributes.addBlockAttribute(blockName, "VISIBLE", item.responseMessage.layout.value.visible[i]);
            //allBlockAttributes[blockName]["VISIBLE"] = item.responseMessage.layout.value.visible[i];
            }
          if (item.responseMessage.layout.value.hasOwnProperty("mri"))
            {
            console.log(`attributeStore => mri : blockName = ${blockName} :  mri = ${item.responseMessage.layout.value.mri[i]}`);
            let mri = item.responseMessage.layout.value.mri[i];
            allBlockAttributes.addBlockAttribute(blockName, "MRI", mri);
            // Create an instance of BlockItem to be associated with this block and to provide callbacks.
            //allBlockAttributes[blockName]["MRI"] = item.responseMessage.layout.value.mri[i];
            }
          if (item.responseMessage.layout.value.hasOwnProperty("x"))
            {
            /**
             * TODO: All the coordinates need subscribing to, so if any change from the
             *       device, a subscription event will notify and we can then determine which
             *       position has changed and update the blockItem as appropriate.
             *       So - MUST instantiate blockItems with subscriptions and the collection object subscribing to
             *       common position information.
             */
            //actionCreators.malcolmSubscribe(actionCreators.deviceId,["layout","value","x"]);
            allBlockAttributes.addBlockAttribute(blockName, "X", item.responseMessage.layout.value.x[i]);
            //allBlockAttributes[blockName]["X"] = item.responseMessage.layout.value.x[i];
            }
          if (item.responseMessage.layout.value.hasOwnProperty("y"))
            {
            allBlockAttributes.addBlockAttribute(blockName, "Y", item.responseMessage.layout.value.y[i]);
            //allBlockAttributes[blockName]["Y"] = item.responseMessage.layout.value.y[i];
            }


          console.log('attributeStore: Dispatch callback MALCOLM_GET_SUCCESS: iterate top level: blockname = ' + blockName);
          /* Try using allBlockAttributesIconStatus for widgetIconStatus */

          /* Add the block to allBlockAttributesIconStatus */
          allBlockAttributesIconStatus[blockName] = {};

          for (let attribute in allBlockAttributes[blockName].attributes)
            {
            allBlockAttributesIconStatus[blockName][attribute] = {
              value  : 'success',
              message: null
            };

            }
          }

        attributeStore.emitChange();
        break;
        } // end if hasOwnProperty('layout')
      else // 'layout' found so must be an item attributes response
        {

        }
      break;
      }

    case appConstants.MALCOLM_GET_FAILURE:
      {
      console.log("attributeStore MALCOLM GET ERROR!");

      /* Not sure what to do when a GET block failure occurs,
       it's not really related any specific widget is it?
       */
      console.log("GET ERROR: REQUESTED: => " + JSON.stringify(item.requestedData));
      console.log("GET ERROR: RESPONSE: => " + JSON.stringify(item.responseMessage));

      attributeStore.emitChange();
      break;
      }

    case
    appConstants.MALCOLM_SUBSCRIBE_SUCCESS
    :
      {
      console.log('attributeStore: MALCOLM_SUBSCRIBE_SUCCESS: ');
      console.log("REQUESTED: => " + JSON.stringify(item.requestedData));
      console.log("RESPONSE: => " + JSON.stringify(item.responseMessage));
      if (item.requestedData.blockName !== 'VISIBILITY')
        {
        responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
        requestedData   = JSON.parse(JSON.stringify(item.requestedData));

        updateAttributeValue(requestedData.blockName,
          requestedData.attribute, responseMessage.value);
        }
      /* This is for when a block has been changed from
       hide to show for the first time via the block palette
       so the GUI isn't yet subscribed to any of the blocks'
       attributes (or at least something along those lines)
       */
      else if (item.requestedData.blockName === 'VISIBILITY')
        {
        responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
        requestedData   = JSON.parse(JSON.stringify(item.requestedData));

        /* UPDATE: so this works and the toggle switches stay in sync,
         but I'm pretty sure I'm doing more updates than I need; I think
         what's happening is that every time VISIBILITY changes a blocks'
         visible status, the individual block attribute for its tab is being
         updated at the same time as the overall master block.
         It works for now, so keep it, but don't forget about this either!
         */

        /* UPDATED UPDATE: actually, if one changes, the server knows to
         change the other, so I'll receive a subscribe message from both,
         so I don't think it's any more complicated than simply updating
         what attributes I'm given! (So I think I can even get rid of
         this else if statement and simply have updateAttributeValue being
         invoked for ALL malcolmSubscribes that come to attributeStore)
         */

        /* UPDATE THE UPDATED UPDATE: right, so when I add a new block
         via VISIBILITY I don't actually subscribe to its attributes, it's
         only on refresh do I do that, hence the need to do this since not only
         does a block's visible attribute not update, but neither does any of
         them until the next refresh!
         So the solution is basically to have attribute subscription when a
         block is added/mounted
         */

        //if(allBlockAttributes[requestedData.attribute].value !== responseMessage.value) {
        //
        //  updateAttributeValue(requestedData.attribute, 'VISIBLE',
        //    responseMessage.value);
        //
        //}

        updateAttributeValue(requestedData.blockName,
          requestedData.attribute, responseMessage.value);

        //console.log(allBlockAttributes[requestedData.attribute]);

        if (allBlockAttributes[requestedData.attribute]['VISIBLE'].value !== responseMessage.value)
          {

          updateAttributeValue(requestedData.attribute, 'VISIBLE',
            responseMessage.value);

          }
        }

      /* Update allBlockAttributesIconStatus appropriately */

      updateAttributeIconStatus(requestedData.blockName, requestedData.attribute, {
        value  : 'success',
        message: null
      });

      attributeStore.emitChange();
      break;
      }

    case
    appConstants.MALCOLM_SUBSCRIBE_FAILURE
    :
      {
      console.log("malcolmSubscribeFailure in attributeStore");
      console.log(item.requestedData, item.responseMessage)

      let responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
      let requestedData   = JSON.parse(JSON.stringify(item.requestedData));

      /* Update allBlockAttributesIconStatus appropriately */

      updateAttributeIconStatus(requestedData.blockName, requestedData.attribute, {
        value  : 'failure',
        message: responseMessage
      });

      attributeStore.emitChange();
      break;
      }

    case
    appConstants.MALCOLM_CALL_SUCCESS
    :
      {
      console.log("malcolmCallSuccess");

      /* No responseMessage is specified if it's a success */
      //let responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
      let requestedDataToWrite = JSON.parse(JSON.stringify(item.requestedDataToWrite));

      /* As we will receive the METHOD name in requestedDataToWrite,
       we need to get rid of the _set_ at the start of requestedDataToWrite.method
       string in order to update the corresponding attribute/widget properly
       */

      let attributeToUpdate = requestedDataToWrite.method.slice('_set_'.length);

      updateAttributeIconStatus(requestedDataToWrite.blockName, attributeToUpdate, {
        value  : 'success',
        message: null
      });

      attributeStore.emitChange();
      break;
      }

    case
    appConstants.MALCOLM_CALL_FAILURE
    :
      {
      console.log("malcolmCallFailure");

      let responseMessage      = JSON.parse(JSON.stringify(item.responseMessage));
      let requestedDataToWrite = JSON.parse(JSON.stringify(item.requestedDataToWrite));

      let attributeToUpdate = requestedDataToWrite.method.slice('_set_'.length);

      updateAttributeIconStatus(requestedDataToWrite.blockName, attributeToUpdate, {
        value  : 'failure',
        message: responseMessage
      });

      attributeStore.emitChange();
      break;
      }

    case
    appConstants.MALCOLM_CALL_PENDING
    :
      {
      let requestedDataToWrite = JSON.parse(JSON.stringify(item.requestedDataToWrite));

      let attributeToUpdate = requestedDataToWrite.method.slice('_set_'.length);

      console.log('malcolmCallPending');

      updateAttributeIconStatus(requestedDataToWrite.blockName, attributeToUpdate, {
        value  : 'pending',
        message: null
      });

      attributeStore.emitChange();
      break;
      }

    default:
      return true

  }

  return true;

  }
);

function malcolmSubscribeSuccess(responseMessage)
  {
    console.log('attributeStore.malcolmSubscribeSuccess: responseMessage ->');
    console.log(responseMessage);
  //updateSchema(responseMessage);
  }

function malcolmSubscribeFailure(responseMessage)
  {
  console.log('attributeStore.malcolmSubscribeFailure: responseMessage ->');
  console.log(responseMessage);
  }

module.exports = attributeStore;
