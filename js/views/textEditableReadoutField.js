/**
 * Created by twi18192 on 15/03/16.
 */

var React = require('react');

var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var TextEditableReadoutField = React.createClass({

  getInitialState: function(){
    return {
      isUserEditing: false
    }
  },

  shouldComponentUpdate: function(nextProps, nextState){
    return(
      nextProps.blockAttributeValue !== this.props.blockAttributeValue ||
      nextState.isUserEditing !== this.state.isUserEditing ||
      this.state.isUserEditing === true
    )
  },

  handleMalcolmCall: function(blockName, method, args){
    console.log("malcolmCall in textEditableReadoutField");
    MalcolmActionCreators.malcolmCall(blockName, method, args)
  },

  handleOnBlur: function(e){

    var inputFieldValue;
    var inputFieldElement = e.target;
    var inputFieldBlockName = e.target.className.slice(0, e.target.className.indexOf('widget'));

    var inputFieldAttribute = e.target.id.slice(inputFieldBlockName.length,
      e.target.id.indexOf('inputField'));

    if(inputFieldElement.value === ""){
      /* Set the input field value back to the previous value */

      inputFieldElement.value = this.props.blockAttributeValue;
      inputFieldValue = this.props.blockAttributeValue;

    }
    else{
      inputFieldValue = inputFieldElement.value;
    }

    /* Now I need to pass malcolmCall the corresponding
     method and arguments
     */

    var inputFieldSetMethodName = "_set_" +inputFieldAttribute;

    var argsObject = {};

    argsObject[inputFieldAttribute] = inputFieldValue;

    this.handleMalcolmCall(inputFieldBlockName, inputFieldSetMethodName, argsObject);

    this.setState({
      isUserEditing: false
    });

  },

  handleOnFocus: function(e){
    var inputFieldElement = e.target;
    inputFieldElement.setSelectionRange(0, inputFieldElement.value.length);
  },

  handleOnChange: function(e){
    this.setState({
      isUserEditing: true
    })
  },

  handleKeyUp: function(e){
    if(e.keyCode === 13){
      /* For handling when the enter key is pressed
      after editing the input field
       */
      document.getElementById(this.props.blockName
        + this.props.attributeName + "inputField").blur();
    }
  },

  render: function(){

    var props = {
      id: this.props.blockName + this.props.attributeName + "inputField",
      className: this.props.blockName + 'widget',
      style: {
        textAlign: 'left', borderRadius: '4px',
        border: '2px solid #202020',
        color: 'lightblue', backgroundColor:'#333333',
        paddingLeft: 3, width: 152
      },
      onFocus: this.handleOnFocus,
      onChange: this.handleOnChange,
      onKeyUp: this.handleKeyUp,
      onBlur: this.handleOnBlur,
      value: this.state.isUserEditing === true ?
        document.getElementById(this.props.blockName +
        this.props.attributeName + "inputField").value : this.props.blockAttributeValue
    };

    return(
      <input {...props} />
    )
  }

});

module.exports = TextEditableReadoutField;
