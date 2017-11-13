/**
 * Created by twi18192 on 15/03/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';
import blockCollection from '../classes/blockItems';
import {Input, Select} from 'material-ui';

export default class WidgetCombo extends React.Component {

  onChange = e => {
    // Write the current value to Malcolm
    let blockItem = blockCollection.getBlockItemByName(this.props.blockName);
    MalcolmActionCreators.malcolmPut([blockItem.mri(), this.props.attributeName, "value"], e.target.value);
  };

  render() {
    let menuItems = [];

    for (let m = 0; m < this.props.blockAttribute.meta.choices.length; m++)
    {
      let choice = this.props.blockAttribute.meta.choices[m];
      menuItems.push(
        <option value={choice} key={choice}>
          {choice}
        </option>
      );
    }

    return (
      <Select
        native
        value={this.props.blockAttribute.value}
        input={<Input/>}
        onChange={this.onChange}
        className={this.props.className}
      >
        {menuItems}
      </Select>
    );
  }
}

WidgetCombo.propTypes = {
  blockName: PropTypes.string.isRequired,
  attributeName: PropTypes.string.isRequired,
  blockAttribute: PropTypes.any.isRequired,
  className: PropTypes.string
};
