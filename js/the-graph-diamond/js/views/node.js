/**
 * Created by twi18192 on 19/11/15.
 */

var React = require('react');

function getNodeState(){
    return{
        /* references to methods in nodeStore to retrieve data */
    }
}

var Node = React.createClass({
    getInitialState: function(){
        return null
    },
    componentDidMount: function(){
        console.log(this.props);
    },
    nodeClick: function(){
        console.log("node has been clicked!");
    },
    nodeDrag: function(){
        console.log("node has been dragged!");
    },
    render: function(){
        return (
            <svg id="nodeContainer" {...this.props} draggable="true">
                <Rectangle id="rectangle" height={NodeStylingProperties.height} width={NodeStylingProperties.width} x="3" y="2" rx={NodeStylingProperties.rx} ry={NodeStylingProperties.ry}
                           style={{fill: 'lightgrey', stroke: 'black', 'strokeWidth': 1.65}}
                           onClick={this.nodeClick} onDragStart={this.nodeDrag} />
                <Port cx={NodeStylingProperties.width + 3} cy="25" r={PortStyling.portRadius}
                      style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}/>
                <Port cx={NodeStylingProperties.width + 3} cy="40" r={PortStyling.portRadius}
                      style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}/>
                <Port cx={3} cy="33" r={PortStyling.portRadius}
                      style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}/>
                <InportAText x="10" y={NodeStylingProperties.height / 2 + 3}/>
                <OutportAText x={NodeStylingProperties.width - 27} y={NodeStylingProperties.height / 2 - 6} />
                <OutportBText x={NodeStylingProperties.width - 27} y={NodeStylingProperties.height / 2 + 12} />
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

var PortStyling = {
    portRadius: 2,
    inportPositionRatio: 0,
    outportPositionRatio: 1
};

var InportAText = React.createClass({
    render:function(){
        return(
            <text {...this.props} fontSize="10px" fontFamily="Verdana" >inpa</text>
        )
    }
});








var OutportAText = React.createClass({
    render: function(){
        return(
            <text {...this.props} fontSize="10px" fontFamily="Verdana" MozUserSelect="none" >outa</text>
        )
    }
});

var OutportBText = React.createClass({
    render: function(){
        return(
            <text {...this.props} fontSize="10px" fontFamily="Verdana" >outb</text>
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

module.exports = Node;
