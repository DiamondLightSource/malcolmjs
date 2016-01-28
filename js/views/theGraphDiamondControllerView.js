/**
 * Created by twi18192 on 26/01/16.
 */

var React = require('react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');

var TheGraphDiamond = require('./theGraphDiamond');

var blockStore = require('../stores/blockStore.js');

function getTheGraphDiamondState(){
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
    allBlockTypesPortStyling: blockStore.getAllBlockTypesPortStyling()
  }
}

var theGraphDiamondControllerView = React.createClass({

  getInitialState: function(){
    return getTheGraphDiamondState();
  },

  _onChange: function(){
    this.setState(getTheGraphDiamondState());
  },

  componentDidMount: function(){
    blockStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    blockStore.removeChangeListener(this._onChange);
  },

  render: function(){
    return(
      <TheGraphDiamond
        graphPosition={this.state.graphPosition} graphZoomScale={this.state.graphZoomScale}
        allBlockInfo={this.state.allBlockInfo} portThatHasBeenClicked={this.state.portThatHasBeenClicked}
        storingFirstPortClicked={this.state.storingFirstPortClicked}
        blockLibrary={this.state.blockLibrary}
        allBlockTypesStyling={this.state.allBlockTypesStyling} areAnyBlocksSelected={this.state.areAnyBlocksSelected}
        areAnyEdgesSelected={this.state.areAnyEdgesSelected} allBlockTypesPortStyling={this.state.allBlockTypesPortStyling}
        portMouseOver={this.state.portMouseOver}
      />
    )
  }
});

module.exports = theGraphDiamondControllerView;
