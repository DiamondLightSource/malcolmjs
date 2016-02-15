/**
 * Created by twi18192 on 26/01/16.
 */

var React = require('react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');

var FlowChart = require('./flowChart');

var blockStore = require('../stores/blockStore.js');

function getFlowChartState(){
  return{
    graphPosition: blockStore.getGraphPosition(),
    graphZoomScale: blockStore.getGraphZoomScale(),
    //allEdges: NodeStore.getAllEdges(),
    //nodesToRender: NodeStore.getNodesToRenderArray(),
    //edgesToRender: NodeStore.getEdgesToRenderArray(),
    allBlockInfo: blockStore.getAllBlockInfo(),
    portThatHasBeenClicked: blockStore.getPortThatHasBeenClicked(),
    storingFirstPortClicked: blockStore.getStoringFirstPortClicked(),
    //newlyCreatedEdgeLabel: NodeStore.getNewlyCreatedEdgeLabel(),
    blockLibrary: blockStore.getBlockLibrary(),
    allBlockTypesStyling: blockStore.getAllBlockTypesStyling(),
    portMouseOver: blockStore.getPortMouseOver(),
    areAnyBlocksSelected: blockStore.getIfAnyBlocksAreSelected(),
    areAnyEdgesSelected: blockStore.getIfAnyEdgesAreSelected(),
    allBlockTypesPortStyling: blockStore.getAllBlockTypesPortStyling(),

    edgePreview: blockStore.getEdgePreview(),
    previousMouseCoordsOnZoom: blockStore.getPreviousMouseCoordsOnZoom()
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

  //shouldComponentUpdate: function(nextProps, nextState){
  //  console.log(nextState);
  //  console.log(this.state.graphPosition);
  //  console.log(nextState.graphPosition);
  //  return (
  //    nextState.graphZoomScale !== this.state.graphZoomScale ||
  //    nextState.graphPosition !== this.state.graphPosition ||
  //    nextState.allBlockInfo !== this.state.allBlockInfo ||
  //    nextState.portThatHasBeenClicked !== this.state.portThatHasBeenClicked ||
  //    nextState.storingFirstPortClicked !== this.state.storingFirstPortClicked ||
  //    nextState.blockLibrary !== this.state.blockLibrary ||
  //    nextState.allBlockTypesStyling !== this.state.allBlockTypesStyling ||
  //    nextState.portMouseOver !== this.state.portMouseOver ||
  //    nextState.areAnyBlocksSelected !== this.state.areAnyBlocksSelected ||
  //    nextState.areAnyEdgesSelected !== this.state.areAnyEdgesSelected ||
  //    nextState.allBlockTypesPortStyling !== this.state.allBlockTypesPortStyling ||
  //    nextState.edgePreview !== this.state.edgePreview
  //  )
  //},

  render: function(){
    return(
      <FlowChart
        graphPosition={this.state.graphPosition} graphZoomScale={this.state.graphZoomScale}
        allBlockInfo={this.state.allBlockInfo} portThatHasBeenClicked={this.state.portThatHasBeenClicked}
        storingFirstPortClicked={this.state.storingFirstPortClicked}
        blockLibrary={this.state.blockLibrary}
        allBlockTypesStyling={this.state.allBlockTypesStyling} areAnyBlocksSelected={this.state.areAnyBlocksSelected}
        areAnyEdgesSelected={this.state.areAnyEdgesSelected} allBlockTypesPortStyling={this.state.allBlockTypesPortStyling}
        portMouseOver={this.state.portMouseOver} edgePreview={this.state.edgePreview}
        previousMouseCoordsOnZoom={this.state.previousMouseCoordsOnZoom}
      />
    )
  }
});

module.exports = FlowChartControllerView;
