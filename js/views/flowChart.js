/**
 * Created by twi18192 on 10/12/15.
 */

var React = require('react');
var ReactDOM = require('react-dom');

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
    areAnyBlocksSelected: React.PropTypes.bool,
    areAnyEdgesSelected: React.PropTypes.bool,
  },

  componentDidMount: function () {
    //Perf.start();

    ReactDOM.findDOMNode(this).addEventListener('EdgePreview', this.addEdgePreview);
    ReactDOM.findDOMNode(this).addEventListener('EdgePreview', this.portSelectHighlight);
    ReactDOM.findDOMNode(this).addEventListener('TwoPortClicks', this.checkBothClickedPorts);

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
      flowChartActions.addEdgePreview(null);
    }

  },

  wheelZoom: function (e) {

    /* This wheelZoom function in its current state is incomplete:
    it works well, but it can be seen that the zoom doesn't zoom
    in on the cursor perfectly, whatever your cursor is hovering
    over appears to move slightly
     */

    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    var currentZoomScale = this.props.graphZoomScale;
    var currentGraphPositionX = this.props.graphPosition.x;
    var currentGraphPositionY = this.props.graphPosition.y;

    var ZOOM_STEP = 0.05;
    var zoomDirection = (this.isZoomNegative(e.nativeEvent.deltaY) ? 'up' : 'down');

    var newZoomScale;

    if(zoomDirection === 'up'){
      newZoomScale = this.props.graphZoomScale + ZOOM_STEP;
    }
    else{
      newZoomScale = this.props.graphZoomScale - ZOOM_STEP;
    }

    var scaleDelta = 1 + (newZoomScale - currentZoomScale);
    var scale = scaleDelta * currentZoomScale;

    var mouseOnZoomX = e.nativeEvent.clientX;
    var mouseOnZoomY = e.nativeEvent.clientY;

    var newGraphPositionX = scaleDelta * (currentGraphPositionX - mouseOnZoomX)
      + mouseOnZoomX;
    var newGraphPositionY = scaleDelta * (currentGraphPositionY - mouseOnZoomY)
      + mouseOnZoomY;

    var newGraphPosition = {
      x: newGraphPositionX,
      y: newGraphPositionY
    };

    flowChartActions.graphZoom(scale);
    flowChartActions.changeGraphPosition(newGraphPosition);

  },

  isZoomNegative: function(n){
    return ((n =+n) || 1/n) < 0;
  },

  addEdgePreview: function(){

    var fromBlockId = document.getElementById(this.props.portThatHasBeenClicked.id)
      .parentNode.parentNode.parentNode.parentNode.parentNode.id;
    var portStringSliceIndex = fromBlockId.length;
    var portName = document.getElementById(this.props.portThatHasBeenClicked.id)
      .id.slice(portStringSliceIndex);
    var fromBlockType = this.props.allBlockInfo[fromBlockId].type;

    /* Slightly confusing since the end of the edge is the same as the start
    of the edge at the very beginning of an edgePreview, but this is only to
    do the initial render, this'll be updated by interactJSMouseMoveForEdgePreview()
    in edgePreview.js
     */

    var endOfEdgePortOffsetX;
    var endOfEdgePortOffsetY;
    var portType;

    if(document.getElementById(this.props.portThatHasBeenClicked.id).className.baseVal.indexOf('inport') !== -1){

      var inportArrayLength = this.props.allBlockInfo[fromBlockId].inports.length;
      var inportArrayIndex;
      for(var j = 0; j < inportArrayLength; j++){
        if(this.props.allBlockInfo[fromBlockId].inports[j].name === portName){
          inportArrayIndex = JSON.parse(JSON.stringify(j));
        }
      }
      endOfEdgePortOffsetX = 0;
      endOfEdgePortOffsetY = this.props.blockStyling.outerRectangleHeight / (inportArrayLength + 1) * (inportArrayIndex + 1);
      portType = "inport";
    }
    else if(document.getElementById(this.props.portThatHasBeenClicked.id).className.baseVal.indexOf('outport') !== -1) {

      var outportArrayLength = this.props.allBlockInfo[fromBlockId].outports.length;
      var outportArrayIndex;

      for(var i = 0; i < outportArrayLength; i++){
        if(this.props.allBlockInfo[fromBlockId].outports[i].name === portName){
          outportArrayIndex = JSON.parse(JSON.stringify(i));
        }
      }

      endOfEdgePortOffsetX = this.props.blockStyling.outerRectangleWidth;
      endOfEdgePortOffsetY = this.props.blockStyling.outerRectangleHeight / (outportArrayLength + 1) * (outportArrayIndex + 1);
      portType = "outport";
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
      /* At the very start this'll be the same as the fromBlockPort position,
      then I'll update it with interactJSMouseMoveForEdgePreview() in edgePreview.js */
      endpointCoords: {
        x: endOfEdgeX,
        y: endOfEdgeY
      }
    };

    flowChartActions.addEdgePreview(edgePreviewInfo);
  },

  portSelectHighlight: function(){
    flowChartActions.storingFirstPortClicked(this.props.portThatHasBeenClicked);
  },

  portDeselectRemoveHighlight: function(){
    this.resetPortClickStorage();
    flowChartActions.addEdgePreview(null);
  },

  checkBothClickedPorts: function(){
    /* This function will run whenever we have dispatched a PortSelect event */

    var firstPort = document.getElementById(this.props.storingFirstPortClicked.id);
    var secondPort = document.getElementById(this.props.portThatHasBeenClicked.id);

    /* The excessive use of .parentNode is to walk up
    the DOM tree and find the id of the block that the
    port belongs to, not the best way I'm sure...
     */

    /* Trying to use id instead of class to then allow class for interactjs use */
    /* Need the length of the name of the node, then slice the firstPort id string
    until the end of the node name length */

    var firstPortStringSliceIndex = firstPort.parentNode.parentNode.parentNode
      .parentNode.parentNode.id.length;
    var firstPortName = firstPort.id.slice(firstPortStringSliceIndex);

    var secondPortStringSliceIndex = secondPort.parentNode.parentNode.parentNode
      .parentNode.parentNode.id.length;
    var secondPortName = secondPort.id.slice(secondPortStringSliceIndex);


    if(firstPort.parentNode.parentNode.parentNode.parentNode.parentNode.id ===
      secondPort.parentNode.parentNode.parentNode.parentNode.parentNode.id &&
      firstPort.id === secondPort.id ){
    }
    else{
      var edge = {
        fromBlock: firstPort.parentNode.parentNode.parentNode.parentNode.parentNode.id,
        fromBlockPort: firstPortName,
        toBlock: secondPort.parentNode.parentNode.parentNode.parentNode.parentNode.id,
        toBlockPort: secondPortName
      };
      this.checkPortCompatibility(edge);
    }

  },

  checkPortCompatibility: function(edgeInfo){
    /* First need to check we have an inport and an outport */
    /* Find both port types, then compare them somehow */

    var fromBlockPortType;
    var toBlockPortType;

    var fromBlockType = this.props.allBlockInfo[edgeInfo.fromBlock].type;
    var toBlockType = this.props.allBlockInfo[edgeInfo.toBlock].type;

    /* Remember, this is BEFORE any swapping occurs, but be
    aware that these may have to swap later on
    */
    var blockTypes = {
      fromBlockType: fromBlockType,
      toBlockType: toBlockType
    };

    if(document.getElementById(this.props.storingFirstPortClicked.id).parentNode
        .transform.animVal[0].matrix.e === 0){
      //console.log("it's an inport, since the port's x value is zero!");
      fromBlockPortType = "inport";
    }
    else{
      fromBlockPortType = "outport";
    }

    if(document.getElementById(this.props.portThatHasBeenClicked.id).parentNode
        .transform.animVal[0].matrix.e === 0) {
      toBlockPortType = "inport";
    }
    else{
      toBlockPortType = "outport";
    }

    /* Note that the inportIndex is used to then look in allBlockInfo
    and check if the selected inport is already conencted or not
     */

    var inportIndex;

    for(var i = 0; i < this.props.allBlockInfo[edgeInfo.fromBlock].inports.length; i++){
      if(this.props.allBlockInfo[edgeInfo.fromBlock].inports[i].name === edgeInfo.fromBlockPort){
        inportIndex = i;
        break;
      }
    }

    for(var j = 0; j < this.props.allBlockInfo[edgeInfo.toBlock].inports.length; j++ ){
      if(this.props.allBlockInfo[edgeInfo.toBlock].inports[j].name === edgeInfo.toBlockPort){
        inportIndex = j;
        break;
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

    if(fromBlockPortType === toBlockPortType){
      window.alert("Incompatible ports, they are both " + fromBlockPortType + "s.");
      this.resetPortClickStorage();
      flowChartActions.addEdgePreview(null);
    }
    else if(fromBlockPortType !== toBlockPortType){

      if(fromBlockPortType === "inport"){
        this.isInportConnected(edgeInfo.fromBlockPort, inportIndex, edgeInfo.fromBlock, edgeInfo, types);
      }
      else if(toBlockPortType === "inport"){
        this.isInportConnected(edgeInfo.toBlockPort, inportIndex, edgeInfo.toBlock, edgeInfo, types);
      }

    }

  },

  isInportConnected: function(inport, inportIndex, block, edgeInfo, types){
    if(this.props.allBlockInfo[block].inports[inportIndex].connected === true){
      window.alert("The inport " + inport + " of the block " + block +
        " is already connected, so another connection cannot be made");

      this.resetPortClickStorage();
      flowChartActions.addEdgePreview(null);
    }
    else if(this.props.allBlockInfo[block].inports[inportIndex].connected === false){

      /* Now check if the port value types are compatible (ie, if they're the same) */

      var startBlock;
      var startBlockPort;
      var endBlock;
      var endBlockPort;

      /* For the malcolmCall that updates the dropdown menu list
         specifying what port the block's inport is connected to */
      var inportBlock;

      if(types.portTypes.fromBlockPortType === 'outport'){

        startBlock = edgeInfo.fromBlock;
        startBlockPort = edgeInfo.fromBlockPort;
        endBlock = edgeInfo.toBlock;
        endBlockPort = edgeInfo.toBlockPort;

        /* Now to loop through the specific port's tags to find
        out what type it is (ie, pos, bit etc)
         */

        /* We know that the toBlockPortType is an inport,
        so then we can check their port VALUE types accordingly */
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

        /* Note that you must also flip the ports too! */
        startBlock = edgeInfo.toBlock;
        startBlockPort = edgeInfo.toBlockPort;
        endBlock = edgeInfo.fromBlock;
        endBlockPort = edgeInfo.fromBlockPort;

      }

      if(fromPortValueType === toPortValueType){
        /* Proceed with the connection as we have compatible port value types */

        /* Create new edges by sending a malcolmCall */

        inportBlock = endBlock; /* the 'blockName' argument */
        var inputFieldSetMethod = "_set_" + endBlockPort; /* the 'method' argument */
        var newDropdownValue = startBlock + "." + startBlockPort; /* the 'args' argument */

        var argsObject = {};
        argsObject[endBlockPort] = newDropdownValue;

        MalcolmActionCreators.malcolmCall(inportBlock, inputFieldSetMethod, argsObject);

        this.resetPortClickStorage();

        /* Can now safely delete the edgePreview by setting it back to null */
        flowChartActions.addEdgePreview(null);
      }
      else if(fromPortValueType !== toPortValueType){
        window.alert("Incompatible port value types: the port " +
          edgeInfo.fromBlockPort.toUpperCase() + " in " + edgeInfo.fromBlock.toUpperCase() +
          " has value type " + fromPortValueType.toUpperCase() + ", whilst the port " +
          edgeInfo.toBlockPort.toUpperCase() + " in " + edgeInfo.toBlock.toUpperCase() +
          " has value type " + toPortValueType.toUpperCase() + ".");

        /* Do all the resetting jazz */

        this.resetPortClickStorage();

        flowChartActions.addEdgePreview(null);
      }

    }
  },

  failedPortConnection: function(){
    this.resetPortClickStorage();
    document.getElementById('dragArea').style.cursor = 'default';
    flowChartActions.addEdgePreview(null);
  },

  resetPortClickStorage: function(){
    /* The same as what I would expect a portDeselect function to do I think */
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

  generateEdgePreview: function(){

    var edgePreview = [];

    if(this.props.edgePreview !== null){
      /* Render the edgePreview component! */

      var edgePreviewLabel = this.props.edgePreview.fromBlockInfo.fromBlock +
        this.props.edgePreview.fromBlockInfo.fromBlockPort + "-preview";

      edgePreview.push(
        <EdgePreview key={edgePreviewLabel} id={edgePreviewLabel}
                     interactJsDragPan={this.interactJsDragPan}
                     failedPortConnection={this.failedPortConnection}
                     edgePreview={this.props.edgePreview}
                     fromBlockPosition={this.props.blockPositions[this.props.edgePreview.fromBlockInfo.fromBlock]}
                     fromBlockInfo={this.props.allBlockInfo[this.props.edgePreview.fromBlockInfo.fromBlock]}
                     blockStyling={this.props.blockStyling}
        />
      )
    }

    return edgePreview;

  },


  render: function(){
    console.log("render: flowChart");

    var x = this.props.graphPosition.x;
    var y = this.props.graphPosition.y;
    var scale = this.props.graphZoomScale;
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
        if(this.props.allBlockInfo[block].inports[i].connected === true &&
          this.props.allBlockInfo[this.props.allBlockInfo[block].inports[i].connectedTo.block] !== undefined){

          var toBlock = block;
          var toBlockType = this.props.allBlockInfo[block].type;
          var toBlockPort = this.props.allBlockInfo[block].inports[i].name;

          var fromBlock = this.props.allBlockInfo[block].inports[i].connectedTo.block;
          var fromBlockType = this.props.allBlockInfo[fromBlock].type;
          var fromBlockPort = this.props.allBlockInfo[block].inports[i].connectedTo.port;
          var fromBlockPortValueType = this.props.allBlockInfo[block].inports[i].type;

          /* Only one of fromBlockPortValueType and toBlockPortValue type
          is needed, since if they are connected they SHOULD have the same type
           */

          var edgeLabel = String(fromBlock) + String(fromBlockPort) +  String(toBlock) + String(toBlockPort);

          edges.push(
            <Edge key={edgeLabel} id={edgeLabel}
                  fromBlock={fromBlock} fromBlockType={fromBlockType}
                  fromBlockPort={fromBlockPort} fromBlockPortValueType={fromBlockPortValueType}
                  fromBlockPosition={this.props.blockPositions[fromBlock]}
                  toBlock={toBlock} toBlockType={toBlockType}
                  toBlockPort={toBlockPort} toBlockPosition={this.props.blockPositions[toBlock]}
                  fromBlockInfo={this.props.allBlockInfo[fromBlock]}
                  toBlockInfo={this.props.allBlockInfo[toBlock]}
                  areAnyEdgesSelected={this.props.areAnyEdgesSelected}
                  selected={flowChartStore.getIfEdgeIsSelected(edgeLabel)}
                  inportArrayIndex={i}
                  inportArrayLength={this.props.allBlockInfo[block].inports.length}
                  blockStyling={this.props.blockStyling}
            />
          )
        }
      }

    }

    return(
      <svg id="appAndDragAreaContainer" height="100%" width="100%"
           style={AppContainerStyle}  >

        <rect id="dragArea" height="100%" width="100%"
              fill="transparent"  style={{MozUserSelect: 'none'}}
              onWheel={this.wheelZoom} />

        <svg id="appContainer" style={AppContainerStyle} >

          <g id="panningGroup"
             transform={matrixTransform}
             onWheel={this.wheelZoom} >

            <g id="EdgesGroup" >
              {edges}
              {this.generateEdgePreview()}
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
