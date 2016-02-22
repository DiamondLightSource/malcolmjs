/**
 * Created by twi18192 on 10/12/15.
 */

var React = require('react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');

var blockStore = require('../stores/blockStore.js');
var blockActions = require('../actions/blockActions.js');

var flowChartStore = require('../stores/flowChartStore');
var flowChartActions = require('../actions/flowChartActions');

var Edge = require('./edge.js');
var EdgePreview = require('./edgePreview');

var Block = require('./block.js');

var interact = require('../../node_modules/interact.js');

var Perf = require('../../node_modules/react/lib/ReactDefaultPerf.js');

var WebAPIUtils = require('../utils/WebAPIUtils');

var testingWebsocketActions = require('../actions/testingWebsocketActions');


var NodeStylingProperties = { /* Only here temporarily until I think of a better solution to make this global*/
  height: 65,
  width: 65,
  rx: 7,
  ry: 7
};

//window.NodeContainerStyle = {
//    //"height": "100",
//    //"width": "100"
//    cursor: 'move',
//    draggable: 'true',
//    className: 'nodeContainer',
//    //MozUserSelect: 'none'
//};

window.defaultNodeContainerStyle = {
  cursor: 'move',
  draggable: 'true',
  //className: 'nodeContainer',
};

window.nonSelectedNodeContainerStyle = {
  cursor: 'move',
  draggable: 'true',
  //className: 'nodeContainer',
  opacity: 0.3
};

window.NodeContainerStyle = window.defaultNodeContainerStyle;

var EdgeContainerStyle = {

};

var AppContainerStyle = {
  "height": "100%",
  "width": "100%",
  //'backgroundColor': "green"
};

