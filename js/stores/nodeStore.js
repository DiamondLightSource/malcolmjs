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
var portThatHasBeenClicked = null;
var storingFirstPortClicked = null;
var newlyCreatedEdgeLabel = null;
var portMouseOver = false;

function portMouseOverLeaveToggle(){
  if(portMouseOver === false){
    portMouseOver = true;
  }
  else if(portMouseOver === true){
    portMouseOver = false;
  }
  else{
    console.log("portMouseOver is neither true nor false, so something is up");
  }
}

var allNodeTabInfo = {
  'Gate1': {
    type: 'Gate',
    label: 'Gate1',
    description: 'SR Gate block',
    inports: [
      {'name': 'set', 'type': 'boolean'},
      {'name': 'reset', 'type': 'boolean'},
    ],
    outports: [
      {'name': 'out', 'type': 'boolean'}
    ]
  },
  'TGen1': {
    type: 'TGen',
    label: 'TGen1',
    description: 'Time Generator block',
    inports: [
      {'name': 'ena', 'type': 'boolean'}
    ],
    outports: [
      {'name': 'posn', 'type': 'int'}
    ]
  },
  'PComp1': {
    type: 'PComp',
    label: 'PComp1',
    description: 'Position compare block',
    inports: [
      {'name': 'ena', 'type': 'boolean'},
      {'name': 'posn', 'type': 'int'},
    ],
    outports: [
      {'name': 'act', 'type': 'boolean'},
      {'name': 'pulse', 'type': 'boolean'}
    ]
  }
};

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
  //Gate1OutTGen1Ena: false,
  //TGen1PosnPComp1Posn: false,
  //TGen1PosnPComp1Ena: false
};

function appendToEdgeSelectedStates(EdgeId){
  edgeSelectedStates[EdgeId] = false;
  console.log("edgeSelectedStates is now:");
  console.log(edgeSelectedStates);
}

function selectEdge(Edge){
  edgeSelectedStates[Edge] = true;
}

function getAnyEdgeSelectedState(EdgeId){
  if(edgeSelectedStates[EdgeId] === undefined || null){
    console.log("edge selected state is underfined or null, best check it out...");
  }
  else{
    console.log("that edge's state exists, hooray!");
    console.log(edgeSelectedStates[EdgeId]);
    return edgeSelectedStates[EdgeId];
  }
}

