/**
 * Created by twi18192 on 18/02/16.
 * Refactored by Ian Gillingham: 2016 - 2017
 */

let AppDispatcher = require('../dispatcher/appDispatcher.js');
let appConstants  = require('../constants/appConstants.js');
let EventEmitter  = require('events').EventEmitter;
let assign        = require('../../node_modules/object-assign/index.js');
import blockCollection from '../classes/blockItems';

let CHANGE_EVENT = 'change';

let clickedEdge               = null;
let portThatHasBeenClicked    = null;
let storingFirstPortClicked   = null;
let edgePreview               = null;
let previousMouseCoordsOnZoom = null;

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
  }

function checkIfAnyBlocksAreSelected()
  {
  let areAnyBlocksSelected = null;
  for (let block in blockSelectedStates)
    {
    if (blockSelectedStates[block] === true)
      {
      areAnyBlocksSelected = true;
      break;
      }
    else
      {
      //console.log("one of the blocks' state is false, check the next one if it is true");
      areAnyBlocksSelected = false;
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
  if (edgeSelectedStates[EdgeId] === undefined || null)
    {
    //console.log("edge selected state is undefined or null, best check it out...");
    }
  else
    {
    //console.log("that edge's state exists, hooray!");
    return edgeSelectedStates[EdgeId];
    }
  }

function checkIfAnyEdgesAreSelected()
  {
  let areAnyEdgesSelected;
  let i = 0;
  for (let edge in edgeSelectedStates)
    {
    i = i + 1;
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
  }

function updateEdgePreviewEndpoint(position)
  {
  edgePreview.endpointCoords.x = edgePreview.endpointCoords.x + (1 / graphZoomScale) * (position.x);
  edgePreview.endpointCoords.y = edgePreview.endpointCoords.y + (1 / graphZoomScale) * (position.y);
  //console.log(edgePreview.endpointCoords);
  }

class FlowChartStore extends EventEmitter {
constructor()
  {
  super();
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
  if (blockSelectedStates[BlockId] === undefined || null)
    {
    //console.log("that node doesn't exist in the nodeSelectedStates object, something's gone wrong...");
    //console.log(NodeId);
    //console.log(nodeSelectedStates[NodeId]);
    }
  else
    {
    //console.log("the state of that nod exists, passing it now");
    //console.log(nodeSelectedStates[NodeId]);
    return blockSelectedStates[BlockId];
    }
  }

getIfAnyBlocksAreSelected()
  {
  return checkIfAnyBlocksAreSelected();
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
  //console.log(`flowChartStore.onChangeBlockCollectionCallback(): items = ${items}`);
  let changed = false;

  for (let i = 0; i < items.length; i++)
    {
    let index     = items[i];
    let blockItem = blockCollection.getBlockItem(index);
    if (blockItem !== null)
      {
      if (blockItem.visible === true)
        {
        appendToBlockSelectedStates(blockItem.blockName());
        changed = true;
        }

      let isWidgetCombo = false;
      let isGroupInputs = false;

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
                else if (tags[j].indexOf('group:Inputs') !== -1)
                  {
                  isGroupInputs = true;
                  }
                else if (tags[j] === 'widget:toggle')
                  {
                  if (blockItem.visible)
                    {
                    appendToBlockSelectedStates(blockItem.blockName());
                    flowChartStore.emitChange();
                    }
                  else
                    {
                    removeBlock(blockItem.blockName());
                    flowChartStore.emitChange();
                    }

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
                if (attr.value.indexOf(defval) === -1)
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
                   get the value to be BITS.ZERO or POSITIONS.ZERO instead
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
      if (changed === true)
        {
        flowChartStore.emitChange(); // TODO: I think this should be outside the for loop - IG 20/12/16
        }
      }
    }
  }

}

const flowChartStore = new FlowChartStore();

//let blockStore = require('./blockStore');

flowChartStore.dispatchToken = AppDispatcher.register(function (payload)
{
let action = payload.action;
let item   = action.item;

//console.log(payload);
//console.log(item);

switch (action.actionType)
{

  case appConstants.SELECT_BLOCK:
    blockSelectedStates[item] = true;
    console.log(blockSelectedStates);
    flowChartStore.emitChange();
    break;

  case appConstants.DESELECT_ALLBLOCKS:
    deselectAllBlocks();
    flowChartStore.emitChange();
    break;

  case appConstants.SELECT_EDGE:
    let areAnyEdgesSelected = checkIfAnyEdgesAreSelected();
    //console.log(areAnyEdgesSelected);
    console.log(clickedEdge);
    if (areAnyEdgesSelected === true && item !== clickedEdge)
      {
      deselectAllEdges();
      selectEdge(item);
      }
    else if (areAnyEdgesSelected === false)
      {
      selectEdge(item);
      }
    console.log(edgeSelectedStates);
    flowChartStore.emitChange();
    break;

  case appConstants.DESELECT_ALLEDGES:
    deselectAllEdges();
    flowChartStore.emitChange();
    break;

  case appConstants.CHANGE_GRAPHPOSITION:
    graphPosition = item;
    flowChartStore.emitChange();
    break;

  case appConstants.GRAPH_ZOOM:
    graphZoomScale = item;
    flowChartStore.emitChange();
    break;

  case appConstants.GETANY_EDGESELECTEDSTATE:
    getAnyEdgeSelectedState(item);
    //console.log(edgeSelectedStates[item]);
    flowChartStore.emitChange();
    break;

  case appConstants.CLICKED_EDGE:
    clickedEdge = item;
    console.log(clickedEdge);
    flowChartStore.emitChange();
    break;

  case appConstants.PASS_PORTMOUSEDOWN:
    portThatHasBeenClicked = item;
    console.log(portThatHasBeenClicked);
    flowChartStore.emitChange();
    break;

  case appConstants.DESELECT_ALLPORTS:
    portThatHasBeenClicked = null;
    //console.log("portThatHasBeenClicked has been reset");
    flowChartStore.emitChange();
    break;

  case appConstants.STORING_FIRSTPORTCLICKED:
    storingFirstPortClicked = item;
    //console.log("storingFirstPortClicked is now: " + storingFirstPortClicked.id);
    flowChartStore.emitChange();
    break;

  case appConstants.ADD_EDGEPREVIEW:
    edgePreview = item;
    flowChartStore.emitChange();
    break;

  case appConstants.UPDATE_EDGEPREVIEWENDPOINT:
    updateEdgePreviewEndpoint(item);
    flowChartStore.emitChange();
    break;

  case appConstants.PREVIOUS_MOUSECOORDSONZOOM:
    previousMouseCoordsOnZoom = item;
    flowChartStore.emitChange();
    break;

  case appConstants.MALCOLM_GET_SUCCESS:
    break;

  case appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
    //console.info("flowChartStore malcolmSubscribe success",item.responseMessage);
    /* I need to have it listening to when any new edges are added
     via malcolm, currently I'm listening to the old appConstant:
     ADD_ONESINGLEEDGETOALLBLOCKINFO
     */
    //AppDispatcher.waitFor([blockCollection.dispatchToken]);

    break;


  default:
    return true
}

});

module.exports = flowChartStore;
