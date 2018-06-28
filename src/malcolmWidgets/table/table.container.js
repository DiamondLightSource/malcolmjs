import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import blockUtils from '../../malcolm/blockUtils';
import {
  malcolmUpdateTable,
  malcolmSetFlag,
  malcolmCopyValue,
  malcolmPutAction,
} from '../../malcolm/malcolmActionCreators';
import WidgetTable from './table.component';

const TableContainer = props => {
  const path = [props.blockName, props.attributeName];
  if (props.attribute.localState === undefined) {
    props.copyTable(path);
  }
  const footerItems = [
    ...props.footerItems,
    <Button onClick={() => props.copyTable(path)}>Revert</Button>,
    <Button
      onClick={() => props.putTable(path, props.attribute.localState.value)}
    >
      Submit
    </Button>,
  ];
  return (
    <WidgetTable
      attribute={props.attribute}
      localState={props.attribute.localState}
      eventHandler={props.eventHandler}
      setFlag={props.setFlag}
      footerItems={footerItems}
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
    dispatch(malcolmUpdateTable(path, value, row));
  },
  setFlag: (path, flag, state) => {
    dispatch(malcolmSetFlag(path, flag, state));
  },
  copyTable: path => {
    dispatch(malcolmCopyValue(path));
  },
  putTable: (path, value) => {
    dispatch(malcolmSetFlag(path, 'pending', true));
    dispatch(malcolmPutAction(path, value));
  },
});

TableContainer.propTypes = {
  blockName: PropTypes.string.isRequired,
  attributeName: PropTypes.string.isRequired,
  attribute: PropTypes.shape({
    localState: PropTypes.shape({
      value: PropTypes.shape({}),
    }),
  }).isRequired,
  eventHandler: PropTypes.func.isRequired,
  setFlag: PropTypes.func.isRequired,
  copyTable: PropTypes.func.isRequired,
  putTable: PropTypes.func.isRequired,
  footerItems: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withTheme()(TableContainer)
);
