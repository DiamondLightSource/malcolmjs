/**
 * Created by twi18192 on 17/09/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var appConstants = require('../constants/appConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _stuff = {
  tabState: [],
  selectedTabIndex: 0,
  updatedBlockContent: null,
  blockTabState: [],
  sidebarOpen: false,
  //loadingInitialData: true,
  //loadingInitialDataError: false,
  modalDialogBoxOpen: false
};

var modalDialogBoxInfo = {
  blockName: null,
  attributeName: null,
  message: null
};

var _handles = {
  passSidePane: null
};

var passSidePane = function(ReactComponent){ /* Testing to see if saving it in state would work, it did! :D*/

  _handles.passSidePane = ReactComponent;

};

//var favContent = {
//  name: "Favourites tab",
//  label: 'Favourites',
//  hack: "favTabOpen",
//  info: {
//    block1: {
//      name: "Block 1",
//      stuff1: "meh",
//      stuff2: "bleh"
//      },
//    block2: {
//      name: "Block 2",
//      stuff1: "mah",
//      stuff2: "blah"
//    }
//  }
//};

//var configContent = {
//  name: "Configuration tab",
//  label: 'Configuration',
//  hack: "configTabOpen",
//  info: {
//    Configurations: {
//      config1: "config1",
//      config2: "config2"
//    },
//    SystemInformation: {
//      firmwareVersion: "numbers & letters"
//    }
//  }
//};

var dropdownMenuSelect = function(tab){
  /* Note that 'tab' is the nodeId, not the React element or anything like that */

  console.log("dropdown menu select");
  console.log(tab);

  for(var i = 0; i < _stuff.tabState.length; i++){
    console.log(_stuff.tabState[i]);
    if(_stuff.tabState[i].label === tab){              /* Changed from .name to .label */
      var findTheIndex = i
    }
  }
  //_handles.passSidePane.refs.panel.setSelectedIndex(findTheIndex);

  /* Use selectedTabIndex instead of panels' refs attribute */

  _stuff.selectedTabIndex = findTheIndex;

};

var selectBlockOnClick = function(){
  var tabStateLength = _stuff.tabState.length;
  //_handles.passSidePane.refs.panel.setSelectedIndex(tabStateLength - 1)

  /* Use selectedTabIndex instead of panels' refs attribute */

  _stuff.selectedTabIndex = tabStateLength - 1;

};

var paneStore = assign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb)
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb)
  },
  emitChange: function(){
    this.emit(CHANGE_EVENT)
  },
  getTabState: function(){
    return _stuff.tabState;
  },
  getFavTabOpen:function(){
    return allBlockTabProperties.Favourites;
  },
  getConfigTabOpen: function(){
    return allBlockTabProperties.Configuration;
  },
  //getFavContent: function(){
  //  return favContent;
  //},
  //getConfigContent: function(){
  //  return configContent;
  //},
  getSelectedTabIndex: function(){
    return _stuff.selectedTabIndex;
  },

  getSidebarOpenState: function(){
    return _stuff.sidebarOpen;
  },

  getAllBlockTabOpenStates: function(){
    return allBlockTabProperties;
  },
  //getIfLoadingInitialData: function(){
  //  return _stuff.loadingInitialData;
  //},
  //getIfLoadingInitialDataError: function(){
  //  return _stuff.loadingInitialDataError;
  //},
  getModalDialogBoxOpenState: function(){
    return _stuff.modalDialogBoxOpen;
  },
  getModalDialogBoxInfo: function(){
    return modalDialogBoxInfo;
  }
});

var attributeStore = require('./attributeStore');

