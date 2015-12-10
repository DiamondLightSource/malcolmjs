/**
 * Created by twi18192 on 24/11/15.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var NodeStore = require('../stores/nodeStore.js');
var nodeActions = require('../actions/nodeActions.js');

function getGateNodeState(){
    return{
        //position: NodeStore.getGateNodePosition(),
        //inports: NodeStore.getGateNodeInportsState(),
        //outports: NodeStore.getGateNodeOutportsState()
        selected: NodeStore.getGate1SelectedState()
    }
}

var GateNode = React.createClass({
    getInitialState: function(){
        return getGateNodeState();
    },

    _onChange: function(){
        this.setState(getGateNodeState())
    },

    componentDidMount: function(){
        NodeStore.addChangeListener(this._onChange);
        console.log(this.props);
        console.log(this.state);
        this.setState({moveFunction: this.moveElement});
        ReactDOM.findDOMNode(this).addEventListener('NodeSelect', this.nodeSelect);
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
        var test = document.getElementById('GateRectangle');
        if(this.state.selected === true){

        }
        else{
            test.style.stroke = '#797979'
        }
    },

    mouseLeave: function(){
        //console.log("mouseLeave");
        var test = document.getElementById('GateRectangle');

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
        console.log(this.state.selected);

        //console.log(ReactDOM.findDOMNode(this));
        //console.log(ReactDOM.findDOMNode(this).id);
        //this.setState({selected: true});
    },

    render: function(){
        return (
            <svg {...this.props} onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave}
                //onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} onMouseLeave={this.mouseLeave} onMouseMove={this.mouseMove}
                //                 onDragStart={this.dragStart} onDragEnd={this.dragEnd} onDrag={this.drag}

                //onMouseDown={this.mouseDownSelectElement} onMouseMove={this.state.moveFunction} onMouseUp={this.mouseUp}
            >

                <g  style={{MozUserSelect: 'none'}} >
                    <rect id="nodeBackground" height="105" width="71" style={{fill: 'transparent', cursor: 'move'}} /* To allow the cursor to change when hovering over the entire node container */
                                 />

                    <Rectangle id="GateRectangle" height={NodeStylingProperties.height} width={NodeStylingProperties.width} x="3" y="2" rx={NodeStylingProperties.rx} ry={NodeStylingProperties.ry}
                               style={{fill: 'lightgrey', 'strokeWidth': 1.65, stroke: this.state.selected === true ? '#797979' : 'black'}}
                               //onDragStart={this.rectangleDrag}
                    />
                    <Port cx={GateNodePortStyling.inportPositions.set.x} cy={GateNodePortStyling.inportPositions.set.y} r={GateNodePortStyling.portRadius}
                          style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}/>
                    <Port cx={GateNodePortStyling.inportPositions.reset.x} cy={GateNodePortStyling.inportPositions.reset.y} r={GateNodePortStyling.portRadius}
                          style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}/>
                    <Port cx={GateNodePortStyling.outportPositions.out.x} cy={GateNodePortStyling.outportPositions.out.y} r={GateNodePortStyling.portRadius}
                          style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}/>

                    <InportSetText x="10" y={NodeStylingProperties.height / 2 - 6} style={{MozUserSelect: 'none'}}  />
                    <InportResetText x="10" y={NodeStylingProperties.height / 2 + 12} style={{MozUserSelect: 'none'}}  />
                    <OutportOutText x={NodeStylingProperties.width - 20} y={NodeStylingProperties.height / 2 + 3} style={{MozUserSelect: 'none'}}  />

                    <NodeName x="20" y={NodeStylingProperties.height + 22} style={{MozUserSelect: 'none'}} />
                    <NodeType x="25" y={NodeStylingProperties.height + 33} style={{MozUserSelect: 'none'}} />

                </g>

            </svg>
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
            <text {...this.props} fontSize="15px" fontFamily="Verdana">Arm</text>
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


//mouseDown: function(e){
//    console.log("mouseDown");
//    console.log(e);
//    var startCoordinates = {
//        x: e.nativeEvent.clientX,
//        y: e.nativeEvent.clientY
//    };
//    this.setState({beforeDrag: startCoordinates}); /* Not using Flux for the moment, just seeing if this'll work */
//},
//
//mouseUp: function(e){
//    console.log("mouseUp");
//    console.log(e)
//},
//
//dragStart: function(e){
//    e.preventDefault();
//    console.log("dragStart");
//    console.log(e);
//    e.dataTransfer.dropEffect ='move';
//
//    var startCoordinates = {
//        x: e.nativeEvent.clientX,
//        y: e.nativeEvent.clientY
//    };
//    this.setState({beforeDrag: startCoordinates});
//},
//
//dragEnd: function(e){
//    e.preventDefault();
//    e.stopPropagation();
//    console.log("dragEnd");
//    console.log(e);
//    //setTimeout(this.differenceBetweenMouseDownAndMouseLeave(this.state.beforeDrag, this.state.afterDrag), 1000);
//
//
//},
//
//drag: function(e){
//    e.preventDefault();
//    console.log("drag");
//    console.log(e);
//},
//
//mouseLeave: function(e){
//    console.log("mouseLeave");
//    console.log(e);
//    var endCoordinates = {
//        x: e.nativeEvent.clientX,
//        y: e.nativeEvent.clientY
//    };
//    this.setState({afterDrag: endCoordinates});
//    //this.differenceBetweenMouseDownAndMouseLeave(this.state.beforeDrag, endCoordinates)
//},
//
//differenceBetweenMouseDownAndMouseLeave: function(start, end){
//    var differenceInCoordinates = {
//        x: end.x - start.x,
//        y: end.y - start.y
//    };
//    nodeActions.changeGateNodePosition(differenceInCoordinates);
//},
//
//mouseMove: function(e){
//    //e.preventDefault();
//    console.log("mouseMove");
//    console.log(e);
//
//},
