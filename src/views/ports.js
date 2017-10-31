/**
 * Created by twi18192 on 15/01/16.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import flowChartActions from "../actions/flowChartActions";
import Port from "./port";
import {BlockStore} from '../stores/blockStore';
import {withStyles} from 'material-ui';


const styles = theme => ({
  blockTitle: {
    textAnchor: "middle",
    dominantBaseline: "middle",
    fill: theme.palette.text.primary,
    ...theme.typography.subheading
  },
  blockDescription: {
    textAnchor: "middle",
    dominantBaseline: "middle",
    fill: theme.palette.text.secondary,
    ...theme.typography.caption
  },
  inPort: {
    dominantBaseline: "middle",
    textAnchor: "left",
    fill: theme.palette.text.primary,
    ...theme.typography.caption
  },
  outPort: {
    dominantBaseline: "middle",
    textAnchor: "end",
    fill: theme.palette.text.primary,
    ...theme.typography.caption
  },
});


class Ports extends Component {
constructor(props)
  {
  super(props);
  //console.log(`Ports constructor():`);
  this.portClick = this.portClick.bind(this);
  }

/**
 *  blockInfo = { type, label, name, inports, outports };
 */



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

render()
  {
  //console.log("render: ports");
    let {nports, classes, blockStyling, blockId, blockInfo, theme} = this.props;

  let inports   = [];
  let outports  = [];

  let outerRectHeight = 2 * blockStyling.verticalMargin + nports * blockStyling.interPortSpacing;

  for (let i = 0; i < blockInfo.inports.length; i++)
    {
    let inportName             = blockInfo.inports[i].name;
    let inportAndTextTransform = "translate(" + 0 + ","
      + (BlockStore.drawingParams.verticalMargin + (i + 0.5) * BlockStore.drawingParams.interPortSpacing) + ")";

    let inportValueType = blockInfo.inports[i].type;
    //let portclass = classes["inport" + inportValueType];

    inports.push(
      <g key={blockId + inportName + "portAndText"}
         id={blockId + inportName + "portAndText"}
         transform={inportAndTextTransform}>
        <Port portkey={blockId + inportName}
              className={"inport" + inportValueType}
              style={{fill: theme.palette.ports[inportValueType][500]}}
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
        <text x={8} y={0} className={classes.inPort}>
          {inportName}
        </text>
      </g>
    );
    }

  for (let j = 0; j < blockInfo.outports.length; j++)
    {
    let outportName             = blockInfo.outports[j].name;
    let outportAndTextTransform = "translate(" + blockStyling.outerRectangleWidth
      + "," + (BlockStore.drawingParams.verticalMargin + (j + 0.5) * BlockStore.drawingParams.interPortSpacing) + ")";

    let outportValueType = blockInfo.outports[j].type;
    outports.push(
      <g key={blockId + outportName + "portAndText"}
         id={blockId + outportName + "portAndText"}
         transform={outportAndTextTransform}>
        <Port portkey={blockId + outportName}
              className={"outport" + outportValueType}
              style={{fill: theme.palette.ports[outportValueType][500]}}
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
        <text x={-8} y={0} className={classes.outPort}>
          {outportName}
        </text>
      </g>
    );
    }

  /* Now just need to add the block name label and description */
  return (
    <g id={blockId + "-ports"}>
      {inports}
      {outports}
      <text x={blockStyling.outerRectangleWidth/2}
            y={-15} className={classes.blockTitle}>
        {blockInfo.name}
      </text>
      <text x={blockStyling.outerRectangleWidth/2}
            y={outerRectHeight + 15} className={classes.blockDescription}>
        {blockInfo.label}
      </text>
    </g>
  )
  }
}

Ports.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  portThatHasBeenClicked : PropTypes.object,
  selected               : PropTypes.bool,
  storingFirstPortClicked: PropTypes.object,
  blockInfo              : PropTypes.object,
  blockId                : PropTypes.string,
  blockStyling           : PropTypes.object,
  cbClicked              : PropTypes.func,
  nports                 : PropTypes.number
};

export default withStyles(styles, {withTheme: true})(Ports);