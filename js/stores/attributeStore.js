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

// Used for Node.js EventEmitted implementation
let CHANGE_EVENT = 'change';

let update = require('react-addons-update');

let allBlockAttributes = {};

let allBlockAttributesIconStatus = {};

let allBlockItems = [];

/**
 *
 * @param {number} blockId - This is actually a string looking at block.js - hmmm...
 * @param {string} blockAttribute
 * @param {string|number} attributeValue
 */
allBlockAttributes.addBlockAttribute = function (blockId, blockAttribute, attributeValue)
  {
  //updateAttributeValue(blockId, blockAttribute, attributeValue);
  //console.log(`allBlockAttributes.addBlockAttribute: blockId = ${blockId}`);
  if (!this.hasOwnProperty(blockId.toString()))
  //if (!this.length > blockId)
    {
    this[blockId]               = {};
    this[blockId].attributes    = [];
    this[blockId]['BLOCKNAME']  = {};
    this[blockId]['ICON']       = {};
    this[blockId]['ICON'].value = '';
    }
  this[blockId]['BLOCKNAME'].value = blockId;
  this[blockId].attributes.push(blockAttribute);
  this[blockId][blockAttribute] = {};
  //this[blockId][blockAttribute].value = attributeValue;
  this[blockId][blockAttribute] = attributeValue;
  };

/**
 *
 * @param {string} blockId   - Block name
 * @param {string} attribute - Attribute name
 * @param {string} newValue  - New value for local attributes interface entry
 */
function updateAttributeValue(blockId, attribute, newValue)
  {
  //allBlockAttributes[blockId][attribute].value = newValue;

  /* Try using update to cause the reference to change! */

  //let oldAttributes = allBlockAttributes;
  //let oldClocksAttributes = allBlockAttributes['CLOCKS'];

  //console.log(`allBlockAttributes.updateAttributeValue: blockId = ${blockId}   attribute: ${attribute}   newValue: ${newValue}`);

  if (allBlockAttributes.hasOwnProperty(blockId.toString()))
    {
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
    }

  //if(blockId === 'CLOCKS'){
  //  console.log("updating CLOCKS' attributes");
  //}
  //
  //console.log(oldAttributes === allBlockAttributes);
  //console.log(oldClocksAttributes === allBlockAttributes['CLOCKS']);

  }

/**
 *
 * @param {string} blockId   - block name
 * @param {string} attribute - attribute name
 * @param {object} statusObject
 */
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

  if (allBlockAttributesIconStatus.hasOwnProperty(blockId.toString()))
    {

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

  }

