/**
 * Created by twi18192 on 02/12/15.
 */

var React = require('../../node_modules/react/react');
var NodeStore = require('../stores/blockStore.js');
var nodeActions = require('../actions/blockActions.js');

var LUTNode = React.createClass({
    render: function(){
        return(
            <svg {...this.props} >
                <g style={{MozUserSelect: 'none'}}  >
                    <Rectangle id="nodeBackground" height="105" width="71" style={{fill: 'transparent', cursor: 'move'}}/> /* To allow the cursor to change when hovering over the entire node container */
                    <Rectangle id="rectangle" height={NodeStylingProperties.height} width={NodeStylingProperties.width} x="3" y="2" rx={NodeStylingProperties.rx} ry={NodeStylingProperties.ry}
                               style={{fill: 'lightgrey', stroke: 'black', 'strokeWidth': 1.65}}
                        //onClick={this.nodeClick} onDragStart={this.nodeDrag}


                        />
                    <Port cx={LUTNodePortStyling.inportPositions.inpa.x} cy={LUTNodePortStyling.inportPositions.inpa.y} r={LUTNodePortStyling.portRadius}
                          style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}/>

                    <Port cx={LUTNodePortStyling.inportPositions.inpb.x} cy={LUTNodePortStyling.inportPositions.inpb.y} r={LUTNodePortStyling.portRadius}
                          style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}/>

                    <Port cx={LUTNodePortStyling.inportPositions.inpc.x} cy={LUTNodePortStyling.inportPositions.inpc.y} r={LUTNodePortStyling.portRadius}
                          style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}/>

                    <Port cx={LUTNodePortStyling.inportPositions.inpd.x} cy={LUTNodePortStyling.inportPositions.inpd.y} r={LUTNodePortStyling.portRadius}
                          style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}/>

                    <Port cx={LUTNodePortStyling.inportPositions.inpe.x} cy={LUTNodePortStyling.inportPositions.inpe.y} r={LUTNodePortStyling.portRadius}
                          style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}/>


                    <Port cx={LUTNodePortStyling.outportPositions.out.x} cy={LUTNodePortStyling.outportPositions.out.y} r={LUTNodePortStyling.portRadius}
                          style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}/>





                    <NodeName x="0" y={NodeStylingProperties.height + 22} style={{MozUserSelect: 'none'}} style={{MozUserSelect: 'none'}}  />
                    <NodeType x="22" y={NodeStylingProperties.height + 33} style={{MozUserSelect: 'none'}} style={{MozUserSelect: 'none'}}  />

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

var LUTNodePortStyling = {
    portRadius: 2,
    inportPositionRatio: 0,
    outportPositionRatio: 1,
    inportPositions: {
        inpa: {
            x: 3,
            y: 13
        },
        inpb: {
            x: 3,
            y: 24
        },
        inpc: {
            x: 3,
            y: 35
        },
        inpd: {
            x: 3,
            y: 46
        },
        inpe: {
            x: 3,
            y: 56
        }
    },
    outportPositions: {
        out: {
            x: NodeStylingProperties.width + 3,
            y: 33
        }

    }
};


var InportInpaText = React.createClass({
    render:function(){
        return(
            <text {...this.props} fontSize="10px" fontFamily="Verdana" >inpa</text>
        )
    }
});

var InportInpbText = React.createClass({
    render:function(){
        return(
            <text {...this.props} fontSize="10px" fontFamily="Verdana" >inpb</text>
        )
    }
});

var InportInpcText = React.createClass({
    render:function(){
        return(
            <text {...this.props} fontSize="10px" fontFamily="Verdana" >inpc</text>
        )
    }
});

var InportInpdText = React.createClass({
    render:function(){
        return(
            <text {...this.props} fontSize="10px" fontFamily="Verdana" >inpd</text>
        )
    }
});

var InportInpeText = React.createClass({
    render:function(){
        return(
            <text {...this.props} fontSize="10px" fontFamily="Verdana" >inpe</text>
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
            <text {...this.props} fontSize="15px" fontFamily="Verdana">OrLineDone</text>
        )
    }
});

var NodeType = React.createClass({
    render:function(){
        return(
            <text {...this.props} fontSize="8px" fontFamily="Verdana">LUT</text>
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

module.exports = LUTNode;
