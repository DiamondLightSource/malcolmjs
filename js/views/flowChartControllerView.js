/**
 * Created by twi18192 on 26/01/16.
 */

var React = require('react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');

var FlowChart = require('./flowChart');

var blockStore = require('../stores/blockStore.js');
var flowChartStore = require('../stores/flowChartStore');

function getFlowChartState(){
  return{
    /* blockStore */
    allBlockInfo: JSON.parse(JSON.stringify(blockStore.getAllBlockInfo())),
    blockLibrary: JSON.parse(JSON.stringify(blockStore.getBlockLibrary())),


    /* flowChartStore */
    //graphPosition: JSON.parse(JSON.stringify(blockStore.getGraphPosition())),
    //graphZoomScale: JSON.parse(JSON.stringify(blockStore.getGraphZoomScale())),
    //portThatHasBeenClicked: JSON.parse(JSON.stringify(blockStore.getPortThatHasBeenClicked())),
    //storingFirstPortClicked: JSON.parse(JSON.stringify(blockStore.getStoringFirstPortClicked())),
    //areAnyBlocksSelected: JSON.parse(JSON.stringify(blockStore.getIfAnyBlocksAreSelected())),
    //areAnyEdgesSelected: JSON.parse(JSON.stringify(blockStore.getIfAnyEdgesAreSelected())),
    //edgePreview: JSON.parse(JSON.stringify(blockStore.getEdgePreview())),
    //blockStyling: JSON.parse(JSON.stringify(blockStore.getBlockStyling())),
    //previousMouseCoordsOnZoom: JSON.parse(JSON.stringify(blockStore.getPreviousMouseCoordsOnZoom())),

    graphPosition: JSON.parse(JSON.stringify(flowChartStore.getGraphPosition())),
    graphZoomScale: JSON.parse(JSON.stringify(flowChartStore.getGraphZoomScale())),
    portThatHasBeenClicked: flowChartStore.getPortThatHasBeenClicked(),
    storingFirstPortClicked: flowChartStore.getStoringFirstPortClicked(),
    areAnyBlocksSelected: JSON.parse(JSON.stringify(flowChartStore.getIfAnyBlocksAreSelected())),
    areAnyEdgesSelected: JSON.parse(JSON.stringify(flowChartStore.getIfAnyEdgesAreSelected())),
    edgePreview: JSON.parse(JSON.stringify(flowChartStore.getEdgePreview())),
    blockStyling: JSON.parse(JSON.stringify(flowChartStore.getBlockStyling())),
    blockPositions: JSON.parse(JSON.stringify(flowChartStore.getBlockPositions())),
    //previousMouseCoordsOnZoom: JSON.parse(JSON.stringify(flowChartStore.getPreviousMouseCoordsOnZoom())),


    //portMouseOver: JSON.parse(JSON.stringify(blockStore.getPortMouseOver())),


    /* WebAPI use */

    dataFetchTest: JSON.parse(JSON.stringify(blockStore.getDataFetchTest())),
    testAllBlockInfo: JSON.parse(JSON.stringify(blockStore.getTestAllBlockInfo()))
  }
}

var FlowChartControllerView = React.createClass({

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

  shouldComponentUpdate: function(nextProps, nextState){
    return (
      nextState.allBlockInfo !== this.state.allBlockInfo ||
      nextState.blockLibrary !== this.state.blockLibrary ||

      nextState.graphZoomScale !== this.state.graphZoomScale ||
      nextState.graphPosition.x !== this.state.graphPosition.x ||
      nextState.graphPosition.y !== this.state.graphPosition.y ||
      nextState.portThatHasBeenClicked !== this.state.portThatHasBeenClicked ||
      nextState.storingFirstPortClicked !== this.state.storingFirstPortClicked ||
      nextState.areAnyBlocksSelected !== this.state.areAnyBlocksSelected ||
      nextState.areAnyEdgesSelected !== this.state.areAnyEdgesSelected ||
      nextState.edgePreview !== this.state.edgePreview ||
      nextState.dataFetchTest !== this.state.dataFetchTest ||
      nextState.blockPositions !== this.state.blockPositions
    )
  },

  render: function(){
    return(
      <FlowChart
        allBlockInfo={this.state.allBlockInfo}
        blockLibrary={this.state.blockLibrary}

        graphZoomScale={this.state.graphZoomScale}
        graphPosition={this.state.graphPosition}
        portThatHasBeenClicked={this.state.portThatHasBeenClicked}
        storingFirstPortClicked={this.state.storingFirstPortClicked}
        areAnyBlocksSelected={this.state.areAnyBlocksSelected}
        areAnyEdgesSelected={this.state.areAnyEdgesSelected}
        //portMouseOver={this.state.portMouseOver}
        edgePreview={this.state.edgePreview}
        previousMouseCoordsOnZoom={this.state.previousMouseCoordsOnZoom}
        blockStyling={this.state.blockStyling}
        dataFetchTest={this.state.dataFetchTest}
        blockPositions={this.state.blockPositions}
      />
    )
  }
});

module.exports = FlowChartControllerView;
