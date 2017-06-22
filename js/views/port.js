/**
 * Created by Ian Gillingham on 10/02/17.
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import * as ReactDOM from 'react-dom';

//let React    = require("react");
import interact from "../../node_modules/interact.js";

export default class Port extends React.Component {
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
            }.bind(this),
          onend   : function (e)
            {
            e.stopImmediatePropagation();
            e.stopPropagation();
            }.bind(this)
        });

    interact(ReactDOM.findDOMNode(this)).on('tap', this.portClick);
    interact(ReactDOM.findDOMNode(this)).styleCursor(false);
    }
  }

componentWillUnmount()
  {
  interact(ReactDOM.findDOMNode(this)).off("tap", this.portClick);
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
  if (circleProps.hasOwnProperty("cbClicked"))
    {
    delete circleProps.cbClicked;
    }

  return (<circle {...circleProps} />);
  }
}


Port.defaultProps = {cbClicked: null};

Port.propTypes =
{
  key      : PropTypes.string,
  className: PropTypes.string,
  cx       : PropTypes.number,
  cy       : PropTypes.number,
  r        : PropTypes.number,
  style    : PropTypes.object,
  id       : PropTypes.string,
  blockName: PropTypes.string,
  cbClicked: PropTypes.func
};


