import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';
import ButtonAction from '../buttonAction/buttonAction.component';

import blockUtils from '../../malcolm/blockUtils';
import {
  malcolmUpdateTable,
  malcolmSetTableFlag,
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
    <ButtonAction clickAction={() => props.copyTable(path)} text="Revert" />,
    <ButtonAction
      clickAction={() => props.putTable(path, props.attribute.localState.value)}
      text="Submit"
    />,
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
    dispatch(malcolmSetTableFlag(path, flag, state));
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
  footerItems: PropTypes.arrayOf(PropTypes.node),
};

TableContainer.defaultProps = {
  footerItems: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withTheme()(TableContainer)
);
