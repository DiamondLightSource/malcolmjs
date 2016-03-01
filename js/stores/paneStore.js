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
  //passSidePane: null
  updatedBlockContent: null,
  blockTabState: [],
  sidebarOpen: false,
  loadingInitialData: true,
  loadingInitialDataError: false
};

var _handles = {
  passSidePane: null
};

var passSidePane = function(ReactComponent){ /* Testing to see if saving it in state would work, it did! :D*/

  _handles.passSidePane = ReactComponent;

  //selectBlockOnClick(ReactComponent)
};

//var allBlockContent = {
//  redBlockContent: {
//    name: "Red block",
//    hack: "redBlockTabOpen",
//    info: {work: {height: "100 pixels", width: "100 pixels", ChannelName: "Channel name"}}
//  },
//  blueBlockContent: {
//    name: "Blue block",
//    hack: "blueBlockTabOpen",
//    info: {
//      work: {height: "100 pixels", width: "100 pixels"}
//    }
//  },
//  greenBlockContent: {
//    name: "Green block",
//    hack: "greenBlockTabOpen",
//    info: {work: {height: "100 pixels", width: "100 pixels"}
//    }
//  }
//};
//
//var compareCurrentPaneStoreBlockContentAndDeviceStore = function(){
//  for(var key in allBlockContent){
//    if(allBlockContent[key].hack === _stuff.updatedBlockContent.hack){
//      for(var subKey in allBlockContent[key].info.work){
//        if(allBlockContent[key].info.work[subKey] === _stuff.updatedBlockContent.info.work[subKey]){
//          /* Do nothing*/
//          //console.log('the attributes are the same, no need to update paneStore\'s allBlockContent object')
//        }
//        else{/* ie, if they aren't equal, update the attribute in allBlockContent in paneStore to the newer version! */
//          //console.log('the attribures aren\'t the same, requires attribute update, getting the newer data from deviceStore');
//          allBlockContent[key].info.work[subKey] = _stuff.updatedBlockContent.info.work[subKey]
//        }
//      }
//    }
//    else{
//      /* Do nothing */
//    }
//  }
//};

var favContent = {
  name: "Favourites tab",
  label: 'Favourites',
  hack: "favTabOpen",
  info: {
    block1: {
      name: "Block 1",
      stuff1: "meh",
      stuff2: "bleh"
      },
    block2: {
      name: "Block 2",
      stuff1: "mah",
      stuff2: "blah"
    }
  }
};

var configContent = {
  name: "Configuration tab",
  label: 'Configuration',
  hack: "configTabOpen",
  info: {
    Configurations: {
      config1: "config1",
      config2: "config2"
    },
    SystemInformation: {
      firmwareVersion: "numbers & letters"
    }
  }
};

var dropdownMenuSelect = function(tab){
  //var findTheIndex = _stuff.tabState.indexOf(item);
  ////this.props.changeTab(findTheIndex)
  //_stuff.selectedTabIndex = findTheIndex;
  /* Note that 'tab' is the nodeId, not the React element or anything like that */


  //var keepingSidePane = ReactComponent;
  //keepSidePane(ReactComponent);
  //console.log(keepingSidePane);
  console.log("dropdown menu select");
  console.log(tab);

  for(var i = 0; i < _stuff.tabState.length; i++){
    console.log(_stuff.tabState[i]);
    if(_stuff.tabState[i] === tab){              /* Changed from .name to .label */
      var findTheIndex = i
    }
  }
  console.log(findTheIndex);
  //
  //var findTheIndex = this.props.list.indexOf(item);
  _handles.passSidePane.refs.panel.setSelectedIndex(findTheIndex);
  //keepSidePane(ReactComponent)
};

var selectBlockOnClick = function(){
  var tabStateLength = _stuff.tabState.length;
  _handles.passSidePane.refs.panel.setSelectedIndex(tabStateLength - 1)
};

//var changeSomeInfo = function(){
//  allBlockContent.redBlockContent.info.work.height = "500 pixels";
//  allBlockContent.redBlockContent.info.work.width = "250 pixels";
//  allBlockContent.redBlockContent.info.work['depth'] = "10 pixels"
//};
//
//var updatePaneStoreAllBlockContent = function(newBlockContent){
//  allBlockContent = newBlockContent;
//};




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
  //getRedBlockTabClicked: function(){
  //  return allBlockTabProperties.redBlockTabOpen;
  //},
  //getBlueBlockTabClicked: function(){
  //  return allBlockTabProperties.blueBlockTabOpen;
  //},
  //getGreenBlockTabClicked: function(){
  //  return allBlockTabProperties.greenBlockTabOpen;
  //},
  getFavTabOpen:function(){
    /* Changed to use allNodeTabProperties instead of allBlockTabProperties */
    //return allBlockTabProperties.favTabOpen;
    return allBlockTabProperties.Favourites;
  },
  getConfigTabOpen: function(){
    /* Changed to use allNodeTabProperties instead of allBlockTabProperties */
    //return allBlockTabProperties.configTabOpen;
    return allBlockTabProperties.Configuration;
  },
  getFavContent: function(){
    return favContent;
  },
  getConfigContent: function(){
    return configContent;
  },
  getSelectedTabIndex: function(){
    return _stuff.selectedTabIndex;
  },

  getSidebarOpenState: function(){
    return _stuff.sidebarOpen;
  },

  getAllBlockTabOpenStates: function(){
    return allBlockTabProperties;
  },
  getAllBlockTabInfo: function(){
    return allBlockTabInfo;
  },
  getIfLoadingInitialData: function(){
    return _stuff.loadingInitialData;
  },
  getIfLoadingInitialDataError: function(){
    return _stuff.loadingInitialDataError;
  }
});



