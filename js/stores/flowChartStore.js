/**
 * Created by twi18192 on 18/02/16.
 */

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var appConstants = require('../constants/appConstants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('../../node_modules/object-assign/index.js');

var CHANGE_EVENT = 'change';

var clickedEdge = null;
var portThatHasBeenClicked = null;
var storingFirstPortClicked = null;
var portMouseOver = false;
var edgePreview = null;
var previousMouseCoordsOnZoom = null;

var blockStyling = {
  outerRectangleHeight: 76,
  outerRectangleWidth: 72,
  innerRectangleHeight: 70,
  innerRectangleWidth: 66,
  portRadius: 2.5,
  portFill: 'grey',
};

var graphPosition = {
  x: 0,
  y: 0
};

var graphZoomScale = 2.0;

var blockSelectedStates = {

};

//var blockPositions = {
//
//};

//function interactJsDrag(BlockInfo){
//  //allNodeInfo[NodeInfo.target].position.x = allNodeInfo[NodeInfo.target].position.x + NodeInfo.x * (1 / graphZoomScale);
//  //allNodeInfo[NodeInfo.target].position.y = allNodeInfo[NodeInfo.target].position.y + NodeInfo.y * (1 / graphZoomScale);
//  //console.log(allNodeInfo[NodeInfo.target].position);
//
//  blockPositions[BlockInfo.target] = {
//    x: blockPositions[BlockInfo.target].x + BlockInfo.x * (1 / graphZoomScale),
//    y: blockPositions[BlockInfo.target].y + BlockInfo.y * (1 / graphZoomScale)
//  }
//}

//function appendToBlockPositions(BlockId, xCoord, yCoord){
//  blockPositions[BlockId] = {
//    //x: JSON.parse(JSON.stringify(generateRandomBlockPosition())) * 1/graphZoomScale,
//    //y: JSON.parse(JSON.stringify(generateRandomBlockPosition())) * 1/graphZoomScale,
//    x: xCoord * 1/graphZoomScale,
//    y: yCoord * 1/graphZoomScale
//  }
//}

function appendToBlockSelectedStates(BlockId){
  //console.log("blockSelectedStates before adding a new block:");
  blockSelectedStates[BlockId] = false;
  //console.log("blockSelectedStates after adding a new block:");
}

function removeBlock(blockId){
  /* Remove block from blockPositions */
  //delete blockPositions[blockId];

  /* Remove from blockSelectedStates */
  delete blockSelectedStates[blockId];
}

function generateRandomBlockPosition(){
  return Math.floor((Math.random() * 500) + 1)
}

function deselectAllBlocks(){
  for(var block in blockSelectedStates){
    blockSelectedStates[block] = false
  }
}

function checkIfAnyBlocksAreSelected(){
  var areAnyBlocksSelected = null;
  for(var block in blockSelectedStates){
    if(blockSelectedStates[block] === true){
      areAnyBlocksSelected = true;
      break;
    }
    else{
      //console.log("one of the blocks' state is false, check the next one if it is true");
      areAnyBlocksSelected = false;
    }
  }
  //console.log(areAnyNodesSelected);
  return areAnyBlocksSelected;
}

var edgeSelectedStates = {
  'Gate1outTGen1ena': false,
  //Gate1OutTGen1Ena: false,
  //TGen1PosnPComp1Posn: false,
  //TGen1PosnPComp1Ena: false
};

function appendToEdgeSelectedStates(EdgeId){
  edgeSelectedStates[EdgeId] = false;
}

function removeFromEdgeSelectedStates(EdgeId){
  delete edgeSelectedStates[EdgeId];
}

function selectEdge(Edge){
  edgeSelectedStates[Edge] = true;
}

function getAnyEdgeSelectedState(EdgeId){
  if(edgeSelectedStates[EdgeId] === undefined || null){
    //console.log("edge selected state is underfined or null, best check it out...");
  }
  else{
    //console.log("that edge's state exists, hooray!");
    return edgeSelectedStates[EdgeId];
  }
}

function checkIfAnyEdgesAreSelected(){
  var areAnyEdgesSelected;
  var i = 0;
  for(var edge in edgeSelectedStates){
    i = i + 1;
    if(edgeSelectedStates[edge] === true){
      //console.log(edgeSelectedStates[edge]);
      areAnyEdgesSelected = true;
      break;
    }
    else{
      areAnyEdgesSelected = false;
    }
  }
  //console.log(areAnyEdgesSelected);
  /* Taking care of if therer are no edges, so we return false instea dof undefined */
  if(i === 0){
    areAnyEdgesSelected = false;
  }

  return areAnyEdgesSelected;
}

function deselectAllEdges(){
  for(var edge in edgeSelectedStates){
    edgeSelectedStates[edge] = false
  }
}

function updateEdgePreviewEndpoint(position){
  edgePreview.endpointCoords.x = edgePreview.endpointCoords.x + (1/graphZoomScale)*(position.x);
  edgePreview.endpointCoords.y = edgePreview.endpointCoords.y + (1/graphZoomScale)*(position.y);
  //console.log(edgePreview.endpointCoords);
}






var flowChartStore = assign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb)
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb)
  },
  emitChange: function(){
    this.emit(CHANGE_EVENT)
  },



  /* FLOWCHART use */

  getAnyBlockSelectedState:function(BlockId){
    if(blockSelectedStates[BlockId] === undefined || null){
      //console.log("that node doesn't exist in the nodeSelectedStates object, something's gone wrong...");
      //console.log(NodeId);
      //console.log(nodeSelectedStates[NodeId]);
    }
    else{
      //console.log("the state of that nod exists, passing it now");
      //console.log(nodeSelectedStates[NodeId]);
      return blockSelectedStates[BlockId];
    }
  },
  getIfAnyBlocksAreSelected: function(){
    return checkIfAnyBlocksAreSelected();
  },
  getIfAnyEdgesAreSelected: function(){
    return checkIfAnyEdgesAreSelected();
  },

  getIfEdgeIsSelected: function(EdgeId){
    return getAnyEdgeSelectedState(EdgeId);
  },



  getGraphPosition: function(){
    return graphPosition;
  },
  getGraphZoomScale: function(){
    return graphZoomScale;
  },


  getPortThatHasBeenClicked: function(){
    return portThatHasBeenClicked;
  },
  getStoringFirstPortClicked: function(){
    return storingFirstPortClicked;
  },
  getPortMouseOver: function(){
    return portMouseOver;
  },


  getEdgePreview: function(){
    return edgePreview;
  },

  getBlockStyling: function(){
    return blockStyling;
  },

  //getBlockPositions: function(){
  //  return blockPositions;
  //}

});






