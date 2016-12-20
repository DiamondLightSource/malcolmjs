/**
 * Created by ig43 on 13/10/16.
 *
 * Abstracts the concept of a block instance.
 * Block Item := blockName + { attributeName, attribute }
 *
 * This module has been created to avoid the previous design pattern of splitting attributes from
 * blocks between having blockStore and attributeStore.
 * The intention is to maintain blockStore, which should simply represent a collection of blockItems.
 *
 * A BlockItem is constructed from its given unique index number along with a copy of the json schema of
 * the top level layout description, which contains arrays of attributes, such as visibility, position etc.
 * Each BlockItem derived its own attribute values by looking up the values from the attribute arrays, indexed on
 * the given index number.
 *
 * Ian Gillingham: 13 October 2016
 *
 */
import EventEmitter from 'events';
import AppDispatcher from '../dispatcher/appDispatcher';
import appConstants  from '../constants/appConstants';
import MalcolmUtils from '../utils/MalcolmUtils';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';
import MalcolmWebSocketClient from '../wsWebsocketClient';
import config from '../utils/config';
//import async from 'async-es';
import eachOf from 'async/eachOf';

let CHANGE_EVENT = 'change';

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
  this.index      = index;
  this.collection = collection; // Reference to the holding object
  this.attributes = {};

  // Presently, this.Id is the basic block name string.
  //console.log(`BlockItem instance: index = ${this.index}`);

  let schema = this.collection.getLayoutSchema();
  this.parseLayoutSchema(schema);

  //console.log(`BlockItem end of constructor: dispatchToken = ${this.dispatchToken}`);
  //this.attributes.blockName = collection;
  //console.log(`MalcolmActionCreators.malcolmSubscribe(): blockName = ${blockName}   attribute = ${attribute}`);
  if (this.attributes.hasOwnProperty('mri'))
    {
    console.log(`BlockItem.constructor(): this.attributes.mri = ${this.attributes.mri}`);
    MalcolmActionCreators.malcolmSubscribe(this.attributes.mri, []);
    }
  else
    {
    console.log(`BlockItem -- Invalid -- No MRI attribute found in schema `);
    }

  } // end of constructor


/**
 * Iterate across the layout schema and extract properties associated with this BlockItem index.
 * @function parseLayoutSchema
 * @param schema
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
        let t1 = JSON.stringify(schema.layout.value[attr][self.index]);
        let t2 = JSON.stringify(self.attributes[attr]);
        if (t1 !== t2)
          {
          self.attributes[attr] = JSON.parse(t1);
          self.collection.blockItemUpdated(self.index);
          }
        callbackDone();
        }
      };

    let callbackError = function (err)
      {
      if (err)
        console.error(err.message);
      };

    eachOf(schema.layout.meta.elements, iteration, callbackError);

/*
    for (let attr in schema.layout.meta.elements)
      {
      if ((attr !== 'typeid') && (schema.layout.value.hasOwnProperty(attr)))
        {
        this.attributes[attr] = {};

        // The values associated with the attributes is expected to be in
        // layoutResponse.value[attr][index], but need to do some sanity checking
        // to ensure the data are there.
        if (MalcolmUtils.hasOwnNestedProperties(schema, 'layout', 'value', attr))
          {
          if (schema.layout.value[attr].length > this.index)
            {
            // Extract the attribute value for this block.
            //this.attributes[attr] = Object.assign({}, schema.layout.value[attr][this.index]);

            let t1 = JSON.stringify(schema.layout.value[attr][this.index]);
            let t2 = JSON.stringify(this.attributes[attr]);
            if (t1 != t2)
              {
              this.attributes[attr] = schema.layout.value[attr][this.index];
              this.collection.blockItemUpdated(this.index);
              }
            }
          }
        }
      }
*/
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
      if ((attr !== 'typeid') && (layout.layout.value.hasOwnProperty(attr)))
        {
        let t1 = JSON.stringify(layout.layout.value[attr][self.index]);
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
        console.error(err.message);
      };

    eachOf(schema.layout.meta.elements, iteration, callbackError);
    }
  else
    {
    let self = this;
    let iteration = function (layout, attr, callbackDone)
      {
      if (attr !== 'typeid')
        {
        let t1 = JSON.stringify(schema[attr]);
        let t2 = JSON.stringify(self.attributes[attr]);
        if (t1 !== t2)
          {
          self.attributes[attr] = JSON.parse(t1);
          changed               = true;
          }
        }
      callbackDone();
      };

    let callbackError = function (err)
      {
      if (err)
        console.error(err.message);
      };

    eachOf(schema, iteration, callbackError);
    }
  if (changed)
    {
    this.collection.blockItemUpdated(this.index);
    //this.emitChange();
    }
  }

emitChange()
  {
  this.emit(CHANGE_EVENT);
  }

addChangeListener(callback)
  {
  this.on(CHANGE_EVENT, callback);
  }

removeChangeListener(callback)
  {
  this.removeListener(CHANGE_EVENT, callback);
  }

addVisibleAttribute(attrName = '')
  {
  console.log('BlockItem in addVisibleAttribute');
  }