var FlowChart = React.createClass({

  propTypes: {
    graphPosition: React.PropTypes.object,
    graphZoomScale: React.PropTypes.number,
    //allEdges: React.PropTypes.object,
    //nodesToRender: React.PropTypes.array,
    //edgesToRender: React.PropTypes.array,
    allBlockInfo: React.PropTypes.object,
    //portThatHasBeenClicked:React.PropTypes.oneOfType([
    //  React.PropTypes.element,
    //  /*Dunno how to say it could be null? */
    //])
    blockLibrary: React.PropTypes.object,
    //portMouseOver: React.PropTypes.bool,
    areAnyBlocksSelected: React.PropTypes.bool,
    areAnyEdgesSelected: React.PropTypes.bool,
  },

  componentDidMount: function () {
    //Perf.start();
    //this.setState({gateBlockIdCounter: 1});

    ReactDOM.findDOMNode(this).addEventListener('EdgePreview', this.addEdgePreview);
    ReactDOM.findDOMNode(this).addEventListener('EdgePreview', this.portSelectHighlight);
    ReactDOM.findDOMNode(this).addEventListener('TwoPortClicks', this.checkBothClickedPorts);
    //window.addEventListener('keydown', this.keyPress);

    interact('#dragArea')
      .on('tap', this.deselect);

    interact('#dragArea')
      .draggable({
        onstart: function(e){
          e.stopImmediatePropagation();
          e.stopPropagation();
          //console.log("drag start");

        },
        onmove: this.interactJsDragPan,
        onend: function(e){
          e.stopImmediatePropagation();
          e.stopPropagation();
          //console.log("drag end");
        }
      })
      .gesturable({
        onmove: this.interactJsPinchZoom
      });

    interact('#dragArea')
      .styleCursor(false);
  },
  componentWillUnmount: function () {

    ReactDOM.findDOMNode(this).removeEventListener('EdgePreview', this.addEdgePreview);
    ReactDOM.findDOMNode(this).removeEventListener('EdgePreview', this.portSelectHighlight);
    ReactDOM.findDOMNode(this).removeEventListener('TwoPortClicks', this.checkBothClickedPorts);

    interact('#dragArea')
      .off('tap', this.deselect);
  },

  deselect: function (e) {
    //e.stopImmediatePropagation();
    //e.stopPropagation();
    //console.log("dragArea has been clicked");
    flowChartActions.deselectAllBlocks("deselect all blocks");
    flowChartActions.deselectAllEdges("deselect all edges");

    if(this.props.portThatHasBeenClicked !== null){
      this.portDeselectRemoveHighlight();
      flowChartActions.deselectAllPorts("deselect all ports");
      this.resetPortClickStorage();

      //window.removeEventListener('mousemove', this.windowMouseMoveForEdgePreview);
      flowChartActions.addEdgePreview(null);
      //interact('#appAndDragAreaContainer')
      //  .off('move', this.interactJSMouseMoveForEdgePreview)
    }
    else{
      //console.log("this.props.portThatHasBeenSelected is null, so no need to run port deselection process");
    }

  },

  setOpacity: function () {
    window.NodeContainerStyle[opacity] = 0.5
  },

  wheelZoom: function (e) {
    //console.log("wheel!");
    //console.log(e);
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    var currentZoomScale = this.props.graphZoomScale;
    var currentGraphPositionX = this.props.graphPosition.x;
    var currentGraphPositionY = this.props.graphPosition.y;


    var ZOOM_STEP = 0.05;
    var zoomDirection = (this.isZoomNegative(e.nativeEvent.deltaY) ? 'up' : 'down');

    if(zoomDirection === 'up'){
      var newZoomScale = this.props.graphZoomScale + ZOOM_STEP;
      //nodeActions.graphZoom(newScaleFactor);
    }
    else{
      var newZoomScale = this.props.graphZoomScale - ZOOM_STEP;
      //nodeActions.graphZoom(newScaleFactor);
    }

    /* Lets start again with the zoom and build up my own understanding of it */

    var zoomFactor = newZoomScale / -50;
    var scaleBasedOnZoomFactor = 1 + (1 * zoomFactor);

    /* Trying another definition of scaleDelta */
    //var scaleDelta = newZoomScale / currentZoomScale;
    var scaleDelta = 1 + (newZoomScale - currentZoomScale);
    //this.lastScale = newZoomScale;

    var scale = scaleDelta * currentZoomScale;

    var mouseOnZoomX = e.nativeEvent.clientX;
    var mouseOnZoomY = e.nativeEvent.clientY;

    /* I'm missing the deltaX and deltaY variables that are in the-graph-app.js at line 195 & 196
    Need the previous position of the mouse when wheel zoom was fired */
    /* UPDATE: I don't think it's because of the lack of deltaX and deltaY, they don't work how I want so I reckon I
    was looking at the wrong zoom, it's the one above!
    So I reckon I'm not calculating the scale variable correctly, I need to be dividing by my previous scale I think?
     */

    //if(this.props.previousMouseCoordsOnZoom !== null){
    //  var deltaX = mouseOnZoomX - this.props.previousMouseCoordsOnZoom.x;
    //  var deltaY = mouseOnZoomY - this.props.previousMouseCoordsOnZoom.y;
    //}
    //else if(this.props.previousMouseCoordsOnZoom === null){
    //  console.log("at the very first mouse wheel zoom, so the first offset is zero?");
    //  var deltaX = 0;
    //  var deltaY = 0;
    //}

     var newGraphPositionX = scaleDelta * (currentGraphPositionX - mouseOnZoomX) + mouseOnZoomX;
     var newGraphPositionY = scaleDelta * (currentGraphPositionY - mouseOnZoomY) + mouseOnZoomY;

     var newGraphPosition = {
       x: newGraphPositionX,
       y: newGraphPositionY
     };

     flowChartActions.graphZoom(scale);
     flowChartActions.changeGraphPosition(newGraphPosition);

    //var previousMouseCoordsOnZoom = {
    //  x: e.nativeEvent.clientX,
    //  y: e.nativeEvent.clientY
    //};
    //
    //blockActions.previousMouseCoordsOnZoom(previousMouseCoordsOnZoom);

    //if(zoomDirection === 'up') {
    //  var newGraphPosition = {
    //    x: 0,
    //    y: 0
    //  };
    //}
    //else{
    //  var newGraphPosition = {
    //    x: 0,
    //    y: 0
    //  };
    //}
    //
    //var newGraphPosition = {
    //    x: currentGraphPositionX - deltaXMovement,
    //    y: currentGraphPositionY - deltaYMovement
    //};
    //
    //blockActions.graphZoom(newZoomScale);
    //blockActions.changeGraphPosition(newGraphPosition);

  },

  isZoomNegative: function(n){
    return ((n =+n) || 1/n) < 0;
  },

  /* This is for my black block that adds a gate node when clicked */

  addBlockInfo: function(){
    //e.stopImmediatePropagation();
    //e.stopPropagation();
    //var gateNodeRegExp = /Gate/;
    //var tgenNodeRegExp = /TGen/;
    //var pcompNodeRegExp = /PComp/;
    //var lutNodeRegExp = /LUT/;

    var newGateBlockId = this.generateNewBlockId();

    blockActions.addToAllBlockInfo(newGateBlockId);

  },

  generateNewBlockId: function(){
  /* Do it for just a Gate node for now, remember, small steps before big steps! */
  var gateBlockIdCounter = this.state.gateBlockIdCounter;
    gateBlockIdCounter += 1;
  var newGateId = "Gate" + gateBlockIdCounter;
  this.setState({gateBlockIdCounter: gateBlockIdCounter});
  return newGateId;

  },

  addEdgePreview: function(){
    //console.log("addEdgePreview in flowChart has been invoked!");

    console.log(this.props.portThatHasBeenClicked);
    console.log(document.getElementById(this.props.portThatHasBeenClicked.id));
    var fromBlockId = document.getElementById(this.props.portThatHasBeenClicked.id).parentNode.parentNode.parentNode.parentNode.parentNode.id;
    console.log(fromBlockId);

    var portStringSliceIndex = fromBlockId.length;
    var portName = document.getElementById(this.props.portThatHasBeenClicked.id).id.slice(portStringSliceIndex);

    var fromBlockType = this.props.allBlockInfo[fromBlockId].type;

    /* Slightly confusing since the end of the edge is the same as the start of the edge at the very beginning
    of an edgePreview, but this is only to do the initial render, this'll be updated by windowMouseMoveForEdgePreview()
     */

    //console.log(this.props.portThatHasBeenClicked.cx.baseVal.value);
    //console.log(this.props.portThatHasBeenClicked.className);

    if(document.getElementById(this.props.portThatHasBeenClicked.id).className.baseVal === "inport"){
      //console.log("port clicked is an inport");

      var inportArrayLength = this.props.allBlockInfo[fromBlockId].inports.length;
      var inportArrayIndex;
      for(var j = 0; j < inportArrayLength; j++){
        //console.log(this.props.allBlockInfo[fromBlockId].inports[j].name);
        if(this.props.allBlockInfo[fromBlockId].inports[j].name === portName){
          inportArrayIndex = JSON.parse(JSON.stringify(j));
        }
      }
      var endOfEdgePortOffsetX = 0;
      var endOfEdgePortOffsetY = this.props.blockStyling.outerRectangleHeight / (inportArrayLength + 1) * (inportArrayIndex + 1);
      var portType = "inport";
    }
    else if(document.getElementById(this.props.portThatHasBeenClicked.id).className.baseVal === "outport") {
      //console.log("port clicked is an outport");

      var outportArrayLength = this.props.allBlockInfo[fromBlockId].outports.length;
      var outportArrayIndex;

      for(var i = 0; i < outportArrayLength; i++){
        if(this.props.allBlockInfo[fromBlockId].outports[i].name === portName){
          outportArrayIndex = JSON.parse(JSON.stringify(i));
        }
      }

      var endOfEdgePortOffsetX = this.props.blockStyling.outerRectangleWidth;
      var endOfEdgePortOffsetY = this.props.blockStyling.outerRectangleHeight / (outportArrayLength + 1) * (outportArrayIndex + 1);
      var portType = "outport";
    }
    var endOfEdgeX = this.props.blockPositions[fromBlockId].x + endOfEdgePortOffsetX;
    var endOfEdgeY = this.props.blockPositions[fromBlockId].y + endOfEdgePortOffsetY;

    var edgePreviewInfo = {
      fromBlockInfo: {
        fromBlock: fromBlockId,
        fromBlockType: fromBlockType,
        fromBlockPort: portName,
        fromBlockPortType: portType
      },
      /* At the very start this'll be the same as the fromBlockPort position, then I'll update it with
      windowMouseMoveForEdgePreview() */
      endpointCoords: {
        x: endOfEdgeX,
        y: endOfEdgeY
      }
    };

    flowChartActions.addEdgePreview(edgePreviewInfo);

    //Perf.stop();
    //Perf.printDOM(Perf.getLastMeasurements());
    //Perf.printWasted(Perf.getLastMeasurements());

    /* Trying to replace with interactjs using mousemove */
    //window.addEventListener('mousemove', this.windowMouseMoveForEdgePreview);

    //interact('#appAndDragAreaContainer')
    //  .on('move', this.interactJSMouseMoveForEdgePreview);

  },

  //interactJSMouseMoveForEdgePreview: function(e){
  //  e.stopImmediatePropagation();
  //  e.stopPropagation();
  //  //e.originalEvent.stopImmediatePropagation();
  //  //e.originalEvent.stopPropagation();
  //  //e.preventDefault();
  //  //console.log(e.isImmediatePropagationStopped());
  //
  //  //console.log("interactjs mousemove");
  //  console.log(e);
  //
  //  var mousePositionChange = {
  //    x: e.mozMovementX,
  //    y: e.mozMovementY
  //  };
  //
  //  blockActions.updateEdgePreviewEndpoint(mousePositionChange);
  //
  //},
  //
  //windowMouseMoveForEdgePreview: function(e){
  //  console.log(e);
  //  console.log(e.clientX);
  //
  //  var mousePosition = {
  //    x: e.layerX,
  //    y: e.layerY
  //  };
  //
  //  blockActions.updateEdgePreviewEndpoint(mousePosition);
  //
  //},

  portSelectHighlight: function(){
    //console.log("portSelectHighlight");
    /* This was all pointless, I already have the specific port in this.state.portThatHasBeenSelected! */
    //var portClassName = this.state.portThatHasBeenClicked.className.animVal;
    //var nodeId = this.state.portThatHasBeenClicked.parentNode.parentNode.id;
    //console.log("portThatHasBeenClicked className is: " + portClassName);
    //console.log("portThatHasBeenClicked parent is: " + nodeId);
    //var node = document.getElementById(nodeId);
    //var port = node.querySelector("." + portClassName);
    //console.log(node);
    //console.log(port);
    console.log("portSelectHighlight");

    //this.setState({storingFirstPortClicked: this.state.portThatHasBeenClicked}); /* Replaced with a nodeAction */
    flowChartActions.storingFirstPortClicked(this.props.portThatHasBeenClicked);

    var port = document.getElementById(this.props.portThatHasBeenClicked.id);
    /* Need an if loop to check if we're hovering the port already
    Well actually, to clikc it you must be hovering, it's in the portMouseLeave that if the port is selected that you dont reset the fill & stroke colour
     */
    //port.style.cursor = "default";
    //port.style.fill = "yellow";
    //port.style.stroke = "yellow";

    //port.style.stroke = "black";
    port.style.fill = "#00c9cc";

    //port.setAttribute('r', 4);

    //console.log(port.style.fill);
    //console.log(port.style.stroke);
    /* Node select is also messing with the port styling... */
  },

  portDeselectRemoveHighlight: function(){
    //console.log("before resetting portThatHasBeenSelected, use it to reset the port highlight");
    var port = document.getElementById(this.props.portThatHasBeenClicked.id);
    /* No need to change the cursor back, since if you go back to hovering over a node it'll change to a hand, and if not default is fine
    Actually no, if you then hover over the port again it'll still be an arrow, want a hand again, so change it back to a hand!
    */
    /* Problem is now that if you have clicked a port and have it selected, if you hover over a node it'll go back to being a hand...
    Need some way of checking that if a port is selected, don't override the cursor until a drop or deselection occurs
     */
    //port.style.cursor = "default";
    //port.style.fill = "black";
    //port.style.stroke = "black";

    //port.style.stroke = "black";
    port.style.fill = "grey";

    //port.setAttribute('r', 2);

    /* Added to fix if, when having an edgePreview where the mouse doesn't hover over the edge due to
    clicking near the boundary of where a portClick can occur on the invisibleCirclePort and you deselect
    the edgePreview by clicking on the BACKGROUND rather than the EDGE, you don't get an error with
    storingFirstPortClicked not being null in ports.js but is null in flowChart.js
     */
    this.resetPortClickStorage();

    /* Reset edgePreview in blockStore */

    flowChartActions.addEdgePreview(null);

  },

  checkBothClickedPorts: function(){
    /* This function will run whenever we have dispatched a PortSelect event
    An if loop will check if this.state.portThatHasBeenClicked is null:
    if it is null we simply do a highlight of the port we have selected, then edgePreview should occur.
    if it ISN'T null and it isn't the same port you already clicked, then you run the addEdgeInfo function, passing in the relevant nodes and ports
    To check if portThatHasBeenClicked has a different value, how about I store the value of it in a separate state when the first port click comes in,
    so then you can compare the two in some form or another?
     */
    /* Wait, this.state.portThatHasBeenClicked will never be null when portClick() is run, since we set it in the node to be something in the node file? */
    //console.log("checkBothClickedPorts has been called");
    //if(this.state.storingFirstPortClicked !== null){
    //  var firstPort = this.state.storingFirstPortClicked;
    //  var secondPort = this.state.portThatHasBeenClicked;
    //  console.log(firstPort);
    //  console.log(secondPort);
    //
    //  if(firstPort.parentNode.id === secondPort.parentNode.id && firstPort.className.animVal === secondPort.className.animVal ){
    //    console.log("the two clicked ports are the same port, you clicked on the same port twice!");
    //  }
    //  else{
    //    console.log("something else is afoot! =P");
    //  }
    //}
    //else if(this.state.storingFirstPortClicked === null){
    //  console.log("this.state.storingFirstPortClicked is null, so this is just initial render right now");
    //}
    var firstPort = document.getElementById(this.props.storingFirstPortClicked.id);
    var secondPort = document.getElementById(this.props.portThatHasBeenClicked.id);


    /* For my refactored block.js file, I added another parent container to hold the ports etc, so another level of parentNode is needed here if I keep that
     Or I could simply remove those <g> containers for the time being =P */
    /* Added another <g> element in the ports.js file, so yet another .parentNode makes it on here =P */

    /* Trying to use id instead of class to then allow class for interactjs use */
    /* Need the length of the name of the node, then slice the firstPort id string until the end of the node name length */

    var firstPortStringSliceIndex = firstPort.parentNode.parentNode.parentNode.parentNode.parentNode.id.length;
    var firstPortName = firstPort.id.slice(firstPortStringSliceIndex);
    var secondPortStringSliceIndex = secondPort.parentNode.parentNode.parentNode.parentNode.parentNode.id.length;
    var secondPortName = secondPort.id.slice(secondPortStringSliceIndex);


    if(firstPort.parentNode.parentNode.parentNode.parentNode.parentNode.id === secondPort.parentNode.parentNode.parentNode.parentNode.parentNode.id && firstPort.id === secondPort.id ){
      //console.log("the two clicked ports are the same port, you clicked on the same port twice!");
    }
    else{
      //console.log("something else is afoot, time to look at adding the edge! =P");
      var edge = {
        fromBlock: firstPort.parentNode.parentNode.parentNode.parentNode.parentNode.id,
        fromBlockPort: firstPortName,
        toBlock: secondPort.parentNode.parentNode.parentNode.parentNode.parentNode.id,
        toBlockPort: secondPortName
      };
      /* Now using checkPortCompatibility in theGraphDiamond instead of in the store */
      //this.createNewEdge(edge);

      this.checkPortCompatibility(edge);
    }

  },

  checkPortCompatibility: function(edgeInfo){
  /* First need to check we have an inport and an outport */
  /* Find both port types, then compare them somehow */

  var fromBlockType = this.props.allBlockInfo[edgeInfo.fromBlock].type;
  var toBlockType = this.props.allBlockInfo[edgeInfo.toBlock].type;

  /* Remember, this is BEFORE any swapping occurs, but be aware that these may have to swap later on */
  var blockTypes = {
    fromBlockType: fromBlockType,
    toBlockType: toBlockType
  };


  var fromBlockLibraryInfo = this.props.blockLibrary[fromBlockType];
  var toBlockLibraryInfo = this.props.blockLibrary[toBlockType];



  for(i = 0; i < fromBlockLibraryInfo.inports.length; i++){
    if(fromBlockLibraryInfo.inports[i].name === edgeInfo.fromBlockPort){
      //console.log("The fromBlock is an inport:" + edgeInfo.fromBlockPort);
      var fromBlockPortType = "inport";
      var inportIndex = i;
      break;
    }
    else{
      //console.log("The fromBlock isn't an inport, so it's an outport, so no need to check the outports!");
      var fromBlockPortType = "outport";
    }
  }

  for(j = 0; j < toBlockLibraryInfo.inports.length; j++ ){
    if(toBlockLibraryInfo.inports[j].name === edgeInfo.toBlockPort){
      //console.log("The toBlock is an inport: " + edgeInfo.toBlockPort);
      var toBlockPortType = "inport";
      var inportIndex = j;
      break;
    }
    else{
      //console.log("The toBlock isn't an inport, so it's an outport!");
      var toBlockPortType = "outport";
    }
  }

  var portTypes = {
    fromBlockPortType: fromBlockPortType,
    toBlockPortType: toBlockPortType
  };

  var types = {
    blockTypes: blockTypes,
    portTypes: portTypes
  };

  /* Time to compare the fromNodePortType and toNodePortType */

  var fromPort = document.getElementById(this.props.storingFirstPortClicked.id);

  /* Turns out that this is sctually allowed */
  //if(edgeInfo.fromBlock === edgeInfo.toBlock){
  //  window.alert("Incompatible ports, they are part of the same block.");
  //  //var fromPort = this.state.storingFirstPortClicked;
  //  fromPort.style.stroke = "black";
  //  fromPort.style.fill = "black";
  //  fromPort.setAttribute('r', 2);
  //  this.resetPortClickStorage();
  //
  //  blockActions.addEdgePreview(null);
  //  interact('#appAndDragAreaContainer')
  //    .off('mousemove', this.interactJSMouseMoveForEdgePreview)
  //}
  if(fromBlockPortType === toBlockPortType){
    //console.log("The fromBlock and toBlock ports are both " + fromBlockPortType + "s, so can't connect them");
    window.alert("Incompatible ports, they are both " + fromBlockPortType + "s.");
    /* Reset styling of fromPort before clearing this.state.storingFirstPortClciked */
    //var fromPort = this.state.storingFirstPortClicked;

    //fromPort.style.stroke = "black";
    fromPort.style.fill = "grey";
    //fromPort.setAttribute('r', 2);

    this.resetPortClickStorage();
    /* Hence, don't add anything to allNodeInfo */

    flowChartActions.addEdgePreview(null);
    //interact('#appAndDragAreaContainer')
    //  .off('move', this.interactJSMouseMoveForEdgePreview)
  }
  else if(fromBlockPortType !== toBlockPortType){
    //console.log("fromBlockPortType is " + fromBlockPortType + ", and toBlockPortType is " + toBlockPortType + ", so so far this connection is valid. Check if the ports and their respective blocks are compatible.");
    /* So, for now, just run the function that adds to allNodeInfo, but there will be more checks here, or perhaps a separate function to check for further port compatibility */
    if(fromBlockPortType === "inport"){
      this.isInportConnected(edgeInfo.fromBlockPort, inportIndex, edgeInfo.fromBlock, edgeInfo, types);
    }
    else if(toBlockPortType === "inport"){
      this.isInportConnected(edgeInfo.toBlockPort, inportIndex, edgeInfo.toBlock, edgeInfo, types);
    }
    else{
      //console.log("fromBlockPortType and toBlockPortType are apparently different, yet neither are an inport, so something is up...");
    }
    /* Introducing other port compatibility checks, so this will get put further and further back until the very last check function; only if all these checks are passed is this node action invoked */
    //nodeActions.addOneSingleEdgeToAllNodeInfo(edgeInfo);

    /* Also need the equivalent of addToEdgesObject for single edges here! */
    /* Now, the point of this was also to find if the fromNode was an inport or outport:
     if it's an outport then it's a normal connection from an out to an in,
     but if it's an inport, then it's a connection from an in to an out (ie, the other way around), so somehow need to compensate for that!
     */

  }

  },

  isInportConnected: function(inport, inportIndex, block, edgeInfo, types){
    //console.log("The inport " + inport + " of the block " + block + " is " + this.props.allBlockInfo[block].inports[inportIndex].connected);
    if(this.props.allBlockInfo[block].inports[inportIndex].connected === true){
      //console.log("That inport is already connected, so another connection cannot be made");
      window.alert("The inport " + inport + " of the block " + block + " is already connected, so another connection cannot be made");
      /* Set the styling of the first port back to normal */
      //console.log(edgeInfo);
      //console.log(this.state.storingFirstPortClicked);
      var fromPort = document.getElementById(this.props.storingFirstPortClicked.id);

      //fromPort.style.stroke = "black";
      fromPort.style.fill = "grey";
      //fromPort.setAttribute('r', 2);

      this.resetPortClickStorage();

      flowChartActions.addEdgePreview(null);
      //interact('#appAndDragAreaContainer')
      //  .off('move', this.interactJSMouseMoveForEdgePreview)
    }
    else if(this.props.allBlockInfo[block].inports[inportIndex].connected === false){
      //console.log("That inport isn't connected to anything, so proceed with the port connection process");
      var toPort = document.getElementById(this.props.portThatHasBeenClicked.id);

      /* Put this styling later, sicne I've now added the port value type checker */
      //toPort.style.stroke = "black";
      //toPort.style.fill = "lightgrey";
      //toPort.setAttribute('r', 4);

      /* Putting later, since I need to check if the start node was an inport or outport */
      //nodeActions.addOneSingleEdgeToAllNodeInfo(edgeInfo);
      //this.addOneEdgeToEdgesObject(edgeInfo, types.portTypes, types.nodeTypes);

      /* Now check if the port value types are compatible (ie, if they're the same) */

      var startBlock;
      var startBlockType;
      var startBlockPort;
      var endBlock;
      var endBlockType;
      var endBlockPort;
      var newEdge;
      var edgeLabel;

      if(types.portTypes.fromBlockPortType === 'outport'){

        //console.log("outport to inport, so edge labelling is normal");
        startBlock = edgeInfo.fromBlock;
        startBlockType = types.blockTypes.fromBlockType;
        startBlockPort = edgeInfo.fromBlockPort;
        endBlock = edgeInfo.toBlock;
        endBlockType = types.blockTypes.toBlockType;
        endBlockPort = edgeInfo.toBlockPort;

        /* Then we know that the toBlockPortType is an inport, so then we can check their port VALUE types accordingly */
        for(var i = 0; i < this.props.allBlockInfo[edgeInfo.fromBlock].outports.length; i++){
          if(this.props.allBlockInfo[edgeInfo.fromBlock].outports[i].name === edgeInfo.fromBlockPort){
            var fromPortValueType = this.props.allBlockInfo[edgeInfo.fromBlock].outports[i].type;
          }
        }

        for(var j = 0; j < this.props.allBlockInfo[edgeInfo.toBlock].inports.length; j++){
          if(this.props.allBlockInfo[edgeInfo.toBlock].inports[j].name === edgeInfo.toBlockPort){
            var toPortValueType = this.props.allBlockInfo[edgeInfo.toBlock].inports[j].type;
          }
        }
      }
      else if(types.portTypes.fromBlockPortType === 'inport'){

        //console.log("inport to outport, so have to flip the edge labelling direction");
        /* Note that you must also flip the ports too! */
        startBlock = edgeInfo.toBlock;
        startBlockType = types.blockTypes.toBlockType;
        startBlockPort = edgeInfo.toBlockPort;
        endBlock = edgeInfo.fromBlock;
        endBlockType = types.blockTypes.fromBlockType;
        endBlockPort = edgeInfo.fromBlockPort;

        /* Then we know that the toBlockPortType is an outport */
        for(var k = 0; k < this.props.allBlockInfo[edgeInfo.fromBlock].inports.length; k++){
          if(this.props.allBlockInfo[edgeInfo.fromBlock].inports[k].name === edgeInfo.fromBlockPort){
            var fromPortValueType = this.props.allBlockInfo[edgeInfo.fromBlock].inports[k].type;
          }
        }
        for(var l = 0; l < this.props.allBlockInfo[edgeInfo.toBlock].outports.length; l++){
          if(this.props.allBlockInfo[edgeInfo.toBlock].outports[l].name === edgeInfo.toBlockPort){
            var toPortValueType = this.props.allBlockInfo[edgeInfo.toBlock].outports[l].type;
          }
        }
      }

      if(fromPortValueType === toPortValueType){
        /* Proceed with the connection as we have compatible port value types */

        //toPort.style.stroke = "black";
        toPort.style.fill = "#00c9cc";
        //toPort.setAttribute('r', 4);


        /* UPDATE: moved to the inside of the port value type checker since they also check the port types */
        /* Now need to implement the logic that checks if the start port was an inport or outport */

        //var startBlock;
        //var startBlockType;
        //var startBlockPort;
        //var endBlock;
        //var endBlockType;
        //var endBlockPort;
        //var newEdge;
        //var edgeLabel;
        //if(types.portTypes.fromBlockPortType === "outport"){
        //  console.log("outport to inport, so edge labelling is normal");
        //  startBlock = edgeInfo.fromBlock;
        //  startBlockType = types.blockTypes.fromBlockType;
        //  startBlockPort = edgeInfo.fromBlockPort;
        //  endBlock = edgeInfo.toBlock;
        //  endBlockType = types.blockTypes.toBlockType;
        //  endBlockPort = edgeInfo.toBlockPort;
        //  //newEdge = {
        //  //  fromNode: startNode,
        //  //  fromNodePort: startNodePort,
        //  //  toNode: endNode,
        //  //  toNodePort: endNodePort
        //  //}
        //}
        //else if(types.portTypes.fromBlockPortType === "inport"){
        //  console.log("inport to outport, so have to flip the edge labelling direction");
        //  /* Note that you must also flip the ports too! */
        //  startBlock = edgeInfo.toBlock;
        //  startBlockType = types.blockTypes.toBlockType;
        //  startBlockPort = edgeInfo.toBlockPort;
        //  endBlock = edgeInfo.fromBlock;
        //  endBlockType = types.blockTypes.fromBlockType;
        //  endBlockPort = edgeInfo.fromBlockPort;
        //  /* Don't need this in both loops, can just set this after the loops have completed! */
        //  //newEdge = {
        //  //  fromNode: startNode,
        //  //  fromNodePort: startNodePort,
        //  //  toNode: endNode,
        //  //  toNodePort: endNodePort
        //  //}
        //}


        edgeLabel = String(startBlock) + String(startBlockPort) +  String(endBlock) + String(endBlockPort);

        newEdge = {
          fromBlock: startBlock,
          fromBlockType: startBlockType,
          fromBlockPort: startBlockPort,
          toBlock: endBlock,
          toBlockType: endBlockType,
          toBlockPort: endBlockPort,
          edgeLabel: edgeLabel
        };

        blockActions.addOneSingleEdgeToAllBlockInfo(newEdge);
        //flowChartActions.appendToEdgeSelectedState(edgeLabel);

        /* Cutting out appending to the edges object, so need to finish here pretty much, so reset the port selection etc */

        this.resetPortClickStorage();
        //window.removeEventListener('mousemove', this.windowMouseMoveForEdgePreview);
        /* Can now safely delete the edgePreview by setting it back to null */
        flowChartActions.addEdgePreview(null);
        //interact('#appAndDragAreaContainer')
        //  .off('move', this.interactJSMouseMoveForEdgePreview)
      }
      else if(fromPortValueType !== toPortValueType){
        window.alert("Incompatible port value types: the port " + edgeInfo.fromBlockPort.toUpperCase() + " in " + edgeInfo.fromBlock.toUpperCase() +
          " has value type " + fromPortValueType.toUpperCase() + ", whilst the port " + edgeInfo.toBlockPort.toUpperCase() + " in " + edgeInfo.toBlock.toUpperCase() +
          " has value type " + toPortValueType.toUpperCase() + ".");

        /* Do all the resetting jazz */

        var fromPort = document.getElementById(this.props.storingFirstPortClicked.id);

        //fromPort.style.stroke = "black";
        fromPort.style.fill = "grey";
        //fromPort.setAttribute('r', 2);

        this.resetPortClickStorage();

        flowChartActions.addEdgePreview(null);
        //interact('#appAndDragAreaContainer')
        //  .off('move', this.interactJSMouseMoveForEdgePreview)
      }

    }
  },

  failedPortConnection: function(){
    //this.props.storingFirstPortClicked.style.stroke = "black";
    document.getElementById(this.props.storingFirstPortClicked.id).style.fill = "grey";
    //this.props.storingFirstPortClicked.setAttribute('r', 2);
    this.resetPortClickStorage();
    /* Hence, don't add anything to allNodeInfo */

    document.getElementById('dragArea').style.cursor = 'default';
    flowChartActions.addEdgePreview(null);
    //interact('#appAndDragAreaContainer')
    //  .off('move', this.interactJSMouseMoveForEdgePreview)
  },

  resetPortClickStorage: function(){
    /* The same as what I would expect a portDeselect function to do I think */
    //console.log("Resetting port click storage");
    flowChartActions.storingFirstPortClicked(null);
    flowChartActions.passPortMouseDown(null);
  },

  interactJsDragPan: function(e){
    e.stopImmediatePropagation();
    e.stopPropagation();

    var xChange = this.props.graphPosition.x + e.dx;
    var yChange = this.props.graphPosition.y + e.dy;

    flowChartActions.changeGraphPosition({
      x: xChange,
      y: yChange
    });

    if(this.props.edgePreview !== null) {
      flowChartActions.updateEdgePreviewEndpoint({
        x: -e.dx,
        y: -e.dy
      })
    }
  },

  interactJsPinchZoom: function(e){
    e.stopImmediatePropagation();
    e.stopPropagation();

    var currentZoomScale = this.props.graphZoomScale;
    var newZoomScale = currentZoomScale + e.ds;

    var scaleDelta = 1 + (newZoomScale - currentZoomScale);

    //var scale = scaleDelta * currentZoomScale;

    var pinchZoomX = e.clientX;
    var pinchZoomY = e.clientY;

    var newGraphPositionX = scaleDelta * (this.props.graphPosition.x - pinchZoomX) + pinchZoomX ;
    var newGraphPositionY = scaleDelta * (this.props.graphPosition.y - pinchZoomY) + pinchZoomY ;

    var newGraphPosition = {
      x: newGraphPositionX,
      y: newGraphPositionY
    };

    flowChartActions.graphZoom(newZoomScale);
    flowChartActions.changeGraphPosition(newGraphPosition);
  },

  //keyPress: function(e){
  //  console.log("key press!");
  //  console.log(e);
  //
  //  if(e.keyCode === 46){
  //    console.log("delete key has been pressed");
  //    if(this.props.areAnyEdgesSelected === true){
  //
  //    }
  //    else if(this.props.areAnyEdgesSelected === false){
  //
  //    }
  //  }
  //},

  testingWebsocket: function(){
    //var message = '{"type" : "Subscribe", "id" : ' + idSub + ', "endpoint" : "' + channelSub + '"}';

    //WebSocketClient.sendText('{"type" : "Subscribe", "id" : ' + '0' + ', "endpoint" : "' + 'Z:CLOCKS.attributes.A' + '"}');

    //WebAPIUtils.subscribeChannel();

    testingWebsocketActions.testWrite();

  },



  render: function(){
    console.log("render: flowChart");

    //console.log("inside theGraphDiamond's render function");
    //console.log(this.props);

    var x = this.props.graphPosition.x;
    var y = this.props.graphPosition.y;
    var scale = this.props.graphZoomScale;
    var transform = "translate(" + x + "," + y + ")";
    var matrixTransform = "matrix("+scale+",0,0,"+scale+","+x+","+y+")";

    var blocks = [];
    var edges = [];

    for(var block in this.props.allBlockInfo){
      blocks.push(
        <Block key={block} id={block} className="block"
               blockInfo={this.props.allBlockInfo[block]}
               areAnyBlocksSelected={this.props.areAnyBlocksSelected}
               portThatHasBeenClicked={this.props.portThatHasBeenClicked}
               storingFirstPortClicked={this.props.storingFirstPortClicked}
               //portMouseOver={this.props.portMouseOver}
               selected={flowChartStore.getAnyBlockSelectedState(block)}
               deselect={this.deselect}
               blockStyling={this.props.blockStyling}
               blockPosition={this.props.blockPositions[block]}
          //onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
        />
      );

      for(var i = 0; i < this.props.allBlockInfo[block].inports.length; i++){
        if(this.props.allBlockInfo[block].inports[i].connected === true){
          //console.log(this.props.allBlockInfo[block].inports[i]);
          //console.log("The " + this.props.allBlockInfo[block].inports[i].name + " inport of " + block + " is connected, so find out what block it is connected to");
          /* Ooops, the toNode's should be the INPORTS, since you go FROM an outport TO an inport the way I've done this */
          var toBlock = block;
          var toBlockType = this.props.allBlockInfo[block].type;
          var toBlockPort = this.props.allBlockInfo[block].inports[i].name;
          var fromBlock = this.props.allBlockInfo[block].inports[i].connectedTo.block;
          //console.log(this.props.allBlockInfo);
          var fromBlockType = this.props.allBlockInfo[fromBlock].type;
          var fromBlockPort = this.props.allBlockInfo[block].inports[i].connectedTo.port;

          var edgeLabel = String(fromBlock) + String(fromBlockPort) +  String(toBlock) + String(toBlockPort);

          edges.push(
            <Edge key={edgeLabel} id={edgeLabel}
                  fromBlock={fromBlock} fromBlockType={fromBlockType} fromBlockPort={fromBlockPort} fromBlockPosition={this.props.blockPositions[fromBlock]}
                  toBlock={toBlock} toBlockType={toBlockType} toBlockPort={toBlockPort} toBlockPosition={this.props.blockPositions[toBlock]}
                  fromBlockInfo={this.props.allBlockInfo[fromBlock]}
                  toBlockInfo={this.props.allBlockInfo[toBlock]}
                  areAnyEdgesSelected={this.props.areAnyEdgesSelected}
                  selected={flowChartStore.getIfEdgeIsSelected(edgeLabel)}
                  inportArrayIndex={i} inportArrayLength={this.props.allBlockInfo[block].inports.length}
                  blockStyling={this.props.blockStyling}
            />
          )
        }
        else if(this.props.allBlockInfo[block].inports[i].connected === false){
          //console.log(this.props.allBlockInfo[block].inports[i]);
          //console.log("The " + this.props.allBlockInfo[block].inports[i].name + " inport of " + block + " is NOT connected, so move on to the next inport/block");
        }
      }

    }

    var edgePreview = [];

    if(this.props.edgePreview !== null){
      /* Render the edgePreview component! */

      var edgePreviewLabel = this.props.edgePreview.fromBlockInfo.fromBlock + this.props.edgePreview.fromBlockInfo.fromBlockPort + "-preview";

      edgePreview.push(
        <EdgePreview key={edgePreviewLabel} id={edgePreviewLabel} interactJsDragPan={this.interactJsDragPan}
                     failedPortConnection={this.failedPortConnection}
                     edgePreview={this.props.edgePreview}
                     fromBlockPosition={this.props.blockPositions[this.props.edgePreview.fromBlockInfo.fromBlock]}
                     fromBlockInfo={this.props.allBlockInfo[this.props.edgePreview.fromBlockInfo.fromBlock]}
                     blockStyling={this.props.blockStyling}

        />
      )

    }
    else if(this.props.edgePreview === null){
      //console.log("edgePreview is null, so don't render one");
    }

    return(
      <svg id="appAndDragAreaContainer" height="100%" width="100%"
           //onMouseMove={this.state.moveFunction} onMouseLeave={this.mouseLeave}
           style={AppContainerStyle}  >

        <rect id="dragArea" height="100%" width="100%" fill="transparent"  style={{MozUserSelect: 'none'}}
              //onClick={this.dragging === true ? this.defaultMoveFunction: this.deselect}
              //onMouseDown={this.panMouseDown} onMouseUp={this.panMouseUp} onMouseMove={this.state.panMoveFunction}
              onWheel={this.wheelZoom}
        />
        <svg id="appContainer" style={AppContainerStyle}
          //x={this.state.graphPosition.x} y={this.state.graphPosition.y}
          //onDragOver={this.dragOver} onDragEnter={this.dragEnter} onDrop={this.drop}
        >

          <g id="testPanGroup"
             transform={matrixTransform}
             onWheel={this.wheelZoom}  >

            <g transform="translate(100, 50)" >
              <text>{String(this.props.dataFetchTest.value)}</text>
            </g>

            <g transform="translate(200, 50)"  >
              <rect height="50" width="50" onClick={this.testingWebsocket} ></rect>
            </g>


            <g id="EdgesGroup" >

              {edges}
              {edgePreview}

            </g>

            <g id="BlocksGroup" >

              {blocks}

            </g>


          </g>

        </svg>
      </svg>

    )
  }
});

