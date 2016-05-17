/**
 * Created by twi18192 on 17/09/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var appConstants = require('../constants/appConstants');

var paneActions = {

  dropdownMenuSelect: function(tab){
    AppDispatcher.handleViewAction({
      actionType: appConstants.DROPDOWN_SELECT,
      item:tab
    })
  },
  favTabOpen: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.FAVTAB_OPEN,
      item: item
    })
  },
  configTabOpen: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.CONFIGTAB_OPEN,
      item: item
    })
  },
  blockLookupTableTabOpen: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.BLOCKLOOKUPTABLETAB_OPEN,
      item: item
    })
  },

  openBlockTab: function(BlockId){
    AppDispatcher.handleViewAction({
      actionType: appConstants.OPEN_BLOCKTAB,
      item: BlockId
    })
  },
  removeBlockTab: function(SelectedBlockTabIndex){
    AppDispatcher.handleViewAction({
      actionType: appConstants.REMOVE_BLOCKTAB,
      item: SelectedBlockTabIndex
    })
  },

  toggleSidebar: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.TOGGLE_SIDEBAR,
      item: item
    })
  },
  windowWidthMediaQueryChanged: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.WINDOWWIDTH_MEDIAQUERYCHANGED,
      item: item
    })
  },

  openEdgeTab: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.OPEN_EDGETAB,
      item: item
    })
  },

  openModalDialogBox: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.MODAL_DIALOG_BOX_OPEN,
      item: item
    })
  },

  closeModalDialogBox: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.MODAL_DIALOG_BOX_CLOSE,
      item: item
    })
  },

};

module.exports = paneActions;
