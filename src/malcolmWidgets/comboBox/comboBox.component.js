import * as React from 'react';
import PropTypes from 'prop-types';
import Select from 'material-ui/Select';
import FormControl from 'material-ui/Form/FormControl';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  div: {
    backgroundColor: theme.palette.background.paper,
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
    <div className={props.classes.div}>
      <FormControl disabled={props.Pending}>
        <Select native value={props.Value} onChange={props.selectEventHandler}>
          {options}
        </Select>
      </FormControl>
    </div>
  );
};

WidgetComboBox.propTypes = {
  Value: PropTypes.string.isRequired,
  selectEventHandler: PropTypes.func.isRequired,
  Choices: PropTypes.arrayOf(PropTypes.string).isRequired,
  Pending: PropTypes.bool,
  classes: PropTypes.shape({
    div: PropTypes.string,
  }).isRequired,
};

WidgetComboBox.defaultProps = {
  Pending: false,
};

export default withStyles(styles, { withTheme: true })(WidgetComboBox);
