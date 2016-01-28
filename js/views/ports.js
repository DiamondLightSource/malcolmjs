/**
 * Created by twi18192 on 15/01/16.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var blockStore = require('../stores/blockStore.js');
var blockActions = require('../actions/blockActions.js');
var paneActions = require('../actions/paneActions');

var interact = require('../../node_modules/interact.js');


function getPortState(){
  return{
    //allNodeInfo: NodeStore.getAllNodeInfo(),
    //allNodeTypesStyling: NodeStore.getAllNodeTypesStyling(),
    //portThatHasBeenClicked: NodeStore.getPortThatHasBeenClicked(),
    //storingFirstPortClicked: NodeStore.getStoringFirstPortClicked(),
  }
}

var Ports = React.createClass({
  //getInitialState: function(){
  //  return getPortState();
  //},
  //componentDidMount: function(){
  //  NodeStore.addChangeListener(this._onChange);
  //},
  //componentWillUnmount: function(){
  //  NodeStore.removeChangeListener(this._onChange);
  //},
  //_onChange: function(){
  //  this.setState(getPortState());
  //},

  //shouldComponentUpdate: function(nextProps, nextState){
  //
  //},

  componentDidMount: function(){
    interact('.port')
      .on('tap', this.portClick);

    interact('.port')
      .styleCursor(false);
  },

  componentWillUnmount: function(){
    interact('.port')
      .off('tap', this.portClick)
  },

  portMouseDown: function(e){
    console.log("portMouseDown");
    console.log(e);
    blockActions.passPortMouseDown(e.currentTarget);

    console.log(e.currentTarget.parentNode.parentNode.parentNode);

    var portMouseDownCoords = {
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY
    };
    this.setState({portMouseDownCoords: portMouseDownCoords});
    var whichPort = e.currentTarget;
    console.log(whichPort);
  },
  portMouseUp: function(e){
    console.log("portMouseUp");
    console.log(e);
    var portMouseUpCoords = {
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY
    };
    if(this.state.portMouseDownCoords.x === portMouseUpCoords.x && this.state.portMouseDownCoords.y === portMouseUpCoords.y){
      console.log("zero mouse movement on portMOuseDown & Up, hence invoke portClick!");
      this.portClick(e);
    }
    else{
      console.log("some other mouse movement has occured between portMouseDown & Up, so portClick won't be invoked");
    }
  },
  portClick: function(e){
    e.stopImmediatePropagation();
    e.stopPropagation();
    console.log("portClick");
    /* Need to either invoke an action or fire an event to cause an edge to be drawn */
    /* Also, best have theGraphDiamond container emit the event, not just the port or the node, since then the listener will be in theGraphDiamond to then invoke the edge create function */
    blockActions.passPortMouseDown(e.currentTarget);
    var theGraphDiamondHandle = document.getElementById('appAndDragAreaContainer');
    var passingEvent = e;
    if(this.props.storingFirstPortClicked === null){
      console.log("storingFirstPortClicked is null, so will be running just edgePreview rather than connectEdge");
      theGraphDiamondHandle.dispatchEvent(EdgePreview);
    }
    else if(this.props.storingFirstPortClicked !== null){
      console.log("a port has already been clicked before, so dispatch TwoPortClicks");
      theGraphDiamondHandle.dispatchEvent(TwoPortClicks)
    }
    //theGraphDiamondHandle.dispatchEvent(PortSelect);
  },

  render: function(){

    var blockId = this.props.blockId;
    var blockInfo = this.props.allBlockInfo[blockId];

    var allBlockTypesStyling = this.props.allBlockTypesStyling;
    var blockType = blockInfo.type;
    var inports = [];
    var inportsXCoord;
    var outports = [];
    var outportsXCoord;
    var portsText = [];

    for(i = 0; i < blockInfo.inports.length; i++){
      var inportName = blockInfo.inports[i].name;
      //console.log(allNodeTypesStyling[nodeType]);
      inports.push(
        <circle key={blockId + inportName} className="port" cx={allBlockTypesStyling[blockType].ports.portPositions.inportPositions[inportName].x} cy={allBlockTypesStyling[blockType].ports.portPositions.inportPositions[inportName].y}
                r={allBlockTypesStyling[blockType].ports.portStyling.portRadius} style={{fill: allBlockTypesStyling[blockType].ports.portStyling.fill, stroke: allBlockTypesStyling[blockType].ports.portStyling.stroke, strokeWidth: 1.65 }}
                //onMouseDown={this.portMouseDown} onMouseUp={this.portMouseUp}
                id={this.props.blockId + inportName}
        />
      );

      /* Taking care of the inport text too */
      portsText.push(
        <text key={blockId + inportName + "-text"} x={allBlockTypesStyling[blockType].text.textPositions[inportName].x} y={allBlockTypesStyling[blockType].text.textPositions[inportName].y}
              style={{MozUserSelect: 'none', cursor: this.props.portThatHasBeenClicked === null ? "move" : "default", fontSize:"10px", fontFamily: "Verdana"}}
        >
          {inportName}
        </text>
      )
    }

    for(j = 0; j < blockInfo.outports.length; j++){
      var outportName = blockInfo.outports[j].name;
      outports.push(
        <circle key={blockId + outportName} className="port" cx={allBlockTypesStyling[blockType].ports.portPositions.outportPositions[outportName].x} cy={allBlockTypesStyling[blockType].ports.portPositions.outportPositions[outportName].y}
                r={allBlockTypesStyling[blockType].ports.portStyling.portRadius} style={{fill: allBlockTypesStyling[blockType].ports.portStyling.fill, stroke: allBlockTypesStyling[blockType].ports.portStyling.stroke, strokeWidth: 1.65 }}
                //onMouseDown={this.portMouseDown} onMouseUp={this.portMouseUp}
                id={this.props.blockId + outportName}
        />
      );

      portsText.push(
        <text key={blockId + outportName + "-text"} x={allBlockTypesStyling[blockType].text.textPositions[outportName].x} y={allBlockTypesStyling[blockType].text.textPositions[outportName].y}
              style={{MozUserSelect: 'none', cursor: this.props.portThatHasBeenClicked === null ? "move" : "default", fontSize:"10px", fontFamily: "Verdana"}}
        >
          {outportName}
        </text>
      )
    }

    /* Now just need to add the node name and node type text as well */
    /* Hmm, where should I get/calculate their position & height from?... */

    portsText.push([
      <text className="blockName" style={{MozUserSelect: 'none', cursor: this.props.portThatHasBeenClicked === null ? "move" : "default", textAnchor: 'middle', alignmentBaseline: 'middle', fontSize:"15px", fontFamily: "Verdana"}}
            transform="translate(32.5, 80)" >
        {blockInfo.name}
      </text>,

      <text className="blockType" style={{MozUserSelect: 'none', cursor: this.props.portThatHasBeenClicked === null ? "move" : "default", textAnchor: 'middle', alignmentBaseline: 'middle', fontSize: "8px", fontFamily: "Verdana"}}
            transform="translate(32.5, 93)" >
        {blockInfo.type}
      </text>
    ]);

    return (
      <g id={blockId + "-ports"} >
        {inports}
        {outports}
        {portsText}
      </g>

    )
  }
});

module.exports = Ports;
