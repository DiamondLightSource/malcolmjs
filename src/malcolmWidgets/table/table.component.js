/* eslint react/no-array-index-key: 0 */
/* eslint no-underscore-dangle: 0 */

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
  blankCell: {
    backgroundColor: 'rgb(48, 48, 48)',
    textAlign: 'Center',
    padding: '2px',
  },
  textBody: {
    backgroundColor: emphasize(theme.palette.background.paper, 0.1),
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
    const rowValue = {};
    columnLabels.forEach(label => {
      rowValue[label] = values[rowPath.row][label];
      return 0;
    });
    rowValue[rowPath.label] = newValue;
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
  const columnWidgetTags = getTableWidgetTags(props.attribute);
  const columnHeadings = columnLabels.map((label, column) => (
    <TableCell
      className={props.classes.textHeadings}
      padding="none"
      key={column}
    >
      {meta.elements[label].label}
    </TableCell>
  ));
  return (
    <div>
      <Table
        className={
          values.length > 20
            ? props.classes.headerLayout
            : props.classes.headerLayoutNoScroll
        }
      >
        <TableHead>
          <TableRow className={props.classes.rowFormat}>
            {[
              <TableCell
                className={props.classes.textHeadings}
                padding="none"
                key={-1}
              />,
              ...columnHeadings,
            ]}
          </TableRow>
        </TableHead>
      </Table>
      <div className={props.classes.tableBody}>
        <Table className={props.classes.tableLayout}>
          <TableBody>
            {values.map((rowValue, row) => (
              <TableRow
                className={props.classes.rowFormat}
                key={row}
                onClick={() => {
                  props.rowClickHandler(
                    props.attribute.calculated.path,
                    `row.${row}`
                  );
                  props.setFlag(
                    props.attribute.calculated.path,
                    row,
                    'selected',
                    { selected: true }
                  );
                }}
              >
                {[
                  <TableCell
                    className={
                      flags.table.selectedRow === row
                        ? props.classes.blankCell
                        : props.classes.textBody
                    }
                    padding="none"
                    key={[row, -1]}
                  >
                    <IconButton
                      className={props.classes.button}
                      disableRipple
                      onClick={() => {
                        props.infoClickHandler(
                          props.attribute.calculated.path,
                          `row.${row}`
                        );
                        props.setFlag(
                          props.attribute.calculated.path,
                          row,
                          'selected',
                          { selected: true }
                        );
                      }}
                    >
                      <AttributeAlarm
                        alarmSeverity={
                          flags.rows[row] &&
                          (flags.rows[row]._dirty || flags.rows[row]._isChanged)
                            ? AlarmStates.DIRTY
                            : AlarmStates.NO_ALARM
                        }
                      />
                    </IconButton>
                  </TableCell>,
                  ...columnLabels.map((label, column) => (
                    <TableCell
                      className={
                        flags.table.selectedRow === row
                          ? props.classes.blankCell
                          : props.classes.textBody
                      }
                      padding="none"
                      key={[row, column]}
                    >
                      <TableWidgetSelector
                        columnWidgetTag={columnWidgetTags[column]}
                        value={values[row][label]}
                        rowPath={{ label, row, column }}
                        rowChangeHandler={rowChangeHandler}
                        columnMeta={meta.elements[label]}
                        setFlag={rowFlagHandler}
                      />
                    </TableCell>
                  )),
                ]}
              </TableRow>
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
    value: PropTypes.arrayOf(PropTypes.shape({})),
    rows: PropTypes.arrayOf(PropTypes.shape({})),
    flags: PropTypes.shape({
      rows: PropTypes.shape({}),
      table: PropTypes.shape({
        selectedRow: PropTypes.number,
      }),
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
  // infoClickHandler: PropTypes.func.isRequired,
  // rowClickHandler: PropTypes.func.isRequired,
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
