/**
 * Created by twi18192 on 17/09/15.
 */

let AppDispatcher = require('../dispatcher/appDispatcher');
let appConstants  = require('../constants/appConstants');
let EventEmitter  = require('events').EventEmitter;
let assign        = require('object-assign');
import blockCollection from '../classes/blockItems';

let CHANGE_EVENT = 'change';

import MalcolmUtils from '../utils/MalcolmUtils'
import malcolmProtocol from '../utils/malcolmProtocol'

let _stuff = {
  tabState           : [],
  selectedTabIndex   : 0,
  updatedBlockContent: null,
  blockTabState      : [],
  sidebarOpen        : false,
  //loadingInitialData: true,
  //loadingInitialDataError: false,
  modalDialogBoxOpen : false
};

let modalDialogBoxInfo = {
  blockName    : null,
  attributeName: null,
  message      : null
};

//let favContent = {
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

//let configContent = {
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

let dropdownMenuSelect = function (tab)
  {
  let findTheIndex = 0;
  console.log("dropdown menu select");
  console.log(tab);

  for (let i = 0; i < _stuff.tabState.length; i++)
    {
    console.log(_stuff.tabState[i]);
    if (_stuff.tabState[i].label === tab)
      {
      findTheIndex = i;
      }
    }

  _stuff.selectedTabIndex = findTheIndex;

  };

let deviceSelect       = function (tab)
  {
  let findTheIndex = 0;
  console.log("device select");
  console.log(tab);

  for (let i = 0; i < _stuff.tabState.length; i++)
    {
    console.log(_stuff.tabState[i]);
    if (_stuff.tabState[i].label === tab)
      {
      findTheIndex = i
      }
    }

  _stuff.selectedTabIndex = findTheIndex;

  };
let selectBlockOnClick = function ()
  {
  let tabStateLength = _stuff.tabState.length;

  _stuff.selectedTabIndex = tabStateLength - 1;

  };

let paneStore = assign({}, EventEmitter.prototype, {
  addChangeListener   : function (cb)
    {
    this.on(CHANGE_EVENT, cb)
    },
  removeChangeListener: function (cb)
    {
    this.removeListener(CHANGE_EVENT, cb)
    },
  emitChange          : function ()
    {
    this.emit(CHANGE_EVENT)
    },
  getTabState         : function ()
    {
    return _stuff.tabState;
    },
  getFavTabOpen       : function ()
    {
    return allBlockTabProperties.Favourites;
    },
  getConfigTabOpen    : function ()
    {
    return allBlockTabProperties.Configuration;
    },
  //getFavContent: function(){
  //  return favContent;
  //},
  //getConfigContent: function(){
  //  return configContent;
  //},
  getSelectedTabIndex : function ()
    {
    return _stuff.selectedTabIndex;
    },

  getSidebarOpenState: function ()
    {
    return _stuff.sidebarOpen;
    },

  getAllBlockTabOpenStates  : function ()
    {
    return allBlockTabProperties;
    },
  //getIfLoadingInitialData: function(){
  //  return _stuff.loadingInitialData;
  //},
  //getIfLoadingInitialDataError: function(){
  //  return _stuff.loadingInitialDataError;
  //},
  getModalDialogBoxOpenState: function ()
    {
    return _stuff.modalDialogBoxOpen;
    },
  getModalDialogBoxInfo     : function ()
    {
    return modalDialogBoxInfo;
    }
});

let attributeStore = require('./attributeStore');

