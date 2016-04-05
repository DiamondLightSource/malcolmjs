/**
 * Created by twi18192 on 17/09/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var appConstants = require('../constants/appConstants');

var paneActions = {
  removeTab: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.REMOVE_TAB,
      item: item
    })
  },
  dropdownMenuSelect: function(tab){
    AppDispatcher.handleViewAction({
      actionType: appConstants.DROPDOWN_SELECT,
      item:tab
    })
  },
  passSidePane: function(ReactComponent){
    AppDispatcher.handleViewAction({
      actionType: appConstants.PASS_SIDEPANE,
      item: ReactComponent
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
  updatePaneStoreBlockContentViaDeviceStore: function(blockContentObject){
    AppDispatcher.handleAction({
      actionType: appConstants.UPDATEBLOCKCONTENT_VIASERVER,
      item: blockContentObject
    })
  },

  initialFetchOfBlockDataFromBlockStore: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.FETCHINITIAL_BLOCKDATA,
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
  }

};

module.exports = paneActions;
