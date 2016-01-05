/**
 * Created by twi18192 on 10/12/15.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var NodeStore = require('../stores/nodeStore.js');
var nodeActions = require('../actions/nodeActions.js');
var paneActions = require('../actions/paneActions');

function getPComp1NodeState(){
  return {
    //selected: NodeStore.getPComp1SelectedState(),
    areAnyNodesSelected: NodeStore.getIfAnyNodesAreSelected(),
    defaultStyling: NodeStore.getPCompNodeStyling(),
    selectedStyling: NodeStore.getSelectedPCompNodeStyling(),
    //allNodePositions: NodeStore.getAllNodePositions(),
    allNodeInfo: NodeStore.getAllNodeInfo()
  }
}

var PCompNode = React.createClass({

  getInitialState: function(){
    return getPComp1NodeState();
  },

  _onChange: function(){
    this.setState(getPComp1NodeState());
    this.setState({selected: NodeStore.getAnyNodeSelectedState(ReactDOM.findDOMNode(this).id)});
  },

  componentDidMount: function(){
    NodeStore.addChangeListener(this._onChange);
    this.setState({selected: NodeStore.getAnyNodeSelectedState(ReactDOM.findDOMNode(this).id)});
    ReactDOM.findDOMNode(this).addEventListener('NodeSelect', this.nodeSelect);
  },

  componentWillUnmount: function(){
    NodeStore.removeChangeListener(this._onChange)
  },

  mouseOver: function(){
    //console.log("mouseOver");
    var rectangleName = this.props.id.concat("Rectangle");
    var test = document.getElementById(rectangleName);
    test.style.stroke = '#797979'
  },

  mouseLeave: function(){
    //console.log("mouseLeave");
    var rectangleName = this.props.id.concat("Rectangle");
    var test = document.getElementById(rectangleName);

    if(this.state.selected === true){
      console.log("this.state.selected is true, so don't reset the border colour");
    }
    else{
      test.style.stroke = 'black'
    }
  },

  nodeSelect: function(){
    console.log("PComp1 has been selected");
    //nodeActions.deselectAllNodes("deselect all nodes");
    nodeActions.selectNode(ReactDOM.findDOMNode(this).id);
    paneActions.openNodeTab(ReactDOM.findDOMNode(this).id);
    console.log(this.state.selected);
  },

  mouseDown: function(e){
    console.log("TGen1 mouseDown");
    console.log(e.currentTarget);
    console.log(e.currentTarget.parentNode);
    nodeActions.draggedElement(e.currentTarget.parentNode);
  },


  render: function(){

    if(this.state.selected === true){
      var currentStyling = this.state.selectedStyling;
    }
    else{
      var currentStyling = this.state.defaultStyling;
    }

    var rectangleStyling = currentStyling.rectangle.rectangleStyling;
    var rectanglePosition = currentStyling.rectangle.rectanglePosition;
    var inportPositions = currentStyling.ports.portPositions.inportPositions;
    var portStyling = currentStyling.ports.portStyling;
    var outportPositions = currentStyling.ports.portPositions.outportPositions;
    var textPosition = currentStyling.text.textPositions;
    //console.log(inportPositions);

    var nodeInfo = this.state.allNodeInfo[this.props.id];
    var nodePositionX = nodeInfo.position.x;
    var nodePositionY = nodeInfo.position.y;
    var nodeTranslate = "translate(" + nodePositionX + "," + nodePositionY + ")";

    var nodeName = nodeInfo.name;
    var rectangleString = "Rectangle";
    var rectangleName = this.props.id.concat(rectangleString);

    return(
      <g {...this.props} onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave} style={this.state.selected && this.state.areAnyNodesSelected || !this.state.selected && !this.state.areAnyNodesSelected ? window.NodeContainerStyle : window.nonSelectedNodeContainerStyle}
         transform={nodeTranslate} >

        <g style={{MozUserSelect: 'none'}} onMouseDown={this.mouseDown}  >
          <Rectangle id="nodeBackground" height="105" width="71" style={{fill: 'transparent', cursor: 'move'}}/> /* To allow the cursor to change when hovering over the entire node container */
          <Rectangle id={rectangleName} height={rectangleStyling.height} width={rectangleStyling.width} x={rectanglePosition.x} y={rectanglePosition.y} rx={7} ry={7}
                     style={{fill: 'lightgrey', 'strokeWidth': 1.65, stroke: this.state.selected ? '#797979' : 'black'}}
            //onClick={this.nodeClick} onDragStart={this.nodeDrag}


          />

          <Port cx={inportPositions.ena.x} cy={inportPositions.ena.y} r={portStyling.portRadius}
                style={{fill: portStyling.fill, stroke: portStyling.stroke, 'strokeWidth': 1.65}}/>
          <Port cx={inportPositions.posn.x} cy={inportPositions.posn.y} r={portStyling.portRadius}
                style={{fill: portStyling.fill, stroke: portStyling.stroke, 'strokeWidth': 1.65}}/>
          <Port cx={outportPositions.act.x } cy={outportPositions.act.y} r={portStyling.portRadius}
                style={{fill: portStyling.fill, stroke: portStyling.stroke, 'strokeWidth': 1.65}}/>
          <Port cx={outportPositions.out.x} cy={outportPositions.out.y} r={portStyling.portRadius}
                style={{fill: portStyling.fill, stroke: portStyling.stroke, 'strokeWidth': 1.65}}/>
          <Port cx={outportPositions.pulse.x} cy={outportPositions.pulse.y} r={portStyling.portRadius}
                style={{fill: portStyling.fill, stroke: portStyling.stroke, 'strokeWidth': 1.65}}/>

          <InportEnaText x={textPosition.ena.x} y={textPosition.ena.y} style={{MozUserSelect: 'none'}}  />
          <InportPosnText x={textPosition.posn.x} y={textPosition.posn.y} style={{MozUserSelect: 'none'}} />
          <OutportActText x={textPosition.act.x} y={textPosition.act.y} style={{MozUserSelect: 'none'}} />
          <OutportOutText x={textPosition.out.x} y={textPosition.out.y} style={{MozUserSelect: 'none'}} />
          <OutportPulseText x={textPosition.pulse.x} y={textPosition.pulse.y} style={{MozUserSelect: 'none'}} />

          <NodeName x="0" y={NodeStylingProperties.height + 22} style={{MozUserSelect: 'none'}} style={{MozUserSelect: 'none'}} NodeName={nodeName} />
          <NodeType x="22" y={NodeStylingProperties.height + 33} style={{MozUserSelect: 'none'}} style={{MozUserSelect: 'none'}}  />

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
      <text {...this.props} fontSize="15px" fontFamily="Verdana">{this.props.NodeName}</text>
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