function checkIfAnyEdgesAreSelected(){
  var areAnyEdgesSelected = null;
  for(var edge in edgeSelectedStates){
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
  return areAnyEdgesSelected;
}

function deselectAllEdges(){
  for(var edge in edgeSelectedStates){
    edgeSelectedStates[edge] = false
  }
  console.log(edgeSelectedStates);
}

var edges = {
  //Gate1OutTGen1Ena: {
  //  fromNode: 'Gate1',
  //  fromNodeType: 'Gate',
  //  fromNodePort: 'out',
  //  toNode: 'TGen1',
  //  toNodeType: 'TGen',
  //  toNodePort: 'ena'
  //},
  //TGen1PosnPComp1Posn: {
  //  fromNode: 'TGen1',
  //  fromNodeType: 'TGen',
  //  fromNodePort: 'posn',
  //  toNode: 'PComp1',
  //  toNodeType: 'PComp',
  //  toNodePort: 'posn'
  //},
  //TGen1PosnPComp1Ena: {
  //  fromNode: 'TGen1',
  //  fromNodeType: 'TGen',
  //  fromNodePort: 'posn',
  //  toNode: 'PComp1',
  //  toNodeType: 'PComp',
  //  toNodePort: 'ena'
  //},
  //Gate1OutPComp2Ena: {
  //  fromNode: 'Gate1',
  //  fromNodeType: 'Gate',
  //  fromNodePort: 'out',
  //  toNode: 'PComp2',
  //  toNodeType: 'PComp',
  //  toNodePort: 'ena'
  //}
};

/* NOTE: This function is currently just adding all edges that are there on INITIAL RENDER, so if I run it after initial render it'll go through all the nodes and their outports again... */

function addToEdgesObject(){
  for(var node in allNodeInfo){
    /* Look at outports of each node and see which ones are connected, and what exactly they are conencted to */
    for(i = 0; i < allNodeInfo[node].outports.length; i++){
      console.log(i);
      console.log(allNodeInfo[node].outports[i]);
      if(allNodeInfo[node].outports[i].connected === true){
        console.log("The outport " + allNodeInfo[node].outports[i].name + " of node " + node + " is connected, here are the inport(s) it is connected to:");
        for(j = 0; j < allNodeInfo[node].outports[i].connectedTo.length; j++){
          console.log(allNodeInfo[node].outports[i].connectedTo[j]);
          console.log("node: " + allNodeInfo[node].outports[i].connectedTo[j].node);
          console.log("port: " + allNodeInfo[node].outports[i].connectedTo[j].port);
          var newEdge = {
            fromNode: node,
            fromNodeType: allNodeInfo[node].type,
            fromNodePort: allNodeInfo[node].outports[i].name,
            toNode: allNodeInfo[node].outports[i].connectedTo[j].node,
            toNodeType: allNodeInfo[allNodeInfo[node].outports[i].connectedTo[j].node].type,
            toNodePort: allNodeInfo[node].outports[i].connectedTo[j].port
          };
          console.log(newEdge);
          /* Then here I need to add this new edge to the edges object */
          var newEdgeLabel = String(newEdge.fromNode) + String(newEdge.fromNodePort) + " -> " + String(newEdge.toNode) + String(newEdge.toNodePort);
          newlyCreatedEdgeLabel = newEdgeLabel;
          console.log(newlyCreatedEdgeLabel);
          console.log("The newEdge's label is " + newEdgeLabel);
          edges[newEdgeLabel] = newEdge;
          console.log(edges);
          /* Also need to add the selected states to edgeSelectedStates! */

          edgeSelectedStates[newEdgeLabel] = false;
          console.log(edgeSelectedStates);
        }
      }
      else{
        console.log("The outport " + allNodeInfo[node].outports[i].name + " of node " + node + " isn't connected to any inports, move onto the next outport");
      }
    }
  }
}

var nodeLibrary = {
  Gate: {
    name: 'Gate',
    description: 'SR Gate block',
    icon: 'play-circle',
    inports: [
      {'name': 'set', 'type': 'boolean'},
      {'name': 'reset', 'type': 'boolean'},
    ],
    outports: [
      {'name': 'out', 'type': 'boolean'}
    ]
  },
  EncIn: {
    name: 'EncIn',
    description: 'Encoder Input block',
    icon: 'cogs',
    inports: [
    ],
    outports: [
      {'name': 'a', 'type': 'boolean'},
      {'name': 'b', 'type': 'boolean'},
      {'name': 'z', 'type': 'boolean'},
      {'name': 'conn', 'type': 'boolean'},
      {'name': 'posn', 'type': 'int'}
    ]
  },
  PComp: {
    name: 'PComp',
    description: 'Position compare block',
    icon: 'compass',
    inports: [
      {'name': 'ena', 'type': 'boolean'},
      {'name': 'posn', 'type': 'int'},
    ],
    outports: [
      {'name': 'act', 'type': 'boolean'},
      {'name': 'pulse', 'type': 'boolean'}
    ]
  },
  TGen: {
    name: 'TGen',
    description: 'Time Generator block',
    icon: 'clock-o',
    inports: [
      {'name': 'ena', 'type': 'boolean'}
    ],
    outports: [
      {'name': 'posn', 'type': 'int'}
    ]
  },
  LUT: {
    name: 'LUT',
    description: 'Look up Table block',
    icon: 'stop',
    inports: [
      {'name': 'inpa', 'type': 'boolean'},
      {'name': 'inpb', 'type': 'boolean'},
      {'name': 'inpc', 'type': 'boolean'},
      {'name': 'inpd', 'type': 'boolean'},
      {'name': 'inpe', 'type': 'boolean'}
    ],
    outports: [
      {'name': 'out', 'type': 'boolean'}
    ]
  },
  Pulse: {
    name: 'Pulse',
    description: 'Pulse Generator block',
    icon: 'bolt',
    inports: [
      {'name': 'inp', 'type': 'boolean'},
      {'name': 'reset', 'type': 'boolean'}
    ],
    outports: [
      {'name': 'out', 'type': 'boolean'},
      {'name': 'err', 'type': 'boolean'}
    ]
  },
  TTLOut: {
    name: 'TTLOut',
    description: 'TTL Output block',
    icon: 'toggle-on',
    inports: [
      {'name': 'val', 'type': 'boolean'}
    ],
    outports: [
    ]
  },
  PCap: {
    name: 'PCap',
    description: 'Position capture block',
    icon: 'bar-chart',
    inports: [
      {'name': 'ena', 'type': 'boolean'},
      {'name': 'trig', 'type': 'boolean'}
    ],
    outports: [
    ]
  }
};

function addOneSingleEdge(edgeLabel, edgeInfo){
  edges[edgeLabel] = edgeInfo;
}

//function addOneEdgeToEdgesObject(edgeInfo, portTypes){
//  /* I guess it could get messy now, since 'fromNode' before this meant 'the node that was clicked on first', but now I want it to mean the beginning node; ie, the node from which the port type is out */
//
//  var startNode;
//  var startNodePort;
//  var endNode;
//  var endNodePort;
//  var newEdge;
//  var edgeLabel;
//  if(portTypes.fromNodePortType === "outport"){
//    console.log("outport to inport, so edge labelling is normal");
//    startNode = edgeInfo.fromNode;
//    startNodePort = edgeInfo.fromNodePort;
//    endNode = edgeInfo.toNode;
//    endNodePort = edgeInfo.toNodePort;
//    //newEdge = {
//    //  fromNode: startNode,
//    //  fromNodePort: startNodePort,
//    //  toNode: endNode,
//    //  toNodePort: endNodePort
//    //}
//  }
//  else if(portTypes.fromNodePortType === "inport"){
//    console.log("inport to outport, so have to flip the edge labelling direction");
//    /* Note that you must also flip the ports too! */
//    startNode = edgeInfo.toNode;
//    startNodePort = edgeInfo.toNode;
//    endNode = edgeInfo.fromNode;
//    endNodePort = edgeInfo.fromNodePort;
//    /* Don't need this in both loops, can just set this after the loops have completed! */
//    //newEdge = {
//    //  fromNode: startNode,
//    //  fromNodePort: startNodePort,
//    //  toNode: endNode,
//    //  toNodePort: endNodePort
//    //}
//  }
//
//  newEdge = {
//    fromNode: startNode,
//    fromNodePort: startNodePort,
//    toNode: endNode,
//    toNodePort: endNodePort
//  };
//
//  edgeLabel = String(newEdge.fromNode) + String(newEdge.fromNodePort) + " -> " + String(newEdge.toNode) + String(newEdge.toNodePort);
//
//  console.log("The newEdge's label is " + edgeLabel);
//  newlyCreatedEdgeLabel = edgeLabel;
//  edges[edgeLabel] = newEdge;
//  console.log(edges);
//
//  /* Also need to add the selected states to edgeSelectedStates! */
//
//  edgeSelectedStates[edgeLabel] = false;
//
//
//}

//function checkPortCompatibility(edgeInfo){
//  /* First need to check we have an inport and an outport */
//  /* Find both port types, then compare them somehow */
//
//  var fromNodeType = allNodeInfo[edgeInfo.fromNode].type;
//  var toNodeType = allNodeInfo[edgeInfo.toNode].type;
//
//  var fromNodeLibraryInfo = nodeLibrary[fromNodeType];
//  var toNodeLibraryInfo = nodeLibrary[toNodeType];
//
//  for(i = 0; i < fromNodeLibraryInfo.inports.length; i++){
//    if(fromNodeLibraryInfo.inports[i].name === edgeInfo.fromNodePort){
//      console.log("The fromNode is an inport:" + edgeInfo.fromNodePort);
//      var fromNodePortType = "inport";
//    }
//    else{
//      console.log("The fromNode isn't an inport, so it's an outport, so no need to check the outports!");
//      var fromNodePortType = "outport";
//    }
//  }
//
//  for(j = 0; j < toNodeLibraryInfo.inports.length; j++ ){
//    if(toNodeLibraryInfo.inports[j].name === edgeInfo.toNodePort){
//      console.log("The toNode is an inport: " + edgeInfo.toNodePort);
//      var toNodePortType = "inport";
//    }
//    else{
//      console.log("The toNode isn't an inport, so it's an outport!");
//      var toNodePortType = "outport";
//    }
//  }
//
//  /* Time to compare the fromNodePortType and toNodePortType */
//
//  if(fromNodeType === toNodePortType){
//    console.log("The fromNode and toNode ports are both " + fromNodePortType + "s, so can't connect them");
//    window.alert("Incompatible ports");
//    /* Hence, don't add anything to allNodeInfo */
//  }
//  else if(fromNodePortType !== toNodePortType){
//    console.log("fromNodePortType is " + fromNodePortType + ", and toNodePortType is " + toNodePortType + ", so so far this connection is valid. Check if the ports themselves are compatible.");
//    /* So, for now, just run the function that adds to allNodeInfo, but there will be more checks here, or perhaps a separate function to check for further port compatibility */
//    addEdgeToAllNodeInfo(edgeInfo);
//
//    /* Also need the equivalent of addToEdgesObject for single edges here! */
//    /* Now, the point of this was also to find if the fromNode was an inport or outport:
//    if it's an outport then it's a normal connection from an out to an in,
//    but if it's an inport, then it's a connection from a in to and out (ie, the other way around), so somehow need to compensate for that!
//     */
//
//    var portTypes = {
//      fromNodePortType: fromNodePortType,
//      toNodePortType: toNodePortType
//    };
//
//    addOneEdgeToEdgesObject(edgeInfo, portTypes);
//  }
//
//}

function createNewEdgeLabel(edgeInfo){
  var newEdge = edgeInfo;
  var newEdgeLabel = String(newEdge.fromNode) + String(newEdge.fromNodePort) + " -> " + String(newEdge.toNode) + String(newEdge.toNodePort);
  newlyCreatedEdgeLabel = newEdgeLabel;
}

//function addNewEdge(EdgeInfo){
//  var newEdge = EdgeInfo;
//  var fromNode = newEdge.fromNode;
//  var toNode = newEdge.toNode;
//  newEdge['fromNodeType'] = allNodeInfo[fromNode].type;
//  newEdge['toNodeType'] = allNodeInfo[toNode].type;
//  console.log(newEdge);
//
//  //var newEdgeLabel = String(newEdge.fromNode) + String(newEdge.fromNodePort) + " -> " + String(newEdge.toNode) + String(newEdge.toNodePort);
//
//  //newlyCreatedEdgeLabel = newEdgeLabel;
//  console.log("The newEdge's label is " + newlyCreatedEdgeLabel);
//  edges[newlyCreatedEdgeLabel] = newEdge;
//  console.log(edges);
//
//}

var allNodeInfo = {

  'Gate1': {
    type: 'Gate',
    label: 'Gate1',
    name: "Arm",
    position: {
      x: 50,
      y: 100,
    },
    //inports: {
    //  "set": {
    //    connected: false,
    //    connectedTo: null
    //  }, /* connectedTo should probably be an array, since outports can be connected to multiple inports on different nodes */
    //  "reset": {
    //    connected: false,
    //    connectedTo: null
    //  }
    //},
    //outports: {
    //  "out": {
    //    connected: false,
    //    connectedTo: null
    //  }
    //}
    inports: [
      {
        name: 'set',
        connected: false,
        connectedTo: null
      },
      {
        name: 'reset',
        connected: false,
        connectedTo: null
      }
    ],
    outports: [
      {
        name: 'out',
        connected: true,
        connectedTo: [
          {
            node: 'TGen1',
            port: 'ena'
          }
        ]
      }
    ]
  },

  'TGen1': {
    type: 'TGen',
    label: 'TGen1',
    name: '',
    position: {
      x: 250,
      y: 10
    },
    //inports: {
    //  "ena": {
    //    connected: false,
    //    connectedTo: null
    //  }
    //},
    //outports: {
    //  "posn": {
    //    connected: false,
    //    connectedTo: null
    //  }
    //}
    inports: [
      {
        name: 'ena',
        connected: true,
        connectedTo: {
          node: 'Gate1',
          port: 'out'
        }
      }
    ],
    outports: [
      {
        name: 'posn',
        connected: false,
        connectedTo:[]
      }
    ]
  },
  'PComp1': {
    type: 'PComp',
    label: 'PComp1',
    name: "LinePulse",
    position: {
      x: 350,
      y: 150,
    },
    //inports: {
    //  'ena': {
    //    connected: false,
    //    connectedTo: null
    //  },
    //  'posn': {
    //    connected: false,
    //    connectedTo: null
    //  }
    //},
    //outports: {
    //  'act': {
    //    connected: false,
    //    connectedTo: null
    //  },
    //  'out': {
    //    connected: false,
    //    connectedTo: null
    //  },
    //  'pulse': {
    //    connected: false,
    //    connectedTo: null
    //  }
    //}
    inports: [
      {
        name: 'ena',
        connected: false,
        connectedTo: null
      },
      {
        name: 'posn',
        connected: false,
        connectedTo: null
      }
    ],
    outports: [
      {
        name: 'act',
        connected: false,
        connectedTo: []
      },
      {
        name: 'out',
        connected: false,
        connectedTo: []
      },
      {
        name: 'pulse',
        connected: false,
        connectedTo: []
      }
    ]
  },
};

function addEdgeToAllNodeInfo(Info){

  /* QUESTION: do I need a loop here, can I just use bracket notation to access the required port directly? */

  for(i = 0; i < allNodeInfo[Info.fromNode].outports.length; i++){
    if(allNodeInfo[Info.fromNode].outports[i].name === Info.fromNodePort){
      var newEdgeToFromNode = {
        node: Info.toNode,
        port: Info.toNodePort
      };
      console.log(newEdgeToFromNode);
      allNodeInfo[Info.fromNode].outports[i].connected = true;
      console.log(allNodeInfo[Info.fromNode].outports[i]);
      allNodeInfo[Info.fromNode].outports[i].connectedTo.push(newEdgeToFromNode);
    }
  }
  /* Also need to add to the node whose inport we've connected that outport to! */

  for(j = 0; j < allNodeInfo[Info.toNode].inports.length; j++){
    if(allNodeInfo[Info.toNode].inports[j].name === Info.toNodePort){
      var newEdgeToToNode = {
        node: Info.fromNode,
        port: Info.fromNodePort
      };
      console.log(newEdgeToToNode);
      allNodeInfo[Info.toNode].inports[j].connected = true;

      /* Hmm, this'll then REPLACE the previous edge if it exists, it should really check if it's already connected before replacing the object */
      allNodeInfo[Info.toNode].inports[j].connectedTo = newEdgeToToNode;
    }
  }
}

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
  /* This was for when I was generating the new gateNode id in the store rather than in theGraphDiamond */
  //var newGateId = generateNewNodeId();
  //console.log(newGateId);
  //allNodeInfo[newGateId] = nodeInfoTemplates.Gate;
  //console.log(allNodeInfo);
  //newlyAddedNode = allNodeInfo[newGateId];
  //console.log(newlyAddedNode);
  console.log(NodeInfo);
  //allNodeInfo[NodeInfo] = nodeInfoTemplates.Gate;
  allNodeInfo[NodeInfo] = {
    type: 'Gate',
    name: "",
    position: {
      x: 400, /* Maybe have a random number generator generating an x and y coordinate? */
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
  };

  /* Trying to use a for loop to copy over the template */
  //for(var property in nodeInfoTemplates.Gate){
  //  console.log(NodeInfo);
  //  console.log(allNodeInfo);
  //
  //  allNodeInfo[NodeInfo][property] = nodeInfoTemplates.Gate[property];
  //}
  console.log(nodeInfoTemplates.Gate);
  //allNodeInfo[NodeInfo].position.x = randomNodePositionGenerator();
  //allNodeInfo[NodeInfo].position.y = randomNodePositionGenerator();
  //console.log(randomNodePositionGenerator());
  //console.log(randomNodePositionGenerator());
  console.log(allNodeInfo);
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

function interactJsDrag(NodeInfo){
  //allNodeInfo[NodeInfo.target].position.x = allNodeInfo[NodeInfo.target].position.x + NodeInfo.x * (1 / graphZoomScale);
  //allNodeInfo[NodeInfo.target].position.y = allNodeInfo[NodeInfo.target].position.y + NodeInfo.y * (1 / graphZoomScale);
  //console.log(allNodeInfo[NodeInfo.target].position);

  allNodeInfo[NodeInfo.target].position = {
    x: allNodeInfo[NodeInfo.target].position.x + NodeInfo.x * (1 / graphZoomScale),
    y: allNodeInfo[NodeInfo.target].position.y + NodeInfo.y * (1 / graphZoomScale)
  }
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

var appendToAllPossibleNodes = function(Node){
  allPossibleNodes[Node] = function(NodeInfo){
    console.log(nodeInfoTemplates.Gate);
    allNodeInfo[Node].position = {
      x: allNodeInfo[Node].position.x + NodeInfo.x,
      y: allNodeInfo[Node].position.y + NodeInfo.y
    }
  };
  console.log("appended to allPossibleNodes");
  console.log(Node);
  console.log(allPossibleNodes);
  console.log(allPossibleNodes[Node]);
  console.log(allNodeInfo[Node]);
};

var GateNodeStyling = {
  rectangle: {
    rectanglePosition: {
      x : 0,
      y : 0
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
          x: 0,
          y: 23
        },
        reset: {
          x: 0,
          y: 38
        }
      },
      outportPositions: {
        out: {
          x: 65,
          y: 31
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
        x : 7,
        y: 24.5
      },
      reset: {
        x : 7,
        y: 42.5
      },
      out: {
        x: 42,
        y: 33.5
      }
    }
  }
};

var SelectedGateNodeStyling = {
  rectangle: {
    rectanglePosition: {
      x : 0,
      y : 0
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
          x: 0,
          y: 23
        },
        reset: {
          x: 0,
          y: 38
        }
      },
      outportPositions: {
        out: {
          x: 65,
          y: 31
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
        x : 9,
        y: 24.5
      },
      reset: {
        x : 9,
        y: 42.5
      },
      out: {
        x: 39,
        y: 33.5
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
      x : 0,
      y : 0
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
          x: 0,
          y: 31
        }
      },
      outportPositions: {
        posn: {
          x: 65,
          y: 31
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
        x : 4,
        y: 33.5
      },
      posn: {
        x: 37,
        y: 33.5
      }
    }
  }
};

var SelectedTGenNodeStyling = {
  rectangle: {
    rectanglePosition: {
      x : 0,
      y : 0
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
          x: 0,
          y: 31
        }
      },
      outportPositions: {
        posn: {
          x: 65,
          y: 31
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
        x : 6,
        y: 33.5
      },
      posn: {
        x: 35,
        y: 33.5
      }
    }
  }
};

