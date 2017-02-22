/**
 * Created by twi18192 on 10/12/15.
 */

let AppDispatcher = require('../dispatcher/appDispatcher.js');
let appConstants  = require('../constants/appConstants.js');
let EventEmitter  = require('events').EventEmitter;
let assign        = require('../../node_modules/object-assign/index.js');
import eachOf from 'async/eachOf';

import MalcolmActionCreators from '../actions/MalcolmActionCreators';
let attributeStore = require('./attributeStore');

import config from "../utils/config";
import blockCollection from '../classes/blockItems';

let update = require('react-addons-update');

let CHANGE_EVENT = 'change';

let _stuff = {
  blockList: null
};

let allBlockInfo = {};

let initialEdgeInfo = {};

let blockPositions = {};

/**
 * mapPortBlock: Contains a dictionary of port id mapped to block id
 * Provides a clean and reliable lookup of the block associated with a port
 * when the port is clicked.
 * Mapping structure is:
 * [{port_id : block_name}]
 *
 * IJG 10 Feb 2017
 *
 * @type {{}}
 */
let mapPortBlock = {};

function appendToBlockPositions(BlockId, xCoord, yCoord)
  {
  blockPositions[BlockId] = {
    x: xCoord * 1 / flowChartStore.getGraphZoomScale(),
    y: yCoord * 1 / flowChartStore.getGraphZoomScale()
  }
  }

function interactJsDrag(BlockInfo)
  {

  //let oldBlockPositions = blockPositions;
  //let oldBlockPositionsObject = blockPositions[BlockInfo.target];
  //let oldCounter1BlockPositions = blockPositions['COUNTER1'];

  //blockPositions[BlockInfo.target] = {
  //  x: blockPositions[BlockInfo.target].x + BlockInfo.x * (1 / flowChartStore.getGraphZoomScale()),
  //  y: blockPositions[BlockInfo.target].y + BlockInfo.y * (1 / flowChartStore.getGraphZoomScale())
  //};

  //blockPositions[BlockInfo.target].x = blockPositions[BlockInfo.target].x +
  //    BlockInfo.x * (1/flowChartStore.getGraphZoomScale());

  /* This works to alter individual object key values */
  //blockPositions[BlockInfo.target] = update(blockPositions[BlockInfo.target],
  //  {$merge : {x: blockPositions[BlockInfo.target].x +
  //  BlockInfo.x * (1/flowChartStore.getGraphZoomScale())}});
  //
  //blockPositions[BlockInfo.target].y = blockPositions[BlockInfo.target].y +
  //  BlockInfo.y * (1/flowChartStore.getGraphZoomScale());


  /* Testing React's immutability helper 'update' */

  blockPositions[BlockInfo.target] = update(blockPositions[BlockInfo.target], {
    $set: {
      x: blockPositions[BlockInfo.target].x + BlockInfo.x * (1 / flowChartStore.getGraphZoomScale()),
      y: blockPositions[BlockInfo.target].y + BlockInfo.y * (1 / flowChartStore.getGraphZoomScale())
    }
  });

  }


/* Functions to do with data retrieval from the server */

/* So what will happen is that an action will tell the server we want new info, it'll fetch it, and then
 return it to blockStore in the form of an object of some sort. From there you can do all sorts of things like update
 the value of a specific port of an existing block, add a port to an existing block etc.

 Depending on the action that triggered the data fetch from the server I'll know which one of these various things
 it was that I needed to do, so hopefully then I can trigger the correct function in blockStore after the data has
 been returned/fetched to blockStore successfully?
 */
