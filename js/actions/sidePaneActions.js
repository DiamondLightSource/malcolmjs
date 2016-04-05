/**
 * Created by twi18192 on 01/09/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var appConstants = require('../constants/appConstants');

var sidePaneActions = {

  dropdownMenuShow: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.DROPDOWN_SHOW,
      item: item
    })
  },
  dropdownMenuHide: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.DROPDOWN_HIDE,
      item: item
    })
  },

};

module.exports = sidePaneActions;
