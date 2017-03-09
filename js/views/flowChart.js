/**
 * Created by twi18192 on 10/12/15.
 */

let React    = require('react');

import MalcolmActionCreators from '../actions/MalcolmActionCreators';
import flowChartStore from '../stores/flowChartStore';
import flowChartActions from '../actions/flowChartActions';

let Edge        = require('./edge');
let EdgePreview = require('./edgePreview');
import Block from './block';

let interact = require('../../node_modules/interact.js');

import blockCollection from '../classes/blockItems';

let AppContainerStyle = {
  "height": "100%",
  "width" : "100%",
  //'backgroundColor': "green"
};

let moduleDebug = false;

let FlowChart = React.createClass({

  propTypes: {
    graphPosition          : React.PropTypes.object,
    graphZoomScale         : React.PropTypes.number,
    allBlockInfo           : React.PropTypes.object,
    areAnyBlocksSelected   : React.PropTypes.bool,
    areAnyEdgesSelected    : React.PropTypes.bool,
    portThatHasBeenClicked : React.PropTypes.object,
    blockStyling           : React.PropTypes.object,
    blockPositions         : React.PropTypes.object,
    storingFirstPortClicked: React.PropTypes.object,
    edgePreview            : React.PropTypes.object
  },

  componentDidMount   : function ()
    {
    /**
     * Add listeners to CustomEvent broadcasters in ports.js portClick(e).
     */
    this.refs.node.addEventListener('EdgePreview', this.addEdgePreview);
    this.refs.node.addEventListener('EdgePreview', this.portSelectHighlight);
    this.refs.node.addEventListener('TwoPortClicks', this.checkBothClickedPorts);

    interact('#dragArea')
      .on('tap', this.deselect);

    interact('#dragArea')
      .draggable({
        onstart: function (e)
          {
          e.stopImmediatePropagation();
          e.stopPropagation();
          //console.log("drag start");

          },
        onmove : this.interactJsDragPan,
        onend  : function (e)
          {
          e.stopImmediatePropagation();
          e.stopPropagation();
          //console.log("drag end");
          }
      })
      .gesturable({
        onmove: this.interactJsPinchZoom
      });

    interact('#dragArea')
      .styleCursor(false);
    },
  componentWillUnmount: function ()
    {

    this.refs.node.removeEventListener('EdgePreview', this.addEdgePreview);
    this.refs.node.removeEventListener('EdgePreview', this.portSelectHighlight);
    this.refs.node.removeEventListener('TwoPortClicks', this.checkBothClickedPorts);

    interact('#dragArea')
      .off('tap', this.deselect);
    },

  deselect: function (e)
    {
    flowChartActions.deselectAllBlocks("deselect all blocks");
    flowChartActions.deselectAllEdges("deselect all edges");

    if (this.props.portThatHasBeenClicked !== null)
      {
      this.portDeselectRemoveHighlight();
      flowChartActions.deselectAllPorts("deselect all ports");
      this.resetPortClickStorage();
      flowChartActions.addEdgePreview(null);
      }

    },

  wheelZoom: function (e)
    {

    /* This wheelZoom function in its current state is incomplete:
     it works well, but it can be seen that the zoom doesn't zoom
     in on the cursor perfectly, whatever your cursor is hovering
     over appears to move slightly
     */

    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    let currentZoomScale      = this.props.graphZoomScale;
    let currentGraphPositionX = this.props.graphPosition.x;
    let currentGraphPositionY = this.props.graphPosition.y;

    let ZOOM_STEP     = 0.05;
    let zoomDirection = (this.isZoomNegative(e.nativeEvent.deltaY) ? 'up' : 'down');

    let newZoomScale;

    if (zoomDirection === 'up')
      {
      newZoomScale = this.props.graphZoomScale + ZOOM_STEP;
      }
    else
      {
      newZoomScale = this.props.graphZoomScale - ZOOM_STEP;
      }

    let scaleDelta = 1 + (newZoomScale - currentZoomScale);
    let scale      = scaleDelta * currentZoomScale;

    let mouseOnZoomX = e.nativeEvent.clientX;
    let mouseOnZoomY = e.nativeEvent.clientY;

    let newGraphPositionX = scaleDelta * (currentGraphPositionX - mouseOnZoomX)
      + mouseOnZoomX;
    let newGraphPositionY = scaleDelta * (currentGraphPositionY - mouseOnZoomY)
      + mouseOnZoomY;

    let newGraphPosition = {
      x: newGraphPositionX,
      y: newGraphPositionY
    };

    flowChartActions.graphZoom(scale);
    flowChartActions.changeGraphPosition(newGraphPosition);

    },

  isZoomNegative: function (n)
    {
    return ((n = +n) || 1 / n) < 0;
    },

  /**
   * addEdgePreview()
   *
   * This event driven callback does not have any direct rendering function in flowChart.
   * Its sole purpose is to construct an edgePreviewInfo object and call
   * flowChartActions.addEdgePreview(edgePreviewInfo), which then trigger flowChartStore
   * to update its edgePreview object, followed by emitting a change event.
   *
   * ?? Would this be better to reside within the flowChartStore ??
   * IJG 17 Feb 17
   *
   * @param eventdata
   */
  addEdgePreview: function (eventdata)
    {
    let blockInfo = eventdata.detail.blockInfo;

    console.log('flowChart: blockInfo :');
    console.log(blockInfo);

    let clickedPort = document.getElementById(this.props.portThatHasBeenClicked.id);

    // AGHHHHHHHHH!!!!!! Yuck... :(
    //let fromBlockId = clickedPort.parentNode.parentNode.parentNode.parentNode.parentNode.id;

    let fromBlockId = blockInfo.name;

    console.log(`flowChart: addEdgePreview() : clickedPort = ${clickedPort}    fromBlockId = ${fromBlockId}`);

    let portStringSliceIndex = fromBlockId.length;
    let portName             = document.getElementById(this.props.portThatHasBeenClicked.id).id.slice(portStringSliceIndex);
    let fromBlockType        = blockInfo.type;

    /* Slightly confusing since the end of the edge is the same as the start
     of the edge at the very beginning of an edgePreview, but this is only to
     do the initial render, this'll be updated by interactJSMouseMoveForEdgePreview()
     in edgePreview.js
     */

    let endOfEdgePortOffsetX;
    let endOfEdgePortOffsetY;
    let portType;

    if (document.getElementById(this.props.portThatHasBeenClicked.id).className.baseVal.indexOf('inport') !== -1)
      {

      let inportArrayLength = this.props.allBlockInfo[fromBlockId].inports.length;
      let inportArrayIndex;
      for (let j = 0; j < inportArrayLength; j++)
        {
        if (this.props.allBlockInfo[fromBlockId].inports[j].name === portName)
          {
          inportArrayIndex = JSON.parse(JSON.stringify(j));
          }
        }
      endOfEdgePortOffsetX = 0;
      endOfEdgePortOffsetY = this.props.blockStyling.outerRectangleHeight / (inportArrayLength + 1) * (inportArrayIndex + 1);
      portType             = "inport";
      }
    else if (document.getElementById(this.props.portThatHasBeenClicked.id).className.baseVal.indexOf('outport') !== -1)
      {

      let outportArrayLength = this.props.allBlockInfo[fromBlockId].outports.length;
      let outportArrayIndex;

      for (let i = 0; i < outportArrayLength; i++)
        {
        if (this.props.allBlockInfo[fromBlockId].outports[i].name === portName)
          {
          outportArrayIndex = JSON.parse(JSON.stringify(i));
          }
        }

      endOfEdgePortOffsetX = this.props.blockStyling.outerRectangleWidth;
      endOfEdgePortOffsetY = this.props.blockStyling.outerRectangleHeight / (outportArrayLength + 1) * (outportArrayIndex + 1);
      portType             = "outport";
      }
    let endOfEdgeX = this.props.blockPositions[fromBlockId].x + endOfEdgePortOffsetX;
    let endOfEdgeY = this.props.blockPositions[fromBlockId].y + endOfEdgePortOffsetY;

    let edgePreviewInfo = {
      fromBlockInfo : {
        fromBlock        : fromBlockId,
        fromBlockType    : fromBlockType,
        fromBlockPort    : portName,
        fromBlockPortType: portType
      },
      /* At the very start this'll be the same as the fromBlockPort position,
       then I'll update it with interactJSMouseMoveForEdgePreview() in edgePreview.js */
      endpointCoords: {
        x: endOfEdgeX,
        y: endOfEdgeY
      }
    };

    flowChartActions.addEdgePreview(edgePreviewInfo);
    },

  portSelectHighlight: function (eventdata)
    {
    let blockInfo = eventdata.detail.blockInfo;
    flowChartActions.storingFirstPortClicked(this.props.portThatHasBeenClicked);
    },

  portDeselectRemoveHighlight: function ()
    {
    this.resetPortClickStorage();
    flowChartActions.addEdgePreview(null);
    },

  checkBothClickedPorts: function (eventdata)
    {
    /* This function will run whenever we have dispatched a PortSelect event */
    let blockInfo = eventdata.detail.blockInfo;

    let firstPort  = document.getElementById(this.props.storingFirstPortClicked.id);
    let secondPort = document.getElementById(this.props.portThatHasBeenClicked.id);

    console.log(`flowChart: checkBothClickedPorts() : firstPort = ${firstPort}    secondPort = ${secondPort}`);

    /* The excessive use of .parentNode is to walk up
     the DOM tree and find the id of the block that the
     port belongs to, not the best way I'm sure...
     */

    /* Trying to use id instead of class to then allow class for interactjs use */
    /* Need the length of the name of the node, then slice the firstPort id string
     until the end of the node name length */

    let firstPortStringSliceIndex = firstPort.parentNode.parentNode.parentNode
      .parentNode.parentNode.id.length;
    let firstPortName             = firstPort.id.slice(firstPortStringSliceIndex);

    let secondPortStringSliceIndex = secondPort.parentNode.parentNode.parentNode
      .parentNode.parentNode.id.length;
    let secondPortName             = secondPort.id.slice(secondPortStringSliceIndex);


    if (firstPort.parentNode.parentNode.parentNode.parentNode.parentNode.id ===
      secondPort.parentNode.parentNode.parentNode.parentNode.parentNode.id &&
      firstPort.id === secondPort.id)
      {
      }
    else
      {
      let edge = {
        fromBlock    : firstPort.parentNode.parentNode.parentNode.parentNode.parentNode.id,
        fromBlockPort: firstPortName,
        toBlock      : secondPort.parentNode.parentNode.parentNode.parentNode.parentNode.id,
        toBlockPort  : secondPortName
      };
      this.checkPortCompatibility(edge);
      }

    },

  checkPortCompatibility: function (edgeInfo)
    {
    /* First need to check we have an inport and an outport */
    /* Find both port types, then compare them somehow */

    let fromBlockPortType;
    let toBlockPortType;

    let fromBlockType = this.props.allBlockInfo[edgeInfo.fromBlock].type;
    let toBlockType   = this.props.allBlockInfo[edgeInfo.toBlock].type;

    console.log(`flowChart: checkPortCompatibility() : fromBlockType = ${fromBlockType}    toBlockType = ${toBlockType}`);

    /* Remember, this is BEFORE any swapping occurs, but be
     aware that these may have to swap later on
     */
    let blockTypes = {
      fromBlockType: fromBlockType,
      toBlockType  : toBlockType
    };

    if (document.getElementById(this.props.storingFirstPortClicked.id).parentNode
        .transform.animVal[0].matrix.e === 0)
      {
      //console.log("it's an inport, since the port's x value is zero!");
      fromBlockPortType = "inport";
      }
    else
      {
      fromBlockPortType = "outport";
      }

    if (document.getElementById(this.props.portThatHasBeenClicked.id).parentNode
        .transform.animVal[0].matrix.e === 0)
      {
      toBlockPortType = "inport";
      }
    else
      {
      toBlockPortType = "outport";
      }

    /* Note that the inportIndex is used to then look in allBlockInfo
     and check if the selected inport is already conencted or not
     */

    let inportIndex;

    for (let i = 0; i < this.props.allBlockInfo[edgeInfo.fromBlock].inports.length; i++)
      {
      if (this.props.allBlockInfo[edgeInfo.fromBlock].inports[i].name === edgeInfo.fromBlockPort)
        {
        inportIndex = i;
        break;
        }
      }

    for (let j = 0; j < this.props.allBlockInfo[edgeInfo.toBlock].inports.length; j++)
      {
      if (this.props.allBlockInfo[edgeInfo.toBlock].inports[j].name === edgeInfo.toBlockPort)
        {
        inportIndex = j;
        break;
        }
      }

    let portTypes = {
      fromBlockPortType: fromBlockPortType,
      toBlockPortType  : toBlockPortType
    };

    let types = {
      blockTypes: blockTypes,
      portTypes : portTypes
    };

    /* Time to compare the fromNodePortType and toNodePortType */

    if (fromBlockPortType === toBlockPortType)
      {
      window.alert("Incompatible ports, they are both " + fromBlockPortType + "s.");
      this.resetPortClickStorage();
      flowChartActions.addEdgePreview(null);
      }
    else if (fromBlockPortType !== toBlockPortType)
      {

      if (fromBlockPortType === "inport")
        {
        this.isInportConnected(edgeInfo.fromBlockPort, inportIndex, edgeInfo.fromBlock, edgeInfo, types);
        }
      else if (toBlockPortType === "inport")
        {
        this.isInportConnected(edgeInfo.toBlockPort, inportIndex, edgeInfo.toBlock, edgeInfo, types);
        }

      }

    },

  isInportConnected: function (inport, inportIndex, block, edgeInfo, types)
    {
    if (this.props.allBlockInfo[block].inports[inportIndex].connected === true)
      {
      window.alert("The inport " + inport + " of the block " + block +
        " is already connected, so another connection cannot be made");

      this.resetPortClickStorage();
      flowChartActions.addEdgePreview(null);
      }
    else if (this.props.allBlockInfo[block].inports[inportIndex].connected === false)
      {

      /* Now check if the port value types are compatible (ie, if they're the same) */

      let startBlock;
      let startBlockPort;
      let endBlock;
      let endBlockPort;
      let fromPortValueType;
      let toPortValueType;

      /* For the malcolmCall that updates the dropdown menu list
       specifying what port the block's inport is connected to */
      let inportBlock;

      if (types.portTypes.fromBlockPortType === 'outport')
        {

        startBlock     = edgeInfo.fromBlock;
        startBlockPort = edgeInfo.fromBlockPort;
        endBlock       = edgeInfo.toBlock;
        endBlockPort   = edgeInfo.toBlockPort;

        /* Now to loop through the specific port's tags to find
         out what type it is (ie, pos, bit etc)
         */

        /* We know that the toBlockPortType is an inport,
         so then we can check their port VALUE types accordingly */
        for (let i = 0; i < this.props.allBlockInfo[edgeInfo.fromBlock].outports.length; i++)
          {
          if (this.props.allBlockInfo[edgeInfo.fromBlock].outports[i].name === edgeInfo.fromBlockPort)
            {
            fromPortValueType = this.props.allBlockInfo[edgeInfo.fromBlock].outports[i].type;
            }
          }

        for (let j = 0; j < this.props.allBlockInfo[edgeInfo.toBlock].inports.length; j++)
          {
          if (this.props.allBlockInfo[edgeInfo.toBlock].inports[j].name === edgeInfo.toBlockPort)
            {
            toPortValueType = this.props.allBlockInfo[edgeInfo.toBlock].inports[j].type;
            }
          }
        }
      else if (types.portTypes.fromBlockPortType === 'inport')
        {

        /* Note that you must also flip the ports too! */
        startBlock     = edgeInfo.toBlock;
        startBlockPort = edgeInfo.toBlockPort;
        endBlock       = edgeInfo.fromBlock;
        endBlockPort   = edgeInfo.fromBlockPort;

        }

      if (fromPortValueType === toPortValueType)
        {
        /* Proceed with the connection as we have compatible port value types */

        /* Create new edges by sending a malcolmCall */

        inportBlock = endBlock;
        /* the 'method' argument */
        let newDropdownValue = startBlock + "." + startBlockPort;
        /* the 'args' argument */
        let argsObject           = {};
        argsObject[endBlockPort] = newDropdownValue;

        /**
         * TODO: Modify for Protocol 2
         *      Must be of the form:
         *      {"typeid":"malcolm:core/Put:1.0","id":0,"endpoint":["P-FMC","outPwrOn","value"],"value":"Off"}
         */
        let item = blockCollection.getBlockItemByName(inportBlock);
        if (item !== null)
          {
          let mri = item.mri();
          let endpoint = [mri, endBlockPort, "value"];
          let newValue = newDropdownValue.toUpperCase();
          MalcolmActionCreators.malcolmPut(inportBlock, endpoint, newValue);
          //MalcolmActionCreators.malcolmCall(inportBlock, inputFieldSetMethod, argsObject);
          }

        this.resetPortClickStorage();

        /* Can now safely delete the edgePreview by setting it back to null */
        flowChartActions.addEdgePreview(null);
        }
      else if (fromPortValueType !== toPortValueType)
        {
        window.alert("Incompatible port value types: the port " +
          edgeInfo.fromBlockPort.toUpperCase() + " in " + edgeInfo.fromBlock.toUpperCase() +
          " has value type " + fromPortValueType.toUpperCase() + ", whilst the port " +
          edgeInfo.toBlockPort.toUpperCase() + " in " + edgeInfo.toBlock.toUpperCase() +
          " has value type " + toPortValueType.toUpperCase() + ".");

        /* Do all the resetting jazz */

        this.resetPortClickStorage();

        flowChartActions.addEdgePreview(null);
        }

      }
    },

  failedPortConnection: function ()
    {
    this.resetPortClickStorage();
    document.getElementById('dragArea').style.cursor = 'default';
    flowChartActions.addEdgePreview(null);
    },

  resetPortClickStorage: function ()
    {
    /* The same as what I would expect a portDeselect function to do I think */
    flowChartActions.storingFirstPortClicked(null);
    flowChartActions.passPortMouseDown(null);
    },

  interactJsDragPan: function (e)
    {
    e.stopImmediatePropagation();
    e.stopPropagation();

    let xChange = this.props.graphPosition.x + e.dx;
    let yChange = this.props.graphPosition.y + e.dy;

    flowChartActions.changeGraphPosition({
      x: xChange,
      y: yChange
    });

    if (this.props.edgePreview !== null)
      {
      flowChartActions.updateEdgePreviewEndpoint({
        x: -e.dx,
        y: -e.dy
      })
      }
    },

  interactJsPinchZoom: function (e)
    {
    e.stopImmediatePropagation();
    e.stopPropagation();

    let currentZoomScale = this.props.graphZoomScale;
    let newZoomScale     = currentZoomScale + e.ds;

    let scaleDelta = 1 + (newZoomScale - currentZoomScale);

    //let scale = scaleDelta * currentZoomScale;

    let pinchZoomX = e.clientX;
    let pinchZoomY = e.clientY;

    let newGraphPositionX = scaleDelta * (this.props.graphPosition.x - pinchZoomX) + pinchZoomX;
    let newGraphPositionY = scaleDelta * (this.props.graphPosition.y - pinchZoomY) + pinchZoomY;

    let newGraphPosition = {
      x: newGraphPositionX,
      y: newGraphPositionY
    };

    flowChartActions.graphZoom(newZoomScale);
    flowChartActions.changeGraphPosition(newGraphPosition);
    },

  generateEdgePreview: function ()
    {

    let edgePreview = [];

    if (this.props.edgePreview !== null)
      {
      /* Render the edgePreview component! */

      let edgePreviewLabel = this.props.edgePreview.fromBlockInfo.fromBlock +
        this.props.edgePreview.fromBlockInfo.fromBlockPort + "-preview";

      edgePreview.push(
        <EdgePreview key={edgePreviewLabel} id={edgePreviewLabel}
                     interactJsDragPan={this.interactJsDragPan}
                     failedPortConnection={this.failedPortConnection}
                     edgePreview={this.props.edgePreview}
                     fromBlockPosition={this.props.blockPositions[this.props.edgePreview.fromBlockInfo.fromBlock]}
                     fromBlockInfo={this.props.allBlockInfo[this.props.edgePreview.fromBlockInfo.fromBlock]}
                     blockStyling={this.props.blockStyling}
        />
      )
      }

    return edgePreview;

    },


  render: function ()
    {
    //console.log("render: flowChart");

    let x               = this.props.graphPosition.x;
    let y               = this.props.graphPosition.y;
    let scale           = this.props.graphZoomScale;
    let matrixTransform = "matrix(" + scale + ",0,0," + scale + "," + x + "," + y + ")";

    let blocks = [];
    let edges  = [];
    /**
     *  allBlockInfo[] = { type, label, name, inports, outports };
     */

    for (let blockName in this.props.allBlockInfo) // this returns just the string name of each block object.
      {
      let blockInfo = this.props.allBlockInfo[blockName];
      if (this.props.allBlockInfo.hasOwnProperty(blockName))
        {
        //let blockInfo = this.props.allBlockInfo[blockName];
        //for(let blockindex = 0; blockindex < this.props.allBlockInfo.length; blockindex++)
        //let block = this.props.allBlockInfo[blockindex];
        if (moduleDebug)
          {
            console.log(`flowChart.render(): blockName ${blockName}   Position: X: ${this.props.blockPositions[blockName].x}  y: ${this.props.blockPositions[blockName].y}`);
          }

        blocks.push(
          <Block key={blockInfo.name} id={blockInfo.name} className="block"
                 blockInfo={blockInfo}
                 areAnyBlocksSelected={this.props.areAnyBlocksSelected}
                 portThatHasBeenClicked={this.props.portThatHasBeenClicked}
                 storingFirstPortClicked={this.props.storingFirstPortClicked}
            //portMouseOver={this.props.portMouseOver}
                 selected={flowChartStore.getAnyBlockSelectedState(blockName)}
                 deselect={this.deselect}
                 blockStyling={this.props.blockStyling}
                 blockPosition={this.props.blockPositions[blockName]}
                 graphZoomScale={this.props.graphZoomScale}
            //onMouseDown={this.mouseDownSelectElement}  onMouseUp={this.mouseUp}
          />
        );

        for (let i = 0; i < this.props.allBlockInfo[blockName].inports.length; i++)
          {
          if (this.props.allBlockInfo[blockName].inports[i].connected === true &&
            this.props.allBlockInfo[this.props.allBlockInfo[blockName].inports[i].connectedTo.block] !== undefined)
            {

            let toBlock     = blockName;
            let toBlockType = this.props.allBlockInfo[blockName].type;
            let toBlockPort = this.props.allBlockInfo[blockName].inports[i].name;

            let fromBlock              = this.props.allBlockInfo[blockName].inports[i].connectedTo.block;
            let fromBlockType          = this.props.allBlockInfo[fromBlock].type;
            let fromBlockPort          = this.props.allBlockInfo[blockName].inports[i].connectedTo.port;
            let fromBlockPortValueType = this.props.allBlockInfo[blockName].inports[i].type;

            /* Only one of fromBlockPortValueType and toBlockPortValue type
             is needed, since if they are connected they SHOULD have the same type
             */

            let edgeLabel = String(fromBlock) + String(fromBlockPort) + String(toBlock) + String(toBlockPort);

            edges.push(
              <Edge key={edgeLabel} id={edgeLabel}
                    fromBlock={fromBlock} fromBlockType={fromBlockType}
                    fromBlockPort={fromBlockPort} fromBlockPortValueType={fromBlockPortValueType}
                    fromBlockPosition={this.props.blockPositions[fromBlock]}
                    toBlock={toBlock} toBlockType={toBlockType}
                    toBlockPort={toBlockPort} toBlockPosition={this.props.blockPositions[toBlock]}
                    fromBlockInfo={this.props.allBlockInfo[fromBlock]}
                    toBlockInfo={this.props.allBlockInfo[toBlock]}
                    areAnyEdgesSelected={this.props.areAnyEdgesSelected}
                    selected={flowChartStore.getIfEdgeIsSelected(edgeLabel)}
                    inportArrayIndex={i}
                    inportArrayLength={this.props.allBlockInfo[blockName].inports.length}
                    blockStyling={this.props.blockStyling}
              />
            )
            }
          }

        }
      }

      return (
        <svg id="appAndDragAreaContainer" height="100%" width="100%"
             style={AppContainerStyle} ref="node">

          <rect id="dragArea" height="100%" width="100%"
                fill="transparent" style={{MozUserSelect: 'none'}}
              onWheel={this.wheelZoom}/>

          <svg id="appContainer" style={AppContainerStyle}>

            {this.props.blockPositions ? (
            <g id="panningGroup"
               transform={matrixTransform}
             onWheel={this.wheelZoom}>

              <g id="EdgesGroup">
                {edges}
              {this.generateEdgePreview()}
              </g>

              <g id="BlocksGroup">
                {blocks}
              </g>

            </g>

              ) : (<div> Waiting for block positions... </div>)}
          </svg>

          </svg>

    )
    }
});

module.exports = FlowChart;

