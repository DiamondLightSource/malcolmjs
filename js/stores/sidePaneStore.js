/**
 * Created by twi18192 on 01/09/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var appConstants = require('../constants/appConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _stuff = {
  //tabState: [],
  dropdownListVisible: false,
  //selectedTabIndex: 0
};

var dropdownMenuShow = function(){
  _stuff.dropdownListVisible = true;
  document.addEventListener("click", dropdownMenuHide)
};

var dropdownMenuHide = function(){
  _stuff.dropdownListVisible = false;
  //console.log("dropdown hide is doing something");
  //console.log(_stuff.dropdownListVisible);
  sidePaneStore.emitChange();
  document.removeEventListener("click", dropdownMenuHide)
};

//var allBlockContent = {
//  redBlockContent: {
//    name: "Red block",
//    hack: "redBlockTabOpen",
//    info: {height: "100 pixels", width: "100 pixels"}
//  },
//  blueBlockContent: {
//    name: "Blue block",
//    hack: "blueBlockTabOpen",
//    info: {height: "100 pixels", width: "100 pixels"}
//  },
//  greenBlockContent: {
//    name: "Green block",
//    hack: "greenBlockTabOpen",
//    info: {height: "100 pixels", width: "100 pixels"}
//  }
//};
//
//var allBlockTabProperties = {
//  redBlockTabOpen: false,
//  blueBlockTabOpen: false,
//  greenBlockTabOpen: false
//};

//var checkWhichBlockTabsOpen = function(){
//  var blockTabsOpen = []; /* fill this array with all the block tabs open, and then proceed to concatenate the original tab list with this one*/
//  for (var key in allBlockTabProperties){
//    console.log(key)
//    console.log(allBlockTabProperties[key]);
//    if(allBlockTabProperties[key] === true) {
//      console.log('just before starting the tabState checker loop');
//      if(_stuff.tabState.length === 0){
//        console.log('tabState was empty, tab is now open');
//        var blockTabsOpen = [];
//        switch(key){
//          case 'redBlockTabOpen':
//                var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.redBlockContent);
//                break;
//          case 'blueBlockTabOpen':
//                var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.blueBlockContent);
//                break;
//          case 'greenBlockTabOpen':
//                var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.greenBlockContent);
//                break;
//          default:
//                return 'default'
//        }
//        //var updatedBlockTabsOpen = blockTabsOpen.concat(key);
//        console.log(updatedBlockTabsOpen);
//        console.log(blockTabsOpen);
//        _stuff.tabState = _stuff.tabState.concat(updatedBlockTabsOpen);
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
//              switch(key){
//                case 'redBlockTabOpen':
//                  var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.redBlockContent);
//                  break;
//                case 'blueBlockTabOpen':
//                  var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.blueBlockContent);
//                  break;
//                case 'greenBlockTabOpen':
//                  var updatedBlockTabsOpen = blockTabsOpen.concat(allBlockContent.greenBlockContent);
//                  break;
//                default:
//                  return 'default'
//              }
//              //var updatedBlockTabsOpen = blockTabsOpen.concat(key);
//              console.log(updatedBlockTabsOpen);
//              console.log(blockTabsOpen);
//              _stuff.tabState = _stuff.tabState.concat(updatedBlockTabsOpen);
//            }
//          }
//        }
//        console.log('finished the tabState checker loop')
//      }
//    }
//    else{
//    console.log('tab is not open')
//    }
//  }
//
//  console.log(blockTabsOpen);
//  console.log(updatedBlockTabsOpen);
//  console.log(_stuff.tabState);
//
//  //blockTabsOpen = []; /* resetting blockTabsOpen for the next time a tab is opened
//  // Actually, no need since at the start of the function it is reset*/
//
//  //return updatedBlockTabsOpen;
//
//};

//var changeRedBlockTabState = function(){
//  if(allBlockTabProperties.redBlockTabOpen === false) {
//    allBlockTabProperties.redBlockTabOpen = true;
//    checkWhichBlockTabsOpen()
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







//var addTab = function(newtab){
//  /* set state of tabs somewhere here*/
//  var newTabs = _stuff.tabState.concat(newtab);
//  _stuff.tabState = newTabs;
//  /* could you just skip the variable newTabs and set _stuff.tabState equal
//  itself concatenated?
//   */
//};
//
//var removeTab = function(item){
//
//  var tabName = _stuff.tabState[item].hack;
//  switch(tabName){
//
//    case 'redBlockTabOpen':
//      allBlockTabProperties.redBlockTabOpen = false;
//      console.log(allBlockTabProperties.redBlockTabOpen);
//          break;
//
//    case 'blueBlockTabOpen':
//      allBlockTabProperties.blueBlockTabOpen = false;
//      console.log(allBlockTabProperties.blueBlockTabOpen);
//          break;
//
//    case 'greenBlockTabOpen':
//      allBlockTabProperties.greenBlockTabOpen = false;
//      console.log(allBlockTabProperties.greenBlockTabOpen);
//          break;
//
//    default:
//      console.log('default');
//      return 'default'
//  }
//  /* code for removing tabs*/
//  console.log(tabName);
//  var newTabs = _stuff.tabState;  /*setting up the current state of tabs, and then getting rid of the currently selected tab*/
//  newTabs.splice(item, 1);
//  _stuff.tabState = newTabs;
//};









