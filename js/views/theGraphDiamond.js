/**
 * Created by twi18192 on 10/12/15.
 */

var React = require('react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');

var NodeStore = require('../stores/nodeStore.js');
var nodeActions = require('../actions/nodeActions.js');

var GateNode = require('./gateNode.js');
var TGenNode = require('./tgenNode.js');
var PCompNode = require('./pcompNode.js');
var LUTNode = require('./lutNode.js');
var Edge = require('./edge.js');

var Node = require('./nodes.js');

var interact = require('../../node_modules/interact.js');

var Perf = require('../../node_modules/react/lib/ReactDefaultPerf.js');

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
  //className: 'nodeContainer',
};

window.nonSelectedNodeContainerStyle = {
  cursor: 'move',
  draggable: 'true',
  //className: 'nodeContainer',
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
  //console.log("fetching app state");
  return{
    //Gate1Position: NodeStore.getGate1Position(),
    //TGen1Position: NodeStore.getTGen1Position(),
    //PComp1Position: NodeStore.getPComp1Position(),
    //LUT1Position: NodeStore.getLUT1Position(),
    //allNodePositions: NodeStore.getAllNodePositions(),
    draggedElement: NodeStore.getDraggedElement(),
    graphPosition: NodeStore.getGraphPosition(),
    graphZoomScale: NodeStore.getGraphZoomScale(),
    allEdges: NodeStore.getAllEdges(),
    //gateNodeStyling: NodeStore.getGateNodeStyling(),
    //tgenNodeStyling: NodeStore.getTGenNodeStyling(),
    //pcompNodeStyling: NodeStore.getPCompNodeStyling(),
    nodesToRender: NodeStore.getNodesToRenderArray(),
    edgesToRender: NodeStore.getEdgesToRenderArray(),
    allNodeInfo: NodeStore.getAllNodeInfo(),
    portThatHasBeenClicked: NodeStore.getPortThatHasBeenClicked(),
    storingFirstPortClicked: NodeStore.getStoringFirstPortClicked(),
    newlyCreatedEdgeLabel: NodeStore.getNewlyCreatedEdgeLabel(),
    nodeLibrary: NodeStore.getNodeLibrary(),
    //newlyAddedNode: NodeStore.getNewlyAddedNode(),
    allNodeTypesStyling: NodeStore.getAllNodeTypesStyling(),
    portMouseOver: NodeStore.getPortMouseOver(),
    areAnyNodesSelected: NodeStore.getIfAnyNodesAreSelected(),
    areAnyEdgesSelected: NodeStore.getIfAnyEdgesAreSelected(),
    allNodeTypesPortStyling: NodeStore.getAllNodeTypesPortStyling()
  }
}

