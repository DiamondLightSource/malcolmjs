/* eslint react/no-array-index-key: 0 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import IconButton from '@material-ui/core/IconButton';
import { Add } from '@material-ui/icons';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';

import TableWidgetSelector, { getTableWidgetTags } from './widgetSelector';

const styles = theme => ({
  headerLayout: {
    tableLayout: 'fixed',
    width: 'calc(100% - 15px)',
  },
  footerLayout: {
    width: '100%',
  },
  headerLayoutNoScroll: {
    tableLayout: 'fixed',
    width: '100%',
  },
  tableLayout: {
    tableLayout: 'fixed',
  },
  tableBody: {
    overflowY: 'auto',
    height: 'calc(100% - 75px)',
    width: '100%',
  },
  rowFormat: {
    height: '30px',
  },
  incompleteRowFormat: {
    backgroundColor: emphasize(theme.palette.background.paper, 0.5),
    textAlign: 'Center',
    padding: '2px',
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
  const values =
    props.localState === undefined
      ? props.attribute.value
      : props.localState.value;
  const columnLabels = Object.keys(props.attribute.meta.elements);
  const rowChangeHandler = (rowPath, newValue) => {
    const rowValue = {};
    columnLabels.forEach(label => {
      rowValue[label] = values[label][rowPath.row];
      return 0;
    });
    rowValue[rowPath.label] = newValue;
    props.eventHandler(props.attribute.path, rowValue, rowPath.row);
  };
  const rowFlagHandler = (rowPath, flagType, flagState) => {
    if (props.localState !== undefined) {
      const rowFlags =
        props.localState.flags.rows[rowPath.row] === undefined
          ? {}
          : props.localState.flags.rows[rowPath.row];
      if (rowFlags[flagType] === undefined) {
        rowFlags[flagType] = {};
      }
      rowFlags[flagType][rowPath.label] = flagState;
      rowFlags[`_${flagType}`] = Object.values(rowFlags[flagType]).some(
        val => val
      );
      props.setFlag(props.attribute.path, rowPath.row, flagType, rowFlags);
    }
  };
  const columnWidgetTags = getTableWidgetTags(props.attribute);
  const rowNames = values[columnLabels[0]];
  const columnHeadings = columnLabels.map((label, column) => (
    <TableCell
      className={props.classes.textHeadings}
      padding="none"
      key={column}
    >
      {props.attribute.meta.elements[label].label}
    </TableCell>
  ));
  return (
    <div>
      <Table
        className={
          rowNames.length > 20
            ? props.classes.headerLayout
            : props.classes.headerLayoutNoScroll
        }
      >
        <TableHead>
          <TableRow className={props.classes.rowFormat}>
            {columnHeadings}
          </TableRow>
        </TableHead>
      </Table>
      <div className={props.classes.tableBody}>
        <Table className={props.classes.tableLayout}>
          <TableBody>
            {rowNames.map((name, row) => (
              <TableRow className={props.classes.rowFormat} key={row}>
                {columnLabels.map((label, column) => (
                  <TableCell
                    className={props.classes.textBody}
                    padding="none"
                    key={[row, column]}
                  >
                    <TableWidgetSelector
                      columnWidgetTag={columnWidgetTags[column]}
                      value={values[label][row]}
                      rowPath={{ label, row, column }}
                      rowChangeHandler={rowChangeHandler}
                      columnMeta={props.attribute.meta.elements[label]}
                      setFlag={rowFlagHandler}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Table>
          <TableFooter>
            {props.attribute.meta.writeable ? (
              <TableRow
                className={props.classes.rowFormat}
                key={rowNames.length}
              >
                <TableCell
                  className={props.classes.incompleteRowFormat}
                  padding="none"
                  key={[rowNames.length, 0]}
                >
                  <IconButton
                    onClick={() =>
                      props.addRow(props.attribute.path, rowNames.length)
                    }
                  >
                    <Add />
                  </IconButton>
                </TableCell>
              </TableRow>
            ) : null}
          </TableFooter>
        </Table>
      </div>

      <Table className={props.classes.footerLayout}>
        <TableFooter>
          <TableRow className={props.classes.rowFormat}>
            {props.footerItems.map((item, key) => (
              <TableCell key={key}>{item}</TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
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
      writeable: PropTypes.bool.isRequired,
      label: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
      elements: PropTypes.shape({}),
    }),
    unableToProcess: PropTypes.bool,
  }).isRequired,
  localState: PropTypes.shape({
    value: PropTypes.shape({}),
    flags: PropTypes.shape({
      rows: PropTypes.shape({}),
    }),
    hasIncompleteRow: PropTypes.bool,
  }),
  classes: PropTypes.shape({
    tableBody: PropTypes.string,
    headerLayoutNoScroll: PropTypes.string,
    headerLayout: PropTypes.string,
    footerLayout: PropTypes.string,
    tableLayout: PropTypes.string,
    textHeadings: PropTypes.string,
    textBody: PropTypes.string,
    rowFormat: PropTypes.string,
    incompleteRowFormat: PropTypes.string,
  }).isRequired,
  eventHandler: PropTypes.func.isRequired,
  addRow: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  setFlag: PropTypes.func.isRequired,
  footerItems: PropTypes.arrayOf(PropTypes.node),
};

WidgetTable.defaultProps = {
  localState: undefined,
  footerItems: [],
};
export default withStyles(styles, { withTheme: true })(WidgetTable);
