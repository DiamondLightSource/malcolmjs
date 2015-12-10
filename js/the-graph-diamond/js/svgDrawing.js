/**
 * Created by twi18192 on 18/11/15.
 */

var React = require('../node_modules/react/react');
var ReactDOM = require('../node_modules/react-dom/dist/react-dom.js');

var HelloWorld = React.createClass({
    render: function(){

        return (
            <p>Hello world!</p>
        )
    }
});

var Node = React.createClass({
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
                <InportText x="10" y={NodeStylingProperties.height / 2 + 3}/>
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

var Edge = React.createClass({
    render:function(){
        return(
            <svg id="edgeContainer" {...this.props}>
                <Line height="100" width="100" x1="90%" y1="53%" x2="75" y2="25"
                      style={{strokeWidth: '5', stroke:"orange"}} />
            </svg>
        )
    }
});


var InportText = React.createClass({
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

var Line = React.createClass({
    render: function(){
        return(
            <line {...this.props}>{this.props.children}</line>
        )
    }
});

var NodeContainerStyle = {
    "height": "100",
    "width": "100"
};

var EdgeContainerStyle = {

};

var AppContainerStyle = {
    "height": "100%",
    "width": "100%"
};

var App = React.createClass({
    render: function(){
        return(
            <svg id="appContainer" style={AppContainerStyle}>
                <Node height={NodeStylingProperties.height + 6} width={NodeStylingProperties.width + 6} x="20" y="10" />
                <Node height={NodeStylingProperties.height + 6} width={NodeStylingProperties.width + 6} x="200" y="10" />


            </svg>
        )
    }
});

ReactDOM.render(
    <App/>,
    document.getElementById('testContainer')
);
