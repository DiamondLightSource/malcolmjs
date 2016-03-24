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

      for(var i = 0; i < item.tags.length; i++){
        if(item.tags[i] === 'instance:Zebra2Visibility'){
          /* Save the list of all possible blocks */
          var zVisibility = JSON.parse(JSON.stringify(item));
          for(var attribute in zVisibility.attributes){
            if(zVisibility.attributes[attribute].tags !== undefined){
              var isBlockToggle = false;
              var doesBelongToGroup = false;

              for(var j = 0; j < zVisibility.attributes[attribute].tags.length; j++){
                if(zVisibility.attributes[attribute].tags[j].indexOf('widget:toggle') !== -1){
                  /* Then it's a block! */
                  //blocksVisibility.push(attribute);
                  isBlockToggle = true;
                }
                else if(zVisibility.attributes[attribute].tags[j].indexOf('group') !== -1){
                  doesBelongToGroup = true;
                }
              }

              if(isBlockToggle === true && doesBelongToGroup === true){
                blocksVisibility[attribute] = zVisibility.attributes[attribute];
              }
              else if(isBlockToggle === true && doesBelongToGroup !== true){
                /* It's a block that is the only instance of its
                 type, so add it to both blockGroups and
                 blocksVisibility, so then I can just check the length
                 of the array in the mapping of groups and group members
                 */
                blocksVisibility[attribute] = zVisibility.attributes[attribute];
                blockGroups.push(attribute);
              }
            }
            else if(zVisibility.attributes[attribute].tags === undefined &&
              zVisibility.attributes[attribute].descriptor === attribute){
              /* Then it's a group! */
              blockGroups.push(attribute);
            }
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
