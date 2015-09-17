/**
 * Created by twi18192 on 01/09/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var appConstants = require('../constants/appConstants');

var sidePaneActions = {

  dropdownMenuShow: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.DROPDOWN_SHOW,
      item: item
    })
  },
  dropdownMenuHide: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.DROPDOWN_HIDE,
      item: item
    })
  },

  //addTab: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.ADD_TAB,
  //    item: item
  //  })
  //},
  //removeTab: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.REMOVE_TAB,
  //    item: item
  //  })
  //},
  //dropdownMenuSelect: function(tab, ReactComponent){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.DROPDOWN_SELECT,
  //    item: {item: tab, component: ReactComponent}
  //  })
  //},
  //redBlockTabOpen: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.REDBLOCKTAB_OPEN,
  //    item: item
  //  })
  //},
  //blueBlockTabOpen: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.BLUEBLOCKTAB_OPEN,
  //    item: item
  //  })
  //},
  //greenBlockTabOpen: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.GREENBLOCKTAB_OPEN,
  //    item: item
  //  })
  //},


  //switchTabWhenTabOpens: function(tab){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.SWITCHTAB_WHENTABOPENS,
  //    item: tab
  //  })
  //},
  //passingSidePane: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.PASSING_SIDEPANE,
  //    item: item
  //  })
  //}

  //redBlockStateChange: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.REDBLOCKSTATE_CHANGE,
  //    item: item
  //  })
  //},
  //reactPanelSelect: function(item){
  //  AppDispatcher.handleAction({
  //    actionType: appConstants.REACTPANEL_SELECT,
  //    item: item
  //  })
  //},

};

module.exports = sidePaneActions;
