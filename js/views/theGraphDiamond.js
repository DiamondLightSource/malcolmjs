/**
 * Created by twi18192 on 10/12/15.
 */

var React = require('react');
//var ReactDOM = require('../node_modules/react-dom/dist/react-dom.js');

var NodeStore = require('../stores/nodeStore.js');
var nodeActions = require('../actions/nodeActions.js');

var GateNode = require('./gateNode.js');
var TGenNode = require('./tgenNode.js');
var PCompNode = require('./pcompNode.js');
var LUTNode = require('./lutNode.js');
var Edge = require('./edge.js');

var NodeStylingProperties = { /* Only here temporarily until I think of a better solution to make this global*/
  height: 65,
  width: 65,
  rx: 7,
  ry: 7
};

//window.NodeContainerStyle = {
//    //"height": "100",
//    //"width": "100"
//    cursor: 'move',
//    draggable: 'true',
//    className: 'nodeContainer',
//    //MozUserSelect: 'none'
//};

window.defaultNodeContainerStyle = {
  cursor: 'move',
  draggable: 'true',
  className: 'nodeContainer',
};

window.nonSelectedNodeContainerStyle = {
  cursor: 'move',
  draggable: 'true',
  className: 'nodeContainer',
  opacity: 0.3
};

window.NodeContainerStyle = window.defaultNodeContainerStyle;

var EdgeContainerStyle = {

};

var AppContainerStyle = {
  "height": "100%",
  "width": "100%",
  //'backgroundColor': "green"
};

/* This should really fetch the node's x & y coordinates from the store somehow */

function getAppState(){
  return{
    //Gate1Position: NodeStore.getGate1Position(),
    //TGen1Position: NodeStore.getTGen1Position(),
    //PComp1Position: NodeStore.getPComp1Position(),
    //LUT1Position: NodeStore.getLUT1Position(),
    allNodePositions: NodeStore.getAllNodePositions(),
    draggedElement: NodeStore.getDraggedElement(),
    graphPosition: NodeStore.getGraphPosition(),
    graphZoomScale: NodeStore.getGraphZoomScale(),
    allEdges: NodeStore.getAllEdges(),
    gateNodeStyling: NodeStore.getGateNodeStyling(),
    tgenNodeStyling: NodeStore.getTGenNodeStyling(),
    pcompNodeStyling: NodeStore.getPCompNodeStyling(),
    nodesToRender: NodeStore.getNodesToRenderArray(),
    edgesToRender: NodeStore.getEdgesToRenderArray()
  }
}

