/**
 * Created by twi18192 on 04/02/16.
 */

import * as React from 'react';
let ReactDOM = require('react-dom');

import flowChartActions from '../actions/flowChartActions';

let interact = require('../../node_modules/interact.js');

let EdgePreview = React.createClass({

  propTypes: {
    noPanning           : React.PropTypes.bool,
    failedPortConnection: React.PropTypes.func,
    blockStyling        : React.PropTypes.object,
    edgePreview         : React.PropTypes.object,
    fromBlockPosition   : React.PropTypes.object,
    fromBlockInfo       : React.PropTypes.object,
    id                  : React.PropTypes.string

  },

  getInitialState: function ()
    {
    return {
      noPanning: true
    }
    },

  componentDidMount   : function ()
    {

    interact('#appAndDragAreaContainer')
      .on('move', this.interactJSMouseMoveForEdgePreview);

    interact(ReactDOM.findDOMNode(this))
      .draggable({

        onstart: function (e)
          {
          e.stopImmediatePropagation();
          e.stopPropagation();
          interact('#appAndDragAreaContainer')
            .off('move', this.interactJSMouseMoveForEdgePreview);
          }.bind(this),

        onmove: function (e)
          {
          e.stopImmediatePropagation();
          e.stopPropagation();
          this.props.interactJsDragPan(e);
          }.bind(this),

        onend: function (e)
          {
          e.stopImmediatePropagation();
          e.stopPropagation();

          this.setState({noPanning: true}, function ()
          {
          interact('#appAndDragAreaContainer')
            .on('move', this.interactJSMouseMoveForEdgePreview);
          });

          /* No need for this after changing mousemove to move for some reason? */
          flowChartActions.updateEdgePreviewEndpoint({
            x: e.dx,
            y: e.dy
          })
          }.bind(this)

      });

    interact(ReactDOM.findDOMNode(this))
      .on('tap', this.onTap);

    interact(ReactDOM.findDOMNode(this))
      .on('down', this.onMouseDown);
    },
  componentWillUnmount: function ()
    {

    interact(ReactDOM.findDOMNode(this))
      .off('tap', this.onTap);

    interact(ReactDOM.findDOMNode(this))
      .off('down', this.onMouseDown);

    interact('#appAndDragAreaContainer')
      .off('move', this.interactJSMouseMoveForEdgePreview);

    },

  shouldComponentUpdate: function ()
    {
    return this.state.noPanning
    },

  interactJSMouseMoveForEdgePreview: function (e)
    {
    e.stopImmediatePropagation();
    e.stopPropagation();

    let mousePositionChange = {
      x: e.mozMovementX,
      y: e.mozMovementY
    };

    flowChartActions.updateEdgePreviewEndpoint(mousePositionChange);

    },

  onTap: function (e)
    {
    e.stopImmediatePropagation();
    e.stopPropagation();

    interact('#appAndDragAreaContainer')
      .off('move', this.interactJSMouseMoveForEdgePreview);
    this.props.failedPortConnection();
    },

  onMouseDown: function (e)
    {
    e.stopImmediatePropagation();
    e.stopPropagation();

    this.setState({noPanning: false}, function ()
    {
    interact('#appAndDragAreaContainer')
      .off('move', this.interactJSMouseMoveForEdgePreview);
    });
    },

  render: function ()
    {
    //console.log("render: edgePreview");

    let blockStyling = this.props.blockStyling;

    let fromBlockInfo = this.props.edgePreview.fromBlockInfo;

    let fromBlockPositionX = this.props.fromBlockPosition.x;
    let fromBlockPositionY = this.props.fromBlockPosition.y;

    let portValueType;
    let startOfEdgePortOffsetX;
    let startOfEdgePortOffsetY;

    if (fromBlockInfo.fromBlockPortType === "inport")
      {
      let inportArrayLength = this.props.fromBlockInfo.inports.length;
      let inportArrayIndex;
      let inportValueType;
      for (let j = 0; j < inportArrayLength; j++)
        {
        if (this.props.fromBlockInfo.inports[j].name === fromBlockInfo.fromBlockPort)
          {
          inportArrayIndex = JSON.parse(JSON.stringify(j));
          inportValueType  = this.props.fromBlockInfo.inports[inportArrayIndex].type;
          portValueType    = inportValueType;
          }
        }
      startOfEdgePortOffsetX = 0;
      startOfEdgePortOffsetY = blockStyling.outerRectangleHeight / (inportArrayLength + 1) * (inportArrayIndex + 1);
      }
    else if (fromBlockInfo.fromBlockPortType === "outport")
      {
      let outportArrayLength = this.props.fromBlockInfo.outports.length;
      let outportArrayIndex;
      let outportValueType;

      for (let i = 0; i < outportArrayLength; i++)
        {
        if (this.props.fromBlockInfo.outports[i].name === fromBlockInfo.fromBlockPort)
          {
          outportArrayIndex = JSON.parse(JSON.stringify(i));
          outportValueType  = this.props.fromBlockInfo.outports[outportArrayIndex].type;
          portValueType     = outportValueType;
          }
        }
      startOfEdgePortOffsetX = blockStyling.outerRectangleWidth;
      startOfEdgePortOffsetY = blockStyling.outerRectangleHeight / (outportArrayLength + 1) * (outportArrayIndex + 1);
      }

    let startOfEdgeX = fromBlockPositionX + startOfEdgePortOffsetX;
    let startOfEdgeY = fromBlockPositionY + startOfEdgePortOffsetY;

    let endOfEdgeX = this.props.edgePreview.endpointCoords.x;
    let endOfEdgeY = this.props.edgePreview.endpointCoords.y;

    let innerLineString = "-innerline";
    let outerLineString = "-outerline";
    let innerLineName   = this.props.id.concat(innerLineString);
    let outerLineName   = this.props.id.concat(outerLineString);

    /* Trying curvy lines! */

    let sourceX = startOfEdgeX;
    let sourceY = startOfEdgeY;
    let targetX = endOfEdgeX;
    let targetY = endOfEdgeY;

    let c1X, c1Y, c2X, c2Y;

    /* I think nodeSize is the block height or width, not sure which one though? */

    if ((targetX - 5 < sourceX && fromBlockInfo.fromBlockPortType === "outport") ||
      (targetX - 5 > sourceX && fromBlockInfo.fromBlockPortType === "inport"))
      {
      let curveFactor = (sourceX - targetX) * blockStyling.outerRectangleHeight / 200;
      if (Math.abs(targetY - sourceY) < blockStyling.outerRectangleHeight / 2)
        {
        // Loopback
        c1X = sourceX + curveFactor;
        c1Y = sourceY - curveFactor;
        c2X = targetX - curveFactor;
        c2Y = targetY - curveFactor;
        }
      else
        {
        // Stick out some
        c1X = sourceX + curveFactor;
        c1Y = sourceY + (targetY > sourceY ? curveFactor : -curveFactor);
        c2X = targetX - curveFactor;
        c2Y = targetY + (targetY > sourceY ? -curveFactor : curveFactor);
        }
      }
    else
      {
      // Controls halfway between
      c1X = sourceX + (targetX - sourceX) / 2;
      c1Y = sourceY;
      c2X = c1X;
      c2Y = targetY;
      }

    let pathInfo = [
      "M",
      sourceX, sourceY,
      "C",
      c1X, c1Y,
      c2X, c2Y,
      targetX, targetY
    ];

    pathInfo = pathInfo.join(" ");

    // Removed props not relevant to <g> and store remainder in gProps
    const gProps    = Object.assign({}, this.props);
    const notGProps = ["fromBlock", "fromBlockType", "fromBlockPort", "fromBlockPortValueType", "fromBlockPosition",
                       "toBlock", "toBlockType", "toBlockPort", "toBlockPosition", "fromBlockInfo", "toBlockInfo",
                       "areAnyEdgesSelected", "inportArrayIndex", "inportArrayLength", "blockStyling",
                       "interactJsDragPan", "failedPortConnection", "edgePreview"];
    for (let i = 0; i < notGProps.length; i++)
      {
      let delProp = notGProps[i];
      delete gProps[delProp];
      }

    return (
      <g id="edgePreviewContainer" {...gProps} ref="node">

        <path id={outerLineName} className="edgePreviewOuterLine"
              d={pathInfo}/>

        <path id={innerLineName} className={"edgePreviewInnerLine" + (portValueType === 'pos' ? 'POS' : 'BIT')}
              d={pathInfo}/>

      </g>
    )
    }
});

module.exports = EdgePreview;
