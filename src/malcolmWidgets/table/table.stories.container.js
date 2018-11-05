import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import WidgetTable from './table.component';

const styles = theme => ({
  testDiv: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
    padding: 10,
    margin: 'none',
  },
});

const ContainedTable = props => (
  <div className={props.classes.testDiv}>
    <WidgetTable
      attribute={props.attribute}
      eventHandler={props.eventHandler}
      setFlag={props.setFlag}
    />
  </div>
);

ContainedTable.propTypes = {
  attribute: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    values: PropTypes.shape({}),
  }).isRequired,
  classes: PropTypes.shape({
    testDiv: PropTypes.string,
  }).isRequired,
  eventHandler: PropTypes.func,
  setFlag: PropTypes.func,
};

ContainedTable.defaultProps = {
  eventHandler: () => {},
  setFlag: () => {},
};

export default withStyles(styles, { withTheme: true })(ContainedTable);
