/**
 * Created by twi18192 on 04/02/16.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var blockStore = require('../stores/blockStore.js');
var blockActions = require('../actions/blockActions.js');

var interact = require('../../node_modules/interact.js');

var EdgePreview = React.createClass({

  componentDidMount: function(){
    //ReactDOM.findDOMNode(this).addEventListener('EdgeSelect', this.edgeSelect);
    //
    //interact(ReactDOM.findDOMNode(this))
    //  .on('tap', this.edgeSelect)
  },
  componentWillUnmount: function(){
    //interact(ReactDOM.findDOMNode(this))
    //  .off('tap', this.edgeSelect)
  },

  render:function(){

    console.log(this.props.id);
    var fromBlockInfo = this.props.edgePreview.fromBlockInfo;

    var allBlockTypesPortStyling = this.props.allBlockTypesPortStyling;

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
      var startOfEdgePortOffsetX = allBlockTypesPortStyling[fromBlockInfo.fromBlockType].inportPositions[fromBlockInfo.fromBlockPort].x;
      var startOfEdgePortOffsetY = allBlockTypesPortStyling[fromBlockInfo.fromBlockType].inportPositions[fromBlockInfo.fromBlockPort].y;
    }
    else if(fromBlockInfo.fromBlockPortType === "outport") {
      var startOfEdgePortOffsetX = allBlockTypesPortStyling[fromBlockInfo.fromBlockType].outportPositions[fromBlockInfo.fromBlockPort].x;
      var startOfEdgePortOffsetY = allBlockTypesPortStyling[fromBlockInfo.fromBlockType].outportPositions[fromBlockInfo.fromBlockPort].y;
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
              style={{strokeWidth: "7", stroke: "lightgrey", strokeLinecap: "round"}} />

        <line id={innerLineName}
          //x1={this.props.startBlock.x} y1={this.props.startBlock.y} x2={this.props.endBlock.x} y2={this.props.endBlock.y}
          //    x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2}
              x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
              style={{strokeWidth: '5', stroke:"orange"}} />


      </g>
    )
  }
});

module.exports= EdgePreview;
