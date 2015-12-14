/**
 * Created by twi18192 on 10/12/15.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var NodeStore = require('../stores/nodeStore.js');
var nodeActions = require('../actions/nodeActions.js');

function getTGenNodeState(){
  return{
    //position: NodeStore.getTGenNodePosition(),
    //inports: NodeStore.getTGenNodeInportsState(),
    //outports: NodeStore.getTGenNodeOutportsState()
    selected: NodeStore.getTGen1SelectedState(),
    areAnyNodesSelected: NodeStore.getIfAnyNodesAreSelected(),
    defaultStyling: NodeStore.getTGenNodeStyling(),
    selectedStyling: NodeStore.getSelectedTGenNodeStyling()
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

    return (
      <svg {...this.props} onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave} style={this.state.selected && this.state.areAnyNodesSelected || !this.state.selected && !this.state.areAnyNodesSelected ? window.NodeContainerStyle : window.nonSelectedNodeContainerStyle} >

        <g style={{MozUserSelect: 'none'}} onMouseDown={this.mouseDown} >
          <Rectangle id="nodeBackground" height="105" width="71" style={{fill: 'transparent', cursor: 'move'}}/> /* To allow the cursor to change when hovering over the entire node container */

          <Rectangle id="TGenRectangle" height={rectangleStyling.height} width={rectangleStyling.width} x={rectanglePosition.x} y={rectanglePosition.y} rx={7} ry={7}
                     style={{fill: 'lightgrey', 'strokeWidth': 1.65, stroke: this.state.selected ? '#797979' : 'black'}}
            //onClick={this.nodeClick} onDragStart={this.nodeDrag}
          />
          <Port cx={inportPositions.ena.x} cy={inportPositions.ena.y} r={portStyling.portRadius}
                style={{fill: portStyling.fill, stroke: portStyling.stroke, 'strokeWidth': 1.65}}/>
          <Port cx={outportPositions.posn.x} cy={outportPositions.posn.y} r={portStyling.portRadius}
                style={{fill: portStyling.fill, stroke: portStyling.stroke, 'strokeWidth': 1.65}}/>
          <InportEnaText x={textPosition.ena.x} y={textPosition.ena.y} style={{MozUserSelect: 'none'}} />
          <OutportPosnText x={textPosition.posn.x} y={textPosition.posn.y} style={{MozUserSelect: 'none'}} />

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
