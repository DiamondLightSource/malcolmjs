/**
 * Created by twi18192 on 15/03/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';
import {Input} from 'material-ui';

export default class WidgetTextInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.blockAttributeValue,
      dirty: false
    };
  }

  onBlur = (e) => {
    // On loss of focus reset the value
    this.setState({
      value: this.props.blockAttributeValue,
      editing: false,
    });
  };

  onFocus = (e) => {
    // Select all the text on focus
    e.target.select();
    this.setState({
      value: this.props.blockAttributeValue,
      editing: true
    });
  };

  onKeyDown = (e) => {
    console.log(e.target.value + this.state.editing);
    if (e.key === "Enter") {
      // Write the current value to Malcolm
      MalcolmActionCreators.malcolmAttributeValueEdited(
        this.props.blockName, this.props.attributeName, this.state.value);
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
      <Input value={this.state.editing ? this.state.value : this.props.blockAttributeValue}
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
  blockAttributeValue: PropTypes.any.isRequired,
  className: PropTypes.string
};