var App = React.createClass({
  getInitialState: function () {
    return getAppState();
  },
  _onChange: function () {
    this.setState(getAppState());
  },
  componentDidMount: function () {
    NodeStore.addChangeListener(this._onChange);
    //console.log(document.getElementById('appContainer'));
    //console.log(document.getElementById('Gate1'));

    this.setState({moveFunction: this.defaultMoveFunction});
    this.setState({panMoveFunction: this.defaultMoveFunction});
    this.setState({self: this});

    this.setState({wait: false});
    this.addEdgeToEdgesArray();
    this.addNodeToNodesArray();

  },
  componentWillUnmount: function () {
    NodeStore.removeChangeListener(this._onChange);
  },

  /* react-draggabble event handlers */
  handleStart: function (event, ui) {
    console.log('Event: ', event);
    console.log('Position: ', ui.position);
  },

  handleDrag: function (event, ui) {
    console.log('Event: ', event);
    console.log('Position: ', ui.position);
  },

  handleStop: function (event, ui) {
    console.log('Event: ', event);
    console.log('Position: ', ui.position);
  },


  mouseDownSelectElement: function (evt) {
    console.log("mouseDown");
    console.log(evt);
    console.log(evt.currentTarget);

    /*This is for calculating the overall distance moved of the dragged element, since beforeDrag gets updated when the element is moved */
    this.setState({
      mouseDownX: evt.nativeEvent.clientX,
      mouseDownY: evt.nativeEvent.clientY
    });

    this.setState({moveFunction: this.moveElement});
    //this.setState({draggedElement: evt.currentTarget}); /* Need to send to store */ /* Used for node event firing */ /* Replaced with nodeAction to update store in Gate1*/
    nodeActions.draggedElementID(evt.currentTarget.id);
    //nodeActions.deselectAllNodes("deselect all nodes");


    if (this.state.draggedElement === evt.currentTarget) {
      console.log("the draggedElement is equal to the selected element, so don't run deselect!");
    }
    else {
      nodeActions.deselectAllNodes("deselect all nodes");
      /* Don't want to deselect a node if you move around other nodes whilst having another node selected */

    }

    var startCoordinates = {
      x: evt.nativeEvent.clientX,
      y: evt.nativeEvent.clientY
    };
    //this.setState({beforeDrag: startCoordinates},
    //    function(){
    //        this.setState({moveFunction: this.anotherMoveFunction}, /* Do I need to wait for the beforeDrag state to change here? */
    //            function(){
    //                console.log("function has changed");
    //            })
    //    });

    this.setState({beforeDrag: startCoordinates});
    //this.setState({moveFunction: this.anotherMoveFunction}); /* Seeing if I can do this in the default mouse move to check the distance of movement to be a click or drag */
    this.setState({afterDrag: startCoordinates});
    /* This is just in case no movement occurs, if there is movement then this will be overwritten */

  },

  defaultMoveFunction(){

  },

  moveElement: function (evt) {
    //this.setState({draggedElement: evt.currentTarget}); /* Need to send to store */
    //nodeActions.draggedElement(evt.currentTarget.id);

    //console.log("moveElement has occurred");
    var mouseMovementX = evt.nativeEvent.clientX - this.state.mouseDownX;
    var mouseMovementY = evt.nativeEvent.clientY - this.state.mouseDownY;

    if ((Math.abs(mouseMovementX) <= 4 && Math.abs(mouseMovementY) <= 4) || (Math.abs(mouseMovementX) <= 4 && Math.abs(mouseMovementY) === 0) || (Math.abs(mouseMovementX) === 0 && Math.abs(mouseMovementY) <= 4)) {
      console.log("we have a click, not a drag!");
      /* Need to somehow prevent the zero movement click happening, it always happens for this click too, where's there's minimal movement */
      /* Or I could just have that if either occur then they change some state that says the node is selected, so either way it won't affect anything? */
      /* Then I suppose I could have the select style be dependent on if that state is true or false */

      /* Or equally I can update afterDrag here with the very small change in coordinates to prevent that from happening */

      var smallChangeInCoords = {
        x: evt.nativeEvent.clientX,
        y: evt.nativeEvent.clientY
      };
      this.setState({afterDrag: smallChangeInCoords});

      /* These both HAVE to happen here, a node select needs to occur if the mouse movement is small enough */
      /* Actually, I think it makes more sense for the nodeSelect event fire to occur on the mouse up, otherwise here it'll get called for any small movement! */
      //this.state.draggedElement.dispatchEvent(NodeSelect); /* draggedElement happens to be the element that is clicked as well as the element that is dragged! */
      //this.deselect();
    }
    else {
      console.log("mouseMovementX & Y are big enough, is probably a drag!");
      this.setState({moveFunction: this.anotherMoveFunction});
    }
  },
  anotherMoveFunction: function (e) {
    //console.log("now move is different!");

    /* If mouse movement is minimal, don't change it, but if mouse movement is big enough, change the state */

    //console.log(e);
    //console.log(Math.floor(Date.now() / 1000));

    var updatedCoordinates = {
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY
    };

    if (!this.state.afterDrag) {
      this.setState({afterDrag: updatedCoordinates},
        function () {
          this.differenceBetweenMouseDownAndMouseUp(this.state.beforeDrag, this.state.afterDrag)
        })
    }
    //else{
    //    this.setState({beforeDrag: this.state.afterDrag},
    //        function(){
    //            this.setState({afterDrag: updatedCoordinates},
    //                function(){
    //                    this.differenceBetweenMouseDownAndMouseUp(this.state.beforeDrag, this.state.afterDrag); /* No need to use state callback here for the updatedCoordinates, can use the variable directly to save time */
    //                })
    //        })
    //}
    else {
      this.setState({beforeDrag: this.state.afterDrag},
        function () {
          this.setState({afterDrag: updatedCoordinates});
          this.differenceBetweenMouseDownAndMouseUp(this.state.beforeDrag, updatedCoordinates);
        })
    }
  },

  mouseUp: function (e) {
    console.log("mouseUp");
    //console.log(e);
    //console.log(this.state.afterDrag);
    //console.log(this.state.mouseDownX);
    //console.log(Math.abs(e.nativeEvent.clientX - this.state.mouseDownX));
    //console.log(Math.abs(e.nativeEvent.clientY - this.state.mouseDownY));


    if (this.state.beforeDrag.x === this.state.afterDrag.x && this.state.beforeDrag.y === this.state.afterDrag.y) {
      console.log("zero movement between mouseUp and mouseDown, so it's a click!");
      this.state.draggedElement.dispatchEvent(NodeSelect);
      /* draggedElement happens to be the element that is clicked as well as the element that is dragged! */
      this.setState({moveFunction: this.defaultMoveFunction});
      this.setState({beforeDrag: null});
      /* Stops the cursor from jumping back to where it previously was on the last drag */
      this.setState({afterDrag: null});
    }
    /* This is when the mouse has moved far enough that we treat it as a drag, still need to accommodate if we have a mouseup when there's been a small amount of movement but is still a click */
    else if (Math.abs(this.state.afterDrag.x - this.state.mouseDownX) > 4 && Math.abs(this.state.afterDrag.y - this.state.mouseDownY) > 4) {
      console.log("the mouse moved far enough to be a drag");
      this.setState({moveFunction: this.defaultMoveFunction});
      this.setState({beforeDrag: null});
      /* Stops the cursor from jumping back to where it previously was on the last drag */
      this.setState({afterDrag: null});
    }
    /* Not ideal, but it fixes the annoying 'select a node even if it moves a lot in one axis but not the other' bug for now */
    else if ((0 <= Math.abs(e.nativeEvent.clientX - this.state.mouseDownX) <= 4 && Math.abs(e.nativeEvent.clientY - this.state.mouseDownY) > 4) ||
      (Math.abs(e.nativeEvent.clientX - this.state.mouseDownX) > 4 && 0 <= Math.abs(e.nativeEvent.clientY - this.state.mouseDownY) <= 4)) {
      console.log("> 4 movement in one axis but < 4 movement in the other");
      this.setState({moveFunction: this.defaultMoveFunction});
      this.setState({beforeDrag: null});
      /* Stops the cursor from jumping back to where it previously was on the last drag */
      this.setState({afterDrag: null});
    }
    else if ((0 <= Math.abs(e.nativeEvent.clientX - this.state.mouseDownX) <= 4 && 0 <= Math.abs(e.nativeEvent.clientY - this.state.mouseDownY) <= 4)) {
      console.log("there was minimal mouse movement between mouseDown and mouseUp so it was probably a click!");
      this.state.draggedElement.dispatchEvent(NodeSelect);
      /* draggedElement happens to be the element that is clicked as well as the element that is dragged! */
      this.setState({moveFunction: this.defaultMoveFunction});
      this.setState({beforeDrag: null});
      /* Stops the cursor from jumping back to where it previously was on the last drag */
      this.setState({afterDrag: null});
    }


  },

  differenceBetweenMouseDownAndMouseUp: function (start, end) {
    //console.log(start);
    //console.log(end);

    var zoomScale = this.state.graphZoomScale;
    if(zoomScale === 0){
      console.log("zoomScale is zero, can't divide by it!");
    }
    else{
      var differenceInCoordinates = {
        x: (1/zoomScale) * (end.x - start.x),
        y: (1/zoomScale) * (end.y - start.y)
      };
      //nodeActions.changeGateNodePosition(differenceInCoordinates);
      nodeActions.changeNodePosition(differenceInCoordinates);
    }

  },

  mouseLeave: function (e) {
    console.log("mouseLeave, left the window, emulate a mouseUp event!");
    this.setState({moveFunction: this.defaultMoveFunction});
    this.setState({panMoveFunction: this.defaultMoveFunction()});
    this.setState({beforeDrag: null});
    this.setState({afterDrag: null});
  },

  deselect: function () {
    //console.log("dragArea has been clicked");
    nodeActions.deselectAllNodes("deselect all nodes");
    nodeActions.deselectAllEdges("deselect all edges");
  },

  debounce: function (func, wait, immediate) {
    var timeout;
    return function () {
      var context = this, args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },

  setOpacity: function () {
    window.NodeContainerStyle[opacity] = 0.5
  },

  panMouseDown: function (e) {
    console.log("panMouseDown");
    this.setState({panMoveFunction: this.panMouseMove});
    this.dragging = true;

    this.coords = {
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY
    };

  },

  panMouseUp: function (e) {
    console.log("panMouseUp");
    this.setState({panMoveFunction: this.defaultMoveFunction});
    this.dragging = false;

    this.coords = {};
  },

  panMouseMove: function (e) {
    if (this.dragging) {
      e.preventDefault();
    }

    var dx = this.coords.x - e.nativeEvent.clientX;
    var dy = this.coords.y - e.nativeEvent.clientY;

    this.coords.x = e.nativeEvent.clientX;
    this.coords.y = e.nativeEvent.clientY;

    var xChange = this.state.graphPosition.x - dx;
    var yChange = this.state.graphPosition.y - dy;

    var newCoords = {
      x: xChange,
      y: yChange
    };

    nodeActions.changeGraphPosition(newCoords);
  },

  wheelZoom: function (e) {
    console.log("wheel!");
    console.log(e);
    e.preventDefault();
    e.stopPropagation();

    var currentZoomScale = this.state.graphZoomScale;
    var currentGraphPositionX = this.state.graphPosition.x;
    var currentGraphPositionY = this.state.graphPosition.y;


    var ZOOM_STEP = 0.03;
    var zoomDirection = (this.isZoomNegative(e.nativeEvent.deltaY) ? 'up' : 'down');

    if(zoomDirection === 'up'){
      var newZoomScale = this.state.graphZoomScale + ZOOM_STEP;
      //nodeActions.graphZoom(newScaleFactor);
    }
    else{
      var newZoomScale = this.state.graphZoomScale - ZOOM_STEP;
      //nodeActions.graphZoom(newScaleFactor);
    }

    var zoomFactor = newZoomScale / -50;
    var scaleBasedOnZoomFactor = 1 + (1 * zoomFactor);

    var scaleDelta = 1 + (newZoomScale - currentZoomScale);
    this.lastScale = newZoomScale;

    var scale = scaleDelta * currentZoomScale;

    var mouseOnZoomX = e.nativeEvent.clientX;
    var mouseOnZoomY = e.nativeEvent.clientY;

     var newGraphPositionX = scaleDelta * (currentGraphPositionX - mouseOnZoomX) + mouseOnZoomX ;
     var newGraphPositionY = scaleDelta * (currentGraphPositionY - mouseOnZoomY) + mouseOnZoomY ;

     var newGraphPosition = {
       x: newGraphPositionX,
       y: newGraphPositionY
     };

     nodeActions.graphZoom(scale);
     nodeActions.changeGraphPosition(newGraphPosition);
  },

  isZoomNegative: function(n){
    return ((n =+n) || 1/n) < 0;
  },

  edgeMouseDown: function(e){
    console.log("mouseDown on an edge!");
  },
  edgeMouseUp: function(e){
    console.log("mouseUp on an edge!");
    nodeActions.selectEdge(e.currentTarget.id); /* Really simple way to select an edge, but when the mous events get more comples I'm probably gonna have to use events */
    this.setState({selectedEdge: e.currentTarget}, function(){
      console.log(this.state.selectedEdge);
      this.state.selectedEdge.dispatchEvent(EdgeSelect);
    })

  },

  //throttle: function(limit, e){
  //
  //  //this.test(this, e);
  //  if(this.state.wait === false || this.state.wait === undefined){
  //    console.log("wait is false, so do the thing");
  //    this.setState({wait: true});
  //    console.log(this.state.wait);
  //    setTimeout.bind(this, [this.test(this, e), 40])
  //  }
  //  else if(this.state.wait === true){
  //    console.log("we are still waiting, so don't run the move function again just yet");
  //  }
  //
  //
  //},
  //throttleMoveFunction(e){
  //  //console.count("Throttled");
  //  //console.log(e);
  //  this.throttle(100, e);
  //},
  //test: function(Component, e){
  //  console.log("inside throttle return function");
  //  this.setState({wait: false});
  //  Component.anotherMoveFunction(e);
  //  console.log(this.state.wait);
  //},
  addNodeToNodesArray: function(){
    var gateNodeRegExp = /Gate/;
    var tgenNodeRegExp = /TGen/;
    var pcompNodeRegExp = /PComp/;
    var lutNodeRegExp = /LUT/;

    var allNodePositions = this.state.allNodePositions;

    for(var node in allNodePositions){
      //console.log("we have a gate node!");
      //var nodeName = allNodePositions[node].name;
      //var rectangleString = "Rectangle";
      //var rectangleName = node.concat(rectangleString); /*  Even though 'node' is an object, concatenating it with a string makes it work to give GAteRectangle? =P */
      ////console.log(rectangleName);
      //
      //var nodeX = allNodePositions[node].position.x;
      //var nodeY = allNodePositions[node].position.y;
      //var nodeTranslate = "translate(" + nodeX + "," + nodeY + ")";

      if(gateNodeRegExp.test(node) === true){
        nodeActions.pushNodeToArray(<GateNode id={node}
                             onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}/>)
      }
      else if(tgenNodeRegExp.test(node) === true){
        //console.log("we have a tgen node!");
        nodeActions.pushNodeToArray(<TGenNode id={node}
                             onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}/>)
      }
      else if(pcompNodeRegExp.test(node) === true){
        //console.log("we have a pcomp node!");
        nodeActions.pushNodeToArray(<PCompNode id={node}
                              onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}/>)
      }
      else if(lutNodeRegExp.test(node) === true){
        //console.log("we have an lut node!");
        nodeActions.pushNodeToArray(<LUTNode id={node} height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 13} transform={nodeTranslate}
                            //NodeName={nodeName} RectangleName={rectangleName}
                            onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}/>)
      }
      else{
        console.log("no match to any node type, something's wrong?");
      }
    }
  },

  addEdgeToEdgesArray: function(){
    //var gateNodeRegExp = /Gate/;
    //var tgenNodeRegExp = /TGen/;
    //var pcompNodeRegExp = /PComp/;
    //var lutNodeRegExp = /LUT/;

    //var allNodePositions = this.state.allNodePositions;
    var allEdges = this.state.allEdges;

    //var gateNodeInportPositioning = this.state.gateNodeStyling.ports.portPositions.inportPositions;
    //var gateNodeOutportPositioning = this.state.gateNodeStyling.ports.portPositions.outportPositions;
    //var tgenNodeInportPositioning = this.state.tgenNodeStyling.ports.portPositions.inportPositions;
    //var tgenNodeOutportPositioning = this.state.tgenNodeStyling.ports.portPositions.outportPositions;
    //var pcompNodeInportPositioning = this.state.pcompNodeStyling.ports.portPositions.inportPositions;
    //var pcompNodeOutportPositioning = this.state.pcompNodeStyling.ports.portPositions.outportPositions;

    for(var edge in allEdges){
      //var fromNode = allEdges[edge].fromNode;
      //var toNode = allEdges[edge].toNode;
      ////console.log(fromNode);
      ////console.log(toNode);
      //var fromNodePort = allEdges[edge].fromNodePort;
      //var toNodePort = allEdges[edge].toNodePort;
      ////console.log(document.getElementById(fromNode)); /* Since the positions of the nodes are in the store, I should really retrieve the node positions from there and not the DOM element position... */
      ////console.log(this.state.allNodePositions[fromNode].position); /* Position of fromNode */
      ////console.log(this.state.allNodePositions[toNode].position);
      //var fromNodePositionX = this.state.allNodePositions[fromNode].position.x;
      //var fromNodePositionY = this.state.allNodePositions[fromNode].position.y;
      //var toNodePositionX = this.state.allNodePositions[toNode].position.x;
      //var toNodePositionY = this.state.allNodePositions[toNode].position.y;
      ////console.log(fromNodePositionX);
      ////console.log(fromNodePositionY);
      //
      ///* fromNodes */
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

      nodeActions.pushEdgeToArray(<Edge id={edge}
                       //x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
                       onMouseDown={this.edgeMouseDown} onMouseUp={this.edgeMouseUp}
      />)

    }
  },



  render: function(){
    //console.log("inside theGraphDiamond's render function");

    var x = this.state.graphPosition.x;
    var y = this.state.graphPosition.y;
    var scale = this.state.graphZoomScale;
    var transform = "translate(" + x + "," + y + ")";
    var matrixTransform = "matrix("+scale+",0,0,"+scale+","+x+","+y+")";

    //var regExpTest = /abc/;
    //var testString = "I know my abc's";
    //var anotherTestString = "Grab crab";
    //console.log(regExpTest.test(testString));
    //console.log(regExpTest.test(anotherTestString));

    //var gateNodeRegExp = /Gate/;
    //var tgenNodeRegExp = /TGen/;
    //var pcompNodeRegExp = /PComp/;
    //var lutNodeRegExp = /LUT/;
    //
    //var allNodePositions = this.state.allNodePositions;
    //var nodes = [];

    //var allEdges = this.state.allEdges;
    //var edges = [];
    //
    //var gateNodeInportPositioning = this.state.gateNodeStyling.ports.portPositions.inportPositions;
    //var gateNodeOutportPositioning = this.state.gateNodeStyling.ports.portPositions.outportPositions;
    //var tgenNodeInportPositioning = this.state.tgenNodeStyling.ports.portPositions.inportPositions;
    //var tgenNodeOutportPositioning = this.state.tgenNodeStyling.ports.portPositions.outportPositions;
    //var pcompNodeInportPositioning = this.state.pcompNodeStyling.ports.portPositions.inportPositions;
    //var pcompNodeOutportPositioning = this.state.pcompNodeStyling.ports.portPositions.outportPositions;



    //for(var edge in allEdges){
    //  var fromNode = allEdges[edge].fromNode;
    //  var toNode = allEdges[edge].toNode;
    //  //console.log(fromNode);
    //  //console.log(toNode);
    //  var fromNodePort = allEdges[edge].fromNodePort;
    //  var toNodePort = allEdges[edge].toNodePort;
    //  //console.log(document.getElementById(fromNode)); /* Since the positions of the nodes are in the store, I should really retrieve the node positions from there and not the DOM element position... */
    //  //console.log(this.state.allNodePositions[fromNode].position); /* Position of fromNode */
    //  //console.log(this.state.allNodePositions[toNode].position);
    //  var fromNodePositionX = this.state.allNodePositions[fromNode].position.x;
    //  var fromNodePositionY = this.state.allNodePositions[fromNode].position.y;
    //  var toNodePositionX = this.state.allNodePositions[toNode].position.x;
    //  var toNodePositionY = this.state.allNodePositions[toNode].position.y;
    //  //console.log(fromNodePositionX);
    //  //console.log(fromNodePositionY);
    //
    //  /* fromNodes */
    //  if(gateNodeRegExp.test(fromNode) === true){
    //    var startOfEdgePortOffsetX = gateNodeOutportPositioning[fromNodePort].x;
    //    var startOfEdgePortOffsetY = gateNodeOutportPositioning[fromNodePort].y;
    //    //console.log(startOfEdgePortOffsetX);
    //    //console.log(startOfEdgePortOffsetY);
    //    var startOfEdgeX = fromNodePositionX + startOfEdgePortOffsetX;
    //    var startOfEdgeY = fromNodePositionY + startOfEdgePortOffsetY;
    //    //console.log(startOfEdgeX);
    //    //console.log(startOfEdgeY);
    //  }
    //  else if(tgenNodeRegExp.test(fromNode) === true){
    //    var startOfEdgePortOffsetX = tgenNodeOutportPositioning[fromNodePort].x;
    //    var startOfEdgePortOffsetY = tgenNodeOutportPositioning[fromNodePort].y;
    //    var startOfEdgeX = fromNodePositionX + startOfEdgePortOffsetX;
    //    var startOfEdgeY = fromNodePositionY + startOfEdgePortOffsetY;
    //  }
    //  else if(pcompNodeRegExp.test(fromNode) === true){
    //    var startOfEdgePortOffsetX = pcompNodeOutportPositioning[fromNodePort].x;
    //    var startOfEdgePortOffsetY = pcompNodeOutportPositioning[fromNodePort].y;
    //    var startOfEdgeX = fromNodePositionX + startOfEdgePortOffsetX;
    //    var startOfEdgeY = fromNodePositionY + startOfEdgePortOffsetY;
    //  }
    //
    //  /* toNodes */
    //  if(tgenNodeRegExp.test(toNode) === true){
    //    var endOfEdgePortOffsetX = tgenNodeInportPositioning[toNodePort].x;
    //    var endOfEdgePortOffsetY = tgenNodeInportPositioning[toNodePort].y;
    //    var endOfEdgeX = toNodePositionX + endOfEdgePortOffsetX;
    //    var endOfEdgeY = toNodePositionY + endOfEdgePortOffsetY;
    //    //console.log(endOfEdgeX);
    //    //console.log(endOfEdgeY);
    //  }
    //  else if(gateNodeRegExp.test(toNode) === true){
    //    var endOfEdgePortOffsetX = gateNodeInportPositioning[toNodePort].x;
    //    var endOfEdgePortOffsetY = gateNodeInportPositioning[toNodePort].y;
    //    var endOfEdgeX = toNodePositionX + endOfEdgePortOffsetX;
    //    var endOfEdgeY = toNodePositionY + endOfEdgePortOffsetY;
    //  }
    //  else if(pcompNodeRegExp.test(toNode) === true){
    //    var endOfEdgePortOffsetX = pcompNodeInportPositioning[toNodePort].x;
    //    var endOfEdgePortOffsetY = pcompNodeInportPositioning[toNodePort].y;
    //    var endOfEdgeX = toNodePositionX + endOfEdgePortOffsetX;
    //    var endOfEdgeY = toNodePositionY + endOfEdgePortOffsetY;
    //  }
    //
    //  edges.push(<Edge id={edge}
    //                   x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
    //                   onMouseDown={this.edgeMouseDown} onMouseUp={this.edgeMouseUp}
    //  />)
    //
    //}

    //for(var node in allNodePositions){
    //  //console.log("we have a gate node!");
    //  var nodeName = allNodePositions[node].name;
    //  var rectangleString = "Rectangle";
    //  var rectangleName = node.concat(rectangleString); /*  Even though 'node' is an object, concatenating it with a string makes it work to give GAteRectangle? =P */
    //  //console.log(rectangleName);
    //
    //  var nodeX = allNodePositions[node].position.x;
    //  var nodeY = allNodePositions[node].position.y;
    //  var nodeTranslate = "translate(" + nodeX + "," + nodeY + ")";
    //
    //  if(gateNodeRegExp.test(node) === true){
    //    nodes.push(<GateNode id={node}
    //                         onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}/>)
    //  }
    //  else if(tgenNodeRegExp.test(node) === true){
    //    //console.log("we have a tgen node!");
    //    nodes.push(<TGenNode id={node} height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 13} transform={nodeTranslate}
    //                         RectangleName={rectangleName}
    //                         onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}/>)
    //  }
    //  else if(pcompNodeRegExp.test(node) === true){
    //    //console.log("we have a pcomp node!");
    //    nodes.push(<PCompNode id={node} height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 13} transform={nodeTranslate}
    //                          NodeName={nodeName} RectangleName={rectangleName}
    //                         onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}/>)
    //  }
    //  else if(lutNodeRegExp.test(node) === true){
    //    //console.log("we have an lut node!");
    //    nodes.push(<LUTNode id={node} height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 13} transform={nodeTranslate}
    //                        NodeName={nodeName} RectangleName={rectangleName}
    //                        onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}/>)
    //  }
    //  else{
    //    console.log("no match to any node type, something's wrong?");
    //  }
    //}

    return(
      <svg id="appAndDragAreaContainer" onMouseMove={this.state.moveFunction} onMouseLeave={this.mouseLeave} style={AppContainerStyle}  >
        <rect id="dragArea" height="100%" width="100%" fill="transparent"  style={{MozUserSelect: 'none'}}
              onClick={this.deselect} onMouseDown={this.panMouseDown} onMouseUp={this.panMouseUp} onWheel={this.wheelZoom}
              onMouseMove={this.state.panMoveFunction}
        />
        <svg id="appContainer" style={AppContainerStyle}
          //x={this.state.graphPosition.x} y={this.state.graphPosition.y}
          //onDragOver={this.dragOver} onDragEnter={this.dragEnter} onDrop={this.drop}
        >
          <g id="testPanGroup"
             transform={matrixTransform}
             onWheel={this.wheelZoom}  >


            <g id="EdgesGroup" >
              {this.state.edgesToRender}

            </g>

            <g id="NodesGroup" >

              {this.state.nodesToRender}

            </g>


          </g>

        </svg>
      </svg>

    )
  }
});

