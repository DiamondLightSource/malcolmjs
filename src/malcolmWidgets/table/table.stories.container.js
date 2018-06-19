import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SimpleTable from './simpleTable.component';
import WidgetTable from './table.component';

const styles = theme => ({
  testDiv: {
    backgroundColor: theme.palette.background.paper,
    width: 700,
    padding: 10,
    margin: 'none',
  },
});

const ContainedTable = props =>
  props.simple ? (
    <div className={props.classes.testDiv}>
      <SimpleTable
        labels={props.attribute.labels}
        values={props.attribute.values}
      />
    </div>
  ) : (
    <div className={props.classes.testDiv}>
      <WidgetTable
        attribute={props.attribute}
        eventHandler={props.eventHandler}
      />
    </div>
  );

ContainedTable.propTypes = {
  simple: PropTypes.bool.isRequired,
  attribute: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    values: PropTypes.shape({}),
  }).isRequired,
  classes: PropTypes.shape({
    testDiv: PropTypes.string,
  }).isRequired,
  eventHandler: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(ContainedTable);
