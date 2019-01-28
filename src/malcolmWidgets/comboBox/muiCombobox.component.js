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
    selectMenu: {
      borderRadius: 0,
    },
  },
  option: {
    padding: 8,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  menu: {
    backgroundColor: '#fff',
    padding: 0,
  },
});

const WidgetComboBox = props => {
  const value = props.Value !== null ? props.Value : props.Choices[0];
  const options = props.Choices.map((choice, index) => (
    <option
      value={choice}
      // Rule prevents behaviour we want in this case
      // eslint-disable-next-line react/no-array-index-key
      key={index}
      className={props.classes.option}
    >
      {choice}
    </option>
  ));
  return (
    <FormControl
      disabled={props.Pending}
      fullWidth
      className={props.classes.formControl}
    >
      <Select
        multiple={props.Multi}
        value={value}
        className={props.classes.select}
        onChange={props.selectEventHandler}
        MenuProps={{
          MenuListProps: { className: props.classes.menu },
          PaperProps: { style: { borderRadius: 0, margin: 0, boxShadow: '' } },
        }}
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
    menu: PropTypes.string,
    option: PropTypes.string,
  }).isRequired,
  Multi: PropTypes.bool,
};

WidgetComboBox.defaultProps = {
  Pending: false,
  Multi: false,
};

export default withStyles(styles, { withTheme: true })(WidgetComboBox);
