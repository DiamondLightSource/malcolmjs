/**
 * Created by twi18192 on 15/03/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';
import blockCollection from '../classes/blockItems';
import {Input} from 'material-ui';
import attributeStore from '../stores/attributeStore';


export default class WidgetTextInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.blockAttributeValue === null ? "" : this.props.blockAttributeValue.toString(),
      editing: false
    };
  }

  resetState() {
    this.setState({
      value: this.props.blockAttributeValue === null ? "" : this.props.blockAttributeValue.toString(),
      editing: false
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.editing === false) {
      this.resetState();
    }
  }
  /*
  componentDidMount() {
    this.resetState();
  }

  componentWillUnmount() {
    this.resetState();
  }
  */

  onBlur = (e) => {
    // On loss of focus reset the value
    this.resetState();
  };


  onFocus = (e) => {
    // Select all the text on focus
    //this.resetState();
    e.target.select();
    this.setState({editing: true});
  };

  onKeyDown = (e) => {
    if (e.key === "Enter") {
      // Write the current value to Malcolm
      if (this.props.attributeName[0] === "*") {
        // It's a parameter
        this.props.blockAttribute.value = this.state.value;
        console.log("Update!");
        attributeStore.emitChange()
      } else {
        // It's an attribute
        let blockItem = blockCollection.getBlockItemByName(this.props.blockName);
        MalcolmActionCreators.malcolmPut([blockItem.mri(), this.props.attributeName, "value"], this.state.value);
      }
      e.target.blur();
    } else if (e.key === "Escape") {
      // Reset on escape
      e.target.blur();
    }
  };

  onChange = event => {
    // Store the temporary value
    this.setState({
        value: event.target.value,
    });
  };


  render() {
    return (
      <Input value={this.state.value}
             onBlur={this.onBlur}
             onFocus={this.onFocus}
             onKeyDown={this.onKeyDown}
             onChange={this.onChange}
             className={this.props.className}
      />
    );
  }
}


WidgetTextInput.propTypes = {
  blockName: PropTypes.string.isRequired,
  attributeName: PropTypes.string.isRequired,
  blockAttribute: PropTypes.any.isRequired,
  blockAttributeValue: PropTypes.any,
  className: PropTypes.string
};
