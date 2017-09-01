/**
 * Created by twi18192 on 10/12/15.
 */

//let React    = require('../../node_modules/react/react');
import * as React from 'react';
import PropTypes from 'prop-types';

import paneActions from '../actions/paneActions';
import flowChartActions from '../actions/flowChartActions';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';
import {MalcolmDefs} from '../utils/malcolmProtocol';
import interact from 'interactjs';
import KeyCodes from '../constants/keycodes';
import styles from '../styles/edge.scss';
import {BlockStore} from '../stores/blockStore';

export default class Edge extends React.Component {
constructor(props)
  {
  super(props);
  this.mouseOver  = this.mouseOver.bind(this);
  this.mouseLeave = this.mouseLeave.bind(this);
  this.edgeSelect = this.edgeSelect.bind(this);
  this.keyPress   = this.keyPress.bind(this);
  }

componentDidMount()
  {
  this.g.addEventListener('EdgeSelect', this.edgeSelect);
  //this.refs.node.addEventListener('EdgeSelect', this.edgeSelect);

  interact(this.g)
    .on('tap', this.edgeSelect);

  window.addEventListener('keydown', this.keyPress);

  }

componentWillUnmount()
  {
  interact(this.g)
    .off('tap', this.edgeSelect);

  window.removeEventListener('keydown', this.keyPress);

  }

shouldComponentUpdate(nextProps, nextState)
  {
    return(true);
/*
  return (
    nextProps.selected !== this.props.selected ||
    nextProps.areAnyEdgesSelected !== this.props.areAnyEdgesSelected ||
    nextProps.fromBlockPosition.x !== this.props.fromBlockPosition.x ||
    nextProps.fromBlockPosition.y !== this.props.fromBlockPosition.y ||
    nextProps.toBlockPosition.x !== this.props.toBlockPosition.x ||
    nextProps.toBlockPosition.y !== this.props.toBlockPosition.y
  )
*/
  }

handleMalcolmCall(blockName, method, args)
  {
  MalcolmActionCreators.malcolmCall(blockName, method, args);
  }

handleMalcolmPut(blockName, endpoint, value)
  {
  MalcolmActionCreators.malcolmPut(blockName, endpoint, value);
  }

deleteEdgeViaMalcolm()
  {
  let methodName = "_set_" + this.props.toBlockPort;
  let endpoint   = "";
  let argsObject = {};
  let argumentValue;

  if ((this.props.fromBlockPortValueType === 'bool') || (this.props.fromBlockPortValueType === 'int32'))
    {
    argumentValue = 'ZERO';
    }

  argsObject[this.props.toBlockPort] = argumentValue;

  this.handleMalcolmCall(this.props.toBlock, methodName, argsObject);
  // TODO: To be continued...
  //this.handleMalcolmPut(this.props.toBlock, endpoint, argsObject);
  }

mouseOver()
  {
  let outerLineName = styles[this.props.id.concat("-outerline")];
  let test          = document.getElementById(outerLineName);
  if (this.props.selected === true)
    {

    }
  else if (test)
    {
    test.style.stroke = '#797979'
    }
  }

mouseLeave()
  {
  let outerLineName = styles[this.props.id.concat("-outerline")];
  let test          = document.getElementById(outerLineName);
  if (this.props.selected === true)
    {
    //console.log("this.props.selected is true, so don't reset the border colour");
    }
  else if (test)
    {
    //console.log("this.props.selected is false");
    test.style.stroke = 'lightgrey'
    }
  }

edgeSelect(e)
  {
  e.stopImmediatePropagation();
  e.stopPropagation();
  flowChartActions.selectEdge(this.g.id);
  paneActions.openEdgeTab({
    edgeId       : this.g.id,
    fromBlock    : this.props.fromBlock,
    fromBlockPort: this.props.fromBlockPort,
    toBlock      : this.props.toBlock,
    toBlockPort  : this.props.toBlockPort
  });
  }

keyPress(e)
  {
  // Test for 'Delete' keyboard press.
  if (e.keyCode === KeyCodes.deleteKey)
    {
    //console.log("delete key has been pressed");
    if (this.props.areAnyEdgesSelected === true)
      {
      if (this.props.selected === true)
        {
        /* Delete this particular edge */

        /* The fromBlock is ALWAYS the block with the outport at this stage,
         so no need to worry about potentially switching it around
         */
        console.log("edge.keyPress(e) triggering deleteEdgeViaMalcolm().")
        this.deleteEdgeViaMalcolm();
        }
      }
    }
  }

render()
  {
  let blockStyling = this.props.blockStyling;

  let fromBlockPort = this.props.fromBlockPort;

  let fromBlockPositionX = this.props.fromBlockPosition.x;
  let fromBlockPositionY = this.props.fromBlockPosition.y;
  let toBlockPositionX   = this.props.toBlockPosition.x;
  let toBlockPositionY   = this.props.toBlockPosition.y;

  let outportArrayLength = this.props.fromBlockInfo.outports.length;
  let outportArrayIndex;
  /* outportArrayIndex is used in the calculation of the y coordinate
   of the block with the outport involved in the connection
   */
  for (let i = 0; i < outportArrayLength; i++)
    {
    if (this.props.fromBlockInfo.outports[i].name.toUpperCase() === fromBlockPort.toUpperCase())
      {
      outportArrayIndex = JSON.parse(JSON.stringify(i));
      }
    }

  // TODO: nports is not a property of Edge, so need to rethink this bit or remove it.
  // default height to basic style.
  let outerRectHeight = blockStyling.outerRectangleHeight;
  // then if nports property is specified, calculate the ideal height.
  if (this.props.nports)
    {
    if (this.props.nports > 0)
      {
      outerRectHeight = (2*blockStyling.verticalMargin) + (this.props.nports - 1)*blockStyling.interPortSpacing;
      }
    }

  let startOfEdgePortOffsetX = blockStyling.outerRectangleWidth;
/*
  let startOfEdgePortOffsetY = outerRectHeight /
    (outportArrayLength + 1) * (outportArrayIndex + 1);
*/
  let startOfEdgePortOffsetY = BlockStore.drawingParams.verticalMargin+(BlockStore.drawingParams.interPortSpacing * (outportArrayIndex));
  let startOfEdgeX           = fromBlockPositionX + startOfEdgePortOffsetX;
  let startOfEdgeY           = fromBlockPositionY + startOfEdgePortOffsetY;

  let endOfEdgePortOffsetX = 0;
/*
  let endOfEdgePortOffsetY = outerRectHeight /
    (this.props.inportArrayLength + 1) * (this.props.inportArrayIndex + 1);
*/
  let endOfEdgePortOffsetY = BlockStore.drawingParams.verticalMargin + (BlockStore.drawingParams.interPortSpacing * (this.props.inportArrayIndex));
  let endOfEdgeX           = toBlockPositionX + endOfEdgePortOffsetX;
  let endOfEdgeY           = toBlockPositionY + endOfEdgePortOffsetY;

  let innerLineString = "-innerline";
  let outerLineString = "-outerline";
  let innerLineName   = styles[this.props.id.concat(innerLineString)];
  let outerLineName   = styles[this.props.id.concat(outerLineString)];

  /* Trying curvy lines! */

  let sourceX = startOfEdgeX;
  let sourceY = startOfEdgeY;
  let targetX = endOfEdgeX;
  let targetY = endOfEdgeY;

  let c1X;
  let c1Y;
  let c2X;
  let c2Y;

  /* I think nodeSize is the block height or width, not sure which one though? */

  if (targetX - 5 < sourceX)
    {
    let curveFactor = (sourceX - targetX) * outerRectHeight / 200;
    if (Math.abs(targetY - sourceY) < outerRectHeight / 2)
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
  //console.log(`Edge.render():  sourceX: ${sourceX} sourceY: ${sourceY} targetX: ${targetX} targetY: ${targetY} c1X: ${c1X} c1Y: ${c1Y} c2X: ${c2X} c2Y ${c2Y}`);

  pathInfo = pathInfo.join(" ");

  const gProps    = Object.assign({}, this.props);
  const notGProps = ["fromBlock", "fromBlockType", "fromBlockPort", "fromBlockPortValueType", "fromBlockPosition",
                     "toBlock", "toBlockType", "toBlockPort", "toBlockPosition", "fromBlockInfo", "toBlockInfo",
                     "areAnyEdgesSelected", "inportArrayIndex", "inportArrayLength", "blockStyling"];
  for (let i = 0; i < notGProps.length; i++)
    {
    let delProp = notGProps[i];
    delete gProps[delProp];
    }
    let edgeContainerId = styles["edgeContainer-"+outerLineName];
  //console.log(`Edge.render(): ${edgeContainerId}`);
  return (
    <g id={edgeContainerId} {...gProps} ref={(node) => {this.g = node}}>

      <path id={outerLineName}
            className={styles['edgeOuterLine' + (this.props.selected === true ? 'Selected' : 'Unselected')] }
            d={pathInfo}/>

      <path id={styles[innerLineName]} onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave}
            className={styles["edgeInnerLine" + (this.props.fromBlockPortValueType === MalcolmDefs.MINT32 ? 'int32' : 'bool')]}
            d={pathInfo}/>

    </g>
  )
  }
}

Edge.propTypes = {
  fromBlock             : PropTypes.string,
  fromBlockType         : PropTypes.string,
  fromBlockPort         : PropTypes.string,
  fromBlockPortValueType: PropTypes.string,
  fromBlockPosition     : PropTypes.object,
  toBlock               : PropTypes.string,
  toBlockType           : PropTypes.string,
  toBlockPort           : PropTypes.string,
  toBlockPosition       : PropTypes.object,
  fromBlockInfo         : PropTypes.object,
  toBlockInfo           : PropTypes.object,
  areAnyEdgesSelected   : PropTypes.bool,
  selected              : PropTypes.bool,
  inportArrayIndex      : PropTypes.number,
  inportArrayLength     : PropTypes.number,
  id                    : PropTypes.string,
  blockStyling          : PropTypes.object,
};
