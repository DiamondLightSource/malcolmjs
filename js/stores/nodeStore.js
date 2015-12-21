/**
 * Created by twi18192 on 10/12/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var appConstants = require('../constants/appConstants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('../../node_modules/object-assign/index.js');

var CHANGE_EVENT = 'change';

var draggedElement = null;
var draggedElementID = null;
var nodesToRender = [];
var edgesToRender = [];
var clickedEdge = null;
var newlyAddedNode = null;

var nodeSelectedStates = {
  Gate1: false,
  TGen1: false,
  PComp1: false
};

function appendToNodeSelectedStates(NodeId){
  console.log("nodeSelectedStates before adding a new node:");
  console.log(nodeSelectedStates);
  nodeSelectedStates[NodeId] = false;
  console.log("nodeSelectedStates after adding a new node:");
  console.log(nodeSelectedStates);
}

function selectNode(Node){
  nodeSelectedStates[Node] = true;
}

function deselectAllNodes(){
  for(var node in nodeSelectedStates){
    nodeSelectedStates[node] = false
  }
  console.log(nodeSelectedStates);
}

//function changeUnselectedNodesOpacity(){
//    console.log(window.NodeContainerStyle);
//    window.NodeContainerStyle = {
//        'cursor': 'move',
//        'draggable': 'true',
//        'className': 'nodeContainer',
//        'opacity': 0.5
//    };
//    console.log(window.NodeContainerStyle);
//
//}

function checkIfAnyNodesAreSelected(){
  var areAnyNodesSelected = null;
  for(var node in nodeSelectedStates){
    if(nodeSelectedStates[node] === true){
      console.log(nodeSelectedStates[node]);
      areAnyNodesSelected = true;
      break;
    }
    else{
      //console.log("one of the nodes' state is false, check the next one if it is true");
      areAnyNodesSelected = false;
    }
  }
  //console.log(areAnyNodesSelected);
  return areAnyNodesSelected;
}

var edgeSelectedStates = {
  Gate1OutTGen1Ena: false,
  TGen1PosnPComp1Posn: false,
  TGen1PosnPComp1Ena: false
};

function selectEdge(Edge){
  edgeSelectedStates[Edge] = true;
}

function getAnyEdgeSelectedState(EdgeId){
  if(edgeSelectedStates[EdgeId] === undefined || null){
    console.log("edge selected state is underfined or null, best check it out...");
  }
  else{
    console.log("that edge's state exists, hooray!");
    return edgeSelectedStates[EdgeId];
  }
}

function checkIfAnyEdgesAreSelected(){
  var areAnyEdgesSelected = null;
  for(var edge in edgeSelectedStates){
    if(edgeSelectedStates[edge] === true){
      console.log(edgeSelectedStates[edge]);
      areAnyEdgesSelected = true;
      break;
    }
    else{
      areAnyEdgesSelected = false;
    }
  }
  console.log(areAnyEdgesSelected);
  return areAnyEdgesSelected;
}

function deselectAllEdges(){
  for(var edge in edgeSelectedStates){
    edgeSelectedStates[edge] = false
  }
  console.log(edgeSelectedStates);
}

var edges = {
  Gate1OutTGen1Ena: {
    fromNode: 'Gate1',
    fromNodeType: 'Gate',
    fromNodePort: 'out',
    toNode: 'TGen1',
    toNodeType: 'TGen',
    toNodePort: 'ena'
  },
  TGen1PosnPComp1Posn: {
    fromNode: 'TGen1',
    fromNodeType: 'TGen',
    fromNodePort: 'posn',
    toNode: 'PComp1',
    toNodeType: 'PComp',
    toNodePort: 'posn'
  },
  TGen1PosnPComp1Ena: {
    fromNode: 'TGen1',
    fromNodeType: 'TGen',
    fromNodePort: 'posn',
    toNode: 'PComp1',
    toNodeType: 'PComp',
    toNodePort: 'ena'
  },
  //Gate1OutPComp2Ena: {
  //  fromNode: 'Gate1',
  //  fromNodeType: 'Gate',
  //  fromNodePort: 'out',
  //  toNode: 'PComp2',
  //  toNodeType: 'PComp',
  //  toNodePort: 'ena'
  //}
};

var allNodeInfo = {

  'Gate1': {
    type: 'Gate',
    name: "Arm",
    position: {
      x: 50,
      y: 100,
    },
    inports: {
      "set": {
        connected: false,
        connectedTo: null
      }, /* connectedTo should probably be an array, since outports can be connected to multiple inports on different nodes */
      "reset": {
        connected: false,
        connectedTo: null
      }
    },
    outports: {
      "out": {
        connected: false,
        connectedTo: null
      }
    }
  },

  'TGen1': {
    type: 'TGen',
    name: '',
    position: {
      x: 450,
      y: 10
    },
    inports: {
      "ena": {
        connected: false,
        connectedTo: null
      }
    },
    outports: {
      "posn": {
        connected: false,
        connectedTo: null
      }
    }
  },
  'PComp1': {
    type: 'PComp',
    name: "LinePulse",
    position: {
      x: 650,
      y: 250,
    },
    inports: {
      'ena': {
        connected: false,
        connectedTo: null
      },
      'posn': {
        connected: false,
        connectedTo: null
      }
    },
    outports: {
      'act': {
        connected: false,
        connectedTo: null
      },
      'out': {
        connected: false,
        connectedTo: null
      },
      'pulse': {
        connected: false,
        connectedTo: null
      }
    }
  },
};

