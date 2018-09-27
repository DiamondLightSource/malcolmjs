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
  malcolmRevertAction,
} from '../../malcolm/malcolmActionCreators';
import WidgetTable from './virtualizedTable.component';
import navigationActions from '../../malcolm/actions/navigation.actions';
import NavTypes from '../../malcolm/NavTypes';

const TableContainer = props => {
  const path = [props.blockName, props.attributeName];
  if (props.attribute.localState === undefined) {
    props.copyTable(path);
  }
  const pad = child => (
    <div style={{ padding: '4px', flexGrow: 1 }}>{child}</div>
  );
  const updateTime = `Update received @   ${new Date(
    props.attribute.raw.timeStamp.secondsPastEpoch * 1000
  ).toISOString()}`;
  const footerItems = [
    ...props.footerItems,
    props.attribute.localState && props.attribute.localState.flags.table.fresh
      ? pad(<Typography>Up to date!</Typography>)
      : pad(<Typography>{updateTime}</Typography>),
    pad(
      <ButtonAction
        clickAction={() => {
          props.rowClickHandler(path);
          props.revertHandler(path);
        }}
        text="Discard changes"
        method
      />
    ),
    pad(
      <ButtonAction
        clickAction={() => props.putTable(path, props.attribute.localState)}
        text="Submit"
        method
      />
    ),
  ];
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <WidgetTable
        attribute={props.attribute}
        localState={props.attribute.localState}
        eventHandler={props.eventHandler}
        setFlag={props.setFlag}
        showFooter
        addRow={props.addRow}
        infoClickHandler={props.infoClickHandler}
        rowClickHandler={props.rowClickHandler}
        selectedRow={props.selectedRow}
      />
      <div style={{ display: 'flex', position: 'bottom', padding: '4px' }}>
        {footerItems}
      </div>
    </div>
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
  let subElement;
  let selectedRow;
  const navLists = state.malcolm.navigation.navigationLists.slice(-3);
  const blockIndex = navLists.findIndex(nav => nav.navType === NavTypes.Block);
  const blockName =
    blockIndex !== -1 ? navLists[blockIndex].blockMri : undefined;
  const attributeName =
    navLists[blockIndex + 1].navType === NavTypes.Attribute
      ? navLists[blockIndex + 1].path
      : undefined;
  if (
    attribute.calculated.path[0] === blockName &&
    attribute.calculated.path[1] === attributeName
  ) {
    subElement =
      navLists[blockIndex + 1].navType === NavTypes.Attribute &&
      navLists[blockIndex + 1].subElements
        ? navLists[blockIndex + 1].subElements
        : undefined;
  }
  if (subElement && subElement[0] === 'row') {
    selectedRow = parseInt(subElement[1], 10);
  }
  return {
    attribute,
    selectedRow,
  };
};

const mapDispatchToProps = dispatch => ({
  rowClickHandler: (path, subElement) => {
    dispatch(
      navigationActions.navigateToSubElement(path[0], path[1], subElement)
    );
  },
  infoClickHandler: (path, subElement) => {
    dispatch(navigationActions.navigateToInfo(path[0], path[1], subElement));
  },
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
  revertHandler: path => {
    dispatch(malcolmRevertAction(path));
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
          selectedRow: PropTypes.number,
          dirty: PropTypes.bool,
          fresh: PropTypes.bool,
        }),
      }),
    }),
    calculated: PropTypes.shape({
      path: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    raw: PropTypes.shape({
      timeStamp: PropTypes.shape({
        secondsPastEpoch: PropTypes.string,
      }),
    }),
  }).isRequired,
  selectedRow: PropTypes.number.isRequired,
  revertHandler: PropTypes.func.isRequired,
  eventHandler: PropTypes.func.isRequired,
  infoClickHandler: PropTypes.func.isRequired,
  rowClickHandler: PropTypes.func.isRequired,
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