paneStore.dispatchToken = AppDispatcher.register(function(payload){
  var action = payload.action;
  var item = action.item;
  switch(action.actionType){

    case appConstants.PASS_SIDEPANE:
      //console.log(payload);
      //console.log(action);
      //console.log(item);
      passSidePane(item);
          break;

    //case appConstants.REMOVE_TAB:
    //  console.log(payload);
    //  console.log(action);
    //  console.log(item);
    //  removeTab(item);
    //  paneStore.emitChange();
    //  console.log(_stuff.tabState);
    //  console.log(allBlockTabProperties.redBlockTabOpen);
    //  break;

    case appConstants.DROPDOWN_SELECT:
      //var tab = item.item;
      //var component = item.component;

      console.log(payload);
      console.log(action); /* this tells you what the name of the selected tab is, for debugging purposes*/
      dropdownMenuSelect(item);
      paneStore.emitChange();
      break;

    case appConstants.FAVTAB_OPEN:
      console.log(payload);
      console.log(item);
      /* Want to replace with a better version, now that I'm doing node tabs */
      //changeFavTabState();
      setFavTabStateTrue();
      console.log(allBlockTabProperties.Favourites);
      paneStore.emitChange();
      break;

    case appConstants.CONFIGTAB_OPEN:
      console.log(payload);
      console.log(item);
      /* Replacing so I don't have to go through checkWhichBlockTabsOpen() */
      //changeConfigTabState();
      setConfigTabStateTrue();
      console.log(allBlockTabProperties.Configuration);
      paneStore.emitChange();
      break;

    case appConstants.UPDATEBLOCKCONTENT_VIASERVER:
      console.log(payload);
      console.log(item);
      _stuff["updatedBlockContent"] = item;
      console.log(_stuff.updatedBlockContent);
      compareCurrentPaneStoreBlockContentAndDeviceStore();
      paneStore.emitChange();
      break;

    //case appConstants.FETCHINITIAL_BLOCKDATA:
    //  console.log(payload);
    //  console.log(item);
    //  getInitialBlockDataFromBlockStore();
    //  console.log(allBlockTabInfo);
    //  paneStore.emitChange();
    //  break;

    case appConstants.OPEN_BLOCKTAB:
      console.log(payload);
      console.log(item);

      setBlockTabStateTrue(item);
      //_stuff.tabState.push(allNodeTabInfo[item]);
      /* Seeing if I can cut out checkWhichNodeTabsOpen and cut straight to adding to _stuff.tabState */
      //checkWhichNodeTabsOpen();
      //selectBlockOnClick();
      console.log(_stuff.tabState);
      paneStore.emitChange();
      break;

    case appConstants.REMOVE_BLOCKTAB:
      console.log(payload);
      console.log(item);
      removeBlockTab(item);
      console.log(_stuff.tabState);
      paneStore.emitChange();
      break;

    case appConstants.TOGGLE_SIDEBAR:
      console.log(payload);
      console.log(item);
      toggleSidebar();
      paneStore.emitChange();
      break;

    case appConstants.WINDOWWIDTH_MEDIAQUERYCHANGED:
      console.log(payload);
      console.log(item);
      windowWidthMediaQueryChanged(item);
      paneStore.emitChange();
      break;

    case appConstants.OPEN_EDGETAB:
      console.log(payload);
      console.log(item);
      if(allEdgeTabProperties[item.edgeId] === false){
        allEdgeTabProperties[item.edgeId] = true;

        createObjectForEdgeTabContent({
          fromBlock: item.fromBlock,
          fromBlockPort: item.fromBlockPort,
          toBlock: item.toBlock,
          toBlockPort: item.toBlockPort
        });
        selectBlockOnClick();
      }
      else{
        //console.log("edge tab is already open, jump to it");
        /* Tab is already open, so jump to it! */
        /* Need to remove the spaces in the edge id first */


        var spacelessEdgeId = item.edgeId.replace(/\s/g, '');

        dropdownMenuSelect(spacelessEdgeId);
      }
      paneStore.emitChange();
      break;

    case appConstants.ADD_ONESINGLEEDGETOALLBLOCKINFO:
      appendToAllEdgeTabProperties(item.edgeLabel);
      paneStore.emitChange();
      break;

    case appConstants.DELETE_EDGE:
        if(allEdgeTabProperties[item.edgeId] === true){
          console.log("need to remove edge tab too");
          /* Do the tab removal stuff */
          //console.log("that edge tab was open, so now we need to remove that tab");
          for(var i = 0; i < _stuff.tabState.length; i++){
            if(_stuff.tabState[i].tabType === 'edge'){
              allEdgeTabProperties[item.edgeId] = false;
              var newTabs = _stuff.tabState;  /*setting up the current state of tabs, and then getting rid of the currently selected tab*/
              newTabs.splice(i, 1);
              _stuff.tabState = newTabs;
            }
          }
        }
      paneStore.emitChange();
      break;

    case appConstants.ADDTO_ALLBLOCKINFO:
      appendToAllBlockTabProperties(item);
      paneStore.emitChange();
      break;

    /* Trying to add waitFor blockStore in order to update allBlockTabInfo */

    //case appConstants.ADD_ONESINGLEEDGETOALLBLOCKINFO:
    //  AppDispatcher.waitFor([blockStore.dispatchToken]);
    //  getInitialBlockDataFromBlockStore();
    //  /* Add the edge to allEdgeTabProperties */
    //  allEdgeTabProperties[String(item.fromBlock) + String(item.fromBlockPort) + String(item.toBlock) + String(item.toBlockPort)] = false;
    //  /* Try simply resetting the references in tabState */
    //  resetTabStateReferences();
    //  paneStore.emitChange();
    //  break;
    //
    //case appConstants.ADDTO_ALLBLOCKINFO:
    //  AppDispatcher.waitFor([blockStore.dispatchToken]);
    //  getInitialBlockDataFromBlockStore();
    //  /* Add that block to allBlockTabProperties */
    //  appendToAllBlockTabProperties(item);
    //  /* Try simply resetting the references in tabState */
    //  resetTabStateReferences();
    //  console.log(item);
    //  paneStore.emitChange();
    //  break;
    //
    //case appConstants.DELETE_EDGE:
    //  AppDispatcher.waitFor([blockStore.dispatchToken]);
    //  console.log("delete edge");
    //  getInitialBlockDataFromBlockStore();
    //  resetTabStateReferences();
    //  console.log(allEdgeTabProperties[item.edgeId]);
    //  /* Also need to remove the edges tab if it is open */
    //  if(allEdgeTabProperties[item.edgeId] === true){
    //    console.log("need to remove edge tab too");
    //    /* Do the tab removal stuff */
    //    //console.log("that edge tab was open, so now we need to remove that tab");
    //    for(var i = 0; i < _stuff.tabState.length; i++){
    //      if(_stuff.tabState[i].tabType === 'edge'){
    //        allEdgeTabProperties[item.edgeId] = false;
    //        var newTabs = _stuff.tabState;  /*setting up the current state of tabs, and then getting rid of the currently selected tab*/
    //        newTabs.splice(i, 1);
    //        _stuff.tabState = newTabs;
    //      }
    //    }
    //  }
      paneStore.emitChange();
      break;

    //case appConstants.INTERACTJS_DRAG:
    //  AppDispatcher.waitFor([blockStore.dispatchToken]);
    //  getInitialBlockDataFromBlockStore();
    //  /* Try simply resetting the references in tabState */
    //  resetTabStateReferences();
    //  paneStore.emitChange();
    //  break;

    /* WebAPI use */

    case appConstants.TEST_INITIALDATAFETCH_PENDING:
      /* Show the loading icon in the mainPane while the initial data is being fetched */
      _stuff.loadingInitialData = true;
      paneStore.emitChange();
      break;

    case appConstants.TEST_INITIALDATAFETCH_SUCCESS:
      AppDispatcher.waitFor([blockStore.dispatchToken]);
      _stuff.loadingInitialData = false;
      paneStore.emitChange();
      break;

    case appConstants.TEST_INITIALDATAFETCH_FAILURE:
      _stuff.loadingInitialDataError = true;
      paneStore.emitChange();
      break;

    //case appConstants.REDBLOCKTAB_OPEN:
    //  console.log(payload);
    //  console.log(action);
    //  changeRedBlockTabState();
    //  console.log(allBlockTabProperties.redBlockTabOpen);
    //  //checkWhichBlockTabsOpen();
    //  paneStore.emitChange();
    //  break;
    //
    //case appConstants.BLUEBLOCKTAB_OPEN:
    //  console.log(payload);
    //  console.log(action);
    //  changeBlueBlockTabState();
    //  console.log(allBlockTabProperties.blueBlockTabOpen);
    //  paneStore.emitChange();
    //  break;
    //
    //case appConstants.GREENBLOCKTAB_OPEN:
    //  console.log(payload);
    //  console.log(action);
    //  changeGreenBlockTabState();
    //  console.log(allBlockTabProperties.greenBlockTabOpen);
    //  paneStore.emitChange();
    //  break;
    //case appConstants.APPENDSTUFF_FORNEWBLOCK:
    //  console.log(payload);
    //  console.log(item);
    //  /*functions that append to the various objects I need to append*/
    //  appendToAllBlockTabProperties(item);
    //  paneStore.emitChange();
    //  appendToAllBlockContent(item);
    //  paneStore.emitChange();
    //  appendToPossibleTabsToOpen(item);
    //  paneStore.emitChange();
    //  appendToPossibleTabsToRemove(item);
    //  paneStore.emitChange();
    //  appendToPossibleBlockCases(item);
    //  paneStore.emitChange();
    //  checkWhichBlockClicked(item);
    //  paneStore.emitChange();
    //  break;
    //case appConstants.CHANGE_INFO:
    //  console.log(payload);
    //  console.log(item);
    //  changeSomeInfo();
    //  paneStore.emitChange();
    //  break;
    //case appConstants.ADD_TAB:
    //  console.log(payload);
    //  console.log(action);
    //  addTab(item);
    //  paneStore.emitChange();
    //  console.log(_stuff.tabState);
    //  break;
    //case appConstants.PASS_DISPATCHMARKER:
    //  console.log(payload);
    //  console.log(item);
    //  checkWhichBlockClicked(item);
    //  paneStore.emitChange();
    //  break;

    default:
          return true
  }
});

