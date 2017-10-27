/**
 * Created by twi18192 on 04/02/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import flowChartActions from '../actions/flowChartActions';
import interact from 'interactjs';
import EdgeLine from './edgeLine';

const dragAreaContainer = '#appAndDragAreaContainer';

export default class EdgePreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {noPanning: true, mousePosition: {x: 0, y: 0}};
    this.onTap = this.onTap.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.interactJSMouseMoveForEdgePreview = this.interactJSMouseMoveForEdgePreview.bind(this);

    // Added 21 Aug 17 as diagnistic tool
    this._onMouseMove = this._onMouseMove.bind(this);
  }

  componentDidMount() {
    interact(dragAreaContainer)
      .on('move', this.interactJSMouseMoveForEdgePreview);

    interact(this.g)
      .draggable({

        // Drag start
        onstart: (e) => {
          e.stopImmediatePropagation();
          e.stopPropagation();
          interact(dragAreaContainer)
            .off('move', this.interactJSMouseMoveForEdgePreview);
        },

        // Drag move
        onmove: (e) => {
          e.stopImmediatePropagation();
          e.stopPropagation();
          this.props.interactJsDragPan(e);
        },

        // Drag end
        onend: (e) => {
          e.stopImmediatePropagation();
          e.stopPropagation();

          this.setState({noPanning: true}, function () {
            interact(dragAreaContainer)
              .on('move', this.interactJSMouseMoveForEdgePreview);
          });

          /* No need for this after changing mousemove to move for some reason? */
          flowChartActions.updateEdgePreviewEndpoint({
            x: e.dx,
            y: e.dy
          })
        }

      });

    interact(this.g)
      .on('tap', this.onTap);

    interact(this.g)
      .on('down', this.onMouseDown);
  }

  componentWillUnmount() {
    interact(this.g)
      .off('tap', this.onTap);

    interact(this.g)
      .off('down', this.onMouseDown);

    interact(dragAreaContainer)
      .off('move', this.interactJSMouseMoveForEdgePreview);

  }

  shouldComponentUpdate(nextProps, nextState) {
    //return(true);
    return (this.state.noPanning);
  }

  interactJSMouseMoveForEdgePreview(e) {
    e.stopImmediatePropagation();
    e.stopPropagation();

    /**
     * Cater for all mousemove event types, whether:
     * Mozilla, WebKit or vanilla
     * @type {any}
     */
    let movementX = e.movementX ||
      e.mozMovementX ||
      e.webkitMovementX ||
      0;

    let movementY = e.movementY ||
      e.mozMovementY ||
      e.webkitMovementY ||
      0;

    let mousePositionChange = {
      x: movementX,
      y: movementY
    };

    flowChartActions.updateEdgePreviewEndpoint(mousePositionChange);

  }

  onTap(e) {
    e.stopImmediatePropagation();
    e.stopPropagation();

    interact(dragAreaContainer)
      .off('move', this.interactJSMouseMoveForEdgePreview);
    this.props.failedPortConnection();
  }

  onMouseDown(e) {
    e.stopImmediatePropagation();
    e.stopPropagation();

    this.setState({noPanning: false}, function () {
      interact(dragAreaContainer)
        .off('move', this.interactJSMouseMoveForEdgePreview);
    });
  }

  _onMouseMove(e) {
    let curState = Object.assign({}, this.state);
    curState.mousePosition.x = e.screenX;
    curState.mousePosition.y = e.screenY;
    console.log(`Edgepreview._onMouseMove: x = ${e.screenX}  y=${e.screenY}`);
    this.setState(curState);
  }

  render() {
    let {blockStyling, edgePreview, fromBlockPosition, fromBlockInfo} = this.props;

    let startOfEdgeX;
    let startOfEdgeY;
    let endOfEdgeX;
    let endOfEdgeY;
    let portType;

    if (edgePreview.fromBlockInfo.fromBlockPortType === "inport") {
      for (let j = 0; j < fromBlockInfo.inports.length; j++) {
        if (fromBlockInfo.inports[j].name === edgePreview.fromBlockInfo.fromBlockPort) {
          portType = fromBlockInfo.inports[j].type;
          endOfEdgeX = fromBlockPosition.x;
          endOfEdgeY = fromBlockPosition.y + blockStyling.verticalMargin + (
            blockStyling.interPortSpacing * (j + 0.5));
        }
      }
      startOfEdgeX = edgePreview.endpointCoords.x;
      startOfEdgeY = edgePreview.endpointCoords.y;
    }
    else if (edgePreview.fromBlockInfo.fromBlockPortType === "outport") {
      for (let j = 0; j < fromBlockInfo.outports.length; j++) {
        if (fromBlockInfo.outports[j].name === edgePreview.fromBlockInfo.fromBlockPort) {
          portType = fromBlockInfo.outports[j].type;
          startOfEdgeX = fromBlockPosition.x + blockStyling.outerRectangleWidth;
          startOfEdgeY = fromBlockPosition.y + blockStyling.verticalMargin + (
            blockStyling.interPortSpacing * (j + 0.5));
        }
      }
      endOfEdgeX = edgePreview.endpointCoords.x;
      endOfEdgeY = edgePreview.endpointCoords.y;
    }

    return (
      <g ref={(node) => {this.g = node}}>
        <EdgeLine
          sourceX={startOfEdgeX}
          sourceY={startOfEdgeY}
          targetX={endOfEdgeX}
          targetY={endOfEdgeY}
          portType={portType}
          blockStyling={blockStyling}
          selected={true}
        />
      </g>
    )
  }
}

EdgePreview.propTypes = {
  noPanning: PropTypes.bool,
  interactJsDragPan: PropTypes.func,
  failedPortConnection: PropTypes.func,
  blockStyling: PropTypes.object,
  edgePreview: PropTypes.object,
  fromBlockPosition: PropTypes.object,
  fromBlockInfo: PropTypes.object,
  id: PropTypes.string
};

