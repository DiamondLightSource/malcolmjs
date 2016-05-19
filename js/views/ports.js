/**
 * Created by twi18192 on 15/01/16.
 */

var React = require('../../node_modules/react/react');

var flowChartActions = require('../actions/flowChartActions');

var interact = require('../../node_modules/interact.js');

var Ports = React.createClass({

  componentDidMount: function(){
    interact('.invisiblePortCircle')
      .on('tap', this.portClick);

    interact('.invisiblePortCircle')
      .styleCursor(false);
  },

  componentWillUnmount: function(){
    interact('.invisiblePortCircle')
      .off('tap', this.portClick);
  },

  shouldComponentUpdate(nextProps, nextState){
    console.log("port's shouldComponentUpdate");
    if(this.props.portThatHasBeenClicked === null){
      return (
        nextProps.selected !== this.props.selected
      )
    }
    else if(nextProps.portThatHasBeenClicked !== null ||
      this.props.portThatHasBeenClicked !== null ||
      nextProps.storingFirstPortClicked !== null ||
      this.props.storingFirstPortClicked !== null){

      return (
        nextProps.selected !== this.props.selected ||
        nextProps.portThatHasBeenClicked !== this.props.portThatHasBeenClicked ||
        nextProps.storingFirstPortClicked !== this.props.storingFirstPortClicked
      );
    }
  },

  portClick: function(e){
    e.stopImmediatePropagation();
    e.stopPropagation();

    var target;

    /* Doing the stuff to accomodate the invisiblePortCircle, instead of giving portClick
    to both portCircle and portArc
     */

    if(e.currentTarget.className.animVal === "invisiblePortCircle"){
      for(var i = 0; i < e.currentTarget.parentNode.children.length; i++){
        if(e.currentTarget.parentNode.children[i].className.animVal.indexOf('inport') !== -1
          || e.currentTarget.parentNode.children[i].className.animVal.indexOf('outport') !== -1){
          target = e.currentTarget.parentNode.children[i];
        }
      }
    }

    flowChartActions.passPortMouseDown(target);
    var flowChartHandle = document.getElementById('appAndDragAreaContainer');

    if(this.props.storingFirstPortClicked === null){
      /* Haven't clicked on another port before this,
      just do an edgePreview rather than draw an edge
       */
      flowChartHandle.dispatchEvent(EdgePreview);
    }
    else if(this.props.storingFirstPortClicked !== null){
      /* A port has been clicked before this, so
      start the checking whether the two ports
      are connectable/compatible
       */
      flowChartHandle.dispatchEvent(TwoPortClicks)
    }
  },

  /* From the-graph */

  angleToX: function (percent, radius) {
    return radius * Math.cos(2*Math.PI * percent);
  },
  angleToY: function (percent, radius) {
    return radius * Math.sin(2*Math.PI * percent);
  },
  makeArcPath: function (port) {

    if(port === "inport"){
      return [
        "M", this.angleToX(-1/4, 4), this.angleToY(-1/4, 4),
        "A", 4, 4, 0, 0, 0, this.angleToX(1/4, 4), this.angleToY(1/4, 4)
      ].join(" ");
    }
    else if(port === "outport"){
      return [
        "M", this.angleToX(1/4, 4), this.angleToY(1/4, 4),
        "A", 4, 4, 0, 0, 0, this.angleToX(-1/4, 4), this.angleToY(-1/4, 4)
      ].join(" ");
    }
  },

  render: function(){
    console.log("render: ports");

    var blockId = this.props.blockId;
    var blockInfo = this.props.blockInfo;

    var inports = [];
    var outports = [];
    var blockText = [];

    var blockStyling = this.props.blockStyling;

    for(var i = 0; i < blockInfo.inports.length; i++){
      var inportsLength = blockInfo.inports.length;
      var inportName = blockInfo.inports[i].name;
      var inportAndTextTransform = "translate(" + 0 + ","
        + blockStyling.outerRectangleHeight / (inportsLength + 1) * (i + 1) + ")";

      var inportValueType = blockInfo.inports[i].type;

      inports.push(
        <g key={blockId + inportName + "portAndText"}
           id={blockId + inportName + "portAndText"}
           transform={inportAndTextTransform} >
          <path key={blockId + inportName + "-arc"}
                d={this.makeArcPath("inport")} className="portArc"
                style={{fill: this.props.selected ? '#797979' : 'black',
                        cursor: 'default' }} />
          <circle key={blockId + inportName}
                  className={'inport' + (inportValueType === 'pos' ? 'POS' : 'BIT')}
                  cx={0}
                  cy={0}
                  r={blockStyling.portRadius}
                  style={{cursor: 'default'}}
                  id={blockId + inportName}
          />
          <circle key={blockId + inportName + 'invisiblePortCircle'}
                  className="invisiblePortCircle"
                  cx={0}
                  cy={0}
                  r={blockStyling.portRadius + 2}
                  style={{fill: 'transparent', cursor: 'default'}}
                  id={blockId + inportName + 'invisiblePortCircle'}
          />
          <text key={blockId + inportName + "-text"} textAnchor="start"
                x={5}
                y={3}
                style={{MozUserSelect: 'none',
                cursor: this.props.portThatHasBeenClicked === null ? "move" : "default",
                fontSize:"7px", fontFamily: "Verdana"}}
          >
            {inportName}
          </text>
        </g>
      );
    }

    for(var j = 0; j < blockInfo.outports.length; j++){
      var outportsLength = blockInfo.outports.length;
      var outportName = blockInfo.outports[j].name;
      var outportAndTextTransform = "translate(" + blockStyling.outerRectangleWidth
        + "," + blockStyling.outerRectangleHeight / (outportsLength + 1) * (j + 1) + ")";

      var outportValueType = blockInfo.outports[j].type;

      outports.push(
        <g key={blockId + outportName + "portAndText"}
           id={blockId + outportName + "portAndText"}
           transform={outportAndTextTransform} >
          <path key={blockId + outportName + "-arc"}
                d={this.makeArcPath("outport")} className="portArc"
                style={{fill: this.props.selected ? '#797979' : 'black',
                cursor: 'default'  }} />
          <circle key={blockId + outportName}
                  className={"outport" + (outportValueType === 'pos' ? 'POS' : 'BIT')}
                  cx={0}
                  cy={0}
                  r={blockStyling.portRadius}
                  style={{cursor: 'default' }}
                  id={blockId + outportName}
          />
          <circle key={blockId + outportName + 'invisiblePortCircle'}
                  className="invisiblePortCircle"
                  cx={0}
                  cy={0}
                  r={blockStyling.portRadius + 2}
                  style={{fill: 'transparent', cursor: 'default'}}
                  id={blockId + outportName + 'invisiblePortCircle'}
          />
          <text key={blockId + outportName + "-text"} textAnchor="end"
                x={-5}
                y={3}
                style={{MozUserSelect: 'none',
                cursor: this.props.portThatHasBeenClicked === null ? "move" : "default",
                fontSize:"7px", fontFamily: "Verdana"}}
          >
            {outportName}
          </text>
        </g>
      );
    }

    /* Now just need to add the block name text */

    blockText.push(
      <text className="blockName" key={blockId + 'textLabel'}
            style={{MozUserSelect: 'none', fill: 'lightgrey',
                    cursor: this.props.portThatHasBeenClicked === null ? "move" : "default",
                    textAnchor: 'middle', alignmentBaseline: 'middle',
                    fontSize:"10px", fontFamily: "Verdana"}}
            transform="translate(36, 91)" >
        {blockInfo.label}
      </text>
    );

    return (
      <g id={blockId + "-ports"} >
        <g id={blockId + "-inports"} >
          {inports}
        </g>
        <g id={blockId + "-outports"} >
          {outports}
        </g>
        {blockText}
      </g>
    )
  }
});

module.exports = Ports;
