/**
 * Created by twi18192 on 10/12/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var appConstants = require('../constants/appConstants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('../../node_modules/object-assign/index.js');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');
var Config = require('../utils/config');

var update = require('react-addons-update');

var CHANGE_EVENT = 'change';

var _stuff = {
  blockList: null
};

var allBlockInfo = null;

var initialEdgeInfo = {};

var blockPositions = {};

function appendToBlockPositions(BlockId, xCoord, yCoord){
  blockPositions[BlockId] = {
    x: xCoord * 1/flowChartStore.getGraphZoomScale(),
    y: yCoord * 1/flowChartStore.getGraphZoomScale()
  }
}

function interactJsDrag(BlockInfo){

  //var oldBlockPositions = blockPositions;
  //var oldBlockPositionsObject = blockPositions[BlockInfo.target];
  //var oldCounter1BlockPositions = blockPositions['COUNTER1'];

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

  blockPositions[BlockInfo.target] = update(blockPositions[BlockInfo.target], {$set: {
    x: blockPositions[BlockInfo.target].x + BlockInfo.x * (1/flowChartStore.getGraphZoomScale()),
    y: blockPositions[BlockInfo.target].y + BlockInfo.y * (1/flowChartStore.getGraphZoomScale())
  }});

  //console.log(blockPositions === oldBlockPositions);
  //console.log(blockPositions[BlockInfo.target] === oldBlockPositionsObject);
  //console.log(blockPositions['COUNTER1'] === oldCounter1BlockPositions);
  //console.log(blockPositions[BlockInfo.target].x === oldBlockPositionsObject.x);

}




/* Functions to do with data retrieval from the server */

/* So what will happen is that an action will tell the server we want new info, it'll fetch it, and then
return it to blockStore in the form of an object of some sort. From there you can do all sorts of things like update
the value of a specific port of an existing block, add a port to an existing block etc.

Depending on the action that triggered the data fetch from the server I'll know which one of these various things
it was that I needed to do, so hopefully then I can trigger the correct function in blockStore after the data has
been returned/fetched to blockStore successfully?
 */