/* Importing a store into another store is the only way to use the dispatchToken of another store in order to use waitFor, so it must be ok! */

//var deviceStore = require('./deviceStore');
//
//var getBlockContentFromDeviceStore = function(){
//  _stuff["updatedBlockContent"] = deviceStore.getRedBlockContent()
//};
//
///* Put paneStore.dispatchToken in front of the whole swicth case above */
//
////paneStore.dispatchToken = AppDispatcher.register(function(payload){
////  /* Old stuff for deviceStore */
////
////  //if(payload.action.actionType === 'PASSNAMEOFCHANNELTHATSBEEN_SUBSCRIBED'){
////  //
////  //  AppDispatcher.waitFor([deviceStore.dispatchToken]);
////  //
////  //  console.log(payload);
////  //  console.log(payload.action.item);
////  //  getBlockContentFromDeviceStore();
////  //  compareCurrentPaneStoreBlockContentAndDeviceStore();
////  //  paneStore.emitChange();
////  //}
////
////  /* No need to do a switch statement, can just do a long if statement with lots of OR operators */
////
////  //if(payload.action.actionType === appConstants.ADDTO_ALLBLOCKINFO
////  //  //|| appConstants.ADD_ONESINGLEEDGETOALLBLOCKINFO
////  //  //|| appConstants.CHANGE_BLOCKPOSITION
////  //){
////  //  AppDispatcher.waitFor([blockStore.dispatchToken]);
////  //
////  //  console.log(payload);
////  //  console.log(payload.action.item);
////  //  getInitialBlockDataFromBlockStore();
////  //  paneStore.emitChange();
////  //}
////
////});

