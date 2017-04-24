/**
 * Created by twi18192 on 22/03/16.
 */
let belle = require('belle');
let Toggle = belle.Toggle;
let Choice = belle.Choice;
//require('../components/styles/main.css');
import 'grommet/grommet.min.css';

let React = require('react');

let MalcolmActionCreators = require('../js/actions/MalcolmActionCreators');

let BlockToggleSwitch = React.createClass({
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

    let methodToInvoke;

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

    let newValue;
    let argsObject = {};

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
        <span style={{margin: '0px', width: '40px', position: 'relative', verticalAlign: 'middle'}} >False</span>
        <div id="testToggleSwitch" >
          <Toggle onUpdate={this.handleOnChange}
                      value={this.props.blockAttributeValue === 'Show' ||
                               this.props.blockAttributeValue === true}
                      id={this.props.blockName + 'toggleSwitch'}
                  firstChoiceStyle={Object.assign({}, belle.style.toggle.firstChoiceStyle, { backgroundColor: 'rgba(127, 255, 127, 0.8)', color: 'rgba(0, 0, 255, 1.0)'})}
                  style={Object.assign({}, belle.style.toggle.style, { transform: 'scale(0.6)'})}
                  sliderStyle={Object.assign({}, belle.style.toggle.sliderStyle)}
                  handleStyle={Object.assign({}, belle.style.toggle.handleStyle, {backgroundColor: 'rgba(127, 127, 200, 1.0)'})}
                  secondChoiceStyle={Object.assign({}, belle.style.toggle.secondChoiceStyle, { backgroundColor: 'rgba(127, 127, 127, 1.0)' })}>
            <Choice value>Show</Choice>
            <Choice value={ false }>Hide</Choice>
        </Toggle>
        </div>
        <p style={{margin: '0px', width: '40px', marginLeft: '22',verticalAlign: 'middle'}} >True</p>
      </div>

    )
  }
});

module.exports = BlockToggleSwitch;