var PCompNodeStyling = {
  /* Changing this to see if I can just have the rectangle at (0,0), so then te ports will need to move.
  Didn't do this before since I didn't have the node container to dynamically resize if the ports got bigger, but now it's in a <g> container so it will resize automatically
   */
  rectangle: {
    rectanglePosition: {
      x : 0,
      y : 0
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
          x: 0,
          y: 23
        },
        posn: {
          x: 0,
          y: 38
        }
      },
      outportPositions: {
        act: {
          x: 65,
          y: 23
        },
        out: {
          x: 65,
          y: 31
        },
        pulse: {
          x: 65,
          y: 38
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
        x : 7,
        y: 24.5
      },
      posn: {
        x : 7,
        y: 42.5
      },
      act: {
        x: 42,
        y: 23
      },
      out: {
        x: 42,
        y: 33.5
      },
      pulse: {
        x: 35,
        y: 43
      }
    }
  }
};

var SelectedPCompNodeStyling = {
  rectangle: {
    rectanglePosition: {
      x : 0,
      y : 0
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
          x: 0,
          y: 23
        },
        posn: {
          x: 0,
          y: 38
        }
      },
      outportPositions: {
        act: {
          x: 65,
          y: 23
        },
        out: {
          x: 65,
          y: 31
        },
        pulse: {
          x: 65,
          y: 38
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
        x : 9,
        y: 24.5
      },
      posn: {
        x : 9,
        y: 42.5
      },
      act: {
        x: 40,
        y: 23
      },
      out: {
        x: 40,
        y: 33.5
      },
      pulse: {
        x: 33,
        y: 43
      }
    }
  }
};

