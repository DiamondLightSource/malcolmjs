/**
 * Created by twi18192 on 10/03/16.
 */

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var appConstants = require('../constants/appConstants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('../../node_modules/object-assign/index.js');

var CHANGE_EVENT = 'change';

var allBlockAttributes = {

};

function updateAttributeValue(blockId, attribute, newValue){
  allBlockAttributes[blockId][attribute].value = newValue;
  console.log(newValue);
}

var attributeStore = assign({}, EventEmitter.prototype, {

  addChangeListener: function(cb){
    this.on(CHANGE_EVENT, cb)
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE_EVENT, cb)
  },
  emitChange: function(){
    this.emit(CHANGE_EVENT)
  },
  getAllBlockAttributes: function(){
    return allBlockAttributes;
  }

});

var blockStore = require('./blockStore');

attributeStore.dispatchToken = AppDispatcher.register(function(payload){
  var action = payload.action;
  var item = action.item;

  switch(action.actionType){

    case appConstants.MALCOLM_GET_SUCCESS:

      AppDispatcher.waitFor([blockStore.dispatchToken]);

      //window.alert("shfi");
      console.log("hfoiuhawoioFIFIF");

      console.log(item);

      for(var i = 0; i < item.tags.length; i++){
        if(item.tags[i] === "instance:Zebra2Block"){
          var blockName = JSON.parse(JSON.stringify(item.name.slice(2)));
          allBlockAttributes[blockName] = JSON.parse(JSON.stringify(item.attributes));
          console.log(allBlockAttributes);
        }
      }

      attributeStore.emitChange();
      break;

    case appConstants.MALCOLM_GET_FAILURE:
      console.log("MALCOLM GET ERROR!");
      attributeStore.emitChange();
      break;

    case appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
      console.log("malcolmSubscribeSuccess in attributeStore");
      console.log(item);

      var responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
      var requestedData = JSON.parse(JSON.stringify(item.requestedData));

      updateAttributeValue(requestedData.blockName,
      requestedData.attribute, responseMessage.value);

      attributeStore.emitChange();
      break;

    case appConstants.MALCOLM_SUBSCRIBE_FAILURE:
      console.log("malcolmSubscribeFailure in attributStore");
      attributeStore.emitChange();
      break;

    default:
      return true

  }

});

module.exports = attributeStore;
