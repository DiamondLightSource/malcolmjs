/**
 * Created by twi18192 on 10/12/15.
 */

var React = require('react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');

var appConstants = require('../constants/appConstants.js');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');
var attributeStore = require('../stores/attributeStore');
var flowChartStore = require('../stores/flowChartStore');
var flowChartActions = require('../actions/flowChartActions');

var AppDispatcher = require('../dispatcher/appDispatcher');

var Edge = require('./edge.js');
var EdgePreview = require('./edgePreview');
var Block = require('./block.js');

var interact = require('../../node_modules/interact.js');

var Perf = require('../../node_modules/react/lib/ReactDefaultPerf.js');

var AppContainerStyle = {
  "height": "100%",
  "width": "100%",
  //'backgroundColor': "green"
};

var FlowChart = React.createClass({

  propTypes: {
    graphPosition: React.PropTypes.object,
    graphZoomScale: React.PropTypes.number,
    allBlockInfo: React.PropTypes.object,
    blockLibrary: React.PropTypes.object,
    areAnyBlocksSelected: React.PropTypes.bool,
    areAnyEdgesSelected: React.PropTypes.bool,
  },

  //componentWillMount: function(){
  //  window.alert("flowChart will mount")
  //},

  componentDidMount: function () {
    //Perf.start();

    ReactDOM.findDOMNode(this).addEventListener('EdgePreview', this.addEdgePreview);
    ReactDOM.findDOMNode(this).addEventListener('EdgePreview', this.portSelectHighlight);
    ReactDOM.findDOMNode(this).addEventListener('TwoPortClicks', this.checkBothClickedPorts);
    //window.addEventListener('keydown', this.keyPress);

    //window.alert("flowChart mount");

    //window.alert(React.Children.count());

    //setTimeout(function(){
    //  AppDispatcher.handleAction({
    //    actionType: appConstants.INITIALISE_FLOWCHART_END,
    //    item: "initialise flowChart end"
    //  });
    //}, 1000);

    //AppDispatcher.handleAction({
    //  actionType: appConstants.INITIALISE_FLOWCHART_END,
    //  item: "initialise flowChart end"
    //});



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

  wheelZoom: function (e) {
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

  portSelectHighlight: function(){
    console.log("portSelectHighlight");

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

    /* Reset edgePreview in flowChartStore */

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

  //console.log((this.props.storingFirstPortClicked).parentNode.transform.animVal[0].matrix.e);
  //
  if(document.getElementById(this.props.storingFirstPortClicked.id).parentNode.transform.animVal[0].matrix.e === 0){
    //console.log("it's an inport, since the port's x value is zero!");
    var fromBlockPortType = "inport";
  }
  else{
    //console.log("it's an outport!");
    var fromBlockPortType = "outport";
  }

  if(document.getElementById(this.props.portThatHasBeenClicked.id).parentNode.transform.animVal[0].matrix.e === 0) {
    var toBlockPortType = "inport";
  }
  else{
    var toBlockPortType = "outport";
  }



  /* Replacing for now with a check of the port position,
  to determine if the clicked port is an inport or outport

  /* Actually, don't need to replace it, can just remove the logic determining
  the port type and still use it to find the inport index, just via allBlockInfo
  NOT blockLibrary
   */
  for(var i = 0; i < this.props.allBlockInfo[edgeInfo.fromBlock].inports.length; i++){
    if(this.props.allBlockInfo[edgeInfo.fromBlock].inports[i].name === edgeInfo.fromBlockPort){
      //console.log("The fromBlock is an inport:" + edgeInfo.fromBlockPort);
    //  var fromBlockPortType = "inport";
      var inportIndex = i;
      break;
    }
    else{
      //console.log("The fromBlock isn't an inport, so it's an outport, so no need to check the outports!");
    //  var fromBlockPortType = "outport";
    }
  }

  for(var j = 0; j < this.props.allBlockInfo[edgeInfo.toBlock].inports.length; j++ ){
    if(this.props.allBlockInfo[edgeInfo.toBlock].inports[j].name === edgeInfo.toBlockPort){
      //console.log("The toBlock is an inport: " + edgeInfo.toBlockPort);
    //  var toBlockPortType = "inport";
      var inportIndex = j;
      break;
    }
    else{
      //console.log("The toBlock isn't an inport, so it's an outport!");
    //  var toBlockPortType = "outport";
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

      /* For the malcolmCall that updates the dropdown menu list in the block's tab */
      var inportBlock;
      var inportBlockPort;

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

      if(fromPortValueType === toPortValueType || fromPortValueType !== toPortValueType){
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

        /* Create new edges by writing to the server,
        then blockStore updates allBlockInfo via info
        from malcolm rather than being updated locally
         */
        //blockActions.addOneSingleEdgeToAllBlockInfo(newEdge);
        //flowChartActions.appendToEdgeSelectedState(edgeLabel);

        /* Now send the malcolmCall */
        inportBlock = endBlock; /* the 'blockName' argument */
        inportBlockPort = endBlockPort;

        var allBlockAttributes = JSON.parse(JSON.stringify(attributeStore.getAllBlockAttributes()));
        var inputFieldSetMethod = "_set_" + endBlockPort; /* the 'method' argument */

        var newDropdownValue = startBlock + "." + startBlockPort; /* the 'args' argument */

        var argsObject = {};
        argsObject[endBlockPort] = newDropdownValue;
        console.log(argsObject);

        MalcolmActionCreators.malcolmCall(inportBlock, inputFieldSetMethod, argsObject);

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
               graphZoomScale={this.props.graphZoomScale}
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
