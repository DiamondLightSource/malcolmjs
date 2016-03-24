/**
 * Created by twi18192 on 22/03/16.
 */

var React = require('react');

var ToggleSwitch = require('react-toggle-switch');

var BlockToggleSwitch = React.createClass({
  render: function(){
    /* 'on' is the default setting of the switch, shall be
     from the server at some point (perhaps a ternary operator?)
     */
    console.log(this.props.toggleOrientation);
    return(
      <div style={{position: 'relative', left: '0',
                   bottom: '0px', width: '230px', height: '25px',
                   display: 'flex', alignItems: 'flex-start'}} >
        <b style={{margin: '0px', width: '100px'}} >{this.props.blockName}</b>
        <p style={{margin: '0px', width: '40px', position: 'relative'}} >Hide</p>
        <div id="testToggleSwitch" style={{position: 'relative',
                  height: '21', width: '50'}} >
          <ToggleSwitch onClick={this.props.toggleSwitch.bind(null, this.props.blockName)}
                        value={this.props.toggleOrientation === true ? 'true' : 'false'}
                        on={this.props.toggleOrientation} />
        </div>
        <p style={{margin: '0px', width: '40px', position: 'relative'}} >Show</p>
      </div>
    )
  }
});

module.exports = BlockToggleSwitch;
