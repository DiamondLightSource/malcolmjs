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
};

var _handles = {
  passSidePane: null
};

var passSidePane = function(ReactComponent){ /* Testing to see if saving it in state would work, it did! :D*/
  console.log(ReactComponent);
  console.log(_handles.passSidePane);
  _handles.passSidePane = ReactComponent;
  console.log(_handles.passSidePane);

  //selectBlockOnClick(ReactComponent)
};

var allBlockContent = {
  redBlockContent: {
    name: "Red block",
    hack: "redBlockTabOpen",
    info: {height: "100 pixels", width: "100 pixels"}
  },
  blueBlockContent: {
    name: "Blue block",
    hack: "blueBlockTabOpen",
    info: {height: "100 pixels", width: "100 pixels"}
  },
  greenBlockContent: {
    name: "Green block",
    hack: "greenBlockTabOpen",
    info: {height: "100 pixels", width: "100 pixels"}
  }
};

var allBlockTabProperties = {
  redBlockTabOpen: false,
  blueBlockTabOpen: false,
  greenBlockTabOpen: false
};

var changeRedBlockTabState = function(){
  if(allBlockTabProperties.redBlockTabOpen === false) {
    allBlockTabProperties.redBlockTabOpen = true;
    checkWhichBlockTabsOpen();
    console.log(_handles.passSidePane)
  }
  else{

  }
};

var changeBlueBlockTabState = function(){
  if(allBlockTabProperties.blueBlockTabOpen === false){
    allBlockTabProperties.blueBlockTabOpen = true;
    checkWhichBlockTabsOpen()
  }
  else{

  }
};

var changeGreenBlockTabState = function(){
  if(allBlockTabProperties.greenBlockTabOpen === false){
    allBlockTabProperties.greenBlockTabOpen = true;
    checkWhichBlockTabsOpen()
  }
  else{

  }
};

var checkWhichBlockTabsOpen = function(){
  var blockTabsOpen = []; /* fill this array with all the block tabs open, and then proceed to concatenate the original tab list with this one*/
  for (var key in allBlockTabProperties){
    console.log(key)
    console.log(allBlockTabProperties[key]);
    if(allBlockTabProperties[key] === true) {
      console.log('just before starting the tabState checker loop');
      if(_stuff.tabState.length === 0){
        console.log('tabState was empty, tab is now open');
        var blockTabsOpen = [];
        switch(key){
          case 'redBlockTabOpen':
            var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.redBlockContent);
            break;
          case 'blueBlockTabOpen':
            var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.blueBlockContent);
            break;
          case 'greenBlockTabOpen':
            var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.greenBlockContent);
            break;
          default:
            return 'default'
        }
        //var updatedBlockTabsOpen = blockTabsOpen.concat(key);
        console.log(updatedBlockTabsOpen);
        console.log(blockTabsOpen);
        _stuff.tabState = _stuff.tabState.concat(updatedBlockTabsOpen);
      }
      else{
        for (var i = 0; i < _stuff.tabState.length; i++) {
          console.log('in the non-empty tabState checker loop');
          console.log(_stuff.tabState.length);
          console.log(i);
          if (_stuff.tabState[i].hack === key) {
            console.log("tab is already open from before, don't add, break statement occurring");
            break
          }
          else if(_stuff.tabState[i].hack !== key){
            console.log('key isnt equal to the ith position, move onto the next value in tabState');
            console.log(_stuff.tabState.length);
            console.log(i);
            if(i === _stuff.tabState.length - 1){
              console.log('tabState didnt have this tab, tab is now open');
              var blockTabsOpen = [];
              switch(key){
                case 'redBlockTabOpen':
                  var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.redBlockContent);
                  break;
                case 'blueBlockTabOpen':
                  var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.blueBlockContent);
                  break;
                case 'greenBlockTabOpen':
                  var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.greenBlockContent);
                  break;
                default:
                  return 'default'
              }
              //var updatedBlockTabsOpen = blockTabsOpen.concat(key);
              console.log(updatedBlockTabsOpen);
              console.log(blockTabsOpen);
              _stuff.tabState = _stuff.tabState.concat(updatedBlockTabsOpen);
            }
          }
        }
        console.log('finished the tabState checker loop')
      }
    }
    else{
      console.log('tab is not open')
    }
  }

  console.log(blockTabsOpen);
  console.log(updatedBlockTabsOpen);
  console.log(_stuff.tabState);

  //blockTabsOpen = []; /* resetting blockTabsOpen for the next time a tab is opened
  // Actually, no need since at the start of the function it is reset*/

  //return updatedBlockTabsOpen;

  selectBlockOnClick()

};