module.exports = FlowChart;

//<g transform="translate(50, 50)" >
//  <text>{this.props.allBlockInfo['Gate1'].position.x}</text>
//  <text y="10" >{this.props.allBlockInfo['Gate1'].position.y}</text>
//
//</g>
//<g transform="translate(100, 50)" >
//  <text>{this.props.allBlockInfo['TGen1'].position.x}</text>
//<text y="10" >{this.props.allBlockInfo['TGen1'].position.y}</text>
//</g>
//
//<g transform="translate(150, 50)" >
//  <text>{this.props.allBlockInfo['PComp1'].position.x}</text>
//  <text y="10" >{this.props.allBlockInfo['PComp1'].position.y}</text>
//</g>

//<LUTNode id="LUT1"
//         height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 6} x={this.state.LUT1Position.x} y={this.state.LUT1Position.y}
//         onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
///>

//<GateNode id="Gate1"
//          height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 13} x={this.state.Gate1Position.x} y={this.state.Gate1Position.y}
//  //onDragStart={this.dragStart} onDragEnd={this.dragEnd} onDrag={this.drag}
//
//          onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
//  //onMouseMove={this.state.moveFunction}
//
///>
//<TGenNode id="TGen1"
//height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 13} x={this.state.TGen1Position.x} y={this.state.TGen1Position.y}
//
//onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
///>
//
//<PCompNode id="PComp1" style={window.NodeContainerStyle}
//height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 13} x={this.state.PComp1Position.x} y={this.state.PComp1Position.y}
//onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
///>