/* Importing nodeStore to begin connecting them together and to do an initial fetch of the node data */

var blockStore = require('./blockStore');

var allBlockTabInfo;

/* This will need an append function at some point */
/* Yeahhh, this is why a new tab won't open when a new block is added, need to append to this somehow */
var allBlockTabProperties = {
  'Favourites': false,
  'Configuration': false,
  'Gate1': false,
  'TGen1': false,
  'PComp1': false
};

var allEdgeTabProperties = {
  'Gate1outTGen1ena': false,
};

function appendToAllEdgeTabProperties(EdgeId){
  allEdgeTabProperties[EdgeId] = false;
}

function appendToAllBlockTabProperties(BlockId){
  allBlockTabProperties[BlockId] = false;
}

var setBlockTabStateTrue = function(BlockId){
  if(allBlockTabProperties[BlockId] === false) {
    allBlockTabProperties[BlockId] = true;
    console.log(allBlockTabProperties);
    /* Now need to run the function to check which tabs should be open */
    /* UPDATE: Nope, now try just add the tab to _stuff.tabState! */

    _stuff.tabState.push(BlockId);

    /* Can run selectBlockOnClick now, since that tab wasn't open, so can jump staright to end tab */

    selectBlockOnClick();
 }
  else{
    //console.log("tab state was already true, so don't bother changing it to true");
    /* Need to have the tab jump to the newly selected node, instead of just jumping to the end tab */
    /* Could try using dropdownMenuSelect? */

    dropdownMenuSelect(BlockId);
  }
};

//function setEdgeTabStateTrue(EdgeId){
//  console.log(allEdgeTabProperties);
//  if(allEdgeTabProperties[EdgeId] === false){
//    allEdgeTabProperties[EdgeId] = true;
//  }
//  else{
//    console.log("edge tab is already open, jump to it");
//    /* Tab is already open, so jump to it! */
//    /* Need to remove the spaces in the edge id first */
//
//    /* Changed edge id's to be spaceless to prevent this hassle, got too annoying when dealing with removing tabs */
//    //var spacelessEdgeId = EdgeId.replace(/\s/g, '');
//    //console.log(spacelessEdgeId);
//
//    dropdownMenuSelect(EdgeId);
//  }
//}

function setFavTabStateTrue(){
 if(allBlockTabProperties['Favourites'] === false){
   allBlockTabProperties['Favourites'] = true;

   _stuff.tabState.push('Favourites');

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

    _stuff.tabState.push('Configuration');

    selectBlockOnClick();
  }
  else if(allBlockTabProperties['Configuration'] === true){
    //console.log("config tab was already open, so don't bother setting the state, jump to that tab instead!");

    dropdownMenuSelect("Configuration");
    /* dropdownMenuSelect uses the label attribute rather than the object key name */
  }
}

function createObjectForEdgeTabContent(EdgeInfo){
  var edgeLabel = String(EdgeInfo.fromBlock) + String(EdgeInfo.fromBlockPort) + String(EdgeInfo.toBlock) + String(EdgeInfo.toBlockPort);
  var edgeTabObject = {
    'tabType': 'edge',
    'label': edgeLabel,
    'edgeId': edgeLabel
  };
  //for(var i = 0; i < allBlockTabInfo[EdgeInfo.fromBlock].outports.length; i++){
  //  if(allBlockTabInfo[EdgeInfo.fromBlock].outports[i].name === EdgeInfo.fromBlockPort){
  //    edgeTabObject[EdgeInfo.fromBlock] = (JSON.parse(JSON.stringify(allBlockTabInfo[EdgeInfo.fromBlock].outports[i])));
  //  }
  //}
  //
  //for(var j = 0; j < allBlockTabInfo[EdgeInfo.toBlock].inports.length; j++){
  //  if(allBlockTabInfo[EdgeInfo.toBlock].inports[j].name === EdgeInfo.toBlockPort){
  //    edgeTabObject[EdgeInfo.toBlock] = (JSON.parse(JSON.stringify(allBlockTabInfo[EdgeInfo.toBlock].inports[j])));
  //  }
  //}

  assign(edgeTabObject, EdgeInfo);

  _stuff.tabState.push(edgeTabObject);
}

