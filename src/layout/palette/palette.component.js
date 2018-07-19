import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PaletteItem from './paletteItem.component';
import blockUtils from '../../malcolm/blockUtils';

const styles = {
  container: {
    marginTop: 15,
  },
};

const Palette = props => (
  <div className={props.classes.container}>
    {props.blocks
      .filter(b => !b.visible)
      .map(b => <PaletteItem key={b.mri} name={b.name} mri={b.mri} />)}
  </div>
);

Palette.propTypes = {
  blocks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      mri: PropTypes.string,
      visible: PropTypes.bool,
    })
  ).isRequired,
  classes: PropTypes.shape({
    container: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => {
  const attribute = blockUtils.findAttribute(
    state.malcolm.blocks,
    state.malcolm.parentBlock,
    state.malcolm.mainAttribute
  );

  let blocks = [];
  if (attribute && attribute.calculated.layout) {
    ({ blocks } = attribute.calculated.layout);
  }
  return {
    blocks,
  };
};

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(Palette)
);
