/**
 * Created by twi18192 on 04/02/16.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('react-dom');

var flowChartActions = require('../actions/flowChartActions');

var interact = require('../../node_modules/interact.js');

var Perf = require('../../node_modules/react/lib/ReactDefaultPerf.js');


var EdgePreview = React.createClass({

  getInitialState: function(){
    return{
      noPanning: true
    }
  },

  componentDidMount: function(){

    Perf.start();
    interact('#appAndDragAreaContainer')
      .on('move', this.interactJSMouseMoveForEdgePreview);

    interact(ReactDOM.findDOMNode(this))
      .draggable({

        onstart: function(e){
          e.stopImmediatePropagation();
          e.stopPropagation();
          interact('#appAndDragAreaContainer')
            .off('move', this.interactJSMouseMoveForEdgePreview);
        }.bind(this),

        onmove: function(e){
          e.stopImmediatePropagation();
          e.stopPropagation();
          this.props.interactJsDragPan(e);
        }.bind(this),

        onend: function(e){
          e.stopImmediatePropagation();
          e.stopPropagation();

          this.setState({noPanning: true}, function(){
            interact('#appAndDragAreaContainer')
              .on('move', this.interactJSMouseMoveForEdgePreview);
          });

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
    return this.state.noPanning
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

    interact('#appAndDragAreaContainer')
      .off('move', this.interactJSMouseMoveForEdgePreview);
    this.props.failedPortConnection();
  },

  onMouseDown: function(e){
    e.stopImmediatePropagation();
    e.stopPropagation();

    this.setState({noPanning: false}, function(){
      interact('#appAndDragAreaContainer')
        .off('move', this.interactJSMouseMoveForEdgePreview);
    });
  },

  render:function(){
    console.log("render: edgePreview");

    var blockStyling = this.props.blockStyling;

    var fromBlockInfo = this.props.edgePreview.fromBlockInfo;

    var fromBlockPositionX = this.props.fromBlockPosition.x;
    var fromBlockPositionY = this.props.fromBlockPosition.y;

    var portValueType;
    var startOfEdgePortOffsetX;
    var startOfEdgePortOffsetY;

    if(fromBlockInfo.fromBlockPortType === "inport"){
      var inportArrayLength = this.props.fromBlockInfo.inports.length;
      var inportArrayIndex;
      var inportValueType;
      for(var j = 0; j < inportArrayLength; j++){
        if(this.props.fromBlockInfo.inports[j].name === fromBlockInfo.fromBlockPort){
          inportArrayIndex = JSON.parse(JSON.stringify(j));
          inportValueType = this.props.fromBlockInfo.inports[inportArrayIndex].type;
          portValueType = inportValueType;
        }
      }
      startOfEdgePortOffsetX = 0;
      startOfEdgePortOffsetY = blockStyling.outerRectangleHeight / (inportArrayLength + 1) * (inportArrayIndex + 1);
    }
    else if(fromBlockInfo.fromBlockPortType === "outport") {
      var outportArrayLength = this.props.fromBlockInfo.outports.length;
      var outportArrayIndex;
      var outportValueType;

      for(var i = 0; i < outportArrayLength; i++){
        if(this.props.fromBlockInfo.outports[i].name === fromBlockInfo.fromBlockPort){
          outportArrayIndex = JSON.parse(JSON.stringify(i));
          outportValueType = this.props.fromBlockInfo.outports[outportArrayIndex].type;
          portValueType = outportValueType;
        }
      }
      startOfEdgePortOffsetX = blockStyling.outerRectangleWidth;
      startOfEdgePortOffsetY = blockStyling.outerRectangleHeight / (outportArrayLength + 1) * (outportArrayIndex + 1);
    }

    var startOfEdgeX = fromBlockPositionX + startOfEdgePortOffsetX;
    var startOfEdgeY = fromBlockPositionY + startOfEdgePortOffsetY;

    var endOfEdgeX = this.props.edgePreview.endpointCoords.x;
    var endOfEdgeY = this.props.edgePreview.endpointCoords.y;

    var innerLineString = "-innerline";
    var outerLineString = "-outerline";
    var innerLineName = this.props.id.concat(innerLineString);
    var outerLineName = this.props.id.concat(outerLineString);

    /* Trying curvy lines! */

    var sourceX = startOfEdgeX;
    var sourceY = startOfEdgeY;
    var targetX = endOfEdgeX;
    var targetY = endOfEdgeY;

    var c1X, c1Y, c2X, c2Y;

    /* I think nodeSize is the block height or width, not sure which one though? */

    if ((targetX - 5 < sourceX && fromBlockInfo.fromBlockPortType === "outport") ||
      (targetX - 5 > sourceX && fromBlockInfo.fromBlockPortType === "inport")) {
      var curveFactor = (sourceX - targetX) * blockStyling.outerRectangleHeight/200;
      if (Math.abs(targetY - sourceY) < blockStyling.outerRectangleHeight/2) {
        // Loopback
        c1X = sourceX + curveFactor;
        c1Y = sourceY - curveFactor;
        c2X = targetX - curveFactor;
        c2Y = targetY - curveFactor;
      } else {
        // Stick out some
        c1X = sourceX + curveFactor;
        c1Y = sourceY + (targetY > sourceY ? curveFactor : -curveFactor);
        c2X = targetX - curveFactor;
        c2Y = targetY + (targetY > sourceY ? -curveFactor : curveFactor);
      }
    } else {
      // Controls halfway between
      c1X = sourceX + (targetX - sourceX)/2;
      c1Y = sourceY;
      c2X = c1X;
      c2Y = targetY;
    }

    var pathInfo = [
      "M",
      sourceX, sourceY,
      "C",
      c1X, c1Y,
      c2X, c2Y,
      targetX, targetY
    ];

    pathInfo = pathInfo.join(" ");


    return(
      <g id="edgePreviewContainer" {...this.props}>

        <path id={outerLineName} className="edgePreviewOuterLine"
              d={pathInfo} />

        <path id={innerLineName} className={"edgePreviewInnerLine" + (portValueType === 'pos' ? 'POS' : 'BIT')}
              d={pathInfo} />

      </g>
    )
  }
});

module.exports= EdgePreview;
