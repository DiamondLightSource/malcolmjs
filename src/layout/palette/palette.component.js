import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  container: {
    marginTop: 15,
  },
};

const Palette = props => (
  <div className={props.classes.container}>Palette goes here</div>
);

Palette.propTypes = {
  classes: PropTypes.shape({
    container: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles, { withTheme: true })(Palette);
