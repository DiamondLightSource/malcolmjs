/**
 * @module blockItems
 * @author  Ian Gillingham
 * @since  13/10/2016
 */

import EventEmitter from 'events';
import AppDispatcher from '../dispatcher/appDispatcher';
import appConstants  from '../constants/appConstants';
import MalcolmUtils from '../utils/MalcolmUtils';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';
import MalcolmWebSocketClient from '../wsWebsocketClient';
import {DroppedPaletteInfo} from '../actions/flowChartActions'
import config from '../utils/config';
//import async from 'async-es';
import eachOf from 'async/eachOf';


/**
 * @class BlockItem
 */

class BlockItem extends EventEmitter {
/**
 * @constructor
 * @param {number} index
 * @param {object} collection - reference to the holding object
 *
 */
constructor(index, collection)
  { // class constructor
  super();
  this.protocolIndex = 0;
  this.index         = index;
  this.collection    = collection; // Reference to the holding object
  this.attributes    = {};

  // Presently, this.Id is the basic block name string.
  //console.log(`BlockItem instance: index = ${this.index}`);

  let schema = this.collection.getLayoutSchema();
  this.parseLayoutSchema(schema);

  //console.log(`BlockItem end of constructor: dispatchToken = ${this.dispatchToken}`);
  //this.attributes.blockName = collection;
  //console.log(`MalcolmActionCreators.malcolmSubscribe(): blockName = ${blockName}   attribute = ${attribute}`);
  if (this.attributes.hasOwnProperty('mri'))
    {
    //console.log(`BlockItem.constructor(): this.attributes.mri = ${this.attributes.mri}`);
    this.protocolIndex = MalcolmActionCreators.malcolmSubscribe(this.attributes.mri, []);
    this.collection.setItemProtocolIndex(this.index, this.protocolIndex);
    }
  else
    {
    console.log(`BlockItem -- Invalid -- No MRI attribute found in schema `);
    }

  } // end of constructor


/**
 * Iterate across the layout schema and extract properties associated with this BlockItem index.
 * @function parseLayoutSchema
 * @param schemaIn
 */
parseLayoutSchema(schemaIn)
  {
  // Determine all the attribute names associated with the layout schema.
  //  To be successful in creating a BlockItem, we are expecting the following schema to exist:
  // layout
  //   |
  //   -- meta
  //   |   |
  //   |   -- elements
  //   |   |    |
  //   |   |    -- <array of attribute names>
  //   |   |
  //   |  value
  //   |   |
  //   |   -- <attribute name>
  //   |   |       [] <attribute values>
  //

  // Copy the incoming schema just in case the external copy changes whilst we're using it.

  let schema = JSON.parse(JSON.stringify(schemaIn));

  if (MalcolmUtils.hasOwnNestedProperties(schema, 'layout', 'meta', 'elements'))
    {
    let self = this;

    let iteration = function (layout, attr, callbackDone)
      {
      if ((attr !== 'typeid') && (schema.layout.value.hasOwnProperty(attr)))
        {
        self.attributes[attr] = {};
        let t1                = JSON.stringify(schema.layout.value[attr][self.index]);
        let t2                = JSON.stringify(self.attributes[attr]);
        if (t1 !== t2)
          {
          self.attributes[attr] = JSON.parse(t1);
          //console.log(`blockItems.parseLayoutSchema block change detected Block: ${attr} Attributes: ${self.attributes[attr]}`);
          self.collection.blockItemUpdated(self.index);
          }
        callbackDone();
        }
      };

    let callbackError = function (err)
      {
      if (err)
        {
        console.error(err.message);
        }
      };

    eachOf(schema.layout.meta.elements, iteration, callbackError);

    }
  }

/* parseLayoutSchema */

updateFromSchema(schemaIn)
  {
  let changed = false;

  // Copy the incoming schema just in case the external copy changes whilst we're using it.

  let schema = JSON.parse(JSON.stringify(schemaIn));
  /**
   * If the incoming schema is the to level layout, then find the attributes and incorporate them.
   */
  if (MalcolmUtils.hasOwnNestedProperties(schema, 'layout', 'meta', 'elements'))
    {
    let self = this;

    let iteration = function (layout, attr, callbackDone)
      {
      if ((attr !== 'typeid') && (schema.layout.value.hasOwnProperty(attr)))
        {
        let t1 = JSON.stringify(schema.layout.value[attr][self.index]);
        let t2 = JSON.stringify(self.attributes[attr]);
        if (t1 !== t2)
          {
          self.attributes[attr] = JSON.parse(t1);
          changed               = true;
          }
        callbackDone();
        }
      };

    let callbackError = function (err)
      {
      if (err)
        {
        console.error(err.message);
        }
      };

    eachOf(schema.layout.meta.elements, iteration, callbackError);
    }
  else // The incoming schema describes an individual block.
    {
    let self      = this;
    let iteration = function (blockData, attr, callbackDone)
      {
      if (attr !== 'typeid')
        {
        // Take care when comparing the two json blocks.
        // there is a timestamp which will constantly change
        // but not valid for triggering an udate.
        let t1 = JSON.stringify(blockData);
        let t2 = JSON.stringify(self.attributes[attr]);
/*
        if (t1.hasOwnProperty('timestamp'))
          {
          delete t1.timestamp;
          }
        if (t2.hasOwnProperty('timestamp'))
          {
          delete t2.timestamp;
          }
*/

        if (t1 !== t2)
          {
          self.attributes[attr] = JSON.parse(t1);
          changed               = true;
          //console.log(`blockItem: updateFromSchema() - individual block: ${self.blockName()} `);
          //console.log('t1 (new block update):');
          //console.log(t1);
          //console.log('t2 (old block update):');
          //console.log(t2);

          }
        }
      callbackDone();
      };

    let callbackError = function (err)
      {
      if (err)
        {
        console.error(err.message);
        }
      };

    eachOf(schema, iteration, callbackError);
    }
  if (changed)
    {
    // This block item has been updated, so record its index with the collection
    this.collection.blockItemUpdated(this.index);
    }
  }

emitChange()
  {
  this.emit(appConstants.BLOCK_UPDATED);
  }

addChangeListener(callback)
  {
  this.on(appConstants.BLOCK_UPDATED, callback);
  }

removeChangeListener(callback)
  {
  this.removeListener(appConstants.BLOCK_UPDATED, callback);
  }

addVisibleAttribute(attrName = '')
  {
  console.log('BlockItem in addVisibleAttribute');
  }

get Id()
  { // class method
  //console.log(`BlockItem class instance: Id: ${this.index}`);
  return ( this.index );
  }

mri()
  {
  let ret = null;
  if (this.attributes.hasOwnProperty('mri'))
    {
    ret = this.attributes.mri;
    }
  return (ret);
  }

get visible()
  {
  let ret = false;
  if (this.attributes.hasOwnProperty('visible'))
    {
    ret = this.attributes.visible;
    }

  /**
   * TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING
   * @type {boolean}
   */
  //ret = true;

  return (ret);
  }

x()
  {
  let ret = 0;
  if (this.attributes.hasOwnProperty('x'))
    {
    ret = this.attributes.x;
    }
  return (ret);
  }

y()
  {
  let ret = 0;
  if (this.attributes.hasOwnProperty('y'))
    {
    ret = this.attributes.y;
    }
  return (ret);
  }

putXY(newX, newY)
  {
  MalcolmActionCreators.malcolmPut("", [MalcolmActionCreators.getdeviceId(), "layout", "value"],
    {"typeid":"malcolm:core/Table:1.0",
      "name":[this.blockName()],
      "mri":[this.mri()],
      "x":[newX],
      "y":[newY],
      "visible":[this.attributes.visible]});
  }

putVisible(visibility)
  {
  MalcolmActionCreators.malcolmPut("", [MalcolmActionCreators.getdeviceId(), "layout", "value"],
    {"typeid":"malcolm:core/Table:1.0",
      "name":[this.blockName()],
      "mri":[this.mri()],
      "x":[this.attributes.x],
      "y":[this.attributes.y],
      "visible":[visibility]});
  /**
   * Setting visibility false may need to be an atomic operation, as any movement before the response is received
   * will automaticallly reset visibility to true.
   */
  if (!visibility)
    {
    // Set the local value before getting the response, so as to avoid transition back to visible.
    // There is probably a better way of doing this, but it works for the timebeing.
    this.attributes.visible = false;
    }
  }

blockName()
  {
  let ret = "";
  if (this.attributes.hasOwnProperty('name'))
    {
    ret = this.attributes.name;
    }
  return (ret);
  }

/**
 * Get all attributes array
 * ensuring a copy is returned rather than the actual array
 * @returns {{}|*}
 */
getAttributeNames()
  {
  //return ( Object.assign({}, this.attributes));
  //let ret = JSON.parse(JSON.stringify(this.attributes));
  let ret = Object.getOwnPropertyNames(this.attributes);
  return (ret);
  }

/**
 * Get the value of the given attribute name
 * @param attributeName
 * @returns {*}
 */
getAttribute(attributeName)
  {
  let attr = null;
  if (this.attributes.hasOwnProperty(attributeName))
    {
    //console.log(`blockItem.getAttribute( ${attributeName} ) `);
    attr = JSON.parse(JSON.stringify(this.attributes[attributeName]));
    //attr = Object.assign({}, {attributeName:this.attributes[attributeName]});
    //attr = JSON.parse(JSON.stringify(this.attributes[attributeName]));
    //attr = Object.create(this.attributes[attributeName]);
    }
  return (attr);
  }

getAllBlockAttributes()
  {
  let attr = [];
  if (this.hasOwnProperty('attributes'))
    {
    attr = Object.assign({}, this.attributes);
    }
  return (attr);
  }

/**
 * Get the default (disconnected) value for the given attribute
 * Should cater for known types, such as "inport:bool:ZERO", "outport:bit:TTLIN1.VAL", etc.
 * Where the last term after the final colon is the nominal default value and can be anything.
 *
 * @param attributeName
 * @returns {*}
 */
getAttributeDefaultValue(attributeName)
  {
  let defval = null;
  let attr   = this.getAttribute(attributeName);

  if (MalcolmUtils.hasOwnNestedProperties(attr, 'meta', 'tags'))
    {
    for (let k = 0; k < attr.meta.tags.length; k++)
      {
      if ((attr.meta.tags[k].indexOf('inport:') !== -1)
        || (attr.meta.tags[k].indexOf('outport:') !== -1))
        {
        let parts = attr.meta.tags[k].split(':');
        if (parts.length > 0)
          {
          // Set default to very last field of string
          defval = parts[parts.length - 1];
          break; // No point testing any other tags as we now have the information.
          }
        }
      }
    }
  return (defval);
  }

getAttributeTags(attributeName)
  {
  let tags = [];
  let attr = this.getAttribute(attributeName);

  if (attr !== null)
    {
    if (MalcolmUtils.hasOwnNestedProperties(attr, 'meta', 'tags'))
      {
      tags = attr.meta.tags.slice(0); // Copy the tags array.
      }
    }
  return (tags);
  }

attributeTagsContains(attributeName, value)
  {
  let ret  = false;
  let tags = this.getAttributeTags(attributeName);

  for (let i = 0; i < tags.length; i++)
    {
    if (tags[i].indexOf(value))
      {
      ret = true;
      break;
      }
    }
  return (ret);
  }

/**
 * blockType()
 * @returns {*|string|void|XML}
 */
get blockType()
  {
  let bt = this.blockName().replace(/[0-9]/g, '');
  return (bt);
  }

putAttributeValue(attributeName, value)
  {
  // {"typeid":"malcolm:core/Put:1.0","id":0,"path":["P:PGEN2","trig","value"],"value":"PULSE1.OUT"}
  let mri = this.mri();
  MalcolmActionCreators.malcolmPut("", [mri, attributeName, "value"],value);
  }
}
/* Class BlockItem */

