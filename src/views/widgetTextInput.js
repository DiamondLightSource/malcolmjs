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
    // On loss of focus write the value if dirty
    // TODO: this will be ignored if we click outside the window and
    // the component is unmounted
    if (this.state.dirty) {
      this.writeValue();
    }
  };

  onFocus = (e) => {
    // Select all the text on focus
    let inputFieldElement = e.target;
    inputFieldElement.select();
    console.log(this.props.blockName);
  };

  onKeyDown = (e) => {
    if (e.key === "Return") {
      // Always write the value on return pressed
      this.writeValue();
    } else if (e.key === "Escape") {
      // Reset on escape
      this.setState({dirty: false});
    }
  };

  writeValue = () => {
    // Write the current value to Malcolm
    MalcolmActionCreators.malcolmAttributeValueEdited(
      this.props.blockName, this.props.attributeName, this.state.value);
    this.setState({dirty: false});
  };

  onChange = event => {
    // Store the temporary value so that it can be set on loss of focus
    this.setState({
      value: event.target.value,
      dirty: true
    });
  };

  render() {
    return (
      <Input value={this.state.dirty ? this.state.value : this.props.blockAttributeValue}
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
