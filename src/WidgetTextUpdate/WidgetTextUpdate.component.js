import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { emphasize } from 'material-ui/styles/colorManipulator';

const styles = theme => ({
  div: {
    backgroundColor: theme.palette.background.paper,
    padding: 15,
    display: 'flex',
  },
  card: {
    minWidth: 50,
    backgroundColor: emphasize(theme.palette.background.paper, 0.2),
    padding: 2,
  },
  textUpdate: {
    textAlign: 'Center',
    marginLeft: 4,
    marginRight: 4,
  },
  textUnits: {
    alignSelf: 'Center',
    marginLeft: 4,
    marginRight: 4,
  },
});

const WidgetTextUpdate = props => (
  <div className={props.classes.div}>
    <Paper className={props.classes.card}>
      <Typography className={props.classes.textUpdate}>{props.Text}</Typography>
    </Paper>
    <Typography className={props.classes.textUnits}>
      {props.Units ? props.Units : null}
    </Typography>
  </div>
);

WidgetTextUpdate.propTypes = {
  Text: PropTypes.string.isRequired,
  Units: PropTypes.string,
  classes: PropTypes.shape({
    div: PropTypes.string,
    card: PropTypes.string,
    textUpdate: PropTypes.string,
    textUnits: PropTypes.string,
  }).isRequired,
};

WidgetTextUpdate.defaultProps = {
  Units: null,
};

export default withStyles(styles, { withTheme: true })(WidgetTextUpdate);
