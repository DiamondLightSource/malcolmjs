/**
 * Created by twi18192 on 22/03/16.
 */
import CheckBox from 'grommet/components/CheckBox';
//require('../components/styles/main.css');
import 'grommet/grommet.min.css';

var React = require('react');

var MalcolmActionCreators = require('../js/actions/MalcolmActionCreators');

var ToggleSwitch = require('react-toggle');

var BlockToggleSwitch = React.createClass({
  propTypes: {
    blockAttributeValue: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.bool
    ]).isRequired,
      blockName: React.PropTypes.string.isRequired,
      attributeName: React.PropTypes.string.isRequired
  },
  shouldComponentUpdate: function(nextProps, nextState){
    return(
      nextProps.blockAttributeValue !== this.props.blockAttributeValue
    )
  },

  handleMalcolmCall: function(blockName, method, args){
    MalcolmActionCreators.malcolmCall(blockName, method, args)
  },

  handleOnChange: function(e){

    var methodToInvoke;

    /* Check the blockName if it's VISIBILITY or not */

    if(this.props.blockName === 'VISIBILITY'){
      /* What may cause some confusion is that in the context
       of VISIBILITY, the name of a block is one of its attributes,
       but in the context of a block an attribute will be
       inputs, outputs, parameters etc
       */
      methodToInvoke = '_set_' + this.props.attributeName + '_visible';
    }
    else{
      if(this.props.attributeName === 'VISIBLE'){
        methodToInvoke = '_set_' + this.props.attributeName.toLowerCase();
      }
      else{
        methodToInvoke = '_set_' + this.props.attributeName;
      }
    }

    /* If I'm toggling, I want to pass the OPPOSITE of
     whatever the current value of the toggle is, whether
     it's a string specifying visibility, or a boolean
     specifying some other attribute
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

    this.handleMalcolmCall(this.props.blockName, methodToInvoke, argsObject);

  },

  render: function(){

    return(

      <div style={{display: 'flex', justifyContent: 'space-between', left: '45'}} >
        <p style={{margin: '0px', width: '40px', position: 'relative'}} >False</p>
        <div id="testToggleSwitch" >
          <CheckBox onChange={this.handleOnChange} toggle={true}
                      checked={this.props.blockAttributeValue === 'Show' ||
                               this.props.blockAttributeValue === true}
                      id={this.props.blockName + 'toggleSwitch'}
                      on={this.props.blockAttributeValue === 'Show' ||
                          this.props.blockAttributeValue === true}
                    size="small"
                    style={{height: '16', width: '44', marginLeft: '25'}}/>
        </div>
        <p style={{margin: '0px', width: '40px', marginLeft: '22'}} >True</p>
      </div>

    )
  }
});

module.exports = BlockToggleSwitch;
