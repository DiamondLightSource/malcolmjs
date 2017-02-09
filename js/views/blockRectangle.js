/**
 * Created by twi18192 on 18/01/16.
 */

let React      = require('../../node_modules/react/react');
let blockStore = require('../stores/blockStore.js');

let BlockRectangle = React.createClass({

  propTypes: {
    selected              : React.PropTypes.bool,
    blockStyling          : React.PropTypes.object,
    blockIconURL          : React.PropTypes.string,
    blockId               : React.PropTypes.string,
    portThatHasBeenClicked: React.PropTypes.object
  },

  shouldComponentUpdate: function (nextProps, nextState)
    {
    return (
      nextProps.selected !== this.props.selected
    )
    },

  render: function ()
    {
    //console.log("render: blockRectangle");

    let blockStyling = this.props.blockStyling;

    /* Use this for when all icons are available */
    let blockIconURL = this.props.blockIconURL;

    return (
      <g>
        <rect id={this.props.blockId.concat("Rectangle")}
              height={blockStyling.outerRectangleHeight} width={blockStyling.outerRectangleWidth}
              x={0} y={0} rx={8} ry={8}
              style={{
                fill  : 'white', 'strokeWidth': 2,
                stroke: this.props.selected ? '#797979' : 'black',
                cursor: this.props.portThatHasBeenClicked === null ? "move" : "default"
              }}
          //onClick={this.nodeClick} onDragStart={this.nodeDrag}
        />
        <rect id={this.props.blockId.concat("InnerRectangle")}
              height={blockStyling.innerRectangleHeight} width={blockStyling.innerRectangleWidth}
              x={3} y={3} rx={6} ry={6}
              style={{
                fill  : 'rgba(230,238,240,0.94)',
                cursor: this.props.portThatHasBeenClicked === null ? "move" : "default"
              }}
        />

        <image height={blockStyling.innerRectangleHeight}
               width={blockStyling.innerRectangleWidth}
               x={3}
               y={3}
               style={{
                 cursor : this.props.portThatHasBeenClicked === null ? "move" : "default",
                 opacity: '0.5'
               }}
               xlinkHref="http://localhost:8080/icons/LUT.svg"
        />
      </g>
    )
    }

});

module.exports = BlockRectangle;