function addBlock(blockItem)
  {
  // Strip off the block type instance number to just leave the type.
  let blockType = blockItem.blockType;

  let inports  = [];
  let outports = [];

  /* The use of the three variables below is to take care of the
   case when a block that is connected to another is added, but
   the other block it is connected to doesn't yet exist in the GUI.

   Inports of blocks are checked to see if they are connected to
   ports of other blocks. If the other block exists then great, simply
   add the info to allBlockInfo to both blocks' ports to reflect
   the connection.

   However, if the other OUTPORT block doesn't exist, then to
   account for this I add the name of the block and port that
   doesn't yet exist (in the format blockName.portName) to the
   initialEdgeInfo object as the key, and the key value is the
   name of the block that is currently being processed in the
   function (again, in the same format of blockName.portName)

   Then in the outports part it checks each outport to see if
   that particular block & port combination is in the
   initialEdgeInfo object (meaning that earlier on we ran into
   a INPORT block that was connected to the current OUPORT block,
   but the OUTPORT block didn't yet exist). If so, proceed to update
   both blocks in allBlockInfo to show that they are connected.
   */
  /**

   _O/
   \     Aghh... my head is going to explode!!
   /\_
   \  `

   */

  let initialEdgeInfoKeyName;
  let initialEdgeInfoKeyValueName;
  let outportsThatExistInInitialEdgeInfo = [];


  let names = blockItem.getAttributeNames();

  for (let nameindex = 0; nameindex < names.length; nameindex++)
    {
    let attrName  = names[nameindex];
    let attribute = blockItem.getAttribute(attrName);
    let tags      = blockItem.getAttributeTags(attrName);
    if (tags !== null)
      {
      for (let i = 0; i < tags.length; i++)
        {
        let inportRegExp  = /inport/;
        let outportRegExp = /outport/;
        if (inportRegExp.test(tags[i]) === true)
          {
          let inportName = attrName;

          /* Find the type of the inport value too,
           via the flowgraph tag
           */

          let inportValueType = tags[i].split(':')[1];

          /* Need to check if the inport is connected to
           anything as well, so then edges will be preserved
           on a window refresh!
           */
          let inportValue = attribute.value;

          /* Initially, the port is always added as being disconnected,
           even if it is connected. This is to accommodate not being able
           to add any edges until we can be certain that both involved
           blocks exist within the GUI/store
           */
          /**
           * inportValue should be of the form: "inport:bool:ZERO"
           */

          if (allBlockInfo[inportValue.slice(0, inportValue.indexOf(':'))] === undefined)
            {

            inports.push(
              {
                name       : inportName,
                type       : inportValueType,
                value      : String(inportValue),
                connected  : false,
                connectedTo: null
              }
            );

            if (inportValue.indexOf('ZERO') !== -1)
              {
              /* Then the block is connected to a .ZERO port,
               ie, it's disconnected, so no need to do anything
               */
              }
            else if (inportValue.indexOf('ZERO') === -1)
              {
              /* The inport is connected to an outport,
               so need to do more here
               */

              initialEdgeInfoKeyValueName = blockItem.blockName() + "." + attrName;

              initialEdgeInfo[inportValue] = initialEdgeInfoKeyValueName;

              }
            } // TODO: Revisit these colons - I suspect they should be dots (as was)
          else if (allBlockInfo[inportValue.slice(0, inportValue.indexOf('.'))] !== undefined)
            {
            /* Then the outport block already exists, so can
             simply push the inport like normal!
             */

            console.log("outport block already exists, so can just add the wire initially!");
            console.log(initialEdgeInfo);

            let outportBlockName;
            let outportName;
            if (inportValue.indexOf('.') != -1)
              {
              outportBlockName = inportValue.slice(0, inportValue.indexOf('.'));
              outportName      = inportValue.slice(inportValue.indexOf('.') + 1);
              }

            inports.push(
              {
                name       : inportName,
                type       : inportValueType,
                value      : String(inportValue),
                connected  : true,
                connectedTo: {
                  block: outportBlockName,
                  port : outportName
                }
              }
            );

            }

          }
        else if (outportRegExp.test(tags[i]) === true)
          {
          let outportName = attrName;

          let outportValueType = tags[i].split(':')[1];

          let outportValue = attribute.value;

          initialEdgeInfoKeyName = blockItem.blockName() + '.' + attrName;

          if (initialEdgeInfo[initialEdgeInfoKeyName] !== undefined)
            {
            outportsThatExistInInitialEdgeInfo.push(initialEdgeInfoKeyName);
            }

          outports.push(
            {
              name       : outportName,
              type       : outportValueType,
              value      : String(outportValue),
              connected  : false,
              connectedTo: []
            }
          )
          }
        }
      }

    }

  allBlockInfo[blockItem.blockName()] = {
    type    : blockType,
    label   : blockItem.blockName(),
    //iconURL : blockAttributesObject['ICON'].value, todo
    name    : blockItem.blockName(),
    inports : inports,
    outports: outports
  };

  /* Now to go through the outportsThatExistInInitialEdgeInfo array
   and update both blocks involved in the connection
   */

  if (outportsThatExistInInitialEdgeInfo !== undefined &&
    outportsThatExistInInitialEdgeInfo.length > 0)
    {
    for (let k = 0; k < outportsThatExistInInitialEdgeInfo.length; k++)
      {
      updateAnInitialEdge(outportsThatExistInInitialEdgeInfo[k]);
      }
    }

  }