//<Edge id="Gate1OutTGen1Ena"
//      onMouseDown={this.edgeMouseDown} onMouseUp={this.edgeMouseUp} />


///* The 'zoom origin' is the origin of the <g id="testPanGroup"> element */
//var differenceBetweenMouseAndZoomOrigin = {
//  //x: Math.abs(this.state.graphPosition.x - mouseOnZoom.x),
//  //y: Math.abs(this.state.graphPosition.y - mouseOnZoom.y)
//  x: Math.abs(10 - mouseOnZoom.x),
//  y: Math.abs(40 - mouseOnZoom.y)
//};

//console.log(differenceBetweenMouseAndZoomOrigin);

//var panWhenZoomingMultiplier = 0.1;

//if (mouseOnZoom.x > this.state.graphPosition.x) {
//  if (mouseOnZoom.y > this.state.graphPosition.y) {
//    var panningWhenZooming = {
//      x: this.state.graphPosition.x + panWhenZoomingMultiplier * differenceBetweenMouseAndZoomOrigin.x,
//      y: this.state.graphPosition.y + panWhenZoomingMultiplier * differenceBetweenMouseAndZoomOrigin.y
//    };
//    nodeActions.changeGraphPosition(panningWhenZooming);
//  }
//  else if (mouseOnZoom.y < this.state.graphPosition.y) {
//    var panningWhenZooming = {
//      x: this.state.graphPosition.x + panWhenZoomingMultiplier * differenceBetweenMouseAndZoomOrigin.x,
//      y: this.state.graphPosition.y - panWhenZoomingMultiplier * differenceBetweenMouseAndZoomOrigin.y
//    };
//    nodeActions.changeGraphPosition(panningWhenZooming);
//  }
//
//}
//else if(mouseOnZoom.x < this.state.graphPosition.x){
//  if (mouseOnZoom.y > this.state.graphPosition.y) {
//    var panningWhenZooming = {
//      x: this.state.graphPosition.x - panWhenZoomingMultiplier * differenceBetweenMouseAndZoomOrigin.x,
//      y: this.state.graphPosition.y + panWhenZoomingMultiplier * differenceBetweenMouseAndZoomOrigin.y
//    };
//    nodeActions.changeGraphPosition(panningWhenZooming);
//  }
//  else if (mouseOnZoom.y < this.state.graphPosition.y) {
//    var panningWhenZooming = {
//      x: this.state.graphPosition.x - panWhenZoomingMultiplier * differenceBetweenMouseAndZoomOrigin.x,
//      y: this.state.graphPosition.y - panWhenZoomingMultiplier * differenceBetweenMouseAndZoomOrigin.y
//    };
//    nodeActions.changeGraphPosition(panningWhenZooming);
//  }
//}

