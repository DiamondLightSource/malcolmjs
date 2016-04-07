/**
 * Created by twi18192 on 10/12/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var appConstants = require('../constants/appConstants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('../../node_modules/object-assign/index.js');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var CHANGE_EVENT = 'change';

var _stuff = {
  initialBlockServerData: null,
  blockList: null
};

var allBlockInfo = {

};

function addEdgeToAllBlockInfo(Info){

  /* QUESTION: do I need a loop here, can I just use bracket notation to access the required port directly? */

  for(var i = 0; i < allBlockInfo[Info.fromBlock].outports.length; i++){
    if(allBlockInfo[Info.fromBlock].outports[i].name === Info.fromBlockPort){
      var newEdgeToFromBlock = {
        block: Info.toBlock,
        port: Info.toBlockPort
      };
      allBlockInfo[Info.fromBlock].outports[i].connected = true;
      allBlockInfo[Info.fromBlock].outports[i].connectedTo.push(newEdgeToFromBlock);
    }
  }
  /* Also need to add to the node whose inport we've connected that outport to! */

  for(var j = 0; j < allBlockInfo[Info.toBlock].inports.length; j++){
    if(allBlockInfo[Info.toBlock].inports[j].name === Info.toBlockPort){
      var newEdgeToToBlock = {
        block: Info.fromBlock,
        port: Info.fromBlockPort
      };
      allBlockInfo[Info.toBlock].inports[j].connected = true;

      /* Hmm, this'll then REPLACE the previous edge if it exists, it should really check if it's already connected before replacing the object */
      allBlockInfo[Info.toBlock].inports[j].connectedTo = newEdgeToToBlock;
    }
  }
}

function removeEdgeFromAllBlockInfo(Info){

  for(var i = 0; i < allBlockInfo[Info.toBlock].inports.length; i++){
    if(allBlockInfo[Info.toBlock].inports[i].name === Info.toBlockPort){
      /* Remove the info about the connection since we want to delete the edge */
      allBlockInfo[Info.toBlock].inports[i].connected = false;
      allBlockInfo[Info.toBlock].inports[i].connectedTo = null;
    }
    else if(allBlockInfo[Info.toBlock].inports[i].name !== Info.toBlockPort){
      //console.log("not the right port, leave that info alone");
    }
  }

  for(var j = 0; j < allBlockInfo[Info.fromBlock].outports.length; j++){
    if(allBlockInfo[Info.fromBlock].outports[j].name === Info.fromBlockPort){
      /* First, remove it from the array; then check the length of the conenctedTo array:
      if it's 0 then you can also reset the conencted attribute, but if the array is longer than 0 there are still
      other connections, so don't set connected to false
       */
      for(var k = 0; k < allBlockInfo[Info.fromBlock].outports[j].connectedTo.length; k++){
        /* Checking what the outport is CONNECTED TO, so it'll be the info of the fromBlock */
        if(allBlockInfo[Info.fromBlock].outports[j].connectedTo[k].block === Info.toBlock
        && allBlockInfo[Info.fromBlock].outports[j].connectedTo[k].port === Info.toBlockPort){
          /* Remove this particular object from the connectedTo array */
          allBlockInfo[Info.fromBlock].outports[j].connectedTo.splice(k, 1);

          /* Also need to remove it from the edgeSelectedStates object */

          /* edgeSelectedStates has been moved to flowChartStore, so there's
          no need for it here anymore
           */
          //delete edgeSelectedStates[Info.edgeId];
          //window.alert("hsduiad");

          /* And also need to reset the port styling somehow too... */

          /* Now check the length of connectedTo to see if conencted needs to be reset too */
          if(allBlockInfo[Info.fromBlock].outports[j].connectedTo.length === 0){
            /* Reset connected */
            allBlockInfo[Info.fromBlock].outports[j].connected = false;
          }
          else if(allBlockInfo[Info.fromBlock].outports[j].connectedTo.length > 0){
            //console.log("don't reset connected, there are other connections to that outport still");
          }
        }
        else{
          //console.log("not the correct block or port (or both), so don't alter anything");
        }
      }
    }
    else if(allBlockInfo[Info.fromBlock].outports[j].name !== Info.fromBlockPort){
      //console.log("not the correct outport, carry on");
    }
  }

}

