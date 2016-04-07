/**
 * Created by twi18192 on 06/04/16.
 */

var React = require('react');

var LEDWidget = React.createClass({
  render: function(){
    return(
      <div style={{position: 'relative', height: '30'}} >
        <svg style={{width: '300', height: '30'}}  >
          <circle r="8" style={{fill: this.props.blockAttribute.value ? 'orange' : 'lightblue',
                                stroke: 'white' }}
                  transform="translate(153, 15)" />
          <text style={{fill: 'lightgrey'}} transform="translate(5, 20)" >
            {String(this.props.attributeName)}
          </text>
        </svg>
        <div style={{position: 'relative', left: '310', bottom: '33', width: '30', height: '30'}} >
          <i className="fa fa-cog fa-spin fa-2x"></i>
        </div>

      </div>
    )
  }
});

module.exports = LEDWidget;
