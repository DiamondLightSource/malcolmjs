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
  },

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

      for(var i = 0; i < item.responseMessage.tags.length; i++){
        if(item.responseMessage.tags[i] === "instance:Zebra2Block") {

          /* Temporarily removing this condition to see
          whether or not allBlockATtributes should have
          all the blocks' attributes, even the not-visible
          ones, they'll instead simply be static and
          not subscribed to?
           */

          //if (item.attributes.VISIBLE.value === 'Show') {
            var blockName = JSON.parse(JSON.stringify(item.responseMessage.name.slice(2)));
            allBlockAttributes[blockName] = JSON.parse(JSON.stringify(item.responseMessage.attributes));
            console.log(allBlockAttributes);
          //}
        }
        /* Try saving blocksVisibility in allBlockAttributes, instead
        of using blockVisibleStore
         */
        else if(item.responseMessage.tags[i] === "instance:Zebra2Visibility"){

          var blockName = JSON.parse(JSON.stringify(item.responseMessage.name.slice(2)));
          allBlockAttributes[blockName] = JSON.parse(JSON.stringify(item.responseMessage.attributes));
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

      if(item.requestedData.blockName !== 'VISIBILITY') {
        var responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
        var requestedData = JSON.parse(JSON.stringify(item.requestedData));

        updateAttributeValue(requestedData.blockName,
          requestedData.attribute, responseMessage.value);

        attributeStore.emitChange();
      }
      /* This is for when a block has been changed from
      hide to show for the first time via the block palette
      so the GUI isn't yet subscribed to any of the blocks'
      attributes (or at least something along those lines)
       */
      else if(item.requestedData.blockName === 'VISIBILITY'){
        var responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
        var requestedData = JSON.parse(JSON.stringify(item.requestedData));

        /* UPDATE: so this works and the toggle switches stay in sync,
        but I'm pretty sure I'm doing more updates than I need; I think
        what's happening is that every time VISIBILITY changes a blocks'
        visible status, the individual block attribute for its tab is being
        updated at the same time as the overall master block.
        It works for now, so keep it, but don't forget about this either!
         */

        /* UPDATED UPDATE: actually, if one changes, the server knows to
        change the other, so I'll receive a subscribe message from both,
        so I don't think it's any more complicated than simply updating
        what attributes I'm given! (So I think I can even get rid of
        this else if statement and simply have updateAttributeValue being
        invoked for ALL malcolmSubscribes that come to attributeStore)
         */

        //updateAttributeValue(requestedData.attribute, 'VISIBLE',
        //  responseMessage.value);

        updateAttributeValue(requestedData.blockName,
          requestedData.attribute, responseMessage.value);

        attributeStore.emitChange();

      }
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