//ReactDOM.render(
//  <App/>,
//  document.getElementById('testContainer')
//);

module.exports = App;

//<LUTNode id="LUT1"
//         height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 6} x={this.state.LUT1Position.x} y={this.state.LUT1Position.y}
//         onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
///>

//<GateNode id="Gate1"
//          height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 13} x={this.state.Gate1Position.x} y={this.state.Gate1Position.y}
//  //onDragStart={this.dragStart} onDragEnd={this.dragEnd} onDrag={this.drag}
//
//          onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
//  //onMouseMove={this.state.moveFunction}
//
///>
//<TGenNode id="TGen1"
//height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 13} x={this.state.TGen1Position.x} y={this.state.TGen1Position.y}
//
//onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
///>
//
//<PCompNode id="PComp1" style={window.NodeContainerStyle}
//height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 13} x={this.state.PComp1Position.x} y={this.state.PComp1Position.y}
//onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
///>


//<Edge id="Gate1OutTGen1Ena"
//      onMouseDown={this.edgeMouseDown} onMouseUp={this.edgeMouseUp} />


///* The 'zoom origin' is the origin of the <g id="testPanGroup"> element */
//var differenceBetweenMouseAndZoomOrigin = {
//  //x: Math.abs(this.state.graphPosition.x - mouseOnZoom.x),
//  //y: Math.abs(this.state.graphPosition.y - mouseOnZoom.y)
//  x: Math.abs(10 - mouseOnZoom.x),
//  y: Math.abs(40 - mouseOnZoom.y)
//};