//var differenceBetweenMouseOnZoomX = mouseOnZoomX - this.state.lastMouseOnZoomX;
//var differenceBetweenMouseOnZoomY = mouseOnZoomY - this.state.lastMouseOnZoomY;
//
//console.log(differenceBetweenMouseOnZoomX);
//
//var newGraphPositionX = scaleDelta * (currentGraphPositionX - mouseOnZoomX) + mouseOnZoomX + differenceBetweenMouseOnZoomX;
//var newGraphPositionY = scaleDelta * (currentGraphPositionY - mouseOnZoomY) + mouseOnZoomY + differenceBetweenMouseOnZoomY;
//
//this.setState({lastMouseOnZoomX: e.nativeEvent.clientX});
//this.setState({lastMouseOnZoomY: e.nativeEvent.clientY});
//
//var newGraphPosition = {
//  x: newGraphPositionX,
//  y: newGraphPositionY
//};
//
//nodeActions.graphZoom(scale);
//nodeActions.changeGraphPosition(newGraphPosition);




//<Node key="TGen1" id="TGen1" className="node"
//      allNodeInfo={this.state.allNodeInfo} allNodeTypesStyling={this.state.allNodeTypesStyling}
//      portThatHasBeenClicked={this.state.portThatHasBeenClicked} storingFirstPortClicked={this.state.storingFirstPortClicked} portMouseOver={this.state.portMouseOver}
//      selected={NodeStore.getAnyNodeSelectedState("TGen1")}
//  //onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
///>

//debounce: function (func, wait, immediate) {
//  var timeout;
//  return function () {
//    var context = this, args = arguments;
//    var later = function () {
//      timeout = null;
//      if (!immediate) func.apply(context, args);
//    };
//    var callNow = immediate && !timeout;
//    clearTimeout(timeout);
//    timeout = setTimeout(later, wait);
//    if (callNow) func.apply(context, args);
//  };
//},

//throttle: function(limit, e){
//
//  //this.test(this, e);
//  if(this.state.wait === false || this.state.wait === undefined){
//    console.log("wait is false, so do the thing");
//    this.setState({wait: true});
//    console.log(this.state.wait);
//    setTimeout.bind(this, [this.test(this, e), 40])
//  }
//  else if(this.state.wait === true){
//    console.log("we are still waiting, so don't run the move function again just yet");
//  }
//
//
//},
//throttleMoveFunction(e){
//  //console.count("Throttled");
//  //console.log(e);
//  this.throttle(100, e);
//},
//test: function(Component, e){
//  console.log("inside throttle return function");
//  this.setState({wait: false});
//  Component.anotherMoveFunction(e);
//  console.log(this.state.wait);
//},

