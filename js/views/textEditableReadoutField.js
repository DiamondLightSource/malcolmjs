/**
 * Created by twi18192 on 15/03/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';

export default class TextEditableReadoutField extends React.Component
{

 constructor(props)
   {
   super(props);
   this.handleOnBlur = this.handleOnBlur.bind(this);
   this.handleOnFocus = this.handleOnFocus.bind(this);
   this.handleOnChange = this.handleOnChange.bind(this);
   this.handleKeyUp = this.handleKeyUp.bind(this);
   this.state = {isUserEditing: false};
   }

  shouldComponentUpdate (nextProps, nextState)
    {
    return (
      nextProps.blockAttributeValue !== this.props.blockAttributeValue ||
      nextState.isUserEditing !== this.state.isUserEditing ||
      this.state.isUserEditing === true
    )
    }

  handleMalcolmCall (blockName, method, args)
    {
    console.log("malcolmCall in textEditableReadoutField");
    MalcolmActionCreators.malcolmCall(blockName, method, args)
    }

  handleOnBlur (e)
    {
    let inputFieldValue;
    let inputFieldElement   = e.target;
    let inputFieldBlockName = this.props.blockName;
    let inputFieldAttribute = this.props.attributeName;

    if (inputFieldElement.value === "")
      {
      /* Set the input field value back to the previous value */

      inputFieldElement.value = this.props.blockAttributeValue;
      inputFieldValue         = this.props.blockAttributeValue;
      }
    else
      {
      inputFieldValue = inputFieldElement.value;
      }

    /* Now I need to pass malcolmCall the corresponding
     method and arguments
     */

    let inputFieldSetMethodName = "_set_" + inputFieldAttribute;

    let argsObject = {};

    argsObject[inputFieldAttribute] = inputFieldValue;

    this.handleMalcolmCall(inputFieldBlockName, inputFieldSetMethodName, argsObject);

    this.setState({
      isUserEditing: false
    });

    }

  handleOnFocus (e)
    {
    let inputFieldElement = e.target;
    inputFieldElement.setSelectionRange(0, inputFieldElement.value.length);
    }

  handleOnChange (e)
    {
    this.setState({
      isUserEditing: true
    })
    }

  handleKeyUp (e)
    {
    if (e.keyCode === 13)
      {
      /* For handling when the enter key is pressed
       after editing the input field
       */
      document.getElementById(this.props.blockName
        + this.props.attributeName + "inputField").blur();
      }
    }

  render ()
    {

    let props = {
      id       : this.props.blockName + this.props.attributeName + "inputField",
      className: 'textInputFieldWidget',
      onFocus  : this.handleOnFocus,
      onChange : this.handleOnChange,
      onKeyUp  : this.handleKeyUp,
      onBlur   : this.handleOnBlur,
      value    : this.state.isUserEditing === true ?
        document.getElementById(this.props.blockName +
          this.props.attributeName + "inputField").value : this.props.blockAttributeValue
    };

    return (
      <input {...props} />
    )
    }
}

TextEditableReadoutField.propTypes = {
blockAttributeValue: PropTypes.any,
  tabObject          : PropTypes.object,
  blockName          : PropTypes.string,
  attributeName      : PropTypes.string,
};