var nodeInfoTemplates = {
  'Gate': {
    type: 'Gate',
    name: "",
    position: {
      x: 900, /* Maybe have a random number generator generating an x and y coordinate? */
      y: 50,
    },
    inports: {
      "set": {
        connected: false,
        connectedTo: null
      }, /* connectedTo should probably be an array, since outports can be connected to multiple inports on different nodes */
      "reset": {
        connected: false,
        connectedTo: null
      }
    },
    outports: {
      "out": {
        connected: false,
        connectedTo: null
      }
    }
  },
  'PComp': {
    type: 'PComp',
    name: "",
    position: {
      x: null,
      y: null,
    },
    inports: {
      'ena': {
        connected: false,
        connectedTo: null
      },
      'posn': {
        connected: false,
        connectedTo: null
      }
    },
    outports: {
      'act': {
        connected: false,
        connectedTo: null
      },
      'out': {
        connected: false,
        connectedTo: null
      },
      'pulse': {
        connected: false,
        connectedTo: null
      }
    }
  },
  'TGen': {
    type: 'TGen',
    name: '',
    position: {
      x: null,
      y: null
    },
    inports: {
      "ena": {
        connected: false,
        connectedTo: null
      }
    },
    outports: {
      "posn": {
        connected: false,
        connectedTo: null
      }
    }
  },
  'LUT': {

  },
  'Pulse': {

  },
  'TTLOut': {

  },
  'EncIn': {

  }
};

function appendToAllNodeInfo(NodeInfo){
  //if(allNodeInfo[NodeInfo] === undefined || allNodeInfo[NodeInfo] === null){
  //
  //}
  var newGateId = generateNewNodeId();
  console.log(newGateId);
  allNodeInfo[newGateId] = nodeInfoTemplates.Gate;
  console.log(allNodeInfo);
  newlyAddedNode = allNodeInfo[newGateId];
  console.log(newlyAddedNode);
}

var nodeIdCounter = 1; /* Starting off at 1 since there's already a Gate1 */

function generateNewNodeId(){
  /* Do it for just a Gate node for now, remember, small steps before big steps! */
  nodeIdCounter += 1;
  var newGateId = "Gate" + nodeIdCounter;
  console.log(newGateId);
  return newGateId;
}

var nodePositions = {
  Gate1: {
    position: {
      x: 50,
      y: 100,
    },
    name: "Arm"
  },

  TGen1: {
    position: {
      x: 450,
      y: 10
    }
  },
  PComp1: {
    position: {
      x: 650,
      y: 250,
    },
    name: "LinePulse"
  },
  ////LUT1: {
  ////  x: 250,
  ////  y: 150
  ////}
  //PComp2: {
  //  position: {
  //    x: 250,
  //    y: 150
  //  },
  //  name: "FwdLineGate"
  //},
  //PComp3: {
  //  position: {
  //    x: 250,
  //    y: 350
  //  },
  //  name: "BwdLineGate"
  //}
};

function appendToNodePositions(NodeInfo){
  var nodePropertyName = function(){
    /* Get a string version of the node name (ie, Gate2, PComp3 etc) */
  };
  //nodePositions[nodePropertyName()] = NodeInfo;
}