paneStore.dispatchToken = AppDispatcher.register(function (payload)
{
let action = payload.action;
let item   = action.item;

//console.log(action);
//console.log(payload);
//console.log(item);

switch (action.actionType)
{

  case appConstants.DROPDOWN_SELECT:
    dropdownMenuSelect(item);
    paneStore.emitChange();
    break;

  case appConstants.DEVICE_SELECT:
    deviceSelect(item);
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
    removeBlockTab();
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
    let EdgeInfo = {
      edgeId       : item.edgeId,
      fromBlock    : item.fromBlock,
      fromBlockPort: item.fromBlockPort,
      toBlock      : item.toBlock,
      toBlockPort  : item.toBlockPort
    };
    setEdgeTabStateTrue(EdgeInfo);
    paneStore.emitChange();
    break;

  case appConstants.MODAL_DIALOG_BOX_OPEN:
    _stuff.modalDialogBoxOpen        = true;
    modalDialogBoxInfo.blockName     = item.blockName;
    modalDialogBoxInfo.attributeName = item.attributeName;
    modalDialogBoxInfo.message       = item.message;
    paneStore.emitChange();
    break;

  case appConstants.MODAL_DIALOG_BOX_CLOSE:
    _stuff.modalDialogBoxOpen        = false;
    modalDialogBoxInfo.blockName     = null;
    modalDialogBoxInfo.attributeName = null;
    modalDialogBoxInfo.message       = null;
    paneStore.emitChange();
    break;

  case appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
//  case appConstants.BLOCKS_UPDATED:
    {
    /**
     * item (from action.item) is an array of block indeces that have been updated.
     */
    console.log(`paneStore MALCOLM_SUBSCRIBE_SUCCESS callback: item = ${item}`);
    AppDispatcher.waitFor([blockCollection.dispatchToken]);

    let isWidgetCombo = false;
    let isGroupInputs = false;

    console.log("BLOCKS_UPDATED in paneStore");
    for (let i = 0; i < item.length; i++)
      {
      let index     = item[i];
      let blockItem = blockCollection.getBlockItem(index);
      if (blockItem != null)
        {
        let blockName = blockItem.blockName();
        appendToAllBlockTabProperties(blockName);

        /* Also need to check if the block has any edges too,
         so then I can append them to allEdgeTabProperties,
         meaning that their tabs will be openable after initial
         render
         */

        checkBlockForInitialEdges(blockItem);

        let attributes = blockItem.getAttributeNames();

        for (let i = 0; i < attributes.length; i++)
          {
          let attrname = attributes[i];
          let attr = blockItem.getAttribute(attrname);
          if (attr.hasOwnProperty("meta"))
            {
            for (let k = 0; k < attr.meta.tags.length; k++)
              {
              if (attr.meta.tags[k].indexOf('widget:combo') !== -1)
                {
                isWidgetCombo = true;
                }
              else if (attr.meta.tags[k].indexOf('group:Inputs') !== -1)
                {
                isGroupInputs = true;
                }
              else if (attr.meta.tags[k].indexOf('widget:toggle') !== -1)
                {

                /* Need to append to allBlockTabProperties when a block's
                 visibility is changed from Hide to Show, so then when a block
                 is added you can open its tab!
                 */

                if (blockItem.visible())
                  {
                  if (allBlockTabProperties[attr] === undefined)
                    {
                    appendToAllBlockTabProperties(attr);
                    }
                  paneStore.emitChange()
                  }
                /* This is for when a block's own VISIBLE attribute/toggle switch
                 is changed, rather than VISIBILITY's
                 */
                if (allBlockTabProperties[blockName] === undefined)
                  {
                  appendToAllBlockTabProperties(blockName);
                  }
                paneStore.emitChange();
                }

              // ------------------------------------------------------------------
              if (isWidgetCombo === true && isGroupInputs === true)
                {
                /* Then this is some info on edges, so we need
                 to append to the relevant objects in order to have
                 edge tabs
                 */

                if (attr.value !== 'BITS.ZERO' &&
                  attr.value !== 'POSITIONS.ZERO')
                  {

                  /* edgeLabelFirstHalf is the outport block and the
                   outport block port names put together
                   */
                  let edgeLabelFirstHalf = attr.value.replace(/\./g, "");

                  /* edgeLabelSecondHalf is the inport block and the
                   inport block port names put together
                   */
                  let edgeLabelSecondHalf = blockName + attr;
                  let edgeLabel           = edgeLabelFirstHalf + edgeLabelSecondHalf;

                  appendToAllEdgeTabProperties(edgeLabel);
                  }
                else if (attr.value === 'BITS.ZERO' ||
                  attr.value === 'POSITIONS.ZERO')
                  {

                  /* I know what inport and what inport block the edge was
                   connected to, but I don't know what outport or what
                   outport block the edge was connected to, since you
                   get the value to be BITS.ZERO or POSITIONS.ZERO instead
                   of what it was connected to before...
                   */

                  let edgeLabelToDelete;

                  let edgeLabelSecondHalf = blockName + attributes[i];

                  /* Inports can't be connected to more than one outport
                   at a time, so only one edge with edgeLabelSecondHalf in it
                   can exist at any given time, so I think I can search through
                   all the edges in allEdgeTabProperties and see if the
                   indexOf(edgeLabelSecondHalf) !== -1, then that should
                   be the edge that I want to delete
                   */

                  for (let edge in allEdgeTabProperties)
                    {
                    if (edge.indexOf(edgeLabelSecondHalf) !== -1)
                      {
                      edgeLabelToDelete = edge;
                      delete allEdgeTabProperties[edge];
                      }
                    }

                  console.log(allEdgeTabProperties);

                  /* Now need to remove the edge from tabState! */

                  function checkEdgeLabel(edgeTabObject)
                    {
                    return edgeTabObject.label !== edgeLabelToDelete;
                    }

                  for (let j = 0; j < _stuff.tabState.length; j++)
                    {
                    if (_stuff.tabState[j].label === edgeLabelToDelete)
                      {
                      /* Return a new array after removing the edge tab */
                      _stuff.tabState = _stuff.tabState.filter(checkEdgeLabel);
                      }
                    }

                  /* In the case of deleting the last tab in tabState */
                  if (_stuff.selectedTabIndex === _stuff.tabState.length)
                    {
                    _stuff.selectedTabIndex = _stuff.selectedTabIndex - 1;
                    }

                  console.log(_stuff.tabState);

                  }

                paneStore.emitChange();
                }
              } // for k
            } // if meta
          } // for i


        /* Hmm, I need to also remove the edge tab
         if I'm deleting the edge; ie, if the value of
         a subscription is BITS.ZERO or POSITIONS.ZERO
         */


        paneStore.emitChange();
        } // if blockItem != null

      } // for


    break;
    }

  case appConstants.MALCOLM_GET_SUCCESS:
    break;

  case appConstants.MALCOLM_CALL_SUCCESS:
    {
    let requestedDataToWrite = JSON.parse(JSON.stringify(item.requestedDataToWrite));

    //debugger; // <======= TODO

    let attributeToUpdate = requestedDataToWrite.method.slice('_set_'.length);

    if (modalDialogBoxInfo.blockName === requestedDataToWrite.blockName &&
      modalDialogBoxInfo.attributeName === attributeToUpdate)
      {
      modalDialogBoxInfo.message = null;
      paneStore.emitChange();
      }

    break;
    }

  case appConstants.MALCOLM_CALL_FAILURE:
    {
    let responseMessage      = JSON.parse(JSON.stringify(item.responseMessage));
    let requestedDataToWrite = JSON.parse(JSON.stringify(item.requestedDataToWrite));

    let attributeToUpdate = requestedDataToWrite.method.slice('_set_'.length);

    modalDialogBoxInfo.blockName     = requestedDataToWrite.blockName;
    modalDialogBoxInfo.attributeName = attributeToUpdate;
    modalDialogBoxInfo.message       = responseMessage;

    console.log(modalDialogBoxInfo);

    paneStore.emitChange();
    break;
    }

  default:
    return true
}
});

