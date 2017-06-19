/**
 * @module navbarActions
 * @author Ian Gillingham
 * @description Create standard dispatcher messages for the navbarStore to pick up and hence emit changes to listeners.
 */
/**
 * Created by Ian Gillingham on 19/05/17.
 */

import AppDispatcher from '../dispatcher/appDispatcher.js';
import appConstants  from '../constants/appConstants.js';

/**
 * @class NavbarEventInfo
 * @description A strongly typed message package for dispatcher handlers
 *
 */
export class NavbarEventInfo {
/**
 * @constructor
 * @param {string} eventName
 * @param {object} targetObject
 */
constructor(eventName, targetObject)
  {
  this.__eventName    = eventName;
  this.__targetObject = targetObject;
  }

get eventName()
  {
  return (this.__eventName);
  }

get tartgetObject()
  {
  return (this.__targetObject);
  }
}

/**
 * @class NavbarActions
 */
class NavbarActions {
/**
 * @constructor
 */
constructor()
  {

  }

/**
 * @methodOf NavbarActions
 * @param {NavbarEventInfo} item
 */
userClickedNavbarItem(item)
  {
  /**
   * Allow only strongly typed item references from view(s)
   */
  if (item instanceof NavbarEventInfo)
    {
    let action = {
      actionType: appConstants.NAVBAR_ACTION,
      item      : item
    };

    AppDispatcher.handleViewAction(action);
    }
  }

}

const navbarActions = new NavbarActions();

export default navbarActions;
