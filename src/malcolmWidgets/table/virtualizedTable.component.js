/* eslint react/no-array-index-key: 0 */
/* eslint no-underscore-dangle: 0 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { emphasize, fade } from '@material-ui/core/styles/colorManipulator';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { Column, Table, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';
import AttributeAlarm, {
  AlarmStates,
} from '../attributeDetails/attributeAlarm/attributeAlarm.component';
import TableWidgetSelector, { getTableWidgetTags } from './widgetSelector';
import {
  isArrayType,
  Widget,
} from '../attributeDetails/attributeSelector/attributeSelector.component';

const styles = theme => ({
  header: {
    backgroundColor: theme.palette.background.paper,
    fontSize: '11pt',
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    color: theme.palette.text.primary,
    paddingRight: '0px !important',
  },
  incompleteRowFormat: {
    backgroundColor: emphasize(theme.palette.background.paper, 0.5),
    textAlign: 'Center',
    verticalAlign: 'middle',
    padding: '2px',
  },
  selectedRow: {
    backgroundColor: fade(theme.palette.secondary.main, 0.25),
    textAlign: 'Center',
    padding: '2px',
    paddingRight: '15px',
  },
  textBody: {
    backgroundColor: theme.palette.background.default,
    textAlign: 'Center',
    padding: '2px',
    paddingRight: '15px',
  },
  button: {
    width: '24px',
    height: '24px',
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  addRowButton: {
    position: 'absolute',
    right: '16px',
    bottom: '16px',
  },
});

const widgetWidths = {};
widgetWidths[Widget.CHECKBOX] = 36;
widgetWidths[Widget.LED] = 36;
widgetWidths[Widget.i_ALARM] = 36;

const variableWidgetMinWidth = 180;
const iconWidth = 36;

export const getTableState = props => {
  const tableState = {};
  const isArray = props.attribute.calculated.isMethod
    ? isArrayType(props.localState.meta)
    : isArrayType(props.attribute.raw.meta);
  tableState.columnLabels =
    !isArray && !props.attribute.calculated.isMethod
      ? Object.keys(props.attribute.raw.meta.elements)
      : undefined;
  tableState.columnLabels =
    props.localState !== undefined
      ? props.localState.labels
      : tableState.columnLabels;
  if (props.localState !== undefined) {
    tableState.values = props.localState.value;
  } else {
    tableState.values = !isArray
      ? props.attribute.raw.value[tableState.columnLabels[0]].map(
          (val, row) => {
            const rowData = {};
            tableState.columnLabels.forEach(label => {
              rowData[label] = props.attribute.raw.value[label][row];
            });
            return rowData;
          }
        )
      : JSON.parse(JSON.stringify(props.attribute.raw.value));
  }

  tableState.flags =
    props.localState === undefined
      ? { rows: [], table: {} }
      : props.localState.flags;
  tableState.meta =
    props.localState === undefined
      ? props.attribute.raw.meta
      : props.localState.meta;
  if (isArray) {
    tableState.flags.table = tableState.flags.table || {};
    tableState.flags.table.extendable = tableState.meta.writeable;
  } else {
    tableState.flags.table.extendable =
      tableState.flags.table.extendable === undefined
        ? tableState.meta.writeable &&
          !tableState.columnLabels.some(
            label => !tableState.meta.elements[label].writeable
          )
        : tableState.flags.table.extendable;
  }
  return tableState;
};

const getWidgetWidth = tag => widgetWidths[tag];

const getColumnWidths = (divWidth, columnWidgetTags, tableState, hideInfo) => {
  const fixedWidths = tableState.columnLabels
    ? tableState.columnLabels.map((label, index) => {
        const widgetWidth = getWidgetWidth(columnWidgetTags[index]);
        if (widgetWidth !== undefined) {
          return Math.max(
            getWidgetWidth(columnWidgetTags[index]),
            11 *
              (tableState.meta.elements[label].label
                ? tableState.meta.elements[label].label
                : label
              ).length +
              4
          );
        }
        return undefined;
      })
    : [undefined];
  const usedWidth = fixedWidths
    .filter(val => val !== undefined)
    .reduce((total, val) => total + val, 0);
  const numVariableWidth = fixedWidths.filter(val => val === undefined).length;
  return divWidth - usedWidth - iconWidth * !hideInfo >
    numVariableWidth * variableWidgetMinWidth
    ? fixedWidths.map(
        val =>
          val !== undefined
            ? val
            : (divWidth - usedWidth - iconWidth * !hideInfo) / numVariableWidth
      )
    : fixedWidths.map(
        val => (val !== undefined ? val : variableWidgetMinWidth)
      );
};

const isSelectedRow = (row, props) => {
  if (row === -1) {
    return props.classes.header;
  }
  return props.selectedRow === row
    ? props.classes.selectedRow
    : props.classes.textBody;
};
const AlarmCell = props => (
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
);

export const getRowData = (row, widgetTags, props, tableState, handlers) => {
  let valueCells;
  const attributePath = props.attribute.calculated.path;
  if (tableState.columnLabels === undefined) {
    valueCells = {
      value:
        row >= tableState.values.length ? null : (
          <TableWidgetSelector
            columnWidgetTag={widgetTags[0]}
            value={tableState.values[row]}
            rowPath={{ row, column: 0, attributePath }}
            rowChangeHandler={handlers.rowChangeHandler}
            columnMeta={tableState.meta}
            setFlag={handlers.rowFlagHandler}
          />
        ),
    };
  } else {
    valueCells = {};
    tableState.columnLabels.forEach((label, column) => {
      valueCells[label] =
        row >= tableState.values.length ? null : (
          <TableWidgetSelector
            columnWidgetTag={widgetTags[column]}
            value={tableState.values[row][label]}
            rowPath={{ label, row, column, attributePath }}
            rowChangeHandler={handlers.rowChangeHandler}
            columnMeta={tableState.meta.elements[label]}
            setFlag={handlers.rowFlagHandler}
          />
        );
    });
  }
  if (!props.hideInfo) {
    valueCells.alarmState =
      row >= tableState.values.length ? null : (
        <AlarmCell
          flags={tableState.flags}
          row={row}
          classes={props.classes}
          path={props.attribute.calculated.path}
          infoClickHandler={props.infoClickHandler}
          selectedRow={props.selectedRow}
        />
      );
  }
  return valueCells;
};

const columnCellRenderer = event => event.cellData; // event.isScrolling ? '.' : event.cellData;

const columns = (widths, tableState, hideInfo) => {
  let columnHeadings;
  if (tableState.columnLabels === undefined) {
    columnHeadings = [
      <Column
        dataKey="value"
        label={tableState.meta.label}
        width={widths[0]}
        cellRenderer={columnCellRenderer}
      />,
    ];
  } else {
    columnHeadings = tableState.columnLabels.map((label, column) => (
      <Column
        dataKey={label}
        label={
          tableState.meta.elements[label].label
            ? tableState.meta.elements[label].label
            : label
        }
        width={widths[column]}
        cellRenderer={columnCellRenderer}
      />
    ));
  }
  if (!hideInfo) {
    columnHeadings.splice(
      0,
      0,
      <Column
        dataKey="alarmState"
        label=""
        width={iconWidth}
        cellRenderer={columnCellRenderer}
      />
    );
  }
  return columnHeadings;
};

export const mapRowChangeHandler = (tableState, eventHandler) => (
  rowPath,
  newValue
) => {
  let rowValue;
  if (tableState.columnLabels === undefined) {
    rowValue = newValue;
  } else {
    rowValue = {};
    tableState.columnLabels.forEach(label => {
      rowValue[label] = tableState.values[rowPath.row][label];
      return 0;
    });
    rowValue[rowPath.label] = newValue;
  }
  eventHandler(rowPath.attributePath, rowValue, rowPath.row);
};

export const mapRowFlagHandler = (localState, setFlag) => (
  rowPath,
  flagType,
  flagState
) => {
  if (localState !== undefined) {
    const rowFlags =
      localState.flags.rows[rowPath.row] === undefined
        ? {}
        : localState.flags.rows[rowPath.row];
    if (rowFlags[flagType] === undefined) {
      rowFlags[flagType] = {};
    }
    rowFlags[flagType][rowPath.label] = flagState;
    rowFlags[`_${flagType}`] = Object.values(rowFlags[flagType]).some(
      val => val
    );
    setFlag(rowPath.attributePath, rowPath.row, flagType, rowFlags);
  }
};

const WidgetTable = props => {
  const tableState = getTableState(props);
  const handlers = {
    rowChangeHandler: mapRowChangeHandler(tableState, props.eventHandler),
    rowFlagHandler: mapRowFlagHandler(props.localState, props.setFlag),
  };
  const columnWidgetTags = getTableWidgetTags(tableState.meta);
  return (
    <div
      role="presentation"
      style={{
        width: '100%',
        height: props.showFooter ? 'calc(100% - 48px)' : '100%',
        position: 'relative',
      }}
      data-cy="table"
      onClick={() => {
        props.closePanelHandler();
      }}
    >
      <div
        style={{
          height: 'calc(100% - 12px)',
          overflowX: 'auto',
          overflowY: 'hidden',
          paddingBottom: '12px',
        }}
      >
        <AutoSizer>
          {autoSize => {
            const columnWidths = getColumnWidths(
              autoSize.width,
              columnWidgetTags,
              tableState,
              props.hideInfo
            );
            const { height } = autoSize;
            const width =
              columnWidths.reduce((total, val) => total + val) +
              iconWidth * !props.hideInfo;
            return (
              <div>
                <Table
                  noRowsRenderer={() => (
                    <div className={props.classes.textBody}>
                      <Typography style={{ fontSize: '14pt' }}>
                        No rows in table!
                      </Typography>
                    </div>
                  )}
                  headerClassName={props.classes.header}
                  rowClassName={({ index }) => isSelectedRow(index, props)}
                  height={height}
                  width={width}
                  headerHeight={iconWidth}
                  rowHeight={iconWidth}
                  onRowClick={e => {
                    // dispatch a row selection event here
                    if (e.index < tableState.values.length) {
                      props.rowClickHandler(
                        props.attribute.calculated.path,
                        `row.${e.index}`
                      );
                    } else {
                      props.closePanelHandler();
                    }
                    e.event.stopPropagation();
                  }}
                  onHeaderClick={e => {
                    const colIndex = tableState.columnLabels.findIndex(
                      c => e.dataKey === c
                    );
                    if (colIndex > -1) {
                      props.infoClickHandler(
                        props.attribute.calculated.path,
                        `col.${e.dataKey}`
                      );
                    }

                    e.event.stopPropagation();
                  }}
                  rowCount={
                    tableState.values.length !== 0
                      ? tableState.values.length + 2
                      : 0
                  }
                  rowGetter={({ index }) =>
                    getRowData(
                      index,
                      columnWidgetTags,
                      props,
                      tableState,
                      handlers
                    )
                  }
                >
                  {columns(columnWidths, tableState, props.hideInfo)}
                </Table>
              </div>
            );
          }}
        </AutoSizer>
      </div>
      {tableState.flags.table.extendable ? (
        <Tooltip id="1" title="Add row to bottom of table" placement="top">
          <Button
            variant="fab"
            color="secondary"
            onClick={e => {
              props.addRow(
                props.attribute.calculated.path,
                tableState.values.length
              );
              e.stopPropagation();
            }}
            className={props.classes.addRowButton}
            data-cy="addrowbutton"
          >
            <Add style={{ width: '32px', height: '32px' }} />
          </Button>
        </Tooltip>
      ) : null}
    </div>
  );
};

WidgetTable.propTypes = {
  classes: PropTypes.shape({
    incompleteRowFormat: PropTypes.string,
    header: PropTypes.string,
    addRowButton: PropTypes.string,
    textBody: PropTypes.string,
  }).isRequired,
  localState: PropTypes.shape({
    flags: PropTypes.shape({
      rows: PropTypes.arrayOf(PropTypes.shape({})),
    }),
  }),
  attribute: PropTypes.shape({
    calculated: PropTypes.shape({
      path: PropTypes.string,
    }),
  }).isRequired,
  eventHandler: PropTypes.func.isRequired,
  closePanelHandler: PropTypes.func.isRequired,
  rowClickHandler: PropTypes.func.isRequired,
  infoClickHandler: PropTypes.func.isRequired,
  setFlag: PropTypes.func.isRequired,
  addRow: PropTypes.func,
  hideInfo: PropTypes.bool,
  showFooter: PropTypes.bool,
};

WidgetTable.defaultProps = {
  localState: undefined,
  hideInfo: false,
  showFooter: false,
  addRow: () => {},
};

AlarmCell.propTypes = {
  classes: PropTypes.shape({
    button: PropTypes.string,
  }).isRequired,
  infoClickHandler: PropTypes.func.isRequired,
  flags: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  path: PropTypes.string.isRequired,
  row: PropTypes.number.isRequired,
};

export default withStyles(styles, { withTheme: true })(WidgetTable);