paneStore.dispatchToken = AppDispatcher.register(function(payload){
  var action = payload.action;
  var item = action.item;

  //console.log(action);
  //console.log(payload);
  //console.log(item);

  switch(action.actionType){

    case appConstants.PASS_SIDEPANE:
      passSidePane(item);
          break;

    case appConstants.DROPDOWN_SELECT:
      dropdownMenuSelect(item);
      paneStore.emitChange();
      break;

    case appConstants.FAVTAB_OPEN:
      setFavTabStateTrue();
      console.log(allBlockTabProperties.Favourites);
      paneStore.emitChange();
      break;

    case appConstants.CONFIGTAB_OPEN:
      setConfigTabStateTrue();
      console.log(allBlockTabProperties.Configuration);
      paneStore.emitChange();
      break;

    case appConstants.BLOCKLOOKUPTABLETAB_OPEN:
      setBlockLookupTableTabStateTrue();
      paneStore.emitChange();
      break;

    case appConstants.OPEN_BLOCKTAB:

      setBlockTabStateTrue(item);
      //_stuff.tabState.push(allNodeTabInfo[item]);
      /* Seeing if I can cut out checkWhichNodeTabsOpen and cut straight to adding to _stuff.tabState */
      //checkWhichNodeTabsOpen();
      //selectBlockOnClick();
      console.log(_stuff.tabState);
      paneStore.emitChange();
      break;

    case appConstants.REMOVE_BLOCKTAB:
      removeBlockTab(item);
      console.log(_stuff.tabState);
      paneStore.emitChange();
      break;

    case appConstants.TOGGLE_SIDEBAR:
      toggleSidebar();
      paneStore.emitChange();
      break;

    case appConstants.WINDOWWIDTH_MEDIAQUERYCHANGED:
      windowWidthMediaQueryChanged(item);
      paneStore.emitChange();
      break;

    case appConstants.OPEN_EDGETAB:
      var EdgeInfo = {
        edgeId: item.edgeId,
        fromBlock: item.fromBlock,
        fromBlockPort: item.fromBlockPort,
        toBlock: item.toBlock,
        toBlockPort: item.toBlockPort
      };
      setEdgeTabStateTrue(EdgeInfo);
      paneStore.emitChange();
      break;

    case appConstants.MODAL_DIALOG_BOX_OPEN:
      _stuff.modalDialogBoxOpen = true;
      modalDialogBoxInfo.blockName = item.blockName;
      modalDialogBoxInfo.attributeName = item.attributeName;
      modalDialogBoxInfo.message = item.message;
      paneStore.emitChange();
      break;

    case appConstants.MODAL_DIALOG_BOX_CLOSE:
      _stuff.modalDialogBoxOpen = false;
      modalDialogBoxInfo.blockName = null;
      modalDialogBoxInfo.attributeName = null;
      modalDialogBoxInfo.message = null;
      paneStore.emitChange();
      break;

    case appConstants.MALCOLM_GET_SUCCESS:

      /* No need to check the tags for if it's FlowGraph */
      for(var j = 0; j < item.responseMessage.tags.length; j++){
        //if(item.tags[j] === 'instance:FlowGraph'){
        //}
        if(item.responseMessage.tags[j] === 'instance:Zebra2Block'){

          if(item.responseMessage.attributes.VISIBLE.value === 'Show') {

            var blockName = JSON.parse(JSON.stringify(item.responseMessage.name.slice(2)));
            appendToAllBlockTabProperties(blockName);

            /* Also need to check if the block has any edges too,
            so then I can append them to allEdgeTabProperties,
            meaning that their tabs will be openable after initial
            render
             */

            checkBlockForInitialEdges(item.responseMessage.attributes);

            paneStore.emitChange();

          }
        }
        else if(item.responseMessage.tags[j] === 'instance:Zebra2Visibility'){
          /* I think I could potentially listen for when VISIBILITY comes in,
           and then add its tab to tabState using setBlockLookupTableStateTrue?
           */

          /* Hmm, but what if attribute store goes AFTER paneStore,
          that'll mean that the attributes for VISIBILITY won't
          yet exist so they can't be drawn yet...
          Could use waitFor, it could also break something though...
           */

          //AppDispatcher.waitFor([attributeStore.dispatchToken]);

          console.log("zebra2visibility");
          console.log(item.responseMessage);

          setBlockLookupTableTabStateTrue();
          paneStore.emitChange();
        }
      }

      break;

    case appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
      console.log("malcolmSubscribeSuccess in paneStore");
      var isWidgetCombo = false;
      var isGroupInputs = false;

      if(item.responseMessage.tags !== undefined) {
        for (var k = 0; k < item.responseMessage.tags.length; k++) {
          if (item.responseMessage.tags[k].indexOf('widget:combo') !== -1) {
            isWidgetCombo = true;
          }
          else if (item.responseMessage.tags[k].indexOf('group:Inputs') !== -1) {
            isGroupInputs = true;
          }
          else if(item.responseMessage.tags[k].indexOf('widget:toggle') !== -1){

            /* Need to append to allBlockTabProperties when a block's
             visibility is changed from Hide to Show, so then when a block
             is added you can open its tab!
             */

            if(item.requestedData.blockName === 'VISIBILITY'){
              if(item.responseMessage.value === 'Show'){
                /* Append to allBlockTabProperties */
                appendToAllBlockTabProperties(item.requestedData.attribute);
              }
              else if(item.responseMessage.value === 'Hide'){
                /* Remove from allBlockTabProperties */
                delete allBlockTabProperties[item.requestedData.attribute];
              }
              paneStore.emitChange()
            }
            else if(item.requestedData.attribute === 'VISIBLE'){
              /* This is for when a block's own VISIBLE attribute/toggle switch
              is changed, rather than VISBILITY's
               */
              if(item.responseMessage.value === 'Show'){
                /* Append to allBlockTabProperties */
                appendToAllBlockTabProperties(item.requestedData.blockName);
              }
              else if(item.responseMessage.value === 'Hide'){
                /* Remove from allBlockTabProperties */
                delete allBlockTabProperties[item.requestedData.blockName];
              }
              paneStore.emitChange();
            }

          }
        }
      }

      if(isWidgetCombo === true && isGroupInputs === true){
        /* Then this is some info on edges, so we need
        to append to the relevant objects in order to have
        edge tabs
         */

        var responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
        var requestedData = JSON.parse(JSON.stringify(item.requestedData));

        if(responseMessage.value !== 'BITS.ZERO' &&
          responseMessage.value !== 'POSITIONS.ZERO') {

          /* edgeLabelFirstHalf is the outport block and the
           outport block port names put together
           */
          var edgeLabelFirstHalf = responseMessage.value.replace(/\./g, "");

          /* edgeLabelSecondHalf is the inport block and the
           inport block port names put together
           */
          var edgeLabelSecondHalf = requestedData.blockName + requestedData.attribute;
          var edgeLabel = edgeLabelFirstHalf + edgeLabelSecondHalf;

          appendToAllEdgeTabProperties(edgeLabel);
        }
        else if(responseMessage.value === 'BITS.ZERO' ||
          responseMessage.value === 'POSITIONS.ZERO'){

          /* I know what inport and what inport block the edge was
           connected to, but I don't know what outport or what
           outport block the edge was connected to, since you
           get the value to be BITS.ZERO or POSITIONS.ZERO instead
           of what it was connected to before...
            */

          var edgeLabelToDelete;

          var edgeLabelSecondHalf = requestedData.blockName + requestedData.attribute;

          /* Inports can't be connected to more than one outport
          at a time, so only one edge with edgeLabelSecondHalf in it
          can exist at any given time, so I think I can search through
          all the edges in allEdgeTabProperties and see if the
          indexOf(edgeLabelSecondHalf) !== -1, then that should
          be the edge that I want to delete
           */

          for(var edge in allEdgeTabProperties){
            if(edge.indexOf(edgeLabelSecondHalf) !== -1){
              edgeLabelToDelete = edge;
              delete allEdgeTabProperties[edge];
            }
          }

          console.log(allEdgeTabProperties);

          /* Now need to remove the edge from tabState! */

          function checkEdgeLabel(edgeTabObject){
            return edgeTabObject.label !== edgeLabelToDelete;
          }

          for(var j = 0; j < _stuff.tabState.length; j++){
            if(_stuff.tabState[j].label === edgeLabelToDelete){
              /* Return a new array after removing the edge tab */
              _stuff.tabState = _stuff.tabState.filter(checkEdgeLabel);
            }
          }

          /* In the case of deleting the last tab in tabState */
          if(_stuff.selectedTabIndex === _stuff.tabState.length) {
            _stuff.selectedTabIndex = _stuff.selectedTabIndex - 1;
          }

          console.log(_stuff.tabState);

        }

        paneStore.emitChange();

      }

      /* Hmm, I need to also remove the edge tab
      if I'm deleting the edge; ie, if the value of
      a subscription is BITS.ZERO or POSITIONS.ZERO
       */

      break;

    case appConstants.MALCOLM_CALL_SUCCESS:
      var requestedDataToWrite = JSON.parse(JSON.stringify(item.requestedDataToWrite));

      var attributeToUpdate = requestedDataToWrite.method.slice('_set_'.length);

      if(modalDialogBoxInfo.blockName === requestedDataToWrite.blockName &&
        modalDialogBoxInfo.attributeName === attributeToUpdate) {
        modalDialogBoxInfo.message = null;
        paneStore.emitChange();
      }

      break;

    case appConstants.MALCOLM_CALL_FAILURE:

      var responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
      var requestedDataToWrite = JSON.parse(JSON.stringify(item.requestedDataToWrite));

      var attributeToUpdate = requestedDataToWrite.method.slice('_set_'.length);

      modalDialogBoxInfo.blockName = requestedDataToWrite.blockName;
      modalDialogBoxInfo.attributeName = attributeToUpdate;
      modalDialogBoxInfo.message = responseMessage;

      console.log(modalDialogBoxInfo);

      paneStore.emitChange();
      break;

    /* Not using loading screens for now */
    //case appConstants.TEST_INITIALDATAFETCH_PENDING:
    //  /* Show the loading icon in the mainPane while the initial data is being fetched */
    //  _stuff.loadingInitialData = true;
    //  paneStore.emitChange();
    //  break;
    //
    //case appConstants.TEST_INITIALDATAFETCH_SUCCESS:
    //  AppDispatcher.waitFor([blockStore.dispatchToken]);
    //
    //  for(var block in item){
    //    appendToAllBlockTabProperties(block);
    //  }
    //
    //  _stuff.loadingInitialData = false;
    //  paneStore.emitChange();
    //  break;
    //
    //case appConstants.TEST_INITIALDATAFETCH_FAILURE:
    //  _stuff.loadingInitialDataError = true;
    //  paneStore.emitChange();
    //  break;

    default:
          return true
  }
});

