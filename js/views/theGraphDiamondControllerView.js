/**
 * Created by twi18192 on 26/01/16.
 */

var React = require('react');
var ReactDOM = require('../../node_modules/react-dom/dist/react-dom.js');

var TheGraphDiamond = require('./theGraphDiamond');

var NodeStore = require('../stores/nodeStore.js');

function getTheGraphDiamondState(){
  return{
    graphPosition: NodeStore.getGraphPosition(),
    graphZoomScale: NodeStore.getGraphZoomScale(),
    //allEdges: NodeStore.getAllEdges(),
    //nodesToRender: NodeStore.getNodesToRenderArray(),
    //edgesToRender: NodeStore.getEdgesToRenderArray(),
    allNodeInfo: NodeStore.getAllNodeInfo(),
    portThatHasBeenClicked: NodeStore.getPortThatHasBeenClicked(),
    storingFirstPortClicked: NodeStore.getStoringFirstPortClicked(),
    //newlyCreatedEdgeLabel: NodeStore.getNewlyCreatedEdgeLabel(),
    nodeLibrary: NodeStore.getNodeLibrary(),
    allNodeTypesStyling: NodeStore.getAllNodeTypesStyling(),
    portMouseOver: NodeStore.getPortMouseOver(),
    areAnyNodesSelected: NodeStore.getIfAnyNodesAreSelected(),
    areAnyEdgesSelected: NodeStore.getIfAnyEdgesAreSelected(),
    allNodeTypesPortStyling: NodeStore.getAllNodeTypesPortStyling()
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
    NodeStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    NodeStore.removeChangeListener(this._onChange);
  },

  render: function(){
    return(
      <TheGraphDiamond
        graphPosition={this.state.graphPosition} graphZoomScale={this.state.graphZoomScale}
        allNodeInfo={this.state.allNodeInfo} portThatHasBeenClicked={this.state.portThatHasBeenClicked}
        storingFirstPortClicked={this.state.storingFirstPortClicked}
        nodeLibrary={this.state.nodeLibrary}
        allNodeTypesStyling={this.state.allNodeTypesStyling} areAnyNodesSelected={this.state.areAnyNodesSelected}
        areAnyEdgesSelected={this.state.areAnyEdgesSelected} allNodeTypesPortStyling={this.state.allNodeTypesPortStyling}
        portMouseOver={this.state.portMouseOver}
      />
    )
  }
});

module.exports = theGraphDiamondControllerView;
