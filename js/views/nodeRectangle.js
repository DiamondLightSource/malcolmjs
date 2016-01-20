/**
 * Created by twi18192 on 18/01/16.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var NodeStore = require('../stores/nodeStore.js');
var nodeActions = require('../actions/nodeActions.js');

function getNodeRectanglesState(){
  return {
    //portThatHasBeenClicked: NodeStore.getPortThatHasBeenClicked(),
    //allNodeTypesStyling: NodeStore.getAllNodeTypesStyling(),
  }
}

var NodeRectangles = React.createClass({
  //getInitialState: function(){
  //  return getNodeRectanglesState();
  //},
  //componentDidMount: function(){
  //  NodeStore.addChangeListener(this._onChange);
  //},
  //componentWillUnmount: function(){
  //  NodeStore.removeChangeListener(this._onChange);
  //},
  //_onChange: function(){
  //  this.setState(getNodeRectanglesState());
  //},

  render: function(){

    return(
      <g>
        <rect id={this.props.nodeId.concat("Rectangle")}
              height={this.props.allNodeTypesStyling[this.props.nodeType].rectangle.rectangleStyling.height} width={this.props.allNodeTypesStyling[this.props.nodeType].rectangle.rectangleStyling.width}
              x={0} y={0} rx={7} ry={7}
              style={{fill: 'lightgrey', 'strokeWidth': 1.65,
               stroke: this.props.selected ? '#797979' : 'black',
               cursor: this.props.portThatHasBeenClicked === null ? "move" : "default"}}
          //onClick={this.nodeClick} onDragStart={this.nodeDrag}
        />
      </g>
    )
  }

});

module.exports = NodeRectangles;
