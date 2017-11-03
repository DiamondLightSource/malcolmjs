/**
 * Created by twi18192 on 18/01/16.
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import {withStyles} from 'material-ui';

const styles = theme => ({
  blockSelected: {
    fill: theme.palette.background.selected,
    filter: "url(#dropshadow8)",
  },
  blockUnselected: {
    fill: theme.palette.background.paper,
    filter: "url(#dropshadow2)",
  }
});

class BlockRectangle extends PureComponent {
  render() {
    let {classes, blockStyling, nports, selected, blockIconSVG} = this.props;
    let outerRectHeight = 2 * blockStyling.verticalMargin + nports * blockStyling.interPortSpacing;
    let blockClass = selected ? classes.blockSelected : classes.blockUnselected;

    return (
      <g>
        <rect height={outerRectHeight}
              width={blockStyling.outerRectangleWidth}
              rx={2} ry={2}
              className={blockClass}
        />
        <svg height={outerRectHeight}
             width={blockStyling.outerRectangleWidth}
             opacity={0.35}>
          {renderHTML(blockIconSVG)}
        </svg>;
      </g>
    )
  }
}

BlockRectangle.propTypes = {
  classes: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  blockStyling: PropTypes.object.isRequired,
  blockIconSVG: PropTypes.string.isRequired,
  nports: PropTypes.number.isRequired
};

export default withStyles(styles)(BlockRectangle);