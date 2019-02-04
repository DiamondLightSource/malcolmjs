import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  blue,
  pink,
  brown,
  orange,
  purple,
} from '@material-ui/core/colors/index';
import {
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles/index';

export const theme = (primary, secondary, type) => {
  const palette =
    secondary !== undefined ? { type, primary, secondary } : { type, primary };
  return createMuiTheme({
    palette,
    alarmState: {
      warning: '#e6c01c',
      error: '#e8001f',
      disconnected: '#9d07bb',
    },
    // port colours should not use the themes secondary colour, it is used to highlight blocks and links
    portColours: {
      bool: blue,
      int32: orange,
      motor: pink,
      NDArray: brown,
      port: purple,
    },
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