//console.log(differenceBetweenMouseAndZoomOrigin);

//var panWhenZoomingMultiplier = 0.1;

//if (mouseOnZoom.x > this.state.graphPosition.x) {
//  if (mouseOnZoom.y > this.state.graphPosition.y) {
//    var panningWhenZooming = {
//      x: this.state.graphPosition.x + panWhenZoomingMultiplier * differenceBetweenMouseAndZoomOrigin.x,
//      y: this.state.graphPosition.y + panWhenZoomingMultiplier * differenceBetweenMouseAndZoomOrigin.y
//    };
//    nodeActions.changeGraphPosition(panningWhenZooming);
//  }
//  else if (mouseOnZoom.y < this.state.graphPosition.y) {
//    var panningWhenZooming = {
//      x: this.state.graphPosition.x + panWhenZoomingMultiplier * differenceBetweenMouseAndZoomOrigin.x,
//      y: this.state.graphPosition.y - panWhenZoomingMultiplier * differenceBetweenMouseAndZoomOrigin.y
//    };
//    nodeActions.changeGraphPosition(panningWhenZooming);
//  }
//
//}
//else if(mouseOnZoom.x < this.state.graphPosition.x){
//  if (mouseOnZoom.y > this.state.graphPosition.y) {
//    var panningWhenZooming = {
//      x: this.state.graphPosition.x - panWhenZoomingMultiplier * differenceBetweenMouseAndZoomOrigin.x,
//      y: this.state.graphPosition.y + panWhenZoomingMultiplier * differenceBetweenMouseAndZoomOrigin.y
//    };
//    nodeActions.changeGraphPosition(panningWhenZooming);
//  }
//  else if (mouseOnZoom.y < this.state.graphPosition.y) {
//    var panningWhenZooming = {
//      x: this.state.graphPosition.x - panWhenZoomingMultiplier * differenceBetweenMouseAndZoomOrigin.x,
//      y: this.state.graphPosition.y - panWhenZoomingMultiplier * differenceBetweenMouseAndZoomOrigin.y
//    };
//    nodeActions.changeGraphPosition(panningWhenZooming);
//  }
//}

//var differenceBetweenMouseOnZoomX = mouseOnZoomX - this.state.lastMouseOnZoomX;
//var differenceBetweenMouseOnZoomY = mouseOnZoomY - this.state.lastMouseOnZoomY;
//
//console.log(differenceBetweenMouseOnZoomX);
//
//var newGraphPositionX = scaleDelta * (currentGraphPositionX - mouseOnZoomX) + mouseOnZoomX + differenceBetweenMouseOnZoomX;
//var newGraphPositionY = scaleDelta * (currentGraphPositionY - mouseOnZoomY) + mouseOnZoomY + differenceBetweenMouseOnZoomY;
//
//this.setState({lastMouseOnZoomX: e.nativeEvent.clientX});
//this.setState({lastMouseOnZoomY: e.nativeEvent.clientY});
//
//var newGraphPosition = {
//  x: newGraphPositionX,
//  y: newGraphPositionY
//};
//
//nodeActions.graphZoom(scale);
//nodeActions.changeGraphPosition(newGraphPosition);




/* Next bit takes care of if the scale factor is zero I think */