var portPositionsForNodes = {
  portRadius: 2,
  inportPositionRatio: 0,
  outportPositionRatio: 1,
  GateNodePortStyling: {
    inportPositions: {
      set: {
        x: 6,
        y: 25
      },
      reset: {
        x: 6,
        y: 40
      }
    },
    outportPositions: {
      out: {
        x: 68 + 3,
        y: 33
      }
    }
  },
  TGenNodePortStyling: {
    inportPositions: {
      ena: {
        x: 6,
        y: 33
      }
    },
    outportPositions: {
      posn: {
        x: 68 + 3,
        y: 33
      }
    }
  }
};

var gateNodeInports = portPositionsForNodes.GateNodePortStyling.inportPositions;
var gateNodeOutports = portPositionsForNodes.GateNodePortStyling.outportPositions;
var tgenNodeInports = portPositionsForNodes.TGenNodePortStyling.inportPositions;
var tgenNodeOutports = portPositionsForNodes.TGenNodePortStyling.outportPositions;

function updateGate1Position(newCoordinates){
  /* Will be used to update the coordinates of a node when dragged, to then find the new location of the ports a connected edge needs to stick to */
  nodePositions.Gate1 = {
    x: nodePositions.Gate1.x + newCoordinates.x,
    y: nodePositions.Gate1.y + newCoordinates.y
  };
  /* Also need to update the port positions somehow! */
}

function updateNodePosition(NodeInfo){
  if(typeof allPossibleNodes[draggedElementID] !== 'function'){
    throw new Error('Invalid node id')
  }
  return allPossibleNodes[draggedElementID](NodeInfo)
}

var allPossibleNodes = {

  'Gate1': function(NodeInfo){
    allNodeInfo.Gate1.position = {
      x: allNodeInfo.Gate1.position.x + NodeInfo.x,
      y: allNodeInfo.Gate1.position.y + NodeInfo.y
    };
  },
  'TGen1': function(NodeInfo){
    allNodeInfo.TGen1.position = {
      x: allNodeInfo.TGen1.position.x + NodeInfo.x,
      y: allNodeInfo.TGen1.position.y + NodeInfo.y
    }
  },
  'PComp1': function(NodeInfo){
    allNodeInfo.PComp1.position = {
      x: allNodeInfo.PComp1.position.x + NodeInfo.x,
      y: allNodeInfo.PComp1.position.y + NodeInfo.y
    }
  },
  //'PComp2': function(NodeInfo) {
  //  allNodeInfo.PComp2.position = {
  //    x: allNodeInfo.PComp2.position.x + NodeInfo.x,
  //    y: allNodeInfo.PComp2.position.y + NodeInfo.y
  //  }
  //},
  //'PComp3': function(NodeInfo) {
  //  allNodeInfo.PComp3.position = {
  //    x: allNodeInfo.PComp3.position.x + NodeInfo.x,
  //    y: allNodeInfo.PComp3.position.y + NodeInfo.y
  //  }
  //}
};

var GateNodeStyling = {
  rectangle: {
    rectanglePosition: {
      x : 6,
      y : 2
    },
    rectangleStyling: {
      height: 65,
      width: 65,
      rx: 7,
      ry: 7
    }
  },
  ports: {
    portPositions: {
      inportPositions: {
        set: {
          x: 6,
          y: 25
        },
        reset: {
          x: 6,
          y: 40
        }
      },
      outportPositions: {
        out: {
          x: 71,
          y: 33
        }
      },
    },
    portStyling: {
      portRadius: 2,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 1.65
    }
  },
  text: {
    textPositions: {
      set: {
        x : 13,
        y: 26.5
      },
      reset: {
        x : 13,
        y: 44.5
      },
      out: {
        x: 48,
        y: 35.5
      }
    }
  }
};

var SelectedGateNodeStyling = {
  rectangle: {
    rectanglePosition: {
      x : 6,
      y : 2
    },
    rectangleStyling: {
      height: 65,
      width: 65,
      rx: 7,
      ry: 7
    }
  },
  ports: {
    portPositions: {
      inportPositions: {
        set: {
          x: 6,
          y: 25
        },
        reset: {
          x: 6,
          y: 40
        }
      },
      outportPositions: {
        out: {
          x: 71,
          y: 33
        }
      },
    },
    portStyling: {
      portRadius: 4,
      fill: 'lightgrey',
      stroke: 'black',
      strokeWidth: 1.65
    }
  },
  text: {
    textPositions: {
      set: {
        x : 15,
        y: 26.5
      },
      reset: {
        x : 15,
        y: 44.5
      },
      out: {
        x: 45,
        y: 35.5
      }
    }
  }
};

