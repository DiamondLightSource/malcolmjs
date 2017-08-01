/**
 * Created by twi18192 on 18/02/16.
 * Refactored by Ian Gillingham: 2016 - 2017
 */
/**
 * @module  flowChartStore
 * @author  Ian Gillingham
 * @since   13/10/2016
 */

import AppDispatcher from '../dispatcher/appDispatcher.js';
import appConstants from '../constants/appConstants.js';
import EventEmitter from 'events';
import blockStore, {BlockItem} from '../stores/blockStore.js';
import blockCollection from '../classes/blockItems';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';
//import {NavbarEventInfo} from '../actions/navbarActions';

let CHANGE_EVENT = 'change';

let clickedEdge               = null;
let clickedBlock              = null;  // Name of the block selected by the user
let heldBlock                 = null;  // Name of the block held by the user
let portThatHasBeenClicked    = null;
let storingFirstPortClicked   = null;
let edgePreview               = null;
let previousMouseCoordsOnZoom = null;
let clickedPortBlockInfo      = null;

let blockStyling = {
  outerRectangleHeight: 76,
  outerRectangleWidth : 76,
  innerRectangleHeight: 70,
  innerRectangleWidth : 70,
  portRadius          : 2.5,
  portFill            : 'grey',
};

let graphPosition = {
  x: 0,
  y: 0
};

let graphZoomScale = 2.0;

let blockSelectedStates = {};
let blockHoldStates = {};
let backgroundSelected  = false;

function appendToBlockSelectedStates(BlockId)
  {
  blockSelectedStates[BlockId] = false;
  }

function removeBlock(blockId)
  {
  /* Remove from blockSelectedStates */
  delete blockSelectedStates[blockId];
  }

function generateRandomBlockPosition()
  {
  return Math.floor((Math.random() * 500) + 1)
  }

function deselectAllBlocks()
  {
  for (let block in blockSelectedStates)
    {
    blockSelectedStates[block] = false
    }

  backgroundSelected = true;

  // Inform views that we have deselected all blocks and edges
  // At this stage prepare to show list of blocks in DlsSidePane.
  flowChartStore.emitChange();
  }

function checkIfAnyBlocksAreSelected()
  {
  let areAnyBlocksSelected = false;
  for (let block in blockSelectedStates)
    {
    if (blockSelectedStates[block] === true)
      {
      areAnyBlocksSelected = true;
      break;
      }
    }
  //console.log(areAnyNodesSelected);
  return areAnyBlocksSelected;
  }

let edgeSelectedStates = {};

function appendToEdgeSelectedStates(EdgeId)
  {
  edgeSelectedStates[EdgeId] = false;
  }

function removeFromEdgeSelectedStates(EdgeId)
  {
  delete edgeSelectedStates[EdgeId];
  }

function selectEdge(Edge)
  {
  edgeSelectedStates[Edge] = true;
  }

function getAnyEdgeSelectedState(EdgeId)
  {
  let selected = false;
  /** edgeSelectedStates is an array of bool */
  if (edgeSelectedStates[EdgeId] === undefined || null)
    {
    //console.log("edge selected state is undefined or null, best check it out...");
    }
  else
    {
    //console.log("that edge's state exists, hooray!");
    selected = edgeSelectedStates[EdgeId];
    }
  return (selected);
  }

function checkIfAnyEdgesAreSelected()
  {
  let areAnyEdgesSelected;
  let i = 0;
  for (let edge in edgeSelectedStates)
    {
    i += 1;
    if (edgeSelectedStates[edge] === true)
      {
      //console.log(edgeSelectedStates[edge]);
      areAnyEdgesSelected = true;
      break;
      }
    else
      {
      areAnyEdgesSelected = false;
      }
    }
  //console.log(areAnyEdgesSelected);
  /* Taking care of if there are no edges, so we return false instead of undefined */
  if (i === 0)
    {
    areAnyEdgesSelected = false;
    }

  return areAnyEdgesSelected;
  }

function deselectAllEdges()
  {
  for (let edge in edgeSelectedStates)
    {
    edgeSelectedStates[edge] = false
    }
  flowChartStore.emitChange();
  }