/**
 * --------------------------------------------------------------------------------------------------------------------
 */

/**
 * @class BlockCollection
 * Contains the layout schema an all underlying block items.
 * The collection instance wil receive notifications of changes
 * to the layout and reflect the changes accordingly.
 * Each block item will subscribe to its own entity on the
 */
class BlockCollection extends EventEmitter {
/**
 * @constructor
 */
constructor()
  {
  super();

  this._config = config;

  this._allBlockItems = [];

  this._blockItemByName            = {};
  this._MapProtocolIndexBlockIndex = {};
  this._MapBlockIndexProtocolIndex = {};

  /**
   * Array which gets populated with the indices of any blockItems that have been updated.
   * For now the trigger will be for any change to a blockItem, but it might be worth
   * considering specifying which items of a block have updated.
   *
   * @type {Array}
   * @private
   */
  this._blockItemsChanged = [];

  /**
   * Rather than passing in the top level schema to each BlockItem, it makes sense to lodge this information
   * in a single instance which all BlockItems can then refer to. It also makes everything much slicker
   * when top level schema changes occur, as the changes will be in the singleton schema instance.
   */
  this._layoutSchema = {};
  //console.debug('** BlockCollection constructor() **')
  this.dispatchToken = AppDispatcher.register(this.dispatcherCallback.bind(this));

  /**
   * All traffic used to be initiated from MalcolmActionCreators via webSocketOnOpen() callback
   * so that no attempts to communicate were made until the websocket channel was open.
   * This pattern needs adopting here, as the BlockCollection instance is rather stand-alone and
   * invokes its own communication, so establish a callback here on which to initiate comms.
   * TODO: Review just where comms should be initiated - may need to change it.
   * IG 15 Dec 2016.
   *
   * @type {boolean}
   */
  this.webSocketOnOpen = this.webSocketOnOpen.bind(this);
  this.webSocketOnClose = this.webSocketOnClose.bind(this);
  this.webSocketOpen = false;
  MalcolmWebSocketClient.addWebSocketOnOpenCallback(this.webSocketOnOpen);
  MalcolmWebSocketClient.addWebSocketOnCloseCallback(this.webSocketOnClose);

  }

webSocketOnOpen()
  {
  this.webSocketOpen = true;
  // Subscribe to the layout schema.

  console.debug('BlockCollection: webSocketOnOpen()');
  MalcolmActionCreators.malcolmSubscribe(MalcolmActionCreators.getdeviceId(), [], appConstants.MALCOLM_SUBSCRIBE_SUCCESS_LAYOUT);
  }

webSocketOnClose()
  {
  console.debug('BlockCollection: webSocketOnClose()');
  this.webSocketOpen = false;
  }


getDispatchToken()
  {
  return ( this.dispatchToken );
  }

/**
 * This method takes a new copy of the present layout on the device
 * and updates the local model, emitting dispatcher signals where appropriate.
 *
 * @param {object} updatedSchema
 *
 */
updateSchema(updatedSchema)
  {
  // Check that the incoming structure resembles a top-level schema
  if (updatedSchema.hasOwnProperty('layout'))
    {
    this._layoutSchema = JSON.parse(JSON.stringify(updatedSchema));
    }
  }

/**
 * When the top level layout changes on the remote device
 * update the local layout model and instantiate block items.
 *
 * @param {object} topLevelSchema
 */
createBlockItemsFromSchema(topLevelSchema)
  {
  this._allBlockItems = [];
  this.updateSchema(topLevelSchema);

  //console.info(`this._config.testparams.maxBlocks = ${this._config.testparams.maxBlocks}`)
  if (MalcolmUtils.hasOwnNestedProperties(this._layoutSchema, 'layout', 'value', 'mri'))
    {
    let self = this;

    let iteration = function (name, index, callbackDone)
      {
      //console.log(`BlockCollection.createBlockItemsFromSchema(): mri = ${mri}`);
      let bi  = new BlockItem(index, blockCollection);
      let pos = blockCollection._allBlockItems.push(bi);

      self._blockItemsChanged.push(pos - 1);

      /**
       * This keyed array (object) is to allow quick retrieval of an item by block name (the key).
       */
      blockCollection._blockItemByName[name] = bi;

      callbackDone();
      };

    let callbackError = function (err)
      {
      if (err)
        {
        console.error(err.message);
        }
      };

    eachOf(this._layoutSchema.layout.value.name, iteration, callbackError);

    /**
     * Each BlockItem is referenced in the layout by its position in the attribute arrays. The same index value valid
     * for each attribute list. So can construct each BlockItem, providing it with its unique index and a pointer to
     * the layout schema - each BlockItem can then populate all its attributes from the schema.
     * It is important that pushing to the _allBlockItem array is kept in sync with index count.
     */

    /**
     * NO - don't emit an update as this is the layout schema and no specific block meta information
     *      has yet been read.
     *      IJG 12/1/17
     */
    /*
     if (this._blockItemsChanged.length > 0)
     {
     this.BlocksUpdated();
     }
     */

    }
  }

/**
 * updateBlockItemsFromSchema:
 *
 * @param index - message protocol index identifier.
 * @param schemaIn - can be a top level layout change or a specific block change.
 */
updateBlockItemsFromSchema(index, schemaIn)
  {
  // Copy the incoming schema just in case the external copy changes whilst we're using it.

  let schema = JSON.parse(JSON.stringify(schemaIn));

  this.updateSchema(schema);
  //this._allBlockItems = [];

  let self = this;

  let iteration = function (rawBlock, blockIndex, callbackDone)
    {
    let block = blockCollection._allBlockItems[blockIndex];
    if ((typeof block === 'object') && (block !== null))
      {
      block.updateFromSchema(schema);
      }
    callbackDone();
    };

  let callbackError = function (err)
    {
    if (err)
      {
      console.error(err.message);
      }
    };

  /**
   * Layout updates should be detected by looking for the layout attribute.
   * If it is not a layout update, then use the index to target the specific block item.
   *
   */
  if (schema.hasOwnProperty('layout'))
    {
    eachOf(this._allBlockItems, iteration, callbackError);
    }
  else
    {
    // Do a single shot update, so no asynchronous iteration required
    let blockItem = blockCollection.getItemByProtocolIndex(index);
    if (blockItem !== null)
      {
      blockItem.updateFromSchema(schema);
      }
    }

  /**
   * now check to see whether any blockItems were updated.
   * If so, handle the action by broadcasting a message.
   *
   */
  if (this._blockItemsChanged.length > 0)
    {
    if (schema.hasOwnProperty('layout'))
      {
      this.LayoutUpdated();
      }
    else
      {
      this.BlocksUpdated();
      }
    }
  }

BlocksUpdated()
  {
  //console.log(`BlockCollection.BlocksUpdated number => ${this._blockItemsChanged.length}`);
  this.emitBlockChange(); // do this before clearing the _blockItemsChanged array.
  this._blockItemsChanged = []; // Clear the list of updated blocks
  }

LayoutUpdated()
  {
  //console.log(`BlockCollection.BlocksUpdated number => ${this._blockItemsChanged.length}`);
  this.emitLayoutChange();
  this._blockItemsChanged = []; // Clear the list of updated blocks
  }

/**
 * blockItemUpdated() typically called by a child blockItem to inform this collection object
 * that it has received an update. A list will be formed as each updated blockItem registers its index number.
 * The array of registered blocks will be cleared as soon as a message has been dispatched, which will incorporate
 * a list of indicies of update blockItems.
 * IJG 8 Dec. 2016
 *
 * @param index
 */
blockItemUpdated(index)
  {
  //console.log(`BlockCollection.blockItemUpdated index = ${index}`);
    // Test whether this index value exists within the array of indices.
  if (this._blockItemsChanged.indexOf(index) < 0)
    {
    this._blockItemsChanged.push(index);
    }
  }

count()
  {
  return (this._allBlockItems.length);
  }

getBlocksUpdated()
  {
  return (this._blockItemsChanged);
  }

emitBlockChange()
  {
  //let items = this._blockItemsChanged.slice(0);
  let items = [...this._blockItemsChanged];
  this.emit(appConstants.BLOCKS_UPDATED, items);
  }

emitLayoutChange()
  {
  let items = [...this._blockItemsChanged];
  this.emit(appConstants.LAYOUT_UPDATED, items);
  }

addChangeListener(callback)
  {
  this.on(appConstants.BLOCKS_UPDATED, callback);
  }

addChangeListenerLayout(callback)
  {
  this.on(appConstants.LAYOUT_UPDATED, callback);
  }

removeChangeListener(callback)
  {
  this.removeListener(appConstants.BLOCKS_UPDATED, callback);
  }

getBlockItem(index)
  {
  let retBlockItem = null;
  if (this._allBlockItems.length > index)
    {
    retBlockItem = this._allBlockItems[index];
    }
  return (retBlockItem);
  }

getBlockItemByName(blockName)
  {
  let retBlockItem = null;
  if (this._blockItemByName.hasOwnProperty(blockName))
    {
    retBlockItem = this._blockItemByName[blockName];
    }
  return (retBlockItem);
  }


/**
 * getAllBlockItems():
 * @returns {Array}
 *
 * @description Returns an array of BlockItem instances.
 *
 */
getAllBlockItems()
  {
  let retBlockItems = this._allBlockItems;
  return (retBlockItems);
  }

/**
 * Does what it says on the tin.
 *
 * @returns {*}
 */
getLayoutSchema()
  {
  return (JSON.parse(JSON.stringify(this._layoutSchema)));
  }

putLayoutSchema()
  {
  MalcolmActionCreators.malcolmCall(
    this.props.id, '_set_coords', {
      X_COORD: this.props.blockPosition.x * this.props.graphZoomScale,
      Y_COORD: this.props.blockPosition.y * this.props.graphZoomScale
    }
  );

  }

setItemProtocolIndex(itemIndex, protocolIndex)
  {
  this._MapProtocolIndexBlockIndex[itemIndex]     = protocolIndex;
  this._MapBlockIndexProtocolIndex[protocolIndex] = itemIndex;
  }

getItemByProtocolIndex(protocolIndex)
  {
  let item       = null;
  let blockIndex = -1;
  if (this._MapBlockIndexProtocolIndex.hasOwnProperty(protocolIndex))
    {
    blockIndex = this._MapBlockIndexProtocolIndex[protocolIndex];
    item       = this.getBlockItem(blockIndex);
    }
  return (item);
  }

/**
 *
 * @param {DroppedPaletteInfo} item
 */
droppedBlockFromList(item)
  {
    if (item instanceof DroppedPaletteInfo)
      {
      let block_item = this.getBlockItemByName(item.name);

      if (block_item instanceof BlockItem)
        {
        block_item.putVisible(true);
        }
      }
  }

/**
 *
 * @param payload
 */
dispatcherCallback(payload)
  {
  let action = payload.action;
  let item   = action.item;
  //console.log(`BlockCollection AppDispatcher callback: action = ${action}   item = ${item}`);

  switch (action.actionType)
  {
    case appConstants.UPDATE_EDGEPREVIEWENDPOINT:
      //this.emitBlockChange();
      break;

    case appConstants.MALCOLM_GET_SUCCESS:

      //AppDispatcher.waitFor([flowChartStore.dispatchToken]);

      /* Check if it's the initial FlowGraph structure, or
       if it's something else
       */

      //console.log('BlockCollection MALCOLM_GET_SUCCESS: item.responseMessage:');
      //console.log(item.responseMessage);

      blockCollection.createBlockItemsFromSchema(item.responseMessage);
      break;    //    layoutUpdated();


    case appConstants.MALCOLM_GET_FAILURE:
      console.log("BlockCollection MALCOLM GET ERROR!");
      this.emitBlockChange();
      break;

    case appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
    case appConstants.MALCOLM_SUBSCRIBE_SUCCESS_LAYOUT:
      /**
       * One or more blocks may have been updated in this subscription response
       * so iterate through the table of changed blocks.
       */

      /**
      console.log("BlockCollection MALCOLM_SUBSCRIBE_SUCCESS");
      console.log(item.requestedData);
      console.log(item.responseMessage);
      console.log("------------------------------------------");
       */

      if (blockCollection._allBlockItems.length < 1)
        {
        /**
         * The _allBlockItems table is empty so create them
         */
        //console.info("BlockCollection MALCOLM_SUBSCRIBE_SUCCESS: Creating All Block Items");
        blockCollection.createBlockItemsFromSchema(item.responseMessage);
        }
      else
        {
        /**
         * Update existing Block Items
         */
        blockCollection.updateBlockItemsFromSchema(item.index, item.responseMessage);
        }
      break;

    case appConstants.INTERACTJS_DRAG:
      break;

    case appConstants.DROPPED_PALETTE_FROM_LIST:
      /* item is {name: <name>, x: <x>, y: <y>} */
      // item should be of type class DroppedPaletteInfo - defined in flowChartActions.
      this.droppedBlockFromList(item);
      break;

    case appConstants.MALCOLM_BLOCK_ATTRIBUTE_EDITED:
      {
      let blockItem = this.getBlockItemByName(item.blockName);
      if (blockItem instanceof BlockItem)
        {
        console.log(`BlockCollection: Dispatch message received: MALCOLM_BLOCK_ATTRIBUTE_EDITED, Block ${blockItem.blockName()}  attribute  ${item.attribute_path}  value  ${item.newValue}`);
        blockItem.putAttributeValue(item.attribute_path, item.newValue);
        }
      }
      break;

    case appConstants.REMOVE_BLOCK:
      {
      let blockItem = this.getBlockItemByName(item);
      if (blockItem instanceof BlockItem)
        {
        blockItem.putVisible(false);
        }
      }
      break;

    default:
      break;

  }
  }


}
/* Class BlockCollection */


// Create the singleton collection of blocks.
let blockCollection = new BlockCollection();


export {blockCollection as default, BlockItem}
