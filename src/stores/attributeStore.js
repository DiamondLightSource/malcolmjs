/**
 * Created by twi18192 on 10/03/16.
 */
import blockCollection from '../classes/blockItems';

import AppDispatcher from '../dispatcher/appDispatcher.js';
import appConstants from '../constants/appConstants.js';
import EventEmitter from 'events';
import update from 'immutability-helper';

// Used for Node.js EventEmitted implementation
let CHANGE_EVENT = 'change';


let allBlockAttributes = {};

let allBlockAttributesIconStatus = {};

/**
 *
 * addBlockAttribute():
 * Given a blockItem, copy it into the attributeStore in the form that's expected by old clients of
 * attributeStore. TODO: This is a short-term kludge to get this suite working as quickly as possible, but should be
 * cleaned up and rationalised ASAP.
 * IJG Feb 2017.
 *
 * @param {string} blockItem   - block item instance to add to store
 *
 */
allBlockAttributes.addBlockAttributes = function (blockItem)
  {
  //updateAttributeValue(blockName, blockAttribute, attributeValue);
  //console.log(`allBlockAttributes.addBlockAttribute: blockName = ${blockName}`);
  let blockName  = blockItem.blockName();
  let attributes = blockItem.getAllBlockAttributes();
  if (!this.hasOwnProperty(blockName))
    {
    this[blockName]               = {};
    this[blockName]['BLOCKNAME']  = blockName;
    this[blockName]['ICON']       = {};
    this[blockName]['ICON'].value = '';
    }

  for (let attributeName in attributes)
    {
    let attribute = blockItem.getAttribute(attributeName);

    if (attributeName === "visible")
      {
      this[blockName]["VISIBLE"] = attribute;
      }
    else
      {
      this[blockName][attributeName] = attribute;
      }
    }
  if (attributes.hasOwnProperty("x"))
    {
    this["X_COORD"] = attributes.x;
    }
  if (attributes.hasOwnProperty("y"))
    {
    this["Y_COORD"] = attributes.y;
    }
  };

allBlockAttributesIconStatus.addBlockAttributeIconStatus = function (blockName, attributeName, value, message)
  {
  if (!this.hasOwnProperty(blockName))
    {
    this[blockName] = {};
    }
  this[blockName][attributeName] = {value: message};
  };

/**
 *
 * @param {object} blockitem   - Block Item
 */
function updateAttributeValue(blockitem)
  {
  //allBlockAttributes[blockId][attribute].value = newValue;

  /* Try using update to cause the reference to change! */

  //let oldAttributes = allBlockAttributes;
  //let oldClocksAttributes = allBlockAttributes['CLOCKS'];

  //console.log(`allBlockAttributes.updateAttributeValue: blockId = ${blockId}   attribute: ${attribute}   newValue: ${newValue}`);

  allBlockAttributes.addBlockAttributes(blockitem);
  // if (allBlockAttributes.hasOwnProperty(blockName))
  //   {
  //   Object.assign(allBlockAttributes[blockName], attribute);
  //   }
  // else
  //   {
  //   /**
  //    * Add attribute rather than update
  //    */
  //   allBlockAttributes.addBlockAttribute(blockName, attribute, newValue);
  //   }

  }


class AttributeStore extends EventEmitter {
constructor()
  {
  super();
  this.onChangeBlockCollectionCallback = this.onChangeBlockCollectionCallback.bind(this);
  this.onChangeBlockLayoutCallback = this.onChangeBlockLayoutCallback.bind(this);
  blockCollection.addChangeListener(this.onChangeBlockCollectionCallback);
  blockCollection.addChangeListenerLayout(this.onChangeBlockLayoutCallback);
  }

addChangeListener(cb)
  {
  this.on(CHANGE_EVENT, cb);
  }

removeChangeListener(cb)
  {
  this.removeListener(CHANGE_EVENT, cb);
  }

emitChange()
  {
  //console.log('AttributeStore.emitChange ^V^V^V^');
  this.emit(CHANGE_EVENT);
  }

getAllBlockAttributes()
  {
  return allBlockAttributes;
  }

getAllBlockAttributesIconStatus()
  {
  return allBlockAttributesIconStatus;
  }

/**
 *
 * @param {string} blockName   - block name
 * @param {string} attribute - attribute name
 * @param {object} statusObject
 */
updateAttributeIconStatus(blockName, attribute, statusObject) {

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
    this.updateAttributeIconStatus(blockName, 'Y_COORD', statusObject);
  }

