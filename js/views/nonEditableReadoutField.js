/**
 * Created by twi18192 on 15/03/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';

import MalcolmActionCreators from '../actions/MalcolmActionCreators';

export default class NonEditableReadoutField extends React.Component {
constructor(props)
  {
  super(props);
  this.onClick = this.onClick.bind(this);
  }

shouldComponentUpdate(nextProps, nextState)
  {
  return (
    nextProps.blockAttributeValue !== this.props.blockAttributeValue
  )
  }

onClick(e)
  {
  e.preventDefault();
  //e.target.blur();
  }

render()
  {
  return (
    <input id={this.props.blockName + this.props.attributeName + "readoutField"}
           className={"readoutFieldWidget"}
           value={String(this.props.blockAttributeValue)}
           onMouseDown={this.onClick}
           onMouseUp={this.onClick}
           onMouseOut={this.onClick}
           readOnly={"true"}/>

  )
  }

}

NonEditableReadoutField.propTypes = {
  blockAttributeValue: PropTypes.string,
  blockName          : PropTypes.string,
  attributeName      : PropTypes.string

};
