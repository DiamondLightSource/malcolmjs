/**
 * Created by twi18192 on 14/01/16.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var NodeStore = require('../stores/nodeStore.js');
var nodeActions = require('../actions/nodeActions.js');
var paneActions = require('../actions/paneActions');

var Ports = require('./ports.js');
var NodeRectangle = require('./nodeRectangle');

var interact = require('../../node_modules/interact.js');

function getNodeState(){
  return{
    //position: NodeStore.getTGenNodePosition(),
    //inports: NodeStore.getTGenNodeInportsState(),
    //outports: NodeStore.getTGenNodeOutportsState()
    //selected: NodeStore.getTGen1SelectedState(), /* Old selected state */
    //areAnyNodesSelected: NodeStore.getIfAnyNodesAreSelected(),
    //defaultStyling: NodeStore.getTGenNodeStyling(),
    //selectedStyling: NodeStore.getSelectedTGenNodeStyling(),
    //allNodePositions: NodeStore.getAllNodePositions(),
    //allNodeInfo: NodeStore.getAllNodeInfo(),
    //portThatHasBeenClicked: NodeStore.getPortThatHasBeenClicked(),
    //storingFirstPortClicked: NodeStore.getStoringFirstPortClicked(),
    //portMouseOver: NodeStore.getPortMouseOver(),

    //allNodeTypesPortStyling: NodeStore.getAllNodeTypesPortStyling(),
    //allNodeTypesStyling: NodeStore.getAllNodeTypesStyling()
  }
}

