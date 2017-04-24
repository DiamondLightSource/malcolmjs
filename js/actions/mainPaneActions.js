/**
 * Created by twi18192 on 25/08/15.
 */

let AppDispatcher = require('../dispatcher/appDispatcher');
let appConstants = require('../constants/appConstants');

let mainPaneActions = {
  toggleFooter1: function(item){
    AppDispatcher.handleViewAction({
      actionType:appConstants.FOOTER_TOGGLE,
      item: item
    })
  },
  toggleConfigPanel: function(item){
    AppDispatcher.handleViewAction({
      actionType:appConstants.CONFIG_TOGGLE,
      item: item
    })
  },
  toggleFavPanel: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.FAV_TOGGLE,
      item: item
    })
  }
};

module.exports = mainPaneActions;
