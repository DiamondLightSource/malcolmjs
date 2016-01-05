/**
 * Created by twi18192 on 17/09/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var appConstants = require('../constants/appConstants');

var paneActions = {

  addTab: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.ADD_TAB,
      item: item
    })
  },
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
  passDispatchMarker: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.PASS_DISPATCHMARKER,
      item: item
    })
  },
  appendStuffForNewBlock: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.APPENDSTUFF_FORNEWBLOCK,
      item: item
    })
  },
  changeSomeInfo: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.CHANGE_INFO,
      item: item
    })
  },
  updatePaneStoreBlockContentViaDeviceStore: function(blockContentObject){
    AppDispatcher.handleAction({
      actionType: appConstants.UPDATEBLOCKCONTENT_VIASERVER,
      item: blockContentObject
    })
  },

  initialFetchOfNodeDataFromNodeStore: function(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.FETCHINITIAL_NODEDATA,
      item: item
    })
  },
  openNodeTab: function(NodeId){
    AppDispatcher.handleViewAction({
      actionType: appConstants.OPEN_NODETAB,
      item: NodeId
    })
  },
  removeNodeTab: function(SelectedNodeTabIndex){
    AppDispatcher.handleViewAction({
      actionType: appConstants.REMOVE_NODETAB,
      item: SelectedNodeTabIndex
    })
  }

};

module.exports = paneActions;


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
