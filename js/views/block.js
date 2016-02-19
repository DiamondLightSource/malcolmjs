/**
 * Created by twi18192 on 14/01/16.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');
var blockStore = require('../stores/blockStore.js');
var blockActions = require('../actions/blockActions.js');
var paneActions = require('../actions/paneActions');
var flowChartActions = require('../actions/flowChartActions');

var Ports = require('./ports.js');
var BlockRectangle = require('./blockRectangle');

var interact = require('../../node_modules/interact.js');

var Perf = require('../../node_modules/react/lib/ReactDefaultPerf.js');


var Block = React.createClass({

  componentDidMount: function(){
    //NodeStore.addChangeListener(this._onChange);

    //ReactDOM.findDOMNode(this).addEventListener('NodeSelect', this.nodeSelect);
    //this.setState({selected: NodeStore.getAnyNodeSelectedState((ReactDOM.findDOMNode(this).id))}, function(){ /* Can't put into getInitialState since the DOMNode isn't mounted yet apparently */
    //  console.log(this.props.selected);
    //
    //  console.log("A node has been mounted"); });
    //this.setState({nodePosition: NodeStore.getAnyNodePosition(ReactDOM.findDOMNode(this).id)}, function(){
    //  console.log(this.state.nodePosition);
    //});

    //interact('.node')
    //  .draggable({
    //    onmove: this.interactJsDrag
    //  });

    interact(ReactDOM.findDOMNode(this))
      .draggable({
        restrict: {
          restriction: '#appAndDragAreaContainer',
        },
        onstart: function(e){
          e.stopImmediatePropagation();
          e.stopPropagation();
          Perf.start();
          //console.log("interactjs dragstart");
        },
        onmove: this.interactJsDrag,
        onend: function(e){
          e.stopImmediatePropagation();
          e.stopPropagation();
          //console.log("interactjs dragend");
          Perf.stop();
          Perf.printWasted(Perf.getLastMeasurements());
        }
      });

    interact(ReactDOM.findDOMNode(this))
      .on('tap', this.blockSelect);

    interact(ReactDOM.findDOMNode(this))
      .styleCursor(false);

    /* Doesn't work quite as expected, perhaps do checks with e.dy and e.dx to check myself if  */
    //interact
    //  .pointerMoveTolerance(5);
  },

  componentWillUnmount: function(){
    //NodeStore.removeChangeListener(this._onChange);
    //this.interactable.unset();
    //this.interactable = null;

    interact(ReactDOM.findDOMNode(this))
      .off('tap', this.blockSelect);
  },

  shouldComponentUpdate: function(nextProps, nextState){

    if(this.props.portThatHasBeenClicked === null){
      console.log("portThatHasBeenClicked isn't anything");
      return (
        nextProps.blockPosition.x !== this.props.blockPosition.x ||
        nextProps.blockPosition.y !== this.props.blockPosition.y ||
        nextProps.areAnyBlocksSelected !== this.props.areAnyBlocksSelected ||
        nextProps.selected !== this.props.selected
      )
    }
    else if(nextProps.portThatHasBeenClicked !== null ||
            this.props.portThatHasBeenClicked !== null ||
            nextProps.storingFirstPortClicked !== null ||
            this.props.storingFirstPortClicked !== null){
      console.log("portThatHasBeenClicked is something");

      return (
        nextProps.blockPosition.x !== this.props.blockPosition.x ||
        nextProps.blockPosition.y !== this.props.blockPosition.y ||
        nextProps.areAnyBlocksSelected !== this.props.areAnyBlocksSelected ||
        nextProps.selected !== this.props.selected ||
        nextProps.portThatHasBeenClicked !== this.props.portThatHasBeenClicked ||
        nextProps.storingFirstPortClicked !== this.props.storingFirstPortClicked
      );
    }
    else{
      console.log("SOMETHING CRAY CRAY IN SHOULDCOMPONENTUPDATE");
    }
  },

  handleInteractJsDrag: function(item){
    //console.log("interactJs drag is occurring");
    flowChartActions.interactJsDrag(item);

    /* For debouncing */
    //this.startDrag = null;
  },

  //mouseOver: function(){
  //  //console.log("mouseOver");
  //  var rectangleName = this.props.id.concat("Rectangle");
  //  var test = document.getElementById(rectangleName);
  //  test.style.stroke = '#797979'
  //},

  //mouseLeave: function(){
  //  //console.log("mouseLeave");
  //  var rectangleName = this.props.id.concat("Rectangle");
  //  var test = document.getElementById(rectangleName);
  //
  //  if(this.props.selected === true){
  //    console.log("this.props.selected is true, so don't reset the border colour");
  //  }
  //  else{
  //    test.style.stroke = 'black'
  //  }
  //},

  blockSelect: function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    //console.log(this.props.id + "has been selected");
    //nodeActions.deselectAllNodes("deselect all nodes");

    /* Don't want hover stuff anymore! */

    //if(this.props.portMouseOver === true){
    //  console.log("hovering over port, so will likely want a portClick if a click occurs rather than a nodeSelect");
    //}
    //else if(this.props.portMouseOver === false){
    //  nodeActions.selectNode(ReactDOM.findDOMNode(this).id);
    //  paneActions.openNodeTab(ReactDOM.findDOMNode(this).id);
    //  console.log(this.props.selected);
    //}

    if(this.props.areAnyBlocksSelected === false){
      flowChartActions.selectBlock(ReactDOM.findDOMNode(this).id);
      paneActions.openBlockTab(ReactDOM.findDOMNode(this).id);
    }
    else{
      /* Need to run deselect before I select the current node */
      this.props.deselect();
      flowChartActions.selectBlock(ReactDOM.findDOMNode(this).id);
      paneActions.openBlockTab(ReactDOM.findDOMNode(this).id);
    }

    /* Also need something here to make the tab jump to the newly selected nod eif it is already open */



  },

  //mouseDown: function(e){
  //  console.log("TGen1 mouseDown");
  //  console.log(e.currentTarget);
  //  console.log(e.currentTarget.parentNode);
  //  nodeActions.draggedElement(e.currentTarget.parentNode);
  //},

  //portMouseDown: function(e){
  //  console.log("portMouseDown");
  //  console.log(e);
  //  nodeActions.passPortMouseDown(e.currentTarget);
  //
  //  var portMouseDownCoords = {
  //    x: e.nativeEvent.clientX,
  //    y: e.nativeEvent.clientY
  //  };
  //  this.setState({portMouseDownCoords: portMouseDownCoords});
  //  var whichPort = e.currentTarget;
  //  console.log(whichPort);
  //},
  //portMouseUp: function(e){
  //  console.log("portMouseUp");
  //  console.log(e);
  //  var portMouseUpCoords = {
  //    x: e.nativeEvent.clientX,
  //    y: e.nativeEvent.clientY
  //  };
  //  if(this.state.portMouseDownCoords.x === portMouseUpCoords.x && this.state.portMouseDownCoords.y === portMouseUpCoords.y){
  //    console.log("zero mouse movement on portMOuseDown & Up, hence invoke portClick!");
  //    this.portClick(e);
  //  }
  //  else{
  //    console.log("some other mouse movement has occured between portMouseDown & Up, so portClick won't be invoked");
  //  }
  //},
  //portClick: function(e){
  //  console.log("portClick");
  //  /* Need to either invoke an action or fire an event to cause an edge to be drawn */
  //  /* Also, best have theGraphDiamond container emit the event, not just the port or the node, since then the listener will be in theGraphDiamond to then invoke the edge create function */
  //  var theGraphDiamondHandle = document.getElementById('appAndDragAreaContainer');
  //  var passingEvent = e;
  //  if(this.state.storingFirstPortClicked === null){
  //    console.log("storingFirstPortClicked is null, so will be running just edgePreview rather than connectEdge");
  //    theGraphDiamondHandle.dispatchEvent(EdgePreview);
  //  }
  //  else if(this.state.storingFirstPortClicked !== null){
  //    console.log("a port has already been clicked before, so dispatch TwoPortClicks");
  //    theGraphDiamondHandle.dispatchEvent(TwoPortClicks)
  //  }
  //  //theGraphDiamondHandle.dispatchEvent(PortSelect);
  //},
  //portSelect: function(){
  //  console.log("portClick has occured, so a port has been selected");
  //
  //},

  interactJsDrag: function(e){
    e.stopPropagation();
    e.stopImmediatePropagation();
    var target = e.target.id;


    var deltaMovement = {
      target: target,
      x: e.dx,
      y: e.dy
    };

    this.handleInteractJsDrag(deltaMovement);

    /* For debouncing */
    //if(this.startDrag === null || this.startDrag === undefined){
    //  this.startDrag = {
    //    x: 0,
    //    y: 0
    //  };
    //}
    //
    //this.startDrag.x += e.dx;
    //this.startDrag.y += e.dy;
    //
    //
    //var deltaMovement = {
    //  target: target,
    //  x: this.startDrag.x,
    //  y: this.startDrag.y
    //};
    //
    //clearTimeout(this.timer);
    //this.interactJsDragDebounce(deltaMovement);




    /* Currently doesn't work very well, selects a node after dragging a bit... */
    /* I could save the coords of the start of the drag from onstart in interactjs and do something from there? */

    //if(Math.abs(e.dx) < 4 && Math.abs(e.dy) < 4){
    //  console.log("Not large enough movement for a drag, so just do a nodeSelect");
    //  this.nodeSelect(e);
    //}
    //else{
    //  console.log("Drag movement is large enough, so do a drag");
    //  this.handleInteractJsDrag(deltaMovement);
    //}

    /* Need to have some code here to check if the movement is large anough for a drag:
    if so, just carry on and invoke the action to drag, and if not, invoke the node select function instead
     */

    //this.handleInteractJsDrag(deltaMovement);

  },

  interactJsDragDebounce: function(dragMovement){
    //console.log("debouncing");
    this.timer = setTimeout(function(){
      //console.log("inside setTimeout");
      this.handleInteractJsDrag(dragMovement)}.bind(this), 500
    );
  },

  //differentDebounce: function(func, wait, immediate) {
  //  console.log("debouncing...");
  //  var timeout;
  //  return function() {
  //    var context = this, args = arguments;
  //    var later = function() {
  //      timeout = null;
  //      if (!immediate) func.apply(context, args);
  //    };
  //    var callNow = immediate && !timeout;
  //    clearTimeout(timeout);
  //    timeout = setTimeout(later, wait);
  //    if (callNow) func.apply(context, args);
  //  };
  //},
  //
  //debounce: function(fn, delay, dragMovement) {
  //  console.log("debouncing");
  //  console.log(fn);
  //  console.log(delay);
  //  var timer = null;
  //  return function (dragMovement) {
  //    console.log("inside returned fucntion");
  //    var context = this, args = arguments;
  //    clearTimeout(timer);
  //    timer = setTimeout(function () {
  //      fn.apply(context, args);
  //    }, delay);
  //  }(dragMovement);
  //},


  render: function(){
    console.log("render: block");
    console.log(this.props.id);

    var blockTranslate = "translate(" + this.props.blockPosition.x + "," + this.props.blockPosition.y + ")";

    return (
      <g {...this.props}
          //onMouseOver={this.mouseOver} onMouseLeave={this.mouseLeave}
                         //style={this.props.selected && this.props.areAnyBlocksSelected || !this.props.selected && !this.props.areAnyBlocksSelected ? window.NodeContainerStyle : window.nonSelectedNodeContainerStyle}
                         transform={blockTranslate}
      >

        <g style={{MozUserSelect: 'none'}}
           //onMouseDown={this.mouseDown}
        >
          <rect id="blockBackground" height="105" width="65" style={{fill: 'transparent',
          cursor: this.props.portThatHasBeenClicked === null ? "move" : "default"}}/>
          /* To allow the cursor to change when hovering over the entire block container */

          <BlockRectangle blockId={this.props.id} blockType={this.props.blockInfo.type}
                          portThatHasBeenClicked={this.props.portThatHasBeenClicked}
                          selected={this.props.selected}
                          blockStyling={this.props.blockStyling}/>

          <Ports blockId={this.props.id} blockInfo={this.props.blockInfo}
                 portThatHasBeenClicked={this.props.portThatHasBeenClicked}
                 storingFirstPortClicked={this.props.storingFirstPortClicked}
                 selected={this.props.selected}
                 blockStyling={this.props.blockStyling} />

        </g>

      </g>
    )
  }
});