/* Importing a store into another store is the only way to use the dispatchToken of another store in order to use waitFor, so it must be ok! */

/* Importing nodeStore to begin connecting them together and to do an initial fetch of the node data */

var blockStore = require('./blockStore');

var allBlockTabProperties = {
  'Favourites': false,
  'Configuration': false,
  'VISIBILITY': false,
};

var allEdgeTabProperties = {};

function appendToAllEdgeTabProperties(EdgeId){
  allEdgeTabProperties[EdgeId] = false;
}

function appendToAllBlockTabProperties(BlockId){
  allBlockTabProperties[BlockId] = false;
}

function setBlockTabStateTrue(BlockId){
  console.log(allBlockTabProperties[BlockId]);
  if(allBlockTabProperties[BlockId] === false) {
    allBlockTabProperties[BlockId] = true;
    console.log(allBlockTabProperties);
    /* Now need to run the function to check which tabs should be open */
    /* UPDATE: Nope, now try just add the tab to _stuff.tabState! */

    /* Try giving an object to tabState, in which it'll
    have a 'tabType' specifying if it's a block tab or an
    edge tab, and then a 'label' specifying what should
    be the tab title
     */

    var blockTabStateObject = [{
      tabType: 'block',
      label: BlockId
    }];

    _stuff.tabState = _stuff.tabState.concat(blockTabStateObject);

    /* Can run selectBlockOnClick now, since that tab wasn't open, so can jump staright to end tab */

    selectBlockOnClick();
 }
  else{
    dropdownMenuSelect(BlockId);
  }
}

