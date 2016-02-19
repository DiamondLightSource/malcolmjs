/**
 * Created by twi18192 on 04/02/16.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var blockStore = require('../stores/blockStore.js');
var blockActions = require('../actions/blockActions.js');
var flowChartActions = require('../actions/flowChartActions');

var interact = require('../../node_modules/interact.js');

var Perf = require('../../node_modules/react/lib/ReactDefaultPerf.js');


var EdgePreview = React.createClass({

  componentDidMount: function(){

    Perf.start();
    interact('#appAndDragAreaContainer')
      .on('move', this.interactJSMouseMoveForEdgePreview);

    this.noPanning = true;

    interact(ReactDOM.findDOMNode(this))
      .draggable({
        onstart: function(e){
          e.stopImmediatePropagation();
          e.stopPropagation();
          interact('#appAndDragAreaContainer')
            .off('move', this.interactJSMouseMoveForEdgePreview);
          //console.log("drag start");
        }.bind(this),
        onmove: function(e){
          e.stopImmediatePropagation();
          e.stopPropagation();
          this.props.interactJsDragPan(e);
        }.bind(this),
        onend: function(e){
          e.stopImmediatePropagation();
          e.stopPropagation();
          //console.log("drag end");
          this.noPanning = true;
          interact('#appAndDragAreaContainer')
            .on('move', this.interactJSMouseMoveForEdgePreview);
          //console.log(e);
          /* No need for this after changing mousemove to move for some reason? */
          flowChartActions.updateEdgePreviewEndpoint({
            x: e.dx,
            y: e.dy
          })
        }.bind(this)
      });

    interact(ReactDOM.findDOMNode(this))
      .on('tap', this.onTap);

    interact(ReactDOM.findDOMNode(this))
      .on('down', this.onMouseDown);
  },
  componentWillUnmount: function(){
    //console.log("edge preview unmounting!");

    interact(ReactDOM.findDOMNode(this))
      .off('tap', this.onTap);

    interact(ReactDOM.findDOMNode(this))
      .off('down', this.onMouseDown);

    interact('#appAndDragAreaContainer')
      .off('move', this.interactJSMouseMoveForEdgePreview);

    Perf.stop();
    Perf.printWasted(Perf.getLastMeasurements());
  },

  shouldComponentUpdate: function(){
    return this.noPanning
  },

  interactJSMouseMoveForEdgePreview: function(e){
    e.stopImmediatePropagation();
    e.stopPropagation();

    var mousePositionChange = {
      x: e.mozMovementX,
      y: e.mozMovementY
    };

    flowChartActions.updateEdgePreviewEndpoint(mousePositionChange);

  },

  onTap: function(e){
    e.stopImmediatePropagation();
    e.stopPropagation();
    //console.log("tapped!");
    interact('#appAndDragAreaContainer')
      .off('move', this.interactJSMouseMoveForEdgePreview);
    this.props.failedPortConnection();
  },

  onMouseDown: function(e){
    e.stopImmediatePropagation();
    e.stopPropagation();
    this.noPanning = false;

    /* Perhaps also disable the edgePreview fucntion in the flowChart too while we're panning, since we needn't
     update the mouse position?
     UPDATE: nice, it actually improved the performance!! :)
     */

    interact('#appAndDragAreaContainer')
      .off('move', this.interactJSMouseMoveForEdgePreview);
  },

  render:function(){
    console.log("render: edgePreview");

    var blockStyling = this.props.blockStyling;

    //console.log(this.props.id);
    //console.log(this.props.interactJsDragPan);
    var fromBlockInfo = this.props.edgePreview.fromBlockInfo;

    //console.log(document.getElementById(fromNode)); /* Since the positions of the nodes are in the store, I should really retrieve the node positions from there and not the DOM element position... */
    //console.log(this.props.allNodePositions[fromNode].position); /* Position of fromNode */
    //console.log(this.props.allNodePositions[toNode].position);

    var fromBlockPositionX = this.props.fromBlockPosition.x;
    var fromBlockPositionY = this.props.fromBlockPosition.y;
    //console.log(fromNodePositionX);
    //console.log(fromNodePositionY);
    //
    //console.log(allNodeTypesPortStyling[fromNodeType]);
    //console.log(allNodeTypesPortStyling[fromNodeType].outportPositions);
    //console.log(fromNodePort);

    if(fromBlockInfo.fromBlockPortType === "inport"){
      var inportArrayLength = this.props.fromBlockInfo.inports.length;
      var inportArrayIndex;
      for(var j = 0; j < inportArrayLength; j++){
        if(this.props.fromBlockInfo.inports[j].name === fromBlockInfo.fromBlockPort){
          inportArrayIndex = JSON.parse(JSON.stringify(j));
        }
      }
      var startOfEdgePortOffsetX = 0;
      var startOfEdgePortOffsetY = blockStyling.outerRectangleHeight / (inportArrayLength + 1) * (inportArrayIndex + 1);
    }
    else if(fromBlockInfo.fromBlockPortType === "outport") {
      var outportArrayLength = this.props.fromBlockInfo.outports.length;
      var outportArrayIndex;

      for(var i = 0; i < outportArrayLength; i++){
        if(this.props.fromBlockInfo.outports[i].name === fromBlockInfo.fromBlockPort){
          outportArrayIndex = JSON.parse(JSON.stringify(i));
        }
      }
      var startOfEdgePortOffsetX = blockStyling.outerRectangleWidth;
      var startOfEdgePortOffsetY = blockStyling.outerRectangleHeight / (outportArrayLength + 1) * (outportArrayIndex + 1);
    }
    else{
      window.alert("the port type is neither an inport or outport...");
    }
    var startOfEdgeX = fromBlockPositionX + startOfEdgePortOffsetX;
    var startOfEdgeY = fromBlockPositionY + startOfEdgePortOffsetY;

    var endOfEdgeX = this.props.edgePreview.endpointCoords.x;
    var endOfEdgeY = this.props.edgePreview.endpointCoords.y;

    var innerLineString = "-innerline";
    var outerLineString = "-outerline";
    var innerLineName = this.props.id.concat(innerLineString);
    var outerLineName = this.props.id.concat(outerLineString);


    return(
      <g id="edgePreviewContainer" {...this.props}>

        <line id={outerLineName}
          //x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2}
              x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
              style={{strokeWidth: "7", stroke: "lightgrey", strokeLinecap: "round", cursor: 'default'}} />

        <line id={innerLineName}
          //x1={this.props.startBlock.x} y1={this.props.startBlock.y} x2={this.props.endBlock.x} y2={this.props.endBlock.y}
          //    x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2}
              x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
              style={{strokeWidth: '5', stroke:"orange", cursor: 'default'}} />


      </g>
    )
  }
});

module.exports= EdgePreview;
