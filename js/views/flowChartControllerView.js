/**
 * Created by twi18192 on 26/01/16.
 */

let React = require('react');

let FlowChart = require('./flowChart');

let blockStore = require('../stores/blockStore.js');
let flowChartStore = require('../stores/flowChartStore');

function getFlowChartState(){
  return{
    /* blockStore */
    allBlockInfo: blockStore.getAllBlockInfo(),

    /* flowChartStore */
    graphPosition: flowChartStore.getGraphPosition(),
    graphZoomScale: flowChartStore.getGraphZoomScale(),
    portThatHasBeenClicked: flowChartStore.getPortThatHasBeenClicked(),
    storingFirstPortClicked: flowChartStore.getStoringFirstPortClicked(),
    areAnyBlocksSelected: flowChartStore.getIfAnyBlocksAreSelected(),
    areAnyEdgesSelected: flowChartStore.getIfAnyEdgesAreSelected(),
    edgePreview: flowChartStore.getEdgePreview(),
    blockStyling: flowChartStore.getBlockStyling(),
    blockPositions: blockStore.getBlockPositions(),
    //previousMouseCoordsOnZoom: JSON.parse(JSON.stringify(flowChartStore.getPreviousMouseCoordsOnZoom())),
  }
}

let FlowChartControllerView = React.createClass({

  getInitialState: function(){
    return getFlowChartState();
  },

  _onChange: function(){
    this.setState(getFlowChartState());
  },

  componentDidMount: function(){
    blockStore.addChangeListener(this._onChange);
    flowChartStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    blockStore.removeChangeListener(this._onChange);
    flowChartStore.removeChangeListener(this._onChange);
  },

  render: function(){
    return(
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
