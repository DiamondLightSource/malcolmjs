/**
 * Created by twi18192 on 19/11/15.
 */

var React = require('react');
//var ReactDOM = require('../node_modules/react-dom/dist/react-dom.js');

var NodeStore = require('./stores/nodeStore.js');
var nodeActions = require('./actions/nodeActions.js');
var Node = require('./views/node.js');
var GateNode = require('./views/gateNode.js');
var TGenNode = require('./views/tgenNode.js');
var PCompNode = require('./views/pcompNode.js');
var Edge = require('./views/edge.js');


var NodeStylingProperties = { /* Only here temporarily until I think of a better solution to make this global*/
    height: 65,
    width: 65,
    rx: 7,
    ry: 7
};

var NodeContainerStyle = {
    //"height": "100",
    //"width": "100"
    cursor: 'move',
    draggable: 'true',
    className: 'nodeContainer',
    //MozUserSelect: 'none'
};

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
        Gate1Position: NodeStore.getGate1Position(),
        TGen1Position: NodeStore.getTGen1Position(),
        PComp1Position: NodeStore.getPComp1Position()
    }
}

var App = React.createClass({
    getInitialState: function(){
        return getAppState();
    },
    _onChange: function(){
        this.setState(getAppState());
    },
    componentDidMount: function(){
        NodeStore.addChangeListener(this._onChange);
        //console.log(document.getElementById('appContainer'));
        //console.log(document.getElementById('Gate1'));

        this.setState({moveFunction: this.defaultMoveFunction});

    },
    componentWillUnmount: function(){
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


    mouseDownSelectElement: function(evt){
        console.log("mouseDown");
        console.log(evt);
        console.log(evt.currentTarget);

        this.setState({moveFunction: this.moveElement});
        this.setState({draggedElement: evt.currentTarget}); /* Need to send to store */
        nodeActions.draggedElement(evt.currentTarget.id);
        nodeActions.deselectAllNodes("deselect all nodes");


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
        this.setState({afterDrag: startCoordinates}); /* This is just in case no movement occurs, if there is movement then this will be overwritten */

    },

    defaultMoveFunction(){

    },

    moveElement: function(evt){
        //console.log("moveElement has occurred");
        var mouseMovementX = evt.nativeEvent.clientX - this.state.beforeDrag.x;
        var mouseMovementY = evt.nativeEvent.clientY - this.state.beforeDrag.y;

        if(Math.abs(mouseMovementX) < 3 && Math.abs(mouseMovementY) < 3){
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

            this.state.draggedElement.dispatchEvent(NodeSelect); /* draggedElement happens to be the element that is clicked as well as the element that is dragged! */
        }
        else{
            console.log("mouseMovementX & Y are big enough, is probably a drag!");
            this.setState({moveFunction: this.anotherMoveFunction});
        }
    },
    anotherMoveFunction: function(e){
        //console.log("now move is different!");

        /* If mouse movement is minimal, don't change it, but if mouse movement is big enough, change the state */

        //console.log(e);

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
        //else{
        //    this.setState({beforeDrag: this.state.afterDrag},
        //        function(){
        //            this.setState({afterDrag: updatedCoordinates},
        //                function(){
        //                    this.differenceBetweenMouseDownAndMouseUp(this.state.beforeDrag, this.state.afterDrag); /* No need to use state callback here for the updatedCoordinates, can use the variable directly to save time */
        //                })
        //        })
        //}
        else{
            this.setState({beforeDrag: this.state.afterDrag},
                function(){
                    this.setState({afterDrag: updatedCoordinates});
                    this.differenceBetweenMouseDownAndMouseUp(this.state.beforeDrag, updatedCoordinates);
                })
        }
    },

    mouseUp: function(e){
        console.log("mouseUp");
        console.log(e);

        if(this.state.beforeDrag.x === this.state.afterDrag.x && this.state.beforeDrag.y === this.state.afterDrag.y){
            console.log("zero movement between mouseUp and mouseDown, so it's a click!");
            this.state.draggedElement.dispatchEvent(NodeSelect); /* draggedElement happens to be the element that is clicked as well as the element that is dragged! */
            this.setState({moveFunction: this.defaultMoveFunction});
            this.setState({beforeDrag: null}); /* Stops the cursor from jumping back to where it previously was on the last drag */
            this.setState({afterDrag: null});
        }
        else{
            this.setState({moveFunction: this.defaultMoveFunction});
            this.setState({beforeDrag: null}); /* Stops the cursor from jumping back to where it previously was on the last drag */
            this.setState({afterDrag: null});
        }



    },

    differenceBetweenMouseDownAndMouseUp: function(start, end){
        //console.log(start);
        //console.log(end);
        var differenceInCoordinates = {
            x: end.x - start.x,
            y: end.y - start.y
        };
        //nodeActions.changeGateNodePosition(differenceInCoordinates);
        nodeActions.changeNodePosition(differenceInCoordinates);
    },

    mouseLeave: function(e){
        console.log("mouseLeave, left the window, emulate a mouseUp event!");
        this.setState({moveFunction: this.defaultMoveFunction});
        this.setState({beforeDrag: null});
        this.setState({afterDrag: null});
    },

    deselect: function(){
        //console.log("dragArea has been clicked");
        nodeActions.deselectAllNodes("deselect all nodes");
    },

    debounce: function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },


    render: function(){
        return(
            <svg id="appContainer" style={AppContainerStyle} onMouseMove={this.state.moveFunction} onMouseLeave={this.mouseLeave}
                 //onDragOver={this.dragOver} onDragEnter={this.dragEnter} onDrop={this.drop}
            >
                <rect id="dragArea" height="10000" width="10000" fill="transparent"  style={{MozUserSelect: 'none'}}
                      onClick={this.deselect}></rect>

                <g id="EdgesGroup" >
                    <Edge/>
                </g>

                <g id="NodesGroup" >
                    <GateNode id="Gate1"  style={NodeContainerStyle}
                              height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 6} x={this.state.Gate1Position.x} y={this.state.Gate1Position.y}
                              //onDragStart={this.dragStart} onDragEnd={this.dragEnd} onDrag={this.drag}

                              onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
                              //onMouseMove={this.state.moveFunction}

                    />
                    <TGenNode id="TGen1" style={NodeContainerStyle}
                              height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 6} x={this.state.TGen1Position.x} y={this.state.TGen1Position.y}

                              onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
                    />

                    <PCompNode id="PComp1" style={NodeContainerStyle}
                               height={NodeStylingProperties.height + 40} width={NodeStylingProperties.width + 6} x={this.state.PComp1Position.x} y={this.state.PComp1Position.y}
                               onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
                    />
                </g>

            </svg>
        )
    }
});

