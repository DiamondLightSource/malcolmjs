import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Cached, Lock, LockOpen } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
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
      return { localValue: props.Value };
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
    this.revertValue = this.revertValue.bind(this);
    this.didSubmit = this.didSubmit.bind(this);
  }

  handleChange(event) {
    if (!this.props.isDirty) {
      this.props.setDirty(true);
    }
    this.setState({
      localValue: event.target.value,
    });
  }

  revertValue() {
    this.props.setDirty(false);
    this.setState({
      localValue: this.props.Value,
    });
    this.props.submitEventHandler({ target: { value: this.props.Value } });
  }

  didSubmit(event) {
    if (event.key === 'Enter') {
      if (event.target.value === 'qqq') {
        this.revertValue();
      } else {
        this.props.submitEventHandler(event);
      }
    }
  }

  inFocus() {
    this.props.setDirty(true);
    this.props.focusHandler();
  }

  deFocus() {
    if (this.state.localValue === this.props.Value) {
      this.props.setDirty(false);
    }
    this.props.blurHandler();
  }

  render() {
    const iconColor = this.props.Error
      ? this.props.theme.palette.error.main
      : this.props.theme.palette.primary.light;

    const dirtyIcon = () => {
      if (this.props.isDirty) {
        return (
          <InputAdornment position="start">
            <IconButton
              className={this.props.classes.button}
              disableRipple
              onClick={this.revertValue}
            >
              {this.props.Value === this.state.localValue ? (
                <Lock nativeColor={iconColor} />
              ) : (
                <Cached nativeColor={iconColor} />
              )}
            </IconButton>
          </InputAdornment>
        );
      }
      return (
        <InputAdornment position="start">
          <LockOpen nativeColor={this.props.theme.palette.background.paper} />
        </InputAdornment>
      );
    };

    return (
      <TextField
        error={this.props.Error}
        disabled={this.props.Pending}
        value={this.state.localValue}
        onChange={this.handleChange}
        onKeyPress={this.didSubmit}
        onBlur={this.deFocus}
        onFocus={this.inFocus}
        className={this.props.classes.textInput}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">{this.props.Units}</InputAdornment>
          ),
          startAdornment: dirtyIcon(),
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
  setDirty: PropTypes.func.isRequired,
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
  theme: PropTypes.shape({
    palette: PropTypes.shape({
      background: PropTypes.shape({
        paper: PropTypes.string,
      }),
      primary: PropTypes.shape({
        light: PropTypes.string,
      }),
      error: PropTypes.shape({
        main: PropTypes.string,
      }),
    }),
  }).isRequired,
};

WidgetTextInput.defaultProps = {
  Pending: false,
  Error: false,
  isDirty: false,
  Units: '',
};

export default withStyles(styles, { withTheme: true })(WidgetTextInput);