var Node = React.createClass({
  //getInitialState: function(){
  //  return getNodeState();
  //},
  //
  //_onChange: function(){
  //  //this.setState(getNodeState());
  //  //this.setState({selected: NodeStore.getAnyNodeSelectedState((ReactDOM.findDOMNode(this).id))});
  //  //this.setState({nodePosition: NodeStore.getAnyNodePosition(ReactDOM.findDOMNode(this).id)});
  //
  //},

  componentDidMount: function(){
    //NodeStore.addChangeListener(this._onChange);
    console.log(this.props);
    console.log(this.state);

    //ReactDOM.findDOMNode(this).addEventListener('NodeSelect', this.nodeSelect);
    //this.setState({selected: NodeStore.getAnyNodeSelectedState((ReactDOM.findDOMNode(this).id))}, function(){ /* Can't put into getInitialState since the DOMNode isn't mounted yet apparently */
    //  console.log(this.props.selected);
    //
    //  console.log("A node has been mounted"); });
    //this.setState({nodePosition: NodeStore.getAnyNodePosition(ReactDOM.findDOMNode(this).id)}, function(){
    //  console.log(this.state.nodePosition);
    //});

    //interact('.node')
    //  .draggable({
    //    onmove: this.interactJsDrag
    //  });

    interact(ReactDOM.findDOMNode(this))
      .draggable({
        restrict: {
          restriction: '#appAndDragAreaContainer',
        },
        onstart: function(e){
          e.stopImmediatePropagation();
          e.stopPropagation();
          console.log("interactjs dragstart");
        },
        onmove: this.interactJsDrag,
        onend: function(e){
          e.stopImmediatePropagation();
          e.stopPropagation();
          console.log("interactjs dragend");
        }
      });

    interact(ReactDOM.findDOMNode(this))
      .on('tap', this.nodeSelect);

    interact(ReactDOM.findDOMNode(this))
      .styleCursor(false);

    /* Doesn't work quite as expected, perhaps do checks with e.dy and e.dx to check myself if  */
    //interact
    //  .pointerMoveTolerance(5);
  },

  componentWillUnmount: function(){
    //NodeStore.removeChangeListener(this._onChange);
    //this.interactable.unset();
    //this.interactable = null;

    interact(ReactDOM.findDOMNode(this))
      .off('tap', this.nodeSelect);
  },

  //shouldComponentUpdate: function(nextProps, nextState){
  //  console.log("shouldComponentUpdate");
  //  console.log(nextProps.allNodeInfo[this.props.id].position);
  //  return this.props.allNodeInfo[this.props.id].position.x === nextProps.allNodeInfo[this.props.id].position.x;
  //},

  handleInteractJsDrag: function(item){
    nodeActions.interactJsDrag(item);
  },

  nodeClick: function(){
    console.log("node has been clicked!");
  },

  nodeDrag: function(){
    console.log("node has been dragged!");
  },

  //mouseOver: function(){
  //  //console.log("mouseOver");
  //  var rectangleName = this.props.id.concat("Rectangle");
  //  var test = document.getElementById(rectangleName);
  //  test.style.stroke = '#797979'
  //},

  //mouseLeave: function(){
  //  //console.log("mouseLeave");
  //  var rectangleName = this.props.id.concat("Rectangle");
  //  var test = document.getElementById(rectangleName);
  //
  //  if(this.props.selected === true){
  //    console.log("this.props.selected is true, so don't reset the border colour");
  //  }
  //  else{
  //    test.style.stroke = 'black'
  //  }
  //},

  nodeSelect: function(e){
    console.log(e);
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();;
    console.log(this.props.id + "has been selected");
    //nodeActions.deselectAllNodes("deselect all nodes");

    /* Don't want hover stuff anymore! */

    //if(this.props.portMouseOver === true){
    //  console.log("hovering over port, so will likely want a portClick if a click occurs rather than a nodeSelect");
    //}
    //else if(this.props.portMouseOver === false){
    //  nodeActions.selectNode(ReactDOM.findDOMNode(this).id);
    //  paneActions.openNodeTab(ReactDOM.findDOMNode(this).id);
    //  console.log(this.props.selected);
    //}

    if(this.props.areAnyNodesSelected === false){
      nodeActions.selectNode(ReactDOM.findDOMNode(this).id);
      paneActions.openNodeTab(ReactDOM.findDOMNode(this).id);
      console.log(this.props.selected);
    }
    else{
      /* Need to run deselect before I select the current node */
      this.props.deselect();
      nodeActions.selectNode(ReactDOM.findDOMNode(this).id);
      paneActions.openNodeTab(ReactDOM.findDOMNode(this).id);
      console.log(this.props.selected);
    }

    /* Also need something here to make the tab jump to the newly selected nod eif it is already open */



  },

  //mouseDown: function(e){
  //  console.log("TGen1 mouseDown");
  //  console.log(e.currentTarget);
  //  console.log(e.currentTarget.parentNode);
  //  nodeActions.draggedElement(e.currentTarget.parentNode);
  //},

  //portMouseDown: function(e){
  //  console.log("portMouseDown");
  //  console.log(e);
  //  nodeActions.passPortMouseDown(e.currentTarget);
  //
  //  var portMouseDownCoords = {
  //    x: e.nativeEvent.clientX,
  //    y: e.nativeEvent.clientY
  //  };
  //  this.setState({portMouseDownCoords: portMouseDownCoords});
  //  var whichPort = e.currentTarget;
  //  console.log(whichPort);
  //},
  //portMouseUp: function(e){
  //  console.log("portMouseUp");
  //  console.log(e);
  //  var portMouseUpCoords = {
  //    x: e.nativeEvent.clientX,
  //    y: e.nativeEvent.clientY
  //  };
  //  if(this.state.portMouseDownCoords.x === portMouseUpCoords.x && this.state.portMouseDownCoords.y === portMouseUpCoords.y){
  //    console.log("zero mouse movement on portMOuseDown & Up, hence invoke portClick!");
  //    this.portClick(e);
  //  }
  //  else{
  //    console.log("some other mouse movement has occured between portMouseDown & Up, so portClick won't be invoked");
  //  }
  //},
  //portClick: function(e){
  //  console.log("portClick");
  //  /* Need to either invoke an action or fire an event to cause an edge to be drawn */
  //  /* Also, best have theGraphDiamond container emit the event, not just the port or the node, since then the listener will be in theGraphDiamond to then invoke the edge create function */
  //  var theGraphDiamondHandle = document.getElementById('appAndDragAreaContainer');
  //  var passingEvent = e;
  //  if(this.state.storingFirstPortClicked === null){
  //    console.log("storingFirstPortClicked is null, so will be running just edgePreview rather than connectEdge");
  //    theGraphDiamondHandle.dispatchEvent(EdgePreview);
  //  }
  //  else if(this.state.storingFirstPortClicked !== null){
  //    console.log("a port has already been clicked before, so dispatch TwoPortClicks");
  //    theGraphDiamondHandle.dispatchEvent(TwoPortClicks)
  //  }
  //  //theGraphDiamondHandle.dispatchEvent(PortSelect);
  //},
  //portSelect: function(){
  //  console.log("portClick has occured, so a port has been selected");
  //
  //},

  interactJsDrag: function(e){
    console.log(e);
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log("interactJs drag is occurring");
    var target = e.target.id;
    var deltaMovement = {
      target: target,
      x: e.dx,
      y: e.dy
    };

    /* Currently doesn't work very well, selects a node after dragging a bit... */
    /* I could save the coords of the start of the drag from onstart in interactjs and do something from there? */

    //if(Math.abs(e.dx) < 4 && Math.abs(e.dy) < 4){
    //  console.log("Not large enough movement for a drag, so just do a nodeSelect");
    //  this.nodeSelect(e);
    //}
    //else{
    //  console.log("Drag movement is large enough, so do a drag");
    //  this.handleInteractJsDrag(deltaMovement);
    //}

    /* Need to have some code here to check if the movement is large anough for a drag:
    if so, just carry on and invoke the action to drag, and if not, invoke the node select function instead
     */

    this.handleInteractJsDrag(deltaMovement);

  },


  render: function(){

    //console.log("portThatHasBeenClicked is: " + this.props.portThatHasBeenClicked);
    //console.log(this.props);

    /* Unecessary now that I don't want the ports to focus on node selection (I think? =P) */

    //if(this.props.selected === true){
    //  var currentStyling = this.props.selectedStyling;
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

    //var nodeInfo = this.state.allNodeInfo[this.props.id];
    //var nodePositionX = this.state.allNodeInfo[this.props.id].position.x;
    //var nodePositionY = this.state.allNodeInfo[this.props.id].position.y;
    var nodeTranslate = "translate(" + this.props.allNodeInfo[this.props.id].position.x + "," + this.props.allNodeInfo[this.props.id].position.y + ")";
    //console.log(nodeTranslate);

    //var nodeName = nodeInfo.name;
    //var rectangleString = "Rectangle";
    //var rectangleName = this.props.id.concat(rectangleString);

    /* Trying to automatically generate the correct ports and port text */
    /* NOTE: This will run on every render, so all the ports will be reset back to an empty array and then iterate through the loops to recreate them...
      I Suppose I could try moving these into methods of the component instead, and them running them once at the start of the node's lifetime? */

    //var nodePortsStyling = this.state.allNodeTypesPortStyling; /* Need the styling of everything, not just the port positions, so I need to alter the object I get from the store to be all the styling and not just the different node's PORT stylign */
    //var allNodeTypesStyling = this.state.allNodeTypesStyling;
    //var nodeType = nodeInfo.type;

    return (
      <g {...this.props}
          //onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave}
                         //style={this.props.selected && this.props.areAnyNodesSelected || !this.props.selected && !this.props.areAnyNodesSelected ? window.NodeContainerStyle : window.nonSelectedNodeContainerStyle}
                         transform={nodeTranslate}
      >

        <g style={{MozUserSelect: 'none'}}
           //onMouseDown={this.mouseDown}
        >
          <rect id="nodeBackground" height="105" width="65" style={{fill: 'transparent', cursor: this.props.portThatHasBeenClicked === null ? "move" : "default"}}/> /* To allow the cursor to change when hovering over the entire node container */

          <NodeRectangle nodeId={this.props.id} nodeType={this.props.allNodeInfo[this.props.id].type} allNodeTypesStyling={this.props.allNodeTypesStyling}
                         portThatHasBeenClicked={this.props.portThatHasBeenClicked} selected={this.props.selected} />

          <Ports nodeId={this.props.id} allNodeInfo={this.props.allNodeInfo} allNodeTypesStyling={this.props.allNodeTypesStyling}
                 portThatHasBeenClicked={this.props.portThatHasBeenClicked} storingFirstPortClicked={this.props.storingFirstPortClicked} />

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

//<rect id={rectangleName} height={allNodeTypesStyling[nodeType].rectangle.rectangleStyling.height} width={allNodeTypesStyling[nodeType].rectangle.rectangleStyling.width} x={0} y={0} rx={7} ry={7}
//      style={{fill: 'lightgrey', 'strokeWidth': 1.65, stroke: this.props.selected ? '#797979' : 'black', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default"}}
//  //onClick={this.nodeClick} onDragStart={this.nodeDrag}
///>
