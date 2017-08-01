/**
 * Created by twi18192 on 10/12/15.
 */

//let React    = require('../../node_modules/react/react');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import paneActions from '../actions/paneActions';
import flowChartActions from '../actions/flowChartActions';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';
import {MalcolmDefs} from '../utils/malcolmProtocol';
import interact from '../../node_modules/interactjs';
import KeyCodes from '../constants/keycodes';

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
  ReactDOM.findDOMNode(this).addEventListener('EdgeSelect', this.edgeSelect);
  //this.refs.node.addEventListener('EdgeSelect', this.edgeSelect);

  interact(ReactDOM.findDOMNode(this))
    .on('tap', this.edgeSelect);

  window.addEventListener('keydown', this.keyPress);

  }

componentWillUnmount()
  {
  interact(ReactDOM.findDOMNode(this))
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
  let outerLineName = this.props.id.concat("-outerline");
  let test          = document.getElementById(outerLineName);
  if (this.props.selected === true)
    {

    }
  else
    {
    test.style.stroke = '#797979'
    }
  }

mouseLeave()
  {
  let outerLineName = this.props.id.concat("-outerline");
  let test          = document.getElementById(outerLineName);
  if (this.props.selected === true)
    {
    //console.log("this.props.selected is true, so don't reset the border colour");
    }
  else
    {
    //console.log("this.props.selected is false");
    test.style.stroke = 'lightgrey'
    }
  }

edgeSelect(e)
  {
  e.stopImmediatePropagation();
  e.stopPropagation();
  flowChartActions.selectEdge(ReactDOM.findDOMNode(this).id);
  paneActions.openEdgeTab({
    edgeId       : ReactDOM.findDOMNode(this).id,
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

  let startOfEdgePortOffsetX = blockStyling.outerRectangleWidth;
  let startOfEdgePortOffsetY = blockStyling.outerRectangleHeight /
    (outportArrayLength + 1) * (outportArrayIndex + 1);
  let startOfEdgeX           = fromBlockPositionX + startOfEdgePortOffsetX;
  let startOfEdgeY           = fromBlockPositionY + startOfEdgePortOffsetY;

  let endOfEdgePortOffsetX = 0;
  let endOfEdgePortOffsetY = blockStyling.outerRectangleHeight /
    (this.props.inportArrayLength + 1) * (this.props.inportArrayIndex + 1);
  let endOfEdgeX           = toBlockPositionX + endOfEdgePortOffsetX;
  let endOfEdgeY           = toBlockPositionY + endOfEdgePortOffsetY;

  let innerLineString = "-innerline";
  let outerLineString = "-outerline";
  let innerLineName   = this.props.id.concat(innerLineString);
  let outerLineName   = this.props.id.concat(outerLineString);

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
  console.log(`Edge.render():  sourceX: ${sourceX} sourceY: ${sourceY} targetX: ${targetX} targetY: ${targetY} c1X: ${c1X} c1Y: ${c1Y} c2X: ${c2X} c2Y ${c2Y}`);

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
    let edgeContainerId = "edgeContainer-"+outerLineName;
  //console.log(`Edge.render(): ${edgeContainerId}`);
  return (
    <g id={edgeContainerId} {...gProps} ref="node">

      <path id={outerLineName}
            className={'edgeOuterLine' + (this.props.selected === true ? 'Selected' : 'Unselected') }
            d={pathInfo}/>

      <path id={innerLineName} onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave}
            className={"edgeInnerLine" + (this.props.fromBlockPortValueType === MalcolmDefs.MINT32 ? 'int32' : 'bool')}
            d={pathInfo}/>

    </g>
  )
  }
}

Edge.propTypes = {
  areAnyEdgesSelected   : PropTypes.bool,
  fromBlockPosition     : PropTypes.object,
  fromBlock             : PropTypes.string,
  fromBlockPort         : PropTypes.string,
  fromBlockInfo         : PropTypes.object,
  toBlockPosition       : PropTypes.object,
  toBlockPort           : PropTypes.string,
  fromBlockPortValueType: PropTypes.string,
  toBlock               : PropTypes.string,
  id                    : PropTypes.string,
  selected              : PropTypes.bool,
  blockStyling          : PropTypes.object,
  inportArrayIndex      : PropTypes.number,
  inportArrayLength     : PropTypes.number
};

