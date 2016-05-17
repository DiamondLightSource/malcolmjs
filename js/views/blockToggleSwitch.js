/**
 * Created by twi18192 on 22/03/16.
 */

var React = require('react');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var ToggleSwitch = require('react-toggle');

var BlockToggleSwitch = React.createClass({

  shouldComponentUpdate: function(nextProps, nextState){
    return(
      nextProps.blockAttributeValue !== this.props.blockAttributeValue
    )
  },

  handleMalcolmCall: function(blockName, method, args){
    console.log("malcolmCall in sidePane");
    MalcolmActionCreators.malcolmCall(blockName, method, args)
  },

  handleOnChange: function(e){
    console.log(this.props.blockAttributeValue);
    console.log(this.props.blockName);

    var methodToInvoke;

    /* Check the blockName if it's VISIBILITY or not */

    if(this.props.blockName === 'VISIBILITY'){
      /* WHat may cause some confusion is that in the context
       of VISIBILITY, the name of a block is one of its attributes,
       but in the context of a block its attributes will be
       inputs, outputs, parameters etc
       */
      methodToInvoke = '_set_' + this.props.attributeName + '_visible';
      console.log("in visibility");
    }
    else{
      if(this.props.attributeName === 'VISIBLE'){
        methodToInvoke = '_set_' + this.props.attributeName.toLowerCase();
      }
      else{
        methodToInvoke = '_set_' + this.props.attributeName;
      }
    }

    /* invoke malcolmCall to toggle the visible attribute
     of the given block
     */

    /* If I'm toggling, I want to pass the OPPOSITE of
     whatever the current value of the toggle is
     */

    var newValue;
    var argsObject = {};

    if(typeof this.props.blockAttributeValue === 'string') {
      if (this.props.blockAttributeValue === 'Show') {
        newValue = 'Hide';
      }
      else if (this.props.blockAttributeValue === 'Hide') {
        newValue = 'Show'
      }
    }
    else if(typeof this.props.blockAttributeValue === 'boolean'){
      newValue = !this.props.blockAttributeValue;
    }

    argsObject[this.props.attributeName] = newValue;

    console.log(newValue);

    /* Now invoke malcolmCall */

    this.handleMalcolmCall(this.props.blockName, methodToInvoke, argsObject);

    /* Should also close the tab if I'm hiding a block maybe? */

  },

  render: function(){
    /* 'on' is the default setting of the switch, shall be
     from the server at some point (perhaps a ternary operator?)
     */
    return(

      <div style={{display: 'flex', alignItems: 'flex-start', left: '45'}} >
        <p style={{margin: '0px', width: '40px', position: 'relative'}} >Hide</p>
        <div id="testToggleSwitch" style={{height: '21', width: '50'}} >
          <ToggleSwitch onChange={this.handleOnChange}
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
