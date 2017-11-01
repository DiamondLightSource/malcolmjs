/**
 * Created by twi18192 on 15/03/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';
import {Checkbox} from 'material-ui';


export default class WidgetCheckbox extends React.Component {

  onChange = e => {
    // Write the current value to Malcolm
    MalcolmActionCreators.malcolmAttributeValueEdited(
      this.props.blockName, this.props.attributeName, e.target.checked);
  };

  render() {
    return (
      <Checkbox
        checked={this.props.blockAttributeValue}
        onChange={this.onChange}
        className={this.props.className}
      />
    );
  }
}

WidgetCheckbox.propTypes = {
  blockName: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  attributeName: PropTypes.string.isRequired,
  blockAttributeValue: PropTypes.any.isRequired,
};
