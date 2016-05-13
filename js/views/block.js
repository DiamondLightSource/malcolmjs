/**
 * Created by twi18192 on 14/01/16.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('react-dom');

var attributeStore = require('../stores/attributeStore');

var blockActions = require('../actions/blockActions.js');
var paneActions = require('../actions/paneActions');
var flowChartActions = require('../actions/flowChartActions');
var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var Ports = require('./ports.js');
var BlockRectangle = require('./blockRectangle');

var interact = require('../../node_modules/interact.js');

var Perf = require('../../node_modules/react/lib/ReactDefaultPerf.js');

var Block = React.createClass({

  componentDidMount: function(){

    var blockAttributes = attributeStore.getAllBlockAttributes()[this.props.id];

    for(var attribute in blockAttributes){
      if(attribute !== 'uptime') {
        MalcolmActionCreators.malcolmSubscribe(this.props.id, attribute);
      }
    }

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
      return (
        nextProps.blockPosition !== this.props.blockPosition ||
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
        nextProps.blockPosition !== this.props.blockPosition ||
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

  blockSelect: function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();

    Perf.stop();
    Perf.printWasted(Perf.getLastMeasurements());

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
    if(this.startDrag === null || this.startDrag === undefined){
      this.startDrag = {
        x: 0,
        y: 0
      };
    }

    this.startDrag.x += e.dx;
    this.startDrag.y += e.dy;


    var deltaMovementDebounce = {
      target: target,
      x: this.startDrag.x,
      y: this.startDrag.y
    };

    clearTimeout(this.timer);
    this.interactJsDragDebounce(deltaMovementDebounce);




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
      console.log("testing drag debounce for server write request");
      console.log(this.props.blockPosition);
      //this.handleInteractJsDrag(dragMovement)
      MalcolmActionCreators.malcolmCall(
        this.props.id, '_set_coords', {
          X_COORD: JSON.parse(JSON.stringify(this.props.blockPosition.x * this.props.graphZoomScale)),
          Y_COORD: JSON.parse(JSON.stringify(this.props.blockPosition.y * this.props.graphZoomScale))
        }
      );
      console.log(dragMovement.target);
    }.bind(this), 500
    );
  },


  render: function(){
    console.log("render: block");
    //console.log(this.props.id);
    //console.log(this.props.blockInfo);

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
          <rect id="blockBackground"
                height="105" width={this.props.blockStyling.outerRectangleWidth}
                style={{fill: 'transparent',
          cursor: this.props.portThatHasBeenClicked === null ? "move" : "default"}}/>
          /* To allow the cursor to change when hovering over the entire block container */

          <BlockRectangle blockId={this.props.id} blockType={this.props.blockInfo.type}
                          blockIconURL={this.props.blockInfo.iconURL}
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
