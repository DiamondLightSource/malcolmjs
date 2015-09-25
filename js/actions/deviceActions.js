/**
 * Created by twi18192 on 24/09/15.
 */

var AppDispatcher = require('../dispatcher/appDispatcher');
var appConstants = require('../constants/appConstants');

var deviceActions = {
  mockServerRequest: function(item){
    AppDispatcher.handleAction({
      actionType: appConstants.MOCK_SERVERREQUEST,
      item: item
    })
  }

};

module.exports = deviceActions;