//var blockStore = require('./blockStore');

flowChartStore.dispatchToken = AppDispatcher.register(function(payload){
  var action = payload.action;
  var item = action.item;

  console.log(payload);
  console.log(item);

  switch(action.actionType){

    /* Need to listen to adding/removing blocks & edges so that I can append
    to the appropriate state objects, ie, selected, position */
    case appConstants.ADDTO_ALLBLOCKINFO:
      //AppDispatcher.waitFor([blockStore.dispatchToken]); /* NO need for waitFor, I'm just listening to a single action over multiple stores! */
      //appendToBlockPositions(item);
      appendToBlockSelectedStates(item);
      flowChartStore.emitChange();
      break;

    /* Deleteing a block will go here at some point */

    //case appConstants.APPEND_EDGESELECTEDSTATE:
    //  edgeSelectedStates[item] = false;
    //  flowChartStore.emitChange();
    //  console.log(edgeSelectedStates);
    //  break;

    case appConstants.ADD_ONESINGLEEDGETOALLBLOCKINFO:
      appendToEdgeSelectedStates(item.edgeLabel);
      flowChartStore.emitChange();
      break;

    case appConstants.DELETE_EDGE:
      /* Delete edge from edge state function */
      removeFromEdgeSelectedStates(item.edgeId);
      flowChartStore.emitChange();
      break;




    //case appConstants.INTERACTJS_DRAG:
    //  interactJsDrag(item);
    //  console.log(blockPositions[item.target]);
    //  flowChartStore.emitChange();
    //  break;


    case appConstants.SELECT_BLOCK:
      blockSelectedStates[item] = true;
      console.log(blockSelectedStates);
      //changeUnselectedNodesOpacity();
      flowChartStore.emitChange();
      break;

    case appConstants.DESELECT_ALLBLOCKS:
      deselectAllBlocks();
      //console.log(nodeSelectedStates.Gate1);
      //console.log(nodeSelectedStates.TGen1);
      flowChartStore.emitChange();
      break;

    case appConstants.SELECT_EDGE:
      var areAnyEdgesSelected = checkIfAnyEdgesAreSelected();
      //console.log(areAnyEdgesSelected);
      console.log(clickedEdge);
      if(areAnyEdgesSelected === true && item !== clickedEdge){
        deselectAllEdges();
        selectEdge(item);
      }
      else if(areAnyEdgesSelected === false){
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

    /* WebAPI related stuff */

    //case appConstants.TEST_INITIALDATAFETCH_SUCCESS:
    //  //AppDispatcher.waitFor([blockStore.dispatchToken]);
    //  for(var block in item){
    //    appendToBlockPositions(block);
    //    appendToBlockSelectedStates(block);
    //  }
    //  //appendToBlockPositions('CLOCKS');
    //  //appendToBlockSelectedStates('CLOCKS');
    //  flowChartStore.emitChange();
    //  break;

    case appConstants.MALCOLM_GET_SUCCESS:
      //AppDispatcher.waitFor([blockStore.dispatchToken]);
      //for(var block in item){
      //  appendToBlockPositions(block);
      //  appendToBlockSelectedStates(block);
      //}
      //appendToBlockPositions('CLOCKS');
      //appendToBlockSelectedStates('CLOCKS');

      console.log("");

      for(var i = 0; i < item.responseMessage.tags.length; i++){
        /* No need to check the tags for if it's FlowGraph */
        //if(item.tags[i] === 'instance:FlowGraph'){
        //}
        if(item.responseMessage.tags[i] === 'instance:Zebra2Block'){
          var blockName = JSON.parse(JSON.stringify(item.responseMessage.name.slice(2)));
          //var xCoord = JSON.parse(JSON.stringify(item.attributes.X_COORD.value));
          //var yCoord = JSON.parse(JSON.stringify(item.attributes.Y_COORD.value));
          //console.log(xCoord);

          /* Check the block visibility attribute here
            ie, check the 'USE' attribute */

            if(item.responseMessage.attributes.VISIBLE.value === 'Show') {
            //appendToBlockPositions(blockName, xCoord, yCoord);
            appendToBlockSelectedStates(blockName);
          }
          else{
            console.log("block isn't in use, don't add its info");

            //appendToBlockPositions(blockName, xCoord, yCoord);
            //appendToBlockSelectedStates(blockName);
          }
        }
      }

      flowChartStore.emitChange();
      break;

    case appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
      console.log("flowChartStore malcolmSubscribe success");
      //if(item.requestedData.attribute === 'X_COORD' ||
      //  item.requestedData.attribute === 'Y_COORD'){
      //
      //  var responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
      //  var requestedData = JSON.parse(JSON.stringify(item.requestedData));
      //
      //  if(item.requestedData.attribute === 'X_COORD'){
      //    blockPositions[requestedData.blockName].x = responseMessage.value  * 1/graphZoomScale;
      //  }
      //  else if(item.requestedData.attribute === 'Y_COORD'){
      //    blockPositions[requestedData.blockName].y = responseMessage.value  * 1/graphZoomScale;
      //  }
      //
      //  //blockPositions[requestedData.blockName] = {
      //  //  x: responseMessage.value.X_COORD  * 1/graphZoomScale,
      //  //  y: responseMessage.value.Y_COORD * 1/graphZoomScale
      //  //}
      //
      //  /* The only time I want
      //  flowChart to emit a change
      //  due to a subscribe message
      //   */
      //  flowChartStore.emitChange();
      //
      //}

      for(var j = 0; j < item.responseMessage.tags.length; j++) {
        if(item.responseMessage.tags[j] === 'widget:toggle'){
          if(item.responseMessage.value === 'Show') {

            /* Trying to add a block when its visibility is
             changed to 'Show'
             Hmm, how do I also get the coords from Z?
             */
            //appendToBlockPositions(item.requestedData.attribute, graphPosition.x, graphPosition.y);
            appendToBlockSelectedStates(blockName);
            //console.log(blockPositions);
            flowChartStore.emitChange();
          }
          else if(item.responseMessage.value === 'Hide'){
            /* Causes a circular dependency! */
            //AppDispatcher.waitFor([blockStore.dispatchToken]);
            //setTimeout(function(){
            //  removeBlock(item.requestedData.attribute);
            //
            //}, 1000);
            //removeBlock(item.requestedData.attribute);
            flowChartStore.emitChange();
          }

        }
      }


      break;



    default:
      return true
  }

});

module.exports = flowChartStore;