/* Importing a store into another store is the only way to use the dispatchToken of another store in order to use waitFor, so it must be ok! */

/* Importing nodeStore to begin connecting them together and to do an initial fetch of the node data */

let blockStore = require('./blockStore');

let allBlockTabProperties = {
  'Favourites'   : false,
  'Configuration': false,
  'VISIBILITY'   : false,
};

let allEdgeTabProperties = {};

function appendToAllEdgeTabProperties(EdgeId)
  {
  allEdgeTabProperties[EdgeId] = false;
  }

/**
 * appendToAllBlockTabProperties()
 * @param BlockId - Note that BlockID is a string copy of the Block Name.
 */
function appendToAllBlockTabProperties(BlockId)
  {
  allBlockTabProperties[BlockId] = false;
  }

/**
 *
 * @param {string} BlockId - Block name
 */
function setBlockTabStateTrue(BlockId)
  {
  console.log(allBlockTabProperties[BlockId]);
  if (allBlockTabProperties[BlockId] === false)
    {
    allBlockTabProperties[BlockId] = true;
    console.log(allBlockTabProperties);
    /* Now need to run the function to check which tabs should be open */
    /* UPDATE: Nope, now try just add the tab to _stuff.tabState! */

    /* Try giving an object to tabState, in which it'll
     have a 'tabType' specifying if it's a block tab or an
     edge tab, and then a 'label' specifying what should
     be the tab title
     */

    let blockTabStateObject = [{
      tabType: 'block',
      label  : BlockId
    }];

    _stuff.tabState = _stuff.tabState.concat(blockTabStateObject);

    /* Can run selectBlockOnClick now, since that tab wasn't open, so can jump staright to end tab */

    selectBlockOnClick();
    }
  else
    {
    dropdownMenuSelect(BlockId);
    }
  }

function setEdgeTabStateTrue(EdgeInfo)
  {

  console.log(allEdgeTabProperties);

  if (allEdgeTabProperties[EdgeInfo.edgeId] === false)
    {
    allEdgeTabProperties[EdgeInfo.edgeId] = true;

    let edgeTabStateObject = [{
      tabType      : 'edge',
      label        : EdgeInfo.edgeId,
      fromBlock    : EdgeInfo.fromBlock,
      fromBlockPort: EdgeInfo.fromBlockPort,
      toBlock      : EdgeInfo.toBlock,
      toBlockPort  : EdgeInfo.toBlockPort
    }];

    _stuff.tabState = _stuff.tabState.concat(edgeTabStateObject);

    selectBlockOnClick();

    }
  else
    {
    dropdownMenuSelect(EdgeInfo.edgeId);
    }
  }

