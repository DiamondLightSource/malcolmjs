import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
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
    props.attribute.localState &&
    props.attribute.localState.flags.table.fresh ? (
      <Typography>Up to date!</Typography>
    ) : (
      <Typography>
        Update received @{' '}
        {`${new Date(props.attribute.raw.timeStamp.secondsPastEpoch * 1000)}`}
      </Typography>
    ),
    <ButtonAction
      clickAction={() => props.copyTable(path)}
      text="Discard changes"
    />,
    <ButtonAction
      clickAction={() => props.putTable(path, props.attribute.localState)}
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
      addRow={props.addRow}
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
  addRow: (path, row) => {
    dispatch(malcolmUpdateTable(path, { insertRow: true }, row));
  },
  setFlag: (path, row, flagType, rowFlags) => {
    dispatch(malcolmSetTableFlag(path, row, flagType, rowFlags));
  },
  copyTable: path => {
    dispatch(malcolmCopyValue(path));
  },
  putTable: (path, tableState) => {
    const value = {};
    tableState.labels.forEach(label => {
      value[label] = [];
    });
    tableState.value.forEach(row => {
      tableState.labels.forEach(label => {
        value[label] = [...value[label], row[label]];
      });
    });

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
      isDirty: PropTypes.bool,
      flags: PropTypes.shape({
        table: PropTypes.shape({
          dirty: PropTypes.bool,
          fresh: PropTypes.bool,
        }),
      }),
    }),
    raw: PropTypes.shape({
      timeStamp: PropTypes.shape({
        secondsPastEpoch: PropTypes.string,
      }),
    }),
  }).isRequired,
  eventHandler: PropTypes.func.isRequired,
  setFlag: PropTypes.func.isRequired,
  addRow: PropTypes.func.isRequired,
  copyTable: PropTypes.func.isRequired,
  putTable: PropTypes.func.isRequired,
  footerItems: PropTypes.arrayOf(PropTypes.node),
  /* theme: PropTypes.shape({
    palette: PropTypes.shape({
      primary: PropTypes.shape({
        light: PropTypes.string,
      }),
      background: PropTypes.shape({
        paper: PropTypes.string,
      }),
    }),
  }).isRequired, */
};

TableContainer.defaultProps = {
  footerItems: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withTheme()(TableContainer)
);
