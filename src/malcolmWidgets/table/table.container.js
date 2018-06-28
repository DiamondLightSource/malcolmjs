import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';

import blockUtils from '../../malcolm/blockUtils';
import {
  malcolmUpdateTable,
  malcolmSetFlag,
  malcolmCopyValue,
} from '../../malcolm/malcolmActionCreators';
import WidgetTable from './table.component';

const TableContainer = props => {
  if (props.attribute.localState === undefined) {
    props.copyTable([props.blockName, props.attributeName]);
  }
  return (
    <WidgetTable
      attribute={props.attribute}
      localState={props.attribute.localState}
      eventHandler={props.eventHandler}
      setFlag={props.setFlag}
    />
  );
};

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
  eventHandler: (path, value, row) => {
    dispatch(malcolmSetFlag(path, 'pending', true));
    dispatch(malcolmUpdateTable(path, value, row));
  },
  setFlag: (path, flag, state) => {
    dispatch(malcolmSetFlag(path, flag, state));
  },
  copyTable: path => {
    dispatch(malcolmCopyValue(path));
  },
});

TableContainer.propTypes = {
  blockName: PropTypes.string.isRequired,
  attributeName: PropTypes.string.isRequired,
  attribute: PropTypes.shape({
    localState: PropTypes.shape({}),
  }).isRequired,
  eventHandler: PropTypes.func.isRequired,
  setFlag: PropTypes.func.isRequired,
  copyTable: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withTheme()(TableContainer)
);
