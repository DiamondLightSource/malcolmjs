import React from 'react';
import PropTypes from 'prop-types';
import * as colors from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { withTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import queryString from 'query-string';
import {
  editThemeAction,
  setThemeAction,
  updateThemeAction,
} from '../viewState/viewState.actions';

const ThemeEditor = props => (
  <div style={{ padding: '16px' }}>
    <Typography>Primary color:</Typography>
    <div
      style={{
        display: 'flex',
        left: props.openParentPanel ? 360 : 0,
        padding: '16px',
      }}
    >
      {Object.keys(colors)
        .filter(
          color =>
            colors[color].main !== undefined || colors[color].A400 !== undefined
        )
        .map(color => (
          <Tooltip title={color}>
            <IconButton
              style={{
                margin: '2px',
                width: 32,
                height: 32,
                backgroundColor: colors[color][400],
              }}
              onClick={() => props.setThemeProp('primary', color)}
            />
          </Tooltip>
        ))}
    </div>
    <Typography>Secondary color:</Typography>
    <div
      style={{
        display: 'flex',
        left: props.openParentPanel ? 360 : 0,
        padding: '16px',
      }}
    >
      {Object.keys(colors)
        .filter(
          color =>
            colors[color].main !== undefined || colors[color].A400 !== undefined
        )
        .map(color => (
          <Tooltip title={color}>
            <IconButton
              style={{
                margin: '2px',
                width: 32,
                height: 32,
                backgroundColor: colors[color][400],
              }}
              onClick={() => props.setThemeProp('secondary', color)}
            />
          </Tooltip>
        ))}
    </div>
    <div>
      <Button
        style={{ margin: '8px' }}
        onClick={() => props.setThemeProp('type', 'light')}
        variant="raised"
        color="primary"
      >
        Light
      </Button>
      <Button
        style={{ margin: '8px' }}
        onClick={() => props.setThemeProp('type', 'dark')}
        variant="raised"
        color="primary"
      >
        Dark
      </Button>
    </div>
    <Button onClick={() => props.finishEdit(props.currentTheme)}>Done!</Button>
  </div>
);

ThemeEditor.propTypes = {
  openParentPanel: PropTypes.bool,
  finishEdit: PropTypes.func.isRequired,
  setThemeProp: PropTypes.func.isRequired,
  currentTheme: PropTypes.shape({}).isRequired,
};

ThemeEditor.defaultProps = {
  openParentPanel: false,
};

const mapStateToProps = state => ({
  currentTheme: state.viewState.theme,
});

const mapDispatchToProps = dispatch => ({
  setThemeProp: (property, value) => {
    dispatch(setThemeAction(property, value));
    dispatch(updateThemeAction());
  },
  finishEdit: palette => {
    const tempTheme = {};
    tempTheme.primary = palette.primary || 'blue';
    tempTheme.type = palette.type || 'dark';
    if (palette.secondary) {
      tempTheme.secondary = palette.secondary;
    }
    dispatch(editThemeAction());
    dispatch(push({ search: queryString.stringify(tempTheme) }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withTheme()(ThemeEditor)
);
