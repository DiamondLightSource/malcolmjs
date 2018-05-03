import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  div: {
    backgroundColor: theme.palette.background.paper,
    padding: 5,
    display: 'flex',
  },
  textName: {
    alignSelf: 'Center',
    textAlign: 'Left',
    marginLeft: 4,
    marginRight: 4,
  },
});

const SimpleAttr = props => (
  <div className={props.classes.div}>
    <Typography className={props.classes.textName}>{props.name}</Typography>
    {props.children}
  </div>
);

SimpleAttr.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({
    div: PropTypes.string,
    textName: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles, { withTheme: true })(SimpleAttr);