var addTab = function(newtab){
  /* set state of tabs somewhere here*/
  var newTabs = _stuff.tabState.concat(newtab);
  _stuff.tabState = newTabs;
  /* could you just skip the variable newTabs and set _stuff.tabState equal
   itself concatenated?
   */
};

var removeTab = function(item){

  var tabName = _stuff.tabState[item].hack;
  switch(tabName){

    case 'redBlockTabOpen':
      allBlockTabProperties.redBlockTabOpen = false;
      console.log(allBlockTabProperties.redBlockTabOpen);
      break;

    case 'blueBlockTabOpen':
      allBlockTabProperties.blueBlockTabOpen = false;
      console.log(allBlockTabProperties.blueBlockTabOpen);
      break;

    case 'greenBlockTabOpen':
      allBlockTabProperties.greenBlockTabOpen = false;
      console.log(allBlockTabProperties.greenBlockTabOpen);
      break;

    default:
      console.log('default');
      return 'default'
  }
  /* code for removing tabs*/
  console.log(tabName);
  var newTabs = _stuff.tabState;  /*setting up the current state of tabs, and then getting rid of the currently selected tab*/
  newTabs.splice(item, 1);
  _stuff.tabState = newTabs;
};



var dropdownMenuSelect = function(tab){
  //var findTheIndex = _stuff.tabState.indexOf(item);
  ////this.props.changeTab(findTheIndex)
  //_stuff.selectedTabIndex = findTheIndex;

  var test = tab;
  console.log(tab);
  console.log(_handles.passSidePane);
  //var keepingSidePane = ReactComponent;
  //keepSidePane(ReactComponent);
  //console.log(keepingSidePane);

  for(var i = 0; i < _stuff.tabState.length; i++){
    if(_stuff.tabState[i].name === tab){
      var findTheIndex = i
    }
  }
  //
  //var findTheIndex = this.props.list.indexOf(item);
  _handles.passSidePane.refs.panel.setSelectedIndex(findTheIndex);
  //keepSidePane(ReactComponent)
};

var selectBlockOnClick = function(){
  console.log(_handles.passSidePane);
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
  getRedBlockTabClicked: function(){
    return allBlockTabProperties.redBlockTabOpen;
  },
  getBlueBlockTabClicked: function(){
    return allBlockTabProperties.blueBlockTabOpen;
  },
  getGreenBlockTabClicked: function(){
    return allBlockTabProperties.greenBlockTabOpen;
  },
  getSelectedTabIndex: function(){
    return _stuff.selectedTabIndex;
  }
});



AppDispatcher.register(function(payload){
  var action = payload.action;
  var item = action.item;
  switch(action.actionType){

    case appConstants.PASS_SIDEPANE:
      console.log(payload);
      console.log(action);
      console.log(item);
      passSidePane(item);
          break;

    case appConstants.ADD_TAB:
      console.log(payload);
      console.log(action);
      addTab(item);
      paneStore.emitChange();
      console.log(_stuff.tabState);
      break;

    case appConstants.REMOVE_TAB:
      console.log(payload);
      console.log(action);
      console.log(item);
      removeTab(item);
      paneStore.emitChange();
      console.log(_stuff.tabState);
      console.log(allBlockTabProperties.redBlockTabOpen);
      break;

    case appConstants.REDBLOCKTAB_OPEN:
      console.log(payload);
      console.log(action);
      changeRedBlockTabState();
      console.log(allBlockTabProperties.redBlockTabOpen);
      //checkWhichBlockTabsOpen();
      paneStore.emitChange();
      break;

    case appConstants.BLUEBLOCKTAB_OPEN:
      console.log(payload);
      console.log(action);
      changeBlueBlockTabState();
      console.log(allBlockTabProperties.blueBlockTabOpen);
      paneStore.emitChange();
      break;

    case appConstants.GREENBLOCKTAB_OPEN:
      console.log(payload);
      console.log(action);
      changeGreenBlockTabState();
      console.log(allBlockTabProperties.greenBlockTabOpen);
      paneStore.emitChange();
      break;

    case appConstants.DROPDOWN_SELECT:
      //var tab = item.item;
      //var component = item.component;

      console.log(payload);
      console.log(action); /* this tells you what the name of the selected tab is, for debugging purposes*/
      dropdownMenuSelect(item);
      paneStore.emitChange();
      break;

    default:
          return true
  }
});

module.exports = paneStore;
