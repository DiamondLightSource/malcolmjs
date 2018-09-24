/* eslint react/no-array-index-key: 0 */
/* eslint no-underscore-dangle: 0 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { emphasize, fade } from '@material-ui/core/styles/colorManipulator';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import { Typography } from '@material-ui/core';
import { Column, Table, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';
import AttributeAlarm, {
  AlarmStates,
} from '../attributeDetails/attributeAlarm/attributeAlarm.component';
import TableWidgetSelector, { getTableWidgetTags } from './widgetSelector';

const styles = theme => ({
  headerLayout: {
    tableLayout: 'fixed',
    width: 'calc(100% - 15px - 32px)',
  },
  footerLayout: {
    width: '100%',
  },
  headerLayoutNoScroll: {
    tableLayout: 'fixed',
    width: 'calc(100% - 32px)',
  },
  tableLayout: {
    tableLayout: 'fixed',
  },
  tableBody: {
    overflowY: 'auto',
    height: 'calc(100% - 75px)',
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  rowFormat: {
    height: '36px',
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
  '.ReactVirtualized__Table__row': {
    backgroundColor: theme.palette.background.default,
  },
  '.ReactVirtualized__Table__headerRow': {
    fontFamily: 'roboto',
    fontColor: theme.palette.primary.text,
  },
});

const widgetWidths = {
  'widget:checkbox': 48,
  'widget:led': 36,
  'info:alarm': 36,
};

const getWidgetWidth = tag => widgetWidths[tag];

const getColumnWidths = (divWidth, columnWidgetTags) => {
  const fixedWidths = columnWidgetTags.map(tag => getWidgetWidth(tag));
  const usedWidth = fixedWidths
    .filter(val => val !== undefined)
    .reduce((total, val) => total + val);
  const numVariableWidth = fixedWidths.filter(val => val === undefined)
    .length;
  return ((divWidth - usedWidth) > numVariableWidth*50) ? fixedWidths.map(
    val =>
      val !== undefined ? val : (divWidth - usedWidth) / numVariableWidth
  ) : fixedWidths.map(
    val =>
      val !== undefined ? val : 150
  );

};

const isSelectedRow = props =>
  props.selectedRow === props.row
    ? props.classes.selectedRow
    : props.classes.textBody;

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

class NewWidgetTable extends React.Component {
  render() {
    const columnLabels =
      this.props.localState === undefined
        ? Object.keys(this.props.attribute.raw.meta.elements)
        : this.props.localState.labels;
    const values =
      this.props.localState === undefined
        ? this.props.attribute.raw.value[columnLabels[0]].map((val, row) => {
            const rowData = {};
            columnLabels.forEach(label => {
              rowData[label] = this.props.attribute.raw.value[label][row];
            });
            return rowData;
          })
        : this.props.localState.value;
    const flags =
      this.props.localState === undefined
        ? { rows: [], table: {} }
        : this.props.localState.flags;
    const meta =
      this.props.localState === undefined
        ? this.props.attribute.raw.meta
        : this.props.localState.meta;
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
      this.props.eventHandler(
        this.props.attribute.calculated.path,
        rowValue,
        rowPath.row
      );
    };
    const rowFlagHandler = (rowPath, flagType, flagState) => {
      if (this.props.localState !== undefined) {
        const rowFlags =
          this.props.localState.flags.rows[rowPath.row] === undefined
            ? {}
            : this.props.localState.flags.rows[rowPath.row];
        if (rowFlags[flagType] === undefined) {
          rowFlags[flagType] = {};
        }
        rowFlags[flagType][rowPath.label] = flagState;
        rowFlags[`_${flagType}`] = Object.values(rowFlags[flagType]).some(
          val => val
        );
        this.props.setFlag(
          this.props.attribute.calculated.path,
          rowPath.row,
          flagType,
          rowFlags
        );
      }
    };
    const columnWidgetTags = getTableWidgetTags(meta);
    const columnCellRenderer = event => event.cellData; // event.isScrolling ? '.' : event.cellData;
    const columns = width => {
      let columnHeadings;
      if (columnLabels === undefined) {
        columnHeadings = [
          <Column
            dataKey="value"
            label={meta.label}
            width={width - 36 * !this.props.hideInfo}
            cellRenderer={columnCellRenderer}
          />,
        ];
      } else {
        const fixedWidths = columnWidgetTags.map(tag => getWidgetWidth(tag));
        const usedWidth = fixedWidths
          .filter(val => val !== undefined)
          .reduce((total, val) => total + val);
        const numVariableWidth = fixedWidths.filter(val => val === undefined)
          .length;
        const widths = ((width - usedWidth) > numVariableWidth*40) ? fixedWidths.map(
          val =>
            val !== undefined ? val : (width - usedWidth) / numVariableWidth
        ) : fixedWidths.map(
          val =>
            val !== undefined ? val : 150
        );
        console.log('------------');
        console.log(fixedWidths);
        console.log(usedWidth);
        console.log(numVariableWidth);
        console.log(widths);
        columnHeadings = columnLabels.map((label, column) => (
          <Column
            dataKey={label}
            label={
              meta.elements[label].label ? meta.elements[label].label : label
            }
            width={widths[column]}
            cellRenderer={columnCellRenderer}
          />
        ));
      }
      if (!this.props.hideInfo) {
        columnHeadings.splice(
          0,
          0,
          <Column
            dataKey="alarmState"
            label="Alarm"
            width={36}
            cellRenderer={columnCellRenderer}
          />
        );
      }
      return columnHeadings;
    };
    const getRowData = (row, columnWidgetTags, props) => {
      let valueCells;
      if (columnLabels === undefined) {
        valueCells = {
          value: (
            <TableWidgetSelector
              columnWidgetTag={columnWidgetTags[0]}
              value={values[row]}
              rowPath={{ row, column: 0 }}
              rowChangeHandler={rowChangeHandler}
              columnMeta={meta}
              setFlag={rowFlagHandler}
            />
          ),
        };
      } else {
        valueCells = {};
        columnLabels.forEach((label, column) => {
          valueCells[label] = (
            <TableWidgetSelector
              columnWidgetTag={columnWidgetTags[column]}
              value={values[row][label]}
              rowPath={{ label, row, column }}
              rowChangeHandler={rowChangeHandler}
              columnMeta={meta.elements[label]}
              setFlag={rowFlagHandler}
            />
          );
        });
      }
      if (!props.hideInfo) {
        valueCells.alarmState = (
          <AlarmCell
            flags={flags}
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

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <AutoSizer>
          {(autoSize) => {
            const columnWidths = getColumnWidths(autoSize.width, columnWidgetTags);
            const { height } = autoSize;
            const width = columnWidths.reduce((total, val) => total + val);
            return (
            <div>
              <Table
                height={height - 84}
                width={width}
                headerHeight={36}
                rowHeight={36}
                rowCount={values.length}
                rowGetter={({ index }) =>
                  getRowData(index, columnWidgetTags, this.props)
                }
                scrollToIndex={this.props.selectedRow}
                onScroll={event => {console.log('~~~~~~~~ did scroll!'); console.log(event);}}
              >
                {columns(width)}
              </Table>
              {meta.writeable ? (
                <div
                  className={this.props.incompleteRowFormat}
                  style={{
                    verticalAlign: 'middle',
                    backgroundColor: emphasize(
                      this.props.theme.palette.background.paper,
                      0.5
                    ),
                    width,
                    height: '36px',
                    position: 'absolute',
                    top:
                      36 * (values.length + 1) < height - 84
                        ? `${36 * (values.length + 1)}px`
                        : `${height - 84}px`,
                  }}
                >
                  <IconButton
                    onClick={() =>
                      this.props.addRow(
                        this.props.attribute.calculated.path,
                        values.length
                      )
                    }
                    style={{ height: '36px', width: '36px' }}
                  >
                    <Add style={{ width: '32px', height: '32px' }} />
                  </IconButton>
                </div>
              ) : null}{' '}
              <div
                style={{
                  position: 'absolute',
                  bottom: '0px',
                  display: 'flex',
                  alignItems: 'center',
                  height: '48px',
                  width,
                }}
              >
                {this.props.footerItems}
              </div>
            </div>
          )}}
        </AutoSizer>
      </div>
    );
  }
}
export default withStyles(styles, { withTheme: true })(NewWidgetTable);