function setEdgeTabStateTrue(EdgeInfo){

  console.log(allEdgeTabProperties);

  if(allEdgeTabProperties[EdgeInfo.edgeId] === false){
    allEdgeTabProperties[EdgeInfo.edgeId] = true;

    var edgeTabStateObject = [{
      tabType: 'edge',
      label: EdgeInfo.edgeId,
      fromBlock: EdgeInfo.fromBlock,
      fromBlockPort: EdgeInfo.fromBlockPort,
      toBlock: EdgeInfo.toBlock,
      toBlockPort: EdgeInfo.toBlockPort
    }];

    _stuff.tabState = _stuff.tabState.concat(edgeTabStateObject);

    selectBlockOnClick();

  }
  else{
    dropdownMenuSelect(EdgeInfo.edgeId);
  }
}

function setFavTabStateTrue(){
 if(allBlockTabProperties['Favourites'] === false){
   allBlockTabProperties['Favourites'] = true;

   var favTabStateObject = [{
     tabType: 'Favourites',
     label: 'Favourites'
   }];

   _stuff.tabState = _stuff.tabState.concat(favTabStateObject);

   selectBlockOnClick()
 }
  else if(allBlockTabProperties['Favourites'] === true){
   //console.log("fav tab was already open, so don't bother setting the state, jump to that tab instead!");

   dropdownMenuSelect("Favourites")
 }
}

