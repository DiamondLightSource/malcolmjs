/**
 * Created by twi18192 on 30/09/15.
 */

/* Actions intended for communication from server to Client */

var AppDispatcher = require('../dispatcher/appDispatcher');
var appConstants = require('../constants/appConstants');

var serverActions = {
  passingUpdatedChannelValue: function(item){
    AppDispatcher.handleServerAction({
      actionType: appConstants.PASSUPDATEDCHANNEL_VALUE,
      item: item
    })
  },

  passingNameOfChannelThatsBeenAdded: function(item){
    AppDispatcher.handleServerAction({
      actionType: appConstants.PASSNAMEOFCHANNELTHATSBEEN_SUBSCRIBED,
      item:item
    })
  }

};

module.exports = serverActions;