var allNodeTypesPortStyling = {
  'Gate': GateNodeStyling.ports.portPositions,
  'TGen': TGenNodeStyling.ports.portPositions,
  'PComp': PCompNodeStyling.ports.portPositions
};

var allNodeTypesStyling = {
  'Gate': GateNodeStyling,
  'TGen': TGenNodeStyling,
  'PComp': PCompNodeStyling
};

var graphPosition = {
  x: 100,
  y: 0
};

var graphZoomScale = 2.0;

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
  //getGate1InportsState: function(){
  //  return allNodeInfo.Gate1.inports
  //},
  //getGate1OutportsState: function(){
  //  return allNodeInfo.Gate1.outports
  //},
  //getTGen1InportsState: function(){
  //  return allNodeInfo.TGen1.inports
  //},
  //getTGen1OutportsState: function(){
  //  return allNodeInfo.TGen1.outports
  //},
  //getGate1Position: function(){
  //  return nodePositions.Gate1.position;
  //},
  //getTGen1Position: function(){
  //  return nodePositions.TGen1.position;
  //},
  //getPComp1Position: function(){
  //  return nodePositions.PComp1.position;
  //},
  //getLUT1Position: function(){
  //  return nodePositions.LUT1;
  //},
  //getAllNodePositions: function(){
  //  return nodePositions;
  //},
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
  //getGateNodeStyling: function(){
  //  return GateNodeStyling;
  //},
  //getSelectedGateNodeStyling: function(){
  //  return SelectedGateNodeStyling;
  //},
  //getTGenNodeStyling: function(){
  //  return TGenNodeStyling;
  //},
  //getSelectedTGenNodeStyling: function(){
  //  return SelectedTGenNodeStyling;
  //},
  //getPCompNodeStyling: function(){
  //  return PCompNodeStyling;
  //},
  //getSelectedPCompNodeStyling: function(){
  //  return SelectedPCompNodeStyling;
  //},
  ///* For edge use */
  //getGateNodeOutPort: function(){
  //    return portPositionsForEdges.gateNode.outports.out;
  //},
  //getTGenNodeEnaPort: function(){
  //    return portPositionsForEdges.tgenNode.inports.ena;
  //},
  //getGateNodeOutportOut: function(){
  //  return gateNodeOutports.out;
  //},
  //getTGenNodeInportEna: function(){
  //  return tgenNodeInports.ena;
  //},
  //getDraggedElement: function(){
  //  return draggedElement;
  //},
  //getNewlyAddedNode: function(){
  //  return newlyAddedNode;
  //},

  getAllNodeInfo: function(){
    return allNodeInfo;
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

  getAllNodeInfoForInitialNodeData: function(){
    return allNodeInfo;
  },
  getPortThatHasBeenClicked: function(){
    return portThatHasBeenClicked;
  },
  getStoringFirstPortClicked: function(){
    return storingFirstPortClicked;
  },
  getNewlyCreatedEdgeLabel: function(){
    return newlyCreatedEdgeLabel;
  },
  getNodeLibrary: function(){
    return nodeLibrary;
  },

  getPortMouseOver: function(){
    return portMouseOver;
  },

  getAllNodeTypesStyling: function(){
    return allNodeTypesStyling;
  }
});

