/**
 * Created by ig43 on 03/10/16.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

//import FontIcon from 'react-toolbox/lib/font_icon';

import FontIcon from 'react-toolbox/lib/font_icon';

import interact from 'interactjs';

//import ActionDelete from 'material-ui/svg-icons/action/delete';
//import {red500, yellow500, blue500} from 'material-ui/styles/colors';
import DropTarget from 'react-dnd/lib/DropTarget';
import ItemTypes from './dndItemTypes';

import flowChartStore from '../stores/flowChartStore';

import flowChartActions from '../actions/flowChartActions';

const iconStyles = {
  marginRight: 24,
  outerRectangleHeight: 46,
  outerRectangleWidth : 46,
  innerRectangleHeight: 40,
  innerRectangleWidth : 40,
};

/**
 * Specifies the drop target contract.
 * All methods are optional.
 */
const wastebinTarget = {
  canDrop(props, monitor) {
  // You can disallow drop based on props or item
  const item = monitor.getItem();
  //return canMakeBlockMove(item.fromPosition, props.position);
  return (true);
  },

  hover(props, monitor, component) {
  // This is fired very often and lets you perform side effects
  // in response to the hover. You can't handle enter and leave
  // here—if you need them, put monitor.isOver() into collect() so you
  // can just use componentWillReceiveProps() to handle enter/leave.

  // You can access the coordinates if you need them
  const clientOffset  = monitor.getClientOffset();
  const componentRect = ReactDOM.findDOMNode(component).getBoundingClientRect();

  // You can check whether we're over a nested drop target
  const isJustOverThisOne = monitor.isOver({shallow: true});

  // You will receive hover() even for items for which canDrop() is false
  const canDrop = monitor.canDrop();
  },

  drop(props, monitor, component) {
  if (monitor.didDrop())
    {
    // If you want, you can check whether some nested
    // target already handled drop
    return;
    }

  // Obtain the dragged item
  const item = monitor.getItem();

  // You can do something with it
  //ChessActions.movePiece(item.fromPosition, props.position);

  // You can also do nothing and return a drop result,
  // which will be available as monitor.getDropResult()
  // in the drag source's endDrag() method
  return {moved: true};
  }
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor)
  {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver           : monitor.isOver(),
    isOverCurrent    : monitor.isOver({shallow: true}),
    canDrop          : monitor.canDrop(),
    itemType         : monitor.getItemType()
  };
  }


/*
 * @class WasteBin
 * @extends React.Component
 */
class WasteBin extends React.Component {
constructor(props)
  {
  super(props);

  this._onChange = this._onChange.bind(this);

  // Mode can be either Add or Delete
  // Add is default. If a block is started to drag, then mode becomes Delete
  this.state = {mode: 'Add'};

  this.componentAdd = <FontIcon value='add' />;

  this.componentRemove = <FontIcon value='highlightOff' />;
  }

componentDidMount()
  {
  interact(ReactDOM.findDOMNode(this))
    .dropzone({
      ondrop: function (event)
        {
        flowChartActions.removeBlock(event.relatedTarget.id);
        }
    })
    .on('dropactivate', function (event)
    {
    event.target.classList.add('drop-activated');
    });

    flowChartStore.addChangeListener(this._onChange);

  }

componentWillUnmount()
  {
  /*interact(ReactDOM.findDOMNode(this))
    .on('dropdeactivate', function (event)
    {
    event.target.classList.add('drop-deactivated');
    });
*/
  }

/*
 * @method shouldComponentUpdate
 * @returns {Boolean}
 */
shouldComponentUpdate(nextProps, nextState)
  {
  // Update is mode has changed
  return (true);
  //return (this.state.mode !== nextState.mode);
  }

/**
 * getMode(): From the current state of the heldBlock in flowChartStore
 *            determine whether this component should behave as Add or Remove.
 * @return {} [description]
 */
getMode()
  {
  let heldBlock = flowChartStore.getHeldBlock();
  let mode = (heldBlock === null)?'Add':'Remove';
  return( { mode : mode} );
  }

_onChange ()
    {
    this.setState(this.getMode());
    }


/*
 * @method render
 * @returns {JSX}
 */
render()
  {
  const {canDrop, isOver, connectDropTarget} = this.props;
  const isActive                             = canDrop && isOver;

  let backgroundColor = (isActive) ? '#557B55' : '#5B423F';

  // If a block has signalled as being long-clicked, then it is held.
  // This state signals the drop target icon to change to a read Remove area.
  let tool = (this.state.mode === 'Remove') ? this.componentRemove : this.componentAdd;

  //<FontIcon value={"remove_circle"}/>;
  //{this.props.children};

  return connectDropTarget(<div>{tool}</div>);
  }
}

WasteBin.propTypes = {
  isOver           : PropTypes.bool.isRequired,
  canDrop          : PropTypes.bool.isRequired,
  draggingColor    : PropTypes.string,
  lastDroppedColor : PropTypes.string,
  connectDropTarget: PropTypes.func.isRequired,
  onDrop           : PropTypes.func.isRequired,
};


export default DropTarget(ItemTypes.BLOCK, wastebinTarget, collect)(WasteBin);