function setConfigTabStateTrue(){
  if(allBlockTabProperties['Configuration'] === false){
    allBlockTabProperties['Configuration'] = true;

    var configTabStateObject = [{
      tabType: 'Configuration',
      label: 'Configuration'
    }];

    _stuff.tabState = _stuff.tabState.concat(configTabStateObject);

    selectBlockOnClick();
  }
  else if(allBlockTabProperties['Configuration'] === true){
    //console.log("config tab was already open, so don't bother setting the state, jump to that tab instead!");

    dropdownMenuSelect("Configuration");
    /* dropdownMenuSelect uses the label attribute rather than the object key name */
  }
}

function setBlockLookupTableTabStateTrue(){
  if(allBlockTabProperties['VISIBILITY'] === false){
    allBlockTabProperties['VISIBILITY'] = true;

    var blockLookupTableTabStateObject = [{
      tabType: 'VISIBILITY',
      label: 'VISIBILITY'
    }];

    _stuff.tabState = _stuff.tabState.concat(blockLookupTableTabStateObject);

    selectBlockOnClick();
  }
  else if(allBlockTabProperties['VISIBILITY'] === true){
    dropdownMenuSelect("VISIBILITY");
  }
}

var removeBlockTab = function(selectedTabIndex){

  /* Don't even need to pass selectedTabIndex, can just
  get it from the store!
   */

  var tabName;

  if(_stuff.tabState[selectedTabIndex].label === undefined){
    /* Tis a block tab, or a fav/config tab */
    tabName = _stuff.tabState[selectedTabIndex];
    console.log(tabName);
  }
  else{
    tabName = _stuff.tabState[selectedTabIndex].label;

  }
  /* Checking if it's a edge tab or a block tab */

  if(_stuff.tabState[selectedTabIndex].tabType === 'edge'){
    allEdgeTabProperties[tabName] = false;
  }
  else{
    allBlockTabProperties[tabName] = false; /* Setting the state of the tab to be removed to be false */
  }

  /* Trying to return a new array when removing a tab */

  function checkTabLabel(tabObject){
    return tabObject.label !== tabName;
  }

  _stuff.tabState = _stuff.tabState.filter(checkTabLabel);

  /* Will most liekly need to shift selectedTabIndex down by
  one, since the length of tabState has gone down by one due
  to removing a tab?
   */

  if(selectedTabIndex === _stuff.tabState.length) {
    console.log(_stuff.selectedTabIndex);

    _stuff.selectedTabIndex = _stuff.selectedTabIndex - 1;
    console.log(_stuff.selectedTabIndex);

  }

};

function toggleSidebar(){
  if(_stuff.sidebarOpen === true){
    _stuff.sidebarOpen = false;
  }
  else if(_stuff.sidebarOpen === false){
    _stuff.sidebarOpen = true;
  }
}

function windowWidthMediaQueryChanged(sidebarOpen){
  _stuff.sidebarOpen = sidebarOpen;
}

function checkBlockForInitialEdges(blockAttributeObject){

  for(var attribute in blockAttributeObject){
    if(blockAttributeObject[attribute].tags !== undefined){
      for(var i = 0; i < blockAttributeObject[attribute].tags.length; i++){
        if(blockAttributeObject[attribute].tags[i].indexOf('flowgraph:inport') !== -1){
          if(blockAttributeObject[attribute].value.indexOf('ZERO') === -1 ){
            /* Then it's connected to another block via an edge! */

            var inportBlock = blockAttributeObject['BLOCKNAME'].value;
            var inportBlockPort = attribute;

            var outportBlock = blockAttributeObject[attribute].value
              .slice(0, blockAttributeObject[attribute].value.indexOf('.'));
            var outportBlockPort = blockAttributeObject[attribute].value
              .slice(blockAttributeObject[attribute].value.indexOf('.') + 1);

            var edgeLabel = outportBlock + outportBlockPort + inportBlock + inportBlockPort;

            appendToAllEdgeTabProperties(edgeLabel);

          }
        }
      }
    }
  }

}

module.exports = paneStore;
