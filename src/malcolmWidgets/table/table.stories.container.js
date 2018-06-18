import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SimpleTable from './simpleTable.component';

const styles = theme => ({
  testDiv: {
    backgroundColor: theme.palette.background.paper,
    width: 200,
    padding: 10,
    margin: 'none',
  },
});

const ContainedSimpleTable = props => (
  <div className={props.classes.testDiv}>
    <SimpleTable labels={props.labels} values={props.values} />
  </div>
);

ContainedSimpleTable.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.shape({}).isRequired,
  classes: PropTypes.shape({
    testDiv: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles, { withTheme: true })(ContainedSimpleTable);
