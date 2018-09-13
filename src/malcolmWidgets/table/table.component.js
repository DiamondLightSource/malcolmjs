/* eslint react/no-array-index-key: 0 */
/* eslint no-underscore-dangle: 0 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import { Typography } from '@material-ui/core';
import AttributeAlarm, {
  AlarmStates,
} from '../attributeDetails/attributeAlarm/attributeAlarm.component';
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
    backgroundColor: '#424242',
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
    borderLeft: `2px solid ${theme.palette.divider}`,
    textAlign: 'Center',
  },
  blankCell: {
    backgroundColor: 'rgb(48, 48, 48)',
    textAlign: 'Center',
    padding: '2px',
  },
  textBody: {
    backgroundColor: theme.palette.background.default,
    textAlign: 'Center',
    padding: '2px',
  },
  button: {
    width: '22px',
    height: '22px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
});

const isBlankCell = props =>
  props.selectedRow === props.row
    ? props.classes.blankCell
    : props.classes.textBody;

const AlarmCell = props => (
  <TableCell
    className={isBlankCell(props)}
    padding="none"
    key={[props.row, -1]}
  >
    <IconButton
      className={props.classes.button}
      disableRipple
      onClick={() => {
        props.infoClickHandler(props.path, `row.${props.row}`);
      }}
    >
      <AttributeAlarm
        alarmSeverity={
          props.flags.rows[props.row] &&
          (props.flags.rows[props.row]._dirty ||
            props.flags.rows[props.row]._isChanged)
            ? AlarmStates.DIRTY
            : AlarmStates.NO_ALARM
        }
      />
    </IconButton>
  </TableCell>
);

const RowData = props => {
  let valueCells;
  if (props.columnLabels === undefined) {
    valueCells = [
      <TableCell
        className={isBlankCell(props)}
        padding="none"
        key={[props.row, 0]}
      >
        <TableWidgetSelector
          columnWidgetTag={props.columnWidgetTags[0]}
          value={props.values[props.row]}
          rowPath={{ row: props.row, column: 0 }}
          rowChangeHandler={props.rowChangeHandler}
          columnMeta={props.meta}
          setFlag={props.rowFlagHandler}
        />
      </TableCell>,
    ];
  } else {
    valueCells = props.columnLabels.map((label, column) => (
      <TableCell
        className={isBlankCell(props)}
        padding="none"
        key={[props.row, column]}
      >
        <TableWidgetSelector
          columnWidgetTag={props.columnWidgetTags[column]}
          value={props.values[props.row][label]}
          rowPath={{ label, row: props.row, column }}
          rowChangeHandler={props.rowChangeHandler}
          columnMeta={props.meta.elements[label]}
          setFlag={props.rowFlagHandler}
        />
      </TableCell>
    ));
  }
  return (
    <TableRow
      className={props.classes.rowFormat}
      key={props.row}
      onClick={() => {
        props.rowClickHandler(props.path, `row.${props.row}`);
      }}
    >
      {[
        props.hideInfo ? null : (
          <AlarmCell
            flags={props.flags}
            row={props.row}
            classes={props.classes}
            path={props.path}
            selectedRow={props.selectedRow}
            infoClickHandler={props.infoClickHandler}
          />
        ),
        ...valueCells,
      ]}
    </TableRow>
  );
};

const WidgetTable = props => {
  const columnLabels =
    props.localState === undefined
      ? Object.keys(props.attribute.raw.meta.elements)
      : props.localState.labels;
  const values =
    props.localState === undefined
      ? props.attribute.raw.value[columnLabels[0]].map((val, row) => {
          const rowData = {};
          columnLabels.forEach(label => {
            rowData[label] = props.attribute.raw.value[label][row];
          });
          return rowData;
        })
      : props.localState.value;
  const flags =
    props.localState === undefined
      ? { rows: [], table: {} }
      : props.localState.flags;
  const meta =
    props.localState === undefined
      ? props.attribute.raw.meta
      : props.localState.meta;
  const rowChangeHandler = (rowPath, newValue) => {
    let rowValue;
    if (columnLabels === undefined) {
      rowValue = newValue;
    } else {
      rowValue = {};
      columnLabels.forEach(label => {
        rowValue[label] = values[rowPath.row][label];
        return 0;
      });
      rowValue[rowPath.label] = newValue;
    }
    props.eventHandler(props.attribute.calculated.path, rowValue, rowPath.row);
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
      props.setFlag(
        props.attribute.calculated.path,
        rowPath.row,
        flagType,
        rowFlags
      );
    }
  };
  const headerCell = (columnTitle, column) => (
    <TableCell
      className={props.classes.textHeadings}
      padding="none"
      key={[-1, column]}
    >
      <Typography variant="subheading">{columnTitle}</Typography>
    </TableCell>
  );
  const columnWidgetTags = getTableWidgetTags(meta);
  const columnHeadings =
    columnLabels === undefined
      ? [headerCell(meta.label, 0)]
      : columnLabels.map((label, column) =>
          headerCell(
            meta.elements[label].label ? meta.elements[label].label : label,
            column
          )
        );

  return (
    <div style={{ height: '100%' }}>
      <Table
        className={
          values.length > 20
            ? props.classes.headerLayout
            : props.classes.headerLayoutNoScroll
        }
      >
        <TableHead>
          <TableRow className={props.classes.rowFormat} key={-1}>
            {[
              props.hideInfo ? null : (
                <TableCell
                  className={props.classes.textHeadings}
                  padding="none"
                  key={[-1, -1]}
                />
              ),
              ...columnHeadings,
            ]}
          </TableRow>
        </TableHead>
      </Table>
      <div className={props.classes.tableBody}>
        <Table className={props.classes.tableLayout}>
          <TableBody>
            {values.map((rowValue, row) => (
              <RowData
                key={`row.${row}`}
                row={row}
                path={props.attribute.calculated.path}
                classes={props.classes}
                flags={flags}
                infoClickHandler={props.infoClickHandler}
                rowClickHandler={props.rowClickHandler}
                rowChangeHandler={rowChangeHandler}
                rowFlagHandler={rowFlagHandler}
                columnWidgetTags={columnWidgetTags}
                columnLabels={columnLabels}
                values={values}
                meta={meta}
                hideInfo={props.hideInfo}
              />
            ))}
          </TableBody>
        </Table>
        <Table>
          <TableFooter>
            {meta.writeable ? (
              <TableRow className={props.classes.rowFormat} key={values.length}>
                <TableCell
                  className={props.classes.incompleteRowFormat}
                  padding="none"
                  key={[values.length, 0]}
                >
                  <IconButton
                    onClick={() =>
                      props.addRow(
                        props.attribute.calculated.path,
                        values.length
                      )
                    }
                  >
                    <Add style={{ width: '30px', height: '30px' }} />
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
              <TableCell key={[values.length + 1, key]}>{item}</TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

WidgetTable.propTypes = {
  attribute: PropTypes.shape({
    calculated: PropTypes.shape({
      name: PropTypes.string,
      path: PropTypes.arrayOf(PropTypes.string),
      pending: PropTypes.bool,
      errorState: PropTypes.bool,
      unableToProcess: PropTypes.bool,
    }),
    raw: PropTypes.shape({
      value: PropTypes.shape({}),
      typeid: PropTypes.string,
      labels: PropTypes.arrayOf(PropTypes.string),
      alarm: PropTypes.shape({
        severity: PropTypes.number,
      }),
      meta: PropTypes.shape({
        writeable: PropTypes.bool.isRequired,
        label: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        elements: PropTypes.shape({}),
      }),
    }),
  }).isRequired,
  localState: PropTypes.shape({
    value: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.shape({}),
        PropTypes.number,
        PropTypes.string,
        PropTypes.bool,
      ])
    ),
    rows: PropTypes.arrayOf(PropTypes.shape({})),
    flags: PropTypes.shape({
      rows: PropTypes.shape({}),
    }),
    hasIncompleteRow: PropTypes.bool,
    labels: PropTypes.arrayOf(PropTypes.string),
    meta: PropTypes.shape({
      writeable: PropTypes.bool.isRequired,
      label: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
      elements: PropTypes.shape({}),
    }),
  }),
  classes: PropTypes.shape({
    button: PropTypes.string,
    tableBody: PropTypes.string,
    headerLayoutNoScroll: PropTypes.string,
    headerLayout: PropTypes.string,
    footerLayout: PropTypes.string,
    tableLayout: PropTypes.string,
    textHeadings: PropTypes.string,
    blankCell: PropTypes.string,
    textBody: PropTypes.string,
    rowFormat: PropTypes.string,
    incompleteRowFormat: PropTypes.string,
  }).isRequired,
  eventHandler: PropTypes.func.isRequired,
  infoClickHandler: PropTypes.func.isRequired,
  rowClickHandler: PropTypes.func.isRequired,
  addRow: PropTypes.func.isRequired,
  setFlag: PropTypes.func.isRequired,
  footerItems: PropTypes.arrayOf(PropTypes.node),
  hideInfo: PropTypes.bool,
};

WidgetTable.defaultProps = {
  localState: undefined,
  footerItems: [],
  hideInfo: false,
};

AlarmCell.propTypes = {
  row: PropTypes.number.isRequired,
  path: PropTypes.arrayOf(PropTypes.string).isRequired,
  classes: PropTypes.shape({
    button: PropTypes.string,
    blankCell: PropTypes.string,
    textBody: PropTypes.string,
  }).isRequired,
  flags: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  infoClickHandler: PropTypes.func.isRequired,
};

RowData.propTypes = {
  row: PropTypes.number.isRequired,
  path: PropTypes.arrayOf(PropTypes.string).isRequired,
  classes: PropTypes.shape({
    button: PropTypes.string,
    blankCell: PropTypes.string,
    textBody: PropTypes.string,
    rowFormat: PropTypes.string,
  }).isRequired,
  flags: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  infoClickHandler: PropTypes.func.isRequired,
  rowChangeHandler: PropTypes.func.isRequired,
  rowClickHandler: PropTypes.func.isRequired,
  rowFlagHandler: PropTypes.func.isRequired,
  columnLabels: PropTypes.arrayOf(PropTypes.string),
  columnWidgetTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ).isRequired,
  meta: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.shape({ elements: PropTypes.shape({}) }),
  ]).isRequired,
  hideInfo: PropTypes.bool.isRequired,
  selectedRow: PropTypes.number,
};

RowData.defaultProps = {
  columnLabels: undefined,
  selectedRow: undefined,
};

isBlankCell.propTypes = {
  selectedRow: PropTypes.number,
  row: PropTypes.number.isRequired,
};

isBlankCell.defaultProps = {
  selectedRow: undefined,
};
export default withStyles(styles, { withTheme: true })(WidgetTable);
