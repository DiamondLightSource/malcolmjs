/* eslint react/no-array-index-key: 0 */
/* eslint no-underscore-dangle: 0 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { emphasize, fade } from '@material-ui/core/styles/colorManipulator';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import { Column, Table, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';
import AttributeAlarm, {
  AlarmStates,
} from '../attributeDetails/attributeAlarm/attributeAlarm.component';
import TableWidgetSelector, { getTableWidgetTags } from './widgetSelector';

const styles = theme => ({
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
  },
  textBody: {
    backgroundColor: theme.palette.background.default,
    textAlign: 'Center',
    padding: '2px',
  },
  button: {
    width: '24px',
    height: '24px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
});

const widgetWidths = {
  'widget:checkbox': 48,
  'widget:led': 36,
  'info:alarm': 36,
};

const getTableState = props => {
  const tableState = {};
  tableState.columnLabels =
    props.localState === undefined
      ? Object.keys(props.attribute.raw.meta.elements)
      : props.localState.labels;
  tableState.values =
    props.localState === undefined
      ? props.attribute.raw.value[tableState.columnLabels[0]].map(
          (val, row) => {
            const rowData = {};
            tableState.columnLabels.forEach(label => {
              rowData[label] = props.attribute.raw.value[label][row];
            });
            return rowData;
          }
        )
      : props.localState.value;
  tableState.flags =
    props.localState === undefined
      ? { rows: [], table: {} }
      : props.localState.flags;
  tableState.meta =
    props.localState === undefined
      ? props.attribute.raw.meta
      : props.localState.meta;
  return tableState;
};

const getWidgetWidth = tag => widgetWidths[tag];

const getColumnWidths = (
  divWidth,
  columnWidgetTags,
  columnLabels,
  hideInfo
) => {
  const fixedWidths = columnWidgetTags.map(
    (tag, index) =>
      getWidgetWidth(tag) !== undefined
        ? Math.max(getWidgetWidth(tag), 11 * columnLabels[index].length + 4)
        : undefined
  );
  const usedWidth = fixedWidths
    .filter(val => val !== undefined)
    .reduce((total, val) => total + val, 0);
  const numVariableWidth = fixedWidths.filter(val => val === undefined).length;
  return divWidth - usedWidth - 36 * !hideInfo > numVariableWidth * 180
    ? fixedWidths.map(
        val =>
          val !== undefined
            ? val
            : (divWidth - usedWidth - 36 * !hideInfo) / numVariableWidth
      )
    : fixedWidths.map(val => (val !== undefined ? val : 180));
};

const isSelectedRow = (row, props) => {
  const classes = styles(props.theme);
  return props.selectedRow === row ? classes.selectedRow : classes.textBody;
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

const getRowData = (row, widgetTags, props, tableState, handlers) => {
  let valueCells;
  if (tableState.columnLabels === undefined) {
    valueCells = {
      value:
        row >= tableState.values.length ? null : (
          <TableWidgetSelector
            columnWidgetTag={widgetTags[0]}
            value={tableState.values[row]}
            rowPath={{ row, column: 0 }}
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
            rowPath={{ label, row, column }}
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
        width={36}
        cellRenderer={columnCellRenderer}
      />
    );
  }
  return columnHeadings;
};

const WidgetTable = props => {
  const tableState = getTableState(props);

  const rowChangeHandler = (rowPath, newValue) => {
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
  const handlers = { rowChangeHandler, rowFlagHandler };
  const columnWidgetTags = getTableWidgetTags(tableState.meta);
  return (
    <div
      role="presentation"
      style={{
        width: '100%',
        height: props.showFooter ? 'calc(100% - 48px)' : '100%',
        overflowX: 'auto',
      }}
      data-cy="table"
      onClick={() => {
        props.closePanelHandler();
      }}
    >
      <AutoSizer>
        {autoSize => {
          const columnWidths = getColumnWidths(
            autoSize.width,
            columnWidgetTags,
            tableState.columnLabels,
            props.hideInfo
          );
          const { height } = autoSize;
          const width =
            columnWidths.reduce((total, val) => total + val) +
            36 * !props.hideInfo;
          return (
            <div>
              <Table
                rowStyle={({ index }) => isSelectedRow(index, props)}
                height={height - 84}
                width={width}
                onRowClick={e => {
                  // dispatch a row selection event here
                  e.event.stopPropagation();
                }}
                headerHeight={36}
                rowHeight={36}
                rowCount={tableState.values.length + 2}
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
              {tableState.meta.writeable ? (
                <div
                  className={props.classes.incompleteRowFormat}
                  style={{
                    width,
                    height: '36px',
                    position: 'absolute',
                    top:
                      36 * (tableState.values.length + 3) < height - 84
                        ? `${36 * (tableState.values.length + 3)}px`
                        : `${height - 84}px`,
                  }}
                >
                  <IconButton
                    onClick={e => {
                      props.addRow(
                        props.attribute.calculated.path,
                        tableState.values.length
                      );
                      e.stopPropagation();
                    }}
                    style={{ height: '36px', width: '36px' }}
                    data-cy="addrowbutton"
                  >
                    <Add style={{ width: '32px', height: '32px' }} />
                  </IconButton>
                </div>
              ) : null}{' '}
            </div>
          );
        }}
      </AutoSizer>
    </div>
  );
};

WidgetTable.propTypes = {
  classes: PropTypes.shape({
    incompleteRowFormat: PropTypes.string,
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
