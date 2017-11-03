import React, {PureComponent} from 'react';
import {withStyles} from 'material-ui';
import PropTypes from 'prop-types';


const styles = theme => ({
  fullHeight: {
    position: "absolute",
    height: "100vh",
  },
  edgeSelected: {
    filter: "url(#dropshadow1)",
    strokeWidth: 6,
    fill: "none",
  },
  edgeUnselected: {
    strokeWidth: 5,
    fill: "none",
  },
});


class EdgeLine extends PureComponent {

  render() {
    let {classes, theme, sourceX, sourceY, targetX, targetY, portType, blockStyling, selected} = this.props;

    let c1X;
    let c1Y;
    let c2X;
    let c2Y;

    if (targetX - blockStyling.interPortSpacing < sourceX) {
      let curveFactor = (sourceX - targetX) * blockStyling.interPortSpacing / 60;
      if (Math.abs(targetY - sourceY) < blockStyling.interPortSpacing * 4) {
        // Loopback
        c1X = sourceX + curveFactor;
        c1Y = sourceY - curveFactor;
        c2X = targetX - curveFactor;
        c2Y = targetY - curveFactor;
      }
      else {
        // Stick out some
        c1X = sourceX + curveFactor;
        c1Y = sourceY + (targetY > sourceY ? curveFactor : -curveFactor);
        c2X = targetX - curveFactor;
        c2Y = targetY + (targetY > sourceY ? -curveFactor : curveFactor);
      }
    }
    else {
      // Controls halfway between
      c1X = sourceX + (targetX - sourceX) / 2;
      c1Y = sourceY;
      c2X = c1X;
      c2Y = targetY;
    }

    let path = [
      "M",
      sourceX, sourceY,
      "C",
      c1X, c1Y,
      c2X, c2Y,
      targetX, targetY
    ].join(" ");

    return (
      <path className={selected ? classes.edgeSelected : classes.edgeUnselected}
            stroke={selected ? theme.palette.ports[portType][300] : theme.palette.ports[portType][500]}
            d={path}/>
    )
  }
}

EdgeLine.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired,
  portType: PropTypes.string.isRequired,
  blockStyling: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired
};

export default withStyles(styles, {withTheme: true})(EdgeLine);
