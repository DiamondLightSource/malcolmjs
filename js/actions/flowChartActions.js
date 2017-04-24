/**
 * Created by twi18192 on 19/02/16.
 */

let AppDispatcher = require('../dispatcher/appDispatcher.js');
let appConstants  = require('../constants/appConstants.js');

class FlowChartActions {
constructor()
  {

  }

interactJsDrag(item)
  {
  AppDispatcher.handleAction({
    actionType: appConstants.INTERACTJS_DRAG,
    item      : item
  })
  }


selectBlock(item)
  {
  AppDispatcher.handleAction({
    actionType: appConstants.SELECT_BLOCK,
    item      : item
  })
  }

deselectAllBlocks(item)
  {
  AppDispatcher.handleAction({
    actionType: appConstants.DESELECT_ALLBLOCKS,
    item      : item
  })
  }

selectEdge(item)
  {
  AppDispatcher.handleAction({
    actionType: appConstants.SELECT_EDGE,
    item      : item
  })
  }

deselectAllEdges(item)
  {
  AppDispatcher.handleAction({
    actionType: appConstants.DESELECT_ALLEDGES,
    item      : item
  })
  }

changeGraphPosition(item)
  {
  AppDispatcher.handleAction({
    actionType: appConstants.CHANGE_GRAPHPOSITION,
    item      : item
  })
  }

graphZoom(item)
  {
  AppDispatcher.handleViewAction({
    actionType: appConstants.GRAPH_ZOOM,
    item      : item
  })
  }

getAnyEdgeSelectedState(item)
  {
  AppDispatcher.handleAction({
    actionType: appConstants.GETANY_EDGESELECTEDSTATE,
    item      : item
  })
  }

clickedEdge(item)
  {
  AppDispatcher.handleAction({
    actionType: appConstants.CLICKED_EDGE,
    item      : item
  })
  }

passPortMouseDown(port)
  {
  AppDispatcher.handleAction({
    actionType: appConstants.PASS_PORTMOUSEDOWN,
    item      : port
  })
  }

deselectAllPorts(item)
  {
  AppDispatcher.handleAction({
    actionType: appConstants.DESELECT_ALLPORTS,
    item      : item
  })
  }

storingFirstPortClicked(item)
  {
  AppDispatcher.handleAction({
    actionType: appConstants.STORING_FIRSTPORTCLICKED,
    item      : item
  })
  }

//appendToEdgeSelectedState(item){
//  AppDispatcher.handleAction({
//    actionType: appConstants.APPEND_EDGESELECTEDSTATE,
//    item: item
//  })
//}
addEdgePreview(item)
  {
  AppDispatcher.handleAction({
    actionType: appConstants.ADD_EDGEPREVIEW,
    item      : item
  })
  }

updateEdgePreviewEndpoint(item)
  {
  AppDispatcher.handleAction({
    actionType: appConstants.UPDATE_EDGEPREVIEWENDPOINT,
    item      : item
  })
  }

previousMouseCoordsOnZoom(item)
  {
  AppDispatcher.handleAction({
    actionType: appConstants.PREVIOUS_MOUSECOORDSONZOOM,
    item      : item
  })
  }


//appendToBlockSelectedStates(item){
//  AppDispatcher.handleAction({
//    actionType: appConstants.APPENDTO_BLOCKSELECTEDSTATES,
//    item: item
//  })
//}
}

const flowChartActions = new FlowChartActions();

export {flowChartActions as default};



