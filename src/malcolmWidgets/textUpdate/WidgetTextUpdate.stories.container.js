import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import WidgetTextUpdate from './WidgetTextUpdate.component';

const styles = theme => ({
  div: {
    backgroundColor: theme.palette.background.paper,
    width: 148,
    padding: 10,
  },
});

const ContainedTextUpdate = props => (
  <div className={props.classes.div}>
    <WidgetTextUpdate Text={props.Text} Units={props.Units} />
  </div>
);

ContainedTextUpdate.propTypes = {
  Text: PropTypes.string.isRequired,
  Units: PropTypes.string,
  classes: PropTypes.shape({
    div: PropTypes.string,
  }).isRequired,
};

ContainedTextUpdate.defaultProps = {
  Units: null,
};

export default withStyles(styles, { withTheme: true })(ContainedTextUpdate);
