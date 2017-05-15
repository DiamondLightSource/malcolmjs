/**
 * Created by twi18192 on 26/01/16.
 */

import * as React from 'react';
import FlowChart from './flowChart';
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
    blockStyling           : flowChartStore.getBlockStyling(),
    backgroundSelected     : flowChartStore.getBackgroundSelected()
    //previousMouseCoordsOnZoom: JSON.parse(JSON.stringify(flowChartStore.getPreviousMouseCoordsOnZoom())),
  }
  }

export default class FlowChartControllerView extends React.Component
{
  constructor(props)
    {
    super(props);
    this._onChange = this._onChange.bind(this);
    this.state = getFlowChartState();
    }

  _onChange ()
    {
    this.setState(getFlowChartState());
    }

  componentDidMount ()
    {
    flowChartStore.addChangeListener(this._onChange);
    }

  componentWillUnmount ()
    {
    flowChartStore.removeChangeListener(this._onChange);
    }

  shouldComponentUpdate (nextProps, nextState)
    {
    let bRet = !Object.is(nextState, this.State);
    if (this.state.blockPositions === undefined)
      {
      bRet = false;
      }
    return (bRet);
    }

  render ()
    {
    let blockPositions = this.state.blockPositions;
    if (blockPositions === undefined)
      {
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
        backgroundSelected={this.state.backgroundSelected}
        />
    )
    }
}
