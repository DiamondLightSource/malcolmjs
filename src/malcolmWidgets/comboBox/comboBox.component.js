import * as React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  div: {
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    minHeight: 28,
    maxHeight: 28,
    marginBottom: '2px',
  },
  select: {
    margin: 0,
    maxHeight: 28,
  },
});

const WidgetComboBox = props => {
  const value = props.Value !== null ? props.Value : props.Choices[0];
  const options = props.Choices.map((choice, index) => (
    // Rule prevents behaviour we want in this case
    // eslint-disable-next-line react/no-array-index-key
    <option value={choice} key={index}>
      {choice}
    </option>
  ));
  if (!props.Choices.includes(value)) {
    options.push(
      <option value={value} disabled>
        {value}
      </option>
    );
  }
  return (
    <FormControl
      disabled={props.Pending}
      fullWidth
      className={props.classes.formControl}
    >
      <Select
        native
        value={value}
        onChange={props.selectEventHandler}
        className={props.classes.select}
      >
        {options}
      </Select>
    </FormControl>
  );
};

WidgetComboBox.propTypes = {
  Value: PropTypes.string.isRequired,
  selectEventHandler: PropTypes.func.isRequired,
  Choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  Pending: PropTypes.bool,
  classes: PropTypes.shape({
    formControl: PropTypes.string,
    select: PropTypes.string,
  }).isRequired,
};

WidgetComboBox.defaultProps = {
  Pending: false,
};

export default withStyles(styles, { withTheme: true })(WidgetComboBox);