/**
* todo: should this be declared as: let attributeStore = merge(EventEmitter.prototype, {...  ??
* Actually it begs the question as to why Flux and Node.js EventEmmitter are both being deployed here
* when changes to any store should probably be using Flux to broadcast and receive change events.
* IG 19 Oct 2016
*/
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

  switch (action.actionType)
  {
    case appConstants.MALCOLM_GET_SUCCESS:
      {
      console.log('attributeStore: MALCOLM_GET_SUCCESS: ');
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

        // Wait for blockCollection to respond to this broadcast message and
        // populate the collection.
        AppDispatcher.waitFor([blockCollection.getDispatchToken()]);

        // Iterate through all blocks available in responseMessage
        // extracting each block attributes, building up the allBlockAttributes table.
        //
        for (let i = 0; i < item.responseMessage.layout.value.name.length; i++)
          {
          let blockName = JSON.stringify(item.responseMessage.layout.value.name[i]);

          /**
          ==========================================================================================
          TODO:
          The old Protocol_1 attributes pattern do not fit with Protocol_2.
          Instead we need to interrogate each block in the upper list (from Get),
          by Get or Subscribe to each block, then assemble the attributes into a local store.
          It begs the question as to why there is an attributeStore instead of each blockStore holding
          its own attributes?

          As a transition to the new code structure required with Protocol2, allBlockAttributes in attributeStore
          will be maintained and mapped to he new BlockCollection instance in blockItems.js
          The plan is eventually to remove this clunky interface and fully incorporate the BlockCollection
          in its place.

          Ian Gillingham - December 2016.
          ==========================================================================================
           */


          /**
           * Iterate through each blockItem in the collection and copy its visibility attribute into
           * attributeStore.allBlockAttributes
           */
          let blockItem = blockCollection.getBlockItem(i);
          console.log(blockItem);

          // I don't think it's necessary to subscribe here, because it's already being done
          // in the BlockCollection class instance and this attribute store will receive all
          // the notifications.
          //MalcolmActionCreators.malcolmSubscribe(blockMRI, []);
          let visible = blockItem.visible();
          allBlockAttributes.addBlockAttribute(blockName, "VISIBLE", blockItem.visible());
          let mri = blockItem.mri();
          if (mri != null)
            {
            //console.log(`attributeStore => mri : blockName = ${blockName} :  mri = ${item.responseMessage.layout.value.mri[i]}`);
            allBlockAttributes.addBlockAttribute(blockName, "MRI", blockItem.mri());
            allBlockAttributes.addBlockAttribute(blockName, "BLOCKNAME", blockItem.blockName());
            }
          let x = blockItem.x();
          let y = blockItem.y();
          /**
           * TODO: All the coordinates need subscribing to, so if any change from the
           *       device, a subscription event will notify and we can then determine which
           *       position has changed and update the blockItem as appropriate.
           *       So - MUST instantiate blockItems with subscriptions and the collection object subscribing to
           *       common position information.
           */
          allBlockAttributes.addBlockAttribute(blockName, "X", x);
          allBlockAttributes.addBlockAttribute(blockName, "Y", y);


          //console.log('attributeStore: Dispatch callback MALCOLM_GET_SUCCESS: iterate top level: blockname = ' + blockName);
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
    appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
      {
      console.log(`attributeStore MALCOLM_SUBSCRIBE_SUCCESS callback: item = ${item}`);
      AppDispatcher.waitFor([blockCollection.dispatchToken]);

      for (let i = 0; i < item.length; i++)
        {
        let index     = item[i];
        let blockItem = blockCollection.getBlockItem(index);
        if (blockItem != null)
          {
          /** This is for when a block has been changed from
           hide to show for the first time via the block palette
           so the GUI isn't yet subscribed to any of the blocks'
           attributes (or at least something along those lines)
           */

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

          updateAttributeValue(blockItem.blockName(), "VISIBLE", blockItem.visible());
          updateAttributeValue(blockItem.blockName(), "X_COORD", blockItem.x());
          updateAttributeValue(blockItem.blockName(), "Y_COORD", blockItem.y());

          //console.log(allBlockAttributes[requestedData.attribute]);
          /* Update allBlockAttributesIconStatus appropriately */

          updateAttributeIconStatus(blockItem.blockName(), "VISIBLE", {
            value  : 'success',
            message: null
          });
          updateAttributeIconStatus(blockItem.blockName(), "X_COORD", {
            value  : 'success',
            message: null
          });
          updateAttributeIconStatus(blockItem.blockName(), "Y_COORD", {
            value  : 'success',
            message: null
          });

          attributeStore.emitChange();
          } // if blockItem != null

        } // for


      break;
      }

    case
    appConstants.MALCOLM_SUBSCRIBE_FAILURE:
      {
      break;
      }

    case
    appConstants.MALCOLM_CALL_SUCCESS:
      {
      console.log("malcolmCallSuccess");

      /* No responseMessage is specified if it's a success */
      //let responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
      if (item.hasOwnProperty('requestedDataToWrite'))
        {
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
        }
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

    case appConstants.BLOCKS_UPDATED:
      break;

    default:
      return true

  }

  return true;

  }
);


module.exports = attributeStore;