function appendToAllBlockInfo(BlockInfo){
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

  //allNodeInfo[NodeInfo] = nodeInfoTemplates.Gate;
  allBlockInfo[BlockInfo] = {
    type: 'Gate',
    label: BlockInfo,
    name: "",
    position: {
      x: 400, /* Maybe have a random number generator generating an x and y coordinate? */
      y: 50,
    },
    /* Replacing inport and outport obejcts with arrays */
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
        type: 'boolean',
        connected: false,
        connectedTo: null
      },
      {
        name: 'reset',
        type: 'boolean',
        connected: false,
        connectedTo: null
      }
    ],
    outports: [
      {
        name: 'out',
        type: 'boolean',
        connected: false,
        connectedTo: []
      }
    ]
  };

  /* Trying to use a for loop to copy over the template */
  //for(var property in nodeInfoTemplates.Gate){
  //  console.log(NodeInfo);
  //  console.log(allNodeInfo);
  //
  //  allNodeInfo[NodeInfo][property] = nodeInfoTemplates.Gate[property];
  //}
  //allNodeInfo[NodeInfo].position.x = randomNodePositionGenerator();
  //allNodeInfo[NodeInfo].position.y = randomNodePositionGenerator();
  //console.log(randomNodePositionGenerator());
  //console.log(randomNodePositionGenerator());
}


var blockPositions = {

};

function appendToBlockPositions(BlockId, xCoord, yCoord){
  blockPositions[BlockId] = {
    x: xCoord * 1/flowChartStore.getGraphZoomScale(),
    y: yCoord * 1/flowChartStore.getGraphZoomScale()
  }
}

function interactJsDrag(BlockInfo){

  blockPositions[BlockInfo.target] = {
    x: blockPositions[BlockInfo.target].x + BlockInfo.x * (1 / flowChartStore.getGraphZoomScale()),
    y: blockPositions[BlockInfo.target].y + BlockInfo.y * (1 / flowChartStore.getGraphZoomScale())
  }
}


