/**
 * Created by ig43 on 03/10/16.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

//import FontIcon from 'react-toolbox/lib/font_icon';

import FontIcon from 'react-toolbox/lib/font_icon';

import interact from 'interactjs';
import flowChartStore from '../stores/flowChartStore';
import flowChartActions from '../actions/flowChartActions';
import styles from '../styles/dragdrop.css';

console.log('WasteBin: styles = ', styles);

const iconStyles = {
  marginRight         : 24,
  outerRectangleHeight: 46,
  outerRectangleWidth : 46,
  innerRectangleHeight: 40,
  innerRectangleWidth : 40,
};


const icons = {
  wastebin: <path id={styles.wbWastebin} className={styles.wbIcon}
    d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-12h-12v12zm13-15h-3.5l-1-1h-5l-1 1h-3.5v2h14v-2z">
  </path>,

  palette: <path id={styles.iconPalette}  className={styles.wbIcon}
    d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5h1.77c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-4c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3 4c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z">
  </path>
};

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
  this.state = {mode: 'Add',
                isOver: false,
                isActive: false};

  //this.componentAdd = <FontIcon value='add'/>;
  //this.componentRemove = <FontIcon value='highlightOff'/>;
  this.componentAdd    = icons.palette;
  this.componentRemove = icons.wastebin;

  }

handleChange = (field, value) => {
this.setState({...this.state, [field]: value});
};


componentDidMount()
  {
  //interact(ReactDOM.findDOMNode(this))
  interact(ReactDOM.findDOMNode(this)).dropzone({
    ondrop        : (event) =>
      {
      console.log(`WasteBin: ondrop()`);
      flowChartActions.removeBlock(event.relatedTarget.id);
      },
    // allow multiple drags on the same element
    maxPerElement: Infinity
    })
    .on ('drop', (event) =>
      {
      console.log(`WasteBin: ondrop()`);
      flowChartActions.removeBlock(event.relatedTarget.id);
      })
    .on ('dropactivate', (event) =>
      {
      console.log(`WasteBin: ondropactivate()`);
      // add active dropzone feedback
      event.target.classList.add(styles.dropActive);
      this.handleChange("isActive", true);
      })
    .on('dragenter', (event) =>
      {
      console.log(`WasteBin: ondragenter()`);
      let draggableElement = event.relatedTarget,
          dropzoneElement  = event.target;

      // feedback the possibility of a drop
      //dropzoneElement.classList.add('drop-target');
      dropzoneElement.classList.add(styles.dropTarget);
      draggableElement.classList.add(styles.canDrop);
      this.handleChange("isOver", true);
      }).
    on('dragleave', (event) =>
      {
      console.log(`WasteBin: ondragleave()`);
      // remove the drop feedback style
      event.target.classList.remove(styles.dropTarget);
      event.relatedTarget.classList.remove(styles.canDrop);
      this.handleChange("isOver", false);
      })
    .on('dropdeactivate', (event) =>
      {
      console.log(`WasteBin: ondropdeactivate()`);
      // remove active dropzone feedback
      event.target.classList.remove(styles.dropActive);
      event.target.classList.remove(styles.dropTarget);
      this.handleChange("isActive", false);
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
  //return (this.state.mode !== nextState);
  }

componentWillReceiveProps(nextProps)
  {
  }

/**
 * getMode(): From the current state of the heldBlock in flowChartStore
 *            determine whether this component should behave as Add or Remove.
 * @return {} [description]
 */
getMode()
  {
  let heldBlock = flowChartStore.getHeldBlock();
  let mode      = (heldBlock === null) ? 'Add' : 'Remove';
  return ( {mode: mode} );
  }

_onChange()
  {
  this.setState(this.getMode());
  }


/*
 * @method render
 * @returns {JSX}
 */
render()
  {
  let backgroundColor = (this.state.isActive) ? this.props.bgdActive : this.props.bgdInactive;
  let transformScale  = (this.state.isActive) ? this.props.scaleActive : this.props.scaleInactive;
  let stroke = (this.state.isOver) ? '#797979' : 'black';

  // If a block has signalled as being long-clicked, then it is held.
  // This state signals the drop target icon to change to a read Remove area.
  let tool = (this.state.mode === 'Remove') ? this.componentRemove : this.componentAdd;

  let sizeRect = {width: 25, height: 25};

  let viewBox = "0 0 "+sizeRect.width.toString()+" "+sizeRect.height.toString();
  //<FontIcon value={"remove_circle"}/>;
  //{this.props.children};
  let toolContainer =
        <svg width={this.props.width} height={this.props.height} viewBox={viewBox} preserveAspectRatio={"none"}>
          <g>
          <rect style={{fill:"transparent"}} className={styles.dropzone} id={styles.wbContainerRect} height={sizeRect.height} width={sizeRect.width}
                x={this.props.x} y={this.props.y} rx={this.props.rx} ry={this.props.ry}/>
          {tool}
            </g>
        </svg>
    ;

  //return connectDropTarget(<svg viewBox="0 0 200 200" preserveAspectRatio="xMaxYMax meet" id={'wastebin'} style={{fill:"green"}}>{tool}</svg>);
  return (toolContainer);
  //return connectDropTarget(<svg id={'wastebin'}>{icons.wastebin}</svg>);
  }
}

WasteBin.defaultProps =
{
  width        : 75,
  height       : 75,
  x            : 3,
  y            : 3,
  rx           : 6,
  ry           : 6,
  binfill      : '#f77b55',
  containerfill: 'transparent',
  bgdActive    : '#557B55',
  bgdInactive  : '#5B423F',
  scaleActive  : 1.5,
  scaleInactive: 1.0
};

WasteBin.propTypes = {
  draggingColor    : PropTypes.string,
  lastDroppedColor : PropTypes.string,
  connectDropTarget: PropTypes.func,
  onDrop           : PropTypes.func,
  width            : PropTypes.number,
  height           : PropTypes.number,
  x                : PropTypes.number,
  y                : PropTypes.number,
  rx               : PropTypes.number,
  ry               : PropTypes.number,
  binfill          : PropTypes.string,
  containerfill    : PropTypes.string,
  bgdActive        : PropTypes.string,
  bgdInactive      : PropTypes.string,
  scaleActive      : PropTypes.number,
  scaleInactive    : PropTypes.number
};


export default WasteBin;
