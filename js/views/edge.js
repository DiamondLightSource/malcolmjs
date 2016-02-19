/**
 * Created by twi18192 on 10/12/15.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var blockStore = require('../stores/blockStore.js');
var blockActions = require('../actions/blockActions.js');
var paneActions = require('../actions/paneActions');
var flowChartActions = require('../actions/flowChartActions');

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
      .on('tap', this.edgeSelect);

    window.addEventListener('keydown', this.keyPress);

  },
  componentWillUnmount: function(){
    interact(ReactDOM.findDOMNode(this))
      .off('tap', this.edgeSelect);

    window.removeEventListener('keydown', this.keyPress);

  },

  shouldComponentUpdate: function(nextProps, nextState){
    return (
      nextProps.selected !== this.props.selected ||
      nextProps.areAnyEdgesSelected !== this.props.areAnyEdgesSelected ||
      nextProps.fromBlockPosition.x !== this.props.fromBlockPosition.x ||
      nextProps.fromBlockPosition.y !== this.props.fromBlockPosition.y ||
      nextProps.toBlockPosition.x !== this.props.toBlockPosition.x ||
      nextProps.toBlockPosition.y !== this.props.toBlockPosition.y
    )
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
      //console.log("this.props.selected is true, so don't reset the border colour");
    }
    else{
      //console.log("this.props.selected is false");
      test.style.stroke = 'lightgrey'
    }
  },
  edgeSelect: function(e){
    e.stopImmediatePropagation();
    e.stopPropagation();
    //console.log("edge has been selected");
    flowChartActions.selectEdge(ReactDOM.findDOMNode(this).id);
    paneActions.openEdgeTab({
      edgeId: ReactDOM.findDOMNode(this).id,
      fromBlock: this.props.fromBlock,
      fromBlockPort: this.props.fromBlockPort,
      toBlock: this.props.toBlock,
      toBlockPort: this.props.toBlockPort
    });
  },

  keyPress: function(e){
    //console.log("key press!");
    //console.log(e);

    if(e.keyCode === 46){
      //console.log("delete key has been pressed");
      if(this.props.areAnyEdgesSelected === true){
        if(this.props.selected === true){
          /* Delete this particular edge */

          /* The fromBlock is ALWAYS the block with the inport at this stage, so no need to worry about potentially
          switching it around
           */
          blockActions.deleteEdge({
            fromBlock: this.props.fromBlock,
            fromBlockPort: this.props.fromBlockPort,
            toBlock: this.props.toBlock,
            toBlockPort: this.props.toBlockPort,
            edgeId: this.props.id
          });

          /* Reset both ports' styling to normal again */

          var fromBlockPortElement = document.getElementById(this.props.fromBlock + this.props.fromBlockPort);

          var toBlockPortElement = document.getElementById(this.props.toBlock + this.props.toBlockPort);

          //fromBlockPortElement.style.stroke = "black";
          fromBlockPortElement.style.fill = "grey";
          //fromBlockPortElement.setAttribute('r', 2);

          //toBlockPortElement.style.stroke = "black";
          toBlockPortElement.style.fill = "grey";
          //toBlockPortElement.setAttribute('r', 2);

        }

        else if(this.props.selected === false){
          /* Do nothing to this edge since it isn't the selected edge */
        }
      }
      else if(this.props.areAnyEdgesSelected === false){
        //console.log("no edges are selected, so don't delete anything");
      }
    }
  },

  render:function(){
    console.log("render: edges");

    var blockStyling = this.props.blockStyling;

    /* Retiring allEdges in favour of calculating everything from allNodeInfo */
    //var edgeInfo = this.props.allEdges[this.props.id];
    //console.log(this.props.id);
    //console.log(edgeInfo);
    //
    //var allEdges = this.props.allEdges;
    //console.log(allEdges);
    var fromBlock = this.props.fromBlock;
    var toBlock = this.props.toBlock;
    //console.log(fromNode);
    //console.log(toNode);
    var fromBlockPort = this.props.fromBlockPort;
    var toBlockPort = this.props.toBlockPort;

    var fromBlockType = this.props.fromBlockType;
    var toBlockType = this.props.toBlockType;

    //console.log(document.getElementById(fromNode)); /* Since the positions of the nodes are in the store, I should really retrieve the node positions from there and not the DOM element position... */
    //console.log(this.props.allNodePositions[fromNode].position); /* Position of fromNode */
    //console.log(this.props.allNodePositions[toNode].position);

    var fromBlockPositionX = this.props.fromBlockPosition.x;
    var fromBlockPositionY = this.props.fromBlockPosition.y;
    var toBlockPositionX = this.props.toBlockPosition.x;
    var toBlockPositionY = this.props.toBlockPosition.y;
    //console.log(fromNodePositionX);
    //console.log(fromNodePositionY);
    //
    //console.log(allNodeTypesPortStyling[fromNodeType]);
    //console.log(allNodeTypesPortStyling[fromNodeType].outportPositions);
    //console.log(fromNodePort);

    var outportArrayLength = this.props.fromBlockInfo.outports.length;
    var outportArrayIndex;
    for(var i = 0; i < outportArrayLength; i++){
      if(this.props.fromBlockInfo.outports[i].name === fromBlockPort){
        outportArrayIndex = JSON.parse(JSON.stringify(i));
      }
    }

    var startOfEdgePortOffsetX = blockStyling.outerRectangleWidth;
    var startOfEdgePortOffsetY = blockStyling.outerRectangleHeight / (outportArrayLength + 1) * (outportArrayIndex + 1);
    var startOfEdgeX = fromBlockPositionX + startOfEdgePortOffsetX;
    var startOfEdgeY = fromBlockPositionY + startOfEdgePortOffsetY;

    var endOfEdgePortOffsetX = 0;
    var endOfEdgePortOffsetY = blockStyling.outerRectangleHeight / (this.props.inportArrayLength + 1) * (this.props.inportArrayIndex + 1);
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
              style={{strokeWidth: this.props.selected === true ? "10" : "7",
               stroke: this.props.selected === true ? "#797979" : "lightgrey", strokeLinecap: "round",
               cursor: 'default'}} />

        <line id={innerLineName} onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave}
          //x1={this.props.startBlock.x} y1={this.props.startBlock.y} x2={this.props.endBlock.x} y2={this.props.endBlock.y}
          //    x1={this.props.x1} y1={this.props.y1} x2={this.props.x2} y2={this.props.y2}
              x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
              style={{strokeWidth: '5', stroke:"orange", cursor: 'default'}} />


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