//mouseDownSelectElement: function (evt) {
//  console.log("mouseDown");
//  console.log(evt);
//  console.log(evt.currentTarget);
//
//  /*This is for calculating the overall distance moved of the dragged element, since beforeDrag gets updated when the element is moved */
//  this.setState({
//    mouseDownX: evt.nativeEvent.clientX,
//    mouseDownY: evt.nativeEvent.clientY
//  });
//
//  this.setState({moveFunction: this.moveElement});
//  //this.setState({draggedElement: evt.currentTarget}); /* Need to send to store */ /* Used for node event firing */ /* Replaced with nodeAction to update store in Gate1*/
//  nodeActions.draggedElementID(evt.currentTarget.id);
//  //nodeActions.deselectAllNodes("deselect all nodes");
//
//
//  if (this.state.draggedElement === evt.currentTarget) {
//    console.log("the draggedElement is equal to the selected element, so don't run deselect!");
//  }
//  else {
//    nodeActions.deselectAllNodes("deselect all nodes");
//    /* Don't want to deselect a node if you move around other nodes whilst having another node selected */
//
//  }
//
//  var startCoordinates = {
//    x: evt.nativeEvent.clientX,
//    y: evt.nativeEvent.clientY
//  };
//  //this.setState({beforeDrag: startCoordinates},
//  //    function(){
//  //        this.setState({moveFunction: this.anotherMoveFunction}, /* Do I need to wait for the beforeDrag state to change here? */
//  //            function(){
//  //                console.log("function has changed");
//  //            })
//  //    });
//
//  this.setState({beforeDrag: startCoordinates});
//  //this.setState({moveFunction: this.anotherMoveFunction}); /* Seeing if I can do this in the default mouse move to check the distance of movement to be a click or drag */
//  this.setState({afterDrag: startCoordinates});
//  /* This is just in case no movement occurs, if there is movement then this will be overwritten */
//
//},
//
//defaultMoveFunction(){
//
//},
//
//moveElement: function (evt) {
//  //this.setState({draggedElement: evt.currentTarget}); /* Need to send to store */
//  //nodeActions.draggedElement(evt.currentTarget.id);
//
//  //console.log("moveElement has occurred");
//  var mouseMovementX = evt.nativeEvent.clientX - this.state.mouseDownX;
//  var mouseMovementY = evt.nativeEvent.clientY - this.state.mouseDownY;
//
//  if ((Math.abs(mouseMovementX) <= 4 && Math.abs(mouseMovementY) <= 4) || (Math.abs(mouseMovementX) <= 4 && Math.abs(mouseMovementY) === 0) || (Math.abs(mouseMovementX) === 0 && Math.abs(mouseMovementY) <= 4)) {
//    console.log("we have a click, not a drag!");
//    /* Need to somehow prevent the zero movement click happening, it always happens for this click too, where's there's minimal movement */
//    /* Or I could just have that if either occur then they change some state that says the node is selected, so either way it won't affect anything? */
//    /* Then I suppose I could have the select style be dependent on if that state is true or false */
//
//    /* Or equally I can update afterDrag here with the very small change in coordinates to prevent that from happening */
//
//    var smallChangeInCoords = {
//      x: evt.nativeEvent.clientX,
//      y: evt.nativeEvent.clientY
//    };
//    this.setState({afterDrag: smallChangeInCoords});
//
//    /* These both HAVE to happen here, a node select needs to occur if the mouse movement is small enough */
//    /* Actually, I think it makes more sense for the nodeSelect event fire to occur on the mouse up, otherwise here it'll get called for any small movement! */
//    //this.state.draggedElement.dispatchEvent(NodeSelect); /* draggedElement happens to be the element that is clicked as well as the element that is dragged! */
//    //this.deselect();
//  }
//  else {
//    console.log("mouseMovementX & Y are big enough, is probably a drag!");
//    this.setState({moveFunction: this.anotherMoveFunction});
//  }
//},
//anotherMoveFunction: function (e) {
//  //console.log("now move is different!");
//
//  /* If mouse movement is minimal, don't change it, but if mouse movement is big enough, change the state */
//
//  //console.log(e);
//  //console.log(Math.floor(Date.now() / 1000));
//
//  var updatedCoordinates = {
//    x: e.nativeEvent.clientX,
//    y: e.nativeEvent.clientY
//  };
//
//  if (!this.state.afterDrag) {
//    this.setState({afterDrag: updatedCoordinates},
//      function () {
//        this.differenceBetweenMouseDownAndMouseUp(this.state.beforeDrag, this.state.afterDrag)
//      })
//  }
//  //else{
//  //    this.setState({beforeDrag: this.state.afterDrag},
//  //        function(){
//  //            this.setState({afterDrag: updatedCoordinates},
//  //                function(){
//  //                    this.differenceBetweenMouseDownAndMouseUp(this.state.beforeDrag, this.state.afterDrag); /* No need to use state callback here for the updatedCoordinates, can use the variable directly to save time */
//  //                })
//  //        })
//  //}
//  else {
//    this.setState({beforeDrag: this.state.afterDrag},
//      function () {
//        this.setState({afterDrag: updatedCoordinates});
//        this.differenceBetweenMouseDownAndMouseUp(this.state.beforeDrag, updatedCoordinates);
//      })
//  }
//},
//
//mouseUp: function (e) {
//  console.log("mouseUp");
//  //console.log(e);
//  //console.log(this.state.afterDrag);
//  //console.log(this.state.mouseDownX);
//  //console.log(Math.abs(e.nativeEvent.clientX - this.state.mouseDownX));
//  //console.log(Math.abs(e.nativeEvent.clientY - this.state.mouseDownY));
//
//
//  if (this.state.beforeDrag.x === this.state.afterDrag.x && this.state.beforeDrag.y === this.state.afterDrag.y) {
//    console.log("zero movement between mouseUp and mouseDown, so it's a click!");
//    this.state.draggedElement.dispatchEvent(NodeSelect);
//    /* draggedElement happens to be the element that is clicked as well as the element that is dragged! */
//    this.setState({moveFunction: this.defaultMoveFunction});
//    this.setState({beforeDrag: null});
//    /* Stops the cursor from jumping back to where it previously was on the last drag */
//    this.setState({afterDrag: null});
//  }
//  /* This is when the mouse has moved far enough that we treat it as a drag, still need to accommodate if we have a mouseup when there's been a small amount of movement but is still a click */
//  else if (Math.abs(this.state.afterDrag.x - this.state.mouseDownX) > 4 && Math.abs(this.state.afterDrag.y - this.state.mouseDownY) > 4) {
//    console.log("the mouse moved far enough to be a drag");
//    this.setState({moveFunction: this.defaultMoveFunction});
//    this.setState({beforeDrag: null});
//    /* Stops the cursor from jumping back to where it previously was on the last drag */
//    this.setState({afterDrag: null});
//  }
//  /* Not ideal, but it fixes the annoying 'select a node even if it moves a lot in one axis but not the other' bug for now */
//  else if ((0 <= Math.abs(e.nativeEvent.clientX - this.state.mouseDownX) <= 4 && Math.abs(e.nativeEvent.clientY - this.state.mouseDownY) > 4) ||
//    (Math.abs(e.nativeEvent.clientX - this.state.mouseDownX) > 4 && 0 <= Math.abs(e.nativeEvent.clientY - this.state.mouseDownY) <= 4)) {
//    console.log("> 4 movement in one axis but < 4 movement in the other");
//    this.setState({moveFunction: this.defaultMoveFunction});
//    this.setState({beforeDrag: null});
//    /* Stops the cursor from jumping back to where it previously was on the last drag */
//    this.setState({afterDrag: null});
//  }
//  else if ((0 <= Math.abs(e.nativeEvent.clientX - this.state.mouseDownX) <= 4 && 0 <= Math.abs(e.nativeEvent.clientY - this.state.mouseDownY) <= 4)) {
//    console.log("there was minimal mouse movement between mouseDown and mouseUp so it was probably a click!");
//    this.state.draggedElement.dispatchEvent(NodeSelect);
//    /* draggedElement happens to be the element that is clicked as well as the element that is dragged! */
//    this.setState({moveFunction: this.defaultMoveFunction});
//    this.setState({beforeDrag: null});
//    /* Stops the cursor from jumping back to where it previously was on the last drag */
//    this.setState({afterDrag: null});
//  }
//
//
//},
//
//differenceBetweenMouseDownAndMouseUp: function (start, end) {
//  //console.log(start);
//  //console.log(end);
//
//  var zoomScale = this.state.graphZoomScale;
//  if(zoomScale === 0){
//    console.log("zoomScale is zero, can't divide by it!");
//  }
//  else{
//    var differenceInCoordinates = {
//      x: (1/zoomScale) * (end.x - start.x),
//      y: (1/zoomScale) * (end.y - start.y)
//    };
//    //nodeActions.changeGateNodePosition(differenceInCoordinates);
//    nodeActions.changeNodePosition(differenceInCoordinates);
//  }
//
//},
//
//mouseLeave: function (e) {
//  console.log("mouseLeave, left the window, emulate a mouseUp event!");
//  this.setState({moveFunction: this.defaultMoveFunction});
//  this.setState({panMoveFunction: this.defaultMoveFunction()});
//  this.setState({beforeDrag: null});
//  this.setState({afterDrag: null});
//},

