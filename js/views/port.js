/**
 * Created by Ian Gillingham on 10/02/17.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
//import * as ReactDOM from 'react-dom';
import styles from '../styles/port.scss';
import interact from 'interactjs';

export default class Port extends Component {
constructor(props)
  {
  super(props);
  this.portClick = this.portClick.bind(this);
  }

componentDidMount()
  {
  //console.log(`Port.componentDidMount(): blockName = ${this.props.blockName}   className = ${this.props.className}`);

  // The classname for the invisible port circles is composed of:
  // blockId + inPortName + "invisiblePortCircle"
  //if (this.props.className.indexOf("invisiblePortCircle"))
    if (this.props.className.includes("invisiblePortCircle"))
    {
    interact(this.circleNode)
      .draggable(
        {
          restrict: {
            restriction: '#appAndDragAreaContainer',
          },
          onstart : (e) =>
            {
            e.stopImmediatePropagation();
            e.stopPropagation();
            },
          onend   : (e) =>
            {
            e.stopImmediatePropagation();
            e.stopPropagation();
            }
        });

    interact(this.circleNode).on('tap', this.portClick);
    interact(this.circleNode).styleCursor(false);
    }
  }

componentWillUnmount()
  {
  interact(this.circleNode).off("tap", this.portClick);
  }

shouldComponentUpdate(nextProps, nextState)
  {
  let bRet = false;
  return (bRet);
  }

portClick(e)
  {
  //e.stopImmediatePropagation();
  //e.stopPropagation();
  console.log(`Port.portClick(): blockName = ${this.props.blockName}`);
  console.log(e);
  // Inform the parent Block object that we have been clicked.
  if ((this.props.className.indexOf("invisiblePortCircle") > -1) && (this.props.cbClicked !== null))
    {
    console.log(`Port: portClick(): classname -> invisiblePortCircle. Calling this.props.cbClicked()`);
    e.stopImmediatePropagation();
    e.stopPropagation();
    this.props.cbClicked(e);
    }
  }

render()
  {
  // Sanitise the properties being passed to the primitive <circle> element.
  let circleProps = Object.assign({}, this.props);
  delete circleProps.blockName;
  delete circleProps.portkey;
  if (circleProps.hasOwnProperty("cbClicked"))
    {
    delete circleProps.cbClicked;
    }

  return (<circle {...circleProps} key={this.props.portkey} ref={(node) => {this.circleNode = node}} />);
  }
}


Port.defaultProps = {cbClicked: null};

Port.propTypes =
{
  portkey  : PropTypes.string,
  className: PropTypes.string,
  cx       : PropTypes.number,
  cy       : PropTypes.number,
  r        : PropTypes.number,
  style    : PropTypes.object,
  id       : PropTypes.string,
  blockName: PropTypes.string,
  cbClicked: PropTypes.func
};