var blockLibrary = {
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

var allBlockTabInfo = {
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

var blockInfoTemplates = {
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




/* Functions to do with data retrieval from the server */

/* So what will happen is that an action will tell the server we want new info, it'll fetch it, and then
return it to blockStore in the form of an object of some sort. From there you can do all sorts of things like update
the value of a specific port of an existing block, add a port to an existing block etc.

Depending on the action that triggered the data fetch from the server I'll know which one of these various things
it was that I needed to do, so hopefully then I can trigger the correct function in blockStore after the data has
been returned/fetched to blockStore successfully?
 */
function addBlock(blockId){

  var blockType = blockId.replace(/[0-9]/g, '');
  console.log(blockType);

  var inports = [];
  var outports = [];

  console.log(testAllBlockInfo);
  console.log(blockId);

  for(var attribute in testAllBlockInfo[blockId].attributes){
    /* Rewriting for proper inport & outport filtering */
    //if(testAllBlockInfo[blockId][attribute].tags === undefined){
    //  /* Add that outport to the outports array */
    //
    //  if(attribute.indexOf(":VAL") !== -1){
    //    /* Could well be an inport since it has VAL in the title? */
    //    /* Also, need to remove the VAL from the inport name in that case */
    //    var inportName = attribute.replace(/:VAL/g, '');
    //    inports.push(
    //      {
    //        name: inportName,
    //        type: testAllBlockInfo[blockId][attribute].type.name,
    //        value: String(testAllBlockInfo[blockId][attribute].value),
    //        connected: false,
    //        connectedTo: null
    //      }
    //    )
    //  }
    //  else {
    //    outports.push(
    //      {
    //        name: attribute,
    //        type: testAllBlockInfo[blockId][attribute].type.name,
    //        value: String(testAllBlockInfo[blockId][attribute].value),
    //        connected: false,
    //        connectedTo: []
    //      }
    //    )
    //  }
    //}

    console.log(testAllBlockInfo[blockId].attributes);
    console.log(attribute);
    console.log(testAllBlockInfo[blockId].attributes[attribute]);

    //if(attribute === 'uptime'){
    //  inports.push(
    //    {
    //      name: 'uptime',
    //      type: testAllBlockInfo[blockId].attributes[attribute].type.name,
    //      value: String(testAllBlockInfo[blockId].attributes[attribute].value),
    //      connected: false,
    //      connectedTo: null
    //    }
    //  )
    //}

    if(testAllBlockInfo[blockId].attributes[attribute].tags !== undefined) {
      for (var i = 0; i < testAllBlockInfo[blockId].attributes[attribute].tags.length; i++) {
        var inportRegExp = /flowgraph:inport/;
        var outportRegExp = /flowgraph:outport/;
        if (inportRegExp.test(testAllBlockInfo[blockId].attributes[attribute].tags[i]) === true) {
          var inportName = attribute;
          /* Need to check if the inport is connected to
          anything as well, so then edges will be preserved
          on a window refresh!
           */
          var inportValue = testAllBlockInfo[blockId].attributes[attribute].value;

          /* There'll be a 'disconnected' value at some point,
          so I'll be checking whether it's connected to anything
          at all here soon
           */

          inports.push(
            {
              name: inportName,
              type: testAllBlockInfo[blockId].attributes[attribute].type.name,
              value: String(testAllBlockInfo[blockId].attributes[attribute].value),
              connected: false,
              connectedTo: null
            }
          );

          //var inportBlock = blockId;
          //var inportBlockPort = attribute;
          //var connectedToBlock = inportValue.slice(0, inportValue.indexOf('.'));
          //var connectedToBlockPort = inportValue.slice(inportValue.indexOf('.') + 1);
          //
          //addEdgeViaMalcolm({
          //  inportBlock: inportBlock,
          //  inportBlockPort: inportBlockPort,
          //  outportBlock: connectedToBlock,
          //  outportBlockPort: connectedToBlockPort
          //});

        }
        else if (outportRegExp.test(testAllBlockInfo[blockId].attributes[attribute].tags[i]) === true) {
          var outportName = attribute;
          outports.push(
            {
              name: outportName,
              type: testAllBlockInfo[blockId].attributes[attribute].type.name,
              value: String(testAllBlockInfo[blockId].attributes[attribute].value),
              connected: false,
              connectedTo: []
            }
          )
        }
      }
    }

  }

  var blockMethods = {};

  for(var method in testAllBlockInfo[blockId].methods){
    blockMethods[method] = testAllBlockInfo[blockId].methods[method]
  }
  console.log(blockMethods);

  allBlockInfo[blockId] = {
    type: blockType,
    label: blockId,
    name: '',
    inports: inports,
    outports: outports,
    methods: blockMethods
  };


}

function removeBlock(blockId){
  delete allBlockInfo[blockId];
  delete blockPositions[blockId];
}

function updateAttributeValue(blockId, attribute, newValue){
  console.log("update attribute value");

  console.log(allBlockInfo);

  for(var i = 0; i < allBlockInfo[blockId].inports.length; i++){
    if(allBlockInfo[blockId].inports[i].name === attribute){
      allBlockInfo[blockId].inports[i].value = newValue;
    }
  }

  for(var j = 0; j < allBlockInfo[blockId].outports.length; j++){
    if(allBlockInfo[blockId].outports[j].name === attribute){
      allBlockInfo[blockId].outports[j].value = newValue;
    }
  }
}

var testAllBlockInfo = null;


/* Testing a simple data fetch */

var dataFetchTest = {
  value: true,
};

function addEdgeViaMalcolm(Info){
  console.log(Info);
  //window.alert(allBlockInfo[Info.inportBlock.label]);
  for(var i = 0; i < allBlockInfo[Info.inportBlock].inports.length; i++){
    if(allBlockInfo[Info.inportBlock].inports[i].name === Info.inportBlockPort){
      var addEdgeToInportBlock = {
        block: Info.outportBlock,
        port: Info.outportBlockPort
      };
      allBlockInfo[Info.inportBlock].inports[i].connected = true;
      allBlockInfo[Info.inportBlock].inports[i].connectedTo = addEdgeToInportBlock;
    }
  }

  for(var j = 0; j < allBlockInfo[Info.outportBlock].outports.length; j++){
    if(allBlockInfo[Info.outportBlock].outports[j].name === Info.outportBlockPort){
      var addEdgeToOutportBlock = {
        block: Info.inportBlock,
        port: Info.inportBlockPort
      };
      allBlockInfo[Info.outportBlock].outports[j].connected = true;
      allBlockInfo[Info.outportBlock].outports[j].connectedTo.push(addEdgeToOutportBlock);
    }
  }

  console.log(allBlockInfo);

}

function addInitialEdges(){

  /* This is essentially the same loop as addBlock,
  but since you can't add edges without being certain
  that both blocks exist, this seems like the only way
  to ensure that edges are created only when both blocks
  exist, and that means looping through the attributes of
  every block in testAllBlockInfo after all blocks have
  been fetched
   */

  var inportRegExp = /flowgraph:inport/;
  var outportRegExp = /flowgraph:outport/;

  console.log(allBlockInfo)

  for(var block in testAllBlockInfo){
    for(var attribute in testAllBlockInfo[block].attributes){
      if(testAllBlockInfo[block].attributes[attribute].tags !== undefined){
        for(var i = 0; i < testAllBlockInfo[block].attributes[attribute].tags.length; i++){
          if(inportRegExp.test(testAllBlockInfo[block].attributes[attribute].tags[i]) === true){
            /* Add to the corresponding block's inports array,
            and also add to the corresponding connected block's
            outports array
             */

            console.log(block);
            console.log(attribute);
            console.log(testAllBlockInfo[block].attributes[attribute]);

            var inportBlock = block;
            var inportBlockPort = attribute;
            var outportBlock = testAllBlockInfo[block].attributes[attribute].value.slice(0,
              testAllBlockInfo[block].attributes[attribute].value.indexOf('.'));
            var outportBlockPort = testAllBlockInfo[block].attributes[attribute].value.slice(
              testAllBlockInfo[block].attributes[attribute].value.indexOf('.') + 1);

            //addEdgeViaMalcolm({
            //  inportBlock: inportBlock,
            //  inportBlockPort: inportBlockPort,
            //  outportBlock: outportBlock,
            //  outportBlockPort: outportBlockPort
            //});

            console.log(allBlockInfo[inportBlock]);
            console.log(allBlockInfo[outportBlock]);
            console.log(allBlockInfo);
            console.log(testAllBlockInfo);
            console.log(outportBlock);

            //for(var k = 0; k < allBlockInfo[inportBlock].inports.length; k++){
            //  if(allBlockInfo[inportBlock].inports[k].name === inportBlockPort){
            //    var addEdgeToInportBlock = {
            //      block: outportBlock,
            //      port: outportBlockPort
            //    };
            //    allBlockInfo[inportBlock].inports[k].connected = true;
            //    allBlockInfo[inportBlock].inports[k].connectedTo = addEdgeToInportBlock;
            //  }
            //}
            //
            //for(var l = 0; l < allBlockInfo[outportBlock].outports.length; l++){
            //  if(allBlockInfo[outportBlock].outports[l].name === outportBlockPort){
            //    var addEdgeToOutportBlock = {
            //      block: inportBlock,
            //      port: inportBlockPort
            //    };
            //    allBlockInfo[outportBlock].outports[l].connected = true;
            //    allBlockInfo[outportBlock].outports[l].connectedTo.push(addEdgeToOutportBlock);
            //  }
            //}

          }
        }
      }
    }
  }
}

var flowChartStore = require('./flowChartStore');

var blockStore = assign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb)
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb)
  },
  emitChange: function(){
    this.emit(CHANGE_EVENT)
  },

  /* BLOCK use */

  getAllBlockInfo: function(){
    return allBlockInfo;
  },
  getAllBlockInfoForInitialBlockData: function(){
    return allBlockInfo;
  },
  getBlockLibrary: function(){
    return blockLibrary;
  },

  /* WebAPI use */

  getDataFetchTest: function(){
    return dataFetchTest;
  },

  getInitialBlockStringArray: function(){
    return _stuff.initialBlockServerData;
  },
  getTestAllBlockInfo: function(){

    if(testAllBlockInfo === null){
      testAllBlockInfo = {};

      MalcolmActionCreators.initialiseFlowChart('Z');
      //MalcolmActionCreators.initialiseFlowChart('Z:DIV1.attributes.DIVISOR.value');


      /* So then testAllBlockInfo is something in flowChartViewController */
      return {};

      //for(var j = 0; j < _stuff.blockList.length; j++) {
      //  console.log(_stuff.blockList[j]);
      //  MalcolmActionCreators.malcolmGet(_stuff.blockList[j]);
      //}
    }
    else{
      return testAllBlockInfo;
    }

  },
  getTestAllBlockInfoCallback: function(){

  },

  getBlockPositions: function(){
    return blockPositions;
  }

});

