/**
 * Created by twi18192 on 19/02/16.
 */

let AppDispatcher = require('../dispatcher/appDispatcher.js');
let appConstants = require('../constants/appConstants.js');

let flowChartActions = {

  interactJsDrag: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.INTERACTJS_DRAG,
      item: item
    })
  },


  selectBlock: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.SELECT_BLOCK,
      item: item
    })
  },
  deselectAllBlocks: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.DESELECT_ALLBLOCKS,
      item: item
    })
  },
  selectEdge: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.SELECT_EDGE,
      item: item
    })
  },
  deselectAllEdges: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.DESELECT_ALLEDGES,
      item: item
    })
  },

  changeGraphPosition: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.CHANGE_GRAPHPOSITION,
      item: item
    })
  },

  graphZoom: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.GRAPH_ZOOM,
      item: item
    })
  },

  getAnyEdgeSelectedState: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.GETANY_EDGESELECTEDSTATE,
      item: item
    })
  },
  clickedEdge: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.CLICKED_EDGE,
      item: item
    })
  },

  passPortMouseDown: function(port){
    AppDispatcher.handleAction({
      actionType: appConstants.PASS_PORTMOUSEDOWN,
      item: port
    })
  },
  deselectAllPorts: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.DESELECT_ALLPORTS,
      item: item
    })
  },
  storingFirstPortClicked: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.STORING_FIRSTPORTCLICKED,
      item: item
    })
  },
  //appendToEdgeSelectedState: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.APPEND_EDGESELECTEDSTATE,
  //    item: item
  //  })
  //},
  addEdgePreview: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.ADD_EDGEPREVIEW,
      item: item
    })
  },
  updateEdgePreviewEndpoint: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.UPDATE_EDGEPREVIEWENDPOINT,
      item: item
    })
  },
  previousMouseCoordsOnZoom: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.PREVIOUS_MOUSECOORDSONZOOM,
      item: item
    })
  },



  //appendToBlockSelectedStates: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.APPENDTO_BLOCKSELECTEDSTATES,
  //    item: item
  //  })
  //}
};

export {flowChartActions as default}