/* Note that this function also adds the tabs to SidePane */

//var checkWhichBlockTabsOpen = function(){
//  for (var key in allBlockTabProperties){
//    //console.log(key);
//    //console.log(allNodeTabProperties[key]);
//    if(allBlockTabProperties[key] === true) {
//      //console.log('just before starting the tabState checker loop');
//      if(_stuff.tabState.length === 0){
//        //console.log('tabState was empty, tab is now open');
//
//        /* Not sure if there's a need for a lookup table, just go straight to allNodeTabInfo using key? */
//
//        //lookupWhichNodeTabToOpen(key);/*Note that this by itself doesn't do anything in terms of the loop, instead it returns what was updatedTabBlocks in the old switch statement, so it needs to be wherever updateTabBlocks went before */
//        //
//        ////var updatedBlockTabsOpen = blockTabsOpen.concat(key);
//        //console.log(lookupWhichNodeTabToOpen(key));
//        //_stuff.tabState = _stuff.tabState.concat(lookupWhichNodeTabToOpen(key));
//
//        _stuff.tabState.push(allBlockTabInfo[key]);
//        //console.log(_stuff.tabState);
//
//        /* Tab wasn't open, so it was added to the end, so just jump to the last tab*/
//
//        selectBlockOnClick()
//      }
//      else{
//        for (var i = 0; i < _stuff.tabState.length; i++) {
//          //console.log('in the non-empty tabState checker loop');
//          //console.log(_stuff.tabState.length);
//          //console.log(i);
//          //console.log(_stuff.tabState[i].label);
//          //console.log(key);
//          //console.log(key[label]);
//          if (_stuff.tabState[i].label === key) {
//            //console.log(_stuff.tabState[i].label);
//            //console.log(key.label);
//            //console.log("tab is already open from before, don't add, break statement occurring");
//            /* Here, I need to then jump to the tab corresponding to the node I clicked */
//            /* But wait, this whole loop goes through EVERY node tab, regardless of if it's open or not, so it'll jump to every tab that is already open, leaving it to be on the very last tab that is open! =/ */
//            /* I think I need to write a better way of seeing which tabs are opening, and appending them to _stuff.tabState than this loop */
//            break
//          }
//          else if(_stuff.tabState[i].label !== key){
//            //console.log('key isnt equal to the ith position, move onto the next value in tabState');
//            //console.log(_stuff.tabState.length);
//            //console.log(i);
//            if(i === _stuff.tabState.length - 1){
//              //console.log('tabState didnt have this tab, tab is now open');
//              //console.log(key);
//              //console.log("here's the returned value of lookupWhichNodeTabToOpen(key)");
//              //console.log(lookupWhichNodeTabToOpen(key));
//              //
//              ////var updatedBlockTabsOpen = blockTabsOpen.concat(key);
//              //console.log(lookupWhichNodeTabToOpen(key));
//              //console.log(blockTabsOpen);
//              //_stuff.tabState = _stuff.tabState.concat(lookupWhichNodeTabToOpen(key)); /* This is the line that breaks everything and causes the infinite loop */
//
//              _stuff.tabState.push(allBlockTabInfo[key]);
//              //console.log(_stuff.tabState);
//
//              /* Same as the other situation, tab wasn't open so it was added to the end, so just jump to the last tab*/
//
//              selectBlockOnClick()
//            }
//          }
//        }
//        //console.log('finished the tabState checker loop')
//      }
//    }
//    else{
//      //console.log('tab is not open')
//    }
//  }
//
//  //console.log(blockTabsOpen);
//  //console.log(lookupWhichTabToOpen(key)); /* We've finished the loop, but it still seems that the variable 'key' from the loop still exists, and its the last value it was in the loop, 'configTab'! */
//
//  //blockTabsOpen = []; /* resetting blockTabsOpen for the next time a tab is opened
//  // Actually, no need since at the start of the function it is reset*/
//
//  //return updatedBlockTabsOpen;
//
//  //selectBlockOnClick()
//
//};

var removeBlockTab = function(selectedTabIndex){

  if(_stuff.tabState[selectedTabIndex].label === undefined){
    /* Tis a block tab, or a fav/config tab */
    var tabName = _stuff.tabState[selectedTabIndex];
    console.log(tabName);
  }
  else{
    var tabName = _stuff.tabState[selectedTabIndex].label;

  }
  /* Checking if it's a edge tab or a block tab */

  if(_stuff.tabState[selectedTabIndex].tabType === 'edge'){
    //console.log("removing an edge tab");

    //var spacelessEdgeTabName = tabName.replace(/\s/g, '');

    /* Hmmm, I'm using the edge id WITH spaces in allEdgeTabProperties, but I'm using the spaceless
    edge id in tabState, is that a good idea?...
     */
    allEdgeTabProperties[tabName] = false;
  }
  else{
    //console.log("removing a block tab");
    allBlockTabProperties[tabName] = false; /* Setting the state of the tab to be removed to be false */
  }

  //allBlockTabProperties[tabName] = false; /* Setting the state of the tab to be removed to be false */
  var newTabs = _stuff.tabState;  /*setting up the current state of tabs, and then getting rid of the currently selected tab*/
  newTabs.splice(selectedTabIndex, 1);
  _stuff.tabState = newTabs;
};

