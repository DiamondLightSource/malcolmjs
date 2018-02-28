/**
 * Created by twi18192 on 15/03/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';
import blockCollection from '../classes/blockItems';
import {Button} from 'material-ui';

export default class WidgetMethod extends React.Component {

  onClick = e => {
    // Write the current value to Malcolm
    let blockItem = blockCollection.getBlockItemByName(this.props.blockName);
    let parameters = {};
    for (let p in this.props.blockAttribute.method_parameters) {
      if (this.props.blockAttribute.method_parameters.hasOwnProperty(p)) {
        parameters[p] = this.props.blockAttribute.method_parameters[p].value;
      }
    }
    MalcolmActionCreators.malcolmPost([blockItem.mri(), this.props.attributeName], parameters);
  };

  render() {
    return (
      <Button
        raised
        disabled={!this.props.blockAttributeWriteable}
        className={this.props.className}
        onClick={this.onClick}
        color="primary">
        {this.props.blockAttribute.label}
      </Button>
    );
  }
}

WidgetMethod.propTypes = {
  blockName: PropTypes.string.isRequired,
  attributeName: PropTypes.string.isRequired,
  blockAttribute: PropTypes.any.isRequired,
  blockAttributeWriteable: PropTypes.any.isRequired,
  className: PropTypes.string
};