blockStore.dispatchToken = AppDispatcher.register(function(payload){
  var action = payload.action;
  var item = action.item;

  console.log(payload);
  console.log(item);

  switch(action.actionType){

    /* BLOCK use */


    case appConstants.ADDTO_ALLBLOCKINFO:
      appendToAllBlockInfo(item);
      //appendToAllPossibleBlocks(item);
      //appendToBlockSelectedStates(item);
      //addToEdgesObject(); /* Just trying out my addToEdgesObject function */
      blockStore.emitChange();
      break;
    case appConstants.ADD_ONESINGLEEDGETOALLBLOCKINFO:
      addEdgeToAllBlockInfo(item);
      blockStore.emitChange();
      console.log(allBlockInfo);
      break;
    case appConstants.INTERACTJS_DRAG:
      console.log(payload);
      console.log(item);
      interactJsDrag(item);
      blockStore.emitChange();
      break;

    case appConstants.DELETE_EDGE:
      removeEdgeFromAllBlockInfo(item);
      blockStore.emitChange();
      break;

    /* serverActions */

    case appConstants.TEST_WEBSOCKET:
      blockStore.emitChange();
      break;

    /* WebAPI use */

    case appConstants.TEST_DATAFETCH:
      dataFetchTest = JSON.parse(JSON.stringify(item));
      blockStore.emitChange();
      break;

    case appConstants.TEST_SUBSCRIBECHANNEL:
      blockStore.emitChange();
      break;

    case appConstants.MALCOLM_GET_SUCCESS:

      AppDispatcher.waitFor([flowChartStore.dispatchToken]);

      /* Check if it's the initial FlowGraph structure, or
      if it's something else
       */

      for(var i = 0; i < item.tags.length; i++){
        /* No need to check the tags for if it's FlowGraph */
        //if(item.tags[i] === 'instance:FlowGraph'){
        //  /* Do the loop that gets every block */
        //  /* UPDATE: try moving it to a store getter function */
        //  //for(var j = 0; j < item.attributes.blocks.value.length; j++){
        //  //  MalcolmActionCreators.malcolmGet(item.attributes.blocks.value[j]);
        //  //}
        //  //
        //  //break;
        //
        //  //
        //  //_stuff.blockList = JSON.parse(JSON.stringify(item.value));
        //
        //
        //  //_stuff.blockList = JSON.parse(JSON.stringify(item.attributes.blocks.value));
        //
        //}
        if(item.tags[i] === 'instance:Zebra2Block'){

          /* Do the block adding to testAllBlockInfo stuff */

          var blockName = JSON.parse(JSON.stringify(item.name.slice(2)));
          var xCoord = JSON.parse(JSON.stringify(item.attributes.X_COORD.value));
          var yCoord = JSON.parse(JSON.stringify(item.attributes.Y_COORD.value));

          console.log(blockName);
          testAllBlockInfo[blockName] = JSON.parse(JSON.stringify(item));

          /* Add the block to allBlockInfo! */

          if(item.attributes.VISIBLE.value === 'Show') {
            appendToBlockPositions(blockName, xCoord, yCoord);
            addBlock(blockName);

          }
          else{
            /* Putting it here just to test the blocks even if they're not in use */
            //addBlock(blockName);

            console.log("block isn't in use, don't add its info");
          }
          console.log(testAllBlockInfo);
        }

      }



      console.log(testAllBlockInfo);
      console.log(_stuff.blockList);
      blockStore.emitChange();
      break;

    case appConstants.MALCOLM_GET_FAILURE:
      console.log("MALCOLM GET ERROR!");
      blockStore.emitChange();
      break;

    case appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
      console.log("blockStore malcolmSubscribeSuccess");

      console.log(item);

      /* Check the tags for 'widget:combo', it'll be
      indicating that a dropdown was used (it'll also
      cause things like the dropdowns with 'triggered'
      and stuff to emit a change, but for now that'll
      work just fine
       */

      //window.alert("dhi");

      var isInportDropdown = false;

      for(var p = 0; p < item.responseMessage.tags.length; p++){
        if(item.responseMessage.tags[p].indexOf('widget:combo') !== -1){
          isInportDropdown = true;
        }
        else if(item.responseMessage.tags[p] === 'widget:toggle'){
          if(item.requestedData.blockName === 'VISIBILITY') {
            if (item.responseMessage.value === 'Show') {
              /* Trying to add a block when its visibility is
               changed to 'Show'
               */

              appendToBlockPositions(item.requestedData.attribute,
                flowChartStore.getGraphPosition().x, flowChartStore.getGraphPosition().y);

              addBlock(item.requestedData.attribute);
              blockStore.emitChange();
            }
            else if (item.responseMessage.value === 'Hide') {
              /* Should invoke a removeBlock function to remove
               the info from allBlockInfo
               */
              removeBlock(item.requestedData.attribute);
              blockStore.emitChange();
            }
          }
        }
      }

      if(isInportDropdown === true){
        /* Then update allBlockInfo with the new edge! */

        var requestedData = JSON.parse(JSON.stringify(item.requestedData));
        var responseMessage = JSON.parse(JSON.stringify(item.responseMessage));

        var inportBlock = requestedData.blockName;
        var inportBlockPort = requestedData.attribute;

        var outportBlock = responseMessage.value.slice(0, responseMessage.value.indexOf('.'));
        var outportBlockPort = responseMessage.value.slice(responseMessage.value.indexOf('.') + 1);

        //addEdgeViaMalcolm({
        //  inportBlock: inportBlock,
        //  inportBlockPort: inportBlockPort,
        //  outportBlock: outportBlock,
        //  outportBlockPort: outportBlockPort
        //});

        blockStore.emitChange();
      }


      break;

    case appConstants.MALCOLM_SUBSCRIBE_FAILURE:
      console.log("malcolmSubscribeFailure");
      blockStore.emitChange();
      break;

    case appConstants.MALCOLM_CALL_SUCCESS:
      console.log("malcolmCallSuccess");
      blockStore.emitChange();
      break;

    case appConstants.MALCOLM_CALL_FAILURE:
      console.log("malcolmCallFailure");
      blockStore.emitChange();
      break;

    case appConstants.INITIALISE_FLOWCHART_START:
      //console.log("initialise flowChart start blockStore");
      blockStore.emitChange();
      break;

    case appConstants.INITIALISE_FLOWCHART_END:
      console.log("initialise flowChart end, blockStore");
      addInitialEdges();
      blockStore.emitChange();
      break;

    default:
      return true
  }

});

module.exports = blockStore;
