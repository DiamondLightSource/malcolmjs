import React from 'react';
import PropTypes from 'prop-types';
import * as colors from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

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
              onClick={() => props.setThemeProp('primary', colors[color])}
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
              onClick={() => props.setThemeProp('secondary', colors[color])}
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
    <Button onClick={props.finishEdit}>Done!</Button>
  </div>
);

ThemeEditor.propTypes = {
  openParentPanel: PropTypes.bool,
  finishEdit: PropTypes.func.isRequired,
  setThemeProp: PropTypes.func.isRequired,
};

ThemeEditor.defaultProps = {
  openParentPanel: false,
};

export default ThemeEditor;
