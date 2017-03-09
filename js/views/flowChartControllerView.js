/**
 * Created by twi18192 on 26/01/16.
 */

let React = require('react');

let FlowChart = require('./flowChart');

//import blockStore from '../stores/blockStore.js';
import flowChartStore from '../stores/flowChartStore';


function getFlowChartState()
  {
  return {
    /**
     * TODO:
     * Tut tut - there should be only one store per component type
     * there are two here, so if either triggers an event and the other hasn't initialised,
     * we would be (and do!) attempting to set some props to undefined.
     *
     * IJG 28 Feb 2017
     *
     */
    /* blockStore */
    allBlockInfo  : flowChartStore.getAllBlockInfo(),
    blockPositions: flowChartStore.getBlockPositions(),

    /* flowChartStore */
    graphPosition          : flowChartStore.getGraphPosition(),
    graphZoomScale         : flowChartStore.getGraphZoomScale(),
    portThatHasBeenClicked : flowChartStore.getPortThatHasBeenClicked(),
    storingFirstPortClicked: flowChartStore.getStoringFirstPortClicked(),
    areAnyBlocksSelected   : flowChartStore.getIfAnyBlocksAreSelected(),
    areAnyEdgesSelected    : flowChartStore.getIfAnyEdgesAreSelected(),
    edgePreview            : flowChartStore.getEdgePreview(),
    blockStyling           : flowChartStore.getBlockStyling()
    //previousMouseCoordsOnZoom: JSON.parse(JSON.stringify(flowChartStore.getPreviousMouseCoordsOnZoom())),
  }
  }

let FlowChartControllerView = React.createClass({

  getInitialState: function ()
    {
    return getFlowChartState();
    },

  _onChange: function ()
    {
    this.setState(getFlowChartState());
    },

  componentDidMount: function ()
    {
    flowChartStore.addChangeListener(this._onChange);
    console.log(`FlowChartControllerView: NODE_ENV ${process.env.NODE_ENV}`);
    },

  componentWillUnmount: function ()
    {
    flowChartStore.removeChangeListener(this._onChange);
    },

  shouldComponentUpdate: function (nextProps, nextState)
    {
    let bRet = !Object.is(nextState, this.State);
    if (this.state.blockPositions === undefined)
      {
      bRet = false;
      console.log(`flowChartControllerView.shouldComponentUpdate(): this.state.blockPositions is undefined`);
      }
    console.log(`flowChartControllerView.shouldComponentUpdate(): return ${bRet}`);
    return (bRet);
    },

  render: function ()
    {
    let blockPositions = this.state.blockPositions;
    if (blockPositions === undefined)
      {
      console.log(`flowChartControllerView.render(): this.state.blockPositions is undefined`);
      blockPositions = {};
      }

    return (
      <FlowChart
        allBlockInfo={this.state.allBlockInfo}

        graphZoomScale={this.state.graphZoomScale}
        graphPosition={this.state.graphPosition}
        portThatHasBeenClicked={this.state.portThatHasBeenClicked}
        storingFirstPortClicked={this.state.storingFirstPortClicked}
        areAnyBlocksSelected={this.state.areAnyBlocksSelected}
        areAnyEdgesSelected={this.state.areAnyEdgesSelected}
        edgePreview={this.state.edgePreview}
        //previousMouseCoordsOnZoom={this.state.previousMouseCoordsOnZoom}
        blockStyling={this.state.blockStyling}
        blockPositions={this.state.blockPositions}
      />
    )
    }
});

module.exports = FlowChartControllerView;
