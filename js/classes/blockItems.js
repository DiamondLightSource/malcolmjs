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
  console.log(`BlockItem instance: index = ${this.index}`);

  let schema      = this.collection.getLayoutSchema();

  this.dispatchToken = AppDispatcher.register(this.dispatchCallback);

  console.log(`BlockItem end of constructor: dispatchToken = ${this.dispatchToken}`);

  //console.log(`MalcolmActionCreators.malcolmSubscribe(): blockName = ${blockName}   attribute = ${attribute}`);
  if (this.attributes.hasOwnProperty('mri'))
    {
    MalcolmUtils.malcolmSubscribe([this.attributes.mri], this.malcolmSubscribeSuccess, this.malcolmSubscribeFailure);
    }
  else
    {
    console.log(`BlockItem -- Invalid -- No MRI attribute found in schema `);
    }

  } // end of constructor

dispatchCallback(payload)
  {
  let action = payload.action;
  let item   = action.item;
  //console.log(`BlockItem AppDispatcher callback: action = ${action}   item = ${item}`);
  //console.log(action);

  switch (action.actionType)
  {

    /* BLOCK use */

    case appConstants.INTERACTJS_DRAG:
      this.emitChange();
      break;

    /* WebAPI use */

    case appConstants.MALCOLM_GET_SUCCESS:

      //AppDispatcher.waitFor([flowChartStore.dispatchToken]);

      /* Check if it's the initial FlowGraph structure, or
       if it's something else
       */

      //console.log('BlockItem MALCOLM_GET_SUCCESS: item.responseMessage:');
      //console.log(item.responseMessage);
      for (let attributeName in item.responseMessage)
        {
        // Copy the response message attributes to local collection.
        // (there may be a more efficient way of doing this)
        this.attributes[attributeName] = item.responseMessage[attributeName];
        if (MalcolmUtils.hasOwnNestedProperties(this.attributes[attributeName], 'meta', 'tags'))
          {
          if (this.attributes[attributeName].meta.tags.length > 0)
            {
            let tags = this.attributes[attributeName].meta.tags;
            console.log(`BlockItem AppDispatcher callback MALCOLM_GET_SUCCESS: tags found for ${attributeName}   tags = ${tags}`);
            }
          }
        }
      break;

    case appConstants.MALCOLM_GET_FAILURE:
      console.log("BlockItem MALCOLM GET ERROR!");
      this.emitChange();
      break;

    case appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
      console.log(`BlockItem ${this.index} malcolmSubscribeSuccess`);

      break;


  }
  }

/**
 * Iterate across the layout schema and extract properties associated with this BlockItem index.
 * @function parseLayoutSchema
 * @param schema
 */
parseLayoutSchema(schema)
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

  let elements = {};

  if (MalcolmUtils.hasOwnNestedProperties(schema, 'layout', 'meta', 'elements'))
    {
    for (let attr in schema.layout.meta.elements)
      {
      if (attr !== 'typeid')
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
            this.attributes[attr] = schema.layout.value[attr][this.index];
            }
          }
        }
      }
    }
  } /* parseLayoutSchema */

}

malcolmSubscribeSuccess(id, responseMessage)
{
console.log(`blockItems.malcolmSubscribeSuccess: id -> ${id}  responseMessage ->`);
console.log(responseMessage);
//updateSchema(responseMessage);
}

malcolmSubscribeFailure(responseMessage)
{
console.log('blockItems.malcolmSubscribeFailure: responseMessage ->');
console.log(responseMessage);
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

}

getId()
{ // class method
console.log(`BlockItem class instance: Id: ${this.index}`)
return ( this.index );
}

getAttribute()
{
return ( this.attributes );
}
} /* Class BlockItem */

/**
 * @class BlockCollection
 * Contains the layout schema an all underlying block items.
 * The collection instance wil receive notifications of changes
 * to the layout and reflect the changes accordingly.
 * Each block item will subscribe to its own entity on the
 */
class BlockCollection {
/**
 * @constructor
 */
constructor()
  {
  this._allBlockItems = [];

  /**
   * Rather than passing in the top level schema to each BlockItem, it makes sense to lodge this information
   * in a single instance which all BlockItems can then refer to. It also makes everything much slicker
   * when top level schema changes occur, as the changes will be in the singleton schema instance.
   */
  this._layoutSchema = {};

  this.dispatchToken = AppDispatcher.register(this.dispatcherCallback);
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
    this._layoutSchema = Object.assign({}, updatedSchema);
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

  if (MalcolmUtils.hasOwnNestedProperties(topLevelSchema, 'layout', 'meta', 'elements', 'mri'))
  //if (topLevelSchema.hasOwnProperty('layout'))
    {
    let index = 0;
    /**
     * Each BlockItem is referenced in the layout by its position in the attribute arrays. The same index value valid
     * for each attribute list. So can construct each BlockItem, providing it with its unique index and a pointer to
     * the layout schema - each BlockItem can then populate all its attributes from the schema.
     * It is important that pushing to the _allBlockItem array is kept in sync with index count.
     */
    for (let mri in topLevelSchema.layout.meta.elements.mri)
      {
      this._allBlockItems.push(new BlockItem(index, this));
      index++;
      }
    }
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
  return (this._layoutSchema);
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

    /* BLOCK use */

    case appConstants.INTERACTJS_DRAG:
      this.emitChange();
      break;

    /* WebAPI use */

    case appConstants.MALCOLM_GET_SUCCESS:

      //AppDispatcher.waitFor([flowChartStore.dispatchToken]);

      /* Check if it's the initial FlowGraph structure, or
       if it's something else
       */

      console.log('BlockCollection MALCOLM_GET_SUCCESS: item.responseMessage:');
      console.log(item.responseMessage);

      if (item.responseMessage.hasOwnProperty('layout'))
        {

        }

      break;

    case appConstants.MALCOLM_GET_FAILURE:
      console.log("BlockCollection MALCOLM GET ERROR!");
      this.emitChange();
      break;

    case appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
      console.log("BlockCollection malcolmSubscribeSuccess");

      break;


  }
  }
}


// Create the singleton collection of blocks.
let blockCollection = new BlockCollection();


export {blockCollection as default, BlockItem}
