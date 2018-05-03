import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
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
    {props.fields.map(f => (
      <div key={f.name} className={props.classes.loadingRow}>
        {f.loading ? (
          <CircularProgress
            className={props.classes.progress}
            color="secondary"
            size={20}
          />
        ) : (
          <CheckCircle className={props.classes.success} />
        )}
        <Typography className={props.classes.fieldName}>{f.name}</Typography>
      </div>
    ))}
  </div>
);

FieldsLoading.propTypes = {
  fields: PropTypes.arrayOf(
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
  fields: [],
};

export default withStyles(styles, { withTheme: true })(FieldsLoading);
