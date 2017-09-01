/**
 * Created by twi18192 on 15/01/16.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import flowChartActions from "../actions/flowChartActions";
import Port from "./port";

import interact from "interactjs";
import styles from '../styles/port.scss';
import {BlockStore} from '../stores/blockStore';

export default class Ports extends Component {
constructor(props)
  {
  super(props);
  //console.log(`Ports constructor():`);
  this.portClick = this.portClick.bind(this);
  }


/**
 *  blockInfo = { type, label, name, inports, outports };
 */

componentDidMount()
  {
  interact('#invisiblePortCircle')
    .on("tap", this.portClick);

  interact('#invisiblePortCircle')
    .styleCursor(false);
  }

componentWillUnmount()
  {
  interact('#invisiblePortCircle')
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
  e.stopImmediatePropagation();
  e.stopPropagation();

  //console.log(`ports.portClick(): blockInfo = ${JSON.stringify(this.props.blockInfo)}`);

  // Wrap up target and blockInfo in passed object.

  let target;

  /* Doing the stuff to accommodate the invisiblePortCircle, instead of giving portClick
   to both portCircle and portArc
   */

  if (e.currentTarget.className.animVal === 'invisiblePortCircle')
    {
    for (let i = 0; i < e.currentTarget.parentNode.children.length; i++)
      {
      if (e.currentTarget.parentNode.children[i].className.animVal.indexOf("inport") !== -1
        || e.currentTarget.parentNode.children[i].className.animVal.indexOf("outport") !== -1)
        {
        target = e.currentTarget.parentNode.children[i];
        console.log(`ports: portClick(): invisiblePortCircle - target = ${target}`);
        break;
        // TODO: I think there should be a break here. IJG 13 feb 17
        // Otherwise i will only reference the tail value.
        }
      }
    }

  let params = {"target": target, "blockInfo": this.props.blockInfo};
  flowChartActions.passPortMouseDown(params);
  //return;

  /**
   * This is where the port click event broadcasts the PASS_PORTMOUSEDOWN custom event
   * with target (port) as the argument.
   *
   * -- comment: It's not clear why the previous developer started working at the DOM level
   * as it dissociates elements from their React containers and is then very difficult to
   * re-associate them. All updates to view components should be via props *only*.
   * IJG 13 Feb 2017
   */
  let flowChartHandle = document.getElementById("appAndDragAreaContainer");

  if (this.props.storingFirstPortClicked === null)
    {
    console.log(`ports: portClick(): this.props.storingFirstPortClicked is null, so -> flowChartActions.storingFirstPortClicked(target)`);

    /* Haven"t clicked on another port before this,
     just do an edgePreview rather than draw an edge
     */
    //let edgePreviewEvent = new CustomEvent("EdgePreview", {detail: params});
    //flowChartHandle.dispatchEvent(edgePreviewEvent);
    flowChartActions.storingFirstPortClicked(target);

    //flowChartHandle.dispatchEvent(EdgePreview);
    }
  else if (this.props.storingFirstPortClicked !== null)
    {
    console.log(`ports: portClick(): this.props.storingFirstPortClicked is NOT null, so -> flowChartHandle.dispatchEvent(twoPortClicksEvent)`);
    /* A port has been clicked before this, so
     start the checking whether the two ports
     are connectable/compatible
     */
    let twoPortClicksEvent = new CustomEvent("TwoPortClicks", {detail: {blockInfo: this.props.blockInfo}});
    flowChartHandle.dispatchEvent(twoPortClicksEvent);
    //flowChartHandle.dispatchEvent(TwoPortClicks)
    }

    // Doesn't do anything - yet. Not sure why it's here. IJG March 2017.
  if (this.props.cbClicked !== null)
    {
    console.log(`ports: portClick(): this.props.cbClicked() is specified and being called`);
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
  let arcPath = [];

  if (port === "inport")
    {
    arcPath = [
      "M", this.angleToX(-1 / 4, 4), this.angleToY(-1 / 4, 4),
      "A", 4, 4, 0, 0, 0, this.angleToX(1 / 4, 4), this.angleToY(1 / 4, 4)
    ].join(" ");
    }
  else if (port === "outport")
    {
    arcPath = [
      "M", this.angleToX(1 / 4, 4), this.angleToY(1 / 4, 4),
      "A", 4, 4, 0, 0, 0, this.angleToX(-1 / 4, 4), this.angleToY(-1 / 4, 4)
    ].join(" ");
    }
  return( arcPath );
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

  // default height to basic style.
  let outerRectHeight = blockStyling.outerRectangleHeight;
  // then if nports property is specified, calculate the ideal height.
  if (this.props.nports)
    {
      if (this.props.nports > 0)
        {
        outerRectHeight = (2*blockStyling.verticalMargin) + (this.props.nports - 1)*blockStyling.interPortSpacing;
        }
    }

  for (let i = 0; i < blockInfo.inports.length; i++)
    {
    let inportsLength          = blockInfo.inports.length;
    let inportName             = blockInfo.inports[i].name;
    let inportAndTextTransform = "translate(" + 0 + ","
      + (BlockStore.drawingParams.verticalMargin + (i * BlockStore.drawingParams.interPortSpacing)) + ")";

    let inportValueType = blockInfo.inports[i].type;
    //let portclass = classes["inport" + inportValueType];

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
        {/*className={"inport" + inportValueType}*/}
        <Port portkey={blockId + inportName}
              className={styles["inport" + inportValueType]}
              cx={0}
              cy={0}
              r={blockStyling.portRadius}
              id={blockId + inportName}
              blockName={blockId}
        />
        <Port portkey={blockId + inportName + "invisiblePortCircle"}
              className={"invisiblePortCircle"}
              cx={0}
              cy={0}
              r={blockStyling.portRadius + 2}
              style={{fill: "transparent", cursor: "default"}}
              id={blockId + inportName + "invisiblePortCircle"}
              blockName={blockId}
              cbClicked={this.portClick}
        />
        <text key={blockId + inportName + "-text"} textAnchor={"start"}
              x={5}
              y={3}
              style={{
                MozUserSelect:"none",
                WebkitUserSelect:"none",
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
      + "," + (BlockStore.drawingParams.verticalMargin + (j * BlockStore.drawingParams.interPortSpacing)) + ")";

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
        <Port portkey={blockId + outportName}
              className={styles["outport" + outportValueType]}
              cx={0}
              cy={0}
              r={blockStyling.portRadius}
              id={blockId + outportName}
              blockName={blockId}

        />
        <Port portkey={blockId + outportName + "invisiblePortCircle"}
              className={"invisiblePortCircle"}
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
                WebkitUserSelect           : 'none',
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
    <text className={"blockName"} key={blockId + "textLabel"}
          style={{
            MozUserSelect                          : "none",
            WebkitUserSelect                       : 'none',
            fill: "lightgrey",
            cursor                                 : this.props.portThatHasBeenClicked === null ? "move" : "default",
            textAnchor: "middle", alignmentBaseline: "middle",
            fontSize                               : "10px", fontFamily: "Verdana"
          }}
          transform={"translate(36, 91)"}>
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
  portThatHasBeenClicked : PropTypes.object,
  selected               : PropTypes.bool,
  storingFirstPortClicked: PropTypes.object,
  blockInfo              : PropTypes.object,
  blockId                : PropTypes.string,
  blockStyling           : PropTypes.object,
  cbClicked              : PropTypes.func,
  nports                 : PropTypes.number
};