//panMouseDown: function (e) {
//  console.log("panMouseDown");
//  this.setState({panMoveFunction: this.panMouseMove});
//  this.dragging = true;
//
//  this.coords = {
//    x: e.nativeEvent.clientX,
//    y: e.nativeEvent.clientY
//  };
//
//  /* Enabling a minimum movement threshold to check if a click was intended but the mouse moved a tiny bit between mouseDown and mouseUp */
//
//  //this.setState({
//  //  panGraphMouseDown: {
//  //    x: e.nativeEvent.clientX,
//  //    y: e.nativeEvent.clientY
//  //  }
//  //});
//  //
//  //this.setState({
//  //  panGraphBeforeDrag: {
//  //    x: e.nativeEvent.clientX,
//  //    y: e.nativeEvent.clientY
//  //  }
//  //});
//  //
//  ///* Will get rewritten if there is graph movement, and will stay the same if there's no movement */
//  //this.setState({
//  //  panGraphAfterDrag: {
//  //    x: e.nativeEvent.clientX,
//  //    y: e.nativeEvent.clientY
//  //  }
//  //});
//  //
//  //this.setState({panMoveFunction: this.panCheckIfClickOrDrag});
//
//},
//
//panCheckIfClickOrDrag: function(e){
//  //var mouseMovementX = e.nativeEvent.clientX - this.state.panGraphMouseDown.x;
//  //var mouseMovementY = e.nativeEvent.clientY - this.state.panGraphMouseDown.y;
//  //
//  //if ((Math.abs(mouseMovementX) <= 4 && Math.abs(mouseMovementY) <= 4) || (Math.abs(mouseMovementX) <= 4 && Math.abs(mouseMovementY) === 0) || (Math.abs(mouseMovementX) === 0 && Math.abs(mouseMovementY) <= 4)) {
//  //  console.log("we have a click, not a drag!");
//  //  /* Need to somehow prevent the zero movement click happening, it always happens for this click too, where's there's minimal movement */
//  //  /* Or I could just have that if either occur then they change some state that says the node is selected, so either way it won't affect anything? */
//  //  /* Then I suppose I could have the select style be dependent on if that state is true or false */
//  //
//  //  /* Or equally I can update afterDrag here with the very small change in coordinates to prevent that from happening */
//  //
//  //  var smallChangeInCoords = {
//  //    x: e.nativeEvent.clientX,
//  //    y: e.nativeEvent.clientY
//  //  };
//  //  this.setState({afterPanDrag: smallChangeInCoords});
//  //
//  //  /* These both HAVE to happen here, a node select needs to occur if the mouse movement is small enough */
//  //  /* Actually, I think it makes more sense for the nodeSelect event fire to occur on the mouse up, otherwise here it'll get called for any small movement! */
//  //  //this.state.draggedElement.dispatchEvent(NodeSelect); /* draggedElement happens to be the element that is clicked as well as the element that is dragged! */
//  //  //this.deselect();
//  //}
//  //else {
//  //  console.log("mouseMovementX & Y are big enough, is probably a drag!");
//  //  this.setState({moveFunction: this.panMouseMove});
//  //}
//},
//
//panMouseUp: function (e) {
//  console.log("panMouseUp");
//  this.setState({panMoveFunction: this.defaultMoveFunction});
//  this.dragging = false;
//
//  this.coords = {};
//
//  /* Implementing minimum movement for panning */
//
//  //if (this.state.panGraphBeforeDrag.x === this.state.panGraphAfterDrag.x && this.state.panGraphBeforeDrag.y === this.state.panGraphAfterDrag.y) {
//  //  console.log("zero movement between mouseUp and mouseDown, so it's a click, so we're deselecting everything!");
//  //  this.deselect();
//  //
//  //  this.setState({panMoveFunction: this.defaultMoveFunction});
//  //  this.setState({panGraphBeforeDrag: null});
//  //  /* Stops the cursor from jumping back to where it previously was on the last drag */
//  //  this.setState({panGraphAfterDrag: null});
//  //}
//  ///* This is when the mouse has moved far enough that we treat it as a drag, still need to accommodate if we have a mouseup when there's been a small amount of movement but is still a click */
//  //else if (Math.abs(this.state.afterDrag.x - this.state.panGraphMouseDown.x) > 4 && Math.abs(this.state.afterDrag.y - this.state.panGraphMouseDown.y) > 4) {
//  //  console.log("the mouse moved far enough to be a drag");
//  //  this.setState({panMoveFunction: this.defaultMoveFunction});
//  //  this.setState({panGraphBeforeDrag: null});
//  //  /* Stops the cursor from jumping back to where it previously was on the last drag */
//  //  this.setState({panGraphAfterDrag: null});
//  //}
//  ///* Not ideal, but it fixes the annoying 'select a node even if it moves a lot in one axis but not the other' bug for now */
//  //else if ((0 <= Math.abs(e.nativeEvent.clientX - this.state.panGraphMouseDown.x) <= 4 && Math.abs(e.nativeEvent.clientY - this.state.panGraphMouseDown.y) > 4) ||
//  //  (Math.abs(e.nativeEvent.clientX - this.state.panGraphMouseDown.x) > 4 && 0 <= Math.abs(e.nativeEvent.clientY - this.state.panGraphMouseDown.y) <= 4)) {
//  //  console.log("> 4 movement in one axis but < 4 movement in the other");
//  //  this.setState({panMoveFunction: this.defaultMoveFunction});
//  //  this.setState({panGraphBeforeDrag: null});
//  //  /* Stops the cursor from jumping back to where it previously was on the last drag */
//  //  this.setState({panGraphAfterDrag: null});
//  //}
//  //else if ((0 <= Math.abs(e.nativeEvent.clientX - this.state.mouseDownX) <= 4 && 0 <= Math.abs(e.nativeEvent.clientY - this.state.mouseDownY) <= 4)) {
//  //  console.log("there was minimal mouse movement between mouseDown and mouseUp so it was probably a click, so deselect everything!");
//  //  this.deselect();
//  //  this.setState({panMoveFunction: this.defaultMoveFunction});
//  //  this.setState({panGraphBeforeDrag: null});
//  //  /* Stops the cursor from jumping back to where it previously was on the last drag */
//  //  this.setState({panGraphAfterDrag: null});
//  //}
//
//},
//
//panMouseMove: function (e) {
//  if (this.dragging) {
//    e.preventDefault();
//    console.log("dragging");
//  }
//
//  var dx = this.coords.x - e.nativeEvent.clientX;
//  var dy = this.coords.y - e.nativeEvent.clientY;
//
//  this.coords.x = e.nativeEvent.clientX;
//  this.coords.y = e.nativeEvent.clientY;
//
//  var xChange = this.state.graphPosition.x - dx;
//  var yChange = this.state.graphPosition.y - dy;
//
//  var newCoords = {
//    x: xChange,
//    y: yChange
//  };
//
//  nodeActions.changeGraphPosition(newCoords);
//
//  /* Implementing a minimum mouse movement */
//
//  //var updatedCoordinates = {
//  //  x: e.nativeEvent.clientX,
//  //  y: e.nativeEvent.clientY
//  //};
//  //
//  //if (!this.state.panGraphAfterDrag) {
//  //  this.setState({panGraphAfterDrag: updatedCoordinates},
//  //    function () {
//  //
//  //
//  //    })
//  //}
//  ////else{
//  ////    this.setState({beforeDrag: this.state.afterDrag},
//  ////        function(){
//  ////            this.setState({afterDrag: updatedCoordinates},
//  ////                function(){
//  ////                    this.differenceBetweenMouseDownAndMouseUp(this.state.beforeDrag, this.state.afterDrag); /* No need to use state callback here for the updatedCoordinates, can use the variable directly to save time */
//  ////                })
//  ////        })
//  ////}
//  //else {
//  //  this.setState({beforeDrag: this.state.afterDrag},
//  //    function () {
//  //      this.setState({afterDrag: updatedCoordinates});
//  //      this.differenceBetweenMouseDownAndMouseUp(this.state.beforeDrag, updatedCoordinates);
//  //    })
//  //}
//
//},

//edgeMouseDown: function(e){
//  console.log("mouseDown on an edge!");
//},
//edgeMouseUp: function(e){
//  console.log("mouseUp on an edge!");
//  nodeActions.selectEdge(e.currentTarget.id); /* Really simple way to select an edge, but when the mous events get more comples I'm probably gonna have to use events */
//  this.setState({selectedEdge: e.currentTarget}, function(){
//    console.log(this.state.selectedEdge);
//    this.state.selectedEdge.dispatchEvent(EdgeSelect);
//  });
//  nodeActions.clickedEdge(e.currentTarget.id);
//
//
//},
//handleInteractJsDrag: function(item){
//  nodeActions.interactJsDrag(item);
//},
//interactJsDrag: function(e){
//  console.log("interactJs drag is occurring");
//  var target = e.target.id;
//  var deltaMovement = {
//    target: target,
//    x: e.dx,
//    y: e.dy
//  };
//
//  this.handleInteractJsDrag(deltaMovement);
//
//},

