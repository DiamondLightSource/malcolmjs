import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
  textInput: {
    backgroundColor: emphasize(theme.palette.background.paper, 0.07),
    width: '100%',
  },
  inputStyle: {
    padding: 5,
    fontSize: '11pt',
    textAlign: 'Right',
  },
  InputStyle: {
    paddingRight: 4,
  },
});

class WidgetTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      localValue: props.Value,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      localValue: event.target.value,
    });
  }

  render() {
    const didSubmit = event => {
      if (event.key === 'Enter') {
        this.props.submitEventHandler(event);
      }
    };

    return (
      <TextField
        error={this.props.Error}
        disabled={this.props.Pending}
        value={this.state.localValue}
        onChange={this.handleChange}
        onKeyPress={didSubmit}
        onBlur={this.props.blurHandler}
        onFocus={this.props.focusHandler}
        className={this.props.classes.textInput}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">{this.props.Units}</InputAdornment>
          ),
          className: this.props.classes.InputStyle,
        }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        inputProps={{ className: this.props.classes.inputStyle }}
      />
    );
  }
}

WidgetTextInput.propTypes = {
  Value: PropTypes.string.isRequired,
  submitEventHandler: PropTypes.func.isRequired,
  blurHandler: PropTypes.func.isRequired,
  focusHandler: PropTypes.func.isRequired,
  Pending: PropTypes.bool,
  Error: PropTypes.bool,
  Units: PropTypes.string,
  classes: PropTypes.shape({
    textInput: PropTypes.string,
    InputStyle: PropTypes.string,
    inputStyle: PropTypes.string,
  }).isRequired,
};

WidgetTextInput.defaultProps = {
  Pending: false,
  Error: false,
  Units: null,
};

export default withStyles(styles, { withTheme: true })(WidgetTextInput);
