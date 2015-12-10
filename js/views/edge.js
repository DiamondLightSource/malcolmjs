/**
 * Created by twi18192 on 10/12/15.
 */

var React = require('../../node_modules/react/react');
var NodeStore = require('../stores/nodeStore.js');

function getEdgeState(){
  return {
    //startNode: NodeStore.getGateNodeOutPort(),
    //endNode: NodeStore.getTGenNodeEnaPort(),

    Gate1Position: NodeStore.getGate1Position(),
    TGen1Position: NodeStore.getTGen1Position(),
    gateNodeOut: NodeStore.getGateNodeOutportOut(),
    tgenNodeEna: NodeStore.getTGenNodeInportEna()
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
  },
  componentWillUnmount: function(){
    NodeStore.removeChangeListener(this._onChange);
  },
  render:function(){
    return(
      <g id="edgeContainer" {...this.props}>
        <Line height="100" width="100"
          //x1={this.state.startNode.x} y1={this.state.startNode.y} x2={this.state.endNode.x} y2={this.state.endNode.y}
              x1={this.state.Gate1Position.x + this.state.gateNodeOut.x} y1={this.state.Gate1Position.y + this.state.gateNodeOut.y}
              x2={this.state.TGen1Position.x + this.state.tgenNodeEna.x} y2={this.state.TGen1Position.y + this.state.tgenNodeEna.y}
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