function updateEdgePreviewEndpoint(position)
  {
  edgePreview.endpointCoords.x += (1 / graphZoomScale) * (position.x);
  edgePreview.endpointCoords.y += (1 / graphZoomScale) * (position.y);
  console.log(edgePreview.endpointCoords);
  }

class FlowChartStore extends EventEmitter {
constructor()
  {
  super();
  this.onChangeBlockCollectionCallback = this.onChangeBlockCollectionCallback.bind(this);

  blockCollection.addChangeListener(this.onChangeBlockCollectionCallback);
  }


addChangeListener(cb)
  {
  this.on(CHANGE_EVENT, cb)
  }

removeChangeListener(cb)
  {
  this.removeListener(CHANGE_EVENT, cb)
  }

emitChange()
  {
  this.emit(CHANGE_EVENT)
  }

/* FLOWCHART use */

getAnyBlockSelectedState(BlockId)
  {
  let selected = false;

  if (blockSelectedStates[BlockId] === undefined || null)
    {
    //console.log("that node doesn't exist in the nodeSelectedStates object, something's gone wrong...");
    //console.log(NodeId);
    //console.log(nodeSelectedStates[NodeId]);
    }
  else
    {
    //console.log("the state of that node exists, passing it now");
    //console.log(nodeSelectedStates[NodeId]);
    selected = blockSelectedStates[BlockId];
    }
  return ( selected );
  }

getIfAnyBlocksAreSelected()
  {
  return checkIfAnyBlocksAreSelected();
  }

getSelectedBlock()
  {
  return(clickedBlock);
  }

getHeldBlock()
  {
  return(heldBlock);
  }

getIfAnyEdgesAreSelected()
  {
  return checkIfAnyEdgesAreSelected();
  }

getIfEdgeIsSelected(EdgeId)
  {
  return getAnyEdgeSelectedState(EdgeId);
  }

getGraphPosition()
  {
  return graphPosition;
  }

getGraphZoomScale()
  {
  return graphZoomScale;
  }


getPortThatHasBeenClicked()
  {
  return portThatHasBeenClicked;
  }

getStoringFirstPortClicked()
  {
  return storingFirstPortClicked;
  }

getEdgePreview()
  {
  return edgePreview;
  }

getBlockStyling()
  {
  return blockStyling;
  }

getBackgroundSelected()
  {
  return backgroundSelected;
  }

/**
 * onChangeBlockCollectionCallback()
 * Callback function called when blockCollection emits an event.
 * Note that 'this' will reference the EventEmitter, not the flowChartStore instance
 * as might be expected. IJG 9/1/17
 *
 * @param event
 * @param items
 */
onChangeBlockCollectionCallback(items)
  {
  //console.log(`flowChartStore.onChangeBlockCollectionCallback(): items = ${items}`);
  let changed = false;

  for (let i = 0; i < items.length; i++)
    {
    let index     = items[i];
    let blockItem = blockCollection.getBlockItem(index);
    if (blockItem !== null)
      {
      /*
       if (blockItem.visible === true)
       {
       appendToBlockSelectedStates(blockItem.blockName());
       changed = true;
       }
       */

      let isWidgetCombo  = false;
      let isGroupInputs  = false;
      let isWidgetToggle = false;

      let meta = null;
      let tags = null;
      // todo - a lot of the VISIBILITY references can go
      if (blockItem != null)
        {
        let names = blockItem.getAttributeNames();

        for (let i = 0; i < names.length; i++)
          {
          let attrName = names[i];
          let attr     = blockItem.getAttribute(attrName);

          if ((attr !== null) && (attr.hasOwnProperty("meta")))
            {
            meta = attr.meta;

            if (meta.hasOwnProperty("tags"))
              {
              tags = JSON.parse(JSON.stringify(meta.tags));
              }

            if (tags != null)
              {
              for (let j = 0; j < tags.length; j++)
                {
                if (tags[j].indexOf('widget:combo') !== -1)
                  {
                  isWidgetCombo = true;
                  }
                else if (tags[j].indexOf('group:inputs') !== -1)
                  {
                  isGroupInputs = true;
                  }
                else if (tags[j] === 'widget:toggle')
                  {
                  isWidgetToggle = true;
                  /*
                   if (blockItem.visible)
                   {
                   appendToBlockSelectedStates(blockItem.blockName());
                   changed = true;
                   }
                   else
                   {
                   removeBlock(blockItem.blockName());
                   changed = true;
                   }
                   */

                  }
                }

              /* Note that this is the exact same code in paneStore, just with
               appendToAllEdgeTabProperties replaced with appendToEdgeSelectedTabStates...
               */

              if (isWidgetCombo === true && isGroupInputs === true)
                {
                /* Then this is some info on edges, so we need
                 to append to the relevant objects in order to have
                 edge tabs
                 */

                let defval = blockItem.getAttributeDefaultValue(attrName);
                if ((defval !== null) && (typeof attr.value === "string") && (attr.value.indexOf(defval) === -1))
                  {
                  // Not default connection
                  /* edgeLabelFirstHalf is the outport block and the
                   outport block port names put together
                   */
                  let edgeLabelFirstHalf = attr.value.replace(/\./g, "");

                  /* edgeLabelSecondHalf is the inport block and the
                   inport block port names put together
                   */
                  let edgeLabelSecondHalf = blockItem.blockName() + attrName;
                  let edgeLabel           = edgeLabelFirstHalf + edgeLabelSecondHalf;

                  appendToEdgeSelectedStates(edgeLabel);
                  }
                else
                  {

                  /* I know what inport and what inport block the edge was
                   connected to, but I don't know what outport or what
                   outport block the edge was connected to, since you
                   get the value to be ZERO instead
                   of what it was connected to before...
                   */

                  let edgeLabelToDelete;

                  let edgeLabelSecondHalf = blockItem.blockName() + attrName;

                  /* Inports can't be connected to more than one outport
                   at a time, so only one edge with edgeLabelSecondHalf in it
                   can exist at any given time, so I think I can search through
                   all the edges in allEdgeTabProperties and see if the
                   indexOf(edgeLabelSecondHalf) !== -1, then that should
                   be the edge that I want to delete
                   */

                  for (let edge in edgeSelectedStates)
                    {
                    if (edge.indexOf(edgeLabelSecondHalf) !== -1)
                      {
                      edgeLabelToDelete = edge;
                      removeFromEdgeSelectedStates(edgeLabelToDelete);
                      }
                    }
                  //console.log(edgeSelectedStates);
                  }
                }
              }
            }
          }
        }
      }
    }
  if (changed === true)
    {
    flowChartStore.emitChange();
    }
  }

/**
 * addEdgePreview()
 *
 * When a block port is clicked, this function will determine the state of the user interaction with the flowChart
 * It can be a first click to select a 'from' port or a second click to select a 'to' port.
 * The ouptut is an edgePreviewInfo object, which then gets stored as a state in this flowChartStore and a
 * change event emitted to inform all components of the change.
 *
 * @param eventdata
 * eventdata is an object which has a property of blockInfo relating to the block containing the port which was clicked.
 */
addEdgePreview()
  {
  // portThatHasBeenClicked contains the reference to the port just clicked.
  // Determine the related block and get its info.
  let blockInfo = clickedPortBlockInfo;

  let blockItem = blockCollection.getBlockItemByName(blockInfo.name);

  console.log('flowChartStore.addEdgePreview(): blockInfo : vvvvv');
  console.log(blockInfo);

  let clickedPort = document.getElementById(portThatHasBeenClicked.id);
  //let clickedPort = portThatHasBeenClicked;

  // AGHHHHHHHHH!!!!!! Yuck... :(
  //let fromBlockId = clickedPort.parentNode.parentNode.parentNode.parentNode.parentNode.id;

  let fromBlockId = blockInfo.name;

  //console.log(`flowChart: addEdgePreview() : clickedPort = ${clickedPort}    fromBlockId = ${fromBlockId}`);

  let portStringSliceIndex = fromBlockId.length;
  let portName             = clickedPort.id.slice(portStringSliceIndex);
  let fromBlockType        = blockInfo.type;

  /* Slightly confusing since the end of the edge is the same as the start
   of the edge at the very beginning of an edgePreview, but this is only to
   do the initial render, this'll be updated by interactJSMouseMoveForEdgePreview()
   in edgePreview.js
   */

  let endOfEdgePortOffsetX;
  let endOfEdgePortOffsetY;
  let portType;

  if (clickedPort.className.baseVal.indexOf('inport') !== -1)
    {

    let inportArrayLength = clickedPortBlockInfo.inports.length;
    let inportArrayIndex;
    for (let j = 0; j < inportArrayLength; j++)
      {
      if (clickedPortBlockInfo.inports[j].name === portName)
        {
        inportArrayIndex = JSON.parse(JSON.stringify(j));
        }
      }
    endOfEdgePortOffsetX = 0;
    endOfEdgePortOffsetY = blockStyling.outerRectangleHeight / (inportArrayLength + 1) * (inportArrayIndex + 1);
    portType             = "inport";
    }
  else if (clickedPort.className.baseVal.indexOf('outport') !== -1)
    {

    let outportArrayLength = clickedPortBlockInfo.outports.length;
    let outportArrayIndex;

    for (let i = 0; i < outportArrayLength; i++)
      {
      if (clickedPortBlockInfo.outports[i].name === portName)
        {
        outportArrayIndex = JSON.parse(JSON.stringify(i));
        }
      }

    endOfEdgePortOffsetX = blockStyling.outerRectangleWidth;
    endOfEdgePortOffsetY = blockStyling.outerRectangleHeight / (outportArrayLength + 1) * (outportArrayIndex + 1);
    portType             = "outport";
    }

  let blockPosX  = blockItem.x();
  let blockPosY  = blockItem.y();
  let endOfEdgeX = blockPosX + endOfEdgePortOffsetX;
  let endOfEdgeY = blockPosY + endOfEdgePortOffsetY;

  edgePreview = {
    fromBlockInfo : {
      fromBlock        : fromBlockId,
      fromBlockType    : fromBlockType,
      fromBlockPort    : portName,
      fromBlockPortType: portType
    },
    /* At the very start this'll be the same as the fromBlockPort position,
     then I'll update it with interactJSMouseMoveForEdgePreview() in edgePreview.js */
    endpointCoords: {
      x: endOfEdgeX,
      y: endOfEdgeY
    }
  };

  // This used to be the purpose of this function when it used to be in flowChart component.
  //
  //flowChartActions.addEdgePreview(edgePreviewInfo);
  flowChartStore.emitChange();

  }

cancelEdgePreview()
  {
  this.resetPortClickStorage();
  edgePreview = null;
  flowChartStore.emitChange();
  }

checkBothClickedPorts()
  {
  /* This function will run whenever we have dispatched a PortSelect event */
  let blockInfo = clickedPortBlockInfo;

  let firstPort  = document.getElementById(storingFirstPortClicked.id);
  let secondPort = document.getElementById(portThatHasBeenClicked.id);

  //console.log(`flowChartStore: checkBothClickedPorts() : firstPort = ${firstPort}    secondPort = ${secondPort}`);

  /* The excessive use of .parentNode is to walk up
   the DOM tree and find the id of the block that the
   port belongs to, not the best way I'm sure...
   */

  /* Trying to use id instead of class to then allow class for interactjs use */
  /* Need the length of the name of the node, then slice the firstPort id string
   until the end of the node name length */

  let firstPortStringSliceIndex = firstPort.parentNode.parentNode.parentNode.parentNode.parentNode.id.length;
  let firstPortName             = firstPort.id.slice(firstPortStringSliceIndex);

  let secondPortStringSliceIndex = secondPort.parentNode.parentNode.parentNode.parentNode.parentNode.id.length;
  let secondPortName             = secondPort.id.slice(secondPortStringSliceIndex);

  let fromBlock = firstPort.parentNode.parentNode.parentNode.parentNode.parentNode.id;
  let toBlock   = secondPort.parentNode.parentNode.parentNode.parentNode.parentNode.id;

  if (firstPort.parentNode.parentNode.parentNode.parentNode.parentNode.id ===
    secondPort.parentNode.parentNode.parentNode.parentNode.parentNode.id &&
    firstPort.id === secondPort.id)
    {
    }
  else
    {
    let edge = {
      fromBlock    : fromBlock,
      fromBlockPort: firstPortName,
      toBlock      : toBlock,
      toBlockPort  : secondPortName
    };
    this.checkPortCompatibility(edge);
    }

  }

checkPortCompatibility(edgeInfo)
  {
  /* First need to check we have an inport and an outport */
  /* Find both port types, then compare them somehow */

  let fromBlockPortType;
  let toBlockPortType;

  let fromBlockItem = blockCollection.getBlockItemByName(edgeInfo.fromBlock);
  let fromBlockType = fromBlockItem.blockType;
  let toBlockItem   = blockCollection.getBlockItemByName(edgeInfo.toBlock);
  let toBlockType   = toBlockItem.blockType;

  let allBlockInfo = blockStore.getAllBlockInfo();

  //console.log(`flowChart: checkPortCompatibility() : fromBlockType = ${fromBlockType}    toBlockType = ${toBlockType}`);

  /* Remember, this is BEFORE any swapping occurs, but be
   aware that these may have to swap later on
   */
  let blockTypes = {
    fromBlockType: fromBlockType,
    toBlockType  : toBlockType
  };

  if (document.getElementById(storingFirstPortClicked.id).parentNode
      .transform.animVal[0].matrix.e === 0)
    {
    //console.log("it's an inport, since the port's x value is zero!");
    fromBlockPortType = "inport";
    }
  else
    {
    fromBlockPortType = "outport";
    }

  if (document.getElementById(portThatHasBeenClicked.id).parentNode
      .transform.animVal[0].matrix.e === 0)
    {
    toBlockPortType = "inport";
    }
  else
    {
    toBlockPortType = "outport";
    }

  /* Note that the inportIndex is used to then look in allBlockInfo
   and check if the selected inport is already conencted or not
   */

  let inportIndex;

  for (let i = 0; i < allBlockInfo[edgeInfo.fromBlock].inports.length; i++)
    {
    if (allBlockInfo[edgeInfo.fromBlock].inports[i].name === edgeInfo.fromBlockPort)
      {
      inportIndex = i;
      break;
      }
    }

  for (let j = 0; j < allBlockInfo[edgeInfo.toBlock].inports.length; j++)
    {
    if (allBlockInfo[edgeInfo.toBlock].inports[j].name === edgeInfo.toBlockPort)
      {
      inportIndex = j;
      break;
      }
    }

  let portTypes = {
    fromBlockPortType: fromBlockPortType,
    toBlockPortType  : toBlockPortType
  };

  let types = {
    blockTypes: blockTypes,
    portTypes : portTypes
  };

  /* Time to compare the fromNodePortType and toNodePortType */

  if (fromBlockPortType === toBlockPortType)
    {
    window.alert("Incompatible ports, they are both " + fromBlockPortType + "s.");
    this.resetPortClickStorage();
    this.cancelEdgePreview();
    }
  else if (fromBlockPortType !== toBlockPortType)
    {

    if (fromBlockPortType === "inport")
      {
      this.isInportConnected(edgeInfo.fromBlockPort, inportIndex, edgeInfo.fromBlock, edgeInfo, types);
      }
    else if (toBlockPortType === "inport")
      {
      this.isInportConnected(edgeInfo.toBlockPort, inportIndex, edgeInfo.toBlock, edgeInfo, types);
      }

    }

  }

isInportConnected(inport, inportIndex, block, edgeInfo, types)
  {
  let allBlockInfo = blockStore.getAllBlockInfo();

  if (allBlockInfo[block].inports[inportIndex].connected === true)
    {
    window.alert("The inport " + inport + " of the block " + block +
      " is already connected, so another connection cannot be made");

    this.cancelEdgePreview();
    }
  else if (allBlockInfo[block].inports[inportIndex].connected === false)
    {

    /* Now check if the port value types are compatible (ie, if they're the same) */

    let startBlock;
    let startBlockPort;
    let endBlock;
    let endBlockPort;
    let fromPortValueType;
    let toPortValueType;

    /* For the malcolmCall that updates the dropdown menu list
     specifying what port the block's inport is connected to */
    let inportBlock;

    if (types.portTypes.fromBlockPortType === 'outport')
      {

      startBlock     = edgeInfo.fromBlock;
      startBlockPort = edgeInfo.fromBlockPort;
      endBlock       = edgeInfo.toBlock;
      endBlockPort   = edgeInfo.toBlockPort;

      /* Now to loop through the specific port's tags to find
       out what type it is (ie, pos, bit etc)
       */

      /* We know that the toBlockPortType is an inport,
       so then we can check their port VALUE types accordingly */
      for (let i = 0; i < allBlockInfo[edgeInfo.fromBlock].outports.length; i++)
        {
        if (allBlockInfo[edgeInfo.fromBlock].outports[i].name === edgeInfo.fromBlockPort)
          {
          fromPortValueType = allBlockInfo[edgeInfo.fromBlock].outports[i].type;
          }
        }

      for (let j = 0; j < allBlockInfo[edgeInfo.toBlock].inports.length; j++)
        {
        if (allBlockInfo[edgeInfo.toBlock].inports[j].name === edgeInfo.toBlockPort)
          {
          toPortValueType = allBlockInfo[edgeInfo.toBlock].inports[j].type;
          }
        }
      }
    else if (types.portTypes.fromBlockPortType === 'inport')
      {

      /* Note that you must also flip the ports too! */
      startBlock     = edgeInfo.toBlock;
      startBlockPort = edgeInfo.toBlockPort;
      endBlock       = edgeInfo.fromBlock;
      endBlockPort   = edgeInfo.fromBlockPort;

      }

    if (fromPortValueType === toPortValueType)
      {
      /* Proceed with the connection as we have compatible port value types */

      /* Create new edges by sending a malcolmCall */

      inportBlock = endBlock;
      /* the 'method' argument */
      let newDropdownValue = startBlock + "." + startBlockPort;
      /* the 'args' argument */
      let argsObject           = {};
      argsObject[endBlockPort] = newDropdownValue;

      /**
       * TODO: Modify for Protocol 2
       *      Must be of the form:
       *      {"typeid":"malcolm:core/Put:1.0","id":0,"path":["P:FMC","outPwrOn","value"],"value":"Off"}
       */
      let item = blockCollection.getBlockItemByName(inportBlock);
      if (item !== null)
        {
        let mri      = item.mri();
        let endpoint = [mri, endBlockPort, "value"];
        let newValue = newDropdownValue.toUpperCase();
        MalcolmActionCreators.malcolmPut(inportBlock, endpoint, newValue);
        //MalcolmActionCreators.malcolmCall(inportBlock, inputFieldSetMethod, argsObject);
        }

      this.resetPortClickStorage();

      /* Can now safely delete the edgePreview by setting it back to null */
      this.cancelEdgePreview();
      }
    else if (fromPortValueType !== toPortValueType)
      {
      window.alert("Incompatible port value types: the port " +
        edgeInfo.fromBlockPort.toUpperCase() + " in " + edgeInfo.fromBlock.toUpperCase() +
        " has value type " + fromPortValueType.toUpperCase() + ", whilst the port " +
        edgeInfo.toBlockPort.toUpperCase() + " in " + edgeInfo.toBlock.toUpperCase() +
        " has value type " + toPortValueType.toUpperCase() + ".");

      /* Do all the resetting jazz */

      this.resetPortClickStorage();

      this.cancelEdgePreview();
      }

    }
  }

failedPortConnection()
  {
  this.resetPortClickStorage();
  document.getElementById('dragArea').style.cursor = 'default';
  this.cancelEdgePreview();
  }

resetPortClickStorage()
  {
  storingFirstPortClicked = null;
  flowChartStore.emitChange();
  }

/**
 * getAllBlockInfo()
 * The FlowChart component depends on properties derived from blockStore,
 * so this function is a proxy to the blockStore function, so that FlowChart
 * can follow Flux guidelines and be updated by only one store.
 * @returns {{}|*}
 */
getAllBlockInfo()
  {
  let allBlockInfo = blockStore.getAllBlockInfo();
  return (allBlockInfo);
  }

/**
 * getBlockPositions()
 * The FlowChart component depends on properties derived from blockStore,
 * so this function is a proxy to the blockStore function, so that FlowChart
 * can follow Flux guidelines and be updated by only one store.
 * @returns {{}|*}
 */
getBlockPositions()
  {
  let blockPositions = blockStore.getBlockPositions();
  return (blockPositions);
  }


passPortMouseDown(item)
  {
  if (item !== null)
    {
    portThatHasBeenClicked = item.target;
    clickedPortBlockInfo   = {...item.blockInfo}; // Make a deep copy using spread.
    flowChartStore.emitChange();
    }
  }

}

