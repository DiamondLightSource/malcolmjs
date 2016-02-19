/**
 * Created by twi18192 on 30/09/15.
 */

/* Actions intended for communication from server to Client */

var AppDispatcher = require('../dispatcher/appDispatcher');
var appConstants = require('../constants/appConstants');

//var paneActions = require('./paneActions');

var serverActions = {
  //passingUpdatedChannelValue: function(item){
  //  AppDispatcher.handleServerAction({
  //    actionType: appConstants.PASSUPDATEDCHANNEL_VALUE,
  //    item: item
  //  })
  //},
  //
  //passingNameOfChannelThatsBeenAdded: function(item){
  //  AppDispatcher.handleServerAction({
  //    actionType: appConstants.PASSNAMEOFCHANNELTHATSBEEN_SUBSCRIBED,
  //    item:item
  //  });
  //  //console.log('new block content has been transferred to MainPane, now invoking action to pass to paneStore');
  //  //paneActions.updatePaneStoreBlockContentViaDeviceStore(this.state.updatedRedBlockContentFromServer);
  //  //paneActions.updatePaneStoreBlockContentViaDeviceStore(this.state.updatedBlueBlockContentFromServer);
  //  //paneActions.updatePaneStoreBlockContentViaDeviceStore(this.state.updatedGreenBlockContentFromServer);
  //}

  testingWebsocket: function(item){
    AppDispatcher.handleServerAction({
      actionType: appConstants.TEST_WEBSOCKET,
      item: item
    })
  }

};

module.exports = serverActions;
