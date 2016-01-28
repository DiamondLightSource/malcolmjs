/**
 * Created by twi18192 on 10/12/15.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var blockStore = require('../stores/blockStore.js');
var blockActions = require('../actions/blockActions.js');

var interact = require('../../node_modules/interact.js');

function getEdgeState(){
  return {
    //startNode: NodeStore.getGateNodeOutPort(),
    //endNode: NodeStore.getTGenNodeEnaPort(),

    //Gate1Position: NodeStore.getGate1Position(),
    //TGen1Position: NodeStore.getTGen1Position(),
    //gateNodeOut: NodeStore.getGateNodeOutportOut(),
    //tgenNodeEna: NodeStore.getTGenNodeInportEna(),
    //selected: NodeStore.getIfEdgeIsSelected(),
    //allEdges: NodeStore.getAllEdges(),
    //gateNodeStyling: NodeStore.getGateNodeStyling(),
    //tgenNodeStyling: NodeStore.getTGenNodeStyling(),
    //pcompNodeStyling: NodeStore.getPCompNodeStyling(),
    //allNodePositions: NodeStore.getAllNodePositions(),
    //allNodeTypesPortStyling: NodeStore.getAllNodeTypesPortStyling(),
    //allNodeInfo: NodeStore.getAllNodeInfo(),
    //areAnyEdgesSelected: NodeStore.getIfAnyEdgesAreSelected()
  }
}

var Edge = React.createClass({
  //getInitialState: function(){
  //  return getEdgeState();
  //},
  _onChange: function(){
    //this.setState(getEdgeState());
    //this.setState({selected: NodeStore.getIfEdgeIsSelected(ReactDOM.findDOMNode(this).id)});
  },
  componentDidMount: function(){
    ReactDOM.findDOMNode(this).addEventListener('EdgeSelect', this.edgeSelect);

    interact(ReactDOM.findDOMNode(this))
      .on('tap', this.edgeSelect)
  },
  componentWillUnmount: function(){
    interact(ReactDOM.findDOMNode(this))
      .off('tap', this.edgeSelect)
  },
  mouseOver: function(){
    var outerLineName = this.props.id.concat("-outerline");
    var test = document.getElementById(outerLineName);
    if(this.props.selected === true){

    }
    else{
      test.style.stroke = '#797979'
    }
  },
  mouseLeave: function(){
    var outerLineName = this.props.id.concat("-outerline");
    var test = document.getElementById(outerLineName);
    if(this.props.selected === true){
      console.log("this.props.selected is true, so don't reset the border colour");
    }
    else{
      console.log("this.props.selected is false");
      test.style.stroke = 'lightgrey'
    }
  },
  edgeSelect: function(e){
    e.stopImmediatePropagation();
    e.stopPropagation();
    console.log("edge has been selected");
    console.log(ReactDOM.findDOMNode(this).id);
    blockActions.selectEdge(ReactDOM.findDOMNode(this).id);
  },

  render:function(){

    /* Retiring allEdges in favour of calculating everything from allNodeInfo */
    //var edgeInfo = this.props.allEdges[this.props.id];
    //console.log(this.props.id);
    //console.log(edgeInfo);
    //
    //var allEdges = this.props.allEdges;
    //console.log(allEdges);
    console.log(this.props.id);
    var fromBlock = this.props.fromBlock;
    var toBlock = this.props.toBlock;
    //console.log(fromNode);
    //console.log(toNode);
    var fromBlockPort = this.props.fromBlockPort;
    var toBlockPort = this.props.toBlockPort;

    var allBlockTypesPortStyling = this.props.allBlockTypesPortStyling;

    var fromBlockType = this.props.fromBlockType;
    var toBlockType = this.props.toBlockType;

    //console.log(document.getElementById(fromNode)); /* Since the positions of the nodes are in the store, I should really retrieve the node positions from there and not the DOM element position... */
    //console.log(this.props.allNodePositions[fromNode].position); /* Position of fromNode */
    //console.log(this.props.allNodePositions[toNode].position);

    var fromBlockPositionX = this.props.allBlockInfo[fromBlock].position.x;
    var fromBlockPositionY = this.props.allBlockInfo[fromBlock].position.y;
    var toBlockPositionX = this.props.allBlockInfo[toBlock].position.x;
    var toBlockPositionY = this.props.allBlockInfo[toBlock].position.y;
    //console.log(fromNodePositionX);
    //console.log(fromNodePositionY);
    //
    //console.log(allNodeTypesPortStyling[fromNodeType]);
    //console.log(allNodeTypesPortStyling[fromNodeType].outportPositions);
    //console.log(fromNodePort);
    var startOfEdgePortOffsetX = allBlockTypesPortStyling[fromBlockType].outportPositions[fromBlockPort].x;
    var startOfEdgePortOffsetY = allBlockTypesPortStyling[fromBlockType].outportPositions[fromBlockPort].y;
    var startOfEdgeX = fromBlockPositionX + startOfEdgePortOffsetX;
    var startOfEdgeY = fromBlockPositionY + startOfEdgePortOffsetY;

    var endOfEdgePortOffsetX = allBlockTypesPortStyling[toBlockType].inportPositions[toBlockPort].x;
    var endOfEdgePortOffsetY = allBlockTypesPortStyling[toBlockType].inportPositions[toBlockPort].y;
    var endOfEdgeX = toBlockPositionX + endOfEdgePortOffsetX;
    var endOfEdgeY = toBlockPositionY + endOfEdgePortOffsetY;

    var innerLineString = "-innerline";
    var outerLineString = "-outerline";
    var innerLineName = this.props.id.concat(innerLineString);
    var outerLineName = this.props.id.concat(outerLineString);


    return(
      <g id="edgeContainer" {...this.props}>

        <line id={outerLineName} onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave}
              //x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2}
              x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
              style={{strokeWidth: this.props.selected === true ? "10" : "7", stroke: this.props.selected === true ? "#797979" : "lightgrey", strokeLinecap: "round"}} />

        <line id={innerLineName} onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave}
          //x1={this.props.startBlock.x} y1={this.props.startBlock.y} x2={this.props.endBlock.x} y2={this.props.endBlock.y}
          //    x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2}
              x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
              style={{strokeWidth: '5', stroke:"orange"}} />


      </g>
    )
  }
});