function removeBlock(blockItem)
  {
  let name = blockItem.blockName();
  delete allBlockInfo[name];
  delete blockPositions[name];
  }

function updateAnInitialEdge(initialEdgeInfoKey)
  {

  let initialEdgeInfoValue = initialEdgeInfo[initialEdgeInfoKey];

  let outportBlockName = initialEdgeInfoKey.slice(0, initialEdgeInfoKey.indexOf('.'));
  let outportName      = initialEdgeInfoKey.slice(initialEdgeInfoKey.indexOf('.') + 1);

  let inportBlockName = initialEdgeInfoValue.slice(0, initialEdgeInfoValue.indexOf('.'));
  let inportName      = initialEdgeInfoValue.slice(initialEdgeInfoValue.indexOf('.') + 1);

  /* Now to go through allBlockInfo and change the connected
   attributes of the inports and outports to true
   */

  for (let i = 0; i < allBlockInfo[inportBlockName].inports.length; i++)
    {
    if (allBlockInfo[inportBlockName].inports[i].name === inportName)
      {
      allBlockInfo[inportBlockName].inports[i].connectedTo = {
        block: outportBlockName,
        port : outportName
      };
      allBlockInfo[inportBlockName].inports[i].connected   = true;
      }
    }

  for (let j = 0; j < allBlockInfo[outportBlockName].outports.length; j++)
    {
    if (allBlockInfo[outportBlockName].outports[j].name === outportName)
      {
      allBlockInfo[outportBlockName].outports[j].connectedTo.push({
        block: inportBlockName,
        port : inportName
      });
      allBlockInfo[outportBlockName].outports[j].connected = true;
      }
    }

  /* Now delete that particular key in initialEdgeInfo, I don't
   think it's needed anymore?
   */

  delete initialEdgeInfo[initialEdgeInfoKey];

  }

function addEdgeViaMalcolm(Info)
  {
  // TODO: ERR: blockStore.addEdgeViaMalcolm: allBlockInfo does not have Info.outportBlock attribute
  //return; // !!!!!!! Temporary disable function - must put this back once sorted!!!!!!
  //debugger;
  //window.alert(allBlockInfo[Info.inportBlock.label]);
  if (allBlockInfo[Info.inportBlock] !== undefined)
    {
    for (let i = 0; i < allBlockInfo[Info.inportBlock].inports.length; i++)
      {
      if (allBlockInfo[Info.inportBlock].inports[i].name === Info.inportBlockPort)
        {
        let addEdgeToInportBlock                              = {
          block: Info.outportBlock,
          port : Info.outportBlockPort
        };
        allBlockInfo[Info.inportBlock].inports[i].connected   = true;
        allBlockInfo[Info.inportBlock].inports[i].connectedTo = addEdgeToInportBlock;
        }
      }
    }
  else
    {
    console.log('ERR: blockStore.addEdgeViaMalcolm: allBlockInfo does not have Info.inportBlock attribute');
    console.log(allBlockInfo);
    }

  if (allBlockInfo[Info.outportBlock] !== undefined)
    {
    for (let j = 0; j < allBlockInfo[Info.outportBlock].outports.length; j++)
      {
      if (allBlockInfo[Info.outportBlock].outports[j].name === Info.outportBlockPort)
        {
        let addEdgeToOutportBlock                             = {
          block: Info.inportBlock,
          port : Info.inportBlockPort
        };
        allBlockInfo[Info.outportBlock].outports[j].connected = true;
        allBlockInfo[Info.outportBlock].outports[j].connectedTo.push(addEdgeToOutportBlock);
        }
      }
    }
  else
    {
    console.log('ERR: blockStore.addEdgeViaMalcolm: allBlockInfo does not have Info.outportBlock attribute');
    console.log(allBlockInfo);
    }
  }

function removeEdgeViaMalcolm(Info)
  {
  /* This is specifically for when there's a connection to
   BITS.ZERO and it means a disconnection rather than connect
   to the BITS.ZERO port
   */

  for (let i = 0; i < allBlockInfo[Info.inportBlock].inports.length; i++)
    {
    if (allBlockInfo[Info.inportBlock].inports[i].name === Info.inportBlockPort)
      {
      allBlockInfo[Info.inportBlock].inports[i].connected   = false;
      allBlockInfo[Info.inportBlock].inports[i].connectedTo = null;
      }
    }

  /* The BITS block doesn't necessarily exist, and its
   ZERO port is used specifically to show disconnected
   blocks, so there's no need to remove the info from
   the BITS block in allBlockInfo since it's not
   necessarily there, and it's unneeded anyway
   */

  }

