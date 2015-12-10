/**
 * Created by twi18192 on 19/11/15.
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
    }
};

module.exports = nodeActions;