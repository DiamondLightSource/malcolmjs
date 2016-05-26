/**
 * Created by twi18192 on 14/01/16.
 */

var React = require('../../node_modules/react/react');
var ReactDOM = require('react-dom');

var attributeStore = require('../stores/attributeStore');

var paneActions = require('../actions/paneActions');
var flowChartActions = require('../actions/flowChartActions');
var MalcolmActionCreators = require('../actions/MalcolmActionCreators');

var Ports = require('./ports.js');
var BlockRectangle = require('./blockRectangle');

var interact = require('../../node_modules/interact-js/interact.js');

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
          //console.log("interactjs dragstart");
        },
        onmove: this.interactJsDrag,
        onend: function(e){
          e.stopImmediatePropagation();
          e.stopPropagation();
          //console.log("interactjs dragend");
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

    clearTimeout(this.timer);

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

      return (
        nextProps.blockPosition !== this.props.blockPosition ||
        nextProps.areAnyBlocksSelected !== this.props.areAnyBlocksSelected ||
        nextProps.selected !== this.props.selected ||
        nextProps.portThatHasBeenClicked !== this.props.portThatHasBeenClicked ||
        nextProps.storingFirstPortClicked !== this.props.storingFirstPortClicked
      );
    }
  },

  handleInteractJsDrag: function(item){
    flowChartActions.interactJsDrag(item);
  },

  blockSelect: function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();

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

    clearTimeout(this.timer);
    this.interactJsDragDebounce();

    /* Need to have some code here to check if the movement
    is large enough for a drag: if so, just carry on and
    invoke the action to drag, and if not, invoke the
    node select function instead
     */

  },

  interactJsDragDebounce: function(){

    /* Currently this is saving the timer as an instance variable
    of the component (this.timer) rather than a state variable
    (this.state.timer). This is mainly because otherwise
    resetting the timer (I think) would then involve doing
    clearTimeout(this.state.timer) and directly mutating state is
    a no go in React.
    It works, but I don't think it's ideal, nor particularly
    'React-y', perhaps can make use of something like
    https://github.com/plougsgaard/react-timeout in the future
    */

    this.timer = setTimeout(function(){
      MalcolmActionCreators.malcolmCall(
        this.props.id, '_set_coords', {
          X_COORD: this.props.blockPosition.x * this.props.graphZoomScale,
          Y_COORD: this.props.blockPosition.y * this.props.graphZoomScale
        }
      );
    }.bind(this), 500
    );
  },


  render: function(){
    console.log("render: block");
    //console.log(this.props.id);
    //console.log(this.props.blockInfo);

    var blockTranslate = "translate(" + this.props.blockPosition.x + ","
      + this.props.blockPosition.y + ")";

    return (
      <g {...this.props} transform={blockTranslate}>

        <g style={{MozUserSelect: 'none'}} >

          <rect id={this.props.id + "blockBackground"}
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
