/**
 * Created by Ian Gillingham 29 August 2017.
 */

import AppDispatcher from '../dispatcher/appDispatcher';
import appConstants from '../constants/appConstants';

let optionsActions = {

  GraphicsStyleSelect: function(gstyle){
    AppDispatcher.handleViewAction({
      actionType: appConstants.OPTIONS_ACTION_GSTYLE,
      item:gstyle
    })
  },
  RightPanePinnedSelect: function(rightPinned){
    AppDispatcher.handleViewAction({
      actionType: appConstants.OPTIONS_ACTION_RIGHT_PINNED,
      item: rightPinned
    })
  }
};

export default optionsActions;