AppDispatcher.register(function(payload){
  var action = payload.action;
  var item = action.item;

  switch(action.actionType){

    //case appConstants.GATENODE_CHANGEPOSITION:
    //  console.log(payload);
    //  console.log(action);
    //  updateGate1Position(item);
    //  nodeStore.emitChange();
    //  break;
    //
    //case appConstants.DRAGGED_ELEMENT:
    //  //console.log(payload);
    //  //console.log(item);
    //  draggedElement = item;
    //  //console.log(draggedElement);
    //  nodeStore.emitChange();
    //  break;
    //
    //
    //case appConstants.DRAGGED_ELEMENTID:
    //  //console.log(payload);
    //  //console.log(action);
    //  draggedElementID = item;
    //  //console.log(draggedElementID);
    //  nodeStore.emitChange();
    //  break;
    //case appConstants.CHANGE_GATE1STYLING:
    //    console.log(payload);
    //    console.log(item);
    //    checkGate1Styling();
    //    nodeStore.emitChange();
    //    break;
    //case appConstants.CHANGE_NODEPOSITION:
    //  console.log(payload);
    //  console.log(item);
    //  updateNodePosition(item);
    //  nodeStore.emitChange();
    //  break;
    //case appConstants.PORT_MOUSEOVERLEAVETOGGLE:
    //  //console.log(payload);
    //  //console.log(item);
    //  portMouseOverLeaveToggle();
    //  nodeStore.emitChange();
    //  break;

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
      //console.log(nodeSelectedStates.Gate1);
      //console.log(nodeSelectedStates.TGen1);
      nodeStore.emitChange();
      break;

    case appConstants.SELECT_EDGE:
      console.log(payload);
      console.log(item);
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
      //console.log(payload);
      //console.log(item);
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
      appendToAllNodeInfo(item);
      appendToAllPossibleNodes(item);
      appendToNodeSelectedStates(item);
      //addToEdgesObject(); /* Just trying out my addToEdgesObject function */
      nodeStore.emitChange();
      break;

    case appConstants.ADDEDGE_TOALLNODEINFO:
      console.log(payload);
      console.log(item);
      //addEdgeToAllNodeInfo(item);
      addToEdgesObject();
      console.log(allNodeInfo);
      console.log(newlyCreatedEdgeLabel);
      nodeStore.emitChange();
      break;

    case appConstants.PASS_PORTMOUSEDOWN:
      console.log(payload);
      console.log(item);
      portThatHasBeenClicked = item;
      //console.log("portThatHasBeenClicked is now: " + portThatHasBeenClicked.id);
      nodeStore.emitChange();
      break;

    case appConstants.DESELECT_ALLPORTS:
      portThatHasBeenClicked = null;
      console.log("portThatHasBeenClicked has been reset");
      nodeStore.emitChange();
      break;

    case appConstants.STORING_FIRSTPORTCLICKED:
      console.log(payload);
      console.log(item);
      storingFirstPortClicked = item;
      //console.log("storingFirstPortClicked is now: " + storingFirstPortClicked.id);
      nodeStore.emitChange();
      break;

    case appConstants.ADD_ONESINGLEEDGE:
      console.log(payload);
      console.log(item);
      /* Let's try replacing with my function that checks port compatibility */
      //addEdgeToAllNodeInfo(item);
      //addNewEdge(item);

      /* Try putting port compatibility checker in theGraphDiamond */
      //checkPortCompatibility(item);

      console.log(edges);
      nodeStore.emitChange();
      break;

    case appConstants.CREATENEW_EDGELABEL:
      console.log(payload);
      console.log(item);
      createNewEdgeLabel(item);
      appendToEdgeSelectedStates(newlyCreatedEdgeLabel);
      nodeStore.emitChange();
      console.log(newlyCreatedEdgeLabel);
      break;

    case appConstants.ADD_ONESINGLEEDGETOALLNODEINFO:
      console.log(payload);
      console.log(item);
      addEdgeToAllNodeInfo(item);
      nodeStore.emitChange();
      console.log(allNodeInfo);
      break;

    case appConstants.ADD_ONESINGLEEDGETOEDGESOBJECT:
      console.log(payload);
      console.log(item);
      addOneSingleEdge(item.edgeLabel, item.edgeInfo);
      nodeStore.emitChange();
      console.log(edges);
      break;

    case appConstants.APPEND_EDGESELECTEDSTATE:
      console.log(payload);
      console.log(item);
      edgeSelectedStates[item] = false;
      nodeStore.emitChange();
      console.log(edgeSelectedStates);
      break;

    case appConstants.INTERACTJS_DRAG:
      console.log(payload);
      console.log(item);
      interactJsDrag(item);
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
//function randomNodePositionGenerator(){
//  console.log("random number is being generated");
//  return (Math.random() * 1000) % 500;
//}
