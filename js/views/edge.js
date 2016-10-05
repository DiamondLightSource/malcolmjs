/**
 * Created by twi18192 on 10/12/15.
 */

var React    = require('../../node_modules/react/react');
var ReactDOM = require('react-dom');

var paneActions           = require('../actions/paneActions');
var flowChartActions      = require('../actions/flowChartActions');
var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var interact = require('../../node_modules/interact.js');

var Edge = React.createClass(
  {

    propTypes           : {
      areAnyEdgesSelected    : React.PropTypes.bool,
      fromBlockPosition      : React.PropTypes.object,
      fromBlock              : React.PropTypes.object,
      fromBlockPort          : React.PropTypes.object,
      fromBlockInfo          : React.PropTypes.object,
      toBlockPosition        : React.PropTypes.object,
      toBlockPort            : React.PropTypes.string,
      fromBlockPortValueType : React.PropTypes.string,
      toBlock                : React.PropTypes.string,
      id                     : React.PropTypes.string,
      selected               : React.PropTypes.bool,
      blockStyling           : React.PropTypes.string,
      inportArrayIndex       : React.PropTypes.number,
      inportArrayLength      : React.PropTypes.number
    },
    componentDidMount   : function ()
      {
      ReactDOM.findDOMNode(this).addEventListener('EdgeSelect', this.edgeSelect);

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

    deleteEdgeViaMalcolm: function ()
      {
      var methodName = "_set_" + this.props.toBlockPort;
      var argsObject = {};
      var argumentValue;

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
    },

    mouseOver : function ()
      {
      var outerLineName = this.props.id.concat("-outerline");
      var test          = document.getElementById(outerLineName);
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
      var outerLineName = this.props.id.concat("-outerline");
      var test          = document.getElementById(outerLineName);
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
      flowChartActions.selectEdge(ReactDOM.findDOMNode(this).id);
      paneActions.openEdgeTab({
        edgeId       : ReactDOM.findDOMNode(this).id,
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

      var blockStyling = this.props.blockStyling;

      var fromBlockPort = this.props.fromBlockPort;

      var fromBlockPositionX = this.props.fromBlockPosition.x;
      var fromBlockPositionY = this.props.fromBlockPosition.y;
      var toBlockPositionX   = this.props.toBlockPosition.x;
      var toBlockPositionY   = this.props.toBlockPosition.y;

      var outportArrayLength = this.props.fromBlockInfo.outports.length;
      var outportArrayIndex;
      /* outportArrayIndex is used in the calculation of the y coordinate
       of the block with the outport involved in the connection
       */
      for (var i = 0; i < outportArrayLength; i++)
        {
        if (this.props.fromBlockInfo.outports[i].name === fromBlockPort)
          {
          outportArrayIndex = JSON.parse(JSON.stringify(i));
        }
      }

      var startOfEdgePortOffsetX = blockStyling.outerRectangleWidth;
      var startOfEdgePortOffsetY = blockStyling.outerRectangleHeight /
        (outportArrayLength + 1) * (outportArrayIndex + 1);
      var startOfEdgeX           = fromBlockPositionX + startOfEdgePortOffsetX;
      var startOfEdgeY           = fromBlockPositionY + startOfEdgePortOffsetY;

      var endOfEdgePortOffsetX = 0;
      var endOfEdgePortOffsetY = blockStyling.outerRectangleHeight /
        (this.props.inportArrayLength + 1) * (this.props.inportArrayIndex + 1);
      var endOfEdgeX           = toBlockPositionX + endOfEdgePortOffsetX;
      var endOfEdgeY           = toBlockPositionY + endOfEdgePortOffsetY;

      var innerLineString = "-innerline";
      var outerLineString = "-outerline";
      var innerLineName   = this.props.id.concat(innerLineString);
      var outerLineName   = this.props.id.concat(outerLineString);

      /* Trying curvy lines! */

      var sourceX = startOfEdgeX;
      var sourceY = startOfEdgeY;
      var targetX = endOfEdgeX;
      var targetY = endOfEdgeY;

      var c1X, c1Y, c2X, c2Y;

      /* I think nodeSize is the block height or width, not sure which one though? */

      if (targetX - 5 < sourceX)
        {
        var curveFactor = (sourceX - targetX) * blockStyling.outerRectangleHeight / 200;
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

      var pathInfo = [
        "M",
        sourceX, sourceY,
        "C",
        c1X, c1Y,
        c2X, c2Y,
        targetX, targetY
      ];

      pathInfo = pathInfo.join(" ");


      return (
        <g id="edgeContainer" {...this.props}>

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
