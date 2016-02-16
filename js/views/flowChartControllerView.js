/**
 * Created by twi18192 on 26/01/16.
 */

var React = require('react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');

var FlowChart = require('./flowChart');

var blockStore = require('../stores/blockStore.js');

function getFlowChartState(){
  return{
    graphPosition: JSON.parse(JSON.stringify(blockStore.getGraphPosition())),
    graphZoomScale: JSON.parse(JSON.stringify(blockStore.getGraphZoomScale())),
    //allEdges: NodeStore.getAllEdges(),
    //nodesToRender: NodeStore.getNodesToRenderArray(),
    //edgesToRender: NodeStore.getEdgesToRenderArray(),
    allBlockInfo: JSON.parse(JSON.stringify(blockStore.getAllBlockInfo())),
    portThatHasBeenClicked: JSON.parse(JSON.stringify(blockStore.getPortThatHasBeenClicked())),
    storingFirstPortClicked: JSON.parse(JSON.stringify(blockStore.getStoringFirstPortClicked())),
    //newlyCreatedEdgeLabel: NodeStore.getNewlyCreatedEdgeLabel(),
    blockLibrary: JSON.parse(JSON.stringify(blockStore.getBlockLibrary())),
    //portMouseOver: JSON.parse(JSON.stringify(blockStore.getPortMouseOver())),
    areAnyBlocksSelected: JSON.parse(JSON.stringify(blockStore.getIfAnyBlocksAreSelected())),
    areAnyEdgesSelected: JSON.parse(JSON.stringify(blockStore.getIfAnyEdgesAreSelected())),

    edgePreview: JSON.parse(JSON.stringify(blockStore.getEdgePreview())),
    previousMouseCoordsOnZoom: JSON.parse(JSON.stringify(blockStore.getPreviousMouseCoordsOnZoom())),

    blockStyling: JSON.parse(JSON.stringify(blockStore.getBlockStyling()))
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
  },

  componentWillUnmount: function(){
    blockStore.removeChangeListener(this._onChange);
  },

  shouldComponentUpdate: function(nextProps, nextState){
    return (
      nextState.graphZoomScale !== this.state.graphZoomScale ||
      nextState.graphPosition.x !== this.state.graphPosition.x ||
      nextState.graphPosition.y !== this.state.graphPosition.y ||
      nextState.allBlockInfo !== this.state.allBlockInfo ||
      nextState.portThatHasBeenClicked !== this.state.portThatHasBeenClicked ||
      nextState.storingFirstPortClicked !== this.state.storingFirstPortClicked ||
      nextState.blockLibrary !== this.state.blockLibrary ||
      nextState.areAnyBlocksSelected !== this.state.areAnyBlocksSelected ||
      nextState.areAnyEdgesSelected !== this.state.areAnyEdgesSelected ||
      nextState.edgePreview !== this.state.edgePreview
    )
  },

  render: function(){
    return(
      <FlowChart
        graphPosition={this.state.graphPosition}
        graphZoomScale={this.state.graphZoomScale}
        allBlockInfo={this.state.allBlockInfo}
        portThatHasBeenClicked={this.state.portThatHasBeenClicked}
        storingFirstPortClicked={this.state.storingFirstPortClicked}
        blockLibrary={this.state.blockLibrary}
        areAnyBlocksSelected={this.state.areAnyBlocksSelected}
        areAnyEdgesSelected={this.state.areAnyEdgesSelected}
        //portMouseOver={this.state.portMouseOver}
        edgePreview={this.state.edgePreview}
        previousMouseCoordsOnZoom={this.state.previousMouseCoordsOnZoom}
        blockStyling={this.state.blockStyling}
      />
    )
  }
});

module.exports = FlowChartControllerView;