//var Gate1CurrentStyling = GateNodeStyling;
//
//function checkGate1Styling(){
//  if(nodeSelectedStates.Gate1 === true){
//    Gate1CurrentStyling = SelectedGateNodeStyling;
//  }
//  else{
//    Gate1CurrentStyling = GateNodeStyling
//  }
//  return Gate1CurrentStyling
//}

var TGenNodeStyling = {
  rectangle: {
    rectanglePosition: {
      x : 6,
      y : 2
    },
    rectangleStyling: {
      height: 65,
      width: 65,
      rx: 7,
      ry: 7
    }
  },
  ports: {
    portPositions: {
      inportPositions: {
        ena: {
          x: 6,
          y: 33
        }
      },
      outportPositions: {
        posn: {
          x: 71,
          y: 33
        }
      }
    },
    portStyling: {
      portRadius: 2,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 1.65
    }
  },
  text: {
    textPositions: {
      ena: {
        x : 10,
        y: 35.5
      },
      posn: {
        x: 43,
        y: 35.5
      }
    }
  }
};

var SelectedTGenNodeStyling = {
  rectangle: {
    rectanglePosition: {
      x : 6,
      y : 2
    },
    rectangleStyling: {
      height: 65,
      width: 65,
      rx: 7,
      ry: 7
    }
  },
  ports: {
    portPositions: {
      inportPositions: {
        ena: {
          x: 6,
          y: 33
        }
      },
      outportPositions: {
        posn: {
          x: 71,
          y: 33
        }
      }
    },
    portStyling: {
      portRadius: 4,
      fill: 'lightgrey',
      stroke: 'black',
      strokeWidth: 1.65
    }
  },
  text: {
    textPositions: {
      ena: {
        x : 12,
        y: 35.5
      },
      posn: {
        x: 41,
        y: 35.5
      }
    }
  }
};

var PCompNodeStyling = {
  rectangle: {
    rectanglePosition: {
      x : 6,
      y : 2
    },
    rectangleStyling: {
      height: 65,
      width: 65,
      rx: 7,
      ry: 7
    }
  },
  ports: {
    portPositions: {
      inportPositions: {
        ena: {
          x: 6,
          y: 25
        },
        posn: {
          x: 6,
          y: 40
        }
      },
      outportPositions: {
        act: {
          x: 71,
          y: 25
        },
        out: {
          x: 71,
          y: 33
        },
        pulse: {
          x: 71,
          y: 40
        }
      },
    },
    portStyling: {
      portRadius: 2,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 1.65
    }
  },
  text: {
    textPositions: {
      ena: {
        x : 13,
        y: 26.5
      },
      posn: {
        x : 13,
        y: 44.5
      },
      act: {
        x: 48,
        y: 25
      },
      out: {
        x: 48,
        y: 35.5
      },
      pulse: {
        x: 41,
        y: 45
      }
    }
  }
};

var SelectedPCompNodeStyling = {
  rectangle: {
    rectanglePosition: {
      x : 6,
      y : 2
    },
    rectangleStyling: {
      height: 65,
      width: 65,
      rx: 7,
      ry: 7
    }
  },
  ports: {
    portPositions: {
      inportPositions: {
        ena: {
          x: 6,
          y: 25
        },
        posn: {
          x: 6,
          y: 40
        }
      },
      outportPositions: {
        act: {
          x: 71,
          y: 25
        },
        out: {
          x: 71,
          y: 33
        },
        pulse: {
          x: 71,
          y: 40
        }
      },
    },
    portStyling: {
      portRadius: 4,
      fill: 'lightgrey',
      stroke: 'black',
      strokeWidth: 1.65
    }
  },
  text: {
    textPositions: {
      ena: {
        x : 15,
        y: 26.5
      },
      posn: {
        x : 15,
        y: 44.5
      },
      act: {
        x: 46,
        y: 25
      },
      out: {
        x: 46,
        y: 35.5
      },
      pulse: {
        x: 39,
        y: 45
      }
    }
  }
};

var allNodeTypesPortStyling = {
  'Gate': GateNodeStyling.ports.portPositions,
  'TGen': TGenNodeStyling.ports.portPositions,
  'PComp': PCompNodeStyling.ports.portPositions
};

var graphPosition = {
  x: 0,
  y: 0
};

var graphZoomScale = 1.2;

