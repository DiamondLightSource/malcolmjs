/**
 * Created by twi18192 on 24/03/16.
 */

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var appConstants = require('../constants/appConstants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('../../node_modules/object-assign/index.js');

var CHANGE_EVENT = 'change';

var blocksVisibility = {};
var blockGroups = [];

function updateBlockVisibility(blockId, newValue){
  blocksVisibility[blockId].value = newValue;
}

var blocksVisibleStore = assign({}, EventEmitter.prototype, {

  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb)
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb)
  },
  emitChange: function(){
    this.emit(CHANGE_EVENT)
  },
  getBlockGroups: function(){
    return blockGroups;
  },
  getBlocksVisibility: function(){
    return blocksVisibility;
  }

});

blocksVisibleStore.dispatchToken = AppDispatcher.register(function(payload){

  var action = payload.action;
  var item = action.item;

  switch(action.actionType){

    case appConstants.MALCOLM_GET_SUCCESS:

      /* Not sorting the attributes into groups and just
      passing a whole object of the attributes like I did
      for normal block tabs, groups and all
       */

      for(var i = 0; i < item.responseMessage.tags.length; i++){
        if(item.responseMessage.tags[i] === 'instance:Zebra2Visibility'){

          var zVisibility = JSON.parse(JSON.stringify(item.responseMessage));

          for(var attribute in zVisibility.attributes){
            blocksVisibility[attribute] = zVisibility.attributes[attribute];
          }
        }
      }

      blocksVisibleStore.emitChange();
      break;

    case appConstants.MALCOLM_GET_FAILURE:
      console.log("MALCOLM GET ERROR!");
      blocksVisibleStore.emitChange();
      break;

    case appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
      console.log(blocksVisibility);
      if(item.requestedData.blockName === 'VISIBILITY') {
        var responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
        var requestedData = JSON.parse(JSON.stringify(item.requestedData));
        console.log(requestedData.blockName);
        updateBlockVisibility(requestedData.attribute, responseMessage.value);
        blocksVisibleStore.emitChange();
      }
      break;

    case appConstants.MALCOLM_SUBSCRIBE_FAILURE:
      console.log("malcolmSubscribeFailure in attributStore");
      blocksVisibleStore.emitChange();
      break;

    default:
      return true

  }

});

module.exports = blocksVisibleStore;
