import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
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
  },
});

const SimpleTable = props => {
  const columnHeadings = props.labels.map(label => (
    <TableCell className={props.classes.textHeadings} padding="none">
      {label}
    </TableCell>
  ));
  const table = props.labels.map(label => props.values[label]);
  return (
    <Table>
      <TableHead>
        <TableRow className={props.classes.rowFormat}>
          {columnHeadings}
        </TableRow>
      </TableHead>
      <TableBody>
        {table[0].map((value, row) => (
          <TableRow className={props.classes.rowFormat}>
            {props.labels.map((label, column) => (
              <TableCell className={props.classes.textBody} padding="none">
                {table[column][row]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

SimpleTable.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.shape({}).isRequired,
  classes: PropTypes.shape({
    textBody: PropTypes.string,
    textHeadings: PropTypes.string,
    rowFormat: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles, { withTheme: true })(SimpleTable);
