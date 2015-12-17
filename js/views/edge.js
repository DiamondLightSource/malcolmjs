/**
 * Created by twi18192 on 10/12/15.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var NodeStore = require('../stores/nodeStore.js');
var nodeActions = require('../actions/nodeActions.js');

function getEdgeState(){
  return {
    //startNode: NodeStore.getGateNodeOutPort(),
    //endNode: NodeStore.getTGenNodeEnaPort(),

    Gate1Position: NodeStore.getGate1Position(),
    TGen1Position: NodeStore.getTGen1Position(),
    gateNodeOut: NodeStore.getGateNodeOutportOut(),
    tgenNodeEna: NodeStore.getTGenNodeInportEna(),
    selected: NodeStore.getIfEdgeIsSelected()
  }
}

var Edge = React.createClass({
  getInitialState: function(){
    return getEdgeState();
  },
  _onChange: function(){
    this.setState(getEdgeState());
  },
  componentDidMount: function(){
    NodeStore.addChangeListener(this._onChange);
    ReactDOM.findDOMNode(this).addEventListener('EdgeSelect', this.edgeSelect);
  },
  componentWillUnmount: function(){
    NodeStore.removeChangeListener(this._onChange);
  },
  mouseOver: function(){
    var test = document.getElementById('outerLine');
    if(this.state.selected === true){

    }
    else{
      test.style.stroke = '#797979'
    }
  },
  mouseLeave: function(){
    var test = document.getElementById('outerLine');
    if(this.state.selected === true){
      console.log("this.state.selected is true, so don't reset the border colour");
    }
    else{
      console.log("this.state.selected is false");
      test.style.stroke = 'lightgrey'
    }
  },
  edgeSelect: function(){
    console.log("edge has been selected");
    nodeActions.selectEdge(ReactDOM.findDOMNode(this).id);
  },

  render:function(){
    return(
      <g id="edgeContainer" {...this.props}>

        <Line id="outerLine" onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave}
              x1={this.props.x1} y1={this.props.y1}
              x2={this.props.x2} y2={this.props.y2}
              style={{strokeWidth: this.state.selected === true ? "10" : "7", stroke: this.state.selected === true ? "#797979" : "lightgrey", strokeLinecap: "round"}} />

        <Line id="innerLine" onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave}
          //x1={this.state.startNode.x} y1={this.state.startNode.y} x2={this.state.endNode.x} y2={this.state.endNode.y}
              x1={this.props.x1} y1={this.props.y1}
              x2={this.props.x2} y2={this.props.y2}
              style={{strokeWidth: '5', stroke:"orange"}} />


      </g>
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

module.exports = Edge;
