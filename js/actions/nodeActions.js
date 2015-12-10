/**
 * Created by twi18192 on 10/12/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var appConstants = require('../constants/appConstants.js');

var nodeActions = {
  changeGateNodePosition: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.GATENODE_CHANGEPOSITION,
      item: item
    })
  },
  draggedElement: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.DRAGGED_ELEMENT,
      item : item
    })
  },
  draggedElementID: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.DRAGGED_ELEMENTID,
      item : item
    })
  },
  changeNodePosition: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.CHANGE_NODEPOSITION,
      item: item
    })
  },

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

  //changeGate1Styling: function(item){
  //    AppDispatcher.handleAction({
  //        actionType: appConstants.CHANGE_GATE1STYLING,
  //        item: item
  //    })
  //}

  changeGraphPosition: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.CHANGE_GRAPHPOSITION,
      item: item
    })
  }
};

module.exports = nodeActions;