module.exports = App;


/* Dragging with drag events as opposed to mouse events */

//dragStart: function(e){
//    console.log("dragStart in app");
//    console.log(e);
//
//    //e.dataTransfer.setData('application/x-moz-node', 'Gate1');
//
//    var startCoordinates = {
//        x: e.nativeEvent.clientX,
//        y: e.nativeEvent.clientY
//    };
//    this.setState({beforeDrag: startCoordinates});
//    console.log(this.state);
//    console.log(startCoordinates);
//},
//
//drag: function(e){
//    console.log("drag in app");
//    console.log(e);
//},
//
//dragEnd: function(e){
//    console.log("dragEnd in app");
//    console.log(e)
//},
//
//dragEnter: function(e){
//    e.preventDefault();
//    e.stopPropagation();
//    e.nativeEvent.preventDefault();
//    e.nativeEvent.stopPropagation();
//
//    console.log("dragEnter");
//    console.log(e);
//},
//
//dragOver: function(event){
//    event.preventDefault();
//    event.stopPropagation();
//    event.nativeEvent.preventDefault();
//    event.nativeEvent.stopPropagation();
//    console.log("dragOver");
//    console.log(event);
//},
//
//drop: function(ef){
//    ef.preventDefault();
//    ef.stopPropagation();
//    console.log("drop");
//    console.log(ef);
//
//    var endCoordinates = {
//        x: ef.nativeEvent.clientX,
//        y: ef.nativeEvent.clientY
//    };
//    this.setState({afterDrag: endCoordinates});
//    console.log(this.state);
//
//    this.differenceBetweenMouseDownAndMouseLeave(this.state.beforeDrag, endCoordinates); /* setStae doesnt mutate state immediately, it creates a pending transition, so just use endCoordinates directly */
//},
//
//differenceBetweenMouseDownAndMouseLeave: function(start, end){
//    console.log(start);
//    console.log(end);
//    var differenceInCoordinates = {
//        x: end.x - start.x,
//        y: end.y - start.y
//    };
//    nodeActions.changeGateNodePosition(differenceInCoordinates);
//},
