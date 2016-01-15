/**
 * Created by twi18192 on 14/01/16.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var NodeStore = require('../stores/nodeStore.js');
var nodeActions = require('../actions/nodeActions.js');
var paneActions = require('../actions/paneActions');

var Ports = require('./ports.js');

function getNodeState(){
  return{
    //position: NodeStore.getTGenNodePosition(),
    //inports: NodeStore.getTGenNodeInportsState(),
    //outports: NodeStore.getTGenNodeOutportsState()
    //selected: NodeStore.getTGen1SelectedState(), /* Old selected state */
    areAnyNodesSelected: NodeStore.getIfAnyNodesAreSelected(),
    defaultStyling: NodeStore.getTGenNodeStyling(),
    selectedStyling: NodeStore.getSelectedTGenNodeStyling(),
    //allNodePositions: NodeStore.getAllNodePositions(),
    allNodeInfo: NodeStore.getAllNodeInfo(),
    portThatHasBeenClicked: NodeStore.getPortThatHasBeenClicked(),
    storingFirstPortClicked: NodeStore.getStoringFirstPortClicked(),
    portMouseOver: NodeStore.getPortMouseOver(),

    //allNodeTypesPortStyling: NodeStore.getAllNodeTypesPortStyling(),
    allNodeTypesStyling: NodeStore.getAllNodeTypesStyling()
  }
}

