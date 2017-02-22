/**
 * Created by Ian Gillingham on 10/02/17.
 */

let React    = require("react");
let interact = require("../../node_modules/interact.js");

class Port extends React.Component {
constructor(props)
  {
  super(props);
  console.log(`Port constructor(): ${this.props.blockName}`);
  this.portClick = this.portClick.bind(this);
  }

componentDidMount()
  {
  console.log(`Port.componentDidMount(): blockName = ${this.props.blockName}   className = ${this.props.className}`);

  // The classname for the invisible port circles is composed of:
  // blockId + inPortName + "invisiblePortCircle"
  if (this.props.className.indexOf("invisiblePortCircle"))
    {
    //interact(this.props.id).on('tap', this.portClick);
    //interact(this.props.id).styleCursor(false);
    }
  }

componentWillUnmount()
  {
  interact(".invisiblePortCircle").off("tap", this.portClick);
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
    //e.stopImmediatePropagation();
    //e.stopPropagation();
    this.props.cbClicked(e);
    }
  }

render()
  {
  // Sanitise the properties being passed to the primitive <circle> element.
  let circleProps = Object.assign({}, this.props);
  delete circleProps.blockName;
  if (circleProps.hasOwnProperty("cbClicked"))
    delete circleProps.cbClicked;

  return (
    <circle {...circleProps} onClick={this.portClick}/>);
  }
}


Port.defaultProps = {cbClicked: null};

Port.propTypes =
{
  key      : React.PropTypes.string,
  className: React.PropTypes.string,
  cx       : React.PropTypes.number,
  cy       : React.PropTypes.number,
  r        : React.PropTypes.number,
  style    : React.PropTypes.object,
  id       : React.PropTypes.string,
  blockName: React.PropTypes.string,
  cbClicked: React.PropTypes.func
};


export default Port;
