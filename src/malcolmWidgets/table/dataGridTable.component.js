/* eslint react/no-array-index-key: 0 */
/* eslint no-underscore-dangle: 0 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { emphasize, fade } from '@material-ui/core/styles/colorManipulator';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import { Typography } from '@material-ui/core';
import ReactDataGrid from 'react-data-grid';
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
});

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
  componentDidMount() {
    const headerCells = [
      ...document.getElementsByClassName('react-grid-HeaderCell'),
    ];
    const header = [...document.getElementsByClassName('react-grid-Header')];
    const canvas = [...document.getElementsByClassName('react-grid-Canvas')];
    if (headerCells.length !== 0) {
      headerCells.forEach(cell => {
        const oldStyle = cell.getAttribute('style');
        cell.setAttribute(
          'style',
          ` ${oldStyle}background-color: ${
            this.props.theme.palette.background.paper
          }; font-family: roboto; border-bottom-width: 0; border-right-width: 2px; border-right-color: ${
            this.props.theme.palette.divider
          } height: 36px; padding: 0; vertical-align: middle; margin-right: 2px`
        );
      });
    }
    if (canvas.length !== 0) {
      canvas.forEach(cell => {
        const oldStyle = cell.getAttribute('style');
        cell.setAttribute(
          'style',
          ` ${oldStyle}background-color: ${
            this.props.theme.palette.background.default
          };`
        );
      });
    }
    if (header.length !== 0) {
      header.forEach(cell => {
        const oldStyle = cell.getAttribute('style');
        cell.setAttribute(
          'style',
          ` ${oldStyle}background-color: ${
            this.props.theme.palette.background.paper
          };`
        );
      });
    }
  }
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
    const columnHeadings =
      columnLabels === undefined
        ? [
            {
              key: 'value',
              name: meta.label,
              resizable: true,
            },
          ]
        : columnLabels.map(label => ({
            key: label,
            name: meta.elements[label].label
              ? meta.elements[label].label
              : label,
            resizable: true,
          }));
    if (!this.props.hideInfo) {
      columnHeadings.splice(0, 0, {
        key: 'alarmState',
        name: 'Alarm',
        resizable: true,
      });
    }
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

    console.log('hello!');
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <ReactDataGrid
          columns={columnHeadings}
          rowsCount={values.length}
          rowGetter={row => getRowData(row, columnWidgetTags, this.props)}
          minHeight={700}
        />
        {meta.writeable ? (
          <div>
            <IconButton
              onClick={() =>
                this.props.addRow(
                  this.props.attribute.calculated.path,
                  values.length
                )
              }
            >
              <Add style={{ width: '32px', height: '32px' }} />
            </IconButton>
          </div>
        ) : null}
        <div style={{ display: 'flex', position: 'bottom', padding: '4px' }}>
          {this.props.footerItems}
        </div>
      </div>
    );
  }
}
export default withStyles(styles, { withTheme: true })(NewWidgetTable);
