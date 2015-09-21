/**
 * Created by twi18192 on 17/09/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var appConstants = require('../constants/appConstants');

var paneActions = {

  addTab: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.ADD_TAB,
      item: item
    })
  },
  removeTab: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.REMOVE_TAB,
      item: item
    })
  },
  redBlockTabOpen: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.REDBLOCKTAB_OPEN,
      item: item
    })
  },
  blueBlockTabOpen: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.BLUEBLOCKTAB_OPEN,
      item: item
    })
  },
  greenBlockTabOpen: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.GREENBLOCKTAB_OPEN,
      item: item
    })
  },
  dropdownMenuSelect: function(tab){
    AppDispatcher.handleAction({
      actionType: appConstants.DROPDOWN_SELECT,
      item:tab
    })
  },
  passSidePane: function(ReactComponent){
    AppDispatcher.handleAction({
      actionType: appConstants.PASS_SIDEPANE,
      item: ReactComponent
    })
  },
  favTabOpen: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.FAVTAB_OPEN,
      item: item
    })
  },
  configTabOpen: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.CONFIGTAB_OPEN,
      item: item
    })
  }

};

module.exports = paneActions;
