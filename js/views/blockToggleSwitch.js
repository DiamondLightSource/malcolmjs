/**
 * Created by twi18192 on 22/03/16.
 */

var React = require('react');

var ToggleSwitch = require('react-toggle');

var BlockToggleSwitch = React.createClass({

  shouldComponentUpdate: function(nextProps, nextState){
    return(
      nextProps.blockAttributeValue !== this.props.blockAttributeValue
    )
  },

  render: function(){
    /* 'on' is the default setting of the switch, shall be
     from the server at some point (perhaps a ternary operator?)
     */
    return(

      <div style={{display: 'flex', alignItems: 'flex-start', left: '45'}} >
        <p style={{margin: '0px', width: '40px', position: 'relative'}} >Hide</p>
        <div id="testToggleSwitch" style={{height: '21', width: '50'}} >
          <ToggleSwitch onChange={this.props.toggleSwitch.bind(null, this.props.blockName,
                          this.props.attributeName,
                          this.props.blockAttributeValue)}
                      checked={this.props.blockAttributeValue === 'Show' ||
                               this.props.blockAttributeValue === true}
                      defaultChecked={this.props.blockAttributeValue === 'Show' ||
                                      this.props.blockAttributeValue === true}
                      id={this.props.blockName + 'toggleSwitch'}
                      on={this.props.blockAttributeValue === 'Show' ||
                          this.props.blockAttributeValue === true} />
        </div>
        <p style={{margin: '0px', width: '40px'}} >Show</p>
      </div>

    )
  }
});

module.exports = BlockToggleSwitch;
