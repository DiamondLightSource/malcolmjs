/**
 * Created by twi18192 on 14/01/16.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var NodeStore = require('../stores/nodeStore.js');
var nodeActions = require('../actions/nodeActions.js');
var paneActions = require('../actions/paneActions');

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

    allNodeTypesPortStyling: NodeStore.getAllNodeTypesPortStyling()
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

      console.log("Node has been mounted"); });
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

    if(this.state.selected === true){
      var currentStyling = this.state.selectedStyling;
    }
    else{
      var currentStyling = this.state.defaultStyling;
    }

    var rectangleStyling = currentStyling.rectangle.rectangleStyling;
    var rectanglePosition = currentStyling.rectangle.rectanglePosition;
    var inportPositions = currentStyling.ports.portPositions.inportPositions;
    var portStyling = currentStyling.ports.portStyling;
    var outportPositions = currentStyling.ports.portPositions.outportPositions;
    var textPosition = currentStyling.text.textPositions;

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

    var nodePortsStyling = this.state.allNodeTypesPortStyling;
    var nodeType = nodeInfo.type;
    var inports = [];
    var inportsXCoord; /* This will be used when I change the port styling obejct to not give every inport its own x coord, but instead have it higher up and give it to all of them at once */
    var outports = [];
    var outportsXCoord;
    var portsText = [];

    for(i = 0; i < nodeInfo.inports.length; i++){
      var inportName = nodeInfo.inports[i].name;
      inports.concat(
        <Port className={inportName} cx={nodePortsStyling[nodeType].ports.portPositions.inportPositions[inportName].x} cy={nodePortsStyling[nodeType].ports.portPositions.inportPositions[inportName].y}
              r={nodePortsStyling[nodeType].ports.portStyling.portRadius} style={{fill: nodePortsStyling[nodeType].ports.portStyling.fill, stroke: nodePortsStyling[nodeType].ports.portStyling.stroke, strokeWidth: 1.65 }}
        />
      );
      /* Taking care of the inport text too */
      portsText.concat(
        <text x={nodePortsStyling[nodeType].text.textPositions[inportName].x} y={nodePortsStyling[nodeType].text.textPositions[inportName].y}
              style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default"}}
        >
          {inportName}
        </text>
      )
    }

    for(j = 0; j < nodeInfo.outports.length; j++){
      var outportName = nodeInfo.outports[j].name;
      outports.concat(
        <Port className={outportName} cx={nodePortsStyling[nodeType].ports.portPositions.outportPositions[outportName].x} cy={nodePortsStyling[nodeType].ports.portPositions.outportPositions[outportName].y}
              r={nodePortsStyling[nodeType].ports.portStyling.portRadius} style={{fill: nodePortsStyling[nodeType].ports.portStyling.fill, stroke: nodePortsStyling[nodeType].ports.portStyling.stroke, strokeWidth: 1.65 }}
        />
      );
      portsText.concat(
        <text x={nodePortsStyling[nodeType].text.textPositions[outportName].x} y={nodePortsStyling[nodeType].text.textPositions[outportName].y}
              style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default"}}
        >
          {outportName}
        </text>
      )
    }

    /* Now just need to add the node name and node type text as well */
    /* Hmm, where should I get/calculate their position & height from?... */

    portsText.concat([
      <text className="nodeName" style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default"}} >
        {nodeInfo.name}
      </text>,

      <text className="nodeType" style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default"}} >
        {nodeInfo.type}
      </text>
    ]);

    return (
      <g {...this.props} onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave} style={this.state.selected && this.state.areAnyNodesSelected || !this.state.selected && !this.state.areAnyNodesSelected ? window.NodeContainerStyle : window.nonSelectedNodeContainerStyle}
                         transform={nodeTranslate}
      >

        <g style={{MozUserSelect: 'none'}} onMouseDown={this.mouseDown} >
          <Rectangle id="nodeBackground" height="105" width="65" style={{fill: 'transparent', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default"}}/> /* To allow the cursor to change when hovering over the entire node container */

          <Rectangle id={rectangleName} height={rectangleStyling.height} width={rectangleStyling.width} x={0} y={0} rx={7} ry={7}
                     style={{fill: 'lightgrey', 'strokeWidth': 1.65, stroke: this.state.selected ? '#797979' : 'black', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default"}}
            //onClick={this.nodeClick} onDragStart={this.nodeDrag}
          />

          <g className="inports">
            {inports}
          </g>

          <g className="outports">
            {outports}
          </g>

          <g className="portsText">
            {portsText}
          </g>



          <NodeName x="17" y={NodeStylingProperties.height + 22} style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default"}} />
        </g>

      </g>
    )
  }
});

var NodeStylingProperties = {
  height: 65,
  width: 65,
  rx: 7,
  ry: 7
};

var TGenNodePortStyling = {
  portRadius: 2,
  inportPositionRatio: 0,
  outportPositionRatio: 1,
  inportPositions: {
    ena: {
      x: 3,
      y: 33
    }
  },
  outportPositions: {
    posn: {
      x: 65 + 3,
      y: 33
    }
  }
};

var InportEnaText = React.createClass({
  render:function(){
    return(
      <text {...this.props} fontSize="10px" fontFamily="Verdana" >ena</text>
    )
  }
});

var OutportPosnText = React.createClass({
  render: function(){
    return(
      <text {...this.props} fontSize="10px" fontFamily="Verdana" MozUserSelect="none" >posn</text>
    )
  }
});




var NodeName = React.createClass({
  render: function(){
    return(
      <text {...this.props} fontSize="15px" fontFamily="Verdana">TGen</text>
    )
  }
});

//var NodeType = React.createClass({
//    render:function(){
//        return(
//            <text {...this.props} fontSize="8px" fontFamily="Verdana">Gate</text>
//        )
//    }
//})




var Rectangle = React.createClass({
  render: function(){
    return(
      <rect {...this.props}>{this.props.children}</rect>
    )
  }
});

var Port = React.createClass({
  render: function(){
    return(
      <circle {...this.props}>{this.props.children}</circle>
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
