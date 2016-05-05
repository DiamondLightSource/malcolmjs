/**
 * Created by twi18192 on 10/03/16.
 */

var AppDispatcher = require('../dispatcher/appDispatcher.js');
var appConstants = require('../constants/appConstants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('../../node_modules/object-assign/index.js');

var CHANGE_EVENT = 'change';

var update = require('../../node_modules/react').addons.update;

var allBlockAttributes = {

};

var allBlockAttributesIconStatus = {

};

function updateAttributeValue(blockId, attribute, newValue){
  //allBlockAttributes[blockId][attribute].value = newValue;

  /* Try using update to cause the reference to change! */

  var oldAttributes = allBlockAttributes;

  allBlockAttributes[blockId][attribute] = update(allBlockAttributes[blockId][attribute],
    {$merge : {value: newValue}});

  console.log(oldAttributes === allBlockAttributes);

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
  getAllBlockAttributesIconStatus: function(){
    return allBlockAttributesIconStatus;
  }

});

var blockStore = require('./blockStore');

attributeStore.dispatchToken = AppDispatcher.register(function(payload){
  var action = payload.action;
  var item = action.item;

  switch(action.actionType){

    case appConstants.MALCOLM_GET_SUCCESS:

      AppDispatcher.waitFor([blockStore.dispatchToken]);

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
          //}

          /* Try using allBlockAttributesIconStatus for widgetIconStatus */

          /* Add the block to allBlockAttributesIconStatus */
          allBlockAttributesIconStatus[blockName] = {};

          for(var attribute in allBlockAttributes[blockName]){
            allBlockAttributesIconStatus[blockName][attribute] = {
              value: 'success',
              message: null
            };
          }

        }
        /* Try saving blocksVisibility in allBlockAttributes, instead
        of using blockVisibleStore
         */
        else if(item.responseMessage.tags[i] === "instance:Zebra2Visibility"){

          var blockName = JSON.parse(JSON.stringify(item.responseMessage.name.slice(2)));
          allBlockAttributes[blockName] = JSON.parse(JSON.stringify(item.responseMessage.attributes));

          /* Try using allBlockAttributesIconStatus for widgetIconStatus */

          /* Add the block to allBlockAttributesIconStatus */
          allBlockAttributesIconStatus[blockName] = {};

          for(var attribute in allBlockAttributes[blockName]){
            allBlockAttributesIconStatus[blockName][attribute] = {
              value: 'success',
              message: null
            };
          }
        }
      }

      attributeStore.emitChange();
      break;

    case appConstants.MALCOLM_GET_FAILURE:
      console.log("MALCOLM GET ERROR!");

      /* Not sure what to do when a GET block failure occurs,
      it's not really related any specific widget is it?
       */

      attributeStore.emitChange();
      break;

    case appConstants.MALCOLM_SUBSCRIBE_SUCCESS:
      console.log("malcolmSubscribeSuccess in attributeStore");

      if(item.requestedData.blockName !== 'VISIBILITY') {
        var responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
        var requestedData = JSON.parse(JSON.stringify(item.requestedData));

        updateAttributeValue(requestedData.blockName,
          requestedData.attribute, responseMessage.value);
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

        /* UPDATE THE UPDATED UPDATE: right, so when I add a new block
        via VISIBILITY I don't actually subscribe to its attributes, it's
        only on refresh do I do that, hence the need to do this since not only
        does a block's visible attribute not update, but neither does any of
        them until the next refresh!
        So the solution is basically to have attribute subscription when a
        block is added/mounted
         */

        if(allBlockAttributes[requestedData.attribute].value !== responseMessage.value) {

          updateAttributeValue(requestedData.attribute, 'VISIBLE',
            responseMessage.value);

        }

        updateAttributeValue(requestedData.blockName,
          requestedData.attribute, responseMessage.value);
      }

      /* Update allBlockAttributesIconStatus appropriately */

      allBlockAttributesIconStatus[requestedData.blockName]
        [requestedData.attribute] = {
        value: 'success',
        message: null
      };
      attributeStore.emitChange();
      break;

    case appConstants.MALCOLM_SUBSCRIBE_FAILURE:
      console.log("malcolmSubscribeFailure in attributStore");

      var responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
      var requestedData = JSON.parse(JSON.stringify(item.requestedData));

      /* Update allBlockAttributesIconStatus appropriately */

      allBlockAttributesIconStatus[requestedData.blockName]
        [requestedData.attribute] = {
        value: 'failure',
        message: responseMessage
      };

      /* The responseMessage holds an error message, so perhaps
      that would be a useful thing to pass on somewhere?
       */

      attributeStore.emitChange();
      break;

    case appConstants.MALCOLM_CALL_SUCCESS:
      console.log("malcolmCallSuccess");

      /* No responseMessage is specified if it's a success */
      //var responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
      var requestedDataToWrite = JSON.parse(JSON.stringify(item.requestedDataToWrite));

      /* As we will receive the METHOD name in requestedDataToWrite,
      we need to get rid of the _set_ at the start of requestedDataToWrite.method
      string in order to update the corresponding attribute/widget properly
       */

      var attributeToUpdate = requestedDataToWrite.method.slice('_set_'.length);

      allBlockAttributesIconStatus[requestedDataToWrite.blockName]
        [attributeToUpdate] = {
        value: 'success',
        message: null
      };

      attributeStore.emitChange();
      break;

    case appConstants.MALCOLM_CALL_FAILURE:
      console.log("malcolmCallFailure");

      var responseMessage = JSON.parse(JSON.stringify(item.responseMessage));
      var requestedDataToWrite = JSON.parse(JSON.stringify(item.requestedDataToWrite));

      var attributeToUpdate = requestedDataToWrite.method.slice('_set_'.length);

      allBlockAttributesIconStatus[requestedDataToWrite.blockName]
        [attributeToUpdate] = {
        value: 'failure',
        message: responseMessage
      };

      attributeStore.emitChange();
      break;

    case appConstants.MALCOLM_CALL_PENDING:
      console.log('malcolmCallPending');

      var requestedDataToWrite = JSON.parse(JSON.stringify(item.requestedDataToWrite));

      var attributeToUpdate = requestedDataToWrite.method.slice('_set_'.length);

      allBlockAttributesIconStatus[requestedDataToWrite.blockName]
        [attributeToUpdate] = {
        value: 'pending',
        message: null
      };

      console.log(allBlockAttributesIconStatus[requestedDataToWrite.blockName]
        [attributeToUpdate]);

      attributeStore.emitChange();
      break;

    default:
      return true

  }

});

module.exports = attributeStore;
