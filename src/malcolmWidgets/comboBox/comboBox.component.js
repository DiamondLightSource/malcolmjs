import * as React from 'react';
import PropTypes from 'prop-types';
import Select from 'material-ui/Select';
import FormControl from 'material-ui/Form/FormControl';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  div: {
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    margin: 0,
  },
});

const WidgetComboBox = props => {
  let options = [];
  props.Choices.forEach((choice, index) => {
    options = [
      ...options,
      // Rule prevents behaviour we want in this case
      // eslint-disable-next-line react/no-array-index-key
      <option value={choice} key={index}>
        {choice}
      </option>,
    ];
  });
  return (
    <FormControl disabled={props.Pending} fullWidth>
      <Select
        native
        value={props.Value}
        onChange={props.selectEventHandler}
        className={props.classes.formControl}
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
  }).isRequired,
};

WidgetComboBox.defaultProps = {
  Pending: false,
};

export default withStyles(styles, { withTheme: true })(WidgetComboBox);