//var getInitialBlockDataFromBlockStore = function(){
//  //allBlockTabInfo = blockStore.getAllBlockInfoForInitialBlockData();
//  allBlockTabInfo = (JSON.parse(JSON.stringify(blockStore.getAllBlockInfoForInitialBlockData())));
//  /* Try using Object.assign instead to not fetch position data as well from allBlockInfo */
//  //var intermediateBlockTabInfo = (JSON.parse(JSON.stringify(blockStore.getAllBlockInfoForInitialBlockData())));
//  ///* Now need to loop over each block object and 'remove' the position attribute */
//  //allBlockTabInfo = assign({}, intermediateBlockTabInfo);
//};

function toggleSidebar(){
  if(_stuff.sidebarOpen === true){
    _stuff.sidebarOpen = false;
  }
  else if(_stuff.sidebarOpen === false){
    _stuff.sidebarOpen = true;
  }
}

function windowWidthMediaQueryChanged(sidebarOpen){
  //if(_stuff.sidebarOpen === true){
  //  _stuff.sidebarOpen = false;
  //}
  //else if(_stuff.sidebarOpen === false){
  //  console.log("sidebar was already closed, so don't bother setting it false even though the window width has changed");
  //}
  //console.log(_stuff.sidebarOpen)

  _stuff.sidebarOpen = sidebarOpen;
}

function copyTabState(){
  _stuff['newTabState'] = _stuff.tabState.slice();
}

function resetTabStateReferences(){
  for(var i = 0; i < _stuff.tabState.length; i++){
    if(_stuff.tabState[i].label === 'Configuration' || _stuff.tabState[i].label === 'Favourites'){
      //console.log("don't copy any data over, since these tabs' contents don't exist in allBlockInfo!");
    }
    else if(_stuff.tabState[i].tabType === 'edge'){
      //console.log("also do nothing, since this info is created from allBlockTabInfo");
    }
    else {
      _stuff.tabState[i] = allBlockTabInfo[_stuff.tabState[i].label];
    }
  }
}

module.exports = paneStore;


//var favAndConfigTabProperties = {
//  favTabOpen: false,
//  configTabOpen: false
//};
//var changeRedBlockTabState = function(){
//  if(allBlockTabProperties.redBlockTabOpen === false) {
//    allBlockTabProperties.redBlockTabOpen = true;
//    checkWhichBlockTabsOpen();
//    console.log(_handles.passSidePane)
//  }
//  else{
//
//  }
//};
//
//var changeBlueBlockTabState = function(){
//  if(allBlockTabProperties.blueBlockTabOpen === false){
//    allBlockTabProperties.blueBlockTabOpen = true;
//    checkWhichBlockTabsOpen()
//  }
//  else{
//
//  }
//};
//
//var changeGreenBlockTabState = function(){
//  if(allBlockTabProperties.greenBlockTabOpen === false){
//    allBlockTabProperties.greenBlockTabOpen = true;
//    checkWhichBlockTabsOpen()
//  }
//  else{
//
//  }
//};
//var possibleNodeTabsToOpen = {
//  'Gate1': function(NodeId){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(allNodeTabInfo[NodeId]); /*not sure if blockTabsOpen will get passed through... :/*/
//    return updatedBlockTabsOpen
//  },
//  'TGen1': function(NodeId){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(allNodeTabInfo[NodeId]);
//    return updatedBlockTabsOpen
//  },
//  'PComp1': function(NodeId){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(allNodeTabInfo[NodeId]);
//    return updatedBlockTabsOpen
//  },
//  'favTabOpen': function(){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(favContent);
//    return updatedBlockTabsOpen
//  },
//  'configTabOpen': function(){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(configContent);
//    return updatedBlockTabsOpen
//  }
//};
//var appendToPossibleNodeTabsToOpen = function(dispatchMarker){
//  possibleTabsToOpen[dispatchMarker] = function(){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent[dispatchMarker]);
//    return updatedBlockTabsOpen
//  }
//};
//function lookupWhichNodeTabToOpen(key){ /*hopefully it'll get passed the key from the loop fine when it gets called :P*/
//  /* perhaps pass blockTabsOpen to possibleTabsOpen somehow?*/
//  if(typeof possibleNodeTabsToOpen[key] !== 'function'){
//    throw new Error('Invalid key');
//  }
//  console.log('deciding which tab to open lookup is working!');
//  return possibleNodeTabsToOpen[key](key)
//}
//var checkFavAndConfigTabsOpen = function() {
//  for (var key in favAndConfigTabProperties) {
//    console.log(key);
//    console.log(favAndConfigTabProperties[key]);
//    if (favAndConfigTabProperties[key] === true) {
//      console.log("just before starting the tabState checker loop");
//      if (_stuff.tabState.length === 0) {
//        console.log("tabState was empty, tab is now open");
//        var blockTabsOpen = [];
//        switch (key) {
//          case 'favTabOpen':
//            var updatedBlockTabsOpen = blockTabsOpen.concat(favContent);
//            break;
//          case 'configTabOpen':
//            var updatedBlockTabsOpen = blockTabsOpen.concat();
//            break;
//          default:
//            return 'default'
//        }
//        console.log(updatedBlockTabsOpen);
//        _stuff.tabState = _stuff.tabState.concat(updatedBlockTabsOpen);
//      }
//      else {
//        for (var i = 0; i < _stuff.tabState.length; i++) {
//          console.log('in the non-empty tabState checker loop');
//          console.log(_stuff.tabState.length);
//          console.log(i);
//          if (_stuff.tabState[i].hack === key) {
//            console.log("tab is already open from before, don't add, break statement occurring");
//            break
//          }
//          else if (_stuff.tabState[i].hack !== key) {
//            console.log('key isnt equal to the ith position, move onto the next value in tabState');
//            console.log(_stuff.tabState.length);
//            console.log(i);
//            if (i === _stuff.tabState.length - 1) {
//              console.log('tabState didnt have this tab, tab is now open');
//              var blockTabsOpen = [];
//              switch (key) {
//                case 'favTabOpen':
//                  var updatedBlockTabsOpen = blockTabsOpen.concat(favContent);
//                  break;
//                case 'configTabOpen':
//                  var updatedBlockTabsOpen = blockTabsOpen.concat();
//                  break;
//                default:
//                  return 'default'
//              }
//              console.log(updatedBlockTabsOpen);
//              _stuff.tabState = _stuff.tabState.concat(updatedBlockTabsOpen);
//            }
//          }
//        }
//        console.log('finished the tabState checker loop')
//      }
//    }
//    else {
//      console.log('tab is not open');
//      /* ie, the tab hasn't been clicked and it's state is false, so don't show the tab*/
//    }
//  }
//};

