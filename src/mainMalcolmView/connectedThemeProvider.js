import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as colors from '@material-ui/core/colors';
import {
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles/index';

export const defaultTheme = {
  primary: 'blue',
  secondary: 'green',
  type: 'dark',
  alarmState: {
    warning: '#e6c01c',
    error: '#e8001f',
    disconnected: '#4e0663',
  },
  // port colours should not use the themes secondary colour, it is used to highlight blocks and links
  portColours: {
    bool: colors.blue,
    int32: colors.orange,
    motor: colors.pink,
    NDArray: colors.brown,
    block: colors.purple,
  },
};

export const themeConstructor = (primary, secondary, type) => {
  const palette =
    secondary !== undefined
      ? { type, primary: colors[primary], secondary: colors[secondary] }
      : { type, primary: colors[primary] };
  return createMuiTheme({
    palette,
    alarmState: defaultTheme.alarmState,
    portColours: defaultTheme.portColours,
  });
};
const ConnectedThemeProvider = props => (
  <MuiThemeProvider theme={props.theme}>{props.children}</MuiThemeProvider>
);

ConnectedThemeProvider.propTypes = {
  theme: PropTypes.shape({}).isRequired,
  children: PropTypes.arrayOf(PropTypes.node),
};

ConnectedThemeProvider.defaultProps = {
  children: [],
};

const mapDispatchToProps = () => ({});

const mapStateToProps = state => ({ theme: state.viewState.theme.muiTheme });

export default connect(mapStateToProps, mapDispatchToProps)(
  ConnectedThemeProvider
);
