/**
 * Created by twi18192 on 15/03/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';

import MalcolmActionCreators from '../actions/MalcolmActionCreators';


export default class DropdownEditableReadoutField extends React.Component
{
constructor(props)
  {
  super(props);
  this.handleDropdownOptionChange = this.handleDropdownOptionChange.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState)
    {
    return (
      nextProps.blockAttribute.value !== this.props.blockAttribute.value
    )
    }

  handleMalcolmCall(blockName, method, args)
    {
    console.log("malcolmCall in sidePane");
    MalcolmActionCreators.malcolmCall(blockName, method, args)
    }

  handleDropdownOptionChange(e)
    {

    let clickedOptionFromDropdownMenu = e.currentTarget.value;

    /* Testing 'VISIBLE' vs 'visible' for individual
     block tabs' visibility dropdowns
     */

    let blockAttribute;

    if (this.props.attributeName === 'VISIBLE')
      {
      blockAttribute = 'visible';
      }
    else
      {
      blockAttribute = this.props.attributeName;
      }

    let inputFieldSetMethodName = "_set_" + blockAttribute;
    let argsObject              = {};

    argsObject[this.props.attributeName] = clickedOptionFromDropdownMenu;

    this.handleMalcolmCall(this.props.blockName, inputFieldSetMethodName, argsObject);

    }

  render()
    {

    let dropdownOptions = [];

    for (let m = 0; m < this.props.blockAttribute.meta.choices.length; m++)
      {

      /* Try using the value attribute of <select>,
       rather than setting selected on an <option>
       */

      dropdownOptions.push(
        <option value={this.props.blockAttribute.meta.choices[m]}
                key={this.props.blockAttribute.meta.choices[m] + 'dropdownOption'}
        >
          {this.props.blockAttribute.meta.choices[m]}
        </option>
      )

      }

    let dropdownList =
          <select onChange={this.handleDropdownOptionChange}
                  className="dropdownMenuWidget"
                  value={this.props.blockAttribute.value}>
            {dropdownOptions}
          </select>;

    return (
      dropdownList
    )
    }

}

DropdownEditableReadoutField.propTypes = {
blockAttribute: PropTypes.object,
  tabObject     : PropTypes.object,
  attributeName : PropTypes.string,
  blockName     : PropTypes.string,

};

