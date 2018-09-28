import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { blue, green, orange, purple } from '@material-ui/core/colors/index';
import {
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles/index';

export const theme = (primary, type) =>
  createMuiTheme({
    palette: {
      type,
      primary,
    },
    alarmState: {
      warning: '#e6c01c',
      error: '#e8001f',
      disconnected: '#9d07bb',
    },
    // port colours should not use the themes secondary colour, it is used to highlight blocks and links
    portColours: {
      bool: blue,
      int32: orange,
      motor: green,
      NDArray: purple,
    },
  });

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

const mapStateToProps = state => ({ theme: state.viewState.theme });

export default connect(mapStateToProps, mapDispatchToProps)(
  ConnectedThemeProvider
);
