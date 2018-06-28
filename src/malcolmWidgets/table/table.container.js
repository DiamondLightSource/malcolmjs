import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';

import blockUtils from '../../malcolm/blockUtils';
import {
  malcolmPutAction,
  malcolmSetFlag,
} from '../../malcolm/malcolmActionCreators';
import WidgetTable from './table.component';

const TableContainer = props => (
  <WidgetTable
    attribute={props.attribute}
    eventHandler={props.eventHandler}
    setFlag={props.setFlag}
  />
);

const mapStateToProps = (state, ownProps) => {
  let attribute;
  if (ownProps.attributeName && ownProps.blockName) {
    attribute = blockUtils.findAttribute(
      state.malcolm.blocks,
      ownProps.blockName,
      ownProps.attributeName
    );
  }
  return {
    attribute,
  };
};

const mapDispatchToProps = dispatch => ({
  eventHandler: (path, value) => {
    dispatch(malcolmSetFlag(path, 'pending', true));
    dispatch(malcolmPutAction(path, value));
  },
  setFlag: (path, flag, state) => {
    dispatch(malcolmSetFlag(path, flag, state));
  },
});

TableContainer.propTypes = {
  attribute: PropTypes.shape({}).isRequired,
  eventHandler: PropTypes.func.isRequired,
  setFlag: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withTheme()(TableContainer)
);
