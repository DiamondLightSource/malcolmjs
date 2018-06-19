/* eslint react/no-array-index-key: 0 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
// import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// import blockUtils from '../../malcolm/blockUtils';
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
  const columnWidgetTags = getWidgetTags(props.attribute);
  const columnHeadings = props.attribute.labels.map((label, column) => (
    <TableCell
      className={props.classes.textHeadings}
      padding="none"
      key={column}
    >
      {label}
    </TableCell>
  ));
  const table = props.attribute.labels.map(
    label => props.attribute.value[label]
  );
  return (
    <Table className={props.classes.tableLayout}>
      <TableHead>
        <TableRow className={props.classes.rowFormat}>
          {columnHeadings}
        </TableRow>
      </TableHead>
      <TableBody>
        {table[0].map((value, row) => (
          <TableRow className={props.classes.rowFormat} key={row}>
            {props.attribute.labels.map((label, column) => (
              <TableCell
                className={props.classes.textBody}
                padding="none"
                key={[row, column]}
              >
                <WidgetSelector
                  columnWidgetTag={columnWidgetTags[column]}
                  value={table[column][row]}
                  rowPath={{ label, row }}
                  rowChangeHandler={props.eventHandler}
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
    value: PropTypes.shape({}).isRequired,
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
  // lint analysis giving false positive here...
  // eslint-disable-next-line react/no-unused-prop-types
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

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(WidgetTable)
);
*/
export default withStyles(styles, { withTheme: true })(WidgetTable);