function addBlock(blockAttributesObject){

  console.log(blockAttributesObject);
  var blockType = blockAttributesObject['BLOCKNAME'].value.replace(/[0-9]/g, '');

  var inports = [];
  var outports = [];

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

  var initialEdgeInfoKeyName;
  var initialEdgeInfoKeyValueName;
  var outportsThatExistInInitialEdgeInfo = [];

  console.log(blockAttributesObject);

  for(var attribute in blockAttributesObject){

    if(blockAttributesObject[attribute].tags !== undefined) {
      for (var i = 0; i < blockAttributesObject[attribute].tags.length; i++) {
        var inportRegExp = /flowgraph:inport/;
        var outportRegExp = /flowgraph:outport/;
        if (inportRegExp.test(blockAttributesObject[attribute].tags[i]) === true) {
          var inportName = attribute;

          /* Find the type of the inport value too,
          via the flowgraph tag
           */

          var inportValueType = blockAttributesObject[attribute].tags[i]
            .slice('flowgraph:inport:'.length);

          /* Need to check if the inport is connected to
          anything as well, so then edges will be preserved
          on a window refresh!
           */
          var inportValue = blockAttributesObject[attribute].value;

          /* Initially, the port is always added as being disconnected,
          even if it is connected. This is to accomodate not being able
          to add any edges until we can be certain that both involved
          blocks exist within the GUI/store
           */

          if(allBlockInfo[inportValue.slice(0, inportValue.indexOf('.'))] === undefined) {

            inports.push(
              {
                name: inportName,
                type: inportValueType,
                value: String(inportValue),
                connected: false,
                connectedTo: null
              }
            );

            if (inportValue.indexOf('ZERO') !== -1) {
              /* Then the block is connected to a .ZERO port,
               ie, it's disconnected, so no need to do anything
               */
            }
            else if (inportValue.indexOf('ZERO') === -1) {
              /* The inport is connected to an outport,
               so need to do more here
               */

              initialEdgeInfoKeyValueName = blockAttributesObject['BLOCKNAME'].value + "." + attribute;

              initialEdgeInfo[inportValue] = initialEdgeInfoKeyValueName;

            }
          }
          else if(allBlockInfo[inportValue.slice(0, inportValue.indexOf('.'))] !== undefined){
            /* Then the outport block already exists, so can
            simply push the inport like normal!
             */

            console.log("outport block already exists, so can just add the wire initially!");
            console.log(initialEdgeInfo);

            var outportBlockName = inportValue.slice(0, inportValue.indexOf('.'));
            var outportName = inportValue.slice(inportValue.indexOf('.') + 1);
            console.log(outportBlockName);
            console.log(outportName);

            inports.push(
              {
                name: inportName,
                type: inportValueType,
                value: String(inportValue),
                connected: true,
                connectedTo: {
                  block: outportBlockName,
                  port: outportName
                }
              }
            );
            console.log(inports);

          }

        }
        else if (outportRegExp.test(blockAttributesObject[attribute].tags[i]) === true) {
          var outportName = attribute;

          var outportValueType = blockAttributesObject[attribute].tags[i]
            .slice('flowgraph:outport:'.length);

          var outportValue = blockAttributesObject[attribute].value;

          initialEdgeInfoKeyName = blockAttributesObject['BLOCKNAME'].value + '.' + attribute;

          if(initialEdgeInfo[initialEdgeInfoKeyName] !== undefined){
            outportsThatExistInInitialEdgeInfo.push(initialEdgeInfoKeyName);
          }

          outports.push(
            {
              name: outportName,
              type: outportValueType,
              value: String(outportValue),
              connected: false,
              connectedTo: []
            }
          )
        }
      }
    }

  }

  allBlockInfo[blockAttributesObject['BLOCKNAME'].value] = {
    type: blockType,
    label: blockAttributesObject['BLOCKNAME'].value,
    iconURL: blockAttributesObject['ICON'].value,
    name: '',
    inports: inports,
    outports: outports
  };

  /* Now to go through the outportsThatExistInInitialEdgeInfo array
  and update both blocks involved in the connection
   */

  if(outportsThatExistInInitialEdgeInfo !== undefined &&
    outportsThatExistInInitialEdgeInfo.length > 0) {
    for (var k = 0; k < outportsThatExistInInitialEdgeInfo.length; k++) {
      updateAnInitialEdge(outportsThatExistInInitialEdgeInfo[k]);
    }
  }

}

function removeBlock(blockId){
  delete allBlockInfo[blockId];
  delete blockPositions[blockId];
}

function updateAnInitialEdge(initialEdgeInfoKey){

  var initialEdgeInfoValue = initialEdgeInfo[initialEdgeInfoKey];

  var outportBlockName = initialEdgeInfoKey.slice(0, initialEdgeInfoKey.indexOf('.'));
  var outportName = initialEdgeInfoKey.slice(initialEdgeInfoKey.indexOf('.') + 1);

  var inportBlockName = initialEdgeInfoValue.slice(0, initialEdgeInfoValue.indexOf('.'));
  var inportName = initialEdgeInfoValue.slice(initialEdgeInfoValue.indexOf('.') + 1);

  /* Now to go through allBlockInfo and change the connected
  attributes of the inports and outports to true
   */

  for(var i = 0; i < allBlockInfo[inportBlockName].inports.length; i++){
    if(allBlockInfo[inportBlockName].inports[i].name === inportName){
      allBlockInfo[inportBlockName].inports[i].connectedTo = {
        block: outportBlockName,
        port: outportName
      };
      allBlockInfo[inportBlockName].inports[i].connected = true;
    }
  }

  for(var j = 0; j < allBlockInfo[outportBlockName].outports.length; j++){
    if(allBlockInfo[outportBlockName].outports[j].name === outportName){
      allBlockInfo[outportBlockName].outports[j].connectedTo.push({
        block: inportBlockName,
        port: inportName
      });
      allBlockInfo[outportBlockName].outports[j].connected = true;
    }
  }

  /* Now delete that particular key in initialEdgeInfo, I don't
  think it's needed anymore?
   */

  delete initialEdgeInfo[initialEdgeInfoKey];

}

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

