/**
 * Created by twi18192 on 10/12/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var appConstants = require('../constants/appConstants.js');

var blockActions = {

  /* BLOCK use */

  addToAllBlockInfo: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.ADDTO_ALLBLOCKINFO,
      item: item
    })
  },
  //interactJsDrag: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.INTERACTJS_DRAG,
  //    item: item
  //  })
  //},
  addOneSingleEdgeToAllBlockInfo(edgeInfo){
    AppDispatcher.handleAction({
      actionType: appConstants.ADD_ONESINGLEEDGETOALLBLOCKINFO,
      item: edgeInfo
    })
  },
  deleteEdge: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.DELETE_EDGE,
      item: item
    })
  },

};

module.exports = blockActions;
