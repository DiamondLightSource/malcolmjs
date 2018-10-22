import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PaletteItem from './paletteItem.component';
import blockUtils from '../../malcolm/blockUtils';
import { snackbarState } from '../../viewState/viewState.actions';

const styles = {
  container: {
    marginTop: 15,
  },
};

const Palette = props => (
  <div className={props.classes.container}>
    {props.blocks
      .filter(b => !b.visible)
      .map(b => (
        <PaletteItem
          key={b.mri}
          name={b.name}
          mri={b.mri}
          clickHandler={props.snackbarInfo}
        />
      ))}
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
  snackbarInfo: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  snackbarInfo: () => {
    dispatch(
      snackbarState(true, 'Drag and drop a chip to add it to the layout')
    );
  },
});

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

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(Palette)
);