//var appendToAllBlockContent = function(dispatchMarker){
//  allBlockContent[dispatchMarker] = {
//    name: "Whatever",
//    hack: dispatchMarker,
//    info: {work: {something: "something", alsoSomething: "alsoSomething"}}
//  }
//};
//var appendToAllBlockTabProperties = function(dispatchMarker){
//  console.log('appending to allBlockTabProperties');
//  console.log(allBlockTabProperties);
//  allBlockTabProperties[dispatchMarker] = false;
//  console.log(allBlockTabProperties)
//};
//var addTab = function(newtab){
//  /* set state of tabs somewhere here*/
//  var newTabs = _stuff.tabState.concat(newtab);
//  _stuff.tabState = newTabs;
//  /* could you just skip the variable newTabs and set _stuff.tabState equal
//   itself concatenated?
//   */
//};

//var allBlockTabProperties = {
//  redBlockTabOpen: false,
//  blueBlockTabOpen: false,
//  greenBlockTabOpen: false,
//  favTabOpen: false,
//  configTabOpen: false
//};

//var changeFavTabState = function(){
//  console.log(allBlockTabProperties.favTabOpen);
//  if(allBlockTabProperties.favTabOpen === false) {
//    allBlockTabProperties.favTabOpen = true;
//    console.log(allBlockTabProperties.favTabOpen);
//    checkWhichBlockTabsOpen();
//    /* function that checks if fav tab or config are already open*/
//  }
//  else {
//
//  }
//};
//
//var changeConfigTabState = function(){
//  console.log(allBlockTabProperties.configTabOpen);
//  if(allBlockTabProperties.configTabOpen === false) {
//    allBlockTabProperties.configTabOpen = true;
//    console.log(allBlockTabProperties.configTabOpen);
//    checkWhichBlockTabsOpen()
//  }
//};
//
//var checkWhichBlockTabsOpen = function(){
//  var blockTabsOpen = []; /* fill this array with all the block tabs open, and then proceed to concatenate the original tab list with this one*/
//  for (var key in allBlockTabProperties){
//    console.log(key);
//    console.log(allBlockTabProperties[key]);
//    if(allBlockTabProperties[key] === true) {
//      console.log('just before starting the tabState checker loop');
//      if(_stuff.tabState.length === 0){
//        console.log('tabState was empty, tab is now open');
//        var blockTabsOpen = [];
//        lookupWhichTabToOpen(key);/*Note that this by itself doesn't do anything in terms of the loop, instead it returns what was updatedTabBlocks in the old switch statement, so it needs to be wherever updateTabBlocks went before */
//
//        //var updatedBlockTabsOpen = blockTabsOpen.concat(key);
//        console.log(lookupWhichTabToOpen(key));
//        _stuff.tabState = _stuff.tabState.concat(lookupWhichTabToOpen(key));
//        console.log(_stuff.tabState);
//      }
//      else{
//        for (var i = 0; i < _stuff.tabState.length; i++) {
//          console.log('in the non-empty tabState checker loop');
//          console.log(_stuff.tabState.length);
//          console.log(i);
//          if (_stuff.tabState[i].hack === key) {
//            console.log("tab is already open from before, don't add, break statement occurring");
//            break
//          }
//          else if(_stuff.tabState[i].hack !== key){
//            console.log('key isnt equal to the ith position, move onto the next value in tabState');
//            console.log(_stuff.tabState.length);
//            console.log(i);
//            if(i === _stuff.tabState.length - 1){
//              console.log('tabState didnt have this tab, tab is now open');
//              var blockTabsOpen = [];
//              lookupWhichTabToOpen(key);
//
//              //var updatedBlockTabsOpen = blockTabsOpen.concat(key);
//              console.log(lookupWhichTabToOpen(key));
//              console.log(blockTabsOpen);
//              _stuff.tabState = _stuff.tabState.concat(lookupWhichTabToOpen(key));
//            }
//          }
//        }
//        console.log('finished the tabState checker loop')
//      }
//    }
//    else{
//      console.log('tab is not open')
//    }
//  }
//
//  //console.log(blockTabsOpen);
//  //console.log(lookupWhichTabToOpen(key)); /* We've finished the loop, but it still seems that the variable 'key' from the loop still exists, and its the last value it was in the loop, 'configTab'! */
//  console.log(_stuff.tabState);
//
//  //blockTabsOpen = []; /* resetting blockTabsOpen for the next time a tab is opened
//  // Actually, no need since at the start of the function it is reset*/
//
//  //return updatedBlockTabsOpen;
//
//  selectBlockOnClick()
//
//};

