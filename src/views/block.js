/**
 * Created by twi18192 on 14/01/16.
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import paneActions from '../actions/paneActions';
import flowChartActions from '../actions/flowChartActions';
import Ports from './ports.js';
import BlockRectangle from './blockRectangle';
import interact from 'interactjs';
import blockCollection from '../classes/blockItems';
import paneStore from "../stores/paneStore";


class Block extends React.Component {
  constructor(props)
    {
    super(props);

    this.portClicked    = this.portClicked.bind(this);
    this.blockSelect    = this.blockSelect.bind(this);
    this.blockHold      = this.blockHold.bind(this);
    this.pointerDown    = this.pointerDown.bind(this);
    this.pointerUp      = this.pointerUp.bind(this);
    this.interactJsDrag = this.interactJsDrag.bind(this);
    }

/**
 *  blockInfo = { type, label, name, inports, outports };
 */

componentDidMount()
  {
  interact(this.g)
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
          },
        onmove  : this.interactJsDrag.bind(this),
        onend   : function (e)
          {
          e.stopImmediatePropagation();
          e.stopPropagation();
          //console.log("interactjs dragend");
          }
      });

  interact(this.g)
    .on('tap', this.blockSelect);
  interact(this.g)
    .on('hold', this.blockHold);
  interact(this.g)
    .on('down', this.pointerDown);
  interact(this.g)
    .on('up', this.pointerUp);

  interact(this.g)
    .styleCursor(false);

  /* Doesn't work quite as expected, perhaps do checks with e.dy and e.dx to check myself if  */
  //interact
  //  .pointerMoveTolerance(5);
  }

componentWillUnmount()
  {

  clearTimeout(this.timer);

  interact(this.g)
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
  if (this.props.areAnyBlocksSelected) {
    /* Need to run deselect before I select the current node */
    this.props.deselect();
  }
  flowChartActions.selectBlock(this.props.blockInfo.name);
  paneActions.openBlockTab(this.props.blockInfo.name);
  //flowChartActions.selectBlock(ReactDOM.findDOMNode(this).id);
  //paneActions.openBlockTab(ReactDOM.findDOMNode(this).id);


  if (!paneStore.getSidebarOpenState()) {
    /* Need to make sure side bar is open */
    paneActions.toggleSidebar();
  }
  }

blockHold(e)
  {
  e.preventDefault();
  e.stopImmediatePropagation();
  e.stopPropagation();

  //flowChartActions.holdBlock(this.props.blockInfo.label);
  }

/**
 * pointerDown()
 * Any time the pointer is down whilst over a block, there should be an action generated to inform the flowChartStore
 * in order to change the tool icon from + to - to show change in mode.
 * The action was originally associated with pointer 'hold' and the action is still called holdBlock for simplicity.
 * @param e
 */
pointerDown(e)
  {
    console.log(`block: ${this.props.blockInfo.name}  pointerDown`);
  flowChartActions.holdBlock(this.props.blockInfo.name);
  }
/**
  * pointerUp()
  * @param e
  * @description typically called in response to releasing the mouse button
  * Useful to signal when a HOLD event has finished.
  */
pointerUp(e)
  {
  flowChartActions.releaseBlock(this.props.blockInfo.name)
  }

interactJsDrag(e)
  {
  e.stopPropagation();
  e.stopImmediatePropagation();
  let target = this.props.blockInfo.name;

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
                     "storingFirstPortClicked", "selected", "blockPosition", "deselect", "blockIconSVG"];

  for (let i = 0; i < notGProps.length; i++)
    {
    let delProp = notGProps[i];
    delete gProps[delProp];
    }
    /*<DNDBlockSelector className={'dragBlock'}
     connectDragSource={ItemTypes.BLOCK}
     isDragging={true}
     name={this.props.id}
     key={this.props.id + 'dragBlockDND'}>
     */

     // Determine the maximum number of ports on either inputs or outputs.
     // This will allow the block height to be determined.
     //
  let nports = this.props.blockInfo.inports.length > this.props.blockInfo.outports.length ? this.props.blockInfo.inports.length : this.props.blockInfo.outports.length;


  return(
    <g className="draggable drag-drop" {...gProps} transform={blockTranslate} ref={(node) => {this.g = node}}>
      <BlockRectangle blockType={this.props.blockInfo.type}
                      blockIconURL={this.props.blockInfo.iconURL}
                      blockIconSVG={this.props.blockIconSVG}
                      selected={this.props.selected}
                      nports={nports}
                      blockStyling={this.props.blockStyling}
                      graphicsStyle={this.props.graphicsStyle} />

      <Ports blockId={this.props.id} blockInfo={this.props.blockInfo}
             portThatHasBeenClicked={this.props.portThatHasBeenClicked}
             storingFirstPortClicked={this.props.storingFirstPortClicked}
             selected={this.props.selected}
             blockStyling={this.props.blockStyling}
             cbClicked={this.portClicked}
             nports={nports}/>
    </g>
  );

  }
}


Block.propTypes =
{
  graphZoomScale         : PropTypes.number,
  blockInfo              : PropTypes.object,
  blockIconSVG           : PropTypes.string,
  areAnyBlocksSelected   : PropTypes.bool,
  portThatHasBeenClicked : PropTypes.object,
  blockStyling           : PropTypes.object,
  storingFirstPortClicked: PropTypes.object,
  id                     : PropTypes.string,
  selected               : PropTypes.bool,
  blockPosition          : PropTypes.object,
  deselect               : PropTypes.func,
  graphicsStyle          : PropTypes.string,

};


export default Block;
