/**
 * Created by twi18192 on 10/12/15.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var NodeStore = require('../stores/nodeStore.js');
var nodeActions = require('../actions/nodeActions.js');

function getEdgeState(){
  return {
    //startNode: NodeStore.getGateNodeOutPort(),
    //endNode: NodeStore.getTGenNodeEnaPort(),

    Gate1Position: NodeStore.getGate1Position(),
    TGen1Position: NodeStore.getTGen1Position(),
    gateNodeOut: NodeStore.getGateNodeOutportOut(),
    tgenNodeEna: NodeStore.getTGenNodeInportEna(),
    selected: NodeStore.getIfEdgeIsSelected(),
    allEdges: NodeStore.getAllEdges(),
    gateNodeStyling: NodeStore.getGateNodeStyling(),
    tgenNodeStyling: NodeStore.getTGenNodeStyling(),
    pcompNodeStyling: NodeStore.getPCompNodeStyling(),
    //allNodePositions: NodeStore.getAllNodePositions(),
    allNodeTypesPortStyling: NodeStore.getAllNodeTypesPortStyling(),
    allNodeInfo: NodeStore.getAllNodeInfo()
  }
}

var Edge = React.createClass({
  getInitialState: function(){
    return getEdgeState();
  },
  _onChange: function(){
    this.setState(getEdgeState());
  },
  componentDidMount: function(){
    NodeStore.addChangeListener(this._onChange);
    ReactDOM.findDOMNode(this).addEventListener('EdgeSelect', this.edgeSelect);
  },
  componentWillUnmount: function(){
    NodeStore.removeChangeListener(this._onChange);
  },
  mouseOver: function(){
    var test = document.getElementById('outerLine');
    if(this.state.selected === true){

    }
    else{
      test.style.stroke = '#797979'
    }
  },
  mouseLeave: function(){
    var test = document.getElementById('outerLine');
    if(this.state.selected === true){
      console.log("this.state.selected is true, so don't reset the border colour");
    }
    else{
      console.log("this.state.selected is false");
      test.style.stroke = 'lightgrey'
    }
  },
  edgeSelect: function(){
    console.log("edge has been selected");
    nodeActions.selectEdge(ReactDOM.findDOMNode(this).id);
  },

  render:function(){

    var edgeInfo = this.state.allEdges[this.props.id];
    console.log(this.props.id);
    console.log(edgeInfo);

    var gateNodeRegExp = /Gate/;
    var tgenNodeRegExp = /TGen/;
    var pcompNodeRegExp = /PComp/;
    var lutNodeRegExp = /LUT/;

    var gateNodeInportPositioning = this.state.gateNodeStyling.ports.portPositions.inportPositions;
    var gateNodeOutportPositioning = this.state.gateNodeStyling.ports.portPositions.outportPositions;
    var tgenNodeInportPositioning = this.state.tgenNodeStyling.ports.portPositions.inportPositions;
    var tgenNodeOutportPositioning = this.state.tgenNodeStyling.ports.portPositions.outportPositions;
    var pcompNodeInportPositioning = this.state.pcompNodeStyling.ports.portPositions.inportPositions;
    var pcompNodeOutportPositioning = this.state.pcompNodeStyling.ports.portPositions.outportPositions;

    var allEdges = this.state.allEdges;
    console.log(allEdges);

    var fromNode = edgeInfo.fromNode;
    var toNode = edgeInfo.toNode;
    //console.log(fromNode);
    //console.log(toNode);
    var fromNodePort = edgeInfo.fromNodePort;
    var toNodePort = edgeInfo.toNodePort;
    //console.log(document.getElementById(fromNode)); /* Since the positions of the nodes are in the store, I should really retrieve the node positions from there and not the DOM element position... */
    //console.log(this.state.allNodePositions[fromNode].position); /* Position of fromNode */
    //console.log(this.state.allNodePositions[toNode].position);
    var fromNodePositionX = this.state.allNodeInfo[fromNode].position.x;
    var fromNodePositionY = this.state.allNodeInfo[fromNode].position.y;
    var toNodePositionX = this.state.allNodeInfo[toNode].position.x;
    var toNodePositionY = this.state.allNodeInfo[toNode].position.y;
    //console.log(fromNodePositionX);
    //console.log(fromNodePositionY);

    /* fromNodes */
    if(gateNodeRegExp.test(fromNode) === true){
      var startOfEdgePortOffsetX = gateNodeOutportPositioning[fromNodePort].x;
      var startOfEdgePortOffsetY = gateNodeOutportPositioning[fromNodePort].y;
      //console.log(startOfEdgePortOffsetX);
      //console.log(startOfEdgePortOffsetY);
      var startOfEdgeX = fromNodePositionX + startOfEdgePortOffsetX;
      var startOfEdgeY = fromNodePositionY + startOfEdgePortOffsetY;
      //console.log(startOfEdgeX);
      //console.log(startOfEdgeY);
    }
    else if(tgenNodeRegExp.test(fromNode) === true){
      var startOfEdgePortOffsetX = tgenNodeOutportPositioning[fromNodePort].x;
      var startOfEdgePortOffsetY = tgenNodeOutportPositioning[fromNodePort].y;
      var startOfEdgeX = fromNodePositionX + startOfEdgePortOffsetX;
      var startOfEdgeY = fromNodePositionY + startOfEdgePortOffsetY;
    }
    else if(pcompNodeRegExp.test(fromNode) === true){
      var startOfEdgePortOffsetX = pcompNodeOutportPositioning[fromNodePort].x;
      var startOfEdgePortOffsetY = pcompNodeOutportPositioning[fromNodePort].y;
      var startOfEdgeX = fromNodePositionX + startOfEdgePortOffsetX;
      var startOfEdgeY = fromNodePositionY + startOfEdgePortOffsetY;
    }

    /* toNodes */
    if(tgenNodeRegExp.test(toNode) === true){
      var endOfEdgePortOffsetX = tgenNodeInportPositioning[toNodePort].x;
      var endOfEdgePortOffsetY = tgenNodeInportPositioning[toNodePort].y;
      var endOfEdgeX = toNodePositionX + endOfEdgePortOffsetX;
      var endOfEdgeY = toNodePositionY + endOfEdgePortOffsetY;
      //console.log(endOfEdgeX);
      //console.log(endOfEdgeY);
    }
    else if(gateNodeRegExp.test(toNode) === true){
      var endOfEdgePortOffsetX = gateNodeInportPositioning[toNodePort].x;
      var endOfEdgePortOffsetY = gateNodeInportPositioning[toNodePort].y;
      var endOfEdgeX = toNodePositionX + endOfEdgePortOffsetX;
      var endOfEdgeY = toNodePositionY + endOfEdgePortOffsetY;
    }
    else if(pcompNodeRegExp.test(toNode) === true){
      var endOfEdgePortOffsetX = pcompNodeInportPositioning[toNodePort].x;
      var endOfEdgePortOffsetY = pcompNodeInportPositioning[toNodePort].y;
      var endOfEdgeX = toNodePositionX + endOfEdgePortOffsetX;
      var endOfEdgeY = toNodePositionY + endOfEdgePortOffsetY;
    }

    //edges.push(<Edge id={edge}
    //                 x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
    //                 onMouseDown={this.edgeMouseDown} onMouseUp={this.edgeMouseUp}
    ///>)



    return(
      <g id="edgeContainer" {...this.props}>

        <Line id="outerLine" onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave}
              //x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2}
              x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
              style={{strokeWidth: this.state.selected === true ? "10" : "7", stroke: this.state.selected === true ? "#797979" : "lightgrey", strokeLinecap: "round"}} />

        <Line id="innerLine" onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave}
          //x1={this.state.startNode.x} y1={this.state.startNode.y} x2={this.state.endNode.x} y2={this.state.endNode.y}
          //    x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2}
              x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
              style={{strokeWidth: '5', stroke:"orange"}} />


      </g>
    )
  }
});

var Line = React.createClass({
  render: function(){
    return(
      <line {...this.props}>{this.props.children}</line>
    )
  }
});

module.exports = Edge;
