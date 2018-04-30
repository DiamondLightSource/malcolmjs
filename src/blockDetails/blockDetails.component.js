import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  progressContainer: {
    marginTop: 15,
    color: theme.palette.primary.contrastText,
  },
});

const blockLoading = (block, classes) => {
  if (block && block.loading) {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress color="secondary" />
        <Typography color="inherit">Loading...</Typography>
      </div>
    );
  }

  return null;
};

const BlockDetails = props => (
  <div>{blockLoading(props.block, props.classes)}</div>
);

BlockDetails.propTypes = {
  block: PropTypes.shape({
    loading: PropTypes.bool,
  }),
  classes: PropTypes.shape({
    progressContainer: PropTypes.string,
  }).isRequired,
};

BlockDetails.defaultProps = {
  block: undefined,
};

export default withStyles(styles, { withTheme: true })(BlockDetails);
