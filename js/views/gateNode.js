/**
 * Created by twi18192 on 10/12/15.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var NodeStore = require('../stores/nodeStore.js');
var nodeActions = require('../actions/nodeActions.js');
var paneActions = require('../actions/paneActions');

function getGateNodeState(){
  return{
    //position: NodeStore.getGateNodePosition(),
    //inports: NodeStore.getGateNodeInportsState(),
    //outports: NodeStore.getGateNodeOutportsState()
    //selected: NodeStore.getGate1SelectedState(),
    areAnyNodesSelected: NodeStore.getIfAnyNodesAreSelected(),
    defaultStyling: NodeStore.getGateNodeStyling(),
    selectedStyling: NodeStore.getSelectedGateNodeStyling(),
    //currentStyling: NodeStore.getGate1CurrentStyling()
    //allNodePositions: NodeStore.getAllNodePositions(),
    allNodeInfo: NodeStore.getAllNodeInfo(),
    storingFirstPortClicked: NodeStore.getStoringFirstPortClicked(),
    portMouseOver: NodeStore.getPortMouseOver()
  }
}

var GateNode = React.createClass({
  getInitialState: function(){
    return getGateNodeState();
  },

  _onChange: function(){
    this.setState(getGateNodeState());
    this.setState({selected: NodeStore.getAnyNodeSelectedState(ReactDOM.findDOMNode(this).id)});
  },

  componentDidMount: function(){
    NodeStore.addChangeListener(this._onChange);
    console.log(this.props);
    console.log(this.state);
    this.setState({moveFunction: this.moveElement});
    this.setState({selected: NodeStore.getAnyNodeSelectedState(ReactDOM.findDOMNode(this).id)});
    ReactDOM.findDOMNode(this).addEventListener('NodeSelect', this.nodeSelect);
    ReactDOM.findDOMNode(this).addEventListener('contextmenu', this.portRightClick);
  },

  componentWillUnmount: function(){
    NodeStore.removeChangeListener(this._onChange);
  },

  nodeClick: function(e){
    console.log("node has been clicked!");
    //alert("Click!")
    console.log(e);
    console.log(e.clientX);
  },

  nodeDrag: function(){
    console.log("node has been dragged!");
  },

  rectangleDrag: function(e){
    console.log("rectangleDrag!");
  },
  gDrag: function(e){
    console.log("gDrag");
  },

  mouseDownSelectElement: function(evt){
    console.log("mouseDown");
    console.log(evt);
    console.log(evt.currentTarget);

    var startCoordinates = {
      x: evt.nativeEvent.clientX,
      y: evt.nativeEvent.clientY
    };
    this.setState({beforeDrag: startCoordinates},
      function(){
        this.setState({moveFunction: this.anotherMoveFunction},
          function(){
            console.log("function has changed");
          })
      });
  },

  moveElement: function(evt){
    console.log("moveElement has occurred");
  },
  anotherMoveFunction: function(e){
    console.log("now move is different!");

    /* If mouse movement is minimal, don't change it, but if mouse movement is big enough, change the state */

    console.log(e);

    var updatedCoordinates = {
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY
    };

    if(!this.state.afterDrag){
      this.setState({afterDrag: updatedCoordinates},
        function(){
          this.differenceBetweenMouseDownAndMouseUp(this.state.beforeDrag, this.state.afterDrag)
        })
    }
    else{
      this.setState({beforeDrag: this.state.afterDrag},
        function(){
          this.setState({afterDrag: updatedCoordinates},
            function(){
              this.differenceBetweenMouseDownAndMouseUp(this.state.beforeDrag, this.state.afterDrag)
            })
        })
    }
  },

  mouseUp: function(e){
    console.log("mouseUp");
    console.log(e);
    this.setState({moveFunction: this.moveElement});
    this.setState({beforeDrag: null}); /* Stops the cursor from jumping back to where it previously was on the last drag */
    this.setState({afterDrag: null});

  },

  differenceBetweenMouseDownAndMouseUp: function(start, end){
    console.log(start);
    console.log(end);
    var differenceInCoordinates = {
      x: end.x - start.x,
      y: end.y - start.y
    };

    /* Could potentially debounce somewhere around here for better performance if necessary */
    nodeActions.changeGateNodePosition(differenceInCoordinates);
  },

  mouseOver: function(){
    //console.log("mouseOver");
    //var stringVersionOfRectangleName = String(this.props.RectangleName);
    var rectangleName = this.props.id.concat("Rectangle");
    var test = document.getElementById(rectangleName);
    if(this.state.selected === true){

    }
    else{
      test.style.stroke = '#797979'
    }
  },

  mouseLeave: function(){
    //console.log("mouseLeave");
    //console.log(this.props.RectangleName);
    //var stringVersionOfRectangleName = String(this.props.RectangleName);
    var rectangleName = this.props.id.concat("Rectangle");
    var test = document.getElementById(rectangleName);

    if(this.state.selected === true){
      console.log("this.state.selected is true, so don't reset the border colour");
    }
    else{
      console.log("this.state.selected is false");
      test.style.stroke = 'black'
    }
  },

  nodeSelect: function(){
    console.log("Gate1 has been selected");
    //nodeActions.deselectAllNodes("deselect all nodes"); /* Node deselection occurs on mouseDown instaed of in here, since if it's here the border doesn't change until dragging starts, instead of on mouseDown */
    nodeActions.selectNode(ReactDOM.findDOMNode(this).id);
    paneActions.openNodeTab(ReactDOM.findDOMNode(this).id);
    console.log(this.state.selected);
    console.log(this.state.areAnyNodesSelected);
    //nodeActions.changeGate1Styling("check Gate1's state!");

    //console.log(ReactDOM.findDOMNode(this));
    //console.log(ReactDOM.findDOMNode(this).id);
    //this.setState({selected: true});
  },
  mouseDown: function(e) {
    console.log("Gate1 mouseDown");
    console.log(e.currentTarget);
    console.log(e.currentTarget.parentNode);
    //if (this.portMouseDownBool === true) { /* Doesn't stop the dragging of a node even when mouseDown on a port, need to somehow propagate it to theGraphDiamond I guess */
    //}
    //else {
    //nodeActions.draggedElement(e.currentTarget.parentNode);
    //}
    nodeActions.draggedElement(e.currentTarget.parentNode);

  },

  portHover: function(e){
    console.log("hovering over a port!");
    console.log(e);
    console.log(e.currentTarget);
    var port = e.currentTarget;
    if(this.state.selected === true){
      port.style.fill = "yellow";
      port.style.stroke = "yellow";
      port.style.cursor = "default";
    }
    else{
      port.style.fill = "yellow";
      port.style.stroke = "yellow";
      port.style.cursor = "default";
    }
  },

  portExitHover: function(e){
    console.log("exited hovering over a port!");
    console.log(e);
    console.log(e.currentTarget);
    var port = e.currentTarget;
    port.style.fill = "black";

    if(this.state.selected === true){
      port.style.fill = "lightgrey";
      port.style.stroke = "black";
    }
    else{
      port.style.fill = "black";
      port.style.stroke = "black";
    }
  },
  //portMouseDown: function(e){
  //  console.log("mousedowen on a port!");
  //  console.log(e.currentTarget.id);
  //  console.log(e.currentTarget.parentNode.parentNode.id);
  //  this.portMouseDownBool = true;
  //},
  //portMouseUp: function(e){
  //  console.log("mouseUp on a port!");
  //  this.portMouseDownBool = false;
  //},
  //portRightClick: function(e){
  //  console.log(e);
  //  e.preventDefault();
  //  e.stopPropagation();
  //  console.log("right click on port");
  //},
  portMouseOver: function(e){
    console.log("portMouseOver");
    console.log(e.currentTarget);
    var target = e.currentTarget;
    target.style.cursor = "pointer";
    nodeActions.portMouseOverLeaveToggle("toggle portMouseOver");
    console.log(this.state.portMouseOver);
  },
  portMouseLeave: function(e){
    console.log("portMouseLeave");
    var target = e.currentTarget;
    target.style.cursor = "default";
    nodeActions.portMouseOverLeaveToggle("toggle portMouseOver");
    console.log(this.state.portMouseOver);
  },
  portMouseDown: function(e){
    console.log("Gate1 portMouseDown");
    nodeActions.passPortMouseDown(e.currentTarget);

    var connectToPortMouseDownCoords = {
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY
    };
    this.setState({connectToPortMouseDownCoords: connectToPortMouseDownCoords})
  },
  portMouseUp: function(e){
    var connectToPortMouseUpCoords = {
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY
    };

    if(this.state.connectToPortMouseDownCoords.x === connectToPortMouseUpCoords.x && this.state.connectToPortMouseDownCoords.y === connectToPortMouseUpCoords.y){
      console.log("zero movement between portMouseDown & portMouseUp, hence a portClick!");
      this.portClick();
    }
    else{
      console.log("some other mouse movement has occured between portMouseDown & Up, so portClick won't be invoked");
    }
  },
  portClick: function(){
    console.log("Gate1 portClick");

    var theGraphDiamondHandle = document.getElementById('appAndDragAreaContainer');
    //var passingEvent = e;
    if(this.state.storingFirstPortClicked === null){
      console.log("storingFirstPortClicked is null, so will be running just edgePreview rather than connectEdge");
      theGraphDiamondHandle.dispatchEvent(EdgePreview);
    }
    else if(this.state.storingFirstPortClicked !== null){
      console.log("a port has already been clicked before, so dispatch TwoPortClicks");
      theGraphDiamondHandle.dispatchEvent(TwoPortClicks)
    }
  },

  render: function(){
    //console.log("inside gateNode's render function");

    if(this.state.selected === true){
      var currentStyling = this.state.selectedStyling;
    }
    else{
      var currentStyling = this.state.defaultStyling;
    }

    //var rectangleStyling = this.state.currentStyling.rectangle.rectangleStyling;
    //var rectanglePosition = this.state.currentStyling.rectangle.rectanglePosition;
    //var inportPositions = this.state.currentStyling.ports.portPositions.inportPositions;
    //var portStyling = this.state.currentStyling.ports.portStyling;
    //var outportPositions = this.state.currentStyling.ports.portPositions.outportPositions;
    //var textPosition = this.state.currentStyling.text.textPositions;

    var rectangleStyling = currentStyling.rectangle.rectangleStyling;
    var rectanglePosition = currentStyling.rectangle.rectanglePosition;
    var inportPositions = currentStyling.ports.portPositions.inportPositions;
    var portStyling = currentStyling.ports.portStyling;
    var outportPositions = currentStyling.ports.portPositions.outportPositions;
    var textPosition = currentStyling.text.textPositions;

    var nodeInfo = this.state.allNodeInfo[this.props.id];
    //console.log(nodeInfo);
    var nodePositionX = nodeInfo.position.x;
    var nodePositionY = nodeInfo.position.y;
    var nodeTranslate = "translate(" + nodePositionX + "," + nodePositionY + ")";

    var nodeName = nodeInfo.name;
    var rectangleString = "Rectangle";
    var rectangleName = this.props.id.concat(rectangleString);

    return (
      <g {...this.props} onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave} style={this.state.selected && this.state.areAnyNodesSelected || !this.state.selected && !this.state.areAnyNodesSelected ? window.NodeContainerStyle : window.nonSelectedNodeContainerStyle}
        //onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} onMouseLeave={this.mouseLeave} onMouseMove={this.mouseMove}
        //                 onDragStart={this.dragStart} onDragEnd={this.dragEnd} onDrag={this.drag}
        transform={nodeTranslate}

        //onMouseDown={this.mouseDownSelectElement} onMouseMove={this.state.moveFunction} onMouseUp={this.mouseUp}

      >

        <g  style={{MozUserSelect: 'none'}} onMouseDown={this.mouseDown} >
          <rect id="nodeBackground" height="105" width="71" style={{fill: 'transparent', cursor: 'move'}} /* To allow the cursor to change when hovering over the entire node container */
          />

          <Rectangle id={rectangleName} height={rectangleStyling.height} width={rectangleStyling.width} x={rectanglePosition.x} y={rectanglePosition.y}
                     rx={7} ry={7}
                     style={{fill: 'lightgrey', 'strokeWidth': 1.65, stroke: this.state.selected === true ? '#797979' : 'black'}}
            //onDragStart={this.rectangleDrag}
          />
          <Port cx={inportPositions.set.x} cy={inportPositions.set.y} r={portStyling.portRadius} className="set"
                style={{fill: portStyling.fill, stroke: portStyling.stroke, 'strokeWidth': portStyling.strokeWidth}}
                onMouseOver={this.portHover} onMouseLeave={this.portExitHover} onMouseDown={this.portMouseDown} />

          <Port cx={inportPositions.reset.x} cy={inportPositions.reset.y} r={portStyling.portRadius} className="reset"
                style={{fill: portStyling.fill, stroke: portStyling.stroke, 'strokeWidth': portStyling.strokeWidth}}/>

          <Port cx={outportPositions.out.x} cy={outportPositions.out.y} r={portStyling.portRadius} className="out"
                style={{fill: portStyling.fill, stroke: portStyling.stroke, 'strokeWidth': portStyling.strokeWidth}}
                onMouseOver={this.portMouseOver} onMouseLeave={this.portMouseLeave} onMouseDown={this.portMouseDown} onMouseUp={this.portMouseUp} />

          <InportSetText x={textPosition.set.x} y={textPosition.set.y} style={{MozUserSelect: 'none'}}  />

          <InportResetText x={textPosition.reset.x} y={textPosition.reset.y} style={{MozUserSelect: 'none'}}  />

          <OutportOutText x={textPosition.out.x} y={textPosition.out.y} style={{MozUserSelect: 'none'}}  />

          <NodeName x="20" y={NodeStylingProperties.height + 22} style={{MozUserSelect: 'none'}}  NodeName={nodeName} />
          <NodeType x="25" y={NodeStylingProperties.height + 33} style={{MozUserSelect: 'none'}} />

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

var GateNodePortStyling = {
  inportPositions: {
    set: {
      x: 3,
      y: 25
    },
    reset: {
      x: 3,
      y: 40
    }
  },
  outportPositions: {
    out: {
      x: NodeStylingProperties.width + 3,
      y: 33
    }
  },
  portRadius: 2,
  inportPositionRatio: 0,
  outportPositionRatio: 1
};





var InportSetText = React.createClass({
  render:function(){
    return(
      <text {...this.props} fontSize="10px" fontFamily="Verdana" >set</text>
    )
  }
});

var InportResetText = React.createClass({
  render:function(){
    return(
      <text {...this.props} fontSize="10px" fontFamily="Verdana" >reset</text>
    )
  }
});

var OutportOutText = React.createClass({
  render:function(){
    return(
      <text {...this.props} fontSize="10px" fontFamily="Verdana" >out</text>
    )
  }
});




var NodeName = React.createClass({
  render: function(){
    return(
      <text {...this.props} fontSize="15px" fontFamily="Verdana">{this.props.NodeName}</text>
    )
  }
});

var NodeType = React.createClass({
  render:function(){
    return(
      <text {...this.props} fontSize="8px" fontFamily="Verdana">Gate</text>
    )
  }
});




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

module.exports = GateNode;
