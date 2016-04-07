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

      for(var i = 0; i < item.tags.length; i++){
        if(item.tags[i] === "instance:Zebra2Block") {

          /* Temporarily removing this condition to see
          whether or not allBlockATtributes should have
          all the blocks' attributes, even the not-visible
          ones, they'll instead simply be static and
          not subscribed to?
           */

          //if (item.attributes.VISIBLE.value === 'Show') {
            var blockName = JSON.parse(JSON.stringify(item.name.slice(2)));
            allBlockAttributes[blockName] = JSON.parse(JSON.stringify(item.attributes));
            console.log(allBlockAttributes);
          //}
        }
        //else if(item.tags[i] === "instance:Zebra2"){
        //  /* Save the list of all possible blocks */
        //  listOfAllPossibleBlocks = JSON.parse(JSON.stringify(item.attributes.blocks.value));
        //  /* Note that they all have 'Z:' in front of the block
        //  name in the array
        //   */
        //}
        //else if(item.tags[i] === 'instance:Zebra2Visibility'){
        //  /* Save the list of all possible blocks */
        //  var zVisibility = JSON.parse(JSON.stringify(item));
        //  for(var attribute in zVisibility.attributes){
        //    if(zVisibility.attributes[attribute].tags !== undefined){
        //      var isBlockToggle = false;
        //      var doesBelongToGroup = false;
        //
        //      for(var j = 0; j < zVisibility.attributes[attribute].tags.length; j++){
        //        if(zVisibility.attributes[attribute].tags[j].indexOf('widget:toggle') !== -1){
        //          /* Then it's a block! */
        //          //blocksVisibility.push(attribute);
        //          isBlockToggle = true;
        //        }
        //        else if(zVisibility.attributes[attribute].tags[j].indexOf('group') !== -1){
        //          doesBelongToGroup = true;
        //        }
        //      }
        //
        //      if(isBlockToggle === true && doesBelongToGroup === true){
        //        blocksVisibility[attribute] = zVisibility.attributes[attribute];
        //      }
        //      else if(isBlockToggle === true && doesBelongToGroup !== true){
        //        /* It's a block that is the only instance of its
        //        type, so add it to both blockGroups and
        //        blocksVisibility, so then I can just check the length
        //        of the array in the mapping of groups and group members
        //         */
        //        blocksVisibility[attribute] = zVisibility.attributes[attribute];
        //        blockGroups.push(attribute);
        //      }
        //    }
        //    else if(zVisibility.attributes[attribute].tags === undefined &&
        //      zVisibility.attributes[attribute].descriptor === attribute){
        //      /* Then it's a group! */
        //      blockGroups.push(attribute);
        //    }
        //  }
        //}
      }
      //console.log(blockGroups);
      //console.log(blocksVisibility);

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

        updateAttributeValue(requestedData.attribute, 'VISIBLE',
          responseMessage.value);

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
