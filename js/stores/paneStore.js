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
  /* Note that 'tab' is the nodeId, not the React element or anything like that */

  console.log("dropdown menu select");
  console.log(tab);

  for(var i = 0; i < _stuff.tabState.length; i++){
    console.log(_stuff.tabState[i]);
    if(_stuff.tabState[i].label === tab){              /* Changed from .name to .label */
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

    case appConstants.BLOCKLOOKUPTABLETAB_OPEN:
      setBlockLookupTableTabStateTrue();
      paneStore.emitChange();
      break;

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

    /* WebAPI use */

    case appConstants.MALCOLM_GET_SUCCESS:
      //AppDispatcher.waitFor([blockStore.dispatchToken]);
      //for(var block in item){
      //  appendToBlockPositions(block);
      //  appendToBlockSelectedStates(block);
      //}
      //appendToBlockPositions('CLOCKS');
      //appendToBlockSelectedStates('CLOCKS');

      /* No need to check the tags for if it's FlowGraph */
      for(var j = 0; j < item.responseMessage.tags.length; j++){
        console.log("one time round in the loop");
        //if(item.tags[j] === 'instance:FlowGraph'){
        //}
        if(item.responseMessage.tags[j] === 'instance:Zebra2Block'){

          if(item.responseMessage.attributes.VISIBLE.value === 'Show') {

            var blockName = JSON.parse(JSON.stringify(item.responseMessage.name.slice(2)));
            appendToAllBlockTabProperties(blockName);
          }
          else{
            var blockName = JSON.parse(JSON.stringify(item.responseMessage.name.slice(2)));
            appendToAllBlockTabProperties(blockName);
            console.log("block isn't in use, don't add its info");

          }

        }
      }

      paneStore.emitChange();
      break;

    case appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
      console.log("malcolmSubscribeSuccess in paneStore");
      var isWidgetCombo = false;
      var isGroupInputs = false;
      for(var k =0; k < item.responseMessage.tags.length; k++){
        if(item.responseMessage.tags[k].indexOf('widget:combo') !== -1){
          isWidgetCombo = true;
        }
        else if(item.responseMessage.tags[k].indexOf('group:Inputs') !== -1){
          isGroupInputs = true;
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

          for(var j = 0; j < _stuff.tabState.length; j++){
            if(_stuff.tabState[j].label === edgeLabelToDelete){
              var newTabs = _stuff.tabState;
              newTabs.splice(j, 1);
              _stuff.tabState = newTabs;
            }
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

var allBlockTabInfo;

var allBlockTabProperties = {
  'Favourites': false,
  'Configuration': false,
  'BlockLookupTable': false,
};

var allEdgeTabProperties = {};

function appendToAllEdgeTabProperties(EdgeId){
  allEdgeTabProperties[EdgeId] = false;
}

function appendToAllBlockTabProperties(BlockId){
  allBlockTabProperties[BlockId] = false;
}

function setBlockTabStateTrue(BlockId){
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

    var blockTabStateObject = {
      tabType: 'block',
      label: BlockId
    };

    _stuff.tabState.push(blockTabStateObject);

    /* Can run selectBlockOnClick now, since that tab wasn't open, so can jump staright to end tab */

    selectBlockOnClick();
 }
  else{
    //console.log("tab state was already true, so don't bother changing it to true");
    /* Need to have the tab jump to the newly selected node, instead of just jumping to the end tab */
    /* Could try using dropdownMenuSelect? */

    dropdownMenuSelect(BlockId);
  }
}

function setEdgeTabStateTrue(EdgeInfo){

  if(allEdgeTabProperties[EdgeInfo.edgeId] === false){
    allEdgeTabProperties[EdgeInfo.edgeId] = true;

    var edgeTabStateObject = {
      tabType: 'edge',
      label: EdgeInfo.edgeId,
      fromBlock: EdgeInfo.fromBlock,
      fromBlockPort: EdgeInfo.fromBlockPort,
      toBlock: EdgeInfo.toBlock,
      toBlockPort: EdgeInfo.toBlockPort
    };

    _stuff.tabState.push(edgeTabStateObject);

    selectBlockOnClick();

  }
  else{
    dropdownMenuSelect(EdgeInfo.edgeId);
  }
}

function setFavTabStateTrue(){
 if(allBlockTabProperties['Favourites'] === false){
   allBlockTabProperties['Favourites'] = true;

   var favTabStateObject = {
     tabType: 'Favourites',
     label: 'Favourites'
   };

   _stuff.tabState.push(favTabStateObject);

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

    var configTabStateObject = {
      tabType: 'Configuration',
      label: 'Configuration'
    };

    _stuff.tabState.push(configTabStateObject);

    selectBlockOnClick();
  }
  else if(allBlockTabProperties['Configuration'] === true){
    //console.log("config tab was already open, so don't bother setting the state, jump to that tab instead!");

    dropdownMenuSelect("Configuration");
    /* dropdownMenuSelect uses the label attribute rather than the object key name */
  }
}

function setBlockLookupTableTabStateTrue(){
  if(allBlockTabProperties['BlockLookupTable'] === false){
    allBlockTabProperties['BlockLookupTable'] = true;

    var blockLookupTableTabStateObject = {
      tabType: 'BlockLookupTable',
      label: 'BlockLookupTable'
    };

    _stuff.tabState.push(blockLookupTableTabStateObject);

    selectBlockOnClick();
  }
  else if(allBlockTabProperties['BlockLookupTable'] === true){
    dropdownMenuSelect("BlockLookupTable");
  }
}

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

//function createObjectForEdgeTabContent(EdgeInfo){
//  var edgeLabel = String(EdgeInfo.fromBlock) + String(EdgeInfo.fromBlockPort) + String(EdgeInfo.toBlock) + String(EdgeInfo.toBlockPort);
//  var edgeTabObject = {
//    'tabType': 'edge',
//    'label': edgeLabel,
//    'edgeId': edgeLabel
//  };
//  //for(var i = 0; i < allBlockTabInfo[EdgeInfo.fromBlock].outports.length; i++){
//  //  if(allBlockTabInfo[EdgeInfo.fromBlock].outports[i].name === EdgeInfo.fromBlockPort){
//  //    edgeTabObject[EdgeInfo.fromBlock] = (JSON.parse(JSON.stringify(allBlockTabInfo[EdgeInfo.fromBlock].outports[i])));
//  //  }
//  //}
//  //
//  //for(var j = 0; j < allBlockTabInfo[EdgeInfo.toBlock].inports.length; j++){
//  //  if(allBlockTabInfo[EdgeInfo.toBlock].inports[j].name === EdgeInfo.toBlockPort){
//  //    edgeTabObject[EdgeInfo.toBlock] = (JSON.parse(JSON.stringify(allBlockTabInfo[EdgeInfo.toBlock].inports[j])));
//  //  }
//  //}
//
//  assign(edgeTabObject, EdgeInfo);
//
//  _stuff.tabState.push(edgeTabObject);
//  console.log(_stuff.tabState);
//}


module.exports = paneStore;
