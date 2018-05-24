import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { CheckCircle } from '@material-ui/icons';

const styles = () => ({
  loadingRow: {
    display: 'flex',
    margin: 5,
    justifyContent: 'flex-start',
  },
  fieldName: {
    textAlign: 'left',
    flexGrow: 1,
    alignSelf: 'center',
  },
  progress: {
    padding: 2,
    marginRight: 5,
    alignSelf: 'center',
  },
  success: {
    height: 20,
    marginRight: 5,
    alignSelf: 'center',
    color: 'green',
  },
});

const FieldsLoading = props => (
  <div>
    <Typography>Loading attributes...</Typography>
    {props.attributes.map(a => (
      <div key={a.name} className={props.classes.loadingRow}>
        {a.loading ? (
          <CircularProgress
            className={props.classes.progress}
            color="secondary"
            size={20}
          />
        ) : (
          <CheckCircle className={props.classes.success} />
        )}
        <Typography className={props.classes.fieldName}>{a.name}</Typography>
      </div>
    ))}
  </div>
);

FieldsLoading.propTypes = {
  attributes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      loading: PropTypes.bool,
    })
  ),
  classes: PropTypes.shape({
    loadingRow: PropTypes.string,
    fieldName: PropTypes.string,
    progress: PropTypes.string,
    success: PropTypes.string,
  }).isRequired,
};

FieldsLoading.defaultProps = {
  attributes: [],
};

export default withStyles(styles, { withTheme: true })(FieldsLoading);
