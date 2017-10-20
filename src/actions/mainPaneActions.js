/**
 * Created by twi18192 on 25/08/15.
 */

import AppDispatcher from '../dispatcher/appDispatcher.js';
import appConstants  from '../constants/appConstants.js';

class MainPaneActions {
  constructor()
    {

    }

  toggleFooter1(item){
    AppDispatcher.handleViewAction({
      actionType:appConstants.FOOTER_TOGGLE,
      item: item
    })
  }

  toggleConfigPanel(item){
    AppDispatcher.handleViewAction({
      actionType:appConstants.CONFIG_TOGGLE,
      item: item
    })
  }
  toggleFavPanel(item){
    AppDispatcher.handleViewAction({
      actionType: appConstants.FAV_TOGGLE,
      item: item
    })
  }
}

const mainPaneActions = new MainPaneActions();

export default mainPaneActions;
