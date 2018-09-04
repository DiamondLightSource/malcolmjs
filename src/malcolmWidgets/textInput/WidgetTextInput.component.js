import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  textInput: {
    width: '100%',
    maxHeight: 28,
  },
  inputStyle: {
    fontSize: '11pt',
    textAlign: 'Right',
  },
  InputStyle: {
    paddingRight: 4,
    paddingLeft: 4,
  },
  button: {
    width: '22px',
    height: '22px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
});

class WidgetTextInput extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (!props.isDirty) {
      return {
        localValue: props.Value,
      };
    } else if (props.forceUpdate) {
      if (props.Error) {
        props.submitEventHandler({ target: { value: props.Value } });
      }
      props.setFlag('forceUpdate', false);
      return {
        localValue: props.Value,
      };
    }
    return state;
  }

  constructor(props) {
    super(props);
    this.state = {
      localValue: props.Value,
    };
    this.handleChange = this.handleChange.bind(this);
    this.deFocus = this.deFocus.bind(this);
    this.inFocus = this.inFocus.bind(this);
    this.handleSpecialKeys = this.handleSpecialKeys.bind(this);
  }

  handleSpecialKeys(event) {
    switch (event.key) {
      case 'Tab':
      case 'Enter':
        this.props.submitEventHandler(event);
        break;
      case 'Escape':
        this.setState({
          localValue: this.props.Value,
        });
        break;
      default:
        break;
    }
  }

  handleChange(event) {
    if (!this.props.isDirty) {
      this.props.setFlag('dirty', true);
    }
    this.setState({
      localValue: event.target.value,
    });
    if (this.props.continuousSend) {
      this.props.submitEventHandler(event);
    }
  }

  inFocus() {
    this.props.setFlag('dirty', true);
    this.props.focusHandler();
  }

  deFocus() {
    if (this.state.localValue === this.props.Value) {
      this.props.setFlag('dirty', false);
    }
    this.props.blurHandler();
  }

  render() {
    const endAdornment = this.props.Units ? (
      <InputAdornment position="end">{this.props.Units}</InputAdornment>
    ) : null;

    return (
      <TextField
        error={this.props.Error}
        disabled={this.props.Pending}
        value={this.state.localValue}
        onChange={this.handleChange}
        onKeyDown={this.handleSpecialKeys}
        onBlur={this.deFocus}
        onFocus={this.inFocus}
        className={this.props.classes.textInput}
        InputProps={{
          endAdornment,
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
  setFlag: PropTypes.func.isRequired,
  blurHandler: PropTypes.func.isRequired,
  focusHandler: PropTypes.func.isRequired,
  Pending: PropTypes.bool,
  Error: PropTypes.bool,
  isDirty: PropTypes.bool,
  Units: PropTypes.string,
  classes: PropTypes.shape({
    textInput: PropTypes.string,
    InputStyle: PropTypes.string,
    inputStyle: PropTypes.string,
    button: PropTypes.string,
  }).isRequired,
  continuousSend: PropTypes.bool,
};

WidgetTextInput.defaultProps = {
  Pending: false,
  isDirty: false,
  Units: '',
  Error: false,
  continuousSend: false,
};

export default withStyles(styles)(WidgetTextInput);
