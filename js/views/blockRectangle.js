/**
 * Created by twi18192 on 18/01/16.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var blockStore = require('../stores/blockStore.js');
var blockActions = require('../actions/blockActions.js');

function getBlockRectanglesState(){
  return {
    //portThatHasBeenClicked: NodeStore.getPortThatHasBeenClicked(),
    //allNodeTypesStyling: NodeStore.getAllNodeTypesStyling(),
  }
}

var BlockRectangles = React.createClass({
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
        <rect id={this.props.blockId.concat("Rectangle")}
              height={this.props.allBlockTypesStyling[this.props.blockType].rectangle.rectangleStyling.height} width={this.props.allBlockTypesStyling[this.props.blockType].rectangle.rectangleStyling.width}
              x={0} y={0} rx={7} ry={7}
              style={{fill: 'white', 'strokeWidth': 1.65,
               stroke: this.props.selected ? '#797979' : 'black',
               cursor: this.props.portThatHasBeenClicked === null ? "move" : "default"}}
          //onClick={this.nodeClick} onDragStart={this.nodeDrag}
        />
        <rect id={this.props.blockId.concat("InnerRectangle")}
              height={this.props.allBlockTypesStyling[this.props.blockType].rectangle.rectangleStyling.height - 4} width={this.props.allBlockTypesStyling[this.props.blockType].rectangle.rectangleStyling.width - 4}
              x={2} y={2} rx={5} ry={5}
              style={{fill: 'lightgrey',
               cursor: this.props.portThatHasBeenClicked === null ? "move" : "default"}}
        />
      </g>
    )
  }

});

module.exports = BlockRectangles;