var nodeStore = assign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb)
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb)
  },
  emitChange: function(){
    this.emit(CHANGE_EVENT)
  },
  getGate1InportsState: function(){
    return allNodeInfo.Gate1.inports
  },
  getGate1OutportsState: function(){
    return allNodeInfo.Gate1.outports
  },
  getTGen1InportsState: function(){
    return allNodeInfo.TGen1.inports
  },
  getTGen1OutportsState: function(){
    return allNodeInfo.TGen1.outports
  },


  getGate1Position: function(){
    return nodePositions.Gate1.position;
  },
  getTGen1Position: function(){
    return nodePositions.TGen1.position;
  },
  getPComp1Position: function(){
    return nodePositions.PComp1.position;
  },
  getLUT1Position: function(){
    return nodePositions.LUT1;
  },
  getAllNodePositions: function(){
    return nodePositions;
  },
  getAllNodeInfo: function(){
    return allNodeInfo;
  },
  //getAnyNodePosition: function(NodeId){
  //  if(nodePositions[NodeId] === undefined || null){
  //    console.log("that node's position isn't here, something's gone wrong...");
  //    console.log(nodePositions);
  //  }
  //  else{
  //    console.log("here's that node's position!");
  //    console.log(nodePositions[NodeId]);
  //    return nodePositions[NodeId];
  //  }
  //},

  /* For edge use */
  //getGateNodeOutPort: function(){
  //    return portPositionsForEdges.gateNode.outports.out;
  //},
  //getTGenNodeEnaPort: function(){
  //    return portPositionsForEdges.tgenNode.inports.ena;
  //},
  getGateNodeOutportOut: function(){
    return gateNodeOutports.out;
  },
  getTGenNodeInportEna: function(){
    return tgenNodeInports.ena;
  },

  getAnyNodeSelectedState:function(NodeId){
    if(nodeSelectedStates[NodeId] === undefined || null){
      //console.log("that node doesn't exist in the nodeSelectedStates object, something's gone wrong...");
      //console.log(NodeId);
      //console.log(nodeSelectedStates[NodeId]);
    }
    else{
      //console.log("the state of that nod exists, passing it now");
      //console.log(nodeSelectedStates[NodeId]);
      return nodeSelectedStates[NodeId];
    }
  },
  getIfAnyNodesAreSelected: function(){
    return checkIfAnyNodesAreSelected();
  },
  getIfEdgeIsSelected: function(EdgeId){
    return getAnyEdgeSelectedState(EdgeId);
  },
  getIfAnyEdgesAreSelected: function(){
    return checkIfAnyEdgesAreSelected();
  },

  getDraggedElement: function(){
    return draggedElement;
  },


  getGateNodeStyling: function(){
    return GateNodeStyling;
  },
  getSelectedGateNodeStyling: function(){
    return SelectedGateNodeStyling;
  },
  getTGenNodeStyling: function(){
    return TGenNodeStyling;
  },
  getSelectedTGenNodeStyling: function(){
    return SelectedTGenNodeStyling;
  },
  getPCompNodeStyling: function(){
    return PCompNodeStyling;
  },
  getSelectedPCompNodeStyling: function(){
    return SelectedPCompNodeStyling;
  },
  getAllNodeTypesPortStyling: function(){
    return allNodeTypesPortStyling;
  },

  getGraphPosition: function(){
    return graphPosition;
  },
  getGraphZoomScale: function(){
    return graphZoomScale;
  },

  getAllEdges: function(){
    return edges;
  },
  getNodesToRenderArray: function(){
    return nodesToRender;
  },
  getEdgesToRenderArray: function(){
    return edgesToRender;
  },

  getNewlyAddedNode: function(){
    return newlyAddedNode;
  }
});