//var possibleTabsToOpen = {
//  'redBlockTabOpen': function(){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.redBlockContent); /*not sure if blockTabsOpen will get passed through... :/*/
//    return updatedBlockTabsOpen
//  },
//  'blueBlockTabOpen': function(){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.blueBlockContent);
//    return updatedBlockTabsOpen
//  },
//  'greenBlockTabOpen': function(){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.greenBlockContent);
//    return updatedBlockTabsOpen
//  },
//  'favTabOpen': function(){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(favContent);
//    return updatedBlockTabsOpen
//  },
//  'configTabOpen': function(){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(configContent);
//    return updatedBlockTabsOpen
//  }
//};
//
//var appendToPossibleTabsToOpen = function(dispatchMarker){
//  possibleTabsToOpen[dispatchMarker] = function(){
//    var blockTabsOpen = [];
//    var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent[dispatchMarker]);
//    return updatedBlockTabsOpen
//  }
//};
//
//
//function lookupWhichTabToOpen(key){ /*hopefully it'll get passed the key from the loop fine when it gets called :P*/
///* perhaps pass blockTabsOpen to possibleTabsOpen somehow?*/
//  if(typeof possibleTabsToOpen[key] !== 'function'){
//    throw new Error('Invalid key');
//  }
//  console.log('deciding which tab to open lookup is working!');
//  return possibleTabsToOpen[key](key)
//}

//var removeTab = function(item){
//
//  var tabName = _stuff.tabState[item].hack;
//  console.log(tabName);
//  lookupRemoveTab(tabName); /* Again, switch statement replaced by the lookup function to allow adding more items after initial render*/
//  /* code for removing tabs*/
//  console.log(tabName);
//  var newTabs = _stuff.tabState;  /*setting up the current state of tabs, and then getting rid of the currently selected tab*/
//  newTabs.splice(item, 1);
//  _stuff.tabState = newTabs;
//};

//var possibleTabsToRemove = {
//  'redBlockTabOpen': function(){
//    allBlockTabProperties.redBlockTabOpen = false;
//    console.log(allBlockTabProperties.redBlockTabOpen);
//  },
//  'blueBlockTabOpen': function(){
//    allBlockTabProperties.blueBlockTabOpen = false;
//    console.log(allBlockTabProperties.blueBlockTabOpen);
//  },
//  'greenBlockTabOpen': function(){
//    allBlockTabProperties.greenBlockTabOpen = false;
//    console.log(allBlockTabProperties.greenBlockTabOpen);
//  },
//  'favTabOpen': function(){
//    allBlockTabProperties.favTabOpen = false;
//    console.log(allBlockTabProperties.favTabOpen);
//  },
//  'configTabOpen': function(){
//    allBlockTabProperties.configTabOpen = false;
//    console.log(allBlockTabProperties.configTabOpen);
//  }
//};
//
//var appendToPossibleTabsToRemove = function(dispatchMarker){
//  possibleTabsToRemove[dispatchMarker] = function(){
//    allBlockTabProperties[dispatchMarker] = false;
//    console.log(allBlockTabProperties[dispatchMarker]);
//  }
//};

//function lookupRemoveTab(item){
//  if(typeof possibleTabsToRemove[item] !== 'function'){
//    throw new Error('Invalid tab to remove')
//  }
//  console.log('remove tab lookup is working!');
//  return possibleTabsToRemove[item](item)
//}

//var possibleBlockCases = {
//  '.0.0.0.1.$tabb-0.$=1$0/=010.0.0.1': function(){
//    if(allBlockTabProperties.redBlockTabOpen === false) {
//      allBlockTabProperties.redBlockTabOpen = true;
//      checkWhichBlockTabsOpen();
//      console.log(_handles.passSidePane)
//    }
//    else{
//
//    }
//  },
//  '.0.0.0.1.$tabb-0.$=1$0/=010.0.0.2': function(){
//    if(allBlockTabProperties.blueBlockTabOpen === false){
//      allBlockTabProperties.blueBlockTabOpen = true;
//      checkWhichBlockTabsOpen()
//    }
//    else{
//
//    }
//  },
//  '.0.0.0.1.$tabb-0.$=1$0/=010.0.0.3': function(){
//    if(allBlockTabProperties.greenBlockTabOpen === false){
//      allBlockTabProperties.greenBlockTabOpen = true;
//      checkWhichBlockTabsOpen()
//    }
//    else{
//
//    }
//  }
//};
//
//var appendToPossibleBlockCases = function(dispatchMarker){ /*Hopefully this works... :P*/
//  //dispatchMarker = function () { I think this part was uneeded, I was just making it harder for myself!
//  possibleBlockCases[dispatchMarker] = function () {
//    if (allBlockTabProperties[dispatchMarker] === false) {
//      allBlockTabProperties[dispatchMarker] = true;
//      checkWhichBlockTabsOpen()
//    }
//    else {
//
//    }
//  };
//  console.log('appended to possibleBlockCases');
//  console.log(possibleBlockCases[dispatchMarker]);
//};

//function checkWhichBlockClicked(dispatchMarker){
//  if(typeof possibleBlockCases[dispatchMarker] !== 'function'){ /* need a better condition for an error :P*/
//    throw new Error('Invalid dispatch marker')
//  }
//  console.log('dispatch marker method lookup is working!!');
//  return possibleBlockCases[dispatchMarker](dispatchMarker);
//}

