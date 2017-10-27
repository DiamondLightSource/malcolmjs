/**
 * Created by twi18192 on 06/04/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'material-ui';


export default class WidgetLED extends React.Component {
  render() {
    return (
      <Icon color="primary" className={this.props.className}>
        {this.props.blockAttributeValue ? "radio_button_checked" : "radio_button_unchecked"}
      </Icon>
    );
  }
}

WidgetLED.propTypes = {
  blockAttributeValue: PropTypes.bool.isRequired,
  className: PropTypes.string
};