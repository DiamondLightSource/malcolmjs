/**
 * Created by twi18192 on 24/11/15.
 */

var React = require('react');
var ReactDOM = require('react-dom');
var NodeStore = require('../stores/nodeStore.js');
var nodeActions = require('../actions/nodeActions.js');

function getTGenNodeState(){
    return{
        //position: NodeStore.getTGenNodePosition(),
        //inports: NodeStore.getTGenNodeInportsState(),
        //outports: NodeStore.getTGenNodeOutportsState()
        selected: NodeStore.getTGen1SelectedState()
    }
}

var TGenNode = React.createClass({
    getInitialState: function(){
        return getTGenNodeState();
    },

    _onChange: function(){
        this.setState(getTGenNodeState())
    },

    componentDidMount: function(){
        NodeStore.addChangeListener(this._onChange);
        console.log(this.props);
        console.log(this.state);

        ReactDOM.findDOMNode(this).addEventListener('NodeSelect', this.nodeSelect);

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
        var test = document.getElementById('TGenRectangle');
        test.style.stroke = '#797979'
    },

    mouseLeave: function(){
        //console.log("mouseLeave");
        var test = document.getElementById('TGenRectangle');

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
        nodeActions.selectNode(ReactDOM.findDOMNode(this).id);
        console.log(this.state.selected);
    },

    render: function(){
        return (
            <svg {...this.props} onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave} >

                <g style={{MozUserSelect: 'none'}} >
                    <Rectangle id="nodeBackground" height="105" width="71" style={{fill: 'transparent', cursor: 'move'}}/> /* To allow the cursor to change when hovering over the entire node container */

                    <Rectangle id="TGenRectangle" height={NodeStylingProperties.height} width={NodeStylingProperties.width} x="3" y="2" rx={NodeStylingProperties.rx} ry={NodeStylingProperties.ry}
                               style={{fill: 'lightgrey', 'strokeWidth': 1.65, stroke: this.state.selected ? '#797979' : 'black'}}
                               //onClick={this.nodeClick} onDragStart={this.nodeDrag}
                    />
                    <Port cx={TGenNodePortStyling.inportPositions.ena.x} cy={TGenNodePortStyling.inportPositions.ena.y} r={TGenNodePortStyling.portRadius}
                          style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}/>
                    <Port cx={TGenNodePortStyling.outportPositions.posn.x} cy={TGenNodePortStyling.outportPositions.posn.y} r={TGenNodePortStyling.portRadius}
                          style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}/>
                    <InportEnaText x="10" y={NodeStylingProperties.height / 2 + 3} style={{MozUserSelect: 'none'}} />
                    <OutportPosnText x={NodeStylingProperties.width - 27} y={NodeStylingProperties.height / 2 + 3} style={{MozUserSelect: 'none'}} />

                    <NodeName x="17" y={NodeStylingProperties.height + 22} style={{MozUserSelect: 'none'}} />
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

module.exports = TGenNode;