AppDispatcher.register(function(payload){
  var action = payload.action;
  var item = action.item;

  switch(action.actionType){

    case appConstants.GATENODE_CHANGEPOSITION:
      console.log(payload);
      console.log(action);
      updateGate1Position(item);
      nodeStore.emitChange();
      break;

    case appConstants.DRAGGED_ELEMENT:
      //console.log(payload);
      //console.log(item);
      draggedElement = item;
      //console.log(draggedElement);
      nodeStore.emitChange();
      break;


    case appConstants.DRAGGED_ELEMENTID:
      //console.log(payload);
      //console.log(action);
      draggedElementID = item;
      //console.log(draggedElementID);
      nodeStore.emitChange();
      break;

    case appConstants.CHANGE_NODEPOSITION:
      //console.log(payload);
      //console.log(item);
      updateNodePosition(item);
      nodeStore.emitChange();
      break;

    case appConstants.SELECT_NODE:
      console.log(payload);
      console.log(item);
      selectNode(item);
      console.log(nodeSelectedStates);
      //changeUnselectedNodesOpacity();
      nodeStore.emitChange();
      break;

    case appConstants.DESELECT_ALLNODES:
      console.log(payload);
      console.log(item);
      deselectAllNodes();
      console.log(nodeSelectedStates.Gate1);
      console.log(nodeSelectedStates.TGen1);
      nodeStore.emitChange();
      break;

    case appConstants.SELECT_EDGE:
      console.log(payload);
      console.log(item);
      var areAnyEdgesSelected = checkIfAnyEdgesAreSelected();
      console.log(areAnyEdgesSelected);
      console.log(clickedEdge);
      if(areAnyEdgesSelected === true && item !== clickedEdge){
        deselectAllEdges();
        selectEdge(item);
      }
      else if(areAnyEdgesSelected === false){
        selectEdge(item);
      }
      console.log(edgeSelectedStates);
      nodeStore.emitChange();
      break;

    case appConstants.DESELECT_ALLEDGES:
      console.log(payload);
      console.log(item);
      deselectAllEdges();
      nodeStore.emitChange();
      break;

    case appConstants.CHANGE_GRAPHPOSITION:
      //console.log(payload);
      //console.log(item);
      graphPosition = item;
      nodeStore.emitChange();
      break;

    //case appConstants.CHANGE_GATE1STYLING:
    //    console.log(payload);
    //    console.log(item);
    //    checkGate1Styling();
    //    nodeStore.emitChange();
    //    break;

    case appConstants.GRAPH_ZOOM:
      //console.log(payload);
      //console.log(item);
      graphZoomScale = item;
      nodeStore.emitChange();
      break;

    case appConstants.PUSH_NODETOARRAY:
      console.log(payload);
      console.log(item);
      nodesToRender.push(item);
      console.log(nodesToRender);
      nodeStore.emitChange();
      break;

    case appConstants.PUSH_EDGETOARRAY:
      console.log(payload);
      console.log(item);
      edgesToRender.push(item);
      console.log(edgesToRender);
      nodeStore.emitChange();
      break;

    case appConstants.GETANY_EDGESELECTEDSTATE:
      console.log(payload);
      console.log(item);
      getAnyEdgeSelectedState(item);
      console.log(edgeSelectedStates[item]);
      nodeStore.emitChange();
      break;

    case appConstants.CLICKED_EDGE:
      console.log(payload);
      console.log(item);
      clickedEdge = item;
      console.log(clickedEdge);
      nodeStore.emitChange();
      break;

    case appConstants.ADDTO_ALLNODEINFO:
      console.log(payload);
      console.log(item);
      appendToAllNodeInfo();
      nodeStore.emitChange();
      break;

    default:
      return true
  }

});

module.exports = nodeStore;


/* Port calculation to render the edges properly has been moved to the render function of an edge;
 this is to allow constant rerendering due to node position changes
 */

//var portPositionsForEdges = {
//    gateNode: {
//        inports: {
//            set: {
//                x: nodePositions.gateNode.x + gateNodeInports.set.x,
//                y: nodePositions.gateNode.y + gateNodeInports.set.y
//            },
//            reset: {
//                x: nodePositions.gateNode.x + gateNodeInports.reset.x,
//                y: nodePositions.gateNode.y + gateNodeInports.reset.y
//            }
//        },
//        outports: {
//            out: {
//                x: nodePositions.gateNode.x + gateNodeOutports.out.x,
//                y: nodePositions.gateNode.y + gateNodeOutports.out.y
//            }
//        }
//    },
//    tgenNode: {
//        inports: {
//            ena: {
//                x: nodePositions.tgenNode.x + tgenNodeInports.ena.x,
//                y: nodePositions.tgenNode.y + tgenNodeInports.ena.y
//            }
//        },
//        outports: {
//            posn: {
//                x: nodePositions.tgenNode.x + tgenNodeOutports.posn.x,
//                y: nodePositions.tgenNode.y + tgenNodeOutports.posn.y
//            }
//        }
//    }
//
//};

//getGate1SelectedState: function(){
//  return nodeSelectedStates.Gate1;
//},
//getTGen1SelectedState: function(){
//  return nodeSelectedStates.TGen1;
//},
//getPComp1SelectedState: function(){
//  return nodeSelectedStates.PComp1;
//},

//getGate1CurrentStyling: function(){
//  return checkGate1Styling();
//},
