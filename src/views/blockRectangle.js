/**
 * Created by twi18192 on 18/01/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import {withStyles} from 'material-ui';

const styles = theme => ({
  blockSelected: {
    fill: theme.palette.background.selected,
    filter: theme.dropShadows[8],
  },
  blockUnselected: {
    fill: theme.palette.background.paper,
    filter: theme.dropShadows[2],
  }
});

class BlockRectangle extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.selected !== this.props.selected)
  }

  render() {
    let {classes, blockStyling, nports, selected} = this.props;
    let outerRectHeight = 2 * blockStyling.verticalMargin + nports * blockStyling.interPortSpacing;
    let blockClass = selected ? classes.blockSelected : classes.blockUnselected;

    return (
      <g className={blockClass}>
        <rect height={outerRectHeight}
              width={blockStyling.outerRectangleWidth}
              rx={2} ry={2}
        />
        <svg height={outerRectHeight}
             width={blockStyling.outerRectangleWidth}
             opacity={0.25}>
          {renderHTML(this.props.blockIconSVG)}
        </svg>;
      </g>
    )
  }
}

BlockRectangle.propTypes = {
  classes: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  blockStyling: PropTypes.object,
  blockIconSVG: PropTypes.string,
  blockId: PropTypes.string,
  portThatHasBeenClicked: PropTypes.object,
  nports: PropTypes.number
};

export default withStyles(styles)(BlockRectangle);