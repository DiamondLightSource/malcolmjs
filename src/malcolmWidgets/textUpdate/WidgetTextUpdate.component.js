import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
  textUpdate: {
    backgroundColor: emphasize(theme.palette.background.paper, 0.1),
    padding: 4,
    textAlign: 'Right',
    marginLeft: 4,
    marginRight: 4,
  },
});

const WidgetTextUpdate = props => (
  <Typography className={props.classes.textUpdate}>
    {props.Text} {props.Units ? props.Units : null}
  </Typography>
);

WidgetTextUpdate.propTypes = {
  Text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  Units: PropTypes.string,
  classes: PropTypes.shape({
    textUpdate: PropTypes.string,
  }).isRequired,
};

WidgetTextUpdate.defaultProps = {
  Units: null,
};

export default withStyles(styles, { withTheme: true })(WidgetTextUpdate);
