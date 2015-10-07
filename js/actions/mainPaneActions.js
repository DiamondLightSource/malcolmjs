/**
 * Created by twi18192 on 25/08/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var appConstants = require('../constants/appConstants');

var mainPaneActions = {
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

/* This isn't a React component, so you don't need a
capital first letter in order for it to work
 */

module.exports = mainPaneActions;