//var dropdownMenuSelect = function(tab, ReactComponent){
//  //var findTheIndex = _stuff.tabState.indexOf(item);
//  ////this.props.changeTab(findTheIndex)
//  //_stuff.selectedTabIndex = findTheIndex;
//
//  var test = tab;
//  console.log(tab);
//  console.log(ReactComponent);
//  //var keepingSidePane = ReactComponent;
//  //keepSidePane(ReactComponent);
//  //console.log(keepingSidePane);
//
//  for(var i = 0; i < _stuff.tabState.length; i++){
//    if(_stuff.tabState[i].name === tab){
//      var findTheIndex = i
//    }
//  }
//  //
//  //var findTheIndex = this.props.list.indexOf(item);
//  ReactComponent.refs.panel.setSelectedIndex(findTheIndex);
//  //keepSidePane(ReactComponent)
//};

//var keepSidePane = function(testSidePane){ /*Ok, this saves 'SidePane' how I want it, so I can refer to it via this.refs.panel to use the select tab function*/
//  console.log('alternative select function is running');
//  console.log(testSidePane);               /* Not sure if/how this'll actually work, since it relies on dropdownMenuSelect running first? */
//  return testSidePane
//};
//
//var switchTabWhenTabOpens = function(tab){
//  var passedComponent = passedSidePane;
//  console.log(passedComponent);
//  console.log(tab);
//
//  for(var i = 0; i < _stuff.tabState.length; i++){
//    if(_stuff.tabState[i].name === tab){
//      var findTheIndex = i
//    }
//  }
//  passedComponent.refs.panel.setSelectedIndex(findTheIndex);
//};
//
//var passSidePane = function(component){
//  var passedComponent = {component: component}
//};




var sidePaneStore = assign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb)
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb)
  },
  emitChange: function(){
    this.emit(CHANGE_EVENT)
  },
  getDropdownState: function(){
    return _stuff.dropdownListVisible;
  }


  //getTabState: function(){
  //  return _stuff.tabState;
  //},
  //getCalculateTabs: function(){
  //  calculateTabs()
  //},
  //getSelectedTabIndex: function(){
  //  return _stuff.selectedTabIndex;
  //},
  //getRedBlockTabClicked: function(){
  //  return allBlockTabProperties.redBlockTabOpen;
  //},
  //getBlueBlockTabClicked: function(){
  //  return allBlockTabProperties.blueBlockTabOpen;
  //},
  //getGreenBlockTabClicked: function(){
  //  return allBlockTabProperties.greenBlockTabOpen;
  //},
});

AppDispatcher.register(function(payload){
  var action = payload.action;
  var item = action.item;
  switch(action.actionType){

    case appConstants.DROPDOWN_SHOW:
      console.log(payload);
      console.log(action);
      dropdownMenuShow();
      sidePaneStore.emitChange();
      console.log(_stuff.dropdownListVisible);
      break;

    case appConstants.DROPDOWN_HIDE:
      console.log(payload);
      console.log(action);
      dropdownMenuHide();
      sidePaneStore.emitChange();
      console.log(_stuff.dropdownListVisible);
      break;

    //case appConstants.ADD_TAB:
    //  console.log(payload);
    //  console.log(action);
    //      addTab(item);
    //      sidePaneStore.emitChange();
    //  console.log(_stuff.tabState);
    //      break;
    //
    //case appConstants.REMOVE_TAB:
    //  console.log(payload);
    //  console.log(action);
    //  console.log(item);
    //      removeTab(item);
    //      sidePaneStore.emitChange();
    //  console.log(_stuff.tabState);
    //  console.log(allBlockTabProperties.redBlockTabOpen);
    //      break;



    //case appConstants.DROPDOWN_SELECT:
    //  var tab = item.item;
    //  var component = item.component;
    //
    //  console.log(payload);
    //  console.log(action); /* this tells you what the name of the selected tab is, for debugging purposes*/
    //      dropdownMenuSelect(tab, component);
    //      sidePaneStore.emitChange();
    //      break;

    //case appConstants.REDBLOCKTAB_OPEN:
    //  console.log(payload);
    //  console.log(action);
    //      changeRedBlockTabState();
    //  console.log(allBlockTabProperties.redBlockTabOpen);
    //      //checkWhichBlockTabsOpen();
    //      sidePaneStore.emitChange();
    //      break;
    //
    //case appConstants.BLUEBLOCKTAB_OPEN:
    //  console.log(payload);
    //  console.log(action);
    //      changeBlueBlockTabState();
    //  console.log(allBlockTabProperties.blueBlockTabOpen);
    //      sidePaneStore.emitChange();
    //      break;
    //
    //case appConstants.GREENBLOCKTAB_OPEN:
    //  console.log(payload);
    //  console.log(action);
    //      changeGreenBlockTabState();
    //  console.log(allBlockTabProperties.greenBlockTabOpen);
    //      sidePaneStore.emitChange();
    //      break;

    //case appConstants.SWITCHTAB_WHENTABOPENS:
    //  console.log(payload);
    //  console.log(action);
    //      switchTabWhenTabOpens(item);
    //      sidePaneStore.emitChange();
    //      break;

    //case appConstants.PASSING_SIDEPANE:
    //  console.log(payload);
    //  console.log(item);
    //  var passedSidePane = item;
    //  return passedSidePane;
    //      sidePaneStore.emitChange();
    //      break;

    //case appConstants.REACTPANEL_SELECT:
    //      break;

    //case appConstants.REDBLOCKSTATE_CHANGE:
    //  console.log(payload);
    //  console.log(action);
    //      changeRedBlockTabState();
    //      sidePaneStore.emitChange();
    //      break;

    default:
          return true;
  }
});

module.exports = sidePaneStore;


//var reactPanelSelect = function(){
//  /* need this to somehow invoke the dropdownmenuchange function in SidePane! */
//};


//var calculateTabs = function(){
//  var tabs = _stuff.tabState.map(function(item, i){
//    var tabTitle = "Tab " + item;
//    var tabIndex = i + 1;
//  })
//};