//var Line = React.createClass({
//  render: function(){
//    return(
//      <line {...this.props}>{this.props.children}</line>
//    )
//  }
//});

module.exports = Edge;

//var gateNodeRegExp = /Gate/;
//var tgenNodeRegExp = /TGen/;
//var pcompNodeRegExp = /PComp/;
//var lutNodeRegExp = /LUT/;
//
//var gateNodeInportPositioning = this.state.gateNodeStyling.ports.portPositions.inportPositions;
//var gateNodeOutportPositioning = this.state.gateNodeStyling.ports.portPositions.outportPositions;
//var tgenNodeInportPositioning = this.state.tgenNodeStyling.ports.portPositions.inportPositions;
//var tgenNodeOutportPositioning = this.state.tgenNodeStyling.ports.portPositions.outportPositions;
//var pcompNodeInportPositioning = this.state.pcompNodeStyling.ports.portPositions.inportPositions;
//var pcompNodeOutportPositioning = this.state.pcompNodeStyling.ports.portPositions.outportPositions;

/* fromNodes */
//if(gateNodeRegExp.test(fromNode) === true){
//  var startOfEdgePortOffsetX = gateNodeOutportPositioning[fromNodePort].x;
//  var startOfEdgePortOffsetY = gateNodeOutportPositioning[fromNodePort].y;
//  //console.log(startOfEdgePortOffsetX);
//  //console.log(startOfEdgePortOffsetY);
//  var startOfEdgeX = fromNodePositionX + startOfEdgePortOffsetX;
//  var startOfEdgeY = fromNodePositionY + startOfEdgePortOffsetY;
//  //console.log(startOfEdgeX);
//  //console.log(startOfEdgeY);
//}
//else if(tgenNodeRegExp.test(fromNode) === true){
//  var startOfEdgePortOffsetX = tgenNodeOutportPositioning[fromNodePort].x;
//  var startOfEdgePortOffsetY = tgenNodeOutportPositioning[fromNodePort].y;
//  var startOfEdgeX = fromNodePositionX + startOfEdgePortOffsetX;
//  var startOfEdgeY = fromNodePositionY + startOfEdgePortOffsetY;
//}
//else if(pcompNodeRegExp.test(fromNode) === true){
//  var startOfEdgePortOffsetX = pcompNodeOutportPositioning[fromNodePort].x;
//  var startOfEdgePortOffsetY = pcompNodeOutportPositioning[fromNodePort].y;
//  var startOfEdgeX = fromNodePositionX + startOfEdgePortOffsetX;
//  var startOfEdgeY = fromNodePositionY + startOfEdgePortOffsetY;
//}
//
///* toNodes */
//if(tgenNodeRegExp.test(toNode) === true){
//  var endOfEdgePortOffsetX = tgenNodeInportPositioning[toNodePort].x;
//  var endOfEdgePortOffsetY = tgenNodeInportPositioning[toNodePort].y;
//  var endOfEdgeX = toNodePositionX + endOfEdgePortOffsetX;
//  var endOfEdgeY = toNodePositionY + endOfEdgePortOffsetY;
//  //console.log(endOfEdgeX);
//  //console.log(endOfEdgeY);
//}
//else if(gateNodeRegExp.test(toNode) === true){
//  var endOfEdgePortOffsetX = gateNodeInportPositioning[toNodePort].x;
//  var endOfEdgePortOffsetY = gateNodeInportPositioning[toNodePort].y;
//  var endOfEdgeX = toNodePositionX + endOfEdgePortOffsetX;
//  var endOfEdgeY = toNodePositionY + endOfEdgePortOffsetY;
//}
//else if(pcompNodeRegExp.test(toNode) === true){
//  var endOfEdgePortOffsetX = pcompNodeInportPositioning[toNodePort].x;
//  var endOfEdgePortOffsetY = pcompNodeInportPositioning[toNodePort].y;
//  var endOfEdgeX = toNodePositionX + endOfEdgePortOffsetX;
//  var endOfEdgeY = toNodePositionY + endOfEdgePortOffsetY;
//}