///* NOTE: This function is essentially adding all the nodes that are on initial render, this doesn't add new nodes once the app has been launched! */
//
//addNodeToNodesArray: function(){
//  var gateNodeRegExp = /Gate/;
//  var tgenNodeRegExp = /TGen/;
//  var pcompNodeRegExp = /PComp/;
//  var lutNodeRegExp = /LUT/;
//
//  var allNodeInfo = this.props.allNodeInfo;
//
//  /* Seems like this could be for adding all the initla nodes on startup, perhaps have another fucion for adding one node at a time? */
//  for(var node in allNodeInfo){
//    //console.log("we have a gate node!");
//    //var nodeName = allNodePositions[node].name;
//    //var rectangleString = "Rectangle";
//    //var rectangleName = node.concat(rectangleString); /*  Even though 'node' is an object, concatenating it with a string makes it work to give GAteRectangle? =P */
//    ////console.log(rectangleName);
//    //
//    //var nodeX = allNodePositions[node].position.x;
//    //var nodeY = allNodePositions[node].position.y;
//    //var nodeTranslate = "translate(" + nodeX + "," + nodeY + ")";
//
//    if(gateNodeRegExp.test(node) === true){
//      nodeActions.pushNodeToArray(<GateNode id={node} className="node"
//                           //onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
//      />)
//    }
//    else if(tgenNodeRegExp.test(node) === true){
//      //console.log("we have a tgen node!");
//      nodeActions.pushNodeToArray(<TGenNode id={node} className="node"
//                           //onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
//      />)
//    }
//    else if(pcompNodeRegExp.test(node) === true){
//      //console.log("we have a pcomp node!");
//      nodeActions.pushNodeToArray(<PCompNode id={node} className="node"
//                            //onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
//      />)
//    }
//    else if(lutNodeRegExp.test(node) === true){
//      //console.log("we have an lut node!");
//      nodeActions.pushNodeToArray(<LUTNode id={node} height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 13} transform={nodeTranslate} className="node"
//                          //NodeName={nodeName} RectangleName={rectangleName}
//                          //onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
//      />
//      )
//    }
//    else{
//      console.log("no match to any node type, something's wrong?");
//    }
//  }
//
//
///* Don't need this anymore, I have a for loop in the render function */},
//
//refactoredAddNodeToNodesArray: function(){
//  for(var node in this.props.allNodeInfo){
//    nodeActions.pushNodeToArray(
//      <Node key={node} id={node} className="node"
//            allNodeInfo={this.props.allNodeInfo} allNodeTypesStyling={this.props.allNodeTypesStyling} areAnyNodesSelected={this.props.areAnyNodesSelected}
//            portThatHasBeenClicked={this.props.portThatHasBeenClicked} storingFirstPortClicked={this.props.storingFirstPortClicked} portMouseOver={this.props.portMouseOver}
//            selected={NodeStore.getAnyNodeSelectedState(node)}
//            //onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
//            />
//    )
//  }
//},
//addEdgeInfo: function(){
//  //e.stopImmediatePropagation();
//  //e.stopPropagation();
//  nodeActions.addEdgeToAllNodeInfo({
//    fromNode: 'TGen1',
//    fromNodePort: 'posn',
//    toNode: 'PComp1',
//    toNodePort: 'posn'
//  });
//
//  var newEdge = this.props.allEdges['TGen1posn -> PComp1posn'];
//  console.log(newEdge);
//
//
//  nodeActions.pushEdgeToArray(<Edge id='TGen1posn -> PComp1posn'
//    //x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
//    //                                onMouseDown={this.edgeMouseDown} onMouseUp={this.edgeMouseUp}
//  />)
//},
//
//addEdgeToEdgesArray: function(){
//  //var gateNodeRegExp = /Gate/;
//  //var tgenNodeRegExp = /TGen/;
//  //var pcompNodeRegExp = /PComp/;
//  //var lutNodeRegExp = /LUT/;
//
//  //var allNodePositions = this.state.allNodePositions;
//  var allEdges = this.props.allEdges;
//
//  //var gateNodeInportPositioning = this.state.gateNodeStyling.ports.portPositions.inportPositions;
//  //var gateNodeOutportPositioning = this.state.gateNodeStyling.ports.portPositions.outportPositions;
//  //var tgenNodeInportPositioning = this.state.tgenNodeStyling.ports.portPositions.inportPositions;
//  //var tgenNodeOutportPositioning = this.state.tgenNodeStyling.ports.portPositions.outportPositions;
//  //var pcompNodeInportPositioning = this.state.pcompNodeStyling.ports.portPositions.inportPositions;
//  //var pcompNodeOutportPositioning = this.state.pcompNodeStyling.ports.portPositions.outportPositions;
//
//  for(var edge in allEdges){
//    //var fromNode = allEdges[edge].fromNode;
//    //var toNode = allEdges[edge].toNode;
//    ////console.log(fromNode);
//    ////console.log(toNode);
//    //var fromNodePort = allEdges[edge].fromNodePort;
//    //var toNodePort = allEdges[edge].toNodePort;
//    ////console.log(document.getElementById(fromNode)); /* Since the positions of the nodes are in the store, I should really retrieve the node positions from there and not the DOM element position... */
//    ////console.log(this.state.allNodePositions[fromNode].position); /* Position of fromNode */
//    ////console.log(this.state.allNodePositions[toNode].position);
//    //var fromNodePositionX = this.state.allNodePositions[fromNode].position.x;
//    //var fromNodePositionY = this.state.allNodePositions[fromNode].position.y;
//    //var toNodePositionX = this.state.allNodePositions[toNode].position.x;
//    //var toNodePositionY = this.state.allNodePositions[toNode].position.y;
//    ////console.log(fromNodePositionX);
//    ////console.log(fromNodePositionY);
//    //
//    ///* fromNodes */
//    //if(gateNodeRegExp.test(fromNode) === true){
//    //  var startOfEdgePortOffsetX = gateNodeOutportPositioning[fromNodePort].x;
//    //  var startOfEdgePortOffsetY = gateNodeOutportPositioning[fromNodePort].y;
//    //  //console.log(startOfEdgePortOffsetX);
//    //  //console.log(startOfEdgePortOffsetY);
//    //  var startOfEdgeX = fromNodePositionX + startOfEdgePortOffsetX;
//    //  var startOfEdgeY = fromNodePositionY + startOfEdgePortOffsetY;
//    //  //console.log(startOfEdgeX);
//    //  //console.log(startOfEdgeY);
//    //}
//    //else if(tgenNodeRegExp.test(fromNode) === true){
//    //  var startOfEdgePortOffsetX = tgenNodeOutportPositioning[fromNodePort].x;
//    //  var startOfEdgePortOffsetY = tgenNodeOutportPositioning[fromNodePort].y;
//    //  var startOfEdgeX = fromNodePositionX + startOfEdgePortOffsetX;
//    //  var startOfEdgeY = fromNodePositionY + startOfEdgePortOffsetY;
//    //}
//    //else if(pcompNodeRegExp.test(fromNode) === true){
//    //  var startOfEdgePortOffsetX = pcompNodeOutportPositioning[fromNodePort].x;
//    //  var startOfEdgePortOffsetY = pcompNodeOutportPositioning[fromNodePort].y;
//    //  var startOfEdgeX = fromNodePositionX + startOfEdgePortOffsetX;
//    //  var startOfEdgeY = fromNodePositionY + startOfEdgePortOffsetY;
//    //}
//    //
//    ///* toNodes */
//    //if(tgenNodeRegExp.test(toNode) === true){
//    //  var endOfEdgePortOffsetX = tgenNodeInportPositioning[toNodePort].x;
//    //  var endOfEdgePortOffsetY = tgenNodeInportPositioning[toNodePort].y;
//    //  var endOfEdgeX = toNodePositionX + endOfEdgePortOffsetX;
//    //  var endOfEdgeY = toNodePositionY + endOfEdgePortOffsetY;
//    //  //console.log(endOfEdgeX);
//    //  //console.log(endOfEdgeY);
//    //}
//    //else if(gateNodeRegExp.test(toNode) === true){
//    //  var endOfEdgePortOffsetX = gateNodeInportPositioning[toNodePort].x;
//    //  var endOfEdgePortOffsetY = gateNodeInportPositioning[toNodePort].y;
//    //  var endOfEdgeX = toNodePositionX + endOfEdgePortOffsetX;
//    //  var endOfEdgeY = toNodePositionY + endOfEdgePortOffsetY;
//    //}
//    //else if(pcompNodeRegExp.test(toNode) === true){
//    //  var endOfEdgePortOffsetX = pcompNodeInportPositioning[toNodePort].x;
//    //  var endOfEdgePortOffsetY = pcompNodeInportPositioning[toNodePort].y;
//    //  var endOfEdgeX = toNodePositionX + endOfEdgePortOffsetX;
//    //  var endOfEdgeY = toNodePositionY + endOfEdgePortOffsetY;
//    //}
//
//    nodeActions.pushEdgeToArray(<Edge key={edge} id={edge}
//                     //x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
//                     //onMouseDown={this.edgeMouseDown} onMouseUp={this.edgeMouseUp}
//    />)
//
//  }
//},
//<g><rect
//  onClick={this.addEdgeInfo}
//  height="50" width="50" transform="translate(100, 0)" /></g>
//createNewEdge: function(edgeLabel){
//  console.log("edgeLabel is: " +  edgeLabel);
//  /* This aciton is for adding ALL INITIAL EDGES, not for adding one signle edge! */
//  //nodeActions.addEdgeToAllNodeInfo(edge);
//
//
//  /* Trying to replace with my port compatibility checker function*/
//  //console.log(this.state.allEdges);
//  //console.log(this.state.newlyCreatedEdgeLabel);
//  //nodeActions.createNewEdgeLabel(edge);
//  //console.log("between createNewEdgeLabel and addOneSingleEdge nodeActions");
//  //console.log(this.state.allEdges);
//  //console.log(this.state.newlyCreatedEdgeLabel);
//  //nodeActions.addOneSingleEdge(edge);
//  //console.log("after both nodeActions");
//  //console.log(this.state.allEdges);
//  //console.log(this.state.newlyCreatedEdgeLabel);
//
//  //var newEdgeLabel = edge.fromNode + edge.fromNodePort + " -> " + edge.toNode + edge.toNodePort;
//  //console.log(newEdgeLabel);
//
//
//  //nodeActions.addOneSingleEdge(edge);
//  //
//  //var newlyCreatedEdgeLabel = this.state.newlyCreatedEdgeLabel;
//  ////console.log(this.state.allEdges);
//  ////console.log(this.state.newlyCreatedEdgeLabel);
//  ////console.log(newlyCreatedEdgeLabel);
//  //var newEdge = this.state.allEdges[newlyCreatedEdgeLabel];
//  //console.log(newEdge);
//
//  nodeActions.pushEdgeToArray(<Edge id={edgeLabel}
//    //x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
//    //                                onMouseDown={this.edgeMouseDown} onMouseUp={this.edgeMouseUp}
//  />);
//
//  /* Now that a new edge component instance has been added, reset the port storage info */
//  this.resetPortClickStorage();
//
//},
//addOneEdgeToEdgesObject: function(edgeInfo, portTypes, nodeTypes){
///* I guess it could get messy now, since 'fromNode' before this meant 'the node that was clicked on first', but now I want it to mean the beginning node; ie, the node from which the port type is out */
//
//var startNode;
//var startNodeType;
//var startNodePort;
//var endNode;
//var endNodeType;
//var endNodePort;
//var newEdge;
//var edgeLabel;
//if(portTypes.fromNodePortType === "outport"){
//  console.log("outport to inport, so edge labelling is normal");
//  startNode = edgeInfo.fromNode;
//  startNodeType = nodeTypes.fromNodeType;
//  startNodePort = edgeInfo.fromNodePort;
//  endNode = edgeInfo.toNode;
//  endNodeType = nodeTypes.toNodeType;
//  endNodePort = edgeInfo.toNodePort;
//  //newEdge = {
//  //  fromNode: startNode,
//  //  fromNodePort: startNodePort,
//  //  toNode: endNode,
//  //  toNodePort: endNodePort
//  //}
//}
//else if(portTypes.fromNodePortType === "inport"){
//  console.log("inport to outport, so have to flip the edge labelling direction");
//  /* Note that you must also flip the ports too! */
//  startNode = edgeInfo.toNode;
//  startNodeType = nodeTypes.toNodeType;
//  startNodePort = edgeInfo.toNodePort;
//  endNode = edgeInfo.fromNode;
//  endNodeType = nodeTypes.fromNodeType;
//  endNodePort = edgeInfo.fromNodePort;
//  /* Don't need this in both loops, can just set this after the loops have completed! */
//  //newEdge = {
//  //  fromNode: startNode,
//  //  fromNodePort: startNodePort,
//  //  toNode: endNode,
//  //  toNodePort: endNodePort
//  //}
//}
//
//newEdge = {
//  fromNode: startNode,
//  fromNodeType: startNodeType,
//  fromNodePort: startNodePort,
//  toNode: endNode,
//  toNodeType: endNodeType,
//  toNodePort: endNodePort
//};
//
//edgeLabel = String(newEdge.fromNode) + String(newEdge.fromNodePort) + " -> " + String(newEdge.toNode) + String(newEdge.toNodePort);
//
///* Checking if the edge already exists, if it does don't bother adding another edge */
//
//if(this.props.allEdges[edgeLabel] === undefined){
//  console.log("The newEdge's label is " + edgeLabel);
//
//  /* Need an action to do this */
//  //edges[edgeLabel] = newEdge;
//  //console.log(edges);
//
//  var edgeStuff = {
//    edgeLabel: edgeLabel,
//    edgeInfo: newEdge
//  };
//  nodeActions.addOneSingleEdgeToEdgesObject(edgeStuff);
//
//  /* Also need to add the selected states to edgeSelectedStates! */
//  /* Can have an action do this */
//
//  //edgeSelectedStates[edgeLabel] = false;
//  nodeActions.appendToEdgeSelectedState(edgeLabel);
//
//  //this.createNewEdge(edgeLabel)
//  this.resetPortClickStorage();
//
//}
//else{
//  console.log("That edge already exists, so don't add another one");
//  window.alert("That connection already exists");
//  this.resetPortClickStorage();
//
//}
//},


// Not using the edges object anymore!!
//for(var edge in this.props.allEdges){
//  edges.push(<Edge key={edge} id={edge}
//    //x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
//    //               onMouseDown={this.edgeMouseDown} onMouseUp={this.edgeMouseUp}
//                   allEdges={this.props.allEdges} allNodeTypesPortStyling={this.props.allNodeTypesPortStyling}
//                   allNodeInfo={this.props.allNodeInfo} areAnyEdgesSelected={this.props.areAnyEdgesSelected}
//                   selected={NodeStore.getIfEdgeIsSelected(edge)}
//  />)
//
//}

//<g><rect
//  onClick={this.addBlockInfo}
//  height="50" width="50" /></g>