getId()
  { // class method
  console.log(`BlockItem class instance: Id: ${this.index}`);
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

visible()
  {
  let ret = false;
  if (this.attributes.hasOwnProperty('visible'))
    {
    ret = this.attributes.visible;
    }
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
    attr = this.attributes[attributeName];
    //attr = JSON.parse(JSON.stringify(this.attributes[attributeName]));
    //attr = Object.create(this.attributes[attributeName]);
    }
  return (attr);
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
  console.debug('** BlockCollection constructor() **')
  this.dispatchToken = AppDispatcher.register(this.dispatcherCallback);

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
  this.webSocketOpen = false;
  MalcolmWebSocketClient.addWebSocketOnOpenCallback(this.webSocketOnOpen);
  MalcolmWebSocketClient.addWebSocketOnCloseCallback(this.webSocketOnClose);

  }

webSocketOnOpen()
  {
  this.webSocketOpen = true;
  // Subscribe to the layout schema.

  console.debug('BlockCollection: webSocketOnOpen()');
  MalcolmActionCreators.malcolmSubscribe(MalcolmActionCreators.getdeviceId(), []);
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

  console.info(`this._config.testparams.maxBlocks = ${this._config.testparams.maxBlocks}`)
  if (MalcolmUtils.hasOwnNestedProperties(this._layoutSchema, 'layout', 'value', 'mri'))
    {
    let index = 0;

    let iteration = function (rawBlock, key, callbackDone)
      {
      let mri = JSON.stringify(rawBlock[key]);
      //console.log(`BlockCollection.createBlockItemsFromSchema(): mri = ${mri}`);
      blockCollection._allBlockItems.push(new BlockItem(key, blockCollection));
      callbackDone();
      };

    let callbackError = function (err)
      {
      if (err)
        console.error(err.message);
      };

    eachOf(this._layoutSchema.layout.value.mri, iteration, callbackError);

    /**
     * Each BlockItem is referenced in the layout by its position in the attribute arrays. The same index value valid
     * for each attribute list. So can construct each BlockItem, providing it with its unique index and a pointer to
     * the layout schema - each BlockItem can then populate all its attributes from the schema.
     * It is important that pushing to the _allBlockItem array is kept in sync with index count.
     */

    if (this._blockItemsChanged.length > 0)
      {
      this.BlocksUpdated();
      }

    }
  }

/**
 * updateBlockItemsFromSchema:
 *
 * @param schema - can be a top level layout change or a specific block change
 */
updateBlockItemsFromSchema(schemaIn)
  {
  // Copy the incoming schema just in case the external copy changes whilst we're using it.

  let schema = JSON.parse(JSON.stringify(schemaIn));

  this.updateSchema(schema);
  //this._allBlockItems = [];

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
      console.error(err.message);
    };

  eachOf(this._allBlockItems, iteration, callbackError);

  /*
   for (let blockIndex = 0; blockIndex < this._allBlockItems.length; blockIndex++)
   {
   let block = this._allBlockItems[blockIndex];
   if ((typeof block === 'object') && (block !== null))
   {
   block.updateFromSchema(schema);
   }
   }
   */

  /**
   * now check to see whether any blockItems were updated.
   * If so, handle the action by broadcasting a message.
   *
   */
  if (this._blockItemsChanged.length > 0)
    {
    this.BlocksUpdated();
    }
  }

BlocksUpdated()
  {
  console.log(`BlockCollection.BlocksUpdated number => ${this._blockItemsChanged.length}`);
  let item                = this._blockItemsChanged;
  this._blockItemsChanged = []; // Clear the list of updated blocks

  this.emitChange();

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
  if (this._blockItemsChanged.indexOf(index) < 0)
    {
    this._blockItemsChanged.push(index);
    }
  }

getBlocksUpdated()
  {
  return (this._blockItemsChanged);
  }

emitChange()
  {
  this.emit(CHANGE_EVENT);
  }

addChangeListener(callback)
  {
  this.on(CHANGE_EVENT, callback);
  }

removeChangeListener(callback)
  {
  this.removeListener(CHANGE_EVENT, callback);
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

/**
 * Does what it says on the tin.
 *
 * @returns {*}
 */
getLayoutSchema()
  {
  return (JSON.parse(JSON.stringify(this._layoutSchema)));
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

    case appConstants.MALCOLM_GET_SUCCESS:

      //AppDispatcher.waitFor([flowChartStore.dispatchToken]);

      /* Check if it's the initial FlowGraph structure, or
       if it's something else
       */

      console.log('BlockCollection MALCOLM_GET_SUCCESS: item.responseMessage:');
      console.log(item.responseMessage);

      blockCollection.createBlockItemsFromSchema(item.responseMessage);
      break;

    case appConstants.MALCOLM_GET_FAILURE:
      console.log("BlockCollection MALCOLM GET ERROR!");
      this.emitChange();
      break;

    case appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
      /**
       * One or more blocks may have been updated in this subscription response
       * so iterate through the table of changed blocks.
       */
      console.log("BlockCollection MALCOLM_SUBSCRIBE_SUCCESS");
      if (blockCollection._allBlockItems.length < 1)
        {
        /**
         * The _allBlockItems table is empty so create them
         */
        console.info("BlockCollection MALCOLM_SUBSCRIBE_SUCCESS: Creating All Block Items");
        blockCollection.createBlockItemsFromSchema(item.responseMessage);
        }
      else
        {
        /**
         * Update existing Block Items
         */
        blockCollection.updateBlockItemsFromSchema(item.responseMessage);
        }
      break;


  }
  }


}
/* Class BlockCollection */


// Create the singleton collection of blocks.
let blockCollection = new BlockCollection();


export {blockCollection as default, BlockItem}
