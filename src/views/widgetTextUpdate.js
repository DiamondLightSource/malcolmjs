/**
 * Created by twi18192 on 15/03/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import {Typography} from 'material-ui';


export default class WidgetTextUpdate extends React.Component {
  render() {
    return (
      <Typography
        type="body2"
        className={this.props.className}
      >
        {this.props.blockAttributeValue}
      </Typography>
    );
  }
}

WidgetTextUpdate.propTypes = {
  blockAttributeValue: PropTypes.string,
  className: PropTypes.string
};