function setFavTabStateTrue()
  {
  if (allBlockTabProperties['Favourites'] === false)
    {
    allBlockTabProperties['Favourites'] = true;

    let favTabStateObject = [{
      tabType: 'Favourites',
      label  : 'Favourites'
    }];

    _stuff.tabState = _stuff.tabState.concat(favTabStateObject);

    selectBlockOnClick()
    }
  else if (allBlockTabProperties['Favourites'] === true)
    {
    //console.log("fav tab was already open, so don't bother setting the state, jump to that tab instead!");

    dropdownMenuSelect("Favourites")
    }
  }

function setConfigTabStateTrue()
  {
  if (allBlockTabProperties['Configuration'] === false)
    {
    allBlockTabProperties['Configuration'] = true;

    let configTabStateObject = [{
      tabType: 'Configuration',
      label  : 'Configuration'
    }];

    _stuff.tabState = _stuff.tabState.concat(configTabStateObject);

    selectBlockOnClick();
    }
  else if (allBlockTabProperties['Configuration'] === true)
    {
    //console.log("config tab was already open, so don't bother setting the state, jump to that tab instead!");

    dropdownMenuSelect("Configuration");
    /* dropdownMenuSelect uses the label attribute rather than the object key name */
    }
  }

function setBlockLookupTableTabStateTrue()
  {
  if (allBlockTabProperties['VISIBILITY'] === false)
    {
    allBlockTabProperties['VISIBILITY'] = true;

    let blockLookupTableTabStateObject = [{
      tabType: 'VISIBILITY',
      label  : 'VISIBILITY'
    }];

    _stuff.tabState = _stuff.tabState.concat(blockLookupTableTabStateObject);

    selectBlockOnClick();
    }
  else if (allBlockTabProperties['VISIBILITY'] === true)
    {
    dropdownMenuSelect("VISIBILITY");
    }
  }

let removeBlockTab = function ()
  {

  let tabName = _stuff.tabState[_stuff.selectedTabIndex].label;

  /* Checking if it's an edge tab or a block tab */

  if (_stuff.tabState[_stuff.selectedTabIndex].tabType === 'edge')
    {
    allEdgeTabProperties[tabName] = false;
    }
  else
    {
    allBlockTabProperties[tabName] = false;
    /* Setting the state of the tab to be removed to be false */
    }

  /* Trying to return a new array when removing a tab */

  function checkTabLabel(tabObject)
    {
    return tabObject.label !== tabName;
    }

  _stuff.tabState = _stuff.tabState.filter(checkTabLabel);

  if (_stuff.selectedTabIndex === _stuff.tabState.length)
    {
    /* selectedTabIndex is now out of the range of _stuff.tabState
     since a tab has been removed, so we need to decrease
     _stuff.selectedTabIndex by 1
     */

    _stuff.selectedTabIndex = _stuff.selectedTabIndex - 1;

    }
  else if (0 < _stuff.selectedTabIndex && _stuff.selectedTabIndex < _stuff.tabState.length)
    {
    _stuff.selectedTabIndex = _stuff.selectedTabIndex - 1;
    }

  };

function toggleSidebar()
  {
  if (_stuff.sidebarOpen === true)
    {
    _stuff.sidebarOpen = false;
    }
  else if (_stuff.sidebarOpen === false)
    {
    _stuff.sidebarOpen = true;
    }
  }

function windowWidthMediaQueryChanged(sidebarOpen)
  {
  _stuff.sidebarOpen = sidebarOpen;
  }

function checkBlockForInitialEdges(blockItem)
  {
  let attributes = blockItem.getAttributeNames();

  for (let i = 0; i < attributes.length; i++)
    {
    let attrname = attributes[i];
    let attribute = blockItem.getAttribute(attrname);

    if ((attribute !== null) && (MalcolmUtils.hasOwnNestedProperties(attribute, 'meta', 'tags')))
      {
      for (let i = 0; i < attribute.meta.tags.length; i++)
        {
        // todo: meta.tags or tags.meta??
        if (attribute.meta.tags[i].indexOf('flowgraph:inport') !== -1)
          {
          if (attribute.value.indexOf('ZERO') === -1)
            {
            /* Then it's connected to another block via an edge! */

            let inportBlock     = blockItem.blockName();
            let inportBlockPort = attribute;

            let outportBlock     = attribute.value.slice(0, attribute.value.indexOf('.'));
            let outportBlockPort = attribute.value.slice(attribute.value.indexOf('.') + 1);

            let edgeLabel = outportBlock + outportBlockPort + inportBlock + inportBlockPort;

            appendToAllEdgeTabProperties(edgeLabel);

            }
          }
        }
      }
    }

  }

module.exports = paneStore;
