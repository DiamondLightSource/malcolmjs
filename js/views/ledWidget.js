/**
 * Created by twi18192 on 06/04/16.
 */

var React = require('react');

var LEDWidget = React.createClass({

  shouldComponentUpdate: function(nextProps, nextState){
    return(
      nextProps.blockAttribute !== this.props.blockAttribute ||
      nextProps.blockName !== this.props.blockName ||
      nextProps.attributeName !== this.props.attributeName
    )
  },

  render: function(){
    return(

      <svg style={{width: '150', height: '20'}}  >
        <circle r="8" style={{fill: this.props.blockAttribute.value ? 'orange' : 'lightblue',
                          stroke: 'white' }}
                      transform="translate(9, 11)" />
      </svg>

    )
  }
});

module.exports = LEDWidget;
