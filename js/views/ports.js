/**
 * Created by twi18192 on 15/01/16.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var NodeStore = require('../stores/nodeStore.js');
var nodeActions = require('../actions/nodeActions.js');
var paneActions = require('../actions/paneActions');

function getPortState(){
  return{
    allNodeInfo: NodeStore.getAllNodeInfo(),
    allNodeTypesStyling: NodeStore.getAllNodeTypesStyling(),
    portThatHasBeenClicked: NodeStore.getPortThatHasBeenClicked(),
    storingFirstPortClicked: NodeStore.getStoringFirstPortClicked(),
  }
}

var Ports = React.createClass({
  getInitialState: function(){
    return getPortState();
  },
  componentDidMount: function(){
    NodeStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function(){
    NodeStore.removeChangeListener(this._onChange);
  },
  _onChange: function(){
    this.setState(getPortState());
  },

  portMouseDown: function(e){
    console.log("portMouseDown");
    console.log(e);
    nodeActions.passPortMouseDown(e.currentTarget);

    var portMouseDownCoords = {
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY
    };
    this.setState({portMouseDownCoords: portMouseDownCoords});
    var whichPort = e.currentTarget;
    console.log(whichPort);
  },
  portMouseUp: function(e){
    console.log("portMouseUp");
    console.log(e);
    var portMouseUpCoords = {
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY
    };
    if(this.state.portMouseDownCoords.x === portMouseUpCoords.x && this.state.portMouseDownCoords.y === portMouseUpCoords.y){
      console.log("zero mouse movement on portMOuseDown & Up, hence invoke portClick!");
      this.portClick(e);
    }
    else{
      console.log("some other mouse movement has occured between portMouseDown & Up, so portClick won't be invoked");
    }
  },
  portClick: function(e){
    console.log("portClick");
    /* Need to either invoke an action or fire an event to cause an edge to be drawn */
    /* Also, best have theGraphDiamond container emit the event, not just the port or the node, since then the listener will be in theGraphDiamond to then invoke the edge create function */
    var theGraphDiamondHandle = document.getElementById('appAndDragAreaContainer');
    var passingEvent = e;
    if(this.state.storingFirstPortClicked === null){
      console.log("storingFirstPortClicked is null, so will be running just edgePreview rather than connectEdge");
      theGraphDiamondHandle.dispatchEvent(EdgePreview);
    }
    else if(this.state.storingFirstPortClicked !== null){
      console.log("a port has already been clicked before, so dispatch TwoPortClicks");
      theGraphDiamondHandle.dispatchEvent(TwoPortClicks)
    }
    //theGraphDiamondHandle.dispatchEvent(PortSelect);
  },

  render: function(){

    var nodeId = this.props.nodeId;
    var nodeInfo = this.state.allNodeInfo[nodeId];

    var allNodeTypesStyling = this.state.allNodeTypesStyling;
    var nodeType = nodeInfo.type;
    var inports = [];
    var inportsXCoord;
    var outports = [];
    var outportsXCoord;
    var portsText = [];

    for(i = 0; i < nodeInfo.inports.length; i++){
      var inportName = nodeInfo.inports[i].name;
      console.log(allNodeTypesStyling[nodeType]);
      inports.push(
        <circle className={inportName} cx={allNodeTypesStyling[nodeType].ports.portPositions.inportPositions[inportName].x} cy={allNodeTypesStyling[nodeType].ports.portPositions.inportPositions[inportName].y}
                r={allNodeTypesStyling[nodeType].ports.portStyling.portRadius} style={{fill: allNodeTypesStyling[nodeType].ports.portStyling.fill, stroke: allNodeTypesStyling[nodeType].ports.portStyling.stroke, strokeWidth: 1.65 }}
                onMouseDown={this.portMouseDown} onMouseUp={this.portMouseUp}
        />
      );

      /* Taking care of the inport text too */
      portsText.push(
        <text x={allNodeTypesStyling[nodeType].text.textPositions[inportName].x} y={allNodeTypesStyling[nodeType].text.textPositions[inportName].y}
              style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default", fontSize:"10px", fontFamily: "Verdana"}}
        >
          {inportName}
        </text>
      )
    }

    for(j = 0; j < nodeInfo.outports.length; j++){
      var outportName = nodeInfo.outports[j].name;
      outports.push(
        <circle className={outportName} cx={allNodeTypesStyling[nodeType].ports.portPositions.outportPositions[outportName].x} cy={allNodeTypesStyling[nodeType].ports.portPositions.outportPositions[outportName].y}
                r={allNodeTypesStyling[nodeType].ports.portStyling.portRadius} style={{fill: allNodeTypesStyling[nodeType].ports.portStyling.fill, stroke: allNodeTypesStyling[nodeType].ports.portStyling.stroke, strokeWidth: 1.65 }}
                onMouseDown={this.portMouseDown} onMouseUp={this.portMouseUp}
        />
      );

      portsText.push(
        <text x={allNodeTypesStyling[nodeType].text.textPositions[outportName].x} y={allNodeTypesStyling[nodeType].text.textPositions[outportName].y}
              style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default", fontSize:"10px", fontFamily: "Verdana"}}
        >
          {outportName}
        </text>
      )
    }

    /* Now just need to add the node name and node type text as well */
    /* Hmm, where should I get/calculate their position & height from?... */

    portsText.push([
      <text className="nodeName" style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default", textAnchor: 'middle', alignmentBaseline: 'middle', fontSize:"15px", fontFamily: "Verdana"}}
            transform="translate(32.5, 80)" >
        {nodeInfo.name}
      </text>,

      <text className="nodeType" style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default", textAnchor: 'middle', alignmentBaseline: 'middle', fontSize: "8px", fontFamily: "Verdana"}}
            transform="translate(32.5, 93)" >
        {nodeInfo.type}
      </text>
    ]);

    return (
      <g id={nodeId + "-ports"} >
        {inports}
        {outports}
        {portsText}
      </g>

    )
  }
});

module.exports = Ports;