const flowChartStore = new FlowChartStore();

//let blockStore = require('./blockStore');

flowChartStore.dispatchToken = AppDispatcher.register((payload) =>
{
let action = payload.action;
let item   = action.item;

//console.log(payload);
//console.log(item);

switch (action.actionType)
{

  case appConstants.SELECT_BLOCK:
    blockSelectedStates[item] = true;
    clickedBlock              = item;
    console.log(`flowChartStore: SELECT_BLOCK event - item: ${item}  blockSelectedStates ${blockSelectedStates[item]}`);
    //flowChartStore.waitFor([blockStore.dispatchToken]);
    flowChartStore.emitChange();
    break;

  case appConstants.HOLD_BLOCK:
    blockHoldStates[item] = true;
    heldBlock             = item;
    console.log(`flowChartStore: HOLD_BLOCK event - item: ${item}  blockHoldStates ${blockHoldStates[item]}`);
    //flowChartStore.waitFor([blockStore.dispatchToken]);
    flowChartStore.emitChange();
    break;

  case appConstants.RELEASE_BLOCK:
    blockHoldStates[item] = false;
    heldBlock             = null;
    console.log(`flowChartStore: RELEASE_BLOCK event - item: ${item}  blockHoldStates ${blockHoldStates[item]}`);
    //flowChartStore.waitFor([blockStore.dispatchToken]);
    flowChartStore.emitChange();
    break;

  case appConstants.DESELECT_ALLBLOCKS:
    deselectAllBlocks();
    //flowChartStore.waitFor([blockStore.dispatchToken]);
    flowChartStore.emitChange();
    break;

  case appConstants.SELECT_EDGE:
    {
    let areAnyEdgesSelected = checkIfAnyEdgesAreSelected();
    //console.log(areAnyEdgesSelected);
    console.log('flowChartStore: SELECT_EDGE received from dispatcher vvvvvv');
    console.log(clickedEdge);
    if ((areAnyEdgesSelected === true) && (item !== clickedEdge))
      {
      deselectAllEdges();
      selectEdge(item);
      }
    else if (areAnyEdgesSelected === false)
      {
      selectEdge(item);
      }
    console.log(edgeSelectedStates);
    console.log('flowChartStore: SELECT_EDGE ^^^^^^');
    //flowChartStore.waitFor([blockStore.dispatchToken]);
    flowChartStore.emitChange();
    }
    break;

  case appConstants.DESELECT_ALLEDGES:
    deselectAllEdges();
    //flowChartStore.waitFor([blockStore.dispatchToken]);
    flowChartStore.emitChange();
    break;

  case appConstants.CHANGE_GRAPHPOSITION:
    graphPosition = item;
    //flowChartStore.waitFor([blockStore.dispatchToken]);
    flowChartStore.emitChange();
    break;

  case appConstants.GRAPH_ZOOM:
    graphZoomScale = item;
    //flowChartStore.waitFor([blockStore.dispatchToken]);
    flowChartStore.emitChange();
    break;

  case appConstants.GETANY_EDGESELECTEDSTATE:
    getAnyEdgeSelectedState(item);
    //console.log(edgeSelectedStates[item]);
    //flowChartStore.waitFor([blockStore.dispatchToken]);
    flowChartStore.emitChange();
    break;

  case appConstants.CLICKED_EDGE:
    clickedEdge = item;
    console.log('flowChartStore: CLICKED_EDGE received from dispatcher vvvvv');
    console.log(clickedEdge);
    console.log('flowChartStore: CLICKED_EDGE ^^^^^');
    //flowChartStore.waitFor([blockStore.dispatchToken]);
    flowChartStore.emitChange();
    break;

  case appConstants.PASS_PORTMOUSEDOWN:
    AppDispatcher.waitFor([blockCollection.dispatchToken]);
    console.log(`flowChartStore: Disatcher callback: PASS_PORTMOUSEDOWN: item ${item}`)
    flowChartStore.passPortMouseDown(item);
    //break;

    if (item !== null)
      {
      portThatHasBeenClicked = item.target;
      clickedPortBlockInfo   = {...item.blockInfo}; // Make a deep copy using spread.
      if (storingFirstPortClicked === null)
        {
        /* Haven"t clicked on another port before this,
         just do an edgePreview rather than draw an edge
         */
        console.log(`flowChartStore: storingFirstPortClicked === null so first port click will be set.`)
        flowChartStore.addEdgePreview();
        }
      else
        {
        /* A port has been clicked before this, so
         start the checking whether the two ports
         are connectable/compatible
         */
        console.log(`flowChartStore: storingFirstPortClicked !== null so first port already clicked - check for second port click.`)
        flowChartStore.checkBothClickedPorts();
        }
      }
    else
      {
      //flowChartStore.waitFor([blockStore.dispatchToken]);
      console.log(`flowChartStore: item === null so just emitChange().`)
      flowChartStore.emitChange();
      }
    // emitChange() now called in addEdgePreview() above.
    //flowChartStore.emitChange();
    break;

  case appConstants.DESELECT_ALLPORTS:
    portThatHasBeenClicked = null;
    //console.log("portThatHasBeenClicked has been reset");
    //flowChartStore.waitFor([blockStore.dispatchToken]);
    flowChartStore.emitChange();
    break;

  case appConstants.STORING_FIRSTPORTCLICKED:
    storingFirstPortClicked = item;
    //console.log("storingFirstPortClicked is now: " + storingFirstPortClicked.id);
    //flowChartStore.waitFor([blockStore.dispatchToken]);
    flowChartStore.emitChange();
    break;

  case appConstants.ADD_EDGEPREVIEW:
    edgePreview = item;
    //flowChartStore.waitFor([blockStore.dispatchToken]);
    flowChartStore.emitChange();
    break;

  case appConstants.UPDATE_EDGEPREVIEWENDPOINT:
    //flowChartStore.waitFor([blockCollection.dispatchToken]);
    updateEdgePreviewEndpoint(item);
    flowChartStore.emitChange();
    break;

  case appConstants.PREVIOUS_MOUSECOORDSONZOOM:
    previousMouseCoordsOnZoom = item;
    //flowChartStore.waitFor([blockStore.dispatchToken]);
    flowChartStore.emitChange();
    break;

  case appConstants.MALCOLM_GET_SUCCESS:
    break;

  case appConstants.INTERACTJS_DRAG:
    flowChartStore.emitChange();
    break;

  case appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
  case appConstants.MALCOLM_SUBSCRIBE_SUCCESS_LAYOUT:
    //console.info("flowChartStore malcolmSubscribe success",item.responseMessage);
    /* I need to have it listening to when any new edges are added
     via malcolm, currently I'm listening to the old appConstant:
     ADD_ONESINGLEEDGETOALLBLOCKINFO
     */
    //AppDispatcher.waitFor([blockCollection.dispatchToken]);
    flowChartStore.emitChange();

    break;

  case appConstants.NAVBAR_ACTION:
    flowChartStore.emitChange();
    break;

  default:
    //console.log("flowChartStore dispatch callback - unrecognised actionType.");
    break;
}

});

export {flowChartStore as default, FlowChartStore};
