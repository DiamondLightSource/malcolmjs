import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const styles = {
  draggableItem: {},
  chip: {
    cursor: 'grab',
    margin: '3px 6px 3px 6px',
  },
};

const PaletteItem = props => (
  <Chip
    label={props.name}
    draggable
    onDragStart={event => {
      event.dataTransfer.setData('storm-diagram-node', props.mri);
    }}
    onClick={props.clickHandler}
    className={props.classes.chip}
  />
);

PaletteItem.propTypes = {
  name: PropTypes.string.isRequired,
  mri: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    chip: PropTypes.string,
  }).isRequired,
  clickHandler: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(PaletteItem);