let flowChartStore = require('./flowChartStore');

class BlockStore extends EventEmitter {
constructor()
  {
  super();
  blockCollection.addChangeListener(this.onChangeBlockCollectionCallback);
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
  //console.log('blockStore.emitChange ^V^V^V^');
  this.emit(CHANGE_EVENT);
  }

getAllBlockInfo()
  {
  if (allBlockInfo === null)
    {
    allBlockInfo = {};

    //MalcolmActionCreators.initialiseFlowChart(config.getDeviceName());

    return {};
    }
  else
    {
    return allBlockInfo;
    }
  }

getBlockPositions()
  {
  return blockPositions;
  }


/**
 * onChangeBlockCollectionCallback()
 * Callback function called when blockCollection emits an event.
 * Note that this will reference the EventEmitter, not the blockStore instance
 * as might be expected. IJG 9/1/17
 *
 * @param event
 * @param items
 */
onChangeBlockCollectionCallback(items)
  {
  //console.log(`blockStore.onChangeBlockCollectionCallback(): items = ${items}`);
  for (let i = 0; i < items.length; i++)
    {
    let index = items[i];
    blockStore.blockUpdated(index);
    }
  }

/**
 * Determine whether this blockItem has a position move to be applied.
 * @param blockItem
 */
updateBlockPosition(blockItem)
  {
  let updated = false;

  if (blockItem !== null)
    {
    let blockName = blockItem.blockName();
    /* Undoing the zoom scale multiplication to check against
     the server's unscaled coords */

    /* When a block is removed/hidden, its coords get reset to
     (0,0), so need to check if they still exist in blockPositions
     in case a coord change I catch here is due to removing a block
     */

    if (blockPositions[blockName] !== undefined)
      {
      // --- This section used to be in MALCOLM_GET_SUCCESS
      let xCoord = blockItem.x();
      let yCoord = blockItem.y();

      /* Add the block to allBlockInfo! */

      //console.log('blockStore MALCOLM_GET_SUCCESS: item.responseMessage - iteration:');
      //console.log(blockName);

      //        if (item.responseMessage.layout.value.visible[i] === true)
      //          {
      //console.log('blockStore MALCOLM_GET_SUCCESS:' + '  name: ' + blockName + ' -- item.responseMessage...visible : true');
      appendToBlockPositions(blockName, xCoord, yCoord);
      /* Pass addBlock the block object from allBlockAttributes in attributeStore
       instead of relying on testAllBlockInfo
       */
      addBlock(blockItem);
      // -------------------

      // --- This section used to be in MALCOLM_SUBSCRIBE_SUCCESS
      if (blockPositions[blockName].x * flowChartStore.getGraphZoomScale() !== blockItem.x())
        {
        blockPositions[blockName] = update(blockPositions[blockName],
          {x: {$set: blockItem.x() * 1 / flowChartStore.getGraphZoomScale()}});
        updated                   = true;
        }
      if (blockPositions[blockName].y * flowChartStore.getGraphZoomScale() !== blockItem.y())
        {
        blockPositions[blockName] = update(blockPositions[blockName],
          {y: {$set: blockItem.y() * 1 / flowChartStore.getGraphZoomScale()}});
        updated                   = true;
        }
      // -------------------

      }
    }
  return (updated);
  }


blockUpdated(blockIndex)
  {
  let isInportDropdown = false;
  let hasFlowgraphTag  = false;

  let blockItem = blockCollection.getBlockItem(blockIndex);
  if (blockItem !== null)
    {
    let positionUpdated = blockStore.updateBlockPosition(blockItem);

    let attrNames = blockItem.getAttributeNames();

    if (attrNames.length > 0)
      {
      for (let a = 0; a < attrNames.length; a++)
        {
        let attributeName = attrNames[a];
        let tags          = blockItem.getAttributeTags(attributeName);
        isInportDropdown  = false;
        hasFlowgraphTag   = false;

        for (let p = 0; p < tags.length; p++)
          {
          if (tags[p].indexOf('widget:combo') !== -1)
            {
            isInportDropdown = true;
            }
          else if ((tags[p].indexOf('flowgraph') !== -1) || (tags[p].indexOf('inport') !== -1) || (tags[p].indexOf('outport') !== -1))
            {
            hasFlowgraphTag = true;
            }
          else if (tags[p] === 'widget:toggle')
            {

            /* What about when a block's own visible attribute gets changed? */

            /**
             * TODO: DEBUG
             */
            if (blockItem.visible)
            //if (true)
              {
              /* Trying to add a blockadd when its visibility is
               changed to 'Show'
               */

              appendToBlockPositions(blockItem.blockName(),
                flowChartStore.getGraphPosition().x, flowChartStore.getGraphPosition().y);

              /* Pass addBlock the block object from allBlockAttributes in attributeStore
               instead of relying on testAllBlockInfo
               */
              addBlock(blockItem);
              positionUpdated = true;
              }
            else
              {
              /**
               * block not visible, so remove
               the info from allBlockInfo.
               */
              removeBlock(blockItem);
              positionUpdated = true;
              }
            }
          }

        if (isInportDropdown === true && hasFlowgraphTag === true)
          {
          // Try placing this section here, as I think anything that is tagged as gui
          // should be recorded in block positions.
          appendToBlockPositions(blockItem.blockName(),
            flowChartStore.getGraphPosition().x, flowChartStore.getGraphPosition().y);

          /* Pass addBlock the block object from allBlockAttributes in attributeStore
           instead of relying on testAllBlockInfo
           */
          addBlock(blockItem);
          positionUpdated = true;


          /* Then update allBlockInfo with the new edge! */
          let attribute = blockItem.getAttribute(attributeName);
          if (attribute.hasOwnProperty("value"))
            {
            let inportBlock     = blockItem.blockName();
            let inportBlockPort = attributeName;

            // TODO: This truncates the string by one character if '.' is not fount (-1 returned)
            // So check what we are testing and put temporary test for '.' before slicing.
            //
            let outportBlock;
            //if (attribute.value.indexOf('.'))
            if (attribute.value.indexOf('.'))
              outportBlock = attribute.value.slice(0, attribute.value.indexOf('.'));
            else
              outportBlock = attribute.value;

            let outportBlockPort = attribute.value.slice(attribute.value.indexOf('.') + 1);

            let defval = blockItem.getAttributeDefaultValue(attributeName);
            if (attribute.value.indexOf(defval) === -1)
              {

              addEdgeViaMalcolm({
                inportBlock     : inportBlock,
                inportBlockPort : inportBlockPort,
                outportBlock    : outportBlock,
                outportBlockPort: outportBlockPort
              });
              }
            else if (attribute.value.indexOf(defval) !== -1)
              {
              /* Then the edge needs to be deleted! */

              /* Update: note that this could also occur when the
               block with the inport is REMOVED via a toggle switch,
               so then in that case the edge has been removed when the
               block got deleted from allBlockInfo, ie, there's no need
               to remove the edge in that case as it has effectively
               already been done implicitly via block removal
               */

              if (allBlockInfo[inportBlock] !== undefined)
                {
                removeEdgeViaMalcolm({
                  inportBlock    : inportBlock,
                  inportBlockPort: inportBlockPort,
                });
                //console.log(allBlockInfo[inportBlock]);
                }
              }
            positionUpdated = true;
            }
          }
        }
      if (positionUpdated === true)
        {
        blockStore.emitChange();
        }
      }
    } // if (blockItem !== null)
  } // blockUpdated()

} // Class

const blockStore = new BlockStore();

blockStore.dispatchToken = AppDispatcher.register(
  function (payload)
  {
  let action = payload.action;
  let item   = action.item;

  switch (action.actionType)
  {

    /* BLOCK use */

    case appConstants.INTERACTJS_DRAG:
      interactJsDrag(item);
      blockStore.emitChange();
      break;

    /* WebAPI use */

    case
    appConstants.MALCOLM_CALL_SUCCESS
    :
      console.log("malcolmCallSuccess");
      //blockStore.emitChange();
      break;

    case
    appConstants.MALCOLM_CALL_FAILURE
    :
      console.log("malcolmCallFailure");
      //blockStore.emitChange();
      break;

    case
    appConstants.INITIALISE_FLOWCHART_START
    :
      //console.log("initialise flowChart start blockStore");
      //blockStore.emitChange();
      break;

    default:
      return true;
  }
  return ( true );
  })
;


module.exports = blockStore;