var Node = React.createClass({
  getInitialState: function(){
    return getNodeState();
  },

  _onChange: function(){
    this.setState(getNodeState());
    this.setState({selected: NodeStore.getAnyNodeSelectedState((ReactDOM.findDOMNode(this).id))});
    //this.setState({nodePosition: NodeStore.getAnyNodePosition(ReactDOM.findDOMNode(this).id)});

  },

  componentDidMount: function(){
    NodeStore.addChangeListener(this._onChange);
    console.log(this.props);
    console.log(this.state);

    ReactDOM.findDOMNode(this).addEventListener('NodeSelect', this.nodeSelect);
    this.setState({selected: NodeStore.getAnyNodeSelectedState((ReactDOM.findDOMNode(this).id))}, function(){ /* Can't put into getInitialState since the DOMNode isn't mounted yet apparently */
      console.log(this.state.selected);

      console.log("A node has been mounted"); });
    //this.setState({nodePosition: NodeStore.getAnyNodePosition(ReactDOM.findDOMNode(this).id)}, function(){
    //  console.log(this.state.nodePosition);
    //});
  },

  componentWillUnmount: function(){
    NodeStore.removeChangeListener(this._onChange)
  },

  nodeClick: function(){
    console.log("node has been clicked!");
  },

  nodeDrag: function(){
    console.log("node has been dragged!");
  },

  mouseOver: function(){
    //console.log("mouseOver");
    var rectangleName = this.props.id.concat("Rectangle");
    var test = document.getElementById(rectangleName);
    test.style.stroke = '#797979'
  },

  mouseLeave: function(){
    //console.log("mouseLeave");
    var rectangleName = this.props.id.concat("Rectangle");
    var test = document.getElementById(rectangleName);

    if(this.state.selected === true){
      console.log("this.state.selected is true, so don't reset the border colour");
    }
    else{
      test.style.stroke = 'black'
    }
  },

  nodeSelect: function(){
    console.log("TGen1 has been selected");
    //nodeActions.deselectAllNodes("deselect all nodes");
    if(this.state.portMouseOver === true){
      console.log("hovering over port, so will likely want a portClick if a click occurs rather than a nodeSelect");
    }
    else if(this.state.portMouseOver === false){
      nodeActions.selectNode(ReactDOM.findDOMNode(this).id);
      paneActions.openNodeTab(ReactDOM.findDOMNode(this).id);
      console.log(this.state.selected);
    }

  },

  mouseDown: function(e){
    console.log("TGen1 mouseDown");
    console.log(e.currentTarget);
    console.log(e.currentTarget.parentNode);
    nodeActions.draggedElement(e.currentTarget.parentNode);
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
  //portSelect: function(){
  //  console.log("portClick has occured, so a port has been selected");
  //
  //},


  render: function(){

    console.log("portThatHasBeenClicked is: " + this.state.portThatHasBeenClicked);

    /* Unecessary now that I don't want the ports to focus on node selection (I think? =P) */

    //if(this.state.selected === true){
    //  var currentStyling = this.state.selectedStyling;
    //}
    //else{
    //  var currentStyling = this.state.defaultStyling;
    //}
    //
    //var rectangleStyling = currentStyling.rectangle.rectangleStyling;
    //var rectanglePosition = currentStyling.rectangle.rectanglePosition;
    //var inportPositions = currentStyling.ports.portPositions.inportPositions;
    //var portStyling = currentStyling.ports.portStyling;
    //var outportPositions = currentStyling.ports.portPositions.outportPositions;
    //var textPosition = currentStyling.text.textPositions;

    var nodeInfo = this.state.allNodeInfo[this.props.id];
    var nodePositionX = nodeInfo.position.x;
    var nodePositionY = nodeInfo.position.y;
    var nodeTranslate = "translate(" + nodePositionX + "," + nodePositionY + ")";

    //var nodeName = nodeInfo.name;
    var rectangleString = "Rectangle";
    var rectangleName = this.props.id.concat(rectangleString);

    /* Trying to automatically generate the correct ports and port text */
    /* NOTE: This will run on every render, so all the ports will be reset back to an empty array and then iterate through the loops to recreate them...
      I Suppose I could try moving these into methods of the component instead, and them running them once at the start of the node's lifetime? */

    //var nodePortsStyling = this.state.allNodeTypesPortStyling; /* Need the styling of everything, not just the port positions, so I need to alter the object I get from the store to be all the styling and not just the different node's PORT stylign */
    var allNodeTypesStyling = this.state.allNodeTypesStyling;
    var nodeType = nodeInfo.type;

    return (
      <g {...this.props} onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave} style={this.state.selected && this.state.areAnyNodesSelected || !this.state.selected && !this.state.areAnyNodesSelected ? window.NodeContainerStyle : window.nonSelectedNodeContainerStyle}
                         transform={nodeTranslate}
      >

        <g style={{MozUserSelect: 'none'}} onMouseDown={this.mouseDown} >
          <rect id="nodeBackground" height="105" width="65" style={{fill: 'transparent', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default"}}/> /* To allow the cursor to change when hovering over the entire node container */

          <rect id={rectangleName} height={allNodeTypesStyling[nodeType].rectangle.rectangleStyling.height} width={allNodeTypesStyling[nodeType].rectangle.rectangleStyling.width} x={0} y={0} rx={7} ry={7}
                     style={{fill: 'lightgrey', 'strokeWidth': 1.65, stroke: this.state.selected ? '#797979' : 'black', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default"}}
            //onClick={this.nodeClick} onDragStart={this.nodeDrag}
          />

          <Ports nodeId={this.props.id} />

        </g>

      </g>
    )
  }
});

module.exports = Node;

//<Port cx={inportPositions.ena.x} cy={inportPositions.ena.y} r={portStyling.portRadius} id="ena"
//      style={{fill: portStyling.fill, stroke: portStyling.stroke, 'strokeWidth': 1.65}}/>
//<Port cx={outportPositions.posn.x} cy={outportPositions.posn.y} r={portStyling.portRadius} className="posn"
//style={{fill: portStyling.fill, stroke: portStyling.stroke, 'strokeWidth': 1.65}}
//onMouseDown={this.portMouseDown} onMouseUp={this.portMouseUp} onMouseOver={this.portMouseOver} onMouseLeave={this.portMouseLeave} />

//<InportEnaText x={textPosition.ena.x} y={textPosition.ena.y} style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default"}} />
//<OutportPosnText x={textPosition.posn.x} y={textPosition.posn.y} style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default"}} />


//{inports}
//
//{outports}
//
//{portsText}

//var inports = [];
//var inportsXCoord; /* This will be used when I change the port styling obejct to not give every inport its own x coord, but instead have it higher up and give it to all of them at once */
//var outports = [];
//var outportsXCoord;
//var portsText = [];
//
//console.log(nodeInfo.inports);
//
//for(i = 0; i < nodeInfo.inports.length; i++){
//  var inportName = nodeInfo.inports[i].name;
//  console.log(allNodeTypesStyling[nodeType]);
//  inports.push(
//    <circle className={inportName} cx={allNodeTypesStyling[nodeType].ports.portPositions.inportPositions[inportName].x} cy={allNodeTypesStyling[nodeType].ports.portPositions.inportPositions[inportName].y}
//          r={allNodeTypesStyling[nodeType].ports.portStyling.portRadius} style={{fill: allNodeTypesStyling[nodeType].ports.portStyling.fill, stroke: allNodeTypesStyling[nodeType].ports.portStyling.stroke, strokeWidth: 1.65 }}
//          onMouseDown={this.portMouseDown} onMouseUp={this.portMouseUp}
//    />
//  );
//  /* Taking care of the inport text too */
//  portsText.push(
//    <text x={allNodeTypesStyling[nodeType].text.textPositions[inportName].x} y={allNodeTypesStyling[nodeType].text.textPositions[inportName].y}
//          style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default", fontSize:"10px", fontFamily: "Verdana"}}
//    >
//      {inportName}
//    </text>
//  )
//}
//
//for(j = 0; j < nodeInfo.outports.length; j++){
//  var outportName = nodeInfo.outports[j].name;
//  outports.push(
//    <circle className={outportName} cx={allNodeTypesStyling[nodeType].ports.portPositions.outportPositions[outportName].x} cy={allNodeTypesStyling[nodeType].ports.portPositions.outportPositions[outportName].y}
//          r={allNodeTypesStyling[nodeType].ports.portStyling.portRadius} style={{fill: allNodeTypesStyling[nodeType].ports.portStyling.fill, stroke: allNodeTypesStyling[nodeType].ports.portStyling.stroke, strokeWidth: 1.65 }}
//          onMouseDown={this.portMouseDown} onMouseUp={this.portMouseUp}
//    />
//  );
//  portsText.push(
//    <text x={allNodeTypesStyling[nodeType].text.textPositions[outportName].x} y={allNodeTypesStyling[nodeType].text.textPositions[outportName].y}
//          style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default", fontSize:"10px", fontFamily: "Verdana"}}
//    >
//      {outportName}
//    </text>
//  )
//}
//
///* Now just need to add the node name and node type text as well */
///* Hmm, where should I get/calculate their position & height from?... */
//
//portsText.push([
//  <text className="nodeName" style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default", textAnchor: 'middle', alignmentBaseline: 'middle', fontSize:"15px", fontFamily: "Verdana"}}
//        transform="translate(32.5, 80)" >
//    {nodeInfo.name}
//  </text>,
//
//  <text className="nodeType" style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default", textAnchor: 'middle', alignmentBaseline: 'middle', fontSize: "8px", fontFamily: "Verdana"}}
//        transform="translate(32.5, 93)" >
//    {nodeInfo.type}
//  </text>
//]);
//
//console.log(inports);
//console.log(outports);
//console.log(portsText);
