/**
 * Created by twi18192 on 15/01/16.
 */

let React = require("../../node_modules/react/react");

import flowChartActions from "../actions/flowChartActions";
import Port from "./port";

let interact = require("../../node_modules/interact.js");

class Ports extends React.Component {
constructor(props)
  {
  super(props);
  console.log(`Ports constructor():`);
  this.portClick = this.portClick.bind(this);
  }


/**
 *  blockInfo = { type, label, name, inports, outports };
 */

componentDidMount()
  {
/*
  interact(".invisiblePortCircle")
    .on("tap", this.portClick);

  interact(".invisiblePortCircle")
    .styleCursor(false);
*/
  }

componentWillUnmount()
  {
  interact(".invisiblePortCircle")
    .off("tap", this.portClick);
  }

shouldComponentUpdate(nextProps, nextState)
  {
  let ret = null;
  if (this.props.portThatHasBeenClicked === null)
    {
    ret = nextProps.selected !== this.props.selected;
    }
  else if ((nextProps.portThatHasBeenClicked !== null) ||
    (this.props.portThatHasBeenClicked !== null) ||
    (nextProps.storingFirstPortClicked !== null) ||
    (this.props.storingFirstPortClicked !== null))
    {
    ret = (nextProps.selected !== this.props.selected) ||
      (nextProps.portThatHasBeenClicked !== this.props.portThatHasBeenClicked) ||
      (nextProps.storingFirstPortClicked !== this.props.storingFirstPortClicked);
    }
  return (ret);
  }

portClick(e)
  {
  // IJG 14/2/17
  //e.stopImmediatePropagation();
  //e.stopPropagation();

  console.log(`ports.portClick(): blockInfo = ${JSON.stringify(this.props.blockInfo)}`);

  let target;

  /* Doing the stuff to accommodate the invisiblePortCircle, instead of giving portClick
   to both portCircle and portArc
   */

  if (e.currentTarget.className.animVal === "invisiblePortCircle")
    {
    for (let i = 0; i < e.currentTarget.parentNode.children.length; i++)
      {
      if (e.currentTarget.parentNode.children[i].className.animVal.indexOf("inport") !== -1
        || e.currentTarget.parentNode.children[i].className.animVal.indexOf("outport") !== -1)
        {
        target = e.currentTarget.parentNode.children[i];
        // TODO: I think there should be a break here. IJG 13 feb 17
        // Otherwise i will only reference the tail value.
        }
      }
    }

  /**
   * This is where the port click event broadcasts the PASS_PORTMOUSEDOWN custom event
   * with target (port) as the argument.
   *
   * -- comment: It's not clear why the previous developer started working at the DOM level
   * as it dissociates elements from their React containers and is then very difficult to
   * re-associate them.
   * IJG 13 Feb 2017
   */
  // Wrap up target and blockInfo in passed object.
  let params = {"target": target, "blockInfo": this.props.blockInfo};
  flowChartActions.passPortMouseDown(params);

  /*
  let flowChartHandle = document.getElementById("appAndDragAreaContainer");

  if (this.props.storingFirstPortClicked === null)
    {
    /!* Haven"t clicked on another port before this,
     just do an edgePreview rather than draw an edge
     *!/
    let edgePreviewEvent = new CustomEvent("EdgePreview", {detail: {blockInfo: this.props.blockInfo}});
    flowChartHandle.dispatchEvent(edgePreviewEvent);
    //flowChartHandle.dispatchEvent(EdgePreview);
    }
  else if (this.props.storingFirstPortClicked !== null)
    {
    /!* A port has been clicked before this, so
     start the checking whether the two ports
     are connectable/compatible
     *!/
    let twoPortClicksEvent = new CustomEvent("TwoPortClicks", {detail: {blockInfo: this.props.blockInfo}});
    flowChartHandle.dispatchEvent(twoPortClicksEvent);
    //flowChartHandle.dispatchEvent(TwoPortClicks)
    }
*/

  if (this.props.cbClicked !== null)
    {
    this.props.cbClicked(e);
    }
  }

/* From the-graph */

angleToX(percent, radius)
  {
  return radius * Math.cos(2 * Math.PI * percent);
  }

angleToY(percent, radius)
  {
  return radius * Math.sin(2 * Math.PI * percent);
  }

makeArcPath(port)
  {

  if (port === "inport")
    {
    return [
      "M", this.angleToX(-1 / 4, 4), this.angleToY(-1 / 4, 4),
      "A", 4, 4, 0, 0, 0, this.angleToX(1 / 4, 4), this.angleToY(1 / 4, 4)
    ].join(" ");
    }
  else if (port === "outport")
    {
    return [
      "M", this.angleToX(1 / 4, 4), this.angleToY(1 / 4, 4),
      "A", 4, 4, 0, 0, 0, this.angleToX(-1 / 4, 4), this.angleToY(-1 / 4, 4)
    ].join(" ");
    }
  }

render()
  {
  //console.log("render: ports");

  let blockId   = this.props.blockId;
  let blockInfo = this.props.blockInfo;

  let inports   = [];
  let outports  = [];
  let blockText = [];

  let blockStyling = this.props.blockStyling;

  for (let i = 0; i < blockInfo.inports.length; i++)
    {
    let inportsLength          = blockInfo.inports.length;
    let inportName             = blockInfo.inports[i].name;
    let inportAndTextTransform = "translate(" + 0 + ","
      + blockStyling.outerRectangleHeight / (inportsLength + 1) * (i + 1) + ")";

    let inportValueType = blockInfo.inports[i].type;

    inports.push(
      <g key={blockId + inportName + "portAndText"}
         id={blockId + inportName + "portAndText"}
         transform={inportAndTextTransform}>
        <path key={blockId + inportName + "-arc"}
              d={this.makeArcPath("inport")} className="portArc"
              style={{
                fill  : this.props.selected ? "#797979" : "black",
                cursor: "default"
              }}/>
        <Port key={blockId + inportName}
              className={"inport" + (inportValueType === "pos" ? "POS" : "BIT")}
              cx={0}
              cy={0}
              r={blockStyling.portRadius}
              style={{cursor: "default"}}
              id={blockId + inportName}
              blockName={blockId}
        />
        <Port key={blockId + inportName + "invisiblePortCircle"}
              className="invisiblePortCircle"
              cx={0}
              cy={0}
              r={blockStyling.portRadius + 2}
              style={{fill: "transparent", cursor: "default"}}
              id={blockId + inportName + "invisiblePortCircle"}
              blockName={blockId}
              cbClicked={this.portClick}
        />
        <text key={blockId + inportName + "-text"} textAnchor="start"
              x={5}
              y={3}
              style={{
                MozUserSelect              : "none",
                cursor                     : this.props.portThatHasBeenClicked === null ? "move" : "default",
                fontSize: "7px", fontFamily: "Verdana"
              }}
        >
          {inportName}
        </text>
      </g>
    );
    }

  for (let j = 0; j < blockInfo.outports.length; j++)
    {
    let outportsLength          = blockInfo.outports.length;
    let outportName             = blockInfo.outports[j].name;
    let outportAndTextTransform = "translate(" + blockStyling.outerRectangleWidth
      + "," + blockStyling.outerRectangleHeight / (outportsLength + 1) * (j + 1) + ")";

    let outportValueType = blockInfo.outports[j].type;

    outports.push(
      <g key={blockId + outportName + "portAndText"}
         id={blockId + outportName + "portAndText"}
         transform={outportAndTextTransform}>
        <path key={blockId + outportName + "-arc"}
              d={this.makeArcPath("outport")} className="portArc"
              style={{
                fill  : this.props.selected ? "#797979" : "black",
                cursor: "default"
              }}/>
        <Port key={blockId + outportName}
              className={"outport" + (outportValueType === "pos" ? "POS" : "BIT")}
              cx={0}
              cy={0}
              r={blockStyling.portRadius}
              style={{cursor: "default"}}
              id={blockId + outportName}
              blockName={blockId}

        />
        <Port key={blockId + outportName + "invisiblePortCircle"}
              className="invisiblePortCircle"
              cx={0}
              cy={0}
              r={blockStyling.portRadius + 2}
              style={{fill: "transparent", cursor: "default"}}
              id={blockId + outportName + "invisiblePortCircle"}
              blockName={blockId}
              cbClicked={this.portClick}
        />
        <text key={blockId + outportName + "-text"} textAnchor="end"
              x={-5}
              y={3}
              style={{
                MozUserSelect              : "none",
                cursor                     : this.props.portThatHasBeenClicked === null ? "move" : "default",
                fontSize: "7px", fontFamily: "Verdana"
              }}
        >
          {outportName}
        </text>
      </g>
    );
    }

  /* Now just need to add the block name text */

  blockText.push(
    <text className="blockName" key={blockId + "textLabel"}
          style={{
            MozUserSelect                          : "none", fill: "lightgrey",
            cursor                                 : this.props.portThatHasBeenClicked === null ? "move" : "default",
            textAnchor: "middle", alignmentBaseline: "middle",
            fontSize                               : "10px", fontFamily: "Verdana"
          }}
          transform="translate(36, 91)">
      {blockInfo.label}
    </text>
  );

  return (
    <g id={blockId + "-ports"}>
      <g id={blockId + "-inports"}>
        {inports}
      </g>
      <g id={blockId + "-outports"}>
        {outports}
      </g>
      {blockText}
    </g>
  )
  }
}

Ports.propTypes = {
  portThatHasBeenClicked : React.PropTypes.object,
  selected               : React.PropTypes.bool,
  storingFirstPortClicked: React.PropTypes.object,
  blockInfo              : React.PropTypes.object,
  blockId                : React.PropTypes.string,
  blockStyling           : React.PropTypes.object,
  cbClicked              : React.PropTypes.func
};

export default Ports;