var App = React.createClass({
  getInitialState: function () {
    return getAppState();
  },
  _onChange: function () {
    this.setState(getAppState(), function(){
      //console.log("app state has been mutated now!");
    });
  },
  componentDidMount: function () {
    NodeStore.addChangeListener(this._onChange);
    //console.log(document.getElementById('appContainer'));
    //console.log(document.getElementById('Gate1'));
    //this.setState({moveFunction: this.defaultMoveFunction});
    //this.setState({panMoveFunction: this.defaultMoveFunction});
    //this.setState({wait: false});

    //this.addEdgeToEdgesArray(); /* See if I can replace this with my nodeAction that does all edges on initial render */
    nodeActions.addEdgeToAllNodeInfo();
    /* Still need to somehow invoke the function to push all the initial edges to the edges array... */
    /* Just use this.addEdgeToEdgesArray for now =P */
    this.addEdgeToEdgesArray();

    /* Let's try using my refactored nodes.js file instead! */
    //this.addNodeToNodesArray();
    //this.refactoredAddNodeToNodesArray();

    console.log(ReactDOM.findDOMNode(this));
    this.setState({gateNodeIdCounter: 1});

    //this.setState({storingFirstPortClicked: null});
    ReactDOM.findDOMNode(this).addEventListener('EdgePreview', this.addEdgePreview);
    ReactDOM.findDOMNode(this).addEventListener('EdgePreview', this.portSelectHighlight);
    ReactDOM.findDOMNode(this).addEventListener('TwoPortClicks', this.checkBothClickedPorts);

    interact('#dragArea')
      .on('tap', this.deselect);

    interact('#dragArea')
      .draggable({
        onstart: function(e){
          e.stopImmediatePropagation();
          e.stopPropagation();
          console.log("drag start");

        },
        onmove: this.interactJsDragPan,
        onend: function(e){
          e.stopImmediatePropagation();
          e.stopPropagation();
          console.log("drag end");
        }
      })
      .gesturable({
        onmove: this.interactJsPinchZoom
      });

    interact('#dragArea')
      .styleCursor(false);
  },
  componentWillUnmount: function () {
    NodeStore.removeChangeListener(this._onChange);

    ReactDOM.findDOMNode(this).removeEventListener('EdgePreview', this.addEdgePreview);
    ReactDOM.findDOMNode(this).removeEventListener('EdgePreview', this.portSelectHighlight);
    ReactDOM.findDOMNode(this).removeEventListener('TwoPortClicks', this.checkBothClickedPorts);

    interact('#dragArea')
      .off('tap', this.deselect);
  },

  //handleInteractJsDrag: function(item){
  //  nodeActions.interactJsDrag(item);
  //},


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

  deselect: function (e) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    console.log("dragArea has been clicked");
    nodeActions.deselectAllNodes("deselect all nodes");
    nodeActions.deselectAllEdges("deselect all edges");

    if(this.state.portThatHasBeenClicked !== null){
      this.portDeselectRemoveHighlight();
      nodeActions.deselectAllPorts("deselect all ports");
      this.resetPortClickStorage();
    }
    else{
      console.log("this.state.portThatHasBeenSelected is null, so no need to run port deselection process");
    }

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

    /* Enabling a minimum movement threshold to check if a click was intended but the mouse moved a tiny bit between mouseDown and mouseUp */

    //this.setState({
    //  panGraphMouseDown: {
    //    x: e.nativeEvent.clientX,
    //    y: e.nativeEvent.clientY
    //  }
    //});
    //
    //this.setState({
    //  panGraphBeforeDrag: {
    //    x: e.nativeEvent.clientX,
    //    y: e.nativeEvent.clientY
    //  }
    //});
    //
    ///* Will get rewritten if there is graph movement, and will stay the same if there's no movement */
    //this.setState({
    //  panGraphAfterDrag: {
    //    x: e.nativeEvent.clientX,
    //    y: e.nativeEvent.clientY
    //  }
    //});
    //
    //this.setState({panMoveFunction: this.panCheckIfClickOrDrag});

  },

  panCheckIfClickOrDrag: function(e){
    //var mouseMovementX = e.nativeEvent.clientX - this.state.panGraphMouseDown.x;
    //var mouseMovementY = e.nativeEvent.clientY - this.state.panGraphMouseDown.y;
    //
    //if ((Math.abs(mouseMovementX) <= 4 && Math.abs(mouseMovementY) <= 4) || (Math.abs(mouseMovementX) <= 4 && Math.abs(mouseMovementY) === 0) || (Math.abs(mouseMovementX) === 0 && Math.abs(mouseMovementY) <= 4)) {
    //  console.log("we have a click, not a drag!");
    //  /* Need to somehow prevent the zero movement click happening, it always happens for this click too, where's there's minimal movement */
    //  /* Or I could just have that if either occur then they change some state that says the node is selected, so either way it won't affect anything? */
    //  /* Then I suppose I could have the select style be dependent on if that state is true or false */
    //
    //  /* Or equally I can update afterDrag here with the very small change in coordinates to prevent that from happening */
    //
    //  var smallChangeInCoords = {
    //    x: e.nativeEvent.clientX,
    //    y: e.nativeEvent.clientY
    //  };
    //  this.setState({afterPanDrag: smallChangeInCoords});
    //
    //  /* These both HAVE to happen here, a node select needs to occur if the mouse movement is small enough */
    //  /* Actually, I think it makes more sense for the nodeSelect event fire to occur on the mouse up, otherwise here it'll get called for any small movement! */
    //  //this.state.draggedElement.dispatchEvent(NodeSelect); /* draggedElement happens to be the element that is clicked as well as the element that is dragged! */
    //  //this.deselect();
    //}
    //else {
    //  console.log("mouseMovementX & Y are big enough, is probably a drag!");
    //  this.setState({moveFunction: this.panMouseMove});
    //}
  },

  panMouseUp: function (e) {
    console.log("panMouseUp");
    this.setState({panMoveFunction: this.defaultMoveFunction});
    this.dragging = false;

    this.coords = {};

    /* Implementing minimum movement for panning */

    //if (this.state.panGraphBeforeDrag.x === this.state.panGraphAfterDrag.x && this.state.panGraphBeforeDrag.y === this.state.panGraphAfterDrag.y) {
    //  console.log("zero movement between mouseUp and mouseDown, so it's a click, so we're deselecting everything!");
    //  this.deselect();
    //
    //  this.setState({panMoveFunction: this.defaultMoveFunction});
    //  this.setState({panGraphBeforeDrag: null});
    //  /* Stops the cursor from jumping back to where it previously was on the last drag */
    //  this.setState({panGraphAfterDrag: null});
    //}
    ///* This is when the mouse has moved far enough that we treat it as a drag, still need to accommodate if we have a mouseup when there's been a small amount of movement but is still a click */
    //else if (Math.abs(this.state.afterDrag.x - this.state.panGraphMouseDown.x) > 4 && Math.abs(this.state.afterDrag.y - this.state.panGraphMouseDown.y) > 4) {
    //  console.log("the mouse moved far enough to be a drag");
    //  this.setState({panMoveFunction: this.defaultMoveFunction});
    //  this.setState({panGraphBeforeDrag: null});
    //  /* Stops the cursor from jumping back to where it previously was on the last drag */
    //  this.setState({panGraphAfterDrag: null});
    //}
    ///* Not ideal, but it fixes the annoying 'select a node even if it moves a lot in one axis but not the other' bug for now */
    //else if ((0 <= Math.abs(e.nativeEvent.clientX - this.state.panGraphMouseDown.x) <= 4 && Math.abs(e.nativeEvent.clientY - this.state.panGraphMouseDown.y) > 4) ||
    //  (Math.abs(e.nativeEvent.clientX - this.state.panGraphMouseDown.x) > 4 && 0 <= Math.abs(e.nativeEvent.clientY - this.state.panGraphMouseDown.y) <= 4)) {
    //  console.log("> 4 movement in one axis but < 4 movement in the other");
    //  this.setState({panMoveFunction: this.defaultMoveFunction});
    //  this.setState({panGraphBeforeDrag: null});
    //  /* Stops the cursor from jumping back to where it previously was on the last drag */
    //  this.setState({panGraphAfterDrag: null});
    //}
    //else if ((0 <= Math.abs(e.nativeEvent.clientX - this.state.mouseDownX) <= 4 && 0 <= Math.abs(e.nativeEvent.clientY - this.state.mouseDownY) <= 4)) {
    //  console.log("there was minimal mouse movement between mouseDown and mouseUp so it was probably a click, so deselect everything!");
    //  this.deselect();
    //  this.setState({panMoveFunction: this.defaultMoveFunction});
    //  this.setState({panGraphBeforeDrag: null});
    //  /* Stops the cursor from jumping back to where it previously was on the last drag */
    //  this.setState({panGraphAfterDrag: null});
    //}

  },

  panMouseMove: function (e) {
    if (this.dragging) {
      e.preventDefault();
      console.log("dragging");
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

    /* Implementing a minimum mouse movement */

    //var updatedCoordinates = {
    //  x: e.nativeEvent.clientX,
    //  y: e.nativeEvent.clientY
    //};
    //
    //if (!this.state.panGraphAfterDrag) {
    //  this.setState({panGraphAfterDrag: updatedCoordinates},
    //    function () {
    //
    //
    //    })
    //}
    ////else{
    ////    this.setState({beforeDrag: this.state.afterDrag},
    ////        function(){
    ////            this.setState({afterDrag: updatedCoordinates},
    ////                function(){
    ////                    this.differenceBetweenMouseDownAndMouseUp(this.state.beforeDrag, this.state.afterDrag); /* No need to use state callback here for the updatedCoordinates, can use the variable directly to save time */
    ////                })
    ////        })
    ////}
    //else {
    //  this.setState({beforeDrag: this.state.afterDrag},
    //    function () {
    //      this.setState({afterDrag: updatedCoordinates});
    //      this.differenceBetweenMouseDownAndMouseUp(this.state.beforeDrag, updatedCoordinates);
    //    })
    //}

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
    });
    nodeActions.clickedEdge(e.currentTarget.id);


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

  /* NOTE: This function is essentially adding all the nodes that are on initial render, this doesn't add new nodes once the app has been launched! */

  addNodeToNodesArray: function(){
    var gateNodeRegExp = /Gate/;
    var tgenNodeRegExp = /TGen/;
    var pcompNodeRegExp = /PComp/;
    var lutNodeRegExp = /LUT/;

    var allNodeInfo = this.state.allNodeInfo;

    /* Seems like this could be for adding all the initla nodes on startup, perhaps have another fucion for adding one node at a time? */
    for(var node in allNodeInfo){
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
        nodeActions.pushNodeToArray(<GateNode id={node} className="node"
                             //onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
        />)
      }
      else if(tgenNodeRegExp.test(node) === true){
        //console.log("we have a tgen node!");
        nodeActions.pushNodeToArray(<TGenNode id={node} className="node"
                             //onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
        />)
      }
      else if(pcompNodeRegExp.test(node) === true){
        //console.log("we have a pcomp node!");
        nodeActions.pushNodeToArray(<PCompNode id={node} className="node"
                              //onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
        />)
      }
      else if(lutNodeRegExp.test(node) === true){
        //console.log("we have an lut node!");
        nodeActions.pushNodeToArray(<LUTNode id={node} height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 13} transform={nodeTranslate} className="node"
                            //NodeName={nodeName} RectangleName={rectangleName}
                            //onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
        />
        )
      }
      else{
        console.log("no match to any node type, something's wrong?");
      }
    }
  },

  refactoredAddNodeToNodesArray: function(){
    for(var node in this.state.allNodeInfo){
      nodeActions.pushNodeToArray(
        <Node key={node} id={node} className="node"
              allNodeInfo={this.state.allNodeInfo} allNodeTypesStyling={this.state.allNodeTypesStyling} areAnyNodesSelected={this.state.areAnyNodesSelected}
              portThatHasBeenClicked={this.state.portThatHasBeenClicked} storingFirstPortClicked={this.state.storingFirstPortClicked} portMouseOver={this.state.portMouseOver}
              selected={NodeStore.getAnyNodeSelectedState(node)}
              //onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
              />
      )
    }
  },

  addNodeInfo: function(){
    //e.stopImmediatePropagation();
    //e.stopPropagation();
    console.log("addNodeInfo");
    //var gateNodeRegExp = /Gate/;
    //var tgenNodeRegExp = /TGen/;
    //var pcompNodeRegExp = /PComp/;
    //var lutNodeRegExp = /LUT/;

    var newGateNodeId = this.generateNewNodeId();
    console.log(newGateNodeId);

    nodeActions.addToAllNodeInfo(newGateNodeId);

    //ReactDOM.findDOMNode(this).dispatchEvent(AddNode);

    //var newNode = this.state.newlyAddedNode;
    //console.log(newNode);
    //console.log(this.state.newlyAddedNode);
    //newNode = "Gate2";

    /* Replacing with my refactored nodes.js file instead to test the performanc of having many ndes along with interact.js */
    /* Ok, these use MY drag function, so then I can compare interactjs vs my drag in one go */

    //if(gateNodeRegExp.test(newGateNodeId) === true){
    //  nodeActions.pushNodeToArray(<GateNode id={newGateNodeId}
    //                                        onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}/>)
    //}
    //else if(tgenNodeRegExp.test(newGateNodeId) === true){
    //  //console.log("we have a tgen node!");
    //  nodeActions.pushNodeToArray(<TGenNode id={newGateNodeId}
    //                                        onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}/>)
    //}
    //else if(pcompNodeRegExp.test(newGateNodeId) === true){
    //  //console.log("we have a pcomp node!");
    //  nodeActions.pushNodeToArray(<PCompNode id={newGateNodeId}
    //                                         onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}/>)
    //}
    //else if(lutNodeRegExp.test(newGateNodeId) === true){
    //  //console.log("we have an lut node!");
    //  nodeActions.pushNodeToArray(<LUTNode id={newGateNodeId} height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 13} transform={nodeTranslate}
    //    //NodeName={nodeName} RectangleName={rectangleName}
    //                                       onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}/>)
    //}
    //else{
    //  console.log("no match to any node type, something's wrong?");
    //}
    //console.log(this.state.nodesToRender);

    //nodeActions.pushNodeToArray(
    //  <Node key={newGateNodeId} id={newGateNodeId} className="node"
    //        allNodeInfo={this.state.allNodeInfo} allNodeTypesStyling={this.state.allNodeTypesStyling}
    //        portThatHasBeenClicked={this.state.portThatHasBeenClicked} storingFirstPortClicked={this.state.storingFirstPortClicked} portMouseOver={this.state.portMouseOver}
    //        selected={NodeStore.getAnyNodeSelectedState(newGateNodeId)}
    //    //onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
    //  />
    //);

    //Perf.stop();
    //Perf.getLastMeasurements();
    //Perf.printWasted();

  },

  generateNewNodeId: function(){
  /* Do it for just a Gate node for now, remember, small steps before big steps! */
  var gateNodeIdCounter = this.state.gateNodeIdCounter;
  gateNodeIdCounter += 1;
  var newGateId = "Gate" + gateNodeIdCounter;
  console.log(newGateId);
  this.setState({gateNodeIdCounter: gateNodeIdCounter});
  return newGateId;

  },

  addEdgePreview: function(){
    console.log("addEdgePreview in theGraphDiamond has been invoked!");
  },

  portSelectHighlight: function(){
    console.log("portSelectHighlight");
    /* This was all pointless, I already have the specific port in this.state.portThatHasBeenSelected! */
    //var portClassName = this.state.portThatHasBeenClicked.className.animVal;
    //var nodeId = this.state.portThatHasBeenClicked.parentNode.parentNode.id;
    //console.log("portThatHasBeenClicked className is: " + portClassName);
    //console.log("portThatHasBeenClicked parent is: " + nodeId);
    //var node = document.getElementById(nodeId);
    //var port = node.querySelector("." + portClassName);
    //console.log(node);
    //console.log(port);

    console.log(this.state.portThatHasBeenClicked);
    //this.setState({storingFirstPortClicked: this.state.portThatHasBeenClicked}); /* Replaced with a nodeAction */
    nodeActions.storingFirstPortClicked(this.state.portThatHasBeenClicked);

    var port = this.state.portThatHasBeenClicked;
    /* Need an if loop to check if we're hovering the port already
    Well actually, to clikc it you must be hovering, it's in the portMouseLeave that if the port is selected that you dont reset the fill & stroke colour
     */
    //port.style.cursor = "default";
    //port.style.fill = "yellow";
    //port.style.stroke = "yellow";

    port.style.stroke = "black";
    port.style.fill = "lightgrey";

    port.setAttribute('r', 4);

    //console.log(port.style.fill);
    //console.log(port.style.stroke);
    /* Node select is also messing with the port styling... */
  },

  portDeselectRemoveHighlight: function(){
    console.log("before resetting portThatHasBeenSelected, use it to reset the port highlight");
    var port = this.state.portThatHasBeenClicked;
    /* No need to change the cursor back, since if you go back to hovering over a node it'll change to a hand, and if not default is fine
    Actually no, if you then hover over the port again it'll still be an arrow, want a hand again, so change it back to a hand!
    */
    /* Problem is now that if you have clicked a port and have it selected, if you hover over a node it'll go back to being a hand...
    Need some way of checking that if a port is selected, don't override the cursor until a drop or deselection occurs
     */
    //port.style.cursor = "default";
    //port.style.fill = "black";
    //port.style.stroke = "black";

    port.style.stroke = "black";
    port.style.fill = "black";

    port.setAttribute('r', 2);
  },

  checkBothClickedPorts: function(){
    /* This function will run whenever we have dispatched a PortSelect event
    An if loop will check if this.state.portThatHasBeenClicked is null:
    if it is null we simply do a highlight of the port we have selected, then edgePreview should occur.
    if it ISN'T null and it isn't the same port you already clicked, then you run the addEdgeInfo function, passing in the relevant nodes and ports
    To check if portThatHasBeenClicked has a different value, how about I store the value of it in a separate state when the first port click comes in,
    so then you can compare the two in some form or another?
     */
    /* Wait, this.state.portThatHasBeenClicked will never be null when portClick() is run, since we set it in the node to be something in the node file? */
    console.log("checkBothClickedPorts has been called");
    //if(this.state.storingFirstPortClicked !== null){
    //  var firstPort = this.state.storingFirstPortClicked;
    //  var secondPort = this.state.portThatHasBeenClicked;
    //  console.log(firstPort);
    //  console.log(secondPort);
    //
    //  if(firstPort.parentNode.id === secondPort.parentNode.id && firstPort.className.animVal === secondPort.className.animVal ){
    //    console.log("the two clicked ports are the same port, you clicked on the same port twice!");
    //  }
    //  else{
    //    console.log("something else is afoot! =P");
    //  }
    //}
    //else if(this.state.storingFirstPortClicked === null){
    //  console.log("this.state.storingFirstPortClicked is null, so this is just initial render right now");
    //}
    var firstPort = this.state.storingFirstPortClicked;
    var secondPort = this.state.portThatHasBeenClicked;
    console.log(firstPort);
    console.log(secondPort);
    console.log(firstPort.parentNode.parentNode.parentNode.id);
    console.log(secondPort.parentNode.parentNode.parentNode.id);

    /* For my refactored nodes.js file, I added another parent container to hold the ports etc, so another level of parentNode is needed here if I keep that
     Or I could simply remove those <g> containers for the time being =P */
    /* Added another <g> element in the ports.js file, so yet another .parentNode makes it on here =P */

    /* Trying to use id instead of class to then allow class for interactjs use */
    /* Need the length of the name of the node, then slice the firstPort id string until the end of the node name length */

    var firstPortStringSliceIndex = firstPort.parentNode.parentNode.parentNode.id.length;
    var firstPortName = firstPort.id.slice(firstPortStringSliceIndex);
    var secondPortStringSliceIndex = secondPort.parentNode.parentNode.parentNode.id.length;
    var secondPortName = secondPort.id.slice(secondPortStringSliceIndex);
    console.log(firstPortStringSliceIndex);
    console.log(firstPortName);
    console.log(secondPortName);

    if(firstPort.parentNode.parentNode.parentNode.id === secondPort.parentNode.parentNode.parentNode.id && firstPort.id === secondPort.id ){
      console.log("the two clicked ports are the same port, you clicked on the same port twice!");
    }
    else{
      console.log("something else is afoot, time to look at adding the edge! =P");
      var edge = {
        fromNode: firstPort.parentNode.parentNode.parentNode.id,
        fromNodePort: firstPortName,
        toNode: secondPort.parentNode.parentNode.parentNode.id,
        toNodePort: secondPortName
      };
      /* Now using checkPortCompatibility in theGraphDiamond instead of in the store */
      //this.createNewEdge(edge);
      console.log(edge);

      this.checkPortCompatibility(edge);
    }

  },

  checkPortCompatibility: function(edgeInfo){
  /* First need to check we have an inport and an outport */
  /* Find both port types, then compare them somehow */
  console.log(edgeInfo);

  var fromNodeType = this.state.allNodeInfo[edgeInfo.fromNode].type;
  var toNodeType = this.state.allNodeInfo[edgeInfo.toNode].type;

  /* Remember, this is BEFORE any swapping occurs, but be aware that these may have to swap later on */
  var nodeTypes = {
    fromNodeType: fromNodeType,
    toNodeType: toNodeType
  };

  console.log(nodeTypes);

  var fromNodeLibraryInfo = this.state.nodeLibrary[fromNodeType];
  var toNodeLibraryInfo = this.state.nodeLibrary[toNodeType];

    console.log(fromNodeLibraryInfo);
    console.log(toNodeLibraryInfo);

  for(i = 0; i < fromNodeLibraryInfo.inports.length; i++){
    if(fromNodeLibraryInfo.inports[i].name === edgeInfo.fromNodePort){
      console.log("The fromNode is an inport:" + edgeInfo.fromNodePort);
      var fromNodePortType = "inport";
      var inportIndex = i;
      break;
    }
    else{
      console.log("The fromNode isn't an inport, so it's an outport, so no need to check the outports!");
      var fromNodePortType = "outport";
    }
  }

  for(j = 0; j < toNodeLibraryInfo.inports.length; j++ ){
    if(toNodeLibraryInfo.inports[j].name === edgeInfo.toNodePort){
      console.log("The toNode is an inport: " + edgeInfo.toNodePort);
      var toNodePortType = "inport";
      var inportIndex = j;
      break;
    }
    else{
      console.log("The toNode isn't an inport, so it's an outport!");
      var toNodePortType = "outport";
    }
  }

  var portTypes = {
    fromNodePortType: fromNodePortType,
    toNodePortType: toNodePortType
  };

  console.log(portTypes);

  var types = {
    nodeTypes: nodeTypes,
    portTypes: portTypes
  };

  /* Time to compare the fromNodePortType and toNodePortType */

    var fromPort = this.state.storingFirstPortClicked;

    if(edgeInfo.fromNode === edgeInfo.toNode){
    window.alert("Incompatible ports, they are part of the same node.");
    //var fromPort = this.state.storingFirstPortClicked;
    fromPort.style.stroke = "black";
    fromPort.style.fill = "black";
    fromPort.setAttribute('r', 2);
    this.resetPortClickStorage();
  }
  else if(fromNodePortType === toNodePortType){
    console.log("The fromNode and toNode ports are both " + fromNodePortType + "s, so can't connect them");
    window.alert("Incompatible ports, they are both " + fromNodePortType + "s.");
    /* Reset styling of fromPort before clearing this.state.storingFirstPortClciked */
    //var fromPort = this.state.storingFirstPortClicked;
    fromPort.style.stroke = "black";
    fromPort.style.fill = "black";
    fromPort.setAttribute('r', 2);
    this.resetPortClickStorage();
    /* Hence, don't add anything to allNodeInfo */
  }
  else if(fromNodePortType !== toNodePortType){
    console.log("fromNodePortType is " + fromNodePortType + ", and toNodePortType is " + toNodePortType + ", so so far this connection is valid. Check if the ports and their respective nodes are compatible.");
    /* So, for now, just run the function that adds to allNodeInfo, but there will be more checks here, or perhaps a separate function to check for further port compatibility */
    if(fromNodePortType === "inport"){
      this.isInportConnected(edgeInfo.fromNodePort, inportIndex, edgeInfo.fromNode, edgeInfo, types);
    }
    else if(toNodePortType === "inport"){
      this.isInportConnected(edgeInfo.toNodePort, inportIndex, edgeInfo.toNode, edgeInfo, types);
    }
    else{
      console.log("fromNodePortType and toNodePortType are apparently different, yet neither are an inport, so something is up...");
    }
    /* Introducing other port compatibility checks, so this will get put further and further back until the very last check function; only if all these checks are passed is this node action invoked */
    //nodeActions.addOneSingleEdgeToAllNodeInfo(edgeInfo);

    /* Also need the equivalent of addToEdgesObject for single edges here! */
    /* Now, the point of this was also to find if the fromNode was an inport or outport:
     if it's an outport then it's a normal connection from an out to an in,
     but if it's an inport, then it's a connection from an in to an out (ie, the other way around), so somehow need to compensate for that!
     */

  }

  },

  isInportConnected: function(inport, inportIndex, node, edgeInfo, types){
    console.log("The inport " + inport + " of the node " + node + " is " + this.state.allNodeInfo[node].inports[inportIndex].connected);
    if(this.state.allNodeInfo[node].inports[inportIndex].connected === true){
      //console.log("That inport is already connected, so another connection cannot be made");
      window.alert("The inport " + inport + " of the node " + node + " is already connected, so another connection cannot be made");
      /* Set the styling of the first port back to normal */
      //console.log(edgeInfo);
      //console.log(this.state.storingFirstPortClicked);
      var fromPort = this.state.storingFirstPortClicked;
      fromPort.style.stroke = "black";
      fromPort.style.fill = "black";
      fromPort.setAttribute('r', 2);
      this.resetPortClickStorage();
    }
    else if(this.state.allNodeInfo[node].inports[inportIndex].connected === false){
      console.log("That inport isn't connected to anything, so proceed with the port connection process");
      console.log(edgeInfo);
      var toPort = this.state.portThatHasBeenClicked;
      console.log(toPort);
      toPort.style.stroke = "black";
      toPort.style.fill = "lightgrey";
      toPort.setAttribute('r', 4);
      nodeActions.addOneSingleEdgeToAllNodeInfo(edgeInfo);
      this.addOneEdgeToEdgesObject(edgeInfo, types.portTypes, types.nodeTypes);
    }
  },

  resetPortClickStorage: function(){
    /* The same as what I would expect a portDeselect function to do I think */
    console.log("Resetting port click storage");
    nodeActions.storingFirstPortClicked(null);
    nodeActions.passPortMouseDown(null);
  },

  addOneEdgeToEdgesObject: function(edgeInfo, portTypes, nodeTypes){
  /* I guess it could get messy now, since 'fromNode' before this meant 'the node that was clicked on first', but now I want it to mean the beginning node; ie, the node from which the port type is out */

  var startNode;
  var startNodeType;
  var startNodePort;
  var endNode;
  var endNodeType;
  var endNodePort;
  var newEdge;
  var edgeLabel;
  if(portTypes.fromNodePortType === "outport"){
    console.log("outport to inport, so edge labelling is normal");
    startNode = edgeInfo.fromNode;
    startNodeType = nodeTypes.fromNodeType;
    startNodePort = edgeInfo.fromNodePort;
    endNode = edgeInfo.toNode;
    endNodeType = nodeTypes.toNodeType;
    endNodePort = edgeInfo.toNodePort;
    //newEdge = {
    //  fromNode: startNode,
    //  fromNodePort: startNodePort,
    //  toNode: endNode,
    //  toNodePort: endNodePort
    //}
  }
  else if(portTypes.fromNodePortType === "inport"){
    console.log("inport to outport, so have to flip the edge labelling direction");
    /* Note that you must also flip the ports too! */
    startNode = edgeInfo.toNode;
    startNodeType = nodeTypes.toNodeType;
    startNodePort = edgeInfo.toNodePort;
    endNode = edgeInfo.fromNode;
    endNodeType = nodeTypes.fromNodeType;
    endNodePort = edgeInfo.fromNodePort;
    /* Don't need this in both loops, can just set this after the loops have completed! */
    //newEdge = {
    //  fromNode: startNode,
    //  fromNodePort: startNodePort,
    //  toNode: endNode,
    //  toNodePort: endNodePort
    //}
  }

  newEdge = {
    fromNode: startNode,
    fromNodeType: startNodeType,
    fromNodePort: startNodePort,
    toNode: endNode,
    toNodeType: endNodeType,
    toNodePort: endNodePort
  };

  edgeLabel = String(newEdge.fromNode) + String(newEdge.fromNodePort) + " -> " + String(newEdge.toNode) + String(newEdge.toNodePort);

  /* Checking if the edge already exists, if it does don't bother adding another edge */

  if(this.state.allEdges[edgeLabel] === undefined){
    console.log("The newEdge's label is " + edgeLabel);

    /* Need an action to do this */
    //edges[edgeLabel] = newEdge;
    //console.log(edges);

    var edgeStuff = {
      edgeLabel: edgeLabel,
      edgeInfo: newEdge
    };
    nodeActions.addOneSingleEdgeToEdgesObject(edgeStuff);

    /* Also need to add the selected states to edgeSelectedStates! */
    /* Can have an action do this */

    //edgeSelectedStates[edgeLabel] = false;
    nodeActions.appendToEdgeSelectedState(edgeLabel);

    this.createNewEdge(edgeLabel)
  }
  else{
    console.log("That edge already exists, so don't add another one");
  }



  },

  createNewEdge: function(edgeLabel){
    console.log("edgeLabel is: " +  edgeLabel);
    /* This aciton is for adding ALL INITIAL EDGES, not for adding one signle edge! */
    //nodeActions.addEdgeToAllNodeInfo(edge);


    /* Trying to replace with my port compatibility checker function*/
    //console.log(this.state.allEdges);
    //console.log(this.state.newlyCreatedEdgeLabel);
    //nodeActions.createNewEdgeLabel(edge);
    //console.log("between createNewEdgeLabel and addOneSingleEdge nodeActions");
    //console.log(this.state.allEdges);
    //console.log(this.state.newlyCreatedEdgeLabel);
    //nodeActions.addOneSingleEdge(edge);
    //console.log("after both nodeActions");
    //console.log(this.state.allEdges);
    //console.log(this.state.newlyCreatedEdgeLabel);

    //var newEdgeLabel = edge.fromNode + edge.fromNodePort + " -> " + edge.toNode + edge.toNodePort;
    //console.log(newEdgeLabel);


    //nodeActions.addOneSingleEdge(edge);
    //
    //var newlyCreatedEdgeLabel = this.state.newlyCreatedEdgeLabel;
    ////console.log(this.state.allEdges);
    ////console.log(this.state.newlyCreatedEdgeLabel);
    ////console.log(newlyCreatedEdgeLabel);
    //var newEdge = this.state.allEdges[newlyCreatedEdgeLabel];
    //console.log(newEdge);

    nodeActions.pushEdgeToArray(<Edge id={edgeLabel}
      //x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
      //                                onMouseDown={this.edgeMouseDown} onMouseUp={this.edgeMouseUp}
    />);

    /* Now that a new edge component instance has been added, reset the port storage info */
    this.resetPortClickStorage();

  },

  addEdgeInfo: function(){
    //e.stopImmediatePropagation();
    //e.stopPropagation();
    nodeActions.addEdgeToAllNodeInfo({
      fromNode: 'TGen1',
      fromNodePort: 'posn',
      toNode: 'PComp1',
      toNodePort: 'posn'
    });

    var newEdge = this.state.allEdges['TGen1posn -> PComp1posn'];
    console.log(newEdge);


    nodeActions.pushEdgeToArray(<Edge id='TGen1posn -> PComp1posn'
      //x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
      //                                onMouseDown={this.edgeMouseDown} onMouseUp={this.edgeMouseUp}
    />)
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

      nodeActions.pushEdgeToArray(<Edge key={edge} id={edge}
                       //x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
                       //onMouseDown={this.edgeMouseDown} onMouseUp={this.edgeMouseUp}
      />)

    }
  },

  //interactJsDrag: function(e){
  //  console.log("interactJs drag is occurring");
  //  var target = e.target.id;
  //  var deltaMovement = {
  //    target: target,
  //    x: e.dx,
  //    y: e.dy
  //  };
  //
  //  this.handleInteractJsDrag(deltaMovement);
  //
  //},

  interactJsDragPan: function(e){
    e.stopImmediatePropagation();
    e.stopPropagation();
    console.log(e);

    var xChange = this.state.graphPosition.x + e.dx;
    var yChange = this.state.graphPosition.y + e.dy;

    nodeActions.changeGraphPosition({
      x: xChange,
      y: yChange
    });
  },

  interactJsPinchZoom: function(e){
    console.log(e);

    var currentZoomScale = this.state.graphZoomScale;
    var newZoomScale = currentZoomScale + e.ds;

    nodeActions.graphZoom(newZoomScale);
  },



  render: function(){
    //console.log("inside theGraphDiamond's render function");
    //console.log(this.props.newlyAddedNode);
    //console.log(this.props);

    var x = this.state.graphPosition.x;
    var y = this.state.graphPosition.y;
    var scale = this.state.graphZoomScale;
    var transform = "translate(" + x + "," + y + ")";
    var matrixTransform = "matrix("+scale+",0,0,"+scale+","+x+","+y+")";

    console.log(this.state.nodesToRender);
    //console.log("this.dragging is:" + this.dragging);
    //console.log("this.state.newlyCreatedEdgeLabel is: " + this.state.newlyCreatedEdgeLabel);

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

    var nodes = [];
    var edges = [];

    for(var node in this.state.allNodeInfo){
      nodes.push(
        <Node key={node} id={node} className="node"
              allNodeInfo={this.state.allNodeInfo} allNodeTypesStyling={this.state.allNodeTypesStyling} areAnyNodesSelected={this.state.areAnyNodesSelected}
              portThatHasBeenClicked={this.state.portThatHasBeenClicked} storingFirstPortClicked={this.state.storingFirstPortClicked} portMouseOver={this.state.portMouseOver}
              selected={NodeStore.getAnyNodeSelectedState(node)} deselect={this.deselect}
          //onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
        />
      )
    }

    for(var edge in this.state.allEdges){
      edges.push(<Edge key={edge} id={edge}
        //x1={startOfEdgeX} y1={startOfEdgeY} x2={endOfEdgeX} y2={endOfEdgeY}
        //               onMouseDown={this.edgeMouseDown} onMouseUp={this.edgeMouseUp}
                       allEdges={this.state.allEdges} allNodeTypesPortStyling={this.state.allNodeTypesPortStyling}
                       allNodeInfo={this.state.allNodeInfo} areAnyEdgesSelected={this.state.areAnyEdgesSelected}
                       selected={NodeStore.getIfEdgeIsSelected(edge)}
      />)

    }

    return(
      <svg id="appAndDragAreaContainer"
           //onMouseMove={this.state.moveFunction} onMouseLeave={this.mouseLeave}
           style={AppContainerStyle}  >

        <rect id="dragArea" height="100%" width="100%" fill="transparent"  style={{MozUserSelect: 'none'}}
              //onClick={this.dragging === true ? this.defaultMoveFunction: this.deselect}
              //onMouseDown={this.panMouseDown} onMouseUp={this.panMouseUp} onMouseMove={this.state.panMoveFunction}
              onWheel={this.wheelZoom}
        />
        <svg id="appContainer" style={AppContainerStyle}
          //x={this.state.graphPosition.x} y={this.state.graphPosition.y}
          //onDragOver={this.dragOver} onDragEnter={this.dragEnter} onDrop={this.drop}
        >
          <g><rect
            onClick={this.addNodeInfo}
            height="50" width="50" /></g>

          <g><rect
            onClick={this.addEdgeInfo}
            height="50" width="50" transform="translate(100, 0)" /></g>


          <g id="testPanGroup"
             transform={matrixTransform}
             onWheel={this.wheelZoom}  >


            <g id="EdgesGroup" >

              {edges}

            </g>

            <g id="NodesGroup" >

              {nodes}

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




//<Node key="TGen1" id="TGen1" className="node"
//      allNodeInfo={this.state.allNodeInfo} allNodeTypesStyling={this.state.allNodeTypesStyling}
//      portThatHasBeenClicked={this.state.portThatHasBeenClicked} storingFirstPortClicked={this.state.storingFirstPortClicked} portMouseOver={this.state.portMouseOver}
//      selected={NodeStore.getAnyNodeSelectedState("TGen1")}
//  //onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
///>

//debounce: function (func, wait, immediate) {
//  var timeout;
//  return function () {
//    var context = this, args = arguments;
//    var later = function () {
//      timeout = null;
//      if (!immediate) func.apply(context, args);
//    };
//    var callNow = immediate && !timeout;
//    clearTimeout(timeout);
//    timeout = setTimeout(later, wait);
//    if (callNow) func.apply(context, args);
//  };
//},