function removeEdgeViaMalcolm(Info){
  /* This is specifically for when there's a connection to
  BITS.ZERO and it means a disconnection rather than connect
  to the BITS.ZERO port
   */

  for(var i = 0; i < allBlockInfo[Info.inportBlock].inports.length; i++){
    if(allBlockInfo[Info.inportBlock].inports[i].name === Info.inportBlockPort){
      allBlockInfo[Info.inportBlock].inports[i].connected = false;
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

  getAllBlockInfo: function(){

    if(allBlockInfo === null){
      allBlockInfo = {};

      MalcolmActionCreators.initialiseFlowChart(Config.getDeviceName());

      return {};
    }
    else {
      return allBlockInfo;
    }
  },

  getBlockPositions: function(){
    return blockPositions;
  }

});

var attributeStore = require('./attributeStore');

blockStore.dispatchToken = AppDispatcher.register(function(payload){
  var action = payload.action;
  var item = action.item;

  //console.log(payload);
  //console.log(item);

  switch(action.actionType){

    /* BLOCK use */

    case appConstants.INTERACTJS_DRAG:
      interactJsDrag(item);
      blockStore.emitChange();
      break;

    /* WebAPI use */

    case appConstants.MALCOLM_GET_SUCCESS:

      //AppDispatcher.waitFor([flowChartStore.dispatchToken]);

      /* Check if it's the initial FlowGraph structure, or
      if it's something else
       */

      for(var i = 0; i < item.responseMessage.tags.length; i++){
        if(item.responseMessage.tags[i] === 'instance:Zebra2Block'){

          /* Do the block adding to testAllBlockInfo stuff */

          var blockName = JSON.parse(JSON.stringify(item.responseMessage.name.slice(2)));
          var xCoord = JSON.parse(JSON.stringify(item.responseMessage.attributes.X_COORD.value));
          var yCoord = JSON.parse(JSON.stringify(item.responseMessage.attributes.Y_COORD.value));

          /* Add the block to allBlockInfo! */

          //console.log(attributeStore.getAllBlockAttributes()[blockName]);

          if(item.responseMessage.attributes.VISIBLE.value === 'Show') {
            appendToBlockPositions(blockName, xCoord, yCoord);
            /* Pass addBlock the block object from allBlockAttributes in attributeStore
            instead of relying on testAllBlockInfo
             */
            addBlock(attributeStore.getAllBlockAttributes()[blockName]);
            blockStore.emitChange();
          }
        }

      }

      break;

    case appConstants.MALCOLM_GET_FAILURE:
      console.log("MALCOLM GET ERROR!");
      blockStore.emitChange();
      break;

    case appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
      console.log("blockStore malcolmSubscribeSuccess");


      /* Check the tags for 'widget:combo', it'll be
      indicating that a dropdown was used (it'll also
      cause things like the dropdowns with 'triggered'
      and stuff to emit a change, but for now that'll
      work just fine
       */

      /* UPDATE: could also earch for the 'flowgraph' tag
      to make sure that it's a inport dropdown menu and
      not any other type of attribute
       */

      /* Need to listen for block coordinate/position changes too */

      /* When a block is hidden, an error appears saying that
       blockPositions[requestedData.blockName] is undefined,
       since the block has in fact been removed from that object.
       I basically need to start doing unsubscriptions I think,
       the other way is to simply put another if statement here
       */

      if(item.requestedData.attribute === 'X_COORD'){

        /* Should first check if the position of the block isn't
        already equal to the position grabbed from the server:
        this is essentially because the block positions are updated
        locally as well as from the server, changing the position
        via the server is for when you have't dragged a block in
        the GUI, but change it via the server in some other way
         */

        var responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
        var requestedData = JSON.parse(JSON.stringify(item.requestedData));

        /* Undoing the zoom scale multiplication to check against
        the server's unscaled coords */

        /* When a block is removed/hidden, its coords get reset to
        (0,0), so need to check if they still exist in blockPositions
        in case a coord change I catch here is due to removing a block
         */

        if(blockPositions[requestedData.blockName] !== undefined) {

          if (blockPositions[requestedData.blockName].x * flowChartStore.getGraphZoomScale() !==
            responseMessage.value) {

            blockPositions[requestedData.blockName] = update(blockPositions[requestedData.blockName],
              {x: {$set: responseMessage.value * 1 / flowChartStore.getGraphZoomScale()}});

            blockStore.emitChange();
          }
        }

      }
      else if(item.requestedData.attribute === 'Y_COORD'){

        var responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
        var requestedData = JSON.parse(JSON.stringify(item.requestedData));

        /* Undoing the zoom scale multiplication to check against
         the server's unscaled coords */

        if(blockPositions[requestedData.blockName] !== undefined) {

          if (blockPositions[requestedData.blockName].y * flowChartStore.getGraphZoomScale() !==
            responseMessage.value) {

            blockPositions[requestedData.blockName] = update(blockPositions[requestedData.blockName],
              {y: {$set: responseMessage.value * 1 / flowChartStore.getGraphZoomScale()}});

            blockStore.emitChange();
          }
        }

      }

      var isInportDropdown = false;
      var hasFlowgraphTag = false;

      if(item.responseMessage.tags !== undefined) {
        for (var p = 0; p < item.responseMessage.tags.length; p++) {
          if (item.responseMessage.tags[p].indexOf('widget:combo') !== -1) {
            isInportDropdown = true;
          }
          else if (item.responseMessage.tags[p].indexOf('flowgraph') !== -1) {
            hasFlowgraphTag = true;
          }
          else if (item.responseMessage.tags[p] === 'widget:toggle') {

            /* What about when a block's own visible attribute gets changed? */

            if (item.requestedData.blockName === 'VISIBILITY') {
              if (item.responseMessage.value === 'Show') {
                /* Trying to add a block when its visibility is
                 changed to 'Show'
                 */

                appendToBlockPositions(item.requestedData.attribute,
                  flowChartStore.getGraphPosition().x, flowChartStore.getGraphPosition().y);

                /* Pass addBlock the block object from allBlockAttributes in attributeStore
                 instead of relying on testAllBlockInfo
                 */
                addBlock(attributeStore.getAllBlockAttributes()[item.requestedData.attribute]);
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
      }

      if(isInportDropdown === true && hasFlowgraphTag === true){
        /* Then update allBlockInfo with the new edge! */

        var requestedData = JSON.parse(JSON.stringify(item.requestedData));
        var responseMessage = JSON.parse(JSON.stringify(item.responseMessage));

        var inportBlock = requestedData.blockName;
        var inportBlockPort = requestedData.attribute;

        var outportBlock = responseMessage.value.slice(0, responseMessage.value.indexOf('.'));
        var outportBlockPort = responseMessage.value.slice(responseMessage.value.indexOf('.') + 1);

        if(responseMessage.value.indexOf('ZERO') === -1) {

          addEdgeViaMalcolm({
            inportBlock: inportBlock,
            inportBlockPort: inportBlockPort,
            outportBlock: outportBlock,
            outportBlockPort: outportBlockPort
          });
        }
        else if(responseMessage.value.indexOf('ZERO') !== -1){
          /* Then the edge needs to be deleted! */

          /* Update: note that this could also occur when the
          block with the inport is REMOVED via a toggle switch,
          so then in that case the edge has been removed when the
          block got deleted from allBlockInfo, ie, there's no need
          to remove the edge in that case as it has effectively
          already been done implicitly via block removal
           */

          if(allBlockInfo[inportBlock] !== undefined) {
            removeEdgeViaMalcolm({
              inportBlock: inportBlock,
              inportBlockPort: inportBlockPort,
            });
            console.log(allBlockInfo[inportBlock]);
          }

        }

        blockStore.emitChange();
      }


      break;

    case appConstants.MALCOLM_SUBSCRIBE_FAILURE:
      console.log("malcolmSubscribeFailure");
      //blockStore.emitChange();
      break;

    case appConstants.MALCOLM_CALL_SUCCESS:
      console.log("malcolmCallSuccess");
      //blockStore.emitChange();
      break;

    case appConstants.MALCOLM_CALL_FAILURE:
      console.log("malcolmCallFailure");
      //blockStore.emitChange();
      break;

    case appConstants.INITIALISE_FLOWCHART_START:
      //console.log("initialise flowChart start blockStore");
      //blockStore.emitChange();
      break;

    default:
      return true
  }

});

module.exports = blockStore;
