/**
 * Created by twi18192 on 10/12/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var appConstants = require('../constants/appConstants.js');

var nodeActions = {
  //changeGateNodePosition: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.GATENODE_CHANGEPOSITION,
  //    item: item
  //  })
  //},
  //draggedElement: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.DRAGGED_ELEMENT,
  //    item : item
  //  })
  //},
  //draggedElementID: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.DRAGGED_ELEMENTID,
  //    item : item
  //  })
  //},
  //changeNodePosition: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.CHANGE_NODEPOSITION,
  //    item: item
  //  })
  //},
  //changeGate1Styling: function(item){
  //    AppDispatcher.handleAction({
  //        actionType: appConstants.CHANGE_GATE1STYLING,
  //        item: item
  //    })
  //}
  //portMouseOverLeaveToggle: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.PORT_MOUSEOVERLEAVETOGGLE,
  //    item: item
  //  })
  //},
  //pushNodeToArray: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.PUSH_NODETOARRAY,
  //    item: item
  //  })
  //},
  //pushEdgeToArray: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.PUSH_EDGETOARRAY,
  //    item: item
  //  })
  //},
  //addEdgeToAllNodeInfo: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.ADDEDGE_TOALLNODEINFO,
  //    item: item
  //  })
  //},
  //addOneSingleEdge: function(edgeInfo){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.ADD_ONESINGLEEDGE,
  //    item: edgeInfo
  //  })
  //},
  //createNewEdgeLabel: function(edgeInfo){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.CREATENEW_EDGELABEL,
  //    item: edgeInfo
  //  })
  //},
  //addOneSingleEdgeToEdgesObject(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.ADD_ONESINGLEEDGETOEDGESOBJECT,
  //    item: item
  //  })
  //},

  selectNode: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.SELECT_NODE,
      item: item
    })
  },
  deselectAllNodes: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.DESELECT_ALLNODES,
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

  addToAllNodeInfo: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.ADDTO_ALLNODEINFO,
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

  addOneSingleEdgeToAllNodeInfo(edgeInfo){
    AppDispatcher.handleAction({
      actionType: appConstants.ADD_ONESINGLEEDGETOALLNODEINFO,
      item: edgeInfo
    })
  },

  appendToEdgeSelectedState: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.APPEND_EDGESELECTEDSTATE,
      item: item
    })
  },

  interactJsDrag: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.INTERACTJS_DRAG,
      item: item
    })
  }
};

module.exports = nodeActions;