  if (allBlockAttributesIconStatus.hasOwnProperty(blockName.toString()))
  {
    //console.log("attributeStore.updateAttributeIconStatus(): ");
    //console.log(allBlockAttributesIconStatus);

    if (!allBlockAttributesIconStatus[blockName].hasOwnProperty(attributeName))
    {
      allBlockAttributesIconStatus[blockName][attributeName] = {};
    }

    let updatedAttribute = update(allBlockAttributesIconStatus[blockName][attributeName],
      {
        $merge: {
          value  : statusObject.value,
          message: statusObject.message
        }
      });

    let attributesToMerge = {};

    attributesToMerge[attributeName] = updatedAttribute;

    let updatedAttributes = update(allBlockAttributesIconStatus[blockName],
      {$merge: attributesToMerge});

    allBlockAttributesIconStatus[blockName] = update(allBlockAttributesIconStatus[blockName],
      {$set: updatedAttributes});
  }
  else
  {
    allBlockAttributesIconStatus.addBlockAttributeIconStatus(blockName, attributeName, statusObject.value, statusObject.message);
  }

}

/**
 * onChangeBlockCollectionCallback()
 * Callback function called when blockCollection emits an event.
 * Note that this will reference the EventEmitter, not the attributeStore instance
 * as might be expected. IJG 10/1/17
 *
 * @param event
 * @param items
 */
onChangeBlockCollectionCallback(items)
  {
  let changed = false;

  //console.log(`attributetore.onChangeBlockCollectionCallback(): items = ${items}`);
  for (let i = 0; i < items.length; i++)
    {
    let index     = items[i];
    let blockItem = blockCollection.getBlockItem(index);
    if (blockItem !== null)
      {
      updateAttributeValue(blockItem);
      let attributes = blockItem.getAttributeNames();
      for (let attrIndex = 0; attrIndex < attributes.length; attrIndex++)
        {
        let attrName = attributes[attrIndex];
        this.updateAttributeIconStatus(blockItem.blockName(), attrName, {
          value  : 'success',
          message: null
        });
        }
      changed = true;
      }
    }
  if (changed)
    {
    attributeStore.emitChange();
    }
  }

onChangeBlockLayoutCallback(items)
  {
  let changed = false;

  //console.log(`attributetore.onChangeBlockCollectionCallback(): items = ${items}`);
  for (let i = 0; i < items.length; i++)
    {
    let index     = items[i];
    let blockItem = blockCollection.getBlockItem(index);
    if (blockItem !== null)
      {
      updateAttributeValue(blockItem);
      let attributes = blockItem.getAttributeNames();
      for (let attrIndex = 0; attrIndex < attributes.length; attrIndex++)
        {
        let attrName = attributes[attrIndex];
        this.updateAttributeIconStatus(blockItem.blockName(), attrName, {
          value  : 'success',
          message: null
        });
        }
      changed = true;
      }
    }
  if (changed)
    {
    attributeStore.emitChange();
    }
  }
} // class

const attributeStore = new AttributeStore();


attributeStore.dispatchToken = AppDispatcher.register((payload) =>
  {
  let action = payload.action;
  let item   = action.item;
  let requestedDataToWrite;
  let blockItem;


  switch (action.actionType)
  {
    case appConstants.MALCOLM_CALL_SUCCESS:
    case appConstants.MALCOLM_PUT_SUCCESS:
      requestedDataToWrite = JSON.parse(JSON.stringify(item.requestedDataToWrite));
      console.log("malcolmCallSuccess " + requestedDataToWrite);
      blockItem = blockCollection.getBlockItemByMri(requestedDataToWrite.path[0]);

      attributeStore.updateAttributeIconStatus(blockItem.blockName(), requestedDataToWrite.path[1], {
        value: 'success',
        message: null
      });

      attributeStore.emitChange();
      break;

    case appConstants.MALCOLM_CALL_FAILURE:
    case appConstants.MALCOLM_PUT_FAILURE:

      let responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
      requestedDataToWrite = JSON.parse(JSON.stringify(item.requestedDataToWrite));
      console.log("malcolmCallFailure " + requestedDataToWrite + " " + responseMessage);
      blockItem = blockCollection.getBlockItemByMri(requestedDataToWrite.path[0]);

      attributeStore.updateAttributeIconStatus(blockItem.blockName(), requestedDataToWrite.path[1], {
        value: 'failure',
        message: responseMessage
      });

      attributeStore.emitChange();
      break;

    case appConstants.BLOCKS_UPDATED:
      break;

    default:
      return true

  }

  return true;

  }
);


export default attributeStore;
