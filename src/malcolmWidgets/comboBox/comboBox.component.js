import * as React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  div: {
    backgroundColor: theme.palette.background.paper,
  },
  formControl: {
    minHeight: 28,
    maxHeight: 28,
  },
  choice: {
    minHeight: 28,
    maxHeight: 28,
    padding: 0,
    paddingLeft: '4px',
    paddingRight: '4px',
  },
  select: {
    margin: 0,
    maxHeight: 28,
    textAlign: 'left',
  },
});

const WidgetComboBox = props => {
  const value = props.Value !== null ? props.Value : props.Choices[0];
  const options = props.Choices.map(
    (choice, index) =>
      props.mobile ? (
        <option
          value={choice}
          // Rule prevents behaviour we want in this case
          // eslint-disable-next-line react/no-array-index-key
          key={index}
        >
          {choice}
        </option>
      ) : (
        <MenuItem
          selected={choice === value}
          value={choice}
          // Rule prevents behaviour we want in this case
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          onClick={() => props.selectEventHandler(choice)}
          data-cy={`choice-${index}`}
          className={props.classes.choice}
        >
          <Typography>{choice}</Typography>
        </MenuItem>
      )
  );
  if (!props.Choices.includes(value)) {
    options.push(
      <option value={value} disabled>
        {value}
      </option>
    );
  }
  const changeHandler = props.mobile
    ? () => {}
    : event => props.selectEventHandler(event.target.value);
  return (
    <FormControl
      disabled={props.Pending}
      fullWidth
      className={props.classes.formControl}
    >
      {props.forceOpen ? (
        <Select
          native={props.mobile}
          value={value}
          className={props.classes.select}
          onChange={changeHandler}
          open
          onClose={() => {}}
        >
          {options}
        </Select>
      ) : (
        <Select
          native={props.mobile}
          data-cy="combobox"
          value={value}
          className={props.classes.select}
          onChange={changeHandler}
        >
          {options}
        </Select>
      )}
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
    choice: PropTypes.string,
  }).isRequired,
  mobile: PropTypes.bool,
  forceOpen: PropTypes.bool,
};

WidgetComboBox.defaultProps = {
  Pending: false,
  mobile: false,
  forceOpen: false,
};

export default withStyles(styles, { withTheme: true })(WidgetComboBox);
