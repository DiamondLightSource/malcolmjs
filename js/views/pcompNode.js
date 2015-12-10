/**
 * Created by twi18192 on 10/12/15.
 */

var React = require('../../node_modules/react/react');
var NodeStore = require('../stores/nodeStore.js');
var nodeActions = require('../actions/nodeActions.js');

var PCompNode = React.createClass({
  render: function(){
    return(
      <svg {...this.props} >
        <g style={{MozUserSelect: 'none'}}  >
          <Rectangle id="nodeBackground" height="105" width="71" style={{fill: 'transparent', cursor: 'move'}}/> /* To allow the cursor to change when hovering over the entire node container */
          <Rectangle id="rectangle" height={NodeStylingProperties.height} width={NodeStylingProperties.width} x="3" y="2" rx={NodeStylingProperties.rx} ry={NodeStylingProperties.ry}
                     style={{fill: 'lightgrey', stroke: 'black', 'strokeWidth': 1.65}}
            //onClick={this.nodeClick} onDragStart={this.nodeDrag}


          />

          <Port cx={PCompNodePortStyling.inportPositions.ena.x} cy={PCompNodePortStyling.inportPositions.ena.y} r={PCompNodePortStyling.portRadius}
                style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}/>
          <Port cx={PCompNodePortStyling.inportPositions.posn.x} cy={PCompNodePortStyling.inportPositions.posn.y} r={PCompNodePortStyling.portRadius}
                style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}/>

          <Port cx={PCompNodePortStyling.outportPositions.act.x } cy={PCompNodePortStyling.outportPositions.act.y} r={PCompNodePortStyling.portRadius}
                style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}
          />

          <Port cx={PCompNodePortStyling.outportPositions.out.x} cy={PCompNodePortStyling.outportPositions.out.y} r={PCompNodePortStyling.portRadius}
                style={{fill: 'black', stroke: 'black', 'strokeWidth': 1.65}}/>

          <Port cx={PCompNodePortStyling.outportPositions.pulse.x} cy={PCompNodePortStyling.outportPositions.pulse.y} r={PCompNodePortStyling.portRadius}
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

var PCompNodePortStyling = {
  portRadius: 2,
  inportPositionRatio: 0,
  outportPositionRatio: 1,
  inportPositions: {
    ena: {
      x: 3,
      y: 25
    },
    posn: {
      x: 3,
      y: 40
    }
  },
  outportPositions: {
    act: {
      x: NodeStylingProperties.width + 3,
      y: 25
    },
    out: {
      x: NodeStylingProperties.width + 3,
      y: 33
    },
    pulse: {
      x: NodeStylingProperties.width + 3,
      y: 40
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

var InportPosnText = React.createClass({
  render:function(){
    return(
      <text {...this.props} fontSize="10px" fontFamily="Verdana" >posn</text>
    )
  }
});

var OutportActText = React.createClass({
  render:function(){
    return(
      <text {...this.props} fontSize="10px" fontFamily="Verdana" >act</text>
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

var OutportPulseText = React.createClass({
  render:function(){
    return(
      <text {...this.props} fontSize="10px" fontFamily="Verdana" >pulse</text>
    )
  }
});




var NodeName = React.createClass({
  render: function(){
    return(
      <text {...this.props} fontSize="15px" fontFamily="Verdana">LinePulse</text>
    )
  }
});

var NodeType = React.createClass({
  render:function(){
    return(
      <text {...this.props} fontSize="8px" fontFamily="Verdana">PComp</text>
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

module.exports = PCompNode;
