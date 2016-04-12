/**
 * Created by twi18192 on 15/01/16.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var blockStore = require('../stores/blockStore.js');
var blockActions = require('../actions/blockActions.js');
var paneActions = require('../actions/paneActions');
var flowChartActions = require('../actions/flowChartActions');
var attributeStore = require('../stores/attributeStore');

var interact = require('../../node_modules/interact.js');

var Ports = React.createClass({

  componentDidMount: function(){
    //interact('.inport')
    //  .on('tap', this.portClick);
    //interact('.outport')
    //  .on('tap', this.portClick);
    //interact('.portArc')
    //  .on('tap', this.portClick);
    interact('.invisiblePortCircle')
      .on('tap', this.portClick);

    interact('.inport')
      .styleCursor(false);
    interact('.outport')
      .styleCursor(false);
    interact('.portArc')
      .styleCursor(false);
    interact('.invisiblePortCircle')
      .styleCursor(false);
  },

  componentWillUnmount: function(){
    //interact('.inport')
    //  .off('tap', this.portClick);
    //interact('.outport')
    //  .off('tap', this.portClick);
    //interact('.portArc')
    //  .off('tap', this.portClick);
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
    /* Need to either invoke an action or fire an event to cause an edge to be drawn */
    /* Also, best have theGraphDiamond container emit the event, not just the port or the node, since then the listener will be in theGraphDiamond to then invoke the edge create function */

    var target;

    console.log(e.currentTarget);

    /* Doing the stuff to accomodate te invisiblePortCircle, instead of giving portClick
    to both portCircle and portArc
     */

    if(e.currentTarget.className.animVal === "invisiblePortCircle"){
      console.log("clicked on invisiblePortCircle, so need to find the corresponding port");
      console.log(e.currentTarget.parentNode);
      console.log(e.currentTarget.parentNode.children);
      for(var i = 0; i < e.currentTarget.parentNode.children.length; i++){
        //console.log(e.currentTarget.parentNode.children[i]);
        if(e.currentTarget.parentNode.children[i].className.animVal === "inport"
          || e.currentTarget.parentNode.children[i].className.animVal === "outport"){
          target = e.currentTarget.parentNode.children[i];
          console.log(target);
        }
      }
    }


    //if(e.currentTarget.className.animVal === "portArc"){
    //  console.log("clicked on an arc, so need to find the corresponding port");
    //  console.log(e.currentTarget.parentNode);
    //  console.log(e.currentTarget.parentNode.children);
    //  for(var i = 0; i < e.currentTarget.parentNode.children.length; i++){
    //    //console.log(e.currentTarget.parentNode.children[i]);
    //    if(e.currentTarget.parentNode.children[i].className.animVal === "inport"
    //      || e.currentTarget.parentNode.children[i].className.animVal === "outport"){
    //      target = e.currentTarget.parentNode.children[i];
    //    }
    //  }
    //}
    //else{
    //  //console.log("clicked on a port, makes it easier");
    //  target = e.currentTarget.id;
    //}
    console.log(target);
    flowChartActions.passPortMouseDown(target);
    var theGraphDiamondHandle = document.getElementById('appAndDragAreaContainer');
    var passingEvent = e;
    console.log(this.props.storingFirstPortClicked);
    if(this.props.storingFirstPortClicked === null){
      //console.log("storingFirstPortClicked is null, so will be running just edgePreview rather than connectEdge");
      theGraphDiamondHandle.dispatchEvent(EdgePreview);
    }
    else if(this.props.storingFirstPortClicked !== null){
      //console.log("a port has already been clicked before, so dispatch TwoPortClicks");
      theGraphDiamondHandle.dispatchEvent(TwoPortClicks)
    }
    //theGraphDiamondHandle.dispatchEvent(PortSelect);
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

    /* Getting rid of the use of allBlockTypesStyling */

    //var allBlockTypesStyling = this.props.allBlockTypesStyling;
    var blockType = blockInfo.type;
    var inports = [];
    var inportsXCoord;
    var outports = [];
    var outportsXCoord;
    var inportsText = [];
    var outportsText = [];
    var blockText = [];

    var blockStyling = this.props.blockStyling; // Not hard coding the styling dimensions etc

    var allBlockAttributes = JSON.parse(JSON.stringify(attributeStore.getAllBlockAttributes()));


    for(var i = 0; i < blockInfo.inports.length; i++){
      var len = blockInfo.inports.length;
      var inportName = blockInfo.inports[i].name;
      var portAndTextTransform = "translate(" + 0 + ","
        + blockStyling.outerRectangleHeight / (len + 1) * (i + 1) + ")";
      //allBlockTypesStyling[blockType].rectangle.rectangleStyling.height

      /* Checking the type of the port via allBlockAttributes in order to colour code the ports */

      //for(var k = 0; k < allBlockAttributes[blockId][inportName].tags.length; k++){
      //  if(allBlockAttributes[blockId][inportName].tags[k].indexOf('flowgraph') !== -1){
      //    var inportValueType = allBlockAttributes[blockId][inportName].tags[k].slice('flowgraph:inport:'.length);
      //  }
      //}

      var inportValueType = blockInfo.inports[i].type;

      inports.push(
        <g key={blockId + inportName + "portAndText"} id={blockId + inportName + "portAndText"}
           transform={portAndTextTransform} >
          <path key={blockId + inportName + "-arc"} d={this.makeArcPath("inport")} className="portArc"
                style={{fill: this.props.selected ? '#797979' : 'black', cursor: 'default' }} />
          <circle key={blockId + inportName} className="inport"
                  cx={0}
                  cy={0}
                  r={blockStyling.portRadius} //allBlockTypesStyling[blockType].ports.portStyling.portRadius
                  style={{fill: inportValueType === 'pos' ? 'orange' : 'lightblue', cursor: 'default'  //allBlockTypesStyling[blockType].ports.portStyling.fill
                   //stroke: allBlockTypesStyling[blockType].ports.portStyling.stroke,
                   // strokeWidth: 1.65, cursor: 'default'
                    }}
                  //onMouseDown={this.portMouseDown} onMouseUp={this.portMouseUp}
                  id={this.props.blockId + inportName}
          />
          <circle key={blockId + inportName + 'invisiblePortCircle'} className="invisiblePortCircle"
                  cx={0}
                  cy={0}
                  r={blockStyling.portRadius + 2}
                  style={{fill: 'transparent', cursor: 'default'
                    }}
            //onMouseDown={this.portMouseDown} onMouseUp={this.portMouseUp}
                  id={this.props.blockId + inportName + 'invisiblePortCircle'}
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
      var len = blockInfo.outports.length;
      var outportName = blockInfo.outports[j].name;
      var portAndTextTransform = "translate(" + blockStyling.outerRectangleWidth //allBlockTypesStyling[blockType].rectangle.rectangleStyling.width
        + "," + blockStyling.outerRectangleHeight / (len + 1) * (j + 1) + ")"; //allBlockTypesStyling[blockType].rectangle.rectangleStyling.height

      var outportValueType = blockInfo.outports[j].type;

      outports.push(
        <g key={blockId + outportName + "portAndText"} id={blockId + outportName + "portAndText"}
           transform={portAndTextTransform} >
          <path key={blockId + outportName + "-arc"} d={this.makeArcPath("outport")} className="portArc"
                style={{fill: this.props.selected ? '#797979' : 'black', cursor: 'default'  }} />
          <circle key={blockId + outportName} className="outport"
                  cx={0}
                  cy={0}
                  r={blockStyling.portRadius} //allBlockTypesStyling[blockType].ports.portStyling.portRadius
                  style={{fill: outportValueType === 'pos' ? 'orange' : 'lightblue', //allBlockTypesStyling[blockType].ports.portStyling.fill
                   //stroke: allBlockTypesStyling[blockType].ports.portStyling.stroke,
                   // strokeWidth: 1.65,
                    cursor: 'default' }}
                  //onMouseDown={this.portMouseDown} onMouseUp={this.portMouseUp}
                  id={this.props.blockId + outportName}
          />
          <circle key={blockId + outportName + 'invisiblePortCircle'} className="invisiblePortCircle"
                  cx={0}
                  cy={0}
                  r={blockStyling.portRadius + 2}
                  style={{fill: 'transparent', cursor: 'default'
                    }}
            //onMouseDown={this.portMouseDown} onMouseUp={this.portMouseUp}
                  id={this.props.blockId + outportName + 'invisiblePortCircle'}
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

    /* Now just need to add the node name and node type text as well */
    /* Hmm, where should I get/calculate their position & height from?... */

    blockText.push([
      <text className="blockName" style={{MozUserSelect: 'none',
       cursor: this.props.portThatHasBeenClicked === null ? "move" : "default", textAnchor: 'middle',
        alignmentBaseline: 'middle', fontSize:"10px", fontFamily: "Verdana"}}
            transform="translate(36, 91)" >
        {blockInfo.label}
      </text>,

      //<text className="blockText" style={{MozUserSelect: 'none',
      // cursor: this.props.portThatHasBeenClicked === null ? "move" : "default", textAnchor: 'middle',
      //  alignmentBaseline: 'middle', fontSize: "8px", fontFamily: "Verdana"}}
      //      transform="translate(36, 104)" >
      //  {blockInfo.type}
      //</text>
    ]);

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
