/**
 * Created by twi18192 on 18/02/16.
 */

let AppDispatcher = require('../dispatcher/appDispatcher.js');
let appConstants  = require('../constants/appConstants.js');
let EventEmitter  = require('events').EventEmitter;
let assign        = require('../../node_modules/object-assign/index.js');

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
    //console.log("edge selected state is underfined or null, best check it out...");
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
  /* Taking care of if therer are no edges, so we return false instea dof undefined */
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


let flowChartStore = assign({}, EventEmitter.prototype, {
  addChangeListener   : function (cb)
    {
    this.on(CHANGE_EVENT, cb)
    },
  removeChangeListener: function (cb)
    {
    this.removeListener(CHANGE_EVENT, cb)
    },
  emitChange          : function ()
    {
    this.emit(CHANGE_EVENT)
    },


  /* FLOWCHART use */

  getAnyBlockSelectedState : function (BlockId)
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
    },
  getIfAnyBlocksAreSelected: function ()
    {
    return checkIfAnyBlocksAreSelected();
    },
  getIfAnyEdgesAreSelected : function ()
    {
    return checkIfAnyEdgesAreSelected();
    },

  getIfEdgeIsSelected: function (EdgeId)
    {
    return getAnyEdgeSelectedState(EdgeId);
    },


  getGraphPosition : function ()
    {
    return graphPosition;
    },
  getGraphZoomScale: function ()
    {
    return graphZoomScale;
    },


  getPortThatHasBeenClicked : function ()
    {
    return portThatHasBeenClicked;
    },
  getStoringFirstPortClicked: function ()
    {
    return storingFirstPortClicked;
    },

  getEdgePreview: function ()
    {
    return edgePreview;
    },

  getBlockStyling: function ()
    {
    return blockStyling;
    },

});


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
    console.log(edgeSelectedStates[item]);
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
    console.log("portThatHasBeenClicked has been reset");
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

    //console.log('flowStore MALCOLM_GET_SUCCESS: item.responseMessage:');
    //console.log(item.responseMessage);

    // Determine whether the GET notification is in response to:
    // Top level item list or individual item attributes.
    // The top level case will have a 'layout' attribute.
    if (item.responseMessage.hasOwnProperty('layout'))
      {
      for (let i = 0; i < item.responseMessage.layout.value.name.length; i++)
        {
        let blockName = item.responseMessage.layout.value.name[i];

        /* Check the block visibility attribute here
         ie, check the 'USE' attribute */

        if (item.responseMessage.layout.value.visible[i] === true)
          {
          appendToBlockSelectedStates(blockName);
          flowChartStore.emitChange();
          }
        else
          {
          //console.log("block isn't in use, don't add its info");
          }
        }
      }

    break;

  case appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
    console.log("flowChartStore malcolmSubscribe success");
    /* I need to have it listening to when any new edges are added
     via malcolm, currently I'm listening to the old appConstant:
     ADD_ONESINGLEEDGETOALLBLOCKINFO
     */

    let isWidgetCombo = false;
    let isGroupInputs = false;

    if (item.responseMessage.tags !== undefined)
      {
      for (let j = 0; j < item.responseMessage.tags.length; j++)
        {
        if (item.responseMessage.tags[j].indexOf('widget:combo') !== -1)
          {
          isWidgetCombo = true;
          }
        else if (item.responseMessage.tags[j].indexOf('group:Inputs') !== -1)
          {
          isGroupInputs = true;
          }
        else if (item.responseMessage.tags[j] === 'widget:toggle')
          {
          if (item.responseMessage.value === 'Show')
            {
            if (item.requestedData.blockName === 'VISIBILITY')
              {
              appendToBlockSelectedStates(item.requestedData.attribute);
              }
            else if (item.requestedData.blockName !== 'VISIBILITY')
              {
              appendToBlockSelectedStates(item.requestedData.blockName);
              }
            flowChartStore.emitChange();
            }
          else if (item.responseMessage.value === 'Hide')
            {
            if (item.requestedData.blockName === 'VISIBILITY')
              {
              removeBlock(item.requestedData.attribute);
              }
            else if (item.requestedData.blockName !== 'VISIBILITY')
              {
              removeBlock(item.requestedData.blockName);
              }
            flowChartStore.emitChange();
            }

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

      let responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
      let requestedData   = JSON.parse(JSON.stringify(item.requestedData));

      if (responseMessage.value !== 'BITS.ZERO' &&
        responseMessage.value !== 'POSITIONS.ZERO')
        {

        /* edgeLabelFirstHalf is the outport block and the
         outport block port names put together
         */
        let edgeLabelFirstHalf = responseMessage.value.replace(/\./g, "");

        /* edgeLabelSecondHalf is the inport block and the
         inport block port names put together
         */
        let edgeLabelSecondHalf = requestedData.blockName + requestedData.attribute;
        let edgeLabel           = edgeLabelFirstHalf + edgeLabelSecondHalf;

        appendToEdgeSelectedStates(edgeLabel);
        }
      else if (responseMessage.value === 'BITS.ZERO' ||
        responseMessage.value === 'POSITIONS.ZERO')
        {

        /* I know what inport and what inport block the edge was
         connected to, but I don't know what outport or what
         outport block the edge was connected to, since you
         get the value to be BITS.ZERO or POSITIONS.ZERO instead
         of what it was connected to before...
         */

        let edgeLabelToDelete;

        let edgeLabelSecondHalf = requestedData.blockName + requestedData.attribute;

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

        console.log(edgeSelectedStates);

        }
      }


    break;


  default:
    return true
}

});

module.exports = flowChartStore;
