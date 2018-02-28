/**
 * Created by twi18192 on 10/12/15.
 */

import * as React from 'react';
import PropTypes from 'prop-types';

import paneActions from '../actions/paneActions';
import flowChartActions from '../actions/flowChartActions';
import EdgeLine from './edgeLine';


export default class Edge extends React.Component {

  edgeSelect = (e) => {
    flowChartActions.selectEdge(this.props.id);
    paneActions.openEdgeTab({
      edgeId: this.props.id,
      fromBlock: this.props.fromBlock,
      fromBlockPort: this.props.fromBlockPort,
      toBlock: this.props.toBlock,
      toBlockPort: this.props.toBlockPort
    });
  };

  render() {
    let {fromBlockPort, fromBlockPortValueType,
      fromBlockPosition, toBlockPosition,
      fromBlockInfo, selected,
      inportArrayIndex, blockStyling} = this.props;

    let outportArrayIndex = 0;
    /* outportArrayIndex is used in the calculation of the y coordinate
     of the block with the outport involved in the connection
     */
    for (let i = 0; i < fromBlockInfo.outports.length; i++) {
      if (this.props.fromBlockInfo.outports[i].name.toUpperCase() === fromBlockPort.toUpperCase()) {
        outportArrayIndex = i;
      }
    }

    let startOfEdgePortOffsetX = blockStyling.outerRectangleWidth;
    let startOfEdgePortOffsetY = blockStyling.verticalMargin + (
      blockStyling.interPortSpacing * (outportArrayIndex + 0.5));
    let startOfEdgeX = fromBlockPosition.x + startOfEdgePortOffsetX;
    let startOfEdgeY = fromBlockPosition.y + startOfEdgePortOffsetY;

    let endOfEdgePortOffsetX = 0;
    let endOfEdgePortOffsetY = blockStyling.verticalMargin + (
      blockStyling.interPortSpacing * (inportArrayIndex + 0.5));
    let endOfEdgeX = toBlockPosition.x + endOfEdgePortOffsetX;
    let endOfEdgeY = toBlockPosition.y + endOfEdgePortOffsetY;

    return (
      <g onClick={this.edgeSelect}>
        <EdgeLine
          sourceX={startOfEdgeX}
          sourceY={startOfEdgeY}
          targetX={endOfEdgeX}
          targetY={endOfEdgeY}
          portType={fromBlockPortValueType}
          blockStyling={blockStyling}
          selected={selected}
          />
      </g>
    )
  }
}

Edge.propTypes = {
  id: PropTypes.string,
  fromBlock: PropTypes.string,
  fromBlockPort: PropTypes.string,
  fromBlockPortValueType: PropTypes.string,
  fromBlockPosition: PropTypes.object,
  toBlock: PropTypes.string,
  toBlockPort: PropTypes.string,
  toBlockPosition: PropTypes.object,
  fromBlockInfo: PropTypes.object,
  selected: PropTypes.bool,
  inportArrayIndex: PropTypes.number,
  blockStyling: PropTypes.object,
};
