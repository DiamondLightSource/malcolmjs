import React from 'react';
import PropTypes from 'prop-types';
import * as colors from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

const ThemeEditor = props => (
  <div>
    <div
      style={{
        display: 'flex',
        left: props.openParentPanel ? 360 : 0,
        padding: '16px',
      }}
    >
      {Object.keys(colors).map(color => (
        <IconButton
          style={{
            padding: 4,
            width: 32,
            height: 32,
            backgroundColor: colors[color][400],
          }}
          onClick={() => props.setThemeColor(colors[color])}
        />
      ))}
    </div>
    <Button onClick={props.finishEdit}>Done!</Button>
  </div>
);

ThemeEditor.propTypes = {
  openParentPanel: PropTypes.bool,
  // setThemeColor: PropTypes.func.isRequired,
  finishEdit: PropTypes.func.isRequired,
};

ThemeEditor.defaultProps = {
  openParentPanel: false,
};

export default ThemeEditor;