module.exports = Block;

//<Port cx={inportPositions.ena.x} cy={inportPositions.ena.y} r={portStyling.portRadius} id="ena"
//      style={{fill: portStyling.fill, stroke: portStyling.stroke, 'strokeWidth': 1.65}}/>
//<Port cx={outportPositions.posn.x} cy={outportPositions.posn.y} r={portStyling.portRadius} className="posn"
//style={{fill: portStyling.fill, stroke: portStyling.stroke, 'strokeWidth': 1.65}}
//onMouseDown={this.portMouseDown} onMouseUp={this.portMouseUp} onMouseOver={this.portMouseOver} onMouseLeave={this.portMouseLeave} />

//<InportEnaText x={textPosition.ena.x} y={textPosition.ena.y} style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default"}} />
//<OutportPosnText x={textPosition.posn.x} y={textPosition.posn.y} style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default"}} />


//{inports}
//
//{outports}
//
//{portsText}

//var inports = [];
//var inportsXCoord; /* This will be used when I change the port styling obejct to not give every inport its own x coord, but instead have it higher up and give it to all of them at once */
//var outports = [];
//var outportsXCoord;
//var portsText = [];
//
//console.log(nodeInfo.inports);
//
//for(i = 0; i < nodeInfo.inports.length; i++){
//  var inportName = nodeInfo.inports[i].name;
//  console.log(allNodeTypesStyling[nodeType]);
//  inports.push(
//    <circle className={inportName} cx={allNodeTypesStyling[nodeType].ports.portPositions.inportPositions[inportName].x} cy={allNodeTypesStyling[nodeType].ports.portPositions.inportPositions[inportName].y}
//          r={allNodeTypesStyling[nodeType].ports.portStyling.portRadius} style={{fill: allNodeTypesStyling[nodeType].ports.portStyling.fill, stroke: allNodeTypesStyling[nodeType].ports.portStyling.stroke, strokeWidth: 1.65 }}
//          onMouseDown={this.portMouseDown} onMouseUp={this.portMouseUp}
//    />
//  );
//  /* Taking care of the inport text too */
//  portsText.push(
//    <text x={allNodeTypesStyling[nodeType].text.textPositions[inportName].x} y={allNodeTypesStyling[nodeType].text.textPositions[inportName].y}
//          style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default", fontSize:"10px", fontFamily: "Verdana"}}
//    >
//      {inportName}
//    </text>
//  )
//}
//
//for(j = 0; j < nodeInfo.outports.length; j++){
//  var outportName = nodeInfo.outports[j].name;
//  outports.push(
//    <circle className={outportName} cx={allNodeTypesStyling[nodeType].ports.portPositions.outportPositions[outportName].x} cy={allNodeTypesStyling[nodeType].ports.portPositions.outportPositions[outportName].y}
//          r={allNodeTypesStyling[nodeType].ports.portStyling.portRadius} style={{fill: allNodeTypesStyling[nodeType].ports.portStyling.fill, stroke: allNodeTypesStyling[nodeType].ports.portStyling.stroke, strokeWidth: 1.65 }}
//          onMouseDown={this.portMouseDown} onMouseUp={this.portMouseUp}
//    />
//  );
//  portsText.push(
//    <text x={allNodeTypesStyling[nodeType].text.textPositions[outportName].x} y={allNodeTypesStyling[nodeType].text.textPositions[outportName].y}
//          style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default", fontSize:"10px", fontFamily: "Verdana"}}
//    >
//      {outportName}
//    </text>
//  )
//}
//
///* Now just need to add the node name and node type text as well */
///* Hmm, where should I get/calculate their position & height from?... */
//
//portsText.push([
//  <text className="nodeName" style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default", textAnchor: 'middle', alignmentBaseline: 'middle', fontSize:"15px", fontFamily: "Verdana"}}
//        transform="translate(32.5, 80)" >
//    {nodeInfo.name}
//  </text>,
//
//  <text className="nodeType" style={{MozUserSelect: 'none', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default", textAnchor: 'middle', alignmentBaseline: 'middle', fontSize: "8px", fontFamily: "Verdana"}}
//        transform="translate(32.5, 93)" >
//    {nodeInfo.type}
//  </text>
//]);
//
//console.log(inports);
//console.log(outports);
//console.log(portsText);

//<rect id={rectangleName} height={allNodeTypesStyling[nodeType].rectangle.rectangleStyling.height} width={allNodeTypesStyling[nodeType].rectangle.rectangleStyling.width} x={0} y={0} rx={7} ry={7}
//      style={{fill: 'lightgrey', 'strokeWidth': 1.65, stroke: this.props.selected ? '#797979' : 'black', cursor: this.state.portThatHasBeenClicked === null ? "move" : "default"}}
//  //onClick={this.nodeClick} onDragStart={this.nodeDrag}
///>
