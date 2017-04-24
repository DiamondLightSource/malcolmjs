/**
 * Created by twi18192 on 14/01/16.
 */

  //let React    = require('../../node_modules/react/react');
let React    = require('react');
let ReactDOM = require('react-dom');

import attributeStore from '../stores/attributeStore';

let paneActions = require('../actions/paneActions');
import flowChartActions from '../actions/flowChartActions';
//import MalcolmActionCreators from '../actions/MalcolmActionCreators';

import Ports from './ports.js';
let BlockRectangle = require('./blockRectangle');

let interact = require('../../node_modules/interact.js');

import blockCollection from '../classes/blockItems';

class Block extends React.Component {
constructor(props)
  {
  super(props);

  this.portClicked    = this.portClicked.bind(this);
  this.blockSelect    = this.blockSelect.bind(this);
  this.interactJsDrag = this.interactJsDrag.bind(this);
  }

/**
 *  blockInfo = { type, label, name, inports, outports };
 */

componentDidMount()
  {
  // Fetch all known attributes for this block.
  // id is actually blockName at this stage.
  let blockAttributes = attributeStore.getAllBlockAttributes()[this.props.id];

  //console.log(`Block: blockAttributes  id = ${this.props.id}`);
  //console.log(blockAttributes);

  /** ToDo: This is all wrong for protocol2
   * Layout information is derived from the top-level layout schema
   * whilst block values are derived from the block subscriptions.
   * And.. whilst we are about it.. subscription requests should NOT be
   * made in a view - all data should come from the relevant store, which itself should subscribe
   * (IJG Dev 2016)
   */
  /*
   for (let attribute in blockAttributes)
   {
   if ((attribute !== 'uptime') && (attribute !== 'MRI'))
   {
   if (blockAttributes.hasOwnProperty('MRI'))
   {
   MalcolmActionCreators.malcolmSubscribe(blockAttributes.MRI, [attribute]);
   }
   }
   }
   */
  interact(ReactDOM.findDOMNode(this))
    .draggable(
      {
        restrict: {
          restriction: '#appAndDragAreaContainer',
        },
        onstart : function (e)
          {
          e.stopImmediatePropagation();
          e.stopPropagation();
          //console.log("interactjs dragstart");
          }.bind(this),
        onmove  : this.interactJsDrag.bind(this),
        onend   : function (e)
          {
          e.stopImmediatePropagation();
          e.stopPropagation();
          //console.log("interactjs dragend");
          }.bind(this)
      });

  interact(ReactDOM.findDOMNode(this))
    .on('tap', this.blockSelect);

  interact(ReactDOM.findDOMNode(this))
    .styleCursor(false);

  /* Doesn't work quite as expected, perhaps do checks with e.dy and e.dx to check myself if  */
  //interact
  //  .pointerMoveTolerance(5);
  }

componentWillUnmount()
  {

  clearTimeout(this.timer);

  interact(ReactDOM.findDOMNode(this))
    .off('tap', this.blockSelect);
  }

shouldComponentUpdate(nextProps, nextState)
  {
  let bRet = true;
  if (this.props.portThatHasBeenClicked === null)
    {
    bRet = (
      nextProps.blockPosition !== this.props.blockPosition ||
      nextProps.areAnyBlocksSelected !== this.props.areAnyBlocksSelected ||
      nextProps.selected !== this.props.selected
    )
    }
  else if (nextProps.portThatHasBeenClicked !== null ||
    this.props.portThatHasBeenClicked !== null ||
    nextProps.storingFirstPortClicked !== null ||
    this.props.storingFirstPortClicked !== null)
    {

    bRet = (
      nextProps.blockPosition !== this.props.blockPosition ||
      nextProps.areAnyBlocksSelected !== this.props.areAnyBlocksSelected ||
      nextProps.selected !== this.props.selected ||
      nextProps.portThatHasBeenClicked !== this.props.portThatHasBeenClicked ||
      nextProps.storingFirstPortClicked !== this.props.storingFirstPortClicked
    );
    }
  return (bRet);
  }

handleInteractJsDrag(item)
  {
  flowChartActions.interactJsDrag(item);
  }

blockSelect(e)
  {
  e.preventDefault();
  e.stopImmediatePropagation();
  e.stopPropagation();

  // If a port has been clicked, then we are not interested in selecting blocks

  // If a block has been selected then ensure that any previous selections are cleared first.
  if (this.props.areAnyBlocksSelected)
    {
    /* Need to run deselect before I select the current node */
    this.props.deselect();
    }
  flowChartActions.selectBlock(this.props.blockInfo.label);
  paneActions.openBlockTab(this.props.blockInfo.label);
  //flowChartActions.selectBlock(ReactDOM.findDOMNode(this).id);
  //paneActions.openBlockTab(ReactDOM.findDOMNode(this).id);
  }

interactJsDrag(e)
  {
  e.stopPropagation();
  e.stopImmediatePropagation();
  let target = this.props.blockInfo.label;

  let deltaMovement = {
    target: target,
    x     : e.dx,
    y     : e.dy
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

  }

interactJsDragDebounce()
  {

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
  let item = blockCollection.getBlockItemByName(this.props.id);

  this.timer = setTimeout(function ()
    {
    item.putXY(this.props.blockPosition.x * this.props.graphZoomScale,
      this.props.blockPosition.y * this.props.graphZoomScale);
    }.bind(this), 500);
  }

/**
 * portClicked(event)
 * A reference to this callback function is passed down to the child Port object
 * via props.
 */
portClicked(e)
  {
  }

render()
  {
  let blockTranslate = "translate(" + this.props.blockPosition.x + ","
    + this.props.blockPosition.y + ")";

  //console.log("render: block");
  //console.log(this.props.id);
  //console.log(this.props.blockInfo);


  /**
   * I dont know why this.props was being given to <g>. It caused warnings in the console output
   * due to <g> not having many of the parent (this) props.
   * We know the props specifically for this <Block> element, so should filter them out before passing
   * the remaining props to <g> via gProps.
   *
   * IJG 18 Jan 2017.
   *
   * @type {*}
   */
  const gProps    = Object.assign({}, this.props);
  const notGProps = ["graphZoomScale", "blockInfo", "areAnyBlocksSelected", "portThatHasBeenClicked", "blockStyling",
                     "storingFirstPortClicked", "selected", "blockPosition", "deselect"];

  for (let i = 0; i < notGProps.length; i++)
    {
    let delProp = notGProps[i];
    delete gProps[delProp];
    }

  return (
    <g {...gProps} transform={blockTranslate} ref="node">

      <g style={{MozUserSelect: 'none'}}>

        <rect id={this.props.id + "blockBackground"}
              height="105" width={this.props.blockStyling.outerRectangleWidth}
              style={{
                fill  : 'transparent',
                cursor: this.props.portThatHasBeenClicked === null ? "move" : "default"
              }}/>
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
               blockStyling={this.props.blockStyling}
               cbClicked={this.portClicked}/>

      </g>

    </g>
  )
  }
}


Block.propTypes =
{
  graphZoomScale         : React.PropTypes.number,
  blockInfo              : React.PropTypes.object,
  areAnyBlocksSelected   : React.PropTypes.bool,
  portThatHasBeenClicked : React.PropTypes.object,
  blockStyling           : React.PropTypes.object,
  storingFirstPortClicked: React.PropTypes.object,
  id                     : React.PropTypes.string,
  selected               : React.PropTypes.bool,
  blockPosition          : React.PropTypes.object,
  deselect               : React.PropTypes.func

};


export default Block;
