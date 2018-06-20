/* eslint react/no-array-index-key: 0 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
/*
import { connect } from 'react-redux';

import blockUtils from '../../malcolm/blockUtils';
import {malcolmPutAction, malcolmSetPending} from "../../malcolm/malcolmActionCreators";
*/
import WidgetSelector, { getWidgetTags } from './widgetSelector';

const styles = theme => ({
  tableLayout: {
    tableLayout: 'fixed',
  },
  rowFormat: {
    height: '30px',
  },
  textHeadings: {
    backgroundColor: emphasize(theme.palette.background.paper, 0.3),
    textAlign: 'Center',
  },
  textBody: {
    backgroundColor: emphasize(theme.palette.background.paper, 0.1),
    textAlign: 'Center',
    padding: '2px',
  },
});

const WidgetTable = props => {
  if (!(props.attribute.typeid === 'epics:nt/NTTable:1.0')) {
    return null;
  }
  const rowChangeHandler = (rowPath, value) => {
    const rowValue = {};
    props.attribute.labels.forEach(label => {
      rowValue[label] = props.attribute.value[label][rowPath.row];
      return 0;
    });
    rowValue[rowPath.label] = value;
    props.eventHandler(props.attribute.path, rowValue);
  };
  const columnWidgetTags = getWidgetTags(props.attribute);
  const rowNames = props.attribute.value[props.attribute.labels[0]];
  const columnHeadings = props.attribute.labels.map((label, column) => (
    <TableCell
      className={props.classes.textHeadings}
      padding="none"
      key={column}
    >
      {label}
    </TableCell>
  ));
  return (
    <Table className={props.classes.tableLayout}>
      <TableHead>
        <TableRow className={props.classes.rowFormat}>
          {columnHeadings}
        </TableRow>
      </TableHead>
      <TableBody>
        {rowNames.map((name, row) => (
          <TableRow className={props.classes.rowFormat} key={row}>
            {props.attribute.labels.map((label, column) => (
              <TableCell
                className={props.classes.textBody}
                padding="none"
                key={[row, column]}
              >
                <WidgetSelector
                  columnWidgetTag={columnWidgetTags[column]}
                  value={props.attribute.value[label][row]}
                  rowPath={{ label, row, column }}
                  rowChangeHandler={rowChangeHandler}
                  columnMeta={props.attribute.meta.elements[label]}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

WidgetTable.propTypes = {
  attribute: PropTypes.shape({
    path: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.shape({}),
    name: PropTypes.string,
    typeid: PropTypes.string,
    labels: PropTypes.arrayOf(PropTypes.string),
    pending: PropTypes.bool,
    errorState: PropTypes.bool,
    alarm: PropTypes.shape({
      severity: PropTypes.number,
    }),
    meta: PropTypes.shape({
      label: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
      elements: PropTypes.shape({}),
    }),
    unableToProcess: PropTypes.bool,
  }).isRequired,
  classes: PropTypes.shape({
    tableLayout: PropTypes.string,
    textHeadings: PropTypes.string,
    textBody: PropTypes.string,
    rowFormat: PropTypes.string,
  }).isRequired,
  eventHandler: PropTypes.func.isRequired,
};

/*
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
    dispatch(malcolmSetPending(path, true));
    dispatch(malcolmPutAction(path, value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(WidgetTable)
);
*/
export default withStyles(styles, { withTheme: true })(WidgetTable);
