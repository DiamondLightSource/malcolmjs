/**
 * Created by twi18192 on 10/12/15.
 */

  //let React    = require('../../node_modules/react/react');
let React    = require('react');
let ReactDOM = require('react-dom');

let paneActions      = require('../actions/paneActions');
import flowChartActions from '../actions/flowChartActions';
import MalcolmActionCreators from '../actions/MalcolmActionCreators';

let interact = require('../../node_modules/interact.js');

let Edge = React.createClass(
  {

    propTypes           : {
      areAnyEdgesSelected   : React.PropTypes.bool,
      fromBlockPosition     : React.PropTypes.object,
      fromBlock             : React.PropTypes.string,
      fromBlockPort         : React.PropTypes.string,
      fromBlockInfo         : React.PropTypes.object,
      toBlockPosition       : React.PropTypes.object,
      toBlockPort           : React.PropTypes.string,
      fromBlockPortValueType: React.PropTypes.string,
      toBlock               : React.PropTypes.string,
      id                    : React.PropTypes.string,
      selected              : React.PropTypes.bool,
      blockStyling          : React.PropTypes.object,
      inportArrayIndex      : React.PropTypes.number,
      inportArrayLength     : React.PropTypes.number
    },
    componentDidMount   : function ()
      {
      //ReactDOM.findDOMNode(this).addEventListener('EdgeSelect', this.edgeSelect);
      this.refs.node.addEventListener('EdgeSelect', this.edgeSelect);

      interact(ReactDOM.findDOMNode(this))
        .on('tap', this.edgeSelect);

      window.addEventListener('keydown', this.keyPress);

      },
    componentWillUnmount: function ()
      {
      interact(ReactDOM.findDOMNode(this))
        .off('tap', this.edgeSelect);

      window.removeEventListener('keydown', this.keyPress);

      },

    shouldComponentUpdate: function (nextProps, nextState)
      {
      return (
        nextProps.selected !== this.props.selected ||
        nextProps.areAnyEdgesSelected !== this.props.areAnyEdgesSelected ||
        nextProps.fromBlockPosition.x !== this.props.fromBlockPosition.x ||
        nextProps.fromBlockPosition.y !== this.props.fromBlockPosition.y ||
        nextProps.toBlockPosition.x !== this.props.toBlockPosition.x ||
        nextProps.toBlockPosition.y !== this.props.toBlockPosition.y
      )
      },

    handleMalcolmCall: function (blockName, method, args)
      {
      MalcolmActionCreators.malcolmCall(blockName, method, args);
      },

    handleMalcolmPut: function (blockName, endpoint, value)
      {
      MalcolmActionCreators.malcolmPut(blockName, endpoint, value);
      },

    deleteEdgeViaMalcolm: function ()
      {
      let methodName = "_set_" + this.props.toBlockPort;
      let endpoint = "";
      let argsObject = {};
      let argumentValue;

      if (this.props.fromBlockPortValueType === 'bit')
        {
        argumentValue = 'BITS.ZERO';
        }
      else if (this.props.fromBlockPortValueType === 'pos')
        {
        argumentValue = 'POSITIONS.ZERO';
        }

      argsObject[this.props.toBlockPort] = argumentValue;

      this.handleMalcolmCall(this.props.toBlock, methodName, argsObject);
      // TODO: To be continued...
      //this.handleMalcolmPut(this.props.toBlock, endpoint, argsObject);
      },

    mouseOver : function ()
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
      },
    mouseLeave: function ()
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
      },
    edgeSelect: function (e)
      {
      e.stopImmediatePropagation();
      e.stopPropagation();
      flowChartActions.selectEdge(this.node.id);
      paneActions.openEdgeTab({
        edgeId       : this.node.id,
        fromBlock    : this.props.fromBlock,
        fromBlockPort: this.props.fromBlockPort,
        toBlock      : this.props.toBlock,
        toBlockPort  : this.props.toBlockPort
      });
      },

    keyPress: function (e)
      {
      if (e.keyCode === 46)
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

            this.deleteEdgeViaMalcolm();
            }
          }
        }
      },

    render: function ()
      {
      console.log("render: edges");

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
        if (this.props.fromBlockInfo.outports[i].name === fromBlockPort)
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

      pathInfo = pathInfo.join(" ");

      const gProps = Object.assign({}, this.props);
      const notGProps = ["fromBlock", "fromBlockType", "fromBlockPort", "fromBlockPortValueType", "fromBlockPosition",
                         "toBlock", "toBlockType", "toBlockPort", "toBlockPosition", "fromBlockInfo", "toBlockInfo",
                         "areAnyEdgesSelected", "inportArrayIndex", "inportArrayLength", "blockStyling"];
      for (let i = 0; i < notGProps.length; i++)
        {
        let delProp = notGProps[i];
        delete gProps[delProp];
        }

      return (
        <g id="edgeContainer" {...gProps} ref="node">

          <path id={outerLineName}
                className={'edgeOuterLine' + (this.props.selected === true ? 'Selected' : 'Unselected') }
                d={pathInfo}/>

          <path id={innerLineName} onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave}
                className={"edgeInnerLine" + (this.props.fromBlockPortValueType === 'pos' ? 'POS' : 'BIT')}
                d={pathInfo}/>

        </g>
      )
      }
  });

module.exports = Edge;
