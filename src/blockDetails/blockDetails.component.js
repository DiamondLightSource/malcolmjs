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

const blockLoading = block => {
  if (block && block.loading) {
    return (
      <div>
        <CircularProgress color="secondary" />
        <Typography>Loading...</Typography>
      </div>
    );
  }

  return null;
};

const displayBlock = block => {
  if (block && !block.loading) {
    return (
      <div>{block.fields.map(f => <Typography key={f}>{f}</Typography>)}</div>
    );
  }

  return null;
};

const BlockDetails = props => (
  <div className={props.classes.progressContainer}>
    {blockLoading(props.block)}
    {displayBlock(props.block)}
  </div>
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
